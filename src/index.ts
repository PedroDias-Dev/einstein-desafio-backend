import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { errorHandler } from "middlewares/error";
import SurveyRouter from "./routes/surveys";
import ResponseRouter from "./routes/responses";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("The server is running");
});

app.use(errorHandler);

app.use("/api/v1/survey", SurveyRouter);
app.use("/api/v1/response", ResponseRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
