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
    <!-- =================================================================== -->
    <div v-if="isCustomLayout" class="custom-layout-container h-100">
      <!-- Custom Header Style -->
      <div
        class="cv-custom-header mb-3 pb-2.5"
        :class="[
          `header-align-${customConfig.headerAlign || 'left'}`,
          customConfig.headerBanner ? 'custom-header-banner p-3.5 rounded-3 text-white' : 'border-bottom'
        ]"
        :style="customHeaderStyles"
      >
        <div class="d-flex flex-wrap align-items-center gap-3.5" :class="headerFlexJustify">
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
            <h1 class="cv-name fw-extrabold mb-1 tracking-tight" :style="{ color: customConfig.headerBanner ? '#ffffff' : activeColor }">
              {{ targetCv.fullName || 'NAMA LENGKAP' }}
            </h1>
            <h5 class="cv-title fw-bold mb-2 opacity-85" :style="{ color: customConfig.headerBanner ? 'rgba(255,255,255,0.9)' : '#475569' }">
              {{ targetCv.jobTitle || 'Judul Profesi / Spesialisasi' }}
            </h5>

            <!-- Contact Info Line -->
            <div class="d-flex flex-wrap gap-3 cv-contact-line small" :class="contactFlexJustify" :style="{ color: customConfig.headerBanner ? 'rgba(255,255,255,0.85)' : '#64748b' }">
              <span v-if="targetCv.email" class="contact-item"><i class="bi bi-envelope me-1.5"></i>{{ targetCv.email }}</span>
              <span v-if="targetCv.phone" class="contact-item"><i class="bi bi-telephone me-1.5"></i>{{ targetCv.phone }}</span>
              <span v-if="targetCv.address" class="contact-item"><i class="bi bi-geo-alt me-1.5"></i>{{ targetCv.address }}</span>
              <span v-if="targetCv.linkedin" class="contact-item"><i class="bi bi-linkedin me-1.5"></i>{{ targetCv.linkedin }}</span>
              <span v-if="targetCv.github" class="contact-item"><i class="bi bi-github me-1.5"></i>{{ targetCv.github }}</span>
              <span v-if="targetCv.website" class="contact-item"><i class="bi bi-globe me-1.5"></i>{{ targetCv.website }}</span>
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
        <div v-for="secKey in visibleMainSections" :key="secKey" class="cv-section mb-3">
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
      <div v-else class="custom-two-column-body row g-3.5">
        <!-- Sidebar Column (Left) -->
        <div v-if="customConfig.sidebarPosition === 'left'" :class="sidebarColClass" class="custom-sidebar-col pe-3" :style="customSidebarStyles">
          <!-- Sidebar Avatar if chosen -->
          <div v-if="shouldShowAvatar && customConfig.avatarPos === 'sidebar'" class="text-center mb-3">
            <img :src="targetCv.avatar" :class="avatarShapeClass" :style="avatarStyles" alt="Foto Profil" />
          </div>

          <div v-for="secKey in visibleSidebarSections" :key="secKey" class="cv-section mb-3">
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
          <div v-for="secKey in visibleMainSections" :key="secKey" class="cv-section mb-3">
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
        <div v-if="customConfig.sidebarPosition === 'right'" :class="sidebarColClass" class="custom-sidebar-col ps-3" :style="customSidebarStyles">
          <div v-if="shouldShowAvatar && customConfig.avatarPos === 'sidebar'" class="text-center mb-3">
            <img :src="targetCv.avatar" :class="avatarShapeClass" :style="avatarStyles" alt="Foto Profil" />
          </div>

          <div v-for="secKey in visibleSidebarSections" :key="secKey" class="cv-section mb-3">
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
    <!-- RENDER MODE 2: PRESET TEMPLATES                                      -->
    <!-- =================================================================== -->

    <!-- TEMPLATE TYPE: TWO-TONE DARK SIDEBAR (ats_two_tone_16 / ats_dark_modern) -->
    <div v-else-if="resolvedPresetFamily === 'two_tone_dark'" class="layout-two-tone-dark row g-0 rounded-2 overflow-hidden h-100">
      <!-- Dark Sidebar (33%) -->
      <div class="col-4 p-3.5 text-white" :style="{ backgroundColor: activeColor || '#1e293b' }">
        <div v-if="shouldShowAvatar" class="text-center mb-3.5">
          <img :src="targetCv.avatar" :class="avatarShapeClass" :style="avatarStyles" class="border border-white border-2 shadow-sm" alt="Foto Profil" />
        </div>
        
        <!-- Contact Block -->
        <div class="mb-3.5">
          <h6 class="text-uppercase fw-bold pb-1 mb-2 border-bottom border-white border-opacity-25" style="color: #ffffff; letter-spacing: 0.05em; font-size: 0.82rem;">Kontak</h6>
          <div class="d-flex flex-column gap-1.5 text-white-50" style="font-size: 0.8rem;">
            <span v-if="targetCv.email" class="text-break text-white"><i class="bi bi-envelope me-1.5 text-white-50"></i>{{ targetCv.email }}</span>
            <span v-if="targetCv.phone" class="text-white"><i class="bi bi-telephone me-1.5 text-white-50"></i>{{ targetCv.phone }}</span>
            <span v-if="targetCv.address" class="text-white"><i class="bi bi-geo-alt me-1.5 text-white-50"></i>{{ targetCv.address }}</span>
            <span v-if="targetCv.linkedin" class="text-break text-white"><i class="bi bi-linkedin me-1.5 text-white-50"></i>{{ targetCv.linkedin }}</span>
            <span v-if="targetCv.github" class="text-break text-white"><i class="bi bi-github me-1.5 text-white-50"></i>{{ targetCv.github }}</span>
            <span v-if="targetCv.website" class="text-break text-white"><i class="bi bi-globe me-1.5 text-white-50"></i>{{ targetCv.website }}</span>
          </div>
        </div>

        <!-- Skills Block -->
        <div v-if="targetCv.skills && targetCv.skills.length" class="mb-3.5">
          <h6 class="text-uppercase fw-bold pb-1 mb-2 border-bottom border-white border-opacity-25" style="color: #ffffff; letter-spacing: 0.05em; font-size: 0.82rem;">Keahlian</h6>
          <div class="d-flex flex-wrap gap-1">
            <span v-for="(skill, i) in targetCv.skills" :key="i" class="badge bg-white bg-opacity-20 text-white border border-white border-opacity-25 px-2 py-1" style="font-size: 0.75rem;">
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Languages Block -->
        <div v-if="targetCv.languages && targetCv.languages.length" class="mb-3.5">
          <h6 class="text-uppercase fw-bold pb-1 mb-2 border-bottom border-white border-opacity-25" style="color: #ffffff; letter-spacing: 0.05em; font-size: 0.82rem;">Bahasa</h6>
          <ul class="list-unstyled text-white-50 mb-0" style="font-size: 0.8rem;">
            <li v-for="(lang, i) in targetCv.languages" :key="i" class="mb-1 text-white">• {{ lang }}</li>
          </ul>
        </div>

        <!-- Certifications Block -->
        <div v-if="targetCv.certifications && targetCv.certifications.length" class="mb-3">
          <h6 class="text-uppercase fw-bold pb-1 mb-2 border-bottom border-white border-opacity-25" style="color: #ffffff; letter-spacing: 0.05em; font-size: 0.82rem;">Sertifikasi</h6>
          <ul class="list-unstyled text-white-50 mb-0" style="font-size: 0.78rem;">
            <li v-for="(cert, i) in targetCv.certifications" :key="i" class="mb-1 text-white">• {{ cert }}</li>
          </ul>
        </div>
      </div>

      <!-- Main Body (67%) -->
      <div class="col-8 p-3.5 ps-4 bg-white">
        <div class="mb-3 border-bottom pb-2">
          <h1 class="cv-name fw-extrabold mb-1 tracking-tight" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
          <h5 class="cv-title fw-bold text-secondary mb-0">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
        </div>

        <!-- Summary -->
        <div v-if="targetCv.summary" class="cv-section mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Profil Profesional</h6>
          <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
        </div>

        <!-- Experience -->
        <div v-if="targetCv.experience && targetCv.experience.length" class="cv-section mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pengalaman Kerja</h6>
          <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-2.5 cv-item">
            <div class="d-flex justify-content-between align-items-baseline">
              <strong class="text-dark">{{ exp.position }}</strong>
              <span class="small text-muted fw-bold">{{ exp.period }}</span>
            </div>
            <div class="small fw-semibold text-secondary mb-1">{{ exp.company }} <span v-if="exp.location">— {{ exp.location }}</span></div>
            <p class="small text-dark mb-0 white-space-pre-line lh-base">{{ exp.description }}</p>
          </div>
        </div>

        <!-- Education -->
        <div v-if="targetCv.education && targetCv.education.length" class="cv-section mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pendidikan</h6>
          <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-1.5 cv-item">
            <div class="d-flex justify-content-between align-items-baseline">
              <strong class="text-dark">{{ edu.degree }}</strong>
              <span class="small text-muted fw-bold">{{ edu.period }}</span>
            </div>
            <div class="small text-muted">{{ edu.institution }} <span v-if="edu.gpa">(IPK: {{ edu.gpa }})</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- TEMPLATE TYPE: SPLIT SIDEBAR LEFT (ats_sidebar_left_3, ats_scandi_split, ats_teal_corporate_split, ats_startup_sleek_15) -->
    <div v-else-if="resolvedPresetFamily === 'sidebar_left'" class="layout-sidebar-left row g-3.5">
      <!-- Left Sidebar (33%) -->
      <div class="col-4 border-end pe-3" style="border-color: #e2e8f0;">
        <div v-if="shouldShowAvatar" class="text-center mb-3">
          <img :src="targetCv.avatar" :class="avatarShapeClass" :style="avatarStyles" alt="Foto Profil" />
        </div>
        <!-- Contact info -->
        <div class="mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Kontak</h6>
          <div class="d-flex flex-column gap-1.5 small text-muted">
            <span v-if="targetCv.email" class="text-break"><i class="bi bi-envelope me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.email }}</span>
            <span v-if="targetCv.phone"><i class="bi bi-telephone me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.phone }}</span>
            <span v-if="targetCv.address"><i class="bi bi-geo-alt me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.address }}</span>
            <span v-if="targetCv.linkedin" class="text-break"><i class="bi bi-linkedin me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.linkedin }}</span>
            <span v-if="targetCv.github" class="text-break"><i class="bi bi-github me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.github }}</span>
            <span v-if="targetCv.website" class="text-break"><i class="bi bi-globe me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.website }}</span>
          </div>
        </div>

        <!-- Skills -->
        <div v-if="targetCv.skills && targetCv.skills.length" class="mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Keahlian</h6>
          <div class="d-flex flex-wrap gap-1">
            <span v-for="(skill, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border px-2 py-1 small">
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Languages -->
        <div v-if="targetCv.languages && targetCv.languages.length" class="mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Bahasa</h6>
          <ul class="list-unstyled small text-muted mb-0">
            <li v-for="(lang, i) in targetCv.languages" :key="i" class="mb-1 text-dark">• {{ lang }}</li>
          </ul>
        </div>

        <!-- Certifications -->
        <div v-if="targetCv.certifications && targetCv.certifications.length" class="mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Sertifikasi</h6>
          <ul class="list-unstyled small text-muted mb-0">
            <li v-for="(cert, i) in targetCv.certifications" :key="i" class="mb-1 small text-dark">• {{ cert }}</li>
          </ul>
        </div>
      </div>

      <!-- Right Body (67%) -->
      <div class="col-8 ps-2">
        <div class="mb-3 border-bottom pb-2">
          <h1 class="cv-name fw-extrabold mb-1 tracking-tight" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
          <h5 class="cv-title fw-bold text-secondary mb-0">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
        </div>

        <div v-if="targetCv.summary" class="cv-section mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Profil Profesional</h6>
          <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
        </div>

        <div v-if="targetCv.experience && targetCv.experience.length" class="cv-section mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pengalaman Kerja</h6>
          <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-2.5 cv-item">
            <div class="d-flex justify-content-between align-items-baseline">
              <strong class="text-dark">{{ exp.position }}</strong>
              <span class="small text-muted fw-bold">{{ exp.period }}</span>
            </div>
            <div class="small fw-semibold text-secondary mb-1">{{ exp.company }} <span v-if="exp.location">— {{ exp.location }}</span></div>
            <p class="small text-dark mb-0 white-space-pre-line lh-base">{{ exp.description }}</p>
          </div>
        </div>

        <div v-if="targetCv.education && targetCv.education.length" class="cv-section mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pendidikan</h6>
          <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-1.5 cv-item">
            <div class="d-flex justify-content-between align-items-baseline">
              <strong class="text-dark">{{ edu.degree }}</strong>
              <span class="small text-muted fw-bold">{{ edu.period }}</span>
            </div>
            <div class="small text-muted">{{ edu.institution }} <span v-if="edu.gpa">(IPK: {{ edu.gpa }})</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- TEMPLATE TYPE: SPLIT SIDEBAR RIGHT (ats_sidebar_right_4) -->
    <div v-else-if="resolvedPresetFamily === 'sidebar_right'" class="layout-sidebar-right row g-3.5">
      <!-- Left Body (67%) -->
      <div class="col-8 border-end pe-3" style="border-color: #e2e8f0;">
        <div class="mb-3 border-bottom pb-2">
          <h1 class="cv-name fw-extrabold mb-1 tracking-tight" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
          <h5 class="cv-title fw-bold text-secondary mb-0">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
        </div>

        <div v-if="targetCv.summary" class="cv-section mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Ringkasan Profil</h6>
          <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
        </div>

        <div v-if="targetCv.experience && targetCv.experience.length" class="cv-section mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pengalaman Kerja</h6>
          <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-2.5 cv-item">
            <div class="d-flex justify-content-between align-items-baseline">
              <strong class="text-dark">{{ exp.position }}</strong>
              <span class="small text-muted fw-bold">{{ exp.period }}</span>
            </div>
            <div class="small fw-semibold text-secondary mb-1">{{ exp.company }} <span v-if="exp.location">— {{ exp.location }}</span></div>
            <p class="small text-dark mb-0 white-space-pre-line lh-base">{{ exp.description }}</p>
          </div>
        </div>

        <div v-if="targetCv.education && targetCv.education.length" class="cv-section mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pendidikan</h6>
          <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-1.5 cv-item">
            <div class="d-flex justify-content-between align-items-baseline">
              <strong class="text-dark">{{ edu.degree }}</strong>
              <span class="small text-muted fw-bold">{{ edu.period }}</span>
            </div>
            <div class="small text-muted">{{ edu.institution }} <span v-if="edu.gpa">(IPK: {{ edu.gpa }})</span></div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar (33%) -->
      <div class="col-4 ps-2">
        <div v-if="shouldShowAvatar" class="text-center mb-3">
          <img :src="targetCv.avatar" :class="avatarShapeClass" :style="avatarStyles" alt="Foto Profil" />
        </div>
        <div class="mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Kontak</h6>
          <div class="d-flex flex-column gap-1.5 small text-muted">
            <span v-if="targetCv.email" class="text-break"><i class="bi bi-envelope me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.email }}</span>
            <span v-if="targetCv.phone"><i class="bi bi-telephone me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.phone }}</span>
            <span v-if="targetCv.address"><i class="bi bi-geo-alt me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.address }}</span>
            <span v-if="targetCv.linkedin" class="text-break"><i class="bi bi-linkedin me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.linkedin }}</span>
            <span v-if="targetCv.github" class="text-break"><i class="bi bi-github me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.github }}</span>
            <span v-if="targetCv.website" class="text-break"><i class="bi bi-globe me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.website }}</span>
          </div>
        </div>

        <div v-if="targetCv.skills && targetCv.skills.length" class="mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Keahlian</h6>
          <div class="d-flex flex-wrap gap-1">
            <span v-for="(skill, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border px-2 py-1 small">
              {{ skill }}
            </span>
          </div>
        </div>

        <div v-if="targetCv.languages && targetCv.languages.length" class="mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Bahasa</h6>
          <ul class="list-unstyled small text-muted mb-0">
            <li v-for="(lang, i) in targetCv.languages" :key="i" class="mb-1 text-dark">• {{ lang }}</li>
          </ul>
        </div>

        <div v-if="targetCv.certifications && targetCv.certifications.length" class="mb-3">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Sertifikasi</h6>
          <ul class="list-unstyled small text-muted mb-0">
            <li v-for="(cert, i) in targetCv.certifications" :key="i" class="mb-1 small text-dark">• {{ cert }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- TEMPLATE TYPE: CREATIVE ACCENT BANNER (ats_creative_banner_9 / ats_studio_creative) -->
    <div v-else-if="resolvedPresetFamily === 'creative_banner'" class="layout-creative-banner">
      <div class="p-3.5 text-white rounded-3 mb-3 shadow-sm" :style="{ backgroundColor: activeColor || '#6366f1' }">
        <div class="d-flex justify-content-between align-items-center gap-3.5">
          <div class="flex-grow-1">
            <h1 class="cv-name fw-extrabold mb-1 text-white tracking-tight">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
            <h5 class="cv-title fw-medium text-white text-opacity-90 mb-2">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
            <div class="d-flex flex-wrap gap-3 small text-white text-opacity-85">
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
      <div v-if="targetCv.summary" class="cv-section mb-3">
        <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Ringkasan Profil</h6>
        <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
      </div>

      <!-- Dual Column Body -->
      <div class="row g-3.5">
        <!-- Left: Experience -->
        <div class="col-7">
          <div v-if="targetCv.experience && targetCv.experience.length" class="cv-section mb-3">
            <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pengalaman Kerja</h6>
            <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-2.5 cv-item">
              <div class="d-flex justify-content-between align-items-baseline">
                <strong class="text-dark small">{{ exp.position }}</strong>
                <span class="small text-muted fw-bold" style="font-size: 10px;">{{ exp.period }}</span>
              </div>
              <div class="small text-muted mb-1">{{ exp.company }}</div>
              <p class="small text-dark mb-0 white-space-pre-line lh-base">{{ exp.description }}</p>
            </div>
          </div>
        </div>

        <!-- Right: Edu & Skills -->
        <div class="col-5">
          <div v-if="targetCv.education && targetCv.education.length" class="cv-section mb-3">
            <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pendidikan</h6>
            <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-2 cv-item">
              <strong class="text-dark d-block small">{{ edu.degree }}</strong>
              <div class="small text-muted">{{ edu.institution }} ({{ edu.period }})</div>
            </div>
          </div>

          <div v-if="targetCv.skills && targetCv.skills.length" class="cv-section mb-3">
            <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Keahlian</h6>
            <div class="d-flex flex-wrap gap-1">
              <span v-for="(s, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border px-2 py-0.5 small">{{ s }}</span>
            </div>
          </div>

          <div v-if="targetCv.certifications && targetCv.certifications.length" class="cv-section mb-2">
            <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Sertifikasi</h6>
            <ul class="list-unstyled small mb-0">
              <li v-for="(c, i) in targetCv.certifications" :key="i" class="small">• {{ c }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- TEMPLATE TYPE: GRADIENT HORIZON (ats_gradient_top_18) -->
    <div v-else-if="resolvedPresetFamily === 'gradient_horizon'" class="layout-gradient-horizon">
      <div class="p-3.5 text-white rounded-3 mb-3 shadow-sm" :style="{ background: `linear-gradient(135deg, ${activeColor || '#4f46e5'}, #0f172a)` }">
        <div class="d-flex justify-content-between align-items-center gap-3.5">
          <div>
            <h1 class="cv-name fw-extrabold mb-1 text-white tracking-tight">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
            <h5 class="cv-title fw-medium text-white-50 mb-2">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
            <div class="d-flex flex-wrap gap-3 small text-white-50">
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
      <div v-if="targetCv.summary" class="cv-section mb-3">
        <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Ringkasan Profil</h6>
        <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
      </div>

      <!-- Experience -->
      <div v-if="targetCv.experience && targetCv.experience.length" class="cv-section mb-3">
        <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pengalaman Kerja</h6>
        <div v-for="(exp, idx) in targetCv.experience" :key="idx" class="mb-2.5 cv-item">
          <div class="d-flex justify-content-between align-items-baseline">
            <strong class="text-dark">{{ exp.position }} — <span class="fw-semibold text-secondary">{{ exp.company }}</span></strong>
            <span class="small text-muted fw-bold">{{ exp.period }}</span>
          </div>
          <div v-if="exp.location" class="small text-muted mb-1">{{ exp.location }}</div>
          <p class="small text-dark mb-0 white-space-pre-line lh-base">{{ exp.description }}</p>
        </div>
      </div>

      <!-- Education & Skills -->
      <div class="row g-3.5">
        <div v-if="targetCv.education && targetCv.education.length" class="col-6">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pendidikan</h6>
          <div v-for="(edu, idx) in targetCv.education" :key="idx" class="mb-2 cv-item">
            <strong class="text-dark small d-block">{{ edu.degree }}</strong>
            <div class="small text-muted">{{ edu.institution }} ({{ edu.period }})</div>
          </div>
        </div>
        <div v-if="targetCv.skills && targetCv.skills.length" class="col-6">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Keahlian</h6>
          <div class="d-flex flex-wrap gap-1">
            <span v-for="(skill, idx) in targetCv.skills" :key="idx" class="badge bg-light text-dark border px-2 py-1 small">
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- TEMPLATE TYPE: TIMELINE FLOW (ats_timeline_11) -->
    <div v-else-if="resolvedPresetFamily === 'timeline_flow'" class="layout-timeline">
      <div class="cv-header border-bottom pb-2.5 mb-3 d-flex justify-content-between align-items-center">
        <div>
          <h1 class="cv-name fw-extrabold mb-1" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
          <h5 class="cv-title fw-bold text-secondary mb-2">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
          <div class="d-flex flex-wrap gap-3 small text-muted">
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

      <div v-if="targetCv.summary" class="cv-section mb-3">
        <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Profil Profesional</h6>
        <p class="small text-dark mb-0 lh-base">{{ targetCv.summary }}</p>
      </div>

      <!-- Timeline Experience -->
      <div v-if="targetCv.experience && targetCv.experience.length" class="cv-section mb-3">
        <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Linimasa Pengalaman</h6>
        <div class="ps-3 position-relative border-start border-2" :style="{ borderColor: activeColor }">
          <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-3 position-relative cv-item">
            <span class="position-absolute rounded-circle bg-white border border-2" :style="{ borderColor: activeColor, width: '12px', height: '12px', left: '-22px', top: '4px' }"></span>
            <div class="d-flex justify-content-between align-items-baseline">
              <strong class="text-dark">{{ exp.position }} @ {{ exp.company }}</strong>
              <span class="badge bg-light text-dark border small">{{ exp.period }}</span>
            </div>
            <div class="small text-muted mb-1">{{ exp.location }}</div>
            <p class="small text-dark mb-0 white-space-pre-line lh-base">{{ exp.description }}</p>
          </div>
        </div>
      </div>

      <!-- Timeline Education -->
      <div v-if="targetCv.education && targetCv.education.length" class="cv-section mb-3">
        <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 border-bottom" :style="headingColorStyles">Linimasa Pendidikan</h6>
        <div class="ps-3 position-relative border-start border-2" :style="{ borderColor: activeColor }">
          <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-2 position-relative cv-item">
            <span class="position-absolute rounded-circle bg-white border border-2" :style="{ borderColor: activeColor, width: '12px', height: '12px', left: '-22px', top: '4px' }"></span>
            <div class="d-flex justify-content-between align-items-baseline">
              <strong class="text-dark">{{ edu.degree }}</strong>
              <span class="badge bg-light text-dark border small">{{ edu.period }}</span>
            </div>
            <div class="small text-muted">{{ edu.institution }} <span v-if="edu.gpa">| IPK: {{ edu.gpa }}</span></div>
          </div>
        </div>
      </div>

      <!-- Skills & Badges -->
      <div v-if="targetCv.skills && targetCv.skills.length" class="cv-section mb-2">
        <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Keahlian & Kompetensi</h6>
        <div class="d-flex flex-wrap gap-1.5">
          <span v-for="(skill, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border px-2.5 py-1 small">{{ skill }}</span>
        </div>
      </div>
    </div>

    <!-- TEMPLATE TYPE: DUAL BALANCED 50/50 (ats_dual_balanced_12) -->
    <div v-else-if="resolvedPresetFamily === 'dual_balanced'" class="layout-dual-balanced">
      <div class="cv-header text-center border-bottom pb-2.5 mb-3 position-relative">
        <div v-if="shouldShowAvatar" class="mb-2">
          <img :src="targetCv.avatar" :class="avatarShapeClass" :style="avatarStyles" alt="Foto Profil" />
        </div>
        <h1 class="cv-name fw-extrabold mb-1" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
        <h5 class="cv-title fw-bold text-secondary mb-2">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
        <div class="d-flex justify-content-center flex-wrap gap-3 small text-muted">
          <span v-if="targetCv.email">{{ targetCv.email }}</span>
          <span v-if="targetCv.phone">| {{ targetCv.phone }}</span>
          <span v-if="targetCv.address">| {{ targetCv.address }}</span>
          <span v-if="targetCv.linkedin">| {{ targetCv.linkedin }}</span>
        </div>
      </div>

      <div v-if="targetCv.summary" class="cv-section mb-3">
        <p class="small text-dark mb-0 text-center lh-base fst-italic">{{ targetCv.summary }}</p>
      </div>

      <div class="row g-3.5">
        <!-- Col 1: Experience -->
        <div class="col-6">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pengalaman Kerja</h6>
          <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-2.5 cv-item">
            <strong class="text-dark small d-block">{{ exp.position }}</strong>
            <div class="small fw-semibold text-secondary">{{ exp.company }} ({{ exp.period }})</div>
            <p class="small text-dark mb-0 white-space-pre-line lh-base">{{ exp.description }}</p>
          </div>
        </div>

        <!-- Col 2: Education, Skills, Langs -->
        <div class="col-6">
          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom" :style="headingColorStyles">Pendidikan</h6>
          <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-2 cv-item">
            <strong class="text-dark small d-block">{{ edu.degree }}</strong>
            <div class="small text-muted">{{ edu.institution }} ({{ edu.period }})</div>
          </div>

          <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 border-bottom mt-3" :style="headingColorStyles">Keahlian & Bahasa</h6>
          <div class="d-flex flex-wrap gap-1 mb-2">
            <span v-for="(s, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border px-2 py-0.5 small">{{ s }}</span>
          </div>
          <div v-if="targetCv.languages && targetCv.languages.length" class="small text-muted">
            <strong>Bahasa:</strong> {{ (targetCv.languages || []).join(', ') }}
          </div>
        </div>
      </div>
    </div>

    <!-- TEMPLATE TYPE: BOXED FRAMED EXECUTIVE (ats_boxed_executive_14) -->
    <div v-else-if="resolvedPresetFamily === 'boxed_executive'" class="layout-boxed-executive">
      <div class="cv-header p-3 bg-light rounded-3 border mb-3 d-flex justify-content-between align-items-center gap-3">
        <div>
          <h1 class="cv-name fw-extrabold mb-1" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
          <h5 class="cv-title fw-bold text-secondary mb-2">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
          <div class="d-flex flex-wrap gap-3 small text-muted">
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

      <!-- Boxed Summary -->
      <div v-if="targetCv.summary" class="p-3 bg-white border rounded-3 mb-3">
        <h6 class="section-heading fw-bold text-uppercase pb-1 mb-1.5 text-primary" :style="{ color: activeColor }">Ringkasan Eksekutif</h6>
        <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
      </div>

      <!-- Boxed Experience -->
      <div v-if="targetCv.experience && targetCv.experience.length" class="p-3 bg-white border rounded-3 mb-3">
        <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 text-primary" :style="{ color: activeColor }">Pengalaman Kerja</h6>
        <div v-for="(exp, i) in targetCv.experience" :key="i" class="mb-2.5 pb-2 border-bottom last-border-0 cv-item">
          <div class="d-flex justify-content-between align-items-baseline">
            <strong class="text-dark">{{ exp.position }}</strong>
            <span class="badge bg-light text-dark border small">{{ exp.period }}</span>
          </div>
          <div class="small fw-semibold text-secondary mb-1">{{ exp.company }} <span v-if="exp.location">— {{ exp.location }}</span></div>
          <p class="small text-dark mb-0 white-space-pre-line lh-base">{{ exp.description }}</p>
        </div>
      </div>

      <!-- Boxed Education & Skills -->
      <div class="row g-3">
        <div v-if="targetCv.education && targetCv.education.length" class="col-6">
          <div class="p-3 bg-white border rounded-3 h-100">
            <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 text-primary" :style="{ color: activeColor }">Pendidikan</h6>
            <div v-for="(edu, i) in targetCv.education" :key="i" class="mb-1.5 cv-item">
              <strong class="text-dark small d-block">{{ edu.degree }}</strong>
              <div class="small text-muted">{{ edu.institution }} ({{ edu.period }})</div>
            </div>
          </div>
        </div>
        <div v-if="targetCv.skills && targetCv.skills.length" class="col-6">
          <div class="p-3 bg-white border rounded-3 h-100">
            <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2 text-primary" :style="{ color: activeColor }">Keahlian & Bahasa</h6>
            <div class="d-flex flex-wrap gap-1 mb-2">
              <span v-for="(s, i) in targetCv.skills" :key="i" class="badge bg-light text-dark border px-2 py-1 small">{{ s }}</span>
            </div>
            <div v-if="targetCv.languages && targetCv.languages.length" class="small text-muted">
              <strong>Bahasa:</strong> {{ (targetCv.languages || []).join(', ') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TEMPLATE TYPE: SKILLS FIRST / FUNCTIONAL (ats_skills_first_13 / ats_infographic_19) -->
    <div v-else-if="resolvedPresetFamily === 'skills_first'" class="layout-skills-first">
      <div class="cv-header border-bottom pb-2.5 mb-3 d-flex justify-content-between align-items-center gap-3">
        <div>
          <h1 class="cv-name fw-extrabold mb-1 tracking-tight" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
          <h5 class="cv-title fw-bold text-secondary mb-2">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
          <div class="d-flex flex-wrap gap-3 small text-muted">
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

      <!-- Ringkasan -->
      <div v-if="targetCv.summary" class="cv-section mb-3">
        <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Ringkasan Profil</h6>
        <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
      </div>

      <!-- Keahlian Ditempatkan di Atas (Skills First) -->
      <div v-if="targetCv.skills && targetCv.skills.length" class="cv-section mb-3 p-3 bg-light rounded-3 border">
        <h6 class="section-heading fw-bold text-uppercase pb-1 mb-2" :style="{ color: activeColor }">
          <i class="bi bi-stars me-1"></i> Keahlian & Kompetensi Utama
        </h6>
        <div class="d-flex flex-wrap gap-1.5">
          <span v-for="(skill, idx) in targetCv.skills" :key="idx" class="badge bg-white text-dark border px-2.5 py-1.5 small shadow-sm fw-semibold">
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Pengalaman Kerja -->
      <div v-if="targetCv.experience && targetCv.experience.length" class="cv-section mb-3">
        <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Pengalaman Kerja</h6>
        <div v-for="(exp, idx) in targetCv.experience" :key="idx" class="mb-2.5 cv-item">
          <div class="d-flex justify-content-between align-items-baseline">
            <strong class="text-dark">{{ exp.position }} — <span class="fw-semibold text-secondary">{{ exp.company }}</span></strong>
            <span class="small text-muted fw-bold">{{ exp.period }}</span>
          </div>
          <div v-if="exp.location" class="small text-muted mb-1">{{ exp.location }}</div>
          <p class="small text-dark mb-0 white-space-pre-line lh-base">{{ exp.description }}</p>
        </div>
      </div>

      <!-- Pendidikan, Bahasa & Sertifikasi -->
      <div class="row g-3">
        <div v-if="targetCv.education && targetCv.education.length" class="col-6">
          <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Pendidikan</h6>
          <div v-for="(edu, idx) in targetCv.education" :key="idx" class="mb-1.5 cv-item">
            <strong class="text-dark small d-block">{{ edu.degree }}</strong>
            <div class="small text-muted">{{ edu.institution }} ({{ edu.period }})</div>
          </div>
        </div>
        <div v-if="(targetCv.languages && targetCv.languages.length) || (targetCv.certifications && targetCv.certifications.length)" class="col-6">
          <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Bahasa & Sertifikasi</h6>
          <div v-if="targetCv.languages && targetCv.languages.length" class="small text-muted mb-1">
            <strong>Bahasa:</strong> {{ (targetCv.languages || []).join(', ') }}
          </div>
          <ul v-if="targetCv.certifications && targetCv.certifications.length" class="list-unstyled small mb-0">
            <li v-for="(c, idx) in targetCv.certifications" :key="idx">• {{ c }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- DEFAULT / SINGLE COLUMN ATS STANDARD (ats_clean_1, ats_slate_5, ats_serif_8, ats_swiss_10, ats_compact_7, ats_tokyo_clean, etc.) -->
    <div v-else class="layout-single-column">
      <div class="cv-header border-bottom pb-2.5 mb-3 d-flex justify-content-between align-items-center gap-3">
        <div class="flex-grow-1">
          <h1 class="cv-name fw-extrabold mb-1 tracking-tight" :style="{ color: activeColor }">{{ targetCv.fullName || 'NAMA LENGKAP' }}</h1>
          <h5 class="cv-title fw-bold text-secondary mb-2">{{ targetCv.jobTitle || 'Judul Profesi' }}</h5>
          <div class="d-flex flex-wrap gap-3 small text-muted">
            <span v-if="targetCv.email"><i class="bi bi-envelope me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.email }}</span>
            <span v-if="targetCv.phone"><i class="bi bi-telephone me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.phone }}</span>
            <span v-if="targetCv.address"><i class="bi bi-geo-alt me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.address }}</span>
            <span v-if="targetCv.linkedin"><i class="bi bi-linkedin me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.linkedin }}</span>
            <span v-if="targetCv.github"><i class="bi bi-github me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.github }}</span>
            <span v-if="targetCv.website"><i class="bi bi-globe me-1.5" :style="{ color: activeColor }"></i>{{ targetCv.website }}</span>
          </div>
        </div>
        <div v-if="shouldShowAvatar">
          <img :src="targetCv.avatar" :class="avatarShapeClass" :style="avatarStyles" alt="Foto Profil" />
        </div>
      </div>

      <!-- Ringkasan Profil -->
      <div v-if="targetCv.summary" class="cv-section mb-3">
        <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Ringkasan Profil</h6>
        <p class="small text-dark mb-0 lh-base" style="text-align: justify;">{{ targetCv.summary }}</p>
      </div>

      <!-- Pengalaman Kerja -->
      <div v-if="targetCv.experience && targetCv.experience.length" class="cv-section mb-3">
        <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Pengalaman Kerja</h6>
        <div v-for="(exp, idx) in targetCv.experience" :key="idx" class="mb-2.5 cv-item">
          <div class="d-flex justify-content-between align-items-baseline">
            <strong class="text-dark">{{ exp.position }} — <span class="fw-semibold text-secondary">{{ exp.company }}</span></strong>
            <span class="small text-muted fw-bold">{{ exp.period }}</span>
          </div>
          <div v-if="exp.location" class="small text-muted mb-1">{{ exp.location }}</div>
          <p class="small text-dark mb-0 white-space-pre-line lh-base">{{ exp.description }}</p>
        </div>
      </div>

      <!-- Pendidikan -->
      <div v-if="targetCv.education && targetCv.education.length" class="cv-section mb-3">
        <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Pendidikan</h6>
        <div v-for="(edu, idx) in targetCv.education" :key="idx" class="mb-2 cv-item">
          <div class="d-flex justify-content-between align-items-baseline">
            <strong class="text-dark">{{ edu.degree }} — {{ edu.institution }}</strong>
            <span class="small text-muted fw-bold">{{ edu.period }}</span>
          </div>
          <div v-if="edu.gpa" class="small text-muted">IPK / GPA: {{ edu.gpa }}</div>
        </div>
      </div>

      <!-- Keahlian Utama -->
      <div v-if="targetCv.skills && targetCv.skills.length" class="cv-section mb-3">
        <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Keahlian Utama</h6>
        <div class="d-flex flex-wrap gap-1.5">
          <span v-for="(skill, idx) in targetCv.skills" :key="idx" class="badge bg-light text-dark border px-2.5 py-1 small">
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Bahasa & Sertifikasi -->
      <div class="row g-3.5">
        <div v-if="targetCv.languages && targetCv.languages.length" class="col-6">
          <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Bahasa</h6>
          <ul class="list-unstyled small mb-0 text-muted">
            <li v-for="(lang, idx) in targetCv.languages" :key="idx" class="text-dark">• {{ lang }}</li>
          </ul>
        </div>
        <div v-if="targetCv.certifications && targetCv.certifications.length" class="col-6">
          <h6 class="section-heading fw-bold text-uppercase border-bottom pb-1 mb-1.5" :style="headingColorStyles">Sertifikasi</h6>
          <ul class="list-unstyled small mb-0 text-muted">
            <li v-for="(cert, idx) in targetCv.certifications" :key="idx" class="text-dark">• {{ cert }}</li>
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
        h('div', { class: 'mb-2.5 cv-item' }, [
          h('div', { class: 'd-flex justify-content-between align-items-baseline' }, [
            h('strong', { class: 'text-dark small' }, exp.position),
            h('span', { class: 'small text-muted fw-bold' }, exp.period)
          ]),
          h('div', { class: 'small fw-semibold text-secondary mb-1' }, [
            exp.company,
            exp.location ? ` — ${exp.location}` : ''
          ]),
          exp.description ? h('p', { class: 'small text-dark mb-0 white-space-pre-line lh-base' }, exp.description) : null
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
        h('div', { class: 'mb-2 cv-item' }, [
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
      h('div', { class: 'd-flex flex-column gap-1.5 small text-muted' }, [
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
        columnMode: cfg.columnMode || 'single',
        sidebarPosition: cfg.sidebarPosition || 'left',
        sidebarRatio: cfg.sidebarRatio || '30',
        headerAlign: cfg.headerAlign || 'left',
        headerBanner: !!cfg.headerBanner,
        avatarPos: cfg.avatarPos || 'left',
        sidebarBg: cfg.sidebarBg || '#f8fafc',
        mainSections: cfg.mainSections || ['summary', 'experience', 'education', 'skills', 'languages', 'certifications'],
        sidebarSections: cfg.sidebarSections || ['contact', 'skills', 'languages', 'certifications'],
        sectionTitles: cfg.sectionTitles || {},
        sectionVisibility: cfg.sectionVisibility || {}
      };
    });

    // Preset Layout Family Classifier
    const resolvedPresetFamily = computed(() => {
      const t = props.layoutType || targetCv.value.selectedTemplate || 'ats_clean_1';
      if (t === 'ats_two_tone_16' || t === 'ats_dark_modern' || t === 'two_tone') return 'two_tone_dark';
      if (t === 'ats_sidebar_left_3' || t === 'sidebar_left' || t === 'ats_scandi_split' || t === 'ats_teal_corporate_split' || t === 'ats_startup_sleek_15' || t === 'ats_engineering_split') return 'sidebar_left';
      if (t === 'ats_sidebar_right_4' || t === 'sidebar_right') return 'sidebar_right';
      if (t === 'ats_creative_banner_9' || t === 'creative_banner' || t === 'ats_studio_creative') return 'creative_banner';
      if (t === 'ats_gradient_top_18' || t === 'gradient') return 'gradient_horizon';
      if (t === 'ats_timeline_11' || t === 'timeline_flow') return 'timeline_flow';
      if (t === 'ats_dual_balanced_12' || t === 'dual_balanced') return 'dual_balanced';
      if (t === 'ats_boxed_executive_14' || t === 'boxed') return 'boxed_executive';
      if (t === 'ats_skills_first_13' || t === 'ats_infographic_19' || t === 'skills_first') return 'skills_first';
      return 'single_column';
    });

    const resolvedLayoutClass = computed(() => {
      if (isCustomLayout.value) return 'layout-custom-mode';
      return `layout-${resolvedPresetFamily.value}`;
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
      let px = 84;
      if (sizeKey === 'sm') px = 68;
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
        backgroundColor: customConfig.value.sidebarBg || '#f8fafc',
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
      resolvedPresetFamily,
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
/* Standard A4 dimensions with calibrated margins & padding */
.cv-paper {
  width: 100%;
  max-width: 794px; /* Standard A4 width in px at 96DPI */
  min-height: 1050px;
  box-sizing: border-box;
  font-size: 13px;
  line-height: 1.5;
  padding: 34px 40px;
  background-color: #ffffff;
  transition: all 0.2s ease;
  position: relative;
  letter-spacing: normal;
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

/* Density Scales */
.density-comfortable {
  font-size: 13.5px;
  line-height: 1.55;
  padding: 38px 46px;
}
.density-comfortable .cv-name { font-size: 1.95rem; }
.density-comfortable .cv-title { font-size: 1.15rem; }
.density-comfortable .cv-section { margin-bottom: 1.1rem !important; }

.density-standard {
  font-size: 12.8px;
  line-height: 1.48;
  padding: 30px 38px;
}
.density-standard .cv-name { font-size: 1.75rem; }
.density-standard .cv-title { font-size: 1.05rem; }
.density-standard .cv-section { margin-bottom: 0.85rem !important; }

.density-compact {
  font-size: 11.8px;
  line-height: 1.38;
  padding: 22px 28px;
}
.density-compact .cv-name { font-size: 1.55rem; }
.density-compact .cv-title { font-size: 0.98rem; }
.density-compact .cv-section { margin-bottom: 0.65rem !important; }
.density-compact p { margin-bottom: 0.2rem !important; }

.density-ultra_compact {
  font-size: 11px;
  line-height: 1.28;
  padding: 16px 22px;
}
.density-ultra_compact .cv-name { font-size: 1.35rem; }
.density-ultra_compact .cv-title { font-size: 0.88rem; }
.density-ultra_compact .cv-section { margin-bottom: 0.45rem !important; }
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

.contact-item {
  display: inline-flex;
  align-items: center;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.cv-name, .cv-title {
  word-break: break-word;
  overflow-wrap: anywhere;
}

.cv-item, .cv-section, .cv-sub-section {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

.section-heading {
  page-break-after: avoid !important;
  break-after: avoid !important;
}

/* Responsive Rules for Small/Mobile Screen Direct Rendering (e.g. 720x1280) */
@media screen and (max-width: 768px) {
  .cv-paper {
    padding: 20px 18px;
    font-size: 12px;
  }
  .density-comfortable {
    padding: 24px 22px;
  }
  .density-standard {
    padding: 18px 16px;
  }
  .density-compact {
    padding: 14px 12px;
  }
  .density-ultra_compact {
    padding: 10px 10px;
  }
  .custom-header-banner {
    padding: 16px 14px !important;
  }
}

/* Print Specific Rules for True A4 Fix */
@media print {
  @page {
    size: 210mm 297mm;
    margin: 0;
  }

  html, body {
    background: #ffffff !important;
    color: #000000 !important;
    margin: 0 !important;
    padding: 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .cv-paper {
    width: 210mm !important;
    max-width: 210mm !important;
    min-height: 297mm !important;
    box-sizing: border-box !important;
    box-shadow: none !important;
    border: none !important;
    margin: 0 auto !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    display: block !important;
    background-color: #ffffff !important;
  }

  .density-comfortable {
    padding: 8mm 10mm !important;
  }
  .density-standard {
    padding: 6mm 8mm !important;
  }
  .density-compact {
    padding: 4mm 6mm !important;
  }
  .density-ultra_compact {
    padding: 3mm 4mm !important;
  }

  .a4-cutoff-marker,
  .no-print,
  .print-hide {
    display: none !important;
  }

  .a4-lock-single-page {
    max-height: none !important;
    overflow: visible !important;
  }
}
</style>
