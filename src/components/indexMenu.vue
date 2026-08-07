<template>
  <div class="container-fluid py-2" data-aos="fade-up">
    <!-- Welcome Banner -->
    <div class="welcome-card card border-0 text-white rounded-4 shadow p-4 mb-4 position-relative overflow-hidden">
      <div class="position-relative z-1 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="badge bg-white text-dark fw-bold px-3 py-2 rounded-pill shadow-sm">
              <i class="bi bi-clock-fill me-1 text-primary"></i> {{ currentTime }} WIB
            </span>
            <span class="badge bg-white bg-opacity-25 text-white fw-semibold px-3 py-2 rounded-pill">
              {{ currentDate }}
            </span>
          </div>
          <h2 class="fw-bold display-6 mb-1">Selamat Datang di RajinKerja.id! 🚀</h2>
          <p class="mb-0 text-white-50">Kelola tugas harian, proyek pekerjaan, keuangan, invoice, dan agenda karir karyawan dalam satu platform terorganisir.</p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <router-link to="/invoice" class="btn btn-light text-primary fw-semibold rounded-3 px-3 py-2 shadow-sm">
            <i class="bi bi-receipt me-1"></i> Buat Invoice
          </router-link>
          <router-link to="/contacts" class="btn btn-outline-light fw-semibold rounded-3 px-3 py-2">
            <i class="bi bi-person-plus me-1"></i> Tambah Klien
          </router-link>
        </div>
      </div>
    </div>

    <!-- Stat Summary Cards Row -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white h-100 p-3 hover-card">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small fw-semibold">Pemasukan</span>
              <h4 class="fw-bold text-success mb-0 mt-1">Rp {{ totalIncome.toLocaleString('id-ID') }}</h4>
              <small class="text-muted">Total dari kas</small>
            </div>
            <div class="p-3 bg-success-subtle text-success rounded-3 fs-3">
              <i class="bi bi-cash-stack"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white h-100 p-3 hover-card">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small fw-semibold">Sisa Kas</span>
              <h4 class="fw-bold text-primary mb-0 mt-1">Rp {{ netProfit.toLocaleString('id-ID') }}</h4>
              <small class="text-muted">Profit Bersih</small>
            </div>
            <div class="p-3 bg-primary-subtle text-primary rounded-3 fs-3">
              <i class="bi bi-wallet2"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white h-100 p-3 hover-card">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small fw-semibold">Proyek Aktif</span>
              <h4 class="fw-bold text-dark mb-0 mt-1">{{ activeProjectsCount }} Proyek</h4>
              <small class="text-muted">Dalam pengerjaan</small>
            </div>
            <div class="p-3 bg-warning-subtle text-warning rounded-3 fs-3">
              <i class="bi bi-folder-fill"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-lg-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white h-100 p-3 hover-card">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small fw-semibold">Total Klien</span>
              <h4 class="fw-bold text-dark mb-0 mt-1">{{ totalClientsCount }} Kontak</h4>
              <small class="text-muted">Dalam database</small>
            </div>
            <div class="p-3 bg-info-subtle text-info rounded-3 fs-3">
              <i class="bi bi-people-fill"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Grid Sections -->
    <div class="row g-4 mb-4">
      <!-- Quick Tasks & To-Do Checklist (Left Column) -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 bg-white h-100">
          <div class="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
            <h5 class="fw-bold text-dark mb-0">
              <i class="bi bi-check2-square text-primary me-2"></i>Daftar Tugas Harian
            </h5>
            <router-link to="/todo" class="btn btn-sm btn-outline-primary rounded-pill px-3">
              Kelola Semua Task ({{ tasks.length }})
            </router-link>
          </div>
          <div class="card-body p-4">
            <div v-if="tasks.length > 0" class="d-flex flex-column gap-3">
              <div
                v-for="task in tasks.slice(0, 5)"
                :key="task.id"
                class="p-3 rounded-3 border d-flex align-items-center justify-content-between bg-light"
              >
                <div class="d-flex align-items-center gap-3">
                  <input
                    type="checkbox"
                    class="form-check-input style-chk"
                    :checked="task.done"
                    @change="toggleTask(task.id)"
                  />
                  <div>
                    <div class="fw-bold" :class="task.done ? 'text-decoration-line-through text-muted' : 'text-dark'">
                      {{ task.name }}
                    </div>
                    <small class="text-muted">
                      <i class="bi bi-tag-fill me-1 text-primary"></i>{{ task.projectTag || 'Umum' }}
                      <span class="mx-1">•</span>
                      <i class="bi bi-calendar-event me-1"></i>{{ task.deadline }}
                    </small>
                  </div>
                </div>
                <span :class="badgeClass(task.level)" class="px-2 py-1 rounded-pill small">
                  {{ task.level }}
                </span>
              </div>
            </div>
            <div v-else class="text-center py-4 text-muted">
              <i class="bi bi-card-checklist display-4"></i>
              <p class="mt-2">Belum ada tugas yang dicatat.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Invoices (Right Column) -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 bg-white h-100">
          <div class="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
            <h5 class="fw-bold text-dark mb-0">
              <i class="bi bi-receipt-cutoff text-success me-2"></i>Invoice Terbaru
            </h5>
            <router-link to="/invoice" class="btn btn-sm btn-outline-success rounded-pill px-3">
              Buat / Lihat Semua
            </router-link>
          </div>
          <div class="card-body p-4">
            <div v-if="invoices.length > 0" class="d-flex flex-column gap-3">
              <div v-for="inv in invoices.slice(0, 4)" :key="inv.id" class="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                <div>
                  <div class="fw-bold text-primary">{{ inv.invoiceNumber }}</div>
                  <div class="small fw-semibold text-dark">{{ inv.clientName }}</div>
                  <small class="text-muted">Jatuh Tempo: {{ inv.dueDate }}</small>
                </div>
                <div class="text-end">
                  <span :class="getStatusBadgeClass(inv.status)" class="badge px-3 py-1 rounded-pill mb-1">
                    {{ inv.status }}
                  </span>
                  <div class="fw-bold text-dark small">
                    {{ formatCurrency(calculateInvoiceTotal(inv), inv.currency) }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-muted">
              <i class="bi bi-receipt display-4"></i>
              <p class="mt-2">Belum ada invoice tagihan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Notes & Developer Info Row -->
    <div class="row g-4">
      <!-- Sticky Note -->
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 bg-warning bg-opacity-10 border-warning p-4 h-100">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="fw-bold text-dark mb-0"><i class="bi bi-sticky-fill text-warning me-2"></i>Catatan Tempel Harian (Scratchpad)</h5>
            <small class="text-muted">Otomatis tersimpan ke LocalStorage</small>
          </div>
          <textarea
            v-model="note"
            class="form-control border-0 bg-transparent text-dark fs-6"
            rows="4"
            placeholder="Tulis ide cepat, nomor rekening klien, atau draft instruksi di sini..."
          ></textarea>
        </div>
      </div>

      <!-- Developer Quote -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100 d-flex flex-column justify-content-between">
          <div>
            <h6 class="fw-bold text-muted text-uppercase mb-2"><i class="bi bi-quote text-primary me-1 fs-4"></i>Quote of the Day</h6>
            <blockquote class="blockquote mb-0 fs-6 fst-italic text-dark">
              "{{ quote }}"
            </blockquote>
          </div>
          <div class="pt-3 border-top mt-3 d-flex align-items-center justify-content-between">
            <small class="text-muted">— Arif Alexander (Founder Studio)</small>
            <router-link to="/chat" class="btn btn-sm btn-outline-primary rounded-pill">
              Contact Dev
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1090;">
      <div v-if="showToast" class="toast align-items-center text-white bg-success border-0 show shadow-lg rounded-3" role="alert">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="bi bi-check-circle-fill fs-5"></i>
            <span>Catatan berhasil tersimpan!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'IndexMenu',
  setup() {
    const store = useStore();

    const currentTime = ref('');
    const currentDate = ref('');
    const note = ref(localStorage.getItem('stickyNote') || '');
    const showToast = ref(false);

    const quotes = [
      'Kita tidak bisa mengubah arah angin, tetapi kita bisa menyesuaikan layar.',
      'Kesuksesan adalah hasil dari persiapan, kerja keras, dan belajar dari kegagalan.',
      'Jangan menunggu kesempatan, ciptakan kesempatan.',
      'Fokus pada kualitas pekerjaan Anda, karena hasil karya yang baik adalah reputasi terbaik.',
      'Setiap proyek adalah peluang untuk belajar dan berkembang.',
      'Kamu adalah bos dari waktumu, manfaatkan dengan bijak.'
    ];
    const quote = ref(quotes[Math.floor(Math.random() * quotes.length)]);

    const contacts = computed(() => store.getters.getContacts);
    const projects = computed(() => store.getters.getProjects);
    const tasks = computed(() => store.getters.getTasks);
    const invoices = computed(() => store.getters.getInvoices);

    const totalIncome = computed(() => store.getters.totalIncome);
    const netProfit = computed(() => store.getters.netProfit);
    const totalClientsCount = computed(() => store.getters.totalClientsCount);
    const activeProjectsCount = computed(() => store.getters.activeProjectsCount);

    onMounted(() => {
      const updateClock = () => {
        const now = new Date();
        currentTime.value = now.toLocaleTimeString('id-ID');
        currentDate.value = now.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };
      updateClock();
      setInterval(updateClock, 1000);
    });

    watch(note, (val) => {
      localStorage.setItem('stickyNote', val);
      showToast.value = true;
      setTimeout(() => (showToast.value = false), 2000);
    });

    const toggleTask = (id) => {
      store.dispatch('toggleTask', id);
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

    const getStatusBadgeClass = (status) => {
      switch (status) {
        case 'Paid':
          return 'bg-success text-white';
        case 'Sent':
          return 'bg-info text-dark';
        case 'Overdue':
          return 'bg-danger text-white';
        default:
          return 'bg-secondary text-white';
      }
    };

    const calculateInvoiceTotal = (inv) => {
      const subtotal = inv.items.reduce((sum, item) => sum + (Number(item.biaya || 0) * Number(item.quantity || 1)), 0);
      const tax = (subtotal * Number(inv.taxPercent || 0)) / 100;
      return subtotal + tax - Number(inv.discount || 0);
    };

    const formatCurrency = (amount, currency = 'IDR') => {
      if (isNaN(amount)) amount = 0;
      if (currency === 'USD') return `$${amount.toLocaleString('en-US')}`;
      return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    return {
      currentTime,
      currentDate,
      note,
      showToast,
      quote,
      contacts,
      projects,
      tasks,
      invoices,
      totalIncome,
      netProfit,
      totalClientsCount,
      activeProjectsCount,
      toggleTask,
      badgeClass,
      getStatusBadgeClass,
      calculateInvoiceTotal,
      formatCurrency
    };
  }
};
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
}

.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) !important;
}

.style-chk {
  width: 18px;
  height: 18px;
  cursor: pointer;
}
</style>
