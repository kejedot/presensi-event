const API_URL =
"https://script.google.com/macros/s/AKfycbwyJbnnjB5NgGrwYrq18KXH5QJZ6AoQAGXf26DCzkz_K-f4rveadXF7Uj6m8qqRQbumiA/exec";

// LOAD IDENTITAS ACARA
document.getElementById("namaAplikasi").innerHTML = EVENT_CONFIG.namaAplikasi;
document.getElementById("namaAcara").innerHTML = EVENT_CONFIG.namaAcara;
document.getElementById("detailAcara").innerHTML = EVENT_CONFIG.tanggal + " • " + EVENT_CONFIG.lokasi;

// Jalankan saat pertama kali halaman dimuat
loadDashboard();

async function loadDashboard() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log(data);

        // 1. Filter data berdasarkan Kode Acara (Mengabaikan baris header indeks 0)
        // row[1] adalah Kolom B (Kode Acara)
        const pesertaHadir = data.slice(1).filter(row => row[1] === EVENT_CONFIG.kodeAcara);

        // 2. Tampilkan Total Hadir di Proyektor
        document.getElementById("total").innerHTML = pesertaHadir.length;

        // 3. Ambil elemen tabel body untuk daftar nama
        const tbody = document.getElementById("listPeserta");
        tbody.innerHTML = "";

        // 4. Ambil 5 data TERAKHIR dan URUTKAN dari yang paling baru
        const limaTerakhir = pesertaHadir.slice(-5).reverse();

        // 5. Render ke dalam tabel HTML menggunakan urutan kolom Google Sheet Anda
        limaTerakhir.forEach(row => {
            tbody.innerHTML += `
            <tr>
                <td>
                    <img src="${convertDrive(row[5])}" width="80" style="border-radius:15px; object-fit:cover; aspect-ratio:3/4;">
                </td>
                <td>${row[3]}</td>
                <td>${row[4]}</td>
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
