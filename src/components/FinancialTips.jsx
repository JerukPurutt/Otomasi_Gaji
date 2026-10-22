import React from "react";
import { Lightbulb, Target, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { formatRupiah } from "../lib/utils";

export default function FinancialTips({
  salary,
  totalPrimer,
  totalSekunder,
  totalTersier,
}) {
  if (salary <= 0) return null;

  const totalExpenses = totalPrimer + totalSekunder + totalTersier;
  const remaining = salary - totalExpenses;
  const primerPct = Math.round((totalPrimer / salary) * 100);
  const sekunderPct = Math.round((totalSekunder / salary) * 100);
  const tersierPct = Math.round((totalTersier / salary) * 100);
  const remainingPct = Math.max(0, Math.round((remaining / salary) * 100));

  const tips = [];

  if (primerPct > 55) {
    tips.push({
      type: "warning",
      title: "Kebutuhan Primer Melebihi Rekomendasi (50%)",
      desc: `Porsi primer saat ini ${primerPct}%. Pertimbangkan untuk meninjau pos belanja dapur atau biaya sewa agar tidak menekan sisa tabunganmu.`,
    });
  }

  if (sekunderPct > 35) {
    tips.push({
      type: "warning",
      title: "Kebutuhan Sekunder Perlu Dikontrol",
      desc: `Porsi sekunder mencapai ${sekunderPct}% (ideal ≤30%). Cek langganan digital atau pengeluaran nongkrong/ngopi yang bisa dihemat.`,
    });
  }

  if (tersierPct > 20) {
    tips.push({
      type: "warning",
      title: "Pengeluaran Tersier Cukup Tinggi",
      desc: `Porsi tersier ${tersierPct}%. Pastikan kebutuhan pokok dan tabungan dana darurat sudah aman sebelum belanja barang mewah atau liburan.`,
    });
  }

  if (remaining > 0) {
    tips.push({
      type: "success",
      title: `Kabar Baik: Tersisa ${formatRupiah(remaining)} (${remainingPct}%)`,
      desc: "Sisa gaji ini sangat bagus dialokasikan langsung untuk Dana Darurat, Tabungan Masa Depan, atau Instrumen Investasi (Reksadana/SBN).",
    });
  } else if (remaining < 0) {
    tips.push({
      type: "danger",
      title: `Keuangan Defisit Sebesar ${formatRupiah(Math.abs(remaining))}`,
      desc: "Total pengeluaran melebihi gaji. Kurangi catatan pada kebutuhan Sekunder atau Tersier terlebih dahulu agar kembali seimbang.",
    });
  }

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-burgundy-700 dark:text-burgundy-400" />
        <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
          Analisis Finansial Cerdas (Pebi Insights)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              tip.type === "danger"
                ? "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200"
                : tip.type === "warning"
                ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200"
                : "bg-burgundy-50/50 dark:bg-burgundy-950/30 border-burgundy-200 dark:border-burgundy-900/50 text-burgundy-950 dark:text-burgundy-200"
            }`}
          >
            {tip.type === "danger" || tip.type === "warning" ? (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <span className="font-bold block mb-0.5">{tip.title}</span>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                {tip.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
