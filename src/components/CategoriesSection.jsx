import React, { useState } from "react";
import { CATEGORIES } from "../data/categories";
import CategoryCard from "./CategoryCard";
import { Layers, BookmarkCheck, Lightbulb } from "lucide-react";

export default function CategoriesSection({
  expenses,
  onAddItem,
  onDeleteItem,
  salary,
}) {
  const [activeTab, setActiveTab] = useState("all");

  const displayedCategories =
    activeTab === "all"
      ? CATEGORIES
      : CATEGORIES.filter((cat) => cat.id === activeTab);

  return (
    <div className="space-y-4">
      {/* Section Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-burgundy-700 dark:text-burgundy-400" />
            Alokasi Kebutuhan (Primer, Sekunder, Tersier)
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Catat pengeluaran ke dalam 3 tingkatan kebutuhan agar keuanganmu tetap seimbang.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700/60 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "all"
                ? "bg-white dark:bg-stone-900 text-burgundy-800 dark:text-burgundy-300 shadow-sm"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
            }`}
          >
            Semua (3 Kategori)
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === cat.id
                  ? "bg-white dark:bg-stone-900 text-burgundy-800 dark:text-burgundy-300 shadow-sm"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
              }`}
            >
              {cat.title.replace("Kebutuhan ", "")}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Categories */}
      <div
        className={`grid gap-5 ${
          activeTab === "all"
            ? "grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1 max-w-2xl mx-auto"
        }`}
      >
        {displayedCategories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            items={expenses[cat.id] || []}
            onAddItem={onAddItem}
            onDeleteItem={onDeleteItem}
            salary={salary}
          />
        ))}
      </div>
    </div>
  );
}
