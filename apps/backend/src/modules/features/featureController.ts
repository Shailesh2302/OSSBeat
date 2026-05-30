import { Request, Response } from "express";
import { getGsocReposGraphQL, getHackomberfestReposGraphQL, getIssuesFromTopRepos } from "./featureService";
import { AppError } from "../../utils/AppError";

export const findIssues = async (req: Request, res: Response) => {
  try {
    const getData = await getIssuesFromTopRepos();
    return res.json(getData);
  } catch (error) {
    console.error("Failed to fetch issues:", error);
    throw new AppError("Failed to fetch issues", 500);
  }
};

export const findgsoc = async (req: Request, res: Response) => {
  try {
    const response = await getGsocReposGraphQL();
    return res.json(response);
  } catch (error) {
    console.error("Failed to fetch GSoC repos:", error);
    throw new AppError("Failed to fetch GSoC repositories", 500);
  }
};

export const findHackomberfestReposGraphQL = async (req: Request, res: Response) => {
  try {
    const response = await getHackomberfestReposGraphQL();
    return res.json(response);
  } catch (error) {
    console.error("Failed to fetch Hacktoberfest repos:", error);
    throw new AppError("Failed to fetch Hacktoberfest repositories", 500);
  }
};
