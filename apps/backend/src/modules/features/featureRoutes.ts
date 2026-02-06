import { Router } from "express";
import { findIssues } from "./featureController";



const router: Router = Router();


router.get("/getIssues",findIssues);


export default router;