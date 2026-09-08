<template>
  <div class="material-modes-page">
    <!-- Android 5.0 Classic Status Bar Emulation -->
    <div class="m3-android-status-bar d-flex align-items-center justify-content-between px-3 py-1 text-white">
      <div class="d-flex align-items-center gap-2 small">
        <span class="fw-bold" style="font-size: 11px; letter-spacing: 0.5px;">{{ liveTime }}</span>
        <span class="badge bg-white-20 rounded-pill px-2 py-0" style="font-size: 10px;">RajinKerja OS</span>
      </div>
      <div class="d-flex align-items-center gap-2 small opacity-90" style="font-size: 11px;">
        <i class="bi bi-wifi"></i>
        <i class="bi bi-reception-4"></i>
        <i class="bi bi-battery-charging"></i>
        <span style="font-size: 10.5px;">100%</span>
      </div>
    </div>

    <!-- Android 5.0 Lollipop Classic Material App Bar (Toolbar) -->
    <header class="m3-app-bar px-3 px-md-4 py-2.5 d-flex align-items-center justify-content-between text-white shadow-material-2">
      <div class="d-flex align-items-center gap-3">
        <router-link
          to="/"
          class="btn btn-icon-material text-white rounded-circle d-flex align-items-center justify-content-center"
          title="Kembali ke Dashboard (Home)"
        >
          <i class="bi bi-arrow-left fs-5"></i>
        </router-link>
        <div>
          <h1 class="fs-5 fw-bold mb-0 text-white line-height-1 title-roboto">
            PILIH MODE WORKSPACE
          </h1>
          <div class="small opacity-80" style="font-size: 11.5px;">
            Material Design 3 & Android 5.0 Classic Edition • Tekan <kbd class="bg-white text-dark px-1 py-0 rounded font-monospace" style="font-size: 10px;">Ctrl+M</kbd>
          </div>
        </div>
      </div>

      <div class="d-flex align-items-center gap-2">
        <button
          @click="resetToPro"
          class="btn btn-sm btn-outline-light rounded-pill px-3 py-1 d-none d-sm-flex align-items-center gap-1.5"
          title="Reset ke Mode Professional (Semua Terbuka)"
        >
          <i class="bi bi-unlock-fill"></i>
          <span class="small fw-semibold">Buka Semua (Pro)</span>
        </button>
        <router-link
          to="/"
          class="btn btn-sm btn-light text-primary fw-bold rounded-pill px-3 py-1 shadow-xs d-flex align-items-center gap-1"
        >
          <i class="bi bi-house-door-fill"></i>
          <span class="small">Dashboard</span>
        </router-link>
      </div>
    </header>

    <!-- Material Design 5.0 Tabs Bar -->
    <div class="m3-tabs-bar px-3 px-md-4 d-flex align-items-center overflow-x-auto shadow-material-1">
      <button
        v-for="tab in tabFilters"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="m3-tab-item"
        :class="{ active: activeTab === tab.id }"
      >
        <i :class="tab.icon" class="me-1.5"></i>
        <span>{{ tab.label }}</span>
        <span class="m3-tab-counter ms-1.5">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Main Container Content Area -->
    <main class="container-fluid max-w-7xl py-4 px-3 px-md-4">
      <!-- Restricted Access Notice when redirected -->
      <div v-if="route.query.restricted === 'true'" class="alert alert-warning border-0 rounded-3 shadow-material-1 mb-4 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 p-3.5">
        <div class="d-flex align-items-center gap-3">
          <div class="m3-avatar-circle" style="background-color: #f59e0b; width: 42px; height: 42px;">
            <i class="bi bi-shield-lock-fill text-white fs-5"></i>
          </div>
          <div>
            <div class="fw-bold text-dark">Fitur Dibatasi Dalam {{ route.query.mode || 'Mode Ini' }}</div>
            <div class="small text-muted">Halaman <code>{{ route.query.from }}</code> disembunyikan agar workspace tetap ringkas. Pilih <strong>Mode Professional</strong> atau mode terkait di bawah untuk membukanya!</div>
          </div>
        </div>
        <button @click="resetToPro" class="btn btn-sm btn-primary rounded-pill px-3.5 py-1.5 fw-bold text-nowrap shadow-xs">
          <i class="bi bi-unlock-fill me-1"></i> Buka Semua (Pro)
        </button>
      </div>

      <!-- Active Mode Highlight Notification Banner -->
      <div class="material-current-banner mb-4 p-3.5 rounded-3 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 shadow-material-1" :style="{ borderLeft: `6px solid ${activeModeConfig.materialColor}`, backgroundColor: '#ffffff' }">
        <div class="d-flex align-items-center gap-3">
          <div class="m3-avatar-circle" :style="{ backgroundColor: activeModeConfig.materialColor }">
            <i :class="activeModeConfig.icon" class="text-white fs-4"></i>
          </div>
          <div>
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <span class="badge px-2 py-1 text-white fw-bold rounded-pill" :style="{ backgroundColor: activeModeConfig.materialColor, fontSize: '11px' }">
                SEDANG AKTIF
              </span>
              <h2 class="fs-5 fw-bold text-dark mb-0">{{ activeModeConfig.title }}</h2>
            </div>
            <p class="small text-muted mb-0 mt-1">
              {{ activeModeConfig.subtitle }} • Navigasi sidebar & menu aplikasi kini difilter sesuai mode ini.
            </p>
          </div>
        </div>

        <div class="d-flex align-items-center gap-2 w-100 w-md-auto justify-content-end">
          <span class="small text-secondary d-none d-lg-inline">
            <i class="bi bi-info-circle me-1"></i>Tekan <kbd class="px-1 py-0.5 border rounded">Ctrl+M</kbd> kapan saja
          </span>
          <router-link to="/" class="btn btn-sm btn-primary rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-1.5 shadow-xs">
            <span>Buka Dashboard</span>
            <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>
      </div>

      <!-- Quick Search Bar (Android Classic Search Card) -->
      <div class="m3-search-paper mb-4 p-2.5 rounded-3 d-flex align-items-center bg-white shadow-material-1">
        <i class="bi bi-search text-secondary ms-2 me-3 fs-5"></i>
        <input
          v-model="searchQuery"
          type="text"
          class="form-control border-0 shadow-none px-0 fs-6"
          placeholder="Cari mode berdasarkan peran (misal: simple, sekretaris, bendahara, developer, pro)..."
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="btn btn-sm btn-link text-muted me-2">
          <i class="bi bi-x-circle-fill fs-5"></i>
        </button>
      </div>

      <!-- Grid of Classic Material Mode Cards -->
      <div class="row g-3 g-md-4">
        <div
          v-for="mode in filteredModes"
          :key="mode.id"
          class="col-12 col-md-6 col-xl-4"
        >
          <div
            class="m3-card-paper h-100 d-flex flex-column rounded-3 bg-white overflow-hidden transition-material"
            :class="{ 'm3-card-active': currentModeId === mode.id }"
          >
            <!-- Card Header Band with Material Color -->
            <div
              class="m3-card-header p-3 text-white d-flex align-items-center justify-content-between position-relative"
              :style="{ backgroundColor: mode.materialColor }"
            >
              <div class="d-flex align-items-center gap-2.5">
                <div class="m3-card-icon-badge rounded-circle d-flex align-items-center justify-content-center bg-white" :style="{ color: mode.materialColor }">
                  <i :class="mode.icon" class="fs-5"></i>
                </div>
                <div>
                  <span class="badge bg-white-25 rounded-pill px-2 py-0.5 text-uppercase fw-bold" style="font-size: 10px; letter-spacing: 0.5px;">
                    {{ mode.badge }}
                  </span>
                  <h3 class="fs-6 fw-bold text-white mb-0 mt-0.5 title-roboto">
                    {{ mode.title }}
                  </h3>
                </div>
              </div>

              <!-- Active Badge or Selection Checkmark -->
              <div v-if="currentModeId === mode.id" class="m3-card-selected-tag bg-white text-dark rounded-pill px-2.5 py-1 small fw-bold d-flex align-items-center gap-1 shadow-sm">
                <i class="bi bi-check-circle-fill text-success"></i>
                <span>Aktif</span>
              </div>
            </div>

            <!-- Card Body Content -->
            <div class="p-3.5 flex-grow-1 d-flex flex-column justify-content-between">
              <div>
                <p class="small text-secondary mb-2.5 lh-sm fw-medium">
                  {{ mode.subtitle }}
                </p>
                <p class="small text-muted mb-3" style="font-size: 12.5px; line-height: 1.5;">
                  {{ mode.description }}
                </p>

                <!-- Unlocked Apps Chips (Material Chips) -->
                <div class="mb-3">
                  <div class="text-uppercase fw-bold text-secondary mb-1.5" style="font-size: 10.5px; letter-spacing: 0.5px;">
                    <i class="bi bi-grid-fill me-1"></i>Aplikasi & Modul Tersedia:
                  </div>
                  <div class="d-flex flex-wrap gap-1.5">
                    <span
                      v-for="(feat, idx) in mode.features"
                      :key="idx"
                      class="m3-chip-item px-2.5 py-1 rounded-pill small fw-semibold"
                      :style="{ backgroundColor: mode.materialLight, color: mode.materialDark }"
                    >
                      <i class="bi bi-check2 me-1"></i>{{ feat }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Card Action Button -->
              <div class="pt-3 border-top mt-2">
                <button
                  v-if="currentModeId === mode.id"
                  class="btn btn-light w-100 rounded-pill py-2 fw-bold text-success border d-flex align-items-center justify-content-center gap-2 cursor-default"
                  disabled
                >
                  <i class="bi bi-check-lg fs-5"></i>
                  <span>Sedang Aktif Saat Ini</span>
                </button>
                <button
                  v-else
                  @click="selectMode(mode.id)"
                  class="btn btn-material-action w-100 rounded-pill py-2 fw-bold text-white shadow-material-1 d-flex align-items-center justify-content-center gap-2"
                  :style="{ backgroundColor: mode.materialColor }"
                >
                  <i class="bi bi-cursor-fill"></i>
                  <span>Aktifkan {{ mode.shortName }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State if search yields no results -->
      <div v-if="filteredModes.length === 0" class="text-center py-5 bg-white rounded-3 p-4 shadow-material-1 mt-3">
        <i class="bi bi-emoji-neutral fs-1 text-muted"></i>
        <h4 class="fw-bold mt-2 text-dark">Mode tidak ditemukan</h4>
        <p class="small text-muted mb-3">Tidak ada mode yang cocok dengan pencarian "{{ searchQuery }}".</p>
        <button @click="searchQuery = ''; activeTab = 'all'" class="btn btn-primary rounded-pill px-4">
          Reset Filter & Cari
        </button>
      </div>

      <!-- Android Classic Info Card & Hotkey Manual -->
      <div class="card border-0 bg-white rounded-3 shadow-material-1 p-3.5 mt-4">
        <div class="d-flex align-items-center gap-2 mb-2">
          <i class="bi bi-keyboard-fill text-primary fs-5"></i>
          <h4 class="fs-6 fw-bold mb-0 text-dark">Panduan Hotkey & Penggunaan Mode</h4>
        </div>
        <div class="row g-3 small text-muted">
          <div class="col-md-4">
            <div class="p-2.5 bg-light rounded-2 border h-100">
              <div class="fw-bold text-dark mb-1">
                <kbd>Ctrl</kbd> + <kbd>M</kbd> : Buka Dialog Mode
              </div>
              <div>Bisa ditekan dari halaman mana pun untuk mengganti mode workspace dalam sekejap tanpa harus refresh.</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-2.5 bg-light rounded-2 border h-100">
              <div class="fw-bold text-dark mb-1">
                <kbd>Ctrl</kbd> + <kbd>B</kbd> : Sembunyikan Sidebar
              </div>
              <div>Menyembunyikan sidebar navigasi total untuk ruang kerja ultra lega dan fokus penuh ke dokumen/tugas.</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-2.5 bg-light rounded-2 border h-100">
              <div class="fw-bold text-dark mb-1">
                <kbd>Ctrl</kbd> + <kbd>K</kbd> : Cari Fitur Cepat
              </div>
              <div>Mengarahkan kursor langsung ke kotak pencarian sidebar untuk membuka modul yang dibutuhkan.</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Classic Android Floating Action Button (FAB) -->
    <router-link
      to="/"
      class="m3-fab text-white shadow-material-3 d-flex align-items-center justify-content-center text-decoration-none"
      title="Kembali ke Beranda"
    >
      <i class="bi bi-check-lg fs-3"></i>
    </router-link>

    <!-- Android 5.0 Classic Bottom Snackbar Alert -->
    <transition name="m3-snackbar">
      <div v-if="snackbar.show" class="m3-snackbar d-flex align-items-center justify-content-between text-white shadow-material-3">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-info-circle-fill text-warning"></i>
          <span class="small">{{ snackbar.message }}</span>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button @click="goToHome" class="btn btn-sm btn-link text-warning fw-bold text-decoration-none p-0">
            LIHAT
          </button>
          <button @click="snackbar.show = false" class="btn btn-sm btn-link text-white text-decoration-none p-0 ms-2">
            TUTUP
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { WORKSPACE_MODES, getModeConfig, setActiveModeId } from '../utils/workspaceModes';

export default {
  name: 'WorkspaceModesView',
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const activeTab = ref('all');
    const searchQuery = ref('');
    const liveTime = ref('');
    const snackbar = ref({
      show: false,
      message: '',
      timeout: null
    });

    const updateClock = () => {
      const now = new Date();
      liveTime.value = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    let clockInterval = null;
    onMounted(() => {
      updateClock();
      clockInterval = setInterval(updateClock, 1000);
    });

    onUnmounted(() => {
      if (clockInterval) clearInterval(clockInterval);
    });

    const currentModeId = computed(() => store.getters.getWorkspaceMode || 'professional');
    const activeModeConfig = computed(() => getModeConfig(currentModeId.value));

    const tabFilters = computed(() => [
      { id: 'all', label: 'SEMUA MODE', icon: 'bi-grid-fill', count: WORKSPACE_MODES.length },
      { id: 'basic', label: 'FOKUS & MINIMALIS', icon: 'bi-check2-circle', count: WORKSPACE_MODES.filter(m => m.category === 'basic').length },
      { id: 'role', label: 'PERAN SPESIFIK', icon: 'bi-people-fill', count: WORKSPACE_MODES.filter(m => m.category === 'role').length },
      { id: 'pro', label: 'PROFESSIONAL', icon: 'bi-shield-check', count: WORKSPACE_MODES.filter(m => m.category === 'pro').length }
    ]);

    const filteredModes = computed(() => {
      let list = WORKSPACE_MODES;
      if (activeTab.value !== 'all') {
        list = list.filter(m => m.category === activeTab.value);
      }
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.trim().toLowerCase();
        list = list.filter(m =>
          m.title.toLowerCase().includes(q) ||
          m.shortName.toLowerCase().includes(q) ||
          m.subtitle.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.features.some(f => f.toLowerCase().includes(q))
        );
      }
      return list;
    });

    const triggerSnackbar = (message) => {
      if (snackbar.value.timeout) clearTimeout(snackbar.value.timeout);
      snackbar.value.message = message;
      snackbar.value.show = true;
      snackbar.value.timeout = setTimeout(() => {
        snackbar.value.show = false;
      }, 4000);
    };

    const selectMode = (modeId) => {
      setActiveModeId(modeId);
      store.dispatch('setWorkspaceMode', modeId);
      const conf = getModeConfig(modeId);
      triggerSnackbar(`Mode ${conf.title} berhasil diaktifkan!`);
      store.dispatch('showNotification', {
        type: 'success',
        title: `Mode ${conf.shortName} Aktif`,
        message: `Navigasi aplikasi telah disesuaikan untuk ${conf.subtitle}.`
      });
    };

    const resetToPro = () => {
      selectMode('professional');
    };

    const goToHome = () => {
      router.push('/');
    };

    return {
      route,
      activeTab,
      searchQuery,
      liveTime,
      snackbar,
      currentModeId,
      activeModeConfig,
      tabFilters,
      filteredModes,
      selectMode,
      resetToPro,
      goToHome
    };
  }
};
</script>

<style scoped>
/* Authentic Android 5.0 Lollipop / Material Design 3 Classic Styling */
.material-modes-page {
  min-height: 100vh;
  background-color: #eceff1; /* Material Blue Grey 50 (Classic Android background) */
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  padding-bottom: 90px;
}

.title-roboto {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  letter-spacing: 0.3px;
}

/* Android 5.0 Status Bar */
.m3-android-status-bar {
  background-color: #004d40; /* Darker variant of Teal (Teal 900) */
  height: 24px;
}

/* Material App Bar (Toolbar) */
.m3-app-bar {
  background-color: #00796b; /* Material Teal 700 */
  min-height: 56px;
}

.btn-icon-material {
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  transition: background-color 0.2s ease;
}

.btn-icon-material:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.btn-icon-material:active {
  background-color: rgba(255, 255, 255, 0.25);
}

/* Material Tabs Bar */
.m3-tabs-bar {
  background-color: #00695c; /* Teal 800 */
  height: 48px;
}

.m3-tab-item {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 0 20px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  position: relative;
  transition: color 0.2s ease;
  cursor: pointer;
}

.m3-tab-item:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.06);
}

