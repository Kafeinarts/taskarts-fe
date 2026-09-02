<template>
  <div id="app" :class="['app-container', themeMode === 'dark' ? 'dark-theme' : 'light-theme']" :style="{ '--primary-color': accentColor }">
    <!-- Global Toast Notifications -->
    <AppNotifications />

    <!-- Desktop Material Navigation Drawer -->
    <aside :class="['sidebar-nav', { collapsed: isCollapsed }]">
      <div class="sidebar-brand p-3 d-flex align-items-center justify-content-between">
        <div v-if="!isCollapsed" class="d-flex align-items-center gap-2">
          <img src="/logo.svg" alt="RajinKerja Logo" style="width: 34px; height: 34px;" class="rounded-3 shadow-sm p-0.5 bg-white border" />
          <div class="lh-1">
            <span class="fw-extrabold text-app fs-5 d-block" style="letter-spacing: -0.3px;">RajinKerja<span :style="{ color: accentColor }">.id</span></span>
            <small class="text-sub fw-bold text-uppercase d-block mt-1" style="font-size: 9px; letter-spacing: 0.8px;">WORKFLOW & TASK OS</small>
          </div>
        </div>
        <button class="btn btn-sm text-sub p-1 rounded-circle border-0 icon-hover" @click="isCollapsed = !isCollapsed" title="Toggle Sidebar">
          <i :class="isCollapsed ? 'bi bi-layout-sidebar-reverse fs-5' : 'bi bi-layout-sidebar fs-5'"></i>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="sidebar-links p-2 flex-grow-1">
        <!-- GROUP 1: WORKFLOW & PROYEK -->
        <div v-if="!isCollapsed" class="sidebar-section-header">📌 WORKFLOW & PROYEK</div>
        <div v-else class="sidebar-divider my-1"></div>

        <router-link to="/" class="material-nav-link" title="Dashboard">
          <i class="bi bi-grid-1x2-fill me-3 fs-5 nav-icon text-primary"></i>
          <span v-if="!isCollapsed" class="nav-label">Dashboard</span>
        </router-link>

        <router-link to="/todo" class="material-nav-link" title="To-Do & Kanban">
          <i class="bi bi-kanban-fill me-3 fs-5 nav-icon text-warning"></i>
          <span v-if="!isCollapsed" class="nav-label">To-Do & Kanban</span>
          <span v-if="!isCollapsed && pendingTasksCount > 0" class="badge rounded-pill bg-warning text-dark ms-auto small fw-bold">
            {{ pendingTasksCount }}
          </span>
        </router-link>

        <router-link to="/project" class="material-nav-link" title="Proyek & Kontrak">
          <i class="bi bi-folder-fill me-3 fs-5 nav-icon text-info"></i>
          <span v-if="!isCollapsed" class="nav-label">Proyek & Kontrak</span>
          <span v-if="!isCollapsed && activeProjectsCount > 0" class="badge rounded-pill bg-info text-dark ms-auto small fw-bold">
            {{ activeProjectsCount }}
          </span>
        </router-link>

        <router-link to="/camera" class="material-nav-link" title="Kamera Scan Dokumen">
          <i class="bi bi-camera-fill me-3 fs-5 nav-icon text-danger"></i>
          <span v-if="!isCollapsed" class="nav-label">Kamera & Scan Dokumen</span>
        </router-link>

        <router-link to="/surat" class="material-nav-link" title="Surat Builder Generator">
          <i class="bi bi-file-earmark-text-fill me-3 fs-5 nav-icon text-primary"></i>
          <span v-if="!isCollapsed" class="nav-label">Surat Generator</span>
        </router-link>

        <router-link to="/cv" class="material-nav-link" title="CV & Resume Builder">
          <i class="bi bi-person-vcard-fill me-3 fs-5 nav-icon text-success"></i>
          <span v-if="!isCollapsed" class="nav-label">CV & Resume Builder</span>
        </router-link>

        <router-link to="/videos" class="material-nav-link" title="Tonton & Upload Video (YouTube Sync)">
          <i class="bi bi-play-btn-fill me-3 fs-5 nav-icon text-danger"></i>
          <span v-if="!isCollapsed" class="nav-label">Tonton & Sync Video</span>
          <span v-if="!isCollapsed" class="badge rounded-pill bg-danger text-white ms-auto small fw-bold">YouTube</span>
        </router-link>

        <div class="sidebar-divider my-2"></div>

        <!-- GROUP 2: TIM & KOMUNIKASI -->
        <div v-if="!isCollapsed" class="sidebar-section-header">👥 TIM & KOMUNIKASI</div>
        <div v-else class="sidebar-divider my-1"></div>

        <router-link to="/contacts" class="material-nav-link" title="Kontak Tim & Broadcast WA">
          <i class="bi bi-person-lines-fill me-3 fs-5 nav-icon text-success"></i>
          <span v-if="!isCollapsed" class="nav-label">Kontak Tim & WA</span>
          <span v-if="!isCollapsed && totalClientsCount > 0" class="badge rounded-pill bg-success text-white ms-auto small fw-bold">
            {{ totalClientsCount }}
          </span>
        </router-link>

        <router-link to="/chat-ai" class="material-nav-link" title="Live Chat AI Assistant">
          <i class="bi bi-robot me-3 fs-5 nav-icon text-info"></i>
          <span v-if="!isCollapsed" class="nav-label">Live Chat AI</span>
          <span v-if="!isCollapsed" class="badge rounded-pill bg-info text-dark ms-auto small fw-bold">AI</span>
        </router-link>

        <div class="sidebar-divider my-2"></div>

        <!-- GROUP 3: KEUANGAN & DATA -->
        <div v-if="!isCollapsed" class="sidebar-section-header">💰 KEUANGAN & DATA</div>
        <div v-else class="sidebar-divider my-1"></div>

        <router-link to="/finance" class="material-nav-link" title="Keuangan & Tracker">
          <i class="bi bi-wallet2 me-3 fs-5 nav-icon text-primary"></i>
          <span v-if="!isCollapsed" class="nav-label">Keuangan</span>
          <span v-if="!isCollapsed && isBudgetExceeded" class="badge rounded-pill bg-danger text-white ms-auto small fw-bold">
            Over Budget
          </span>
        </router-link>

        <router-link to="/rab" class="material-nav-link" title="RAB & Kas Kegiatan Kepanitiaan">
          <i class="bi bi-calculator-fill me-3 fs-5 nav-icon text-success"></i>
          <span v-if="!isCollapsed" class="nav-label">RAB & Kas Kegiatan</span>
          <span v-if="!isCollapsed" class="badge rounded-pill bg-success text-white ms-auto small fw-bold">NEW</span>
        </router-link>

        <router-link to="/invoice" class="material-nav-link" title="Invoice Generator (PDF)">
          <i class="bi bi-receipt me-3 fs-5 nav-icon text-indigo"></i>
          <span v-if="!isCollapsed" class="nav-label">Invoice Generator</span>
        </router-link>

        <router-link to="/sql" class="material-nav-link" title="SQL Data Export & Runner">
          <i class="bi bi-database-fill-gear me-3 fs-5 nav-icon text-warning"></i>
          <span v-if="!isCollapsed" class="nav-label">SQL Data Export</span>
        </router-link>

        <div class="sidebar-divider my-2"></div>

        <!-- GROUP 4: AGENDA, HEALTH & PRODUKTIVITAS -->
        <div v-if="!isCollapsed" class="sidebar-section-header">📅 AGENDA & PRODUKTIVITAS</div>
        <div v-else class="sidebar-divider my-1"></div>

        <router-link to="/productivity-insights" class="material-nav-link" title="Productivity Insights & D3.js Charts">
          <i class="bi bi-bar-chart-line-fill me-3 fs-5 nav-icon text-primary"></i>
          <span v-if="!isCollapsed" class="nav-label">Productivity Insights</span>
          <span v-if="!isCollapsed" class="badge rounded-pill bg-primary text-white ms-auto small fw-bold">D3.js</span>
        </router-link>

        <router-link to="/quick-capture" class="material-nav-link" title="Quick Capture Notes & Alarms">
          <i class="bi bi-lightning-charge-fill me-3 fs-5 nav-icon text-warning"></i>
          <span v-if="!isCollapsed" class="nav-label">Quick Capture</span>
        </router-link>

        <router-link to="/calendar" class="material-nav-link" title="Kalender Agenda & Timed Events">
          <i class="bi bi-calendar3 me-3 fs-5 nav-icon text-warning"></i>
          <span v-if="!isCollapsed" class="nav-label">Kalender & Agenda</span>
        </router-link>

        <router-link to="/time-suite" class="material-nav-link" title="Time Suite & Pomodoro Timer">
          <i class="bi bi-clock-history me-3 fs-5 nav-icon text-success"></i>
          <span v-if="!isCollapsed" class="nav-label">Time Suite & Pomodoro</span>
        </router-link>

        <router-link to="/selfie" class="material-nav-link" title="Selfie for Happiness & Auto Backup Drive">
          <i class="bi bi-camera-reels-fill me-3 fs-5 nav-icon text-danger"></i>
          <span v-if="!isCollapsed" class="nav-label">Selfie for Happiness</span>
        </router-link>

        <router-link to="/mood" class="material-nav-link" title="On-Cam Mood Tracker & Alarm Kerja">
          <i class="bi bi-emoji-smile-fill me-3 fs-5 nav-icon text-danger"></i>
          <span v-if="!isCollapsed" class="nav-label">Kamera Mood & Alarm</span>
        </router-link>

        <router-link to="/notes" class="material-nav-link" title="Sticky Notes & Scratchpad">
          <i class="bi bi-journal-text me-3 fs-5 nav-icon text-secondary"></i>
          <span v-if="!isCollapsed" class="nav-label">Notes & Scratchpad</span>
        </router-link>

        <router-link to="/diary" class="material-nav-link" title="Diary & Jurnal Cerita Harian">
          <i class="bi bi-book-half me-3 fs-5 nav-icon text-warning"></i>
          <span v-if="!isCollapsed" class="nav-label">Diary & Jurnal Cerita</span>
          <span v-if="!isCollapsed" class="badge rounded-pill bg-warning text-dark ms-auto small fw-bold">Foto</span>
        </router-link>

        <router-link to="/code-notes" class="material-nav-link" title="Code Snippets & Tech Notes">
          <i class="bi bi-code-slash me-3 fs-5 nav-icon text-info"></i>
          <span v-if="!isCollapsed" class="nav-label">Code Snippets</span>
        </router-link>

        <router-link to="/games" class="material-nav-link" title="Mini Games & 3D Simulator">
          <i class="bi bi-controller me-3 fs-5 nav-icon text-purple"></i>
          <span v-if="!isCollapsed" class="nav-label">3D Games & Simulator</span>
        </router-link>

        <div class="sidebar-divider my-2"></div>

        <!-- GROUP 5: SISTEM & PANDUAN -->
        <div v-if="!isCollapsed" class="sidebar-section-header">⚙️ SISTEM & PANDUAN</div>
        <div v-else class="sidebar-divider my-1"></div>

        <router-link to="/preferences" class="material-nav-link" title="Preferences, Theme & Backup">
          <i class="bi bi-sliders me-3 fs-5 nav-icon text-primary"></i>
          <span v-if="!isCollapsed" class="nav-label">Preferences</span>
        </router-link>

        <router-link to="/faq" class="material-nav-link" title="FAQ, Panduan & Tentang App">
          <i class="bi bi-question-circle-fill me-3 fs-5 nav-icon text-info"></i>
          <span v-if="!isCollapsed" class="nav-label">Info & Hidden Features</span>
        </router-link>

        <router-link to="/developer" class="material-nav-link" title="Developer Portfolio & Journey">
          <i class="bi bi-person-badge-fill me-3 fs-5 nav-icon text-primary"></i>
          <span v-if="!isCollapsed" class="nav-label">View Developer</span>
          <span v-if="!isCollapsed" class="badge rounded-pill bg-primary text-white ms-auto small fw-bold">PRO</span>
        </router-link>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-3 border-top divider-color" v-if="!isCollapsed">
        <router-link to="/preferences" class="btn btn-sm btn-outline-theme w-100 rounded-pill text-start mb-2 d-flex align-items-center gap-2">
          <i class="bi bi-palette"></i> Theme & Color Settings
        </router-link>
        <button @click="showDukungModal = true" class="btn btn-sm btn-success w-100 rounded-pill fw-semibold text-center d-flex align-items-center justify-content-center gap-1.5 shadow-xs">
          <i class="bi bi-heart-fill text-white"></i> ☕ Dukung Dev
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div :class="['main-content', { expanded: isCollapsed }]">
      <!-- Top Bar Header -->
      <header class="top-header border-bottom px-3 px-md-4 py-2 d-flex align-items-center justify-content-between sticky-top">
        <div class="d-flex align-items-center gap-2 gap-md-3">
          <button class="btn btn-light d-md-none rounded-3 p-1.5" @click="mobileDrawer = true" title="Menu">
            <i class="bi bi-list fs-4"></i>
          </button>
        </div>

        <div class="d-flex align-items-center gap-2">
          <!-- Quick Camera Shortcut Button -->
          <router-link to="/camera" class="btn btn-sm btn-light border rounded-circle p-0 d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;" title="Scan Kamera">
            <i class="bi bi-camera-fill text-secondary fs-6"></i>
          </router-link>

          <!-- Quick Mood Tracker & Alarm Shortcut Button -->
          <router-link to="/mood" class="btn btn-sm btn-light border rounded-circle p-0 d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;" title="Mood & Alarm">
            <i class="bi bi-emoji-smile-fill text-danger fs-6"></i>
          </router-link>

          <!-- Budget Alert Warning if exceeded -->
          <div v-if="isBudgetExceeded" class="badge bg-danger-subtle text-danger border border-danger rounded-circle p-0 d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;" title="Over Budget!">
            <i class="bi bi-exclamation-triangle-fill fs-6"></i>
          </div>

          <!-- Theme Switcher Button (Light / Dark / OLED True Black) -->
          <button 
            @click="toggleThemeMode" 
            class="btn btn-sm btn-light border rounded-circle p-0 d-flex align-items-center justify-content-center" 
            style="width: 36px; height: 36px;" 
            :title="themeMode === 'light' ? 'Mode Terang (Klik untuk Dark Slate)' : (themeMode === 'dark' ? 'Mode Gelap Slate (Klik untuk OLED True Black)' : 'True Black OLED (Klik untuk Mode Terang)')"
          >
            <i v-if="themeMode === 'light'" class="bi bi-sun-fill text-warning fs-6"></i>
            <i v-else-if="themeMode === 'dark'" class="bi bi-moon-stars-fill text-info fs-6"></i>
            <i v-else class="bi bi-circle-fill text-white bg-dark rounded-circle border border-secondary p-0.5" style="font-size: 10px;"></i>
          </button>

          <!-- Preferences Link -->
          <router-link to="/preferences" class="btn btn-sm btn-light border rounded-circle p-0 d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;" title="Preferences">
            <i class="bi bi-gear-fill text-primary fs-6"></i>
          </router-link>
        </div>
      </header>

      <!-- Mobile Offcanvas Drawer -->
      <transition name="overlay-fade">
        <div class="offcanvas-overlay" v-if="mobileDrawer" @click="mobileDrawer = false"></div>
      </transition>
      
      <transition name="drawer-slide">
        <div class="mobile-drawer p-3" v-if="mobileDrawer">
          <div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
            <div class="d-flex align-items-center gap-2">
              <img src="/logo.svg" alt="RajinKerja Logo" style="width: 28px; height: 28px;" class="rounded-3 shadow-sm p-0.5 bg-white border" />
              <div class="fw-bold fs-5 text-app">Menu Utama</div>
            </div>
            <button class="btn btn-sm btn-light rounded-circle shadow-sm" @click="mobileDrawer = false" title="Tutup Menu">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <nav class="d-flex flex-column gap-1" @click="mobileDrawer = false">
            <div class="sidebar-section-header px-1 pt-1">📌 WORKFLOW & DOKUMEN</div>
            <router-link to="/" class="material-nav-link"><i class="bi bi-grid-1x2-fill me-3 text-primary"></i>Dashboard</router-link>
            <router-link to="/todo" class="material-nav-link"><i class="bi bi-kanban-fill me-3 text-warning"></i>To-Do & Kanban</router-link>
            <router-link to="/project" class="material-nav-link"><i class="bi bi-folder-fill me-3 text-info"></i>Proyek & Kontrak</router-link>
            <router-link to="/camera" class="material-nav-link"><i class="bi bi-camera-fill me-3 text-danger"></i>Kamera & Scan Dokumen</router-link>
            <router-link to="/surat" class="material-nav-link"><i class="bi bi-file-earmark-text-fill me-3 text-primary"></i>Surat Generator</router-link>
            <router-link to="/cv" class="material-nav-link"><i class="bi bi-person-vcard-fill me-3 text-success"></i>CV & Resume Builder</router-link>

            <div class="sidebar-divider my-2"></div>
            <div class="sidebar-section-header px-1">👥 TIM & KOMUNIKASI</div>
            <router-link to="/contacts" class="material-nav-link"><i class="bi bi-person-lines-fill me-3 text-success"></i>Kontak Tim & WA</router-link>
            <router-link to="/chat-ai" class="material-nav-link"><i class="bi bi-robot me-3 text-info"></i>Live Chat AI Assistant</router-link>

            <div class="sidebar-divider my-2"></div>
            <div class="sidebar-section-header px-1">💰 KEUANGAN & DATA</div>
            <router-link to="/finance" class="material-nav-link"><i class="bi bi-wallet2 me-3 text-primary"></i>Keuangan</router-link>
            <router-link to="/rab" class="material-nav-link"><i class="bi bi-calculator-fill me-3 text-success"></i>RAB & Kas Kegiatan</router-link>
            <router-link to="/invoice" class="material-nav-link"><i class="bi bi-receipt me-3 text-info"></i>Invoice Generator</router-link>
            <router-link to="/sql" class="material-nav-link"><i class="bi bi-database-fill-gear me-3 text-warning"></i>SQL Data Export</router-link>

            <div class="sidebar-divider my-2"></div>
            <div class="sidebar-section-header px-1">📅 AGENDA & PRODUKTIVITAS</div>
            <router-link to="/calendar" class="material-nav-link"><i class="bi bi-calendar3 me-3 text-warning"></i>Kalender & Agenda</router-link>
            <router-link to="/time-suite" class="material-nav-link"><i class="bi bi-clock-history me-3 text-success"></i>Time Suite & Pomodoro</router-link>
            <router-link to="/selfie" class="material-nav-link"><i class="bi bi-camera-reels-fill me-3 text-danger"></i>Selfie for Happiness</router-link>
            <router-link to="/mood" class="material-nav-link"><i class="bi bi-emoji-smile-fill me-3 text-danger"></i>Kamera Mood & Alarm</router-link>
            <router-link to="/notes" class="material-nav-link"><i class="bi bi-journal-text me-3 text-secondary"></i>Notes & Scratchpad</router-link>
            <router-link to="/diary" class="material-nav-link"><i class="bi bi-book-half me-3 text-warning"></i>Diary & Jurnal Cerita</router-link>
            <router-link to="/code-notes" class="material-nav-link"><i class="bi bi-code-slash me-3 text-info"></i>Code Snippets</router-link>
            <router-link to="/games" class="material-nav-link"><i class="bi bi-controller me-3 text-purple"></i>3D Games & Simulator</router-link>

            <div class="sidebar-divider my-2"></div>
            <div class="sidebar-section-header px-1">⚙️ SISTEM & PANDUAN</div>
            <router-link to="/preferences" class="material-nav-link"><i class="bi bi-sliders me-3 text-primary"></i>Preferences & Install PWA</router-link>
            <router-link to="/faq" class="material-nav-link"><i class="bi bi-question-circle-fill me-3 text-info"></i>FAQ & About App</router-link>
            <router-link to="/developer" class="material-nav-link"><i class="bi bi-person-badge-fill me-3 text-primary"></i>View Developer</router-link>
          </nav>

          <div class="p-2 border-top mt-3">
            <button @click="mobileDrawer = false; showDukungModal = true" class="btn btn-sm btn-success w-100 rounded-pill fw-semibold text-center d-flex align-items-center justify-content-center gap-1.5 shadow-xs">
              <i class="bi bi-heart-fill text-white"></i> ☕ Dukung Dev (Bank & E-Wallet)
            </button>
          </div>
        </div>
      </transition>

      <!-- Dukung Dev Modal Popup (Bank & E-Wallet) -->
      <DukungDevModal v-model="showDukungModal" />

      <!-- Main Router View Container with Fade-Slide Animation -->
      <div class="p-3 p-md-4">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <!-- Mobile Bottom Nav Bar -->
      <nav class="mobile-bottom-bar d-md-none border-top fixed-bottom d-flex justify-content-around py-2 shadow-lg">
        <router-link to="/" class="mobile-nav-btn" active-class="active">
          <i class="bi bi-grid-1x2-fill"></i>
          <span>Home</span>
        </router-link>
        <router-link to="/todo" class="mobile-nav-btn" active-class="active">
          <i class="bi bi-check2-square"></i>
          <span>To-Do</span>
        </router-link>
        <router-link to="/camera" class="mobile-nav-btn" active-class="active">
          <i class="bi bi-camera-fill text-danger"></i>
          <span>Scan</span>
        </router-link>
        <router-link to="/finance" class="mobile-nav-btn" active-class="active">
          <i class="bi bi-wallet2"></i>
          <span>Keuangan</span>
        </router-link>
        <router-link to="/preferences" class="mobile-nav-btn" active-class="active">
          <i class="bi bi-sliders"></i>
          <span>Settings</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import AppNotifications from './components/AppNotifications.vue';
