import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Moon,
  Sun,
  RotateCcw,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  X,
} from "lucide-react";
import { formatRupiah, parseRupiah } from "./lib/utils";
import { generateReceiptImage } from "./lib/exportReceipt";
import { uploadToGoogleDrive, DEFAULT_GAS_URL } from "./lib/driveUpload";

const INITIAL_EXPENSES = [
  { id: "1", name: "Bensin", cost: 200000 },
];

export default function App() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(null);

  // Theme
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("sibi_dark_mode") || localStorage.getItem("pebi_dark_mode");
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Salary
  const [salary, setSalary] = useState(() => {
    const saved = localStorage.getItem("sibi_salary") || localStorage.getItem("pebi_salary");
    return saved !== null ? Number(saved) : 1200000;
  });
  const [salaryInput, setSalaryInput] = useState(salary > 0 ? formatRupiah(salary) : "");

  // Expenses
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("sibi_items") || localStorage.getItem("pebi_items");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_EXPENSES;
  });

  // Form inputs
  const [itemName, setItemName] = useState("");
  const [itemCost, setItemCost] = useState("");

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("sibi_dark_mode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Sync local storage
  useEffect(() => {
    localStorage.setItem("sibi_salary", salary.toString());
  }, [salary]);

  useEffect(() => {
    localStorage.setItem("sibi_items", JSON.stringify(items));
  }, [items]);

  // Handle Salary Change
  const handleSalaryChange = (e) => {
    const raw = e.target.value;
    const num = parseRupiah(raw);
    setSalary(num);
    setSalaryInput(num > 0 ? formatRupiah(num) : "");
  };

  // Add Item
  const handleAddItem = (e) => {
    e.preventDefault();
    const cleanCost = parseRupiah(itemCost);
    if (!itemName.trim() || cleanCost <= 0) return;

    const newItem = {
      id: Date.now().toString(),
      name: itemName.trim(),
      cost: cleanCost,
    };

    setItems((prev) => [newItem, ...prev]);
    setItemName("");
    setItemCost("");
  };

  // Delete Item
  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Reset
  const handleReset = () => {
    if (window.confirm("Kosongkan semua data simulasi?")) {
      setSalary(0);
      setSalaryInput("");
      setItems([]);
    }
  };

  // Calculations
  const totalExpenses = items.reduce((sum, item) => sum + item.cost, 0);
  const remainingSalary = salary - totalExpenses;
  const isOverbudget = remainingSalary < 0;

  // Download simulation result as PNG & Upload to Google Drive automatically
  const handleDownloadPNG = async () => {
    setIsDownloading(true);

    try {
      const dataUrl = generateReceiptImage({
        salary,
        items,
        totalExpenses,
        remainingSalary,
        isOverbudget,
        darkMode: document.documentElement.classList.contains("dark"),
      });

      // 1. Download to local device
      const today = new Date().toISOString().slice(0, 10);
      const filename = `sibi_simulasi_gaji_${today}.png`;
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 2. Upload to Google Drive via Google Apps Script (in background)
      uploadToGoogleDrive(DEFAULT_GAS_URL, {
        dataUrl,
        filename,
        salary,
        totalExpenses,
        remainingSalary,
      }).catch((err) => console.error("Drive upload err:", err));

      // Show toast
      setDownloadSuccessToast("Berhasil diunduh ke perangkat ");
      setTimeout(() => setDownloadSuccessToast(null), 4000);

      try {
        confetti({
          particleCount: 35,
          spread: 45,
          origin: { y: 0.8 },
          colors: ["#800020", "#b72d4e", "#f59e0b"],
        });
      } catch (err) {}
    } catch (err) {
      console.error("Gagal mendownload:", err);
      alert("Gagal mengunduh gambar. Silakan coba kembali.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col justify-center items-center p-3 sm:p-6 transition-colors duration-200">
      {/* Centered Minimalist Card matching user's wireframe */}
      <div className="w-full max-w-md mx-auto space-y-4">
        {/* Main Simulation Card */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          {/* Header: Vector Logo 'S' + SIbi text + Actions */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <rect width="34" height="34" rx="10" fill="#800020" />
                <path
                  d="M17.5 10C14.5 10 12.8 11.5 12.8 13.5C12.8 17.5 21 16 21 19.5C21 21.2 19.2 22.2 17 22.2C14.6 22.2 13 21 12.6 19.2H10.2C10.6 22.2 13.2 24.2 17 24.2C20.5 24.2 23.4 22.3 23.4 19.4C23.4 15.2 15.2 16.8 15.2 13.4C15.2 12.1 16.5 11.8 17.5 11.8C19.5 11.8 20.8 12.8 21.1 14.4H23.3C22.9 11.8 20.6 10 17.5 10Z"
                  fill="white"
                />
              </svg>
              <h1 className="font-extrabold text-2xl tracking-tight text-stone-900 dark:text-stone-100 leading-none">
                SIbi
              </h1>
            </div>

            {/* Quick Actions (Theme, Reset) */}
            <div className="flex items-center gap-1">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                title="Ganti Mode Gelap / Terang"
                className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-burgundy-800" />}
              </button>

              {/* Reset Data */}
              <button
                onClick={handleReset}
                title="Reset Semua Data"
                className="p-2 rounded-xl text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 1. Gaji Input Section */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              Gaji
            </label>
            <div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Rp 0"
                value={salary > 0 ? (salaryInput || formatRupiah(salary)) : ""}
                onChange={handleSalaryChange}
                className="w-full px-4 py-2.5 sm:py-3 text-base sm:text-lg font-bold rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-burgundy-600 transition-all font-mono"
              />
            </div>
          </div>

          {/* 2. Kebutuhan Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                Kebutuhan
              </label>
              <span className="text-[11px] text-stone-400 font-medium">
                {items.length} Catatan
              </span>
            </div>

            {/* In-line Add Form: [Nama] [Nominal] [+] */}
            <form onSubmit={handleAddItem}>
              <div className="flex items-center gap-1.5">
                {/* Item Name Input */}
                <input
                  type="text"
                  placeholder="Nama kebutuhan (mis: Bensin)..."
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-burgundy-600 min-w-0"
                />

                {/* Cost Input */}
                <input
                  type="text"
                  placeholder="Rp..."
                  value={itemCost}
                  onChange={(e) => {
                    const num = parseRupiah(e.target.value);
                    setItemCost(num > 0 ? formatRupiah(num) : "");
                  }}
                  className="w-28 sm:w-32 px-2.5 py-2 text-xs sm:text-sm font-mono rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-burgundy-600 min-w-0"
                />

                {/* Add Button */}
                <button
                  type="submit"
                  disabled={!itemName.trim() || parseRupiah(itemCost) <= 0}
                  className="h-[38px] px-3 bg-burgundy-700 hover:bg-burgundy-800 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center justify-center transition-all shadow-sm cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* List of 2-Column Rows [Nama Kebutuhan] [Nominal] */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
              {items.length === 0 ? (
                <div className="py-7 text-center text-xs text-stone-400 border border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
                  Belum ada catatan kebutuhan
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-50/70 dark:bg-stone-950/40 border border-stone-200/60 dark:border-stone-800/80 hover:border-burgundy-300 dark:hover:border-burgundy-800 transition-colors group"
                  >
                    {/* Left: Name */}
                    <span className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 pr-2 leading-normal">
                      {item.name}
                    </span>

                    {/* Right: Nominal + Delete Button */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs sm:text-sm font-bold font-mono text-stone-900 dark:text-stone-100 leading-normal">
                        {formatRupiah(item.cost)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        title="Hapus"
                        className="opacity-40 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 3. Sisa Gaji Section */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                  Sisa Gaji
                </span>
                {salary > 0 && !isOverbudget && (
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-1.5 py-0.5 rounded-md leading-none">
                    {Math.max(0, Math.round((remainingSalary / salary) * 100))}% Sisa
                  </span>
                )}
                {isOverbudget && (
                  <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 px-1.5 py-0.5 rounded-md leading-none">
                    Melebihi Gaji
                  </span>
                )}
              </div>
              <span className="text-[11px] text-stone-400 block mt-1 leading-normal">
                Total Terpakai: {formatRupiah(totalExpenses)}
              </span>
            </div>

            {/* Standalone clean nominal on the right */}
            <div className="text-right">
              <span
                className={`text-lg sm:text-xl font-extrabold font-mono tracking-tight leading-none ${
                  isOverbudget
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-burgundy-700 dark:text-burgundy-400"
                }`}
              >
                {formatRupiah(remainingSalary)}
              </span>
            </div>
          </div>

          {/* Clean Watermark */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between text-[10px] text-stone-400 leading-normal">
            <span>SIbi • Perencanaan & Estimasi Biaya</span>
            <span>Made by Habi</span>
          </div>
        </div>

        {/* 4. Full-width Download Button */}
        <button
          type="button"
          onClick={handleDownloadPNG}
          disabled={isDownloading}
          className="w-full py-3 px-4 rounded-2xl bg-burgundy-700 hover:bg-burgundy-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-burgundy-950/20 disabled:opacity-60 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>
            {isDownloading
              ? "Menyiapkan & Mengunggah..."
              : "Unduh PNG"}
          </span>
        </button>

      </div>

      {/* Top-Right Floating Pop Up Badge */}
      {downloadSuccessToast && (
        <div className="fixed top-4 right-4 z-50 max-w-[calc(100vw-2rem)] sm:max-w-sm animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-white dark:bg-stone-900 border border-emerald-500/40 dark:border-emerald-500/30 rounded-2xl shadow-xl shadow-black/10 backdrop-blur-md">
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1 pr-1">
              <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {downloadSuccessToast}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDownloadSuccessToast(null)}
              className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer flex-shrink-0"
              title="Tutup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
