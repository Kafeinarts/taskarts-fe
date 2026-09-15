<template>
  <div v-if="modelValue" class="modal-backdrop-dukung" @click.self="closeModal">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-dukung-dialog">
      <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden bg-white modal-dukung-content">
        <!-- Mobile Bottom Sheet Drag Handle Indicator -->
        <div class="mobile-sheet-handle-bar d-md-none text-center pt-2 pb-1 bg-light cursor-pointer" @click="closeModal" title="Tutup Modal">
          <span class="mobile-drag-pill"></span>
        </div>

        <!-- Modal Top Bar -->
        <div class="modal-header border-bottom px-3.5 px-md-4 py-2.5 py-md-3 bg-light d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-2.5">
            <div class="modal-heart-icon-box shadow-xs">
              <span class="fs-5">💝</span>
            </div>
            <div>
              <h5 class="modal-title fw-extrabold text-dark mb-0 fs-6 fs-md-5">Dukung Pengembang</h5>
              <small class="text-muted d-block" style="font-size: 11px;">Apresiasi kelanjutan server & fitur TaskArts by Kafeinarts</small>
            </div>
          </div>
          <button type="button" class="btn-close shadow-none p-2 rounded-circle" @click="closeModal" aria-label="Close" title="Tutup"></button>
        </div>

        <!-- Modal Body with BankAddressCards -->
        <div class="modal-body p-2.5 p-sm-3 p-md-4 modal-dukung-body">
          <BankAddressCards :in-modal="true" />
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer border-top bg-light px-3.5 px-md-4 py-2 py-md-2.5 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span class="small text-muted" style="font-size: 11.5px;">
            <i class="bi bi-heart-fill text-danger me-1"></i> Karya <strong class="text-dark">Arif Permana Putrasuryana</strong>
          </span>
          <button type="button" class="btn btn-secondary btn-sm rounded-pill px-4 fw-bold" @click="closeModal">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BankAddressCards from './BankAddressCards.vue';

export default {
  name: 'DukungDevModal',
  components: {
    BankAddressCards
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('update:modelValue', false);
    };

    return {
      closeModal
    };
  }
};
</script>

<style scoped>
.modal-backdrop-dukung {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.68);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 2100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow-y: auto;
}

.modal-dukung-dialog {
  width: 100%;
  max-width: 820px;
  margin: auto;
  animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-dukung-content {
  border-radius: 24px;
}

.modal-heart-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-dukung-body {
  max-height: calc(85vh - 120px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.mobile-drag-pill {
  display: inline-block;
  width: 44px;
  height: 5px;
  background-color: #cbd5e1;
  border-radius: 9999px;
  transition: background-color 0.2s;
}

.mobile-sheet-handle-bar:active .mobile-drag-pill {
  background-color: #94a3b8;
}

@keyframes modalPop {
  0% {
    opacity: 0;
    transform: scale(0.96) translateY(12px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes modalSlideUp {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =========================================================
   MOBILE BOTTOM SHEET OPTIMIZATION (max-width: 768px)
   ========================================================= */
@media (max-width: 768px) {
  .modal-backdrop-dukung {
    align-items: flex-end !important;
    padding: 0 !important;
  }

  .modal-dukung-dialog {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }

  .modal-dukung-content {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-top-left-radius: 24px !important;
    border-top-right-radius: 24px !important;
    max-height: 94vh !important;
    display: flex;
    flex-direction: column;
  }

  .modal-dukung-body {
    max-height: calc(94vh - 140px) !important;
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
}
</style>
