<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-secondary-subtle text-secondary fw-semibold px-3 py-2 rounded-pill">App & Data Control</span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">⚙️ Settings, Backup JSON & Export Excel</h2>
        <p class="text-muted mb-0">Eksport backup JSON untuk dipindah ke laptop lain, ekspor ke Excel (.xlsx), atau atur profil bisnis Anda.</p>
      </div>
    </div>

    <div class="row g-4">
      <!-- Device Migration / Backup JSON Card -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
          <div class="d-flex align-items-center gap-2 mb-3">
            <i class="bi bi-laptop-fill fs-3 text-primary"></i>
            <div>
              <h5 class="fw-bold text-dark mb-0">Migrasi & Backup Data JSON</h5>
              <p class="small text-muted mb-0">Transfer seluruh data aplikasi ke laptop atau perangkat lain tanpa kehilangan histori.</p>
            </div>
          </div>

          <div class="p-3 bg-light rounded-3 mb-4 border">
            <h6 class="fw-bold text-dark mb-1"><i class="bi bi-download text-success me-2"></i>1. Export JSON Backup</h6>
            <p class="small text-muted mb-3">Unduh berkas `.json` berisi seluruh data kontak, proyek, tugas, transaksi, dan invoice.</p>
            <button class="btn btn-primary w-100 rounded-3 fw-semibold" @click="exportJSONBackup">
              <i class="bi bi-download me-1"></i> Unduh Full Backup JSON
            </button>
          </div>

          <div class="p-3 bg-light rounded-3 border">
            <h6 class="fw-bold text-dark mb-1"><i class="bi bi-upload text-primary me-2"></i>2. Import JSON dari Laptop Lain</h6>
            <p class="small text-muted mb-2">Pilih berkas `.json` yang diunduh dari laptop lama untuk memulihkan seluruh data Anda.</p>
            <input type="file" class="form-control mb-3" accept=".json" @change="handleJSONImport" ref="jsonFileInput" />
            <div class="small text-danger fw-semibold" v-if="importError">{{ importError }}</div>
          </div>
        </div>
      </div>

      <!-- Excel Bulk Exporter Card -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
          <div class="d-flex align-items-center gap-2 mb-3">
            <i class="bi bi-file-earmark-excel-fill fs-3 text-success"></i>
            <div>
              <h5 class="fw-bold text-dark mb-0">Export Laporan Excel (.xlsx)</h5>
              <p class="small text-muted mb-0">Unduh data terpisah sesuai kebutuhan pembukuan atau pelaporan.</p>
            </div>
          </div>

          <div class="d-flex flex-column gap-2">
            <button class="btn btn-outline-success d-flex justify-content-between align-items-center p-3 rounded-3 text-start" @click="exportTransactionsExcel">
              <div>
                <span class="fw-bold d-block text-dark"><i class="bi bi-wallet2 me-2 text-success"></i>Laporan Transaksi Keuangan</span>
                <small class="text-muted">Format .xlsx lengkap dengan nominal, tipe, dan kategori</small>
              </div>
              <i class="bi bi-download"></i>
            </button>

            <button class="btn btn-outline-success d-flex justify-content-between align-items-center p-3 rounded-3 text-start" @click="exportContactsExcel">
              <div>
                <span class="fw-bold d-block text-dark"><i class="bi bi-person-lines-fill me-2 text-info"></i>Database Kontak Klien</span>
                <small class="text-muted">Format .xlsx berisi email, nomor telepon, dan status klien</small>
              </div>
              <i class="bi bi-download"></i>
            </button>

            <button class="btn btn-outline-success d-flex justify-content-between align-items-center p-3 rounded-3 text-start" @click="exportProjectsExcel">
              <div>
                <span class="fw-bold d-block text-dark"><i class="bi bi-folder-fill me-2 text-primary"></i>Daftar Proyek & Kontrak</span>
                <small class="text-muted">Format .xlsx nilai kontrak, deadline, dan persentase progres</small>
              </div>
              <i class="bi bi-download"></i>
            </button>

            <button class="btn btn-outline-success d-flex justify-content-between align-items-center p-3 rounded-3 text-start" @click="exportTasksExcel">
              <div>
                <span class="fw-bold d-block text-dark"><i class="bi bi-check2-square me-2 text-warning"></i>Daftar Tugas (To-Do List)</span>
                <small class="text-muted">Format .xlsx seluruh tugas, deadline, dan frekuensi berulang</small>
              </div>
              <i class="bi bi-download"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Business Profile Settings -->
      <div class="col-lg-12">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
          <h5 class="fw-bold text-dark mb-3"><i class="bi bi-building-gear text-primary me-2"></i>Profil Usaha / Studio Freelance</h5>
          <form @submit.prevent="saveBusinessProfile" class="row g-3">
            <div class="col-md-6">
              <label class="form-label fw-semibold">Nama Studio / Brand</label>
              <input type="text" class="form-control" v-model="businessForm.name" />
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold">Tagline Specialist</label>
              <input type="text" class="form-control" v-model="businessForm.tagline" />
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold">Nama Pemilik / Owner</label>
              <input type="text" class="form-control" v-model="businessForm.owner" />
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold">Email Kontak</label>
              <input type="email" class="form-control" v-model="businessForm.email" />
            </div>

            <div class="col-md-4">
              <label class="form-label fw-semibold">Nama Bank</label>
              <input type="text" class="form-control" v-model="businessForm.bankName" placeholder="Bank BCA" />
            </div>

            <div class="col-md-4">
              <label class="form-label fw-semibold">Nomor Rekening</label>
              <input type="text" class="form-control" v-model="businessForm.accountNumber" placeholder="123-456-7890" />
            </div>

            <div class="col-md-4">
              <label class="form-label fw-semibold">Atas Nama Rekening</label>
              <input type="text" class="form-control" v-model="businessForm.accountHolder" placeholder="Arif Alexander" />
            </div>

            <div class="col-12 text-end pt-2">
              <button type="submit" class="btn btn-primary px-4 rounded-3 fw-semibold">Simpan Profil Studio</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Data Reset / Sample Controls -->
      <div class="col-lg-12">
        <div class="card border border-2 border-danger shadow-sm rounded-4 bg-danger bg-opacity-10 p-4">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 class="fw-bold text-danger mb-1">🔥 Zona Pengaturan Data (Raw & Empty State)</h5>
              <p class="small text-danger mb-0">Atur ulang seluruh aplikasi menjadi kosong bersih (raw) atau muat data sampel untuk eksplorasi.</p>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-outline-danger fw-bold rounded-3" @click="resetToRawEmpty">
                <i class="bi bi-trash3-fill me-1"></i> Bersihkan Semua Data (Make Empty)
              </button>
              <button class="btn btn-secondary fw-semibold rounded-3" @click="loadSampleData">
                <i class="bi bi-box-seam me-1"></i> Muat Data Contoh (Demo)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1090;">
      <div v-if="toast.show" class="toast align-items-center text-white bg-success border-0 show shadow-lg rounded-3" role="alert">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="bi bi-check-circle-fill fs-5"></i>
            <span>{{ toast.message }}</span>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="toast.show = false"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import * as XLSX from 'xlsx';

