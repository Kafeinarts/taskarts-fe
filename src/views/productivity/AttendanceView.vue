<template>
  <div class="container-fluid py-4 main-view-viewport">
    <!-- Header -->
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h4 class="fw-bold mb-1 text-app">
          <i class="bi bi-clock-history me-2 text-primary"></i>Absensi
        </h4>
        <p class="text-muted small mb-0">Riwayat login & logout semua user.</p>
      </div>
      <div class="d-flex gap-2">
        <select class="form-select form-select-sm rounded-3" style="width: 130px;" v-model="filterDays">
          <option :value="7">7 Hari</option>
          <option :value="30">30 Hari</option>
          <option :value="90">90 Hari</option>
        </select>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-primary text-white">
          <div class="card-body py-3 px-3 text-center">
            <div class="fw-bold" style="font-size: 1.8rem;">{{ totalLogins }}</div>
            <small class="opacity-75">Total Login</small>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-success text-white">
          <div class="card-body py-3 px-3 text-center">
            <div class="fw-bold" style="font-size: 1.8rem;">{{ totalLogouts }}</div>
            <small class="opacity-75">Total Logout</small>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-info text-white">
          <div class="card-body py-3 px-3 text-center">
            <div class="fw-bold" style="font-size: 1.8rem;">{{ uniqueUsers }}</div>
            <small class="opacity-75">User Aktif</small>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-warning text-dark">
          <div class="card-body py-3 px-3 text-center">
            <div class="fw-bold" style="font-size: 1.8rem;">{{ todayCount }}</div>
            <small class="opacity-75">Aktivitas Hari Ini</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- Daily Summary Table -->
    <div v-else>
      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-header bg-white border-bottom-0 pt-3 pb-0 px-4">
          <h6 class="fw-bold text-app mb-0"><i class="bi bi-calendar3 me-2"></i>Ringkasan Harian</h6>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
              <thead class="table-light">
                <tr>
                  <th class="ps-3 py-2 fw-semibold" style="font-size: 0.78rem;">Tanggal</th>
                  <th class="py-2 fw-semibold" style="font-size: 0.78rem;">User</th>
                  <th class="py-2 fw-semibold" style="font-size: 0.78rem;">Role</th>
                  <th class="py-2 fw-semibold" style="font-size: 0.78rem;">Login Pertama</th>
                  <th class="py-2 fw-semibold" style="font-size: 0.78rem;">Logout Terakhir</th>
                  <th class="py-2 fw-semibold" style="font-size: 0.78rem;">Durasi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in summaryData" :key="idx">
                  <td class="ps-3 fw-medium small">{{ formatDate(row.date) }}</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <div class="avatar-kafeinarts" style="width: 28px; height: 28px; font-size: 0.6rem;">
                        <span>{{ (row.user?.name || 'U').charAt(0) }}</span>
                      </div>
                      <span class="small">{{ row.user?.name || '-' }}</span>
                    </div>
                  </td>
                  <td><span class="badge rounded-pill" :class="roleBadgeClass(row.user?.role)">{{ row.user?.role || '-' }}</span></td>
                  <td class="small text-success fw-medium">{{ row.first_login ? formatTime(row.first_login) : '-' }}</td>
                  <td class="small text-danger fw-medium">{{ row.last_logout ? formatTime(row.last_logout) : '-' }}</td>
                  <td class="small fw-medium">{{ calcDuration(row.first_login, row.last_logout) }}</td>
                </tr>
                <tr v-if="summaryData.length === 0">
                  <td colspan="6" class="text-center text-muted py-4 small">Tidak ada data absensi.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Detailed Logs -->
      <div class="card border-0 shadow-sm rounded-4 mt-4">
        <div class="card-header bg-white border-bottom-0 pt-3 pb-0 px-4">
          <h6 class="fw-bold text-app mb-0"><i class="bi bi-list-ul me-2"></i>Log Detail</h6>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
              <thead class="table-light">
                <tr>
                  <th class="ps-3 py-2 fw-semibold" style="font-size: 0.78rem;">Waktu</th>
                  <th class="py-2 fw-semibold" style="font-size: 0.78rem;">User</th>
                  <th class="py-2 fw-semibold" style="font-size: 0.78rem;">Tipe</th>
                  <th class="py-2 fw-semibold" style="font-size: 0.78rem;">IP</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in logs" :key="log.id">
                  <td class="ps-3 small">{{ formatDateTime(log.logged_at) }}</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <div class="avatar-kafeinarts" style="width: 26px; height: 26px; font-size: 0.55rem;">
                        <span>{{ (log.user?.name || 'U').charAt(0) }}</span>
                      </div>
                      <span class="small">{{ log.user?.name || '-' }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge rounded-pill" :class="log.type === 'login' ? 'bg-success' : 'bg-secondary'">
                      <i :class="log.type === 'login' ? 'bi-box-arrow-in-right' : 'bi-box-arrow-right'" class="me-1"></i>{{ log.type }}
                    </span>
                  </td>
                  <td class="small text-muted">{{ log.ip_address || '-' }}</td>
                </tr>
                <tr v-if="logs.length === 0">
                  <td colspan="4" class="text-center text-muted py-4 small">Tidak ada log.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/boot/axios';

export default {
  name: 'AttendanceView',
  data() {
    return {
      logs: [],
      summaryData: [],
      loading: true,
      filterDays: 30,
    };
  },
  computed: {
    totalLogins() { return this.logs.filter(l => l.type === 'login').length; },
    totalLogouts() { return this.logs.filter(l => l.type === 'logout').length; },
    uniqueUsers() { return new Set(this.logs.map(l => l.user_id)).size; },
    todayCount() {
      const today = new Date().toISOString().split('T')[0];
      return this.logs.filter(l => l.logged_at && l.logged_at.startsWith(today)).length;
    },
  },
  watch: {
    filterDays() { this.fetchData(); },
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const [logsRes, summaryRes] = await Promise.all([
          api.get('/attendance', { params: { days: this.filterDays } }),
          api.get('/attendance/summary', { params: { days: this.filterDays } }),
        ]);
        this.logs = logsRes.data.data || [];
        this.summaryData = summaryRes.data.data || [];
      } catch (e) {
        console.error('Failed to load attendance:', e);
      } finally {
        this.loading = false;
      }
    },
    formatDate(d) {
      return d ? new Date(d).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '-';
    },
    formatTime(dt) {
      return dt ? new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';
    },
    formatDateTime(dt) {
      return dt ? new Date(dt).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-';
    },
    calcDuration(login, logout) {
      if (!login || !logout) return '-';
      const diff = new Date(logout) - new Date(login);
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      return hours > 0 ? `${hours}j ${mins}m` : `${mins}m`;
    },
    roleBadgeClass(role) {
      const map = { admin: 'bg-primary', supervisor: 'bg-info text-dark', finance: 'bg-success', pic: 'bg-warning text-dark', employee: 'bg-secondary', member: 'bg-light text-dark border', internship: 'bg-purple text-white' };
      return map[role] || 'bg-secondary';
    },
  },
  mounted() { this.fetchData(); },
};
</script>