import DukungDevModal from './components/DukungDevModal.vue';

export default {
  name: 'App',
  components: {
    AppNotifications,
    DukungDevModal
  },
  setup() {
    const store = useStore();
    const isCollapsed = ref(false);
    const mobileDrawer = ref(false);
    const showDukungModal = ref(false);

    const pendingTasksCount = computed(() => store.getters.pendingTasksCount);
    const activeProjectsCount = computed(() => store.getters.activeProjectsCount);
    const totalClientsCount = computed(() => store.getters.totalClientsCount);
    const isBudgetExceeded = computed(() => store.getters.isBudgetExceeded);
    const themeMode = computed(() => store.getters.getThemeMode);
    const accentColor = computed(() => store.getters.getAccentColor);

    const applyThemeToBody = (mode) => {
      document.body.classList.remove('light-theme', 'dark-theme', 'oled-theme', 'dark-mode');

      if (mode === 'oled') {
        document.body.classList.add('oled-theme', 'dark-mode');
        document.body.style.backgroundColor = '#000000';
        document.body.style.color = '#ffffff';
      } else if (mode === 'dark') {
        document.body.classList.add('dark-theme', 'dark-mode');
        document.body.style.backgroundColor = '#090d16';
        document.body.style.color = '#f1f5f9';
      } else {
        document.body.classList.add('light-theme');
        document.body.style.backgroundColor = '#f8fafc';
        document.body.style.color = '#0f172a';
      }
    };

    watch(themeMode, (newVal) => {
      applyThemeToBody(newVal);
    }, { immediate: true });

    onMounted(() => {
      applyThemeToBody(themeMode.value);

      // Automated Nightly Local Storage Backup Check
      const isNightlyEnabled = localStorage.getItem('ft_auto_nightly_backup') !== 'false';
      if (isNightlyEnabled) {
        const lastBackup = localStorage.getItem('ft_last_nightly_backup_date');
        const today = new Date().toISOString().split('T')[0];
        if (lastBackup !== today) {
          let videos = [];
          let customFolders = [];
          try {
            videos = JSON.parse(localStorage.getItem('ft_saved_video_hub_list') || '[]');
          } catch (e) {}
          try {
            customFolders = JSON.parse(localStorage.getItem('ft_custom_folders') || '[]');
          } catch (e) {}

          const fullState = {
            app: 'RajinKerja',
            version: '2.5',
            exportDate: new Date().toISOString(),
            rabItems: store.getters.getRabItems || [],
            rabIncomes: store.getters.getRabIncomes || [],
            rabExpenses: store.getters.getRabExpenses || [],
            tasks: store.getters.getTasks || [],
            projects: store.getters.getProjects || [],
            transactions: store.getters.getTransactions || [],
            invoices: store.getters.getInvoices || [],
            contacts: store.getters.getContacts || [],
            habits: store.getters.getHabits || [],
            notes: store.getters.getNotes || [],
            events: store.getters.getEvents || [],
            codeNotes: store.getters.getCodeNotes || [],
            suratList: store.getters.getSuratList || [],
            cvData: store.getters.getCvData || {},
            userProfile: store.getters.getUserProfile || {},
            myBusiness: store.getters.getMyBusiness || {},
            moodLogs: store.getters.getMoodLogs || [],
            workAlarms: store.getters.getWorkAlarms || [],
            selfieGallery: store.getters.getSelfieGallery || [],
            videos,
            customFolders,
            themeMode: store.getters.getThemeMode,
            accentColor: store.getters.getAccentColor,
            budgetThreshold: store.getters.getBudgetThreshold,
            welcomeBanner: store.getters.getWelcomeBanner,
            geminiApiKey: store.getters.getGeminiApiKey,
            aiProvider: store.getters.getAiProvider,
            aiModel: store.getters.getAiModel
          };
          localStorage.setItem('ft_nightly_backup_snapshot', JSON.stringify(fullState));
          localStorage.setItem('ft_last_nightly_backup_date', today);
          localStorage.setItem('ft_last_nightly_backup_time', new Date().toLocaleTimeString('id-ID'));
        }
      }

      // Listen for PWA Install Prompt Event
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.deferredPwaPrompt = e;
        window.dispatchEvent(new CustomEvent('pwa-prompt-available'));
      });

      // Global Listener to open Dukung Dev Modal
      window.addEventListener('open-dukung-dev', () => {
        showDukungModal.value = true;
      });
    });

    const toggleThemeMode = () => {
      let next = 'light';
      if (themeMode.value === 'light') next = 'dark';
      else if (themeMode.value === 'dark') next = 'oled';
      else next = 'light';
      store.dispatch('setThemeMode', next);
    };

    return {
      isCollapsed,
      mobileDrawer,
      showDukungModal,
      pendingTasksCount,
      activeProjectsCount,
      totalClientsCount,
      isBudgetExceeded,
      themeMode,
      accentColor,
      toggleThemeMode
    };
  }
};
</script>