export default {
  name: 'SettingsView',
  setup() {
    const store = useStore();
    const jsonFileInput = ref(null);
    const importError = ref('');
    const toast = ref({ show: false, message: '' });

    const myBusiness = computed(() => store.getters.getMyBusiness);
    const businessForm = ref({ ...myBusiness.value });

    const showToastMsg = (msg) => {
      toast.value.message = msg;
      toast.value.show = true;
      setTimeout(() => (toast.value.show = false), 3000);
    };

    const exportJSONBackup = () => {
      const fullState = {
        contacts: store.getters.getContacts,
        projects: store.getters.getProjects,
        tasks: store.getters.getTasks,
        transactions: store.getters.getTransactions,
        invoices: store.getters.getInvoices,
        habits: store.getters.getHabits,
        notes: store.getters.getNotes,
        budgetThreshold: store.getters.getBudgetThreshold,
        myBusiness: store.getters.getMyBusiness,
        exportDate: new Date().toISOString()
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullState, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `freelancer_toolkit_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToastMsg('Backup JSON berhasil diunduh!');
    };

    const handleJSONImport = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (confirm('Import data ini dan timpa data lokal Anda saat ini?')) {
            store.dispatch('importFullData', parsed);
            showToastMsg('Data JSON berhasil dimuat dari file!');
            importError.value = '';
          }
        } catch (err) {
          importError.value = 'Format file JSON tidak valid. Pastikan memilih berkas yang benar.';
        }
      };
      reader.readAsText(file);
    };

    const saveBusinessProfile = () => {
      store.dispatch('updateMyBusiness', businessForm.value);
      showToastMsg('Profil studio berhasil diperbarui!');
    };

    const resetToRawEmpty = () => {
      if (confirm('Lakukan reset total? Seluruh data akan dikosongkan (raw & clean state).')) {
        store.dispatch('clearAllData');
        showToastMsg('Semua data berhasil dikosongkan (Raw Empty State).');
      }
    };

    const loadSampleData = () => {
      if (confirm('Muat data contoh / demo?')) {
        store.dispatch('loadSampleData');
        showToastMsg('Data contoh berhasil dimuat!');
      }
    };

    const exportTransactionsExcel = () => {
      const data = store.getters.getTransactions.map((t, i) => ({
        No: i + 1,
        Deskripsi: t.item,
        Kategori: t.category,
        Tipe: t.type,
        Nominal: t.amount,
        Tanggal: t.date,
        Metode: t.method
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Transaksi');
      XLSX.writeFile(wb, 'transaksi_keuangan.xlsx');
      showToastMsg('Excel Transaksi diunduh!');
    };

    const exportContactsExcel = () => {
      const data = store.getters.getContacts.map((c, i) => ({
        No: i + 1,
        Nama: c.name,
        Perusahaan: c.company,
        Email: c.email,
        Telepon: c.phone,
        Status: c.status
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Kontak');
      XLSX.writeFile(wb, 'kontak_klien.xlsx');
      showToastMsg('Excel Kontak diunduh!');
    };

    const exportProjectsExcel = () => {
      const data = store.getters.getProjects.map((p, i) => ({
        No: i + 1,
        Judul: p.projectTitle,
        Klien: p.clientName,
        Rate: p.rate,
        Status: p.status,
        Progres: p.progress + '%',
        Deadline: p.deadline
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Proyek');
      XLSX.writeFile(wb, 'daftar_proyek.xlsx');
      showToastMsg('Excel Proyek diunduh!');
    };

    const exportTasksExcel = () => {
      const data = store.getters.getTasks.map((t, i) => ({
        No: i + 1,
        NamaTugas: t.name,
        Level: t.level,
        Recurring: t.recurring,
        Deadline: t.deadline,
        Done: t.done ? 'Selesai' : 'Pending'
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Tugas');
      XLSX.writeFile(wb, 'daftar_tugas.xlsx');
      showToastMsg('Excel Tugas diunduh!');
    };

    return {
      jsonFileInput,
      importError,
      toast,
      businessForm,
      exportJSONBackup,
      handleJSONImport,
      saveBusinessProfile,
      resetToRawEmpty,
      loadSampleData,
      exportTransactionsExcel,
      exportContactsExcel,
      exportProjectsExcel,
      exportTasksExcel
    };
  }
};
</script>
