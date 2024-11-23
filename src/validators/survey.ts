import { z } from "zod";
import { questionSchema } from "./question";

export const surveySchema = z.object({
  id: z.number().optional(),
  title: z
    .string({
      message: "O título da pesquisa é obrigatório.",
    })
    .min(1, { message: "O título da pesquisa não pode estar vazio." }),
  publicTarget: z
    .string({
      message: "O público-alvo é obrigatório.",
    })
    .min(1, { message: "O público-alvo não pode estar vazio." }),
  email: z
    .string({
      message: "O e-mail é obrigatório.",
    })
    .email({ message: "O e-mail fornecido não é válido." }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  questions: z.array(questionSchema).optional(),
});