<style>
/* Global Anti-Horizontal Scroll & Mobile Constraints */
html, body, #app, .app-container {
  max-width: 100vw !important;
  overflow-x: hidden !important;
}

.main-content {
  max-width: 100% !important;
  overflow-x: hidden !important;
}
/* CSS Variables & Themes */
:root {
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 76px;
  --primary-color: #2563eb;
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --text-main: #0f172a;
  --text-sub: #64748b;
  --border-color: #e2e8f0;

  --sidebar-bg: #ffffff;
  --sidebar-text: #475569;
  --sidebar-hover-bg: #f1f5f9;
  --sidebar-active-bg: var(--primary-color);
  --sidebar-active-text: #ffffff;
  --sidebar-divider: #e2e8f0;
  --sidebar-header-color: #94a3b8;
  --sidebar-border: #e2e8f0;
}

/* Light Theme Variables */
.light-theme {
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --bg-card: #ffffff;
  --bg-input: #ffffff;
  --bg-hover: #f1f5f9;
  --text-main: #0f172a;
  --text-sub: #64748b;
  --border-color: #e2e8f0;

  --sidebar-bg: #ffffff;
  --sidebar-text: #475569;
  --sidebar-hover-bg: #f1f5f9;
  --sidebar-active-bg: var(--primary-color);
  --sidebar-active-text: #ffffff;
  --sidebar-divider: #e2e8f0;
  --sidebar-header-color: #94a3b8;
  --sidebar-border: #e2e8f0;
}

