import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PiGraduationCapBold } from "react-icons/pi";
import {
  IoHomeOutline,
  IoBookOutline,
  IoArrowBackOutline,
  IoSaveOutline,
} from "react-icons/io5";
import { useQuestionBank } from "../hooks/useQuestionBank";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import ThemeToggle from "../components/ThemeToggle";
import type { QuestionType, CreateQuestionBankData, Option } from "../types";

export default function CreateQuestionBank() {
  const navigate = useNavigate();
  const { createQuestion } = useQuestionBank();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateQuestionBankData>({
    type: "multiple_choice",
    text: "",
    subject: "",
    topic: "",
    difficulty: "medium",
    tags: [],
    points: 10,
    createdBy: "Admin",
    isPublic: true,
  });

  const [tagInput, setTagInput] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { id: "a", text: "", isCorrect: false },
    { id: "b", text: "", isCorrect: false },
    { id: "c", text: "", isCorrect: false },
    { id: "d", text: "", isCorrect: false },
  ]);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleOptionChange = (
    index: number,
    field: keyof Option,
    value: any
  ) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };

    // If this option is set as correct, uncheck others
    if (field === "isCorrect" && value === true) {
      updatedOptions.forEach((opt, idx) => {
        if (idx !== index) opt.isCorrect = false;
      });
    }

    setOptions(updatedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.text.trim()) {
      toast.error("Teks soal harus diisi");
      return;
    }
    if (!formData.subject.trim()) {
      toast.error("Subject harus diisi");
      return;
    }
    if (!formData.topic.trim()) {
      toast.error("Topic harus diisi");
      return;
    }

    // Type-specific validation
    if (formData.type === "multiple_choice") {
      if (options.some((opt) => !opt.text.trim())) {
        toast.error("Semua pilihan jawaban harus diisi");
        return;
      }
      if (!options.some((opt) => opt.isCorrect)) {
        toast.error("Pilih satu jawaban yang benar");
        return;
      }
    }

    if (formData.type === "short_answer" && !formData.correctAnswer?.trim()) {
      toast.error("Jawaban yang benar harus diisi");
      return;
    }

    try {
      setIsSubmitting(true);

      const questionData: CreateQuestionBankData = {
        ...formData,
        ...(formData.type === "multiple_choice" && { options }),
      };

      await createQuestion(questionData);
      toast.success("Soal berhasil ditambahkan ke bank");
      navigate("/admin/question-bank");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menambahkan soal");
    } finally {
      setIsSubmitting(false);
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
              <IoHomeOutline className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            to="/admin/question-bank"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-4 font-medium"
          >
            <IoArrowBackOutline className="w-4 h-4" />
            Kembali ke Bank Soal
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <IoBookOutline className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Tambah Soal ke Bank
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Buat soal baru yang dapat digunakan ulang di berbagai ujian
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Informasi Dasar
            </h2>

            <div className="space-y-4">
              {/* Subject & Topic */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Mathematics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Topic <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) =>
                      setFormData({ ...formData, topic: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Linear Algebra"
                  />
                </div>
              </div>

              {/* Difficulty, Type, and Points */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as
                          | "easy"
                          | "medium"
                          | "hard",
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tipe Soal
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        type: e.target.value as QuestionType,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="multiple_choice">Pilihan Ganda</option>
                    <option value="short_answer">Jawaban Singkat</option>
                    <option value="essay">Essay</option>
                    <option value="photo_upload">Upload Foto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.points}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        points: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddTag())
                    }
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tambah tag (tekan Enter)"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Tambah
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-md text-sm flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Public */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublic: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
                <label
                  htmlFor="isPublic"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Make this question public (accessible to all admins)
                </label>
              </div>
            </div>
          </div>

          {/* Question Text Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Teks Soal <span className="text-red-500">*</span>
            </h2>
            <textarea
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Masukkan teks soal (mendukung LaTeX dengan format $...$)"
            />
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              {String.raw`💡 Tip: Gunakan $ untuk inline LaTeX dan $$ untuk display LaTeX. Contoh: $\frac{a}{b}$, $\int x dx$, $\sum_{i=1}^n$`}
            </p>
          </div>

          {/* Type-specific fields */}
          {formData.type === "multiple_choice" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Pilihan Jawaban
              </h2>
              <div className="space-y-3">
                {options.map((option, idx) => (
                  <div key={option.id} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={option.isCorrect}
                      onChange={() =>
                        handleOptionChange(idx, "isCorrect", true)
                      }
                      className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500"
                    />
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300 w-6">
                      {option.id.toUpperCase()}.
                    </span>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(idx, "text", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={`Pilihan ${option.id.toUpperCase()}`}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-3">
                Pilih jawaban yang benar dengan menandai radio button
              </p>
            </div>
          )}

          {formData.type === "short_answer" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Jawaban yang Benar <span className="text-red-500">*</span>
              </h2>
              <input
                type="text"
                value={formData.correctAnswer || ""}
                onChange={(e) =>
                  setFormData({ ...formData, correctAnswer: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Masukkan jawaban yang benar"
              />
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <Link
              to="/admin/question-bank"
              className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  Menyimpan...
                </>
              ) : (
                <>
                  <IoSaveOutline className="w-5 h-5" />
                  Simpan ke Bank
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
