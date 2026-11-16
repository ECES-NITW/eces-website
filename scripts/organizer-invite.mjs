import { createHash, randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";

const [email, target] = process.argv.slice(2);
if (!/^[a-z0-9._%+-]+@student\.nitw\.ac\.in$/i.test(email ?? "")
  || !["--remote", "--local", "--dashboard"].includes(target)) {
  console.error("Usage: npm run organizer:invite -- <student email> --remote|--local|--dashboard");
  process.exit(1);
}

const code = randomBytes(32).toString("hex");
const hash = createHash("sha256").update(code).digest("hex");
const sql = `INSERT INTO organizer_invites (token_hash, email, expires_at) VALUES ('${hash}', '${email.toLowerCase()}', unixepoch() + 86400);`;

if (target === "--dashboard") {
  console.log(sql);
} else {
  const args = [
    "./node_modules/wrangler/bin/wrangler.js",
    "d1", "execute", "DB", target, "--config", "wrangler.jsonc",
    "--command", sql,
  ];
  if (target === "--local") args.push("--persist-to", ".wrangler/state");
  const result = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`Enrollment code (expires 24 hours after the SQL runs): ${code}`);
