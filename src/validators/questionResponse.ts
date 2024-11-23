import { z } from "zod";

export const questionResponseSchema = z.object({
  id: z.number().optional(),
  questionId: z
    .number({ message: "O ID da pergunta deve ser um número válido." })
    .min(1, { message: "O ID da pergunta é obrigatório." }),
  answer: z
    .string({
      message: "A resposta é obrigatória.",
    })
    .min(1, { message: "A resposta não pode estar vazia." }),
});
