import { z } from "zod";

export const questionSchema = z.object({
  id: z.number().optional(),
  text: z
    .string({
      message: "O texto da pergunta é obrigatório.",
    })
    .min(1, { message: "O texto da pergunta não pode estar vazio." }),
  surveyId: z
    .number({ message: "O ID da pesquisa deve ser um número válido." })
    .min(1, { message: "O ID da pesquisa é obrigatório." })
    .optional()
    .nullable(),
});
