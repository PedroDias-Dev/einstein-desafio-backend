import { SurveyInterface } from "interfaces/survey";
import SurveyService from "services/SurveyService";
import { Request, Response } from "express";

class SurveyController {
  static async createSurvey(req: Request, res: Response) {
    const survey = await SurveyService.createSurvey(
      req.body as unknown as SurveyInterface
    );
    res.status(201).json(survey);
  }

  static async updateSurvey(req: Request, res: Response) {
    const survey = await SurveyService.updateSurvey(
      req.params.id as unknown as number,
      req.body as unknown as SurveyInterface
    );
    res.status(200).json(survey);
  }
}

export default SurveyController;
