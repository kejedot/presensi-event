# Presensi Digital

Sistem presensi acara berbasis mobile menggunakan:

- GitHub Pages sebagai frontend
- Google Apps Script sebagai API
- Google Sheet sebagai database
- Google Drive sebagai penyimpanan foto peserta


## Fitur

✅ Presensi melalui HP  
✅ Kamera selfie langsung dari browser  
✅ Preview foto sebelum dikirim  
✅ Foto ulang jika hasil kurang sesuai  
✅ Upload foto otomatis ke Google Drive  
✅ Penyimpanan data ke Google Sheet  
✅ ID Presensi otomatis  
✅ Informasi perangkat peserta  
✅ Tampilan mobile friendly  


---

# Struktur Project

presensi-digital/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
└── assets/
├── logo.png
└── icon-camera.svg



---

# Alur Sistem

Peserta

↓

GitHub Pages

↓

Camera API Browser

↓

Google Apps Script

↓

Google Sheet
(Data Presensi)

Google Drive
(Foto Peserta)



---

# Setup Frontend

Clone repository:

git clone https://github.com/username/presensi-digital.git

Buka:
index.html

atau deploy menggunakan:

GitHub Pages




---

# Setup Google Sheet


Buat spreadsheet:


Data Presensi



Nama sheet:


Presensi



Header:

|ID|Timestamp|Nama|Kabupaten/Kota|Foto|Device|Status|
|-|-|-|-|-|-|-|
|PRS-0001||||||



---

# Setup Google Drive


Buat folder:



Presensi Digital 2026

  |
  |
  Foto Peserta


Folder tersebut digunakan untuk menyimpan foto selfie peserta.


---

# Setup Google Apps Script


1. Buka Google Sheet

2. Pilih:


Extensions
→ Apps Script



3. Masukkan kode:


Code.gs



4. Deploy:



Deploy
→ New Deployment
→ Web App



Konfigurasi:

Execute as:
Me

Who has access:
Anyone


Salin URL API.


---

# Konfigurasi Frontend


Edit:


script.js

Bagian:

```javascript
const SCRIPT_URL =
"URL_APPS_SCRIPT";
```
ganti dengan URL Web App Google Apps Script.

--------------------

Format Data

Contoh:
ID	      Nama	Kota	Status
PRS-0001	Ahmad	Jambi	Hadir

Teknologi

Frontend:
HTML5
CSS3
Javascript

Backend:
Google Apps Script

Database:

Google Sheet

Storage:

Google Drive

-------------------
Developer

Presensi Digital System 2026


---

## File tambahan: `assets/icon-camera.svg`

Buat folder:
assets

Kemudian buat:
icon-camera.svg


Isi:
```svg
<svg xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2">

<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>

<circle cx="12" cy="13" r="4"/>

</svg>
