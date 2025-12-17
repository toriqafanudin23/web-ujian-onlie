import axios from "axios";
import type { 
  Exam, CreateExamData, 
  Question, CreateQuestionData, 
  ExamResult, 
  QuestionBank,
  CreateQuestionBankData, 
  QuestionType 
} from "../types";

const api = axios.create({
  baseURL: "http://localhost:2000",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Helper Types & Mappers ---

// API expects UPPERCASE values for enums

// Assuming API matches docs: MULTIPLE_CHOICE, SHORT_ANSWER, ESSAY.
// Frontend: multiple_choice, short_answer, essay, photo_upload.
// Note: Docs didn't explicitly show PHOTO_UPLOAD, but we'll assume ESSAY or mapped strictly if doc allows.
// Let's assume strict mapping to what IS documented.
const toApiType = (t: QuestionType): string => t;
const fromApiType = (t: string): QuestionType => t as QuestionType;

const mapDifficultyToApi = (d?: string) => d;
const mapDifficultyFromApi = (d?: string) => d as 'easy' | 'medium' | 'hard' | undefined;

const mapGradingStatusToApi = (s: string) => s.toUpperCase();
const mapGradingStatusFromApi = (s: string) => s.toLowerCase() as 'auto_graded' | 'pending_review' | 'graded';

const mapQuestionToApi = (data: Partial<CreateQuestionData>) => {
  const { isFromBank, questionBankId, ...rest } = data;
  return {
    ...rest,
    // API docs use null for these if empty? or undefined is fine.
    // Mapping enums
    type: data.type ? toApiType(data.type) : undefined,
    difficulty: mapDifficultyToApi(data.difficulty),
    // Pass references if they exist
    questionBankId,
    isFromBank
  };
};

const mapQuestionFromApi = (data: Record<string, any>): Question => {
  return {
    ...data,
    type: fromApiType(data.type),
    difficulty: mapDifficultyFromApi(data.difficulty),
  } as Question;
};

const mapResultToApi = (data: Record<string, any>) => {
    // Convert answers Record<string, string> to Array<{questionId, answer...}>
    const answers = data.answers && typeof data.answers === 'object' && !Array.isArray(data.answers)
        ? Object.entries(data.answers).map(([questionId, answer]) => ({
            questionId,
            answer,
            manualGrade: null,
            feedback: null,
            gradingStatus: 'GRADED' // Default status for answer item
          }))
        : data.answers;

    return {
        ...data,
        answers,
        gradingStatus: data.gradingStatus ? mapGradingStatusToApi(data.gradingStatus) : undefined
    }
}

const mapResultFromApi = (data: Record<string, any>): ExamResult => {
    // Convert answers Array to Record<string, string>
    const answers: Record<string, string> = {};
    if (Array.isArray(data.answers)) {
        data.answers.forEach((ans: any) => {
            if (ans.questionId) {
                answers[ans.questionId] = ans.answer;
            }
        });
    } else if (data.answers) {
        // Fallback if already an object (though unlikely from this API)
        Object.assign(answers, data.answers);
    }

    return {
        ...data,
        answers,
        gradingStatus: mapGradingStatusFromApi(data.gradingStatus)
    } as ExamResult;
}


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
    // API generates ID and timestamps
    const response = await api.post<Exam>("/exams", data);
    return response.data;
  },
  getByCode: async (code: string) => {
    const response = await api.get<Exam[]>(`/exams?code=${code}`);
    return response.data[0];
  },
  update: async (id: string, data: Partial<CreateExamData>) => {
    // Docs specify PUT for updates
    const response = await api.put<Exam>(`/exams/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/exams/${id}`);
  },
};

export const questionApi = {
  getByExamId: async (examId: string) => {
    const response = await api.get<Record<string, any>[]>(`/questions?examId=${examId}`);
    return response.data.map(mapQuestionFromApi);
  },
  create: async (data: CreateQuestionData) => {
    const payload = mapQuestionToApi(data);
    const response = await api.post<Record<string, any>>("/questions", payload);
    return mapQuestionFromApi(response.data);
  },
  update: async (id: string, data: Partial<CreateQuestionData>) => {
    const payload = mapQuestionToApi(data);
    // Docs specify PUT for updates
    const response = await api.put<Record<string, any>>(`/questions/${id}`, payload);
    return mapQuestionFromApi(response.data);
  },
  delete: async (id: string) => {
    await api.delete(`/questions/${id}`);
  },
};

