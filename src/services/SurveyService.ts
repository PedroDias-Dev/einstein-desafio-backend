import prisma from "db/prisma";
import { SurveyInterface } from "interfaces/survey";

class SurveyService {
  static async createSurvey(data: SurveyInterface) {
    const survey = await prisma.survey.create({
      data: {
        title: data.title,
        publicTarget: data.publicTarget,
        email: data.email,
        questions: {
          create: data.questions,
        },
      },
    });

    return survey;
  }

  static async updateSurvey(id: number, data: SurveyInterface) {
    if (!id) {
      throw new Error("Id is required");
    }

    id = Number(id);

    const survey_found = await prisma.survey.findUnique({
      where: {
        id,
      },
    });

    if (!survey_found) {
      throw new Error("Survey not found");
    }

    const survey = await prisma.survey.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        publicTarget: data.publicTarget,
        email: data.email,
        questions: {
          update: data.questions?.map((question) => ({
            where: { id: question.id },
            data: question,
          })),
        },
      },
    });

    return survey;
  }
}

export default SurveyService;
