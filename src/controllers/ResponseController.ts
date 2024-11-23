import { ResponseInterface } from "interfaces/response";
import ResponseService from "services/ResponseService";
import { NextFunction, Request, Response } from "express";

class ResponseController {
  static async createResponse(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await ResponseService.createResponse(
        req.body as unknown as ResponseInterface
      );
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async listResponses(req: Request, res: Response, next: NextFunction) {
    try {
      const responses = await ResponseService.listResponses(
        req.body as unknown as {
          publicTarget: string;
          orderByStars?: "asc" | "desc";
        }
      );
      res.status(200).json(responses);
    } catch (error) {
      next(error);
    }
  }

  static async exportResponsesCSV(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const responses = await ResponseService.exportResponsesCSV(
        req.body as unknown as {
          publicTarget: string;
          orderByStars?: "asc" | "desc";
        }
      );
      res.status(200).json(responses);
    } catch (error) {
      next(error);
    }
  }
}

export default ResponseController;
