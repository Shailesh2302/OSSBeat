import dotenv from "dotenv";
dotenv.config(); 

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set!");
  process.exit(1);
}

export function assertEnv(name: string, val: string | undefined) {
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}
