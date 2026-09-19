# 🚀 TaskArts - Platform Produktivitas & Task OS

> **By Kafeinarts** | *Integrated Productivity Workspace, Financial Accounting Suite, Google Workspace Hub & Samsung DeX Desktop Mode*

TaskArts adalah sistem operasi produktivitas dan aplikasi web terpadu (Progressive Web App) yang menggabungkan manajemen tugas tingkat lanjut, perencanaan anggaran dan akuntansi bisnis, integrasi resmi ekosistem **Google Workspace** (Google Drive, Google Sheets, Google Meet, Google Contacts, Google Calendar), serta antarmuka multi-lingkungan: **Mode Aplikasi Standar (Material 3)** dan **Mode Desktop OS (Samsung DeX & Windows Style)**.

---

## 🌟 Daftar Fitur Utama

### 1. 🖥️ Mode Desktop OS (Samsung DeX & Windows Style)
- **Desktop Canvas & Icon System**: Penataan ikon aplikasi di atas wallpaper interaktif dengan grid desktop responsif.
- **Multitasking Window Manager**: Jendela aplikasi yang dapat dipindah (*draggable*), diperbesar/perkecil (*resizable*), diminimalkan (*minimize*), dan dimaksimalkan (*maximize/fullscreen*).
- **Taskbar & Start Menu**: Taskbar di bagian bawah layar dengan tombol Start Menu (pencarian instan aplikasi), indikator jendela aktif, jam sistem real-time, status kuota penyimpanan, dan kontrol cepat.
- **Transisi Mulus**: Pengguna dapat beralih antara Mode Aplikasi Standar dan Mode Desktop OS kapan saja tanpa kehilangan data atau status kerja.

### 2. 📏 Sidebar Desktop Resizable (Fleksibel Geser Kanan-Kiri)
- **Gagang Geser Drag-and-Drop**: Pengguna desktop dapat menarik (*drag*) batas kanan sidebar ke kanan maupun ke kiri untuk menyesuaikan lebar baca (antara **210px** hingga **550px**).
- **Preset Lebar Instan**: Tombol cepat **Ringkas (240px)**, **Nyaman (300px)**, dan **Luas (380px)** di bagian bawah sidebar serta tombol toggle rentang di bagian header.
- **Penyimpanan Preferensi Otomatis**: Posisi dan lebar sidebar disimpan secara persisten di *Local Storage*.
- **Anti-Cramping & Truncation Free**: Memastikan menu dengan nama panjang (seperti *Audit & Keamanan Finansial*, *Kompensasi & Reimbursement*) terbaca utuh tanpa terpotong.

### 3. 🌐 Google Workspace Hub Terintegrasi
- **Google Contacts (People API v1)**:
  - Sinkronisasi dan impor kontak tim/klien langsung dari Akun Google.
  - Tambah kontak baru ke Google Contacts dengan verifikasi konfirmasi pengguna.
  - Pencarian dan filter kategori (Tim Internal, Rekan, Klien).
- **Google Meet (Meetings API)**:
  - Pembuatan ruang rapat Google Meet instan (*Instant Meeting Space*).
  - Penyisipan link rapat otomatis ke draf pesan WhatsApp Casual & Profesional.
- **Google Sheets (Sheets API v4)**:
  - Ekspor seluruh daftar kontak ke spreadsheet Google Sheets dengan penataan kolom otomatis (*headers, formatting*).
- **Google Drive (Drive API v3)**:
  - Backup cloud aman untuk data kontak dan sistem dalam format JSON terenkripsi ke Google Drive pengguna.
- **Google Calendar (Calendar API v3)**:
  - Sinkronisasi jadwal, tenggat waktu (*deadline*) tugas, dan rapat ke kalender pengguna.

### 4. 💼 Modul Keuangan, Akuntansi & RAB
- **Money & Cash Flow Tracker**: Pencatatan arus kas harian, pemasukan, pengeluaran, serta sistem peringatan ambang batas anggaran bulanan (*Budget Threshold Exceeded*).
- **RAB & Kas Kegiatan (Project & Event)**: Rencana Anggaran Biaya, alokasi dana, realisasi belanja bertahap, dan ekspor lembar kerja Excel (.xlsx) serta PDF resmi dengan slot tanda tangan.
- **Accounts Payable & Receivable (AP/AR)**: Pengelolaan utang dan piutang bisnis lengkap dengan tanggal jatuh tempo dan kalkulasi status penagihan.
- **Kompensasi & Reimbursement**: Pengajuan klaim pengeluaran staf/karyawan, pelampiran bukti, dan persetujuan bertingkat.
- **Laporan Finansial & Audit Keamanan**: Laporan laba-rugi, neraca ringkas, rasio likuiditas, serta log jejak audit transaksi.