/* Dark Theme Variables (Slate Charcoal) */
.dark-theme {
  --bg-app: #090d16;
  --bg-surface: #131b2e;
  --bg-card: #131b2e;
  --bg-input: #1a233a;
  --bg-hover: rgba(255, 255, 255, 0.08);
  --text-main: #f1f5f9;
  --text-sub: #94a3b8;
  --border-color: #1e293b;

  --sidebar-bg: #0d1322;
  --sidebar-text: #94a3b8;
  --sidebar-hover-bg: rgba(255, 255, 255, 0.06);
  --sidebar-active-bg: var(--primary-color);
  --sidebar-active-text: #ffffff;
  --sidebar-divider: #1e293b;
  --sidebar-header-color: #64748b;
  --sidebar-border: #1e293b;
}

/* OLED True Black Theme Variables (Pure #000000 High Contrast) */
.oled-theme {
  --bg-app: #000000;
  --bg-surface: #0a0a0a;
  --bg-card: #0d0d0d;
  --bg-input: #171717;
  --bg-hover: #222222;
  --text-main: #ffffff;
  --text-sub: #d4d4d8;
  --border-color: #27272a;

  --sidebar-bg: #000000;
  --sidebar-text: #a1a1aa;
  --sidebar-hover-bg: #18181b;
  --sidebar-active-bg: var(--primary-color);
  --sidebar-active-text: #ffffff;
  --sidebar-divider: #27272a;
  --sidebar-header-color: #71717a;
  --sidebar-border: #27272a;
}

