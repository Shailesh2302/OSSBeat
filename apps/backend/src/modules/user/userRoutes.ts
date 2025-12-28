import { Router } from "express";
import { getUser } from "./userController";
import { protectRoute } from "../../middleware/authMiddleware";

const router: Router = Router();

router.get("/getUser", protectRoute, getUser);

export default router;
