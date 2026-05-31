import { Router, type Router as ExpressRouter } from "express";
import { fetchContributions } from "./contributionsController";
import { protectRoute } from "../../middleware/authMiddleware";

const router: ExpressRouter = Router();

router.get("/getContributions", protectRoute, fetchContributions);

export default router;
