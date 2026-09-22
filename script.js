// ==========================================
// KONFIGURASI
// ==========================================

// nanti diganti dengan URL Web App Google Apps Script
const SCRIPT_URL = "MASUKKAN_URL_APPS_SCRIPT";



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

                width:{
                    ideal:720
                },

                height:{
                    ideal:1280
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


photoBtn.addEventListener(
"click",

function(){



    if(photoData){


        // jika sudah ada foto
        // tombol menjadi foto ulang


        resetPhoto();


        return;


    }




    const context = canvas.getContext("2d");



    canvas.width = camera.videoWidth;

    canvas.height = camera.videoHeight;



    context.drawImage(

        camera,

        0,

        0,

        canvas.width,

        canvas.height

    );




    photoData = canvas.toDataURL(
        "image/jpeg",
        0.8
    );



    preview.src = photoData;


    preview.style.display="block";



    photoBtn.innerHTML =
    "🔄 Foto Ulang";



    photoBtn.style.background =
    "#f97316";



    submitBtn.disabled=false;



});







// ==========================================
// RESET FOTO
// ==========================================


function resetPhoto(){


    photoData=null;


    preview.src="";

    preview.style.display="none";



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


        nama:
        namaInput.value,


        kota:
        kotaInput.value,


        foto:
        photoData,


        waktu:
        new Date()
        .toISOString()


    };





    try{



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
