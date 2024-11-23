import SurveyController from "controllers/SurveyController";
import express from "express";

const router = express.Router();

router.post("/create", SurveyController.createSurvey);
router.put("/update/:id", SurveyController.updateSurvey);

export default router;
