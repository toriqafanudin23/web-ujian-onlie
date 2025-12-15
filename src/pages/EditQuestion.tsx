import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PiGraduationCapBold } from "react-icons/pi";
import {
  IoArrowBack,
  IoSaveOutline,
  IoAddCircleOutline,
  IoTrashOutline,
  IoCheckmarkCircle,
  IoPencilOutline,
} from "react-icons/io5";
import { MdRadioButtonUnchecked } from "react-icons/md";
import toast from "react-hot-toast";
import { useQuestions } from "../hooks/useQuestions";
import LatexRenderer from "../components/LatexRenderer";
import type { QuestionType, Option, Question } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ThemeToggle from "../components/ThemeToggle";

import Modal from "../components/Modal";

export default function EditQuestion() {
  const { examId } = useParams();
  const {
    questions,
    loading,
    error,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    refetch,
  } = useQuestions(examId || "");

  const [type, setType] = useState<QuestionType>("multiple_choice");
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [points, setPoints] = useState(10);
  const [options, setOptions] = useState<Option[]>([
    { id: "a", text: "", isCorrect: false },
    { id: "b", text: "", isCorrect: false },
    { id: "c", text: "", isCorrect: false },
    { id: "d", text: "", isCorrect: false },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  // Edit mode state
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);

  // Removed previewMode state as we will show inline preview

  const handleAddOption = () => {
    if (options.length >= 6) return;
    const newId = String.fromCharCode(97 + options.length);
    setOptions([...options, { id: newId, text: "", isCorrect: false }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions(options.filter((opt) => opt.id !== id));
  };

  const handleOptionTextChange = (id: string, newText: string) => {
    setOptions(
      options.map((opt) => (opt.id === id ? { ...opt, text: newText } : opt))
    );
  };

  const handleCorrectOptionChange = (id: string) => {
    setOptions(options.map((opt) => ({ ...opt, isCorrect: opt.id === id })));
  };

  const resetForm = () => {
    setText("");
    setImageUrl("");
    setPoints(10);
    setType("multiple_choice");
    setOptions([
      { id: "a", text: "", isCorrect: false },
      { id: "b", text: "", isCorrect: false },
      { id: "c", text: "", isCorrect: false },
      { id: "d", text: "", isCorrect: false },
    ]);
    setCorrectAnswer("");
    setIsEditMode(false);
    setEditingQuestionId(null);
  };

  const handleEditQuestion = (question: Question) => {
    setIsEditMode(true);
    setEditingQuestionId(question.id);
    setType(question.type);
    setText(question.text);
    setImageUrl(question.imageUrl || "");
    setPoints(question.points);

    if (question.type === "multiple_choice" && question.options) {
      setOptions(question.options);
    } else if (question.type === "short_answer" && question.correctAnswer) {
      setCorrectAnswer(question.correctAnswer);
    }

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examId) return;

    try {
      const questionData = {
        examId,
        type,
        text,
        points,
        imageUrl: imageUrl || undefined,
        options: type === "multiple_choice" ? options : undefined,
        correctAnswer: type === "multiple_choice" ? undefined : correctAnswer,
      };

      if (isEditMode && editingQuestionId) {
        await updateQuestion(editingQuestionId, questionData);
        toast.success("Soal berhasil diperbarui!");
      } else {
        await createQuestion(questionData);
        toast.success("Soal berhasil ditambahkan!");
      }
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(
        isEditMode ? "Gagal memperbarui soal" : "Gagal menambahkan soal"
      );
    }
  };

  const confirmDelete = (id: string) => {
    setQuestionToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!questionToDelete) return;
    try {
      await deleteQuestion(questionToDelete);
      toast.success("Soal berhasil dihapus");
      setDeleteModalOpen(false);
      setQuestionToDelete(null);

      // If deleting the question being edited, reset form
      if (questionToDelete === editingQuestionId) {
        resetForm();
      }
    } catch (err) {
      toast.error("Gagal menghapus soal");
    }
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
              <IoArrowBack className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Kembali</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Form Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          {/* Card Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 bg-primary-50 dark:bg-primary-900/20 px-6 py-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                {isEditMode ? "Edit Soal" : "Tambah Soal Baru"}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {isEditMode
                  ? "Perbarui soal yang sudah ada"
                  : "Buat soal dengan dukungan LaTeX untuk notasi matematika"}
              </p>
            </div>
            {isEditMode && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Batal Edit
              </button>
            )}
          </div>

          {/* Card Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Tipe Soal & Poin */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Tipe Soal */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Tipe Soal <span className="text-red-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as QuestionType)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-all duration-200 cursor-pointer"
                >
                  <option value="multiple_choice">Pilihan Ganda</option>
                  <option value="short_answer">Isian Singkat</option>
                  <option value="essay">Uraian</option>
                  <option value="photo_upload">Upload Foto</option>
                </select>
              </div>

              {/* Poin */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Poin <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Text Soal */}
            <div className="space-x-4">
              {/* Image URL Input */}
              <div className="space-y-2 mb-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  URL Gambar (Opsional)
                </label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-all duration-200"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Masukkan URL gambar langsung (akhiran .jpg, .png, dll)
                    </p>
                  </div>
                  {imageUrl && (
                    <div className="w-32 h-32 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 relative group">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/150?text=Error";
                          toast.error("Gagal memuat gambar");
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Teks Soal <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                    (Mendukung LaTeX: $...$)
                  </span>
                </label>
                <textarea
                  placeholder="Tulis pertanyaan di sini... Gunakan $ untuk rumus matematika"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-all duration-200 resize-none"
                  required
                />

                {/* Live Preview - Only show if text contains $ */}
                {text.includes("$") && (
                  <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                      Preview:
                    </p>
                    <div className="prose prose-sm max-w-none text-slate-800 dark:text-white">
                      <LatexRenderer>{text}</LatexRenderer>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pilihan Jawaban (Multiple Choice) */}
            {type === "multiple_choice" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Pilihan Jawaban
                  </label>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    disabled={options.length >= 6}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <IoAddCircleOutline className="w-4 h-4" />
                    Tambah Pilihan
                  </button>
                </div>

                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={option.id} className="flex items-center gap-3">
                      {/* Label */}
                      <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold shrink-0">
                        {String.fromCharCode(65 + index)}
                      </span>

                      {/* Input */}
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder={`Pilihan ${String.fromCharCode(
                            65 + index
                          )}`}
                          value={option.text}
                          onChange={(e) =>
                            handleOptionTextChange(option.id, e.target.value)
                          }
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-all duration-200"
                        />
                        {/* Option Preview - Only show if text contains $ */}
                        {option.text.includes("$") && (
                          <div className="mt-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded text-sm text-slate-700 dark:text-slate-300">
                            <LatexRenderer>{option.text}</LatexRenderer>
                          </div>
                        )}
                      </div>

                      {/* Correct Button */}
                      <button
                        type="button"
                        onClick={() => handleCorrectOptionChange(option.id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                          option.isCorrect
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-500"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {option.isCorrect ? (
                          <>
                            <IoCheckmarkCircle className="w-5 h-5" />
                            <span className="hidden sm:inline">Benar</span>
                          </>
                        ) : (
                          <>
                            <MdRadioButtonUnchecked className="w-5 h-5" />
                            <span className="hidden sm:inline">Tandai</span>
                          </>
                        )}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(option.id)}
                        disabled={options.length <= 2}
                        className="p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                        title="Hapus pilihan"
                      >
                        <IoTrashOutline className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Jawaban Benar (Short Answer) */}
            {type === "short_answer" && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Jawaban Benar (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Jawaban yang benar..."
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-all duration-200"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Untuk penilaian otomatis (opsional)
                </p>
              </div>
            )}

            {/* Info untuk Essay & Photo Upload */}
            {(type === "essay" || type === "photo_upload") && (
              <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">ℹ️ Info:</span>{" "}
                  {type === "essay"
                    ? "Soal uraian akan dinilai secara manual oleh pengajar."
                    : "Peserta akan mengunggah foto jawaban untuk soal ini."}
                </p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <IoSaveOutline className="w-5 h-5" />
                {isEditMode ? "Perbarui Soal" : "Simpan Soal"}
              </button>
            </div>
          </form>
        </div>

        {/* Question List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Daftar Soal ({questions.length})
          </h2>

          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} onRetry={refetch} />}

          <div className="grid gap-4">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold px-2 py-1 rounded">
                        No. {index + 1}
                      </span>
                      <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 text-xs font-semibold px-2 py-1 rounded uppercase">
                        {q.type.replace("_", " ")}
                      </span>
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-semibold px-2 py-1 rounded">
                        {q.points} Poin
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none text-slate-800 dark:text-white space-y-4">
                      {q.imageUrl && (
                        <div className="max-w-md">
                          <img
                            src={q.imageUrl}
                            alt="Soal"
                            className="rounded-lg border border-slate-200 dark:border-slate-700 max-h-64 object-contain"
                          />
                        </div>
                      )}
                      <LatexRenderer>{q.text}</LatexRenderer>
                    </div>

                    {q.type === "multiple_choice" && q.options && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`p-2 rounded border ${
                              opt.isCorrect
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            <span className="font-bold mr-2 text-slate-700 dark:text-slate-300">
                              {opt.id.toUpperCase()}.
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">
                              <LatexRenderer>{opt.text}</LatexRenderer>
                            </span>
                            {opt.isCorrect && (
                              <span className="ml-2 text-green-600 dark:text-green-400 text-xs font-bold">
                                (Benar)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={() => handleEditQuestion(q)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                      title="Edit Soal"
                    >
                      <IoPencilOutline className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => confirmDelete(q.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Soal"
                    >
                      <IoTrashOutline className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Hapus Soal"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Hapus
            </button>
          </div>
        }
      >
        <p className="text-slate-600 dark:text-slate-300">
          Apakah Anda yakin ingin menghapus soal ini? Tindakan ini tidak dapat
          dibatalkan.
        </p>
      </Modal>
    </div>
  );
}
