<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border">
      <div>
        <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
          <span class="badge bg-success text-white fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-shield-check me-1"></i> 100% ATS-Friendly Standard
          </span>
          <span class="badge bg-primary text-white fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-grid-fill me-1"></i> 15 Varian Layout Struktur
          </span>
          <span class="badge bg-info-subtle text-info fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-stars me-1"></i> ATS Score: {{ atsScore.score }}/100 ({{ atsScore.grade }})
          </span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">📄 ATS CV Builder & 15 Layout Resume Generator</h2>
        <p class="text-muted mb-0">Rancang CV standar ATS internasional dengan 15 jenis layout struktur unik, kustomisasi warna & tipografi, serta cetak / ekspor PDF langsung.</p>
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
        <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" @click="printCv">
          <i class="bi bi-printer me-1"></i> Cetak / Save PDF
        </button>
      </div>
    </div>

    <!-- Wizard Navigation Stepper -->
    <div class="card border-0 shadow-sm rounded-4 bg-white mb-4 p-3 overflow-x-auto">
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
      <!-- Left Column: Wizard Form Steps -->
      <div class="col-lg-6" v-if="currentStep <= 5">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
          <!-- Step 1: Informasi Kontak & Profil -->
          <div v-if="currentStep === 1">
            <h5 class="fw-bold text-dark mb-3 border-bottom pb-2">
              <i class="bi bi-person-badge text-primary me-2"></i>1. Informasi Kontak & Profil
            </h5>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Nama Lengkap <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="cv.fullName" placeholder="Contoh: Budi Pratama, S.Kom" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Judul Profesi / Position <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="cv.jobTitle" placeholder="Contoh: Senior Frontend Developer" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Email <span class="text-danger">*</span></label>
                <input type="email" class="form-control" v-model="cv.email" placeholder="budi.pratama@email.com" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Nomor Telepon / WA <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="cv.phone" placeholder="081234567890" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Kota / Domisili</label>
                <input type="text" class="form-control" v-model="cv.address" placeholder="Jakarta, Indonesia" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">LinkedIn / Portfolio URL</label>
                <input type="text" class="form-control" v-model="cv.linkedin" placeholder="linkedin.com/in/budipratama" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">GitHub / Website</label>
                <input type="text" class="form-control" v-model="cv.github" placeholder="github.com/budipratama" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Foto Profil / Avatar (Opsional)</label>
                <div class="d-flex align-items-center gap-2">
                  <input type="file" ref="avatarInput" accept="image/*" class="d-none" @change="onAvatarSelected" />
                  <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="$refs.avatarInput.click()">
                    <i class="bi bi-image me-1"></i> Upload Foto
                  </button>
                  <button v-if="cv.avatar" type="button" class="btn btn-sm btn-outline-danger rounded-pill px-2" @click="cv.avatar = ''" title="Hapus foto">
                    <i class="bi bi-trash"></i>
                  </button>
                  <span v-if="cv.avatar" class="badge bg-success-subtle text-success small">Foto Terpasang</span>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label fw-bold text-dark small">Ringkasan Profil / Summary ATS (3-4 Kalimat)</label>
                <textarea class="form-control" rows="4" v-model="cv.summary" placeholder="Rangkuman profesional mengenai pengalaman, pencapaian kunci, dan keahlian utama Anda..."></textarea>
                <div class="form-text small text-muted">Gunakan kata kunci industri untuk memaksimalkan skor pembacaan software ATS.</div>
              </div>
            </div>
          </div>

          <!-- Step 2: Pengalaman Kerja -->
          <div v-else-if="currentStep === 2">
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 class="fw-bold text-dark mb-0"><i class="bi bi-briefcase text-primary me-2"></i>2. Pengalaman Kerja</h5>
              <button class="btn btn-sm btn-primary rounded-pill px-3" @click="addExperience">
                <i class="bi bi-plus-lg me-1"></i> Tambah Posisi
              </button>
            </div>

            <div v-if="cv.experience.length === 0" class="text-center py-4 text-muted bg-light rounded-3">
              <i class="bi bi-briefcase fs-3 d-block mb-1"></i>
              Belum ada riwayat kerja. Klik "Tambah Posisi" di atas.
            </div>

            <div v-for="(exp, idx) in cv.experience" :key="idx" class="p-3 mb-3 border rounded-3 bg-light position-relative">
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
              <h5 class="fw-bold text-dark mb-0"><i class="bi bi-mortarboard text-primary me-2"></i>3. Riwayat Pendidikan</h5>
              <button class="btn btn-sm btn-primary rounded-pill px-3" @click="addEducation">
                <i class="bi bi-plus-lg me-1"></i> Tambah Pendidikan
              </button>
            </div>

            <div v-if="cv.education.length === 0" class="text-center py-4 text-muted bg-light rounded-3">
              <i class="bi bi-mortarboard fs-3 d-block mb-1"></i>
              Belum ada riwayat pendidikan. Klik "Tambah Pendidikan" di atas.
            </div>

            <div v-for="(edu, idx) in cv.education" :key="idx" class="p-3 mb-3 border rounded-3 bg-light position-relative">
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
            <h5 class="fw-bold text-dark mb-3 border-bottom pb-2"><i class="bi bi-tools text-primary me-2"></i>4. Keahlian, Bahasa & Sertifikasi</h5>

            <div class="mb-3">
              <label class="form-label fw-bold text-dark small">Technical Skills & Keahlian Utama (Pisahkan dengan Koma)</label>
              <input type="text" class="form-control" :value="skillsString" @input="updateSkills" placeholder="Vue.js 3, TypeScript, Tailwind CSS, Node.js, REST API, Git, Docker" />
              <div class="form-text">Tips: Cantumkan 6-12 kata kunci relevan dengan lowongan yang Anda tuju.</div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold text-dark small">Kemampuan Bahasa (Pisahkan dengan Koma)</label>
              <input type="text" class="form-control" :value="languagesString" @input="updateLanguages" placeholder="Bahasa Indonesia (Native), English (Professional Working)" />
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold text-dark small">Sertifikasi, Lisensi & Penghargaan</label>
              <textarea class="form-control" rows="3" :value="certificationsString" @input="updateCertifications" placeholder="• Google Certified Associate Cloud Engineer&#10;• Meta Front-End Developer Specialization&#10;• AWS Certified Solutions Architect"></textarea>
            </div>
          </div>

          <!-- Step 5: 15 Jenis Layout CV & Pengaturan Desain -->
          <div v-else-if="currentStep === 5">
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <div>
                <h5 class="fw-bold text-dark mb-0"><i class="bi bi-palette text-primary me-2"></i>5. Pilih 15 Jenis Layout Struktur CV</h5>
                <small class="text-muted">Pilih arsitektur tata letak yang paling sesuai dengan profil & industri Anda.</small>
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
            <div class="row g-2.5 mb-4" style="max-height: 380px; overflow-y: auto;">
              <div v-for="tmpl in filteredLayouts" :key="tmpl.id" class="col-6 col-md-4">
                <div
                  class="card h-100 border-2 rounded-3 text-center p-2.5 cursor-pointer transition-all hover-shadow"
                  :class="cv.selectedTemplate === tmpl.id ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'border-light-subtle bg-light'"
                  @click="cv.selectedTemplate = tmpl.id"
                >
                  <div class="p-2 rounded mb-2 border bg-white position-relative" :style="{ borderColor: tmpl.color }">
                    <span class="badge rounded-pill position-absolute top-0 end-0 m-1" :style="{ backgroundColor: tmpl.color, color: '#fff', fontSize: '9px' }">
                      {{ tmpl.type }}
                    </span>
                    <i :class="tmpl.icon" class="fs-4 d-block mb-1" :style="{ color: tmpl.color }"></i>
                    <div class="fw-bold text-truncate small" :style="{ color: tmpl.color }">{{ tmpl.name }}</div>
                  </div>
                  <small class="text-muted d-block lh-sm mb-1" style="font-size: 0.72rem;">{{ tmpl.description }}</small>
                  <span class="badge bg-dark rounded-pill small mt-auto" v-if="cv.selectedTemplate === tmpl.id">
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
                      :style="{ width: '22px', height: '22px', backgroundColor: color, outline: customColor === color ? '2px solid #000' : 'none' }"
                      @click="customColor = color"
                    ></button>
                    <input type="color" v-model="customColor" class="form-control form-control-color form-control-sm p-0 border-0" style="width: 24px; height: 24px;" title="Pilih custom HEX" />
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label text-muted small mb-1">Pilihan Tipografi Font:</label>
                  <select class="form-select form-select-sm" v-model="cvFont">
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

      <!-- Right Column: Live ATS CV Preview (Switchable to Full Screen) -->
      <div :class="currentStep > 5 ? 'col-12' : 'col-lg-6'">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 p-md-4 overflow-hidden">
          <div class="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-2 mb-3 print-hide gap-2">
            <div class="d-flex align-items-center gap-2">
              <span class="fw-bold text-dark"><i class="bi bi-eye me-1 text-primary"></i> Live ATS CV Preview</span>
              <span class="badge bg-light text-dark border small fw-normal">{{ activeTemplateInfo.name }}</span>
            </div>
            <div class="d-flex gap-2">
              <button v-if="currentStep > 5" class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="currentStep = 1">
                <i class="bi bi-pencil me-1"></i> Edit Form
              </button>
              <button class="btn btn-sm btn-primary rounded-pill px-3.5 fw-bold shadow-sm" @click="printCv">
                <i class="bi bi-printer me-1"></i> Cetak / Save PDF
              </button>
            </div>
          </div>

          <!-- Printable Paper Container with Dynamic 15 Layout Classes -->
          <div id="cvPrintArea" class="cv-paper border shadow-sm p-4 bg-white text-dark mx-auto" :class="[cv.selectedTemplate, cvFont]">
            <!-- ========================================== -->
            <!-- LAYOUT 1: ATS CLASSIC SINGLE COLUMN        -->
            <!-- ========================================== -->
            <div v-if="layoutType === 'single_column'" class="layout-single-column">
              <div class="cv-header border-bottom pb-3 mb-3 text-start">
                <h1 class="fw-extrabold mb-1 tracking-tight" :style="{ color: activeColor }">{{ cv.fullName || 'NAMA LENGKAP' }}</h1>
                <h5 class="fw-bold text-secondary mb-2">{{ cv.jobTitle || 'Judul Profesi' }}</h5>
                <div class="d-flex flex-wrap gap-2.5 small text-muted">
                  <span v-if="cv.email"><i class="bi bi-envelope me-1"></i>{{ cv.email }}</span>
                  <span v-if="cv.phone"><i class="bi bi-telephone me-1"></i>{{ cv.phone }}</span>
                  <span v-if="cv.address"><i class="bi bi-geo-alt me-1"></i>{{ cv.address }}</span>
                  <span v-if="cv.linkedin"><i class="bi bi-linkedin me-1"></i>{{ cv.linkedin }}</span>
                  <span v-if="cv.github"><i class="bi bi-github me-1"></i>{{ cv.github }}</span>
                </div>
              </div>

              <!-- Summary -->
              <div v-if="cv.summary" class="cv-section mb-3">
                <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Ringkasan Profil</h6>
                <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ cv.summary }}</p>
              </div>

              <!-- Experience -->
              <div v-if="cv.experience && cv.experience.length" class="cv-section mb-3">
                <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Pengalaman Kerja</h6>
                <div v-for="(exp, i) in cv.experience" :key="i" class="mb-2.5">
                  <div class="d-flex justify-content-between align-items-baseline">
                    <strong class="text-dark">{{ exp.position }} — <span class="fw-semibold text-secondary">{{ exp.company }}</span></strong>
                    <span class="small text-muted fw-bold">{{ exp.period }}</span>
                  </div>
                  <div class="small text-muted mb-1">{{ exp.location }}</div>
                  <p class="small text-dark mb-0 white-space-pre-line">{{ exp.description }}</p>
                </div>
              </div>

              <!-- Education -->
              <div v-if="cv.education && cv.education.length" class="cv-section mb-3">
                <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Pendidikan</h6>
                <div v-for="(edu, i) in cv.education" :key="i" class="mb-2">
                  <div class="d-flex justify-content-between align-items-baseline">
                    <strong class="text-dark">{{ edu.degree }} — {{ edu.institution }}</strong>
                    <span class="small text-muted fw-bold">{{ edu.period }}</span>
                  </div>
                  <div v-if="edu.gpa" class="small text-muted">IPK / GPA: {{ edu.gpa }}</div>
                </div>
              </div>

              <!-- Skills -->
              <div v-if="cv.skills && cv.skills.length" class="cv-section mb-3">
                <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Keahlian Utama</h6>
                <div class="d-flex flex-wrap gap-1.5">
                  <span v-for="(skill, i) in cv.skills" :key="i" class="badge bg-light text-dark border px-2.5 py-1 fw-semibold small">
                    {{ skill }}
                  </span>
                </div>
              </div>

              <!-- Languages & Certifications -->
              <div class="row g-3">
                <div v-if="cv.languages && cv.languages.length" class="col-6">
                  <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Bahasa</h6>
                  <ul class="list-unstyled small mb-0">
                    <li v-for="(lang, i) in cv.languages" :key="i">• {{ lang }}</li>
                  </ul>
                </div>
                <div v-if="cv.certifications && cv.certifications.length" class="col-6">
                  <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Sertifikasi</h6>
                  <ul class="list-unstyled small mb-0">
                    <li v-for="(cert, i) in cv.certifications" :key="i">• {{ cert }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- ========================================== -->
            <!-- LAYOUT 2: SPLIT SIDEBAR LEFT (32/68)       -->
            <!-- ========================================== -->
            <div v-else-if="layoutType === 'sidebar_left'" class="layout-sidebar-left row g-4">
              <!-- Left Sidebar -->
              <div class="col-4 border-end pe-3" :style="{ borderColor: '#e2e8f0' }">
                <div v-if="cv.avatar" class="text-center mb-3">
                  <img :src="cv.avatar" class="rounded-circle border shadow-sm" style="width: 80px; height: 80px; object-fit: cover;" alt="Avatar" />
                </div>
                <!-- Contact info -->
                <div class="mb-3">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Kontak</h6>
                  <div class="d-flex flex-column gap-1.5 small text-muted">
                    <span v-if="cv.email" class="text-break"><i class="bi bi-envelope me-1 text-dark"></i>{{ cv.email }}</span>
                    <span v-if="cv.phone"><i class="bi bi-telephone me-1 text-dark"></i>{{ cv.phone }}</span>
                    <span v-if="cv.address"><i class="bi bi-geo-alt me-1 text-dark"></i>{{ cv.address }}</span>
                    <span v-if="cv.linkedin" class="text-break"><i class="bi bi-linkedin me-1 text-dark"></i>{{ cv.linkedin }}</span>
                    <span v-if="cv.github" class="text-break"><i class="bi bi-github me-1 text-dark"></i>{{ cv.github }}</span>
                  </div>
                </div>

                <!-- Skills -->
                <div v-if="cv.skills && cv.skills.length" class="mb-3">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Skills</h6>
                  <div class="d-flex flex-column gap-1">
                    <span v-for="(skill, i) in cv.skills" :key="i" class="badge bg-light text-dark border text-start px-2 py-1 small">
                      • {{ skill }}
                    </span>
                  </div>
                </div>

                <!-- Languages -->
                <div v-if="cv.languages && cv.languages.length" class="mb-3">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Bahasa</h6>
                  <ul class="list-unstyled small mb-0">
                    <li v-for="(lang, i) in cv.languages" :key="i" class="mb-1">• {{ lang }}</li>
                  </ul>
                </div>

                <!-- Certifications -->
                <div v-if="cv.certifications && cv.certifications.length" class="mb-3">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Sertifikasi</h6>
                  <ul class="list-unstyled small mb-0">
                    <li v-for="(cert, i) in cv.certifications" :key="i" class="mb-1 small">• {{ cert }}</li>
                  </ul>
                </div>
              </div>

              <!-- Right Body -->
              <div class="col-8 ps-2">
                <div class="mb-3">
                  <h1 class="fw-extrabold mb-0" :style="{ color: activeColor }">{{ cv.fullName || 'NAMA LENGKAP' }}</h1>
                  <h5 class="fw-bold text-secondary mb-2">{{ cv.jobTitle || 'Judul Profesi' }}</h5>
                </div>

                <div v-if="cv.summary" class="mb-3">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Profil</h6>
                  <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ cv.summary }}</p>
                </div>

                <div v-if="cv.experience && cv.experience.length" class="mb-3">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pengalaman Kerja</h6>
                  <div v-for="(exp, i) in cv.experience" :key="i" class="mb-2.5">
                    <div class="d-flex justify-content-between align-items-baseline">
                      <strong class="text-dark">{{ exp.position }}</strong>
                      <span class="small text-muted fw-bold">{{ exp.period }}</span>
                    </div>
                    <div class="small fw-semibold text-secondary mb-1">{{ exp.company }} — {{ exp.location }}</div>
                    <p class="small text-dark mb-0 white-space-pre-line">{{ exp.description }}</p>
                  </div>
                </div>

                <div v-if="cv.education && cv.education.length" class="mb-3">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pendidikan</h6>
                  <div v-for="(edu, i) in cv.education" :key="i" class="mb-2">
                    <div class="d-flex justify-content-between align-items-baseline">
                      <strong class="text-dark">{{ edu.degree }}</strong>
                      <span class="small text-muted fw-bold">{{ edu.period }}</span>
                    </div>
                    <div class="small text-muted">{{ edu.institution }} <span v-if="edu.gpa">(IPK: {{ edu.gpa }})</span></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ========================================== -->
            <!-- LAYOUT 3: SPLIT SIDEBAR RIGHT (68/32)      -->
            <!-- ========================================== -->
            <div v-else-if="layoutType === 'sidebar_right'" class="layout-sidebar-right row g-4">
              <!-- Left Body -->
              <div class="col-8 border-end pe-3" :style="{ borderColor: '#e2e8f0' }">
                <div class="mb-3">
                  <h1 class="fw-extrabold mb-0" :style="{ color: activeColor }">{{ cv.fullName || 'NAMA LENGKAP' }}</h1>
                  <h5 class="fw-bold text-secondary mb-2">{{ cv.jobTitle || 'Judul Profesi' }}</h5>
                </div>

                <div v-if="cv.summary" class="mb-3">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Ringkasan Profil</h6>
                  <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ cv.summary }}</p>
                </div>

                <div v-if="cv.experience && cv.experience.length" class="mb-3">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pengalaman Kerja</h6>
                  <div v-for="(exp, i) in cv.experience" :key="i" class="mb-2.5">
                    <div class="d-flex justify-content-between align-items-baseline">
                      <strong class="text-dark">{{ exp.position }}</strong>
                      <span class="small text-muted fw-bold">{{ exp.period }}</span>
                    </div>
                    <div class="small fw-semibold text-secondary mb-1">{{ exp.company }} — {{ exp.location }}</div>
                    <p class="small text-dark mb-0 white-space-pre-line">{{ exp.description }}</p>
                  </div>
                </div>

                <div v-if="cv.education && cv.education.length" class="mb-3">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pendidikan</h6>
                  <div v-for="(edu, i) in cv.education" :key="i" class="mb-2">
                    <div class="d-flex justify-content-between align-items-baseline">
                      <strong class="text-dark">{{ edu.degree }}</strong>
                      <span class="small text-muted fw-bold">{{ edu.period }}</span>
                    </div>
                    <div class="small text-muted">{{ edu.institution }} <span v-if="edu.gpa">(IPK: {{ edu.gpa }})</span></div>
                  </div>
                </div>
              </div>

              <!-- Right Sidebar -->
              <div class="col-4 ps-2">
                <div v-if="cv.avatar" class="text-center mb-3">
                  <img :src="cv.avatar" class="rounded-circle border shadow-sm" style="width: 80px; height: 80px; object-fit: cover;" alt="Avatar" />
                </div>
                <div class="mb-3">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Kontak</h6>
                  <div class="d-flex flex-column gap-1.5 small text-muted">
                    <span v-if="cv.email" class="text-break"><i class="bi bi-envelope me-1 text-dark"></i>{{ cv.email }}</span>
                    <span v-if="cv.phone"><i class="bi bi-telephone me-1 text-dark"></i>{{ cv.phone }}</span>
                    <span v-if="cv.address"><i class="bi bi-geo-alt me-1 text-dark"></i>{{ cv.address }}</span>
                    <span v-if="cv.linkedin" class="text-break"><i class="bi bi-linkedin me-1 text-dark"></i>{{ cv.linkedin }}</span>
                  </div>
                </div>

                <div v-if="cv.skills && cv.skills.length" class="mb-3">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Keahlian</h6>
                  <div class="d-flex flex-column gap-1">
                    <span v-for="(skill, i) in cv.skills" :key="i" class="badge bg-light text-dark border text-start px-2 py-1 small">
                      • {{ skill }}
                    </span>
                  </div>
                </div>

                <div v-if="cv.languages && cv.languages.length" class="mb-3">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Bahasa</h6>
                  <ul class="list-unstyled small mb-0">
                    <li v-for="(lang, i) in cv.languages" :key="i" class="mb-1">• {{ lang }}</li>
                  </ul>
                </div>

                <div v-if="cv.certifications && cv.certifications.length" class="mb-3">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Sertifikasi</h6>
                  <ul class="list-unstyled small mb-0">
                    <li v-for="(cert, i) in cv.certifications" :key="i" class="mb-1 small">• {{ cert }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- ========================================== -->
            <!-- LAYOUT 4: CREATIVE ACCENT BANNER           -->
            <!-- ========================================== -->
            <div v-else-if="layoutType === 'creative_banner'" class="layout-creative-banner">
              <div class="p-3 text-white rounded-3 mb-3" :style="{ backgroundColor: activeColor }">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h1 class="fw-extrabold mb-1 text-white tracking-tight">{{ cv.fullName || 'NAMA LENGKAP' }}</h1>
                    <h5 class="fw-medium text-white-50 mb-2">{{ cv.jobTitle || 'Judul Profesi' }}</h5>
                    <div class="d-flex flex-wrap gap-2.5 small text-white-50">
                      <span v-if="cv.email"><i class="bi bi-envelope me-1"></i>{{ cv.email }}</span>
                      <span v-if="cv.phone"><i class="bi bi-telephone me-1"></i>{{ cv.phone }}</span>
                      <span v-if="cv.address"><i class="bi bi-geo-alt me-1"></i>{{ cv.address }}</span>
                    </div>
                  </div>
                  <div v-if="cv.avatar">
                    <img :src="cv.avatar" class="rounded-circle border border-white border-2 shadow-sm" style="width: 75px; height: 75px; object-fit: cover;" alt="Avatar" />
                  </div>
                </div>
              </div>

              <!-- Summary -->
              <div v-if="cv.summary" class="mb-3">
                <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Ringkasan Profil</h6>
                <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ cv.summary }}</p>
              </div>

              <!-- Dual Column Body -->
              <div class="row g-3">
                <!-- Left: Experience -->
                <div class="col-7">
                  <div v-if="cv.experience && cv.experience.length" class="mb-3">
                    <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pengalaman Kerja</h6>
                    <div v-for="(exp, i) in cv.experience" :key="i" class="mb-2">
                      <div class="d-flex justify-content-between align-items-baseline">
                        <strong class="text-dark small">{{ exp.position }}</strong>
                        <span class="small text-muted fw-bold" style="font-size: 10px;">{{ exp.period }}</span>
                      </div>
                      <div class="small text-muted mb-1">{{ exp.company }}</div>
                      <p class="small text-dark mb-0 white-space-pre-line">{{ exp.description }}</p>
                    </div>
                  </div>
                </div>

                <!-- Right: Edu & Skills -->
                <div class="col-5">
                  <div v-if="cv.education && cv.education.length" class="mb-3">
                    <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pendidikan</h6>
                    <div v-for="(edu, i) in cv.education" :key="i" class="mb-1.5">
                      <strong class="text-dark d-block small">{{ edu.degree }}</strong>
                      <div class="small text-muted">{{ edu.institution }} ({{ edu.period }})</div>
                    </div>
                  </div>

                  <div v-if="cv.skills && cv.skills.length" class="mb-3">
                    <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Keahlian</h6>
                    <div class="d-flex flex-wrap gap-1">
                      <span v-for="(s, i) in cv.skills" :key="i" class="badge bg-light text-dark border px-2 py-0.5 small">{{ s }}</span>
                    </div>
                  </div>

                  <div v-if="cv.certifications && cv.certifications.length" class="mb-2">
                    <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Sertifikasi</h6>
                    <ul class="list-unstyled small mb-0">
                      <li v-for="(c, i) in cv.certifications" :key="i" class="small">• {{ c }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- ========================================== -->
            <!-- LAYOUT 5: TIMELINE CHRONOLOGICAL FLOW      -->
            <!-- ========================================== -->
            <div v-else-if="layoutType === 'timeline_flow'" class="layout-timeline">
              <div class="cv-header border-bottom pb-3 mb-3">
                <h1 class="fw-extrabold mb-1" :style="{ color: activeColor }">{{ cv.fullName || 'NAMA LENGKAP' }}</h1>
                <h5 class="fw-bold text-secondary mb-2">{{ cv.jobTitle || 'Judul Profesi' }}</h5>
                <div class="d-flex flex-wrap gap-3 small text-muted">
                  <span v-if="cv.email"><i class="bi bi-envelope me-1"></i>{{ cv.email }}</span>
                  <span v-if="cv.phone"><i class="bi bi-telephone me-1"></i>{{ cv.phone }}</span>
                  <span v-if="cv.address"><i class="bi bi-geo-alt me-1"></i>{{ cv.address }}</span>
                </div>
              </div>

              <div v-if="cv.summary" class="mb-3">
                <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Profil Profesional</h6>
                <p class="small text-dark mb-0">{{ cv.summary }}</p>
              </div>

              <!-- Timeline Experience with connecting left line -->
              <div v-if="cv.experience && cv.experience.length" class="mb-3">
                <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Linimasa Pengalaman</h6>
                <div class="ps-3 position-relative border-start border-2" :style="{ borderColor: activeColor }">
                  <div v-for="(exp, i) in cv.experience" :key="i" class="mb-3 position-relative">
                    <span class="position-absolute rounded-circle bg-white border border-2" :style="{ borderColor: activeColor, width: '12px', height: '12px', left: '-23px', top: '4px' }"></span>
                    <div class="d-flex justify-content-between align-items-baseline">
                      <strong class="text-dark">{{ exp.position }} @ {{ exp.company }}</strong>
                      <span class="badge bg-light text-dark border small">{{ exp.period }}</span>
                    </div>
                    <div class="small text-muted mb-1">{{ exp.location }}</div>
                    <p class="small text-dark mb-0 white-space-pre-line">{{ exp.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Timeline Education -->
              <div v-if="cv.education && cv.education.length" class="mb-3">
                <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Linimasa Pendidikan</h6>
                <div class="ps-3 position-relative border-start border-2" :style="{ borderColor: activeColor }">
                  <div v-for="(edu, i) in cv.education" :key="i" class="mb-2 position-relative">
                    <span class="position-absolute rounded-circle bg-white border border-2" :style="{ borderColor: activeColor, width: '12px', height: '12px', left: '-23px', top: '4px' }"></span>
                    <div class="d-flex justify-content-between align-items-baseline">
                      <strong class="text-dark">{{ edu.degree }}</strong>
                      <span class="badge bg-light text-dark border small">{{ edu.period }}</span>
                    </div>
                    <div class="small text-muted">{{ edu.institution }} <span v-if="edu.gpa">| IPK: {{ edu.gpa }}</span></div>
                  </div>
                </div>
              </div>

              <!-- Skills & Badges -->
              <div v-if="cv.skills && cv.skills.length" class="mb-3">
                <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Keahlian & Kompetensi</h6>
                <div class="d-flex flex-wrap gap-1.5">
                  <span v-for="(skill, i) in cv.skills" :key="i" class="badge bg-light text-dark border px-2.5 py-1 small">{{ skill }}</span>
                </div>
              </div>
            </div>

            <!-- ========================================== -->
            <!-- LAYOUT 6: DUAL BALANCED 50/50 COLUMN       -->
            <!-- ========================================== -->
            <div v-else-if="layoutType === 'dual_balanced'" class="layout-dual-balanced">
              <div class="cv-header text-center border-bottom pb-3 mb-3">
                <h1 class="fw-extrabold mb-1" :style="{ color: activeColor }">{{ cv.fullName || 'NAMA LENGKAP' }}</h1>
                <h5 class="fw-bold text-secondary mb-2">{{ cv.jobTitle || 'Judul Profesi' }}</h5>
                <div class="d-flex justify-content-center flex-wrap gap-3 small text-muted">
                  <span v-if="cv.email">{{ cv.email }}</span>
                  <span v-if="cv.phone">| {{ cv.phone }}</span>
                  <span v-if="cv.address">| {{ cv.address }}</span>
                  <span v-if="cv.linkedin">| {{ cv.linkedin }}</span>
                </div>
              </div>

              <div v-if="cv.summary" class="mb-3">
                <p class="small text-dark mb-0 text-center lh-base fst-italic">{{ cv.summary }}</p>
              </div>

              <div class="row g-3">
                <!-- Col 1: Experience -->
                <div class="col-6">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pengalaman Kerja</h6>
                  <div v-for="(exp, i) in cv.experience" :key="i" class="mb-2">
                    <strong class="text-dark small d-block">{{ exp.position }}</strong>
                    <div class="small fw-semibold text-secondary">{{ exp.company }} ({{ exp.period }})</div>
                    <p class="small text-dark mb-0 white-space-pre-line">{{ exp.description }}</p>
                  </div>
                </div>

                <!-- Col 2: Education, Skills, Langs -->
                <div class="col-6">
                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pendidikan</h6>
                  <div v-for="(edu, i) in cv.education" :key="i" class="mb-2">
                    <strong class="text-dark small d-block">{{ edu.degree }}</strong>
                    <div class="small text-muted">{{ edu.institution }} ({{ edu.period }})</div>
                  </div>

                  <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom mt-3" :style="{ color: activeColor, borderColor: activeColor }">Keahlian & Bahasa</h6>
                  <div class="d-flex flex-wrap gap-1 mb-2">
                    <span v-for="(s, i) in cv.skills" :key="i" class="badge bg-light text-dark border px-2 py-0.5 small">{{ s }}</span>
                  </div>
                  <div v-if="cv.languages && cv.languages.length" class="small text-muted">
                    <strong>Bahasa:</strong> {{ languagesString }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Fallback for standard layouts -->
            <div v-else class="layout-standard">
              <div class="cv-header border-bottom pb-3 mb-3">
                <h1 class="fw-extrabold mb-1" :style="{ color: activeColor }">{{ cv.fullName || 'NAMA LENGKAP' }}</h1>
                <h5 class="fw-bold text-secondary mb-2">{{ cv.jobTitle || 'Judul Profesi Anda' }}</h5>
                <div class="d-flex flex-wrap gap-3 small text-muted">
                  <span v-if="cv.email"><i class="bi bi-envelope me-1"></i>{{ cv.email }}</span>
                  <span v-if="cv.phone"><i class="bi bi-telephone me-1"></i>{{ cv.phone }}</span>
                  <span v-if="cv.address"><i class="bi bi-geo-alt me-1"></i>{{ cv.address }}</span>
                  <span v-if="cv.linkedin"><i class="bi bi-linkedin me-1"></i>{{ cv.linkedin }}</span>
                </div>
              </div>

              <div v-if="cv.summary" class="cv-section mb-3">
                <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Ringkasan Profil</h6>
                <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ cv.summary }}</p>
              </div>

              <div v-if="cv.experience && cv.experience.length" class="cv-section mb-3">
                <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Pengalaman Kerja</h6>
                <div v-for="(exp, i) in cv.experience" :key="i" class="mb-2">
                  <div class="d-flex justify-content-between align-items-baseline">
                    <strong class="text-dark">{{ exp.position }} — <span class="fw-semibold text-secondary">{{ exp.company }}</span></strong>
                    <span class="small text-muted fw-bold">{{ exp.period }}</span>
                  </div>
                  <div class="small text-muted mb-1">{{ exp.location }}</div>
                  <p class="small text-dark mb-1 white-space-pre-line">{{ exp.description }}</p>
                </div>
              </div>

              <div v-if="cv.education && cv.education.length" class="cv-section mb-3">
                <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Pendidikan</h6>
                <div v-for="(edu, i) in cv.education" :key="i" class="mb-2">
                  <div class="d-flex justify-content-between align-items-baseline">
                    <strong class="text-dark">{{ edu.degree }} — {{ edu.institution }}</strong>
                    <span class="small text-muted fw-bold">{{ edu.period }}</span>
                  </div>
                  <div v-if="edu.gpa" class="small text-muted">IPK / GPA: {{ edu.gpa }}</div>
                </div>
              </div>

              <div v-if="cv.skills && cv.skills.length" class="cv-section mb-3">
                <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Keahlian</h6>
                <div class="d-flex flex-wrap gap-1.5">
                  <span v-for="(skill, i) in cv.skills" :key="i" class="badge bg-light text-dark border px-2.5 py-1 small">
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import { useStore } from 'vuex';
import { sendOnDeviceNotification } from '../utils/notification';

export default {
  name: 'CvBuilderView',
  setup() {
    const store = useStore();

    const currentStep = ref(1);
    const isSaving = ref(false);
    const selectedCategory = ref('all');
    const customColor = ref('#1e293b');
    const cvFont = ref('font-sans');

    const steps = [
      { id: 1, name: 'Kontak' },
      { id: 2, name: 'Pengalaman' },
      { id: 3, name: 'Pendidikan' },
      { id: 4, name: 'Skills & Sertif' },
      { id: 5, name: '15 Layout Desain' }
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
        description: 'Header blok warna modern berlatar gelap kontras dengan isi putih.'
      },
      {
        id: 'ats_swiss_10',
        name: '10. Swiss High-Contrast',
        category: 'minimalist',
        type: 'Swiss Clean',
        layout: 'single_column',
        icon: 'bi-bounding-box-circles',
        color: '#b91c1c',
        description: 'Hirarki tegas dengan huruf kapital aksen merah khas desain Swiss modern.'
      },
      {
        id: 'ats_timeline_11',
        name: '11. Chronological Timeline Flow',
        category: 'single',
        type: 'Timeline',
        layout: 'timeline_flow',
        icon: 'bi-clock-history',
        color: '#2563eb',
        description: 'Garis alur waktu vertikal dengan titik marker penanda tiap karir.'
      },
      {
        id: 'ats_dual_balanced_12',
        name: '12. Dual Balanced 50:50',
        category: 'sidebar',
        type: 'Dual 50:50',
        layout: 'dual_balanced',
        icon: 'bi-columns-gap',
        color: '#0284c7',
        description: 'Dua kolom seimbang membagi pengalaman di kiri dan skill/edukasi di kanan.'
      },
      {
        id: 'ats_corporate_horizon_13',
        name: '13. Corporate Horizon Blue',
        category: 'executive',
        type: 'Corporate',
        layout: 'single_column',
        icon: 'bi-building',
        color: '#1d4ed8',
        description: 'Aksen garis horizon tebal corporate standar perusahaan multinasional.'
      },
      {
        id: 'ats_bordered_box_14',
        name: '14. Executive Framed Box',
        category: 'executive',
        type: 'Framed',
        layout: 'single_column',
        icon: 'bi-square',
        color: '#374151',
        description: 'Bingkai garis elegan mengelilingi dokumen untuk tampilan eksklusif.'
      },
      {
        id: 'ats_dark_contrast_15',
        name: '15. Modern Charcoal Accent',
        category: 'single',
        type: 'Charcoal Dark',
        layout: 'single_column',
        icon: 'bi-circle-half',
        color: '#111827',
        description: 'Aksen arang hitam pekat dengan pembagi section bergaris tegas.'
      }
    ];

    const cv = ref({
      ...store.getters.getCvData,
      avatar: store.getters.getCvData.avatar || '',
      selectedTemplate: store.getters.getCvData.selectedTemplate || 'ats_clean_1'
    });

    // Ensure array structure
    if (!Array.isArray(cv.value.experience)) cv.value.experience = [];
    if (!Array.isArray(cv.value.education)) cv.value.education = [];
    if (!Array.isArray(cv.value.skills)) cv.value.skills = [];
    if (!Array.isArray(cv.value.languages)) cv.value.languages = [];
    if (!Array.isArray(cv.value.certifications)) cv.value.certifications = [];

    const filteredLayouts = computed(() => {
      if (selectedCategory.value === 'all') return templates;
      return templates.filter(t => t.category === selectedCategory.value);
    });

    const activeTemplateInfo = computed(() => {
      return templates.find(t => t.id === cv.value.selectedTemplate) || templates[0];
    });

    const activeColor = computed(() => {
      if (customColor.value && customColor.value !== '#1e293b') return customColor.value;
      return activeTemplateInfo.value.color;
    });

    const layoutType = computed(() => {
      return activeTemplateInfo.value.layout || 'single_column';
    });

    const skillsString = computed(() => (cv.value.skills || []).join(', '));
    const languagesString = computed(() => (cv.value.languages || []).join(', '));
    const certificationsString = computed(() => (cv.value.certifications || []).join('\n'));

    // ATS Score Calculator
    const atsScore = computed(() => {
      let score = 0;
      if (cv.value.fullName && cv.value.fullName.trim().length > 3) score += 15;
      if (cv.value.jobTitle && cv.value.jobTitle.trim().length > 2) score += 15;
      if (cv.value.email && cv.value.email.includes('@')) score += 15;
      if (cv.value.phone && cv.value.phone.length > 8) score += 10;
      if (cv.value.summary && cv.value.summary.length > 40) score += 15;
      if (cv.value.experience && cv.value.experience.length > 0) score += 15;
      if (cv.value.education && cv.value.education.length > 0) score += 10;
      if (cv.value.skills && cv.value.skills.length >= 4) score += 5;

      let grade = 'Pemula';
      if (score >= 90) grade = 'Sangat Tinggi / 100% ATS Ready';
      else if (score >= 70) grade = 'Bagus / Siap Melamar';
      else if (score >= 50) grade = 'Cukup / Perlu Dilengkapi';

      return { score, grade };
    });

    const updateSkills = (e) => {
      cv.value.skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    };

    const updateLanguages = (e) => {
      cv.value.languages = e.target.value.split(',').map(l => l.trim()).filter(Boolean);
    };

    const updateCertifications = (e) => {
      cv.value.certifications = e.target.value.split('\n').map(c => c.replace(/^•\s*/, '').trim()).filter(Boolean);
    };

    const addExperience = () => {
      cv.value.experience.push({
        company: '',
        position: '',
        period: '',
        location: '',
        description: ''
      });
    };

    const removeExperience = (index) => {
      cv.value.experience.splice(index, 1);
    };

    const addEducation = () => {
      cv.value.education.push({
        institution: '',
        degree: '',
        period: '',
        gpa: ''
      });
    };

    const removeEducation = (index) => {
      cv.value.education.splice(index, 1);
    };

    const onAvatarSelected = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        cv.value.avatar = evt.target.result;
        sendOnDeviceNotification('📸 Foto Profil Terpasang', {
          body: 'Foto berhasil diunggah ke formulir CV Anda.',
          type: 'success'
        });
      };
      reader.readAsDataURL(file);
    };

    const saveDraft = () => {
      store.dispatch('saveCvData', cv.value);
      isSaving.value = true;
      sendOnDeviceNotification('📄 Draft CV & Layout Tersimpan', {
        body: `Data resume ATS varian "${activeTemplateInfo.value.name}" berhasil disimpan.`,
        type: 'success'
      });
      setTimeout(() => {
        isSaving.value = false;
      }, 1500);
    };

    const printCv = () => {
      saveDraft();
      window.print();
    };

    const cvJsonInput = ref(null);

    const exportCvJson = () => {
      try {
        const payload = {
          app: 'RajinKerja',
          type: 'cv_backup',
          version: '2.5',
          exportDate: new Date().toISOString(),
          cvData: cv.value,
          customColor: customColor.value,
          cvFont: cvFont.value
        };
        const jsonStr = JSON.stringify(payload, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const nameSlug = (cv.value.fullName || 'ATS_Resume').replace(/[^a-zA-Z0-9]/g, '_');
        link.download = `CV_${nameSlug}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        Swal.fire({
          icon: 'success',
          title: 'Export CV Berhasil!',
          text: 'Data CV ATS berhasil diunduh dalam format JSON.',
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
          const incomingCv = parsed.cvData || parsed.cv || (parsed.fullName ? parsed : null);

          if (!incomingCv || typeof incomingCv !== 'object') {
            Swal.fire({
              icon: 'warning',
              title: 'Format CV Tidak Ditemukan',
              text: 'Berkas JSON ini tidak memiliki struktur data CV yang valid.'
            });
            return;
          }

          Swal.fire({
            title: 'Pulihkan Data CV & Layout?',
            html: `
              <div class="text-start p-2 bg-light rounded border mb-2 small">
                <p class="mb-1"><strong>Nama:</strong> ${incomingCv.fullName || '-'}</p>
                <p class="mb-1"><strong>Posisi:</strong> ${incomingCv.jobTitle || '-'}</p>
                <p class="mb-0"><strong>Pengalaman:</strong> ${(incomingCv.experience || []).length} posisi</p>
              </div>
              <p class="small text-muted mb-0">Apakah Anda ingin memuat data CV ini ke formulir editor?</p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Muat Data CV',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#6c757d'
          }).then((result) => {
            if (result.isConfirmed) {
              cv.value = { ...cv.value, ...incomingCv };
              if (parsed.customColor) customColor.value = parsed.customColor;
              if (parsed.cvFont) cvFont.value = parsed.cvFont;
              store.dispatch('saveCvData', cv.value);
              Swal.fire({
                icon: 'success',
                title: 'Data CV Berhasil Dipulihkan!',
                text: 'Formulir CV telah diperbarui sesuai berkas JSON.',
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
      activeColor,
      layoutType,
      cv,
      atsScore,
      skillsString,
      languagesString,
      certificationsString,
      updateSkills,
      updateLanguages,
      updateCertifications,
      addExperience,
      removeExperience,
      addEducation,
      removeEducation,
      onAvatarSelected,
      saveDraft,
      printCv,
      cvJsonInput,
      exportCvJson,
      triggerImportCvJson,
      onCvJsonSelected
    };
  }
};
</script>

<style scoped>
.cv-paper {
  width: 100%;
  max-width: 794px; /* Standard A4 width in px at 96DPI */
  min-height: 1123px; /* A4 height */
  box-sizing: border-box;
  font-size: 13px;
  line-height: 1.5;
}

.font-sans {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
}
.font-serif {
  font-family: 'Georgia', 'Times New Roman', serif;
}
.font-mono {
  font-family: 'Consolas', 'Courier New', monospace;
}

.hover-shadow:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
}

.btn-xs {
  font-size: 11.5px;
}

@media print {
  body * {
    visibility: hidden;
  }
  .print-hide {
    display: none !important;
  }
  #cvPrintArea, #cvPrintArea * {
    visibility: visible;
  }
  #cvPrintArea {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    max-width: 100% !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
