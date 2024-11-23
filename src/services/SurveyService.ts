import prisma from "db/prisma";
import { validateSchema } from "helpers/validator";
import { SurveyInterface } from "interfaces/survey";
import { surveySchema } from "validators/survey";

class SurveyService {
  static async createSurvey(data: SurveyInterface) {
    validateSchema(surveySchema, data);

    const survey = await prisma.survey.create({
      data: {
        title: data.title,
        publicTarget: data.publicTarget,
        email: data.email,
        questions: {
          create: data.questions,
        },
      },
      include: {
        questions: true,
      },
    });

    return { survey };
  }

  static async updateSurvey(id: number, data: SurveyInterface) {
    if (!id) {
      throw new Error("Informe o id da pesquisa.");
    }

    id = Number(id);

    const survey_found = await prisma.survey.findUnique({
      where: {
        id,
      },
    });

    if (!survey_found) {
      throw new Error("A pesquisa não foi encontrada.");
    }

    validateSchema(surveySchema, data);

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
      include: {
        questions: true,
      },
    });

    return { survey };
  }
}

export default SurveyService;
