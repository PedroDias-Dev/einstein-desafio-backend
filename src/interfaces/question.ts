import { Prisma } from "../../prisma/generated/prisma-client";

export type Question = Prisma.QuestionGetPayload<{}>;

export interface QuestionInterface {
  id?: number;
  text: string;
  surveyId: number;
}