### 5. 📋 Produktivitas, Tugas & Dokumen
- **Task & To-Do List Pro**: 6 mode tampilan tugas (List, Kanban Board, Timeline, Kalender, Kategori, Prioritas) dilengkapi rasio produktivitas harian.
- **Project Management**: Manajemen kontrak, deliverable, dokumen kerja, dan pelacakan progres tim.
- **Invoice Generator Pro**: Pembuat faktur profesional dengan opsi format kertas A4/A5, kop surat kustom, watermark lunas, tabel item fleksibel, dan ekspor PDF.
- **Surat Builder**: Pembuat surat resmi (Surat Tugas, Surat Perjanjian, SPK, Penawaran, Keterangan Kerja) dengan tata letak otomatis dan pratinjau cetak.
- **CV Builder Pro**: Pembuat curriculum vitae berstandar ATS dengan pilihan layout sidebar, template profesional, dan unduh PDF.
- **Code Notes & Snippets**: Editor catatan kode pemrograman dengan *syntax highlighting* (Prism.js) dan dukungan visualisasi diagram (Mermaid.js).
- **Catatan Tempel (Sticky Notes) & Diary**: Catatan visual cepat berwarna-warni dan jurnal harian dengan mood tracker serta cuaca.

### 6. 🎮 Mini-Games & Simulator 3D Interaktif
- Koleksi game interaktif berbasis **Three.js** dan **Canvas 2D** (Tower Builder 3D, Snake 3D, Pong 3D, Memory Match, Typing Sprint, Speed Clicker, Space Defender) untuk jeda istirahat produktif (*brain break*).

---

## 🔌 Integrasi Backend Laravel (API Baru — Source of Truth)

Sejak refactor backend (Sept 2026), setiap modul aplikasi **memiliki pasangan API REST** di folder `../back-end` (Laravel 13 + MySQL). Backend ini disetujui sebagai *single source of truth* untuk data tersinkronisasi; frontend saat ini masih berjalan **offline-first** (Vuex + LocalStorage) dan dapat diarahkan untuk membaca/menulis API pada tahap integrasi berikutnya.

### Menjalankan Backend
```bash
cd ../back-end
composer install
cp .env.example .env          # set sqlite / mysql taskarts (sudah dikonfigurasi MySQL)
php artisan migrate --seed    # membuat tabel & user admin
php artisan serve             # http://127.0.0.1:8000
```

### Akses API
Semua endpoint berada di bawah prefix **`/api/v1`** dan dilindungi **Sanctum** (`Authorization: Bearer <token>`).
Template respons konsisten: `{ "success": bool, "message": string, "data": payload, "meta?": {} }`.

### Pemetaan Modul Frontend ↔ Endpoint API

| Modul Frontend (View) | Endpoint API (`/api/v1/...`) |
|---|---|
| `todoList.vue`, `TaskDetailView.vue`, `projectManagement.vue` | `/tasks`, `/tasks/{id}/complete` `/reopen`, `/projects` |
| `ContactsView.vue`, `VideoHubView.vue` | `/contacts` (+ `GET /contacts/stats`) |
| `moneyTracker.vue`, `CashFlowManagementView.vue`, `FinanceSecurityAuditView.vue` | `/finance/transactions`, `.../summary`, `.../cash-flow` |
| `BudgetingForecastingView.vue` | `/finance/budgets`, `.../{id}/sync-spent`, `.../{id}/usage` |
| `InvoiceView.vue` | `/finance/invoices`, `.../{id}/pdf`, `.../{id}/pay` |
| `AccountsPayableReceivableView.vue` | `/finance/ap-ar`, `.../{id}/settle` |
| `RabView.vue` | `/finance/rab` (+ `.../summary`) |
| `HabitTrackerView.vue` | `/habits`, `.../{id}/log` |
| `StickyNotesView.vue`, `DiaryView.vue`, `CodeNotesView.vue`, `MediumDraftView.vue` | `/notes`, `/diary`, `/code-notes`, `/drafts` |
| `CalendarView.vue`, `MoodAlarmView.vue` | `/events`, `/mood-logs`, `/work-alarms` |
| `CvBuilderView.vue` | `/cvs`, `.../{id}/default` |
| `HomeView.vue` (dashboard) | `/dashboard` |
| `PreferencesView.vue`, `SettingsView.vue` | `/settings`, `/settings/batch` |
| Ekspor Excel/PDF | `/reports/tasks|contacts|finance|rab/excel` & `.../pdf` |

