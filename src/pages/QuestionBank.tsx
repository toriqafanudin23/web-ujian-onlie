import { useState } from "react";
import { Link } from "react-router-dom";
import { PiGraduationCapBold } from "react-icons/pi";
import {
  IoHomeOutline,
  IoBookOutline,
  IoSearchOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoFilterOutline,
} from "react-icons/io5";
import { HiOutlinePlus } from "react-icons/hi";
import { useQuestionBank } from "../hooks/useQuestionBank";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Modal from "../components/Modal";
import LatexRenderer from "../components/LatexRenderer";
import toast from "react-hot-toast";
import ThemeToggle from "../components/ThemeToggle";
import type { QuestionType, QuestionBank } from "../types";

export default function QuestionBank() {
  const {
    questions,
    isLoading,
    error,
    searchQuestions,
    deleteQuestion,
    fetchQuestions,
  } = useQuestionBank();

  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<{
    subject?: string;
    topic?: string;
    difficulty?: string;
    type?: QuestionType;
    tags?: string;
  }>({});

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<{
    id: string;
    text: string;
  } | null>(null);

  const confirmDelete = (id: string, text: string) => {
    setQuestionToDelete({ id, text });
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!questionToDelete) return;
    try {
      await deleteQuestion(questionToDelete.id);
      toast.success("Soal berhasil dihapus dari bank");
      setDeleteModalOpen(false);
      setQuestionToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus soal");
    }
  };

  const handleSearch = () => {
    searchQuestions(filters);
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchText("");
    fetchQuestions();
  };

  // Get unique subjects and topics for filter dropdowns
  const uniqueSubjects = Array.from(new Set(questions.map((q) => q.subject)));
  const uniqueTopics = Array.from(new Set(questions.map((q) => q.topic)));

  // Difficulty badge colors
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "medium":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
      case "hard":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
    }
  };

  // Type badge colors
  const getTypeColor = (type: QuestionType) => {
    switch (type) {
      case "multiple_choice":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      case "short_answer":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
      case "essay":
        return "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400";
      case "photo_upload":
        return "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
    }
  };

  const getTypeLabel = (type: QuestionType) => {
    const labels = {
      multiple_choice: "Pilihan Ganda",
      short_answer: "Jawaban Singkat",
      essay: "Essay",
      photo_upload: "Upload Foto",
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <PiGraduationCapBold className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-800 dark:text-white">
                ExamPro
              </span>
              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-md">
                Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              <IoHomeOutline className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <IoBookOutline className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Question Bank
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Kelola koleksi soal yang dapat digunakan ulang di berbagai ujian
          </p>
        </div>

        {/* Filter & Search Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan kata kunci atau tag..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setFilters({ ...filters, tags: e.target.value });
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg font-medium transition-colors ${
                showFilters
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              <IoFilterOutline className="w-5 h-5" />
              Filters
            </button>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
            >
              Cari
            </button>

            {/* Add New Button */}
            <Link
              to="/admin/question-bank/create"
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
            >
              <HiOutlinePlus className="w-5 h-5" />
              Tambah Soal
            </Link>
          </div>

          {/* Advanced Filters (Collapsible) */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Subject Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Subject
                </label>
                <select
                  value={filters.subject || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      subject: e.target.value || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Semua Subject</option>
                  {uniqueSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Topic
                </label>
                <select
                  value={filters.topic || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      topic: e.target.value || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Semua Topic</option>
                  {uniqueTopics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      difficulty: e.target.value || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Semua Level</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Type
                </label>
                <select
                  value={filters.type || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      type: e.target.value
                        ? (e.target.value as QuestionType)
                        : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Semua Tipe</option>
                  <option value="multiple_choice">Pilihan Ganda</option>
                  <option value="short_answer">Jawaban Singkat</option>
                  <option value="essay">Essay</option>
                  <option value="photo_upload">Upload Foto</option>
                </select>
              </div>

              {/* Reset Button */}
              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Total Soal
            </p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {questions.length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Total Penggunaan
            </p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {questions.reduce((sum, q) => sum + q.usageCount, 0)}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Subjects
            </p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {uniqueSubjects.length}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Error State */}
        {error && <ErrorMessage message={error} onRetry={fetchQuestions} />}

        {/* Questions List */}
        {!isLoading && !error && (
          <>
            {questions.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <IoBookOutline className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  Belum Ada Soal di Bank
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Mulai tambahkan soal ke bank untuk dapat digunakan ulang
                </p>
                <Link
                  to="/admin/question-bank/create"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <HiOutlinePlus className="w-4 h-4" />
                  Tambah Soal
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-md ${getTypeColor(
                              question.type
                            )}`}
                          >
                            {getTypeLabel(question.type)}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-md ${getDifficultyColor(
                              question.difficulty
                            )}`}
                          >
                            {question.difficulty.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {question.subject}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {question.topic}
                          </span>
                          {question.usageCount > 0 && (
                            <span className="px-2 py-1 text-xs font-semibold rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                              Used {question.usageCount}x
                            </span>
                          )}
                        </div>

                        {/* Question Text */}
                        <div className="text-slate-700 dark:text-slate-200">
                          <LatexRenderer>{question.text}</LatexRenderer>
                        </div>

                        {/* Tags */}
                        {question.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {question.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 text-xs rounded bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                          <span>Points: {question.points}</span>
                          <span>•</span>
                          <span>By: {question.createdBy}</span>
                          {question.isPublic && (
                            <>
                              <span>•</span>
                              <span className="text-green-600 dark:text-green-400">
                                Public
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
                        <button
                          className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
                          title="Edit"
                        >
                          <IoPencilOutline className="w-5 h-5" />
                        </button>
                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
                        <button
                          onClick={() =>
                            confirmDelete(question.id, question.text)
                          }
                          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
                          title="Hapus"
                        >
                          <IoTrashOutline className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Hapus Soal"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors"
            >
              Hapus
            </button>
          </div>
        }
      >
        <p className="text-slate-600 dark:text-slate-300">
          Apakah Anda yakin ingin menghapus soal ini dari bank? Tindakan ini
          tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  );
}
