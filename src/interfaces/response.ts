import { Prisma } from "../../prisma/generated/prisma-client";
import { SurveyInterface } from "./survey";

export type Response = Prisma.ResponseGetPayload<{}>;

export interface ResponseInterface {
  id: number;
  surveyId: number;
  publicTarget: string;
  stars: number;
  email: string;
  createdAt: Date;
  survey: SurveyInterface;
}
