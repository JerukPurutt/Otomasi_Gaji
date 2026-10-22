import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format integer to Rupiah string: e.g. 5000000 -> "Rp 5.000.000"
export function formatRupiah(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Convert string input with formatting back to number: "Rp 5.000.000" -> 5000000
export function parseRupiah(str) {
  if (typeof str === "number") return str;
  if (!str) return 0;
  const cleaned = str.toString().replace(/[^0-9]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
}
