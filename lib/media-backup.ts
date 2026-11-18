import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { create as createTar } from "tar";
import { mkdtemp, rm, rmdir, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

export async function createMediaBackup(signal?: AbortSignal) {
  const source = resolve(process.env.ARTICLE_UPLOAD_DIR || "article-uploads");
  const info = await stat(source).catch(() => null);
  if (!info?.isDirectory()) throw new Error("MEDIA_DIRECTORY_MISSING");
  const directory = await mkdtemp(join(tmpdir(), "fenix-media-backup-"));
  const path = join(directory, "media.tar.gz");
  const cleanup = async () => {
    await rm(path, { force: true });
    await rmdir(directory).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") throw error;
    });
  };
  try {
    const timeout = AbortSignal.timeout(600_000);
    const archiveSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
    await pipeline(
      createTar({ cwd: source, gzip: true, portable: true, strict: true, follow: false }, ["."]),
      createWriteStream(path, { flags: "wx" }),
      { signal: archiveSignal },
    );
    const { size } = await stat(path);
    return { path, size, cleanup };
  } catch (error) {
    await cleanup().catch(() => {});
    throw error;
  }
}
