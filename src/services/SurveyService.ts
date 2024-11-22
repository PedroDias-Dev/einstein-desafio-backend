import prisma from "db/prisma";
import { SurveyInterface } from "interfaces/survey";

class SurveyService {
  static async createSurvey(data: SurveyInterface) {
    const survey = await prisma.survey.create({
      data: {
        publicTarget: data.publicTarget,
        stars: data.stars,
        email: data.email,
      },
    });

    return survey;
  }
}

export default SurveyService;
