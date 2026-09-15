// src/data/menuTutorials.js
// Panduan & Tutorial Lengkap Seluruh Menu TaskArts

export const MENU_CATEGORIES = [
  { id: 'all', name: '🌟 Semua Menu', count: 25 },
  { id: 'workflow', name: '📌 Workflow & Dokumen', count: 6 },
  { id: 'communication', name: '👥 Tim & Komunikasi', count: 2 },
  { id: 'finance', name: '💰 Keuangan & Data', count: 4 },
  { id: 'productivity', name: '📅 Agenda & Produktivitas', count: 10 },
  { id: 'system', name: '⚙️ Sistem & Panduan', count: 3 }
];

export const MENU_TUTORIALS = [
  // ==========================================
  // GROUP 1: WORKFLOW & DOKUMEN
  // ==========================================
  {
    id: 'dashboard',
    category: 'workflow',
    categoryLabel: 'Workflow & Dokumen',
    title: 'Dashboard Utama & Habit Tracker',
    icon: '📊',
    badge: 'Ikhtisar & Produktivitas',
    route: '/',
    overview: 'Pusat komando harian yang menyajikan ikhtisar seluruh aktivitas: ringkasan status tugas, pelacak kebiasaan (Habit Tracker), saldo keuangan terkini, progres proyek aktif, serta bingkai kutipan motivasi harian.',
    targetUser: 'Semua pengguna di awal dan akhir jam kerja untuk melihat ringkasan prioritas.',
    steps: [
      {
        stepNumber: 1,
        title: 'Cek Widget Metrik Utama',
        desc: 'Lihat kartu statistik di bagian atas untuk memantau jumlah tugas aktif (To-Do), total proyek berjalan, dan saldo kas secara seketika.',
        keyAction: 'Pantau indikator angka ringkasan harian.'
      },
      {
        stepNumber: 2,
        title: 'Isi Habit Tracker Harian',
        desc: 'Centang kotak kebiasaan positif (misal: minum air, membaca buku, olahraga, coding) untuk mempertahankan streak harian.',
        keyAction: 'Klik checkbox kebiasaan hari ini.'
      },
      {
        stepNumber: 3,
        title: 'Gunakan Quick Action Bar',
        desc: 'Gunakan tombol pintas untuk langsung membuat tugas baru, mencatat pengeluaran, membuka kamera scan, atau memulai Pomodoro tanpa membuka menu samping.',
        keyAction: 'Klik tombol aksi cepat di bagian tengah dashboard.'
      },
      {
        stepNumber: 4,
        title: 'Lihat Bingkai Motivasi',
        desc: 'Baca kutipan inspiratif harian. Anda dapat mengkustomisasi kutipan dan gaya frame melalui tombol edit bingkai motivasi.',
        keyAction: 'Klik ikon pensil pada frame motivasi untuk kustomisasi.'
      }
    ],
    keyFeatures: [
      { name: 'Multi-Metric Widgets', detail: 'Sinkronisasi otomatis dengan data To-Do, Keuangan, dan Proyek.' },
      { name: 'Habit Consistency Tracker', detail: 'Pencatatan rekor berturut-turut (streak) mingguan.' },
      { name: 'Interactive Frame Motivasi', detail: 'Menampilkan kutipan inspirasi yang dapat disesuaikan.' }
    ],
    practicalScenario: {
      context: 'Membuka hari kerja pada pukul 08:30 pagi.',
      solution: 'Buka Dashboard, lihat 3 tugas prioritas tinggi yang harus diselesaikan sebelum makan siang, centang habit "Rapat Pagi", dan klik tombol "Mulai Pomodoro" untuk sesi fokus pertama.'
    },
    proTips: [
      'Klik salah satu widget metrik untuk langsung melompat ke halaman modul terkait.',
      'Habit tracker otomatis mereset checklist setiap pergantian hari pukul 00:00 tanpa menghilangkan histori streak.'
    ],
    faq: {
      q: 'Bagaimana cara mengubah daftar kebiasaan di Habit Tracker?',
      a: 'Buka modul Habit Tracker atau klik tanda kelola pada panel habit untuk menambah, mengubah nama, atau menghapus target kebiasaan baru.'
    }
  },
  {
    id: 'todo',
    category: 'workflow',
    categoryLabel: 'Workflow & Dokumen',
    title: 'To-Do List & Kanban Board 5-in-1',
    icon: '✅',
    badge: 'Manajemen Tugas & Eisenhower',
    route: '/todo',
    overview: 'Sistem manajemen tugas komprehensif dengan 5 sudut pandang (Kanban Board, List Prioritas, Matriks Eisenhower Mendesak vs Penting, Kalender Bulanan, dan Tabel Spreadsheet).',
    targetUser: 'Profesional, project manager, dan freelancer yang mengelola multi-tasking dengan deadline ketat.',
    steps: [
      {
        stepNumber: 1,
        title: 'Tambahkan Tugas Baru',
        desc: 'Klik tombol "+ Tambah Tugas", masukkan judul, deskripsi rinci, tanggal deadline, tingkat prioritas (Tinggi, Sedang, Rendah), dan tag label proyek.',
        keyAction: 'Ketik judul tugas dan tekan tombol Simpan.'
      },
      {
        stepNumber: 2,
        title: 'Pilih Mode Tampilan Favorit',
        desc: 'Pilih salah satu dari 5 tab tampilan: Board Kanban (geser kartu tugas), List Detail, Matriks Eisenhower (4 Kuadran), Kalender Jadwal, atau Tabel Spreadsheet.',
        keyAction: 'Klik tab navigasi tampilan di sudut atas daftar tugas.'
      },
      {
        stepNumber: 3,
        title: 'Kelola Subtasks & Checklist',
        desc: 'Buka detail tugas untuk menambahkan checklist sub-tugas berurutan. Progress bar akan otomatis naik seiring Anda menyelesaikan subtasks.',
        keyAction: 'Centang item subtask yang telah selesai.'
      },
      {
        stepNumber: 4,
        title: 'Pindahkan Status Tugas (Workflow)',
        desc: 'Pada mode Kanban, tarik kartu tugas dari kolom "To-Do" ke "In Progress", lalu ke "Done" saat tugas berhasil diselesaikan.',
        keyAction: 'Drag-and-drop kartu tugas antar kolom status.'
      }
    ],
    keyFeatures: [
      { name: 'Matriks Eisenhower 4-Kuadran', detail: 'Pemisahan otomatis: 1. Mendesak & Penting, 2. Tidak Mendesak tapi Penting, 3. Mendesak tapi Tidak Penting, 4. Delegasi/Hapus.' },
      { name: 'Filter & Search Cepat', detail: 'Pencarian instan kata kunci, filter kategori label, dan pengurutan berdasarkan tenggat waktu.' },
      { name: 'Subtask Checklist Bar', detail: 'Visualisasi persentase penyelesaian tahapan tugas.' }
    ],
    practicalScenario: {
      context: 'Menerima 8 instruksi pekerjaan baru dari atasan dalam sehari.',
      solution: 'Gunakan tampilan Matriks Eisenhower untuk memprioritaskan tugas mendesak hari ini di Kuadran 1, jadwalkan tugas perancangan di Kuadran 2, dan delegasikan sisanya.'
    },
    proTips: [
      'Gunakan tombol bintang (Favorite) pada tugas penting agar selalu muncul di bagian teratas widget dashboard.',
      'Tugas yang telah selesai (Done) dapat diarsipkan atau difilter agar papan kerja tetap rapi.'
    ],
    faq: {
      q: 'Apakah tugas yang dibuat tersinkronisasi ke Kalender Agenda?',
      a: 'Ya, seluruh tugas yang memiliki tanggal batas waktu (deadline) otomatis muncul di modul Kalender & Agenda.'
    }
  },
  {
    id: 'project',
    category: 'workflow',
    categoryLabel: 'Workflow & Dokumen',
    title: 'Proyek & Kontrak Klien',
    icon: '💼',
    badge: 'Milestone & Nilai Kontrak',
    route: '/project',
    overview: 'Modul pelacakan portofolio proyek bisnis dan freelance: mencatat persentase pengerjaan (0-100%), nilai nominal kontrak kerja, termin Down Payment (DP), serta pelunasan.',
    targetUser: 'Freelancer, agensi kreatif, software house, dan konsultan bisnis.',
    steps: [
      {
        stepNumber: 1,
        title: 'Buat Entri Proyek Baru',
        desc: 'Klik "+ Proyek Baru", masukkan nama proyek, nama klien, rentang tanggal mulai & selesai, serta estimasi nilai kontrak.',
        keyAction: 'Isi formulir pembuatan proyek dan tentukan status awal.'
      },
      {
        stepNumber: 2,
        title: 'Tentukan Tahapan Milestone',
        desc: 'Pecah proyek menjadi beberapa tahapan milestone (misal: UI/UX Wireframe 25%, Backend API 50%, Testing 80%, Launching 100%).',
        keyAction: 'Tambahkan daftar milestone di panel detail proyek.'
      },
      {
        stepNumber: 3,
        title: 'Catat Termin Keuangan Proyek',
        desc: 'Masukkan pembayaran uang muka (DP) dan sisa termin. Sistem akan menghitung sisa piutang yang belum dilunasi klien.',
        keyAction: 'Perbarui nominal kas masuk termin pembayaran.'
      },
      {
        stepNumber: 4,
        title: 'Hubungkan ke Invoice',
        desc: 'Gunakan tombol "Buat Invoice Proyek" untuk otomatis menerbitkan tagihan penagihan resmi kepada klien terkait.',
        keyAction: 'Klik ikon invoice untuk menerbitkan faktur tagihan.'
      }
    ],
    keyFeatures: [
      { name: 'Progress Bar Visual', detail: 'Tampilan persentase progres pengerjaan dengan kode warna dinamis.' },
      { name: 'Finansial Tracking Proyek', detail: 'Kalkulasi otomatis total nilai kontrak vs termin uang yang telah diterima.' },
      { name: 'Filter Kategori & Klien', detail: 'Penyaringan proyek berdasarkan status (Aktif, Tertunda, Selesai).' }
    ],
    practicalScenario: {
      context: 'Mengerjakan proyek pembuatan website senilai Rp 15.000.000 dengan sistem pembayaran 3 termin.',
      solution: 'Catat proyek di modul ini, perbarui progres tiap rilis milestone, dan terbitkan invoice tagihan termin kedua saat progress mencapai 50%.'
    },
    proTips: [
      'Gunakan status "On Hold" jika proyek sedang menunggu feedback dari klien agar tidak memengaruhi metrik deadline aktif.'
    ],
    faq: {
      q: 'Bisakah data proyek diekspor ke format spreadsheet?',
      a: 'Bisa, Anda dapat mengekspor rekap portofolio proyek ke format CSV atau backup JSON di menu Preferences.'
    }
  },
  {
    id: 'camera',
    category: 'workflow',
    categoryLabel: 'Workflow & Dokumen',
    title: 'Kamera & Scanner Dokumen Fisik',
    icon: '📸',
    badge: 'Computer Vision & Scanner',
    route: '/camera',
    overview: 'Alat pemindai berkas fisik (nota belanja, kuitansi, sertifikat, berkas kantor) langsung menggunakan kamera laptop atau smartphone dengan filter pembersih citra berkas resolusi tinggi.',
    targetUser: 'Admin kantor, panitia acara, bendahara, dan siapapun yang perlu mendigitalisasi kuitansi belanja lapangan.',
    steps: [
      {
        stepNumber: 1,
        title: 'Beri Izin Akses Kamera',
        desc: 'Saat pertama kali membuka modul, klik "Izinkan Kamera" pada dialog peramban. Pilih kamera belakang (untuk HP) atau webcam (untuk laptop).',
        keyAction: 'Pilih perangkat kamera aktif pada menu dropdown.'
      },
      {
        stepNumber: 2,
        title: 'Posisikan Dokumen & Jepret',
        desc: 'Letakkan nota/kertas di permukaan datar dengan pencahayaan cukup. Pastikan teks berada dalam garis panduan, lalu tekan tombol jepret bundar.',
        keyAction: 'Tekan tombol shutter kamera untuk mengambil foto.'
      },
      {
        stepNumber: 3,
        title: 'Terapkan Filter Pembersih Citra',
        desc: 'Pilih filter dokumen: "Adaptive Grayscale" (menghilangkan bayangan dan mempertajam tulisan) atau "High-Contrast Document Enhancer".',
        keyAction: 'Pilih tombol filter hitam-putih untuk hasil seperti mesin fotokopi.'
      },
      {
        stepNumber: 4,
        title: 'Simpan ke Galeri / Download PDF',
        desc: 'Beri judul dokumen pindaian, lalu simpan ke galeri dokumen lokal atau unduh berkas sebagai file PNG tajam / PDF dokumen resmi.',
        keyAction: 'Klik "Simpan Hasil Scan" atau "Unduh PDF".'
      }
    ],
    keyFeatures: [
      { name: 'Adaptive Grayscale Engine', detail: 'Algoritma Canvas 2D yang memproses piksel citra agar teks kuitansi terbaca tajam.' },
      { name: 'Kamera Depan/Belakang Switcher', detail: 'Dukungan pergantian kamera lingkungan (environment camera) di ponsel.' },
      { name: 'Galeri Dokumen Lokal', detail: 'Arsip tersimpan aman di peramban tanpa pernah diunggah ke server eksternal.' }
    ],
    practicalScenario: {
      context: 'Membeli perlengkapan seminar di toko alat tulis dan harus melampirkan nota ke laporan kas RAB.',
      solution: 'Buka Kamera Scan, jepret kuitansi toko, terapkan filter dokumen hitam-putih, unduh berkasnya, dan lampirkan ke transaksi kas RAB.'
    },
    proTips: [
      'Gunakan tombol rotasi 90° jika posisi foto kuitansi terbalik sebelum disimpan.',
      'Gunakan shortcut keyboard Alt+K dari halaman manapun untuk membuka pemindai kamera secara instan.'
    ],
    faq: {
      q: 'Apakah foto dokumen saya aman dan tidak bocor ke internet?',
      a: 'Sangat aman. Pemrosesan citra 100% dilakukan di memori internal peramban (client-side) tanpa dikirim ke server luar.'
    }
  },
  {
    id: 'surat',
    category: 'workflow',
    categoryLabel: 'Workflow & Dokumen',
    title: 'Generator Surat Resmi & Kop Custom',
    icon: '✉️',
    badge: 'Administrasi & Bulk Mail Merge',
    route: '/surat',
    overview: 'Pembuat naskah dinas resmi dengan 12 template surat standar, kustomisasi logo & kop surat ganda instansi, variabel dinamis {{nama}}, Mode Massal (Bulk Mail Merge), integrasi WhatsApp, dan tanda tangan digital.',
    targetUser: 'Sekretaris, HRD, pengurus organisasi, panitia kegiatan, dan pelaku UMKM.',
    steps: [
      {
        stepNumber: 1,
        title: 'Pilih Template Naskah Dinas',
        desc: 'Pilih salah satu dari 12 template: Surat Lamaran Kerja, Resign, Pakelaring, Penawaran Harga, Surat Tugas (SPTD), Surat Kuasa, Surat Peringatan (SP), Perjanjian Kerja (MoU/PKWT), Keterangan Aktif, Izin Magang, Undangan Resmi, atau Rekomendasi Karir.',
        keyAction: 'Klik kartu template naskah dinas yang diinginkan.'
      },
      {
        stepNumber: 2,
        title: 'Atur Logo & Kop Surat Instansi',
        desc: 'Buka tab "Kop & Logo", unggah file logo perusahaan (PNG/JPG), atur tinggi logo dengan slider piksel, pilih perataan (kiri/tengah/kanan), dan tentukan garis ganda resmi.',
        keyAction: 'Unggah logo instansi dan lengkapi alamat kop surat.'
      },
      {
        stepNumber: 3,
        title: 'Isi Data Surat & Variabel Dinamis',
        desc: 'Lengkapi nomor surat, perihal, nama penerima, isi paragraf naskah, dan penandatangan. Anda dapat menggunakan variabel seperti {{nama}}, {{perusahaan}}, dan {{nomor_surat}}.',
        keyAction: 'Sesuaikan redaksi naskah pada formulir editor.'
      },
      {
        stepNumber: 4,
        title: 'Gunakan Mode Massal (Opsional)',
        desc: 'Jika ingin membuat puluhan surat sekaligus, aktifkan tab "Mode Massal (Mail Merge)", masukkan daftar penerima, lalu generate otomatis seluruh surat.',
        keyAction: 'Klik tombol "Generate Surat Massal" untuk ratusan penerima.'
      },
      {
        stepNumber: 5,
        title: 'Cetak PDF / Broadcast WhatsApp',
        desc: 'Periksa preview surat di panel kanan. Klik "Cetak / Export PDF" untuk menghasilkan dokumen A4 resmi, atau kirim pesan notifikasi surat ke WhatsApp penerima.',
        keyAction: 'Tekan tombol "Cetak PDF" atau "Kirim WhatsApp".'
      }
    ],
    keyFeatures: [
      { name: '12 Naskah Dinas Standar Indonesia', detail: 'Format tata naskah formal sesuai kaidah persuratan resmi.' },
      { name: 'Kop Surat Instansi Fleksibel', detail: 'Dukungan upload logo mandiri, tinggi kustom, dan pembatas garis ganda.' },
      { name: 'Bulk Mail Merge Engine', detail: 'Penggantian token otomatis untuk pencetakan dokumen massal.' },
      { name: 'WhatsApp Auto Formatter', detail: 'Konversi nomor 08 menjadi 628 dengan naskah pengantar pesan siap kirim.' }
    ],
    practicalScenario: {
      context: 'Panitia seminar harus mengirimkan 50 Surat Undangan Narasumber & Tamu VIP dengan nomor surat berurutan.',
      solution: 'Gunakan template Undangan Resmi, aktifkan Mode Massal, tempel daftar 50 nama tamu, klik "Nomor Otomatis", dan cetak seluruh surat dalam satu batch PDF.'
    },
    proTips: [
      'Gunakan tanda tangan transparan format PNG agar terlihat menyatu alami dengan naskah surat.',
      'Gunakan shortcut Ctrl+P saat preview aktif untuk langsung membuka dialog print browser.'
    ],
    faq: {
      q: 'Bagaimana cara menambahkan logo instansi kustom pada kop surat?',
      a: 'Masuk ke tab "Kop & Logo" di editor surat, lalu klik tombol "Upload Logo Baru" untuk memilih file PNG/JPG dari komputer atau ponsel Anda.'
    }
  },
  {
    id: 'cv',
    category: 'workflow',
    categoryLabel: 'Workflow & Dokumen',
    title: 'ATS CV & 20 Layout Resume Builder',
    icon: '📄',
    badge: 'Karir & Multi-Kandidat',
    route: '/cv',
    overview: 'Platform pembuatan Curriculum Vitae (CV) terstandarisasi Applicant Tracking System (ATS) internasional dengan 20 varian layout siap pakai, Custom Layout Builder mandiri, Meteran Pengukur Tinggi A4 & tombol ⚡ Auto-Fit 1 Halaman, Mode Multi-Kandidat (Batch CV), dan live ATS scoring.',
    targetUser: 'Jobseeker, fresh graduate, profesional karir, headhunter, HRD, dan konsultan rekrutmen.',
    steps: [
      {
        stepNumber: 1,
        title: 'Pilih Mode Tunggal atau Multi-Kandidat',
        desc: 'Pilih "Mode Profil Tunggal" untuk CV pribadi, atau "Mode Multi-Kandidat" untuk mengelola dan mencetak banyak CV pelamar kerja/kandidat sekaligus.',
        keyAction: 'Pilih toggle mode di bagian atas CV Builder.'
      },
      {
        stepNumber: 2,
        title: 'Lengkapi Data Profil & Pengalaman',
        desc: 'Isi formulir kontak, ringkasan profesional (summary), riwayat pekerjaan berbobot metrik, riwayat pendidikan, daftar keahlian teknis (skills), bahasa, dan sertifikasi.',
        keyAction: 'Lengkapi seluruh langkah wizard input CV.'
      },
      {
        stepNumber: 3,
        title: 'Atur & Unggah Foto Profil (Opsional)',
        desc: 'Unggah foto profil, pilih bentuk (Bulat, Rounded, Square, Berbingkai), tentukan ukuran (Kecil, Sedang, Besar), posisi tata letak, atau sembunyikan foto untuk format ATS ketat.',
        keyAction: 'Atur konfigurasi foto di panel Pengaturan Foto.'
      },
      {
        stepNumber: 4,
        title: 'Pilih dari 20 Layout atau Buat Custom Layout',
        desc: 'Pilih salah satu dari 20 layout (Modern ATS Classic, Split Sidebar Left/Right, Executive Horizon, Harvard Serif, Nordic Slate, dll) atau rancang tata letak mandiri melalui Custom Layout Studio (pengaturan 1/2 kolom, reorder section, distribusi sidebar/main).',
        keyAction: 'Pilih kartu layout pada Langkah 5 Desain.'
      },
      {
        stepNumber: 5,
        title: 'Kunci Pas 1 Halaman A4 & Ekspor PDF',
        desc: 'Pantau meteran pengukur tinggi A4. Jika konten melebihi 1 halaman, klik tombol "⚡ Auto-Fit 1 Halaman A4" untuk memadatkan spasi secara otomatis, lalu klik "Cetak / Simpan PDF".',
        keyAction: 'Klik "⚡ Auto-Fit 1 Halaman" lalu "Cetak PDF".'
      }
    ],
    keyFeatures: [
      { name: '20 Katalog Layout Profesional', detail: 'Kategori Single Column ATS, Split Sidebar Grid, Executive Horizon, dan Modern Tech.' },
      { name: 'Custom Layout Builder Studio', detail: 'Bebas atur jumlah kolom (1 atau 2 kolom), rasio lebar, urutan section (▲/▼), dan posisi penempatan.' },
      { name: 'Meteran Pengukur Tinggi A4 & Auto-Fit', detail: 'Kalkulasi tinggi konten terhadap standar 1123px A4 dengan tombol pemadat spasi 1-klik.' },
      { name: 'Mode Multi-Kandidat (Batch Generator)', detail: 'Kelola puluhan CV kandidat dalam satu tempat, duplikasi profil, dan cetak massal dengan pemisah halaman cetak.' },
      { name: 'Live ATS Score Engine', detail: 'Pengecekan kelengkapan data kontak, rasio kata kerja aksi, dan skor kelayakan ATS (0-100).' }
    ],
    practicalScenario: {
      context: 'Melamar lowongan Software Engineer di perusahaan multinasional yang menggunakan sistem screening ATS.',
      solution: 'Gunakan template Modern ATS Classic, masukkan kata kerja pencapaian terukur pada pengalaman kerja, gunakan tombol Auto-Fit untuk memastikan CV pas 1 lembar A4, dan cetak ke PDF.'
    },
    proTips: [
      'Gunakan format poin bertanda bintang/bullet yang memuat angka terukur (misal: "Meningkatkan performa aplikasi sebesar 40%").',
      'Pada Mode Multi-Kandidat, gunakan tombol "Samakan Layout Semua" untuk menerapkan desain yang seragam ke seluruh kandidat secara instan.'
    ],
    faq: {
      q: 'Mengapa tombol ⚡ Auto-Fit 1 Halaman A4 sangat penting?',
      a: 'Tombol ini secara cerdas mengatur rasio kerapatan margin dan font size agar seluruh isi CV Anda terkunci rapi pas 1 lembar A4 tanpa meninggalkan halaman kedua yang hanya berisi 1-2 baris kosong.'
    }
  },

  // ==========================================
  // GROUP 2: TIM & KOMUNIKASI
  // ==========================================
  {
    id: 'contacts',
    category: 'communication',
    categoryLabel: 'Tim & Komunikasi',
    title: 'Kontak Tim & WhatsApp CRM',
    icon: '👥',
    badge: 'Direktori & 1-Klik Chat',
    route: '/contacts',
    overview: 'Buku alamat cerdas untuk mengelola database rekan kerja, klien VIP, dan vendor dengan fitur 1-klik buka percakapan WhatsApp tanpa harus menyimpan nomor di memori kontak HP.',
    targetUser: 'Sales, staf marketing, HRD, account executive, dan koordinator tim.',
    steps: [
      {
        stepNumber: 1,
        title: 'Tambahkan Kontak Baru',
        desc: 'Klik "+ Tambah Kontak", masukkan nama lengkap, perusahaan, jabatan, nomor WhatsApp (format 08 atau +62), email, dan kategori.',
        keyAction: 'Isi rincian kontak dan simpan.'
      },
      {
        stepNumber: 2,
        title: 'Kelompokkan berdasarkan Tag Kategori',
        desc: 'Pilih kategori kontak: Klien VIP, Tim Internal, Vendor / Supplier, atau Rekan Bisnis untuk memudahkan penyaringan data.',
        keyAction: 'Pilih badge kategori kontak.'
      },
      {
        stepNumber: 3,
        title: 'Kirim Pesan WhatsApp Instan',
        desc: 'Klik tombol hijau ikon WhatsApp pada kartu kontak untuk membuka chat langsung di WhatsApp Web atau aplikasi WA di ponsel.',
        keyAction: 'Klik tombol chat WhatsApp pada kontak yang dituju.'
      },
      {
        stepNumber: 4,
        title: 'Ekspor / Impor Kontak',
        desc: 'Unduh daftar kontak ke format CSV untuk diolah di Excel atau impor file kontak yang sudah ada.',
        keyAction: 'Gunakan menu ekspor/impor di kanan atas.'
      }
    ],
    keyFeatures: [
      { name: 'Nomor Normalizer Otomatis', detail: 'Otomatis membersihkan spasi dan tanda hubung serta mengonversi 08xx ke format internasional 628xx.' },
      { name: 'Pencarian Cepat Multifilter', detail: 'Cari berdasarkan nama, perusahaan, atau nomor telepon secara realtime.' },
      { name: 'Integrasi Persuratan & Billing', detail: 'Data kontak langsung terhubung saat memilih penerima di modul Surat dan Invoice.' }
    ],
    practicalScenario: {
      context: 'Harus menghubungi 10 vendor perlengkapan kantor baru tanpa mengotori buku kontak pribadi di smartphone.',
      solution: 'Simpan daftar vendor di modul Kontak Tim, beri label "Vendor", dan tekan tombol WhatsApp untuk langsung mengirim pesan permohonan penawaran harga.'
    },
    proTips: [
      'Tambahkan catatan kecil (notes) pada detail kontak untuk mengingat histori kesepakatan atau preferensi klien.'
    ],
    faq: {
      q: 'Apakah fitur WhatsApp bisa digunakan di laptop/PC?',
      a: 'Bisa, tombol akan otomatis membuka tab WhatsApp Web resmi pada peramban Anda.'
    }
  },
  {
    id: 'chatai',
    category: 'communication',
    categoryLabel: 'Tim & Komunikasi',
    title: 'Live Chat AI Assistant (Google Gemini)',
    icon: '🤖',
    badge: 'Asisten Produktivitas Cerdas',
    route: '/chat-ai',
    overview: 'Asisten kecerdasan buatan terintegrasi untuk membantu brainstorming ide kerja, penyusunan draf email profesional, penulisan copywriting, optimasi kode pemrograman, dan konsultasi karir.',
    targetUser: 'Semua profesional yang membutuhkan partner diskusi, ide kreatif, atau bantuan analisis teks cepat.',
    steps: [
      {
        stepNumber: 1,
        title: 'Mulai Sesi Percakapan Baru',
        desc: 'Buka modul Live Chat AI dan ketikkan pertanyaan atau topik yang ingin Anda diskusikan pada kolom chat di bagian bawah.',
        keyAction: 'Ketik pesan dan tekan tombol Kirim / Enter.'
      },
      {
        stepNumber: 2,
        title: 'Gunakan Template Prompt Cepat',
        desc: 'Klik salah satu tombol preset prompt di panel samping (misal: "Bikin Draf Email Formal", "Review Kerapian Kode", "Brainstorming Ide Bisnis", "Susun Strategi Kerja").',
        keyAction: 'Klik preset prompt untuk mengisi otomatis kolom teks.'
      },
      {
        stepNumber: 3,
        title: 'Salin Respons AI ke Dokumen Kerja',
        desc: 'Gunakan tombol 1-klik salin (Copy to Clipboard) pada balon pesan AI untuk menempelkan hasil teks ke modul Surat, Notes, atau CV Builder.',
        keyAction: 'Klik ikon salin pada pesan balasan AI.'
      },
      {
        stepNumber: 4,
        title: 'Simpan & Kelola Riwayat Chat',
        desc: 'Riwayat obrolan tersimpan secara lokal dan dapat Anda bersihkan kapan saja melalui tombol "Bersihkan Riwayat".',
        keyAction: 'Kelola sesi riwayat percakapan Anda.'
      }
    ],
    keyFeatures: [
      { name: 'Koleksi Preset Prompt Produktivitas', detail: 'Template siap pakai untuk surat bisnis, programming, riset, dan analisis data.' },
      { name: 'Pemformatan Markdown Cantik', detail: 'Respons AI ditampilkan dengan struktur heading, poin tebal, dan blok kode rapi.' },
      { name: 'Privasi Percakapan Lokal', detail: 'Riwayat obrolan Anda tersimpan di ruang penyimpanan browser lokal.' }
    ],
    practicalScenario: {
      context: 'Perlu menyusun surat permohonan kerjasama sponsorship yang persuasif dan sopan dalam waktu 5 menit.',
      solution: 'Buka Live Chat AI, klik template "Draf Surat Bisnis", sesuaikan nama acara, dan salin hasil naskah langsung ke modul Surat Generator.'
    },
    proTips: [
      'Berikan konteks yang jelas (peran, tujuan, dan batasan) pada prompt untuk mendapatkan jawaban yang sangat spesifik dan akurat.'
    ],
    faq: {
      q: 'Bisakah saya meminta AI memeriksa kesalahan tata bahasa surat saya?',
      a: 'Tentu saja! Tempelkan draf surat Anda dan minta AI untuk memperbaiki ejaan EYD serta pemilihan kosakata yang lebih profesional.'
    }
  },

  // ==========================================
  // GROUP 3: KEUANGAN & DATA
  // ==========================================
  {
    id: 'finance',
    category: 'finance',
    categoryLabel: 'Keuangan & Data',
    title: 'Keuangan & Money Tracker',
    icon: '💰',
    badge: 'Arus Kas & Budget Threshold',
    route: '/finance',
    overview: 'Pencatat arus kas harian untuk memantau pemasukan, pengeluaran per kategori, saldo akhir, visualisasi grafik arus kas, serta sistem peringatan ambang batas anggaran (Budget Threshold Warning).',
    targetUser: 'Pekerja, freelancer, pemilik bisnis kecil, dan siapapun yang ingin mengatur keuangan pribadi/operasional secara tertib.',
    steps: [
      {
        stepNumber: 1,
        title: 'Catat Transaksi Pemasukan / Pengeluaran',
        desc: 'Klik tombol "+ Catat Transaksi", pilih jenis (Pemasukan / Pengeluaran), masukkan nominal rupiah, kategori belanja, tanggal, dan catatan singkat.',
        keyAction: 'Isi formulir transaksi dan simpan.'
      },
      {
        stepNumber: 2,
        title: 'Atur Batas Anggaran Bulanan (Budget Limit)',
        desc: 'Masuk ke menu Preferences untuk menentukan batas maksimal anggaran belanja bulanan Anda.',
        keyAction: 'Tentukan target ambang batas pengeluaran.'
      },
      {
        stepNumber: 3,
        title: 'Pantau Indikator Peringatan Anggaran',
        desc: 'Jika pengeluaran mendekati atau melampaui batas, sistem akan memunculkan badge peringatan "Over Budget" merah di header aplikasi.',
        keyAction: 'Cek saldo sisa pada kartu ringkasan keuangan.'
      },
      {
        stepNumber: 4,
        title: 'Ekspor Laporan ke Spreadsheet / PDF',
        desc: 'Unduh seluruh riwayat transaksi ke format CSV untuk diolah di Excel atau ekspor laporan pembukuan berkala.',
        keyAction: 'Klik tombol "Ekspor CSV" atau "Cetak Laporan".'
      }
    ],
    keyFeatures: [
      { name: 'Grafik Visual Distribusi Belanja', detail: 'Visualisasi persentase alokasi pengeluaran (makanan, transportasi, tagihan, hobi, modal kerja).' },
      { name: 'Filter Periode Waktu', detail: 'Penyaringan data transaksi hari ini, minggu ini, bulan ini, atau custom range.' },
      { name: 'Indikator Realtime Over-Budget', detail: 'Peringatan otomatis saat pengeluaran bulanan melewati batas aman.' }
    ],
    practicalScenario: {
      context: 'Ingin membatasi pengeluaran operasional bulanan maksimal Rp 5.000.000.',
      solution: 'Atur batas budget di Preferences, catat setiap nota belanja harian, dan pantau grafik pengeluaran agar selalu berada di zona hijau aman.'
    },
    proTips: [
      'Gunakan kategori yang konsisten agar grafik diagram lingkaran dapat menyajikan insight akurat tentang pos belanja terbesar Anda.'
    ],
    faq: {
      q: 'Bagaimana jika saya salah memasukkan nominal transaksi?',
      a: 'Cukup klik ikon pensil (Edit) atau ikon tempat sampah (Hapus) pada baris transaksi terkait di tabel riwayat keuangan.'
    }
  },
  {
    id: 'rab',
    category: 'finance',
    categoryLabel: 'Keuangan & Data',
    title: 'RAB & Kas Kegiatan Kepanitiaan',
    icon: '📊',
    badge: 'Budgeting & Event Planning',
    route: '/rab',
    overview: 'Perangkat penyusunan Rencana Anggaran Biaya (RAB) kegiatan, pencatatan realisasi kas masuk & keluar riil di lapangan, serta kalkulasi surplus/defisit anggaran kepanitiaan secara otomatis.',
    targetUser: 'Bendahara acara, panitia seminar, pengurus organisasi, EO, dan project coordinator.',
    steps: [
      {
        stepNumber: 1,
        title: 'Susun Rencana Anggaran (Pos RAB)',
        desc: 'Buka tab "Rencana Anggaran (RAB)", tambahkan item kebutuhan per divisi (misal: Divisi Konsumsi, Publikasi, Logistik, Sewa Gedung) beserta estimasi unit dan harga satuan.',
        keyAction: 'Tambahkan pos anggaran dan nominal rencana.'
      },
      {
        stepNumber: 2,
        title: 'Catat Kas Masuk (Pemasukan Aktual)',
        desc: 'Buka tab "Kas Masuk", catat dana yang telah diterima (iuran peserta, sponsor, dana instansi) dengan tanggal dan nomor kuitansi masuk.',
        keyAction: 'Input sumber dana masuk kepanitiaan.'
      },
      {
        stepNumber: 3,
        title: 'Catat Realisasi Belanja (Kas Keluar)',
        desc: 'Buka tab "Kas Keluar", masukkan setiap pengeluaran riil berdasarkan nota belanja fisik yang dibawa oleh divisi lapangan.',
        keyAction: 'Catat bukti pengeluaran riil per nota.'
      },
      {
        stepNumber: 4,
        title: 'Evaluasi Status Anggaran (Surplus / Defisit)',
        desc: 'Lihat kartu ringkasan untuk memantau apakah realisasi belanja saat ini masih berada di batas "Hemat", "Sesuai Target", atau "Over Budget".',
        keyAction: 'Periksa status selisih sisa anggaran kegiatan.'
      },
      {
        stepNumber: 5,
        title: 'Ekspor Laporan Pertanggungjawaban (LPJ)',
        desc: 'Unduh berkas pembukuan lengkap ke format Excel (XLSX), CSV, atau cetak dokumen PDF untuk lampiran LPJ kepanitiaan resmi.',
        keyAction: 'Klik "Ekspor Excel (XLSX)" atau "Cetak Laporan PDF".'
      }
    ],
    keyFeatures: [
      { name: 'Kalkulasi Real-time 4 Metrik Kunci', detail: 'Total Rencana Anggaran, Total Kas Masuk Aktual, Total Kas Keluar Aktual, dan Sisa Saldo Kas Kasir.' },
      { name: 'Pengelompokan Divisi Kegiatan', detail: 'Filter pengeluaran per divisi kepanitiaan untuk evaluasi per tanggung jawab tim.' },
      { name: 'Ekspor Siap LPJ (Excel & PDF)', detail: 'Format tabel rapi dengan kolom nomor nota, uraian, debit, kredit, dan saldo.' }
    ],
    practicalScenario: {
      context: 'Kepanitiaan Lomba Nasional dengan anggaran rencana Rp 25.000.000 dan 5 divisi kerja.',
      solution: 'Input pos RAB tiap divisi, catat uang masuk pendaftaran di tab Kas Masuk, input nota belanja harian di tab Kas Keluar, dan unduh file Excel untuk rapat evaluasi berkala.'
    },
    proTips: [
      'Gunakan pemindai di modul Kamera Scan untuk memfoto nota belanja sebelum mencatatnya ke tab Kas Keluar RAB.'
    ],
    faq: {
      q: 'Apakah data RAB bisa digabungkan dari beberapa kepanitiaan berbeda?',
      a: 'Anda dapat mencadangkan (Export JSON) data event A, membersihkan data untuk event B, dan memulihkan kembali file event A kapan saja.'
    }
  },
  {
    id: 'invoice',
    category: 'finance',
    categoryLabel: 'Keuangan & Data',
    title: 'Invoice Generator (PDF & WhatsApp)',
    icon: '🧾',
    badge: 'Faktur Penagihan & Billing',
    route: '/invoice',
    overview: 'Generator faktur penagihan pembayaran profesional untuk klien dengan dukungan multi-item barang/jasa, perhitungan subtotal, diskon potongan, pajak PPN otomatis, status lunas, dan cetak PDF standar billing.',
    targetUser: 'Freelancer, agensi, konsultan, kontraktor, dan pemilik usaha jasa / dagang.',
    steps: [
      {
        stepNumber: 1,
        title: 'Lengkapi Data Bisnis & Data Klien',
        desc: 'Masukkan nama perusahaan/nama Anda, alamat, nomor telepon, serta nama dan alamat klien yang ditagih pada panel identitas.',
        keyAction: 'Isi detail identitas penagih dan penerima tagihan.'
      },
      {
        stepNumber: 2,
        title: 'Tambahkan Item Barang / Jasa Tagihan',
        desc: 'Klik "+ Tambah Item", masukkan deskripsi jasa/pekerjaan, jumlah kuantitas (Qty), dan harga satuan. Subtotal akan dihitung otomatis.',
        keyAction: 'Masukkan daftar rincian pekerjaan atau barang.'
      },
      {
        stepNumber: 3,
        title: 'Atur Pajak PPN, Diskon & Rekening Pembayaran',
        desc: 'Tentukan persentase pajak PPN (misal 11%), diskon potongan harga, tanggal jatuh tempo, serta nomor rekening bank transfer / QRIS Anda.',
        keyAction: 'Pilih rekening tujuan transfer dan ketentuan bayar.'
      },
      {
        stepNumber: 4,
        title: 'Cetak PDF Billing / Kirim Link WhatsApp',
        desc: 'Lihat pratinjau faktur di sebelah kanan. Klik "Cetak / Simpan PDF" untuk mengunduh dokumen atau klik "Kirim via WhatsApp" ke klien.',
        keyAction: 'Klik tombol "Cetak PDF" atau "Bagikan ke WhatsApp".'
      }
    ],
    keyFeatures: [
      { name: 'Kalkulator Billing Otomatis', detail: 'Menghitung subtotal, diskon, PPN, dan grand total tanpa risiko salah hitung matematika.' },
      { name: 'Layout Faktur Standar Internasional', detail: 'Tata letak elegan dengan nomor invoice resmi, tanggal terbit, dan watermark status pembayaran.' },
      { name: 'WhatsApp Direct Invoice Sender', detail: 'Naskah tagihan ringkas siap kirim langsung ke nomor kontak klien.' }
    ],
    practicalScenario: {
      context: 'Menagih pelunasan jasa desain grafis senilai Rp 3.500.000 kepada klien PT Sukses Makmur.',
      solution: 'Buka Invoice Generator, isi item pekerjaan, masukkan nomor rekening BCA, unduh PDF faktur yang elegan, dan kirimkan via WhatsApp ke manajer keuangan klien.'
    },
    proTips: [
      'Simpan profil bisnis Anda di menu Preferences agar identitas penagih dan nomor rekening otomatis terisi setiap membuat invoice baru.'
    ],
    faq: {
      q: 'Bagaimana cara menambahkan tanda status "LUNAS / PAID" pada invoice?',
      a: 'Ubah opsi Status Pembayaran di formulir menjadi "Lunas / Paid". Preview invoice akan otomatis memunculkan stempel hijau PAID resmi.'
    }
  },
  {
    id: 'sql',
    category: 'finance',
    categoryLabel: 'Keuangan & Data',
    title: 'SQL Data Export & Virtual Query Runner',
    icon: '🗄️',
    badge: 'Database & SQL DDL/DML',
    route: '/sql',
    overview: 'Alat pengonversi seluruh data aplikasi (To-Do, Finance, Proyek, Kontak) ke skrip SQL standar (CREATE TABLE & INSERT INTO) untuk MySQL / PostgreSQL serta emulator query SQL interaktif di browser.',
    targetUser: 'Software engineer, database administrator, mahasiswa informatika, dan tim IT.',
    steps: [
      {
        stepNumber: 1,
        title: 'Pilih Target Dialek SQL',
        desc: 'Pilih dialek database tujuan: MySQL / MariaDB, PostgreSQL, atau SQLite standar.',
        keyAction: 'Pilih tombol dialek database di bagian atas.'
      },
      {
        stepNumber: 2,
        title: 'Generate Skrip DDL & DML',
        desc: 'Klik tombol "Generate SQL Script". Sistem akan merangkum seluruh tabel dan record lokal Anda menjadi skrip SQL siap eksekusi.',
        keyAction: 'Klik tombol generate untuk melihat skrip SQL.'
      },
      {
        stepNumber: 3,
        title: 'Jalankan Virtual Query Test',
        desc: 'Gunakan panel SQL Runner untuk menjalankan perintah query seperti `SELECT * FROM tasks WHERE priority = "High";` dan lihat hasilnya pada tabel virtual.',
        keyAction: 'Ketik query SQL dan tekan tombol Run Query.'
      },
      {
        stepNumber: 4,
        title: 'Unduh Berkas .sql',
        desc: 'Klik tombol "Download .sql File" untuk menyimpan file cadangan skema database ke komputer Anda.',
        keyAction: 'Unduh berkas SQL untuk migrasi database.'
      }
    ],
    keyFeatures: [
      { name: 'Auto Schema & Table Creation', detail: 'Menghasilkan tipe data VARCHAR, INT, DECIMAL, dan DATETIME yang valid.' },
      { name: 'In-Browser Virtual SQL Runner', detail: 'Uji logika filter dan agregasi data tanpa perlu menginstall server database fisik.' },
      { name: '1-Klik Copy ke Clipboard', detail: 'Salin seluruh skrip SQL untuk langsung di-paste ke phpMyAdmin, DBeaver, atau pgAdmin.' }
    ],
    practicalScenario: {
      context: 'Ingin memindahkan seluruh data transaksi keuangan dari aplikasi web lokal ke database PostgreSQL server kantor.',
      solution: 'Buka SQL Data Export, pilih dialek PostgreSQL, klik "Generate SQL", unduh file .sql, dan jalankan di pgAdmin server Anda.'
    },
    proTips: [
      'Gunakan fitur ini untuk mempelajari sintaks SQL dasar menggunakan data riil pekerjaan harian Anda.'
    ],
    faq: {
      q: 'Apakah fitur SQL Runner memerlukan koneksi server MySQL luar?',
      a: 'Tidak. Virtual runner berjalan secara lokal di JavaScript runtime peramban Anda.'
    }
  },

  // ==========================================
  // GROUP 4: AGENDA & PRODUKTIVITAS
  // ==========================================
  {
    id: 'insights',
    category: 'productivity',
    categoryLabel: 'Agenda & Produktivitas',
    title: 'Productivity Insights & D3.js Charts',
    icon: '📈',
    badge: 'Analitik & Visualisasi Data',
    route: '/productivity-insights',
    overview: 'Pusat analitik performa kerja berbasis visualisasi data D3.js: menyajikan grafik tren penyelesaian tugas mingguan, rasio waktu fokus vs istirahat, dan heatmap konsistensi komitmen kerja harian.',
    targetUser: 'Profesional yang menerapkan metode self-improvement dan evaluasi kinerja berbasis data.',
    steps: [
      {
        stepNumber: 1,
        title: 'Buka Dashboard Analitik',
        desc: 'Masuk ke menu Productivity Insights untuk melihat skor indeks produktivitas dan metrik efisiensi kerja harian Anda.',
        keyAction: 'Pantau grafik skor produktivitas.'
      },
      {
        stepNumber: 2,
        title: 'Pelajari Grafik Tren Mingguan',
        desc: 'Amati diagram batang interaktif yang memperlihatkan perbandingan jumlah tugas yang diselesaikan dari hari Senin hingga Minggu.',
        keyAction: 'Arahkan kursor ke diagram batang untuk melihat rincian angka.'
      },
      {
        stepNumber: 3,
        title: 'Evaluasi Rasio Waktu Fokus',
        desc: 'Lihat diagram lingkaran rasio penggunaan waktu antara sesi kerja fokus Pomodoro dan sesi jeda santai.',
        keyAction: 'Pastikan rasio waktu kerja produktif di atas 70%.'
      },
      {
        stepNumber: 4,
        title: 'Periksa Heatmap Komitmen',
        desc: 'Cek kotak hijau heatmap aktivitas harian untuk memastikan Anda tetap konsisten menyelesaikan target setiap hari.',
        keyAction: 'Pertahankan kotak hijau menyala setiap hari kerja.'
      }
    ],
    keyFeatures: [
      { name: 'Grafik Interaktif D3.js', detail: 'Animasi rendering grafik modern dengan tooltip angka detail.' },
      { name: 'Analisis Komparasi Waktu', detail: 'Menghitung total jam kerja fokus berbanding target harian.' },
      { name: 'Rekomendasi Kebiasaan Produktif', detail: 'Insight otomatis untuk meningkatkan fokus di hari-hari yang kurang produktif.' }
    ],
    practicalScenario: {
      context: 'Melakukan evaluasi mingguan (Weekly Review) pada hari Jumat sore.',
      solution: 'Buka Productivity Insights, lihat apakah target penyelesaian tugas tercapai, dan atur strategi fokus untuk pekan berikutnya.'
    },
    proTips: [
      'Rutin menandai tugas yang telah selesai di modul To-Do agar data grafik selalu terbarui secara akurat.'
    ],
    faq: {
      q: 'Dari mana data grafik produktivitas dihitung?',
      a: 'Data dihitung secara otomatis dari aktivitas penyelesaian tugas To-Do List, sesi Pomodoro yang tuntas, dan catatan harian Anda.'
    }
  },
  {
    id: 'quickcapture',
    category: 'productivity',
    categoryLabel: 'Agenda & Produktivitas',
    title: 'Quick Capture Notes & Alarms',
    icon: '⚡',
    badge: 'Ide Cepat & Scratchpad',
    route: '/quick-capture',
    overview: 'Pintu masuk cepat untuk mencatat ide spontan, nomor telepon darurat, memo instan, dan mengatur alarm pengingat cepat tanpa harus mengisi form panjang.',
    targetUser: 'Siapapun yang sering mendapatkan ide tiba-tiba saat sedang meeting atau bekerja.',
    steps: [
      {
        stepNumber: 1,
        title: 'Buka via Shortcut Keyboard Alt+N',
        desc: 'Tekan kombinasi tombol Alt + N dari halaman manapun untuk langsung membuka modal Quick Capture secara instan.',
        keyAction: 'Tekan Alt+N di keyboard.'
      },
      {
        stepNumber: 2,
        title: 'Ketik Catatan Cepat / Memo',
        desc: 'Tuliskan ide atau catatan singkat pada kolom input yang langsung terfokus.',
        keyAction: 'Ketik memo dan simpan.'
      },
      {
        stepNumber: 3,
        title: 'Atur Alarm Pengingat Instan (Opsional)',
        desc: 'Tentukan dalam berapa menit Anda ingin diingatkan (misal: 15 menit, 30 menit, 1 jam).',
        keyAction: 'Pilih durasi timer pengingat cepat.'
      },
      {
        stepNumber: 4,
        title: 'Konversi Menjadi Tugas Resmi (To-Do)',
        desc: 'Klik tombol "Jadikan Tugas To-Do" jika catatan spontan tersebut ingin ditindaklanjuti sebagai tugas ber-deadline.',
        keyAction: 'Klik ikon konversi ke tugas resmi.'
      }
    ],
    keyFeatures: [
      { name: 'Pintasan Keyboard Global (Alt+N)', detail: 'Akses tanpa jeda saat Anda sedang berada di modul manapun.' },
      { name: 'Konversi 1-Klik ke To-Do List', detail: 'Langsung memindahkan memo ke board Kanban tanpa repot mengetik ulang.' },
      { name: 'Timer Audio Bell Ringkas', detail: 'Pengingat cepat dengan bunyi lonceng yang jernih.' }
    ],
    practicalScenario: {
      context: 'Sedang membaca email dan tiba-tiba teringat harus menelepon klien 20 menit lagi.',
      solution: 'Tekan Alt+N, ketik "Telepon Pak Budi perihal revisi kontrak", atur timer 20 menit, lalu lanjutkan pekerjaan Anda dengan tenang.'
    },
    proTips: [
      'Gunakan Quick Capture sebagai inbox pertama sebelum Anda memilah dan merapikan catatan ke dalam Sticky Notes atau To-Do.'
    ],
    faq: {
      q: 'Apakah catatan Quick Capture akan hilang jika browser ditutup?',
      a: 'Tidak. Seluruh entri Quick Capture tersimpan di memori lokal dan tetap ada saat Anda membuka kembali aplikasi.'
    }
  },
  {
    id: 'calendar',
    category: 'productivity',
    categoryLabel: 'Agenda & Produktivitas',
    title: 'Kalender Agenda & Timed Events',
    icon: '📅',
    badge: 'Jadwal & Rapat',
    route: '/calendar',
    overview: 'Kalender terintegrasi yang memetakan seluruh agenda rapat, tenggat waktu proyek, pengingat tugas ber-deadline, dan acara kepanitiaan dalam tampilan bulanan, mingguan, dan harian.',
    targetUser: 'Profesional, sekretaris, manajer, dan siapapun yang memiliki jadwal pertemuan padat.',
    steps: [
      {
        stepNumber: 1,
        title: 'Lihat Kalender Bulan Ini',
        desc: 'Buka menu Kalender untuk melihat titik-titik penanda agenda pada tanggal aktif.',
        keyAction: 'Pilih tanggal pada grid kalender.'
      },
      {
        stepNumber: 2,
        title: 'Tambah Jadwal Acara / Rapat Baru',
        desc: 'Klik pada tanggal yang dituju atau klik "+ Tambah Acara", masukkan judul agenda, jam mulai & selesai, lokasi/link Google Meet, dan warna kategori.',
        keyAction: 'Isi formulir agenda dan simpan.'
      },
      {
        stepNumber: 3,
        title: 'Ganti Tampilan (Bulan / Minggu / Hari)',
        desc: 'Pilih sudut pandang kalender sesuai kebutuhan untuk melihat kepadatan agenda harian secara mendetail.',
        keyAction: 'Klik tombol toggle Bulan / Minggu / Hari.'
      },
      {
        stepNumber: 4,
        title: 'Sinkronisasi Otomatis dengan To-Do',
        desc: 'Setiap tugas To-Do yang diberi tanggal deadline akan otomatis muncul di tanggal terkait pada kalender.',
        keyAction: 'Klik kartu tugas di kalender untuk melihat detailnya.'
      }
    ],
    keyFeatures: [
      { name: 'Sinkronisasi Dua Arah dengan To-Do', detail: 'Perubahan tanggal di kalender langsung memperbarui deadline tugas To-Do.' },
      { name: 'Kategori Berwarna', detail: 'Bedakan rapat kerja (biru), deadline tugas (merah), event kepanitiaan (hijau), dan agenda pribadi (kuning).' },
      { name: 'Navigasi Bulan Cepat', detail: 'Lompat ke bulan atau tahun sebelumnya/berikutnya dengan 1 klik.' }
    ],
    practicalScenario: {
      context: 'Mengatur jadwal rapat koordinasi mingguan dengan tim IT setiap hari Rabu pukul 10:00.',
      solution: 'Buka Kalender, pilih hari Rabu, tambahkan event berulang "Rapat Koordinasi IT", dan beri label warna biru.'
    },
    proTips: [
      'Klik tanggal hari ini ("Today") di pojok kalender untuk langsung kembali ke tanggal saat ini dengan cepat.'
    ],
    faq: {
      q: 'Apakah kalender ini bisa digunakan tanpa koneksi internet?',
      a: 'Ya, seluruh data kalender tersimpan secara lokal dan dapat diakses 100% secara offline.'
    }
  },
  {
    id: 'time',
    category: 'productivity',
    categoryLabel: 'Agenda & Produktivitas',
    title: 'Time Suite & Pomodoro Timer',
    icon: '⏱️',
    badge: 'Teknik Fokus & Jam Dunia',
    route: '/time-suite',
    overview: 'Suite pengelola waktu kerja yang mencakup Timer Teknik Pomodoro (25 menit kerja / 5 menit istirahat), Stopwatch presisi milidetik dengan fitur Lap Time, dan Jam Dunia (World Clock) multi-kota.',
    targetUser: 'Pengembang software, penulis, mahasiswa, dan siapapun yang ingin meningkatkan fokus kerja mendalam (Deep Work).',
    steps: [
      {
        stepNumber: 1,
        title: 'Mulai Sesi Fokus Pomodoro',
        desc: 'Buka tab Pomodoro, pilih durasi fokus (standar 25 menit atau kustom), lalu klik tombol "Mulai Fokus".',
        keyAction: 'Klik tombol Start Pomodoro.'
      },
      {
        stepNumber: 2,
        title: 'Fokus Bekerja hingga Bell Berbunyi',
        desc: 'Kerjakan satu tugas tanpa distraksi. Sistem akan membunyikan audio bell sintetis saat 25 menit tuntas.',
        keyAction: 'Fokus menyelesaikan pekerjaan selama timer berjalan.'
      },
      {
        stepNumber: 3,
        title: 'Ambil Jeda Istirahat (Short / Long Break)',
        desc: 'Ambil jeda 5 menit untuk relaksasi mata. Setelah 4 sesi Pomodoro, ambil Long Break selama 15-20 menit.',
        keyAction: 'Klik tombol istirahat 5 menit.'
      },
      {
        stepNumber: 4,
        title: 'Gunakan Stopwatch & Jam Dunia',
        desc: 'Gunakan tab Stopwatch untuk mengukur durasi pengerjaan task teknis, atau tab World Clock untuk memantau zona waktu rekan kerja di luar negeri (WIB, WITA, WIT, UTC, EST, JST).',
        keyAction: 'Pilih tab Stopwatch atau World Clock.'
      }
    ],
    keyFeatures: [
      { name: 'Web Audio API Bell Generator', detail: 'Suara lonceng jernih yang disintesis langsung di browser tanpa butuh file audio luar.' },
      { name: 'Pencatat Siklus Pomodoro', detail: 'Menghitung berapa ronde sesi fokus yang berhasil Anda selesaikan hari ini.' },
      { name: 'Stopwatch dengan Lap Times', detail: 'Pencatatan waktu putaran bertahap dengan akurasi milidetik.' }
    ],
    practicalScenario: {
      context: 'Harus menulis laporan audit sepanjang 10 halaman yang membutuhkan konsentrasi tinggi tanpa terdistraksi media sosial.',
      solution: 'Jalankan Pomodoro 25 menit, matikan notifikasi lain, selesaikan 4 sesi fokus berturut-turut, dan nikmati istirahat panjang setelahnya.'
    },
    proTips: [
      'Gunakan shortcut Alt+T dari halaman manapun untuk langsung memulai timer Pomodoro 25 menit.'
    ],
    faq: {
      q: 'Apakah timer tetap berjalan jika saya berpindah ke tab browser lain?',
      a: 'Ya, timer menggunakan background interval browser dan akan tetap membunyikan alarm saat waktunya habis.'
    }
  },
  {
    id: 'selfie',
    category: 'productivity',
    categoryLabel: 'Agenda & Produktivitas',
    title: 'Selfie for Happiness & Auto Backup',
    icon: '🤳',
    badge: 'Kesehatan Mental & Rasa Syukur',
    route: '/selfie',
    overview: 'Jurnal visual kebahagiaan harian untuk mengabadikan momen senyum saat bekerja, mencatat hal positif yang disyukuri hari ini, serta menyimpan album kenangan karir lokal.',
    targetUser: 'Semua pekerja untuk menjaga kesehatan mental, suasana hati positif, dan work-life balance.',
    steps: [
      {
        stepNumber: 1,
        title: 'Buka Kamera Selfie',
        desc: 'Klik tombol "Ambil Foto Selfie", posisikan wajah Anda dengan senyuman terbaik di depan webcam/kamera HP.',
        keyAction: 'Posisikan senyum terbaik dan klik Shutter.'
      },
      {
        stepNumber: 2,
        title: 'Tulis Catatan Kebahagiaan (Gratitude Note)',
        desc: 'Tuliskan 1 hal yang membuat Anda bahagia atau bersyukur hari ini (misal: "Proyek tuntas tepat waktu!", "Dapat traktiran kopi dari rekan tim").',
        keyAction: 'Ketik catatan momen positif pada foto.'
      },
      {
        stepNumber: 3,
        title: 'Simpan ke Galeri Kenangan',
        desc: 'Klik "Simpan Foto & Catatan". Foto akan tersimpan di linimasa galeri kenangan lokal Anda dengan tanggal otomatis.',
        keyAction: 'Simpan entri selfie ke galeri harian.'
      },
      {
        stepNumber: 4,
        title: 'Tinjau Linimasa & Download Album',
        desc: 'Buka tab Galeri untuk melihat perjalanan senyum Anda sepanjang bulan dan unduh foto favorit ke perangkat Anda.',
        keyAction: 'Klik pada foto untuk melihat ukuran penuh atau mengunduhnya.'
      }
    ],
    keyFeatures: [
      { name: 'Linimasa Foto Kronologis', detail: 'Galeri tersusun rapi per hari dan bulan.' },
      { name: 'Gratitude Reflection Journal', detail: 'Memadukan foto visual dengan catatan syukur untuk meningkatkan mood.' },
      { name: 'Penyimpanan Aman & Privat', detail: 'Foto hanya tersimpan di perangkat lokal tanpa pernah diunggah ke cloud publik.' }
    ],
    practicalScenario: {
      context: 'Mengakhiri hari kerja yang melelahkan namun penuh pencapaian pada hari Jumat.',
      solution: 'Ambil 1 foto senyuman bersama tim, tulis catatan "Selesai sprint mingguan dengan sukses!", dan simpan ke galeri kebahagiaan.'
    },
    proTips: [
      'Ambil foto di waktu yang sama setiap hari (misal jam 17:00 sebelum pulang) untuk membuat kolase perjalanan karir yang berkesan.'
    ],
    faq: {
      q: 'Apakah foto selfie saya bisa dilihat orang lain?',
      a: 'Tidak. Foto hanya tersimpan di memori browser lokal Anda dan 100% privat.'
    }
  },
  {
    id: 'mood',
    category: 'productivity',
    categoryLabel: 'Agenda & Produktivitas',
    title: 'Kamera Mood & Alarm Jadwal Kerja',
    icon: '⏰',
    badge: 'Deteksi Mood & Jadwal Kerja',
    route: '/mood',
    overview: 'Perangkat pendeteksi suasana hati kerja melalui kamera serta sistem alarm resmi jadwal kantor (08:00 Masuk Pagi, 12:00 Jam Istirahat, 13:00 Masuk Kembali, 17:00 Waktu Pulang) dengan generator suara bel.',
    targetUser: 'Karyawan WFH, pekerja kantor, dan tim yang ingin menjaga disiplin jam kerja sehat.',
    steps: [
      {
        stepNumber: 1,
        title: 'Aktifkan Pengingat Jadwal Kerja',
        desc: 'Nyalakan sakelar jadwal alarm kerja standar kantor: Masuk Pagi (08:00), Istirahat Siang (12:00), Kembali Kerja (13:00), dan Pulang Kantor (17:00).',
        keyAction: 'Aktifkan toggle alarm jam kerja.'
      },
      {
        stepNumber: 2,
        title: 'Pilih Tipe Suara Bel Alarm',
        desc: 'Pilih jenis nada pengingat: Lonceng Halus (Chime), Bel Sekolah Tradisional, atau Sirene Tegas.',
        keyAction: 'Uji coba suara bel dengan tombol Test Bell.'
      },
      {
        stepNumber: 3,
        title: 'Uji Deteksi Suasana Hati (Mood Cam)',
        desc: 'Nyalakan kamera untuk melihat analisis ekspresi wajah dan catat tingkat energi suasana hati Anda hari ini.',
        keyAction: 'Klik "Deteksi Mood Saya" di panel kamera.'
      },
      {
        stepNumber: 4,
        title: 'Evaluasi Grafik Suasana Hati Mingguan',
        desc: 'Lihat tren fluktuasi suasana hati harian untuk mengevaluasi apakah beban kerja Anda seimbang atau memicu kelelahan (burnout).',
        keyAction: 'Periksa log suasana hati mingguan.'
      }
    ],
    keyFeatures: [
      { name: '4 Alarm Otomatis Terjadwal', detail: 'Pengingat tepat waktu untuk menjaga pola istirahat dan disiplin jam kerja.' },
      { name: 'On-Device Audio Bell Oscillator', detail: 'Menghasilkan bunyi bel resmi tanpa koneksi internet.' },
      { name: 'Log Riwayat Mood Harian', detail: 'Evaluasi tingkat stres kerja untuk mencegah kejenuhan.' }
    ],
    practicalScenario: {
      context: 'Sering lupa makan siang dan terus bekerja hingga sore saat Work From Home (WFH).',
      solution: 'Aktifkan alarm otomatis di modul ini; browser akan membunyikan bel istirahat tepat pukul 12:00 dan mengirimkan notifikasi on-device.'
    },
    proTips: [
      'Pastikan Anda mengizinkan notifikasi browser di menu Preferences agar alarm tetap memunculkan pemberitahuan saat layar terminimalkan.'
    ],
    faq: {
      q: 'Bisakah jam alarm diubah sesuai jam kerja kantor saya?',
      a: 'Bisa, Anda dapat mengubah jam masuk dan jam pulang sesuai dengan kebijakan operasional tempat kerja Anda.'
    }
  },
  {
    id: 'notes',
    category: 'productivity',
    categoryLabel: 'Agenda & Produktivitas',
    title: 'Sticky Notes & Scratchpad Warna',
    icon: '📝',
    badge: 'Catatan Tempel Virtual',
    route: '/notes',
    overview: 'Papan catatan tempel virtual warna-warni untuk mencoret draf memo, nomor telepon sementara, daftar checklist belanja, atau pointer rapat dengan pencarian instan.',
    targetUser: 'Semua orang yang gemar menggunakan memo tempel di meja kerja fisik.',
    steps: [
      {
        stepNumber: 1,
        title: 'Buat Sticky Note Baru',
        desc: 'Klik tombol "+ Catatan Baru", pilih warna latar (Kuning Klasik, Hijau Mint, Biru Langit, Merah Muda, atau Ungu Pastel).',
        keyAction: 'Pilih warna memo dan klik Buat Catatan.'
      },
      {
        stepNumber: 2,
        title: 'Tulis Isi Catatan & Format Teks',
        desc: 'Ketikkan judul dan isi catatan. Anda dapat menambahkan poin checklist, tautan URL, atau pointer penting.',
        keyAction: 'Ketik memo pada kartu catatan tempel.'
      },
      {
        stepNumber: 3,
        title: 'Sematkan (Pin) Catatan Prioritas',
        desc: 'Klik ikon pin pada sudut atas memo agar catatan penting selalu berada di posisi paling atas papan catatan.',
        keyAction: 'Klik ikon jarum pentul (Pin) untuk mengunci posisi.'
      },
      {
        stepNumber: 4,
        title: 'Cari & Filter Catatan',
        desc: 'Gunakan kolom pencarian di bagian atas untuk menemukan kata kunci dalam hitungan milidetik di antara puluhan memo.',
        keyAction: 'Ketik kata kunci pada kotak pencarian memo.'
      }
    ],
    keyFeatures: [
      { name: 'Palet 5 Warna Visual', detail: 'Pengorganisasian catatan berdasarkan kategori warna yang menarik.' },
      { name: 'Fitur Pin Prioritas', detail: 'Menjaga catatan terpenting tetap terlihat di urutan pertama.' },
      { name: 'Ekspor ke File Teks (.txt)', detail: 'Unduh memo individual ke komputer Anda dengan 1 klik.' }
    ],
    practicalScenario: {
      context: 'Menerima instruksi lisan singkat via telepon tentang akun server staging dan password sementara.',
      solution: 'Buka Sticky Notes, pilih warna kuning, ketik kredensial sementara, dan pin di bagian atas hingga pekerjaan verifikasi selesai.'
    },
    proTips: [
      'Gunakan warna merah muda khusus untuk hal darurat, dan warna hijau untuk catatan informasi referensi.'
    ],
    faq: {
      q: 'Berapa banyak catatan tempel yang bisa saya buat?',
      a: 'Tidak terbatas! Anda dapat membuat ratusan sticky note tanpa mengurangi kecepatan aplikasi.'
    }
  },
  {
    id: 'diary',
    category: 'productivity',
    categoryLabel: 'Agenda & Produktivitas',
    title: 'Diary & Jurnal Cerita Harian',
    icon: '📖',
    badge: 'Jurnal Refleksi Pribadi',
    route: '/diary',
    overview: 'Buku harian dan jurnal kerja personal untuk mendokumentasikan refleksi harian, pencapaian karir, evaluasi kesalahan, lampiran foto dokumentasi, dan skor suasana hati.',
    targetUser: 'Profesional yang ingin merawat memori perjalanan karir dan menuangkan pikiran secara bebas.',
    steps: [
      {
        stepNumber: 1,
        title: 'Tulis Entri Jurnal Hari Ini',
        desc: 'Klik "+ Tulis Jurnal", masukkan judul cerita, pilih tanggal, dan pilih skor suasana hati (rating bintang 1-5 atau emoji mood).',
        keyAction: 'Isi judul dan tentukan tanggal jurnal.'
      },
      {
        stepNumber: 2,
        title: 'Tulis Cerita & Pengalaman Kerja',
        desc: 'Gunakan editor teks untuk menceritakan apa yang terjadi hari ini, apa pelajaran yang didapat, dan target untuk esok hari.',
        keyAction: 'Tuangkan tulisan refleksi pada area narasi.'
      },
      {
        stepNumber: 3,
        title: 'Lampirkan Foto Dokumentasi (Opsional)',
        desc: 'Unggah foto kegiatan atau momen penting hari ini agar kenangan tersimpan secara visual.',
        keyAction: 'Unggah gambar dokumentasi kegiatan.'
      },
      {
        stepNumber: 4,
        title: 'Jelajahi Arsip Kalender Jurnal',
        desc: 'Gunakan kalender jurnal untuk membaca kembali tulisan Anda di bulan-bulan sebelumnya.',
        keyAction: 'Klik tanggal pada kalender untuk membuka arsip lama.'
      }
    ],
    keyFeatures: [
      { name: 'Editor Teks Kaya & Lampiran Foto', detail: 'Mendukung penulisan paragraf panjang dengan dokumentasi gambar.' },
      { name: 'Mood & Energy Rating', detail: 'Pencatatan skala kebahagiaan harian bersamaan dengan cerita naratif.' },
      { name: 'Privasi Lokal Mutlak', detail: 'Cerita pribadi Anda tidak pernah dikirim ke internet atau diakses pihak ketiga.' }
    ],
    practicalScenario: {
      context: 'Hari pertama menjabat sebagai Team Leader di proyek baru.',
      solution: 'Tuliskan dinamika rapat perdana, tantangan yang dihadapi, dan pelajaran kepemimpinan hari ini di modul Diary sebagai bahan evaluasi karir di masa depan.'
    },
    proTips: [
      'Luangkan waktu 5 menit setiap malam sebelum tidur untuk menulis jurnal singkat sebagai penutup hari yang menenangkan.'
    ],
    faq: {
      q: 'Apakah entri jurnal saya aman jika laptop dipakai orang lain?',
      a: 'Data tersimpan di profil browser Anda. Anda juga dapat mengekspor cadangan JSON berkala dan menyimpannya di tempat yang aman.'
    }
  },
  {
    id: 'code',
    category: 'productivity',
    categoryLabel: 'Agenda & Produktivitas',
    title: 'Code Snippets & Tech Notes',
    icon: '💻',
    badge: 'Developer Snippets & Syntax',
    route: '/code-notes',
    overview: 'Buku catatan khusus potongan kode pemrograman (JavaScript, TypeScript, Python, SQL, HTML, CSS, Bash, JSON) dengan penyorot sintaks (syntax highlighting) dan tombol 1-klik salin.',
    targetUser: 'Programmer, data scientist, web developer, devops engineer, dan sysadmin.',
    steps: [
      {
        stepNumber: 1,
        title: 'Buat Potongan Kode Baru',
        desc: 'Klik "+ Tambah Snippet", masukkan judul kode, pilih bahasa pemrograman (JS, TS, Python, SQL, dll), dan ketikkan kode pada editor.',
        keyAction: 'Pilih bahasa dan ketikkan sintaks kode.'
      },
      {
        stepNumber: 2,
        title: 'Tambahkan Tag & Catatan Penjelasan',
        desc: 'Beri tag label (misal: "API", "Database", "Regex", "Utility") dan tuliskan catatan singkat tentang cara kerja skrip.',
        keyAction: 'Lengkapi tag kategori dan deskripsi skrip.'
      },
      {
        stepNumber: 3,
        title: 'Salin Kode dengan 1-Klik',
        desc: 'Saat membutuhkan kode tersebut di project Anda, klik tombol "Copy Code" di pojok kanan kartu untuk menyalin ke clipboard.',
        keyAction: 'Klik ikon salin kode.'
      },
      {
        stepNumber: 4,
        title: 'Filter berdasarkan Bahasa Pemrograman',
        desc: 'Gunakan tab filter bahasa di bagian atas untuk menyaring kumpulan snippet sesuai teknologi yang sedang Anda kerjakan.',
        keyAction: 'Pilih pill filter bahasa pemrograman.'
      }
    ],
    keyFeatures: [
      { name: 'Syntax Highlighting Modern', detail: 'Tampilan kode berwarna yang nyaman di mata dengan font monospaced.' },
      { name: 'Multi-Language Support', detail: 'Mendukung puluhan bahasa pemrograman populer.' },
      { name: 'Pencarian Instan Nama Fungsi / Variabel', detail: 'Temukan potongan kode yang dicari dalam hitungan detik.' }
    ],
    practicalScenario: {
      context: 'Sering lupa konfigurasi CORS Express.js atau regex validasi email yang kompleks.',
      solution: 'Simpan konfigurasi tersebut di Code Snippets, beri tag "Regex" / "NodeJS", dan salin kapanpun Anda memulai project baru.'
    },
    proTips: [
      'Simpan skrip query SQL analisis di sini agar siap disalin ke modul SQL Data Export kapan saja.'
    ],
    faq: {
      q: 'Bisakah saya mengedit kembali potongan kode yang sudah disimpan?',
      a: 'Bisa, cukup klik tombol edit (ikon pensil) pada kartu kode yang ingin disesuaikan.'
    }
  },
  {
    id: 'games',
    category: 'productivity',
    categoryLabel: 'Agenda & Produktivitas',
    title: '3D Mini Games & Simulator Anti-Stres',
    icon: '🎮',
    badge: 'Relaksasi & Fokus Otak',
    route: '/games',
    overview: 'Koleksi 20 mini game santai interaktif (Snake, 2048, TicTacToe, Speed Clicker, Math Quiz, Memory Card, Maze Runner, 3D Simulator) yang dapat dimainkan offline untuk melepaskan kejenuhan di sela jam kerja.',
    targetUser: 'Semua pekerja yang membutuhkan jeda istirahat aktif selama 5 menit untuk menyegarkan fokus.',
    steps: [
      {
        stepNumber: 1,
        title: 'Pilih Game Favorit',
        desc: 'Buka katalog 20 permainan, pilih game santai yang ingin dimainkan (misal: 2048 untuk strategi, Speed Clicker untuk refleks, atau Snake klasik).',
        keyAction: 'Pilih kartu game yang ingin dimainkan.'
      },
      {
        stepNumber: 2,
        title: 'Pelajari Petunjuk Kontrol',
        desc: 'Baca petunjuk tombol kontrol keyboard (tombol panah, spasi, atau klik mouse) pada kartu panduan permainan.',
        keyAction: 'Pahami tombol navigasi kontrol.'
      },
      {
        stepNumber: 3,
        title: 'Mainkan Selama Jeda Istirahat Pomodoro',
        desc: 'Mainkan 1-2 ronde game saat istirahat 5 menit Pomodoro untuk melepaskan penat otak dari layar pekerjaan berat.',
        keyAction: 'Mainkan game dan nikmati relaksasi sejenak.'
      },
      {
        stepNumber: 4,
        title: 'Raih Rekor Skor Tertinggi (High Score)',
        desc: 'Skor tertinggi Anda akan tersimpan secara otomatis di memori lokal.',
        keyAction: 'Tantang diri memecahkan rekor skor tertinggi.'
      }
    ],
    keyFeatures: [
      { name: '20 Game Lengkap Tanpa Internet', detail: 'Dapat dimainkan 100% offline tanpa iklan mengganggu.' },
      { name: 'Pencatat High Score Lokal', detail: 'Menyimpan rekor skor terbaik Anda di setiap game.' },
      { name: 'Desain Ringan & Responsif', detail: 'Berjalan mulus di perangkat laptop maupun layar sentuh smartphone.' }
    ],
    practicalScenario: {
      context: 'Mengalami kebuntuan ide (writer\'s block) atau kelelahan setelah 2 jam menatap kode program.',
      solution: 'Buka game 2048 atau Snake selama 5 menit, segarkan pikiran dengan tantangan ringan, lalu kembali bekerja dengan fokus baru.'
    },
    proTips: [
      'Gunakan game Math Quiz untuk mengasah kecepatan berhitung otak sebelum memulai perhitungan RAB atau akuntansi.'
    ],
    faq: {
      q: 'Apakah bermain game ini memakan kuota internet?',
      a: 'Sama sekali tidak. Seluruh logika game diproses murni di JavaScript lokal browser Anda.'
    }
  },

  // ==========================================
  // GROUP 5: SISTEM & PANDUAN
  // ==========================================
  {
    id: 'preferences',
    category: 'system',
    categoryLabel: 'Sistem & Panduan',
    title: 'Preferences & Setelan Perangkat / PWA / Backup',
    icon: '⚙️',
    badge: 'Pusat Pengaturan & Keamanan Data',
    route: '/preferences',
    overview: 'Pusat kendali pengaturan aplikasi: tema warna Material Design, mode gelap (Slate Dark & True Black OLED), ambang batas anggaran, izin notifikasi sistem, instalasi PWA, serta Full App Data Backup (Export JSON) & Full Data Recovery (Import JSON).',
    targetUser: 'Semua pengguna untuk menyesuaikan kenyamanan tampilan dan membackup data secara berkala.',
    steps: [
      {
        stepNumber: 1,
        title: 'Pilih Palet Warna & Mode Gelap',
        desc: 'Pilih warna aksen favorit (Indigo, Emerald, Rose, Amber, Cyan, Purple, Slate) dan pilih mode tampilan: Terang (Light), Gelap (Slate Dark), atau Hitam Pekat (True Black OLED).',
        keyAction: 'Klik swatch warna dan toggle dark mode.'
      },
      {
        stepNumber: 2,
        title: 'Pasang Aplikasi ke HP (Install PWA)',
        desc: 'Gunakan panel PWA untuk menginstall TaskArts langsung ke layar utama HP Android/iOS Anda agar berjalan layaknya aplikasi native.',
        keyAction: 'Klik tombol "Install TaskArts ke HP / Device".'
      },
      {
        stepNumber: 3,
        title: 'Kelola Izin Notifikasi On-Device',
        desc: 'Klik tombol "Izinkan Notifikasi On-Device" untuk menerima pemberitahuan jadwal kerja, batas waktu tugas, dan invoice.',
        keyAction: 'Izinkan notifikasi browser di perangkat Anda.'
      },
      {
        stepNumber: 4,
        title: 'Ekspor Cadangan Lengkap (Full Backup JSON)',
        desc: 'Pada bagian Pencadangan Data, klik tombol "Ekspor Semua Data (Full Backup)" untuk mengunduh satu berkas .json yang memuat seluruh To-Do, Keuangan, Proyek, Surat, CV, dan Catatan Anda.',
        keyAction: 'Unduh file backup JSON secara berkala.'
      },
      {
        stepNumber: 5,
        title: 'Pulihkan Data (Full Recovery Import)',
        desc: 'Untuk memulihkan data di komputer/HP baru, pilih file backup JSON Anda lalu klik tombol "Pulihkan & Timpa (Full Recovery)".',
        keyAction: 'Pilih file backup dan pulihkan data.'
      }
    ],
    keyFeatures: [
      { name: 'Universal JSON Backup Schema', detail: 'Portabilitas data 100% tanpa lock-in; pindahkan data antar browser dan perangkat dengan mudah.' },
      { name: 'OLED True Black Theme', detail: 'Mode hitam pekat untuk menghemat daya baterai pada layar AMOLED/OLED.' },
      { name: 'PWA Standalone Engine', detail: 'Dukungan offline penuh dan ikon mandiri di app drawer.' }
    ],
    practicalScenario: {
      context: 'Membeli laptop baru dan ingin memindahkan seluruh database pekerjaan dari laptop lama ke laptop baru.',
      solution: 'Di laptop lama: buka Preferences, klik "Ekspor Semua Data (Full Backup)". Di laptop baru: buka TaskArts, pilih file JSON tadi, dan klik "Pulihkan & Timpa". Seluruh data seketika berpindah utuh.'
    },
    proTips: [
      'Simpan file backup JSON mingguan Anda di Google Drive atau flashdisk sebagai cadangan permanen.'
    ],
    faq: {
      q: 'Apakah memulihkan data (Restore) akan menghapus data lama?',
      a: 'Proses pemulihan akan menimpa data di browser saat ini dengan data yang ada di dalam file cadangan JSON yang Anda pilih.'
    }
  },
  {
    id: 'faq',
    category: 'system',
    categoryLabel: 'Sistem & Panduan',
    title: 'Info, Panduan Fitur & Hidden Tricks',
    icon: '💡',
    badge: 'Dokumentasi & Tutorial',
    route: '/faq',
    overview: 'Pusat dokumentasi dan panduan mendalam untuk seluruh fitur aplikasi, ensiklopedia modul kerja, daftar pintasan keyboard rahasia, panduan instalasi PWA di semua OS, serta arsitektur Local-First.',
    targetUser: 'Pengguna baru yang ingin memahami cara kerja aplikasi secara cepat dan pengguna mahir yang mencari shortcut produktivitas.',
    steps: [
      {
        stepNumber: 1,
        title: 'Pelajari Tutorial Langkah demi Langkah',
        desc: 'Buka tab "Tutorial Interaktif per Menu" untuk melihat petunjuk mendalam cara menggunakan setiap modul kerja dari awal hingga mahir.',
        keyAction: 'Pilih tab Tutorial dan cari menu yang ingin dipelajari.'
      },
      {
        stepNumber: 2,
        title: 'Cari Panduan dengan Kotak Filter Cepat',
        desc: 'Ketikkan nama fitur atau kata kunci (misal: "CV", "Mail Merge", "Kas", "QRIS", "Pomodoro") pada kotak pencarian.',
        keyAction: 'Gunakan kolom pencarian untuk navigasi instan.'
      },
      {
        stepNumber: 3,
        title: 'Buka Tab Hidden Features & Shortcuts',
        desc: 'Pelajari 10 fitur tersembunyi seperti pencadangan otomatis tengah malam (Midnight Backup), shortcut Alt+N, dan formula filter kamera.',
        keyAction: 'Buka tab Hidden Features.'
      },
      {
        stepNumber: 4,
        title: 'Gunakan Tombol Aksi Langsung',
        desc: 'Setiap kartu panduan dilengkapi tombol "🚀 Buka Modul Sekarang" yang langsung mengantarkan Anda ke halaman fitur yang sedang dipelajari.',
        keyAction: 'Klik tombol navigasi langsung ke menu terkait.'
      }
    ],
    keyFeatures: [
      { name: 'Katalog Tutorial Seluruh Modul', detail: 'Penjelasan tujuan, langkah demi langkah, fitur kunci, dan contoh skenario nyata.' },
      { name: 'Daftar Shortcut Keyboard Lengkap', detail: 'Pintasan Ctrl+P, Alt+N, Alt+K, Alt+T untuk mempercepat alur kerja.' },
      { name: 'Pencarian Realtime Interaktif', detail: 'Menyaring tutorial dan FAQ secara instan.' }
    ],
    practicalScenario: {
      context: 'Ingin mengetahui cara menggunakan fitur Mail Merge pada Surat atau 20 layout pada CV Builder.',
      solution: 'Buka tab Tutorial di menu ini, ketik "Surat" atau "CV", dan ikuti langkah demi langkah yang telah dijabarkan secara terstruktur.'
    },
    proTips: [
      'Gunakan tombol "Salin Panduan" untuk membagikan petunjuk penggunaan modul kepada rekan tim kerja Anda.'
    ],
    faq: {
      q: 'Apakah dokumentasi ini selalu diperbarui?',
      a: 'Ya, dokumentasi ini disinkronkan secara berkala seiring penambahan fitur dan pembaruan arsitektur aplikasi.'
    }
  },
  {
    id: 'developer',
    category: 'system',
    categoryLabel: 'Sistem & Panduan',
    title: 'Developer Portfolio & Journey',
    icon: '👨‍💻',
    badge: 'Profil Pembuat & Dukung Dev',
    route: '/developer',
    overview: 'Halaman portofolio resmi pembuat TaskArts (Arif Permana Putrasuryana) yang memuat perjalanan karir rekayasa perangkat lunak, keahlian teknologi, repositori GitHub, serta sarana donasi apresiasi pengembang.',
    targetUser: 'Pengguna, perekrut, rekan developer, dan siapapun yang ingin berkolaborasi atau mendukung kelanjutan pengembangan aplikasi.',
    steps: [
      {
        stepNumber: 1,
        title: 'Pelajari Profil & Jejak Langkah Pengembang',
        desc: 'Baca latar belakang rekayasa perangkat lunak, filosofi arsitektur Local-First, dan visi pengembangan ekosistem produktivitas kerja mandiri.',
        keyAction: 'Buka profil dan baca linimasa karir developer.'
      },
      {
        stepNumber: 2,
        title: 'Kunjungi Tautan Portofolio & Media Sosial',
        desc: 'Akses profil resmi LinkedIn, tulisan teknis di Medium, akun Instagram, dan repositori publik di GitHub.',
        keyAction: 'Klik tautan media sosial yang tersedia.'
      },
      {
        stepNumber: 3,
        title: 'Salin URL Repositori GitHub',
        desc: 'Gunakan tombol 1-klik salin URL Git Clone untuk melakukan forking atau mempelajari arsitektur kode Vue 3 & PWA aplikasi ini.',
        keyAction: 'Salin link repositori GitHub.'
      },
      {
        stepNumber: 4,
        title: 'Berikan Apresiasi / Dukung Pengembang',
        desc: 'Jika aplikasi ini membantu pekerjaan Anda sehari-hari, Anda dapat memberikan dukungan kopi (Dukung Dev) melalui nomor rekening bank atau e-wallet resmi yang tersedia.',
        keyAction: 'Buka kartu rekening Bank & E-Wallet untuk berdonasi.'
      }
    ],
    keyFeatures: [
      { name: 'Profil Profesional Komprehensif', detail: 'Rekam jejak keahlian Vue.js, TypeScript, Node.js, SQL, dan arsitektur sistem.' },
      { name: 'Tautan Resmi Terverifikasi', detail: 'Koneksi langsung ke LinkedIn, Medium, Instagram, dan GitHub.' },
      { name: 'Sarana Dukungan Donasi', detail: 'Informasi rekening Bank Mandiri, BCA, SeaBank, GoPay, dan OVO.' }
    ],
    practicalScenario: {
      context: 'Ingin berdiskusi mengenai proyek kolaborasi atau mengapresiasi developer atas fitur gratis tanpa iklan yang sangat membantu pekerjaan kantor.',
      solution: 'Buka menu Developer, klik tombol LinkedIn untuk mengirim pesan profesional atau klik tombol "Dukung Dev" untuk mengirimkan traktiran kopi apresiasi.'
    },
    proTips: [
      'Klik tombol "Salin Nomor" pada kartu rekening bank untuk menyalin nomor rekening secara cepat tanpa takut salah ketik.'
    ],
    faq: {
      q: 'Apakah source code aplikasi ini bisa dipelajari?',
      a: 'Bisa, repositori source code tersedia secara terbuka di GitHub itsmebroarif/rajinkerja-id.'
    }
  }
];
