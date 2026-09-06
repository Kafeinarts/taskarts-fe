/**
 * Workspace Modes Configuration
 * Classic Material Design 3 / Android 5.0 Lollipop inspired mode profiles
 */

export const WORKSPACE_MODES = [
  {
    id: 'simple',
    title: 'Mode Simple (Sederhana)',
    shortName: 'Simple',
    subtitle: 'Fokus ringan: To-Do List, Keuangan, Notes, & Kalender',
    description: 'Tampilan minimalis dan bersih tanpa distraksi. Hanya menampilkan aplikasi esensial harian agar bekerja lebih santai dan fokus.',
    icon: 'bi-check2-circle',
    badge: 'Santai & Bersih',
    badgeClass: 'badge-simple',
    materialColor: '#009688', // Material Teal 500
    materialDark: '#00796b',  // Material Teal 700
    materialAccent: '#80cbc4', // Material Teal 200
    materialLight: '#e0f2f1', // Material Teal 50
    category: 'basic',
    allowedRoutes: [
      '/',
      '/todo',
      '/tasks',
      '/pos',
      '/finance',
      '/notes',
      '/calendar',
      '/quick-capture',
      '/storage',
      '/preferences',
      '/faq'
    ],
    features: [
      'To-Do & Kanban OS',
      'Keuangan & Money Tracker',
      'Sticky Notes & Scratchpad',
      'Kalender & Agenda Kerja',
      'Quick Capture Cepat'
    ]
  },
  {
    id: 'professional',
    title: 'Mode Professional (Unlocked All)',
    shortName: 'Pro All',
    subtitle: 'Semua fitur, alat analitik, dan generator aktif total',
    description: 'Mode paripurna yang membuka seluruh 24+ modul workspace: analitik D3.js, AI Assistant, surat dinas, CV ATS, media player, RAB kas, SQL, dan Persona portfolio.',
    icon: 'bi-shield-check',
    badge: 'Unlocked 100%',
    badgeClass: 'badge-pro',
    materialColor: '#673ab7', // Material Deep Purple 500
    materialDark: '#512da8',  // Material Deep Purple 700
    materialAccent: '#b39ddb', // Material Deep Purple 200
    materialLight: '#ede7f6', // Material Deep Purple 50
    category: 'pro',
    allowedRoutes: null, // null means all routes unlocked
    features: [
      'Semua 24+ Modul Workspace',
      'D3.js Productivity Insights',
      'Live Chat AI Assistant',
      'Surat Resmi, CV Builder, & RAB Kas',
      'Upload Media & Persona Developer'
    ]
  },
  {
    id: 'sekretaris',
    title: 'Mode Sekretaris & Administrasi',
    shortName: 'Sekretaris',
    subtitle: 'Surat dinas, CV resume, agenda, kontak WhatsApp, & arsip',
    description: 'Dioptimalkan untuk pekerjaan administrasi kantor, sekretariat organisasi, pengarsipan berkas surat resmi, broadcast WA ke tim, dan pembuatan resume/CV.',
    icon: 'bi-file-earmark-richtext-fill',
    badge: 'Administrasi',
    badgeClass: 'badge-sekretaris',
    materialColor: '#0288d1', // Material Light Blue 700
    materialDark: '#01579b',  // Material Light Blue 900
    materialAccent: '#81d4fa', // Material Light Blue 200
    materialLight: '#e1f5fe', // Material Light Blue 50
    category: 'role',
    allowedRoutes: [
      '/',
      '/surat',
      '/cv',
      '/notes',
      '/diary',
      '/contacts',
      '/calendar',
      '/quick-capture',
      '/camera',
      '/storage',
      '/preferences',
      '/faq'
    ],
    features: [
      'Surat Generator Resmi (Kop, TTD, PDF)',
      'CV & Resume Builder ATS Clean',
      'Kontak Tim & Broadcast WhatsApp Massal',
      'Kamera Scan Dokumen Otomatis',
      'Kalender & Agenda Acara',
      'Diary & Jurnal Catatan Rapat'
    ]
  },
  {
    id: 'bendahara',
    title: 'Mode Bendahara & Finance',
    shortName: 'Bendahara',
    subtitle: 'RAB kegiatan, arus kas, invoice PDF, & audit data SQL',
    description: 'Khusus bendahara, akuntan proyek, dan pengelola kas. Fokus pada pencatatan pemasukan, pengeluaran, anggaran kegiatan (RAB), faktur invoice, dan ekspor SQL.',
    icon: 'bi-wallet2',
    badge: 'Keuangan & Kas',
    badgeClass: 'badge-bendahara',
    materialColor: '#2e7d32', // Material Green 800
    materialDark: '#1b5e20',  // Material Green 900
    materialAccent: '#a5d6a7', // Material Green 200
    materialLight: '#e8f5e9', // Material Green 50
    category: 'role',
    allowedRoutes: [
      '/',
      '/finance',
      '/rab',
      '/invoice',
      '/pos',
      '/sql',
      '/notes',
      '/calendar',
      '/productivity-insights',
      '/storage',
      '/preferences',
      '/faq'
    ],
    features: [
      'RAB & Kas Kegiatan Terpadu',
      'Keuangan & Money Tracker Harian',
      'Invoice Generator Berstandar Pajak',
      'SQL Data Export & Auditor Runner',
      'Productivity & Finance Insights (D3.js)'
    ]
  },
  {
    id: 'developer',
    title: 'Mode Developer & Tech',
    shortName: 'Developer',
    subtitle: 'Code snippets, Persona 3 battle portfolio, SQL, AI, & 3D simulator',
    description: 'Didesain untuk software engineer, programmer, dan tech enthusiast. Dilengkapi tampilan portofolio diagonal 3D battle anime Persona, snippets kode, dan SQL terminal.',
    icon: 'bi-code-slash',
    badge: 'Software Eng',
    badgeClass: 'badge-developer',
    materialColor: '#37474f', // Material Blue Grey 800
    materialDark: '#263238',  // Material Blue Grey 900
    materialAccent: '#90a4ae', // Material Blue Grey 200
    materialLight: '#eceff1', // Material Blue Grey 50
    category: 'role',
    allowedRoutes: [
      '/',
      '/code-notes',
      '/developer',
      '/sql',
      '/chat-ai',
      '/productivity-insights',
      '/games',
      '/videos',
      '/storage',
      '/preferences',
      '/faq'
    ],
    features: [
      'View Developer (Persona 3 Reload 3D Battle UI)',
      'Code Snippets & Tech Documentation',
      'SQL Data Runner & DDL/DML Manager',
      'Live Chat AI Assistant (Gemini & Multi-provider)',
      '3D Workspace Simulator & Games',
      'Upload Media & Audio/Video Player'
    ]
  },
  {
    id: 'kreatif',
    title: 'Mode Kreatif & Media Story',
    shortName: 'Kreatif',
    subtitle: 'Upload media, Medium story draft, selfie happiness, & mood camera',
    description: 'Cocok untuk content creator, penulis, dan desainer. Berfokus pada pemutar media musik/video, penulisan artikel Medium siap copas, serta tracker mood & selfie.',
    icon: 'bi-palette-fill',
    badge: 'Media & Cerita',
    badgeClass: 'badge-kreatif',
    materialColor: '#e91e63', // Material Pink 500
    materialDark: '#c2185b',  // Material Pink 700
    materialAccent: '#f48fb1', // Material Pink 200
    materialLight: '#fce4ec', // Material Pink 50
    category: 'role',
    allowedRoutes: [
      '/',
      '/videos',
      '/medium-draft',
      '/selfie',
      '/mood',
      '/diary',
      '/notes',
      '/custom-bingkai',
      '/storage',
      '/preferences',
      '/faq'
    ],
    features: [
      'Upload Media & Media Player Audio/Video',
      'Medium Draft & Story Builder Siap Copas',
      'Diary & Jurnal Cerita dengan Foto',
      'Selfie for Happiness Gallery',
      'Kamera Mood & Alarm Kerja Cerdas',
      'Bingkai Motivasi 3D Kustom'
    ]
  }
];

