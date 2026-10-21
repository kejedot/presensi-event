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
    // 1. PENGAMAN DATA: Jika baris berbentuk teks panjang, pecah otomatis menjadi array berdasarkan tanda koma
    let row = Array.isArray(item) ? item : (typeof item === 'string' ? item.split(',') : []);
    
    // Jika data kosong atau rusak, lewatkan baris ini
    if (row.length === 0) return;

    // 2. PEMETAAN INDEKS BERDASARKAN URUTAN DI GOOGLE SHEET ANDA
    // Berdasarkan teks mentah Anda:
    // row[0] = ID (PRS-...)
    // row[1] = Kode Acara (Sos-...)
    // row[2] = Timestamp (2026-10-20T...)
    // row[3] = Nama (Lik Sakdi)
    // row[4] = Asal (Kabupaten Tegal)
    // row[5] = Link Foto Asli (https://google.com...)
    // ... Kolom status, tipe browser, dsb.
    // row[8] = Link Thumbnail Foto dari Kolom I (https://google.comthumbnail...)

    const idFoto = row[0]; // ID Unik kehadiran untuk cadangan
    const kodeAcara = row[1];
    const waktuPresensi = row[2];
    const namaPeserta = row[3];
    const asalKota = row[4];
    
    // Ambil link thumbnail dari kolom ke-9 (indeks 8), jika kosong/tidak ada gunakan fallback regex dari kolom 5
    let urlFoto = row[8] || "";
    if (!urlFoto.includes("http") && row[5] && row[5].includes("http")) {
        const matchId = row[5].match(/[-\w]{25,}/);
        if (matchId) urlFoto = `https://google.comthumbnail?id=${matchId}&sz=w300`;
    }

    // 3. RENDER HTML KE TABEL (POSISI FOTO & WAKTU SUDAH CENTER)
    tbody.innerHTML += `
    <tr>
        <td style="text-align: center; vertical-align: middle;">
            <img src="${urlFoto}" width="80" style="border-radius:15px; object-fit:cover; aspect-ratio:3/4; display: block; margin: 0 auto;" onerror="this.src='https://placehold.co'">
        </td>
        <td style="vertical-align: middle; font-weight: bold; color: #333;">${namaPeserta || "-"}</td>
        <td style="vertical-align: middle; color: #555;">${asalKota || "-"}</td>
        <td style="text-align: center; vertical-align: middle; font-weight: 500;">${formatTime(waktuPresensi)}</td>
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
