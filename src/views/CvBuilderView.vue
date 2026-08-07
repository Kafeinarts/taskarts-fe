<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-success text-white fw-bold px-3 py-1.5 rounded-pill">100% ATS-Friendly</span>
          <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-1.5 rounded-pill">12 Varian Template</span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">📄 ATS CV Builder & Resume Generator</h2>
        <p class="text-muted mb-0">Isi form wizard, pilih dari 12 template ATS profesional, simpan draft otomatis, dan cetak / unduh PDF langsung.</p>
      </div>

      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-outline-success rounded-pill px-3 fw-semibold" @click="saveDraft">
          <i class="bi bi-floppy me-1"></i> {{ isSaving ? 'Tersimpan!' : 'Simpan Draft' }}
        </button>
        <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" @click="printCv">
          <i class="bi bi-printer me-1"></i> Cetak / Export PDF
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
            <h5 class="fw-bold text-dark mb-3 border-bottom pb-2"><i class="bi bi-person-badge text-primary me-2"></i>1. Informasi Kontak & Profil</h5>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Nama Lengkap <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="cv.fullName" placeholder="Contoh: Budi Pratama, S.Kom" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Judul Profesi / Position</label>
                <input type="text" class="form-control" v-model="cv.jobTitle" placeholder="Contoh: Senior Frontend Developer" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Email</label>
                <input type="email" class="form-control" v-model="cv.email" placeholder="budi.pratama@email.com" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Nomor Telepon / WA</label>
                <input type="text" class="form-control" v-model="cv.phone" placeholder="081234567890" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Kota / Alamat Ringkas</label>
                <input type="text" class="form-control" v-model="cv.address" placeholder="Jakarta, Indonesia" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">LinkedIn</label>
                <input type="text" class="form-control" v-model="cv.linkedin" placeholder="linkedin.com/in/budipratama" />
              </div>
              <div class="col-12">
                <label class="form-label fw-bold text-dark small">Ringkasan Profil / Summary ATS</label>
                <textarea class="form-control" rows="4" v-model="cv.summary" placeholder="Rangkuman profesional 3-4 kalimat mengenai pengalaman, pencapaian kunci, dan keahlian Anda..."></textarea>
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
                  <label class="form-label fw-bold text-dark small">Jabatan / Position</label>
                  <input type="text" class="form-control form-control-sm" v-model="exp.position" placeholder="Frontend Engineer" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold text-dark small">Periode (Tahun/Bulan)</label>
                  <input type="text" class="form-control form-control-sm" v-model="exp.period" placeholder="2022 - Sekarang" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold text-dark small">Lokasi</label>
                  <input type="text" class="form-control form-control-sm" v-model="exp.location" placeholder="Jakarta" />
                </div>
                <div class="col-12">
                  <label class="form-label fw-bold text-dark small">Deskripsi Tugas & Achievement (Gunakan Action Verbs)</label>
                  <textarea class="form-control form-control-sm" rows="3" v-model="exp.description" placeholder="• Mengembangkan 10+ fitur web dengan Vue 3...&#10;• Meningkatkan kecepatan muat halaman sebesar 40%..."></textarea>
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
                  <label class="form-label fw-bold text-dark small">Gelar / Jurusan</label>
                  <input type="text" class="form-control form-control-sm" v-model="edu.degree" placeholder="S1 Teknik Informatika" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold text-dark small">Tahun Lulus / Periode</label>
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
            <h5 class="fw-bold text-dark mb-3 border-bottom pb-2"><i class="bi bi-tools text-primary me-2"></i>4. Keahlian & Sertifikasi</h5>

            <div class="mb-3">
              <label class="form-label fw-bold text-dark small">Keahlian Utama / Technical Skills (Pisahkan dengan Koma)</label>
              <input type="text" class="form-control" :value="skillsString" @input="updateSkills" placeholder="Vue.js 3, TypeScript, Tailwind CSS, Node.js, Git, REST API" />
              <div class="form-text">Masukkan skill relevan dengan posisi yang dilamar agar lulus filter parser ATS.</div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold text-dark small">Kemampuan Bahasa</label>
              <input type="text" class="form-control" :value="languagesString" @input="updateLanguages" placeholder="Bahasa Indonesia (Native), English (Professional Working)" />
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold text-dark small">Sertifikasi & Lisensi</label>
              <textarea class="form-control" rows="3" :value="certificationsString" @input="updateCertifications" placeholder="• Google Certified Associate Cloud Engineer&#10;• Meta Front-End Developer Specialization"></textarea>
            </div>
          </div>

          <!-- Step 5: Pilih Template -->
          <div v-else-if="currentStep === 5">
            <h5 class="fw-bold text-dark mb-3 border-bottom pb-2"><i class="bi bi-palette text-primary me-2"></i>5. Pilih 12 Varian Template ATS</h5>
            <div class="row g-3">
              <div v-for="tmpl in templates" :key="tmpl.id" class="col-6 col-md-4">
                <div
                  class="card h-100 border-2 rounded-3 text-center p-3 cursor-pointer transition-all"
                  :class="cv.selectedTemplate === tmpl.id ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'border-light-subtle bg-light'"
                  @click="cv.selectedTemplate = tmpl.id"
                >
                  <div class="p-2 rounded mb-2 border bg-white" :style="{ borderColor: tmpl.color }">
                    <div class="fw-bold text-truncate small" :style="{ color: tmpl.color }">{{ tmpl.name }}</div>
                    <small class="text-muted d-block" style="font-size: 0.7rem;">{{ tmpl.style }}</small>
                  </div>
                  <span class="badge bg-dark rounded-pill small" v-if="cv.selectedTemplate === tmpl.id">Terpilih</span>
                  <span class="badge bg-secondary rounded-pill small" v-else>Pilih</span>
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

      <!-- Right Column (or Full Width on Step 6): Live ATS CV Preview -->
      <div :class="currentStep > 5 ? 'col-12' : 'col-lg-6'">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 overflow-hidden">
          <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 print-hide">
            <span class="fw-bold text-dark"><i class="bi bi-eye me-1 text-primary"></i> Live ATS CV Preview</span>
            <div class="d-flex gap-2">
              <button v-if="currentStep > 5" class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="currentStep = 1">
                <i class="bi bi-pencil me-1"></i> Edit Form
              </button>
              <button class="btn btn-sm btn-primary rounded-pill px-3 fw-bold" @click="printCv">
                <i class="bi bi-printer me-1"></i> Cetak / Save PDF
              </button>
            </div>
          </div>

          <!-- Printable Paper Container -->
          <div id="cvPrintArea" class="cv-paper border shadow-sm p-4 bg-white text-dark mx-auto" :class="cv.selectedTemplate">
            <!-- Header section -->
            <div class="cv-header border-bottom pb-3 mb-3" :class="getHeaderClass">
              <h1 class="fw-extrabold mb-1 tracking-tight" :style="{ color: getTemplateColor }">{{ cv.fullName || 'NAMA LENGKAP' }}</h1>
              <h5 class="fw-bold text-secondary mb-2">{{ cv.jobTitle || 'Judul Profesi Anda' }}</h5>
              <div class="d-flex flex-wrap gap-3 small text-muted">
                <span v-if="cv.email"><i class="bi bi-envelope me-1"></i>{{ cv.email }}</span>
                <span v-if="cv.phone"><i class="bi bi-telephone me-1"></i>{{ cv.phone }}</span>
                <span v-if="cv.address"><i class="bi bi-geo-alt me-1"></i>{{ cv.address }}</span>
                <span v-if="cv.linkedin"><i class="bi bi-linkedin me-1"></i>{{ cv.linkedin }}</span>
              </div>
            </div>

            <!-- Profile Summary -->
            <div v-if="cv.summary" class="cv-section mb-3">
              <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: getTemplateColor, borderColor: getTemplateColor }">Ringkasan Profil</h6>
              <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ cv.summary }}</p>
            </div>

            <!-- Experience -->
            <div v-if="cv.experience && cv.experience.length" class="cv-section mb-3">
              <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: getTemplateColor, borderColor: getTemplateColor }">Pengalaman Kerja</h6>
              <div v-for="(exp, i) in cv.experience" :key="i" class="mb-2">
                <div class="d-flex justify-content-between align-items-baseline">
                  <strong class="text-dark">{{ exp.position }} — <span class="fw-semibold text-secondary">{{ exp.company }}</span></strong>
                  <span class="small text-muted fw-bold">{{ exp.period }}</span>
                </div>
                <div class="small text-muted mb-1">{{ exp.location }}</div>
                <p class="small text-dark mb-1 white-space-pre-line">{{ exp.description }}</p>
              </div>
            </div>

            <!-- Education -->
            <div v-if="cv.education && cv.education.length" class="cv-section mb-3">
              <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: getTemplateColor, borderColor: getTemplateColor }">Pendidikan</h6>
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
              <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: getTemplateColor, borderColor: getTemplateColor }">Keahlian Utama</h6>
              <div class="d-flex flex-wrap gap-1.5">
                <span v-for="(skill, i) in cv.skills" :key="i" class="badge bg-light text-dark border px-2.5 py-1 fw-semibold small">
                  {{ skill }}
                </span>
              </div>
            </div>

            <!-- Languages & Certifications -->
            <div class="row g-3">
              <div v-if="cv.languages && cv.languages.length" class="col-6">
                <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: getTemplateColor, borderColor: getTemplateColor }">Bahasa</h6>
                <ul class="list-unstyled small mb-0">
                  <li v-for="(lang, i) in cv.languages" :key="i">• {{ lang }}</li>
                </ul>
              </div>

              <div v-if="cv.certifications && cv.certifications.length" class="col-6">
                <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: getTemplateColor, borderColor: getTemplateColor }">Sertifikasi</h6>
                <ul class="list-unstyled small mb-0">
                  <li v-for="(cert, i) in cv.certifications" :key="i">• {{ cert }}</li>
                </ul>
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
import { useStore } from 'vuex';
import { sendOnDeviceNotification } from '../utils/notification';