> 🔒 **Catatan Keamanan:** `vue.config.js` masih mengandung nilai *default API key* Gemini yang dikirim ke `/api/chat`. Sebaiknya diganti dengan `process.env.GEMINI_API_KEY` saja (tanpa fallback hardcoded) sebelum dibagikan ke publik.

---

## 🛠️ Arsitektur Teknologi & Dependensi

| Kategori | Teknologi | Deskripsi |
|---|---|---|
| **Framework** | **Vue.js 3** (`3.2.x`) | Reactive Composition & Options API |
| **State Management** | **Vuex 4** (`4.0.x`) | Centralized application store & persistence |
| **Routing** | **Vue-Router 4** (`4.0.x`) | SPA route navigation & lazy loading chunks |
| **UI Framework** | **Bootstrap 5** & **Material 3** | Grid responsif, utilitas modern, dan styling custom M3 |
| **Icons** | **Bootstrap Icons** & **Lucide Vue** | Ikon vektor ringan dan ekspresif |
| **Cloud & Auth** | **Firebase SDK v12** | Firebase Auth (Google OAuth 2.0 with Workspace Scopes) |
| **3D Engine** | **Three.js** (`0.158.0`) | Render canvas 3D untuk simulator dan mini-games |
| **Diagrams & Parser** | **Mermaid.js** & **Marked** | Render flowchart, sequence diagram, & markdown live |
| **Ekspor Dokumen** | **jspdf** & **xlsx** | Generator dokumen PDF & spreadsheet Excel client-side |
| **Animasi** | **GSAP** & **AOS** | Micro-interactions dan transisi antar halaman halus |

---

## 📁 Struktur Direktori Proyek

```
productivity/
├── public/
│   ├── index.html              # Entry HTML point, font preconnects, meta SEO & OpenGraph
│   ├── favicon.ico             # Favicon standar
│   ├── logo.svg                # Logo vektor TaskArts Kafeinarts
│   └── manifest.json           # Manifest PWA (Progressive Web App)
├── src/
│   ├── App.vue                 # Shell utama aplikasi, Desktop DeX trigger, Resizable Sidebar, Themes
│   ├── main.js                 # Bootstrapper Vue, registrasi store, router, service worker
│   ├── registerServiceWorker.js# Konfigurasi caching offline PWA
│   ├── assets/                 # Gambar logo, avatar, dan aset statis
│   ├── components/             # Komponen modular yang dapat digunakan ulang
│   │   ├── DesktopDexWorkspace.vue # Simulator sistem operasi Desktop Samsung DeX / Windows
│   │   ├── AppNotifications.vue    # Notifikasi toast & peringatan kuota
│   │   ├── DukungDevModal.vue      # Modal apresiasi pengembang
│   │   ├── FinanceNavHeader.vue    # Navigasi tab modul akuntansi & keuangan
│   │   ├── CvLayoutRenderer.vue    # Renderer template CV profesional & ATS
│   │   └── games/                  # Seluruh komponen 3D mini-games Three.js
│   ├── data/                   # Data statis & tutorial onboarding
│   ├── router/
│   │   └── index.js            # Daftar rute aplikasi, lazy-loading views, error chunk recovery
│   ├── store/
│   │   └── index.js            # Vuex centralized state, mutasi data, filter, storage persistence
│   ├── utils/                  # Library pembantu & integrasi eksternal
│   │   ├── googleWorkspaceService.js # Klien resmi OAuth & REST Google Workspace
│   │   ├── googleCalendarService.js  # Sinkronisasi event Google Calendar
│   │   ├── storageManager.js         # Kuota local storage, auto-trim, kompresi aman
│   │   ├── financeSystemStore.js     # State transaksi, AP/AR, kas & RAB
│   │   ├── markdownRenderer.js       # Pengurai markdown & Mermaid live
│   │   └── pdfTabOpener.js           # Utilitas cetak dan unduh dokumen PDF
│   └── views/                  # Halaman tampilan utama aplikasi
│       ├── HomeView.vue              # Dashboard eksekutif & ringkasan metrik
│       ├── ContactsView.vue          # Kontak Tim, Google Workspace Hub & WA Broadcast
│       ├── todoList.vue              # To-Do list, Kanban, pengingat tenggat waktu
│       ├── moneyTracker.vue          # Pelacak keuangan, kas harian, grafik cash flow
│       ├── RabView.vue               # Rencana Anggaran Biaya & Kas Kegiatan
│       ├── InvoiceView.vue           # Pembuat invoice profesional A4/A5
│       ├── SuratBuilderView.vue      # Generator surat dinas & perjanjian resmi
│       ├── CvBuilderView.vue         # ATS & Visual CV Builder
│       ├── projectManagement.vue     # Manajemen proyek, milestone, kontrak klien
│       ├── CashFlowManagementView.vue# Manajemen arus kas & proyeksi keuangan
│       ├── AccountsPayableReceivableView.vue # Utang dan piutang usaha
│       ├── ExpenseReimbursementView.vue      # Klaim pengeluaran staf
│       ├── FinancialReportsView.vue  # Laporan neraca, laba/rugi, arus kas
│       ├── FinanceSecurityAuditView.vue      # Audit keamanan data finansial
│       ├── TeamCollaborationView.vue # Buletin tim, saluran diskusi, aset
│       ├── CalendarView.vue          # Kalender agenda terintegrasi
│       ├── StickyNotesView.vue       # Catatan tempel visual
│       ├── DiaryView.vue             # Jurnal harian & mood tracker
│       ├── CodeNotesView.vue         # Cuplikan kode pemrograman
│       ├── StorageView.vue           # Manajemen kapasitas memori browser
│       └── PreferencesView.vue       # Pengaturan tema (Light, Dark, OLED) & warna aksen
├── metadata.json               # Metadata aplikasi, izin frame (camera), capabilities
├── package.json                # Skrip build & daftar pustaka npm
└── vue.config.js               # Konfigurasi Vue CLI & PWA Workbox
```

