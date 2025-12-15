import { IoArrowBack, IoArrowForward, IoCheckmarkDone } from "react-icons/io5";
import LatexRenderer from "../LatexRenderer";
import type { Question } from "../../types";

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  answer: string | undefined;
  onAnswer: (answer: string) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: (isAutoSubmit: boolean) => void;
  isSaving: boolean;
}

export default function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  answer,
  onAnswer,
  onPhotoUpload,
  onNext,
  onPrev,
  onSubmit,
  isSaving,
}: QuestionCardProps) {
  const isLast = questionIndex === totalQuestions - 1;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 min-h-[400px] flex flex-col transition-colors duration-300">
      {/* Question */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-8 flex-1">
        <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded mb-4">
          Soal No. {questionIndex + 1}
        </span>

        {question.imageUrl && (
          <div className="mb-4">
            <img
              src={question.imageUrl}
              alt="Soal"
              className="rounded-xl border border-slate-200 dark:border-slate-700 max-h-96 w-full object-contain bg-slate-50 dark:bg-slate-800"
            />
          </div>
        )}

        <div className="text-slate-800 dark:text-slate-200">
          <LatexRenderer>{question.text}</LatexRenderer>
        </div>
      </div>

      {/* Options / Input */}
      <div className="space-y-4">
        {question.type === "multiple_choice" &&
          question.options?.map((option) => (
            <label
              key={option.id}
              className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                answer === option.id
                  ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                className="hidden"
                checked={answer === option.id}
                onChange={() => onAnswer(option.id)}
              />
              <div
                className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 ${
                  answer === option.id
                    ? "border-primary-600"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {answer === option.id && (
                  <div className="w-3 h-3 rounded-full bg-primary-600" />
                )}
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                <LatexRenderer>{option.text}</LatexRenderer>
              </span>
            </label>
          ))}

        {/* Short Answer */}
        {question.type === "short_answer" && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Ketik jawaban Anda di sini..."
              className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:border-primary-600 focus:outline-none transition-colors"
              value={answer || ""}
              onChange={(e) => onAnswer(e.target.value)}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Jawaban otomatis dinilai jika sesuai dengan kunci jawaban. Gunakan
              format yang tepat.
            </p>
          </div>
        )}

        {(question.type === "essay" || question.type === "photo_upload") && (
          <div className="space-y-4">
            {question.type === "essay" && (
              <textarea
                placeholder="Ketik jawaban Anda di sini..."
                className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:border-primary-600 focus:outline-none transition-colors min-h-[200px]"
                value={answer?.startsWith("data:") ? "" : answer || ""}
                onChange={(e) => onAnswer(e.target.value)}
              />
            )}

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary-600 dark:text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Upload Foto Jawaban
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    JPG, PNG, atau PDF (Max 5MB)
                  </p>
                </div>
                <label className="inline-block">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    onChange={onPhotoUpload}
                    className="hidden"
                  />
                  <span className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors cursor-pointer inline-block">
                    Pilih File
                  </span>
                </label>
              </div>

              {answer && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                    ✓ File berhasil diunggah
                  </p>
                  {answer.startsWith("data:image/") && (
                    <img
                      src={answer}
                      alt="Preview"
                      className="max-h-64 rounded-lg border border-slate-200 dark:border-slate-700 mx-auto"
                    />
                  )}
                  {answer.startsWith("data:application/pdf") && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      📄 PDF File uploaded
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Nav Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onPrev}
          disabled={questionIndex === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <IoArrowBack /> Sebelumnya
        </button>
        {isLast ? (
          <button
            onClick={() => onSubmit(false)}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              "Menyimpan..."
            ) : (
              <>
                Selesai <IoCheckmarkDone />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            Selanjutnya <IoArrowForward />
          </button>
        )}
      </div>
    </div>
  );
}
