# Slice

Slice adalah prototipe antarmuka pemendek tautan berbasis HTML, CSS, dan JavaScript. Repo ini berisi frontend statis untuk halaman pemendek tautan dan dashboard.

> **Status:** demo frontend. Belum ada backend, database, autentikasi, atau layanan redirect. Tautan `slice.link/...` yang tampil di demo tidak dapat membuka URL tujuan.

## Fitur demo

- Memvalidasi dan menormalkan URL sebelum diproses.
- Membuat alias acak atau menerima alias khusus, lalu menampilkan hasil dalam format `slice.link/<alias>`.
- Menampilkan QR code dan menyediakan aksi salin serta berbagi melalui X atau WhatsApp.
- Menampilkan formulir untuk kata sandi, tanggal kedaluwarsa, dan opsi hapus setelah satu klik.
- Menyediakan modal sign-in/sign-up dan dashboard contoh.

Data tautan hanya disimpan di memori halaman dan hilang saat halaman dimuat ulang. Formulir autentikasi hanya memeriksa format input sebelum membuka dashboard. Opsi kata sandi, kedaluwarsa, dan hapus setelah satu klik belum diterapkan pada redirect. Angka, grafik, serta baris pada dashboard adalah data contoh statis, bukan analitik pengguna.

## Menjalankan secara lokal

Karena halaman memakai JavaScript ES modules, jalankan melalui server HTTP lokal, bukan dengan membuka `index.html` langsung.

```bash
python -m http.server 8000
```

Buka [http://localhost:8000](http://localhost:8000). Tekan `Ctrl+C` di terminal untuk menghentikan server.

Halaman memakai Google Fonts, QRCode.js, dan Chart.js dari CDN. Koneksi internet diperlukan untuk memuat aset tersebut.

## Struktur proyek

```text
.
├── index.html          # Halaman utama dan modal autentikasi demo
├── dashboard.html      # Dashboard dengan data contoh
├── css/
│   ├── base.css        # Reset, token warna, dan utilitas
│   ├── components.css  # Form, tombol, modal, dan komponen
│   ├── dashboard.css   # Gaya khusus dashboard
│   └── layout.css      # Tata letak halaman utama
└── js/
    ├── dashboard.js   # Grafik dan aksi tabel demo
    ├── main.js        # Validasi dan alur halaman utama
    ├── state.js       # Data tautan sementara di memori
    ├── ui.js          # Toast, modal, QR code, dan clipboard
    └── validator.js   # Validasi URL, kata sandi, dan username
```

## Teknologi

- HTML5 dan CSS3
- JavaScript ES modules tanpa framework
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) untuk QR code
- [Chart.js](https://www.chartjs.org/) untuk grafik dashboard contoh
- Plus Jakarta Sans melalui Google Fonts

## Batasan dan keamanan

Jangan gunakan demo ini untuk menyimpan tautan atau informasi sensitif. Pemeriksaan kata sandi dan username berjalan di browser, tidak mengamankan tautan, dan tidak menggantikan autentikasi server. Alias yang ditampilkan juga tidak memiliki layanan redirect.

Untuk menjadi pemendek tautan yang berfungsi, proyek ini memerlukan backend untuk menyimpan alias dan tujuan, menangani redirect, menegakkan kedaluwarsa atau hapus sekali pakai, mengelola autentikasi, serta mencatat klik.

## Lisensi

Repo ini belum menyertakan berkas lisensi. Hak penggunaan dan redistribusi belum ditetapkan.

## Rilis

- [V1](https://github.com/aldoprawiroa/url-shortener/releases/tag/v1.0.0): kondisi repo sebelum pembaruan dokumentasi ini.
- [V2](https://github.com/aldoprawiroa/url-shortener/releases/tag/v2.0.0): README yang lebih lengkap dan mencatat batasan prototipe.

