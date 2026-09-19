<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Top Shared Header Navigation -->
    <FinanceNavHeader
      title="6. Keamanan & Kepatuhan (Security & Compliance)"
      subtitle="Akses Berbasis Peran (RBAC) bertingkat dan catatan Jejak Audit (Audit Trail) digital yang tidak dapat diubah (immutable logs) untuk kepatuhan tata kelola."
    />

    <!-- Main Navigation Sub-tabs -->
    <div class="card border-0 shadow-sm rounded-4 bg-white mb-4 p-2 no-print">
      <ul class="nav nav-pills nav-fill gap-2" role="tablist">
        <li class="nav-item">
          <button
            class="nav-link rounded-3 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
            :class="{ active: activeTab === 'audit-trail' }"
            @click="activeTab = 'audit-trail'"
          >
            <i class="bi bi-clock-history"></i>
            <span>Jejak Audit Digital (Audit Trail Logs)</span>
            <span class="badge bg-primary text-white rounded-pill small">{{ auditLogs.length }} Aktivitas</span>
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link rounded-3 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
            :class="{ active: activeTab === 'rbac' }"
            @click="activeTab = 'rbac'"
          >
            <i class="bi bi-shield-lock-fill"></i>
            <span>Matriks Akses Berbasis Peran (RBAC)</span>
          </button>
        </li>
      </ul>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 1: AUDIT TRAIL LOGS                                                   -->
    <!-- ========================================================================= -->
    <div v-show="activeTab === 'audit-trail'">
      <!-- Metrik Audit -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-primary">
            <span class="text-muted small fw-semibold">Total Aktivitas Tercatat</span>
            <h4 class="fw-bold mb-1 text-dark">{{ auditLogs.length }} Log</h4>
            <div class="small text-muted">Aktivitas real-time tersimpan aman</div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-success">
            <span class="text-muted small fw-semibold">Persetujuan Disahkan (Approval)</span>
            <h4 class="fw-bold mb-1 text-success">{{ countByAction('APPROVE') }} Approval</h4>
            <div class="small text-muted">Otorisasi manajer & direksi</div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-warning">
            <span class="text-muted small fw-semibold">Pembaruan & Rekonsiliasi</span>
            <h4 class="fw-bold mb-1 text-warning">{{ countByAction('UPDATE') + countByAction('RECONCILE') }} Event</h4>
            <div class="small text-muted">Perubahan data transaksi</div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-danger">
            <span class="text-muted small fw-semibold">Penghapusan Data (Deletion)</span>
            <h4 class="fw-bold mb-1 text-danger">{{ countByAction('DELETE') }} Event</h4>
            <div class="small text-muted">Dipantau ketat untuk audit fraud</div>
          </div>
        </div>
      </div>

      <!-- Action Toolbar Audit Logs -->
      <div class="card border-0 shadow-sm rounded-4 bg-white p-3 mb-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div class="d-flex flex-wrap align-items-center gap-2">
            <div class="input-group input-group-sm" style="max-width: 280px;">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
              <input
                type="text"
                class="form-control border-start-0"
                placeholder="Cari user, modul, atau rincian..."
                v-model="searchAudit"
              />
            </div>

            <select class="form-select form-select-sm" style="width: auto;" v-model="filterAction">
              <option value="all">Semua Jenis Aksi</option>
              <option value="CREATE">Pencatatan Baru (CREATE)</option>
              <option value="UPDATE">Pembaruan Data (UPDATE)</option>
              <option value="APPROVE">Persetujuan Dokumen (APPROVE)</option>
              <option value="RECONCILE">Rekonsiliasi Bank (RECONCILE)</option>
              <option value="EXPORT_EXCEL">Ekspor Berkas (EXPORT)</option>
              <option value="DELETE">Penghapusan (DELETE)</option>
            </select>
          </div>

          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-outline-success btn-sm px-3 rounded-pill fw-semibold" @click="exportAuditLogsExcel">
              <i class="bi bi-file-earmark-excel-fill text-success me-1"></i> Ekspor Log Audit
            </button>
            <button class="btn btn-outline-danger btn-sm px-3 rounded-pill fw-semibold" @click="clearAuditLogsConfirm">
              <i class="bi bi-trash3-fill me-1"></i> Bersihkan Log
            </button>
          </div>
        </div>
      </div>

      <!-- Audit Logs Table -->
      <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden mb-4">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light text-muted small text-uppercase">
              <tr>
                <th class="ps-3 py-3">Waktu (Timestamp)</th>
                <th>Pengguna (User)</th>
                <th>Peran (Role)</th>
                <th>Modul Sistem</th>
                <th>Jenis Tindakan</th>
                <th>Rincian Catatan Perubahan</th>
                <th class="text-center pe-3">IP / Device</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredAuditLogs.length === 0">
                <td colspan="7" class="text-center py-5 text-muted">
                  Tidak ada catatan audit yang cocok dengan filter.
                </td>
              </tr>
              <tr v-for="log in filteredAuditLogs" :key="log.id">
                <td class="ps-3 font-monospace small text-muted">
                  {{ formatTimestamp(log.timestamp) }}
                </td>
                <td>
                  <div class="fw-bold text-dark">{{ log.user }}</div>
                </td>
                <td>
                  <span class="badge bg-light text-dark border">{{ log.role }}</span>
                </td>
                <td>
                  <span class="fw-semibold text-secondary">{{ log.module }}</span>
                </td>
                <td>
                  <span
                    class="badge rounded-pill px-2.5 py-1"
                    :class="{
                      'bg-primary text-white': log.action === 'CREATE' || log.action === 'CREATE_VOUCHER',
                      'bg-warning text-dark': log.action === 'UPDATE' || log.action === 'UPDATE_MODEL',
                      'bg-success text-white': log.action === 'APPROVE' || log.action === 'APPROVE_BATCH',
                      'bg-info text-white': log.action === 'RECONCILE' || log.action === 'REPLENISH',
                      'bg-danger text-white': log.action === 'DELETE',
                      'bg-secondary text-white': log.action.includes('EXPORT') || log.action.includes('PRINT')
                    }"
                  >
                    {{ log.action }}
                  </span>
                </td>
                <td>
                  <div class="text-dark small" style="max-width: 380px;">{{ log.details }}</div>
                </td>
                <td class="text-center pe-3">
                  <span class="font-monospace small text-muted bg-light px-2 py-0.5 rounded border" style="font-size: 11px;">
                    {{ log.ipAddress || '192.168.1.10' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 2: MATRIKS AKSES BERBASIS PERAN (RBAC)                                -->
    <!-- ========================================================================= -->
    <div v-show="activeTab === 'rbac'">
      <!-- Penjelasan Tata Kelola RBAC -->
      <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 class="fw-bold text-dark mb-1">
              <i class="bi bi-shield-check text-success me-1"></i> Matriks Otorisasi Berdasarkan Jabatan (Segregation of Duties)
            </h5>
            <p class="text-muted small mb-0">
              Menjaga kepatuhan tata kelola internal perusahaan dengan memisahkan tugas (Segregation of Duties) antara pencatat, pemeriksa, penyetujui, dan auditor.
            </p>
          </div>
          <button class="btn btn-outline-primary btn-sm rounded-pill px-3" @click="saveRbacConfig">
            <i class="bi bi-check2-circle me-1"></i> Simpan Matriks Hak Akses
          </button>
        </div>

        <!-- Role Badges Summary -->
        <div class="row g-3 mb-4">
          <div v-for="r in roleCards" :key="r.id" class="col-12 col-md-6 col-xl-3">
            <div class="card border rounded-4 p-3 h-100" :class="{ 'border-primary bg-primary-subtle bg-opacity-25': activeRole.id === r.id }">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="badge rounded-pill px-2.5 py-1" :class="r.badgeClass">{{ r.title }}</span>
                <i :class="r.iconClass" class="fs-4"></i>
              </div>
              <h6 class="fw-bold text-dark mb-1">{{ r.name }}</h6>
              <p class="text-muted small mb-2">{{ r.description }}</p>
              <div class="mt-auto pt-2 border-top">
                <button
                  class="btn btn-sm w-100 rounded-pill"
                  :class="activeRole.id === r.id ? 'btn-primary' : 'btn-outline-secondary'"
                  @click="switchCurrentRole(r.id)"
                >
                  <i class="bi bi-person-check me-1"></i> {{ activeRole.id === r.id ? 'Aktif Digunakan' : 'Beralih ke Peran Ini' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive RBAC Matrix Table -->
        <h6 class="fw-bold text-dark mb-3">Tabel Matriks Hak Akses Modul</h6>
        <div class="table-responsive">
          <table class="table table-bordered table-hover align-middle mb-0">
            <thead class="table-light text-muted small text-uppercase">
              <tr>
                <th class="ps-3 py-3" style="width: 250px;">Modul & Fungsi Finansial</th>
                <th class="text-center">Staf Finance</th>
                <th class="text-center">Manajer Finance</th>
                <th class="text-center">Direktur Keuangan (CFO)</th>
                <th class="text-center">Auditor Internal/Eksternal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="perm in permissionsMatrix" :key="perm.feature">
                <td class="ps-3 fw-bold text-dark">
                  <i :class="perm.icon" class="text-primary me-2"></i>
                  <span>{{ perm.feature }}</span>
                </td>
                <td class="text-center">
                  <input type="checkbox" class="form-check-input" v-model="perm.roles.staff" />
                </td>
                <td class="text-center">
                  <input type="checkbox" class="form-check-input" v-model="perm.roles.manager" />
                </td>
                <td class="text-center">
                  <input type="checkbox" class="form-check-input" v-model="perm.roles.cfo" />
                </td>
                <td class="text-center">
                  <input type="checkbox" class="form-check-input" v-model="perm.roles.auditor" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import FinanceNavHeader from '../../components/FinanceNavHeader.vue';
import {
  STORAGE_KEYS,
  safeGet,
  safeSet,
  getCurrentRole,
  setCurrentRole,
  logAuditTrail,
  initFinanceSeedData
} from '../../utils/financeSystemStore';

export default {
  name: 'FinanceSecurityAuditView',
  components: {
    FinanceNavHeader
  },
  setup() {
    const activeTab = ref('audit-trail');
    const auditLogs = ref([]);
    const activeRole = ref(getCurrentRole());

    // Search & Filter
    const searchAudit = ref('');
    const filterAction = ref('all');

    const roleCards = [
      {
        id: 'staff',
        name: 'Staf Keuangan (Finance Staff)',
        title: 'Input & Operasional',
        badgeClass: 'bg-secondary text-white',
        iconClass: 'bi bi-person-workspace text-secondary',
        description: 'Mencatat transaksi harian, mengunggah invoice vendor, rekonsiliasi kasir kas kecil, dan mengekspor laporan standar.'
      },
      {
        id: 'manager',
        name: 'Manajer Keuangan (Finance Manager)',
        title: 'Verifikasi & Approval Tier 1',
        badgeClass: 'bg-primary text-white',
        iconClass: 'bi bi-person-badge-fill text-primary',
        description: 'Memeriksa keabsahan bukti bayar, menyetujui pengajuan reimbursement dan tagihan AP hingga Rp 25.000.000.'
      },
      {
        id: 'cfo',
        name: 'Chief Financial Officer (CFO)',
        title: 'Otoritas Tertinggi (Executive)',
        badgeClass: 'bg-danger text-white',
        iconClass: 'bi bi-person-fill-lock text-danger',
        description: 'Otorisasi pencairan dana tak terbatas, penetapan pagu plafon anggaran tiap divisi, penyesuaian model forecasting.'
      },
      {
        id: 'auditor',
        name: 'Auditor Internal / Eksternal',
        title: 'Read-Only & Verifikasi Kepatuhan',
        badgeClass: 'bg-info text-white',
        iconClass: 'bi bi-search text-info',
        description: 'Akses penuh membaca seluruh buku besar, kuitansi nota OCR, log jejak audit tanpa hak memodifikasi transaksi.'
      }
    ];

    const permissionsMatrix = ref([
      { feature: 'Melihat Ringkasan Arus Kas', icon: 'bi bi-speedometer2', roles: { staff: true, manager: true, cfo: true, auditor: true } },
      { feature: 'Pencatatan Transaksi & Rekonsiliasi Bank', icon: 'bi bi-bank', roles: { staff: true, manager: true, cfo: true, auditor: false } },
      { feature: 'Penerbitan Invoice Piutang (AR)', icon: 'bi bi-receipt-cutoff', roles: { staff: true, manager: true, cfo: true, auditor: false } },
      { feature: 'Pencatatan Tagihan Vendor (AP)', icon: 'bi bi-bag-check', roles: { staff: true, manager: true, cfo: true, auditor: false } },
      { feature: 'Persetujuan Tagihan Vendor (AP Approval)', icon: 'bi bi-check2-square', roles: { staff: false, manager: true, cfo: true, auditor: false } },
      { feature: 'Pengesahan Klaim Reimbursement', icon: 'bi bi-file-earmark-check', roles: { staff: false, manager: true, cfo: true, auditor: false } },
      { feature: 'Penetapan Batas Plafon Anggaran', icon: 'bi bi-sliders', roles: { staff: false, manager: false, cfo: true, auditor: false } },
      { feature: 'Akses Dokumen Laporan PSAK/IFRS', icon: 'bi bi-file-earmark-spreadsheet', roles: { staff: true, manager: true, cfo: true, auditor: true } },
      { feature: 'Akses Log Jejak Audit & Kepatuhan', icon: 'bi bi-clock-history', roles: { staff: false, manager: true, cfo: true, auditor: true } }
    ]);

    const loadAuditLogs = () => {
      initFinanceSeedData();
      auditLogs.value = safeGet(STORAGE_KEYS.AUDIT_LOGS, []);
      activeRole.value = getCurrentRole();
    };

    const countByAction = (act) => {
      return auditLogs.value.filter(l => l.action.includes(act)).length;
    };

    const filteredAuditLogs = computed(() => {
      let list = [...auditLogs.value];
      if (searchAudit.value) {
        const q = searchAudit.value.toLowerCase();
        list = list.filter(
          l =>
            l.user.toLowerCase().includes(q) ||
            l.module.toLowerCase().includes(q) ||
            l.details.toLowerCase().includes(q)
        );
      }
      if (filterAction.value !== 'all') {
        list = list.filter(l => l.action.includes(filterAction.value));
      }
      return list;
    });

    const formatTimestamp = (ts) => {
      if (!ts) return '-';
      const d = new Date(ts);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };

    const switchCurrentRole = (roleId) => {
      setCurrentRole(roleId);
      activeRole.value = getCurrentRole();
      logAuditTrail({
        module: 'Keamanan & Kepatuhan',
        action: 'ROLE_SWITCH',
        details: `Beralih peran aktif menjadi ${activeRole.value.name}`
      });
      loadAuditLogs();
      Swal.fire({
        icon: 'success',
        title: 'Peran Berganti',
        text: `Anda sekarang beroperasi sebagai: ${activeRole.value.name}`,
        timer: 1500,
        showConfirmButton: false
      });
    };

    const saveRbacConfig = () => {
      safeSet('finance_rbac_matrix_config', permissionsMatrix.value);
      logAuditTrail({
        module: 'Keamanan & Kepatuhan',
        action: 'UPDATE',
        details: 'Memperbarui konfigurasi hak akses matriks otorisasi jabatan (RBAC)'
      });
      loadAuditLogs();
      Swal.fire({
        icon: 'success',
        title: 'Matriks RBAC Diperbarui',
        text: 'Konfigurasi hak akses berbasis peran telah disimpan ke sistem.',
        timer: 1500,
        showConfirmButton: false
      });
    };

    const exportAuditLogsExcel = () => {
      const data = auditLogs.value.map(l => ({
        'Timestamp': formatTimestamp(l.timestamp),
        'User': l.user,
        'Role': l.role,
        'Modul': l.module,
        'Tindakan': l.action,
        'Rincian Aktivitas': l.details,
        'IP Address': l.ipAddress || '192.168.1.10'
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Jejak Audit');
      XLSX.writeFile(wb, `Audit_Trail_Logs_${new Date().toISOString().substring(0, 10)}.xlsx`);

      logAuditTrail({
        module: 'Keamanan & Kepatuhan',
        action: 'EXPORT_EXCEL',
        details: 'Mengunduh seluruh berkas catatan jejak audit untuk verifikasi'
      });
      loadAuditLogs();
    };

    const clearAuditLogsConfirm = () => {
      if (!activeRole.value.canApprove) {
        Swal.fire({
          icon: 'error',
          title: 'Akses Ditolak',
          text: 'Hanya peran CFO atau Auditor yang diizinkan mengelola riwayat audit log.'
        });
        return;
      }

      Swal.fire({
        title: 'Bersihkan Riwayat Audit?',
        text: 'Tindakan ini akan mengosongkan log audit lokal. Pastikan Anda telah mengekspor cadangan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Bersihkan',
        confirmButtonColor: '#ef4444'
      }).then(res => {
        if (res.isConfirmed) {
          auditLogs.value = [];
          safeSet(STORAGE_KEYS.AUDIT_LOGS, []);
          logAuditTrail({
            module: 'Keamanan & Kepatuhan',
            action: 'DELETE',
            details: 'Membersihkan berkas log jejak audit sistem'
          });
          loadAuditLogs();
          Swal.fire({ icon: 'success', title: 'Log Dikosongkan', timer: 1200, showConfirmButton: false });
        }
      });
    };

    onMounted(() => {
      loadAuditLogs();
      const savedMatrix = safeGet('finance_rbac_matrix_config', null);
      if (savedMatrix) {
        permissionsMatrix.value = savedMatrix;
      }
    });

    return {
      activeTab,
      auditLogs,
      activeRole,
      roleCards,
      permissionsMatrix,
      searchAudit,
      filterAction,
      filteredAuditLogs,
      countByAction,
      formatTimestamp,
      switchCurrentRole,
      saveRbacConfig,
      exportAuditLogsExcel,
      clearAuditLogsConfirm
    };
  }
};
</script>

<style scoped>
.font-monospace {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>
