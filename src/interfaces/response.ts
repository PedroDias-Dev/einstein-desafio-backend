import { Prisma } from "../../prisma/generated/prisma-client";
import { QuestionResponseInterface } from "./questionResponse";
import { SurveyInterface } from "./survey";

export type Response = Prisma.ResponseGetPayload<{
  include: {
    survey: true;
  };
}>;

export interface ResponseInterface {
  id: number;
  surveyId: number;
  publicTarget: string;
  stars: number;
  email: string;
  createdAt: Date;
  survey: SurveyInterface;
  questionResponses: QuestionResponseInterface[];
}
