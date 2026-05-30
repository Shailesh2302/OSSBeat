-- Add password_hash to User model for email/password auth

ALTER TABLE "User" ADD COLUMN "password_hash" TEXT;
