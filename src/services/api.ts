import axios from "axios";
import type { Exam, CreateExamData, Question, CreateQuestionData, ExamResult } from "../types";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const examApi = {
  getAll: async () => {
    const response = await api.get<Exam[]>("/exams");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Exam>(`/exams/${id}`);
    return response.data;
  },
  create: async (data: CreateExamData) => {
    const newExam: Exam = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const response = await api.post<Exam>("/exams", newExam);
    return response.data;
  },
  getByCode: async (code: string) => {
    const response = await api.get<Exam[]>(`/exams?code=${code}`);
    return response.data[0];
  },
  update: async (id: string, data: Partial<CreateExamData>) => {
    const response = await api.patch<Exam>(`/exams/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/exams/${id}`);
  },
};

export const questionApi = {
  getByExamId: async (examId: string) => {
    const response = await api.get<Question[]>(`/questions?examId=${examId}`);
    return response.data;
  },
  create: async (data: CreateQuestionData) => {
    const response = await api.post<Question>("/questions", {
      ...data,
      id: crypto.randomUUID(),
    });
    return response.data;
  },
  update: async (id: string, data: Partial<CreateQuestionData>) => {
    const response = await api.patch<Question>(`/questions/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/questions/${id}`);
  },
};

export const resultApi = {
  log: async (result: Omit<ExamResult, "id" | "submittedAt">) => {
    const newResult: ExamResult = {
      ...result,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    };
    const response = await api.post<ExamResult>("/results", newResult);
    return response.data;
  },
  getByExamId: async (examId: string) => {
    const response = await api.get<ExamResult[]>(`/results?examId=${examId}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ExamResult>(`/results/${id}`);
    return response.data;
  },
  updateGrades: async (
    id: string,
    data: {
      manualGrades: Record<string, number>;
      score: number;
      gradingStatus: string;
    }
  ) => {
    const response = await api.patch<ExamResult>(`/results/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/results/${id}`);
  },
};
