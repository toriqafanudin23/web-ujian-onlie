import { useState } from "react";
import { Link } from "react-router-dom";
import { PiGraduationCapBold } from "react-icons/pi";
import {
  IoHomeOutline,
  IoDocumentTextOutline,
  IoStatsChartOutline,
  IoPencilOutline,
} from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { MdOutlineTimer } from "react-icons/md";
import { HiOutlinePlus } from "react-icons/hi";
import { IoCopyOutline, IoTrashOutline } from "react-icons/io5";
import { useExams } from "../hooks/useExams";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import ThemeToggle from "../components/ThemeToggle";

export default function Dashboard() {
  const { exams, loading, error, deleteExam, refetch } = useExams();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const confirmDelete = (id: string, title: string) => {
    setExamToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!examToDelete) return;
    try {
      await deleteExam(examToDelete.id);
      toast.success("Ujian berhasil dihapus");
      setDeleteModalOpen(false);
      setExamToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus ujian");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Kode ${code} berhasil disalin!`);
  };

  const handleCopyLink = (examId: string) => {
    const link = `${window.location.origin}/ujian/${examId}`;
    navigator.clipboard.writeText(link);
    toast.success(`Link ujian berhasil disalin!`);
  };

  const totalParticipants = 0; // Will be calculated from submissions later
  const activeExams = exams.filter((e) => e.isActive).length;

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
              to="/"
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              <IoHomeOutline className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Beranda</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {/* Total Ujian */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <IoDocumentTextOutline className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total Ujian
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {exams.length}
                </p>
              </div>
            </div>
          </div>

          {/* Total Peserta */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <LuUsers className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total Peserta
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {totalParticipants}
                </p>
              </div>
            </div>
          </div>

          {/* Ujian Aktif */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <MdOutlineTimer className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Ujian Aktif
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {activeExams}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exams List Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Daftar Ujian
          </h2>
          <Link
            to="/admin/tambah-ujian"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-sm"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Buat Ujian Baru
          </Link>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {/* Exams List */}
        {!loading && !error && (
          <>
            {exams.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <IoDocumentTextOutline className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  Belum Ada Ujian
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Mulai buat ujian pertama Anda
                </p>
                <Link
                  to="/admin/tambah-ujian"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  <HiOutlinePlus className="w-4 h-4" />
                  Buat Ujian
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        {/* Title & Status */}
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                            {exam.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-md ${
                              exam.isActive
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {exam.isActive ? "Aktif" : "Tidak Aktif"}
                          </span>
                        </div>

                        {/* Description */}
                        {exam.description && (
                          <p className="text-slate-600 dark:text-slate-400">
                            {exam.description}
                          </p>
                        )}

                        {/* Info Row */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          {/* Kode Ujian */}
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                            <span className="text-slate-600 dark:text-slate-400">
                              Kode:
                            </span>
                            <code className="font-mono font-bold text-primary-600 dark:text-primary-400">
                              {exam.code}
                            </code>
                            <button
                              onClick={() => handleCopyCode(exam.code)}
                              className="p-1 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded transition-colors cursor-pointer"
                              title="Salin Kode"
                            >
                              <IoCopyOutline className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                            </button>
                            <div className="w-px h-4 bg-primary-200 dark:bg-primary-800 mx-1"></div>
                            <button
                              onClick={() => handleCopyLink(exam.id)}
                              className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium hover:underline cursor-pointer"
                              title="Salin Link Ujian"
                            >
                              Salin Link
                            </button>
                          </div>

                          {/* Duration */}
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <MdOutlineTimer className="w-4 h-4" />
                            <span>{exam.duration} menit</span>
                          </div>
                        </div>

                        {/* Period */}
                        <div className="text-xs text-slate-500 dark:text-slate-500">
                          Periode:{" "}
                          {new Date(exam.startTime).toLocaleString("id-ID")} -{" "}
                          {new Date(exam.endTime).toLocaleString("id-ID")}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
                        <Link
                          to={`/admin/ujian/${exam.id}/soal`}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
                          title="Kelola Soal"
                        >
                          <IoDocumentTextOutline className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/admin/ujian/${exam.id}/hasil`}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
                          title="Lihat Hasil"
                        >
                          <IoStatsChartOutline className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/admin/edit-ujian/${exam.id}`}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
                          title="Edit Ujian"
                        >
                          <IoPencilOutline className="w-5 h-5" />
                        </Link>
                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
                        <button
                          onClick={() => confirmDelete(exam.id, exam.title)}
                          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all duration-200 cursor-pointer"
                          title="Hapus ujian"
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

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Hapus Ujian"
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
          Apakah Anda yakin ingin menghapus ujian{" "}
          <span className="font-bold text-slate-800 dark:text-white">
            "{examToDelete?.title}"
          </span>
          ? Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  );
}
