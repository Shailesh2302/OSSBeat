-- CreateEnum
CREATE TYPE "ProviderName" AS ENUM ('GOOGLE', 'GITHUB');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "display_name" TEXT,
    "last_login_at" TIMESTAMP(3),
    "profile_url" TEXT,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "provider" "ProviderName" NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "accessTokenEnc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repository" (
    "id" TEXT NOT NULL,
    "github_repo_id" TEXT NOT NULL,
    "owner_login" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "owner_profile_url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "html_url" TEXT NOT NULL,
    "description" TEXT,
    "primary_language" TEXT,
    "stars_count" INTEGER NOT NULL DEFAULT 0,
    "forks_count" INTEGER NOT NULL DEFAULT 0,
    "open_issues_count" INTEGER NOT NULL DEFAULT 0,
    "topics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_fork" BOOLEAN NOT NULL DEFAULT false,
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "last_pushed_at" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "repo_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "github_event_id" TEXT,
    "event_url" TEXT,
    "event_date" TIMESTAMP(3),
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRepoStat" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "repo_id" TEXT NOT NULL,
    "total_commits" INTEGER NOT NULL DEFAULT 0,
    "total_prs" INTEGER NOT NULL DEFAULT 0,
    "total_issues" INTEGER NOT NULL DEFAULT 0,
    "last_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRepoStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendedRepo" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "repo_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "recommended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags_matched" JSONB,

    CONSTRAINT "RecommendedRepo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepoFetchHistory" (
    "id" TEXT NOT NULL,
    "repo_id" TEXT NOT NULL,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "raw_metadata" JSONB,

    CONSTRAINT "RepoFetchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Provider_userId_idx" ON "Provider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_provider_providerUserId_key" ON "Provider"("provider", "providerUserId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_github_repo_id_key" ON "Repository"("github_repo_id");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_full_name_key" ON "Repository"("full_name");

-- CreateIndex
CREATE INDEX "Repository_userId_idx" ON "Repository"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Contribution_user_id_repo_id_key" ON "Contribution"("user_id", "repo_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserRepoStat_user_id_repo_id_key" ON "UserRepoStat"("user_id", "repo_id");

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_repo_id_fkey" FOREIGN KEY ("repo_id") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRepoStat" ADD CONSTRAINT "UserRepoStat_repo_id_fkey" FOREIGN KEY ("repo_id") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRepoStat" ADD CONSTRAINT "UserRepoStat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedRepo" ADD CONSTRAINT "RecommendedRepo_repo_id_fkey" FOREIGN KEY ("repo_id") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedRepo" ADD CONSTRAINT "RecommendedRepo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepoFetchHistory" ADD CONSTRAINT "RepoFetchHistory_repo_id_fkey" FOREIGN KEY ("repo_id") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
