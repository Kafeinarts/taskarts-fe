<template>
  <div class="container-fluid p-0 browser-research-suite" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="card border-0 shadow-sm rounded-4 bg-white p-3 p-md-4 mb-3 no-print">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
            <span class="badge bg-primary text-white fw-bold px-3 py-1.5 rounded-pill">
              <i class="bi bi-compass-fill me-1"></i> Internal Browser & Multi-Tab Suite
            </span>
            <span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 fw-bold px-2.5 py-1.5 rounded-pill small">
              By Kafeinarts
            </span>
            <span class="badge bg-success-subtle text-success fw-bold px-3 py-1.5 rounded-pill border border-success-subtle">
              <i class="bi bi-journal-text me-1"></i> Research Drafter & Copas ke To-Do / Notes
            </span>
          </div>
          <h2 class="fw-bold mb-1 text-dark">Browser Riset Internal & Multi-Tab Workspace</h2>
          <p class="text-muted mb-0">
            Jelajahi referensi web, cari artikel, dan kumpulkan kutipan riset. Tulis draf artikel langsung di samping browser dan salin ke <strong>To-Do</strong> atau <strong>Sticky Notes</strong> dalam 1-klik!
          </p>
        </div>

        <div class="d-flex flex-wrap align-items-center gap-2">
          <!-- Toggle Split Drafter Sidebar -->
          <button
            class="btn rounded-pill px-3.5 py-2 fw-bold d-flex align-items-center gap-1.5 shadow-sm transition-all"
            :class="showDrafterPanel ? 'btn-primary text-white' : 'btn-outline-primary bg-white'"
            @click="showDrafterPanel = !showDrafterPanel"
          >
            <i :class="showDrafterPanel ? 'bi bi-layout-sidebar-inset-reverse' : 'bi bi-layout-sidebar-reverse'"></i>
            <span>{{ showDrafterPanel ? 'Tutup Panel Draf' : 'Buka Draf Riset' }}</span>
            <span class="badge bg-white text-primary rounded-pill px-1.5 py-0.5 ms-1" style="font-size: 10px;">
              {{ draftWordCount }} kata
            </span>
          </button>

          <button
            class="btn btn-outline-secondary rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1.5"
            @click="openActiveInRealTab"
            title="Buka URL aktif di tab browser asli"
          >
            <i class="bi bi-box-arrow-up-right"></i>
            <span>Buka Tab Luar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MAIN BROWSER & DRAFTER WORKBENCH -->
    <div class="row g-3">
      <!-- LEFT COLUMN: Multi-Tab Browser Window -->
      <div :class="showDrafterPanel ? 'col-lg-7 col-xl-8' : 'col-12'" class="transition-all">
        <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden browser-window-card">
          <!-- TOP CHROME-STYLE MULTI-TAB BAR -->
          <div class="browser-tab-bar d-flex align-items-center px-2 pt-2 pb-1 gap-1 overflow-x-auto">
            <div
              v-for="(tab, index) in tabs"
              :key="tab.id"
              class="browser-tab d-flex align-items-center gap-2 px-3 py-1.5 rounded-top-3 cursor-pointer user-select-none transition-all"
              :class="{ active: activeTabId === tab.id }"
              @click="activeTabId = tab.id"
            >
              <i :class="tab.icon || 'bi bi-globe'" class="tab-icon small" :style="{ color: tab.color || '#2563eb' }"></i>
              <span class="tab-title text-truncate fw-semibold small" style="max-width: 140px;">
                {{ tab.title || 'Tab Baru' }}
              </span>
              <button
                v-if="tabs.length > 1"
                class="btn btn-link p-0 text-muted ms-1 tab-close-btn"
                @click.stop="closeTab(index)"
                title="Tutup Tab"
              >
                <i class="bi bi-x"></i>
              </button>
            </div>

            <!-- Add New Tab Button -->
            <button
              class="btn btn-sm btn-light rounded-circle p-1 ms-1 d-flex align-items-center justify-content-center border tab-add-btn"
              @click="addNewTab"
              title="Buka Tab Baru (+)"
            >
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>

          <!-- BROWSER ADDRESS BAR & CONTROLS -->
          <div class="browser-address-bar p-2.5 bg-light border-top border-bottom d-flex align-items-center gap-2 flex-wrap">
            <!-- Nav Controls (Back, Forward, Reload) -->
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-secondary bg-white" @click="navigateBack" title="Kembali">
                <i class="bi bi-arrow-left"></i>
              </button>
              <button class="btn btn-outline-secondary bg-white" @click="navigateForward" title="Maju">
                <i class="bi bi-arrow-right"></i>
              </button>
              <button class="btn btn-outline-secondary bg-white" @click="reloadTab" title="Muat Ulang Halaman">
                <i class="bi bi-arrow-clockwise" :class="{ 'spin-anim': isReloading }"></i>
              </button>
            </div>

            <!-- Search Engine Selector -->
            <div class="dropdown">
              <button
                class="btn btn-sm btn-white border dropdown-toggle d-flex align-items-center gap-1.5 fw-semibold px-2.5 py-1"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i :class="currentEngineConfig.icon" :style="{ color: currentEngineConfig.color }"></i>
                <span class="small d-none d-sm-inline">{{ currentEngineConfig.name }}</span>
              </button>
              <ul class="dropdown-menu shadow-sm py-1">
                <li v-for="engine in searchEngines" :key="engine.id">
                  <a
                    class="dropdown-item small d-flex align-items-center gap-2 py-1.5 cursor-pointer"
                    :class="{ active: currentTab.engineId === engine.id }"
                    @click="setEngine(engine.id)"
                  >
                    <i :class="engine.icon" :style="{ color: engine.color }"></i>
                    <span>{{ engine.name }}</span>
                  </a>
                </li>
              </ul>
            </div>

            <!-- Omnibox URL / Search Bar -->
            <div class="omnibox-wrapper flex-grow-1 position-relative d-flex align-items-center bg-white rounded-pill px-3 py-1 border shadow-xs">
              <i class="bi bi-search text-muted me-2" style="font-size: 13px;"></i>
              <input
                ref="omniboxInput"
                type="text"
                v-model="currentTab.inputUrl"
                @keyup.enter="handleOmniboxSubmit"
                placeholder="Ketik kata kunci pencarian atau masukkan alamat URL (https://...)"
                class="border-0 bg-transparent flex-grow-1 shadow-none outline-none small text-dark"
                style="font-size: 13px;"
              />
              <button
                v-if="currentTab.inputUrl"
                @click="currentTab.inputUrl = ''"
                class="btn btn-link p-0 text-muted me-1"
                title="Bersihkan"
              >
                <i class="bi bi-x-circle-fill" style="font-size: 12px;"></i>
              </button>
              <button
                @click="handleOmniboxSubmit"
                class="btn btn-sm btn-primary rounded-pill px-3 py-0.5 small fw-bold"
              >
                Buka
              </button>
            </div>

            <!-- Mode Switcher (Embedded Iframe vs Reader Mode Search API) -->
            <div class="btn-group btn-group-sm">
              <button
                type="button"
                class="btn"
                :class="currentTab.viewMode === 'iframe' ? 'btn-primary text-white fw-bold' : 'btn-outline-secondary bg-white'"
                @click="currentTab.viewMode = 'iframe'"
                title="Tampilan Web Asli (Iframe)"
              >
                <i class="bi bi-window me-1"></i> Web
              </button>
              <button
                type="button"
                class="btn"
                :class="currentTab.viewMode === 'reader' ? 'btn-primary text-white fw-bold' : 'btn-outline-secondary bg-white'"
                @click="currentTab.viewMode = 'reader'"
                title="Tampilan Reader Bersih / Riset Teks"
              >
                <i class="bi bi-card-text me-1"></i> Reader
              </button>
            </div>
          </div>

          <!-- BOOKMARKS / QUICK RESEARCH LAUNCHPAD -->
          <div class="bookmarks-bar px-3 py-1.5 bg-light-subtle border-bottom d-flex align-items-center gap-1.5 overflow-x-auto">
            <span class="small text-muted fw-bold me-1" style="font-size: 11px;">
              <i class="bi bi-star-fill text-warning me-1"></i>Pintasan:
            </span>
            <button
              v-for="bm in bookmarks"
              :key="bm.name"
              class="btn btn-xs rounded-pill px-2.5 py-1 text-nowrap d-flex align-items-center gap-1 border bg-white text-dark hover-shadow"
              @click="openBookmark(bm)"
            >
              <i :class="bm.icon" :style="{ color: bm.color }"></i>
              <span>{{ bm.name }}</span>
            </button>
          </div>

          <!-- BROWSER VIEWPORT STAGE -->
          <div class="browser-viewport position-relative" style="min-height: 600px; height: calc(100vh - 360px);">
            <!-- Iframe Embedding Mode -->
            <div v-if="currentTab.viewMode === 'iframe'" class="w-100 h-100 position-relative">
              <!-- Notice for X-Frame-Options Restricted Sites -->
              <div
                v-if="currentTab.hasFrameWarning"
                class="alert alert-warning py-2 px-3 m-2 rounded-3 small d-flex align-items-center justify-content-between flex-wrap gap-2 position-absolute top-0 start-0 end-0 z-3 shadow-sm border-warning"
              >
                <div>
                  <i class="bi bi-shield-exclamation me-1.5 text-warning fs-6"></i>
                  <strong>Info Pembatasan Iframe:</strong> Situs ini mungkin membatasi embedding (X-Frame-Options). Jika halaman kosong, gunakan tombol <strong>Buka Tab Luar</strong> atau ganti ke <strong>Mode Reader</strong>.
                </div>
                <div class="d-flex gap-1.5">
                  <button class="btn btn-xs btn-warning text-dark fw-bold rounded-pill px-2.5" @click="currentTab.viewMode = 'reader'">
                    Beralih ke Reader
                  </button>
                  <button class="btn btn-xs btn-primary text-white rounded-pill px-2.5 fw-bold" @click="openActiveInRealTab">
                    Buka di Tab Baru <i class="bi bi-box-arrow-up-right ms-1"></i>
                  </button>
                  <button class="btn btn-xs btn-outline-secondary rounded-circle p-1" @click="currentTab.hasFrameWarning = false">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>

              <!-- Real Embed Iframe -->
              <iframe
                :key="currentTab.activeUrl + currentTab.reloadKey"
                :src="currentTab.activeUrl"
                class="w-100 h-100 border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                @load="onIframeLoaded"
              ></iframe>
            </div>

            <!-- Reader & Instant Research Search Mode -->
            <div v-else class="p-4 overflow-y-auto h-100 bg-light-subtle">
              <div class="max-w-750 mx-auto">
                <div class="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="d-flex align-items-center gap-2">
                      <i class="bi bi-journal-check text-primary fs-4"></i>
                      <div>
                        <h5 class="fw-bold mb-0 text-dark">Hasil Pencarian & Artikel: {{ currentTab.searchQuery || currentTab.title }}</h5>
                        <small class="text-muted">Sumber: {{ currentEngineConfig.name }}</small>
                      </div>
                    </div>
                    <button class="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold" @click="copyAllResultsToDraft">
                      <i class="bi bi-file-earmark-plus me-1"></i> Salin Semua ke Draf
                    </button>
                  </div>

                  <!-- Quick Search Prompt if empty -->
                  <div class="input-group mb-3">
                    <input
                      type="text"
                      class="form-control"
                      v-model="quickSearchTerm"
                      placeholder="Cari artikel ensiklopedia / dokumentasi..."
                      @keyup.enter="performReaderSearch"
                    />
                    <button class="btn btn-primary fw-bold px-3" @click="performReaderSearch">
                      <i class="bi bi-search me-1"></i> Cari
                    </button>
                  </div>

                  <!-- Reader Content Preview -->
                  <div v-if="readerLoading" class="text-center py-5">
                    <div class="spinner-border text-primary mb-2" role="status"></div>
                    <div class="small text-muted">Mengambil artikel & data referensi...</div>
                  </div>

                  <div v-else-if="readerResults.length > 0" class="d-flex flex-column gap-3">
                    <div
                      v-for="(item, rIdx) in readerResults"
                      :key="rIdx"
                      class="p-3 rounded-3 border bg-light position-relative hover-shadow transition-all"
                    >
                      <div class="d-flex justify-content-between align-items-start gap-2 mb-1.5">
                        <h6 class="fw-bold text-primary mb-0">{{ item.title }}</h6>
                        <button
                          class="btn btn-xs btn-primary rounded-pill px-2.5 py-1 fw-semibold d-flex align-items-center gap-1"
                          @click="appendSnippetToDraft(item)"
                          title="Kirim cuplikan ini ke draf riset"
                        >
                          <i class="bi bi-plus-circle"></i> + Draf
                        </button>
                      </div>
                      <p class="small text-secondary mb-2 lh-base">{{ item.snippet }}</p>
                      <div class="d-flex align-items-center justify-content-between text-muted" style="font-size: 11px;">
                        <span><i class="bi bi-link-45deg me-1"></i>{{ item.source || 'Wikipedia / Web' }}</span>
                        <a :href="item.url" target="_blank" rel="noopener noreferrer" class="text-decoration-none text-primary fw-semibold">
                          Buka Halaman Asli <i class="bi bi-arrow-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>

                  <!-- Fallback When Empty -->
                  <div v-else class="text-center py-5 text-muted">
                    <i class="bi bi-newspaper fs-1 d-block mb-2 opacity-50"></i>
                    <h6 class="fw-bold text-dark">Mulai Riset Topik Anda</h6>
                    <p class="small mb-3">Ketik kata kunci seperti <code>Vue 3 Composition API</code>, <code>Teknik Menulis Artikel</code>, atau <code>Desain UI/UX</code> untuk memuat referensi.</p>
                    <div class="d-flex flex-wrap justify-content-center gap-2">
                      <button class="btn btn-sm btn-outline-secondary rounded-pill" @click="searchKeyword('Vue 3 Tips')">Vue 3 Tips</button>
                      <button class="btn btn-sm btn-outline-secondary rounded-pill" @click="searchKeyword('Panduan Freelance')">Panduan Freelance</button>
                      <button class="btn btn-sm btn-outline-secondary rounded-pill" @click="searchKeyword('Prinsip Desain UI')">Prinsip Desain UI</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Research Scratchpad & Article Drafter (Split View) -->
      <div v-if="showDrafterPanel" class="col-lg-5 col-xl-4 transition-all">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 p-md-4 h-100 d-flex flex-column drafter-card">
          <!-- Drafter Header -->
          <div class="d-flex align-items-center justify-content-between pb-2.5 mb-3 border-bottom">
            <div class="d-flex align-items-center gap-2">
              <div class="p-2 bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
                <i class="bi bi-pencil-fill"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0 text-dark">Draf Riset & Artikel</h5>
                <small class="text-muted">{{ draftWordCount }} Kata • {{ draftCharCount }} Karakter</small>
              </div>
            </div>

            <button class="btn btn-sm btn-light border rounded-circle" @click="showDrafterPanel = false" title="Ciutkan Panel">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Quick Action Buttons: Copas ke To-Do, Notes, Medium, Clipboard -->
          <div class="d-flex flex-column gap-2 mb-3">
            <div class="d-flex gap-2">
              <button
                class="btn btn-sm btn-warning text-dark fw-bold rounded-pill flex-grow-1 d-flex align-items-center justify-content-center gap-1.5 shadow-xs"
                @click="sendDraftToTodo"
                title="Buat To-Do baru dari draf riset ini"
              >
                <i class="bi bi-check2-square fs-6"></i>
                <span>Jadikan To-Do</span>
              </button>

              <button
                class="btn btn-sm btn-primary text-white fw-bold rounded-pill flex-grow-1 d-flex align-items-center justify-content-center gap-1.5 shadow-xs"
                @click="sendDraftToNotes"
                title="Simpan sebagai Sticky Note baru"
              >
                <i class="bi bi-journal-text fs-6"></i>
                <span>Simpan ke Notes</span>
              </button>
            </div>

            <div class="d-flex gap-2">
              <button
                class="btn btn-sm btn-outline-success fw-semibold rounded-pill flex-grow-1 d-flex align-items-center justify-content-center gap-1.5"
                @click="copyDraftToClipboard"
                title="Salin seluruh draf ke clipboard"
              >
                <i class="bi bi-clipboard-check"></i>
                <span>Salin Teks</span>
              </button>

              <router-link
                to="/medium-draft"
                class="btn btn-sm btn-outline-dark fw-semibold rounded-pill flex-grow-1 d-flex align-items-center justify-content-center gap-1.5"
                title="Buka di Medium Draft Suite"
              >
                <i class="bi bi-medium"></i>
                <span>Ke Medium Draft</span>
              </router-link>
            </div>
          </div>

          <!-- Article Title Input -->
          <div class="mb-2">
            <label class="form-label small fw-bold text-dark mb-1">Judul Draf / Topik Riset</label>
            <input
              type="text"
              class="form-control form-control-sm fw-bold"
              v-model="articleDraft.title"
              placeholder="Contoh: Rangkuman Riset & Bahan Tulisan..."
            />
          </div>

          <!-- Article Content Textarea -->
          <div class="flex-grow-1 d-flex flex-column mb-3">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="form-label small fw-bold text-dark mb-0">Isi Catatan & Kutipan</label>
              <div class="d-flex gap-1">
                <button class="btn btn-xs btn-light border" @click="insertBulletPoint" title="Tambah Poin">+ Poin</button>
                <button class="btn btn-xs btn-light border" @click="insertCurrentUrlAsSource" title="Sisipkan Sumber URL">+ Sumber Web</button>
                <button class="btn btn-xs btn-light border text-danger" @click="clearDraft" title="Hapus Semua">Bersihkan</button>
              </div>
            </div>
            <textarea
              class="form-control form-control-sm flex-grow-1 rounded-3 p-2.5 font-monospace text-dark"
              style="min-height: 280px; resize: none; font-size: 12.5px; line-height: 1.6;"
              v-model="articleDraft.content"
              placeholder="Tulis artikel, hasil pencarian, atau klik '+ Draf' pada hasil riset untuk mengumpulkan bahan di sini..."
            ></textarea>
          </div>

          <!-- Auto-Save Timestamp Indicator -->
          <div class="d-flex align-items-center justify-content-between text-muted pt-2 border-top" style="font-size: 11px;">
            <span><i class="bi bi-shield-check text-success me-1"></i>Tersimpan otomatis di browser</span>
            <span>Update: {{ lastSavedTime || 'Baru saja' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  name: 'BrowserResearchView',
  setup() {
    const store = useStore();
    const router = useRouter();

    const showDrafterPanel = ref(true);
    const activeTabId = ref(1);
    const isReloading = ref(false);
    const quickSearchTerm = ref('');
    const readerLoading = ref(false);
    const readerResults = ref([]);
    const lastSavedTime = ref('');

    // Pre-configured Research Search Engines
    const searchEngines = [
      { id: 'duckduckgo', name: 'DuckDuckGo', icon: 'bi-search-heart', color: '#ea580c', searchUrl: 'https://duckduckgo.com/?q=' },
      { id: 'wikipedia', name: 'Wikipedia', icon: 'bi-book-half', color: '#0284c7', searchUrl: 'https://id.wikipedia.org/wiki/Special:Search?search=' },
      { id: 'google', name: 'Google Search', icon: 'bi-google', color: '#2563eb', searchUrl: 'https://www.google.com/search?q=' },
      { id: 'mdn', name: 'MDN Web Docs', icon: 'bi-code-slash', color: '#10b981', searchUrl: 'https://developer.mozilla.org/en-US/search?q=' },
      { id: 'devdocs', name: 'DevDocs.io', icon: 'bi-terminal', color: '#6366f1', searchUrl: 'https://devdocs.io/#q=' },
      { id: 'github', name: 'GitHub', icon: 'bi-github', color: '#1e293b', searchUrl: 'https://github.com/search?q=' }
    ];

    // Bookmarks Bar
    const bookmarks = [
      { name: 'Wikipedia ID', url: 'https://id.wikipedia.org', icon: 'bi-book', color: '#0284c7' },
      { name: 'DevDocs Tech', url: 'https://devdocs.io', icon: 'bi-terminal', color: '#6366f1' },
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: 'bi-code-square', color: '#10b981' },
      { name: 'Medium', url: 'https://medium.com', icon: 'bi-medium', color: '#000000' },
      { name: 'Detik News', url: 'https://news.detik.com', icon: 'bi-newspaper', color: '#2563eb' },
      { name: 'Kompas.com', url: 'https://www.kompas.com', icon: 'bi-globe2', color: '#ea580c' },
      { name: 'GitHub Explore', url: 'https://github.com', icon: 'bi-github', color: '#1e293b' }
    ];

    // Multi-tab array
    const tabs = ref([
      {
        id: 1,
        title: 'Wikipedia ID',
        activeUrl: 'https://id.wikipedia.org',
        inputUrl: 'https://id.wikipedia.org',
        engineId: 'wikipedia',
        viewMode: 'iframe', // 'iframe' | 'reader'
        icon: 'bi-book-half',
        color: '#0284c7',
        hasFrameWarning: false,
        reloadKey: 1,
        history: ['https://id.wikipedia.org'],
        historyIndex: 0
      },
      {
        id: 2,
        title: 'DevDocs.io',
        activeUrl: 'https://devdocs.io',
        inputUrl: 'https://devdocs.io',
        engineId: 'devdocs',
        viewMode: 'iframe',
        icon: 'bi-terminal',
        color: '#6366f1',
        hasFrameWarning: false,
        reloadKey: 1,
        history: ['https://devdocs.io'],
        historyIndex: 0
      }
    ]);

    let nextTabId = 3;

    const currentTab = computed(() => {
      const found = tabs.value.find(t => t.id === activeTabId.value);
      return found || tabs.value[0];
    });

    const currentEngineConfig = computed(() => {
      return searchEngines.find(e => e.id === currentTab.value.engineId) || searchEngines[0];
    });

    // Article Draft State
    const articleDraft = ref({
      title: 'Catatan & Rangkuman Riset',
      content: `# Catatan Riset & Bahan Tulisan
- Topik: Pengembangan Web & Produktivitas
- Sumber Terpercaya: Wikipedia, MDN, DevDocs

## Poin Penting:
1. 
2. 

## Action Items untuk To-Do:
- [ ] Tinjau kembali referensi teknis
- [ ] Buat draf awal artikel`
    });

    // Load persisted draft from localStorage
    onMounted(() => {
      try {
        const savedDraft = localStorage.getItem('ft_browser_research_draft');
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          articleDraft.value = { ...articleDraft.value, ...parsed };
        }
      } catch (e) {}

      // Initial sample reader results
      performReaderSearch();
    });

    // Auto-save draft
    watch(articleDraft, (newVal) => {
      try {
        localStorage.setItem('ft_browser_research_draft', JSON.stringify(newVal));
        const now = new Date();
        lastSavedTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch (e) {}
    }, { deep: true });

    const draftWordCount = computed(() => {
      const text = (articleDraft.value.content || '').trim();
      if (!text) return 0;
      return text.split(/\s+/).filter(Boolean).length;
    });

    const draftCharCount = computed(() => {
      return (articleDraft.value.content || '').length;
    });

    // Tab Management
    const addNewTab = () => {
      const newId = nextTabId++;
      tabs.value.push({
        id: newId,
        title: 'Tab Baru',
        activeUrl: 'https://id.wikipedia.org',
        inputUrl: 'https://id.wikipedia.org',
        engineId: 'duckduckgo',
        viewMode: 'reader',
        icon: 'bi-compass',
        color: '#2563eb',
        hasFrameWarning: false,
        reloadKey: 1,
        history: ['https://id.wikipedia.org'],
        historyIndex: 0
      });
      activeTabId.value = newId;
    };

    const closeTab = (index) => {
      if (tabs.value.length <= 1) return;
      const closingId = tabs.value[index].id;
      tabs.value.splice(index, 1);
      if (activeTabId.value === closingId) {
        const nextActive = tabs.value[Math.max(0, index - 1)];
        activeTabId.value = nextActive ? nextActive.id : tabs.value[0].id;
      }
    };

    const setEngine = (engineId) => {
      currentTab.value.engineId = engineId;
      const eng = searchEngines.find(e => e.id === engineId);
      if (eng) {
        currentTab.value.icon = eng.icon;
        currentTab.value.color = eng.color;
      }
    };

    const handleOmniboxSubmit = () => {
      let input = (currentTab.value.inputUrl || '').trim();
      if (!input) return;

      let targetUrl = '';
      let isSearch = false;

      // Check if user input is an actual URL or search query
      if (input.startsWith('http://') || input.startsWith('https://')) {
        targetUrl = input;
      } else if (input.includes('.') && !input.includes(' ')) {
        targetUrl = 'https://' + input;
      } else {
        // It's a search keyword
        isSearch = true;
        const engine = currentEngineConfig.value;
        targetUrl = engine.searchUrl + encodeURIComponent(input);
        currentTab.value.title = input;
      }

      currentTab.value.activeUrl = targetUrl;
      currentTab.value.inputUrl = targetUrl;
      if (!isSearch) {
        try {
          const parsed = new URL(targetUrl);
          currentTab.value.title = parsed.hostname.replace('www.', '');
        } catch (e) {
          currentTab.value.title = input;
        }
      }

      // Add to history
      currentTab.value.history.push(targetUrl);
      currentTab.value.historyIndex = currentTab.value.history.length - 1;
      currentTab.value.reloadKey++;

      // If search query, also update reader mode search
      if (isSearch) {
        quickSearchTerm.value = input;
        performReaderSearch();
      }
    };

    const openBookmark = (bm) => {
      currentTab.value.activeUrl = bm.url;
      currentTab.value.inputUrl = bm.url;
      currentTab.value.title = bm.name;
      currentTab.value.icon = bm.icon;
      currentTab.value.color = bm.color;
      currentTab.value.reloadKey++;
    };

    const navigateBack = () => {
      if (currentTab.value.historyIndex > 0) {
        currentTab.value.historyIndex--;
        const prevUrl = currentTab.value.history[currentTab.value.historyIndex];
        currentTab.value.activeUrl = prevUrl;
        currentTab.value.inputUrl = prevUrl;
        currentTab.value.reloadKey++;
      }
    };

    const navigateForward = () => {
      if (currentTab.value.historyIndex < currentTab.value.history.length - 1) {
        currentTab.value.historyIndex++;
        const nextUrl = currentTab.value.history[currentTab.value.historyIndex];
        currentTab.value.activeUrl = nextUrl;
        currentTab.value.inputUrl = nextUrl;
        currentTab.value.reloadKey++;
      }
    };

    const reloadTab = () => {
      isReloading.value = true;
      currentTab.value.reloadKey++;
      setTimeout(() => {
        isReloading.value = false;
      }, 500);
    };

    const openActiveInRealTab = () => {
      const url = currentTab.value.activeUrl || currentTab.value.inputUrl;
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    };

    const onIframeLoaded = () => {
      // Gentle warning check for known framing restrictors
      const url = currentTab.value.activeUrl.toLowerCase();
      if (url.includes('google.com') || url.includes('github.com') || url.includes('medium.com')) {
        currentTab.value.hasFrameWarning = true;
      }
    };

    // Reader Mode Search via Public Wikipedia API
    const performReaderSearch = async () => {
      const query = quickSearchTerm.value.trim() || 'Produktivitas Kerja';
      readerLoading.value = true;

      try {
        const res = await fetch(
          `https://id.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=6`
        );
        const data = await res.json();

        if (data && data.query && data.query.search) {
          readerResults.value = data.query.search.map(item => ({
            title: item.title,
            snippet: item.snippet.replace(/<\/?[^>]+(>|$)/g, ''),
            url: `https://id.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
            source: 'Wikipedia Indonesia'
          }));
        } else {
          readerResults.value = getFallbackReaderResults(query);
        }
      } catch (err) {
        readerResults.value = getFallbackReaderResults(query);
      } finally {
        readerLoading.value = false;
      }
    };

    const getFallbackReaderResults = (query) => [
      {
        title: `Ikhtisar Riset: ${query}`,
        snippet: `${query} mencakup serangkaian metode, alat bantu digital, dan konsistensi alur kerja untuk menyelesaikan proyek tepat waktu. Menghubungkan riset ke eksekusi tugas harian mempercepat hasil kerja secara nyata.`,
        url: 'https://id.wikipedia.org',
        source: 'Arsip Riset Internal'
      },
      {
        title: `Manajemen Waktu & Pembuatan Artikel Berbasis Data`,
        snippet: 'Teknik drafting modern memadukan pengumpulan referensi langsung di satu layar dengan pemisahan tugas To-Do terstruktur.',
        url: 'https://developer.mozilla.org',
        source: 'Dokumentasi & Best Practices'
      }
    ];

    const searchKeyword = (kw) => {
      quickSearchTerm.value = kw;
      performReaderSearch();
    };

    // Scratchpad Actions
    const appendSnippetToDraft = (item) => {
      const snippetBlock = `\n\n### Kutipan: ${item.title}\n> "${item.snippet}"\nSumber: ${item.url}\n`;
      articleDraft.value.content += snippetBlock;

      store.dispatch('showNotification', {
        type: 'success',
        title: 'Kutipan Disalin ke Draf',
        message: `Kutipan "${item.title}" berhasil ditambahkan ke draf riset.`
      });
    };

    const copyAllResultsToDraft = () => {
      if (readerResults.value.length === 0) return;
      let text = `\n\n## Hasil Riset Referensi (${new Date().toLocaleDateString('id-ID')}):\n`;
      readerResults.value.forEach((r, idx) => {
        text += `\n${idx + 1}. **${r.title}**\n   "${r.snippet}"\n   Link: ${r.url}\n`;
      });
      articleDraft.value.content += text;

      store.dispatch('showNotification', {
        type: 'success',
        title: 'Riset Ditambahkan',
        message: 'Semua hasil riset disalin ke draf artikel.'
      });
    };

    const insertBulletPoint = () => {
      articleDraft.value.content += '\n- [ ] ';
    };

    const insertCurrentUrlAsSource = () => {
      const url = currentTab.value.activeUrl || currentTab.value.inputUrl;
      articleDraft.value.content += `\nReferensi: ${url} (Diakses: ${new Date().toLocaleDateString('id-ID')})\n`;
    };

    const clearDraft = () => {
      Swal.fire({
        title: 'Kosongkan Draf Riset?',
        text: 'Teks draf yang ada akan dibersihkan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Bersihkan',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          articleDraft.value.content = '';
        }
      });
    };

    const copyDraftToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(articleDraft.value.content);
        Swal.fire({
          icon: 'success',
          title: 'Teks Draf Tersalin!',
          text: 'Seluruh isi draf artikel telah disalin ke clipboard Anda.',
          timer: 1800,
          showConfirmButton: false
        });
      } catch (e) {
        store.dispatch('showNotification', {
          type: 'error',
          title: 'Gagal Menyalin',
          message: 'Gagal menyalin teks ke clipboard.'
        });
      }
    };

    // One-Click Integration: Send Draft to To-Do List
    const sendDraftToTodo = () => {
      const title = articleDraft.value.title || 'Tugas Baru dari Riset Web';
      const notes = (articleDraft.value.content || '').substring(0, 300) + '...';

      const newTask = {
        name: `Riset: ${title}`,
        category: 'Work',
        level: 'Penting',
        deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        notes: notes,
        done: false
      };

      store.dispatch('addTask', newTask);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil Masuk ke To-Do!',
        html: `
          <p class="mb-2">Tugas baru telah dibuat di antrean To-Do:</p>
          <strong>"${newTask.name}"</strong>
        `,
        showCancelButton: true,
        confirmButtonText: 'Buka To-Do Sekarang',
        cancelButtonText: 'Tetap di Browser',
        confirmButtonColor: '#2563eb'
      }).then((res) => {
        if (res.isConfirmed) {
          router.push('/todo');
        }
      });
    };

    // One-Click Integration: Send Draft to Sticky Notes
    const sendDraftToNotes = () => {
      const title = articleDraft.value.title || 'Catatan Riset Browser';
      const content = articleDraft.value.content || '';

      const newNote = {
        id: Date.now(),
        title: title,
        content: content,
        category: 'Work',
        color: '#fef08a', // warm sticky yellow
        pinned: true,
        createdAt: new Date().toISOString()
      };

      store.dispatch('addNote', newNote);

      Swal.fire({
        icon: 'success',
        title: 'Tersimpan ke Sticky Notes!',
        html: `
          <p class="mb-2">Draf riset telah disimpan sebagai catatan tempel:</p>
          <strong>"${newNote.title}"</strong>
        `,
        showCancelButton: true,
        confirmButtonText: 'Buka Notes',
        cancelButtonText: 'Tetap di Sini',
        confirmButtonColor: '#10b981'
      }).then((res) => {
        if (res.isConfirmed) {
          router.push('/notes');
        }
      });
    };

    return {
      showDrafterPanel,
      activeTabId,
      tabs,
      currentTab,
      searchEngines,
      currentEngineConfig,
      bookmarks,
      addNewTab,
      closeTab,
      setEngine,
      handleOmniboxSubmit,
      openBookmark,
      navigateBack,
      navigateForward,
      reloadTab,
      isReloading,
      openActiveInRealTab,
      onIframeLoaded,
      quickSearchTerm,
      readerLoading,
      readerResults,
      performReaderSearch,
      searchKeyword,
      articleDraft,
      draftWordCount,
      draftCharCount,
      lastSavedTime,
      appendSnippetToDraft,
      copyAllResultsToDraft,
      insertBulletPoint,
      insertCurrentUrlAsSource,
      clearDraft,
      copyDraftToClipboard,
      sendDraftToTodo,
      sendDraftToNotes
    };
  }
};
</script>

<style scoped>
.browser-research-suite {
  min-height: calc(100vh - 120px);
}

.browser-window-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.browser-tab-bar {
  background: #e2e8f0;
  border-bottom: 1px solid #cbd5e1;
}

.browser-tab {
  background: #cbd5e1;
  color: #475569;
  border: 1px solid #94a3b8;
  border-bottom: none;
  font-size: 12.5px;
  position: relative;
  max-width: 200px;
}

.browser-tab:hover {
  background: #f1f5f9;
}

.browser-tab.active {
  background: #ffffff;
  color: #0f172a;
  border-color: #cbd5e1;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.04);
}

.tab-close-btn:hover {
  color: #ef4444 !important;
}

.tab-add-btn:hover {
  background: #ffffff;
  color: #2563eb;
}

.omnibox-wrapper:focus-within {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
}

.spin-anim {
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hover-shadow:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.max-w-750 {
  max-width: 750px;
}

.drafter-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
