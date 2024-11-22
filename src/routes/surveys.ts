import SurveyController from "controllers/SurveyController";
import express from "express";

const router = express.Router();

router.post("/create", SurveyController.createSurvey);

export default router;
