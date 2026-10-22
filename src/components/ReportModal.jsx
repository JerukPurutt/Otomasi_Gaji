import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import confetti from "canvas-confetti";
import {
  Download,
  X,
  FileCheck2,
  Calendar,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { formatRupiah } from "../lib/utils";
import { CATEGORIES } from "../data/categories";

export default function ReportModal({
  isOpen,
  onClose,
  salary,
  expenses,
  darkMode,
}) {
  const reportRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [periodTitle, setPeriodTitle] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  });

  if (!isOpen) return null;

  const totalPrimer = (expenses.primer || []).reduce((s, i) => s + i.cost, 0);
  const totalSekunder = (expenses.sekunder || []).reduce((s, i) => s + i.cost, 0);
  const totalTersier = (expenses.tersier || []).reduce((s, i) => s + i.cost, 0);
  const totalExpenses = totalPrimer + totalSekunder + totalTersier;
  const remainingSalary = salary - totalExpenses;
  const isOverbudget = remainingSalary < 0;

  const baseTotal = salary > 0 ? salary : (totalExpenses || 1);
  const primerPct = Math.round((totalPrimer / baseTotal) * 100);
  const sekunderPct = Math.round((totalSekunder / baseTotal) * 100);
  const tersierPct = Math.round((totalTersier / baseTotal) * 100);
  const remainingPct = salary > 0 ? Math.max(0, Math.round((remainingSalary / salary) * 100)) : 0;

  const handleDownloadPNG = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);

    const scrollContainer = scrollContainerRef.current;
    const originalScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

    try {
      // 1. Temporarily reset scroll to 0 so no element is shifted
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
      }

      // 2. Allow layout to settle
      await new Promise((resolve) => setTimeout(resolve, 150));

      const cardElement = reportRef.current;

      // 3. Render directly using html2canvas with full unconstrained cloned DOM
      const canvas = await html2canvas(cardElement, {
        scale: 2, // 2x crisp HD resolution
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: darkMode ? "#1c1917" : "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          const card = clonedDoc.querySelector("[data-report-card]");
          if (card) {
            // Unconstrain ALL ancestor elements in the cloned document
            // so html2canvas never clips top or bottom based on modal scroll/height limits
            let parent = card.parentElement;
            while (parent && parent !== clonedDoc.body) {
              parent.style.overflow = "visible";
              parent.style.maxHeight = "none";
              parent.style.height = "auto";
              parent.style.transform = "none";
              parent.scrollTop = 0;
              parent = parent.parentElement;
            }

            card.style.boxShadow = "none";
            card.style.transform = "none";
            card.style.margin = "0";
            card.style.width = "650px";
            card.style.maxWidth = "650px";
          }
        },
      });

      // 4. Create download link
      const dataUrl = canvas.toDataURL("image/png");
      window.__lastExportDataUrl = dataUrl; // for testing / debug

      const link = document.createElement("a");
      const safeTitle = (periodTitle || "bulan_ini").replace(/\s+/g, "_").toLowerCase();
      link.download = `pebi_laporan_gaji_${safeTitle}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 5. Celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#800020", "#b72d4e", "#e27a8f", "#f59e0b"],
        });
      } catch (err) {
        // decorative
      }
    } catch (err) {
      console.error("Gagal mendownload gambar:", err);
      alert("Terjadi kendala saat mengekspor gambar. Silakan coba kembali.");
    } finally {
      // 6. Restore original scroll position
      if (scrollContainer) {
        scrollContainer.scrollTop = originalScrollTop;
      }
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-burgundy-700 text-white">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base sm:text-lg">
                Preview & Unduh Laporan PNG
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Gambar utuh beresolusi tinggi, siap dibagikan atau disimpan ke galeri.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls (Custom Period Name) */}
        <div className="px-6 py-3 bg-stone-100/60 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-burgundy-700 dark:text-burgundy-400" />
            <span className="font-medium text-stone-700 dark:text-stone-300">
              Periode / Judul:
            </span>
            <input
              type="text"
              value={periodTitle}
              onChange={(e) => setPeriodTitle(e.target.value)}
              placeholder="Contoh: Oktober 2026"
              className="px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-semibold focus:outline-none focus:ring-1 focus:ring-burgundy-600"
            />
          </div>

          <div className="text-stone-500 dark:text-stone-400 text-[11px] font-medium">
            Format: High-Definition PNG (2x Retina)
          </div>
        </div>

        {/* Scrollable Preview Area containing the actual Card to export */}
        <div
          ref={scrollContainerRef}
          data-preview-container="true"
          className="p-4 sm:p-6 overflow-y-auto flex-1 bg-stone-100/60 dark:bg-stone-950/60 flex justify-center"
        >
          <div
            ref={reportRef}
            data-report-card="true"
            className="w-full max-w-[650px] bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6"
          >
            {/* Report Header */}
            <div className="flex items-start justify-between border-b border-stone-200 dark:border-stone-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-burgundy-700 flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
                  P
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-stone-50">
                      Pebi
                    </h1>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-burgundy-100 dark:bg-burgundy-950 text-burgundy-800 dark:text-burgundy-300 border border-burgundy-200 dark:border-burgundy-800">
                      Budget Report
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Laporan Estimasi & Alokasi Kebutuhan Finansial
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                  {periodTitle}
                </span>
                <span className="text-[11px] text-stone-400">
                  Dibuat secara instan
                </span>
              </div>
            </div>

            {/* Financial Highlights */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Total Gaji
                </span>
                <span className="text-sm sm:text-base font-extrabold font-mono text-stone-900 dark:text-stone-100 mt-1 block">
                  {formatRupiah(salary)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                  Total Terpakai
                </span>
                <span className="text-sm sm:text-base font-extrabold font-mono text-stone-900 dark:text-stone-100 mt-1 block">
                  {formatRupiah(totalExpenses)}
                </span>
              </div>

              <div
                className={`p-3.5 rounded-2xl border ${isOverbudget
                    ? "bg-rose-100 dark:bg-rose-950 border-rose-300 text-rose-700 dark:text-rose-300"
                    : "bg-burgundy-700 text-white border-burgundy-800 shadow-sm"
                  }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider block ${isOverbudget ? "text-rose-700 dark:text-rose-300" : "text-burgundy-200"
                    }`}
                >
                  Sisa Saldo
                </span>
                <span className="text-sm sm:text-base font-extrabold font-mono mt-1 block">
                  {formatRupiah(remainingSalary)}
                </span>
              </div>
            </div>

            {/* Health Status Ribbon */}
            <div
              className={`p-3 rounded-xl flex items-center justify-between text-xs font-semibold ${isOverbudget
                  ? "bg-rose-100/80 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900"
                  : "bg-burgundy-50 dark:bg-burgundy-950/60 text-burgundy-900 dark:text-burgundy-200 border border-burgundy-200 dark:border-burgundy-800"
                }`}
            >
              <div className="flex items-center gap-2">
                {isOverbudget ? (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                )}
                <span>
                  {isOverbudget
                    ? `Perhatian: Pengeluaran melebihi gaji sebesar ${formatRupiah(
                      Math.abs(remainingSalary)
                    )}`
                    : remainingSalary === 0
                      ? "Zero-Based: Seluruh dana teralokasi dengan pas tanpa sisa."
                      : `Keuangan Sehat: Tersisa ${remainingPct}% (${formatRupiah(
                        remainingSalary
                      )}) untuk tabungan & dana darurat.`}
                </span>
              </div>
            </div>

            {/* Visual Allocation Split */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-stone-600 dark:text-stone-300">
                <span>Distribusi Alokasi</span>
                <span>
                  {primerPct}% Primer • {sekunderPct}% Sekunder • {tersierPct}% Tersier
                </span>
              </div>
              <div className="h-3.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden flex shadow-inner">
                {primerPct > 0 && (
                  <div
                    style={{ width: `${primerPct}%` }}
                    className="bg-burgundy-700 h-full"
                  />
                )}
                {sekunderPct > 0 && (
                  <div
                    style={{ width: `${sekunderPct}%` }}
                    className="bg-rose-500 h-full"
                  />
                )}
                {tersierPct > 0 && (
                  <div
                    style={{ width: `${tersierPct}%` }}
                    className="bg-amber-500 h-full"
                  />
                )}
                {remainingPct > 0 && !isOverbudget && (
                  <div
                    style={{ width: `${remainingPct}%` }}
                    className="bg-emerald-500/80 h-full"
                  />
                )}
              </div>
            </div>

            {/* Itemized Categories Breakdown */}
            <div className="space-y-4 pt-2">
              {CATEGORIES.map((cat) => {
                const items = expenses[cat.id] || [];
                const catTotal = items.reduce((s, i) => s + i.cost, 0);
                const catPct =
                  salary > 0 ? Math.round((catTotal / salary) * 100) : 0;

                return (
                  <div
                    key={cat.id}
                    className="rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden"
                  >
                    <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.colorClasses.badge}`}
                        >
                          {cat.badge}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                          {cat.title}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300">
                        {formatRupiah(catTotal)}{" "}
                        <span className="text-stone-400 font-sans font-normal text-[11px]">
                          ({catPct}%)
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-stone-900/40">
                      {items.length === 0 ? (
                        <p className="text-xs text-stone-400 italic text-center py-1">
                          Tidak ada catatan pengeluaran
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800/40"
                            >
                              <span className="text-stone-700 dark:text-stone-300">
                                • {item.name}
                              </span>
                              <span className="font-mono font-medium text-stone-900 dark:text-stone-100">
                                {formatRupiah(item.cost)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Watermark */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="h-2 w-2 rounded-full bg-burgundy-700 inline-block" />
                <span>Pebi • Perencanaan & Estimasi Biaya</span>
              </div>
              <span>Made by Habi</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-xl transition-colors"
          >
            Tutup
          </button>

          <button
            onClick={handleDownloadPNG}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-burgundy-900/25 disabled:opacity-60 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? "Menyiapkan Gambar..." : "Unduh Gambar PNG"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
