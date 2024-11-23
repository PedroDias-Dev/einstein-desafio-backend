import { expect } from "chai";
import sinon from "sinon";
import prisma from "db/prisma";
import ResponseService from "services/ResponseService";

describe("ResponseService", function () {
  afterEach(() => {
    sinon.restore();
  });

  describe("createResponse", () => {
    it("should create a response successfully", async () => {
      const mockResponse = {
        stars: 5,
        publicTarget: "Public Target",
        email: "email@example.com",
        surveyId: 1,
        questionResponses: [{ questionId: 1, answer: "Answer 1" }] as any,
      };

      const mockSurvey = { id: 1, title: "Survey Title" };
      const mockQuestions = [{ id: 1, text: "Question 1", required: true }];

      prisma.survey.findUnique = sinon.stub().resolves(mockSurvey);
      prisma.question.findMany = sinon.stub().resolves(mockQuestions);
      prisma.response.create = sinon
        .stub()
        .resolves({ id: 1, ...mockResponse });

      const result = await ResponseService.createResponse(mockResponse as any);

      expect(result.response.email).to.equal("email@example.com");
    });

    it("should throw an error if required question is not answered", async () => {
      const mockResponse = {
        stars: 5,
        publicTarget: "Public Target",
        email: "email@example.com",
        surveyId: 1,
        questionResponses: [],
      };

      const mockSurvey = { id: 1, title: "Survey Title" };
      const mockQuestions = [{ id: 1, text: "Question 1", required: true }];

      prisma.survey.findUnique = sinon.stub().resolves(mockSurvey);
      prisma.question.findMany = sinon.stub().resolves(mockQuestions);

      try {
        await ResponseService.createResponse(mockResponse as any);
      } catch (err: any) {
        expect(err.message).to.equal(
          "É necessário responder todas as perguntas obrigatórias."
        );
      }
    });

    it("should throw an error if survey is not found", async () => {
      const mockResponse = {
        stars: 5,
        publicTarget: "Public Target",
        email: "email@example.com",
        surveyId: 1,
        questionResponses: [{ questionId: 1, answer: "Answer 1" }] as any,
      };

      prisma.survey.findUnique = sinon.stub().resolves(null);

      try {
        await ResponseService.createResponse(mockResponse as any);
      } catch (err: any) {
        expect(err.message).to.equal("A pesquisa não foi encontrada.");
      }
    });
  });

  describe("listResponses", () => {
    it("should list responses successfully", async () => {
      const mockResponses = [
        {
          id: 1,
          publicTarget: "Public Target",
          stars: 5,
          email: "email@example.com",
          createdAt: new Date(),
          survey: { id: 1, title: "Survey Title" },
          questionResponses: [{ questionId: 1, answer: "Answer 1" }],
        },
      ];

      prisma.response.findMany = sinon.stub().resolves(mockResponses);

      const result = await ResponseService.listResponses({
        publicTarget: "Public Target",
        orderByStars: "asc",
      });

      expect(result.responses).to.have.lengthOf(1);
      expect(result.responses[0].publicTarget).to.equal("Public Target");
    });

    it("should throw an error if orderByStars is invalid", async () => {
      try {
        await ResponseService.listResponses({
          publicTarget: "Public Target",
          // @ts-ignore
          orderByStars: "invalid",
        });
      } catch (err: any) {
        expect(err.message).to.equal("Ordem inválida.");
      }
    });
  });
});
