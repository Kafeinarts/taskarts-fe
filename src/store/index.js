import { createStore } from 'vuex';

// Default empty datasets as requested: "buat semuanya dari raw dan kosong tanpa ada data apa apa"
const DEFAULT_CONTACTS = [];
const DEFAULT_PROJECTS = [];
const DEFAULT_TASKS = [];
const DEFAULT_TRANSACTIONS = [];
const DEFAULT_INVOICES = [];
const DEFAULT_HABITS = [];
const DEFAULT_NOTES = [];
const DEFAULT_EVENTS = [];
const DEFAULT_DIARIES = [];

const SAMPLE_DIARIES = [
  {
    id: 'diary_sample_1',
    title: '🌅 Pagi yang Penuh Semangat & Terobosan Baru',
    content: `# Refleksi Pagi: Memulai dengan Rasa Syukur

Hari ini udara terasa sangat sejuk. Setelah menyeduh secangkir teh hangat, aku meninjau kembali target mingguan yang sudah disusun.

> "Langkah kecil yang konsisten setiap hari akan membawa perubahan besar yang tak terduga."

### 🌟 Hal yang Disyukuri Hari Ini:
- [x] Bangun tepat waktu dan badan terasa bugar
- [x] Ide solusi untuk perbaikan sistem berhasil dirumuskan
- [ ] Diskusi santai bersama tim nanti sore

Rasanya sangat memuaskan ketika apa yang kita rencanakan bisa berjalan dengan lancar. Tetap fokus dan rendah hati! ✨`,
    mood: '🤩',
    moodLabel: 'Bersemangat',
    weather: '☀️',
    weatherLabel: 'Cerah',
    location: 'Ruang Kerja Rumah',
    category: 'Refleksi Pagi',
    tags: ['semangat', 'produktivitas', 'syukur'],
    theme: 'vintage',
    images: [
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    isPinned: true,
    isFavorite: true,
    isPrivate: false,
    date: '2026-08-21',
    time: '08:30',
    createdAt: new Date('2026-08-21T08:30:00').toISOString(),
    updatedAt: new Date('2026-08-21T08:30:00').toISOString()
  },
  {
    id: 'diary_sample_2',
    title: '☕ Hujan Sore, Secangkir Kopi, dan Cerita Santai',
    content: `# Sore yang Tenang di Bawah Rintik Hujan

Sore ini hujan turun cukup deras di luar jendela. Suara rintik airnya memberi ketenangan tersendiri setelah seharian berkutat dengan pekerjaan.

Menikmati secangkir kopi hitam hangat sambil mendengarkan musik akustik instrumental. Ini adalah momen berharga untuk *recharging* energi mental.

\`\`\`
Momen damai seperti ini mengingatkan kita untuk menikmati setiap proses perjalanan hidup.
\`\`\`

### 📖 Rencana Malam Ini:
1. Membaca 1 bab buku favorit
2. Merapikan catatan ide untuk esok hari
3. Istirahat lebih awal agar tubuh tetap fit`,
    mood: '🌿',
    moodLabel: 'Bersyukur & Tenang',
    weather: '🌧️',
    weatherLabel: 'Hujan Sejuk',
    location: 'Coffee Shop Favorit',
    category: 'Cerita Sore',
    tags: ['kopi', 'hujan', 'istirahat', 'mindfulness'],
    theme: 'lavender',
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    isPinned: false,
    isFavorite: true,
    isPrivate: false,
    date: '2026-08-20',
    time: '17:15',
    createdAt: new Date('2026-08-20T17:15:00').toISOString(),
    updatedAt: new Date('2026-08-20T17:15:00').toISOString()
  }
];

const SAMPLE_NOTES = [
  {
    id: 'n_sample_1',
    title: '🚀 Alur Kerja Deployment & CI/CD Pipeline',
    content: `# Dokumentasi Deployment Sistem & Data Rekapitulasi

Berikut alur otomatisasi proses deployment dari commit repository hingga server production:

\`\`\`mermaid
flowchart TD
    Dev([💻 Developer Commit & Push]) --> Git[Push ke GitHub Branch Main]
    Git --> CI{Trigger GitHub Actions CI}
    CI -- Unit Test Pass --> Build[📦 Build Vite Production Assets]
    CI -- Test Fail --> Alert[❌ Kirim Notifikasi Slack / Discord]
    Build --> TestQA[🧪 Automated E2E Testing QA]
    TestQA --> Docker[🐳 Build & Push Docker Image]
    Docker --> Deploy([🚀 Deploy ke Server Production Cloud Run])
\`\`\`

### 📊 Tabel Matriks Pengujian & Spesifikasi Lingkungan

| Modul / Komponen | Lingkungan (Env) | Status CI/CD | Latensi Target | Coverage Test | Penanggung Jawab | Catatan Khusus |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Authentication Service** | Staging & Prod | 🟢 Passed | < 120ms | 94.5% | Tim Backend Security | OAuth 2.0 Token Rotation |
| **Markdown & Mermaid Studio** | Local & Prod | 🟢 Passed | < 45ms | 98.2% | Tim Frontend Vue 3 | Pan, Zoom & Node Focus Ready |
| **Local-First Database Store** | Client Browser | 🟢 Passed | < 10ms | 100% | Tim Core Data | IndexedDB & LocalStorage Cache |
| **Realtime Push Notifications** | Cloud Functions | 🟡 In Review | < 250ms | 87.0% | DevOps Specialist | Web Push API integration |
| **Document PDF & SQL Exporter** | Client-Side Worker | 🟢 Passed | < 300ms | 91.8% | Tim Pelaporan | Standalone Tab Document Printer |

### 📌 Checklist Rilis:
- [x] Verifikasi environment variable di production
- [x] Migrasi skema database aman
- [ ] Pantau error logging selama 1 jam pertama`,
    color: '#bae6fd',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'n_sample_2',
    title: '💡 Rancangan Arsitektur Aplikasi & Data Flow',
    content: `# Arsitektur Frontend & State Management

Diagram interaksi komponen sistem, Vuex Store, dan LocalStorage:

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Pengguna
    participant View as 🖥️ StickyNotesView
    participant Store as 🏬 Vuex Store
    participant DB as 💾 LocalStorage

    User->>View: Buka Halaman Notes & Scratchpad
    View->>Store: Dispatch getNotes()
    Store->>DB: Read JSON from ft_notes
    DB-->>Store: Return notes array
    Store-->>View: Render List & Mermaid SVGs
    User->>View: Tulis Note Baru & Sisipkan Gambar
    View->>Store: Dispatch addNote(payload)
    Store->>DB: Save to ft_notes (Local-First)
    DB-->>View: Realtime Sync & Tampilkan Toast
\`\`\`

> Catatan: Semua data disimpan secara privat di browser tanpa ketergantungan server eksternal.`,
    color: '#fef08a',
    updatedAt: new Date().toISOString()
  }
];

// Sample data generator for users who click "Load Sample Data"
const SAMPLE_CONTACTS = [
  {
    id: 'c1',
    name: 'Budi Santoso',
    company: 'PT Teknologi Nusantara',
    email: 'budi@teknus.co.id',
    phone: '081234567890',
    address: 'Jl. Jend. Sudirman No. 45, Jakarta Selatan',
    category: 'Corporate Client',
    status: 'Active',
    notes: 'Klien lama, pembayaran selalu tepat waktu.',
    createdDate: '2026-01-15'
  },
  {
    id: 'c2',
    name: 'Rian Prasetyo',
    company: 'RajinKerja Core Team',
    email: 'rian.dev@rajinkerja.id',
    phone: '081398765432',
    address: 'BSD City, Tangerang Selatan',
    category: 'Tim Internal',
    status: 'Active',
    notes: 'Lead Developer & System Architect.',
    createdDate: '2026-01-20'
  },
  {
    id: 'c3',
    name: 'Dinda Kirana',
    company: 'RajinKerja Core Team',
    email: 'dinda.design@rajinkerja.id',
    phone: '085712345678',
    address: 'Kebayoran Baru, Jakarta Selatan',
    category: 'Tim Internal',
    status: 'VIP',
    notes: 'Senior UI/UX Designer & Product Illustrator.',
    createdDate: '2026-02-01'
  },
  {
    id: 'c4',
    name: 'Sarah Jenkins',
    company: 'Global Tech Solutions',
    email: 'sarah.j@globaltech.com',
    phone: '081987654321',
    address: '500 Howard St, San Francisco, CA 94105',
    category: 'International',
    status: 'VIP',
    notes: 'Proyek frontend Vue 3. Pembayaran USD via Wise.',
    createdDate: '2026-02-10'
  }
];

const SAMPLE_PROJECTS = [
  {
    id: 'p1',
    clientName: 'PT Teknologi Nusantara',
    clientEmail: 'budi@teknus.co.id',
    clientPhone: '0812-3456-7890',
    projectTitle: 'Redesign E-Commerce Mobile App UI/UX',
    deadline: '2026-08-20',
    rate: 15000000,
    status: 'In Progress',
    description: 'Mengubah tampilan dashboard & checkout e-commerce.',
    progress: 65
  },
  {
    id: 'p2',
    clientName: 'Global Tech Solutions',
    clientEmail: 'sarah.j@globaltech.com',
    clientPhone: '+1 (415) 892-0123',
    projectTitle: 'Vue 3 Dashboard Widget Components',
    deadline: '2026-08-30',
    rate: 18000000,
    status: 'In Progress',
    description: 'Modul statistik & charting reusable component library.',
    progress: 40
  }
];

const SAMPLE_TASKS = [
  {
    id: 't1',
    name: 'Selesaikan Wireframe Checkout Flow',
    level: 'Penting',
    category: 'Work',
    projectTag: 'E-Commerce Mobile App',
    deadline: '2026-07-30',
    done: true,
    statusColumn: 'done',
    recurring: 'none',
    eisenhower: 'do_first',
    notes: 'Disetujui oleh Pak Budi.'
  },
  {
    id: 't2',
    name: 'Integrasi Store & LocalStorage Persistence',
    level: 'Penting',
    category: 'Urgent',
    projectTag: 'Vue 3 Components',
    deadline: '2026-08-02',
    done: false,
    statusColumn: 'in_progress',
    recurring: 'weekly',
    eisenhower: 'do_first',
    notes: 'Pastikan state tersimpan secara otomatis.'
  },
  {
    id: 't3',
    name: 'Kirim Invoice Down Payment',
    level: 'Menengah',
    category: 'Client',
    projectTag: 'Vue 3 Components',
    deadline: '2026-08-05',
    done: false,
    statusColumn: 'todo',
    recurring: 'none',
    eisenhower: 'schedule',
    notes: 'Nominal DP 50% = Rp 9.000.000.'
  }
];

const SAMPLE_TRANSACTIONS = [
  {
    id: 'tr1',
    item: 'Down Payment Proyek Redesign E-Commerce',
    amount: 7500000,
    type: 'income',
    date: '2026-07-10',
    category: 'Web Development',
    method: 'Bank Transfer',
    track: 'PT Teknologi Nusantara'
  },
  {
    id: 'tr2',
    item: 'Langganan Software Design & Servers',
    amount: 2200000,
    type: 'expense',
    date: '2026-07-12',
    category: 'Software Subscription',
    method: 'Credit Card',
    track: 'Operational Tools'
  }
];

const SAMPLE_HABITS = [
  { id: 'h1', name: 'Coding / Deep Work 2 Jam', category: 'Productivity', history: { '2026-07-26': true, '2026-07-27': true } },
  { id: 'h2', name: 'Prospek & Outreach Klien Baru', category: 'Business', history: { '2026-07-27': true } },
  { id: 'h3', name: 'Olahraga & Stretching 30 Mnt', category: 'Health', history: {} }
];

const DEFAULT_WORK_ALARMS = [
  { id: 'al_1', time: '08:00', label: 'Jam Mulai Kerja & Cek Kanban', active: true, sound: 'beep', repeat: 'Senin - Jumat' },
  { id: 'al_2', time: '12:00', label: 'Istirahat Siang & Makan', active: true, sound: 'chime', repeat: 'Setiap Hari' },
  { id: 'al_3', time: '13:00', label: 'Selesai Istirahat & Sesi Siang', active: true, sound: 'beep', repeat: 'Senin - Jumat' },
  { id: 'al_4', time: '17:00', label: 'Jam Selesai Kerja & Evaluasi', active: true, sound: 'siren', repeat: 'Senin - Jumat' }
];

// Sample RAB data generator for general project & event budgeting
const SAMPLE_RAB_ITEMS = [
  {
    id: 'rab_1',
    nama_item: 'Sewa Tempat & Stage Perlengkapan',
    qty: 1,
    satuan: 'paket',
    income: 2500000,
    harga_satuan: 2000000,
    total: 2000000,
    tanggal: '2026-08-01',
    status: 'Lunas / Terbayar',
    catatan: 'Termasuk sound system & panggung utama',
    created_at: '2026-08-01',
    updated_at: '2026-08-01'
  },
  {
    id: 'rab_2',
    nama_item: 'Konsumsi & Snack Peserta',
    qty: 50,
    satuan: 'porsi',
    income: 1000000,
    harga_satuan: 15000,
    total: 750000,
    tanggal: '2026-08-03',
    status: 'Disetujui',
    catatan: 'Nasi kotak + air mineral gelas',
    created_at: '2026-08-03',
    updated_at: '2026-08-03'
  },
  {
    id: 'rab_3',
    nama_item: 'Cetak Banner & Spanduk Acara',
    qty: 3,
    satuan: 'pcs',
    income: 300000,
    harga_satuan: 85000,
    total: 255000,
    tanggal: '2026-08-04',
    status: 'Proses Belanja',
    catatan: 'Ukuran 3x1m bahan outdoor flexi',
    created_at: '2026-08-04',
    updated_at: '2026-08-04'
  },
  {
    id: 'rab_4',
    nama_item: 'Honor Pemateri / Narasumber',
    qty: 2,
    satuan: 'orang',
    income: 1500000,
    harga_satuan: 500000,
    total: 1000000,
    tanggal: '2026-08-05',
    status: 'Rencana',
    catatan: 'Sertifikat & plakat narasumber',
    created_at: '2026-08-05',
    updated_at: '2026-08-05'
  },
  {
    id: 'rab_5',
    nama_item: 'Atribut & Modul Pelatihan',
    qty: 50,
    satuan: 'pack',
    income: 500000,
    harga_satuan: 8000,
    total: 400000,
    tanggal: '2026-08-06',
    status: 'Selesai',
    catatan: 'Stopmap, ballpoint, & printout modul',
    created_at: '2026-08-06',
    updated_at: '2026-08-06'
  }
];

const SAMPLE_RAB_INCOMES = [
  {
    id: 'inc_1',
    sumber_dana: 'Kas Utama / Dana Awal',
    tanggal: '2026-08-01',
    nominal: 3000000,
    keterangan: 'Alokasi dana awal dari pimpinan',
    created_at: '2026-08-01',
    updated_at: '2026-08-01'
  },
  {
    id: 'inc_2',
    sumber_dana: 'Sponsorship / Donatur Utama',
    tanggal: '2026-08-02',
    nominal: 2000000,
    keterangan: 'Dana sponsor PT Mitra Bersama',
    created_at: '2026-08-02',
    updated_at: '2026-08-02'
  },
  {
    id: 'inc_3',
    sumber_dana: 'Iuran Pendaftaran Peserta',
    tanggal: '2026-08-04',
    nominal: 800000,
    keterangan: 'Pendaftaran 16 peserta',
    created_at: '2026-08-04',
    updated_at: '2026-08-04'
  }
];

const SAMPLE_RAB_EXPENSES = [
  {
    id: 'exp_1',
    rab_item_id: 'rab_1',
    deskripsi: 'DP Tempat & Stage Perlengkapan',
    tanggal: '2026-08-01',
    qty: 1,
    harga_satuan: 2000000,
    total: 2000000,
    keterangan: 'Lunas kuitansi No. 088',
    created_at: '2026-08-01',
    updated_at: '2026-08-01'
  },
  {
    id: 'exp_2',
    rab_item_id: 'rab_3',
    deskripsi: 'Cetak Banner & Spanduk Acara',
    tanggal: '2026-08-04',
    qty: 3,
    harga_satuan: 80000,
    total: 240000,
    keterangan: 'Cetak di Percetakan Cepat Hemat Rp15.000',
    created_at: '2026-08-04',
    updated_at: '2026-08-04'
  }
];

function loadLocal(key, defaultData) {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultData;
  } catch (e) {
    return defaultData;
  }
}

function saveLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

export default createStore({
  state() {
    return {
      contacts: loadLocal('ft_contacts', DEFAULT_CONTACTS),
      projects: loadLocal('ft_projects', DEFAULT_PROJECTS),
      tasks: loadLocal('ft_tasks', DEFAULT_TASKS),
      transactions: loadLocal('ft_transactions', DEFAULT_TRANSACTIONS),
      invoices: loadLocal('ft_invoices', DEFAULT_INVOICES),
      habits: loadLocal('ft_habits', DEFAULT_HABITS),
      notes: loadLocal('ft_notes', DEFAULT_NOTES),
      diaries: loadLocal('ft_diaries', DEFAULT_DIARIES),
      events: loadLocal('ft_events', DEFAULT_EVENTS),
      moodLogs: loadLocal('ft_moodLogs', []),
      workAlarms: loadLocal('ft_workAlarms', DEFAULT_WORK_ALARMS),
      geminiApiKey: loadLocal('ft_geminiApiKey', ''),
      rabItems: loadLocal('ft_rabItems', []),
      rabIncomes: loadLocal('ft_rabIncomes', []),
      rabExpenses: loadLocal('ft_rabExpenses', []),
      aiProvider: loadLocal('ft_aiProvider', 'gemini'),
      aiModel: loadLocal('ft_aiModel', 'gemini-1.5-flash'),
      themeMode: 'light', // Light mode default
      accentColor: loadLocal('ft_accentColor', '#2563eb'), // default Material blue
      budgetThreshold: loadLocal('ft_budgetThreshold', 5000000), // Default budget threshold: Rp 5.000.000
      welcomeBanner: loadLocal('ft_welcomeBanner', {
        title: 'Selamat Datang, Rekan Kerja!',
        subtitle: 'Pusat kendali produktivitas & organizer karir karyawan Anda: kelola tugas (5 view modes), proyek kantor, arus kas, dan invoice.'
      }),
      myBusiness: loadLocal('ft_myBusiness', {
        name: '',
        tagline: '',
        owner: '',
        email: '',
        phone: '',
        bankName: '',
        accountNumber: '',
        accountHolder: ''
      }),
      userProfile: loadLocal('ft_userProfile', {
        name: 'Arip Developer',
        jobTitle: 'Full-Stack Developer & Tech Lead',
        company: 'RajinKerja Studio',
        bio: 'Productive developer creating high-performance web solutions & productivity tools.',
        email: 'aripstrike@gmail.com',
        phone: '081234567890',
        avatar: ''
      }),
      cvData: loadLocal('ft_cvData', {
        fullName: 'Budi Pratama',
        jobTitle: 'Senior Frontend Engineer',
        email: 'budi.pratama@email.com',
        phone: '081234567890',
        address: 'Jakarta, Indonesia',
        linkedin: 'linkedin.com/in/budipratama',
        github: 'github.com/budipratama',
        website: 'budipratama.dev',
        summary: 'Experienced Senior Frontend Engineer with 5+ years of building scalable web applications using Vue 3, React, and Modern Web Standards.',
        experience: [
          {
            company: 'PT Tech Inovasi',
            position: 'Senior Frontend Developer',
            period: '2022 - Sekarang',
            location: 'Jakarta',
            description: 'Memimpin tim frontend dalam pengembangan PWA web app dengan Vue 3 & TypeScript, meningkatkan conversion rate 35%.'
          }
        ],
        education: [
          {
            institution: 'Universitas Indonesia',
            degree: 'S1 Teknik Informatika',
            period: '2017 - 2021',
            gpa: '3.82'
          }
        ],
        skills: ['Vue.js 3', 'TypeScript', 'Tailwind CSS', 'Node.js', 'REST API', 'Git', 'PWA', 'Jest'],
        languages: ['Bahasa Indonesia (Native)', 'English (Professional)'],
        certifications: ['Google Certified Associate Cloud Engineer', 'Meta Front-End Developer Specialization'],
        selectedTemplate: 'ats_clean_1'
      }),
      bulkCvList: loadLocal('ft_bulkCvList', [
        {
          id: 'cv_cand_1',
          fullName: 'Budi Pratama, S.Kom',
          jobTitle: 'Senior Frontend Engineer',
          email: 'budi.pratama@email.com',
          phone: '081234567890',
          address: 'Jakarta, Indonesia',
          linkedin: 'linkedin.com/in/budipratama',
          github: 'github.com/budipratama',
          summary: 'Software Engineer berpengalaman 4+ tahun dalam pengembangan arsitektur Single Page Application (SPA) dan Progressive Web Apps (PWA) berbasis Vue 3 dan TypeScript.',
          experience: [
            {
              company: 'PT Solusi Teknologi Nusantara',
              position: 'Lead Frontend Developer',
              period: '2022 - Sekarang',
              location: 'Jakarta Selatan',
              description: '• Memimpin pengembangan 8+ modul web enterprise berbasis Vue 3, Pinia, dan Tailwind CSS.\n• Mengoptimalkan performa loading aplikasi hingga 45% dan meningkatkan retensi pengguna.'
            }
          ],
          education: [
            {
              institution: 'Universitas Indonesia',
              degree: 'S1 Ilmu Komputer / Teknik Informatika',
              period: '2017 - 2021',
              gpa: '3.82 / 4.00'
            }
          ],
          skills: ['Vue.js 3', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js', 'REST API', 'Git', 'Docker'],
          languages: ['Bahasa Indonesia (Native)', 'English (Professional Working)'],
          certifications: ['Google Cloud Certified Associate Cloud Engineer', 'Meta Front-End Developer Certificate'],
          selectedTemplate: 'single_column',
          customColor: '#0d6efd',
          cvFont: 'font-sans'
        },
        {
          id: 'cv_cand_2',
          fullName: 'Siti Rahmadani, S.Ds',
          jobTitle: 'Lead UI/UX & Product Designer',
          email: 'siti.rahmadani@design.io',
          phone: '081398765432',
          address: 'Bandung, Jawa Barat',
          linkedin: 'linkedin.com/in/sitirahma',
          github: 'dribbble.com/sitirahma',
          summary: 'Product Designer dengan pengalaman 5+ tahun merancang design system enterprise, user research, wireframing, dan interactive prototyping high-fidelity di Figma.',
          experience: [
            {
              company: 'PT Kreatif Visual Studio',
              position: 'Lead UI/UX Designer',
              period: '2021 - Sekarang',
              location: 'Bandung',
              description: '• Merancang comprehensive Design System terstandarisasi dengan 200+ komponen reusable di Figma.\n• Melakukan usability testing berkala yang meningkatkan task success rate hingga 32%.'
            }
          ],
          education: [
            {
              institution: 'Institut Teknologi Bandung',
              degree: 'S1 Desain Komunikasi Visual',
              period: '2016 - 2020',
              gpa: '3.78 / 4.00'
            }
          ],
          skills: ['Figma Master', 'Design System', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'HTML/CSS Basics'],
          languages: ['Bahasa Indonesia (Native)', 'English (Fluent)'],
          certifications: ['Google UX Design Professional Certificate', 'Nielsen Norman Group UX Master'],
          selectedTemplate: 'sidebar_left',
          customColor: '#10b981',
          cvFont: 'font-sans'
        },
        {
          id: 'cv_cand_3',
          fullName: 'Ahmad Fauzi, M.Kom',
          jobTitle: 'Senior Backend & Cloud Architect',
          email: 'ahmad.fauzi@backend.dev',
          phone: '085712345678',
          address: 'Surabaya, Jawa Timur',
          linkedin: 'linkedin.com/in/ahmadfauzi',
          github: 'github.com/ahmadfauzi',
          summary: 'Backend Engineer spesialis arsitektur Microservices, REST & GraphQL API, PostgreSQL, Redis, dan Containerization (Docker/Kubernetes) dengan throughput tinggi.',
          experience: [
            {
              company: 'PT Cloud Nusantara Solusindo',
              position: 'Senior Backend Engineer',
              period: '2020 - Sekarang',
              location: 'Surabaya',
              description: '• Mengembangkan microservices Go & Node.js yang menangani 2+ juta request per hari dengan latency < 80ms.\n• Mengelola database PostgreSQL berukuran TB dengan partitioning dan query indexing optimal.'
            }
          ],
          education: [
            {
              institution: 'Institut Teknologi Sepuluh Nopember',
              degree: 'S2 Teknik Informatika',
              period: '2019 - 2021',
              gpa: '3.90 / 4.00'
            }
          ],
          skills: ['Golang', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'CI/CD Pipeline', 'Microservices'],
          languages: ['Bahasa Indonesia (Native)', 'English (Professional)'],
          certifications: ['AWS Certified Solutions Architect Associate', 'CKA Certified Kubernetes Administrator'],
          selectedTemplate: 'technical_grid',
          customColor: '#6366f1',
          cvFont: 'font-mono'
        }
      ]),
      codeNotes: loadLocal('ft_codeNotes', []),
      suratList: loadLocal('ft_suratList', []),
      selfieGallery: loadLocal('ft_selfieGallery', [])
    };
  },
  getters: {
    getContacts: (state) => state.contacts,
    getProjects: (state) => state.projects,
    getTasks: (state) => state.tasks,
    getTransactions: (state) => state.transactions,
    getInvoices: (state) => state.invoices,
    getHabits: (state) => state.habits,
    getNotes: (state) => state.notes,
    getEvents: (state) => state.events,
    getMoodLogs: (state) => state.moodLogs,
    getWorkAlarms: (state) => state.workAlarms,
    getGeminiApiKey: (state) => state.geminiApiKey,
    getAiProvider: (state) => state.aiProvider,
    getAiModel: (state) => state.aiModel,
    getThemeMode: (state) => state.themeMode,
    getAccentColor: (state) => state.accentColor,
    getBudgetThreshold: (state) => state.budgetThreshold,
    getMyBusiness: (state) => state.myBusiness,
    getWelcomeBanner: (state) => state.welcomeBanner || { title: 'Selamat Datang, Rekan Kerja!', subtitle: 'Pusat kendali produktivitas & organizer karir karyawan Anda: kelola tugas (5 view modes), proyek kantor, arus kas, dan invoice.' },
    getUserProfile: (state) => state.userProfile,
    getCvData: (state) => state.cvData,
    getBulkCvList: (state) => state.bulkCvList || [],
    getCodeNotes: (state) => state.codeNotes,
    getSuratList: (state) => state.suratList,
    getSelfieGallery: (state) => state.selfieGallery,

    // RAB Getters
    getRabItems: (state) => state.rabItems || [],
    getRabIncomes: (state) => state.rabIncomes || [],
    getRabExpenses: (state) => state.rabExpenses || [],
    totalRabAmount: (state) => (state.rabItems || []).reduce((acc, item) => acc + (Number(item.total) || (Number(item.qty || 0) * Number(item.harga_satuan || 0))), 0),
    totalRabItemIncome: (state) => (state.rabItems || []).reduce((acc, item) => acc + (Number(item.income) || 0), 0),
    totalRabIncome: (state, getters) => {
      const directInc = (state.rabIncomes || []).reduce((acc, inc) => acc + (Number(inc.nominal) || 0), 0);
      const itemInc = getters.totalRabItemIncome;
      return Math.max(directInc, itemInc);
    },
    totalRabExpense: (state) => (state.rabExpenses || []).reduce((acc, exp) => acc + (Number(exp.total) || (Number(exp.qty || 0) * Number(exp.harga_satuan || 0))), 0),
    sisaRabAmount: (state, getters) => getters.totalRabIncome - getters.totalRabAmount,
    sisaRabAktual: (state, getters) => getters.totalRabIncome - getters.totalRabExpense,
    selisihRabVsExpense: (state, getters) => getters.totalRabAmount - getters.totalRabExpense,
    rabStatusInfo: (state, getters) => {
      const diff = getters.selisihRabVsExpense;
      if (diff > 0) {
        return { status: 'Hemat', label: `Hemat Rp${diff.toLocaleString('id-ID')}`, color: 'success', diff };
      } else if (diff === 0) {
        return { status: 'Sesuai RAB', label: 'Sesuai Target RAB', color: 'primary', diff: 0 };
      } else {
        return { status: 'Over Budget', label: `Over Budget Rp${Math.abs(diff).toLocaleString('id-ID')}`, color: 'danger', diff };
      }
    },

    // Statistics
    totalClientsCount: (state) => state.contacts.length,
    activeProjectsCount: (state) => state.projects.filter(p => p.status === 'In Progress').length,
    completedTasksCount: (state) => state.tasks.filter(t => t.done || t.statusColumn === 'done').length,
    totalTasksCount: (state) => state.tasks.length,
    pendingTasksCount: (state) => state.tasks.filter(t => !t.done && t.statusColumn !== 'done').length,

    totalIncome: (state) => {
      return state.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    },
    totalExpense: (state) => {
      return state.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    },
    netProfit: (state, getters) => {
      return getters.totalIncome - getters.totalExpense;
    },
    isBudgetExceeded: (state, getters) => {
      return getters.totalExpense > state.budgetThreshold;
    }
  },
  mutations: {
    // Theme & Preferences
    SET_THEME_MODE(state, mode) {
      state.themeMode = mode;
      saveLocal('ft_themeMode', state.themeMode);
    },
    SET_ACCENT_COLOR(state, color) {
      state.accentColor = color;
      saveLocal('ft_accentColor', state.accentColor);
    },

    // Contacts
    ADD_CONTACT(state, contact) {
      state.contacts.unshift(contact);
      saveLocal('ft_contacts', state.contacts);
    },
    ADD_CONTACTS_BULK(state, list) {
      state.contacts.unshift(...list);
      saveLocal('ft_contacts', state.contacts);
    },
    UPDATE_CONTACT(state, updatedContact) {
      const index = state.contacts.findIndex(c => c.id === updatedContact.id);
      if (index !== -1) {
        state.contacts.splice(index, 1, updatedContact);
        saveLocal('ft_contacts', state.contacts);
      }
    },
    DELETE_CONTACT(state, id) {
      state.contacts = state.contacts.filter(c => c.id !== id);
      saveLocal('ft_contacts', state.contacts);
    },
    DELETE_CONTACTS_BULK(state, ids) {
      state.contacts = state.contacts.filter(c => !ids.includes(c.id));
      saveLocal('ft_contacts', state.contacts);
    },

    // Projects
    ADD_PROJECT(state, project) {
      state.projects.unshift(project);
      saveLocal('ft_projects', state.projects);
    },
    ADD_PROJECTS_BULK(state, list) {
      state.projects.unshift(...list);
      saveLocal('ft_projects', state.projects);
    },
    UPDATE_PROJECT(state, updatedProject) {
      const index = state.projects.findIndex(p => p.id === updatedProject.id);
      if (index !== -1) {
        state.projects.splice(index, 1, updatedProject);
        saveLocal('ft_projects', state.projects);
      }
    },
    DELETE_PROJECT(state, id) {
      state.projects = state.projects.filter(p => p.id !== id);
      saveLocal('ft_projects', state.projects);
    },
    DELETE_PROJECTS_BULK(state, ids) {
      state.projects = state.projects.filter(p => !ids.includes(p.id));
      saveLocal('ft_projects', state.projects);
    },

    // Tasks
    ADD_TASK(state, task) {
      state.tasks.unshift(task);
      saveLocal('ft_tasks', state.tasks);
    },
    ADD_TASKS_BULK(state, list) {
      state.tasks.unshift(...list);
      saveLocal('ft_tasks', state.tasks);
    },
    UPDATE_TASK(state, updatedTask) {
      const index = state.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask);
        saveLocal('ft_tasks', state.tasks);
      }
    },
    TOGGLE_TASK(state, id) {
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        task.done = !task.done;
        if (task.done) {
          task.statusColumn = 'done';
        } else {
          task.statusColumn = 'todo';
        }
        saveLocal('ft_tasks', state.tasks);
      }
    },
    UPDATE_TASK_STATUS(state, { id, statusColumn }) {
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        task.statusColumn = statusColumn;
        task.done = (statusColumn === 'done');
        saveLocal('ft_tasks', state.tasks);
      }
    },
    DELETE_TASK(state, id) {
      state.tasks = state.tasks.filter(t => t.id !== id);
      saveLocal('ft_tasks', state.tasks);
    },
    DELETE_TASKS_BULK(state, ids) {
      state.tasks = state.tasks.filter(t => !ids.includes(t.id));
      saveLocal('ft_tasks', state.tasks);
    },

    // Transactions
    ADD_TRANSACTION(state, transaction) {
      state.transactions.unshift(transaction);
      saveLocal('ft_transactions', state.transactions);
    },
    ADD_TRANSACTIONS_BULK(state, list) {
      state.transactions.unshift(...list);
      saveLocal('ft_transactions', state.transactions);
    },
    UPDATE_TRANSACTION(state, updatedTx) {
      const index = state.transactions.findIndex(t => t.id === updatedTx.id);
      if (index !== -1) {
        state.transactions.splice(index, 1, updatedTx);
        saveLocal('ft_transactions', state.transactions);
      }
    },
    DELETE_TRANSACTION(state, id) {
      state.transactions = state.transactions.filter(t => t.id !== id);
      saveLocal('ft_transactions', state.transactions);
    },
    DELETE_TRANSACTIONS_BULK(state, ids) {
      state.transactions = state.transactions.filter(t => !ids.includes(t.id));
      saveLocal('ft_transactions', state.transactions);
    },

    // Invoices
    ADD_INVOICE(state, invoice) {
      state.invoices.unshift(invoice);
      saveLocal('ft_invoices', state.invoices);
    },
    UPDATE_INVOICE(state, updatedInv) {
      const index = state.invoices.findIndex(i => i.id === updatedInv.id);
      if (index !== -1) {
        state.invoices.splice(index, 1, updatedInv);
        saveLocal('ft_invoices', state.invoices);
      }
    },
    DELETE_INVOICE(state, id) {
      state.invoices = state.invoices.filter(i => i.id !== id);
      saveLocal('ft_invoices', state.invoices);
    },
    DELETE_INVOICES_BULK(state, ids) {
      state.invoices = state.invoices.filter(i => !ids.includes(i.id));
      saveLocal('ft_invoices', state.invoices);
    },

    // Habits
    ADD_HABIT(state, habit) {
      state.habits.unshift(habit);
      saveLocal('ft_habits', state.habits);
    },
    UPDATE_HABIT(state, updatedHabit) {
      const index = state.habits.findIndex(h => h.id === updatedHabit.id);
      if (index !== -1) {
        state.habits.splice(index, 1, updatedHabit);
        saveLocal('ft_habits', state.habits);
      }
    },
    TOGGLE_HABIT_DATE(state, { id, dateStr }) {
      const habit = state.habits.find(h => h.id === id);
      if (habit) {
        if (!habit.history) habit.history = {};
        habit.history[dateStr] = !habit.history[dateStr];
        saveLocal('ft_habits', state.habits);
      }
    },
    DELETE_HABIT(state, id) {
      state.habits = state.habits.filter(h => h.id !== id);
      saveLocal('ft_habits', state.habits);
    },

    // Notes
    ADD_NOTE(state, note) {
      state.notes.unshift(note);
      saveLocal('ft_notes', state.notes);
    },
    ADD_NOTES_BULK(state, notesArray) {
      state.notes = [...notesArray, ...state.notes];
      saveLocal('ft_notes', state.notes);
    },
    UPDATE_NOTE(state, updatedNote) {
      const index = state.notes.findIndex(n => n.id === updatedNote.id);
      if (index !== -1) {
        state.notes.splice(index, 1, updatedNote);
        saveLocal('ft_notes', state.notes);
      }
    },
    DELETE_NOTE(state, id) {
      state.notes = state.notes.filter(n => n.id !== id);
      saveLocal('ft_notes', state.notes);
    },
    DELETE_NOTES_BULK(state, ids) {
      state.notes = state.notes.filter(n => !ids.includes(n.id));
      saveLocal('ft_notes', state.notes);
    },

    // Diaries & Journal Stories
    ADD_DIARY(state, diary) {
      state.diaries.unshift(diary);
      saveLocal('ft_diaries', state.diaries);
    },
    ADD_DIARIES_BULK(state, diariesArray) {
      state.diaries = [...diariesArray, ...state.diaries];
      saveLocal('ft_diaries', state.diaries);
    },
    UPDATE_DIARY(state, updatedDiary) {
      const index = state.diaries.findIndex(d => d.id === updatedDiary.id);
      if (index !== -1) {
        state.diaries.splice(index, 1, updatedDiary);
        saveLocal('ft_diaries', state.diaries);
      }
    },
    DELETE_DIARY(state, id) {
      state.diaries = state.diaries.filter(d => d.id !== id);
      saveLocal('ft_diaries', state.diaries);
    },
    DELETE_DIARIES_BULK(state, ids) {
      state.diaries = state.diaries.filter(d => !ids.includes(d.id));
      saveLocal('ft_diaries', state.diaries);
    },
    TOGGLE_DIARY_PIN(state, id) {
      const diary = state.diaries.find(d => d.id === id);
      if (diary) {
        diary.isPinned = !diary.isPinned;
        saveLocal('ft_diaries', state.diaries);
      }
    },
    TOGGLE_DIARY_FAVORITE(state, id) {
      const diary = state.diaries.find(d => d.id === id);
      if (diary) {
        diary.isFavorite = !diary.isFavorite;
        saveLocal('ft_diaries', state.diaries);
      }
    },

    // Calendar Events
    ADD_EVENT(state, eventItem) {
      state.events.unshift(eventItem);
      saveLocal('ft_events', state.events);
    },
    UPDATE_EVENT(state, updatedEv) {
      const index = state.events.findIndex(e => e.id === updatedEv.id);
      if (index !== -1) {
        state.events.splice(index, 1, updatedEv);
        saveLocal('ft_events', state.events);
      }
    },
    DELETE_EVENT(state, id) {
      state.events = state.events.filter(e => e.id !== id);
      saveLocal('ft_events', state.events);
    },

    // Settings & Budget
    SET_BUDGET_THRESHOLD(state, amount) {
      state.budgetThreshold = Number(amount) || 0;
      saveLocal('ft_budgetThreshold', state.budgetThreshold);
    },

    // Mood Tracker & Alarms
    ADD_MOOD_LOG(state, log) {
      state.moodLogs.unshift(log);
      saveLocal('ft_moodLogs', state.moodLogs);
    },
    DELETE_MOOD_LOG(state, id) {
      state.moodLogs = state.moodLogs.filter(m => m.id !== id);
      saveLocal('ft_moodLogs', state.moodLogs);
    },
    CLEAR_MOOD_LOGS(state) {
      state.moodLogs = [];
      saveLocal('ft_moodLogs', []);
    },

    ADD_WORK_ALARM(state, alarm) {
      state.workAlarms.push(alarm);
      saveLocal('ft_workAlarms', state.workAlarms);
    },
    UPDATE_WORK_ALARM(state, updated) {
      const idx = state.workAlarms.findIndex(a => a.id === updated.id);
      if (idx !== -1) {
        state.workAlarms[idx] = { ...updated };
        saveLocal('ft_workAlarms', state.workAlarms);
      }
    },
    TOGGLE_WORK_ALARM(state, id) {
      const alarm = state.workAlarms.find(a => a.id === id);
      if (alarm) {
        alarm.active = !alarm.active;
        saveLocal('ft_workAlarms', state.workAlarms);
      }
    },
    DELETE_WORK_ALARM(state, id) {
      state.workAlarms = state.workAlarms.filter(a => a.id !== id);
      saveLocal('ft_workAlarms', state.workAlarms);
    },

    // AI Configuration
    UPDATE_AI_CONFIG(state, payload) {
      if (payload.geminiApiKey !== undefined) {
        state.geminiApiKey = payload.geminiApiKey;
        saveLocal('ft_geminiApiKey', state.geminiApiKey);
      }
      if (payload.aiProvider !== undefined) {
        state.aiProvider = payload.aiProvider;
        saveLocal('ft_aiProvider', state.aiProvider);
      }
      if (payload.aiModel !== undefined) {
        state.aiModel = payload.aiModel;
        saveLocal('ft_aiModel', state.aiModel);
      }
    },

    // My Business
    UPDATE_MY_BUSINESS(state, info) {
      state.myBusiness = { ...state.myBusiness, ...info };
      saveLocal('ft_myBusiness', state.myBusiness);
    },

    UPDATE_WELCOME_BANNER(state, banner) {
      state.welcomeBanner = { ...state.welcomeBanner, ...banner };
      saveLocal('ft_welcomeBanner', state.welcomeBanner);
    },

    UPDATE_USER_PROFILE(state, profile) {
      state.userProfile = { ...state.userProfile, ...profile };
      saveLocal('ft_userProfile', state.userProfile);
    },

    SAVE_CV_DATA(state, cvData) {
      state.cvData = { ...state.cvData, ...cvData };
      saveLocal('ft_cvData', state.cvData);
    },

    SAVE_BULK_CV_LIST(state, list) {
      state.bulkCvList = [...list];
      saveLocal('ft_bulkCvList', state.bulkCvList);
    },

    ADD_CODE_NOTE(state, note) {
      state.codeNotes.unshift(note);
      saveLocal('ft_codeNotes', state.codeNotes);
    },
    UPDATE_CODE_NOTE(state, updatedNote) {
      const idx = state.codeNotes.findIndex(c => c.id === updatedNote.id);
      if (idx !== -1) {
        state.codeNotes.splice(idx, 1, updatedNote);
        saveLocal('ft_codeNotes', state.codeNotes);
      }
    },
    DELETE_CODE_NOTE(state, id) {
      state.codeNotes = state.codeNotes.filter(c => c.id !== id);
      saveLocal('ft_codeNotes', state.codeNotes);
    },

    ADD_SURAT(state, surat) {
      state.suratList.unshift(surat);
      saveLocal('ft_suratList', state.suratList);
    },
    DELETE_SURAT(state, id) {
      state.suratList = state.suratList.filter(s => s.id !== id);
      saveLocal('ft_suratList', state.suratList);
    },

    ADD_SELFIE(state, selfie) {
      state.selfieGallery.unshift(selfie);
      saveLocal('ft_selfieGallery', state.selfieGallery);
    },
    DELETE_SELFIE(state, id) {
      state.selfieGallery = state.selfieGallery.filter(s => s.id !== id);
      saveLocal('ft_selfieGallery', state.selfieGallery);
    },

    // RAB Mutations
    ADD_RAB_ITEM(state, item) {
      if (!state.rabItems) state.rabItems = [];
      const qty = Number(item.qty) || 1;
      const harga_satuan = Number(item.harga_satuan) || 0;
      const total = qty * harga_satuan;
      const newItem = {
        ...item,
        qty,
        harga_satuan,
        total,
        created_at: item.created_at || new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      };
      state.rabItems.unshift(newItem);
      saveLocal('ft_rabItems', state.rabItems);
    },
    UPDATE_RAB_ITEM(state, updated) {
      const idx = state.rabItems.findIndex(i => i.id === updated.id);
      if (idx !== -1) {
        const qty = Number(updated.qty) || 1;
        const harga_satuan = Number(updated.harga_satuan) || 0;
        const total = qty * harga_satuan;
        state.rabItems.splice(idx, 1, {
          ...updated,
          qty,
          harga_satuan,
          total,
          updated_at: new Date().toISOString().split('T')[0]
        });
        saveLocal('ft_rabItems', state.rabItems);
      }
    },
    DELETE_RAB_ITEM(state, id) {
      state.rabItems = state.rabItems.filter(i => i.id !== id);
      // Also dissociate or adjust linked expenses
      if (state.rabExpenses) {
        state.rabExpenses.forEach(exp => {
          if (exp.rab_item_id === id) exp.rab_item_id = null;
        });
        saveLocal('ft_rabExpenses', state.rabExpenses);
      }
      saveLocal('ft_rabItems', state.rabItems);
    },

    ADD_RAB_INCOME(state, income) {
      if (!state.rabIncomes) state.rabIncomes = [];
      const newIncome = {
        ...income,
        nominal: Number(income.nominal) || 0,
        created_at: income.created_at || new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      };
      state.rabIncomes.unshift(newIncome);
      saveLocal('ft_rabIncomes', state.rabIncomes);
    },
    UPDATE_RAB_INCOME(state, updated) {
      const idx = state.rabIncomes.findIndex(i => i.id === updated.id);
      if (idx !== -1) {
        state.rabIncomes.splice(idx, 1, {
          ...updated,
          nominal: Number(updated.nominal) || 0,
          updated_at: new Date().toISOString().split('T')[0]
        });
        saveLocal('ft_rabIncomes', state.rabIncomes);
      }
    },
    DELETE_RAB_INCOME(state, id) {
      state.rabIncomes = state.rabIncomes.filter(i => i.id !== id);
      saveLocal('ft_rabIncomes', state.rabIncomes);
    },

    ADD_RAB_EXPENSE(state, expense) {
      if (!state.rabExpenses) state.rabExpenses = [];
      const qty = Number(expense.qty) || 1;
      const harga_satuan = Number(expense.harga_satuan) || 0;
      const total = qty * harga_satuan;
      const newExpense = {
        ...expense,
        qty,
        harga_satuan,
        total,
        created_at: expense.created_at || new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      };
      state.rabExpenses.unshift(newExpense);
      saveLocal('ft_rabExpenses', state.rabExpenses);
    },
    UPDATE_RAB_EXPENSE(state, updated) {
      const idx = state.rabExpenses.findIndex(e => e.id === updated.id);
      if (idx !== -1) {
        const qty = Number(updated.qty) || 1;
        const harga_satuan = Number(updated.harga_satuan) || 0;
        const total = qty * harga_satuan;
        state.rabExpenses.splice(idx, 1, {
          ...updated,
          qty,
          harga_satuan,
          total,
          updated_at: new Date().toISOString().split('T')[0]
        });
        saveLocal('ft_rabExpenses', state.rabExpenses);
      }
    },
    DELETE_RAB_EXPENSE(state, id) {
      state.rabExpenses = state.rabExpenses.filter(e => e.id !== id);
      saveLocal('ft_rabExpenses', state.rabExpenses);
    },

    RESET_RAB_DATA(state) {
      state.rabItems = [];
      state.rabIncomes = [];
      state.rabExpenses = [];
      saveLocal('ft_rabItems', []);
      saveLocal('ft_rabIncomes', []);
      saveLocal('ft_rabExpenses', []);
    },

    LOAD_SAMPLE_RAB_DATA(state) {
      state.rabItems = [...SAMPLE_RAB_ITEMS];
      state.rabIncomes = [...SAMPLE_RAB_INCOMES];
      state.rabExpenses = [...SAMPLE_RAB_EXPENSES];
      saveLocal('ft_rabItems', state.rabItems);
      saveLocal('ft_rabIncomes', state.rabIncomes);
      saveLocal('ft_rabExpenses', state.rabExpenses);
    },

    // Global Reset & Import/Export
    CLEAR_ALL_DATA(state) {
      state.contacts = [];
      state.projects = [];
      state.tasks = [];
      state.transactions = [];
      state.invoices = [];
      state.habits = [];
      state.notes = [];
      state.diaries = [];
      state.events = [];
      state.rabItems = [];
      state.rabIncomes = [];
      state.rabExpenses = [];
      state.codeNotes = [];
      state.suratList = [];
      state.selfieGallery = [];
      state.moodLogs = [];

      saveLocal('ft_contacts', []);
      saveLocal('ft_projects', []);
      saveLocal('ft_tasks', []);
      saveLocal('ft_transactions', []);
      saveLocal('ft_invoices', []);
      saveLocal('ft_habits', []);
      saveLocal('ft_notes', []);
      saveLocal('ft_diaries', []);
      saveLocal('ft_events', []);
      saveLocal('ft_rabItems', []);
      saveLocal('ft_rabIncomes', []);
      saveLocal('ft_rabExpenses', []);
      saveLocal('ft_codeNotes', []);
      saveLocal('ft_suratList', []);
      saveLocal('ft_selfieGallery', []);
      saveLocal('ft_moodLogs', []);
    },

    LOAD_SAMPLE_DATA(state) {
      state.contacts = [...SAMPLE_CONTACTS];
      state.projects = [...SAMPLE_PROJECTS];
      state.tasks = [...SAMPLE_TASKS];
      state.transactions = [...SAMPLE_TRANSACTIONS];
      state.habits = [...SAMPLE_HABITS];
      state.notes = [...SAMPLE_NOTES];
      state.diaries = [...SAMPLE_DIARIES];
      state.events = [...DEFAULT_EVENTS];
      state.rabItems = [...SAMPLE_RAB_ITEMS];
      state.rabIncomes = [...SAMPLE_RAB_INCOMES];
      state.rabExpenses = [...SAMPLE_RAB_EXPENSES];

      saveLocal('ft_contacts', state.contacts);
      saveLocal('ft_projects', state.projects);
      saveLocal('ft_tasks', state.tasks);
      saveLocal('ft_transactions', state.transactions);
      saveLocal('ft_habits', state.habits);
      saveLocal('ft_notes', state.notes);
      saveLocal('ft_diaries', state.diaries);
      saveLocal('ft_events', state.events);
      saveLocal('ft_rabItems', state.rabItems);
      saveLocal('ft_rabIncomes', state.rabIncomes);
      saveLocal('ft_rabExpenses', state.rabExpenses);
    },

    IMPORT_FULL_DATA(state, data) {
      if (!data || typeof data !== 'object') return;

      // 1. RAB Items & Kas (Crucial: Normalize aliases and preserve if not provided)
      const incomingRab = data.rabItems || data.rab || data.rabs || data.rab_items || data.daftar_rab;
      if (Array.isArray(incomingRab)) {
        state.rabItems = incomingRab;
        saveLocal('ft_rabItems', state.rabItems);
      }

      const incomingRabIncomes = data.rabIncomes || data.incomes || data.rab_incomes || data.penerimaan;
      if (Array.isArray(incomingRabIncomes)) {
        state.rabIncomes = incomingRabIncomes;
        saveLocal('ft_rabIncomes', state.rabIncomes);
      }

      const incomingRabExpenses = data.rabExpenses || data.expenses || data.rab_expenses || data.pengeluaran;
      if (Array.isArray(incomingRabExpenses)) {
        state.rabExpenses = incomingRabExpenses;
        saveLocal('ft_rabExpenses', state.rabExpenses);
      }

      // 2. Contacts
      const incomingContacts = data.contacts || data.klien || data.contactList;
      if (Array.isArray(incomingContacts)) {
        state.contacts = incomingContacts;
        saveLocal('ft_contacts', state.contacts);
      }

      // 3. Projects
      const incomingProjects = data.projects || data.proyek || data.projectList;
      if (Array.isArray(incomingProjects)) {
        state.projects = incomingProjects;
        saveLocal('ft_projects', state.projects);
      }

      // 4. Tasks (Supports tasks, todos, daftar_tugas)
      const incomingTasks = data.tasks || data.todos || data.daftar_tugas || data.taskList;
      if (Array.isArray(incomingTasks)) {
        state.tasks = incomingTasks;
        saveLocal('ft_tasks', state.tasks);
      }

      // 5. Transactions (Supports transactions, finances, keuangan)
      const incomingTransactions = data.transactions || data.finances || data.keuangan || data.transactionList;
      if (Array.isArray(incomingTransactions)) {
        state.transactions = incomingTransactions;
        saveLocal('ft_transactions', state.transactions);
      }

      // 6. Invoices
      const incomingInvoices = data.invoices || data.faktur || data.invoiceList;
      if (Array.isArray(incomingInvoices)) {
        state.invoices = incomingInvoices;
        saveLocal('ft_invoices', state.invoices);
      }

      // 7. Habits
      const incomingHabits = data.habits || data.kebiasaan;
      if (Array.isArray(incomingHabits)) {
        state.habits = incomingHabits;
        saveLocal('ft_habits', state.habits);
      }

      // 8. Notes
      const incomingNotes = data.notes || data.catatan;
      if (Array.isArray(incomingNotes)) {
        state.notes = incomingNotes;
        saveLocal('ft_notes', state.notes);
      }

      // 8.1 Diaries & Jurnal
      const incomingDiaries = data.diaries || data.jurnal || data.diaryList || data.cerita;
      if (Array.isArray(incomingDiaries)) {
        state.diaries = incomingDiaries;
        saveLocal('ft_diaries', state.diaries);
      }

      // 9. Events
      const incomingEvents = data.events || data.agenda;
      if (Array.isArray(incomingEvents)) {
        state.events = incomingEvents;
        saveLocal('ft_events', state.events);
      }

      // 10. Code Notes
      const incomingCodeNotes = data.codeNotes || data.snippets;
      if (Array.isArray(incomingCodeNotes)) {
        state.codeNotes = incomingCodeNotes;
        saveLocal('ft_codeNotes', state.codeNotes);
      }

      // 11. Surat
      const incomingSurat = data.suratList || data.surat || data.letters;
      if (Array.isArray(incomingSurat)) {
        state.suratList = incomingSurat;
        saveLocal('ft_suratList', state.suratList);
      }

      // 12. CV Data
      const incomingCv = data.cvData || data.cv || data.resume;
      if (incomingCv && typeof incomingCv === 'object' && !Array.isArray(incomingCv)) {
        state.cvData = { ...state.cvData, ...incomingCv };
        saveLocal('ft_cvData', state.cvData);
      }

      // 13. User Profile
      const incomingProfile = data.userProfile || data.profile;
      if (incomingProfile && typeof incomingProfile === 'object' && !Array.isArray(incomingProfile)) {
        state.userProfile = { ...state.userProfile, ...incomingProfile };
        saveLocal('ft_userProfile', state.userProfile);
      }

      // 14. Business Profile
      const incomingBiz = data.myBusiness || data.businessProfile;
      if (incomingBiz && typeof incomingBiz === 'object' && !Array.isArray(incomingBiz)) {
        state.myBusiness = { ...state.myBusiness, ...incomingBiz };
        saveLocal('ft_myBusiness', state.myBusiness);
      }

      // 15. Mood Logs & Alarms
      const incomingMoods = data.moodLogs || data.moods;
      if (Array.isArray(incomingMoods)) {
        state.moodLogs = incomingMoods;
        saveLocal('ft_moodLogs', state.moodLogs);
      }

      const incomingAlarms = data.workAlarms || data.alarms;
      if (Array.isArray(incomingAlarms)) {
        state.workAlarms = incomingAlarms;
        saveLocal('ft_workAlarms', state.workAlarms);
      }

      // 16. Selfies
      const incomingSelfies = data.selfieGallery || data.selfies;
      if (Array.isArray(incomingSelfies)) {
        state.selfieGallery = incomingSelfies;
        saveLocal('ft_selfieGallery', state.selfieGallery);
      }

      // 17. LocalStorage-based features: Videos & Custom Folders
      const incomingVideos = data.videos || data.videoList || data.rk_video_hub_videos;
      if (Array.isArray(incomingVideos)) {
        try {
          localStorage.setItem('ft_saved_video_hub_list', JSON.stringify(incomingVideos));
          localStorage.setItem('rk_video_hub_videos', JSON.stringify(incomingVideos));
        } catch (e) {
          console.error(e);
        }
      }

      const incomingFolders = data.customFolders || data.projectFolders;
      if (Array.isArray(incomingFolders)) {
        try {
          localStorage.setItem('ft_custom_folders', JSON.stringify(incomingFolders));
        } catch (e) {
          console.error(e);
        }
      }

      // 18. Settings & Preferences
      if (data.themeMode) {
        state.themeMode = data.themeMode;
        saveLocal('ft_themeMode', state.themeMode);
      }
      if (data.accentColor) {
        state.accentColor = data.accentColor;
        saveLocal('ft_accentColor', state.accentColor);
      }
      if (data.budgetThreshold !== undefined) {
        state.budgetThreshold = data.budgetThreshold;
        saveLocal('ft_budgetThreshold', state.budgetThreshold);
      }
      if (data.welcomeBanner) {
        state.welcomeBanner = data.welcomeBanner;
        saveLocal('ft_welcomeBanner', state.welcomeBanner);
      }
      if (data.geminiApiKey !== undefined) {
        state.geminiApiKey = data.geminiApiKey;
        saveLocal('ft_geminiApiKey', state.geminiApiKey);
      }
      if (data.aiProvider) {
        state.aiProvider = data.aiProvider;
        saveLocal('ft_aiProvider', state.aiProvider);
      }
      if (data.aiModel) {
        state.aiModel = data.aiModel;
        saveLocal('ft_aiModel', state.aiModel);
      }
    },

    SET_RAB_DATA(state, { items, incomes, expenses, merge = false }) {
      if (merge) {
        if (Array.isArray(items)) {
          const existingIds = new Set(state.rabItems.map(i => i.id));
          const newItems = items.filter(i => !existingIds.has(i.id));
          state.rabItems = [...state.rabItems, ...newItems];
        }
        if (Array.isArray(incomes)) {
          const existingIds = new Set(state.rabIncomes.map(i => i.id));
          const newIncomes = incomes.filter(i => !existingIds.has(i.id));
          state.rabIncomes = [...state.rabIncomes, ...newIncomes];
        }
        if (Array.isArray(expenses)) {
          const existingIds = new Set(state.rabExpenses.map(i => i.id));
          const newExpenses = expenses.filter(i => !existingIds.has(i.id));
          state.rabExpenses = [...state.rabExpenses, ...newExpenses];
        }
      } else {
        if (Array.isArray(items)) state.rabItems = items;
        if (Array.isArray(incomes)) state.rabIncomes = incomes;
        if (Array.isArray(expenses)) state.rabExpenses = expenses;
      }
      saveLocal('ft_rabItems', state.rabItems);
      saveLocal('ft_rabIncomes', state.rabIncomes);
      saveLocal('ft_rabExpenses', state.rabExpenses);
    },

    SET_INVOICES_DATA(state, { list, merge = false }) {
      if (merge) {
        const existingIds = new Set(state.invoices.map(i => i.id));
        const newItems = list.filter(i => !existingIds.has(i.id));
        state.invoices = [...state.invoices, ...newItems];
      } else {
        state.invoices = list;
      }
      saveLocal('ft_invoices', state.invoices);
    },

    SET_TASKS_DATA(state, { list, merge = false }) {
      if (merge) {
        const existingIds = new Set(state.tasks.map(i => i.id));
        const newItems = list.filter(i => !existingIds.has(i.id));
        state.tasks = [...state.tasks, ...newItems];
      } else {
        state.tasks = list;
      }
      saveLocal('ft_tasks', state.tasks);
    },

    SET_PROJECTS_DATA(state, { list, merge = false }) {
      if (merge) {
        const existingIds = new Set(state.projects.map(p => p.id));
        const newItems = list.filter(p => !existingIds.has(p.id));
        state.projects = [...state.projects, ...newItems];
      } else {
        state.projects = list;
      }
      saveLocal('ft_projects', state.projects);
    },

    SET_TRANSACTIONS_DATA(state, { list, merge = false }) {
      if (merge) {
        const existingIds = new Set(state.transactions.map(t => t.id));
        const newItems = list.filter(t => !existingIds.has(t.id));
        state.transactions = [...state.transactions, ...newItems];
      } else {
        state.transactions = list;
      }
      saveLocal('ft_transactions', state.transactions);
    },

    SET_CONTACTS_DATA(state, { list, merge = false }) {
      if (merge) {
        const existingIds = new Set(state.contacts.map(c => c.id));
        const newItems = list.filter(c => !existingIds.has(c.id));
        state.contacts = [...state.contacts, ...newItems];
      } else {
        state.contacts = list;
      }
      saveLocal('ft_contacts', state.contacts);
    },

    SET_NOTES_DATA(state, { list, merge = false }) {
      if (merge) {
        const existingIds = new Set(state.notes.map(n => n.id));
        const newItems = list.filter(n => !existingIds.has(n.id));
        state.notes = [...state.notes, ...newItems];
      } else {
        state.notes = list;
      }
      saveLocal('ft_notes', state.notes);
    },

    SET_CODE_NOTES_DATA(state, { list, merge = false }) {
      if (merge) {
        const existingIds = new Set(state.codeNotes.map(n => n.id));
        const newItems = list.filter(n => !existingIds.has(n.id));
        state.codeNotes = [...state.codeNotes, ...newItems];
      } else {
        state.codeNotes = list;
      }
      saveLocal('ft_codeNotes', state.codeNotes);
    },

    SET_SURAT_LIST(state, { list, merge = false }) {
      if (merge) {
        const existingIds = new Set(state.suratList.map(s => s.id));
        const newItems = list.filter(s => !existingIds.has(s.id));
        state.suratList = [...state.suratList, ...newItems];
      } else {
        state.suratList = list;
      }
      saveLocal('ft_suratList', state.suratList);
    }
  },
  actions: {
    setThemeMode({ commit }, mode) {
      commit('SET_THEME_MODE', mode);
    },
    setAccentColor({ commit }, color) {
      commit('SET_ACCENT_COLOR', color);
    },

    addContact({ commit }, contact) {
      commit('ADD_CONTACT', { ...contact, id: 'c_' + Date.now() + Math.random().toString(36).substr(2, 4) });
    },
    addContactsBulk({ commit }, list) {
      const formatted = list.map((c, i) => ({ ...c, id: 'c_' + (Date.now() + i) + Math.random().toString(36).substr(2, 4) }));
      commit('ADD_CONTACTS_BULK', formatted);
    },
    updateContact({ commit }, contact) {
      commit('UPDATE_CONTACT', contact);
    },
    deleteContact({ commit }, id) {
      commit('DELETE_CONTACT', id);
    },
    deleteContactsBulk({ commit }, ids) {
      commit('DELETE_CONTACTS_BULK', ids);
    },

    addProject({ commit }, project) {
      commit('ADD_PROJECT', { ...project, id: 'p_' + Date.now() + Math.random().toString(36).substr(2, 4) });
    },
    addProjectsBulk({ commit }, list) {
      const formatted = list.map((p, i) => ({ ...p, id: 'p_' + (Date.now() + i) + Math.random().toString(36).substr(2, 4) }));
      commit('ADD_PROJECTS_BULK', formatted);
    },
    updateProject({ commit }, project) {
      commit('UPDATE_PROJECT', project);
    },
    deleteProject({ commit }, id) {
      commit('DELETE_PROJECT', id);
    },
    deleteProjectsBulk({ commit }, ids) {
      commit('DELETE_PROJECTS_BULK', ids);
    },

    addTask({ commit }, task) {
      commit('ADD_TASK', {
        recurring: 'none',
        statusColumn: 'todo',
        eisenhower: 'do_first',
        ...task,
        id: 't_' + Date.now() + Math.random().toString(36).substr(2, 4)
      });
    },
    addTasksBulk({ commit }, list) {
      const formatted = list.map((t, i) => ({
        recurring: 'none',
        statusColumn: 'todo',
        eisenhower: 'do_first',
        level: 'Menengah',
        projectTag: 'Umum',
        deadline: new Date().toISOString().split('T')[0],
        done: false,
        ...t,
        id: 't_' + (Date.now() + i) + Math.random().toString(36).substr(2, 4)
      }));
      commit('ADD_TASKS_BULK', formatted);
    },
    updateTask({ commit }, task) {
      commit('UPDATE_TASK', task);
    },
    toggleTask({ commit }, id) {
      commit('TOGGLE_TASK', id);
    },
    updateTaskStatus({ commit }, payload) {
      commit('UPDATE_TASK_STATUS', payload);
    },
    deleteTask({ commit }, id) {
      commit('DELETE_TASK', id);
    },
    deleteTasksBulk({ commit }, ids) {
      commit('DELETE_TASKS_BULK', ids);
    },

    addTransaction({ commit }, transaction) {
      commit('ADD_TRANSACTION', { ...transaction, id: 'tr_' + Date.now() + Math.random().toString(36).substr(2, 4) });
    },
    addTransactionsBulk({ commit }, list) {
      const formatted = list.map((tr, i) => ({ ...tr, id: 'tr_' + (Date.now() + i) + Math.random().toString(36).substr(2, 4) }));
      commit('ADD_TRANSACTIONS_BULK', formatted);
    },
    updateTransaction({ commit }, transaction) {
      commit('UPDATE_TRANSACTION', transaction);
    },
    deleteTransaction({ commit }, id) {
      commit('DELETE_TRANSACTION', id);
    },
    deleteTransactionsBulk({ commit }, ids) {
      commit('DELETE_TRANSACTIONS_BULK', ids);
    },

    addInvoice({ commit }, invoice) {
      commit('ADD_INVOICE', { ...invoice, id: 'inv_' + Date.now() });
    },
    updateInvoice({ commit }, invoice) {
      commit('UPDATE_INVOICE', invoice);
    },
    deleteInvoice({ commit }, id) {
      commit('DELETE_INVOICE', id);
    },
    deleteInvoicesBulk({ commit }, ids) {
      commit('DELETE_INVOICES_BULK', ids);
    },

    addHabit({ commit }, habit) {
      commit('ADD_HABIT', { ...habit, id: 'h_' + Date.now(), history: {} });
    },
    updateHabit({ commit }, habit) {
      commit('UPDATE_HABIT', habit);
    },
    toggleHabitDate({ commit }, payload) {
      commit('TOGGLE_HABIT_DATE', payload);
    },
    deleteHabit({ commit }, id) {
      commit('DELETE_HABIT', id);
    },

    addNote({ commit }, note) {
      commit('ADD_NOTE', { ...note, id: 'n_' + Date.now(), updatedAt: new Date().toISOString() });
    },
    addNotesBulk({ commit }, notesArray) {
      const formatted = notesArray.map((note, index) => ({
        ...note,
        id: 'n_' + (Date.now() + index),
        updatedAt: new Date().toISOString()
      }));
      commit('ADD_NOTES_BULK', formatted);
    },
    updateNote({ commit }, note) {
      commit('UPDATE_NOTE', { ...note, updatedAt: new Date().toISOString() });
    },
    deleteNote({ commit }, id) {
      commit('DELETE_NOTE', id);
    },
    deleteNotesBulk({ commit }, ids) {
      commit('DELETE_NOTES_BULK', ids);
    },

    addEvent({ commit }, eventItem) {
      commit('ADD_EVENT', { ...eventItem, id: 'ev_' + Date.now() });
    },
    updateEvent({ commit }, eventItem) {
      commit('UPDATE_EVENT', eventItem);
    },
    deleteEvent({ commit }, id) {
      commit('DELETE_EVENT', id);
    },

    setThemeMode({ commit }, mode) {
      commit('SET_THEME_MODE', mode);
    },

    setBudgetThreshold({ commit }, amount) {
      commit('SET_BUDGET_THRESHOLD', amount);
    },

    updateMyBusiness({ commit }, info) {
      commit('UPDATE_MY_BUSINESS', info);
    },

    updateUserProfile({ commit }, profile) {
      commit('UPDATE_USER_PROFILE', profile);
    },

    saveCvData({ commit }, cvData) {
      commit('SAVE_CV_DATA', cvData);
    },

    saveBulkCvList({ commit }, list) {
      commit('SAVE_BULK_CV_LIST', list);
    },

    addCodeNote({ commit }, note) {
      commit('ADD_CODE_NOTE', { ...note, id: 'cn_' + Date.now(), createdAt: new Date().toISOString() });
    },
    updateCodeNote({ commit }, note) {
      commit('UPDATE_CODE_NOTE', note);
    },
    deleteCodeNote({ commit }, id) {
      commit('DELETE_CODE_NOTE', id);
    },

    addSurat({ commit }, surat) {
      commit('ADD_SURAT', { ...surat, id: 'srt_' + Date.now(), createdAt: new Date().toISOString() });
    },
    deleteSurat({ commit }, id) {
      commit('DELETE_SURAT', id);
    },

    addSelfie({ commit }, selfie) {
      commit('ADD_SELFIE', { ...selfie, id: 'slf_' + Date.now(), timestamp: new Date().toISOString() });
    },
    deleteSelfie({ commit }, id) {
      commit('DELETE_SELFIE', id);
    },

    // RAB Actions
    addRabItem({ commit }, item) {
      commit('ADD_RAB_ITEM', { ...item, id: 'rab_' + Date.now() + Math.random().toString(36).substring(2, 5) });
    },
    updateRabItem({ commit }, item) {
      commit('UPDATE_RAB_ITEM', item);
    },
    deleteRabItem({ commit }, id) {
      commit('DELETE_RAB_ITEM', id);
    },

    addRabIncome({ commit }, income) {
      commit('ADD_RAB_INCOME', { ...income, id: 'inc_' + Date.now() + Math.random().toString(36).substring(2, 5) });
    },
    updateRabIncome({ commit }, income) {
      commit('UPDATE_RAB_INCOME', income);
    },
    deleteRabIncome({ commit }, id) {
      commit('DELETE_RAB_INCOME', id);
    },

    addRabExpense({ commit }, expense) {
      commit('ADD_RAB_EXPENSE', { ...expense, id: 'exp_' + Date.now() + Math.random().toString(36).substring(2, 5) });
    },
    updateRabExpense({ commit }, expense) {
      commit('UPDATE_RAB_EXPENSE', expense);
    },
    deleteRabExpense({ commit }, id) {
      commit('DELETE_RAB_EXPENSE', id);
    },

    resetRabData({ commit }) {
      commit('RESET_RAB_DATA');
    },
    loadSampleRabData({ commit }) {
      commit('LOAD_SAMPLE_RAB_DATA');
    },

    clearAllData({ commit }) {
      commit('CLEAR_ALL_DATA');
    },

    loadSampleData({ commit }) {
      commit('LOAD_SAMPLE_DATA');
    },

    importFullData({ commit }, data) {
      commit('IMPORT_FULL_DATA', data);
    },

    importRabData({ commit }, payload) {
      // payload can be { items, incomes, expenses, merge } or { rabItems, rabIncomes, rabExpenses }
      const items = payload.items || payload.rabItems || payload.rab || [];
      const incomes = payload.incomes || payload.rabIncomes || [];
      const expenses = payload.expenses || payload.rabExpenses || [];
      const merge = !!payload.merge;
      commit('SET_RAB_DATA', { items, incomes, expenses, merge });
    },

    importInvoicesData({ commit }, { list, merge = false }) {
      commit('SET_INVOICES_DATA', { list, merge });
    },

    importTasksData({ commit }, { list, merge = false }) {
      commit('SET_TASKS_DATA', { list, merge });
    },

    importProjectsData({ commit }, { list, merge = false }) {
      commit('SET_PROJECTS_DATA', { list, merge });
    },

    importTransactionsData({ commit }, { list, merge = false }) {
      commit('SET_TRANSACTIONS_DATA', { list, merge });
    },

    importContactsData({ commit }, { list, merge = false }) {
      commit('SET_CONTACTS_DATA', { list, merge });
    },

    importNotesData({ commit }, { list, merge = false }) {
      commit('SET_NOTES_DATA', { list, merge });
    },

    importCodeNotesData({ commit }, { list, merge = false }) {
      commit('SET_CODE_NOTES_DATA', { list, merge });
    },

    importSuratData({ commit }, { list, merge = false }) {
      commit('SET_SURAT_LIST', { list, merge });
    }
  }
});
