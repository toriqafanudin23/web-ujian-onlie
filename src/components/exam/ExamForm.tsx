import { useState, useEffect } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { IoSaveOutline } from "react-icons/io5";

interface ExamData {
  title: string;
  description: string;
  code: string;
  duration: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface ExamFormProps {
  initialData?: ExamData;
  onSubmit: (data: ExamData) => void;
  isEditMode?: boolean;
}

export default function ExamForm({
  initialData,
  onSubmit,
  isEditMode = false,
}: ExamFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [duration, setDuration] = useState(60);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCode(initialData.code);
      setDuration(initialData.duration);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setIsActive(initialData.isActive);
    }
  }, [initialData]);

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      code,
      duration,
      startTime,
      endTime,
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Judul Ujian */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Judul Ujian <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Contoh: Ujian Matematika Semester 1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all duration-200"
          required
        />
      </div>

      {/* Deskripsi */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Deskripsi
        </label>
        <textarea
          placeholder="Deskripsi singkat tentang ujian..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all duration-200 resize-none"
        />
      </div>

      {/* Kode Ujian & Durasi */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Kode Ujian */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Kode Ujian <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="MTK001"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all duration-200 uppercase font-mono font-semibold tracking-wider"
              maxLength={10}
              required
            />
            <button
              type="button"
              onClick={generateCode}
              className="px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center gap-2"
              title="Generate kode acak"
            >
              <MdOutlineRefresh className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Durasi */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Durasi (menit) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all duration-200"
            required
          />
        </div>
      </div>

      {/* Waktu Mulai & Berakhir */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Waktu Mulai */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Waktu Mulai <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all duration-200"
            required
          />
        </div>

        {/* Waktu Berakhir */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Waktu Berakhir <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all duration-200"
            required
          />
        </div>
      </div>

      {/* Status Ujian */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
        <div>
          <label className="block text-base font-semibold text-slate-800 dark:text-white">
            Status Ujian
          </label>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {isActive
              ? "Ujian aktif dan dapat diakses peserta"
              : "Ujian tidak aktif"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            isActive ? "bg-purple-600" : "bg-slate-300 dark:bg-slate-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              isActive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
      >
        <IoSaveOutline className="w-5 h-5" />
        {isEditMode ? "Simpan Perubahan" : "Buat Ujian"}
      </button>
    </form>
  );
}
