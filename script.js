// =================================
// KONFIGURASI APPS SCRIPT
// =================================

// Ganti dengan URL Web App Apps Script nanti

const SCRIPT_URL = 
"https://script.google.com/macros/s/AKfycbx1EbSBfbhz7JYDVaLEmBfiMSOvxjwnOk__FGrYDvrR2oiNHlFVzu_3o3jP7gUcS95uEQ/exec";



// =================================
// ELEMENT HTML
// =================================

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");

const btnCamera = document.getElementById("btnCamera");
const btnSubmit = document.getElementById("btnSubmit");

let stream;
let fotoBase64 = "";



// =================================
// AKTIFKAN KAMERA
// =================================


btnCamera.addEventListener(
"click",
async function(){

    try {


        stream = await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:"user",
                width:{
                    ideal:720
                },
                height:{
                    ideal:960
                }
            },

            audio:false

        });

        video.srcObject = stream;
    }

    catch(error){

        alert(
        "Kamera tidak dapat digunakan.\nPastikan izin kamera diberikan."
        );

        console.error(error);
    }


});


// =================================
// AMBIL FOTO
// =================================

function ambilFoto(){


    if(!stream){

        alert(
        "Aktifkan kamera terlebih dahulu"
        );
        return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    const ctx =
    canvas.getContext("2d");
    ctx.drawImage(
        video,
        0,
        0,
        width,
        height
    );


    fotoBase64 =
    canvas.toDataURL(
        "image/jpeg",
        0.85
    );

    preview.src =
    fotoBase64;
    preview.style.display =
    "block";

    alert(
    "Foto berhasil diambil"
    );
}


// tombol kamera

btnCapture.onclick = function () {

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    fotoBase64 = canvas.toDataURL("image/jpeg", 0.9);

    previewFoto.src = fotoBase64;
    previewFoto.style.display = "block";
    video.style.display = "none";

    btnCapture.innerHTML = "📷 Ambil Ulang";
    btnRetake.style.display = "none";
    btnSubmit.disabled = false;
}

btnCapture.onclick = function () {

    if (previewFoto.style.display == "block") {

        previewFoto.style.display = "none";
        video.style.display = "block";

        btnCapture.innerHTML = "📸 Ambil Foto";
        btnSubmit.disabled = true;

        return;
    }

    // proses mengambil foto
}

// =================================
// KIRIM PRESENSI
// =================================
btnSubmit.addEventListener(
"click",
async function(){
    const nama =
    document.getElementById("nama").value;
    const asal =
    document.getElementById("asal").value;
    if(nama=="" || asal==""){
        alert(
        "Nama dan asal wajib diisi"
        );
        return;
    }

    if(fotoBase64==""){

        alert(
        "Ambil foto terlebih dahulu"
        );
        return;
    }

    const data = {
        nama:nama,
        asal:asal,
        foto:fotoBase64,
        waktu:
        new Date()
        .toLocaleString("id-ID")

    };
    try{
        btnSubmit.innerHTML =
        "Mengirim...";
        btnSubmit.disabled=true;
        await fetch(
            SCRIPT_URL,
            {

                method:"POST",

                mode:"no-cors",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:
                JSON.stringify(data)
            }
        );

        alert(
        "Presensi berhasil dikirim"
        );

        // reset form
        document
        .getElementById("nama")
        .value="";

        document
        .getElementById("asal")
        .value="";

        preview.style.display="none";
        fotoBase64="";
    }

    catch(error){
        alert(
        "Gagal mengirim presensi"
        );
        console.error(error);
    }

    finally{
        btnSubmit.innerHTML =
        "Kirim Presensi";
        btnSubmit.disabled=false;
    }
});
