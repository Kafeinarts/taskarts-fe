<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Welcome Header Banner -->
    <div class="card border-0 shadow-sm rounded-4 bg-primary text-white p-4 p-md-5 mb-4 style-hero-banner">
      <div class="row align-items-center">
        <div class="col-lg-8">
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="badge bg-white text-primary fw-bold px-3 py-2 rounded-pill">WORKSPACE AKTIF</span>
            <span v-if="isBudgetExceeded" class="badge bg-danger text-white fw-bold px-3 py-2 rounded-pill shadow-sm">
              ⚠️ BUDGET THRESHOLD EXCEEDED!
            </span>
          </div>
          <h1 class="fw-extrabold display-6 mb-2">{{ welcomeTitleDisplay }}</h1>
          <p class="lead opacity-90 mb-4">
            {{ welcomeBanner.subtitle }}
          </p>

          <div class="d-flex flex-wrap gap-2">
            <router-link to="/todo" class="btn btn-light text-primary px-4 py-2 rounded-3 fw-bold shadow-sm">
              <i class="bi bi-check2-square me-1"></i> Buka To-Do List (5 Views)
            </router-link>
            <router-link to="/invoice" class="btn btn-outline-light px-4 py-2 rounded-3 fw-semibold">
              <i class="bi bi-receipt me-1"></i> Buat Invoice PDF
            </router-link>
            <router-link to="/settings" class="btn btn-link text-white text-decoration-none px-3 py-2 fw-semibold">
              <i class="bi bi-download me-1"></i> Backup JSON & Excel
            </router-link>
          </div>
        </div>

        <div class="col-lg-4 text-center text-lg-end mt-4 mt-lg-0 d-none d-lg-block">
          <div class="p-4 bg-white bg-opacity-10 backdrop-blur rounded-4 border border-white border-opacity-25 text-start">
            <div class="small opacity-75 text-uppercase fw-bold mb-1">Status Keuangan Bulan Ini</div>
            <h3 class="fw-bold text-white mb-1">{{ formatCurrency(netProfit) }}</h3>
            <small class="opacity-90 d-block">
              Income: {{ formatCurrency(totalIncome) }} | Expense: {{ formatCurrency(totalExpense) }}
            </small>
            <div v-if="isBudgetExceeded" class="mt-2 pt-2 border-top border-white border-opacity-25 text-warning small fw-bold">
              ⚠️ Pengeluaran Melebihi Anggaran Rp {{ formatCurrency(budgetThreshold) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overview Stat Cards Grid -->
    <div class="row g-3 mb-4">
      <!-- Active Projects -->
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 hover-card">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="text-muted small fw-semibold">Proyek Berjalan</span>
            <div class="p-2 bg-primary-subtle text-primary rounded-3"><i class="bi bi-folder-fill fs-5"></i></div>
          </div>
          <h2 class="fw-bold text-dark mb-0">{{ activeProjectsCount }}</h2>
          <router-link to="/project" class="small text-primary text-decoration-none fw-semibold mt-2 d-inline-block">
            Lihat Workspace Proyek &rarr;
          </router-link>
        </div>
      </div>

      <!-- Pending Tasks -->
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 hover-card">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="text-muted small fw-semibold">Tugas Pending</span>
            <div class="p-2 bg-warning-subtle text-warning-emphasis rounded-3"><i class="bi bi-clock-history fs-5"></i></div>
          </div>
          <h2 class="fw-bold text-dark mb-0">{{ pendingTasksCount }}</h2>
          <router-link to="/todo" class="small text-warning-emphasis text-decoration-none fw-semibold mt-2 d-inline-block">
            Buka Papan Kanban &rarr;
          </router-link>
        </div>
      </div>

      <!-- Total Income -->
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 hover-card">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="text-muted small fw-semibold">Total Pemasukan</span>
            <div class="p-2 bg-success-subtle text-success rounded-3"><i class="bi bi-arrow-down-left-circle-fill fs-5"></i></div>
          </div>
          <h3 class="fw-bold text-success mb-0">{{ formatCurrency(totalIncome) }}</h3>
          <router-link to="/finance" class="small text-success text-decoration-none fw-semibold mt-2 d-inline-block">
            Money Tracker &rarr;
          </router-link>
        </div>
      </div>

      <!-- Clients Database -->
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 hover-card">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="text-muted small fw-semibold">Database Klien</span>
            <div class="p-2 bg-info-subtle text-info rounded-3"><i class="bi bi-person-lines-fill fs-5"></i></div>
          </div>
          <h2 class="fw-bold text-dark mb-0">{{ totalClientsCount }}</h2>
          <router-link to="/contacts" class="small text-info text-decoration-none fw-semibold mt-2 d-inline-block">
            Kelola Kontak Klien &rarr;
          </router-link>
        </div>
      </div>
    </div>

    <!-- 30-Day Productivity & Habit Streaks Analytics Dashboard -->
    <ProductivityDashboard />

    <!-- Main Dashboard Section: 2 Column Layout -->
    <div class="row g-4 mb-4">
      <!-- Quick Tasks & Kanban Summary (Left) -->
      <div class="col-lg-7">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold text-dark mb-0"><i class="bi bi-list-check text-warning me-2"></i>Tugas Mendesak & Prioritas</h5>
            <router-link to="/todo" class="btn btn-sm btn-outline-primary rounded-pill px-3">Buka All 5 Views</router-link>
          </div>

          <div class="d-flex flex-column gap-2" v-if="recentTasks.length > 0">
            <div
              v-for="task in recentTasks"
              :key="task.id"
              class="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between hover-card"
            >
              <div class="d-flex align-items-center gap-3">
                <input
                  type="checkbox"
                  class="form-check-input style-checkbox"
                  :checked="task.done"
                  @change="toggleTaskDone(task.id)"
                />
                <div>
                  <span class="fw-bold text-dark d-block" :class="{ 'text-decoration-line-through text-muted': task.done }">
                    {{ task.name }}
                  </span>
                  <small class="text-muted">{{ task.projectTag || 'Umum' }} • Target: {{ task.deadline }}</small>
                </div>
              </div>
              <span :class="badgeClass(task.level)" class="badge px-3 py-1 rounded-pill small">
                {{ task.level }}
              </span>
            </div>
          </div>

          <div v-else class="text-center py-4 text-muted bg-light rounded-3 border border-dashed">
            Belum ada tugas tercatat. Buka modul To-Do untuk menambahkan kegiatan baru.
          </div>
        </div>
      </div>

      <!-- Quick Action Modules (Right) -->
      <div class="col-lg-5">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
          <h5 class="fw-bold text-dark mb-3"><i class="bi bi-rocket-takeoff-fill text-primary me-2"></i>Fitur Produktivitas</h5>

          <div class="d-flex flex-column gap-3">
            <router-link to="/todo" class="p-3 bg-light rounded-3 border text-decoration-none d-flex align-items-center gap-3 hover-card">
              <div class="p-3 bg-warning text-dark rounded-3 fs-4"><i class="bi bi-kanban"></i></div>
              <div>
                <h6 class="fw-bold text-dark mb-0">To-Do List (5 View Types)</h6>
                <small class="text-muted">Standard, Kanban, Eisenhower, Timeline, Checklist</small>
              </div>
            </router-link>

            <router-link to="/notes" class="p-3 bg-light rounded-3 border text-decoration-none d-flex align-items-center gap-3 hover-card">
              <div class="p-3 bg-info text-dark rounded-3 fs-4"><i class="bi bi-journal-text"></i></div>
              <div>
                <h6 class="fw-bold text-dark mb-0">Sticky Notes & Markdown Editor</h6>
                <small class="text-muted">Coreta n ide & dokumentasi proyek dengan live preview</small>
              </div>
            </router-link>

            <router-link to="/calendar" class="p-3 bg-light rounded-3 border text-decoration-none d-flex align-items-center gap-3 hover-card">
              <div class="p-3 bg-primary text-white rounded-3 fs-4"><i class="bi bi-calendar3"></i></div>
              <div>
                <h6 class="fw-bold text-dark mb-0">Kalender Agenda Milestones</h6>
                <small class="text-muted">Lihat seluruh jadwal deadline dan jatuh tempo invoice</small>
              </div>
            </router-link>

            <router-link to="/games" class="p-3 bg-light rounded-3 border text-decoration-none d-flex align-items-center gap-3 hover-card">
              <div class="p-3 bg-purple text-white rounded-3 fs-4"><i class="bi bi-controller"></i></div>
              <div>
                <h6 class="fw-bold text-dark mb-0">3D Mini Games & Office Simulator</h6>
                <small class="text-muted">Mainkan 3D Task Runner, Stacker & 3D Setup Desk</small>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 3D WORKSPACE SETUP SIMULATOR AT BOTTOM OF DASHBOARD -->
    <Workspace3DSimulator />

    <!-- Floating Action Button (FAB) for Quick Capture -->
    <router-link
      to="/quick-capture"
      class="fab-quick-capture btn btn-warning text-dark fw-extrabold rounded-pill shadow-lg d-flex align-items-center gap-2 px-3.5 py-2.5 position-fixed border border-2 border-white"
      style="bottom: 85px; right: 24px; z-index: 1040;"
      title="Quick Capture: Fast Note or Alarm"
    >
      <div class="bg-dark text-warning rounded-circle d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
        <i class="bi bi-lightning-charge-fill fs-6"></i>
      </div>
      <span class="fs-6 pe-1">Quick Capture</span>
    </router-link>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import ProductivityDashboard from '@/components/ProductivityDashboard.vue';
import Workspace3DSimulator from '@/components/Workspace3DSimulator.vue';

export default {
  name: 'HomeView',
  components: {
    ProductivityDashboard,
    Workspace3DSimulator
  },
  setup() {
    const store = useStore();

    const myBusiness = computed(() => store.getters.getMyBusiness);
    const welcomeBanner = computed(() => store.getters.getWelcomeBanner);
    const welcomeTitleDisplay = computed(() => {
      const banner = welcomeBanner.value;
      if (banner && banner.title) {
        if (myBusiness.value && myBusiness.value.owner && banner.title.includes('Rekan Kerja')) {
          return banner.title.replace('Rekan Kerja', myBusiness.value.owner);
        }
        return banner.title;
      }
      return `Selamat Datang, ${myBusiness.value?.owner || 'Rekan Kerja'}!`;
    });
    const pendingTasksCount = computed(() => store.getters.pendingTasksCount);
    const activeProjectsCount = computed(() => store.getters.activeProjectsCount);
    const totalClientsCount = computed(() => store.getters.totalClientsCount);
    const totalIncome = computed(() => store.getters.totalIncome);
    const totalExpense = computed(() => store.getters.totalExpense);
    const netProfit = computed(() => store.getters.netProfit);
    const isBudgetExceeded = computed(() => store.getters.isBudgetExceeded);
    const budgetThreshold = computed(() => store.getters.getBudgetThreshold);

    const recentTasks = computed(() => {
      return store.getters.getTasks.slice(0, 5);
    });

    const toggleTaskDone = (id) => {
      store.dispatch('toggleTask', id);
    };

    const formatCurrency = (val) => {
      if (isNaN(val)) val = 0;
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const badgeClass = (level) => {
      switch (level) {
        case 'Penting':
          return 'bg-danger text-white';
        case 'Menengah':
          return 'bg-warning text-dark';
        default:
          return 'bg-secondary text-white';
      }
    };

    return {
      myBusiness,
      welcomeBanner,
      welcomeTitleDisplay,
      pendingTasksCount,
      activeProjectsCount,
      totalClientsCount,
      totalIncome,
      totalExpense,
      netProfit,
      isBudgetExceeded,
      budgetThreshold,
      recentTasks,
      toggleTaskDone,
      formatCurrency,
      badgeClass
    };
  }
};
</script>

<style scoped>
.style-hero-banner {
  background: linear-gradient(135deg, #1e40af 0%, #1e293b 100%);
}

.style-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
}
</style>