const STORAGE_KEY = 'ft_workspace_mode';

/**
 * Get active workspace mode ID from localStorage or fallback
 */
export function getActiveModeId() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && WORKSPACE_MODES.some(m => m.id === saved)) {
      return saved;
    }
  } catch (e) {
    console.warn('Error reading workspace mode:', e);
  }
  return 'professional'; // Default is professional mode so all features remain discoverable
}

/**
 * Save active workspace mode ID
 */
export function setActiveModeId(modeId) {
  try {
    if (WORKSPACE_MODES.some(m => m.id === modeId)) {
      localStorage.setItem(STORAGE_KEY, modeId);
      return true;
    }
  } catch (e) {
    console.warn('Error saving workspace mode:', e);
  }
  return false;
}

/**
 * Get full config for active or specific mode
 */
export function getModeConfig(modeId) {
  const targetId = modeId || getActiveModeId();
  return WORKSPACE_MODES.find(m => m.id === targetId) || WORKSPACE_MODES[1]; // fallback to professional
}

/**
 * Check if a route is allowed in the given mode
 */
export function isRouteAllowedInMode(routePath, modeId) {
  const normalized = routePath.split('?')[0].replace(/\/$/, '') || '/';
  if (normalized === '/' || normalized === '/modes' || normalized === '/workspace-modes') {
    return true;
  }

  const config = getModeConfig(modeId);
  if (!config || !config.allowedRoutes) return true; // All allowed

  return config.allowedRoutes.some(allowed => {
    const normAllowed = allowed.replace(/\/$/, '') || '/';
    return normalized === normAllowed || normalized.startsWith(normAllowed + '/');
  });
}

/**
 * Filter nav groups based on active mode
 */
export function filterNavGroupsByMode(navGroups, modeId) {
  const config = getModeConfig(modeId);
  if (!config || !config.allowedRoutes) return navGroups; // All unlocked

  return navGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => {
        const itemRoute = item.to.split('?')[0].replace(/\/$/, '') || '/';
        return config.allowedRoutes.some(allowed => {
          const normAllowed = allowed.replace(/\/$/, '') || '/';
          return itemRoute === normAllowed || itemRoute.startsWith(normAllowed + '/');
        });
      })
    }))
    .filter(group => group.items.length > 0);
}
