import { Prisma } from "../../prisma/generated/prisma-client";

export type QuestionResponse = Prisma.QuestionResponseGetPayload<{}>;

export interface QuestionResponseInterface {
  id?: number;
  questionId: number;
  responseId: number;
  answer: string;
}
