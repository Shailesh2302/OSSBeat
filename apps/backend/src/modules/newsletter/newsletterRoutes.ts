import { Router } from "express";
import { subscribeNewsletter } from "./newsletterController";

const router = Router();

router.post("/subscribe", subscribeNewsletter);

export default router;
