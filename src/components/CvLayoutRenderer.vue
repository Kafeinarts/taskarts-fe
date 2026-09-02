<template>
  <div
    ref="cvPaperEl"
    class="cv-paper bg-white text-dark mx-auto position-relative"
    :class="[
      resolvedLayoutClass,
      computedFontClass,
      `density-${densityMode}`,
      `heading-style-${headingStyle}`,
      { 'a4-lock-single-page': lockSinglePage, 'show-page-marker': showPageGuide }
    ]"
    :style="paperCustomStyles"
  >
    <!-- Visual A4 Cutoff Marker (Only in preview screen, hidden in print) -->
    <div v-if="showPageGuide" class="a4-cutoff-marker no-print" title="Batas Akhir 1 Halaman A4 (297mm)">
      <span class="badge bg-danger text-white"><i class="bi bi-scissors me-1"></i> Batas 1 Halaman A4</span>
    </div>

    <!-- =================================================================== -->
    <!-- RENDER MODE 1: CUSTOM LAYOUT BUILDER / DYNAMIC SECTIONS             -->
    <!-- (Used when layout is set to 'custom' or configured with customOrder)-->
    <!-- =================================================================== -->
    <div v-if="isCustomLayout" class="custom-layout-container h-100">
      <!-- Custom Header Style -->
      <div
        class="cv-custom-header mb-2.5 pb-2"
        :class="[
          `header-align-${customConfig.headerAlign || 'left'}`,
          customConfig.headerBanner ? 'custom-header-banner p-3 rounded-3 text-white' : 'border-bottom'
        ]"
        :style="customHeaderStyles"
      >
        <div class="d-flex flex-wrap align-items-center gap-3" :class="headerFlexJustify">
          <!-- Avatar (if positioned left/top) -->
          <div v-if="shouldShowAvatar && (customConfig.avatarPos === 'left' || customConfig.avatarPos === 'center' || !customConfig.avatarPos)" class="avatar-box">
            <img
              :src="targetCv.avatar"
              :class="avatarShapeClass"
              :style="avatarStyles"
              alt="Foto Profil"
            />
          </div>

          <!-- Name & Title -->
          <div class="header-text-block flex-grow-1" :class="headerTextAlignClass">
            <h1 class="cv-name fw-extrabold mb-0.5 tracking-tight" :style="{ color: customConfig.headerBanner ? '#ffffff' : activeColor }">
              {{ targetCv.fullName || 'NAMA LENGKAP' }}
            </h1>
            <h5 class="cv-title fw-bold mb-1.5 opacity-85" :style="{ color: customConfig.headerBanner ? 'rgba(255,255,255,0.9)' : '#475569' }">
              {{ targetCv.jobTitle || 'Judul Profesi / Spesialisasi' }}
            </h5>

            <!-- Contact Info Line -->
            <div class="d-flex flex-wrap gap-2.5 cv-contact-line small" :class="contactFlexJustify" :style="{ color: customConfig.headerBanner ? 'rgba(255,255,255,0.85)' : '#64748b' }">
              <span v-if="targetCv.email" class="contact-item"><i class="bi bi-envelope me-1"></i>{{ targetCv.email }}</span>
              <span v-if="targetCv.phone" class="contact-item"><i class="bi bi-telephone me-1"></i>{{ targetCv.phone }}</span>
              <span v-if="targetCv.address" class="contact-item"><i class="bi bi-geo-alt me-1"></i>{{ targetCv.address }}</span>
              <span v-if="targetCv.linkedin" class="contact-item"><i class="bi bi-linkedin me-1"></i>{{ targetCv.linkedin }}</span>
              <span v-if="targetCv.github" class="contact-item"><i class="bi bi-github me-1"></i>{{ targetCv.github }}</span>
              <span v-if="targetCv.website" class="contact-item"><i class="bi bi-globe me-1"></i>{{ targetCv.website }}</span>
            </div>
          </div>

          <!-- Avatar (if positioned right) -->
          <div v-if="shouldShowAvatar && customConfig.avatarPos === 'right'" class="avatar-box ms-auto">
            <img
              :src="targetCv.avatar"
              :class="avatarShapeClass"
              :style="avatarStyles"
              alt="Foto Profil"
            />
          </div>
        </div>
      </div>

      <!-- Single Column Custom Layout -->
      <div v-if="customConfig.columnMode === 'single'" class="custom-single-column-body">
        <div v-for="secKey in visibleMainSections" :key="secKey" class="cv-section mb-2.5">
          <component
            :is="getSectionComponent(secKey)"
            :cv="targetCv"
            :active-color="activeColor"
            :heading-style="headingStyle"
            :section-title="getSectionCustomTitle(secKey)"
            :show-avatar="shouldShowAvatar"
            :avatar-shape-class="avatarShapeClass"
            :avatar-styles="avatarStyles"
          />
        </div>
      </div>

      <!-- Two Column Custom Layout (Sidebar + Main) -->
      <div v-else class="custom-two-column-body row g-3">
        <!-- Sidebar Column (Left) -->
        <div v-if="customConfig.sidebarPosition === 'left'" :class="sidebarColClass" class="custom-sidebar-col pe-2" :style="customSidebarStyles">
          <!-- Sidebar Avatar if chosen -->
          <div v-if="shouldShowAvatar && customConfig.avatarPos === 'sidebar'" class="text-center mb-3">
            <img :src="targetCv.avatar" :class="avatarShapeClass" :style="avatarStyles" alt="Foto Profil" />
          </div>

          <div v-for="secKey in visibleSidebarSections" :key="secKey" class="cv-section mb-2.5">
            <component
              :is="getSectionComponent(secKey)"
              :cv="targetCv"
              :active-color="activeColor"
              :heading-style="headingStyle"
              :section-title="getSectionCustomTitle(secKey)"
              :is-sidebar="true"
            />
          </div>
        </div>

        <!-- Main Content Column -->
        <div :class="mainColClass" class="custom-main-col ps-2">
          <div v-for="secKey in visibleMainSections" :key="secKey" class="cv-section mb-2.5">
            <component
              :is="getSectionComponent(secKey)"
              :cv="targetCv"
              :active-color="activeColor"
              :heading-style="headingStyle"
              :section-title="getSectionCustomTitle(secKey)"
            />
          </div>
        </div>

        <!-- Sidebar Column (Right) -->
        <div v-if="customConfig.sidebarPosition === 'right'" :class="sidebarColClass" class="custom-sidebar-col ps-2" :style="customSidebarStyles">
          <div v-if="shouldShowAvatar && customConfig.avatarPos === 'sidebar'" class="text-center mb-3">
            <img :src="targetCv.avatar" :class="avatarShapeClass" :style="avatarStyles" alt="Foto Profil" />
          </div>

          <div v-for="secKey in visibleSidebarSections" :key="secKey" class="cv-section mb-2.5">
            <component
              :is="getSectionComponent(secKey)"
              :cv="targetCv"
              :active-color="activeColor"
              :heading-style="headingStyle"
              :section-title="getSectionCustomTitle(secKey)"
              :is-sidebar="true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- RENDER MODE 2: PRESET TEMPLATES (1 - 20)                             -->
    <!-- =================================================================== -->

    <!-- TEMPLATE 1: SPLIT SIDEBAR LEFT (Classic 30:70 / 32:68) -->
    <div v-else-if="resolvedPresetType === 'sidebar_left'" class="layout-sidebar-left row g-3">
      <!-- Left Sidebar -->
      <div class="col-4 border-end pe-3" style="border-color: #e2e8f0;">
        <div v-if="shouldShowAvatar" class="text-center mb-3">
          <img :src="targetCv.avatar" :class="avatarShapeClass" :style="avatarStyles" alt="Foto Profil" />
        </div>
        <!-- Contact info -->
        <div class="mb-2.5">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Kontak</h6>
          <div class="d-flex flex-column gap-1 small text-muted">
            <span v-if="targetCv.email" class="text-break"><i class="bi bi-envelope me-1.5 text-dark"></i>{{ targetCv.email }}</span>
            <span v-if="targetCv.phone"><i class="bi bi-telephone me-1.5 text-dark"></i>{{ targetCv.phone }}</span>
            <span v-if="targetCv.address"><i class="bi bi-geo-alt me-1.5 text-dark"></i>{{ targetCv.address }}</span>
            <span v-if="targetCv.linkedin" class="text-break"><i class="bi bi-linkedin me-1.5 text-dark"></i>{{ targetCv.linkedin }}</span>
            <span v-if="targetCv.github" class="text-break"><i class="bi bi-github me-1.5 text-dark"></i>{{ targetCv.github }}</span>
            <span v-if="targetCv.website" class="text-break"><i class="bi bi-globe me-1.5 text-dark"></i>{{ targetCv.website }}</span>
          </div>
        </div>

        <!-- Skills -->
        <div v-if="targetCv.skills && targetCv.skills.length" class="mb-2.5">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Keahlian</h6>
          <div class="d-flex flex-wrap gap-1">
            <span v-for="(skill, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border px-2 py-1 small">
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Languages -->
        <div v-if="targetCv.languages && targetCv.languages.length" class="mb-2.5">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Bahasa</h6>
          <ul class="list-unstyled small mb-0">
            <li v-for="(lang, i) in targetCv.languages" :key="i" class="mb-1">• {{ lang }}</li>
          </ul>
        </div>

        <!-- Certifications -->
        <div v-if="targetCv.certifications && targetCv.certifications.length" class="mb-2.5">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Sertifikasi</h6>
          <ul class="list-unstyled small mb-0">
            <li v-for="(cert, i) in targetCv.certifications" :key="i" class="mb-1 small">• {{ cert }}</li>
          </ul>
        </div>
      </div>

      <!-- Right Body -->
      <div class="col-8 ps-2">
        <div class="mb-2.5">
          <h1 class="cv-name fw-extrabold mb-0.5 tracking-tight" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
          <h5 class="cv-title fw-bold text-secondary mb-2">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
        </div>

        <div v-if="targetCv.summary" class="mb-2.5">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Profil Profesional</h6>
          <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
        </div>

        <div v-if="targetCv.experience && targetCv.experience.length" class="mb-2.5">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pengalaman Kerja</h6>
          <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-2">
            <div class="d-flex justify-content-between align-items-baseline">
              <strong class="text-dark">{{ exp.position }}</strong>
              <span class="small text-muted fw-bold">{{ exp.period }}</span>
            </div>
            <div class="small fw-semibold text-secondary mb-0.5">{{ exp.company }} <span v-if="exp.location">— {{ exp.location }}</span></div>
            <p class="small text-dark mb-0 white-space-pre-line">{{ exp.description }}</p>
          </div>
        </div>

        <div v-if="targetCv.education && targetCv.education.length" class="mb-2.5">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pendidikan</h6>
          <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-1.5">
            <div class="d-flex justify-content-between align-items-baseline">
              <strong class="text-dark">{{ edu.degree }}</strong>
              <span class="small text-muted fw-bold">{{ edu.period }}</span>
            </div>
            <div class="small text-muted">{{ edu.institution }} <span v-if="edu.gpa">(IPK: {{ edu.gpa }})</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- TEMPLATE 2: SPLIT SIDEBAR RIGHT (68:32) -->
    <div v-else-if="resolvedPresetType === 'sidebar_right'" class="layout-sidebar-right row g-3">
      <!-- Left Body -->
      <div class="col-8 border-end pe-3" style="border-color: #e2e8f0;">
        <div class="mb-2.5">
          <h1 class="cv-name fw-extrabold mb-0.5 tracking-tight" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
          <h5 class="cv-title fw-bold text-secondary mb-2">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
        </div>

        <div v-if="targetCv.summary" class="mb-2.5">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Ringkasan Profil</h6>
          <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
        </div>

        <div v-if="targetCv.experience && targetCv.experience.length" class="mb-2.5">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pengalaman Kerja</h6>
          <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-2">
            <div class="d-flex justify-content-between align-items-baseline">
              <strong class="text-dark">{{ exp.position }}</strong>
              <span class="small text-muted fw-bold">{{ exp.period }}</span>
            </div>
            <div class="small fw-semibold text-secondary mb-0.5">{{ exp.company }} <span v-if="exp.location">— {{ exp.location }}</span></div>
            <p class="small text-dark mb-0 white-space-pre-line">{{ exp.description }}</p>
          </div>
        </div>

        <div v-if="targetCv.education && targetCv.education.length" class="mb-2.5">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pendidikan</h6>
          <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-1.5">
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
        <div v-if="shouldShowAvatar" class="text-center mb-3">
          <img :src="targetCv.avatar" :class="avatarShapeClass" :style="avatarStyles" alt="Foto Profil" />
        </div>
        <div class="mb-2.5">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Kontak</h6>
          <div class="d-flex flex-column gap-1 small text-muted">
            <span v-if="targetCv.email" class="text-break"><i class="bi bi-envelope me-1.5 text-dark"></i>{{ targetCv.email }}</span>
            <span v-if="targetCv.phone"><i class="bi bi-telephone me-1.5 text-dark"></i>{{ targetCv.phone }}</span>
            <span v-if="targetCv.address"><i class="bi bi-geo-alt me-1.5 text-dark"></i>{{ targetCv.address }}</span>
            <span v-if="targetCv.linkedin" class="text-break"><i class="bi bi-linkedin me-1.5 text-dark"></i>{{ targetCv.linkedin }}</span>
            <span v-if="targetCv.github" class="text-break"><i class="bi bi-github me-1.5 text-dark"></i>{{ targetCv.github }}</span>
          </div>
        </div>

        <div v-if="targetCv.skills && targetCv.skills.length" class="mb-2.5">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Keahlian</h6>
          <div class="d-flex flex-wrap gap-1">
            <span v-for="(skill, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border px-2 py-1 small">
              {{ skill }}
            </span>
          </div>
        </div>

        <div v-if="targetCv.languages && targetCv.languages.length" class="mb-2.5">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Bahasa</h6>
          <ul class="list-unstyled small mb-0">
            <li v-for="(lang, i) in targetCv.languages" :key="i" class="mb-1">• {{ lang }}</li>
          </ul>
        </div>

        <div v-if="targetCv.certifications && targetCv.certifications.length" class="mb-2.5">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Sertifikasi</h6>
          <ul class="list-unstyled small mb-0">
            <li v-for="(cert, i) in targetCv.certifications" :key="i" class="mb-1 small">• {{ cert }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- TEMPLATE 3: CREATIVE ACCENT BANNER -->
    <div v-else-if="resolvedPresetType === 'creative_banner'" class="layout-creative-banner">
      <div class="p-3.5 text-white rounded-3 mb-2.5" :style="{ backgroundColor: activeColor }">
        <div class="d-flex justify-content-between align-items-center gap-3">
          <div>
            <h1 class="cv-name fw-extrabold mb-0.5 text-white tracking-tight">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
            <h5 class="cv-title fw-medium text-white-50 mb-1.5">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
            <div class="d-flex flex-wrap gap-2.5 small text-white-50">
              <span v-if="targetCv.email"><i class="bi bi-envelope me-1"></i>{{ targetCv.email }}</span>
              <span v-if="targetCv.phone"><i class="bi bi-telephone me-1"></i>{{ targetCv.phone }}</span>
              <span v-if="targetCv.address"><i class="bi bi-geo-alt me-1"></i>{{ targetCv.address }}</span>
              <span v-if="targetCv.linkedin"><i class="bi bi-linkedin me-1"></i>{{ targetCv.linkedin }}</span>
            </div>
          </div>
          <div v-if="shouldShowAvatar">
            <img :src="targetCv.avatar" :class="avatarShapeClass" :style="avatarStyles" class="border border-white border-2 shadow-sm" alt="Foto Profil" />
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div v-if="targetCv.summary" class="mb-2.5">
        <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Ringkasan Profil</h6>
        <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
      </div>

      <!-- Dual Column Body -->
      <div class="row g-3">
        <!-- Left: Experience -->
        <div class="col-7">
          <div v-if="targetCv.experience && targetCv.experience.length" class="mb-2.5">
            <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pengalaman Kerja</h6>
            <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-2">
              <div class="d-flex justify-content-between align-items-baseline">
                <strong class="text-dark small">{{ exp.position }}</strong>
                <span class="small text-muted fw-bold" style="font-size: 10px;">{{ exp.period }}</span>
              </div>
              <div class="small text-muted mb-0.5">{{ exp.company }}</div>
              <p class="small text-dark mb-0 white-space-pre-line">{{ exp.description }}</p>
            </div>
          </div>
        </div>

        <!-- Right: Edu & Skills -->
        <div class="col-5">
          <div v-if="targetCv.education && targetCv.education.length" class="mb-2.5">
            <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pendidikan</h6>
            <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-1.5">
              <strong class="text-dark d-block small">{{ edu.degree }}</strong>
              <div class="small text-muted">{{ edu.institution }} ({{ edu.period }})</div>
            </div>
          </div>

          <div v-if="targetCv.skills && targetCv.skills.length" class="mb-2.5">
            <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Keahlian</h6>
            <div class="d-flex flex-wrap gap-1">
              <span v-for="(s, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border px-2 py-0.5 small">{{ s }}</span>
            </div>
          </div>

          <div v-if="targetCv.certifications && targetCv.certifications.length" class="mb-2">
            <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Sertifikasi</h6>
            <ul class="list-unstyled small mb-0">
              <li v-for="(c, i) in targetCv.certifications" :key="i" class="small">• {{ c }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- TEMPLATE 4: TIMELINE FLOW -->
    <div v-else-if="resolvedPresetType === 'timeline_flow'" class="layout-timeline">
      <div class="cv-header border-bottom pb-2.5 mb-2.5 d-flex justify-content-between align-items-center">
        <div>
          <h1 class="cv-name fw-extrabold mb-0.5" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
          <h5 class="cv-title fw-bold text-secondary mb-1.5">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
          <div class="d-flex flex-wrap gap-2.5 small text-muted">
            <span v-if="targetCv.email"><i class="bi bi-envelope me-1"></i>{{ targetCv.email }}</span>
            <span v-if="targetCv.phone"><i class="bi bi-telephone me-1"></i>{{ targetCv.phone }}</span>
            <span v-if="targetCv.address"><i class="bi bi-geo-alt me-1"></i>{{ targetCv.address }}</span>
            <span v-if="targetCv.linkedin"><i class="bi bi-linkedin me-1"></i>{{ targetCv.linkedin }}</span>
          </div>
        </div>
        <div v-if="shouldShowAvatar">
          <img :src="targetCv.avatar" :class="avatarShapeClass" :style="avatarStyles" alt="Foto Profil" />
        </div>
      </div>

      <div v-if="targetCv.summary" class="mb-2.5">
        <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Profil Profesional</h6>
        <p class="small text-dark mb-0">{{ targetCv.summary }}</p>
      </div>

      <!-- Timeline Experience -->
      <div v-if="targetCv.experience && targetCv.experience.length" class="mb-2.5">
        <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Linimasa Pengalaman</h6>
        <div class="ps-3 position-relative border-start border-2" :style="{ borderColor: activeColor }">
          <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-2 position-relative">
            <span class="position-absolute rounded-circle bg-white border border-2" :style="{ borderColor: activeColor, width: '10px', height: '10px', left: '-21px', top: '5px' }"></span>
            <div class="d-flex justify-content-between align-items-baseline">
              <strong class="text-dark">{{ exp.position }} @ {{ exp.company }}</strong>
              <span class="badge bg-light text-dark border small">{{ exp.period }}</span>
            </div>
            <div class="small text-muted mb-0.5">{{ exp.location }}</div>
            <p class="small text-dark mb-0 white-space-pre-line">{{ exp.description }}</p>
          </div>
        </div>
      </div>

      <!-- Timeline Education -->
      <div v-if="targetCv.education && targetCv.education.length" class="mb-2.5">
        <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Linimasa Pendidikan</h6>
        <div class="ps-3 position-relative border-start border-2" :style="{ borderColor: activeColor }">
          <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-1.5 position-relative">
            <span class="position-absolute rounded-circle bg-white border border-2" :style="{ borderColor: activeColor, width: '10px', height: '10px', left: '-21px', top: '5px' }"></span>
            <div class="d-flex justify-content-between align-items-baseline">
              <strong class="text-dark">{{ edu.degree }}</strong>
              <span class="badge bg-light text-dark border small">{{ edu.period }}</span>
            </div>
            <div class="small text-muted">{{ edu.institution }} <span v-if="edu.gpa">| IPK: {{ edu.gpa }}</span></div>
          </div>
        </div>
      </div>

      <!-- Skills & Badges -->
      <div v-if="targetCv.skills && targetCv.skills.length" class="mb-2">
        <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Keahlian & Kompetensi</h6>
        <div class="d-flex flex-wrap gap-1.5">
          <span v-for="(skill, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border px-2.5 py-1 small">{{ skill }}</span>
        </div>
      </div>
    </div>

    <!-- TEMPLATE 5: DUAL BALANCED 50/50 COLUMN -->
    <div v-else-if="resolvedPresetType === 'dual_balanced'" class="layout-dual-balanced">
      <div class="cv-header text-center border-bottom pb-2.5 mb-2.5 position-relative">
        <div v-if="shouldShowAvatar" class="mb-2">
          <img :src="targetCv.avatar" :class="avatarShapeClass" :style="avatarStyles" alt="Foto Profil" />
        </div>
        <h1 class="cv-name fw-extrabold mb-0.5" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
        <h5 class="cv-title fw-bold text-secondary mb-1.5">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
        <div class="d-flex justify-content-center flex-wrap gap-2.5 small text-muted">
          <span v-if="targetCv.email">{{ targetCv.email }}</span>
          <span v-if="targetCv.phone">| {{ targetCv.phone }}</span>
          <span v-if="targetCv.address">| {{ targetCv.address }}</span>
          <span v-if="targetCv.linkedin">| {{ targetCv.linkedin }}</span>
        </div>
      </div>

      <div v-if="targetCv.summary" class="mb-2.5">
        <p class="small text-dark mb-0 text-center lh-base fst-italic">{{ targetCv.summary }}</p>
      </div>

      <div class="row g-3">
        <!-- Col 1: Experience -->
        <div class="col-6">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pengalaman Kerja</h6>
          <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-2">
            <strong class="text-dark small d-block">{{ exp.position }}</strong>
            <div class="small fw-semibold text-secondary">{{ exp.company }} ({{ exp.period }})</div>
            <p class="small text-dark mb-0 white-space-pre-line">{{ exp.description }}</p>
          </div>
        </div>

        <!-- Col 2: Education, Skills, Langs -->
        <div class="col-6">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pendidikan</h6>
          <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-1.5">
            <strong class="text-dark small d-block">{{ edu.degree }}</strong>
            <div class="small text-muted">{{ edu.institution }} ({{ edu.period }})</div>
          </div>

          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom mt-2.5" :style="headingColorStyles">Keahlian & Bahasa</h6>
          <div class="d-flex flex-wrap gap-1 mb-2">
            <span v-for="(s, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border px-2 py-0.5 small">{{ s }}</span>
          </div>
          <div v-if="targetCv.languages && targetCv.languages.length" class="small text-muted">
            <strong>Bahasa:</strong> {{ (targetCv.languages || []).join(', ') }}
          </div>
        </div>
      </div>
    </div>

    <!-- TEMPLATE 6: DEFAULT / SINGLE COLUMN ATS STANDARD (Classic, Nordic, Harvard, Tech, etc.) -->
    <div v-else class="layout-single-column">
      <div class="cv-header border-bottom pb-2.5 mb-2.5 d-flex justify-content-between align-items-center gap-3">
        <div class="flex-grow-1">
          <h1 class="cv-name fw-extrabold mb-0.5 tracking-tight" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
          <h5 class="cv-title fw-bold text-secondary mb-1.5">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
          <div class="d-flex flex-wrap gap-2.5 small text-muted">
            <span v-if="targetCv.email"><i class="bi bi-envelope me-1"></i>{{ targetCv.email }}</span>
            <span v-if="targetCv.phone"><i class="bi bi-telephone me-1"></i>{{ targetCv.phone }}</span>
            <span v-if="targetCv.address"><i class="bi bi-geo-alt me-1"></i>{{ targetCv.address }}</span>
            <span v-if="targetCv.linkedin"><i class="bi bi-linkedin me-1"></i>{{ targetCv.linkedin }}</span>
            <span v-if="targetCv.github"><i class="bi bi-github me-1"></i>{{ targetCv.github }}</span>
            <span v-if="targetCv.website"><i class="bi bi-globe me-1"></i>{{ targetCv.website }}</span>
          </div>
        </div>
        <div v-if="shouldShowAvatar">
          <img :src="targetCv.avatar" :class="avatarShapeClass" :style="avatarStyles" alt="Foto Profil" />
        </div>
      </div>

      <!-- Ringkasan Profil -->
      <div v-if="targetCv.summary" class="cv-section mb-2.5">
        <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Ringkasan Profil</h6>
        <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
      </div>

      <!-- Pengalaman Kerja -->
      <div v-if="targetCv.experience && targetCv.experience.length" class="cv-section mb-2.5">
        <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Pengalaman Kerja</h6>
        <div v-for="(exp, idx) in targetCv.experience" :key="idx" class="mb-2">
          <div class="d-flex justify-content-between align-items-baseline">
            <strong class="text-dark">{{ exp.position }} — <span class="fw-semibold text-secondary">{{ exp.company }}</span></strong>
            <span class="small text-muted fw-bold">{{ exp.period }}</span>
          </div>
          <div v-if="exp.location" class="small text-muted mb-0.5">{{ exp.location }}</div>
          <p class="small text-dark mb-0.5 white-space-pre-line">{{ exp.description }}</p>
        </div>
      </div>

      <!-- Pendidikan -->
      <div v-if="targetCv.education && targetCv.education.length" class="cv-section mb-2.5">
        <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Pendidikan</h6>
        <div v-for="(edu, idx) in targetCv.education" :key="idx" class="mb-1.5">
          <div class="d-flex justify-content-between align-items-baseline">
            <strong class="text-dark">{{ edu.degree }} — {{ edu.institution }}</strong>
            <span class="small text-muted fw-bold">{{ edu.period }}</span>
          </div>
          <div v-if="edu.gpa" class="small text-muted">IPK / GPA: {{ edu.gpa }}</div>
        </div>
      </div>

      <!-- Keahlian -->
      <div v-if="targetCv.skills && targetCv.skills.length" class="cv-section mb-2.5">
        <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Keahlian Utama</h6>
        <div class="d-flex flex-wrap gap-1.5">
          <span v-for="(skill, idx) in targetCv.skills" :key="idx" class="badge bg-light text-dark border px-2.5 py-1 small">
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Bahasa & Sertifikasi -->
      <div class="row g-3">
        <div v-if="targetCv.languages && targetCv.languages.length" class="col-6">
          <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Bahasa</h6>
          <ul class="list-unstyled small mb-0">
            <li v-for="(lang, idx) in targetCv.languages" :key="idx">• {{ lang }}</li>
          </ul>
        </div>
        <div v-if="targetCv.certifications && targetCv.certifications.length" class="col-6">
          <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Sertifikasi</h6>
          <ul class="list-unstyled small mb-0">
            <li v-for="(cert, idx) in targetCv.certifications" :key="idx">• {{ cert }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, h } from 'vue';

// Modular section sub-components for dynamic custom layout builder
const CvSummarySection = {
  props: ['cv', 'activeColor', 'headingStyle', 'sectionTitle'],
  render() {
    if (!this.cv.summary) return null;
    return h('div', { class: 'cv-sub-section' }, [
      h('h6', {
        class: 'section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom',
        style: { color: this.activeColor, borderColor: this.activeColor }
      }, this.sectionTitle || 'Ringkasan Profil'),
      h('p', { class: 'small text-dark mb-0 lh-base', style: { textAlign: 'justify' } }, this.cv.summary)
    ]);
  }
};

const CvExperienceSection = {
  props: ['cv', 'activeColor', 'headingStyle', 'sectionTitle', 'isSidebar'],
  render() {
    if (!this.cv.experience || !this.cv.experience.length) return null;
    return h('div', { class: 'cv-sub-section' }, [
      h('h6', {
        class: 'section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom',
        style: { color: this.activeColor, borderColor: this.activeColor }
      }, this.sectionTitle || 'Pengalaman Kerja'),
      this.cv.experience.map((exp) =>
        h('div', { class: 'mb-2' }, [
          h('div', { class: 'd-flex justify-content-between align-items-baseline' }, [
            h('strong', { class: 'text-dark small' }, exp.position),
            h('span', { class: 'small text-muted fw-bold' }, exp.period)
          ]),
          h('div', { class: 'small fw-semibold text-secondary mb-0.5' }, [
            exp.company,
            exp.location ? ` — ${exp.location}` : ''
          ]),
          exp.description ? h('p', { class: 'small text-dark mb-0 white-space-pre-line' }, exp.description) : null
        ])
      )
    ]);
  }
};

const CvEducationSection = {
  props: ['cv', 'activeColor', 'headingStyle', 'sectionTitle'],
  render() {
    if (!this.cv.education || !this.cv.education.length) return null;
    return h('div', { class: 'cv-sub-section' }, [
      h('h6', {
        class: 'section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom',
        style: { color: this.activeColor, borderColor: this.activeColor }
      }, this.sectionTitle || 'Riwayat Pendidikan'),
      this.cv.education.map((edu) =>
        h('div', { class: 'mb-1.5' }, [
          h('div', { class: 'd-flex justify-content-between align-items-baseline' }, [
            h('strong', { class: 'text-dark small' }, edu.degree),
            h('span', { class: 'small text-muted fw-bold' }, edu.period)
          ]),
          h('div', { class: 'small text-muted' }, [
            edu.institution,
            edu.gpa ? ` (IPK: ${edu.gpa})` : ''
          ])
        ])
      )
    ]);
  }
};

const CvSkillsSection = {
  props: ['cv', 'activeColor', 'headingStyle', 'sectionTitle', 'isSidebar'],
  render() {
    if (!this.cv.skills || !this.cv.skills.length) return null;
    return h('div', { class: 'cv-sub-section' }, [
      h('h6', {
        class: 'section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom',
        style: { color: this.activeColor, borderColor: this.activeColor }
      }, this.sectionTitle || 'Keahlian Utama'),
      h('div', { class: 'd-flex flex-wrap gap-1' },
        this.cv.skills.map(s => h('span', { class: 'badge bg-light text-dark border px-2 py-0.5 small' }, s))
      )
    ]);
  }
};

const CvLanguagesSection = {
  props: ['cv', 'activeColor', 'headingStyle', 'sectionTitle'],
  render() {
    if (!this.cv.languages || !this.cv.languages.length) return null;
    return h('div', { class: 'cv-sub-section' }, [
      h('h6', {
        class: 'section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom',
        style: { color: this.activeColor, borderColor: this.activeColor }
      }, this.sectionTitle || 'Bahasa'),
      h('ul', { class: 'list-unstyled small mb-0' },
        this.cv.languages.map(l => h('li', { class: 'mb-0.5' }, `• ${l}`))
      )
    ]);
  }
};

const CvCertificationsSection = {
  props: ['cv', 'activeColor', 'headingStyle', 'sectionTitle'],
  render() {
    if (!this.cv.certifications || !this.cv.certifications.length) return null;
    return h('div', { class: 'cv-sub-section' }, [
      h('h6', {
        class: 'section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom',
        style: { color: this.activeColor, borderColor: this.activeColor }
      }, this.sectionTitle || 'Sertifikasi & Lisensi'),
      h('ul', { class: 'list-unstyled small mb-0' },
        this.cv.certifications.map(c => h('li', { class: 'mb-0.5 small' }, `• ${c}`))
      )
    ]);
  }
};

const CvContactSection = {
  props: ['cv', 'activeColor', 'headingStyle', 'sectionTitle'],
  render() {
    return h('div', { class: 'cv-sub-section' }, [
      h('h6', {
        class: 'section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom',
        style: { color: this.activeColor, borderColor: this.activeColor }
      }, this.sectionTitle || 'Informasi Kontak'),
      h('div', { class: 'd-flex flex-column gap-1 small text-muted' }, [
        this.cv.email ? h('span', { class: 'text-break' }, [h('i', { class: 'bi bi-envelope me-1.5 text-dark' }), this.cv.email]) : null,
        this.cv.phone ? h('span', {}, [h('i', { class: 'bi bi-telephone me-1.5 text-dark' }), this.cv.phone]) : null,
        this.cv.address ? h('span', {}, [h('i', { class: 'bi bi-geo-alt me-1.5 text-dark' }), this.cv.address]) : null,
        this.cv.linkedin ? h('span', { class: 'text-break' }, [h('i', { class: 'bi bi-linkedin me-1.5 text-dark' }), this.cv.linkedin]) : null,
        this.cv.github ? h('span', { class: 'text-break' }, [h('i', { class: 'bi bi-github me-1.5 text-dark' }), this.cv.github]) : null,
        this.cv.website ? h('span', { class: 'text-break' }, [h('i', { class: 'bi bi-globe me-1.5 text-dark' }), this.cv.website]) : null
      ].filter(Boolean))
    ]);
  }
};

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
    },
    // Enhanced customization props
    densityMode: {
      type: String,
      default: 'standard' // 'comfortable' | 'standard' | 'compact' | 'ultra_compact'
    },
    headingStyle: {
      type: String,
      default: 'underline' // 'underline' | 'boxed' | 'left_bar' | 'pill' | 'minimal'
    },
    lockSinglePage: {
      type: Boolean,
      default: true
    },
    showPageGuide: {
      type: Boolean,
      default: false
    },
    customLayoutConfig: {
      type: Object,
      default: () => null
    }
  },
  setup(props) {
    const cvPaperEl = ref(null);
    const targetCv = computed(() => props.cv || {});

    // Determine whether custom layout builder is active
    const isCustomLayout = computed(() => {
      const t = props.layoutType || targetCv.value.selectedTemplate || '';
      return t === 'custom' || !!targetCv.value.customLayoutActive;
    });

    const customConfig = computed(() => {
      const cfg = props.customLayoutConfig || targetCv.value.customLayoutConfig || {};
      return {
        columnMode: cfg.columnMode || 'single', // 'single' | 'two_column'
        sidebarPosition: cfg.sidebarPosition || 'left', // 'left' | 'right'
        sidebarRatio: cfg.sidebarRatio || '30', // '30', '35', '40', '50'
        headerAlign: cfg.headerAlign || 'left', // 'left' | 'center' | 'right'
        headerBanner: !!cfg.headerBanner,
        avatarPos: cfg.avatarPos || 'left', // 'left' | 'right' | 'center' | 'sidebar'
        sidebarBg: cfg.sidebarBg || '#f8fafc',
        mainSections: cfg.mainSections || ['summary', 'experience', 'education', 'skills', 'languages', 'certifications'],
        sidebarSections: cfg.sidebarSections || ['contact', 'skills', 'languages', 'certifications'],
        sectionTitles: cfg.sectionTitles || {},
        sectionVisibility: cfg.sectionVisibility || {}
      };
    });

    // Preset Layout Identifier Resolver
    const resolvedPresetType = computed(() => {
      const t = props.layoutType || targetCv.value.selectedTemplate || 'single_column';
      if (t.includes('sidebar_left')) return 'sidebar_left';
      if (t.includes('sidebar_right')) return 'sidebar_right';
      if (t.includes('creative_banner')) return 'creative_banner';
      if (t.includes('timeline')) return 'timeline_flow';
      if (t.includes('dual') || t.includes('balanced')) return 'dual_balanced';
      return 'single_column';
    });

    const resolvedLayoutClass = computed(() => {
      if (isCustomLayout.value) return 'layout-custom-mode';
      return `layout-${resolvedPresetType.value}`;
    });

    const computedFontClass = computed(() => {
      const f = props.cvFont || targetCv.value.cvFont || 'font-sans';
      return f;
    });

    // Photo / Avatar Configuration
    const shouldShowAvatar = computed(() => {
      const cv = targetCv.value;
      if (!cv.avatar) return false;
      if (typeof cv.showAvatar !== 'undefined') return !!cv.showAvatar;
      return true;
    });

    const avatarShapeClass = computed(() => {
      const shape = targetCv.value.avatarShape || 'circle';
      if (shape === 'rounded') return 'rounded-4';
      if (shape === 'square') return 'rounded-1';
      if (shape === 'framed') return 'rounded-3 border border-3';
      return 'rounded-circle';
    });

    const avatarStyles = computed(() => {
      const sizeKey = targetCv.value.avatarSize || 'md';
      let px = 82;
      if (sizeKey === 'sm') px = 64;
      else if (sizeKey === 'lg') px = 100;
      else if (sizeKey === 'xl') px = 118;

      return {
        width: `${px}px`,
        height: `${px}px`,
        objectFit: 'cover',
        borderColor: props.activeColor || '#1e293b'
      };
    });

    // Custom Layout Columns
    const sidebarColClass = computed(() => {
      const ratio = customConfig.value.sidebarRatio;
      if (ratio === '50') return 'col-6';
      if (ratio === '40') return 'col-5';
      if (ratio === '35') return 'col-4';
      return 'col-4';
    });

    const mainColClass = computed(() => {
      const ratio = customConfig.value.sidebarRatio;
      if (ratio === '50') return 'col-6';
      if (ratio === '40') return 'col-7';
      if (ratio === '35') return 'col-8';
      return 'col-8';
    });

    const headerFlexJustify = computed(() => {
      const a = customConfig.value.headerAlign;
      if (a === 'center') return 'justify-content-center text-center';
      if (a === 'right') return 'justify-content-end text-end';
      return 'justify-content-start text-start';
    });

    const headerTextAlignClass = computed(() => {
      const a = customConfig.value.headerAlign;
      if (a === 'center') return 'text-center';
      if (a === 'right') return 'text-end';
      return 'text-start';
    });

    const contactFlexJustify = computed(() => {
      const a = customConfig.value.headerAlign;
      if (a === 'center') return 'justify-content-center';
      if (a === 'right') return 'justify-content-end';
      return 'justify-content-start';
    });

    const customHeaderStyles = computed(() => {
      if (customConfig.value.headerBanner) {
        return {
          backgroundColor: props.activeColor || '#1e293b'
        };
      }
      return {
        borderColor: '#e2e8f0'
      };
    });

    const customSidebarStyles = computed(() => {
      return {
        backgroundColor: customConfig.value.sidebarBg || 'transparent',
        borderRadius: '8px'
      };
    });

    const headingColorStyles = computed(() => {
      return {
        color: props.activeColor,
        borderColor: props.activeColor
      };
    });

    const paperCustomStyles = computed(() => {
      return {
        '--cv-accent-color': props.activeColor || '#1e293b'
      };
    });

    // Visible Sections Filter
    const visibleMainSections = computed(() => {
      const secs = customConfig.value.mainSections || [];
      const vis = customConfig.value.sectionVisibility || {};
      return secs.filter(s => vis[s] !== false);
    });

    const visibleSidebarSections = computed(() => {
      const secs = customConfig.value.sidebarSections || [];
      const vis = customConfig.value.sectionVisibility || {};
      return secs.filter(s => vis[s] !== false);
    });

    const sectionComponentMap = {
      summary: CvSummarySection,
      experience: CvExperienceSection,
      education: CvEducationSection,
      skills: CvSkillsSection,
      languages: CvLanguagesSection,
      certifications: CvCertificationsSection,
      contact: CvContactSection
    };

    const getSectionComponent = (key) => {
      return sectionComponentMap[key] || CvSummarySection;
    };

    const getSectionCustomTitle = (key) => {
      const titles = customConfig.value.sectionTitles || {};
      return titles[key] || null;
    };

    return {
      cvPaperEl,
      targetCv,
      isCustomLayout,
      customConfig,
      resolvedPresetType,
      resolvedLayoutClass,
      computedFontClass,
      shouldShowAvatar,
      avatarShapeClass,
      avatarStyles,
      sidebarColClass,
      mainColClass,
      headerFlexJustify,
      headerTextAlignClass,
      contactFlexJustify,
      customHeaderStyles,
      customSidebarStyles,
      headingColorStyles,
      paperCustomStyles,
      visibleMainSections,
      visibleSidebarSections,
      getSectionComponent,
      getSectionCustomTitle
    };
  }
};
</script>

