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
}

export default SurveyController;
