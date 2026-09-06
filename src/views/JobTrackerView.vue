<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border header-banner">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
          <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-briefcase-fill me-1"></i> Career & Job Application Hub
          </span>
          <span class="badge bg-info-subtle text-info fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-shield-check me-1"></i> No Pop-up • Clean Dedicated Page
          </span>
        </div>
        <h2 class="fw-extrabold mb-1 text-dark">💼 Simpan & Pantau Lamaran Kerja</h2>
        <p class="text-muted mb-0">Kelola riwayat lamaran dari <strong>Glints</strong>, <strong>LinkedIn</strong>, <strong>Jobstreet</strong>, <strong>Kalibrr</strong>, dan portal kerja lainnya secara terstruktur tanpa popup.</p>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex flex-wrap align-items-center gap-2">
        <button
          v-if="currentView !== 'form'"
          class="btn btn-primary fw-bold px-4 py-2.5 rounded-3 shadow-sm d-flex align-items-center gap-2"
          @click="openAddForm"
        >
          <i class="bi bi-plus-circle-fill"></i>
          <span>Tambah Lamaran Baru</span>
        </button>

        <button
          v-else
          class="btn btn-outline-dark fw-bold px-3 py-2.5 rounded-3 shadow-sm d-flex align-items-center gap-2"
          @click="closeForm"
        >
          <i class="bi bi-arrow-left"></i>
          <span>Kembali ke Daftar</span>
        </button>

        <button class="btn btn-outline-secondary fw-semibold px-3 py-2.5 rounded-3 shadow-sm d-flex align-items-center gap-2" @click="exportJobData">
          <i class="bi bi-download"></i>
          <span class="d-none d-sm-inline">Export JSON</span>
        </button>
      </div>
    </div>

    <!-- STATS SUMMARY CARDS (Visible when not in form view) -->
    <div v-if="currentView !== 'form'" class="row g-3 mb-4">
      <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100">
          <span class="small fw-bold text-muted text-uppercase">Total Lamaran</span>
          <h3 class="fw-extrabold text-dark mt-1 mb-0">{{ stats.total }}</h3>
          <small class="text-muted">Semua platform</small>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 border-start border-primary border-4">
          <span class="small fw-bold text-primary text-uppercase">Terkirim (Applied)</span>
          <h3 class="fw-extrabold text-primary mt-1 mb-0">{{ stats.applied }}</h3>
          <small class="text-muted">Menunggu respon</small>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 border-start border-info border-4">
          <span class="small fw-bold text-info text-uppercase">Screening / Review</span>
          <h3 class="fw-extrabold text-info mt-1 mb-0">{{ stats.screening }}</h3>
          <small class="text-muted">CV ditinjau HR</small>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 border-start border-warning border-4">
          <span class="small fw-bold text-warning text-uppercase">Tahap Interview</span>
          <h3 class="fw-extrabold text-warning mt-1 mb-0">{{ stats.interview }}</h3>
          <small class="text-muted">User / HR / Teknis</small>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 border-start border-success border-4">
          <span class="small fw-bold text-success text-uppercase">Offering / Diterima</span>
          <h3 class="fw-extrabold text-success mt-1 mb-0">{{ stats.offering }}</h3>
          <small class="text-muted">Tawaran kerja resmi</small>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100">
          <span class="small fw-bold text-muted text-uppercase">Response Rate</span>
          <h3 class="fw-extrabold text-dark mt-1 mb-0">{{ stats.responseRate }}%</h3>
          <small class="text-muted">Dari lamaran aktif</small>
        </div>
      </div>
    </div>

    <!-- ==================================================== -->
    <!-- CLEAN DEDICATED INLINE FORM (NO POPUPS!) -->
    <!-- ==================================================== -->
    <div v-if="currentView === 'form'" class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
      <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
        <div>
          <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-1 rounded-pill mb-1">
            {{ editingId ? 'Edit Data Lamaran' : 'Formulir Simpan Lamaran Baru' }}
          </span>
          <h4 class="fw-extrabold text-dark mb-0">{{ editingId ? 'Perbarui Rincian Lamaran Kerja' : 'Catat Lamaran dari Glints / LinkedIn / Portal Lain' }}</h4>
        </div>
        <button class="btn btn-sm btn-light border rounded-circle p-2" @click="closeForm" title="Tutup Formulir">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Quick URL Paste Assistant -->
      <div class="bg-light p-3 rounded-4 border mb-4">
        <label class="form-label small fw-bold text-dark mb-1 d-flex align-items-center gap-1.5">
          <i class="bi bi-magic text-primary"></i>
          <span>Quick Link Auto-Detect (Opsional)</span>
        </label>
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0"><i class="bi bi-link-45deg text-primary"></i></span>
          <input
            type="url"
            class="form-control border-start-0"
            v-model="quickUrlInput"
            placeholder="Tempel link lowongan Glints / LinkedIn / Jobstreet di sini..."
            @input="handleQuickUrlInput"
          />
        </div>
        <small class="text-muted mt-1 d-block">
          Sistem akan otomatis mendeteksi platform (Glints, LinkedIn, Jobstreet, dll) dan mengisi tautan lowongan secara rapi.
        </small>
      </div>

      <form @submit.prevent="saveJob">
        <div class="row g-3 mb-3">
          <!-- Position Title -->
          <div class="col-md-6">
            <label class="form-label small fw-bold text-dark">Posisi Pekerjaan <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control form-control-lg rounded-3 fs-6"
              v-model="jobForm.position"
              placeholder="Contoh: Senior Frontend Engineer / UI Designer"
              required
            />
          </div>

          <!-- Company Name -->
          <div class="col-md-6">
            <label class="form-label small fw-bold text-dark">Nama Perusahaan / Startup <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control form-control-lg rounded-3 fs-6"
              v-model="jobForm.company"
              placeholder="Contoh: PT Teknologi Bangsa / Startup Inc"
              required
            />
          </div>

          <!-- Platform Source -->
          <div class="col-md-4">
            <label class="form-label small fw-bold text-dark">Sumber Portal Lowongan</label>
            <select class="form-select rounded-3 fw-semibold" v-model="jobForm.platform">
              <option value="LinkedIn">LinkedIn</option>
              <option value="Glints">Glints</option>
              <option value="Jobstreet">Jobstreet</option>
              <option value="Kalibrr">Kalibrr</option>
              <option value="Indeed">Indeed</option>
              <option value="Tech in Asia">Tech in Asia</option>
              <option value="Website Perusahaan">Website Perusahaan (Karir)</option>
              <option value="Referral Tim">Referral / Rekomendasi Teman</option>
              <option value="Other">Lainnya (Other)</option>
            </select>
          </div>

          <!-- Status Pipeline -->
          <div class="col-md-4">
            <label class="form-label small fw-bold text-dark">Status Proses Lamaran</label>
            <select class="form-select rounded-3 fw-semibold" v-model="jobForm.status">
              <option value="wishlist">📝 Tersimpan / Wishlist</option>
              <option value="applied">📨 Terkirim (Applied)</option>
              <option value="screening">🔍 Screening HR / CV Review</option>
              <option value="test">💻 Tes Teknis / Coding Challenge</option>
              <option value="interview">🎙️ Interview User / Lead</option>
              <option value="offering">💼 Tahap Offering Letter</option>
              <option value="accepted">🎉 Diterima (Hired)</option>
              <option value="rejected">❌ Belum Berjodoh (Ditolak)</option>
            </select>
          </div>

          <!-- Work Model -->
          <div class="col-md-4">
            <label class="form-label small fw-bold text-dark">Model Kerja</label>
            <select class="form-select rounded-3 fw-semibold" v-model="jobForm.workModel">
              <option value="Remote">Remote / WFH (Kerja Dari Rumah)</option>
              <option value="Hybrid">Hybrid (Kombinasi Kantor & Rumah)</option>
              <option value="On-site">On-site (WFO di Kantor)</option>
            </select>
          </div>

          <!-- Salary Range -->
          <div class="col-md-4">
            <label class="form-label small fw-bold text-dark">Ekspektasi / Tawaran Gaji</label>
            <input
              type="text"
              class="form-control rounded-3"
              v-model="jobForm.salary"
              placeholder="Misal: Rp 12.000.000 - Rp 16.000.000"
            />
          </div>

          <!-- Location -->
          <div class="col-md-4">
            <label class="form-label small fw-bold text-dark">Lokasi / Kota Kantor</label>
            <input
              type="text"
              class="form-control rounded-3"
              v-model="jobForm.location"
              placeholder="Misal: Jakarta Selatan / Singapore / Remote"
            />
          </div>

          <!-- Job URL -->
          <div class="col-md-4">
            <label class="form-label small fw-bold text-dark">Tautan Lowongan Asli (URL)</label>
            <input
              type="url"
              class="form-control rounded-3"
              v-model="jobForm.url"
              placeholder="https://..."
            />
          </div>

          <!-- Applied Date & Follow Up -->
          <div class="col-md-4">
            <label class="form-label small fw-bold text-dark">Tanggal Melamar</label>
            <input
              type="date"
              class="form-control rounded-3"
              v-model="jobForm.appliedDate"
            />
          </div>

          <div class="col-md-4">
            <label class="form-label small fw-bold text-dark">Rencana Follow-Up</label>
            <input
              type="date"
              class="form-control rounded-3"
              v-model="jobForm.followUpDate"
            />
          </div>

          <!-- CV Version Used -->
          <div class="col-md-4">
            <label class="form-label small fw-bold text-dark">Versi CV yang Dikirim</label>
            <input
              type="text"
              class="form-control rounded-3"
              v-model="jobForm.cvVersion"
              placeholder="Misal: CV ATS Frontend 2026 / CV Kreatif"
            />
          </div>

          <!-- Recruiter / HR Contact -->
          <div class="col-md-6">
            <label class="form-label small fw-bold text-dark">Kontak Recruiter / HR (Opsional)</label>
            <input
              type="text"
              class="form-control rounded-3"
              v-model="jobForm.recruiterContact"
              placeholder="Nama HR, email, atau link profil LinkedIn recruiter"
            />
          </div>

          <!-- Notes -->
          <div class="col-md-6">
            <label class="form-label small fw-bold text-dark">Catatan & Tips Interview</label>
            <input
              type="text"
              class="form-control rounded-3"
              v-model="jobForm.notes"
              placeholder="Poin penting saat wawancara atau deskripsi proyek portfolio yang dibahas"
            />
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 pt-3 border-top">
          <button type="button" class="btn btn-outline-secondary px-4 rounded-3" @click="closeForm">
            Batal
          </button>
          <button type="submit" class="btn btn-primary px-5 rounded-3 fw-bold">
            <i class="bi bi-check2-circle me-1"></i> Simpan Lamaran
          </button>
        </div>
      </form>
    </div>

    <!-- ==================================================== -->
    <!-- MAIN LIST / KANBAN / TABLE VIEW -->
    <!-- ==================================================== -->
    <div v-if="currentView !== 'form'" class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
      <!-- Filter Bar -->
      <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <!-- Search & Platform Filter -->
        <div class="d-flex flex-wrap align-items-center gap-2">
          <div class="input-group input-group-sm w-auto">
            <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-search"></i></span>
            <input
              type="text"
              class="form-control bg-light border-start-0 ps-0"
              placeholder="Cari posisi, perusahaan, atau kota..."
              v-model="searchQuery"
              style="min-width: 240px;"
            />
          </div>

          <!-- Filter Platform -->
          <select class="form-select form-select-sm w-auto rounded-3 fw-semibold text-dark" v-model="selectedPlatform">
            <option value="ALL">Semua Platform ({{ jobs.length }})</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Glints">Glints</option>
            <option value="Jobstreet">Jobstreet</option>
            <option value="Kalibrr">Kalibrr</option>
            <option value="Other">Lainnya</option>
          </select>

          <!-- Filter Status -->
          <select class="form-select form-select-sm w-auto rounded-3 fw-semibold text-dark" v-model="selectedStatus">
            <option value="ALL">Semua Status</option>
            <option value="wishlist">Tersimpan</option>
            <option value="applied">Terkirim</option>
            <option value="screening">Screening</option>
            <option value="interview">Interview</option>
            <option value="offering">Offering</option>
            <option value="accepted">Diterima</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>

        <!-- View Mode Tabs (Cards vs Table) -->
        <div class="d-flex align-items-center gap-1 bg-light p-1 rounded-3 border">
          <button
            class="btn btn-sm px-3 py-1.5 rounded-2 fw-semibold transition-all"
            :class="viewMode === 'grid' ? 'btn-white bg-white shadow-sm text-primary' : 'text-muted border-0'"
            @click="viewMode = 'grid'"
          >
            <i class="bi bi-grid-fill me-1"></i> Kartu
          </button>
          <button
            class="btn btn-sm px-3 py-1.5 rounded-2 fw-semibold transition-all"
            :class="viewMode === 'table' ? 'btn-white bg-white shadow-sm text-primary' : 'text-muted border-0'"
            @click="viewMode = 'table'"
          >
            <i class="bi bi-list-ul me-1"></i> Tabel
          </button>
        </div>
      </div>

      <!-- GRID CARDS VIEW -->
      <div v-if="viewMode === 'grid'" class="row g-3">
        <div v-for="job in filteredJobs" :key="job.id" class="col-md-6 col-xl-4">
          <div class="card border rounded-4 p-3 h-100 bg-white hover-up transition-all shadow-xs d-flex flex-column justify-content-between">
            <div>
              <!-- Platform badge & Status -->
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge px-2.5 py-1 rounded-pill fw-bold" :class="getPlatformBadgeClass(job.platform)">
                  <i class="bi" :class="getPlatformIcon(job.platform)"></i>
                  {{ job.platform }}
                </span>

                <span class="badge px-2.5 py-1 rounded-pill fw-bold" :class="getStatusBadgeClass(job.status)">
                  {{ getStatusLabel(job.status) }}
                </span>
              </div>

              <!-- Job Title & Company -->
              <h5 class="fw-bold text-dark mb-0.5 text-truncate" :title="job.position">{{ job.position }}</h5>
              <div class="fw-semibold text-muted small mb-2 d-flex align-items-center gap-1.5">
                <i class="bi bi-building text-primary"></i>
                <span class="text-truncate">{{ job.company }}</span>
                <span v-if="job.location" class="text-secondary opacity-75">• {{ job.location }}</span>
              </div>

              <!-- Metadata Pills -->
              <div class="d-flex flex-wrap gap-1.5 mb-3">
                <span class="badge bg-light text-dark border px-2 py-1 rounded-pill small">
                  <i class="bi bi-laptop me-1"></i>{{ job.workModel }}
                </span>
                <span v-if="job.salary" class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill small">
                  💰 {{ job.salary }}
                </span>
                <span v-if="job.appliedDate" class="badge bg-light text-muted border px-2 py-1 rounded-pill small">
                  <i class="bi bi-calendar3 me-1"></i>{{ job.appliedDate }}
                </span>
              </div>

              <!-- Notes / Tips Snippet -->
              <p v-if="job.notes" class="small text-muted mb-3 bg-light p-2.5 rounded-3 border-start border-3 border-primary text-truncate-2">
                {{ job.notes }}
              </p>
            </div>

            <!-- Card Bottom Actions -->
            <div class="d-flex justify-content-between align-items-center pt-2 border-top">
              <a
                v-if="job.url"
                :href="job.url"
                target="_blank"
                rel="noopener"
                class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1"
              >
                <span>Buka Lowongan</span>
                <i class="bi bi-box-arrow-up-right"></i>
              </a>
              <span v-else class="text-muted small">Tanpa link</span>

              <div class="d-flex align-items-center gap-1">
                <button class="btn btn-sm btn-light border rounded-circle p-1.5" @click="editJob(job)" title="Edit Lamaran">
                  <i class="bi bi-pencil-fill text-dark small"></i>
                </button>
                <button class="btn btn-sm btn-light border rounded-circle p-1.5" @click="deleteJob(job.id)" title="Hapus">
                  <i class="bi bi-trash-fill text-danger small"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredJobs.length === 0" class="col-12 text-center py-5 text-muted">
          <i class="bi bi-briefcase fs-1 d-block mb-2 text-secondary opacity-50"></i>
          <h5>Belum ada lamaran kerja yang cocok</h5>
          <p class="small text-muted mb-3">Klik tombol <strong>Tambah Lamaran Baru</strong> untuk mencatat lowongan yang sedang Anda tuju.</p>
          <button class="btn btn-primary btn-sm rounded-pill px-4 fw-bold" @click="openAddForm">
            + Tambah Lamaran Sekarang
          </button>
        </div>
      </div>

      <!-- TABLE VIEW -->
      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light small text-uppercase text-muted">
            <tr>
              <th scope="col" style="width: 25%;">Posisi & Perusahaan</th>
              <th scope="col" style="width: 15%;">Platform</th>
              <th scope="col" style="width: 15%;">Model & Gaji</th>
              <th scope="col" style="width: 18%;">Status</th>
              <th scope="col" style="width: 15%;">Tanggal Melamar</th>
              <th scope="col" class="text-end" style="width: 12%;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in filteredJobs" :key="job.id">
              <td>
                <div class="fw-bold text-dark">{{ job.position }}</div>
                <div class="small text-muted">{{ job.company }} <span v-if="job.location">({{ job.location }})</span></div>
              </td>
              <td>
                <span class="badge px-2.5 py-1 rounded-pill fw-bold" :class="getPlatformBadgeClass(job.platform)">
                  {{ job.platform }}
                </span>
              </td>
              <td>
                <div class="small fw-semibold text-dark">{{ job.workModel }}</div>
                <small class="text-muted">{{ job.salary || '-' }}</small>
              </td>
              <td>
                <span class="badge px-2.5 py-1 rounded-pill fw-bold" :class="getStatusBadgeClass(job.status)">
                  {{ getStatusLabel(job.status) }}
                </span>
              </td>
              <td>
                <span class="small font-monospace text-muted">{{ job.appliedDate || '-' }}</span>
              </td>
              <td class="text-end text-nowrap">
                <a v-if="job.url" :href="job.url" target="_blank" rel="noopener" class="btn btn-sm btn-outline-primary rounded-circle p-1.5 me-1" title="Buka URL">
                  <i class="bi bi-box-arrow-up-right"></i>
                </a>
                <button class="btn btn-sm btn-light border rounded-circle p-1.5 me-1" @click="editJob(job)" title="Edit">
                  <i class="bi bi-pencil-fill small"></i>
                </button>
                <button class="btn btn-sm btn-light border rounded-circle p-1.5" @click="deleteJob(job.id)" title="Hapus">
                  <i class="bi bi-trash-fill text-danger small"></i>
                </button>
              </td>
            </tr>

            <tr v-if="filteredJobs.length === 0">
              <td colspan="6" class="text-center py-5 text-muted">
                Tidak ada data lamaran yang ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';