---

## 🎨 Desain Sistem & Responsivitas

1. **Prinsip Anti-Cramping & Ritmik Layout**:
   - Seluruh halaman dibungkus dalam kontainer `.main-view-viewport` dengan batas `max-width: 1680px` terpusat, menjaga kepadatan konten tetap optimal pada monitor ultra-wide maupun layar laptop 13 inci.
   - Ruang nafas vertikal dan horizontal (*generous padding & margins*) yang konsisten pada kartu (*cards*), formulir (*inputs*), tabel (*responsive wrappers*), dan toolbar aksi (*action toolbars*).
   - Teks badge, chip kategori, dan label tombol dilindungi dengan `white-space: nowrap` agar tidak terpotong atau turun baris secara tidak estetis.

2. **Tema Visual (Theme Support)**:
   - **Mode Terang (Light Mode)**: Latar abu-abu lembut `#f8fafc` dengan kontras tipografi tajam `#0f172a`.
   - **Mode Gelap (Dark Mode / Slate Charcoal)**: Latar charcoal `#090d16` dan kartu `#131b2e` yang nyaman bagi mata untuk bekerja di malam hari.
   - **Mode OLED (Pure Black)**: Latar hitam pekat `#000000` dengan rasio kontras maksimal untuk layar OLED dan efisiensi baterai perangkat portabel.
   - **Aksen Warna Dinamis**: Pilihan warna aksen utama yang dapat disesuaikan (Royal Blue `#2563eb`, Sakura Rose Pink `#ec4899`, Emerald Green, Violet).

---

## 🚀 Panduan Menjalankan Aplikasi

### Kebutuhan Sistem
- **Node.js**: Versi `18.x` atau lebih baru
- **NPM** atau **Yarn**

### Instalasi Dependensi
```bash
npm install
```

### Menjalankan Server Pengembangan (Development)
Server pengembangan akan berjalan pada port `3000`:
```bash
npm run serve
```
Akses aplikasi melalui browser di: `http://localhost:3000`

### Membangun Paket Produksi (Production Build)
```bash
npm run build
```
File hasil kompilasi yang siap dideploy akan dibuat di direktori `dist/`.

---

## 🔒 Keamanan & Penanganan Data
- **Offline-First & Local Persistence**: Data operasional disimpan secara lokal di memori browser pengguna (`IndexedDB` & `LocalStorage`) melalui utilitas `storageManager.js` yang dilengkapi pencegahan kuota penuh dan pembersihan otomatis data lama.
- **OAuth Token Safety**: Token akses Google Workspace hanya disimpan di memori runtime aplikasi (*in-memory*) dan **tidak pernah** disimpan ke dalam *localStorage* atau cookie, mencegah kebocoran sesi jika perangkat digunakan bersama.
- **Konfirmasi Tindakan Pengguna**: Setiap penambahan data ke Google Contacts atau penghapusan data masal selalu meminta konfirmasi eksplisit melalui dialog interaktif SweetAlert2.

---

## 📄 Lisensi & Hak Cipta
Hak Cipta © 2026 **TaskArts by Kafeinarts**. Seluruh hak dilindungi undang-undang.
