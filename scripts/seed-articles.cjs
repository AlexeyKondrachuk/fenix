require('dotenv').config({ quiet: true });
const { randomUUID } = require('node:crypto');
const { copyFile, mkdir } = require('node:fs/promises');
const { join, resolve } = require('node:path');
const { Client } = require('pg');

const categories = ['Психотерапия', 'Общая психология', 'Детская психология', 'Методы психотерапии', 'Зависимое поведение'];
const examples = [
  {
    category: 'Детская психология',
    slug: 'demo-privychnyy-ritual',
    title: 'Демо: маленький ритуал перед выходом',
    text: 'В этой вымышленной истории Саша выбирает одну игрушку, чтобы показать её бабушке после прогулки. Из этой детали вырос их общий ритуал: перед выходом они придумывают, о чём расскажут друг другу вечером.',
  },
  {
    category: 'Психотерапия',
    slug: 'demo-pauza-v-techenie-dnya',
    title: 'Демо: короткая пауза в течение дня',
    text: 'В вымышленной истории Марина выходит на улицу в обеденный перерыв. Она замечает свет на камнях и звук ветра. Эта маленькая прогулка становится поводом отложить список дел и оглядеться вокруг.',
    cover: true,
  },
];

async function seed() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query('BEGIN');
    const categoryIds = new Map();
    for (const name of categories) {
      await client.query('INSERT INTO "ArticleCategory" ("id", "name") VALUES ($1, $2) ON CONFLICT ("name") DO NOTHING', [randomUUID(), name]);
      const { rows: [category] } = await client.query('SELECT "id" FROM "ArticleCategory" WHERE "name" = $1', [name]);
      categoryIds.set(name, category.id);
    }

    for (const example of examples) {
      const id = randomUUID();
      const blocks = [{ id: randomUUID(), type: 'text', text: example.text, heading: false, font: 'Arial', color: '#26342e', size: 18 }];
      const file = `${randomUUID()}.webp`;
      if (example.cover) blocks.unshift({ id: randomUUID(), type: 'photo', files: [file] });
      const result = await client.query(
        'INSERT INTO "Article" ("id", "slug", "title", "blocks", "published", "updatedAt", "categoryId") VALUES ($1, $2, $3, $4::jsonb, true, clock_timestamp(), $5) ON CONFLICT ("slug") DO NOTHING',
        [id, example.slug, example.title, JSON.stringify(blocks), categoryIds.get(example.category)],
      );
      if (result.rowCount && example.cover) {
        const directory = resolve(process.env.ARTICLE_UPLOAD_DIR || 'article-uploads', id);
        await mkdir(directory, { recursive: true });
        await copyFile(join(__dirname, 'fixtures', 'article-stones.webp'), join(directory, file));
      }
    }
    await client.query('COMMIT');
    console.log('Demo articles and categories are ready.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

seed().catch(error => { console.error(error.message); process.exitCode = 1; });
