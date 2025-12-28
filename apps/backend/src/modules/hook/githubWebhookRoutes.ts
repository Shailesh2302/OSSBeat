import { Router } from "express";
import { githubWebhookController } from "./githubController";
import { verifyGithubSignature } from "../../middleware/verifyGithubSignature";

const router: Router = Router();

router.post("/webhook", verifyGithubSignature,githubWebhookController);

export default router;
