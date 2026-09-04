<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Breadcrumb & Back Navigation -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
      <div class="d-flex align-items-center gap-2">
        <router-link to="/storage" class="btn btn-outline-secondary rounded-pill px-3 py-1.5 shadow-sm d-flex align-items-center gap-2 text-decoration-none">
          <i class="bi bi-arrow-left"></i>
          <span>Kembali ke Storage & Kuota</span>
        </router-link>
        <span class="text-muted d-none d-sm-inline">/</span>
        <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-1.5 rounded-pill d-none d-sm-inline">
          <i class="bi bi-code-slash me-1"></i> JSON & Storage Inspector
        </span>
      </div>

      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold shadow-sm d-flex align-items-center gap-1.5" @click="refreshData">
          <i class="bi bi-arrow-repeat" :class="{ 'spin-icon': isRefreshing }"></i>
          <span>Segarkan</span>
        </button>
        <button class="btn btn-success btn-sm rounded-pill px-3 fw-bold text-white shadow-sm d-flex align-items-center gap-1.5" @click="downloadFile">
          <i class="bi bi-download"></i>
          <span>Unduh JSON</span>
        </button>
      </div>
    </div>

    <!-- Key Header Card -->
    <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-bottom pb-4 mb-4">
        <div class="d-flex align-items-start gap-3">
          <div class="p-3 bg-primary bg-opacity-10 text-primary rounded-4 fs-3">
            <i class="bi" :class="keyMetadata.icon || 'bi-database'"></i>
          </div>
          <div>
            <div class="d-flex align-items-center gap-2 flex-wrap mb-1">
              <h3 class="fw-extrabold text-dark mb-0">{{ keyMetadata.label }}</h3>
              <span class="badge bg-light text-dark border px-2.5 py-1 rounded-pill fw-semibold">
                {{ keyMetadata.category }}
              </span>
              <span class="badge rounded-pill px-2.5 py-1 fw-bold" :class="isJson ? 'bg-info-subtle text-info-emphasis' : 'bg-secondary-subtle text-secondary'">
                {{ isJson ? (isArray ? 'JSON Array' : 'JSON Object') : 'Raw Plain Text' }}
              </span>
            </div>
            <div class="d-flex align-items-center gap-2 text-muted small">
              <span>Kunci LocalStorage:</span>
              <code class="px-2 py-0.5 rounded bg-light border text-primary fw-bold">{{ activeKey }}</code>
            </div>
          </div>
        </div>

        <!-- Metric Badges -->
        <div class="d-flex flex-wrap gap-2">
          <div class="p-3 bg-light rounded-3 border text-center" style="min-width: 110px;">
            <div class="small text-muted mb-0.5">Ukuran Memori</div>
            <div class="fw-extrabold text-dark fs-6">{{ formattedSize }}</div>
            <div class="small text-muted font-monospace" style="font-size: 0.72rem;">{{ rawBytes.toLocaleString() }} B</div>
          </div>
          <div class="p-3 bg-light rounded-3 border text-center" style="min-width: 110px;">
            <div class="small text-muted mb-0.5">{{ isJson ? 'Jumlah Entri' : 'Total Huruf' }}</div>
            <div class="fw-extrabold text-dark fs-6">{{ entryCount }}</div>
            <div class="small text-muted font-monospace" style="font-size: 0.72rem;">{{ isJson ? (isArray ? 'elemen array' : 'properti') : 'karakter' }}</div>
          </div>
        </div>
      </div>

      <!-- Action & View Controls Bar -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <!-- View Mode Tabs -->
        <div class="btn-group p-1 bg-light rounded-pill border" role="group">
          <button
            type="button"
            class="btn btn-sm rounded-pill px-3 fw-bold"
            :class="viewMode === 'code' ? 'btn-primary text-white shadow-sm' : 'btn-light text-dark'"
            @click="viewMode = 'code'"
          >
            <i class="bi bi-code-square me-1"></i> Teks / Kode JSON
          </button>
          <button
            v-if="isArray && parsedData.length > 0"
            type="button"
            class="btn btn-sm rounded-pill px-3 fw-bold"
            :class="viewMode === 'table' ? 'btn-primary text-white shadow-sm' : 'btn-light text-dark'"
            @click="viewMode = 'table'"
          >
            <i class="bi bi-table me-1"></i> Ringkasan Tabel ({{ parsedData.length }})
          </button>
        </div>

        <!-- Tools: Formatting, Copy, Delete -->
        <div class="d-flex flex-wrap align-items-center gap-2">
          <!-- Format Toggle -->
          <div v-if="isJson && viewMode === 'code'" class="btn-group btn-group-sm" role="group">
            <button
              type="button"
              class="btn"
              :class="indentMode === 2 ? 'btn-dark' : 'btn-outline-secondary'"
              @click="indentMode = 2"
              title="Format Indentasi 2 Spasi (Mudah Dibaca)"
            >
              Indented
            </button>
            <button
              type="button"
              class="btn"
              :class="indentMode === 0 ? 'btn-dark' : 'btn-outline-secondary'"
              @click="indentMode = 0"
              title="Kompak Satu Baris (Minified)"
            >
              Minified
            </button>
          </div>

          <!-- Copy Button -->
          <button class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-1.5" @click="copyContent">
            <i class="bi" :class="isCopied ? 'bi-check2 text-success' : 'bi-clipboard'"></i>
            <span>{{ isCopied ? 'Berhasil Disalin!' : 'Salin Semua' }}</span>
          </button>

          <!-- Delete Key Button -->
          <button class="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-1.5" @click="confirmDeleteKey">
            <i class="bi bi-trash3"></i>
            <span>Kosongkan Kunci</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty or Deleted State -->
    <div v-if="!hasData" class="card border-0 shadow-sm rounded-4 bg-white p-5 text-center mb-4">
      <div class="py-4">
        <i class="bi bi-file-earmark-x text-muted display-3 d-block mb-3"></i>
        <h4 class="fw-bold text-dark">Kunci Penyimpanan Tidak Memiliki Data</h4>
        <p class="text-muted mb-4">Kunci <code>{{ activeKey }}</code> kosong atau belum pernah dibuat di LocalStorage browser ini.</p>
        <router-link to="/storage" class="btn btn-primary rounded-pill px-4 fw-bold">
          <i class="bi bi-arrow-left me-1"></i> Kembali ke Manajemen Storage
        </router-link>
      </div>
    </div>

    <!-- View Mode: CODE / JSON VIEWER -->
    <div v-else-if="viewMode === 'code'" class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
      <!-- Search inside code -->
      <div class="p-3 bg-light border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div class="d-flex align-items-center gap-2 flex-grow-1" style="max-width: 450px;">
          <div class="input-group input-group-sm">
            <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
            <input
              type="text"
              class="form-control bg-white border-start-0 ps-0"
              placeholder="Cari kata atau atribut di dalam teks/JSON..."
              v-model="searchQuery"
            />
            <button v-if="searchQuery" class="btn btn-outline-secondary" @click="searchQuery = ''">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <span v-if="searchQuery" class="small text-muted text-nowrap">
            {{ matchCount }} ditemukan
          </span>
        </div>

        <div class="d-flex align-items-center gap-3 small text-muted">
          <span>Total Baris: <strong class="text-dark">{{ totalLines.toLocaleString() }}</strong></span>
          <span>Karakter: <strong class="text-dark">{{ rawString.length.toLocaleString() }}</strong></span>
        </div>
      </div>

      <!-- Code Box with dark / clear terminal design -->
      <div class="position-relative bg-dark text-light p-0 overflow-auto" style="max-height: 650px;">
        <pre class="m-0 p-4 font-monospace text-light" style="font-size: 0.85rem; line-height: 1.6; white-space: pre-wrap; word-break: break-word;"><code v-html="highlightedContent"></code></pre>
      </div>
    </div>

    <!-- View Mode: TABLE PREVIEW (For JSON Arrays) -->
    <div v-else-if="viewMode === 'table'" class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
      <div class="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
        <span class="fw-bold text-dark small text-uppercase tracking-wider">
          <i class="bi bi-grid-3x3-gap-fill me-1 text-primary"></i> Pratinjau {{ parsedData.length }} Item Data
        </span>
        <span class="badge bg-primary text-white rounded-pill px-3 py-1 fw-bold">
          {{ tableColumns.length }} Kolom Terdeteksi
        </span>
      </div>

      <div class="table-responsive" style="max-height: 600px;">
        <table class="table table-hover table-bordered align-middle mb-0" style="font-size: 0.86rem;">
          <thead class="table-light text-muted small text-uppercase">
            <tr>
              <th scope="col" style="width: 50px;" class="text-center">#</th>
              <th v-for="col in tableColumns" :key="col" scope="col">
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in parsedData.slice(0, 100)" :key="idx">
              <td class="text-center font-monospace text-muted small">{{ idx + 1 }}</td>
              <td v-for="col in tableColumns" :key="col">
                <span v-if="typeof row[col] === 'object' && row[col] !== null" class="badge bg-light text-dark border font-monospace">
                  {{ JSON.stringify(row[col]).substring(0, 35) + '...' }}
                </span>
                <span v-else-if="typeof row[col] === 'boolean'" class="badge" :class="row[col] ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'">
                  {{ row[col] ? 'true' : 'false' }}
                </span>
                <span v-else class="text-dark font-monospace text-truncate d-inline-block" style="max-width: 250px;">
                  {{ row[col] !== undefined && row[col] !== null ? String(row[col]) : '-' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="parsedData.length > 100" class="p-3 text-center bg-light text-muted small border-top">
        Menampilkan 100 dari {{ parsedData.length }} entri. Gunakan tampilan <strong>Kode JSON</strong> untuk melihat seluruh data.
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { formatBytes, safeRemoveItem } from '../utils/storageManager';

const METADATA_DICTIONARY = {
  'ft_notes': { label: 'Catatan & Dokumen (Notes)', category: 'Catatan & Dokumen', icon: 'bi-journal-text' },
  'rk_quick_scratchpad': { label: 'Quick Scratchpad', category: 'Catatan & Dokumen', icon: 'bi-sticky-fill' },
  'ft_draft_note': { label: 'Draft Editor Catatan', category: 'Catatan & Dokumen', icon: 'bi-pencil-square' },
  'stickyNote': { label: 'Sticky Note Dashboard', category: 'Catatan & Dokumen', icon: 'bi-stickies' },
  'rajinkerja_diary_scratchpad': { label: 'Scratchpad Jurnal Harian', category: 'Catatan & Dokumen', icon: 'bi-book-half' },
  'ft_codeNotes': { label: 'Koleksi Code Snippets', category: 'Catatan & Dokumen', icon: 'bi-code-slash' },
  'ft_tasks': { label: 'Daftar Tugas (Tasks & To-Do)', category: 'Tugas & Proyek', icon: 'bi-check2-square' },
  'ft_projects': { label: 'Manajemen Proyek', category: 'Tugas & Proyek', icon: 'bi-briefcase-fill' },
  'ft_custom_folders': { label: 'Folder Proyek Kustom', category: 'Tugas & Proyek', icon: 'bi-folder-fill' },
  'ft_habits': { label: 'Pelacak Kebiasaan (Habits)', category: 'Tugas & Proyek', icon: 'bi-calendar-check' },
  'ft_transactions': { label: 'Transaksi Arus Kas (Finance)', category: 'Keuangan & RAB', icon: 'bi-wallet2' },
  'ft_rabItems': { label: 'Daftar Item RAB', category: 'Keuangan & RAB', icon: 'bi-calculator-fill' },
  'ft_rabIncomes': { label: 'Pemasukan Kas RAB', category: 'Keuangan & RAB', icon: 'bi-graph-up-arrow' },
  'ft_rabExpenses': { label: 'Pengeluaran Kas RAB', category: 'Keuangan & RAB', icon: 'bi-graph-down-arrow' },
  'ft_invoices': { label: 'Daftar Invoice Terbit', category: 'Keuangan & RAB', icon: 'bi-receipt' },
  'ft_contacts': { label: 'Kontak Tim & Klien', category: 'Kontak & Profil', icon: 'bi-person-lines-fill' },
  'ft_userProfile': { label: 'Profil Pengguna', category: 'Kontak & Profil', icon: 'bi-person-circle' },
  'ft_myBusiness': { label: 'Profil Perusahaan / Bisnis', category: 'Kontak & Profil', icon: 'bi-building' },
  'ft_cvData': { label: 'Data CV ATS Builder', category: 'Kontak & Profil', icon: 'bi-person-vcard' },
  'ft_selfieGallery': { label: 'Galeri Selfie Happiness', category: 'Media & Galeri', icon: 'bi-camera-reels-fill' },
  'ft_motivation_frame_photos': { label: 'Foto Frame Motivasi 3D', category: 'Media & Galeri', icon: 'bi-image-fill' },
  'ft_saved_video_hub_list': { label: 'Koleksi Video Hub', category: 'Media & Galeri', icon: 'bi-play-btn-fill' },
  'ft_themeMode': { label: 'Pengaturan Tema Visual', category: 'Sistem & Preferensi', icon: 'bi-palette' },
  'ft_accentColor': { label: 'Warna Aksen Aplikasi', category: 'Sistem & Preferensi', icon: 'bi-paint-bucket' },
  'ft_welcomeBanner': { label: 'Kustom Teks Sambutan', category: 'Sistem & Preferensi', icon: 'bi-card-heading' },
  'ft_auto_nightly_backup': { label: 'Opsi Auto Backup Malam', category: 'Sistem & Preferensi', icon: 'bi-clock-history' },
  'ft_notifications_enabled': { label: 'Preferensi Notifikasi', category: 'Sistem & Preferensi', icon: 'bi-bell' }
};

export default {
  name: 'StorageKeyDetailView',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const activeKey = ref(route.params.key ? decodeURIComponent(route.params.key) : '');
    const rawString = ref('');
    const isJson = ref(false);
    const isArray = ref(false);
    const parsedData = ref(null);
    const isRefreshing = ref(false);
    const isCopied = ref(false);
    const viewMode = ref('code'); // 'code' or 'table'
    const indentMode = ref(2); // 2 or 0
    const searchQuery = ref('');

    const loadData = () => {
      if (!activeKey.value) return;
      const stored = localStorage.getItem(activeKey.value);
      if (stored === null) {
        rawString.value = '';
        isJson.value = false;
        isArray.value = false;
        parsedData.value = null;
        return;
      }

      rawString.value = stored;
      try {
        const parsed = JSON.parse(stored);
        parsedData.value = parsed;
        isJson.value = true;
        isArray.value = Array.isArray(parsed);
      } catch (e) {
        parsedData.value = null;
        isJson.value = false;
        isArray.value = false;
      }
    };

    onMounted(() => {
      loadData();
    });

    const refreshData = () => {
      isRefreshing.value = true;
      loadData();
      setTimeout(() => {
        isRefreshing.value = false;
      }, 350);
    };

    const hasData = computed(() => {
      return rawString.value !== '' && rawString.value !== null;
    });

    const keyMetadata = computed(() => {
      if (METADATA_DICTIONARY[activeKey.value]) {
        return METADATA_DICTIONARY[activeKey.value];
      }
      return {
        label: activeKey.value,
        category: 'LocalStorage Kustom',
        icon: 'bi-database'
      };
    });

    const rawBytes = computed(() => {
      if (!activeKey.value || !rawString.value) return 0;
      return (activeKey.value.length + rawString.value.length) * 2;
    });

    const formattedSize = computed(() => {
      return formatBytes(rawBytes.value);
    });

    const entryCount = computed(() => {
      if (!hasData.value) return 0;
      if (isJson.value && parsedData.value) {
        if (isArray.value) return parsedData.value.length;
        return Object.keys(parsedData.value).length;
      }
      return rawString.value.length;
    });

    const formattedContent = computed(() => {
      if (!hasData.value) return '';
      if (isJson.value && parsedData.value) {
        return JSON.stringify(parsedData.value, null, indentMode.value);
      }
      return rawString.value;
    });

    const totalLines = computed(() => {
      if (!formattedContent.value) return 0;
      return formattedContent.value.split('\n').length;
    });

    const matchCount = computed(() => {
      if (!searchQuery.value.trim() || !formattedContent.value) return 0;
      const regex = new RegExp(searchQuery.value.trim(), 'gi');
      const matches = formattedContent.value.match(regex);
      return matches ? matches.length : 0;
    });

    const escapeHtml = (text) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const highlightedContent = computed(() => {
      const content = escapeHtml(formattedContent.value);
      const query = searchQuery.value.trim();
      if (!query) return content;

      const escapedQuery = escapeHtml(query);
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      return content.replace(regex, '<mark class="bg-warning text-dark px-1 rounded">$1</mark>');
    });

    const tableColumns = computed(() => {
      if (!isArray.value || !parsedData.value || parsedData.value.length === 0) return [];
      const colSet = new Set();
      parsedData.value.slice(0, 30).forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(k => colSet.add(k));
        }
      });
      return Array.from(colSet);
    });

    const copyContent = async () => {
      try {
        await navigator.clipboard.writeText(formattedContent.value);
        isCopied.value = true;
        setTimeout(() => {
          isCopied.value = false;
        }, 2000);
      } catch (e) {
        // Fallback
        const el = document.createElement('textarea');
        el.value = formattedContent.value;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        isCopied.value = true;
        setTimeout(() => {
          isCopied.value = false;
        }, 2000);
      }
    };

    const downloadFile = () => {
      if (!hasData.value) return;
      const ext = isJson.value ? 'json' : 'txt';
      const mime = isJson.value ? 'application/json' : 'text/plain';
      const blob = new Blob([formattedContent.value], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeKey.value}_${new Date().toISOString().split('T')[0]}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const confirmDeleteKey = async () => {
      const confirm = await Swal.fire({
        title: `Kosongkan Kunci "${activeKey.value}"?`,
        text: `Data ini (${formattedSize.value}) akan dihapus dari penyimpanan browser secara permanen.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Ya, Kosongkan Kunci',
        cancelButtonText: 'Batal'
      });

      if (confirm.isConfirmed) {
        safeRemoveItem(activeKey.value);
        Swal.fire({
          icon: 'success',
          title: 'Kunci Berhasil Dikosongkan',
          text: 'Data telah dihapus. Anda akan dialihkan kembali ke menu Storage.',
          timer: 1800,
          showConfirmButton: false
        }).then(() => {
          router.push('/storage');
        });
      }
    };

    return {
      activeKey,
      rawString,
      isJson,
      isArray,
      parsedData,
      isRefreshing,
      isCopied,
      viewMode,
      indentMode,
      searchQuery,
      hasData,
      keyMetadata,
      rawBytes,
      formattedSize,
      entryCount,
      formattedContent,
      totalLines,
      matchCount,
      highlightedContent,
      tableColumns,
      refreshData,
      copyContent,
      downloadFile,
      confirmDeleteKey
    };
  }
};
</script>

<style scoped>
.spin-icon {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
