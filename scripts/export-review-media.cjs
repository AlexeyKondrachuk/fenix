require("dotenv/config");
const { randomUUID } = require("node:crypto");
const { mkdir, open, readFile, rename, rm, stat } = require("node:fs/promises");
const { join, resolve } = require("node:path");
const { Client } = require("pg");

const extensions = new Map([
  ["image/webp", "webp"],
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
]);
const directory = resolve(process.env.ARTICLE_UPLOAD_DIR || "article-uploads", "review-media");
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function copyAndVerify(path, bytes) {
  const exists = await stat(path).catch(error => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  if (!exists) {
    const temporary = `${path}.${randomUUID()}.tmp`;
    try {
      const file = await open(temporary, "wx");
      try {
        await file.writeFile(bytes);
        await file.sync();
      } finally {
        await file.close();
      }
      await rename(temporary, path);
    } finally {
      await rm(temporary, { force: true });
    }
  }
  if (!(await readFile(path)).equals(bytes)) throw new Error(`Review attachment does not match database: ${path}`);
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  await client.connect();
  try {
    await client.query("BEGIN");
    const { rows: [table] } = await client.query(`SELECT to_regclass('"ReviewMedia"') AS name`);
    if (!table.name) {
      await client.query("COMMIT");
      return;
    }
    await client.query('LOCK TABLE "ReviewMedia" IN EXCLUSIVE MODE');
    const { rowCount: legacyColumn } = await client.query(`
      SELECT 1 FROM pg_attribute WHERE attrelid = '"ReviewMedia"'::regclass
        AND attname = 'bytes' AND NOT attisdropped
    `);
    if (!legacyColumn) {
      await client.query("COMMIT");
      return;
    }

    let previous = "";
    let exported = 0;
    for (;;) {
      const { rows: [media] } = await client.query(
        'SELECT id, "mimeType", bytes FROM "ReviewMedia" WHERE id > $1 ORDER BY id LIMIT 1',
        [previous],
      );
      if (!media) break;
      previous = media.id;
      const extension = extensions.get(media.mimeType);
      if (!/^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(media.id) || !extension) {
        throw new Error(`Unsupported review attachment: ${media.id}`);
      }
      const path = join(directory, `${media.id}.${extension}`);
      if (media.bytes.length === 0) {
        const info = await stat(path);
        if (!info.isFile() || !info.size) throw new Error(`Review attachment missing: ${path}`);
        continue;
      }
      await mkdir(directory, { recursive: true });
      await copyAndVerify(path, media.bytes);
      await client.query('UPDATE "ReviewMedia" SET bytes = $1 WHERE id = $2', [Buffer.alloc(0), media.id]);
      exported++;
    }
    await client.query("COMMIT");
    console.log(`Exported and verified ${exported} review attachment(s).`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
