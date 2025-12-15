import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PiGraduationCapBold } from "react-icons/pi";
import { IoArrowBack, IoSaveOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import LatexRenderer from "../components/LatexRenderer";
import { resultApi, questionApi } from "../services/api";
import type { ExamResult, Question } from "../types";
import ThemeToggle from "../components/ThemeToggle";

export default function GradeSubmission() {
  const { examId, resultId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState<ExamResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [manualGrades, setManualGrades] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!resultId || !examId) return;

        const [resultData, questionsData] = await Promise.all([
          resultApi.getById(resultId),
          questionApi.getByExamId(examId),
        ]);

        setResult(resultData);
        setQuestions(questionsData);

        // Initialize manual grades with existing grades or empty
        if (resultData.manualGrades) {
          setManualGrades(resultData.manualGrades);
        }
        if (resultData.feedback) {
          setFeedback(resultData.feedback);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
        toast.error("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resultId, examId]);

  const handleGradeChange = (questionId: string, grade: string) => {
    const numGrade = parseFloat(grade);
    setManualGrades((prev) => ({
      ...prev,
      [questionId]: isNaN(numGrade) ? 0 : numGrade,
    }));
  };

  const calculateFinalScore = () => {
    let totalScore = 0;

    questions.forEach((q) => {
      const answer = result?.answers[q.id];
      if (!answer) return;

      // Only auto-grade multiple choice
      if (q.type === "multiple_choice" && q.options) {
        const correctOption = q.options.find((opt) => opt.isCorrect);
        if (correctOption && answer === correctOption.id) {
          totalScore += q.points;
        }
      }

      // Manual graded questions (short_answer, essay, photo_upload)
      if (
        q.type === "short_answer" ||
        q.type === "essay" ||
        q.type === "photo_upload"
      ) {
        totalScore += manualGrades[q.id] || 0;
      }
    });

    return totalScore;
  };

  const handleSave = async () => {
    if (!resultId) return;

    setSaving(true);
    try {
      const finalScore = calculateFinalScore();

      await resultApi.updateGrades(resultId, {
        manualGrades,
        feedback,
        score: finalScore,
        gradingStatus: "graded",
        gradedBy: "Admin",
        gradedAt: new Date().toISOString(),
      } as any);

      toast.success("Penilaian berhasil disimpan!");
      navigate(`/admin/ujian/${examId}/hasil`);
    } catch (err) {
      console.error("Failed to save grades", err);
      toast.error("Gagal menyimpan penilaian");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!result || questions.length === 0)
    return <ErrorMessage message="Data tidak ditemukan" />;

  const finalScore = calculateFinalScore();
  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
              <PiGraduationCapBold className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-800 dark:text-white">
                ExamPro
              </span>
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-md">
                Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to={`/admin/ujian/${examId}/hasil`}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              <IoArrowBack className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Kembali</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Student Info Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                Penilaian Manual
              </h1>
              <div className="mt-3 space-y-1">
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-semibold">Nama Siswa:</span>{" "}
                  {result.studentName}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-semibold">Waktu Pengumpulan:</span>{" "}
                  {new Date(result.submittedAt).toLocaleString("id-ID")}
                </p>
                {result.violationCount !== undefined &&
                  result.violationCount > 0 && (
                    <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                        ⚠️ Pelanggaran Keamanan: {result.violationCount} kali
                      </p>
                      {result.flaggedForReview && (
                        <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
                          Submission ini ditandai untuk review lebih lanjut
                        </p>
                      )}
                    </div>
                  )}
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl px-6 py-4">
                <div className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-1">
                  Nilai Saat Ini
                </div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {finalScore} / {maxScore}
                </div>
              </div>
            </div>
          </div>

          {/* Security Info */}
          {result.proctoringData && (
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-3 text-sm">
                Data Keamanan
              </h3>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">
                    IP Address
                  </p>
                  <p className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {result.proctoringData.ipAddress || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Browser</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    {result.proctoringData.browserInfo?.substring(0, 30) ||
                      "N/A"}
                    ...
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">
                    Aktivitas Mencurigakan
                  </p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    {result.proctoringData.suspiciousActivities?.length || 0}{" "}
                    kejadian
                  </p>
                </div>
              </div>
              {result.proctoringData.suspiciousActivities &&
                result.proctoringData.suspiciousActivities.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Log Aktivitas Mencurigakan:
                    </p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {result.proctoringData.suspiciousActivities.map(
                        (activity, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded"
                          >
                            <span className="font-mono">
                              {new Date(activity.timestamp).toLocaleTimeString(
                                "id-ID"
                              )}
                            </span>
                            {" - "}
                            <span className="font-semibold">
                              {activity.type.replace("_", " ")}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((question, index) => {
            const answer = result.answers[question.id];
            const isManualGrade =
              question.type === "essay" ||
              question.type === "photo_upload" ||
              question.type === "short_answer"; // Allow manual grading for ALL short_answer

            let isCorrect = false;
            let isAutoGraded = false;
            if (question.type === "multiple_choice" && question.options) {
              const correctOption = question.options.find(
                (opt) => opt.isCorrect
              );
              isCorrect = correctOption?.id === answer;
              isAutoGraded = true;
            } else if (
              question.type === "short_answer" &&
              question.correctAnswer
            ) {
              isCorrect =
                answer?.toLowerCase().trim() ===
                question.correctAnswer.toLowerCase().trim();
              isAutoGraded = true;
            }
            // Note: short_answer is now always manually graded for flexibility

            return (
              <div
                key={question.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6"
              >
                {/* Question Header */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold px-2 py-1 rounded uppercase">
                        {question.type.replace("_", " ")}
                      </span>
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold px-2 py-1 rounded">
                        {question.points} Poin
                      </span>
                      {isAutoGraded && (
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            isCorrect
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {isCorrect ? "✓ Benar" : "✗ Salah"}
                        </span>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-none text-slate-800 dark:text-white">
                      {question.imageUrl && (
                        <img
                          src={question.imageUrl}
                          alt="Question"
                          className="rounded-lg border border-slate-200 dark:border-slate-700 max-h-48 mb-3"
                        />
                      )}
                      <LatexRenderer>{question.text}</LatexRenderer>
                    </div>
                  </div>
                </div>

                {/* Answer Display */}
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Jawaban Siswa:
                  </div>
                  {!answer ? (
                    <p className="text-slate-500 dark:text-slate-400 italic">
                      Tidak dijawab
                    </p>
                  ) : question.type === "multiple_choice" &&
                    question.options ? (
                    <div className="space-y-2">
                      {question.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-2 rounded border ${
                            opt.id === answer
                              ? opt.isCorrect
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                              : opt.isCorrect
                              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                              : "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                          }`}
                        >
                          <span className="font-bold mr-2 text-slate-700 dark:text-slate-300">
                            {opt.id.toUpperCase()}.
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">
                            <LatexRenderer>{opt.text}</LatexRenderer>
                          </span>
                          {opt.id === answer && !opt.isCorrect && (
                            <span className="ml-2 text-red-600 dark:text-red-400 text-xs">
                              (Dipilih)
                            </span>
                          )}
                          {opt.isCorrect && (
                            <span className="ml-2 text-green-600 dark:text-green-400 text-xs">
                              (Jawaban Benar)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : answer.startsWith("data:image/") ? (
                    <div>
                      <img
                        src={answer}
                        alt="Student Answer"
                        className="max-h-96 rounded-lg border border-slate-300 dark:border-slate-600"
                      />
                    </div>
                  ) : answer.startsWith("data:application/pdf") ? (
                    <p className="text-slate-700 dark:text-slate-300">
                      📄 PDF File
                    </p>
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {answer}
                    </p>
                  )}
                </div>

                {/* Manual Grading Input */}
                {isManualGrade && (
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Nilai Manual (Max: {question.points})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={question.points}
                        step="0.5"
                        value={manualGrades[question.id] || 0}
                        onChange={(e) =>
                          handleGradeChange(question.id, e.target.value)
                        }
                        className="w-full sm:w-40 px-4 py-2 bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 text-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Feedback untuk Siswa
                      </label>
                      <textarea
                        value={feedback[question.id] || ""}
                        onChange={(e) =>
                          setFeedback((prev) => ({
                            ...prev,
                            [question.id]: e.target.value,
                          }))
                        }
                        placeholder="Berikan feedback untuk siswa..."
                        rows={4}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 text-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Link
            to={`/admin/ujian/${examId}/hasil`}
            className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Kembali ke Daftar Hasil
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {saving ? (
              "Menyimpan..."
            ) : (
              <>
                <IoSaveOutline className="w-5 h-5" />
                Simpan Penilaian
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
