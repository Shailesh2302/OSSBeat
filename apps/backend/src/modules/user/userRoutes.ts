import { Router } from "express";
import { getUser, updateUser } from "./userController";
import { protectRoute } from "../../middleware/authMiddleware";

const router: Router = Router();

router.get("/getUser", protectRoute, getUser);
router.patch("/updateUser", protectRoute, updateUser);

export default router;
