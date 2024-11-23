import prisma from "db/prisma";
import { validateSchema } from "helpers/validator";
import { ResponseInterface } from "interfaces/response";
import { responseSchema } from "validators/response";

class ResponseService {
  static async createResponse(data: ResponseInterface) {
    validateSchema(responseSchema, data);

    const survey_found = await prisma.survey.findUnique({
      where: {
        id: data.surveyId,
      },
    });

    if (!survey_found) {
      throw new Error("A pesquisa não foi encontrada.");
    }

    const Response = await prisma.response.create({
      data: {
        stars: data.stars,
        publicTarget: data.publicTarget,
        email: data.email,
        surveyId: data.surveyId,
      },
    });

    const survey_questions = await prisma.question.findMany({
      where: {
        surveyId: data.surveyId,
      },
    });

    const required_questions = survey_questions.filter(
      (question) => question.required
    );

    if (
      !data.questionResponses.find((questionResponse) =>
        required_questions.find(
          (question) => question.id === questionResponse.questionId
        )
      ) &&
      required_questions.length > 0
    ) {
      throw new Error(
        "É necessário responder todas as perguntas obrigatórias."
      );
    }

    for (const questionResponse of data.questionResponses) {
      const question = await prisma.question.findUnique({
        where: {
          id: questionResponse.questionId,
        },
      });

      if (!question) {
        throw new Error(
          `Pergunta de ID ${questionResponse.questionId} não encontrada.`
        );
      }

      await prisma.questionResponse.create({
        data: {
          questionId: questionResponse.questionId,
          responseId: Response.id,
          answer: questionResponse.answer,
        },
      });
    }

    return Response;
  }

  static async listResponses(data: {
    publicTarget: string;
    orderByStars?: "asc" | "desc";
  }) {
    const { publicTarget, orderByStars } = data;

    const responses = await prisma.response.findMany({
      where: {
        publicTarget,
      },
      orderBy: {
        stars: orderByStars,
      },
      include: {
        survey: true,
        questionResponses: true,
      },
    });

    return responses;
  }
}

export default ResponseService;
