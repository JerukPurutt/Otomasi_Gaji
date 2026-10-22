/**
 * Uploads generated base64 PNG to Google Drive via Google Apps Script Web App.
 * Uses mode: 'no-cors' with 'text/plain' to avoid CORS preflight blocks from Google's redirect.
 */
export const DEFAULT_GAS_URL =
  import.meta.env.VITE_GAS_URL || "";

export async function uploadToGoogleDrive(gasUrl = DEFAULT_GAS_URL, {
  dataUrl,
  filename,
  salary,
  totalExpenses,
  remainingSalary,
}) {
  const targetUrl = (gasUrl || DEFAULT_GAS_URL || "").trim();
  if (!targetUrl) {
    console.warn("Google Apps Script URL belum disetel di .env atau Vercel Environment Variables");
    return false;
  }

  const cleanBase64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
  const payload = {
    base64: cleanBase64,
    filename: filename || `sibi_simulasi_${Date.now()}.png`,
    folderName: "SIbi_Simulasi_Gaji",
    timestamp: new Date().toISOString(),
    salary,
    totalExpenses,
    remainingSalary,
  };

  try {
    await fetch(targetUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (error) {
    console.error("Gagal mengunggah ke Google Drive:", error);
    return false;
  }
}

export const APPS_SCRIPT_TEMPLATE = `// ==========================================
// KODE GOOGLE APPS SCRIPT UNTUK SIBI
// ==========================================
// 1. Buka https://script.google.com/home
// 2. Klik "New Project" / "Proyek Baru"
// 3. Hapus kode bawaan dan tempel kode di bawah ini:

function doPost(e) {
  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    
    var base64Data = data.base64;
    var fileName = data.filename || ("sibi_simulasi_" + new Date().getTime() + ".png");
    var folderName = data.folderName || "SIbi_Simulasi_Gaji";
    
    // Cari atau buat folder otomatis di Google Drive
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
    
    // Decode base64 dan simpan file gambar PNG ke Drive
    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, "image/png", fileName);
    var file = folder.createFile(blob);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      fileUrl: file.getUrl(),
      fileId: file.getId()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 4. Klik tombol "Deploy" (Terapkan) > "New deployment" (Penerapan baru)
// 5. Pilih jenis: "Web App" (Aplikasi Web)
// 6. Konfigurasi:
//    - Execute as (Jalankan sebagai): "Me" (Saya / akun Google Anda)
//    - Who has access (Siapa yang memiliki akses): "Anyone" (Siapa saja)
// 7. Klik "Deploy", izinkan akses akun (Authorize access), lalu SALIN Web App URL!
// 8. Tempel URL tersebut ke menu pengaturan Google Drive di website SIbi.
`;
