import "dotenv/config";
import crypto from "crypto";
import { assertEnv } from "../config/env";

const { GITHUB_TOKEN_ENC_KEY } = process.env;

assertEnv("GITHUB_TOKEN_ENC_KEY", GITHUB_TOKEN_ENC_KEY);

if (!GITHUB_TOKEN_ENC_KEY || GITHUB_TOKEN_ENC_KEY.length !== 64) {
  throw new Error("GITHUB_TOKEN_ENC_KEY must be 64 hex characters (32 bytes)");
}

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;


const KEY = Buffer.from(GITHUB_TOKEN_ENC_KEY, "hex");

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText) {
    throw new Error("Encrypted token is missing");
  }

  const [ivHex, authTagHex, encrypted] = encryptedText.split(":");

  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error("Invalid encrypted text format");
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(ivHex, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
