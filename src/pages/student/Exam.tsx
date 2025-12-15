import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchExamById } from "../../store/slices/examSlice";
import { fetchQuestionsByExamId } from "../../store/slices/questionSlice";
import { resultApi } from "../../services/api";
import { useExamSecurity } from "../../hooks/useExamSecurity";

import Modal from "../../components/Modal";
import ExamHeader from "../../components/exam/ExamHeader";
import QuestionNavigator from "../../components/exam/QuestionNavigator";
import QuestionCard from "../../components/exam/QuestionCard";
import ExamResultSummary from "../../components/exam/ExamResultSummary";

// Constants for file upload validation
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
] as const;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const FILE_TYPE_ERROR_MESSAGE =
  "Format file tidak valid. Gunakan JPG, PNG, atau PDF";
const FILE_SIZE_ERROR_MESSAGE = "Ukuran file terlalu besar. Maksimal 5MB";

// Constants for exam security
const MAX_VIOLATIONS = 5;
const FULLSCREEN_EXIT_MESSAGE =
  "Mohon tetap dalam mode fullscreen selama ujian!";
const TAB_SWITCH_MESSAGE =
  "Terdeteksi perpindahan tab. Tetap fokus pada ujian!";
const MAX_VIOLATIONS_MESSAGE = "Terlalu banyak pelanggaran terdeteksi!";
const EXAM_START_FULLSCREEN_MESSAGE = "Ujian dimulai dalam mode fullscreen";

