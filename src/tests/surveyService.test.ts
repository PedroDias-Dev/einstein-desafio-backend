import { expect } from "chai";
import prisma from "db/prisma";
import { SurveyInterface } from "../interfaces/survey";
import SurveyService from "../services/SurveyService";
import sinon from "sinon";

describe("SurveyService", function () {
  afterEach(() => {
    sinon.restore();
  });

  describe("createSurvey", () => {
    it("should create a survey successfully", async () => {
      const surveyData: SurveyInterface = {
        title: "Survey Title",
        publicTarget: "Public Target",
        email: "email@example.com",
        questions: [],
      };

      const mockSurvey = { ...surveyData, id: 1, questions: [] };

      prisma.survey.create = sinon.stub().resolves(mockSurvey);

      const { survey } = await SurveyService.createSurvey(surveyData);

      expect(survey).to.deep.equal(mockSurvey);
    });

    it("should throw error if schema validation fails", async () => {
      const surveyData: SurveyInterface = {
        title: "",
        publicTarget: "Public Target",
        email: "email@example.com",
        questions: [],
      };

      try {
        await SurveyService.createSurvey(surveyData);
      } catch (err: any) {
        expect(err.message).to.equal(
          "Validation failed: O título da pesquisa não pode estar vazio."
        );
      }
    });
  });

  describe("updateSurvey", () => {
    it("should update a survey successfully", async () => {
      const surveyData: SurveyInterface = {
        title: "Updated Title",
        publicTarget: "Updated Target",
        email: "updated@example.com",
      };

      const mockSurvey = {
        ...surveyData,
        id: 1,
        questions: surveyData.questions,
      };

      prisma.survey.findUnique = sinon.stub().resolves(mockSurvey);
      prisma.survey.update = sinon.stub().resolves(mockSurvey);

      const { survey } = await SurveyService.updateSurvey(1, surveyData);

      expect(survey).to.eql(mockSurvey);
    });

    it("should throw error if survey is not found", async () => {
      const surveyData: SurveyInterface = {
        title: "Updated Title",
        publicTarget: "Updated Target",
        email: "updated@example.com",
      };

      prisma.survey.findUnique = sinon.stub().resolves(null);

      try {
        await SurveyService.updateSurvey(1, surveyData);
      } catch (err: any) {
        expect(err.message).to.equal("A pesquisa não foi encontrada.");
      }
    });

    it("should throw error if no id is provided", async () => {
      try {
        await SurveyService.updateSurvey(0, {} as SurveyInterface);
      } catch (err: any) {
        expect(err.message).to.equal("Informe o id da pesquisa.");
      }
    });
  });
});
