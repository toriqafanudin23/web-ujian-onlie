import type { Question } from "../../types";

interface QuestionNavigatorProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  onNavigate: (index: number) => void;
}

export default function QuestionNavigator({
  questions,
  currentQuestionIndex,
  answers,
  onNavigate,
}: QuestionNavigatorProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sticky top-24 transition-colors duration-300">
      <h3 className="font-bold text-slate-800 dark:text-white mb-4">
        Navigasi Soal
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => onNavigate(idx)}
            className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-colors ${
              currentQuestionIndex === idx
                ? "bg-purple-600 text-white shadow-md ring-2 ring-purple-200 dark:ring-purple-500/50"
                : answers[q.id]
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="w-3 h-3 rounded bg-purple-600" /> Sedang dikerjakan
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="w-3 h-3 rounded bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800" />{" "}
          Sudah dijawab
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="w-3 h-3 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />{" "}
          Belum dijawab
        </div>
      </div>
    </div>
  );
}
