const API_URL =
"https://script.google.com/macros/s/AKfycbwyJbnnjB5NgGrwYrq18KXH5QJZ6AoQAGXf26DCzkz_K-f4rveadXF7Uj6m8qqRQbumiA/exec";

const API_URL = "https://google.com";

// LOAD IDENTITAS ACARA DENGAN PENGAMAN (Agar tidak crash jika ID HTML tidak ditemukan)
const elAplikasi = document.getElementById("namaAplikasi");
if (elAplikasi) elAplikasi.innerHTML = EVENT_CONFIG.namaAplikasi;

const elAcara = document.getElementById("namaAcara");
if (elAcara) elAcara.innerHTML = EVENT_CONFIG.namaAcara;

const elDetail = document.getElementById("detailAcara");
if (elDetail) elDetail.innerHTML = EVENT_CONFIG.tanggal + " • " + EVENT_CONFIG.lokasi;

// Jalankan fungsi utama dashboard
loadDashboard();


async function loadDashboard() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Membantu pengecekan: Buka Inspect Element (F12) -> Console di Browser untuk melihat data asli
        console.log("Data mentah dari Google Sheet:", data);

        if (!data || data.length <= 1) {
            console.warn("Google Sheet masih kosong atau hanya berisi header.");
            return;
        }

        // 1. FILTER DATA DENGAN AMAN (.trim() untuk menghapus spasi tak sengaja)
        const targetKode = EVENT_CONFIG.kodeAcara.trim().toLowerCase();
        
        const pesertaHadir = data.slice(1).filter(row => {
            // Pastikan kolom Kode Acara (Indeks 1 / Kolom B) tersedia sebelum di-filter
            if (row && row[1]) {
                return row[1].toString().trim().toLowerCase() === targetKode;
            }
            return false;
        });

        // 2. TAMPILKAN TOTAL HADIR
        document.getElementById("total").innerHTML = pesertaHadir.length;

        // 3. RENDER TABEL PESERTA
        const tbody = document.getElementById("listPeserta");
        tbody.innerHTML = "";

        // Ambil 5 data terbaru
        const limaTerakhir = pesertaHadir.slice(-5).reverse();

        limaTerakhir.forEach(row => {
            tbody.innerHTML += `
            <tr>
                <td>
                    <img src="${convertDrive(row[5])}" width="80" style="border-radius:15px; object-fit:cover; aspect-ratio:3/4;">
                </td>
                <td>${row[3] || "-"}</td>
                <td>${row[4] || "-"}</td>
                <td>${formatTime(row[2])}</td>
            </tr>
            `;
        });
    } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
    }
}


// Format Tampilan Waktu (Jam:Menit WIB)
function formatTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
    }) + " WIB";
}

// Auto-refresh proyektor setiap 5 detik secara otomatis
setInterval(loadDashboard, 5000);

// Konversi URL Google Drive agar bisa tampil sebagai gambar langsung
function convertDrive(url) {
    if (!url) return "";
    const id = url.match(/[-\w]{25,}/);
    if (id) {
        // Menggunakan sz=w300 agar resolusi thumbnail tajam di layar proyektor
        return `https://google.com{id[0]}&sz=w300`;
    }
    return url;
}



function formatTime(value){


    const date =
    new Date(value);



    return date.toLocaleTimeString(
        "id-ID",
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    );

}



loadDashboard();


setInterval(
loadDashboard,
5000
);

//Convert link Google Drive Foto menjadi Gambar

function convertDrive(url){

    if(!url){
        return "";
    }


    // ambil ID file Google Drive

    const id =
    url.match(/[-\w]{25,}/);


    if(id){

        return `https://drive.google.com/thumbnail?id=${id[0]}&sz=w300`;

    }


    return url;

}
