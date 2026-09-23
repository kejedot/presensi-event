// ==========================================
// KONFIGURASI
// ==========================================

// nanti diganti dengan URL Web App Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwyJbnnjB5NgGrwYrq18KXH5QJZ6AoQAGXf26DCzkz_K-f4rveadXF7Uj6m8qqRQbumiA/exec";



// ==========================================
// LOAD INFORMASI ACARA
// ==========================================


document.addEventListener(
"DOMContentLoaded",

function(){



// Logo

document.querySelector(".logo").src =
EVENT_CONFIG.logo;

document.getElementById(
"namaDPW"
)
.innerHTML =
EVENT_CONFIG.namaDPW;


// Nama aplikasi

document.getElementById(
"namaAplikasi"
)
.innerHTML =
EVENT_CONFIG.namaAplikasi;




// Nama kegiatan

document.getElementById(
"namaAcara"
)
.innerHTML =
EVENT_CONFIG.namaAcara;




// Detail acara

document.getElementById(
"detailAcara"
)
.innerHTML =

EVENT_CONFIG.tanggal
+
" • "
+
EVENT_CONFIG.lokasi;




// Deskripsi

document.getElementById(
"deskripsi"
)
.innerHTML =
EVENT_CONFIG.deskripsi;




// Panduan foto

const panduan =
document.getElementById(
"panduanFoto"
);



EVENT_CONFIG.panduanFoto.forEach(

(item)=>{


const li =
document.createElement("li");


li.innerHTML=item;


panduan.appendChild(li);


}



);



});



// ==========================================
// ELEMENT HTML
// ==========================================

const camera = document.getElementById("camera");

const preview = document.getElementById("preview");

const canvas = document.getElementById("canvas");

const photoBtn = document.getElementById("photoBtn");

const submitBtn = document.getElementById("submitBtn");

const namaInput = document.getElementById("nama");

const kotaInput = document.getElementById("kota");


// ==========================================
// DATA KABUPATEN/KOTA JAWA TENGAH
// ==========================================


const jawaTengah = [

"Kabupaten Banjarnegara",
"Kabupaten Banyumas",
"Kabupaten Batang",
"Kabupaten Blora",
"Kabupaten Boyolali",
"Kabupaten Brebes",
"Kabupaten Cilacap",
"Kabupaten Demak",
"Kabupaten Grobogan",
"Kabupaten Jepara",
"Kabupaten Karanganyar",
"Kabupaten Kebumen",
"Kabupaten Kendal",
"Kabupaten Klaten",
"Kabupaten Kudus",
"Kabupaten Magelang",
"Kabupaten Pati",
"Kabupaten Pekalongan",
"Kabupaten Pemalang",
"Kabupaten Purbalingga",
"Kabupaten Purworejo",
"Kabupaten Rembang",
"Kabupaten Semarang",
"Kabupaten Sragen",
"Kabupaten Sukoharjo",
"Kabupaten Tegal",
"Kabupaten Temanggung",
"Kabupaten Wonogiri",
"Kabupaten Wonosobo",
"Kota Magelang",
"Kota Pekalongan",
"Kota Salatiga",
"Kota Semarang",
"Kota Surakarta",
"Kota Tegal"

];



// menyimpan foto hasil capture

let photoData = null;

let stream = null;




// ==========================================
// AKTIFKAN KAMERA DEPAN
// ==========================================


async function startCamera(){


    try{


        stream = await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:"user",

                aspectRatio:{
                    ideal:0.75
                },

                width:{
                    ideal:1080
                },

                height:{
                    ideal:1440
                }
            },


            audio:false

        });



        camera.srcObject = stream;


    }


    catch(error){


        alert(
            "Kamera tidak dapat diakses. Pastikan izin kamera diberikan."
        );


        console.error(error);


    }


}





// jalankan kamera saat halaman dibuka

startCamera();





// ==========================================
// AMBIL FOTO
// ==========================================


