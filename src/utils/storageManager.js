/**
 * Storage Manager Utility for TaskArts
 * Monitors LocalStorage & Cache Memory capacity, calculates usage, and guards against quota overflow.
 * Storage limit extended to 5 GB (Cache Memory mode).
 */

export const MAX_STORAGE_QUOTA_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB (5,368,709,120 bytes) Cache Memory
export const WARNING_THRESHOLD_PERCENT = 85;
export const FULL_THRESHOLD_PERCENT = 98;

const FORCE_FULL_KEY = 'ft_storage_force_full_simulated';

// Friendly labels and categories for known keys
const KEY_METADATA = {
  // Notes & Scratchpad
  'ft_notes': { label: 'Catatan & Dokumen (Notes)', category: 'Catatan & Dokumen', icon: 'bi-journal-text' },
  'rk_quick_scratchpad': { label: 'Quick Scratchpad', category: 'Catatan & Dokumen', icon: 'bi-sticky-fill' },
  'ft_draft_note': { label: 'Draft Editor Catatan', category: 'Catatan & Dokumen', icon: 'bi-pencil-square' },
  'stickyNote': { label: 'Sticky Note Dashboard', category: 'Catatan & Dokumen', icon: 'bi-stickies' },
  'rajinkerja_diary_scratchpad': { label: 'Scratchpad Jurnal Harian', category: 'Catatan & Dokumen', icon: 'bi-book-half' },
  'ft_codeNotes': { label: 'Koleksi Code Snippets', category: 'Catatan & Dokumen', icon: 'bi-code-slash' },

  // Tasks & Projects
  'ft_tasks': { label: 'Daftar Tugas (Tasks & To-Do)', category: 'Tugas & Proyek', icon: 'bi-check2-square' },
  'ft_projects': { label: 'Manajemen Proyek', category: 'Tugas & Proyek', icon: 'bi-briefcase-fill' },
  'ft_custom_folders': { label: 'Folder Proyek Kustom', category: 'Tugas & Proyek', icon: 'bi-folder-fill' },
  'ft_habits': { label: 'Pelacak Kebiasaan (Habits)', category: 'Tugas & Proyek', icon: 'bi-calendar-check' },

  // Finance & RAB
  'ft_transactions': { label: 'Transaksi Arus Kas (Finance)', category: 'Keuangan & RAB', icon: 'bi-wallet2' },
  'ft_rabItems': { label: 'Daftar Item RAB', category: 'Keuangan & RAB', icon: 'bi-calculator-fill' },
  'ft_rabIncomes': { label: 'Pemasukan Kas RAB', category: 'Keuangan & RAB', icon: 'bi-graph-up-arrow' },
  'ft_rabExpenses': { label: 'Pengeluaran Kas RAB', category: 'Keuangan & RAB', icon: 'bi-graph-down-arrow' },
  'ft_invoices': { label: 'Daftar Invoice Terbit', category: 'Keuangan & RAB', icon: 'bi-receipt' },

  // Relations & Profiles
  'ft_contacts': { label: 'Kontak Tim & Klien', category: 'Kontak & Profil', icon: 'bi-person-lines-fill' },
  'ft_userProfile': { label: 'Profil Pengguna', category: 'Kontak & Profil', icon: 'bi-person-circle' },
  'ft_myBusiness': { label: 'Profil Perusahaan / Bisnis', category: 'Kontak & Profil', icon: 'bi-building' },
  'ft_cvData': { label: 'Data CV ATS Builder', category: 'Kontak & Profil', icon: 'bi-person-vcard' },

  // Media & Gallery
  'ft_selfieGallery': { label: 'Galeri Selfie Happiness', category: 'Media & Galeri', icon: 'bi-camera-reels-fill' },
  'ft_motivation_frame_photos': { label: 'Foto Frame Motivasi 3D', category: 'Media & Galeri', icon: 'bi-image-fill' },
  'ft_saved_video_hub_list': { label: 'Koleksi Video Hub', category: 'Media & Galeri', icon: 'bi-play-btn-fill' },

  // Preferences & System
  'ft_themeMode': { label: 'Pengaturan Tema Visual', category: 'Sistem & Preferensi', icon: 'bi-palette' },
  'ft_accentColor': { label: 'Warna Aksen Aplikasi', category: 'Sistem & Preferensi', icon: 'bi-paint-bucket' },
  'ft_welcomeBanner': { label: 'Kustom Teks Sambutan', category: 'Sistem & Preferensi', icon: 'bi-card-heading' },
  'ft_auto_nightly_backup': { label: 'Opsi Auto Backup Malam', category: 'Sistem & Preferensi', icon: 'bi-clock-history' },
  'ft_notifications_enabled': { label: 'Preferensi Notifikasi', category: 'Sistem & Preferensi', icon: 'bi-bell' }
};

