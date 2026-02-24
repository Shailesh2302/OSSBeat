import { Router } from "express";
import { findgsoc, findHackomberfestReposGraphQL, findIssues } from "./featureController";

const router: Router = Router();

router.get("/getissues", findIssues);
router.get("/getgsoc", findgsoc);
router.get("/gethack", findHackomberfestReposGraphQL);

export default router;
