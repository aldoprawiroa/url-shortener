# Slice

Slice adalah prototipe antarmuka pemendek tautan berbasis HTML, CSS, dan JavaScript. Repository ini berisi frontend statis untuk memeriksa format URL dan melihat pratinjau alias.

> **Status:** demo frontend statis. Tidak ada backend, database, autentikasi, redirect, penyimpanan tautan, atau pengumpulan analitik. Tombol pratinjau tidak membuat tautan pendek yang dapat digunakan.

## Yang tersedia

- Memeriksa URL HTTP atau HTTPS dengan parser URL bawaan browser.
- Memeriksa alias 3 sampai 30 karakter: huruf kecil, angka, dan tanda hubung tunggal di antara kata.
- Menampilkan pratinjau path alias tanpa mengirim atau menyimpan URL tujuan.
- Membuka halaman dashboard demo dengan status kosong yang menjelaskan batasan data.
- Mengganti tema terang dan gelap. Pilihan tema disimpan di localStorage; data URL dan alias tidak disimpan.

## Menjalankan secara lokal

JavaScript menggunakan ES modules, jadi sajikan file melalui server HTTP lokal. Dari direktori repository jalankan:

    python -m http.server 8000

Buka [http://localhost:8000](http://localhost:8000). Hentikan server dengan Ctrl+C.

Proyek ini tidak memerlukan proses build, framework, package manager, atau koneksi CDN. Font berasal dari system font stack agar antarmuka tetap tampil tanpa mengunduh font.

## Halaman

- index.html: formulir pemeriksaan URL dan pratinjau alias.
- dashboard.html: batasan data tautan dan analitik yang tersedia pada demo statis.

## Struktur proyek

    .
    ├── DESIGN.md
    ├── README.md
    ├── index.html
    ├── dashboard.html
    ├── anti-slop/
    │   ├── audit-001-2026-10-09.md
    │   └── follow-up-001-2026-10-09.md
    ├── css/
    │   ├── base.css
    │   ├── components.css
    │   ├── dashboard.css
    │   └── layout.css
    └── js/
        ├── main.js
        ├── theme.js
        └── validator.js

## Batasan dan keamanan

Pratinjau alias hanya memeriksa input di browser. URL tujuan tidak dikirim ke server atau disimpan, dan path yang ditampilkan bukan alamat redirect. Tema adalah satu-satunya preferensi yang disimpan di browser.

> Jangan gunakan demo ini untuk menyimpan tautan atau informasi sensitif. Pemeriksaan di browser tidak menggantikan validasi server atau autentikasi. Untuk membuat layanan pemendek tautan, proyek ini masih memerlukan backend untuk menyimpan alias dan URL tujuan, menangani redirect, mengelola akun bila dibutuhkan, serta mencatat klik sebelum analitik dapat ditampilkan.

## Arah visual dan audit

Keputusan visual dan alasan penggunaannya tercatat di [DESIGN.md](DESIGN.md). Audit After dan laporan tindak lanjut tersedia di [audit-001-2026-10-09.md](anti-slop/audit-001-2026-10-09.md) dan [follow-up-001-2026-10-09.md](anti-slop/follow-up-001-2026-10-09.md).

## Rilis

- [V1.0.0: snapshot awal](https://github.com/aldoprawiroa/url-shortener/releases/tag/v1.0.0)
- [V2.0.0: demo transparan dan perbaikan audit](https://github.com/aldoprawiroa/url-shortener/releases/tag/v2.0.0)
- [Semua rilis](https://github.com/aldoprawiroa/url-shortener/releases)

## Lisensi

Repository ini belum menyertakan file lisensi. Hak penggunaan dan redistribusi belum ditetapkan.
