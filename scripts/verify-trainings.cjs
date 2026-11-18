require('dotenv').config({ quiet: true });
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const ts = require('typescript');
const sharp = require('sharp');
const { Client } = require('pg');
const base = process.env.TEST_BASE_URL || 'http://localhost:3100';
const token = crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(process.env.ADMIN_PASSWORD).digest('hex');
const headers = { cookie: `fenix_admin=${token}`, origin: base };
const decode = s => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
async function editor(url) {
  const response = await fetch(base + url, { headers }); assert.equal(response.status, 200);
  const html = await response.text();
  const source = [...html.matchAll(/<form\b[\s\S]*?<\/form>/g)].find(m => m[0].includes('name="content"'))?.[0]; assert.ok(source, 'Editor form exists');
  const form = new FormData();
  for (const input of source.matchAll(/<input\b[^>]*>/g)) {
    const attributes = Object.fromEntries([...input[0].matchAll(/([\w:$-]+)="([^"]*)"/g)].map(m => [m[1], decode(m[2])]));
    if (attributes.type === 'hidden' && attributes.name) form.append(attributes.name, attributes.value || '');
  }
  assert.ok([...form.keys()].some(k => k.startsWith('$ACTION_')), 'Server form action exists');
  return form;
}
async function save(url, form, data) {
  form.set('content', JSON.stringify(data));
  const response = await fetch(base + url, { method: 'POST', headers, body: form });
  assert.equal(response.status, 200); return response.text();
}
async function main() {
  const moduleData = { exports: {} };
  new Function('exports', 'require', 'module', ts.transpileModule(await fs.readFile(path.join(__dirname, '../lib/trainings-data.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(moduleData.exports, require, moduleData);
  const { defaultTrainings, validTraining } = moduleData.exports;
  assert.ok(defaultTrainings.every(validTraining));
  assert.equal(validTraining({ ...defaultTrainings[0], dates: [{ start: '2027-02-31', end: '2027-03-03', note: '' }] }), false);
  assert.equal(validTraining({ ...defaultTrainings[0], dates: [{ start: '2027-03-03', end: '2027-03-02', note: '' }] }), false);
  assert.equal(validTraining({ ...defaultTrainings[0], photos: ['../../private.jpg'] }), false);
  assert.equal((await fetch(base + '/api/admin/trainings/upload', { method: 'POST' })).status, 401);
  assert.equal((await fetch(base + '/api/admin/trainings/upload', { method: 'POST', headers: { ...headers, origin: 'https://example.com' } })).status, 403);
  const client = new Client({ connectionString: process.env.DATABASE_URL }); await client.connect();
  let id, file;
  try {
    const form = await editor('/admin/trainings?new=1'); id = String(form.get('id'));
    const data = { ...defaultTrainings[0], slug: `test-${crypto.randomUUID()}`, title: 'Проверка тренинга', description: 'Проверка сохранения.\n\nВторой абзац.', dates: [], photos: [], published: false };
    await save('/admin/trainings?new=1', form, data);
    assert.equal((await fetch(base + '/treningi/' + data.slug)).status, 404, 'Draft is hidden');
    let row = (await client.query('SELECT * FROM "Training" WHERE id=$1', [id])).rows[0]; assert.equal(row.published, false);
    const pixels = await sharp({ create: { width: 64, height: 48, channels: 3, background: '#e7ebdd' } }).jpeg().toBuffer();
    const upload = new FormData(); upload.set('image', new Blob([pixels], { type: 'image/jpeg' }), 'test.jpg');
    const uploadResponse = await fetch(base + '/api/admin/trainings/upload', { method: 'POST', headers, body: upload });
    assert.equal(uploadResponse.status, 200); file = (await uploadResponse.json()).file;
    const image = await fetch(base + '/api/training-images/' + file); assert.equal(image.status, 200); assert.equal(image.headers.get('content-type'), 'image/jpeg');
    const editing = await editor('/admin/trainings?id=' + id);
    data.published = true; data.photos = [file]; data.price = '15 000 руб.'; data.dates = [{ start: '2027-01-03', end: '2027-01-05', note: 'Тестовый набор' }];
    const saved = await save('/admin/trainings?id=' + id, editing, data); assert.ok(saved.includes('Тренинг сохранён.'));
    const detailResponse = await fetch(base + '/treningi/' + data.slug); assert.equal(detailResponse.status, 200);
    const detail = await detailResponse.text(); assert.ok(detail.includes(file)); assert.ok(detail.includes('15 000 руб.')); assert.ok(detail.includes('Второй абзац.'));
    const list = await (await fetch(base + '/treningi')).text(); assert.ok(list.includes(data.slug));
    const unpublish = await editor('/admin/trainings?id=' + id); data.published = false;
    await save('/admin/trainings?id=' + id, unpublish, data);
    assert.equal((await fetch(base + '/treningi/' + data.slug)).status, 404);
    assert.ok(!(await (await fetch(base + '/treningi')).text()).includes(data.slug));
    console.log('PASS: validation, creation, draft privacy, upload/auth/origin, publishing, details/photos, editing and unpublishing');
  } finally {
    if (id) await client.query('DELETE FROM "Training" WHERE id=$1', [id]);
    await client.end();
    if (file) await fs.unlink(path.join(path.resolve(process.env.ARTICLE_UPLOAD_DIR || 'article-uploads'), 'trainings', file));
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
