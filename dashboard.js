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

limaTerakhir.forEach(item => {
    // Pengaman jika format baris pecah dari server
    let row = Array.isArray(item) ? item : (typeof item === 'string' ? item.split(',') : []);
    if (row.length === 0) return;

    const waktuPresensi = row[2];
    const namaPeserta = row[3];
    const asalKota = row[4];
    const urlFoto = row[8] || ""; // Kolom I Google Sheet Anda

    // RENDER KE STRUKTUR STRIP GRID ELEGAN BARU
    tbody.innerHTML += `
    <tr>
        <td class="center">
            <img src="${urlFoto}" class="avatar-img" onerror="this.src='https://placehold.co'">
        </td>
        <td>
            <span class="nama-peserta">${namaPeserta || "-"}</span>
        </td>
        <td>
            <span class="asal-kota">${asalKota || "-"}</span>
        </td>
        <td class="center">
            <span class="waktu-badge">${formatTime(waktuPresensi)}</span>
        </td>
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
    // Bersihkan jika ada spasi berlebih
    const cleanValue = value.toString().trim();
    const date = new Date(cleanValue);
    
    // Cek apakah tanggal valid
    if (isNaN(date.getTime())) {
        // Jika format bawaan gagal, coba potong teks Jam dari string ISO (ambil karakter jam menit)
        const matchTime = cleanValue.match(/(\d{2}):(\d{2})/);
        return matchTime ? `${matchTime[1]}.${matchTime[2]} WIB` : "-";
    }
    
    return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
    }).replace(':', '.') + " WIB";
}


// 5. AUTO REFRESH PROYEKTOR TIAP 5 DETIK
setInterval(loadDashboard, 5000);

// Biarkan fungsi ini murni mengembalikan nilai teks murni di paling bawah dashboard.js
function convertDrive(url) {
    return url;
}