export default function StudentExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const studentName = location.state?.studentName;

  const {
    currentExam,
    loading: examLoading,
    error: examError,
  } = useSelector((state: RootState) => state.exams);
  const {
    items: questions,
    loading: questionsLoading,
    error: questionsError,
  } = useSelector((state: RootState) => state.questions);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  // Initialize exam security with fullscreen
  const { requestFullscreen, exitFullscreen } = useExamSecurity({
    enabled: !isSubmitted,
    requireFullscreen: true,
    maxViolations: MAX_VIOLATIONS,
    onViolation: (type) => {
      if (type === "fullscreen_exit") {
        toast.error(FULLSCREEN_EXIT_MESSAGE);
      } else if (type === "tab_switch") {
        toast(TAB_SWITCH_MESSAGE, {
          icon: "⚠️",
        });
      }
    },
    onMaxViolationsReached: () => {
      toast.error(MAX_VIOLATIONS_MESSAGE);
    },
  });

  useEffect(() => {
    if (!studentName) {
      toast.error("Nama peserta tidak ditemukan. Mohon login ulang.");
      navigate("/");
      return;
    }

    if (examId) {
      dispatch(fetchQuestionsByExamId(examId));
      dispatch(fetchExamById(examId));
    }
  }, [examId, dispatch, studentName, navigate]);

  useEffect(() => {
    if (currentExam) {
      setTimeLeft(currentExam.duration * 60);
    }
  }, [currentExam]);

  // Auto-enter fullscreen when exam starts
  useEffect(() => {
    if (currentExam && timeLeft > 0 && !isSubmitted) {
      requestFullscreen();
      toast.success(EXAM_START_FULLSCREEN_MESSAGE);
    }
  }, [currentExam, requestFullscreen, isSubmitted]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswer = (answer: string) => {
    if (isSubmitted) return;
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: answer,
      }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    // Validate file type
    if (!(ALLOWED_FILE_TYPES as readonly string[]).includes(file.type)) {
      toast.error(FILE_TYPE_ERROR_MESSAGE);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(FILE_SIZE_ERROR_MESSAGE);
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: base64,
      }));
      toast.success("Foto berhasil diunggah");
    };
    reader.onerror = () => {
      toast.error("Gagal mengunggah foto");
    };
    reader.readAsDataURL(file);
  };

  /**
   * Calculates the current score based on selected answers.
   * Auto-grades multiple choice questions.
   * Identifies if manual grading is required for essay/short answer questions.
   * @returns {Object} breakdown of score, correct count, and manual grading status
   */
  const calculateScore = () => {
    let newScore = 0;
    let newCorrectCount = 0;
    let hasManualGrading = false;

    questions.forEach((q) => {
      const answer = answers[q.id];
      if (!answer) return;

      if (q.type === "multiple_choice" && q.options) {
        const correctOption = q.options.find((opt) => opt.isCorrect);
        if (correctOption && answer === correctOption.id) {
          newScore += q.points;
          newCorrectCount++;
        }
      } else if (
        q.type === "short_answer" ||
        q.type === "essay" ||
        q.type === "photo_upload"
      ) {
        // All these need manual grading
        hasManualGrading = true;
      }
    });

    setScore(newScore);
    setCorrectCount(newCorrectCount);
    return { newScore, newCorrectCount, hasManualGrading };
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!isAutoSubmit && !submitModalOpen && !isSubmitted) {
      /* check if open via button */ setSubmitModalOpen(true);
      return;
    }

    // If modal confirm (manual submit from modal) OR auto submit
    if (!isAutoSubmit) {
      setSubmitModalOpen(false); // Close modal if open
    }

    const { newScore, newCorrectCount, hasManualGrading } = calculateScore();
    setIsSubmitted(true);
    setIsSaving(true);

    try {
      if (!examId || !studentName) return;

      await resultApi.log({
        examId,
        studentName,
        score: newScore,
        correctCount: newCorrectCount,
        totalQuestions: questions.length,
        answers,
        gradingStatus: hasManualGrading ? "pending_review" : "auto_graded",
      });
      toast.success("Ujian berhasil dikumpulkan!");
    } catch (err) {
      console.error("Failed to save result", err);
      toast.error(
        "Gagal menyimpan hasil ujian, namun skor Anda telah direkam lokal."
      );
    } finally {
      setIsSaving(false);
      // Exit fullscreen when exam is submitted
      exitFullscreen();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (examLoading || questionsLoading) return <LoadingSpinner />;
  if (examError || questionsError)
    return <ErrorMessage message={examError || questionsError || "Error"} />;
  if (!currentExam) return <ErrorMessage message="Ujian tidak ditemukan" />;

  // Result View
  if (isSubmitted) {
    return (
      <ExamResultSummary
        score={score}
        correctCount={correctCount}
        totalQuestions={questions.length}
        onHome={() => navigate("/")}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <ExamHeader title={currentExam.title} timeLeft={formatTime(timeLeft)} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Question Area */}
        <div className="lg:col-span-3 space-y-6">
          {currentQuestion ? (
            <QuestionCard
              question={currentQuestion}
              questionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              answer={answers[currentQuestion.id]}
              onAnswer={handleAnswer}
              onPhotoUpload={handlePhotoUpload}
              onNext={handleNextQuestion}
              onPrev={handlePreviousQuestion}
              onSubmit={handleSubmit}
              isSaving={isSaving}
            />
          ) : (
            <div className="text-center py-12 text-slate-500">
              Tidak ada soal dalam ujian ini.
            </div>
          )}
        </div>

        {/* Navigation Map */}
        <div className="lg:col-span-1">
          <QuestionNavigator
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            onNavigate={setCurrentQuestionIndex}
          />
        </div>
      </main>

      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Selesaikan Ujian?"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSubmitModalOpen(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
            >
              Lanjutkan Mengerjakan
            </button>
            <button
              onClick={() => handleSubmit(false)} // Pass false to indicate this is confirmed manual submit
              className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              Ya, Selesaikan
            </button>
          </div>
        }
      >
        <p className="text-slate-600 dark:text-slate-300">
          Apakah Anda yakin ingin menyelesaikan ujian? Pastikan Anda telah
          memeriksa kembali semua jawaban Anda.
        </p>
      </Modal>
    </div>
  );
}
