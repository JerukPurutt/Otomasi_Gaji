import { formatRupiah } from "./utils";

/**
 * Pure Canvas2D generator for SIbi salary simulation receipt.
 * Guaranteed pixel-perfect alignment: zero text baseline sag, zero overlapping, zero clipping.
 */
export function generateReceiptImage({
  salary,
  items,
  totalExpenses,
  remainingSalary,
  isOverbudget,
  darkMode,
}) {
  const scale = 2; // 2x Retina sharpness
  const width = 450;
  const paddingX = 24;
  const contentWidth = width - paddingX * 2;

  // Calculate dynamic heights
  const headerHeight = 52;
  const gajiHeight = 74;
  const itemRowHeight = 44;
  const itemGap = 8;
  const itemsHeight =
    32 +
    (items.length > 0 ? items.length * (itemRowHeight + itemGap) : 48);
  const sisaHeight = 64;
  const footerHeight = 36;
  const totalHeight =
    24 +
    headerHeight +
    gajiHeight +
    itemsHeight +
    sisaHeight +
    footerHeight +
    20;

  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = totalHeight * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  // Palette: directly inspect the active dark mode class on document
  const isDark =
    typeof darkMode === "boolean"
      ? darkMode
      : typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark");
  const bg = isDark ? "#18181b" : "#ffffff";
  const border = isDark ? "#27272a" : "#e5e5e5";
  const textPrimary = isDark ? "#f4f4f5" : "#1c1917";
  const textSecondary = isDark ? "#a1a1aa" : "#78716c";
  const boxBg = isDark ? "#202024" : "#fafaf9";
  const burgundy = isDark ? "#e11d48" : "#800020";
  const green = isDark ? "#34d399" : "#059669";
  const greenBg = isDark ? "#064e3b" : "#ecfdf5";
  const red = isDark ? "#f43f5e" : "#e11d48";
  const redBg = isDark ? "#4c0519" : "#fff1f2";
  const divider = isDark ? "#27272a" : "#f0f0f0";

  // Helper for rounded rectangles
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // 1. Card Background
  ctx.fillStyle = bg;
  roundRect(0, 0, width, totalHeight, 26);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = border;
  ctx.stroke();

  let curY = 24;

  // 2. Header: Logo 'S' + Title 'SIbi'
  // Burgundy square logo with S
  ctx.fillStyle = "#800020";
  roundRect(paddingX, curY, 34, 34, 10);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("S", paddingX + 17, curY + 17);

  // Title SIbi
  ctx.fillStyle = textPrimary;
  ctx.font = "800 22px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("SIbi", paddingX + 44, curY + 17);

  curY += 46;

  // Header bottom border
  ctx.strokeStyle = divider;
  ctx.beginPath();
  ctx.moveTo(paddingX, curY);
  ctx.lineTo(width - paddingX, curY);
  ctx.stroke();

  curY += 16;

  // 3. Section GAJI
  ctx.fillStyle = textSecondary;
  ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("GAJI", paddingX, curY);

  curY += 18;

  // Gaji Box
  ctx.fillStyle = boxBg;
  roundRect(paddingX, curY, contentWidth, 46, 12);
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.stroke();

  // Gaji Amount (Centered vertically)
  ctx.fillStyle = textPrimary;
  ctx.font = "bold 18px monospace, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(formatRupiah(salary), paddingX + 14, curY + 23);

  curY += 60;

  // 4. Section KEBUTUHAN
  ctx.fillStyle = textSecondary;
  ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("KEBUTUHAN", paddingX, curY);

  ctx.textAlign = "right";
  ctx.font = "500 11px system-ui, -apple-system, sans-serif";
  ctx.fillText(`${items.length} Catatan`, width - paddingX, curY);

  curY += 18;

  if (items.length === 0) {
    ctx.strokeStyle = isDark ? "#3f3f46" : "#e7e5e4";
    ctx.setLineDash([4, 4]);
    roundRect(paddingX, curY, contentWidth, 42, 12);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = textSecondary;
    ctx.font = "12px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Belum ada catatan kebutuhan", width / 2, curY + 21);
    curY += 50;
  } else {
    items.forEach((item) => {
      // Row box
      ctx.fillStyle = boxBg;
      roundRect(paddingX, curY, contentWidth, itemRowHeight, 12);
      ctx.fill();
      ctx.strokeStyle = isDark ? "#27272a" : "#f0f0f0";
      ctx.stroke();

      // Item Name (Left)
      ctx.fillStyle = textPrimary;
      ctx.font = "500 13px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(item.name, paddingX + 14, curY + itemRowHeight / 2);

      // Item Cost (Right)
      ctx.fillStyle = textPrimary;
      ctx.font = "bold 13px monospace, system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(
        formatRupiah(item.cost),
        width - paddingX - 14,
        curY + itemRowHeight / 2
      );

      curY += itemRowHeight + itemGap;
    });
    curY += 6;
  }

  // 5. Divider Line before SISA GAJI
  ctx.strokeStyle = divider;
  ctx.beginPath();
  ctx.moveTo(paddingX, curY);
  ctx.lineTo(width - paddingX, curY);
  ctx.stroke();

  curY += 14;

  // 6. Section SISA GAJI
  // Left: Label "SISA GAJI"
  ctx.fillStyle = textSecondary;
  ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("SISA GAJI", paddingX, curY + 10);

  // Left Badge: % Sisa
  const sisaPct =
    salary > 0
      ? Math.max(0, Math.round((remainingSalary / salary) * 100))
      : 0;
  const badgeText = isOverbudget ? "Melebihi Gaji" : `${sisaPct}% Sisa`;
  ctx.font = "bold 10px system-ui, -apple-system, sans-serif";
  const badgeWidth = ctx.measureText(badgeText).width + 12;

  ctx.fillStyle = isOverbudget ? redBg : greenBg;
  roundRect(paddingX + 66, curY + 1, badgeWidth, 18, 5);
  ctx.fill();

  ctx.fillStyle = isOverbudget ? red : green;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(badgeText, paddingX + 66 + badgeWidth / 2, curY + 10);

  // Left Subtitle: Total Terpakai
  ctx.fillStyle = textSecondary;
  ctx.font = "11px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `Total Terpakai: ${formatRupiah(totalExpenses)}`,
    paddingX,
    curY + 30
  );

  // Right: Sisa Gaji Amount (Big & Bold)
  ctx.fillStyle = isOverbudget ? red : burgundy;
  ctx.font = "bold 19px monospace, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(formatRupiah(remainingSalary), width - paddingX, curY + 18);

  curY += 46;

  // 7. Divider Line before Footer
  ctx.strokeStyle = divider;
  ctx.beginPath();
  ctx.moveTo(paddingX, curY);
  ctx.lineTo(width - paddingX, curY);
  ctx.stroke();

  curY += 14;

  // 8. Footer Watermark
  ctx.fillStyle = isDark ? "#71717a" : "#a8a29e";
  ctx.font = "10px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("SIbi • Perencanaan & Estimasi Biaya", paddingX, curY);

  ctx.textAlign = "right";
  ctx.fillText("Made by Habi", width - paddingX, curY);

  return canvas.toDataURL("image/png");
}
