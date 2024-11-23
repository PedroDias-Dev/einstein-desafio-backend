import prisma from "db/prisma";
import { ResponseInterface } from "interfaces/response";

class ResponseService {
  static async createResponse(data: ResponseInterface) {
    const Response = await prisma.response.create({
      data: {
        stars: data.stars,
        publicTarget: data.publicTarget,
        email: data.email,
        surveyId: data.surveyId,
      },
    });

    await prisma.questionResponse.createMany({
      data: data.questionResponses.map((questionResponse) => ({
        questionId: questionResponse.questionId,
        responseId: Response.id,
        answer: questionResponse.answer,
      })),
    });

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