export default {
  name: 'JobTrackerView',
  setup() {
    const jobs = ref([]);
    const currentView = ref('list'); // 'list' | 'form'
    const viewMode = ref('grid'); // 'grid' | 'table'
    const editingId = ref(null);
    const searchQuery = ref('');
    const selectedPlatform = ref('ALL');
    const selectedStatus = ref('ALL');
    const quickUrlInput = ref('');

    const defaultForm = () => ({
      position: '',
      company: '',
      platform: 'LinkedIn',
      status: 'applied',
      workModel: 'Remote',
      salary: '',
      location: '',
      url: '',
      appliedDate: new Date().toISOString().split('T')[0],
      followUpDate: '',
      cvVersion: '',
      recruiterContact: '',
      notes: ''
    });

    const jobForm = ref(defaultForm());

    const loadJobs = () => {
      const saved = localStorage.getItem('rk_job_applications');
      if (saved) {
        try {
          jobs.value = JSON.parse(saved);
        } catch (e) {
          jobs.value = getSampleJobs();
        }
      } else {
        jobs.value = getSampleJobs();
        saveToStorage();
      }
    };

    const saveToStorage = () => {
      localStorage.setItem('rk_job_applications', JSON.stringify(jobs.value));
    };

    const getSampleJobs = () => [
      {
        id: 'job-1',
        position: 'Senior Frontend Engineer',
        company: 'Unicorn Tech Indonesia',
        platform: 'LinkedIn',
        status: 'interview',
        workModel: 'Remote',
        salary: 'Rp 22.000.000 - Rp 28.000.000',
        location: 'Jakarta (Remote)',
        url: 'https://linkedin.com/jobs',
        appliedDate: '2026-09-01',
        followUpDate: '2026-09-08',
        cvVersion: 'CV ATS Tech 2026',
        recruiterContact: 'Sarah HR (sarah.hr@unicorn.tech)',
        notes: 'Sudah lolos screening CV. Jadwal interview teknis Vue.js & System Design hari Kamis.'
      },
      {
        id: 'job-2',
        position: 'Fullstack Developer (Vue + Laravel)',
        company: 'Digital Nusantara Solusindo',
        platform: 'Glints',
        status: 'applied',
        workModel: 'Hybrid',
        salary: 'Rp 14.000.000 - Rp 18.000.000',
        location: 'Bandung',
        url: 'https://glints.com/id/opportunities/jobs',
        appliedDate: '2026-09-04',
        followUpDate: '2026-09-11',
        cvVersion: 'CV Fullstack Versi Glints',
        recruiterContact: 'recruitment@dnsolusindo.co.id',
        notes: 'Melamar lewat Glints Easy Apply.'
      },
      {
        id: 'job-3',
        position: 'UI/UX Designer & Prototyper',
        company: 'Fintech Maju Sejahtera',
        platform: 'Jobstreet',
        status: 'screening',
        workModel: 'Remote',
        salary: 'Rp 12.000.000',
        location: 'Jakarta',
        url: 'https://jobstreet.co.id',
        appliedDate: '2026-09-03',
        followUpDate: '',
        cvVersion: 'CV Portofolio Figma',
        recruiterContact: '',
        notes: 'Menyertakan link portofolio Figma design system.'
      }
    ];

    const stats = computed(() => {
      const total = jobs.value.length;
      const applied = jobs.value.filter(j => j.status === 'applied').length;
      const screening = jobs.value.filter(j => j.status === 'screening').length;
      const interview = jobs.value.filter(j => j.status === 'interview' || j.status === 'test').length;
      const offering = jobs.value.filter(j => j.status === 'offering' || j.status === 'accepted').length;

      const responded = jobs.value.filter(j => ['screening', 'test', 'interview', 'offering', 'accepted', 'rejected'].includes(j.status)).length;
      const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

      return { total, applied, screening, interview, offering, responseRate };
    });

    const filteredJobs = computed(() => {
      return jobs.value.filter(j => {
        const matchesPlatform = selectedPlatform.value === 'ALL' || j.platform === selectedPlatform.value;
        const matchesStatus = selectedStatus.value === 'ALL' || j.status === selectedStatus.value;
        const q = searchQuery.value.trim().toLowerCase();
        const matchesSearch = !q ||
          j.position.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          (j.location && j.location.toLowerCase().includes(q)) ||
          (j.notes && j.notes.toLowerCase().includes(q));

        return matchesPlatform && matchesStatus && matchesSearch;
      });
    });

    const handleQuickUrlInput = () => {
      const url = (quickUrlInput.value || '').trim();
      if (!url) return;
      jobForm.value.url = url;

      if (url.includes('glints.com')) {
        jobForm.value.platform = 'Glints';
      } else if (url.includes('linkedin.com')) {
        jobForm.value.platform = 'LinkedIn';
      } else if (url.includes('jobstreet.co') || url.includes('jobstreet.com')) {
        jobForm.value.platform = 'Jobstreet';
      } else if (url.includes('kalibrr.com')) {
        jobForm.value.platform = 'Kalibrr';
      } else if (url.includes('indeed.com')) {
        jobForm.value.platform = 'Indeed';
      } else if (url.includes('techinasia.com')) {
        jobForm.value.platform = 'Tech in Asia';
      }
    };

    const openAddForm = () => {
      editingId.value = null;
      jobForm.value = defaultForm();
      quickUrlInput.value = '';
      currentView.value = 'form';
    };

    const editJob = (job) => {
      editingId.value = job.id;
      jobForm.value = { ...job };
      quickUrlInput.value = job.url || '';
      currentView.value = 'form';
    };

    const closeForm = () => {
      currentView.value = 'list';
      editingId.value = null;
    };

    const saveJob = () => {
      if (editingId.value) {
        const idx = jobs.value.findIndex(j => j.id === editingId.value);
        if (idx !== -1) {
          jobs.value[idx] = { ...jobForm.value, id: editingId.value };
        }
      } else {
        const newJob = {
          ...jobForm.value,
          id: 'job-' + Date.now()
        };
        jobs.value.unshift(newJob);
      }

      saveToStorage();
      closeForm();

      Swal.fire({
        icon: 'success',
        title: editingId.value ? 'Lamaran Diperbarui!' : 'Lamaran Berhasil Disimpan!',
        timer: 1500,
        showConfirmButton: false
      });
    };

    const deleteJob = async (id) => {
      const confirm = await Swal.fire({
        title: 'Hapus Lamaran Ini?',
        text: 'Data lamaran ini akan dihapus dari riwayat tracker Anda.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
      });

      if (confirm.isConfirmed) {
        jobs.value = jobs.value.filter(j => j.id !== id);
        saveToStorage();
        Swal.fire({
          icon: 'success',
          title: 'Dihapus',
          timer: 1200,
          showConfirmButton: false
        });
      }
    };

    const exportJobData = () => {
      const blob = new Blob([JSON.stringify(jobs.value, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lamaran_kerja_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const getPlatformBadgeClass = (platform) => {
      switch (platform) {
        case 'LinkedIn': return 'bg-primary text-white';
        case 'Glints': return 'bg-danger text-white';
        case 'Jobstreet': return 'bg-info text-white';
        case 'Kalibrr': return 'bg-success text-white';
        case 'Tech in Asia': return 'bg-dark text-white';
        default: return 'bg-secondary text-white';
      }
    };

    const getPlatformIcon = (platform) => {
      switch (platform) {
        case 'LinkedIn': return 'bi-linkedin me-1';
        case 'Glints': return 'bi-stars me-1';
        case 'Jobstreet': return 'bi-briefcase-fill me-1';
        default: return 'bi-globe me-1';
      }
    };

    const getStatusBadgeClass = (status) => {
      switch (status) {
        case 'wishlist': return 'bg-light text-dark border';
        case 'applied': return 'bg-primary-subtle text-primary';
        case 'screening': return 'bg-info-subtle text-info';
        case 'test': return 'bg-warning-subtle text-warning';
        case 'interview': return 'bg-warning text-dark';
        case 'offering': return 'bg-success-subtle text-success';
        case 'accepted': return 'bg-success text-white';
        case 'rejected': return 'bg-danger-subtle text-danger';
        default: return 'bg-light text-dark';
      }
    };

    const getStatusLabel = (status) => {
      switch (status) {
        case 'wishlist': return 'Tersimpan';
        case 'applied': return 'Terkirim';
        case 'screening': return 'Screening CV';
        case 'test': return 'Tes Teknis';
        case 'interview': return 'Interview';
        case 'offering': return 'Offering';
        case 'accepted': return 'Diterima';
        case 'rejected': return 'Ditolak';
        default: return status;
      }
    };

    onMounted(() => {
      loadJobs();
    });

    return {
      jobs,
      currentView,
      viewMode,
      editingId,
      searchQuery,
      selectedPlatform,
      selectedStatus,
      quickUrlInput,
      jobForm,
      stats,
      filteredJobs,
      handleQuickUrlInput,
      openAddForm,
      editJob,
      closeForm,
      saveJob,
      deleteJob,
      exportJobData,
      getPlatformBadgeClass,
      getPlatformIcon,
      getStatusBadgeClass,
      getStatusLabel
    };
  }
};
</script>

<style scoped>
.header-banner {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.hover-up {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-up:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08) !important;
}
</style>
