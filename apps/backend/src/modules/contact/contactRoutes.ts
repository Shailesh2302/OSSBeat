import { Router } from "express";
import { sendMessage } from "./contactController";

const router = Router();

router.post("/sendMessage", sendMessage);

export default router;
