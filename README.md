# ☀️ Temansiklus - Platform Edukasi, Kalender &amp; Skrining Kebidanan
### 🚀 Teknologi: Vue 3 + Tailwind CSS | 🎨 Tema Warna: Kuning Hangat, Amber &amp; Emas (Sunny Gold)

> **Platform Web Terintegrasi Edukasi Menstruasi, Kalender Pelacak Siklus Pintar, Skrining Triage Kebidanan, dan Evaluasi Pemahaman Berbasis Google Form untuk Remaja Putri.**

Website ini dibangun menggunakan **Vue 3 (Reactive Framework)** dan **Tailwind CSS**, dengan palet warna **Kuning Hangat / Emas / Amber** yang ceria, optimis, dan memberikan rasa nyaman tanpa warna pink, sesuai dengan identitas kesehatan reproduksi remaja dan kebidanan modern.

---

## 📸 Arsitektur Konsep Website (Sesuai Diagram Wireframe PNG)

```
              ┌───────────────────────────────────────────────┐
              │             Halaman utama website             │
              │                  Temansiklus                  │
              └───────────────────────┬───────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
            ▼                         ▼                         ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│     📖 Edukasi        │ │     📅 Kalender       │ │       📝 Kuis         │
│  Membaca materi       │ │    Mengisi tanggal    │ │  Menjawab pertanyaan  │
│      kesehatan        │ │         haid          │ │   (Google Form & Web) │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │       🩺 Panduan          │
                        │  Mengetahui kapan perlu   │
                        │        konsultasi         │
                        └───────────────────────────┘
```

---

## 🌟 4 Fitur Utama Website (Vue 3 &amp; Tailwind CSS)

### 1. 📖 Edukasi Pencegahan &amp; Manajemen Keluhan Menstruasi
Dikelola secara reaktif menggunakan tab Vue 3 (`activeTab`):
- **Dismenorea (Nyeri/Kram Perut Haid):** Penjelasan mekanisme pelepasan prostaglandin di miometrium dan **terapi non-farmakologi (alami)**: kompres hangat 15–20 menit di perut bawah, minuman herbal jahe/kunyit asam berkhasiat kurkumin (antiinflamasi), relaksasi napas dalam, dan posisi *child pose*. Dilengkapi panduan obat analgetik (asam mefenamat/ibuprofen) sesuai anjuran bidan/dokter.
- **Personal Hygiene Menstruasi:** Teknik cebok standar kebidanan (**dari DEPAN ke BELAKANG**) agar bakteri *E. coli* tidak masuk saluran kemih/vagina, anjuran ganti pembalut teratur **setiap 3–4 jam**, serta pakaian dalam berbahan katun.
- **Pencegahan Anemia &amp; Tablet Tambah Darah (TTD):** Program Kemenkes RI minum TTD 1 tablet seminggu sekali bersama air putih/jus vitamin C, serta larangan minum TTD bersama **teh, kopi, atau susu**.
- **PMS (Premenstrual Syndrome):** Pengendalian fluktuasi hormon estrogen/progesteron, pembatasan garam untuk mencegah kembung, dan pentingnya tidur cukup.
- **Mitos vs Fakta Kebidanan:** Mengoreksi mitos larangan keramas, larangan minum air es, dan mitos darah kotor beracun.

---

### 2. 📅 Kalender Menstruasi &amp; Tracker Interaktif
- **Kalkulasi Reaktif Vue 3:** Prediksi Hari Pertama Haid Berikutnya (HPHT + panjang siklus), hitung mundur hari (*countdown*), fase siklus hari ini (Menstruasi, Folikuler, Ovulasi, Luteal), dan perkiraan masa subur.
- **Navigasi Kalender Bulanan:** Grid kalender responsif yang menandai:
  - *Kuning/Amber solid:* Hari haid yang dicatat pengguna.
  - *Garis putus-putus amber:* Perkiraan haid bulan berikutnya.
  - *Hijau toska muda:* Perkiraan jendela masa subur dan hari ovulasi.
