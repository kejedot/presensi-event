const API_URL =
"https://script.google.com/macros/s/AKfycbwyJbnnjB5NgGrwYrq18KXH5QJZ6AoQAGXf26DCzkz_K-f4rveadXF7Uj6m8qqRQbumiA/exec";

const API_URL =
"URL_APPS_SCRIPT";


async function loadDashboard(){


    const response =
    await fetch(API_URL);



    const data =
    await response.json();



    console.log(data);



    // hapus header

    const peserta =
    data.slice(1);



    // total hadir

    document
    .getElementById("total")
    .innerHTML =
    peserta.length;



    const tbody =
    document
    .getElementById("listPeserta");



    tbody.innerHTML="";



    peserta
    .slice(-5)
    .reverse()
    .forEach(row=>{


        tbody.innerHTML += `

        <tr>

            <td>
            ${row[3]}
            </td>


            <td>
            ${row[4]}
            </td>


            <td>
            ${formatTime(row[2])}
            </td>


        </tr>

        `;


    });


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
