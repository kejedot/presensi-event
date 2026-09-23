const API_URL =
"https://script.google.com/macros/s/AKfycbwyJbnnjB5NgGrwYrq18KXH5QJZ6AoQAGXf26DCzkz_K-f4rveadXF7Uj6m8qqRQbumiA/exec";


async function loadDashboard(){


const response =
await fetch(API_URL);



const data =
await response.json();



let jumlah =
data.length-1;



document
.getElementById("total")
.innerHTML =
jumlah;



let tbody =
document
.getElementById("listPeserta");



data
.slice(-5)
.reverse()
.forEach(row=>{


tbody.innerHTML += `

<tr>

<td>${row[3]}</td>

<td>${row[4]}</td>

<td>${row[2]}</td>

</tr>

`;


});


}



loadDashboard();



setInterval(

loadDashboard,

5000

);