/**
 * Categorizes an arbitrary localStorage key
 */
function categorizeKey(key) {
  if (KEY_METADATA[key]) return KEY_METADATA[key].category;
  if (key.includes('note') || key.includes('scratchpad')) return 'Catatan & Dokumen';
  if (key.includes('task') || key.includes('project')) return 'Tugas & Proyek';
  if (key.includes('rab') || key.includes('finance') || key.includes('invoice') || key.includes('trans')) return 'Keuangan & RAB';
  if (key.includes('photo') || key.includes('video') || key.includes('selfie') || key.includes('image')) return 'Media & Galeri';
  if (key.includes('game') || key.includes('highscore')) return 'Game & Hiburan';
  return 'Sistem & Lainnya';
}

/**
 * Human-friendly key label
 */
function getKeyLabel(key) {
  if (KEY_METADATA[key]) return KEY_METADATA[key].label;
  return key;
}

/**
 * Format bytes into human readable KB / MB
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Calculate total localStorage usage and detailed breakdown of each key
 */
export function getLocalStorageUsage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {
      totalBytes: 0,
      totalKB: 0,
      totalMB: 0,
      maxQuotaBytes: MAX_STORAGE_QUOTA_BYTES,
      remainingBytes: MAX_STORAGE_QUOTA_BYTES,
      percentUsed: 0,
      isWarning: false,
      isFull: false,
      isForcedFull: false,
      itemCount: 0,
      items: []
    };
  }

  let totalBytes = 0;
  const items = [];

  for (let i = 0; i < window.localStorage.length; i++) {
    try {
      const key = window.localStorage.key(i);
      if (!key) continue;
      const value = window.localStorage.getItem(key) || '';
      // UTF-16 character takes 2 bytes
      const bytes = (key.length + value.length) * 2;
      totalBytes += bytes;

      let parsedCount = null;
      let isJson = false;
      try {
        const parsed = JSON.parse(value);
        isJson = true;
        if (Array.isArray(parsed)) {
          parsedCount = parsed.length;
        } else if (typeof parsed === 'object' && parsed !== null) {
          parsedCount = Object.keys(parsed).length;
        }
      } catch (e) {
        // Plain text
        parsedCount = value.length;
      }

      items.push({
        key,
        label: getKeyLabel(key),
        category: categorizeKey(key),
        bytes,
        formattedSize: formatBytes(bytes),
        charCount: value.length,
        itemCount: parsedCount,
        isJson,
        preview: value.length > 80 ? value.substring(0, 80) + '...' : value
      });
    } catch (e) {
      console.warn('Error reading key at index', i, e);
    }
  }

  // Sort items from largest to smallest size
  items.sort((a, b) => b.bytes - a.bytes);

  const percentUsed = Math.min(100, parseFloat(((totalBytes / MAX_STORAGE_QUOTA_BYTES) * 100).toFixed(2)));
  const isForced = window.localStorage.getItem(FORCE_FULL_KEY) === 'true';
  const isFull = isForced || percentUsed >= FULL_THRESHOLD_PERCENT || totalBytes >= MAX_STORAGE_QUOTA_BYTES;
  const isWarning = percentUsed >= WARNING_THRESHOLD_PERCENT && !isFull;
  const remainingBytes = Math.max(0, MAX_STORAGE_QUOTA_BYTES - totalBytes);

  return {
    totalBytes,
    totalKB: parseFloat((totalBytes / 1024).toFixed(1)),
    totalMB: parseFloat((totalBytes / (1024 * 1024)).toFixed(2)),
    totalGB: parseFloat((totalBytes / (1024 * 1024 * 1024)).toFixed(4)),
    maxQuotaBytes: MAX_STORAGE_QUOTA_BYTES,
    maxQuotaFormatted: '5.00 GB',
    remainingBytes,
    remainingFormatted: formatBytes(remainingBytes),
    percentUsed,
    isWarning,
    isFull,
    isForcedFull: isForced,
    itemCount: items.length,
    items
  };
}

/**
 * Check whether LocalStorage is full and new writes must be blocked
 */