<style scoped>
/* Standard A4 dimensions: 210mm x 297mm */
.cv-paper {
  width: 100%;
  max-width: 794px; /* Standard A4 width in px at 96DPI */
  min-height: 1050px;
  box-sizing: border-box;
  font-size: 13px;
  line-height: 1.45;
  padding: 36px 42px;
  background-color: #ffffff;
  transition: all 0.2s ease;
  position: relative;
}

/* Single Page A4 Lock Mode */
.a4-lock-single-page {
  max-height: 1123px; /* Exact A4 height at 96 DPI */
  overflow: hidden !important;
}

/* Visual Cutoff Guide Marker */
.a4-cutoff-marker {
  position: absolute;
  top: 1120px;
  left: 0;
  right: 0;
  height: 2px;
  border-top: 2px dashed #ef4444;
  z-index: 50;
  display: flex;
  justify-content: flex-end;
  padding-right: 15px;
}

.a4-cutoff-marker span {
  transform: translateY(-50%);
  font-size: 10px;
}

/* Font Family Classes */
.font-sans {
  font-family: 'Plus Jakarta Sans', 'Inter', 'Segoe UI', system-ui, sans-serif;
}
.font-serif {
  font-family: 'Merriweather', 'Georgia', 'Times New Roman', serif;
}
.font-mono {
  font-family: 'Fira Code', 'Consolas', 'Courier New', monospace;
}
.font-modern {
  font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
}

