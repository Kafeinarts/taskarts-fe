<template>
  <div class="toast-notification-wrapper position-fixed start-50 translate-middle-x p-3 no-print" style="z-index: 2000; top: 12px; width: 100%; max-width: 440px; pointer-events: none;">
    <transition-group name="toast-list">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        :class="['toast-card', 'shadow-lg', 'rounded-4', 'p-3', 'mb-2', 'd-flex', 'align-items-start', 'gap-3', 'border', getToastBgClass(toast.type)]"
        style="pointer-events: auto; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
      >
        <div :class="['rounded-circle', 'p-2', 'd-flex', 'align-items-center', 'justify-content-center', 'flex-shrink-0', getIconBgClass(toast.type)]" style="width: 38px; height: 38px;">
          <i :class="['bi', toast.icon || getToastIcon(toast.type), 'fs-5']"></i>
        </div>

        <div class="flex-grow-1 min-w-0">
          <div class="d-flex align-items-center justify-content-between gap-2 mb-0.5">
            <span class="fw-bold fs-6 lh-sm text-truncate text-dark dark-white">{{ toast.title }}</span>
            <small class="text-muted opacity-75 fw-medium" style="font-size: 10px;">Sekarang</small>
          </div>
          <p v-if="toast.body" class="mb-0 small text-secondary text-break lh-sm" style="font-size: 12px;">{{ toast.body }}</p>
        </div>

        <button @click="dismiss(toast.id)" class="btn btn-sm btn-link text-muted p-0 border-0 flex-shrink-0" style="text-decoration: none;" title="Tutup">
          <i class="bi bi-x-lg fs-6"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'AppNotifications',
  setup() {
    const toasts = ref([]);

    const handleToastEvent = (e) => {
      const { id, title, body, type, icon } = e.detail;
      const newToast = {
        id: id || Date.now() + Math.random(),
        title: title || 'Notifikasi Sistem',
        body: body || '',
        type: type || 'info',
        icon: icon || ''
      };

      toasts.value.unshift(newToast);

      // Auto dismiss after 4.5s
      setTimeout(() => {
        dismiss(newToast.id);
      }, 4500);
    };

    const dismiss = (id) => {
      toasts.value = toasts.value.filter(t => t.id !== id);
    };

    const getToastBgClass = (type) => {
      switch (type) {
        case 'success': return 'bg-white border-success-subtle border-start border-4 border-start-success';
        case 'warning': return 'bg-white border-warning-subtle border-start border-4 border-start-warning';
        case 'danger': return 'bg-white border-danger-subtle border-start border-4 border-start-danger';
        default: return 'bg-white border-primary-subtle border-start border-4 border-start-primary';
      }
    };

    const getIconBgClass = (type) => {
      switch (type) {
        case 'success': return 'bg-success-subtle text-success';
        case 'warning': return 'bg-warning-subtle text-warning-emphasis';
        case 'danger': return 'bg-danger-subtle text-danger';
        default: return 'bg-primary-subtle text-primary';
      }
    };

    const getToastIcon = (type) => {
      switch (type) {
        case 'success': return 'bi-check-circle-fill';
        case 'warning': return 'bi-exclamation-triangle-fill';
        case 'danger': return 'bi-x-circle-fill';
        default: return 'bi-info-circle-fill';
      }
    };

    onMounted(() => {
      window.addEventListener('app-toast-notification', handleToastEvent);
    });

    onUnmounted(() => {
      window.removeEventListener('app-toast-notification', handleToastEvent);
    });

    return {
      toasts,
      dismiss,
      getToastBgClass,
      getIconBgClass,
      getToastIcon
    };
  }
};
</script>

<style scoped>
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.toast-card {
  box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.15) !important;
}

@media (max-width: 576px) {
  .toast-notification-wrapper {
    width: 94% !important;
  }
}
</style>
