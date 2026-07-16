import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      id="theme-toggle-btn"
      onClick={onToggle}
      className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-300 shadow-md flex items-center justify-center text-slate-800 dark:text-amber-400 border border-slate-200/50 dark:border-slate-700/50"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 transition-transform duration-500 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-500 hover:-rotate-12" />
      )}
    </button>
  );
}
