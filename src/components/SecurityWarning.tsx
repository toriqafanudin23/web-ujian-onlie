import { IoWarningOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

interface SecurityWarningProps {
  message: string;
  type: "warning" | "error";
  violationCount: number;
  maxViolations: number;
  onDismiss?: () => void;
}

export default function SecurityWarning({
  message,
  type,
  violationCount,
  maxViolations,
  onDismiss,
}: SecurityWarningProps) {
  const remaining = maxViolations - violationCount;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] max-w-md w-full mx-4 ${
        type === "error"
          ? "bg-red-50 border-red-500"
          : "bg-amber-50 border-amber-500"
      } border-2 rounded-lg shadow-2xl p-4 animate-shake`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            type === "error" ? "bg-red-100" : "bg-amber-100"
          }`}
        >
          <IoWarningOutline
            className={`w-6 h-6 ${
              type === "error" ? "text-red-600" : "text-amber-600"
            }`}
          />
        </div>
        <div className="flex-1">
          <h3
            className={`font-bold text-sm ${
              type === "error" ? "text-red-800" : "text-amber-800"
            }`}
          >
            Peringatan Keamanan!
          </h3>
          <p
            className={`text-sm mt-1 ${
              type === "error" ? "text-red-700" : "text-amber-700"
            }`}
          >
            {message}
          </p>
          {remaining > 0 && (
            <p className="text-xs mt-2 font-semibold text-slate-600">
              Pelanggaran: {violationCount}/{maxViolations} - Tersisa{" "}
              {remaining} peringatan
            </p>
          )}
          {remaining <= 0 && (
            <p className="text-xs mt-2 font-bold text-red-600">
              Ujian akan otomatis dikumpulkan!
            </p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

interface FullscreenPromptProps {
  onEnter: () => void;
  onCancel: () => void;
}

export function FullscreenPrompt({ onEnter, onCancel }: FullscreenPromptProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <IoShieldCheckmarkOutline className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-3">
          Mode Ujian Aman
        </h2>
        <p className="text-slate-600 text-center mb-6">
          Untuk menjaga integritas ujian, aplikasi harus berjalan dalam mode
          layar penuh. Anda tidak akan bisa membuka tab atau aplikasi lain
          selama ujian berlangsung.
        </p>
        <div className="space-y-3">
          <button
            onClick={onEnter}
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
          >
            Masuk Mode Layar Penuh
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Batalkan
          </button>
        </div>
        <p className="text-xs text-slate-500 text-center mt-4">
          Pelanggaran keamanan akan dicatat dan dapat mempengaruhi nilai.
        </p>
      </div>
    </div>
  );
}
