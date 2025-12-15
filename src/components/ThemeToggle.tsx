import { IoMoon, IoSunny, IoColorPalette } from "react-icons/io5";
import useTheme from "../hooks/useTheme";
import { type ColorPalette } from "../utils/colors";
import { useState, useRef, useEffect } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme, colorPalette, changePalette } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const palettes: { id: ColorPalette; name: string; color: string }[] = [
    { id: "purple", name: "Purple", color: "#a855f7" },
    { id: "pink", name: "Pink", color: "#ec4899" },
    { id: "sky", name: "Sky", color: "#0ea5e9" },
    { id: "slate", name: "Slate", color: "#64748b" },
    { id: "teal", name: "Teal", color: "#14b8a6" },
    { id: "amber", name: "Amber", color: "#f59e0b" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
        aria-label="Theme Settings"
      >
        <IoColorPalette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Mode Tampilan
            </h3>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => theme === "dark" && toggleTheme()}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  theme === "light"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <IoSunny className="w-4 h-4" />
                Terang
              </button>
              <button
                onClick={() => theme === "light" && toggleTheme()}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  theme === "dark"
                    ? "bg-slate-700 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <IoMoon className="w-4 h-4" />
                Gelap
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Warna Tema
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {palettes.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => changePalette(palette.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all cursor-pointer ${
                    colorPalette === palette.id
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full shadow-sm"
                    style={{ backgroundColor: palette.color }}
                  />
                  <span
                    className={`text-xs font-medium ${
                      colorPalette === palette.id
                        ? "text-primary-700 dark:text-primary-300"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {palette.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
