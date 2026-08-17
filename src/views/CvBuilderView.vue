<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Header Banner (no-print) -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border no-print">
      <div>
        <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
          <span class="badge bg-success text-white fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-shield-check me-1"></i> 100% ATS-Friendly Standard
          </span>
          <span class="badge bg-primary text-white fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-grid-fill me-1"></i> 15 Varian Layout Struktur
          </span>
          <span class="badge bg-info-subtle text-info fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-stars me-1"></i> ATS Score: {{ currentAtsScore.score }}/100 ({{ currentAtsScore.grade }})
          </span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">📄 ATS CV Builder & 15 Layout Resume Generator</h2>
        <p class="text-muted mb-0">Rancang CV standar ATS internasional untuk 1 profil maupun <strong>banyak kandidat sekaligus (Bulk Batch CV)</strong> dengan 15 layout struktur dan ekspor PDF cetak instan.</p>
      </div>

      <div class="d-flex flex-wrap align-items-center gap-2">
        <button class="btn btn-outline-warning text-dark rounded-pill px-3 fw-semibold" @click="exportCvJson" title="Download CV sebagai JSON">
          <i class="bi bi-filetype-json text-warning me-1"></i> Export JSON
        </button>
        <button class="btn btn-outline-info text-dark rounded-pill px-3 fw-semibold" @click="triggerImportCvJson" title="Import data CV dari JSON">
          <i class="bi bi-upload text-info me-1"></i> Import JSON
        </button>
        <input type="file" ref="cvJsonInput" accept=".json" class="d-none" @change="onCvJsonSelected" />
        <button class="btn btn-outline-success rounded-pill px-3 fw-semibold" @click="saveDraft">
          <i class="bi bi-floppy me-1"></i> {{ isSaving ? 'Tersimpan!' : 'Simpan Draft' }}
        </button>
        <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-1.5" :disabled="isPdfLoading" @click="printCurrentMode">
          <span v-if="isPdfLoading" class="spinner-border spinner-border-sm text-white" role="status"></span>
          <i v-else class="bi bi-printer"></i>
          <span>{{ isPdfLoading ? 'Menyiapkan CV...' : (cvMode === 'bulk' ? 'Buka Semua CV di Tab Baru (' + bulkCandidates.length + ' Profil)' : 'Buka / Cetak CV di Tab Baru') }}</span>
        </button>
      </div>
    </div>

    <!-- Mode Selector: Single CV vs Bulk Multi-Candidate (no-print) -->
    <div class="card border-0 shadow-sm rounded-4 bg-white p-2 mb-4 no-print">
      <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 px-2 py-1">
        <div class="btn-group p-1 bg-light rounded-pill border" role="group">
          <button
            type="button"
            class="btn rounded-pill px-4 py-1.5 fw-bold small transition-all"
            :class="cvMode === 'single' ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'"
            @click="cvMode = 'single'"
          >
            <i class="bi bi-person-badge me-1.5"></i> Mode Tunggal (1 Kandidat)
          </button>
          <button
            type="button"
            class="btn rounded-pill px-4 py-1.5 fw-bold small transition-all"
            :class="cvMode === 'bulk' ? 'btn-success text-white shadow-sm' : 'btn-light text-muted'"
            @click="cvMode = 'bulk'"
          >
            <i class="bi bi-people-fill me-1.5"></i> Mode Multi-Kandidat / Bulk CV ({{ bulkCandidates.length }} Orang)
          </button>
        </div>

        <div v-if="cvMode === 'bulk'" class="d-flex align-items-center gap-2">
          <span class="badge bg-success-subtle text-success fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-layers-fill me-1"></i> {{ bulkCandidates.length }} Profil Terdaftar
          </span>
          <button class="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold" @click="applyLayoutToAllCandidates" title="Terapkan Layout dan Warna Kandidat Aktif ke Seluruh Profil">
            <i class="bi bi-palette-fill me-1"></i> Samakan Layout Semua
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- CANDIDATES BAR & MANAGER (Shown only in Bulk Mode)       -->
    <!-- ======================================================== -->
    <div v-if="cvMode === 'bulk'" class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4 no-print border-start border-success border-4">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2 border-bottom pb-3">
        <div>
          <h5 class="fw-bold text-dark mb-0">
            <i class="bi bi-people-fill text-success me-2"></i>Daftar Profil Multi-Kandidat (Batch Generator)
          </h5>
          <small class="text-muted">Kelola beberapa profil CV sekaligus untuk berbagai posisi atau kandidat tim yang berbeda.</small>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-sm btn-outline-primary rounded-pill px-3" @click="showBulkImportModal = true">
            <i class="bi bi-clipboard-plus me-1"></i> Paste Teks Kandidat
          </button>
          <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="duplicateActiveCandidate">
            <i class="bi bi-copy me-1"></i> Duplikat Profil Ini
          </button>
          <button class="btn btn-sm btn-success rounded-pill px-3" @click="addNewCandidate">
            <i class="bi bi-plus-lg me-1"></i> + Tambah Kandidat
          </button>
        </div>
      </div>

      <!-- Candidate Selection Tabs -->
      <div class="d-flex flex-wrap gap-2 align-items-center">
        <div
          v-for="(cand, idx) in bulkCandidates"
          :key="cand.id"
          class="btn-group btn-group-sm rounded-pill border p-1"
          :class="activeCandidateIndex === idx ? 'bg-primary text-white border-primary shadow-sm' : 'bg-light text-dark'"
        >
          <button
            type="button"
            class="btn btn-xs fw-bold px-3 text-truncate"
            :class="activeCandidateIndex === idx ? 'text-white' : 'text-dark'"
            style="max-width: 220px;"
            @click="activeCandidateIndex = idx"
          >
            <i class="bi bi-person me-1"></i> {{ cand.fullName || 'Kandidat ' + (idx + 1) }}
            <small class="fw-normal opacity-75 d-block" style="font-size: 10px;">{{ cand.jobTitle || 'Belum diisi' }}</small>
          </button>
          <button
            type="button"
            class="btn btn-xs px-2"
            :class="activeCandidateIndex === idx ? 'text-white hover-bg-white-20' : 'text-danger'"
            :disabled="bulkCandidates.length <= 1"
            @click="removeCandidate(idx)"
            title="Hapus Profil"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Wizard Navigation Stepper (no-print) -->
    <div class="card border-0 shadow-sm rounded-4 bg-white mb-4 p-3 overflow-x-auto no-print">
      <div class="d-flex justify-content-between align-items-center min-w-600 px-2">
        <button
          v-for="(step, idx) in steps"
          :key="step.id"
          type="button"
          class="btn border-0 d-flex align-items-center gap-2 p-2 rounded-3 text-start transition-all"
          :class="currentStep === idx + 1 ? 'bg-primary text-white fw-bold shadow-sm' : (currentStep > idx + 1 ? 'bg-success-subtle text-success fw-semibold' : 'text-muted')"
          @click="currentStep = idx + 1"
        >
          <span
            class="rounded-circle d-flex align-items-center justify-content-center fw-bold"
            :class="currentStep === idx + 1 ? 'bg-white text-primary' : (currentStep > idx + 1 ? 'bg-success text-white' : 'bg-light text-muted border')"
            style="width: 28px; height: 28px; font-size: 0.85rem;"
          >
            {{ idx + 1 }}
          </span>
          <span class="small">{{ step.name }}</span>
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="row g-4">
      <!-- Left Column: Wizard Form Steps (no-print) -->
      <div class="col-lg-6 no-print" v-if="currentStep <= 5">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h5 class="fw-bold text-dark mb-0">
              <span v-if="cvMode === 'bulk'" class="badge bg-success me-2">Kandidat #{{ activeCandidateIndex + 1 }}</span>
              {{ steps[currentStep - 1].title }}
            </h5>
            <span class="badge bg-light text-dark border small">ATS: {{ currentAtsScore.score }}/100</span>
          </div>

          <!-- Step 1: Informasi Kontak & Profil -->
          <div v-if="currentStep === 1">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Nama Lengkap <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="activeCv.fullName" placeholder="Contoh: Budi Pratama, S.Kom" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Judul Profesi / Position <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="activeCv.jobTitle" placeholder="Contoh: Senior Frontend Developer" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Email <span class="text-danger">*</span></label>
                <input type="email" class="form-control" v-model="activeCv.email" placeholder="budi.pratama@email.com" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Nomor Telepon / WA <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="activeCv.phone" placeholder="081234567890" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Kota / Domisili</label>
                <input type="text" class="form-control" v-model="activeCv.address" placeholder="Jakarta, Indonesia" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">LinkedIn / Portfolio URL</label>
                <input type="text" class="form-control" v-model="activeCv.linkedin" placeholder="linkedin.com/in/budipratama" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">GitHub / Website</label>
                <input type="text" class="form-control" v-model="activeCv.github" placeholder="github.com/budipratama" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Foto Profil / Avatar (Opsional)</label>
                <div class="d-flex align-items-center gap-2">
                  <input type="file" ref="avatarInput" accept="image/*" class="d-none" @change="onAvatarSelected" />
                  <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="$refs.avatarInput.click()">
                    <i class="bi bi-image me-1"></i> Upload Foto
                  </button>
                  <button v-if="activeCv.avatar" type="button" class="btn btn-sm btn-outline-danger rounded-pill px-2" @click="activeCv.avatar = ''" title="Hapus foto">
                    <i class="bi bi-trash"></i>
                  </button>
                  <span v-if="activeCv.avatar" class="badge bg-success-subtle text-success small">Foto Terpasang</span>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label fw-bold text-dark small">Ringkasan Profil / Summary ATS (3-4 Kalimat)</label>
                <textarea class="form-control" rows="4" v-model="activeCv.summary" placeholder="Rangkuman profesional mengenai pengalaman, pencapaian kunci, dan keahlian utama Anda..."></textarea>
                <div class="form-text small text-muted">Gunakan kata kunci industri untuk memaksimalkan skor pembacaan software ATS.</div>
              </div>
            </div>
          </div>

          <!-- Step 2: Pengalaman Kerja -->
          <div v-else-if="currentStep === 2">
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h6 class="fw-bold text-dark mb-0">Daftar Pengalaman Kerja</h6>
              <button class="btn btn-sm btn-primary rounded-pill px-3" @click="addExperience">
                <i class="bi bi-plus-lg me-1"></i> Tambah Posisi
              </button>
            </div>

            <div v-if="!activeCv.experience || activeCv.experience.length === 0" class="text-center py-4 text-muted bg-light rounded-3">
              <i class="bi bi-briefcase fs-3 d-block mb-1"></i>
              Belum ada riwayat kerja. Klik "Tambah Posisi" di atas.
            </div>

            <div v-for="(exp, idx) in activeCv.experience" :key="idx" class="p-3 mb-3 border rounded-3 bg-light position-relative">
              <button class="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2 rounded-circle p-1" @click="removeExperience(idx)" title="Hapus">
                <i class="bi bi-x-lg"></i>
              </button>
              <div class="row g-2">
                <div class="col-md-6">
                  <label class="form-label fw-bold text-dark small">Nama Perusahaan</label>
                  <input type="text" class="form-control form-control-sm" v-model="exp.company" placeholder="PT Teknologi Inovasi" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold text-dark small">Jabatan / Posisi</label>
                  <input type="text" class="form-control form-control-sm" v-model="exp.position" placeholder="Senior Frontend Engineer" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold text-dark small">Periode (Bulan/Tahun)</label>
                  <input type="text" class="form-control form-control-sm" v-model="exp.period" placeholder="Jan 2022 - Sekarang" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold text-dark small">Lokasi</label>
                  <input type="text" class="form-control form-control-sm" v-model="exp.location" placeholder="Jakarta (Hybrid)" />
                </div>
                <div class="col-12">
                  <label class="form-label fw-bold text-dark small">Deskripsi Tugas & Achievement (Gunakan Action Verbs & Metrik)</label>
                  <textarea class="form-control form-control-sm" rows="3" v-model="exp.description" placeholder="• Memimpin pengembangan 10+ modul aplikasi web Vue 3...&#10;• Meningkatkan kecepatan muat halaman sebesar 40% dan user retention 25%..."></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Pendidikan -->
          <div v-else-if="currentStep === 3">
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h6 class="fw-bold text-dark mb-0">Daftar Riwayat Pendidikan</h6>
              <button class="btn btn-sm btn-primary rounded-pill px-3" @click="addEducation">
                <i class="bi bi-plus-lg me-1"></i> Tambah Pendidikan
              </button>
            </div>

            <div v-if="!activeCv.education || activeCv.education.length === 0" class="text-center py-4 text-muted bg-light rounded-3">
              <i class="bi bi-mortarboard fs-3 d-block mb-1"></i>
              Belum ada riwayat pendidikan. Klik "Tambah Pendidikan" di atas.
            </div>

            <div v-for="(edu, idx) in activeCv.education" :key="idx" class="p-3 mb-3 border rounded-3 bg-light position-relative">
              <button class="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2 rounded-circle p-1" @click="removeEducation(idx)" title="Hapus">
                <i class="bi bi-x-lg"></i>
              </button>
              <div class="row g-2">
                <div class="col-md-6">
                  <label class="form-label fw-bold text-dark small">Institusi / Universitas</label>
                  <input type="text" class="form-control form-control-sm" v-model="edu.institution" placeholder="Universitas Indonesia" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold text-dark small">Gelar & Jurusan</label>
                  <input type="text" class="form-control form-control-sm" v-model="edu.degree" placeholder="S1 Teknik Informatika" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold text-dark small">Tahun / Periode</label>
                  <input type="text" class="form-control form-control-sm" v-model="edu.period" placeholder="2017 - 2021" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold text-dark small">IPK / GPA (Opsional)</label>
                  <input type="text" class="form-control form-control-sm" v-model="edu.gpa" placeholder="3.82 / 4.00" />
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Skills, Bahasa & Sertifikasi -->
          <div v-else-if="currentStep === 4">
            <div class="mb-3">
              <label class="form-label fw-bold text-dark small">Technical Skills & Keahlian Utama (Pisahkan dengan Koma)</label>
              <input type="text" class="form-control" :value="currentSkillsString" @input="updateActiveSkills" placeholder="Vue.js 3, TypeScript, Tailwind CSS, Node.js, REST API, Git, Docker" />
              <div class="form-text">Tips: Cantumkan 6-12 kata kunci relevan dengan lowongan yang dituju.</div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold text-dark small">Kemampuan Bahasa (Pisahkan dengan Koma)</label>
              <input type="text" class="form-control" :value="currentLanguagesString" @input="updateActiveLanguages" placeholder="Bahasa Indonesia (Native), English (Professional Working)" />
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold text-dark small">Sertifikasi, Lisensi & Penghargaan</label>
              <textarea class="form-control" rows="3" :value="currentCertificationsString" @input="updateActiveCertifications" placeholder="• Google Certified Associate Cloud Engineer&#10;• Meta Front-End Developer Specialization&#10;• AWS Certified Solutions Architect"></textarea>
            </div>
          </div>

          <!-- Step 5: 15 Jenis Layout CV & Pengaturan Desain -->
          <div v-else-if="currentStep === 5">
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <div>
                <h6 class="fw-bold text-dark mb-0">Pilih 15 Jenis Layout Struktur CV</h6>
                <small class="text-muted">Layout aktif: <strong>{{ activeTemplateInfo.name }}</strong></small>
              </div>
            </div>

            <!-- Filter Kategori Layout -->
            <div class="d-flex flex-wrap gap-1 mb-3">
              <button
                v-for="cat in layoutCategories"
                :key="cat.id"
                class="btn btn-xs rounded-pill px-2.5 py-1"
                :class="selectedCategory === cat.id ? 'btn-primary fw-bold' : 'btn-light border text-muted'"
                @click="selectedCategory = cat.id"
              >
                {{ cat.name }}
              </button>
            </div>

            <!-- Grid 15 Layout Options -->
            <div class="row g-2.5 mb-4" style="max-height: 360px; overflow-y: auto;">
              <div v-for="tmpl in filteredLayouts" :key="tmpl.id" class="col-6 col-md-4">
                <div
                  class="card h-100 border-2 rounded-3 text-center p-2.5 cursor-pointer transition-all hover-shadow"
                  :class="activeCv.selectedTemplate === tmpl.id ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'border-light-subtle bg-light'"
                  @click="selectLayoutForActiveCv(tmpl)"
                >
                  <div class="p-2 rounded mb-2 border bg-white position-relative" :style="{ borderColor: tmpl.color }">
                    <span class="badge rounded-pill position-absolute top-0 end-0 m-1" :style="{ backgroundColor: tmpl.color, color: '#fff', fontSize: '9px' }">
                      {{ tmpl.type }}
                    </span>
                    <i :class="tmpl.icon" class="fs-4 d-block mb-1" :style="{ color: tmpl.color }"></i>
                    <div class="fw-bold text-truncate small" :style="{ color: tmpl.color }">{{ tmpl.name }}</div>
                  </div>
                  <small class="text-muted d-block lh-sm mb-1" style="font-size: 0.72rem;">{{ tmpl.description }}</small>
                  <span class="badge bg-dark rounded-pill small mt-auto" v-if="activeCv.selectedTemplate === tmpl.id">
                    <i class="bi bi-check2 me-0.5"></i> Aktif
                  </span>
                  <span class="badge bg-secondary-subtle text-secondary rounded-pill small mt-auto" v-else>Pilih</span>
                </div>
              </div>
            </div>

            <!-- Custom Accent Color & Styling Controls -->
            <div class="p-3 bg-light rounded-3 border">
              <h6 class="fw-bold text-dark small mb-2"><i class="bi bi-sliders me-1 text-primary"></i>Kustomisasi Warna Aksen & Tipografi</h6>
              <div class="row g-2 align-items-center">
                <div class="col-md-6">
                  <label class="form-label text-muted small mb-1">Palet Warna Utama:</label>
                  <div class="d-flex flex-wrap gap-1.5 align-items-center">
                    <button
                      v-for="color in presetColors"
                      :key="color"
                      type="button"
                      class="rounded-circle border-0 p-0"
                      :style="{ width: '22px', height: '22px', backgroundColor: color, outline: activeCvColor === color ? '2px solid #000' : 'none' }"
                      @click="setActiveCvColor(color)"
                    ></button>
                    <input type="color" :value="activeCvColor" @input="e => setActiveCvColor(e.target.value)" class="form-control form-control-color form-control-sm p-0 border-0" style="width: 24px; height: 24px;" title="Pilih custom HEX" />
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label text-muted small mb-1">Pilihan Tipografi Font:</label>
                  <select class="form-select form-select-sm" :value="activeCvFont" @change="e => setActiveCvFont(e.target.value)">
                    <option value="font-sans">Modern Sans (Inter / Segoe UI)</option>
                    <option value="font-serif">Classic Serif (Georgia / Times)</option>
                    <option value="font-mono">Technical (Roboto Mono / Consolas)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Wizard Controls Footer -->
          <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-4">
            <button class="btn btn-outline-secondary rounded-pill px-4" :disabled="currentStep === 1" @click="currentStep--">
              <i class="bi bi-chevron-left me-1"></i> Sebelumnya
            </button>
            <button class="btn btn-primary rounded-pill px-4 fw-bold" v-if="currentStep < 5" @click="currentStep++">
              Lanjut <i class="bi bi-chevron-right ms-1"></i>
            </button>
            <button class="btn btn-success rounded-pill px-4 fw-bold" v-else @click="saveDraft">
              <i class="bi bi-check-circle me-1"></i> Selesai & Simpan
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: Live ATS CV Preview -->
      <div :class="currentStep > 5 ? 'col-12' : 'col-lg-6'">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 p-md-4 overflow-hidden">
          <!-- Live Preview Header Controls (no-print) -->
          <div class="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-2 mb-3 no-print gap-2">
            <div class="d-flex align-items-center gap-2">
              <span class="fw-bold text-dark"><i class="bi bi-eye me-1 text-primary"></i> Live ATS CV Preview</span>
              <span class="badge bg-light text-dark border small fw-normal">{{ activeTemplateInfo.name }}</span>
              <span v-if="cvMode === 'bulk'" class="badge bg-success text-white small">
                Kandidat #{{ activeCandidateIndex + 1 }} dari {{ bulkCandidates.length }}
              </span>
            </div>

            <div class="d-flex flex-wrap align-items-center gap-2">
              <!-- Candidate Quick Switcher in Bulk Mode -->
              <div v-if="cvMode === 'bulk' && bulkCandidates.length > 1" class="btn-group btn-group-sm me-1">
                <button class="btn btn-outline-secondary" :disabled="activeCandidateIndex <= 0" @click="activeCandidateIndex--">
                  <i class="bi bi-chevron-left"></i>
                </button>
                <button class="btn btn-light border px-2 fw-semibold" style="font-size: 12px;">
                  {{ activeCv.fullName || 'Kandidat ' + (activeCandidateIndex + 1) }}
                </button>
                <button class="btn btn-outline-secondary" :disabled="activeCandidateIndex >= bulkCandidates.length - 1" @click="activeCandidateIndex++">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </div>

              <button v-if="currentStep > 5" class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="currentStep = 1">
                <i class="bi bi-pencil me-1"></i> Edit Form
              </button>
              <button class="btn btn-sm btn-primary rounded-pill px-3.5 fw-bold shadow-sm d-flex align-items-center gap-1.5" :disabled="isPdfLoading" @click="printCurrentMode">
                <span v-if="isPdfLoading" class="spinner-border spinner-border-sm text-white" role="status"></span>
                <i v-else class="bi bi-printer"></i>
                <span>{{ isPdfLoading ? 'Menyiapkan...' : (cvMode === 'bulk' ? 'Buka Semua (' + bulkCandidates.length + ' CV)' : 'Buka / Cetak CV') }}</span>
              </button>
            </div>
          </div>

          <!-- ======================================================== -->
          <!-- 1. SINGLE MODE PRINTABLE AREA                            -->
          <!-- ======================================================== -->
          <div v-if="cvMode === 'single'" id="cvPrintArea">
            <CvLayoutRenderer
              :cv="cv"
              :layout-type="cv.selectedTemplate || 'single_column'"
              :active-color="activeCvColor"
              :cv-font="activeCvFont"
            />
          </div>

          <!-- ======================================================== -->
          <!-- 2. BULK MULTI-CANDIDATE PRINTABLE AREA                   -->
          <!-- ======================================================== -->
          <div v-else id="cvBulkPrintArea" class="bulk-cv-container">
            <div
              v-for="(cand, cIdx) in (isPrintingAll ? bulkCandidates : [activeCv])"
              :key="cand.id || cIdx"
              class="print-page-break mb-4"
            >
              <CvLayoutRenderer
                :cv="cand"
                :layout-type="cand.selectedTemplate || 'single_column'"
                :active-color="cand.customColor || '#1e293b'"
                :cv-font="cand.cvFont || 'font-sans'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL: BULK CANDIDATES TEXT IMPORTER (no-print)          -->
    <!-- ======================================================== -->
    <div v-if="showBulkImportModal" class="card border-0 shadow-lg rounded-4 p-4 my-4 bg-white border-top border-primary border-4 no-print">
      <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
        <h5 class="fw-bold mb-0 text-dark">
          <i class="bi bi-clipboard-plus text-primary me-2"></i> Paste Banyak Profil Kandidat (Bulk Importer)
        </h5>
        <button type="button" class="btn-close" @click="showBulkImportModal = false"></button>
      </div>

      <div class="alert alert-info py-2 px-3 small mb-3">
        <div class="fw-bold mb-1"><i class="bi bi-info-circle-fill me-1"></i> Format Baris (Pisahkan dengan tanda pipa <code>|</code> atau koma):</div>
        <code>Nama Lengkap | Posisi / Jabatan | Email | Nomor HP | Kota Domisili | Keahlian Utama (pisahkan koma)</code>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold text-dark small">Tempel Data Teks Kandidat di Bawah:</label>
        <textarea
          class="form-control font-monospace border-2 rounded-3 small"
          rows="6"
          v-model="bulkImportRawText"
          placeholder="Budi Santoso, S.Kom | Senior Frontend Dev | budi@email.com | 081234567890 | Jakarta | Vue 3, TypeScript, Tailwind CSS&#10;Siti Rahmadani, S.Ds | Lead UI/UX Designer | siti@design.io | 081398765432 | Bandung | Figma, UI/UX, Design System&#10;Ahmad Fauzi, M.Kom | Backend Cloud Architect | ahmad@cloud.dev | 085712345678 | Surabaya | Golang, PostgreSQL, Docker"
        ></textarea>
      </div>

      <div class="d-flex justify-content-between align-items-center border-top pt-3">
        <button type="button" class="btn btn-outline-secondary rounded-pill px-3" @click="showBulkImportModal = false">Batal</button>
        <button type="button" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" @click="processBulkImport">
          <i class="bi bi-check2-circle me-1"></i> Tambahkan Profil ke Batch
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue';
import Swal from 'sweetalert2';
import { useStore } from 'vuex';
import { sendOnDeviceNotification } from '../utils/notification';
import { openPrintableDocumentInNewTab } from '../utils/pdfTabOpener';
import CvLayoutRenderer from '../components/CvLayoutRenderer.vue';

