import "dotenv/config";
import { Request, Response } from "express";
import { repoService } from "../repo/repoService";

export async function githubWebhookController(req: Request, res: Response) {
  const event = req.headers["x-github-event"];
  const payload = req.body;


  if (!event) {
    return res.status(400).send("Missing event header");
  }


  if (event === "repository") {
    await repoService.upsertFromGithubWebhook(payload.repository);
  }


  if (event === "push") {
    await repoService.updateLastPush(
      payload.repository.id,
      payload.repository.pushed_at
    );
  }

  res.sendStatus(200);
}
