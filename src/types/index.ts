export type QuestionType = "multiple_choice" | "short_answer" | "essay" | "photo_upload";

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

// Grading Rubric for subjective questions
export interface GradingCriteria {
  name: string;
  maxPoints: number;
  description: string;
}

export interface GradeTemplate {
  label: string; // "Excellent", "Good", "Fair", "Poor"
  percentage: number;
  comment?: string;
}

export interface GradingRubric {
  id: string;
  questionId: string;
  criteria: GradingCriteria[];
  templates: GradeTemplate[];
}

export interface Question {
  id: string;
  examId: string;
  type: QuestionType;
  text: string;
  points: number;
  options?: Option[];
  correctAnswer?: string;
  imageUrl?: string;
  // New fields for advanced features
  rubric?: GradingRubric;
  sampleAnswer?: string;
  keywords?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  // Question Bank reference
  questionBankId?: string; // Reference to question bank
  isFromBank?: boolean;    // Flag if copied from bank
}

// Security Settings for Exams
export interface SecuritySettings {
  requireFullscreen: boolean;
  enableProctoring: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  disableCopyPaste: boolean;
  maxViolations: number;
  allowBackNavigation: boolean;
  enableOfflineMode: boolean;
}

// Grading Settings for Exams
export interface GradingSettings {
  autoReleaseGrades: boolean;
  requireReview: boolean;
  assignedGraders?: string[];
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  code: string;
  duration: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  // New fields
  securitySettings?: SecuritySettings;
  gradingSettings?: GradingSettings;
}

export interface CreateExamData {
  title: string;
  description: string;
  code: string;
  duration: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  securitySettings?: SecuritySettings;
  gradingSettings?: GradingSettings;
}

export interface CreateQuestionData {
  examId: string;
  type: QuestionType;
  text: string;
  points: number;
  options?: Option[];
  correctAnswer?: string;
  imageUrl?: string;
  rubric?: GradingRubric;
  sampleAnswer?: string;
  keywords?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  // Question Bank reference
  questionBankId?: string;
  isFromBank?: boolean;
}

// Activity Log Entry
export interface ActivityLogEntry {
  action: string;
  timestamp: string;
  metadata?: any;
}

// Proctoring Data
export interface ProctoringData {
  webcamPhotos?: string[];
  suspiciousActivities: Array<{
    type: 'tab_switch' | 'fullscreen_exit' | 'multiple_faces' | 'no_face' | 'copy_paste' | 'network_disconnect';
    timestamp: string;
    metadata?: any;
  }>;
  ipAddress?: string;
  deviceFingerprint?: string;
  browserInfo?: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentName: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  answers: Record<string, string>; // questionId -> answer text or photo data URL
  manualGrades?: Record<string, number>; // questionId -> manual score given by admin
  gradingStatus: 'auto_graded' | 'pending_review' | 'graded';
  submittedAt: string;
  // New fields for enhanced features
  feedback?: Record<string, string>; // questionId -> rich text feedback
  proctoringData?: ProctoringData;
  activityLog?: ActivityLogEntry[];
  violationCount?: number;
  flaggedForReview?: boolean;
  gradedBy?: string;
  gradedAt?: string;
  annotatedPhotos?: Record<string, string>; // questionId -> annotated photo base64
}

// Grading Comment Template
export interface CommentTemplate {
  id: string;
  category: string;
  text: string;
  createdAt: string;
}

// Question Bank
export interface QuestionBank {
  id: string;
  type: QuestionType;
  text: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  points: number;
  imageUrl?: string;
  options?: Option[];
  correctAnswer?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  usageCount: number;
  isPublic: boolean;
}

export interface CreateQuestionBankData {
  type: QuestionType;
  text: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  points: number;
  imageUrl?: string;
  options?: Option[];
  correctAnswer?: string;
  createdBy: string;
  isPublic: boolean;
}

