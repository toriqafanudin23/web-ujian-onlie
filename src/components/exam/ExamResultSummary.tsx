import { IoCheckmarkDone } from "react-icons/io5";

interface ExamResultSummaryProps {
  score: number;
  correctCount: number;
  totalQuestions: number;
  onHome: () => void;
}

export default function ExamResultSummary({
  score,
  correctCount,
  totalQuestions,
  onHome,
}: ExamResultSummaryProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl shadow-xl p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
          <IoCheckmarkDone className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Ujian Selesai!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Terima kasih telah mengikuti ujian ini.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">
              Nilai Anda
            </span>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {score}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Benar</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {correctCount} / {totalQuestions} Soal
            </span>
          </div>
        </div>

        <button
          onClick={onHome}
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
