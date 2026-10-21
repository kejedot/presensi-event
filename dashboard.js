// 1. DEKLARASI API URL (Hanya boleh ada SATU di paling atas file)
API_URL = "https://script.google.com/macros/s/AKfycbwyJbnnjB5NgGrwYrq18KXH5QJZ6AoQAGXf26DCzkz_K-f4rveadXF7Uj6m8qqRQbumiA/exec";

// 2. RENDERING IDENTITAS ACARA (Dilengkapi validasi agar tidak eror)
function initEventConfig() {
    if (typeof EVENT_CONFIG !== 'undefined') {
        const elAplikasi = document.getElementById("namaAplikasi");
        if (elAplikasi) elAplikasi.innerHTML = EVENT_CONFIG.namaAplikasi || "DASHBOARD PRESENSI";

        const elAcara = document.getElementById("namaAcara");
        if (elAcara) elAcara.innerHTML = EVENT_CONFIG.namaAcara || "Nama Acara";

        const elDetail = document.getElementById("detailAcara");
        if (elDetail) elDetail.innerHTML = (EVENT_CONFIG.tanggal || "") + " • " + (EVENT_CONFIG.lokasi || "");
    }
}

// Jalankan setelan awal identitas & panggil data Google Sheet
initEventConfig();
loadDashboard();

// 3. FUNGSI UTAMA SINKRONISASI DATA
async function loadDashboard() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        console.log("Data masuk server:", data);

        if (!data || data.length <= 1) {
            return;
        }

        // Jalankan ulang nama identitas acara jika sewaktu-waktu config termuat belakangan
        initEventConfig();

        // Cari kode acara aktif (Mengabaikan baris header indeks 0)
        let targetKode = "";
        if (typeof EVENT_CONFIG !== 'undefined' && EVENT_CONFIG.kodeAcara) {
            targetKode = EVENT_CONFIG.kodeAcara.trim().toLowerCase();
        }

const pesertaHadir = data.slice(1).filter(item => {
let row = Array.isArray(item) ? item : (typeof item === 'string' ? item.split(',') : []);
if (row && row[1]) {
return row[1].toString().trim().toLowerCase() === targetKode;
}
return false;
});
// Perbarui Skor Total Hadir di Kanan
document.getElementById("total").innerHTML = pesertaHadir.length;
// Render Baris Tabel
const tbody = document.getElementById("listPeserta");
tbody.innerHTML = "";
// Ambil 5 Peserta Terakhir Hadir dan balik urutannya (terbaru di atas)
const limaTerakhir = pesertaHadir.slice(-5).reverse();
if (limaTerakhir.length === 0) {
tbody.innerHTML = <tr><td colspan="4" style="text-align: center; color: #94a3b8; padding: 40px 0;">Belum ada peserta masuk dengan kode: ${EVENT_CONFIG.kodeAcara}</td></tr>;
return;
}
limaTerakhir.forEach(item => {
let row = Array.isArray(item) ? item : (typeof item === 'string' ? item.split(',') : []);
if (row.length === 0) return;
// Pemetaan Kolom Google Sheet Anda:
const waktuPresensi = row[2];
const namaPeserta = row[3];
const asalKota = row[4];
// Baca Kolom I (Indeks 8). Jika kolom I kosong, gunakan kolom F (Indeks 5) sebagai cadangan otomatis
let urlFoto = row[8] || "";
if ((!urlFoto || !urlFoto.includes("http")) && row[5] && row[5].includes("http")) {
const matchId = row[5].match(/[-\w]{25,}/);
if (matchId) urlFoto = https://google.com{matchId}&sz=w300;
}
// Tambahkan ke tabel dengan class layout kaca premium
tbody.innerHTML += `
${namaPeserta || "-"}
${asalKota || "-"}
${formatTime(waktuPresensi)}
`;
});
} catch (error) {
console.error("Koneksi API Gagal/Bermasalah:", error);
}
}
// 4. FUNGSI PARSING WAKTU KE WIB (ANTI-INVALID DATE)
function formatTime(value) {
if (!value) return "-";
const cleanValue = value.toString().trim();
const date = new Date(cleanValue);
if (isNaN(date.getTime())) {
const matchTime = cleanValue.match(/(\d{2}):(\d{2})/);
return matchTime ? ${matchTime[1]}.${matchTime[2]} WIB : "-";
}
return date.toLocaleTimeString("id-ID", {
hour: "2-digit",
minute: "2-digit"
}).replace(':', '.') + " WIB";
}
// 5. AUTO REFRESH PER 5 DETIK
setInterval(loadDashboard, 5000);
