import ResponseController from "controllers/ResponseController";
import express from "express";

const router = express.Router();

router.post("/create", ResponseController.createResponse);
router.post("/list", ResponseController.listResponses);
router.post("/export-csv", ResponseController.exportResponsesCSV);

export default router;
