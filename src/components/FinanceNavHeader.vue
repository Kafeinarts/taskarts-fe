<template>
  <div class="finance-suite-header mb-4 no-print" data-aos="fade-down">
    <!-- Top Bar: Title, Active User & Quick RBAC Role Switcher -->
    <div class="card border-0 shadow-sm rounded-4 bg-white p-3 p-md-4 mb-3 border">
      <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
        <div>
          <div class="d-flex align-items-center flex-wrap gap-2 mb-1">
            <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 fw-bold px-3 py-1.5 rounded-pill">
              <i class="bi bi-shield-lock-fill me-1"></i> Enterprise Finance System
            </span>
            <span class="badge bg-success-subtle text-success border border-success border-opacity-25 fw-semibold px-2.5 py-1.5 rounded-pill small">
              <i class="bi bi-check-circle-fill me-1"></i> PSAK / IFRS Standard
            </span>
            <span class="badge bg-dark text-white fw-bold px-2.5 py-1.5 rounded-pill small">
              <i class="bi bi-record-circle-fill text-danger me-1"></i> Audit Trail Aktif
            </span>
          </div>
          <h2 class="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <span>{{ title }}</span>
          </h2>
          <p class="text-muted mb-0 small">{{ subtitle }}</p>
        </div>

        <!-- Role Simulator & Switcher Widget -->
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <div class="bg-light p-2 rounded-3 border d-flex align-items-center gap-2">
            <div class="text-end d-none d-sm-block">
              <div class="small fw-bold text-dark lh-1">Arif Permana Putrasuryana</div>
              <span class="badge mt-1" :class="currentRole.badgeClass" style="font-size: 11px;">
                {{ currentRole.name.split('(')[0] }}
              </span>
            </div>

            <!-- Role Selector Dropdown -->
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-sm btn-white border rounded-pill px-3 dropdown-toggle d-flex align-items-center gap-1.5 shadow-xs"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Ganti Peran Hak Akses untuk Uji Coba RBAC"
              >
                <i class="bi bi-person-gear text-primary"></i>
                <span class="fw-semibold small">Simulasi Role: {{ currentRole.id.toUpperCase() }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm border rounded-3 p-1" style="min-width: 250px;">
                <li><h6 class="dropdown-header small text-muted text-uppercase">Pilih Hak Akses (RBAC)</h6></li>
                <li v-for="(r, key) in allRoles" :key="key">
                  <button
                    class="dropdown-item rounded-2 py-2 d-flex align-items-center justify-content-between"
                    :class="{ 'active bg-primary text-white': currentRole.id === r.id }"
                    @click="switchRole(r.id)"
                  >
                    <div>
                      <div class="fw-bold small">{{ r.name.split('(')[0] }}</div>
                      <div class="text-muted small" :class="{ 'text-white text-opacity-75': currentRole.id === r.id }" style="font-size: 10px;">
                        Max Approval: {{ r.maxApprovalLimit === Infinity ? 'Unlimited' : (r.maxApprovalLimit === 0 ? 'Tanpa Approval' : 'Rp 50 Jt') }}
                      </div>
                    </div>
                    <i v-if="currentRole.id === r.id" class="bi bi-check-circle-fill"></i>
                  </button>
                </li>
                <li><hr class="dropdown-divider my-1"></li>
                <li>
                  <router-link to="/finance-compliance" class="dropdown-item small text-primary d-flex align-items-center gap-2">
                    <i class="bi bi-sliders"></i> Kelola Matriks RBAC & Audit
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sub-navigation: 6 Finance System Modules -->
    <div class="finance-nav-scroll card border-0 shadow-sm rounded-4 bg-white p-2">
      <div class="d-flex align-items-center gap-2 overflow-x-auto p-1">
        <router-link
          v-for="item in financeModules"
          :key="item.path"
          :to="item.path"
          class="nav-module-pill btn border-0 d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-nowrap transition-all"
          :class="$route.path === item.path ? 'active-module-tab bg-primary text-white shadow-sm fw-bold' : 'bg-light text-secondary hover-bg-secondary-subtle'"
        >
          <div
            class="pill-icon rounded-circle d-flex align-items-center justify-content-center"
            :class="$route.path === item.path ? 'bg-white text-primary' : 'bg-white text-muted shadow-2xs'"
            style="width: 26px; height: 26px; font-size: 13px;"
          >
            <i :class="item.icon"></i>
          </div>
          <span class="small">{{ item.title }}</span>
          <span
            v-if="item.badge"
            class="badge rounded-pill ms-1"
            :class="$route.path === item.path ? 'bg-white text-primary' : item.badgeClass"
            style="font-size: 10px;"
          >
            {{ item.badge }}
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { ROLES, getCurrentRole, setCurrentRole, initFinanceSeedData } from '../utils/financeSystemStore';

export default {
  name: 'FinanceNavHeader',
  props: {
    title: {
      type: String,
      default: 'Aplikasi Manajemen Keuangan (Finance System)'
    },
    subtitle: {
      type: String,
      default: 'Sistem pembukuan arus kas, hutang piutang, reimbursement, penganggaran, laporan PSAK & jejak audit.'
    }
  },
  setup() {
    const currentRole = ref(getCurrentRole());
    const allRoles = ROLES;

    const financeModules = [
      {
        path: '/finance-cashflow',
        title: '1. Arus Kas & Rekonsiliasi',
        icon: 'bi-cash-coin',
        badge: 'Live',
        badgeClass: 'bg-emerald-600 text-white'
      },
      {
        path: '/finance-ap-ar',
        title: '2. Hutang & Piutang (AP/AR)',
        icon: 'bi-arrow-left-right',
        badge: 'Approval',
        badgeClass: 'bg-indigo-600 text-white'
      },
      {
        path: '/finance-expenses',
        title: '3. Pengeluaran & Reimbursement',
        icon: 'bi-receipt-cutoff',
        badge: 'OCR',
        badgeClass: 'bg-amber-500 text-white'
      },
      {
        path: '/finance-budgeting',
        title: '4. Anggaran & Proyeksi',
        icon: 'bi-graph-up-arrow',
        badge: 'Alert',
        badgeClass: 'bg-sky-600 text-white'
      },
      {
        path: '/finance-reports',
        title: '5. Laporan PSAK/IFRS',
        icon: 'bi-file-earmark-spreadsheet-fill',
        badge: 'Lengkap',
        badgeClass: 'bg-purple-600 text-white'
      },
      {
        path: '/finance-compliance',
        title: '6. Keamanan & Audit Trail',
        icon: 'bi-shield-check',
        badge: 'RBAC',
        badgeClass: 'bg-rose-600 text-white'
      }
    ];

    const switchRole = (roleId) => {
      setCurrentRole(roleId);
      currentRole.value = getCurrentRole();
      Swal.fire({
        icon: 'info',
        title: 'Peran Diperbarui',
        text: `Hak akses sistem disesuaikan menjadi: ${currentRole.value.name}`,
        timer: 1500,
        showConfirmButton: false
      });
      // Emit event so active view can refresh permissions
      window.dispatchEvent(new CustomEvent('finance-role-changed', { detail: currentRole.value }));
    };

    onMounted(() => {
      initFinanceSeedData();
      currentRole.value = getCurrentRole();
    });

    return {
      currentRole,
      allRoles,
      financeModules,
      switchRole
    };
  }
};
</script>

<style scoped>
.finance-nav-scroll::-webkit-scrollbar {
  height: 6px;
}
.finance-nav-scroll::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}
.nav-module-pill {
  font-size: 13px;
  text-decoration: none;
}
.active-module-tab {
  background-color: #2563eb !important;
  color: #ffffff !important;
}
.hover-bg-secondary-subtle:hover {
  background-color: #e2e8f0;
}
</style>