photoBtn.addEventListener("click", function(){


    if(photoData){

        resetPhoto();

        return;

    }



    const videoWidth = camera.videoWidth;
    const videoHeight = camera.videoHeight;


    const canvasWidth = 1080;
    const canvasHeight = 1440;



    canvas.width = canvasWidth;
    canvas.height = canvasHeight;



    const ctx = canvas.getContext("2d");



    const ratioVideo = videoWidth / videoHeight;

    const ratioTarget = canvasWidth / canvasHeight;



    let cropWidth;
    let cropHeight;
    let cropX;
    let cropY;



    if(ratioVideo > ratioTarget){

        // crop kiri kanan

        cropHeight = videoHeight;

        cropWidth = videoHeight * ratioTarget;

        cropX = (videoWidth - cropWidth) / 2;

        cropY = 0;


    }else{


        // crop atas bawah

        cropWidth = videoWidth;

        cropHeight = videoWidth / ratioTarget;

        cropX = 0;

        cropY = (videoHeight - cropHeight) / 2;


    }




    ctx.drawImage(

        camera,

        cropX,
        cropY,
        cropWidth,
        cropHeight,

        0,
        0,
        canvasWidth,
        canvasHeight

    );




    photoData =
    canvas.toDataURL(
        "image/jpeg",
        0.9
    );



    preview.src = photoData;

    preview.style.display="block";



    photoBtn.innerHTML =
    "🔄 Foto Ulang";



    submitBtn.disabled=false;


});







// ==========================================
// RESET FOTO
// ==========================================


function resetPhoto(){


    photoData=null;


    preview.src="";

    preview.style.display="none";

    preview.classList.remove("show");

    photoBtn.innerHTML =
    "📷 Ambil Foto";


    photoBtn.style.background =
    "#2563eb";



    submitBtn.disabled=true;



}






// ==========================================
// VALIDASI FORM
// ==========================================


function validateForm(){


    if(
        namaInput.value.trim()===""
    ){

        alert(
        "Nama belum diisi"
        );


        return false;

    }



    if(
        kotaInput.value===""

    ){

        alert(
        "Kabupaten/Kota belum dipilih"
        );


        return false;


    }



    if(!photoData){


        alert(
        "Silakan ambil foto terlebih dahulu"
        );


        return false;


    }



    return true;


}



// ==========================================
// ISI DROPDOWN KABUPATEN/KOTA
// ==========================================


const kotaSelect =
document.getElementById("kota");


jawaTengah.forEach(function(kota){


    const option =
    document.createElement("option");


    option.value = kota;


    option.textContent = kota;


    kotaSelect.appendChild(option);


});




// ==========================================
// KIRIM PRESENSI
// ==========================================


submitBtn.addEventListener(

"click",

async function(){



    if(!validateForm()){

        return;

    }




    submitBtn.disabled=true;


    submitBtn.innerHTML=
    "Mengirim...";





    const data={

        kodeAcara:
        EVENT_CONFIG.kodeAcara,

        
        nama:
        namaInput.value,


        kota:
        kotaInput.value,


        foto:
        photoData,


        device:
        navigator.userAgent,


        waktu:
        new Date()
        .toISOString()


    };




    try{

console.log("DATA KIRIM", data);

        const response =
        await fetch(

            SCRIPT_URL,

            {


            method:"POST",


            body:
            JSON.stringify(data),


            headers:{


                "Content-Type":
                "text/plain;charset=utf-8"


            }


            }


        );





        const result =
        await response.json();





        if(result.status==="success"){



            alert(
            "Presensi berhasil dikirim"
            );



            resetForm();


        }


        else{


            alert(
            "Presensi gagal"
            );


        }



    }



    catch(error){



        console.error(error);



        alert(
        "Terjadi kesalahan koneksi"
        );



    }



    finally{


        submitBtn.disabled=false;


        submitBtn.innerHTML=
        "Kirim Presensi";


    }




});








// ==========================================
// RESET FORM SETELAH BERHASIL
// ==========================================


function resetForm(){



    namaInput.value="";


    kotaInput.value="";


    resetPhoto();



}
