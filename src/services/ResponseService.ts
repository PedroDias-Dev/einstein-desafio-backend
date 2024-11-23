import { createObjectCsvWriter } from "csv-writer";
import prisma from "db/prisma";
import { validateSchema } from "helpers/validator";
import { ResponseInterface } from "interfaces/response";
import moment from "moment";
import path from "path";
import fs from "fs";
import { responseSchema } from "validators/response";

class ResponseService {
  static async createResponse(data: ResponseInterface) {
    validateSchema(responseSchema, data);

    const survey_found = await prisma.survey.findUnique({
      where: {
        id: data.surveyId,
      },
    });

    if (!survey_found) {
      throw new Error("A pesquisa não foi encontrada.");
    }

    const response = await prisma.response.create({
      data: {
        stars: data.stars,
        publicTarget: data.publicTarget,
        email: data.email,
        surveyId: data.surveyId,
      },
    });

    const survey_questions = await prisma.question.findMany({
      where: {
        surveyId: data.surveyId,
      },
    });

    const required_questions = survey_questions.filter(
      (question) => question.required
    );

    if (
      !data.questionResponses.find((questionResponse) =>
        required_questions.find(
          (question) => question.id === questionResponse.questionId
        )
      ) &&
      required_questions.length > 0
    ) {
      throw new Error(
        "É necessário responder todas as perguntas obrigatórias."
      );
    }

    for (const questionResponse of data.questionResponses) {
      const question = await prisma.question.findUnique({
        where: {
          id: questionResponse.questionId,
          surveyId: data.surveyId,
        },
      });

      if (!question) {
        throw new Error(
          `Pergunta de ID ${questionResponse.questionId} não encontrada.`
        );
      }

      await prisma.questionResponse.create({
        data: {
          questionId: questionResponse.questionId,
          responseId: response.id,
          answer: questionResponse.answer,
        },
      });
    }

    return { response };
  }

  static async listResponses(data: {
    publicTarget: string;
    orderByStars?: "asc" | "desc";
  }) {
    const { publicTarget, orderByStars } = data;

    if (orderByStars && !["asc", "desc"].includes(orderByStars)) {
      throw new Error("Ordem inválida.");
    }

    const responses = await prisma.response.findMany({
      where: {
        publicTarget,
      },
      orderBy: {
        stars: orderByStars,
      },
      include: {
        survey: true,
        questionResponses: {
          include: {
            question: true,
          },
        },
      },
    });

    return { responses };
  }

  static async exportResponsesCSV(data: {
    publicTarget: string;
    orderByStars?: "asc" | "desc";
  }) {
    const { responses } = await this.listResponses(data);

    const csvFilePath = path.join(
      __dirname,
      "..",
      "..",
      "/csv",
      `question_responses_${moment().format("DD-MM-YYYY-HH-mm-ss")}.csv`
    );

    const csvDir = path.dirname(csvFilePath);
    if (!fs.existsSync(csvDir)) {
      fs.mkdirSync(csvDir, { recursive: true });
    }

    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: [
        { id: "surveyId", title: "ID da Pesquisa" },
        { id: "surveyName", title: "Nome da Pesquisa" },
        { id: "questionId", title: "ID da Questão" },
        { id: "questionName", title: "Texto da Questão" },
        { id: "responseId", title: "ID da Resposta" },
        { id: "answer", title: "Resposta" },
        { id: "publicTarget", title: "Público-alvo" },
        { id: "stars", title: "Estrelas" },
        { id: "email", title: "E-mail" },
        { id: "createdAt", title: "Data de Criação" },
      ],
    });

    const questionResponses = responses.map((response) =>
      response.questionResponses.map((qr) => ({
        surveyId: response.survey.id,
        surveyName: response.survey.title,
        questionId: qr.questionId,
        questionName: qr.question.text,
        responseId: qr.responseId,
        answer: qr.answer,
        publicTarget: response.publicTarget,
        stars: response.stars,
        email: response.email,
        createdAt: response.createdAt
          ? moment(response.createdAt).format("DD/MM/YYYY HH:mm:ss")
          : "N/A",
      }))
    );

    const records = questionResponses.flat();

    console.log(records);

    await csvWriter.writeRecords(records);

    return {
      message: `Arquivo CSV gerado com sucesso em ${csvFilePath}`,
    };
  }
}

export default ResponseService;
