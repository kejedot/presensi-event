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
                return targetKode === "" || row[1].toString().trim().toLowerCase() === targetKode;
            }
            return false;
        });

        // Perbarui Angka Total Hadir di Papan Skor Kanan
        const elTotal = document.getElementById("total");
        if (elTotal) elTotal.innerHTML = pesertaHadir.length;

        // Render Tabel 5 Nama Terakhir di Panel Kiri
        const tbody = document.getElementById("listPeserta");
        if (tbody) {
            tbody.innerHTML = "";

            // Ambil maksimal 5 data terakhir lalu balik urutannya (terbaru di atas)
            const limaTerakhir = pesertaHadir.slice(-5).reverse();

            if (limaTerakhir.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #94a3b8; padding: 40px 0;">Belum ada peserta hadir dengan kode acara ini.</td></tr>`;
                return;
            }

            limaTerakhir.forEach(item => {
                let row = Array.isArray(item) ? item : (typeof item === 'string' ? item.split(',') : []);
                if (row.length === 0) return;

                // Pemetaan Kolom Google Sheet Anda:
                const waktuPresensi = row[2];
                const namaPeserta = row[3];
                const asalKota = row[4];
                
                // Ambil link thumbnail otomatis dari Kolom I (Indeks 8). Jika kolom I kosong, gunakan kolom F (Indeks 5) sebagai cadangan
                let urlFoto = row[8] || "";
                if ((!urlFoto || !urlFoto.includes("http")) && row[5] && row[5].includes("http")) {
                    const matchId = row[5].match(/[-\w]{25,}/);
                    if (matchId) urlFoto = `https://google.com{matchId[0]}&sz=w300`;
                }

                // Render baris menggunakan gaya visual Split-Screen Premium
                tbody.innerHTML += `
                <tr class="row-data">
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
        console.error("Gagal menyinkronkan data dashboard:", error);
    }
}

// 4. FUNGSI FORMAT JAM KE WIB
function formatTime(value) {
    if (!value) return "-";
    const cleanValue = value.toString().trim();
    const date = new Date(cleanValue);
    
    if (isNaN(date.getTime())) {
        const matchTime = cleanValue.match(/(\d{2}):(\d{2})/);
        return matchTime ? `${matchTime[1]}.${matchTime[2]} WIB` : "-";
    }
    
    return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
    }).replace(':', '.') + " WIB";
}

// 5. INTERVAL AUTO-REFRESH SINKRONISASI DATA TIAP 5 DETIK
setInterval(loadDashboard, 5000);
