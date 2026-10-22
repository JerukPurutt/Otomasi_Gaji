import React, { useState } from "react";
import { Wallet, HelpCircle, Check, Sparkles } from "lucide-react";
import { formatRupiah, parseRupiah } from "../lib/utils";

const SALARY_PRESETS = [
  { label: "Rp 3 Jt", value: 3000000 },
  { label: "Rp 5 Jt", value: 5000000 },
  { label: "Rp 7,5 Jt", value: 7500000 },
  { label: "Rp 10 Jt", value: 10000000 },
  { label: "Rp 15 Jt", value: 15000000 },
];

export default function SalaryInputCard({ salary, setSalary }) {
  const [displayValue, setDisplayValue] = useState(
    salary > 0 ? formatRupiah(salary) : ""
  );

  const handleInputChange = (e) => {
    const rawVal = e.target.value;
    const num = parseRupiah(rawVal);
    setSalary(num);
    setDisplayValue(num > 0 ? formatRupiah(num) : "");
  };

  const handlePresetClick = (val) => {
    setSalary(val);
    setDisplayValue(formatRupiah(val));
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-7 shadow-sm transition-all duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-burgundy-50 dark:bg-burgundy-950/60 text-burgundy-700 dark:text-burgundy-400 border border-burgundy-200 dark:border-burgundy-800/80">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Input Gaji / Penghasilan Bulanan
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Masukkan total pemasukan bersih yang ingin kamu alokasikan ke kebutuhan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/60 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700/60 w-fit">
          <Sparkles className="w-3.5 h-3.5 text-burgundy-700 dark:text-burgundy-400" />
          <span>Metode Alokasi: Primer, Sekunder, Tersier</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Input Field */}
        <div className="lg:col-span-7">
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
            Nominal Gaji Bersih (IDR)
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 dark:text-stone-500 font-semibold text-base sm:text-lg">
              Rp
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 5.000.000"
              value={salary > 0 ? (displayValue || formatRupiah(salary)) : ""}
              onChange={handleInputChange}
              className="block w-full pl-12 pr-4 py-3 sm:py-3.5 text-lg sm:text-xl font-bold rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-burgundy-600 focus:border-burgundy-600 transition-colors"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="lg:col-span-5">
          <span className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
            Pilihan Cepat
          </span>
          <div className="flex flex-wrap gap-2">
            {SALARY_PRESETS.map((preset) => {
              const isSelected = salary === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handlePresetClick(preset.value)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    isSelected
                      ? "bg-burgundy-700 text-white border-burgundy-700 shadow-sm"
                      : "bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-burgundy-400 dark:hover:border-burgundy-600 hover:bg-burgundy-50/50 dark:hover:bg-burgundy-950/40"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
