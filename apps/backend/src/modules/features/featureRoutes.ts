import { Router } from "express";
import { findgsoc, findIssues } from "./featureController";

const router: Router = Router();

router.get("/getIssues", findIssues);
router.get("/getgsoc", findgsoc);

export default router;
