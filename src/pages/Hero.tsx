import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiGraduationCapBold } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineTimer } from "react-icons/md";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { CiCircleCheck } from "react-icons/ci";
import { LuUsersRound } from "react-icons/lu";
import { IoKeyOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { examApi } from "../services/api";
import ThemeToggle from "../components/ThemeToggle";

const features = [
  {
    icon: <IoDocumentTextOutline className="w-6 h-6" />,
    title: "Berbagai Tipe Soal",
    description:
      "Pilihan ganda, isian singkat, uraian, dan upload foto jawaban",
  },
  {
    icon: <MdOutlineTimer className="w-6 h-6" />,
    title: "Timer Otomatis",
    description: "Waktu pengerjaan terkontrol dengan timer real-time",
  },
  {
    icon: <IoShieldCheckmarkOutline className="w-6 h-6" />,
    title: "Akses Terkendali",
    description: "Kode ujian unik untuk setiap sesi ujian",
  },
  {
    icon: <CiCircleCheck className="w-6 h-6" />,
    title: "Mudah Digunakan",
    description: "Interface sederhana dan intuitif",
  },
  {
    icon: <CiCircleCheck className="w-6 h-6" />,
    title: "Mudah Digunakan",
    description: "Interface sederhana dan intuitif",
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      toast.error("Mohon lengkapi data");
      return;
    }

    try {
      setLoading(true);
      // Ensure code is uppercase for consistency, as most exam codes are uppercase
      const exam = await examApi.getByCode(code.trim().toUpperCase());

      if (exam) {
        if (!exam.isActive) {
          toast.error("Ujian ini tidak aktif");
          return;
        }
        toast.success("Ujian ditemukan! Mengalihkan...");
        navigate(`/ujian/${exam.id}`, { state: { studentName: name } });
      } else {
        toast.error("Kode ujian tidak ditemukan");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat mencari ujian");
    } finally {
      setLoading(false);
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
            <span className="text-xl font-bold text-slate-800 dark:text-white">
              ExamPro
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
            >
              <IoSettingsOutline className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Admin Panel</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-sm font-medium">
              <LuUsersRound className="w-4 h-4" />
              Platform Ujian Online
            </div>

            {/* Hero Title */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight text-slate-800 dark:text-white">
              Ujian Online
              <span className="block mt-2 text-primary-600 dark:text-primary-400">
                Lebih Mudah & Efisien
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
              Platform ujian online modern untuk menyelenggarakan ujian dengan
              berbagai tipe soal. Peserta dapat mengikuti ujian kapan saja
              dengan memasukkan kode ujian.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Exam Code Input */}
          <div className="lg:pl-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8">
              <div className="space-y-6">
                {/* Form Header */}
                <div className="flex items-start gap-3 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl shrink-0">
                    <IoKeyOutline className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                      Masuk ke Ujian
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Lengkapi data berikut untuk memulai ujian
                    </p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleJoinExam} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Peserta
                    </label>
                    <input
                      type="text"
                      placeholder="Masukan Nama Lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-all duration-200 font-medium"
                      required
                    />
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      ⚠️ <strong>Penting:</strong> Masukkan nama yang sesuai
                      (nama asli) untuk memastikan hasil ujian dapat dinilai
                      dengan benar
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kode Ujian
                    </label>
                    <input
                      type="text"
                      placeholder="Masukan Kode Ujian"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-all duration-200 font-medium tracking-wide uppercase"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors duration-200 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Memproses..." : "Lanjutkan"}
                  </button>
                </form>

                {/* Demo Info */}
                <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
                  <p className="text-sm text-center text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-800 dark:text-white">
                      Demo:
                    </span>{" "}
                    Gunakan kode{" "}
                    <code className="px-2 py-1 rounded bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 font-mono font-bold">
                      CALC02
                    </code>{" "}
                    untuk mencoba ujian
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-600 dark:text-slate-400">
          <p>&copy; 2024 ExamPro. Platform Ujian Online.</p>
        </div>
      </footer>
    </div>
  );
}
