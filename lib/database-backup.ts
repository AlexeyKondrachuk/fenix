import { execFile } from "node:child_process";

// pg_dump uses a consistent snapshot; never construct a shell command from settings.
export function createDatabaseBackup(): Promise<Buffer> {
  const connection = process.env.DATABASE_URL;
  if (!connection) throw new Error("Database is not configured");
  const url = new URL(connection);
  const user = decodeURIComponent(url.username);
  const database = decodeURIComponent(url.pathname.slice(1));
  const docker = (process.env.DATABASE_BACKUP_MODE ?? "docker") === "docker";
  const args = docker
    ? ["compose", "exec", "-T", "-e", "PGPASSWORD", "postgres", "pg_dump", "--format=custom", "--no-password", "--host=127.0.0.1", `--username=${user}`, `--dbname=${database}`]
    : ["--format=custom", "--no-password", `--dbname=${connection}`];
  return new Promise((resolve, reject) => {
    execFile(docker ? "docker" : (process.env.PG_DUMP_PATH || "pg_dump"), args, {
      cwd: process.cwd(),
      env: { ...process.env, PGPASSWORD: decodeURIComponent(url.password) },
      encoding: "buffer",
      windowsHide: true,
      timeout: 120_000,
      maxBuffer: 256 * 1024 * 1024,
    }, (error, stdout) => {
      // Do not expose stderr: it can contain database connection details.
      if (error) reject(new Error("Database backup failed"));
      else if (stdout.subarray(0, 5).toString() !== "PGDMP") reject(new Error("Invalid backup"));
      else resolve(stdout);
    });
  });
}