body {
  font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg-app);
  color: var(--text-main);
  margin: 0;
  padding: 0;
  transition: background-color 0.25s ease, color 0.25s ease;
}

/* =========================================================
   Unified Dark Reader Style Inversion Engine (.dark-mode)
   ========================================================= */
.dark-mode .bg-white,
.dark-mode .card:not(.pwa-pure-black-card),
.dark-mode .top-header,
.dark-mode .modal-content,
.dark-mode .mobile-bottom-bar,
.dark-mode .accordion-item,
.dark-mode .offcanvas,
.dark-mode .offcanvas-body,
.dark-mode .dropdown-menu,
.dark-mode .list-group-item {
  background-color: var(--bg-surface) !important;
  color: var(--text-main) !important;
  border-color: var(--border-color) !important;
}

.dark-mode .text-dark,
.dark-mode .text-black,
.dark-mode h1, .dark-mode h2, .dark-mode h3, .dark-mode h4, .dark-mode h5, .dark-mode h6,
.dark-mode .card-title,
.dark-mode .form-label,
.dark-mode .navbar-brand,
.dark-mode strong {
  color: var(--text-main) !important;
}

.dark-mode .text-muted,
.dark-mode .text-secondary,
.dark-mode small.text-muted,
.dark-mode .small.text-muted {
  color: var(--text-sub) !important;
}