export default {
  name: 'CvBuilderView',
  setup() {
    const store = useStore();

    const currentStep = ref(1);
    const isSaving = ref(false);

    const steps = [
      { id: 1, name: 'Kontak' },
      { id: 2, name: 'Pengalaman' },
      { id: 3, name: 'Pendidikan' },
      { id: 4, name: 'Skills' },
      { id: 5, name: 'Template' }
    ];

    const templates = [
      { id: 'ats_clean_1', name: '1. Modern ATS Clean', style: 'Single Column Standard', color: '#1e293b' },
      { id: 'ats_executive_2', name: '2. Executive ATS', style: 'Header Highlight Navy', color: '#1e3a8a' },
      { id: 'ats_slate_3', name: '3. Minimalist Slate', style: 'Crisp Grey Divider', color: '#334155' },
      { id: 'ats_corporate_4', name: '4. Corporate Pro', style: 'Classic Royal Blue', color: '#2563eb' },
      { id: 'ats_tech_5', name: '5. Tech Developer', style: 'Emerald Green Modern', color: '#059669' },
      { id: 'ats_compact_6', name: '6. Compact One-Page', style: 'Dense Spacing Layout', color: '#0f172a' },
      { id: 'ats_serif_7', name: '7. Elegant Serif', style: 'Traditional Professional', color: '#431407' },
      { id: 'ats_creative_8', name: '8. Creative Accent', style: 'Purple Gradient Bar', color: '#7c3aed' },
      { id: 'ats_twocol_9', name: '9. Modern Two-Col', style: 'Clean Sidebar Ratio', color: '#0284c7' },
      { id: 'ats_swiss_10', name: '10. Swiss Clean', style: 'Bold Heading Contrast', color: '#dc2626' },
      { id: 'ats_emerald_11', name: '11. Emerald ATS', style: 'Teal Sharp Line', color: '#0d9488' },
      { id: 'ats_dark_12', name: '12. Dark Mode Print', style: 'High Contrast Print', color: '#111827' }
    ];

    const cv = ref({ ...store.getters.getCvData });

    const skillsString = computed(() => (cv.value.skills || []).join(', '));
    const languagesString = computed(() => (cv.value.languages || []).join(', '));
    const certificationsString = computed(() => (cv.value.certifications || []).join('\n'));

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

    const getTemplateColor = computed(() => {
      const tmpl = templates.find(t => t.id === cv.value.selectedTemplate);
      return tmpl ? tmpl.color : '#1e293b';
    });

    const getHeaderClass = computed(() => {
      if (cv.value.selectedTemplate === 'ats_executive_2') return 'text-start border-3';
      if (cv.value.selectedTemplate === 'ats_swiss_10') return 'text-uppercase';
      return '';
    });

    const saveDraft = () => {
      store.dispatch('saveCvData', cv.value);
      isSaving.value = true;
      sendOnDeviceNotification('📄 Draft CV Tersimpan', {
        body: 'Data resume ATS Anda berhasil diperbarui dan tersimpan.',
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

    return {
      currentStep,
      isSaving,
      steps,
      templates,
      cv,
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
      getTemplateColor,
      getHeaderClass,
      saveDraft,
      printCv
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
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  font-size: 13px;
  line-height: 1.5;
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
  }
}
</style>
