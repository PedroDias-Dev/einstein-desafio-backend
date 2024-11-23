import { z } from "zod";
import { questionResponseSchema } from "./questionResponse";

export const responseSchema = z.object({
  id: z
    .number({ message: "O ID da resposta deve ser um número válido." })
    .min(1, { message: "O ID da resposta é obrigatório." })
    .optional()
    .nullable(),
  surveyId: z
    .number({ message: "O ID da pesquisa deve ser um número válido." })
    .min(1, { message: "O ID da pesquisa é obrigatório." }),
  publicTarget: z
    .string({
      message: "O público-alvo é obrigatório.",
    })
    .min(1, { message: "O público-alvo não pode estar vazio." }),
  stars: z
    .number({ message: "A quantidade de estrelas deve ser um número." })
    .min(1, { message: "A quantidade de estrelas deve ser pelo menos 1." })
    .max(5, { message: "A quantidade de estrelas deve ser no máximo 5." }),
  email: z
    .string({
      message: "O e-mail é obrigatório.",
    })
    .email({ message: "O e-mail fornecido não é válido." }),
  questionResponses: z.array(questionResponseSchema),
});