.dark-mode .bg-light,
.dark-mode .bg-body-tertiary,
.dark-mode .table-light,
.dark-mode .input-group-text,
.dark-mode .preview-box {
  background-color: var(--bg-input) !important;
  color: var(--text-main) !important;
  border-color: var(--border-color) !important;
}

.dark-mode .btn-light {
  background-color: var(--bg-input) !important;
  color: var(--text-main) !important;
  border-color: var(--border-color) !important;
}

.dark-mode .btn-light:hover {
  background-color: var(--bg-hover) !important;
  color: #ffffff !important;
}

.dark-mode .btn-outline-secondary {
  border-color: var(--border-color) !important;
  color: var(--text-sub) !important;
}

.dark-mode .btn-outline-secondary:hover {
  background-color: var(--bg-hover) !important;
  color: #ffffff !important;
}

.dark-mode .table,
.dark-mode .table th,
.dark-mode .table td {
  color: var(--text-main) !important;
  border-color: var(--border-color) !important;
}

.dark-mode .table-hover tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: #ffffff !important;
}

.dark-mode .form-control,
.dark-mode .form-select,
.dark-mode textarea {
  background-color: var(--bg-input) !important;
  color: #ffffff !important;
  border-color: var(--border-color) !important;
}

.dark-mode .form-control::placeholder,
.dark-mode textarea::placeholder {
  color: #64748b !important;
}