export const resultApi = {
  log: async (result: Omit<ExamResult, "id" | "submittedAt">) => {
    const payload = mapResultToApi(result);
    // API generates ID and submittedAt
    const response = await api.post<Record<string, any>>("/results", payload);
    return mapResultFromApi(response.data);
  },
  getByExamId: async (examId: string) => {
    const response = await api.get<Record<string, any>[]>(`/results?examId=${examId}`);
    return response.data.map(mapResultFromApi);
  },
  getById: async (id: string) => {
    const response = await api.get<Record<string, any>>(`/results/${id}`);
    return mapResultFromApi(response.data);
  },
  updateGrades: async (
    id: string,
    data: {
      manualGrades: Record<string, number>;
      score: number;
      gradingStatus: string;
    }
  ) => {
    // Docs specify PATCH for specific result updates like grading
    const payload = mapResultToApi(data);
    const response = await api.patch<Record<string, any>>(`/results/${id}`, payload);
    return mapResultFromApi(response.data);
  },
  delete: async (id: string) => {
    await api.delete(`/results/${id}`);
  },
};

// Question Bank API
export const questionBankApi = {
  // Get all questions from bank
  getAll: async () => {
    const response = await api.get<Record<string, any>[]>("/questionBank");
    return response.data.map(q => ({
        ...q,
        type: fromApiType(q.type),
        difficulty: mapDifficultyFromApi(q.difficulty)
    } as QuestionBank));
  },

  // Get by ID
  getById: async (id: string) => {
    const response = await api.get<Record<string, any>>(`/questionBank/${id}`);
    return {
        ...response.data,
        type: fromApiType(response.data.type),
        difficulty: mapDifficultyFromApi(response.data.difficulty)
    } as QuestionBank;
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
    if (params.difficulty) queryParams.append("difficulty", mapDifficultyToApi(params.difficulty) || '');
    if (params.type) queryParams.append("type", toApiType(params.type));
    
    // Note: The original implementation had client-side tag filtering because JSON-Server limitations.
    // If this is a real backend now, maybe it supports it? For safety, keeping query parameter passing.
    const response = await api.get<Record<string, any>[]>(`/questionBank?${queryParams.toString()}`);
    let results = response.data.map(q => ({
        ...q,
        type: fromApiType(q.type),
        difficulty: mapDifficultyFromApi(q.difficulty)
    } as QuestionBank));

    // Client-side filtering for tags (Fallback if API doesn't support 'tags_like' or exact array match)
    if (params.tags) {
      const searchTags = params.tags.toLowerCase().split(',').map(t => t.trim());
      results = results.filter(q => 
        q.tags?.some((tag: string) => 
          searchTags.some(searchTag => tag.toLowerCase().includes(searchTag))
        )
      );
    }

    return results;
  },

  // Create new question in bank
  create: async (data: CreateQuestionBankData) => {
    const payload = {
        ...data,
        type: toApiType(data.type),
        difficulty: mapDifficultyToApi(data.difficulty)
    };
    // API generates ID, createdAt, usageCount
    const response = await api.post<Record<string, any>>("/questionBank", payload);
    return {
        ...response.data,
        type: fromApiType(response.data.type),
        difficulty: mapDifficultyFromApi(response.data.difficulty)
    } as QuestionBank;
  },

  // Update question in bank
  update: async (id: string, data: Partial<CreateQuestionBankData>) => {
    const payload = {
        ...data,
        type: data.type ? toApiType(data.type) : undefined,
        difficulty: mapDifficultyToApi(data.difficulty)
    };
    
    const response = await api.patch<Record<string, any>>(`/questionBank/${id}`, payload);
    return {
        ...response.data,
        type: fromApiType(response.data.type),
        difficulty: mapDifficultyFromApi(response.data.difficulty)
    } as QuestionBank;
  },

  // Delete from bank
  delete: async (id: string) => {
    await api.delete(`/questionBank/${id}`);
  },

  // Copy question from bank to exam
  copyToExam: async (bankId: string, examId: string) => {
    const bankQuestion = await questionBankApi.getById(bankId);
    
    // Create exam question from bank
    // We already have CreateQuestionData interface compatibility in bankQuestion (mostly)
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
      rubric: undefined, // Type compatibility
      sampleAnswer: undefined,
      keywords: undefined
    });

    // Increment usage count - assumed separate call to bank API
    // Using PATCH as usage count update is partial
    await api.patch(`/questionBank/${bankId}`, {
      usageCount: (bankQuestion.usageCount || 0) + 1,
    });

    return examQuestion;
  },

  // Bulk copy multiple questions to exam
  bulkCopyToExam: async (bankIds: string[], examId: string) => {
    const promises = bankIds.map(bankId => questionBankApi.copyToExam(bankId, examId));
    return Promise.all(promises);
  },
};
