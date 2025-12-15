import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
      title={theme === "light" ? "Aktifkan Mode Gelap" : "Aktifkan Mode Terang"}
    >
      {theme === "light" ? (
        <IoMoonOutline className="w-5 h-5" />
      ) : (
        <IoSunnyOutline className="w-5 h-5" />
      )}
    </button>
  );
}