/* Density Scales (Auto-Fit 1 Page) */
.density-comfortable {
  font-size: 13.5px;
  line-height: 1.55;
  padding: 40px 48px;
}
.density-comfortable .cv-name { font-size: 1.95rem; }
.density-comfortable .cv-title { font-size: 1.15rem; }
.density-comfortable .cv-section { margin-bottom: 1rem !important; }

.density-standard {
  font-size: 12.8px;
  line-height: 1.45;
  padding: 32px 38px;
}
.density-standard .cv-name { font-size: 1.75rem; }
.density-standard .cv-title { font-size: 1.05rem; }
.density-standard .cv-section { margin-bottom: 0.75rem !important; }

.density-compact {
  font-size: 11.8px;
  line-height: 1.35;
  padding: 24px 30px;
}
.density-compact .cv-name { font-size: 1.55rem; }
.density-compact .cv-title { font-size: 0.98rem; }
.density-compact .cv-section { margin-bottom: 0.55rem !important; }
.density-compact p { margin-bottom: 0.2rem !important; }

.density-ultra_compact {
  font-size: 11px;
  line-height: 1.25;
  padding: 18px 24px;
}
.density-ultra_compact .cv-name { font-size: 1.35rem; }
.density-ultra_compact .cv-title { font-size: 0.88rem; }
.density-ultra_compact .cv-section { margin-bottom: 0.4rem !important; }
.density-ultra_compact p { margin-bottom: 0.1rem !important; }
.density-ultra_compact .badge { padding: 2px 5px !important; font-size: 10px !important; }