export function isStorageFull() {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  if (window.localStorage.getItem(FORCE_FULL_KEY) === 'true') return true;
  const usage = getLocalStorageUsage();
  return usage.isFull;
}

/**
 * Set simulation of full storage (for testing purposes)
 */
export function setSimulatedStorageFull(enabled) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  if (enabled) {
    window.localStorage.setItem(FORCE_FULL_KEY, 'true');
  } else {
    window.localStorage.removeItem(FORCE_FULL_KEY);
  }
  window.dispatchEvent(new CustomEvent('storage-quota-updated'));
}

/**
 * Safe write to LocalStorage with quota guard and full-storage blocker.
 * If storage is full, writing is blocked and a structured error is returned.
 */
export function safeSetItem(key, value) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { success: false, error: 'LocalStorage tidak didukung di lingkungan ini.' };
  }

  // 1. Guard check: Is storage full or forced full?
  if (isStorageFull()) {
    const msg = 'Penyimpanan Penuh! Kuota penyimpanan Local Storage telah tercapai. Tidak dapat menyimpan data baru. Silakan hapus beberapa data di menu Storage untuk mengosongkan ruang.';
    window.dispatchEvent(new CustomEvent('storage-quota-full', { detail: { key, message: msg } }));
    return {
      success: false,
      isFull: true,
      error: msg
    };
  }

  const stringVal = typeof value === 'string' ? value : JSON.stringify(value);

  // 2. Perform safe write
  try {
    window.localStorage.setItem(key, stringVal);
    window.dispatchEvent(new CustomEvent('storage-quota-updated', { detail: { key } }));
    return { success: true };
  } catch (err) {
    console.error(`StorageManager: Failed writing key "${key}":`, err);

    // If quota exceeded exception was caught
    if (err && (err.name === 'QuotaExceededError' || err.code === 22 || err.number === -2147024882)) {
      const quotaMsg = 'Penyimpanan Local Storage browser penuh (QuotaExceededError)! Tidak dapat menyimpan data baru.';
      window.dispatchEvent(new CustomEvent('storage-quota-full', { detail: { key, message: quotaMsg } }));
      return {
        success: false,
        isFull: true,
        error: quotaMsg
      };
    }

    return {
      success: false,
      isFull: false,
      error: err.message || 'Gagal menyimpan ke penyimpanan lokal.'
    };
  }
}

/**
 * Safe remove item and notify subscribers
 */
export function safeRemoveItem(key) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  window.localStorage.removeItem(key);
  window.dispatchEvent(new CustomEvent('storage-quota-updated', { detail: { key } }));
}

/**
 * Clears temporary and non-critical cache keys to immediately release space
 */
export function clearTemporaryCache() {
  const tempKeys = [
    'ft_draft_note',
    'ft_nightly_backup_snapshot',
    'tb3d_highscore',
    'cr3d_highscore',
    'aim3d_highscore',
    'clicker_highscore',
    'snake3d_highscore',
    'bb3d_highscore',
    'ft_runner_highscore'
  ];

  let freedBytes = 0;
  let clearedCount = 0;

  tempKeys.forEach(k => {
    const val = window.localStorage.getItem(k);
    if (val !== null) {
      freedBytes += (k.length + val.length) * 2;
      window.localStorage.removeItem(k);
      clearedCount++;
    }
  });

  window.dispatchEvent(new CustomEvent('storage-quota-updated'));
  return { clearedCount, freedBytes, freedFormatted: formatBytes(freedBytes) };
}

/**
 * Total Reset (Factory Reset) for TaskArts
 * Wipes all application data from LocalStorage and triggers storage quota update events.
 * Optionally preserves visual appearance settings (Theme Mode and Accent Color).
 */
export function executeTotalReset({ keepTheme = true } = {}) {
  if (typeof window === 'undefined' || !window.localStorage) return;

  const savedTheme = keepTheme ? window.localStorage.getItem('ft_themeMode') : null;
  const savedAccent = keepTheme ? window.localStorage.getItem('ft_accentColor') : null;

  // Clear all localStorage entries
  window.localStorage.clear();

  // Restore theme if requested
  if (keepTheme) {
    if (savedTheme) window.localStorage.setItem('ft_themeMode', savedTheme);
    if (savedAccent) window.localStorage.setItem('ft_accentColor', savedAccent);
  }

  // Notify listeners across app
  window.dispatchEvent(new CustomEvent('storage-quota-updated'));
  return true;
}