.dark-mode .form-control:focus,
.dark-mode .form-select:focus {
  background-color: var(--bg-input) !important;
  color: #ffffff !important;
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.25) !important;
}

.dark-mode .modal-header,
.dark-mode .modal-footer {
  border-color: var(--border-color) !important;
}

.dark-mode .btn-close {
  filter: invert(1) grayscale(100%) brightness(200%);
}

.dark-mode .border,
.dark-mode .border-top,
.dark-mode .border-bottom,
.dark-mode .border-start,
.dark-mode .border-end,
.dark-mode .border-2 {
  border-color: var(--border-color) !important;
}

.dark-mode .badge.bg-light {
  background-color: var(--bg-input) !important;
  color: var(--text-main) !important;
  border-color: var(--border-color) !important;
}

/* High-Contrast Badge Badges for Dark Readers */
.dark-mode .bg-primary-subtle {
  background-color: rgba(37, 99, 235, 0.2) !important;
  color: #60a5fa !important;
}

.dark-mode .bg-success-subtle {
  background-color: rgba(16, 185, 129, 0.2) !important;
  color: #34d399 !important;
}

.dark-mode .bg-warning-subtle {
  background-color: rgba(245, 158, 11, 0.2) !important;
  color: #fbbf24 !important;
}

.dark-mode .bg-danger-subtle {
  background-color: rgba(225, 29, 72, 0.2) !important;
  color: #f87171 !important;
}

.dark-mode .bg-info-subtle {
  background-color: rgba(13, 148, 136, 0.2) !important;
  color: #2dd4bf !important;
}

/* =========================================================
   True Black OLED Specific Overrides (Pure #000000 Power Saving)
   ========================================================= */
.oled-theme,
.oled-theme body,
.oled-theme .app-container,
.oled-theme .main-content,
.oled-theme .sidebar-nav,
.oled-theme .mobile-drawer,
.oled-theme .top-header,
.oled-theme .mobile-bottom-bar {
  background-color: #000000 !important;
  color: #ffffff !important;
}

.oled-theme .bg-white,
.oled-theme .card:not(.pwa-pure-black-card),
.oled-theme .modal-content,
.oled-theme .dropdown-menu,
.oled-theme .accordion-item,
.oled-theme .offcanvas {
  background-color: #0d0d0d !important;
  border-color: #262626 !important;
  color: #ffffff !important;
}

.oled-theme .bg-light,
.oled-theme .bg-body-tertiary,
.oled-theme .input-group-text,
.oled-theme .preview-box {
  background-color: #171717 !important;
  color: #ffffff !important;
  border-color: #333333 !important;
}

.oled-theme .form-control,
.oled-theme .form-select,
.oled-theme textarea {
  background-color: #121212 !important;
  color: #ffffff !important;
  border-color: #383838 !important;
}

.oled-theme .form-control::placeholder,
.oled-theme textarea::placeholder {
  color: #a1a1aa !important;
}

.oled-theme .border,
.oled-theme .border-top,
.oled-theme .border-bottom,
.oled-theme .border-start,
.oled-theme .border-end,
.oled-theme .border-2 {
  border-color: #262626 !important;
}

