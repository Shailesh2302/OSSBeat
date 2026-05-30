import { Router } from "express";
import { getStats } from "./statsController";

const router = Router();

router.get("/getStats", getStats);

export default router;