export default {
  name: 'CvBuilderView',
  components: {
    CvLayoutRenderer
  },
  setup() {
    const store = useStore();

    const cvMode = ref('single'); // 'single' | 'bulk'
    const isPrintingAll = ref(false);
    const currentStep = ref(1);
    const isSaving = ref(false);
    const selectedCategory = ref('all');
    const customColor = ref('#1e293b');
    const cvFont = ref('font-sans');

    // Bulk Mode State
    const activeCandidateIndex = ref(0);
    const showBulkImportModal = ref(false);
    const bulkImportRawText = ref('');

    const bulkCandidates = ref([
      {
        id: 'cv_cand_1',
        fullName: 'Budi Pratama, S.Kom',
        jobTitle: 'Senior Frontend Engineer',
        email: 'budi.pratama@email.com',
        phone: '081234567890',
        address: 'Jakarta, Indonesia',
        linkedin: 'linkedin.com/in/budipratama',
        github: 'github.com/budipratama',
        summary: 'Software Engineer berpengalaman 4+ tahun dalam pengembangan arsitektur Single Page Application (SPA) dan Progressive Web Apps (PWA) berbasis Vue 3 dan TypeScript.',
        experience: [
          {
            company: 'PT Solusi Teknologi Nusantara',
            position: 'Lead Frontend Developer',
            period: '2022 - Sekarang',
            location: 'Jakarta Selatan',
            description: '• Memimpin pengembangan 8+ modul web enterprise berbasis Vue 3, Pinia, dan Tailwind CSS.\n• Mengoptimalkan performa loading aplikasi hingga 45% dan meningkatkan retensi pengguna.'
          }
        ],
        education: [
          {
            institution: 'Universitas Indonesia',
            degree: 'S1 Ilmu Komputer / Teknik Informatika',
            period: '2017 - 2021',
            gpa: '3.82 / 4.00'
          }
        ],
        skills: ['Vue.js 3', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js', 'REST API', 'Git', 'Docker'],
        languages: ['Bahasa Indonesia (Native)', 'English (Professional Working)'],
        certifications: ['Google Cloud Certified Associate Cloud Engineer', 'Meta Front-End Developer Certificate'],
        selectedTemplate: 'single_column',
        customColor: '#0d6efd',
        cvFont: 'font-sans'
      },
      {
        id: 'cv_cand_2',
        fullName: 'Siti Rahmadani, S.Ds',
        jobTitle: 'Lead UI/UX & Product Designer',
        email: 'siti.rahmadani@design.io',
        phone: '081398765432',
        address: 'Bandung, Jawa Barat',
        linkedin: 'linkedin.com/in/sitirahma',
        github: 'dribbble.com/sitirahma',
        summary: 'Product Designer dengan pengalaman 5+ tahun merancang design system enterprise, user research, wireframing, dan interactive prototyping high-fidelity di Figma.',
        experience: [
          {
            company: 'PT Kreatif Visual Studio',
            position: 'Lead UI/UX Designer',
            period: '2021 - Sekarang',
            location: 'Bandung',
            description: '• Merancang comprehensive Design System terstandarisasi dengan 200+ komponen reusable di Figma.\n• Melakukan usability testing berkala yang meningkatkan task success rate hingga 32%.'
          }
        ],
        education: [
          {
            institution: 'Institut Teknologi Bandung',
            degree: 'S1 Desain Komunikasi Visual',
            period: '2016 - 2020',
            gpa: '3.78 / 4.00'
          }
        ],
        skills: ['Figma Master', 'Design System', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'HTML/CSS Basics'],
        languages: ['Bahasa Indonesia (Native)', 'English (Fluent)'],
        certifications: ['Google UX Design Professional Certificate', 'Nielsen Norman Group UX Master'],
        selectedTemplate: 'sidebar_left',
        customColor: '#10b981',
        cvFont: 'font-sans'
      },
      {
        id: 'cv_cand_3',
        fullName: 'Ahmad Fauzi, M.Kom',
        jobTitle: 'Senior Backend & Cloud Architect',
        email: 'ahmad.fauzi@backend.dev',
        phone: '085712345678',
        address: 'Surabaya, Jawa Timur',
        linkedin: 'linkedin.com/in/ahmadfauzi',
        github: 'github.com/ahmadfauzi',
        summary: 'Backend Engineer spesialis arsitektur Microservices, REST & GraphQL API, PostgreSQL, Redis, dan Containerization (Docker/Kubernetes) dengan throughput tinggi.',
        experience: [
          {
            company: 'PT Cloud Nusantara Solusindo',
            position: 'Senior Backend Engineer',
            period: '2020 - Sekarang',
            location: 'Surabaya',
            description: '• Mengembangkan microservices Go & Node.js yang menangani 2+ juta request per hari dengan latency < 80ms.\n• Mengelola database PostgreSQL berukuran TB dengan partitioning dan query indexing optimal.'
          }
        ],
        education: [
          {
            institution: 'Institut Teknologi Sepuluh Nopember',
            degree: 'S2 Teknik Informatika',
            period: '2019 - 2021',
            gpa: '3.90 / 4.00'
          }
        ],
        skills: ['Golang', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'CI/CD Pipeline', 'Microservices'],
        languages: ['Bahasa Indonesia (Native)', 'English (Professional)'],
        certifications: ['AWS Certified Solutions Architect Associate', 'CKA Certified Kubernetes Administrator'],
        selectedTemplate: 'timeline_flow',
        customColor: '#6366f1',
        cvFont: 'font-mono'
      }
    ]);

    // Single mode primary CV
    const singleCv = ref({
      fullName: 'Budi Pratama, S.Kom',
      jobTitle: 'Senior Frontend Developer',
      email: 'budi.pratama@email.com',
      phone: '081234567890',
      address: 'Jakarta, Indonesia',
      linkedin: 'linkedin.com/in/budipratama',
      github: 'github.com/budipratama',
      website: 'budipratama.dev',
      avatar: '',
      summary: 'Experienced Senior Frontend Engineer with 5+ years of building scalable web applications using Vue 3, TypeScript, and modern web standards. Proven track record of boosting app load performance by 40%.',
      experience: [
        {
          company: 'PT Teknologi Inovasi',
          position: 'Senior Frontend Developer',
          period: 'Jan 2022 - Sekarang',
          location: 'Jakarta (Hybrid)',
          description: '• Memimpin pengembangan 10+ modul aplikasi web Vue 3 enterprise.\n• Mengoptimalkan performa web hingga 40% dan user retention 25%.'
        }
      ],
      education: [
        {
          institution: 'Universitas Indonesia',
          degree: 'S1 Teknik Informatika',
          period: '2017 - 2021',
          gpa: '3.82 / 4.00'
        }
      ],
      skills: ['Vue.js 3', 'TypeScript', 'Tailwind CSS', 'Node.js', 'REST API', 'Git', 'Docker'],
      languages: ['Bahasa Indonesia (Native)', 'English (Professional Working)'],
      certifications: ['Google Certified Associate Cloud Engineer', 'Meta Front-End Developer Specialization'],
      selectedTemplate: 'single_column'
    });

    const activeCv = computed(() => {
      if (cvMode.value === 'single') {
        return singleCv.value;
      }
      if (!bulkCandidates.value.length) return singleCv.value;
      if (activeCandidateIndex.value >= bulkCandidates.value.length) {
        return bulkCandidates.value[0];
      }
      return bulkCandidates.value[activeCandidateIndex.value];
    });

    const activeCvColor = computed(() => {
      if (cvMode.value === 'single') return customColor.value;
      return activeCv.value.customColor || customColor.value;
    });

    const activeCvFont = computed(() => {
      if (cvMode.value === 'single') return cvFont.value;
      return activeCv.value.cvFont || cvFont.value;
    });

    const setActiveCvColor = (color) => {
      if (cvMode.value === 'single') {
        customColor.value = color;
      } else {
        activeCv.value.customColor = color;
      }
    };

    const setActiveCvFont = (font) => {
      if (cvMode.value === 'single') {
        cvFont.value = font;
      } else {
        activeCv.value.cvFont = font;
      }
    };

    const selectLayoutForActiveCv = (tmpl) => {
      activeCv.value.selectedTemplate = tmpl.layout || tmpl.id;
      if (tmpl.color) {
        setActiveCvColor(tmpl.color);
      }
    };

    const applyLayoutToAllCandidates = () => {
      const activeTmpl = activeCv.value.selectedTemplate || 'single_column';
      const activeCol = activeCvColor.value;
      const activeFnt = activeCvFont.value;

      bulkCandidates.value.forEach(c => {
        c.selectedTemplate = activeTmpl;
        c.customColor = activeCol;
        c.cvFont = activeFnt;
      });

      Swal.fire({
        icon: 'success',
        title: 'Layout Disinkronkan!',
        text: `Semua ${bulkCandidates.value.length} profil kandidat kini menggunakan layout dan warna yang seragam.`,
        timer: 1800,
        showConfirmButton: false
      });
    };

    const steps = [
      { id: 1, name: 'Kontak', title: '1. Informasi Kontak & Profil' },
      { id: 2, name: 'Pengalaman', title: '2. Pengalaman Kerja' },
      { id: 3, name: 'Pendidikan', title: '3. Riwayat Pendidikan' },
      { id: 4, name: 'Skills & Sertif', title: '4. Keahlian, Bahasa & Sertifikasi' },
      { id: 5, name: '15 Layout Desain', title: '5. Pilih 15 Jenis Layout Struktur CV' }
    ];

    const layoutCategories = [
      { id: 'all', name: 'Semua (15)' },
      { id: 'single', name: 'Single Column' },
      { id: 'sidebar', name: 'Sidebar Grid' },
      { id: 'executive', name: 'Executive & Creative' },
      { id: 'minimalist', name: 'Minimalist & Academic' }
    ];

    const presetColors = [
      '#1e293b', // Slate Dark
      '#1e3a8a', // Royal Navy
      '#0f766e', // Teal Emerald
      '#7c3aed', // Purple Violet
      '#b91c1c', // Crimson Red
      '#431407', // Warm Walnut
      '#0369a1', // Sky Corporate
      '#374151'  // Charcoal
    ];

    // 15 Distinct Layout Variations
    const templates = [
      {
        id: 'ats_clean_1',
        name: '1. Modern ATS Classic',
        category: 'single',
        type: 'Single Col',
        layout: 'single_column',
        icon: 'bi-file-earmark-text',
        color: '#1e293b',
        description: 'Single column standar ATS global. Sangat mudah dibaca parser recruitment.'
      },
      {
        id: 'ats_executive_2',
        name: '2. Executive Navy Horizon',
        category: 'executive',
        type: 'Executive',
        layout: 'single_column',
        icon: 'bi-award',
        color: '#1e3a8a',
        description: 'Header navy mewah dengan border tebal formal untuk posisi manajerial.'
      },
      {
        id: 'ats_sidebar_left_3',
        name: '3. Split Sidebar Left',
        category: 'sidebar',
        type: 'Sidebar 32:68',
        layout: 'sidebar_left',
        icon: 'bi-layout-sidebar-inset',
        color: '#0f766e',
        description: 'Kolom kiri khusus kontak, foto & skills; kolom kanan kronologi karir.'
      },
      {
        id: 'ats_sidebar_right_4',
        name: '4. Split Sidebar Right',
        category: 'sidebar',
        type: 'Sidebar 68:32',
        layout: 'sidebar_right',
        icon: 'bi-layout-sidebar-inset-reverse',
        color: '#0369a1',
        description: 'Pengalaman kerja di sisi kiri utama, ringkasan skill di sidebar kanan.'
      },
      {
        id: 'ats_slate_5',
        name: '5. Nordic Minimalist Slate',
        category: 'minimalist',
        type: 'Minimalist',
        layout: 'single_column',
        icon: 'bi-distribute-vertical',
        color: '#334155',
        description: 'Desain skandinavia bersih dengan pembatas garis halus & spacing rapi.'
      },
      {
        id: 'ats_tech_6',
        name: '6. Tech Developer Emerald',
        category: 'single',
        type: 'Tech Pro',
        layout: 'single_column',
        icon: 'bi-terminal',
        color: '#059669',
        description: 'Gaya emerald dengan badge keahlian coding & highlight kontribusi proyek.'
      },
      {
        id: 'ats_compact_7',
        name: '7. Compact One-Page Fit',
        category: 'minimalist',
        type: 'Compact',
        layout: 'single_column',
        icon: 'bi-arrows-angle-contract',
        color: '#0f172a',
        description: 'Jarak padat teroptimasi khusus CV ringkas 1 lembar tanpa terpotong.'
      },
      {
        id: 'ats_serif_8',
        name: '8. Academic Harvard Serif',
        category: 'minimalist',
        type: 'Academic',
        layout: 'single_column',
        icon: 'bi-mortarboard',
        color: '#431407',
        description: 'Tipografi Serif formal tradisional ala universitas ternama & riset.'
      },
      {
        id: 'ats_creative_banner_9',
        name: '9. Creative Accent Banner',
        category: 'executive',
        type: 'Creative',
        layout: 'creative_banner',
        icon: 'bi-palette',
        color: '#7c3aed',
        description: 'Header blok warna modern berlatar kontras dengan isi kartu rapi.'
      },
      {
        id: 'ats_swiss_10',
        name: '10. Swiss High-Contrast',
        category: 'minimalist',
        type: 'Swiss Grid',
        layout: 'single_column',
        icon: 'bi-grid-1x2',
        color: '#000000',
        description: 'Arsitektur tipografi Swiss dengan kontras kuat dan keterbacaan tinggi.'
      },
      {
        id: 'ats_timeline_11',
        name: '11. Chronological Timeline Flow',
        category: 'single',
        type: 'Timeline',
        layout: 'timeline_flow',
        icon: 'bi-clock-history',
        color: '#2563eb',
        description: 'Alur kronologis vertikal dengan bullet titik sambung pada pengalaman kerja.'
      },
      {
        id: 'ats_dual_balanced_12',
        name: '12. Balanced 50/50 Dual Column',
        category: 'sidebar',
        type: 'Dual 50:50',
        layout: 'dual_balanced',
        icon: 'bi-layout-split',
        color: '#0d9488',
        description: 'Keseimbangan simetris dua kolom untuk riwayat kerja dan keahlian seimbang.'
      },
      {
        id: 'ats_skills_first_13',
        name: '13. Functional / Skills-First',
        category: 'single',
        type: 'Functional',
        layout: 'single_column',
        icon: 'bi-stars',
        color: '#d97706',
        description: 'Menampilkan kompetensi utama dan keahlian di bagian atas sebelum riwayat karir.'
      },
      {
        id: 'ats_boxed_executive_14',
        name: '14. Boxed Framed Executive',
        category: 'executive',
        type: 'Framed',
        layout: 'single_column',
        icon: 'bi-bounding-box-circles',
        color: '#475569',
        description: 'Border halus membingkai setiap sub-bagian CV secara terstruktur dan formal.'
      },
      {
        id: 'ats_startup_sleek_15',
        name: '15. Modern Startup Sleek',
        category: 'executive',
        type: 'Startup',
        layout: 'sidebar_left',
        icon: 'bi-rocket-takeoff',
        color: '#4f46e5',
        description: 'Desain dinamis ala talenta tech startup dengan badge skill mencolok.'
      }
    ];

    const filteredLayouts = computed(() => {
      if (selectedCategory.value === 'all') return templates;
      return templates.filter(t => t.category === selectedCategory.value);
    });

    const activeTemplateInfo = computed(() => {
      const tmplId = activeCv.value.selectedTemplate || 'single_column';
      const found = templates.find(t => t.id === tmplId || t.layout === tmplId);
      return found || templates[0];
    });

    // Real-Time ATS Score Calculator
    const currentAtsScore = computed(() => {
      const data = activeCv.value;
      let score = 0;
      if (data.fullName && data.fullName.length > 3) score += 10;
      if (data.jobTitle) score += 10;
      if (data.email && data.phone) score += 10;
      if (data.summary && data.summary.length > 40) score += 15;
      if (data.experience && data.experience.length >= 1) score += 20;
      if (data.experience && data.experience.length >= 2) score += 5;
      if (data.education && data.education.length >= 1) score += 15;
      if (data.skills && data.skills.length >= 4) score += 15;

      let grade = 'Pemula';
      if (score >= 85) grade = 'Sangat Tinggi (ATS Grade A)';
      else if (score >= 70) grade = 'Baik (ATS Grade B)';
      else if (score >= 50) grade = 'Cukup (ATS Grade C)';

      return { score, grade };
    });

    // String Getters & Mutators for Active CV
    const currentSkillsString = computed(() => (activeCv.value.skills || []).join(', '));
    const currentLanguagesString = computed(() => (activeCv.value.languages || []).join(', '));
    const currentCertificationsString = computed(() => (activeCv.value.certifications || []).join('\n'));

    const updateActiveSkills = (e) => {
      activeCv.value.skills = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    };

    const updateActiveLanguages = (e) => {
      activeCv.value.languages = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    };

    const updateActiveCertifications = (e) => {
      activeCv.value.certifications = e.target.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    };

    const addExperience = () => {
      if (!activeCv.value.experience) activeCv.value.experience = [];
      activeCv.value.experience.push({
        company: '',
        position: '',
        period: '',
        location: '',
        description: ''
      });
    };

    const removeExperience = (idx) => {
      activeCv.value.experience.splice(idx, 1);
    };

    const addEducation = () => {
      if (!activeCv.value.education) activeCv.value.education = [];
      activeCv.value.education.push({
        institution: '',
        degree: '',
        period: '',
        gpa: ''
      });
    };

    const removeEducation = (idx) => {
      activeCv.value.education.splice(idx, 1);
    };

    const onAvatarSelected = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        activeCv.value.avatar = evt.target.result;
        sendOnDeviceNotification('📸 Foto Profil Terpasang', {
          body: 'Foto berhasil diunggah ke formulir CV Anda.',
          type: 'success'
        });
      };
      reader.readAsDataURL(file);
    };

    // Bulk Management Functions
    const addNewCandidate = () => {
      const nextNum = bulkCandidates.value.length + 1;
      bulkCandidates.value.push({
        id: 'cv_cand_' + Date.now(),
        fullName: 'Kandidat ' + nextNum,
        jobTitle: 'Posisi / Profesi',
        email: 'kandidat' + nextNum + '@email.com',
        phone: '081234567890',
        address: 'Jakarta, Indonesia',
        linkedin: '',
        github: '',
        summary: 'Rangkuman profesional profil kandidat...',
        experience: [
          {
            company: 'PT Perusahaan Reksa',
            position: 'Staff Profesional',
            period: '2023 - Sekarang',
            location: 'Jakarta',
            description: '• Melaksanakan tanggung jawab operasional dan pencapaian target kerja.'
          }
        ],
        education: [
          {
            institution: 'Universitas Indonesia',
            degree: 'S1 Sarjana',
            period: '2018 - 2022',
            gpa: '3.75'
          }
        ],
        skills: ['Manajemen Kerja', 'Komunikasi', 'Analisis Data', 'Problem Solving'],
        languages: ['Bahasa Indonesia (Native)', 'English (Conversational)'],
        certifications: [],
        selectedTemplate: 'single_column',
        customColor: '#1e293b',
        cvFont: 'font-sans'
      });
      activeCandidateIndex.value = bulkCandidates.value.length - 1;
    };

    const duplicateActiveCandidate = () => {
      const clone = JSON.parse(JSON.stringify(activeCv.value));
      clone.id = 'cv_cand_' + Date.now();
      clone.fullName = (clone.fullName || 'Kandidat') + ' (Salinan)';
      bulkCandidates.value.push(clone);
      activeCandidateIndex.value = bulkCandidates.value.length - 1;

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Profil Berhasil Diduplikasi!',
        showConfirmButton: false,
        timer: 1500
      });
    };

    const removeCandidate = (idx) => {
      if (bulkCandidates.value.length <= 1) return;
      bulkCandidates.value.splice(idx, 1);
      if (activeCandidateIndex.value >= bulkCandidates.value.length) {
        activeCandidateIndex.value = bulkCandidates.value.length - 1;
      }
    };

    const processBulkImport = () => {
      if (!bulkImportRawText.value.trim()) {
        Swal.fire('Data Kosong', 'Silakan tempel teks daftar kandidat terlebih dahulu.', 'warning');
        return;
      }

      const lines = bulkImportRawText.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      let added = 0;

      lines.forEach((line, idx) => {
        const parts = line.split(/[|,]+/).map(p => p.trim());
        if (parts.length > 0 && parts[0]) {
          const nextNum = bulkCandidates.value.length + 1;
          const skillsList = parts[5] ? parts[5].split(',').map(s => s.trim()).filter(s => s.length > 0) : ['Komunikasi', 'Kerja Tim', 'Teknis'];

          bulkCandidates.value.push({
            id: 'cv_cand_' + (Date.now() + idx),
            fullName: parts[0] || 'Kandidat ' + nextNum,
            jobTitle: parts[1] || 'Posisi Profesi',
            email: parts[2] || `kandidat${nextNum}@email.com`,
            phone: parts[3] || '081234567890',
            address: parts[4] || 'Indonesia',
            linkedin: '',
            github: '',
            summary: `Profesional berdedikasi tinggi pada bidang ${parts[1] || 'industri'} dengan rekam jejak kerja yang solid.`,
            experience: [
              {
                company: 'PT Solusi Terpadu',
                position: parts[1] || 'Staff Profesional',
                period: '2022 - Sekarang',
                location: parts[4] || 'Indonesia',
                description: '• Bertanggung jawab atas pengelolaan proyek dan efisiensi operasional tim.'
              }
            ],
            education: [
              {
                institution: 'Perguruan Tinggi Terakreditasi',
                degree: 'Sarjana / S1',
                period: '2017 - 2021',
                gpa: '3.70'
              }
            ],
            skills: skillsList,
            languages: ['Bahasa Indonesia (Native)', 'English (Good)'],
            certifications: [],
            selectedTemplate: 'single_column',
            customColor: '#1e293b',
            cvFont: 'font-sans'
          });
          added++;
        }
      });

      showBulkImportModal.value = false;
      bulkImportRawText.value = '';

      Swal.fire({
        icon: 'success',
        title: 'Kandidat Ditambahkan!',
        text: `${added} profil baru berhasil dimasukkan ke Batch CV.`
      });
    };

    // Print Logic
    const isPdfLoading = ref(false);

    const printCurrentMode = () => {
      if (isPdfLoading.value) return;
      isPdfLoading.value = true;

      setTimeout(() => {
        if (cvMode.value === 'bulk') {
          isPrintingAll.value = true;
          nextTick(() => {
            const title = `Batch_CV_ATS_${bulkCandidates.value.length}_Kandidat`;
            openPrintableDocumentInNewTab({
              title,
              elementId: 'cvBulkPrintArea',
              customStyles: `
                .bulk-cv-container > div { page-break-after: always; break-after: page; margin-bottom: 28px; }
              `,
              autoPrint: true
            });
            isPrintingAll.value = false;
            isPdfLoading.value = false;
          });
        } else {
          const title = `CV_ATS_${singleCv.value.fullName || 'Kandidat'}`;
          openPrintableDocumentInNewTab({
            title,
            elementId: 'cvPrintArea',
            autoPrint: true
          });
          isPdfLoading.value = false;
        }
      }, 400);
    };

    const printCv = () => {
      printCurrentMode();
    };

    const saveDraft = () => {
      if (cvMode.value === 'single') {
        store.dispatch('saveCvData', singleCv.value);
      } else {
        store.dispatch('saveBulkCvList', bulkCandidates.value);
      }
      isSaving.value = true;
      sendOnDeviceNotification('📄 Draft CV Berhasil Disimpan', {
        body: 'Semua profil CV ATS dan pengaturan layout berhasil disimpan.',
        type: 'success'
      });
      setTimeout(() => {
        isSaving.value = false;
      }, 1500);
    };

    // JSON Export / Import
    const cvJsonInput = ref(null);

    const exportCvJson = () => {
      try {
        const payload = {
          app: 'RajinKerja',
          module: 'CvBuilder',
          cvMode: cvMode.value,
          exportDate: new Date().toISOString(),
          singleCv: singleCv.value,
          bulkCandidates: bulkCandidates.value,
          customColor: customColor.value,
          cvFont: cvFont.value
        };
        const jsonStr = JSON.stringify(payload, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `CV_ATS_RajinKerja_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        Swal.fire({
          icon: 'success',
          title: 'Export JSON Berhasil!',
          text: 'Berkas cadangan data CV berhasil diunduh.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Export JSON',
          text: err.message
        });
      }
    };

    const triggerImportCvJson = () => {
      if (cvJsonInput.value) {
        cvJsonInput.value.value = '';
        cvJsonInput.value.click();
      }
    };

    const onCvJsonSelected = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          const incomingCv = parsed.singleCv || parsed.cvData || (parsed.fullName ? parsed : null);

          Swal.fire({
            title: 'Pulihkan Data CV & Batch?',
            html: `
              <div class="text-start p-2 bg-light rounded border mb-2 small">
                <p class="mb-1"><strong>Mode:</strong> ${parsed.bulkCandidates ? 'Batch Multi-Kandidat (' + parsed.bulkCandidates.length + ' Orang)' : 'Single CV'}</p>
                <p class="mb-0"><strong>Nama Utama:</strong> ${incomingCv ? incomingCv.fullName : (parsed.bulkCandidates ? parsed.bulkCandidates[0].fullName : '-')}</p>
              </div>
              <p class="small text-muted mb-0">Apakah Anda ingin memuat data CV ini ke editor?</p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Muat Data CV',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#0d6efd'
          }).then((result) => {
            if (result.isConfirmed) {
              if (incomingCv) {
                singleCv.value = { ...singleCv.value, ...incomingCv };
              }
              if (parsed.bulkCandidates && Array.isArray(parsed.bulkCandidates)) {
                bulkCandidates.value = parsed.bulkCandidates;
              }
              if (parsed.cvMode) cvMode.value = parsed.cvMode;
              if (parsed.customColor) customColor.value = parsed.customColor;
              if (parsed.cvFont) cvFont.value = parsed.cvFont;

              saveDraft();
              Swal.fire({
                icon: 'success',
                title: 'Data CV Berhasil Dipulihkan!',
                timer: 2000,
                showConfirmButton: false
              });
            }
          });
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Berkas Tidak Valid',
            text: 'Gagal membaca berkas JSON: ' + err.message
          });
        }
      };
      reader.readAsText(file);
    };

    return {
      cvMode,
      isPrintingAll,
      currentStep,
      isSaving,
      steps,
      layoutCategories,
      selectedCategory,
      presetColors,
      customColor,
      cvFont,
      templates,
      filteredLayouts,
      activeTemplateInfo,
      currentAtsScore,
      cv: singleCv,
      activeCv,
      activeCvColor,
      activeCvFont,
      setActiveCvColor,
      setActiveCvFont,
      selectLayoutForActiveCv,
      applyLayoutToAllCandidates,
      currentSkillsString,
      currentLanguagesString,
      currentCertificationsString,
      updateActiveSkills,
      updateActiveLanguages,
      updateActiveCertifications,
      addExperience,
      removeExperience,
      addEducation,
      removeEducation,
      onAvatarSelected,
      // Bulk State & Methods
      activeCandidateIndex,
      bulkCandidates,
      showBulkImportModal,
      bulkImportRawText,
      addNewCandidate,
      duplicateActiveCandidate,
      removeCandidate,
      processBulkImport,
      isPdfLoading,
      printCurrentMode,
      printCv,
      saveDraft,
      cvJsonInput,
      exportCvJson,
      triggerImportCvJson,
      onCvJsonSelected
    };
  }
};
</script>

<style scoped>
.hover-shadow:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
}

.btn-xs {
  font-size: 11.5px;
}

.cursor-pointer {
  cursor: pointer;
}

.hover-bg-white-20:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

@media print {
  .no-print,
  .print-hide {
    display: none !important;
  }

  .print-page-break {
    page-break-after: always !important;
    break-after: page !important;
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .print-page-break:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }
}
</style>
