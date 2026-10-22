/**
 * ========================================================
 * KODE GOOGLE APPS SCRIPT (UPLOAD GAMBAR SIBI KE GOOGLE DRIVE)
 * ========================================================
 * 
 * PANDUAN CEPAT 1 MENIT:
 * 1. Buka browser: https://script.google.com/
 * 2. Klik tombol "+ New project" (Proyek baru) di pojok kiri atas.
 * 3. Beri nama proyek, misal: "SIbi Drive Uploader".
 * 4. Hapus semua kode bawaan di editor, lalu TEMPEL (PASTE) seluruh kode di bawah ini.
 * 5. Klik icon Disket (Save) di toolbar.
 * 6. Klik tombol biru "Deploy" (Terapkan) di kanan atas > Pilih "New deployment" (Penerapan baru).
 * 7. Pada ikon gear (roda gigi) "Select type", pilih: "Web app" (Aplikasi web).
 * 8. Atur setelan:
 *    - Description: "Versi 1"
 *    - Execute as (Jalankan sebagai): "Me" (Saya / akun Google Anda)
 *    - Who has access (Siapa yang memiliki akses): "Anyone" (Siapa saja)  <-- WAJIB PILIH ANYONE!
 * 9. Klik "Deploy".
 * 10. Klik "Authorize access" (Izinkan akses) > Pilih akun Google Anda > Klik "Advanced" (Lanjutan) > Klik "Go to SIbi Drive Uploader (unsafe)" > Klik "Allow" (Izinkan).
 * 11. Salin (Copy) "Web app URL" (URL berakhiran /exec).
 * 12. Buka website SIbi Anda, klik ikon Cloud / Drive di samping tombol mode gelap, dan tempel URL tersebut.
 * 
 * SELESAI! Setiap kali Anda mendownload hasil simulasi, gambarnya otomatis tersimpan di HP/Laptop ANDA dan sekaligus otomatis masuk ke folder "SIbi_Simulasi_Gaji" di Google Drive Anda!
 */

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
    
    // Decode data base64 menjadi file PNG
    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, "image/png", fileName);
    var file = folder.createFile(blob);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "File berhasil disimpan",
      fileName: fileName,
      fileUrl: file.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handler GET opsional untuk mengetes apakah Web App sudah aktif
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Google Apps Script SIbi Drive Uploader aktif dan siap menerima upload!"
  })).setMimeType(ContentService.MimeType.JSON);
}
