import React, { useState } from "react";
import { Plus, Trash2, Tag, Info, Sparkles, Check } from "lucide-react";
import { formatRupiah, parseRupiah } from "../lib/utils";

export default function CategoryCard({
  category,
  items,
  onAddItem,
  onDeleteItem,
  salary,
}) {
  const [name, setName] = useState("");
  const [costStr, setCostStr] = useState("");

  const totalCategoryCost = items.reduce((sum, item) => sum + item.cost, 0);
  const percentOfSalary =
    salary > 0 ? Math.round((totalCategoryCost / salary) * 100) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanCost = parseRupiah(costStr);
    if (!name.trim() || cleanCost <= 0) return;

    onAddItem(category.id, {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      name: name.trim(),
      cost: cleanCost,
    });

    setName("");
    setCostStr("");
  };

  const handleQuickAdd = (suggestion) => {
    setName(suggestion.name);
    setCostStr(formatRupiah(suggestion.cost));
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden transition-all duration-200">
      {/* Category Header */}
      <div className="p-5 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${category.colorClasses.badge}`}
          >
            {category.badge}
          </span>
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            Target Ideal: ~{category.idealPercent}%
          </span>
        </div>

        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
          {category.title}
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
          {category.description}
        </p>

        {/* Total Cost in this category */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-semibold">
              Total Pengeluaran
            </span>
            <span className="text-lg font-bold font-mono text-stone-900 dark:text-stone-100">
              {formatRupiah(totalCategoryCost)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-semibold">
              Porsi Gaji
            </span>
            <span
              className={`text-sm font-bold ${
                percentOfSalary > category.idealPercent + 10
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-burgundy-700 dark:text-burgundy-400"
              }`}
            >
              {percentOfSalary}%
            </span>
          </div>
        </div>
      </div>

      {/* Add Item Form */}
      <div className="p-4 bg-stone-50/70 dark:bg-stone-950/40 border-b border-stone-100 dark:border-stone-800">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-7">
              <input
                type="text"
                placeholder="Nama catatan (mis: Bensin)..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-burgundy-600"
              />
            </div>
            <div className="sm:col-span-5">
              <input
                type="text"
                placeholder="Biaya (Rp)..."
                value={costStr}
                onChange={(e) => {
                  const num = parseRupiah(e.target.value);
                  setCostStr(num > 0 ? formatRupiah(num) : "");
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-burgundy-600 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="submit"
              disabled={!name.trim() || parseRupiah(costStr) <= 0}
              className="w-full py-2 px-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah ke {category.badge}</span>
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-3">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-burgundy-600 dark:text-burgundy-400" />
            Ide Catatan Cepat:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {category.quickSuggestions.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickAdd(sug)}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition-all text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 ${category.colorClasses.pill}`}
                title={`Klik untuk isi: ${sug.name} (${formatRupiah(sug.cost)})`}
              >
                + {sug.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Itemized List */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        {items.length === 0 ? (
          <div className="py-8 text-center text-stone-400 dark:text-stone-600 flex flex-col items-center justify-center">
            <Tag className="w-8 h-8 stroke-1 mb-2 text-stone-300 dark:text-stone-700" />
            <p className="text-xs font-medium">Belum ada catatan biaya</p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
              Ketik catatan di atas atau pilih ide cepat
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => {
              const itemPct =
                salary > 0 ? ((item.cost / salary) * 100).toFixed(1) : "0";
              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200/60 dark:border-stone-700/50 transition-colors group"
                >
                  <div className="pr-2 min-w-0">
                    <span className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 block truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {itemPct}% dari gaji
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs sm:text-sm font-bold font-mono text-stone-900 dark:text-stone-100">
                      {formatRupiah(item.cost)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(category.id, item.id)}
                      title="Hapus catatan ini"
                      className="opacity-60 group-hover:opacity-100 p-1 rounded-lg text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
