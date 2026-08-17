<template>
  <div class="cv-paper border shadow-sm p-4 p-md-5 bg-white text-dark mx-auto" :class="[layoutType, cvFont]">
    <!-- ========================================== -->
    <!-- 1. LAYOUT: SPLIT SIDEBAR LEFT (32/68)      -->
    <!-- ========================================== -->
    <div v-if="resolvedLayout === 'sidebar_left'" class="layout-sidebar-left row g-4">
      <!-- Left Sidebar -->
      <div class="col-4 border-end pe-3" style="border-color: #e2e8f0;">
        <div v-if="targetCv.avatar" class="text-center mb-3">
          <img :src="targetCv.avatar" class="rounded-circle border shadow-sm" style="width: 85px; height: 85px; object-fit: cover;" alt="Avatar" />
        </div>
        <!-- Contact info -->
        <div class="mb-3">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Kontak</h6>
          <div class="d-flex flex-column gap-1.5 small text-muted">
            <span v-if="targetCv.email" class="text-break"><i class="bi bi-envelope me-1 text-dark"></i>{{ targetCv.email }}</span>
            <span v-if="targetCv.phone"><i class="bi bi-telephone me-1 text-dark"></i>{{ targetCv.phone }}</span>
            <span v-if="targetCv.address"><i class="bi bi-geo-alt me-1 text-dark"></i>{{ targetCv.address }}</span>
            <span v-if="targetCv.linkedin" class="text-break"><i class="bi bi-linkedin me-1 text-dark"></i>{{ targetCv.linkedin }}</span>
            <span v-if="targetCv.github" class="text-break"><i class="bi bi-github me-1 text-dark"></i>{{ targetCv.github }}</span>
          </div>
        </div>

        <!-- Skills -->
        <div v-if="targetCv.skills && targetCv.skills.length" class="mb-3">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Keahlian</h6>
          <div class="d-flex flex-column gap-1">
            <span v-for="(skill, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border text-start px-2 py-1 small">
              • {{ skill }}
            </span>
          </div>
        </div>

        <!-- Languages -->
        <div v-if="targetCv.languages && targetCv.languages.length" class="mb-3">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Bahasa</h6>
          <ul class="list-unstyled small mb-0">
            <li v-for="(lang, i) in targetCv.languages" :key="i" class="mb-1">• {{ lang }}</li>
          </ul>
        </div>

        <!-- Certifications -->
        <div v-if="targetCv.certifications && targetCv.certifications.length" class="mb-3">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Sertifikasi</h6>
          <ul class="list-unstyled small mb-0">
            <li v-for="(cert, i) in targetCv.certifications" :key="i" class="mb-1 small">• {{ cert }}</li>
          </ul>
        </div>
      </div>

      <!-- Right Body -->
      <div class="col-8 ps-2">
        <div class="mb-3">
          <h1 class="fw-extrabold mb-0" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
          <h5 class="fw-bold text-secondary mb-2">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
        </div>

        <div v-if="targetCv.summary" class="mb-3">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Profil</h6>
          <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
        </div>

        <div v-if="targetCv.experience && targetCv.experience.length" class="mb-3">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pengalaman Kerja</h6>
          <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-2.5">
            <div class="d-flex justify-content-between align-items-baseline">
              <strong class="text-dark">{{ exp.position }}</strong>
              <span class="small text-muted fw-bold">{{ exp.period }}</span>
            </div>
            <div class="small fw-semibold text-secondary mb-1">{{ exp.company }} — {{ exp.location }}</div>
            <p class="small text-dark mb-0 white-space-pre-line">{{ exp.description }}</p>
          </div>
        </div>

        <div v-if="targetCv.education && targetCv.education.length" class="mb-3">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pendidikan</h6>
          <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-2">
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
    <!-- 2. LAYOUT: SPLIT SIDEBAR RIGHT (68/32)     -->
    <!-- ========================================== -->
    <div v-else-if="resolvedLayout === 'sidebar_right'" class="layout-sidebar-right row g-4">
      <!-- Left Body -->
      <div class="col-8 border-end pe-3" style="border-color: #e2e8f0;">
        <div class="mb-3">
          <h1 class="fw-extrabold mb-0" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
          <h5 class="fw-bold text-secondary mb-2">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
        </div>

        <div v-if="targetCv.summary" class="mb-3">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Ringkasan Profil</h6>
          <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
        </div>

        <div v-if="targetCv.experience && targetCv.experience.length" class="mb-3">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pengalaman Kerja</h6>
          <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-2.5">
            <div class="d-flex justify-content-between align-items-baseline">
              <strong class="text-dark">{{ exp.position }}</strong>
              <span class="small text-muted fw-bold">{{ exp.period }}</span>
            </div>
            <div class="small fw-semibold text-secondary mb-1">{{ exp.company }} — {{ exp.location }}</div>
            <p class="small text-dark mb-0 white-space-pre-line">{{ exp.description }}</p>
          </div>
        </div>

        <div v-if="targetCv.education && targetCv.education.length" class="mb-3">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pendidikan</h6>
          <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-2">
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
        <div v-if="targetCv.avatar" class="text-center mb-3">
          <img :src="targetCv.avatar" class="rounded-circle border shadow-sm" style="width: 85px; height: 85px; object-fit: cover;" alt="Avatar" />
        </div>
        <div class="mb-3">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Kontak</h6>
          <div class="d-flex flex-column gap-1.5 small text-muted">
            <span v-if="targetCv.email" class="text-break"><i class="bi bi-envelope me-1 text-dark"></i>{{ targetCv.email }}</span>
            <span v-if="targetCv.phone"><i class="bi bi-telephone me-1 text-dark"></i>{{ targetCv.phone }}</span>
            <span v-if="targetCv.address"><i class="bi bi-geo-alt me-1 text-dark"></i>{{ targetCv.address }}</span>
            <span v-if="targetCv.linkedin" class="text-break"><i class="bi bi-linkedin me-1 text-dark"></i>{{ targetCv.linkedin }}</span>
          </div>
        </div>

        <div v-if="targetCv.skills && targetCv.skills.length" class="mb-3">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Keahlian</h6>
          <div class="d-flex flex-column gap-1">
            <span v-for="(skill, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border text-start px-2 py-1 small">
              • {{ skill }}
            </span>
          </div>
        </div>

        <div v-if="targetCv.languages && targetCv.languages.length" class="mb-3">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Bahasa</h6>
          <ul class="list-unstyled small mb-0">
            <li v-for="(lang, i) in targetCv.languages" :key="i" class="mb-1">• {{ lang }}</li>
          </ul>
        </div>

        <div v-if="targetCv.certifications && targetCv.certifications.length" class="mb-3">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Sertifikasi</h6>
          <ul class="list-unstyled small mb-0">
            <li v-for="(cert, i) in targetCv.certifications" :key="i" class="mb-1 small">• {{ cert }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- 3. LAYOUT: CREATIVE ACCENT BANNER          -->
    <!-- ========================================== -->
    <div v-else-if="resolvedLayout === 'creative_banner'" class="layout-creative-banner">
      <div class="p-4 text-white rounded-3 mb-3" :style="{ backgroundColor: activeColor }">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="fw-extrabold mb-1 text-white tracking-tight">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
            <h5 class="fw-medium text-white-50 mb-2">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
            <div class="d-flex flex-wrap gap-2.5 small text-white-50">
              <span v-if="targetCv.email"><i class="bi bi-envelope me-1"></i>{{ targetCv.email }}</span>
              <span v-if="targetCv.phone"><i class="bi bi-telephone me-1"></i>{{ targetCv.phone }}</span>
              <span v-if="targetCv.address"><i class="bi bi-geo-alt me-1"></i>{{ targetCv.address }}</span>
            </div>
          </div>
          <div v-if="targetCv.avatar">
            <img :src="targetCv.avatar" class="rounded-circle border border-white border-2 shadow-sm" style="width: 80px; height: 80px; object-fit: cover;" alt="Avatar" />
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div v-if="targetCv.summary" class="mb-3">
        <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Ringkasan Profil</h6>
        <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
      </div>

      <!-- Dual Column Body -->
      <div class="row g-3">
        <!-- Left: Experience -->
        <div class="col-7">
          <div v-if="targetCv.experience && targetCv.experience.length" class="mb-3">
            <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pengalaman Kerja</h6>
            <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-2">
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
          <div v-if="targetCv.education && targetCv.education.length" class="mb-3">
            <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pendidikan</h6>
            <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-1.5">
              <strong class="text-dark d-block small">{{ edu.degree }}</strong>
              <div class="small text-muted">{{ edu.institution }} ({{ edu.period }})</div>
            </div>
          </div>

          <div v-if="targetCv.skills && targetCv.skills.length" class="mb-3">
            <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Keahlian</h6>
            <div class="d-flex flex-wrap gap-1">
              <span v-for="(s, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border px-2 py-0.5 small">{{ s }}</span>
            </div>
          </div>

          <div v-if="targetCv.certifications && targetCv.certifications.length" class="mb-2">
            <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Sertifikasi</h6>
            <ul class="list-unstyled small mb-0">
              <li v-for="(c, i) in targetCv.certifications" :key="i" class="small">• {{ c }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- 4. LAYOUT: TIMELINE FLOW                   -->
    <!-- ========================================== -->
    <div v-else-if="resolvedLayout === 'timeline_flow'" class="layout-timeline">
      <div class="cv-header border-bottom pb-3 mb-3">
        <h1 class="fw-extrabold mb-1" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
        <h5 class="fw-bold text-secondary mb-2">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
        <div class="d-flex flex-wrap gap-3 small text-muted">
          <span v-if="targetCv.email"><i class="bi bi-envelope me-1"></i>{{ targetCv.email }}</span>
          <span v-if="targetCv.phone"><i class="bi bi-telephone me-1"></i>{{ targetCv.phone }}</span>
          <span v-if="targetCv.address"><i class="bi bi-geo-alt me-1"></i>{{ targetCv.address }}</span>
        </div>
      </div>

      <div v-if="targetCv.summary" class="mb-3">
        <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Profil Profesional</h6>
        <p class="small text-dark mb-0">{{ targetCv.summary }}</p>
      </div>

      <!-- Timeline Experience -->
      <div v-if="targetCv.experience && targetCv.experience.length" class="mb-3">
        <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Linimasa Pengalaman</h6>
        <div class="ps-3 position-relative border-start border-2" :style="{ borderColor: activeColor }">
          <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-3 position-relative">
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
      <div v-if="targetCv.education && targetCv.education.length" class="mb-3">
        <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Linimasa Pendidikan</h6>
        <div class="ps-3 position-relative border-start border-2" :style="{ borderColor: activeColor }">
          <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-2 position-relative">
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
      <div v-if="targetCv.skills && targetCv.skills.length" class="mb-3">
        <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Keahlian & Kompetensi</h6>
        <div class="d-flex flex-wrap gap-1.5">
          <span v-for="(skill, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border px-2.5 py-1 small">{{ skill }}</span>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- 5. LAYOUT: DUAL BALANCED 50/50 COLUMN      -->
    <!-- ========================================== -->
    <div v-else-if="resolvedLayout === 'dual_balanced'" class="layout-dual-balanced">
      <div class="cv-header text-center border-bottom pb-3 mb-3">
        <h1 class="fw-extrabold mb-1" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
        <h5 class="fw-bold text-secondary mb-2">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
        <div class="d-flex justify-content-center flex-wrap gap-3 small text-muted">
          <span v-if="targetCv.email">{{ targetCv.email }}</span>
          <span v-if="targetCv.phone">| {{ targetCv.phone }}</span>
          <span v-if="targetCv.address">| {{ targetCv.address }}</span>
          <span v-if="targetCv.linkedin">| {{ targetCv.linkedin }}</span>
        </div>
      </div>

      <div v-if="targetCv.summary" class="mb-3">
        <p class="small text-dark mb-0 text-center lh-base fst-italic">{{ targetCv.summary }}</p>
      </div>

      <div class="row g-3">
        <!-- Col 1: Experience -->
        <div class="col-6">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pengalaman Kerja</h6>
          <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-2">
            <strong class="text-dark small d-block">{{ exp.position }}</strong>
            <div class="small fw-semibold text-secondary">{{ exp.company }} ({{ exp.period }})</div>
            <p class="small text-dark mb-0 white-space-pre-line">{{ exp.description }}</p>
          </div>
        </div>

        <!-- Col 2: Education, Skills, Langs -->
        <div class="col-6">
          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="{ color: activeColor, borderColor: activeColor }">Pendidikan</h6>
          <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-2">
            <strong class="text-dark small d-block">{{ edu.degree }}</strong>
            <div class="small text-muted">{{ edu.institution }} ({{ edu.period }})</div>
          </div>

          <h6 class="fw-bold text-uppercase pb-1 mb-2 border-bottom mt-3" :style="{ color: activeColor, borderColor: activeColor }">Keahlian & Bahasa</h6>
          <div class="d-flex flex-wrap gap-1 mb-2">
            <span v-for="(s, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border px-2 py-0.5 small">{{ s }}</span>
          </div>
          <div v-if="targetCv.languages && targetCv.languages.length" class="small text-muted">
            <strong>Bahasa:</strong> {{ (targetCv.languages || []).join(', ') }}
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- 6. DEFAULT ATS SINGLE COLUMN (Layout 1, etc.)-->
    <!-- ========================================== -->
    <div v-else class="layout-single-column">
      <div class="cv-header border-bottom pb-3 mb-3 text-start">
        <h1 class="fw-extrabold mb-1 tracking-tight" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
        <h5 class="fw-bold text-secondary mb-2">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
        <div class="d-flex flex-wrap gap-2.5 small text-muted">
          <span v-if="targetCv.email"><i class="bi bi-envelope me-1"></i>{{ targetCv.email }}</span>
          <span v-if="targetCv.phone"><i class="bi bi-telephone me-1"></i>{{ targetCv.phone }}</span>
          <span v-if="targetCv.address"><i class="bi bi-geo-alt me-1"></i>{{ targetCv.address }}</span>
          <span v-if="targetCv.linkedin"><i class="bi bi-linkedin me-1"></i>{{ targetCv.linkedin }}</span>
          <span v-if="targetCv.github"><i class="bi bi-github me-1"></i>{{ targetCv.github }}</span>
        </div>
      </div>

      <!-- Ringkasan Profil -->
      <div v-if="targetCv.summary" class="cv-section mb-3">
        <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Ringkasan Profil</h6>
        <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
      </div>

      <!-- Pengalaman Kerja -->
      <div v-if="targetCv.experience && targetCv.experience.length" class="cv-section mb-3">
        <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Pengalaman Kerja</h6>
        <div v-for="(exp, idx) in targetCv.experience" :key="idx" class="mb-2.5">
          <div class="d-flex justify-content-between align-items-baseline">
            <strong class="text-dark">{{ exp.position }} — <span class="fw-semibold text-secondary">{{ exp.company }}</span></strong>
            <span class="small text-muted fw-bold">{{ exp.period }}</span>
          </div>
          <div class="small text-muted mb-1">{{ exp.location }}</div>
          <p class="small text-dark mb-1 white-space-pre-line">{{ exp.description }}</p>
        </div>
      </div>

      <!-- Pendidikan -->
      <div v-if="targetCv.education && targetCv.education.length" class="cv-section mb-3">
        <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Pendidikan</h6>
        <div v-for="(edu, idx) in targetCv.education" :key="idx" class="mb-2">
          <div class="d-flex justify-content-between align-items-baseline">
            <strong class="text-dark">{{ edu.degree }} — {{ edu.institution }}</strong>
            <span class="small text-muted fw-bold">{{ edu.period }}</span>
          </div>
          <div v-if="edu.gpa" class="small text-muted">IPK / GPA: {{ edu.gpa }}</div>
        </div>
      </div>

      <!-- Keahlian -->
      <div v-if="targetCv.skills && targetCv.skills.length" class="cv-section mb-3">
        <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Keahlian Utama</h6>
        <div class="d-flex flex-wrap gap-1.5">
          <span v-for="(skill, idx) in targetCv.skills" :key="idx" class="badge bg-light text-dark border px-2.5 py-1 small">
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Bahasa & Sertifikasi -->
      <div class="row g-3">
        <div v-if="targetCv.languages && targetCv.languages.length" class="col-6">
          <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Bahasa</h6>
          <ul class="list-unstyled small mb-0">
            <li v-for="(lang, idx) in targetCv.languages" :key="idx">• {{ lang }}</li>
          </ul>
        </div>
        <div v-if="targetCv.certifications && targetCv.certifications.length" class="col-6">
          <h6 class="fw-bold text-uppercase border-bottom pb-1 mb-2" :style="{ color: activeColor, borderColor: activeColor }">Sertifikasi</h6>
          <ul class="list-unstyled small mb-0">
            <li v-for="(cert, idx) in targetCv.certifications" :key="idx">• {{ cert }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'CvLayoutRenderer',
  props: {
    cv: {
      type: Object,
      required: true
    },
    layoutType: {
      type: String,
      default: 'single_column'
    },
    activeColor: {
      type: String,
      default: '#1e293b'
    },
    cvFont: {
      type: String,
      default: 'font-sans'
    }
  },
  setup(props) {
    const targetCv = computed(() => props.cv || {});

    const resolvedLayout = computed(() => {
      const t = props.layoutType || props.cv.selectedTemplate || 'single_column';
      if (t.includes('sidebar_left')) return 'sidebar_left';
      if (t.includes('sidebar_right')) return 'sidebar_right';
      if (t.includes('creative_banner')) return 'creative_banner';
      if (t.includes('timeline')) return 'timeline_flow';
      if (t.includes('dual') || t.includes('balanced')) return 'dual_balanced';
      return 'single_column';
    });

    return {
      targetCv,
      resolvedLayout
    };
  }
};
</script>

<style scoped>
.cv-paper {
  width: 100%;
  max-width: 794px; /* Standard A4 width in px at 96DPI */
  min-height: 1050px;
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

.white-space-pre-line {
  white-space: pre-line;
}

@media print {
  .cv-paper {
    width: 100% !important;
    max-width: 100% !important;
    min-height: auto !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
