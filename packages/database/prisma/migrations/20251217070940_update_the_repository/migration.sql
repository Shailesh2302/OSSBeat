/*
  Warnings:

  - You are about to drop the column `owner` on the `Repository` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Repository` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner_id` to the `Repository` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_login` to the `Repository` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_profile_url` to the `Repository` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "owner",
ADD COLUMN     "owner_id" INTEGER NOT NULL,
ADD COLUMN     "owner_login" TEXT NOT NULL,
ADD COLUMN     "owner_profile_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatar_url" DROP NOT NULL,
ALTER COLUMN "avatar_url" DROP DEFAULT,
ALTER COLUMN "display_name" DROP DEFAULT,
ALTER COLUMN "profile_url" DROP NOT NULL,
ALTER COLUMN "profile_url" DROP DEFAULT,
ALTER COLUMN "username" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Repository_id_key" ON "Repository"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
