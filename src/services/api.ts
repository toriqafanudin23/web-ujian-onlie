import axios from "axios";
import type { Exam, CreateExamData, Question, CreateQuestionData, ExamResult, QuestionBank, CreateQuestionBankData, QuestionType } from "../types";

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

// Question Bank API
export const questionBankApi = {
  // Get all questions from bank
  getAll: async () => {
    const response = await api.get<QuestionBank[]>("/questionBank");
    return response.data;
  },

  // Get by ID
  getById: async (id: string) => {
    const response = await api.get<QuestionBank>(`/questionBank/${id}`);
    return response.data;
  },

  // Search & filter questions
  search: async (params: {
    subject?: string;
    topic?: string;
    difficulty?: string;
    type?: QuestionType;
    tags?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.subject) queryParams.append("subject", params.subject);
    if (params.topic) queryParams.append("topic", params.topic);
    if (params.difficulty) queryParams.append("difficulty", params.difficulty);
    if (params.type) queryParams.append("type", params.type);
    
    const response = await api.get<QuestionBank[]>(`/questionBank?${queryParams.toString()}`);
    let results = response.data;

    // Client-side filtering for tags (JSON Server doesn't support array search well)
    if (params.tags) {
      const searchTags = params.tags.toLowerCase().split(',').map(t => t.trim());
      results = results.filter(q => 
        q.tags.some(tag => 
          searchTags.some(searchTag => tag.toLowerCase().includes(searchTag))
        )
      );
    }

    return results;
  },

  // Create new question in bank
  create: async (data: CreateQuestionBankData) => {
    const newQuestion: QuestionBank = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };
    const response = await api.post<QuestionBank>("/questionBank", newQuestion);
    return response.data;
  },

  // Update question in bank
  update: async (id: string, data: Partial<CreateQuestionBankData>) => {
    const response = await api.patch<QuestionBank>(`/questionBank/${id}`, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete from bank
  delete: async (id: string) => {
    await api.delete(`/questionBank/${id}`);
  },

  // Copy question from bank to exam
  copyToExam: async (bankId: string, examId: string) => {
    const bankQuestion = await questionBankApi.getById(bankId);
    
    // Create exam question from bank
    const examQuestion = await questionApi.create({
      examId,
      type: bankQuestion.type,
      text: bankQuestion.text,
      points: bankQuestion.points,
      options: bankQuestion.options,
      correctAnswer: bankQuestion.correctAnswer,
      imageUrl: bankQuestion.imageUrl,
      difficulty: bankQuestion.difficulty,
      tags: bankQuestion.tags,
      // Add reference fields
      questionBankId: bankId,
      isFromBank: true,
    });

    // Increment usage count
    await api.patch(`/questionBank/${bankId}`, {
      usageCount: bankQuestion.usageCount + 1,
    });

    return examQuestion;
  },

  // Bulk copy multiple questions to exam
  bulkCopyToExam: async (bankIds: string[], examId: string) => {
    const promises = bankIds.map(bankId => questionBankApi.copyToExam(bankId, examId));
    return Promise.all(promises);
  },
};
