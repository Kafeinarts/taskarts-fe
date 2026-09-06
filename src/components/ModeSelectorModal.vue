<template>
  <transition name="m3-modal-fade">
    <div
      v-if="isOpen"
      class="m3-modal-backdrop"
      @click.self="closeModal"
      @keydown.esc="closeModal"
      tabindex="-1"
    >
      <div class="m3-dialog-container shadow-material-3" role="dialog" aria-modal="true">
        <!-- Dialog Header with Android 5.0 Material Bar -->
        <div class="m3-dialog-header p-3 px-4 text-white d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-2.5">
            <div class="m3-header-icon-circle bg-white text-primary">
              <i class="bi bi-sliders2 fs-5"></i>
            </div>
            <div>
              <h3 class="fs-6 fw-bold mb-0 text-white title-roboto">
                PILIH MODE WORKSPACE
              </h3>
              <div class="small opacity-80" style="font-size: 11px;">
                Tekan <kbd class="bg-white text-dark px-1 py-0 rounded font-monospace" style="font-size: 10px;">Ctrl+M</kbd> kapan saja untuk ganti mode
              </div>
            </div>
          </div>
          <button
            @click="closeModal"
            class="btn btn-sm btn-icon-dialog text-white rounded-circle d-flex align-items-center justify-content-center"
            title="Tutup dialog (Esc)"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Dialog Body: Mode Choice Items -->
        <div class="m3-dialog-body p-3 p-md-4 overflow-y-auto">
          <!-- Active Mode Information Pill -->
          <div class="p-2.5 rounded-2 bg-light border mb-3 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-2">
              <span class="badge rounded-pill px-2 py-1 text-white" :style="{ backgroundColor: currentModeConfig.materialColor, fontSize: '11px' }">
                Aktif
              </span>
              <span class="small fw-bold text-dark">{{ currentModeConfig.title }}</span>
            </div>
            <span class="small text-muted" style="font-size: 11px;">
              {{ currentModeConfig.badge }}
            </span>
          </div>

          <!-- Mode List Options -->
          <div class="d-flex flex-column gap-2.5">
            <div
              v-for="mode in allModes"
              :key="mode.id"
              @click="handleSelect(mode.id)"
              class="m3-mode-option-row p-3 rounded-3 border d-flex align-items-center justify-content-between transition-material cursor-pointer"
              :class="{
                'm3-row-active': currentModeId === mode.id,
                'border-primary': currentModeId === mode.id
              }"
              :style="currentModeId === mode.id ? { borderColor: mode.materialColor, backgroundColor: mode.materialLight } : {}"
            >
              <div class="d-flex align-items-center gap-3">
                <!-- Circular Icon Avatar -->
                <div
                  class="m3-option-icon rounded-circle d-flex align-items-center justify-content-center text-white"
                  :style="{ backgroundColor: mode.materialColor }"
                >
                  <i :class="mode.icon" class="fs-5"></i>
                </div>

                <div>
                  <div class="d-flex align-items-center gap-2 flex-wrap">
                    <span class="fw-bold text-dark fs-6">{{ mode.title }}</span>
                    <span
                      class="badge rounded-pill px-2 py-0.5 small fw-semibold"
                      :style="{ backgroundColor: mode.materialLight, color: mode.materialDark, fontSize: '10px' }"
                    >
                      {{ mode.badge }}
                    </span>
                  </div>
                  <p class="small text-muted mb-1 mt-0.5 line-clamp-1" style="font-size: 12px;">
                    {{ mode.subtitle }}
                  </p>
                  <!-- Quick Feature preview tags -->
                  <div class="d-flex flex-wrap gap-1">
                    <span
                      v-for="(f, fIdx) in mode.features.slice(0, 3)"
                      :key="fIdx"
                      class="badge bg-white text-secondary border px-1.5 py-0.5"
                      style="font-size: 10px;"
                    >
                      {{ f }}
                    </span>
                    <span v-if="mode.features.length > 3" class="badge bg-white text-muted border px-1 py-0.5" style="font-size: 10px;">
                      +{{ mode.features.length - 3 }} lainnya
                    </span>
                  </div>
                </div>
              </div>

              <!-- Radio / Action indicator -->
              <div class="ms-3 flex-shrink-0">
                <div v-if="currentModeId === mode.id" class="d-flex align-items-center gap-1 text-success fw-bold small">
                  <i class="bi bi-check-circle-fill fs-5"></i>
                  <span class="d-none d-sm-inline">Dipilih</span>
                </div>
                <button
                  v-else
                  class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 small fw-semibold"
                >
                  Pilih
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Dialog Footer with Material Flat Buttons -->
        <div class="m3-dialog-footer p-3 px-4 bg-light border-top d-flex align-items-center justify-content-between">
          <button
            @click="goToFullModesPage"
            class="btn btn-sm btn-link text-primary text-decoration-none fw-bold p-0 d-flex align-items-center gap-1"
          >
            <i class="bi bi-box-arrow-up-right"></i>
            <span>Buka Halaman Lengkap (Android 5.0 UI)</span>
          </button>

          <div class="d-flex align-items-center gap-2">
            <button
              @click="closeModal"
              class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 fw-bold"
            >
              TUTUP (Esc)
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { WORKSPACE_MODES, getModeConfig, setActiveModeId } from '../utils/workspaceModes';

export default {
  name: 'ModeSelectorModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'mode-selected'],
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();

    const allModes = WORKSPACE_MODES;
    const currentModeId = computed(() => store.getters.getWorkspaceMode || 'professional');
    const currentModeConfig = computed(() => getModeConfig(currentModeId.value));

    const closeModal = () => {
      emit('close');
    };

    const handleSelect = (modeId) => {
      setActiveModeId(modeId);
      store.dispatch('setWorkspaceMode', modeId);
      const conf = getModeConfig(modeId);
      store.dispatch('showNotification', {
        type: 'success',
        title: `Mode ${conf.shortName} Aktif`,
        message: `Navigasi aplikasi telah disesuaikan untuk ${conf.subtitle}.`
      });
      emit('mode-selected', modeId);
      closeModal();
    };

    const goToFullModesPage = () => {
      closeModal();
      router.push('/modes');
    };

    return {
      allModes,
      currentModeId,
      currentModeConfig,
      closeModal,
      handleSelect,
      goToFullModesPage
    };
  }
};
</script>

<style scoped>
.m3-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.54); /* Android 5.0 Material Scrim */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
  backdrop-filter: blur(2px);
}

.m3-dialog-container {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 620px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

.m3-dialog-header {
  background-color: #00796b; /* Android 5.0 Teal 700 */
}

.m3-header-icon-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.btn-icon-dialog {
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  transition: background-color 0.2s ease;
}

.btn-icon-dialog:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.m3-dialog-body {
  max-height: 60vh;
}

.m3-option-icon {
  width: 44px;
  height: 44px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.m3-mode-option-row {
  background-color: #ffffff;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}

.m3-mode-option-row:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #f8fafc;
}

.m3-row-active {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animations */
.m3-modal-fade-enter-active,
.m3-modal-fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.m3-modal-fade-enter-from,
.m3-modal-fade-leave-to {
  opacity: 0;
}

.m3-modal-fade-enter-active .m3-dialog-container,
.m3-modal-fade-leave-active .m3-dialog-container {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.m3-modal-fade-enter-from .m3-dialog-container,
.m3-modal-fade-leave-to .m3-dialog-container {
  transform: scale(0.95);
}
</style>
