// import { Request, Response } from "express";
// import { verifySignature } from "./verify";
// import { prisma } from "@repo/db";

// export async function githubWebhook(
//   req: Request & { rawBody: Buffer },
//   res: Response
// ) {
//   const signature = req.headers["x-hub-signature-256"];
//   const event = req.headers["x-github-event"];

//   if (
//     typeof signature !== "string" ||
//     !verifySignature(req.rawBody, signature, process.env.GITHUB_WEBHOOK_SECRET!)
//   ) {
//     return res.status(401).end();
//   }

//   if (event === "repository") {
//     const repo = req.body.repository;

//     await prisma.repository.upsert({
//       where: { github_repo_id: repo.id },
//       update: {
//         stars_count: repo.stargazers_count,
//         forks_count: repo.forks_count,
//         open_issues_count: repo.open_issues_count,
//         last_pushed_at: repo.pushed_at ? new Date(repo.pushed_at) : null,
//       },
//       create: {
//         github_repo_id: repo.id,
//         name: repo.name,
//         full_name: repo.full_name,
//         html_url: repo.html_url,
//         stars_count: repo.stargazers_count,
//         forks_count: repo.forks_count,
//         open_issues_count: repo.open_issues_count,
//         last_pushed_at: repo.pushed_at ? new Date(repo.pushed_at) : null,
//         // owner_id must already be resolved in your earlier sync
//       },
//     });
//   }

//   res.sendStatus(200);
// }
