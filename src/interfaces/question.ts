import { Prisma } from "../../prisma/generated/prisma-client";

export type Question = Prisma.QuestionGetPayload<{}>;

export interface QuestionInterface {
  id?: number;
  text: string;
  required: boolean;
  surveyId: number;
}
