import React from "react";
import { Moon, Sun, Download, RotateCcw, Wallet, Sparkles } from "lucide-react";

export default function Navbar({
  darkMode,
  setDarkMode,
  onOpenReport,
  onReset,
  hasExpenses,
}) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-stone-950/80 border-b border-stone-200/80 dark:border-stone-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-900 flex items-center justify-center shadow-md shadow-burgundy-900/20 text-white font-bold text-xl tracking-wider">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-stone-900 dark:text-stone-50">
                Pebi
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-burgundy-100 text-burgundy-800 dark:bg-burgundy-950/80 dark:text-burgundy-300 border border-burgundy-200 dark:border-burgundy-800">
                Alokasi Gaji
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
              Perencanaan Primer, Sekunder & Tersier
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Reset button */}
          <button
            onClick={onReset}
            title="Reset semua data"
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-burgundy-700 dark:hover:text-burgundy-400 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Mode Gelap/Terang"
            className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-burgundy-800 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Download Report Button */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs sm:text-sm shadow-md shadow-burgundy-900/20 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
        </div>
      </div>
    </header>
  );
}