.m3-tab-item.active {
  color: #ffffff;
}

.m3-tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #ffeb3b; /* Classic Material Yellow Accent */
}

.m3-tab-counter {
  background: rgba(255, 255, 255, 0.2);
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 11px;
}

/* Classic Android Paper Elevation Shadows */
.shadow-material-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24) !important;
}

.shadow-material-2 {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23) !important;
}

.shadow-material-3 {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23) !important;
}

/* Cards */
.m3-card-paper {
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.m3-card-paper:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.18);
  transform: translateY(-2px);
}

.m3-card-paper.m3-card-active {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18), 0 4px 8px rgba(0, 0, 0, 0.12);
  border: 2px solid #009688;
}

.m3-card-icon-badge {
  width: 42px;
  height: 42px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.m3-avatar-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.m3-chip-item {
  font-size: 11px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.bg-white-20 {
  background-color: rgba(255, 255, 255, 0.2);
}

.bg-white-25 {
  background-color: rgba(255, 255, 255, 0.25);
}

.btn-material-action {
  border: none;
  transition: filter 0.2s ease, transform 0.15s ease;
}

.btn-material-action:hover {
  filter: brightness(1.08);
}

.btn-material-action:active {
  transform: scale(0.98);
}

/* Floating Action Button (FAB) 56dp */
.m3-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #ff9800; /* Classic Material Amber FAB */
  z-index: 1050;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease;
}

.m3-fab:hover {
  transform: scale(1.08);
  background-color: #f57c00;
}

.m3-fab:active {
  transform: scale(0.95);
}

/* Android 5.0 Classic Bottom Snackbar */
.m3-snackbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #323232;
  min-width: 320px;
  max-width: 560px;
  padding: 14px 24px;
  border-radius: 4px;
  z-index: 1060;
  font-size: 14px;
}

.m3-snackbar-enter-active,
.m3-snackbar-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.m3-snackbar-enter-from,
.m3-snackbar-leave-to {
  transform: translate(-50%, 40px);
  opacity: 0;
}

@media (max-width: 576px) {
  .m3-snackbar {
    left: 12px;
    right: 12px;
    transform: none;
    min-width: auto;
  }
}
</style>
