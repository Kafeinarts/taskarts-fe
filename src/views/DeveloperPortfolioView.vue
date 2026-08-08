<template>
  <div class="developer-portfolio-page">
    <!-- 3D WebGL Canvas Container -->
    <div id="portfolio-canvas-container" ref="canvasContainer"></div>

    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg fixed-top brutal-navbar">
      <div class="container-fluid px-3 px-md-4">
        <a class="navbar-brand fw-bold text-uppercase fs-4 border border-dark border-3 px-2 bg-main-blue text-white shadow-sm" href="#hero" style="transform: rotate(-2deg);">
          🚀 ITSMEBROARIF
        </a>
        
        <div class="d-flex align-items-center gap-2 gap-md-3">
          <!-- Language Switcher -->
          <div class="d-flex gap-1">
            <button class="lang-btn" :class="{ active: currentLang === 'id' }" @click="setLanguage('id')">ID</button>
            <button class="lang-btn" :class="{ active: currentLang === 'en' }" @click="setLanguage('en')">EN</button>
            <button class="lang-btn" :class="{ active: currentLang === 'jp' }" @click="setLanguage('jp')">JP</button>
          </div>
          <button class="navbar-toggler brutal-box p-1 bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#devNavMenu">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        <div class="collapse navbar-collapse" id="devNavMenu">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 fw-bold fs-6 text-uppercase text-center mt-3 mt-lg-0 gap-1">
            <li class="nav-item"><a class="nav-link text-dark" href="#hero">{{ t('nav_home') }}</a></li>
            <li class="nav-item"><a class="nav-link text-dark" href="#about">{{ t('nav_about') }}</a></li>
            <li class="nav-item"><a class="nav-link text-dark" href="#app-showcase">{{ t('nav_system') }}</a></li>
            <li class="nav-item"><a class="nav-link text-dark" href="#services">{{ t('nav_services') }}</a></li>
            <li class="nav-item"><a class="nav-link text-dark" href="#experiences">{{ t('nav_journey') }}</a></li>
            <li class="nav-item"><a class="nav-link text-dark" href="#projects">{{ t('nav_projects') }}</a></li>
            <li class="nav-item"><a class="nav-link text-dark" href="#faq">{{ t('nav_faq') }}</a></li>
            <li class="nav-item"><a class="nav-link text-dark" href="#contact">{{ t('nav_contact') }}</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="hero" class="section-padding min-vh-100 d-flex align-items-center position-relative overflow-hidden bg-soft-blue">
      <div class="container text-center position-relative z-1 pt-5">
        <div class="gsap-hero-el">
          <div class="brutal-box d-inline-block bg-white px-4 py-2 mb-4" style="transform: rotate(3deg);">
            <h5 class="m-0 fw-bold fs-5 text-dark">{{ t('hero_role') }}</h5>
          </div>
        </div>
        
        <div class="gsap-hero-el">
          <h1 class="skew-title brutal-box bg-main-blue text-white mx-auto d-table text-wrap">
            ARIF PERMANA<br>PUTRASURYANA
          </h1>
        </div>
        
        <div class="row justify-content-center mt-4 gsap-hero-el">
          <div class="col-md-9 col-lg-8">
            <p class="fs-5 fw-bold bg-white brutal-box p-3 p-md-4 text-dark shadow-sm">
              {{ t('hero_quote') }}
            </p>
          </div>
        </div>
        
        <div class="mt-4 gsap-hero-el">
          <span class="bg-cyan text-dark px-4 py-2.5 fw-bold fs-4 brutal-box d-inline-block border-4" style="transform: rotate(-3deg);">
            CRAFTED BY ITSMEBROARIF ⚡
          </span>
        </div>

        <div class="mt-5 gsap-hero-el d-flex flex-wrap justify-content-center gap-3">
          <a href="#about" class="brutal-btn bg-dark-accent fs-5 px-4 py-3 text-white">
            <span>{{ t('hero_btn') }}</span> <i class="bi bi-arrow-down ms-2"></i>
          </a>
          <a href="#app-showcase" class="brutal-btn bg-main-blue fs-5 px-4 py-3 text-white">
            <span>{{ t('hero_app_btn') }}</span> <i class="bi bi-cpu-fill ms-2"></i>
          </a>
        </div>
      </div>
    </section>

    <!-- Marquee Banner -->
    <div class="marquee">
      <div class="marquee-content">
        ARIF PERMANA • VUE.JS • LARAVEL • UI/UX DESIGN • FULLSTACK ENGINEER • GOLANG • REACT • FIGMA • ITSMEBROARIF • RAJINKERJA.ID •
        ARIF PERMANA • VUE.JS • LARAVEL • UI/UX DESIGN • FULLSTACK ENGINEER • GOLANG • REACT • FIGMA • ITSMEBROARIF • RAJINKERJA.ID •
      </div>
    </div>

    <!-- About Section -->
    <section id="about" class="section-padding bg-white py-5">
      <div class="container my-4">
        <div class="text-center mb-5 gsap-pop">
          <h2 class="skew-title brutal-box bg-main-blue text-white fs-1">{{ t('about_title') }}</h2>
        </div>
        
        <div class="row align-items-center g-4 g-lg-5">
          <div class="col-lg-5 gsap-slide-right">
            <div class="position-relative mx-auto max-w-400">
              <div class="brutal-box bg-cyan position-absolute w-100 h-100" style="top: 16px; left: 16px; z-index: 0;"></div>
              <img src="https://miro.medium.com/v2/resize:fit:2400/1*99hHL9XJ7EzQeC6RB5_Qiw.jpeg" alt="Arif Permana Photo" class="brutal-box position-relative w-100 obj-fit-cover shadow-sm" style="height: 440px; z-index: 1;" />
              <div class="position-absolute brutal-box bg-white p-3 text-center shadow-sm" style="bottom: -20px; right: -15px; z-index: 2; transform: rotate(-5deg);">
                <h4 class="fw-bold mb-0 text-uppercase fs-5 text-main-blue">{{ t('about_status_title') }}</h4>
                <span class="badge bg-cyan brutal-box text-dark fs-6 mt-1 px-3 py-2 border-2 border-dark">{{ t('about_status_val') }}</span>
              </div>
            </div>
          </div>
          
          <div class="col-lg-7 gsap-slide-left">
            <div class="brutal-box bg-soft-blue p-4 p-md-5">
              <h3 class="fw-bold border-bottom border-dark border-4 pb-2 mb-4 text-uppercase bg-white d-inline-block px-3 py-1 brutal-box fs-4">{{ t('about_subtitle') }}</h3>
              
              <div class="fs-5 fw-bold mb-3 text-dark" style="line-height: 1.6;">
                {{ t('about_desc1') }}
              </div>
              <div class="fs-5 fw-bold mb-4 text-dark" style="line-height: 1.6;">
                {{ t('about_desc2') }}
              </div>

              <div class="d-flex flex-column gap-2 fw-bold fs-6 mt-4 p-3 bg-white brutal-box" style="transform: rotate(1deg);">
                <div><i class="bi bi-geo-alt-fill me-2 text-main-blue"></i> <span>{{ t('about_city') }}</span></div>
                <div><i class="bi bi-envelope-fill me-2 text-main-blue"></i> Email: aripstrike@gmail.com</div>
                <div><i class="bi bi-telephone-fill me-2 text-main-blue"></i> Phone / WA: +62-858-1704-8266</div>
                <div><i class="bi bi-github me-2 text-main-blue"></i> Github: github.com/itsmebroarif</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Technical Arsenal -->
        <div class="row mt-5 pt-4 gsap-stagger-skills">
          <h3 class="fw-bold text-center text-uppercase text-white mb-4">
            <span class="bg-dark-accent px-4 py-2 brutal-box fs-3">{{ t('skills_title') }}</span>
          </h3>
          
          <div class="col-md-6 col-lg-3 mb-4">
            <div class="brutal-box bg-white p-4 h-100">
              <h4 class="fw-bold border-bottom border-dark border-3 pb-2 text-main-blue fs-5">🌐 Web & App</h4>
              <p class="mt-3 fw-bold text-dark fs-6 mb-0">HTML5, CSS3, JS (ES6+), Vue.js, React, Bootstrap 5, Tailwind CSS, Livewire, PHP, Laravel, Node.js, Golang, Python, Electron.js</p>
            </div>
          </div>
          <div class="col-md-6 col-lg-3 mb-4">
            <div class="brutal-box bg-cyan p-4 h-100">
              <h4 class="fw-bold border-bottom border-dark border-3 pb-2 text-dark fs-5">🗄️ Database & Tools</h4>
              <p class="mt-3 fw-bold text-dark fs-6 mb-0">MySQL, MariaDB, PostgreSQL, Git, GitHub, GitLab, REST API, WebSockets, NPM, Composer, Docker, Three.js</p>
            </div>
          </div>
          <div class="col-md-6 col-lg-3 mb-4">
            <div class="brutal-box bg-main-blue p-4 h-100 text-white">
              <h4 class="fw-bold border-bottom border-white border-3 pb-2 text-cyan fs-5">🎨 UI/UX Design</h4>
              <p class="mt-3 fw-bold text-white fs-6 mb-0">Figma, Adobe XD, Photoshop, Illustrator, Affinity Designer, Canva, Wireframing, Neobrutalism Design, Prototyping</p>
            </div>
          </div>
          <div class="col-md-6 col-lg-3 mb-4">
            <div class="brutal-box bg-soft-blue p-4 h-100">
              <h4 class="fw-bold border-bottom border-dark border-3 pb-2 text-dark fs-5">🎥 Media & OS</h4>
              <p class="mt-3 fw-bold text-dark fs-6 mb-0">Premiere Pro, CapCut, Sony Vegas, MS Office Suite, Windows 11, macOS, Linux (Ubuntu, Arch Linux, Nginx, Apache)</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- System & Architectural Views Showcase Section -->
    <section id="app-showcase" class="section-padding bg-soft-blue border-top border-4 border-dark">
      <div class="container my-4">
        <div class="text-center mb-5 gsap-pop">
          <h2 class="skew-title brutal-box bg-main-blue text-white fs-1">{{ t('sys_showcase_title') }}</h2>
          <p class="fw-bold fs-5 text-dark mt-2 bg-white d-inline-block px-3 py-1 brutal-box">
            {{ t('sys_showcase_sub') }}
          </p>
        </div>

        <!-- Filter tabs for views showcase -->
        <div class="d-flex justify-content-center flex-wrap gap-2 mb-4">
          <button 
            v-for="cat in showcaseCategories" 
            :key="cat.id" 
            class="brutal-btn py-2 px-3 fs-6"
            :class="activeCategory === cat.id ? 'bg-dark-accent text-white' : 'bg-white text-dark'"
            @click="activeCategory = cat.id"
          >
            {{ cat.icon }} {{ cat.name }}
          </button>
        </div>

        <div class="row g-4">
          <div 
            v-for="view in filteredShowcaseViews" 
            :key="view.id" 
            class="col-lg-6 col-xl-4 gsap-card"
          >
            <div class="brutal-box bg-white p-4 h-100 d-flex flex-column">
              <div class="d-flex justify-content-between align-items-center border-bottom border-dark border-3 pb-2 mb-3">
                <span class="badge bg-main-blue text-white fw-bold px-2.5 py-1 brutal-box fs-6">{{ view.categoryName }}</span>
                <router-link :to="view.route" class="btn btn-sm btn-outline-dark fw-bold rounded-0 border-2">
                  <i class="bi bi-box-arrow-up-right me-1"></i> Buka View
                </router-link>
              </div>

              <h4 class="fw-bold text-uppercase text-dark d-flex align-items-center gap-2 mb-2 fs-5">
                <i :class="view.icon" class="text-main-blue fs-4"></i>
                {{ view.title }}
              </h4>

              <p class="fw-bold text-dark small mb-3 flex-grow-1" style="line-height: 1.5;">
                {{ view.description }}
              </p>

              <div class="bg-light p-3 rounded-0 border border-dark border-2 mb-3">
                <div class="fw-bold text-uppercase small text-muted mb-1"><i class="bi bi-cpu-fill me-1 text-primary"></i> Tech Components & Logic:</div>
                <div class="fw-bold text-dark small">{{ view.techSpec }}</div>
              </div>

              <div class="d-flex flex-wrap gap-1 mt-auto">
                <span v-for="(tag, idx) in view.tags" :key="idx" class="badge bg-cyan text-dark border border-dark fw-bold small">
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="section-padding bg-cyan border-top border-4 border-dark">
      <div class="container">
        <div class="text-center mb-5 gsap-pop">
          <h2 class="skew-title brutal-box bg-white text-dark fs-1">{{ t('services_title') }}</h2>
          <p class="fw-bold fs-4 text-dark mt-3">{{ t('services_subtitle') }}</p>
        </div>
        
        <div class="row g-4 mt-2">
          <div class="col-lg-4 col-md-6 gsap-card">
            <div class="brutal-box bg-white p-4 h-100 text-dark">
              <i class="bi bi-laptop fs-1 text-main-blue"></i>
              <h4 class="fw-bold text-uppercase mt-3">{{ t('srv_web_title') }}</h4>
              <p class="fw-bold">{{ t('srv_web_desc') }}</p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 gsap-card">
            <div class="brutal-box bg-white p-4 h-100 text-dark">
              <i class="bi bi-phone fs-1 text-primary"></i>
              <h4 class="fw-bold text-uppercase mt-3">{{ t('srv_mob_title') }}</h4>
              <p class="fw-bold">{{ t('srv_mob_desc') }}</p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 gsap-card">
            <div class="brutal-box bg-white p-4 h-100 text-dark">
              <i class="bi bi-server fs-1 text-main-blue"></i>
              <h4 class="fw-bold text-uppercase mt-3">{{ t('srv_be_title') }}</h4>
              <p class="fw-bold">{{ t('srv_be_desc') }}</p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 gsap-card">
            <div class="brutal-box bg-white p-4 h-100 text-dark">
              <i class="bi bi-motherboard fs-1 text-primary"></i>
              <h4 class="fw-bold text-uppercase mt-3">{{ t('srv_hw_title') }}</h4>
              <p class="fw-bold">{{ t('srv_hw_desc') }}</p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 gsap-card">
            <div class="brutal-box bg-white p-4 h-100 text-dark">
              <i class="bi bi-cloud-check fs-1 text-main-blue"></i>
              <h4 class="fw-bold text-uppercase mt-3">{{ t('srv_cloud_title') }}</h4>
              <p class="fw-bold">{{ t('srv_cloud_desc') }}</p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 gsap-card">
            <div class="brutal-box bg-white p-4 h-100 text-dark">
              <i class="bi bi-shield-lock fs-1 text-primary"></i>
              <h4 class="fw-bold text-uppercase mt-3">{{ t('srv_sec_title') }}</h4>
              <p class="fw-bold">{{ t('srv_sec_desc') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience & Education Section -->
    <section id="experiences" class="section-padding bg-white border-top border-4 border-dark">
      <div class="container">
        <div class="text-center mb-5 gsap-pop">
          <h2 class="skew-title brutal-box bg-main-blue text-white fs-1">{{ t('journey_title') }}</h2>
        </div>

        <!-- Education & Certifications Row -->
        <div class="row mb-5 pb-5 border-bottom border-4 border-dark">
          <div class="col-md-6 mb-4 gsap-slide-right">
            <div class="brutal-box bg-soft-blue p-4 h-100">
              <h3 class="fw-bold text-uppercase mb-4 bg-white text-dark px-3 py-1 d-inline-block border-dark border-3 border fs-4">{{ t('edu_title') }}</h3>
              <ul class="list-unstyled fw-bold">
                <li class="mb-3 border-bottom border-2 border-dark pb-2">
                  <h5 class="fw-bold mb-1 fs-5 text-dark">Freecodecamp, US (2022-2024)</h5>
                  <span class="text-dark fs-6">{{ t('edu_desc1') }}</span>
                </li>
                <li class="mb-3 border-bottom border-2 border-dark pb-2">
                  <h5 class="fw-bold mb-1 fs-5 text-dark">SMK Taruna Bhakti Depok (2019-2022)</h5>
                  <span class="text-dark fs-6">{{ t('edu_desc2') }}</span>
                </li>
                <li class="mb-3">
                  <h5 class="fw-bold mb-1 fs-5 text-dark">SMP Yapemri Depok (2016-2019)</h5>
                  <span class="text-dark fs-6">{{ t('edu_desc3') }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="col-md-6 mb-4 gsap-slide-left">
            <div class="brutal-box bg-main-blue p-4 h-100 text-white">
              <h3 class="fw-bold text-uppercase mb-4 bg-cyan text-dark px-3 py-1 d-inline-block border-dark border-3 border fs-4">{{ t('cert_title') }}</h3>
              <div class="d-flex flex-column gap-3 fw-bold">
                <a href="https://arifpermana.vercel.app/assets/img/certificate/arif-javascript-belajarbareng.pdf" target="_blank" class="brutal-box bg-white text-dark p-3 text-decoration-none hover-up shadow-sm">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="fs-6 fw-bold">Javascript Course Contributor</span>
                    <i class="bi bi-arrow-up-right-square-fill fs-4 text-main-blue"></i>
                  </div>
                  <div class="text-secondary small mt-1">12 April 2025</div>
                </a>
                <a href="https://arifpermana.vercel.app/assets/img/certificate/arif-golang.pdf" target="_blank" class="brutal-box bg-white text-dark p-3 text-decoration-none hover-up shadow-sm">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="fs-6 fw-bold">Golang Course Contributor</span>
                    <i class="bi bi-arrow-up-right-square-fill fs-4 text-main-blue"></i>
                  </div>
                  <div class="text-secondary small mt-1">15 Maret 2025</div>
                </a>
                <a href="https://arifpermana.vercel.app/assets/img/certificate/arif-flutter.pdf" target="_blank" class="brutal-box bg-white text-dark p-3 text-decoration-none hover-up shadow-sm">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="fs-6 fw-bold">Flutter Course Contributor</span>
                    <i class="bi bi-arrow-up-right-square-fill fs-4 text-main-blue"></i>
                  </div>
                  <div class="text-secondary small mt-1">21 Desember 2024</div>
                </a>
                <a href="https://www.freecodecamp.org/certification/itsmebroarif801/javascript-algorithms-and-data-structures-v8" target="_blank" class="brutal-box bg-white text-dark p-3 text-decoration-none hover-up shadow-sm">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="fs-6 fw-bold">JS Algorithm & Data Structure</span>
                    <i class="bi bi-arrow-up-right-square-fill fs-4 text-main-blue"></i>
                  </div>
                  <div class="text-secondary small mt-1">16 Juli 2024 (US)</div>
                </a>
                <a href="https://www.freecodecamp.org/certification/itsmebroarif801/responsive-web-design" target="_blank" class="brutal-box bg-white text-dark p-3 text-decoration-none hover-up shadow-sm">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="fs-6 fw-bold">Responsive Web Design</span>
                    <i class="bi bi-arrow-up-right-square-fill fs-4 text-main-blue"></i>
                  </div>
                  <div class="text-secondary small mt-1">16 Juli 2024 (US)</div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Organizations Highlight -->
        <div class="row mb-5 justify-content-center gsap-pop">
          <div class="col-12">
            <div class="org-banner p-4 text-center">
              <div class="brutal-box bg-white d-inline-block px-4 py-3 shadow-sm">
                <h2 class="fw-bold mb-0 text-main-blue text-uppercase fs-3">
                  <i class="bi bi-diagram-3-fill me-2"></i> <span>{{ t('org_title') }}</span>
                </h2>
                <p class="fs-5 fw-bold mt-2 mb-0 text-dark">
                  Belajar Bareng <span class="badge bg-main-blue border border-2 border-dark text-white ms-1">Technical Architect</span> 
                  <span class="d-none d-md-inline px-2">||</span>
                  Karang Taruna UNIT 28 Bojong Lio <span class="badge bg-cyan border border-2 border-dark text-dark ms-1">Ketua</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Work Experience Timeline -->
        <h3 class="fw-bold text-center text-uppercase mb-5 fs-2">{{ t('exp_title') }}</h3>
        <div class="timeline">
          
          <!-- Sintesa Persada Teknologi -->
          <div class="timeline-item left-item gsap-timeline">
            <div class="brutal-box bg-main-blue p-4 text-white shadow-sm">
              <span class="badge bg-cyan brutal-box text-dark fs-6 mb-2 border-2 border-dark">2026 - Present</span>
              <h4 class="fw-bold text-uppercase fs-5">Fullstack Web Engineer</h4>
              <h5 class="text-cyan fw-bold border-bottom border-white pb-2 fs-6">@Sintesa Persada Teknologi (IT Vendor)</h5>
              <p class="fw-bold text-white mb-2 fs-6">{{ t('exp_sintesa_desc') }}</p>
              <ul class="mb-0 fw-bold ps-3 mt-2 small" style="line-height: 1.6;">
                <li><strong>Highlight Project:</strong> App Klinik Sintasi (Medica-Nexus).</li>
                <li><strong>Frontend (Vue 2 + Quasar v1):</strong> Develop fitur baru, redesign halaman (Lab, Riwayat Pasien), refaktor komponen, fix bug UI.</li>
                <li><strong>Backend (Laravel 9 + PHP 8.1):</strong> Buat/ubah endpoint API, fix logic controller, maintain services.</li>
                <li><strong>Database:</strong> MySQL (mapping tabel, query analisis).</li>
                <li><strong>Key Delivery:</strong> Validasi Anamnesa/CPPT, Checkout UGD, Print Resep Obat A5, CRUD Tarif Lab, dan Dokumentasi Teknis.</li>
              </ul>
            </div>
          </div>

          <!-- Ayasylfiette -->
          <div class="timeline-item right-item gsap-timeline">
            <div class="brutal-box bg-white p-4 text-dark shadow-sm">
              <span class="badge bg-dark-accent brutal-box text-white fs-6 mb-2">2026</span>
              <h4 class="fw-bold text-uppercase fs-5">Web Developer</h4>
              <h5 class="text-main-blue fw-bold border-bottom border-dark pb-2 fs-6">@Ayasylfiette</h5>
              <ul class="mb-0 fw-bold ps-3 small" style="line-height: 1.6;">
                <li>{{ t('exp_aya_1') }}</li>
                <li>{{ t('exp_aya_2') }}</li>
                <li>{{ t('exp_aya_3') }}</li>
              </ul>
            </div>
          </div>

          <!-- Sadaraga -->
          <div class="timeline-item left-item gsap-timeline">
            <div class="brutal-box bg-soft-blue p-4 text-dark shadow-sm">
              <span class="badge bg-dark-accent brutal-box text-white fs-6 mb-2">2025</span>
              <h4 class="fw-bold text-uppercase fs-5">Fullstack Web Engineer</h4>
              <h5 class="text-main-blue fw-bold border-bottom border-dark pb-2 fs-6">@Sadaraga (IT Vendor)</h5>
              <ul class="mb-0 fw-bold ps-3 mt-2 small" style="line-height: 1.6;">
                <li>{{ t('exp_sada_1') }}</li>
                <li><strong>Tech Stack Backend:</strong> Laravel 13 & CodeIgniter 3.</li>
                <li><strong>Tech Stack Frontend:</strong> Tailwind CSS 3 (Landing Page Development).</li>
                <li>{{ t('exp_sada_4') }}</li>
              </ul>
            </div>
          </div>

          <!-- Warkop Galaxy -->
          <div class="timeline-item right-item gsap-timeline">
            <div class="brutal-box bg-cyan p-4 text-dark shadow-sm">
              <span class="badge bg-dark-accent brutal-box text-white fs-6 mb-2">2025</span>
              <h4 class="fw-bold text-uppercase fs-5">Web Builder</h4>
              <h5 class="text-main-blue fw-bold border-bottom border-dark pb-2 fs-6">@Warkop Galaxy Jati asri</h5>
              <ul class="mb-0 fw-bold ps-3 mt-2 small" style="line-height: 1.6;">
                <li>{{ t('exp_warkop_1') }}</li>
                <li>{{ t('exp_warkop_2') }}</li>
              </ul>
            </div>
          </div>

          <!-- Konpyuta -->
          <div class="timeline-item left-item gsap-timeline">
            <div class="brutal-box bg-white p-4 text-dark shadow-sm">
              <span class="badge bg-main-blue brutal-box text-white fs-6 mb-2">2025</span>
              <h4 class="fw-bold text-uppercase fs-5">Laravel Developer</h4>
              <h5 class="text-main-blue fw-bold border-bottom border-dark pb-2 fs-6">@Konpyūtā no himitsu (JP)</h5>
              <ul class="mb-0 fw-bold ps-3 mt-2 small" style="line-height: 1.6;">
                <li>{{ t('exp_kon_1') }}</li>
                <li>{{ t('exp_kon_2') }}</li>
              </ul>
            </div>
          </div>
          
          <!-- Hangang & Multiple roles -->
          <div class="timeline-item right-item gsap-timeline">
            <div class="brutal-box bg-main-blue p-4 text-white shadow-sm">
              <span class="badge bg-cyan brutal-box text-dark fs-6 mb-2 border-2 border-dark">2025 - 2021</span>
              <h4 class="fw-bold text-uppercase fs-5">Various Roles</h4>
              <h5 class="text-cyan fw-bold border-bottom border-white pb-2 fs-6">Multiple Companies</h5>
              <ul class="mb-0 fw-bold ps-3 mt-2 small" style="line-height: 1.6;">
                <li><strong>Vue Js Dev @Hangang Solution (KR):</strong> Situs & forum belajar game dev.</li>
                <li><strong>Website Builder @Amie Jaya Motor:</strong> Situs statis dealer Yamaha.</li>
                <li><strong>Digital Speaker @Young On Top:</strong> Edukasi periklanan digital & analisis market.</li>
                <li><strong>Front-End Trainer @Kafeinarts:</strong> Mengajar HTML, CSS, JS, Vue, Bootstrap.</li>
                <li><strong>Laravel Mentor @Rumah Coding:</strong> Mengajar Blade, MVC, OOP, CRUD.</li>
                <li><strong>Remote Laravel Dev @Hallotrans:</strong> Maintenance web app & tim remote.</li>
                <li><strong>Tech Blogger @Medium:</strong> Review hardware/software & IT education.</li>
                <li><strong>Backend Dev @PT. Spero:</strong> Mengelola REST API & kolaborasi frontend.</li>
                <li><strong>Fullstack Dev @Guepedia:</strong> Pengembangan aplikasi berbasis Laravel & Vue.js.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Showcase Projects Section -->
    <section id="projects" class="section-padding bg-soft-blue border-top border-4 border-dark">
      <div class="container">
        <div class="text-center mb-5 gsap-pop">
          <h2 class="skew-title brutal-box bg-white text-dark fs-1">SHOWCASE & PROYEK</h2>
        </div>
        
        <div class="row g-4 mt-2">
          <div class="col-xl-4 col-md-6 gsap-card">
            <div class="card brutal-box bg-white h-100 p-0 text-dark">
              <div class="card-body p-4 d-flex flex-column">
                <span class="badge bg-dark-accent fs-6 mb-3 brutal-box px-3 py-2 text-white">e-rekap.vercel.app</span>
                <h3 class="card-title fw-bold text-uppercase mb-3 fs-4">📊 E-Rekap</h3>
                <div class="pt-2 border-top border-3 border-dark mt-auto fw-bold fs-6">
                  {{ t('proj_erekap') }}
                </div>
              </div>
              <a href="https://e-rekap.vercel.app/" target="_blank" class="brutal-btn bg-main-blue text-center text-white border-top border-0 border-dark border-4 fs-5" style="border-top-style: solid !important;">
                Launch App <i class="bi bi-box-arrow-up-right ms-1"></i>
              </a>
            </div>
          </div>

          <div class="col-xl-4 col-md-6 gsap-card">
            <div class="card brutal-box bg-white h-100 p-0 text-dark">
              <div class="card-body p-4 d-flex flex-column">
                <span class="badge bg-dark-accent fs-6 mb-3 brutal-box px-3 py-2 text-white">17anbojonglio.vercel.app</span>
                <h3 class="card-title fw-bold text-uppercase mb-3 fs-4">🎉 17an Bojonglio</h3>
                <div class="pt-2 border-top border-3 border-dark mt-auto fw-bold fs-6">
                  {{ t('proj_17an') }}
                </div>
              </div>
              <a href="https://17anbojonglio.vercel.app/" target="_blank" class="brutal-btn bg-cyan text-center text-dark border-top border-0 border-dark border-4 fs-5" style="border-top-style: solid !important;">
                Launch App <i class="bi bi-box-arrow-up-right ms-1"></i>
              </a>
            </div>
          </div>

          <div class="col-xl-4 col-md-6 gsap-card">
            <div class="card brutal-box bg-white h-100 p-0 text-dark">
              <div class="card-body p-4 d-flex flex-column">
                <span class="badge bg-dark-accent fs-6 mb-3 brutal-box px-3 py-2 text-white">rajinkerja-id.vercel.app</span>
                <h3 class="card-title fw-bold text-uppercase mb-3 fs-4">💼 Rajin Kerja ID</h3>
                <div class="pt-2 border-top border-3 border-dark mt-auto fw-bold fs-6">
                  {{ t('proj_rajin') }}
                </div>
              </div>
              <a href="https://rajinkerja-id.vercel.app/" target="_blank" class="brutal-btn bg-soft-blue text-center text-dark border-top border-0 border-dark border-4 fs-5" style="border-top-style: solid !important;">
                Launch App <i class="bi bi-box-arrow-up-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="section-padding bg-white border-top border-4 border-dark">
      <div class="container">
        <div class="text-center mb-5 gsap-pop">
          <h2 class="skew-title brutal-box bg-main-blue text-white fs-1">FAQ</h2>
        </div>
        
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="accordion" id="brutalAccordion">
              
              <div v-for="i in 10" :key="i" class="accordion-item brutal-box mb-3 bg-white text-dark gsap-slide-up">
                <h2 class="accordion-header">
                  <button 
                    class="accordion-button bg-soft-blue text-dark fw-bold fs-5 p-4 border-0 rounded-0" 
                    :class="{ collapsed: activeFaq !== i }"
                    type="button" 
                    @click="activeFaq = activeFaq === i ? 0 : i"
                    style="box-shadow: none;"
                  >
                    {{ t('faq_q' + i) }}
                  </button>
                </h2>
                <div :class="['accordion-collapse collapse', { show: activeFaq === i }]" class="border-top border-3 border-dark">
                  <div class="accordion-body p-4 fw-bold fs-6 bg-white" style="line-height: 1.6;">
                    {{ t('faq_a' + i) }}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact WhatsApp Section -->
    <section id="contact" class="section-padding bg-cyan position-relative border-top border-4 border-dark">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="brutal-box bg-white p-4 p-md-5 gsap-pop position-relative shadow-lg">
              <div class="brutal-box bg-main-blue position-absolute" style="width: 40px; height: 40px; top: -20px; right: -20px; transform: rotate(15deg);"></div>
              
              <h2 class="fw-bold fs-2 text-uppercase text-center mb-4 skew-title bg-main-blue text-white mx-auto d-table">
                {{ t('contact_title_raw') }} <i class="bi bi-chat-heart-fill text-cyan"></i>
              </h2>
              
              <form @submit.prevent="submitWaForm">
                <div class="row">
                  <div class="col-md-6 mb-4">
                    <label class="fw-bold text-uppercase fs-6 mb-2 text-dark">{{ t('form_name') }}</label>
                    <input type="text" v-model="waForm.name" class="form-control brutal-box p-3 fs-6" placeholder="John Doe" required />
                  </div>
                  <div class="col-md-6 mb-4">
                    <label class="fw-bold text-uppercase fs-6 mb-2 text-dark">{{ t('form_company') }}</label>
                    <input type="text" v-model="waForm.company" class="form-control brutal-box p-3 fs-6" placeholder="PT. XYZ / Personal" required />
                  </div>
                </div>
                <div class="mb-4">
                  <label class="fw-bold text-uppercase fs-6 mb-2 text-dark">{{ t('form_msg') }}</label>
                  <textarea v-model="waForm.message" class="form-control brutal-box p-3 fs-6" rows="4" placeholder="Halo Mas Arif, saya ingin berkonsultasi..." required></textarea>
                </div>
                <button type="submit" class="brutal-btn w-100 bg-main-blue fs-5 p-3 mt-2 text-white border-dark border-4">
                  <span>{{ t('form_btn') }}</span> <i class="bi bi-send-fill ms-2 text-cyan"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark-accent text-center py-5 border-top border-4 border-dark position-relative overflow-hidden">
      <div class="container position-relative z-1 text-white">
        <div class="d-flex justify-content-center flex-wrap gap-3 mb-4">
          <a href="https://itsmebroarif.medium.com" target="_blank" class="social-btn brutal-box bg-white text-dark brutal-btn px-3 py-2"><i class="bi bi-medium fs-4"></i></a>
          <a href="https://www.instagram.com/eexxvvn/" target="_blank" class="social-btn brutal-box bg-cyan text-dark brutal-btn px-3 py-2"><i class="bi bi-instagram fs-4"></i></a>
          <a href="https://linkedin.com/in/arif-permana-putrasuryana-121b761b9" target="_blank" class="social-btn brutal-box bg-main-blue text-white brutal-btn px-3 py-2"><i class="bi bi-linkedin fs-4"></i></a>
          <a href="https://wa.me/6285817048266" target="_blank" class="social-btn brutal-box bg-soft-blue text-dark brutal-btn px-3 py-2"><i class="bi bi-whatsapp fs-4"></i></a>
        </div>
        
        <p class="mb-3 fw-bold fs-4 text-uppercase skew-title bg-cyan d-inline-block text-dark px-3 py-1">© 2026 KAFEINARTS.</p>
        <p class="mb-0 fw-bold fs-5 text-uppercase">DEVELOPED & DESIGNED BY <span class="text-cyan">ITSMEBROARIF</span></p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';
// Native JS alert/confirm used for maximum compatibility

export default {
  name: 'DeveloperPortfolioView',
  setup() {
    const canvasContainer = ref(null);
    const currentLang = ref('id');
    const activeFaq = ref(1);
    const activeCategory = ref('all');

    const waForm = reactive({
      name: '',
      company: '',
      message: ''
    });

    // 3D Three.js variables
    let scene, camera, renderer, animationFrameId;
    let icoWire, torusWire, sphereWire;
    let mouseX = 0, mouseY = 0;

    const onMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.005;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.005;
    };

    const onResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const initThreeCanvas = () => {
      if (!canvasContainer.value) return;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 25;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      canvasContainer.value.appendChild(renderer.domElement);

      const matMainBlue = new THREE.LineBasicMaterial({ color: 0x1269cc, linewidth: 2 });
      const matCyan = new THREE.LineBasicMaterial({ color: 0x51eefc, linewidth: 2 });
      const matDark = new THREE.LineBasicMaterial({ color: 0x303030, linewidth: 1, transparent: true, opacity: 0.15 });

      const icoGeometry = new THREE.IcosahedronGeometry(8, 0);
      icoWire = new THREE.LineSegments(new THREE.WireframeGeometry(icoGeometry), matMainBlue);
      icoWire.position.set(15, 10, -5);
      scene.add(icoWire);

      const torusGeometry = new THREE.TorusKnotGeometry(7, 2, 64, 8);
      torusWire = new THREE.LineSegments(new THREE.WireframeGeometry(torusGeometry), matCyan);
      torusWire.position.set(-18, -12, -10);
      scene.add(torusWire);

      const sphereWireGeo = new THREE.SphereGeometry(20, 8, 8);
      sphereWire = new THREE.LineSegments(new THREE.WireframeGeometry(sphereWireGeo), matDark);
      scene.add(sphereWire);

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('resize', onResize);

      const clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        if (icoWire) {
          icoWire.rotation.x += 0.002;
          icoWire.rotation.y += 0.003;
          icoWire.position.y = 10 + Math.sin(elapsedTime * 0.5) * 3;
        }

        if (torusWire) {
          torusWire.rotation.x -= 0.003;
          torusWire.rotation.y -= 0.002;
          torusWire.position.y = -12 + Math.cos(elapsedTime * 0.4) * 3;
        }

        if (sphereWire) {
          sphereWire.rotation.y += 0.001;
        }

        renderer.render(scene, camera);
      };

      animate();
    };

    onMounted(() => {
      initThreeCanvas();

      // GSAP Animations
      try {
        gsap.from('.gsap-hero-el', {
          y: 80,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out'
        });
      } catch (e) {
        console.warn('GSAP init notice:', e);
      }
    });

    onUnmounted(() => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer && renderer.domElement) {
        renderer.domElement.remove();
      }
    });

    const setLanguage = (lang) => {
      currentLang.value = lang;
    };

    // Dictionary of translations
    const translations = {
      id: {
        nav_home: "Beranda",
        nav_about: "Tentang",
        nav_system: "Arsitektur App",
        nav_services: "Layanan",
        nav_journey: "Perjalanan",
        nav_projects: "Proyek",
        nav_faq: "FAQ",
        nav_contact: "Kontak",
        hero_role: "FULLSTACK WEB DEV & UI/UX DESIGNER",
        hero_quote: "\"Inovatif dan bekerja dengan tenggat waktu, merancang dan mengembangkan solusi digital yang berpusat pada pengguna, mulai dari konsep awal hingga hasil akhir yang sempurna.\"",
        hero_btn: "Jelajahi Ceritaku",
        hero_app_btn: "Lihat Arsitektur App",
        about_title: "TENTANG SAYA",
        about_status_title: "STATUS",
        about_status_val: "READY TO WORK 🔥",
        about_subtitle: "Sang Arsitek Digital 💻",
        about_desc1: "Saya adalah seorang full stack web developer berbakat dan berpengalaman. Saya ahli dalam pengembangan web dan aplikasi, termasuk front-end dan back-end. Dengan keahlian di berbagai teknologi Vue.js, Laravel, dan ahli didalam administrasi basis data menggunakan MySQL, saya mampu menciptakan solusi digital yang inovatif dan efisien.",
        about_desc2: "Selain itu, saya juga seorang UI/UX Designer yang berfokus pada menciptakan antarmuka pengguna yang menarik, intuitif, dan memberikan pengalaman optimal. Kombinasi ini membuat saya mampu menghasilkan solusi digital yang tidak hanya fungsional tetapi juga estetis dan user-friendly.",
        about_city: "Kota: Depok, Jawa Barat",
        skills_title: "Technical Arsenal",
        sys_showcase_title: "ARSITEKTUR & KOMPONEN APP",
        sys_showcase_sub: "Analisis mendalam per tiap view dan komponen yang membangun sistem RajinKerja.id",
        services_title: "LAYANAN",
        services_subtitle: "Solusi digital inovatif untuk kebutuhan bisnis Anda.",
        srv_web_title: "Pengembangan Web",
        srv_web_desc: "Membangun situs web modern dan responsif dengan teknologi Vue, React, & Laravel terbaru.",
        srv_mob_title: "Pengembangan Mobile",
        srv_mob_desc: "Menciptakan aplikasi mobile yang ramah pengguna untuk platform Android dan iOS.",
        srv_be_title: "Pengembangan Backend",
        srv_be_desc: "Menyediakan solusi backend yang kuat, aman, dan skalabel (Node.js, Golang, PHP).",
        srv_hw_title: "Ahli Hardware",
        srv_hw_desc: "Memelihara dan melakukan instalasi hardware dengan keahlian serta ketelitian tinggi.",
        srv_cloud_title: "Cloud Development",
        srv_cloud_desc: "Menawarkan layanan integrasi cloud yang andal untuk infrastruktur bisnis Anda.",
        srv_sec_title: "Keamanan Sistem",
        srv_sec_desc: "Mengimplementasikan solusi jaringan yang aman dan efisien untuk infrastruktur Anda.",
        journey_title: "PERJALANAN & RESUME",
        edu_title: "🎓 Pendidikan",
        cert_title: "🏆 Sertifikasi",
        edu_desc1: "Fokus bootcamp algoritma javascript, struktur data, dan responsive web design.",
        edu_desc2: "Rekayasa Perangkat Lunak. Berfokus pada pengembangan Laravel dan Vue.js PWA.",
        edu_desc3: "Basic Computer Science & HTML/CSS Otodidak.",
        org_title: "ORGANISASI",
        exp_title: "PENGALAMAN KERJA",
        exp_sintesa_desc: "Mengelola ekosistem sistem informasi Rumah Sakit, Puskesmas, dan Klinik.",
        exp_aya_1: "Membuat website untuk penjualan assets vtuber.",
        exp_aya_2: "Membuat Fitur Terkoneksi Dengan E-commerce.",
        exp_aya_3: "Mengintegrasikan ke WhatsApp untuk konsultasi dan pemesanan.",
        exp_sada_1: "Mengembangkan website pendaftaran marathon & platform serving result hasil lari peserta.",
        exp_sada_4: "Membuat sistem berbasis C# Untuk kebutuhan BIB Checking.",
        exp_warkop_1: "Mengembangkan website dan periklanan berbasis web.",
        exp_warkop_2: "Memberikan akses visibilitas di Google.",
        exp_kon_1: "Mengembangkan website kursus komputer dengan integrasi direct WA.",
        exp_kon_2: "Ikut serta dalam pengembangan materi ilmu komputer.",
        proj_erekap: "Aplikasi web (SPA) untuk rekapitulasi data digital yang cepat dan otomatis.",
        proj_17an: "Platform manajemen event dan pendaftaran lomba untuk kemerdekaan RI.",
        proj_rajin: "Portal HR profesional untuk absen, pelacakan jam kerja, dan manajemen tugas.",
        faq_q1: "Apakah Arif menerima project freelance / kolaborasi?",
        faq_a1: "Tentu saja! Mengingat status saya 'Ready To Work', saya sangat terbuka untuk proyek pembuatan Website, aplikasi backend, hingga desain grafis (UI/UX).",
        faq_q2: "Tech Stack apa yang paling utama digunakan?",
        faq_a2: "Saya sangat mahir menggunakan ekosistem Vue.js (termasuk Quasar) di frontend, dan ekosistem Laravel (PHP) atau Golang di backend.",
        faq_q3: "Bisa membuat UI/UX design dari awal sebelum coding?",
        faq_a3: "Ya! Saya menggunakan Figma dan Adobe Suite untuk merancang antarmuka (UI/UX) sebelum masuk ke tahap pengembangan (coding) untuk memastikan desain sesuai ekspektasi.",
        faq_q4: "Berapa lama estimasi waktu pengerjaan 1 website?",
        faq_a4: "Sangat bergantung pada kompleksitas fitur. Landing page biasa memakan waktu 3-7 hari. Namun sistem skala besar (seperti SIMRS/Portal HR) butuh waktu berminggu-minggu hingga berbulan-bulan.",
        faq_q5: "Apakah menerima maintenance / refactoring website lama?",
        faq_a5: "Tentu, dengan pengalaman mengelola sistem klinik dan marathon, saya terbiasa melakukan refactoring kode lama, memperbaiki bug UI, dan optimasi query database.",
        faq_q6: "Bagaimana sistem pembayaran untuk project freelance?",
        faq_a6: "Umumnya menggunakan sistem Termin. Down Payment (DP) 50% di awal sebelum project dimulai, dan pelunasan 50% setelah project diserahkan atau live.",
        faq_q7: "Apakah bisa membantu setup Server / VPS untuk deployment?",
        faq_a7: "Bisa! Saya memiliki keahlian di lingkungan Linux (Ubuntu, dll) untuk setup VPS, konfigurasi web server (Nginx/Apache), dan deployment arsitektur Cloud.",
        faq_q8: "Berdomisili di mana? Apakah bersedia WFO (Work From Office)?",
        faq_a8: "Saya berbasis di Depok, Jawa Barat. Saya memprioritaskan pekerjaan Remote / WFA, namun sangat terbuka untuk skema Hybrid (WFO beberapa hari) jika lokasinya terjangkau.",
        faq_q9: "Apa kelebihan menggunakan kombinasi Vue.js dan Laravel?",
        faq_a9: "Kombinasi ini menjamin keamanan backend tingkat tinggi (Laravel) sekaligus pengalaman pengguna yang instan tanpa loading lama di sisi frontend (Vue.js SPA).",
        faq_q10: "Apakah klien akan mendapatkan Source Code secara penuh?",
        faq_a10: "Tentu, seluruh repository dan Source Code sepenuhnya menjadi milik klien setelah tahap pelunasan project selesai, lengkap dengan dokumentasi.",
        contact_title_raw: "MARI TERHUBUNG",
        form_name: "Nama Anda",
        form_company: "Instansi / Perusahaan",
        form_msg: "Pesan Anda",
        form_btn: "KIRIM VIA WHATSAPP"
      },
      en: {
        nav_home: "Home",
        nav_about: "About",
        nav_system: "App Architecture",
        nav_services: "Services",
        nav_journey: "Journey",
        nav_projects: "Projects",
        nav_faq: "FAQ",
        nav_contact: "Contact",
        hero_role: "FULLSTACK WEB DEV & UI/UX DESIGNER",
        hero_quote: "\"Innovative and working with deadlines, designing and developing user-centric digital solutions from initial concept to a perfect final result.\"",
        hero_btn: "Discover My Story",
        hero_app_btn: "View App Architecture",
        about_title: "ABOUT ME",
        about_status_title: "STATUS",
        about_status_val: "READY TO WORK 🔥",
        about_subtitle: "The Digital Architect 💻",
        about_desc1: "I am a talented and experienced full stack web developer. I excel in web and application development, covering both front-end and back-end. With expertise in Vue.js, Laravel, and solid database administration using MySQL, I create innovative and efficient digital solutions.",
        about_desc2: "Additionally, I am a UI/UX Designer focused on creating attractive, intuitive, and optimal user interfaces. This combination allows me to deliver digital solutions that are functional, aesthetically pleasing, and user-friendly.",
        about_city: "City: Depok, West Java",
        skills_title: "Technical Arsenal",
        sys_showcase_title: "APP ARCHITECTURE & VIEWS SHOWCASE",
        sys_showcase_sub: "In-depth breakdown of every view and component building RajinKerja.id OS",
        services_title: "SERVICES",
        services_subtitle: "Innovative digital solutions for your business needs.",
        srv_web_title: "Web Development",
        srv_web_desc: "Building modern and responsive websites with the latest Vue, React, & Laravel tech.",
        srv_mob_title: "Mobile Development",
        srv_mob_desc: "Creating user-friendly mobile applications for Android and iOS platforms.",
        srv_be_title: "Backend Development",
        srv_be_desc: "Providing robust, secure, and scalable backend solutions (Node.js, Golang, PHP).",
        srv_hw_title: "Hardware Expert",
        srv_hw_desc: "Maintaining and installing hardware with high expertise and precision.",
        srv_cloud_title: "Cloud Development",
        srv_cloud_desc: "Offering reliable cloud integration services for your business infrastructure.",
        srv_sec_title: "System Security",
        srv_sec_desc: "Implementing secure and efficient network solutions for your infrastructure.",
        journey_title: "JOURNEY & RESUME",
        edu_title: "🎓 Education",
        cert_title: "🏆 Certifications",
        edu_desc1: "Focused on Javascript algorithms, data structures, and responsive web design.",
        edu_desc2: "Software Engineering. Focused on Laravel and Vue.js PWA development.",
        edu_desc3: "Basic Computer Science & self-taught HTML/CSS.",
        org_title: "ORGANIZATIONS",
        exp_title: "WORK EXPERIENCES",
        exp_sintesa_desc: "Managing information system ecosystems for Hospitals and Clinics.",
        exp_aya_1: "Created a website for selling vtuber assets.",
        exp_aya_2: "Built features connected to E-commerce.",
        exp_aya_3: "Integrated WhatsApp for consultation and ordering.",
        exp_sada_1: "Developed a marathon registration website & runner results serving platform.",
        exp_sada_4: "Created a C#-based system for BIB Checking needs.",
        exp_warkop_1: "Developed website and web-based advertising.",
        exp_warkop_2: "Provided Google search visibility access.",
        exp_kon_1: "Developed a computer course website with direct WA integration.",
        exp_kon_2: "Participated in developing computer science materials.",
        proj_erekap: "A web application (SPA) for fast and automated digital data recapitulation.",
        proj_17an: "Event management and competition registration platform for Independence Day.",
        proj_rajin: "Professional HR portal for attendance, work hour tracking, and task management.",
        faq_q1: "Does Arif accept freelance / collaboration projects?",
        faq_a1: "Absolutely! Given my 'Ready To Work' status, I am very open to Website creation, backend apps, and graphic design (UI/UX) projects.",
        faq_q2: "What is your main Tech Stack?",
        faq_a2: "I am highly proficient with the Vue.js ecosystem (including Quasar) on the frontend, and Laravel (PHP) or Golang on the backend.",
        faq_q3: "Can you create UI/UX designs from scratch before coding?",
        faq_a3: "Yes! I use Figma and Adobe Suite to design interfaces before moving to the development phase.",
        faq_q4: "What is the estimated time to build 1 website?",
        faq_a4: "It depends on complexity. Landing pages take 3-7 days. Large-scale systems take weeks to months.",
        faq_q5: "Do you accept maintenance / refactoring of old websites?",
        faq_a5: "Certainly, I am accustomed to refactoring old code, fixing UI bugs, and optimizing databases.",
        faq_q6: "How does the payment system work for freelance projects?",
        faq_a6: "Term system. 50% Down Payment upfront before the project starts, and the remaining 50% upon handover.",
        faq_q7: "Can you help set up Servers / VPS for deployment?",
        faq_a7: "Yes! I am skilled in Linux environments for VPS setup, web servers, and Cloud architecture deployment.",
        faq_q8: "Where are you based? Are you willing to WFO?",
        faq_a8: "Based in Depok. Prioritize Remote/WFA, but open to Hybrid if the location is accessible.",
        faq_q9: "What are the benefits of using Vue.js and Laravel together?",
        faq_a9: "Guarantees top-tier backend security (Laravel) along with instant, seamless frontend UX without slow loading (Vue SPA).",
        faq_q10: "Will the client get the full Source Code?",
        faq_a10: "Yes, the entire repository and Source Code are fully owned by the client after full payment.",
        contact_title_raw: "LET'S CONNECT",
        form_name: "Your Name",
        form_company: "Company / Personal",
        form_msg: "Your Message",
        form_btn: "SEND VIA WHATSAPP"
      },
      jp: {
        nav_home: "ホーム",
        nav_about: "私について",
        nav_system: "アプリ構造",
        nav_services: "サービス",
        nav_journey: "経歴",
        nav_projects: "プロジェクト",
        nav_faq: "FAQ",
        nav_contact: "連絡先",
        hero_role: "フルスタックエンジニア & UI/UXデザイナー",
        hero_quote: "「納期を守り、ユーザー中心のデジタルソリューションを初期の構想から完璧な最終結果まで設計・開発します。」",
        hero_btn: "ストーリーを見る",
        hero_app_btn: "アプリ構造を見る",
        about_title: "私について",
        about_status_title: "ステータス",
        about_status_val: "就業可能 🔥",
        about_subtitle: "デジタルアーキテクト 💻",
        about_desc1: "私は才能豊かで経験豊富なフルスタックウェブ開発者です。フロントエンドとバックエンドの両方を網羅するウェブおよびアプリ開発を得意としています。Vue.js、Laravelなどの技術やMySQLデータベース管理の専門知識を活かし、革新的で効率的なソリューションを作成します。",
        about_desc2: "さらに、魅力的で直感的なUI/UXの設計に焦点を当てたデザイナーでもあります。この組み合わせにより、機能的であるだけでなく、美しくユーザーフレンドリーなデジタルソリューションを提供できます。",
        about_city: "都市: 西ジャワ州、デポック",
        skills_title: "技術スタック",
        sys_showcase_title: "アプリの構造と各画面の解説",
        sys_showcase_sub: "RajinKerja.id OSを構築する各コンポーネントとViewの完全分析",
        services_title: "サービス",
        services_subtitle: "ビジネスニーズに向けた革新的なデジタルソリューション。",
        srv_web_title: "ウェブ開発",
        srv_web_desc: "最新のVue、React、Laravel技術を使用したモダンでレスポンシブなウェブサイトの構築。",
        srv_mob_title: "モバイル開発",
        srv_mob_desc: "AndroidおよびiOS向けの使いやすいモバイルアプリの作成。",
        srv_be_title: "バックエンド開発",
        srv_be_desc: "堅牢で安全、かつスケーラブルなバックエンドソリューションの提供。",
        srv_hw_title: "ハードウェアエキスパート",
        srv_hw_desc: "高い専門知識と精度でのハードウェアの保守とインストール。",
        srv_cloud_title: "クラウド開発",
        srv_cloud_desc: "ビジネスインフラ向けの信頼できるクラウド統合サービスの提供。",
        srv_sec_title: "システムセキュリティ",
        srv_sec_desc: "インフラ向けの安全で効率的なネットワークソリューションの実装。",
        journey_title: "経歴と履歴書",
        edu_title: "🎓 教育",
        cert_title: "🏆 資格",
        edu_desc1: "Javascriptアルゴリズム、データ構造、レスポンシブウェブデザインに焦点を当てたブートキャンプ。",
        edu_desc2: "ソフトウェアエンジニアリング。LaravelおよびVue.js PWA開発に特化。",
        edu_desc3: "独学による基礎的なコンピュータサイエンスとHTML/CSS。",
        org_title: "所属組織",
        exp_title: "職務経歴",
        exp_sintesa_desc: "病院やクリニック向けの情報システムエコシステムの管理。",
        exp_aya_1: "Vtuberアセット販売用のウェブサイト作成。",
        exp_aya_2: "Eコマースに接続された機能の構築。",
        exp_aya_3: "相談や注文のためのWhatsApp統合。",
        exp_sada_1: "マラソン登録ウェブサイトおよびランナー結果提供プラットフォームの開発。",
        exp_sada_4: "BIBチェック用のC#ベースのシステム作成。",
        exp_warkop_1: "ウェブサイトおよびウェブベースの広告開発。",
        exp_warkop_2: "Google検索での可視性アクセスを提供。",
        exp_kon_1: "直接WA統合を伴うコンピュータコースウェブサイトの開発。",
        exp_kon_2: "コンピュータサイエンス教材の開発に参加。",
        proj_erekap: "自動化されたデジタルデータ集計のための超高速ウェブアプリ(SPA)。",
        proj_17an: "独立記念日のためのイベント管理および競技参加登録プラットフォーム。",
        proj_rajin: "勤怠、労働時間追跡、タスク管理のためのプロの人事ポータル。",
        faq_q1: "フリーランスやコラボレーションの案件は受けていますか？",
        faq_a1: "はい！「就業可能」な状態ですので、ウェブサイト作成やUI/UXデザインの案件を大歓迎しています。",
        faq_q2: "メインの技術スタックは何ですか？",
        faq_a2: "フロントエンドではVue.js（Quasar含む）、バックエンドではLaravel（PHP）やGolangに非常に精通しています。",
        faq_q3: "コーディング前にゼロからUI/UXデザインを作成できますか？",
        faq_a3: "はい！開発段階に入る前に、FigmaとAdobe Suiteを使用してインターフェースを設計します。",
        faq_q4: "1つのウェブサイトを構築するのにどれくらい時間がかかりますか？",
        faq_a4: "複雑さによります。ランディングページは3〜7日。大規模システムは数週間から数ヶ月かかります。",
        faq_q5: "古いウェブサイトの保守やリファクタリングは受けていますか？",
        faq_a5: "もちろん、古いコードのリファクタリング、UIのバグ修正、データベースの最適化には慣れています。",
        faq_q6: "フリーランスのプロジェクトの支払いシステムはどうなっていますか？",
        faq_a6: "分割払いです。プロジェクト開始前に50％の頭金、納品時に残り50％となります。",
        faq_q7: "展開のためのサーバー/VPSのセットアップは手伝ってもらえますか？",
        faq_a7: "はい！VPSのセットアップやクラウドインフラの構築など、Linux環境に熟練しています。",
        faq_q8: "拠点はどこですか？オフィス出社（WFO）は可能ですか？",
        faq_a8: "デポックを拠点としています。リモート作業を優先しますが、アクセス可能であればハイブリッドも歓迎します。",
        faq_q9: "Vue.jsとLaravelを一緒に使うメリットは何ですか？",
        faq_a9: "Laravelによる高いバックエンドセキュリティと、Vue SPAによるロード時間のない高速なフロントエンド体験を保証します。",
        faq_q10: "クライアントはソースコードを完全に受け取ることができますか？",
        faq_a10: "はい。全額支払い後、リポジトリとソースコードは完全にクライアントの所有となります。",
        contact_title_raw: "連絡しましょう",
        form_name: "お名前",
        form_company: "会社名 / 個人",
        form_msg: "メッセージ",
        form_btn: "WHATSAPPで送信"
      }
    };

    const t = (key) => {
      if (translations[currentLang.value] && translations[currentLang.value][key]) {
        return translations[currentLang.value][key];
      }
      return translations.id[key] || key;
    };

    // Showcase categories & views breakdown
    const showcaseCategories = [
      { id: 'all', name: 'Semua Views', icon: '⚡' },
      { id: 'workflow', name: 'Workflow & Proyek', icon: '📌' },
      { id: 'team', name: 'Tim & Chat', icon: '👥' },
      { id: 'finance', name: 'Keuangan & Data', icon: '💰' },
      { id: 'agenda', name: 'Agenda & Habit', icon: '📅' },
      { id: 'system', name: 'System & Tools', icon: '⚙️' }
    ];

    const showcaseViews = [
      {
        id: 'home',
        category: 'workflow',
        categoryName: 'Workflow & Proyek',
        route: '/',
        icon: 'bi bi-grid-1x2-fill',
        title: 'HomeView (Executive Dashboard)',
        description: 'Pusat komando eksekutif yang menampilkan ringkasan metrik harian, statistik tugas pending, progres proyek aktif, kalender singkat, dan status budget keuangan secara real-time.',
        techSpec: 'Vue 3 Composition API, Vuex Store Computed Getters, Responsive Grid Cards, Reactive Stat Widgets',
        tags: ['Vuex', 'Dashboard', 'Metrics', 'RealTime']
      },
      {
        id: 'todo',
        category: 'workflow',
        categoryName: 'Workflow & Proyek',
        route: '/todo',
        icon: 'bi bi-kanban-fill',
        title: 'todoList (To-Do & Kanban Board)',
        description: 'Manajemen tugas komprehensif dengan tampilan Dual Mode: Daftar Interaktif & Papan Kanban (To-Do, In Progress, Review, Done). Dilengkapi filter prioritas, tag kustom, serta deadline counter.',
        techSpec: 'HTML5 Drag & Drop API, Filter Matrix, Vuex Dispatchers, LocalStorage State Sync',
        tags: ['Kanban', 'DragDrop', 'Filter', 'LocalStorage']
      },
      {
        id: 'project',
        category: 'workflow',
        categoryName: 'Workflow & Proyek',
        route: '/project',
        icon: 'bi bi-folder-fill',
        title: 'projectManagement (Proyek & Kontrak)',
        description: 'Sistem pelacakan siklus proyek, anggaran kontrak client, milestoning timeline, penetapan anggota tim, hingga persentase pencapaian progress proyek.',
        techSpec: 'Dynamic Milestone Calculators, Multi-status Pipeline, Currency Formatters',
        tags: ['Projects', 'Milestones', 'Pipeline', 'ClientContract']
      },
      {
        id: 'camera',
        category: 'workflow',
        categoryName: 'Workflow & Proyek',
        route: '/camera',
        icon: 'bi bi-camera-fill',
        title: 'CameraScannerView (Kamera & OCR Scan)',
        description: 'Scanner dokumen digital berbasis WebRTC kamera browser. Mampu menangkap foto dokumen, mengaplikasikan filter grayscale/contrast, dan menyimpannya sebagai catatan terlampir.',
        techSpec: 'navigator.mediaDevices.getUserMedia, HTML5 Canvas 2D Context, DataURL Converter',
        tags: ['WebRTC', 'CameraAPI', 'CanvasFilter', 'DocScanner']
      },
      {
        id: 'surat',
        category: 'workflow',
        categoryName: 'Workflow & Proyek',
        route: '/surat',
        icon: 'bi bi-file-earmark-text-fill',
        title: 'SuratBuilderView (Surat Generator & WA Export)',
        description: 'Pembuat surat resmi otomatis lengkap dengan Kop Surat, tanggal dinamis, format penandatangan, ekspor PDF/Print instan, serta fitur pengiriman pesan teks langsung ke WhatsApp Kontak Tim.',
        techSpec: 'Vue Reactive Form Engine, CSS Print Breakpoint Stylesheet, wa.me URL Formatter & Contact Picker',
        tags: ['SuratGenerator', 'PrintPDF', 'WhatsAppExport', 'KopSurat']
      },
      {
        id: 'cv',
        category: 'workflow',
        categoryName: 'Workflow & Proyek',
        route: '/cv',
        icon: 'bi bi-person-vcard-fill',
        title: 'CvBuilderView (ATS CV & Resume Builder)',
        description: 'Perakit resume profesional ATS-friendly & Creative CV. Dilengkapi live preview interaktif, preset template tata letak, input riwayat kerja, pendidikan, dan tombol cetak siap kerja.',
        techSpec: 'A4 Page Paper Layout CSS, Live Reactive Data Binding, Dynamic Skill Pill Renderer',
        tags: ['CVBuilder', 'ATSResume', 'LivePreview', 'A4PaperCSS']
      },
      {
        id: 'contacts',
        category: 'team',
        categoryName: 'Tim & Komunikasi',
        route: '/contacts',
        icon: 'bi bi-person-lines-fill',
        title: 'ContactsView (Kontak Tim & Broadcast WA)',
        description: 'Buku alamat digital terpusat untuk tim internal dan client luar. Memungkinkan pencarian cepat, pengelompokan divisi, serta Broadcast WhatsApp dengan template pesan khusus.',
        techSpec: 'Vuex Contacts Module, Phone Normalizer (08 -> 628), Dynamic Search Matrix',
        tags: ['AddressBook', 'WABroadcast', 'TeamMembers', 'ClientDirectory']
      },
      {
        id: 'chat-ai',
        category: 'team',
        categoryName: 'Tim & Komunikasi',
        route: '/chat-ai',
        icon: 'bi bi-robot',
        title: 'LiveChatAiView (Gemini AI Assistant)',
        description: 'Asisten AI cerdas berbasis Google Gemini SDK untuk konsultasi strategi pekerjaan, generasi kode, perangkuman dokumen, dan solusi otomatisasi tugas harian.',
        techSpec: '@google/genai SDK Integration, Streaming Markdown Parser, Server-side API Proxy',
        tags: ['GeminiAI', 'LLMChat', 'MarkdownParser', 'AiAssistant']
      },
      {
        id: 'finance',
        category: 'finance',
        categoryName: 'Keuangan & Data',
        route: '/finance',
        icon: 'bi bi-wallet2',
        title: 'moneyTracker (Keuangan & Cashflow)',
        description: 'Buku kas digital pencatat pemasukan & pengeluaran usaha. Dilengkapi visualisasi saldo, analisis kategori biaya, batas alokasi anggaran, dan peringatan Over Budget otomatis.',
        techSpec: 'Vuex Financial Ledger Engine, IDR Currency Formatter, Category Aggregators',
        tags: ['Cashflow', 'Ledger', 'BudgetAlert', 'IDRCurrency']
      },
      {
        id: 'invoice',
        category: 'finance',
        categoryName: 'Keuangan & Data',
        route: '/invoice',
        icon: 'bi bi-receipt',
        title: 'InvoiceView (Invoice Generator PDF)',
        description: 'Pembuat tagihan profesional untuk client. Mendukung Rincian Item Barang/Jasa, Perhitungan PPN/Pajak, Diskon, Metode Pembayaran Bank, dan Ekspor Cetak PDF resmi.',
        techSpec: 'Dynamic Table Row Cloner, Tax/Discount Calculator, PDF Print Target Area',
        tags: ['InvoicePDF', 'TaxCalc', 'BillingItem', 'ClientInvoice']
      },
      {
        id: 'sql',
        category: 'finance',
        categoryName: 'Keuangan & Data',
        route: '/sql',
        icon: 'bi bi-database-fill-gear',
        title: 'SqlExportView (SQL Runner & Exporter)',
        description: 'Perkakas ekspor data sistem dalam format skema SQL DDL/DML, JSON, atau CSV untuk backup database MySQL/MariaDB dan integrasi backend tanpa ribet.',
        techSpec: 'Raw SQL DDL/INSERT Generator, Blob File Downloader, Schema Inspector',
        tags: ['SQLGenerator', 'DatabaseBackup', 'CSVExport', 'DataMigration']
      },
      {
        id: 'insights',
        category: 'agenda',
        categoryName: 'Agenda & Habit',
        route: '/productivity-insights',
        icon: 'bi bi-bar-chart-line-fill',
        title: 'ProductivityInsightsView (D3.js Charts)',
        description: 'Visualisasi analitik performa kerja menggunakan grafik SVG interaktif D3.js. Menampilkan kecepatan penyelesaian tugas (Task Velocity), distribusi kategori, dan trend produktivitas mingguan.',
        techSpec: 'D3.js v7 Data Visualization, Dynamic SVG Bar/Pie/Line Chart Generators',
        tags: ['D3js', 'SVGCharts', 'ProductivityMetrics', 'DataAnalytics']
      },
      {
        id: 'quick-capture',
        category: 'agenda',
        categoryName: 'Agenda & Habit',
        route: '/quick-capture',
        icon: 'bi bi-lightning-charge-fill',
        title: 'QuickCaptureView (Quick Capture & Alarms)',
        description: 'Fitur penangkap ide cepat berbasis suara/teks beserta pengatur alarm pengingat instan agar tidak ada tugas kritis yang terlewatkan dalam rutinitas kerja padat.',
        techSpec: 'Web Speech Recognition API fallback, Local Alarm Timer Loop, Audio Synthesizer',
        tags: ['QuickNotes', 'VoiceCapture', 'AlarmSuite', 'InstantCapture']
      },
      {
        id: 'calendar',
        category: 'agenda',
        categoryName: 'Agenda & Habit',
        route: '/calendar',
        icon: 'bi bi-calendar3',
        title: 'CalendarView (Kalender & Agenda Timed)',
        description: 'Tampilan kalender bulanan & mingguan interaktif untuk merencanakan rapat, tenggat waktu proyek, dan jadwal acara penting dengan indikator warna status.',
        techSpec: 'Custom Grid Date Algorithm, Event Overlap Manager, Vuex Events Dispatcher',
        tags: ['CalendarGrid', 'AgendaScheduler', 'EventsFilter', 'DatePicker']
      },
      {
        id: 'time-suite',
        category: 'agenda',
        categoryName: 'Agenda & Habit',
        route: '/time-suite',
        icon: 'bi bi-clock-history',
        title: 'TimeSuiteView (Pomodoro & Focus Timer)',
        description: 'Aplikasi manajemen waktu metode Pomodoro (25m Fokus / 5m Istirahat), Stopwatch presisi tinggi, Timer Hitung Mundur, dan statistik durasi fokus harian.',
        techSpec: 'Web Worker Precision Interval, Audio Alert Beep Synthesizer, Session Streak Tracker',
        tags: ['Pomodoro', 'FocusTimer', 'Stopwatch', 'AudioAlert']
      },
      {
        id: 'selfie',
        category: 'agenda',
        categoryName: 'Agenda & Habit',
        route: '/selfie',
        icon: 'bi bi-camera-reels-fill',
        title: 'SelfieHappinessView (Selfie Mood & Drive Sync)',
        description: 'Pengabadi momen kebahagiaan saat berhasil menyelesaikan tugas berat via kamera, dilengkapi catatan rasa syukur dan integrasi backup cloud.',
        techSpec: 'MediaStream WebRTC, Canvas Image Snapshot Engine, Cloud Drive Sync Bridge',
        tags: ['HappinessLog', 'CameraCapture', 'GratitudeJournal', 'DriveSync']
      },
      {
        id: 'mood',
        category: 'agenda',
        categoryName: 'Agenda & Habit',
        route: '/mood',
        icon: 'bi bi-emoji-smile-fill',
        title: 'MoodAlarmView (Kamera Mood & Alarm Kerja)',
        description: 'Monitor tingkat kelelahan dan ekspresi emosi saat bekerja di depan laptop. Memberikan rekomendasi istirahat dan bunyi alarm jika terdeteksi stres berlebih.',
        techSpec: 'WebRTC Video Stream, Expression Feature Vector Calculations, Rest Break Sound Alert',
        tags: ['MoodTracker', 'HealthAlarm', 'RestReminder', 'WebRTCStream']
      },
      {
        id: 'notes',
        category: 'agenda',
        categoryName: 'Agenda & Habit',
        route: '/notes',
        icon: 'bi bi-journal-text',
        title: 'StickyNotesView (Notes & Sticky Scratchpad)',
        description: 'Papan catatan tempel digital warna-warni untuk mencoret memo singkat, daftar belanjaan, atau instruksi cepat yang bisa ditempel bebas di layar.',
        techSpec: 'Drag & Drop Canvas Position, Rich Text Markup Parsing, Color Palette Picker',
        tags: ['StickyNotes', 'Scratchpad', 'MemoBoard', 'ColorTheme']
      },
      {
        id: 'code-notes',
        category: 'agenda',
        categoryName: 'Agenda & Habit',
        route: '/code-notes',
        icon: 'bi bi-code-slash',
        title: 'CodeNotesView (Code Snippets & Tech Notes)',
        description: 'Buku catatan khusus potongan kode program (PHP, JS, SQL, Go) dengan syntax highlighting, pencarian kata kunci, dan tombol Salin Kode satu kali klik.',
        techSpec: 'Clipboard API Integration, Code Syntax Parser, Tag-based Code Filter',
        tags: ['CodeSnippets', 'DeveloperNotes', 'CopyCode', 'SyntaxHighlight']
      },
      {
        id: 'games',
        category: 'agenda',
        categoryName: 'Agenda & Habit',
        route: '/games',
        icon: 'bi bi-controller',
        title: 'GamesView (3D Games & Simulator Arcade)',
        description: 'Koleksi 9 game 3D interaktif berbasis Three.js (CyberRacer, BrickBreaker, TowerBuilder, Snake3D, Pong3D, AimTrainer, Memory3D, TicTacToe3D) dengan pencahayaan terang benderang.',
        techSpec: 'Three.js 3D Rendering Engine, Ambient & Hemisphere Lighting, Physics Loop, HighScore Tracker',
        tags: ['3DGames', 'ThreeJS', 'VividLighting', 'ArcadeSimulator']
      },
      {
        id: 'preferences',
        category: 'system',
        categoryName: 'System & Tools',
        route: '/preferences',
        icon: 'bi bi-sliders',
        title: 'PreferencesView (Pengaturan Theme & Backup)',
        description: 'Pusat kontrol tema (Light, Dark Slate, OLED True Black), pemilih warna aksen kustom, tombol Install PWA, serta fasilitas Ekspor & Impor JSON seluruh data aplikasi.',
        techSpec: 'CSS Variable Theme Swapper, JSON Blob Importer/Exporter, PWA ServiceWorker Bridge',
        tags: ['ThemeSettings', 'OLEDSlate', 'BackupRestore', 'PWAInstaller']
      },
      {
        id: 'faq',
        category: 'system',
        categoryName: 'System & Tools',
        route: '/faq',
        icon: 'bi bi-question-circle-fill',
        title: 'FaqAboutView (Info & Hidden Features)',
        description: 'Panduan lengkap penggunaan aplikasi, daftar fitur rahasia (Hidden Shortcuts), spesifikasi teknis platform, serta informasi lisensi karya.',
        techSpec: 'Accordion Layout, Keyboard Shortcut Listeners, Interactive Guide Cards',
        tags: ['FAQGuide', 'HiddenFeatures', 'SystemSpecs', 'UserManual']
      }
    ];

    const filteredShowcaseViews = computed(() => {
      if (activeCategory.value === 'all') return showcaseViews;
      return showcaseViews.filter(v => v.category === activeCategory.value);
    });

    const submitWaForm = () => {
      const { name, company, message } = waForm;
      const waNumber = "6285817048266";
      const waText = `Halo Mas Arif! 👋\n\nPerkenalkan, saya *${name}* dari *${company}*.\n\nSaya melihat portfolio & sistem RajinKerja.id Anda dan tertarik untuk berdiskusi lebih lanjut.\n\n"${message}"\n\nTerima kasih banyak atas waktunya! 🙏✨`;
      const encodedText = encodeURIComponent(waText);
      const waURL = `https://wa.me/${waNumber}?text=${encodedText}`;

      if (confirm('PESAN DISIAPKAN! 🚀\n\nPesan Anda telah dirakit otomatis. Lanjutkan obrolan di WhatsApp?')) {
        window.open(waURL, '_blank');
        waForm.name = '';
        waForm.company = '';
        waForm.message = '';
      }
    };

    return {
      canvasContainer,
      currentLang,
      activeFaq,
      activeCategory,
      waForm,
      showcaseCategories,
      showcaseViews,
      filteredShowcaseViews,
      setLanguage,
      t,
      submitWaForm
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;900&display=swap');

.developer-portfolio-page {
  font-family: 'Space Grotesk', sans-serif;
  --bg-color: #ffffff;
  --text-color: #303030;
  --border-color: #303030;
  --accent-main-blue: #1269cc;
  --accent-cyan: #51eefc;
  --accent-soft-blue: #6d9ac7;
  --border-width: 4px;
  --shadow-solid: 6px 6px 0px var(--border-color);
  --shadow-hover: 3px 3px 0px var(--border-color);

  background-color: var(--bg-color);
  color: var(--text-color);
  position: relative;
  overflow-x: hidden;
  margin: -1rem -1rem;
  padding: 0;
}

#portfolio-canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  opacity: 0.35;
}

/* Neo brutalism styling elements */
.brutal-box {
  border: var(--border-width) solid var(--border-color);
  background-color: #ffffff;
  box-shadow: var(--shadow-solid);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 0 !important;
}

.brutal-box:hover {
  transform: translate(2px, 2px);
  box-shadow: var(--shadow-hover);
}

.brutal-btn {
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 24px;
  cursor: pointer;
  border: var(--border-width) solid var(--border-color);
  box-shadow: var(--shadow-solid);
  color: var(--text-color);
  border-radius: 0 !important;
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  display: inline-block;
  text-decoration: none;
}

.brutal-btn:hover {
  transform: translate(3px, 3px);
  box-shadow: var(--shadow-hover);
  color: var(--text-color);
}

.bg-main-blue { background-color: var(--accent-main-blue) !important; color: #ffffff !important; }
.bg-cyan { background-color: var(--accent-cyan) !important; color: var(--text-color) !important; }
.bg-soft-blue { background-color: var(--accent-soft-blue) !important; color: var(--text-color) !important; }
.bg-dark-accent { background-color: var(--text-color) !important; color: #ffffff !important; }
.text-main-blue { color: var(--accent-main-blue) !important; }
.text-cyan { color: var(--accent-cyan) !important; }

.skew-title {
  transform: skewX(-4deg) rotate(-1.5deg);
  text-transform: uppercase;
  font-weight: 900;
  line-height: 1.1;
  display: inline-block;
  padding: 0.5rem 1.25rem;
  margin-bottom: 1rem;
}

.brutal-navbar {
  border-bottom: var(--border-width) solid var(--border-color);
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  z-index: 1000;
  position: sticky;
  top: 0;
}

.lang-btn {
  cursor: pointer;
  font-weight: 800;
  padding: 3px 10px;
  border: 2px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  transition: all 0.2s;
  font-size: 13px;
}

.lang-btn.active {
  background: var(--accent-main-blue);
  color: #fff;
  box-shadow: 2px 2px 0px var(--border-color);
}

/* Marquee */
.marquee {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  background: var(--text-color);
  color: var(--accent-cyan);
  padding: 12px 0;
  border-top: var(--border-width) solid var(--border-color);
  border-bottom: var(--border-width) solid var(--border-color);
  position: relative;
  z-index: 10;
}

.marquee-content {
  display: inline-block;
  font-weight: 900;
  font-size: 1.25rem;
  text-transform: uppercase;
  animation: marquee 25s linear infinite;
}

@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* Timeline */
.timeline { position: relative; max-width: 1200px; margin: 0 auto; }
.timeline::after {
  content: ''; position: absolute; width: 6px; background-color: var(--border-color);
  top: 0; bottom: 0; left: 50%; margin-left: -3px;
}
.timeline-item { padding: 10px 40px; position: relative; background-color: inherit; width: 50%; }
.timeline-item::after {
  content: ''; position: absolute; width: 22px; height: 22px; right: -11px;
  background-color: var(--accent-cyan); border: 4px solid var(--border-color);
  top: 18px; z-index: 1; transition: all 0.3s ease;
}
.timeline-item:hover::after { transform: scale(1.4) rotate(45deg); background-color: var(--accent-main-blue); }
.left-item { left: 0; }
.right-item { left: 50%; }
.right-item::after { left: -11px; }

@media screen and (max-width: 768px) {
  .timeline::after { left: 24px; }
  .timeline-item { width: 100%; padding-left: 60px; padding-right: 15px; }
  .left-item::after, .right-item::after { left: 13px; }
  .right-item { left: 0%; }
}

.section-padding { padding: 80px 0; }
.obj-fit-cover { object-fit: cover; }

.org-banner {
  background: repeating-linear-gradient(45deg, var(--accent-cyan), var(--accent-cyan) 20px, var(--accent-soft-blue) 20px, var(--accent-soft-blue) 40px);
  border: var(--border-width) solid var(--border-color);
  box-shadow: var(--shadow-solid);
}

.max-w-400 {
  max-width: 400px;
}

.hover-up {
  transition: transform 0.2s ease;
}
.hover-up:hover {
  transform: translateY(-3px);
}
</style>
