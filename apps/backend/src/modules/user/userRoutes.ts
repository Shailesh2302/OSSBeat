import { Router } from "express";
import { getUser, updateUser, signup, login } from "./userController";
import { protectRoute } from "../../middleware/authMiddleware";

const router: Router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getUser", protectRoute, getUser);
router.patch("/updateUser", protectRoute, updateUser);

export default router;
