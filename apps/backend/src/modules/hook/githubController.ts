import "dotenv/config";
import { Request, Response } from "express";
import { repoService } from "../repo/repoService";

export async function githubWebhookController(req: Request, res: Response) {
  const event = req.headers["x-github-event"];
  const payload = req.body;

  console.log("-----------------------------------------");
  console.log(req.body.repository);
  console.log("-----------------------------------------");

  if (!event) {
    return res.status(400).send("Missing event header");
  }

  // 🟢 Repo edited (name, description, stars, forks, visibility, etc.)
  if (event === "repository") {
    await repoService.upsertFromGithubWebhook(payload.repository);
  }

  // 🟢 Push event (update last pushed time)
  if (event === "push") {
    await repoService.updateLastPush(
      payload.repository.id,
      payload.repository.pushed_at
    );
  }

  res.sendStatus(200);
}
