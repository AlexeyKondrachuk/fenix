require('dotenv').config({ quiet: true });
const fs = require('node:fs');
const ts = require('typescript');
const { Client } = require('pg');
const { randomUUID } = require('node:crypto');
const path = require('node:path');
const moduleData = { exports: {} };
new Function('exports', 'require', 'module', ts.transpileModule(fs.readFileSync(path.join(__dirname, '../lib/trainings-data.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(moduleData.exports, require, moduleData);
(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query('BEGIN');
    for (const { slug, title, published, position, ...content } of moduleData.exports.defaultTrainings) {
      await client.query('INSERT INTO "Training" ("id", "slug", "title", "published", "position", "content") VALUES ($1,$2,$3,$4,$5,$6::jsonb) ON CONFLICT ("slug") DO NOTHING', [randomUUID(), slug, title, published, position, JSON.stringify(content)]);
    }
    await client.query('COMMIT'); console.log('Training examples ready; existing entries unchanged.');
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { await client.end(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