- **Catatan Harian Gejala (Daily Logger):** Klik tanggal mana saja untuk mencatat aliran darah (*spotting*, sedang, deras), tingkat nyeri kram (0–10), mood, dan catatan pribadi.
- **LocalStorage &amp; Cetak Laporan:** Seluruh riwayat tersimpan otomatis di browser pengguna dan dapat dicetak (*Print Report*) untuk konsultasi faskes.

---

### 3. 🩺 Panduan &amp; Skrining Mandiri Siklus Menstruasi (Triage Kebidanan)
- **Standar Fisiologis FIGO &amp; IBI:** Panjang siklus normal (21–35 hari), durasi haid (3–8 hari), frekuensi pembalut (3–5 kali/hari), serta penjelasan adaptasi menarche remaja putri.
- **Kalkulator Skrining Mandiri (Self-Triage):** Algoritma 5 pertanyaan kebidanan dengan rekomendasi kategori warna:
  - 🟢 **Kategori Hijau (Normal/Fisiologis):** Siklus sehat ideal.
  - 🟡 **Kategori Kuning (Perlu Observasi):** Variasi ringan/adaptasi pubertas, tips pantau 3 siklus.
  - 🔴 **Kategori Merah (Waspada/Rujukan Medis):** Tanda bahaya (nyeri melumpuhkan, perdarahan menorrhagia, atau amenorea >90 hari), rekomendasi segera ke Bidan Puskesmas atau Dokter Sp.OG.
- **Tanda Bahaya (*Red Flags*):** Panduan cepat gejala darurat reproduksi remaja.

---

### 4. 📝 Kuis Evaluasi Pengetahuan &amp; Integrasi Google Form
- **Integrasi Google Form Responsif:**
  - Embed form di dalam kartu website.
  - Tombol buka langsung di tab baru untuk kenyamanan pengguna *smartphone*.
  - **Modal Kustomisasi Link:** Memungkinkan guru UKS, bidan, atau mahasiswa peneliti memasukkan URL Google Form milik mereka sendiri kapan saja.
- **Kuis Interaktif Langsung di Website (Vue 3 State):**
  - 5 soal evaluasi pengetahuan kebidanan dengan skor otomatis (0–100).
  - Pembahasan ilmiah instan untuk setiap jawaban yang dipilih.
  - Umpan balik kognitif (Tinggi, Sedang, Kurang) di akhir kuis.

---

### 5. 🌸 Buku Tamu &amp; Pelacak Identitas Pengunjung (Visitor Tracking)
Fitur khusus agar **pemilik website mengetahui siapa saja yang telah mengunjungi/mengklik website**:
- **Alur Pengunjung:** Saat pertama kali membuka website, muncul modal sambutan ramah meminta input:
  1. Nama Lengkap / Panggilan
  2. Usia (Tahun)
  3. Asal Sekolah / Instansi
  4. Kota / Kabupaten Asal
- **Logika &amp; Penyimpanan:**
  - Data langsung disimpan di *LocalStorage* agar pengunjung yang kembali tidak perlu mengisi ulang.
  - Sapaan nama personal ditampilkan di header &amp; banner: *"👋 Halo, Siti (SMAN 1)"*.
  - Data otomatis dikirimkan ke **Netlify Forms** di cloud sehingga pemilik website menerima rekap pengunjung secara real-time.
- **Panel Rekap Pemilik Website (Admin):**
  - Pemilik website dapat melihat daftar pengunjung melalui tombol *"🔐 Rekap Pengunjung Pemilik"* di footer (kode akses: `admin`).
  - Tersedia tombol **"Unduh Rekap (.CSV)"** untuk membuka daftar pengunjung di Microsoft Excel.

---

## 💡 Penjelasan Inovasi Program Kebidanan

