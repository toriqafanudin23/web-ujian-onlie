import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PiGraduationCapBold } from "react-icons/pi";
import {
  IoPencilOutline,
  IoArrowBack,
  IoStatsChartOutline,
  IoTrashOutline,
  IoDownloadOutline,
} from "react-icons/io5";
import { MdOutlineTimer } from "react-icons/md";
import { resultApi, examApi } from "../services/api";
import type { ExamResult } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Modal from "../components/Modal";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import toast from "react-hot-toast";
import ThemeToggle from "../components/ThemeToggle";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExamResults() {
  const { examId } = useParams<{ examId: string }>();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [examTitle, setExamTitle] = useState("Hasil Ujian");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resultToDelete, setResultToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (examId) {
      loadResults(examId);
    }
  }, [examId]);

  const loadResults = async (id: string) => {
    try {
      setLoading(true);
      const [resultsData, examData] = await Promise.all([
        resultApi.getByExamId(id),
        examApi.getById(id).catch(() => null),
      ]);

      if (examData) {
        setExamTitle(examData.title);
      }

      // Sort by score (descending) then by submittedAt (ascending)
      const sorted = resultsData.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (
          new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
        );
      });
      setResults(sorted);
    } catch (err) {
      setError("Gagal memuat hasil ujian");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string, name: string) => {
    setResultToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(`Hasil Ujian: ${examTitle}`, 14, 22);

    // Add Stats
    doc.setFontSize(11);
    doc.text(`Rata-rata: ${stats.avg}`, 14, 32);
    doc.text(`Nilai Tertinggi: ${stats.highest}`, 70, 32);
    doc.text(`Nilai Terendah: ${stats.lowest}`, 130, 32);

    // Prepare data for table
    const tableData = results.map((result, index) => [
      index + 1,
      result.studentName,
      result.score,
    ]);

    // Generate table
    autoTable(doc, {
      head: [["No", "Nama Peserta", "Nilai"]],
      body: tableData,
      startY: 40,
    });

    // Save PDF
    doc.save(`hasil-ujian-${examId}.pdf`);
  };

  const handleDelete = async () => {
    if (!resultToDelete) return;
    try {
      await resultApi.delete(resultToDelete.id);
      toast.success("Peserta berhasil dihapus");
      setDeleteModalOpen(false);
      setResultToDelete(null);
      // Reload results
      if (examId) loadResults(examId);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus peserta");
    }
  };

  const calculateStats = () => {
    if (results.length === 0) return { avg: 0, highest: 0, lowest: 0 };
    const scores = results.map((r) => r.score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return {
      avg: Math.round(avg * 10) / 10,
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
    };
  };

  const stats = calculateStats();

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorMessage
        message={error}
        onRetry={() => examId && loadResults(examId)}
      />
    );

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Hasil Ujian
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Daftar nilai peserta ujian
            </p>
          </div>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md cursor-pointer"
          >
            <IoDownloadOutline className="w-5 h-5" />
            Download PDF
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              Total Peserta
            </p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {results.length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              Rata-rata Nilai
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.avg}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              Nilai Tertinggi
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.highest}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              Nilai Terendah
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.lowest}
            </p>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <IoStatsChartOutline className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Detail Peserta
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    No
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Nama Peserta
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Waktu Dikumpulkan
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 text-center">
                    Status
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 text-center">
                    Benar/Total
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 text-right">
                    Nilai Akhir
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 text-center">
                    Aksi
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 text-center">
                    Hapus
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {results.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                    >
                      Belum ada data hasil ujian.
                    </td>
                  </tr>
                ) : (
                  results.map((result, index) => (
                    <tr
                      key={result.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 w-12">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {result.studentName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <MdOutlineTimer className="w-4 h-4 text-slate-400" />
                          {format(
                            new Date(result.submittedAt),
                            "dd MMM yyyy, HH:mm",
                            { locale: id }
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {result.gradingStatus === "auto_graded" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            ✓ Auto Graded
                          </span>
                        ) : result.gradingStatus === "graded" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            ✓ Dinilai
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                            ⏳ Menunggu Penilaian
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
                          {result.correctCount} / {result.totalQuestions}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`text-lg font-bold ${
                            result.score >= 70
                              ? "text-green-600 dark:text-green-400"
                              : result.score >= 50
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {result.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {result.gradingStatus === "pending_review" ? (
                          <Link
                            to={`/grade/${examId}/${result.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            <IoPencilOutline className="w-4 h-4" />
                            Nilai
                          </Link>
                        ) : result.gradingStatus === "graded" ? (
                          <Link
                            to={`/grade/${examId}/${result.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <IoPencilOutline className="w-4 h-4" />
                            Lihat
                          </Link>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-sm">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            confirmDelete(result.id, result.studentName)
                          }
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Peserta"
                        >
                          <IoTrashOutline className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Hapus Peserta"
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
          Apakah Anda yakin ingin menghapus peserta{" "}
          <strong className="text-slate-900 dark:text-white">
            {resultToDelete?.name}
          </strong>
          ? Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  );
}
