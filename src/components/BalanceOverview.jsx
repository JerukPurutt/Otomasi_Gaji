import React from "react";
import { formatRupiah } from "../lib/utils";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  ArrowDownRight,
  ShieldCheck,
  Coins,
} from "lucide-react";

export default function BalanceOverview({
  salary,
  totalPrimer,
  totalSekunder,
  totalTersier,
}) {
  const totalExpenses = totalPrimer + totalSekunder + totalTersier;
  const remainingSalary = salary - totalExpenses;
  const isOverbudget = remainingSalary < 0;

  // Calculate percentages based on salary (or total expenses if salary is 0)
  const baseTotal = salary > 0 ? salary : (totalExpenses || 1);
  const primerPct = Math.round((totalPrimer / baseTotal) * 100);
  const sekunderPct = Math.round((totalSekunder / baseTotal) * 100);
  const tersierPct = Math.round((totalTersier / baseTotal) * 100);
  const remainingPct = salary > 0 ? Math.max(0, Math.round((remainingSalary / salary) * 100)) : 0;
  const expensePct = salary > 0 ? Math.min(100, Math.round((totalExpenses / salary) * 100)) : 0;

  return (
    <div className="space-y-4">
      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Gaji Card */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Total Pemasukan Gaji
            </span>
            <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 font-mono tracking-tight">
              {formatRupiah(salary)}
            </h3>
            <p className="text-xs text-stone-400 mt-1">100% dari anggaran bulanan</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-stone-100 dark:bg-stone-800/40 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Total Pengeluaran Card */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Total Dialokasikan
            </span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 font-mono tracking-tight">
              {formatRupiah(totalExpenses)}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                {expensePct}% terpakai
              </span>
              <span className="text-stone-300 dark:text-stone-700">•</span>
              <span className="text-xs text-stone-400">3 Kategori</span>
            </div>
          </div>
        </div>

        {/* Sisa Saldo Gaji Card (Highlighted Burgundy) */}
        <div
          className={`rounded-2xl p-5 shadow-sm relative overflow-hidden border transition-all ${
            isOverbudget
              ? "bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-950 dark:text-rose-200"
              : "bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-950 text-white border-burgundy-700 shadow-burgundy-900/20 shadow-md"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isOverbudget
                  ? "text-rose-700 dark:text-rose-400"
                  : "text-burgundy-200"
              }`}
            >
              Sisa Saldo Gaji
            </span>
            <div
              className={`p-2 rounded-lg ${
                isOverbudget
                  ? "bg-rose-200/60 dark:bg-rose-900 text-rose-700 dark:text-rose-300"
                  : "bg-white/10 text-white backdrop-blur-sm"
              }`}
            >
              {isOverbudget ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="mt-3">
            <h3
              className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
                isOverbudget ? "text-rose-600 dark:text-rose-400" : "text-white"
              }`}
            >
              {formatRupiah(remainingSalary)}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              {isOverbudget ? (
                <span className="font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Overbudget (Melebihi Gaji)
                </span>
              ) : (
                <span className="text-burgundy-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  {remainingSalary === 0
                    ? "Tepat Habis (Zero-Based)"
                    : `${remainingPct}% Aman untuk Tabungan/Investasi`}
                </span>
              )}
            </div>
          </div>
          {!isOverbudget && (
            <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-burgundy-600/30 rounded-full blur-2xl pointer-events-none" />
          )}
        </div>
      </div>

      {/* Visual Allocation Distribution Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-burgundy-700 dark:text-burgundy-400" />
            <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Distribusi Pembagian Gaji
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
            <span>Standar Ideal: 50% Primer • 30% Sekunder • 20% Tersier/Tabungan</span>
          </div>
        </div>

        {/* Multi-segmented Progress Bar */}
        <div className="h-4 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden flex shadow-inner">
          {primerPct > 0 && (
            <div
              style={{ width: `${Math.min(100, primerPct)}%` }}
              title={`Primer: ${primerPct}% (${formatRupiah(totalPrimer)})`}
              className="bg-burgundy-700 hover:brightness-110 transition-all duration-300 h-full"
            />
          )}
          {sekunderPct > 0 && (
            <div
              style={{ width: `${Math.min(100 - primerPct, sekunderPct)}%` }}
              title={`Sekunder: ${sekunderPct}% (${formatRupiah(totalSekunder)})`}
              className="bg-rose-500 hover:brightness-110 transition-all duration-300 h-full"
            />
          )}
          {tersierPct > 0 && (
            <div
              style={{ width: `${Math.min(100 - primerPct - sekunderPct, tersierPct)}%` }}
              title={`Tersier: ${tersierPct}% (${formatRupiah(totalTersier)})`}
              className="bg-amber-500 hover:brightness-110 transition-all duration-300 h-full"
            />
          )}
          {remainingPct > 0 && !isOverbudget && (
            <div
              style={{ width: `${remainingPct}%` }}
              title={`Sisa/Tabungan: ${remainingPct}% (${formatRupiah(remainingSalary)})`}
              className="bg-emerald-500/80 hover:brightness-110 transition-all duration-300 h-full"
            />
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-burgundy-700 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-stone-700 dark:text-stone-300 block">
                Primer ({primerPct}%)
              </span>
              <span className="text-stone-400 font-mono text-[11px]">
                {formatRupiah(totalPrimer)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-stone-700 dark:text-stone-300 block">
                Sekunder ({sekunderPct}%)
              </span>
              <span className="text-stone-400 font-mono text-[11px]">
                {formatRupiah(totalSekunder)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-stone-700 dark:text-stone-300 block">
                Tersier ({tersierPct}%)
              </span>
              <span className="text-stone-400 font-mono text-[11px]">
                {formatRupiah(totalTersier)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-stone-700 dark:text-stone-300 block">
                Sisa Saldo ({remainingPct}%)
              </span>
              <span
                className={`font-mono text-[11px] ${
                  isOverbudget
                    ? "text-rose-500 font-bold"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {formatRupiah(remainingSalary)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
