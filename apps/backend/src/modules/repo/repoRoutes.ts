import { Router } from "express";
import { getDiscoverRepos } from "./repoController";
import { protectRoute } from "../../middleware/authMiddleware";

const router: Router = Router();

router.get("/discover", getDiscoverRepos);

export default router;