.oled-theme .btn-light {
  background-color: #1a1a1a !important;
  color: #ffffff !important;
  border-color: #333333 !important;
}

.oled-theme .btn-light:hover {
  background-color: #292929 !important;
}

/* Modals backdrop styling */
.modal-backdrop {
  background-color: rgba(15, 23, 42, 0.7);
}

.modal-backdrop.show {
  opacity: 0.7 !important;
}

.app-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-app);
  color: var(--text-main);
}

/* Material Design Sidebar Drawer */
.sidebar-nav {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background-color: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  transition: width 0.25s cubic-bezier(0.2, 0, 0, 1), background-color 0.3s ease;
  z-index: 1040;
  border-right: 1px solid var(--sidebar-border);
}

.sidebar-nav.collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar-brand {
  border-bottom: 1px solid var(--sidebar-divider);
}

.sidebar-links {
  overflow-y: auto;
}

.sidebar-section-header {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.9px;
  color: var(--sidebar-header-color);
  text-transform: uppercase;
  padding: 14px 12px 6px 12px;
}

.sidebar-divider {
  height: 1px;
  background-color: var(--sidebar-divider);
  margin: 10px 6px;
  opacity: 0.85;
}

.material-nav-link {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 12px;
  color: var(--sidebar-text);
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 600;
  margin-bottom: 2px;
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.material-nav-link:hover {
  background-color: var(--sidebar-hover-bg);
  color: var(--text-main);
  transform: translateX(2px);
}

.material-nav-link.router-link-active,
.material-nav-link.router-link-exact-active {
  background-color: var(--sidebar-active-bg);
  color: var(--sidebar-active-text) !important;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.22);
}

.text-app {
  color: var(--text-main);
}

.btn-outline-theme {
  border-color: var(--sidebar-divider);
  color: var(--sidebar-text);
}

.btn-outline-theme:hover {
  background-color: var(--sidebar-hover-bg);
  color: var(--text-main);
}

.divider-color {
  border-color: var(--sidebar-divider) !important;
}

/* Main Content Area */
.main-content {
  margin-left: var(--sidebar-width);
  flex: 1;
  min-width: 0;
  transition: margin-left 0.25s cubic-bezier(0.2, 0, 0, 1);
  padding-bottom: 60px;
  background-color: var(--bg-app);
}

.main-content.expanded {
  margin-left: var(--sidebar-collapsed-width);
}

.top-header {
  height: 64px;
  background-color: var(--bg-surface);
  border-color: var(--border-color);
  z-index: 1020;
}

/* Route Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Overlay transition */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* Drawer slide transition */
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(-100%);
}

/* Mobile Drawer & Overlay */
.offcanvas-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 1050;
}

.mobile-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 290px;
  background-color: var(--sidebar-bg);
  z-index: 1060;
  overflow-y: auto;
  box-shadow: 6px 0 24px rgba(0, 0, 0, 0.22);
}

/* Mobile Bottom Bar */
.mobile-bottom-bar {
  background-color: var(--bg-surface);
  border-color: var(--border-color);
  z-index: 1030;
}

.mobile-nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-sub);
  text-decoration: none;
  font-size: 11px;
}

.mobile-nav-btn i {
  font-size: 18px;
}

.mobile-nav-btn.active {
  color: var(--primary-color);
  font-weight: 700;
}

@media (max-width: 768px) {
  .sidebar-nav {
    display: none;
  }
  .main-content {
    margin-left: 0 !important;
  }
}

@media print {
  /* 1. Completely hide all navigation, headers, footers, notifications, buttons, and form panels */
  .sidebar-nav,
  .top-header,
  .mobile-bottom-bar,
  .no-print,
  .print-hide,
  .app-notifications,
  .offcanvas-overlay,
  .mobile-drawer,
  .modal,
  .toast,
  .swal2-container,
  .btn,
  .nav-pills,
  .nav-tabs,
  .form-switch,
  .alert,
  header,
  aside,
  footer {
    display: none !important;
  }

  /* 2. Reset html, body, and top-level containers for full page printing */
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    color: #000000 !important;
    width: 100% !important;
    height: auto !important;
    min-height: auto !important;
    overflow: visible !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  .app-container,
  #app,
  .main-content {
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    color: #000000 !important;
    width: 100% !important;
    min-height: auto !important;
    height: auto !important;
    overflow: visible !important;
  }

  .container-fluid,
  .container {
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  .row {
    margin: 0 !important;
    display: block !important;
  }

  .col-12, .col-lg-5, .col-lg-6, .col-lg-7, .col-md-6 {
    width: 100% !important;
    max-width: 100% !important;
    flex: 0 0 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* 3. Page break and formatting utilities */
  .page-break-always {
    page-break-after: always !important;
    break-after: page !important;
  }

  .print-page-break {
    page-break-after: always !important;
    break-after: page !important;
    display: block !important;
  }

  .print-page-break:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }

  .no-break {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* 4. Remove shadows and borders from cards during print */
  .card, .shadow, .shadow-sm {
    box-shadow: none !important;
    border: none !important;
    background: transparent !important;
  }
}
</style>
