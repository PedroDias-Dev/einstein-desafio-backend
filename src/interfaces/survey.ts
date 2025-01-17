import { Prisma } from "../../prisma/generated/prisma-client";
import { QuestionInterface } from "./question";
import { ResponseInterface } from "./response";

export type Survey = Prisma.SurveyGetPayload<{
  include: {
    questions: true;
    responses: true;
  };
}>;

export interface SurveyInterface {
  id?: number;
  title: string;
  publicTarget: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  questions?: QuestionInterface[];
  responses?: ResponseInterface[];
}