/* Heading Styles */
.heading-style-underline .section-heading {
  border-bottom-width: 2px !important;
}
.heading-style-boxed .section-heading {
  border: 1px solid var(--cv-accent-color);
  background-color: rgba(30, 41, 59, 0.04);
  padding: 4px 8px !important;
  border-radius: 4px;
}
.heading-style-left_bar .section-heading {
  border-left: 4px solid var(--cv-accent-color) !important;
  border-bottom: none !important;
  padding-left: 8px !important;
}
.heading-style-pill .section-heading {
  background-color: var(--cv-accent-color);
  color: #ffffff !important;
  padding: 3px 10px !important;
  border-radius: 20px;
  border-bottom: none !important;
  display: inline-block;
  margin-bottom: 6px !important;
}
.heading-style-minimal .section-heading {
  border-bottom: none !important;
  letter-spacing: 0.08em;
  font-size: 0.95em;
}

.white-space-pre-line {
  white-space: pre-line;
}

/* Print Specific Rules for True A4 Fix */
@media print {
  @page {
    size: A4 portrait;
    margin: 8mm 10mm;
  }

  body {
    background: #ffffff !important;
    color: #000000 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .cv-paper {
    width: 100% !important;
    max-width: 100% !important;
    min-height: auto !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .a4-cutoff-marker {
    display: none !important;
  }

  .a4-lock-single-page {
    max-height: none !important;
    overflow: visible !important;
  }
}
</style>
