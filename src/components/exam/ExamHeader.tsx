import { PiTimerBold } from "react-icons/pi";

interface ExamHeaderProps {
  title: string;
  timeLeft: string;
}

export default function ExamHeader({ title, timeLeft }: ExamHeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-slate-800 dark:text-white text-lg truncate max-w-[200px] sm:max-w-md">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg font-mono font-bold">
          <PiTimerBold className="w-5 h-5" />
          {timeLeft}
        </div>
      </div>
    </header>
  );
}
