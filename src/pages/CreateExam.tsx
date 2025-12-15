import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { PiGraduationCapBold } from "react-icons/pi";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { createExam } from "../store/slices/examSlice";
import { type AppDispatch } from "../store/store";
import ExamForm from "../components/exam/ExamForm";
import ThemeToggle from "../components/ThemeToggle";

export default function CreateExam() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (data: any) => {
    try {
      await dispatch(createExam(data)).unwrap();
      navigate("/admin");
    } catch (err) {
      console.error("Failed to create exam:", err);
      alert("Gagal membuat ujian");
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
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
            >
              <IoArrowBack className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Kembali</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          {/* Card Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 bg-primary-50 dark:bg-primary-900/20 px-6 py-4 rounded-t-2xl">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Buat Ujian Baru
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Isi form di bawah untuk membuat ujian baru
            </p>
          </div>

          {/* Card Content */}
          <ExamForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
}
