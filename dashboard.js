// 1. DEKLARASI API URL (Hanya boleh ada SATU di paling atas file)
API_URL = "https://script.google.com/macros/s/AKfycbwyJbnnjB5NgGrwYrq18KXH5QJZ6AoQAGXf26DCzkz_K-f4rveadXF7Uj6m8qqRQbumiA/exec";

// 2. LOAD IDENTITAS ACARA DENGAN PENGAMAN Halaman HTML
const elAplikasi = document.getElementById("namaAplikasi");
if (elAplikasi) elAplikasi.innerHTML = EVENT_CONFIG.namaAplikasi;

const elAcara = document.getElementById("namaAcara");
if (elAcara) elAcara.innerHTML = EVENT_CONFIG.namaAcara;

const elDetail = document.getElementById("detailAcara");
if (elDetail) elDetail.innerHTML = EVENT_CONFIG.tanggal + " • " + EVENT_CONFIG.lokasi;

// Jalankan fungsi saat pertama kali halaman dibuka
loadDashboard();

// 3. FUNGSI UTAMA DASHBOARD
async function loadDashboard() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        console.log("Data mentah dari Google Sheet:", data);

        if (!data || data.length <= 1) {
            console.warn("Google Sheet masih kosong atau hanya berisi header.");
            return;
        }

        // Filter data berdasarkan Kode Acara (Mengabaikan baris header indeks 0)
        const targetKode = EVENT_CONFIG.kodeAcara.trim().toLowerCase();
        
        const pesertaHadir = data.slice(1).filter(row => {
            if (row && row[1]) {
                return row[1].toString().trim().toLowerCase() === targetKode;
            }
            return false;
        });

        // Tampilkan Total Hadir di Dashboard/Proyektor
        const elTotal = document.getElementById("total");
        if (elTotal) elTotal.innerHTML = pesertaHadir.length;

        // Render tabel 5 nama orang terakhir
        const tbody = document.getElementById("listPeserta");
        if (tbody) {
            tbody.innerHTML = "";

            // Ambil maksimal 5 data terakhir dan balik urutannya agar yang terbaru di atas
            const limaTerakhir = pesertaHadir.slice(-5).reverse();

           limaTerakhir.forEach(row => {
                tbody.innerHTML += `
                    <tr>
                        <!-- Membuat kolom foto berada di tengah (center) secara horizontal dan vertikal -->
                        <td style="text-align: center; vertical-align: middle;">
                            <img src="${row || ''}" width="80" style="border-radius:15px; object-fit:cover; aspect-ratio:3/4; display: block; margin: 0 auto;">
                        </td>
        
                        <!-- Kolom Nama tetap rata kiri agar rapi dibaca -->
                        <td style="vertical-align: middle;">${row || "-"}</td>
        
                        <!-- Kolom Kabupaten tetap rata kiri agar rapi dibaca -->
                        <td style="vertical-align: middle;">${row || "-"}</td>
        
                        <!-- Membuat kolom waktu presensi berada di tengah (center) secara horizontal dan vertikal -->
                        <td style="text-align: center; vertical-align: middle;">${formatTime(row)}</td>
                    </tr>
                `;
            });

        }
    } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
    }
}

// 4. FUNGSI FORMAT WAKTU
function formatTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
    }) + " WIB";
}

// 5. AUTO REFRESH PROYEKTOR TIAP 5 DETIK
setInterval(loadDashboard, 5000);

// Biarkan fungsi ini murni mengembalikan nilai teks murni di paling bawah dashboard.js
function convertDrive(url) {
    return url;
}