| Komponen Inovasi | Penjelasan &amp; Landasan Ilmiah |
| :--- | :--- |
| **1. Tujuan Inovasi** | • Meningkatkan literasi kesehatan reproduksi remaja putri secara digital, bebas hambatan tabu, dan berbasis kebidanan.<br>• Mencegah anemia defisiensi besi dan komplikasi dismenorea yang kerap memicu absensi belajar siswi di sekolah.<br>• Memberikan sarana deteksi dini kelainan ginekologi remaja sedini mungkin. |
| **2. Manfaat Inovasi** | • **Bagi Remaja Putri:** Mengurangi kecemasan, meningkatkan rasa percaya diri, dan memandirikan perawatan diri selama menstruasi.<br>• **Bagi Bidan/Faskes:** Memperoleh data riwayat siklus (*anamnesis*) yang rapi dan valid saat pasien datang berkonsultasi.<br>• **Bagi Guru &amp; Sekolah (UKS):** Mendukung kurikulum Trias UKS dan memfasilitasi program pemantauan Tablet Tambah Darah (TTD).<br>• **Bagi Orang Tua:** Menjadi media jembatan komunikasi edukatif yang sehat antara ibu dan anak perempuan. |
| **3. Cara Kerja Inovasi** | Memadukan 4 pilar berurutan: **Eksplorasi Edukasi** $\rightarrow$ **Pencatatan Mandiri (Kalender)** $\rightarrow$ **Skrining Mandiri (Triage)** $\rightarrow$ **Evaluasi Berkala (Kuis &amp; Google Form)**. |
| **4. Sasaran Pengguna** | • Remaja putri usia 10–19 tahun (siswi SMP, SMA/SMK, mahasiswi baru).<br>• Kader Posyandu Remaja &amp; Konselor Sebaya (*Peer Counselor*).<br>• Tim Pelaksana Usaha Kesehatan Sekolah (UKS).<br>• Bidan Praktik Mandiri (BPM) dan Bidan Desa/Puskesmas. |
| **5. Metode Evaluasi Dampak** | Menggunakan Google Form sebagai instrumen *Pre-Test* dan *Post-Test* terstandar untuk menghitung nilai perolehan pengetahuan (*normalized gain score*). Respon tersambung otomatis ke *Google Sheets* memudahkan analisis statistik (seperti Uji Paired T-Test atau Wilcoxon). |

---

## 🎨 Desain Visual &amp; Karakteristik Warna Kuning (Sunny Gold &amp; Amber)

- **Warna Utama:** Amber &amp; Golden Yellow (`#f59e0b`, `#d97706`, `#b45309`, `#fef3c7`, `#fffdf7`), dikombinasikan dengan Slate gelap (`#0f172a`, `#1e293b`) untuk kontras yang elegan dan mudah dibaca.
- **Kenapa Kuning?** Kuning dan amber melambangkan energi, kehangatan, harapan, dan suasana ceria, sangat cocok untuk meredakan ketegangan psikologis remaja putri mengenai menstruasi tanpa kesan klise warna pink.
- **Framework:** **Vue 3** untuk reaktivitas UI instan tanpa reload halaman, dan **Tailwind CSS** untuk tata letak modern, bersih, dan 100% responsif di ponsel, tablet, maupun desktop.

---

## 🚀 Cara Menjalankan Website

Cukup **klik dua kali (*double click*) file `index.html`** di folder proyek ini melalui File Explorer. Website akan langsung terbuka di browser Anda (Google Chrome, Microsoft Edge, Mozilla Firefox) dengan seluruh fitur Vue 3 dan Tailwind CSS berjalan lancar.

---

## 📁 Berkas Proyek

```
d:\JOKI EDUKASI MENSTRUASI\
│
├── index.html                           # Struktur utama halaman web (Vue 3 App + Tailwind CSS)
├── vue-app.js                           # Logika aplikasi Vue 3 (State, Computed, Methods, Storage)
├── styles-yellow.css                    # Styling khusus tema kuning/amber, animasi, & print
├── README.md                            # Dokumentasi lengkap inovasi, kebidanan, & arsitektur sistem
└── gambaran website edukasi menstruasi.jpeg # Diagram acuan alur konsep website
```
