import { useState } from "react";
import { Link } from "react-router-dom";
import { PiGraduationCapBold } from "react-icons/pi";
import { IoArrowBack, IoFilterOutline } from "react-icons/io5";
import { MdOutlineSort } from "react-icons/md";

interface BulkGradingFiltersProps {
  onFilterChange: (filters: {
    status: string;
    questionType: string;
    searchTerm: string;
    sortBy: string;
  }) => void;
  examId: string;
}

export default function BulkGradingFilters({
  onFilterChange,
  examId,
}: BulkGradingFiltersProps) {
  const [status, setStatus] = useState("all");
  const [questionType, setQuestionType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("pending_first");

  const handleFilterUpdate = (
    updates: Partial<{
      status: string;
      questionType: string;
      searchTerm: string;
      sortBy: string;
    }>
  ) => {
    const newFilters = {
      status: updates.status ?? status,
      questionType: updates.questionType ?? questionType,
      searchTerm: updates.searchTerm ?? searchTerm,
      sortBy: updates.sortBy ?? sortBy,
    };

    if (updates.status !== undefined) setStatus(updates.status);
    if (updates.questionType !== undefined)
      setQuestionType(updates.questionType);
    if (updates.searchTerm !== undefined) setSearchTerm(updates.searchTerm);
    if (updates.sortBy !== undefined) setSortBy(updates.sortBy);

    onFilterChange(newFilters);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <PiGraduationCapBold className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-800">ExamPro</span>
              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-md">
                Bulk Grading
              </span>
            </div>
          </div>
          <Link
            to={`/admin/ujian/${examId}/hasil`}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200"
          >
            <IoArrowBack className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Kembali</span>
          </Link>
        </div>
      </header>

      {/* Filters Toolbar */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari nama siswa..."
                value={searchTerm}
                onChange={(e) =>
                  handleFilterUpdate({ searchTerm: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <IoFilterOutline className="w-5 h-5 text-slate-600" />
              <select
                value={status}
                onChange={(e) => handleFilterUpdate({ status: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="pending_review">Pending Review</option>
                <option value="graded">Sudah Dinilai</option>
                <option value="auto_graded">Auto Graded</option>
              </select>
            </div>

            {/* Question Type Filter */}
            <div>
              <select
                value={questionType}
                onChange={(e) =>
                  handleFilterUpdate({ questionType: e.target.value })
                }
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
              >
                <option value="all">Semua Tipe</option>
                <option value="essay">Essay</option>
                <option value="short_answer">Short Answer</option>
                <option value="photo_upload">Photo Upload</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <MdOutlineSort className="w-5 h-5 text-slate-600" />
              <select
                value={sortBy}
                onChange={(e) => handleFilterUpdate({ sortBy: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
              >
                <option value="pending_first">Pending Dulu</option>
                <option value="name_asc">Nama A-Z</option>
                <option value="name_desc">Nama Z-A</option>
                <option value="time_asc">Waktu (Lama-Baru)</option>
                <option value="time_desc">Waktu (Baru-Lama)</option>
                <option value="score_desc">Nilai (Tinggi-Rendah)</option>
                <option value="score_asc">Nilai (Rendah-Tinggi)</option>
              </select>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() =>
                handleFilterUpdate({
                  status: "pending_review",
                  sortBy: "time_asc",
                })
              }
              className="px-3 py-1.5 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-medium cursor-pointer"
            >
              ⏳ Lihat Pending
            </button>
            <button
              onClick={() => handleFilterUpdate({ questionType: "essay" })}
              className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium cursor-pointer"
            >
              📝 Essay Saja
            </button>
            <button
              onClick={() =>
                handleFilterUpdate({ questionType: "photo_upload" })
              }
              className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium cursor-pointer"
            >
              📷 Photo Saja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
