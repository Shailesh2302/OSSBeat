import { Request, Response } from "express";
import { getGsocReposGraphQL, getHackomberfestReposGraphQL, getIssuesFromTopRepos } from "./featureService";
import { AppError } from "../../utils/AppError";

export const findIssues = async (req: Request, res: Response) => {
  try {
    const getData = await getIssuesFromTopRepos();

    return res.json(getData);
  } catch (error) {}
};


export const findgsoc = async (req: Request, res: Response) => {
  try {
    const response = await getGsocReposGraphQL();

    return res.json(response);
  } catch (error) {
    throw new AppError("Internal Error");
  }
};


export const findHackomberfestReposGraphQL = async (req: Request, res:Response) => {
  try {
    const response = await getHackomberfestReposGraphQL();

    return res.json(response);
  } catch (error) {
    console.log("not working");
  }
}
