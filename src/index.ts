import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import SurveyRouter from "./routes/surveys";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("The server is running");
});

app.use("/api/v1/survey", SurveyRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
