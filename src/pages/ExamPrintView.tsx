import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuestions } from "../hooks/useQuestions";
import { examApi } from "../services/api";
import type { Exam } from "../types";
import LatexRenderer from "../components/LatexRenderer";
import LoadingSpinner from "../components/LoadingSpinner";
import { IoArrowBack, IoPrintOutline } from "react-icons/io5";

export default function ExamPrintView() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { questions, loading: loadingQuestions } = useQuestions(examId || "");
  const [exam, setExam] = useState<Exam | null>(null);
  const [loadingExam, setLoadingExam] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      if (!examId) return;
      try {
        const data = await examApi.getById(examId);
        setExam(data);
      } catch (err) {
        console.error("Failed to fetch exam", err);
      } finally {
        setLoadingExam(false);
      }
    };

    fetchExam();
  }, [examId]);

  if (loadingQuestions || loadingExam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-slate-800">
          Ujian tidak ditemukan
        </p>
        <button
          onClick={() => navigate(`/admin/ujian/${examId}/soal`)}
          className="text-primary-600 hover:underline"
        >
          Kembali ke Edit
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-black p-8 max-w-[210mm] mx-auto">
      {/* Print Controls (Hidden when printing via CSS) */}
      <div className="print:hidden fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm p-4 flex justify-between items-center text-white z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/admin/ujian/${examId}/soal`)}
            className="flex items-center gap-2 hover:text-slate-200 transition-colors"
          >
            <IoArrowBack className="w-5 h-5" />
            Kembali
          </button>
          <span className="font-semibold">{exam.title} - Print View</span>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <IoPrintOutline className="w-5 h-5" />
          Cetak PDF
        </button>
      </div>

      {/* Spacing for fixed header */}
      <div className="print:hidden h-16"></div>

      {/* Exam Header */}
      <header className="border-b-2 border-black pb-6 mb-8 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">
          {exam.title}
        </h1>
        <div className="flex justify-center gap-8 text-sm font-medium mt-4">
          <p>Durasi: {exam.duration} Menit</p>
          <p>Kode Ujian: {exam.code}</p>
        </div>
      </header>

      {/* Student Info Section */}
      <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <span className="w-24 font-medium">Nama:</span>
            <div className="flex-1 border-b border-black border-dashed h-4"></div>
          </div>
          <div className="flex items-end gap-2">
            <span className="w-24 font-medium">NIM / Kelas:</span>
            <div className="flex-1 border-b border-black border-dashed h-4"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <span className="w-24 font-medium">Tanggal:</span>
            <div className="flex-1 border-b border-black border-dashed h-4"></div>
          </div>
          <div className="flex items-end gap-2">
            <span className="w-24 font-medium">Tanda Tangan:</span>
            <div className="flex-1 border-b border-black border-dashed h-4"></div>
          </div>
        </div>
      </div>

      {/* Standard Instructions */}
      <div className="mb-8 p-4 border border-black rounded-lg bg-gray-50 print:bg-transparent">
        <h3 className="font-bold mb-2">Petunjuk Pengerjaan:</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Berdoalah sebelum memulai mengerjakan soal.</li>
          <li>
            Tuliskan identitas Anda dengan lengkap dan jelas pada lembar
            jawaban.
          </li>
          <li>Periksa dan bacalah soal-soal sebelum Anda menjawabnya.</li>
          <li>Dahulukan menjawab soal-soal yang Anda anggap mudah.</li>
          <li>
            Periksa kembali pekerjaan Anda sebelum diserahkan kepada pengawas.
          </li>
        </ul>
      </div>

      {/* Questions List */}
      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.id} className="break-inside-avoid">
            <div className="flex gap-4">
              <span className="font-bold min-w-[1.5rem]">{index + 1}.</span>
              <div className="flex-1 space-y-4">
                {/* Question Text */}
                <div className="prose prose-p:text-black max-w-none">
                  {/* Using LatexRenderer properly */}
                  <LatexRenderer>{question.text}</LatexRenderer>
                </div>

                {/* Question Image */}
                {question.imageUrl && (
                  <div className="my-4">
                    <img
                      src={question.imageUrl}
                      alt={`Gambar soal ${index + 1}`}
                      className="max-h-64 object-contain border border-gray-300 rounded"
                    />
                  </div>
                )}

                {/* Options / Answer Space */}
                {question.type === "multiple_choice" ? (
                  <div className="grid grid-cols-1 gap-2 ml-4">
                    {question.options?.map((option) => (
                      <div key={option.id} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full border border-black flex items-center justify-center text-xs font-bold shrink-0">
                          {option.id.toUpperCase()}
                        </div>
                        <div className="pt-0.5">
                          <LatexRenderer>{option.text}</LatexRenderer>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Space for Essay/Short Answer
                  <div className="mt-4 border border-gray-300 rounded min-h-[150px] p-2 print:border-black print:border-dashed">
                    <span className="text-xs text-gray-400 print:hidden">
                      Ruang Jawaban
                    </span>
                  </div>
                )}
              </div>
              <div className="font-medium text-sm text-gray-600 print:text-black whitespace-nowrap">
                [{question.points} Poin]
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-gray-500 border-t pt-4 print:fixed print:bottom-4 print:left-0 print:right-0 print:border-none">
        <p>Dicetak secara otomatis oleh sistem ExamPro</p>
      </footer>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            background: white;
            color: black;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-black {
            border-color: black !important;
          }
        }
      `}</style>
    </div>
  );
}
