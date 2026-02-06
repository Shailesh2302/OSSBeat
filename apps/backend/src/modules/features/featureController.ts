import { Request, Response } from "express";
import { getIssuesFromTopRepos } from "./featureService";

export const findIssues = async (req: Request, res: Response) => {
  try {
    const getData = await getIssuesFromTopRepos();

    return res.json(getData);

  } catch (error) {}
};
