<template>
  <div class="developer-portfolio-page" :class="[ portfolioTheme === 'omori' ? 'omori-theme-mode' : 'persona-battle-theme p3r-classic-mode' ]">
    <!-- 3D WebGL Canvas Container -->
    <div id="portfolio-canvas-container" ref="canvasContainer"></div>

    <!-- Anime Halftone & Speedlines Overlays (Classic Mode) -->
    <div v-if="portfolioTheme === 'classic'" class="manga-speedlines"></div>
    <div v-if="portfolioTheme === 'classic'" class="halftone-dot-grid"></div>

    <!-- OMORI Floating Vignette & Sketch Doodles (OMORI Mode) -->
    <div v-if="portfolioTheme === 'omori'" class="omori-lightbulb-dangle">
      <div class="omori-bulb-cord"></div>
      <div class="omori-bulb-glow"><i class="bi bi-lightbulb-fill"></i></div>
    </div>

    <!-- Persona Battle Top HUD Header -->
    <header class="persona-hud-bar fixed-top d-flex justify-content-between align-items-center px-3 px-md-4 py-2">
      <!-- Left: Protagonist & Battle Status -->
      <div class="d-flex align-items-center gap-3">
        <a href="#hero" class="hud-brand text-decoration-none">
          <span class="hud-slash-badge">{{ portfolioTheme === 'omori' ? 'WHITE SPACE' : 'RELOAD' }}</span>
          <strong class="hud-title text-white">ITSMEBROARIF</strong>
        </a>

        <!-- HP & SP / JUICE Bars in Header -->
        <div class="d-none d-lg-flex align-items-center gap-3 ms-2">
          <div class="hud-meter-wrap">
            <div class="d-flex justify-content-between text-monospace small fw-bold">
              <span class="text-danger">{{ portfolioTheme === 'omori' ? 'HEART' : 'HP' }}</span>
              <span class="text-white">999 / 999</span>
            </div>
            <div class="hud-bar-bg">
              <div class="hud-bar-fill bg-danger" style="width: 100%;"></div>
            </div>
          </div>
          <div class="hud-meter-wrap">
            <div class="d-flex justify-content-between text-monospace small fw-bold">
              <span class="text-info">{{ portfolioTheme === 'omori' ? 'JUICE' : 'SP' }}</span>
              <span class="text-white">580 / 580</span>
            </div>
            <div class="hud-bar-bg">
              <div class="hud-bar-fill bg-info" style="width: 100%;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Center: Battle OST / Sound Indicator -->
      <div class="d-none d-md-flex align-items-center gap-2 bg-dark bg-opacity-75 px-3 py-1.5 rounded-pill border border-secondary border-opacity-50">
        <span class="eq-pulse-dot" :class="{ 'bg-light': portfolioTheme === 'omori' }"></span>
        <span class="text-white small fw-bold text-truncate" style="max-width: 320px;">
          <template v-if="portfolioTheme === 'classic'">
            🎵 MASS DESTRUCTION // PERSONA 3 RELOAD BATTLE
          </template>
          <template v-else>
            💡 DUET // OMORI DARK WHITE SPACE MEMORY
          </template>
        </span>
      </div>

      <!-- Right: Theme Mode Switcher + Lang & Action -->
      <div class="d-flex align-items-center gap-2">
        <!-- Theme Mode Switcher: Classic P3R vs OMORI -->
        <div class="theme-mode-switch-group d-flex align-items-center bg-black bg-opacity-75 p-1 rounded-pill border border-secondary border-opacity-50">
          <button 
            type="button" 
            class="btn btn-xs rounded-pill px-2.5 py-1 fw-bold text-uppercase d-flex align-items-center gap-1.5 transition-all"
            :class="portfolioTheme === 'classic' ? 'btn-primary text-white shadow-sm' : 'text-white-50 border-0 bg-transparent'"
            @click="setPortfolioTheme('classic')"
            title="Persona 3 Reload Classic Battle Theme (Vibrant Blue)"
          >
            <i class="bi bi-lightning-charge-fill"></i>
            <span class="d-none d-sm-inline">Classic P3R</span>
          </button>
          <button 
            type="button" 
            class="btn btn-xs rounded-pill px-2.5 py-1 fw-bold text-uppercase d-flex align-items-center gap-1.5 transition-all"
            :class="portfolioTheme === 'omori' ? 'btn-light text-dark shadow-sm' : 'text-white-50 border-0 bg-transparent'"
            @click="setPortfolioTheme('omori')"
            title="OMORI Dark White Space Handwritten Theme"
          >
            <i class="bi bi-lightbulb-fill"></i>
            <span class="d-none d-sm-inline">OMORI (Dark)</span>
          </button>
        </div>

        <div class="d-flex gap-1">
          <button class="p3-lang-btn" :class="{ active: currentLang === 'id' }" @click="setLanguage('id')">ID</button>
          <button class="p3-lang-btn" :class="{ active: currentLang === 'en' }" @click="setLanguage('en')">EN</button>
          <button class="p3-lang-btn" :class="{ active: currentLang === 'jp' }" @click="setLanguage('jp')">JP</button>
        </div>

        <button class="btn btn-sm btn-outline-info rounded-pill px-3 py-1 fw-bold d-none d-sm-inline-flex align-items-center gap-1" @click="triggerAllOutAttack">
          <span class="text-warning">★</span> {{ portfolioTheme === 'omori' ? 'RELEASE ENERGY' : 'ALL-OUT ATTACK' }}
        </button>
      </div>
    </header>

    <!-- Hero Section (Persona 3 Reload Vibrant Electric Blue & 3D Diagonal Slanted Battle Stage) -->
    <section id="hero" class="min-vh-100 d-flex align-items-center position-relative overflow-hidden pt-5">
      <div class="container position-relative z-1 pt-5 text-center">
        <!-- Battle Phase & Status Indicator -->
        <div class="gsap-hero-el mb-3 d-inline-block">
          <div class="p3r-battle-phase-pill">
            <span class="phase-badge bg-primary text-white">TURN 01</span>
            <span class="phase-title text-white">PROTAGONIST ACTION PHASE // BATTLE ENGAGED</span>
            <span class="phase-tag bg-cyan text-dark">1 MORE!</span>
          </div>
        </div>

        <!-- 3D Angled Hero Titles -->
        <div class="gsap-hero-el my-2">
          <div class="p3r-hero-3d-stage mx-auto">
            <div class="p3r-slanted-title-left">
              <h1 class="p3r-cutout-title">ARIF PERMANA</h1>
            </div>
            <div class="p3r-slanted-title-right">
              <h1 class="p3r-cutout-title p3r-accent-title">PUTRASURYANA</h1>
            </div>
          </div>
        </div>

        <!-- Role Badge -->
        <div class="gsap-hero-el mt-3">
          <div class="p3r-role-banner d-inline-block">
            <i class="bi bi-cpu-fill text-info me-2"></i>
            <span class="text-uppercase fw-extrabold tracking-wider">{{ t('hero_role') }}</span>
          </div>
        </div>

        <!-- Persona Quote / Battle Philosophy -->
        <div class="row justify-content-center mt-4 gsap-hero-el">
          <div class="col-md-9 col-lg-8">
            <div class="p3r-quote-battle-card">
              <div class="quote-header d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-primary text-white px-2.5 py-1 text-uppercase fw-bold">
                  <i class="bi bi-shield-shaded me-1"></i> PHILOSOPHY // TACTICS
                </span>
                <span class="text-info text-monospace small">LV.99 ARCHITECT</span>
              </div>
              <p class="fs-5 fw-bold mb-0 text-white" style="line-height: 1.6;">
                {{ t('hero_quote') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Persona Battle Command Dial / Slanted 3D Wheel -->
        <div class="gsap-hero-el mt-5">
          <h5 class="text-info fw-bold text-uppercase mb-3 tracking-wider">
            [ SELECT BATTLE COMMAND ]
          </h5>
          <div class="p3-battle-command-wheel d-flex flex-wrap justify-content-center gap-3">
            <a href="#skills" class="p3-cmd-pill cmd-skills" @click.prevent="scrollToSection('skills')">
              <span class="cmd-icon">🔮</span>
              <div class="text-start">
                <strong class="d-block text-uppercase">SKILLS</strong>
                <small class="text-white-50">Arsenal Kemampuan</small>
              </div>
            </a>

            <a href="#experience" class="p3-cmd-pill cmd-exp" @click.prevent="scrollToSection('experience')">
              <span class="cmd-icon">📜</span>
              <div class="text-start">
                <strong class="d-block text-uppercase">EXPERIENCE</strong>
                <small class="text-white-50">Quest & Dungeons</small>
              </div>
            </a>

            <a href="#profile" class="p3-cmd-pill cmd-profile" @click.prevent="scrollToSection('profile')">
              <span class="cmd-icon">👤</span>
              <div class="text-start">
                <strong class="d-block text-uppercase">PROFILE</strong>
                <small class="text-white-50">Status Protagonist</small>
              </div>
            </a>

            <button class="p3-cmd-pill cmd-attack" @click="triggerAllOutAttack">
              <span class="cmd-icon">⚔️</span>
              <div class="text-start">
                <strong class="d-block text-uppercase text-warning">ALL-OUT ATTACK</strong>
                <small class="text-white-50">Finisher Move!</small>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Marquee Banner -->
    <div class="persona-marquee">
      <div class="persona-marquee-inner">
        ⚡ ARIF PERMANA • PERSONA: KAISAR CODING • VUE 3 ARCHITECT • LARAVEL MASTER • UI/UX NEOBRUTALISM • THREE.JS 3D • ITSMEBROARIF •
        ⚡ ARIF PERMANA • PERSONA: KAISAR CODING • VUE 3 ARCHITECT • LARAVEL MASTER • UI/UX NEOBRUTALISM • THREE.JS 3D • ITSMEBROARIF •
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- SECTION 1: 👤 PROFIL PENGGUNA (PROTAGONIST STATUS CARD)                    -->
    <!-- ========================================================================= -->
    <section id="profile" class="section-padding py-5 position-relative">
      <div class="container my-4">
        <!-- Section Title Bar with 3D Slant -->
        <div class="section-header-slant text-center mb-5">
          <span class="badge bg-primary text-white px-3 py-1.5 rounded-0 fw-bold text-uppercase fs-6">
            [ PERSONA STATUS & ATTRIBUTES ]
          </span>
          <h2 class="display-5 fw-extrabold text-white text-uppercase mt-2">
            PROFIL PENGGUNA <span class="text-info">// PROTAGONIST</span>
          </h2>
          <p class="text-white-50 fw-semibold">Kartu status tempur, arcana, dan radar atribut sang arsitek sistem digital.</p>
        </div>

        <div class="row g-4 align-items-stretch">
          <!-- Left Column: Angled 3D Character Card (Miring Kiri) -->
          <div class="col-lg-5">
            <div class="card-tilt-left h-100">
              <div class="persona-char-card p-4 h-100 d-flex flex-column justify-content-between position-relative overflow-hidden">
                <!-- Arcana & Level Header -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="badge bg-warning text-dark fw-bold px-3 py-1.5 rounded-0 border border-dark">
                    ARCANA: XXI - THE WORLD
                  </span>
                  <span class="badge bg-danger text-white fw-bold px-3 py-1.5 rounded-0">
                    LV.99 ARCHITECT
                  </span>
                </div>

                <!-- Protagonist Portrait Frame -->
                <div class="char-photo-wrap position-relative mx-auto my-3">
                  <div class="char-photo-border"></div>
                  <img src="https://miro.medium.com/v2/resize:fit:2400/1*99hHL9XJ7EzQeC6RB5_Qiw.jpeg" alt="Arif Permana" class="char-photo" />
                  <div class="char-persona-tag">
                    <small class="d-block text-white-50">SUMMON PERSONA</small>
                    <strong class="text-info fs-6">KAISAR CODING</strong>
                  </div>
                </div>

                <!-- Codename & Identity -->
                <div class="text-center mt-2">
                  <h3 class="fw-extrabold text-white text-uppercase mb-1 tracking-wider">
                    ARIF PERMANA P.
                  </h3>
                  <p class="text-info fw-bold mb-3">
                    <i class="bi bi-terminal-fill me-1"></i> CODENAME: <span class="text-white">ITSMEBROARIF</span>
                  </p>
                  <div class="p-2.5 bg-dark bg-opacity-75 border border-primary border-opacity-50 text-white small text-start mb-3">
                    <div><i class="bi bi-geo-alt-fill text-info me-2"></i> Depok, Jawa Barat, Indonesia</div>
                    <div><i class="bi bi-briefcase-fill text-warning me-2"></i> Status: <span class="badge bg-success text-white">READY TO WORK 🔥</span></div>
                    <div><i class="bi bi-envelope-fill text-danger me-2"></i> aripstrike@gmail.com</div>
                    <div><i class="bi bi-whatsapp text-success me-2"></i> +62-858-1704-8266</div>
                  </div>
                </div>

                <!-- Social Link / Confidant Ranks -->
                <div class="confidant-box p-3 bg-black bg-opacity-50 border border-secondary border-opacity-25 mt-auto">
                  <h6 class="text-info fw-bold small text-uppercase mb-2">
                    <i class="bi bi-stars me-1"></i> CONFIDANT SOCIAL LINKS
                  </h6>
                  <div class="d-flex flex-column gap-1.5 small text-white-50">
                    <div class="d-flex justify-content-between">
                      <span>Kafeinarts Studio</span>
                      <span class="text-warning fw-bold">RANK 10 [MAX]</span>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>Open Source Community</span>
                      <span class="text-info fw-bold">RANK 9</span>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>Enterprise Client Partners</span>
                      <span class="text-warning fw-bold">RANK 10 [MAX]</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Combat Attributes Radar & Bio (Miring Kanan) -->
          <div class="col-lg-7">
            <div class="card-tilt-right h-100">
              <div class="persona-stats-card p-4 p-md-5 h-100 d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center border-bottom border-primary border-opacity-50 pb-3 mb-4">
                  <div>
                    <h4 class="fw-extrabold text-white text-uppercase mb-0">
                      COMBAT RADAR & BIO
                    </h4>
                    <small class="text-info">Analisis Kemampuan & Kekuatan Protagonist</small>
                  </div>
                  <span class="badge bg-primary text-white px-3 py-2 fw-bold">
                    COMBAT RATING: S+
                  </span>
                </div>

                <!-- Bio Description -->
                <p class="text-white fs-6 fw-semibold mb-4" style="line-height: 1.7;">
                  {{ t('about_desc1') }}
                </p>
                <p class="text-white-50 fs-6 mb-4" style="line-height: 1.7;">
                  {{ t('about_desc2') }}
                </p>

                <!-- Attribute Stat Meters -->
                <h5 class="text-uppercase text-white fw-bold mb-3 d-flex align-items-center gap-2">
                  <i class="bi bi-bar-chart-fill text-warning"></i> PARAMETER COMBAT STATS
                </h5>

                <div class="stat-meters-list d-flex flex-column gap-3 mb-4">
                  <!-- STR -->
                  <div>
                    <div class="d-flex justify-content-between text-monospace fw-bold text-white small mb-1">
                      <span><strong class="text-danger me-2">STR</strong> HARDCORE CODING & ARCHITECTURE</span>
                      <span class="text-danger">96 / 100</span>
                    </div>
                    <div class="stat-track">
                      <div class="stat-fill bg-danger" style="width: 96%;"></div>
                    </div>
                  </div>

                  <!-- MAG -->
                  <div>
                    <div class="d-flex justify-content-between text-monospace fw-bold text-white small mb-1">
                      <span><strong class="text-info me-2">MAG</strong> UI/UX AESTHETICS & ANIMATION</span>
                      <span class="text-info">98 / 100</span>
                    </div>
                    <div class="stat-track">
                      <div class="stat-fill bg-info" style="width: 98%;"></div>
                    </div>
                  </div>

                  <!-- END -->
                  <div>
                    <div class="d-flex justify-content-between text-monospace fw-bold text-white small mb-1">
                      <span><strong class="text-success me-2">END</strong> DEBUGGING & SYSTEM RESILIENCE</span>
                      <span class="text-success">94 / 100</span>
                    </div>
                    <div class="stat-track">
                      <div class="stat-fill bg-success" style="width: 94%;"></div>
                    </div>
                  </div>

                  <!-- AGI -->
                  <div>
                    <div class="d-flex justify-content-between text-monospace fw-bold text-white small mb-1">
                      <span><strong class="text-warning me-2">AGI</strong> RAPID SPRINT & FAST PROTOTYPING</span>
                      <span class="text-warning">97 / 100</span>
                    </div>
                    <div class="stat-track">
                      <div class="stat-fill bg-warning" style="width: 97%;"></div>
                    </div>
                  </div>

                  <!-- LUK -->
                  <div>
                    <div class="d-flex justify-content-between text-monospace fw-bold text-white small mb-1">
                      <span><strong class="text-primary me-2">LUK</strong> INNOVATION & CREATIVE VISION</span>
                      <span class="text-primary">92 / 100</span>
                    </div>
                    <div class="stat-track">
                      <div class="stat-fill bg-primary" style="width: 92%;"></div>
                    </div>
                  </div>
                </div>

                <!-- Action Button in Profile -->
                <div class="mt-auto d-flex flex-wrap gap-2 pt-3 border-top border-secondary border-opacity-25">
                  <a href="https://wa.me/6285817048266" target="_blank" class="btn btn-primary fw-bold px-4 py-2 rounded-0 shadow-sm">
                    <i class="bi bi-whatsapp me-1"></i> Rekrut / Hubungi WA
                  </a>
                  <a href="https://github.com/itsmebroarif" target="_blank" class="btn btn-outline-light fw-bold px-4 py-2 rounded-0">
                    <i class="bi bi-github me-1"></i> GitHub Profile
                  </a>
                  <a href="https://linkedin.com/in/arif-permana-putrasuryana-121b761b9" target="_blank" class="btn btn-outline-info fw-bold px-4 py-2 rounded-0">
                    <i class="bi bi-linkedin me-1"></i> LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- SECTION 2: 🔮 SKILLS ARSENAL (PERSONA BATTLE SKILLS TREE)                 -->
    <!-- ========================================================================= -->
    <section id="skills" class="section-padding py-5 position-relative bg-navy-grid">
      <div class="container my-4">
        <!-- Section Header with 3D Slant -->
        <div class="section-header-slant text-center mb-5">
          <span class="badge bg-info text-dark px-3 py-1.5 rounded-0 fw-bold text-uppercase fs-6">
            [ PERSONA COMBAT SKILLS DECK ]
          </span>
          <h2 class="display-5 fw-extrabold text-white text-uppercase mt-2">
            SKILLS ARSENAL <span class="text-primary">// TACTICAL SPELLS</span>
          </h2>
          <p class="text-white-50 fw-semibold">Daftar jurus teknologi, biaya SP, dan daya komputasi yang siap diluncurkan di medan produksi.</p>
          
          <!-- Element Filter Tabs -->
          <div class="d-flex justify-content-center flex-wrap gap-2 mt-4">
            <button 
              class="p3-filter-btn" 
              :class="{ active: activeSkillFilter === 'all' }" 
              @click="activeSkillFilter = 'all'"
            >
              Semua Skills ({{ personaSkills.length }})
            </button>
            <button 
              class="p3-filter-btn" 
              :class="{ active: activeSkillFilter === 'magic' }" 
              @click="activeSkillFilter = 'magic'"
            >
              ⚡ Magic / Framework
            </button>
            <button 
              class="p3-filter-btn" 
              :class="{ active: activeSkillFilter === 'physical' }" 
              @click="activeSkillFilter = 'physical'"
            >
              🔥 Physical / Backend
            </button>
            <button 
              class="p3-filter-btn" 
              :class="{ active: activeSkillFilter === 'support' }" 
              @click="activeSkillFilter = 'support'"
            >
              🛡️ Support / DevOps
            </button>
          </div>
        </div>

        <!-- 3D Alternating Miring Kanan-Kiri Skills Grid -->
        <div class="row g-4">
          <div 
            v-for="(skill, index) in filteredSkills" 
            :key="skill.id" 
            class="col-md-6 col-lg-4"
          >
            <!-- Alternating 3D tilt: odd items tilt left, even items tilt right -->
            <div :class="index % 2 === 0 ? 'card-tilt-left' : 'card-tilt-right'" class="h-100">
              <div class="persona-skill-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <!-- Element & SP Cost Header -->
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="badge px-3 py-1.5 rounded-0 fw-bold border border-white border-opacity-25" :class="skill.elementBadgeClass">
                      {{ skill.elementIcon }} {{ skill.elementName }}
                    </span>
                    <span class="text-monospace fw-bold text-info fs-6">
                      {{ skill.spCost }} SP
                    </span>
                  </div>

                  <!-- Skill Title & Level -->
                  <h4 class="fw-extrabold text-white text-uppercase mb-1 fs-5">
                    {{ skill.title }}
                  </h4>
                  <div class="d-flex align-items-center gap-2 mb-3">
                    <span class="badge bg-dark border border-secondary text-warning fw-semibold small">
                      MASTERY: {{ skill.mastery }}
                    </span>
                    <span class="text-white-50 small text-monospace">PWR: {{ skill.power }}/100</span>
                  </div>

                  <!-- Description -->
                  <p class="text-white-50 small fw-semibold mb-3" style="line-height: 1.6;">
                    {{ skill.description }}
                  </p>
                </div>

                <!-- Skill Power Bar -->
                <div class="mt-auto pt-3 border-top border-secondary border-opacity-25">
                  <div class="d-flex justify-content-between text-monospace text-white-50 small mb-1">
                    <span>EFFECTIVENESS</span>
                    <span class="text-info">{{ skill.power }}%</span>
                  </div>
                  <div class="stat-track">
                    <div class="stat-fill" :class="skill.barClass" :style="{ width: skill.power + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- SECTION 3: 📜 EXPERIENCE & DUNGEON QUEST TIMELINE                         -->
    <!-- ========================================================================= -->
    <section id="experience" class="section-padding py-5 position-relative">
      <div class="container my-4">
        <!-- Section Title Bar with 3D Slant -->
        <div class="section-header-slant text-center mb-5">
          <span class="badge bg-warning text-dark px-3 py-1.5 rounded-0 fw-bold text-uppercase fs-6">
            [ DUNGEON QUESTS & BATTLE LOGS ]
          </span>
          <h2 class="display-5 fw-extrabold text-white text-uppercase mt-2">
            EXPERIENCE JOURNEY <span class="text-warning">// QUEST CLEARS</span>
          </h2>
          <p class="text-white-50 fw-semibold">Jejak pertempuran menaklukkan sistem klien, perbaikan bug darurat, dan pengembangan skala enterprise.</p>

          <!-- Total EXP Bar -->
          <div class="p3r-exp-total-card max-w-600 mx-auto mt-4 p-3 bg-dark bg-opacity-75 border border-warning border-opacity-50">
            <div class="d-flex justify-content-between align-items-center text-monospace text-white small fw-bold mb-2">
              <span class="text-warning"><i class="bi bi-trophy-fill me-1"></i> TOTAL EXP ACCUMULATED</span>
              <span>984,250 / 1,000,000 EXP (LV.99 ARCHITECT)</span>
            </div>
            <div class="stat-track" style="height: 10px;">
              <div class="stat-fill bg-warning" style="width: 98.4%;"></div>
            </div>
          </div>
        </div>

        <!-- 3D Alternating Miring Kanan Kiri Quest Timeline -->
        <div class="row g-4">
          <!-- Quest 1: Sintesa Persada Teknologi (Tilt Left) -->
          <div class="col-lg-6">
            <div class="card-tilt-left h-100">
              <div class="persona-quest-card p-4 h-100 d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="badge bg-primary text-white fw-bold px-2.5 py-1 rounded-0">
                    2026 - PRESENT // MAIN QUEST
                  </span>
                  <span class="badge bg-success text-white fw-bold px-2.5 py-1 rounded-0">
                    BOSS CLEARED
                  </span>
                </div>
                <h4 class="fw-extrabold text-white text-uppercase mb-1 fs-5">
                  Fullstack Web Engineer
                </h4>
                <h6 class="text-info fw-bold mb-3">@Sintesa Persada Teknologi (IT Vendor)</h6>
                
                <p class="text-white-50 small mb-3 fw-semibold">
                  {{ t('exp_sintesa_desc') }}
                </p>

                <div class="bg-black bg-opacity-50 p-3 border border-secondary border-opacity-25 rounded-0 small text-white mb-3">
                  <strong class="text-warning d-block mb-1">🎯 Quest Milestones:</strong>
                  <ul class="mb-0 ps-3 text-white-50" style="line-height: 1.6;">
                    <li><strong>Highlight:</strong> App Klinik Sintasi (Medica-Nexus SIMRS).</li>
                    <li><strong>Frontend (Vue 2 + Quasar v1):</strong> Modul Lab, Riwayat Pasien, redesign UI.</li>
                    <li><strong>Backend (Laravel 9 + PHP 8.1):</strong> Controller, REST API, Print Resep A5, UGD checkout.</li>
                  </ul>
                </div>

                <div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                  <span class="text-monospace text-info small">+50,000 EXP</span>
                  <span class="badge bg-dark text-white border border-primary">REWARD: ENTERPRISE SHIELD</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quest 2: Ayasylfiette & Sadaraga (Tilt Right) -->
          <div class="col-lg-6">
            <div class="card-tilt-right h-100">
              <div class="persona-quest-card p-4 h-100 d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="badge bg-info text-dark fw-bold px-2.5 py-1 rounded-0">
                    2025 - 2026 // CO-OP QUEST
                  </span>
                  <span class="badge bg-success text-white fw-bold px-2.5 py-1 rounded-0">
                    BOSS CLEARED
                  </span>
                </div>
                <h4 class="fw-extrabold text-white text-uppercase mb-1 fs-5">
                  Fullstack Web Engineer
                </h4>
                <h6 class="text-info fw-bold mb-3">@Ayasylfiette & @Sadaraga</h6>
                
                <p class="text-white-50 small mb-3 fw-semibold">
                  Pengembangan platform e-commerce aset Vtuber serta platform serving hasil lari marathon internasional.
                </p>

                <div class="bg-black bg-opacity-50 p-3 border border-secondary border-opacity-25 rounded-0 small text-white mb-3">
                  <strong class="text-warning d-block mb-1">🎯 Quest Milestones:</strong>
                  <ul class="mb-0 ps-3 text-white-50" style="line-height: 1.6;">
                    <li>{{ t('exp_aya_1') }}</li>
                    <li>{{ t('exp_sada_1') }}</li>
                    <li>Sistem berbasis C# untuk kebutuhan BIB Checking pelari.</li>
                    <li>Tech Stack: Laravel 13, CodeIgniter 3, Tailwind CSS 3.</li>
                  </ul>
                </div>

                <div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                  <span class="text-monospace text-info small">+45,000 EXP</span>
                  <span class="badge bg-dark text-white border border-info">REWARD: HIGH-VELOCITY BLADE</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quest 3: Kafeinarts & Global Training (Tilt Left) -->
          <div class="col-lg-6">
            <div class="card-tilt-left h-100">
              <div class="persona-quest-card p-4 h-100 d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="badge bg-primary text-white fw-bold px-2.5 py-1 rounded-0">
                    2023 - 2025 // GUILD MASTER
                  </span>
                  <span class="badge bg-success text-white fw-bold px-2.5 py-1 rounded-0">
                    COMPLETED
                  </span>
                </div>
                <h4 class="fw-extrabold text-white text-uppercase mb-1 fs-5">
                  Lead Front-End Trainer & Founder
                </h4>
                <h6 class="text-info fw-bold mb-3">@Kafeinarts & Rumah Coding</h6>
                
                <p class="text-white-50 small mb-3 fw-semibold">
                  Membimbing puluhan calon engineer menguasai Vue.js, Laravel MVC, REST API, serta arsitektur antarmuka digital.
                </p>

                <div class="bg-black bg-opacity-50 p-3 border border-secondary border-opacity-25 rounded-0 small text-white mb-3">
                  <strong class="text-warning d-block mb-1">🎯 Quest Milestones:</strong>
                  <ul class="mb-0 ps-3 text-white-50" style="line-height: 1.6;">
                    <li>Mengajar HTML5, CSS3, JavaScript ES6+, Vue.js, Bootstrap & Tailwind.</li>
                    <li>Mentor Laravel: Blade, MVC, Object Oriented Programming, CRUD API.</li>
                    <li>Digital Speaker di Young On Top & Tech Blogger di Medium.</li>
                  </ul>
                </div>

                <div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                  <span class="text-monospace text-info small">+60,000 EXP</span>
                  <span class="badge bg-dark text-white border border-primary">REWARD: MENTOR EMPEROR BADGE</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quest 4: Multi-Role Quests & Academy (Tilt Right) -->
          <div class="col-lg-6">
            <div class="card-tilt-right h-100">
              <div class="persona-quest-card p-4 h-100 d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="badge bg-warning text-dark fw-bold px-2.5 py-1 rounded-0">
                    ACADEMY & GLOBAL MISSIONS
                  </span>
                  <span class="badge bg-success text-white fw-bold px-2.5 py-1 rounded-0">
                    CLEARED
                  </span>
                </div>
                <h4 class="fw-extrabold text-white text-uppercase mb-1 fs-5">
                  Global Remote Roles & Training
                </h4>
                <h6 class="text-info fw-bold mb-3">Multiple Missions & Certifications</h6>
                
                <p class="text-white-50 small mb-3 fw-semibold">
                  Ekspansi internasional dan bootcamp fondasi algoritma.
                </p>

                <div class="bg-black bg-opacity-50 p-3 border border-secondary border-opacity-25 rounded-0 small text-white mb-3">
                  <strong class="text-warning d-block mb-1">🎯 Quest Milestones:</strong>
                  <ul class="mb-0 ps-3 text-white-50" style="line-height: 1.6;">
                    <li><strong>Hangang Solution (KR):</strong> Vue.js Game Dev learning community.</li>
                    <li><strong>Konpyūtā no himitsu (JP):</strong> Website kursus komputer direct WA.</li>
                    <li><strong>FreeCodeCamp US:</strong> Javascript Algorithms & Data Structures.</li>
                    <li><strong>SMK Taruna Bhakti Depok:</strong> Rekayasa Perangkat Lunak.</li>
                  </ul>
                </div>

                <div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                  <span class="text-monospace text-info small">+80,000 EXP</span>
                  <span class="badge bg-dark text-white border border-warning">REWARD: GRANDMASTER SCROLL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- SECTION 4: SHOWCASE ARSITEKTUR APP & VIEWS                                -->
    <!-- ========================================================================= -->
    <section id="app-showcase" class="section-padding py-5 position-relative bg-navy-grid">
      <div class="container my-4">
        <div class="section-header-slant text-center mb-5">
          <span class="badge bg-primary text-white px-3 py-1.5 rounded-0 fw-bold text-uppercase fs-6">
            [ ARSITEKTUR SISTEM RAJINKERJA.ID ]
          </span>
          <h2 class="display-5 fw-extrabold text-white text-uppercase mt-2">
            APP ARCHITECTURE <span class="text-info">// SYSTEM BREAKDOWN</span>
          </h2>
          <p class="text-white-50 fw-semibold">{{ t('sys_showcase_sub') }}</p>

          <!-- Filter tabs -->
          <div class="d-flex justify-content-center flex-wrap gap-2 mt-4">
            <button 
              v-for="cat in showcaseCategories" 
              :key="cat.id" 
              class="p3-filter-btn"
              :class="{ active: activeCategory === cat.id }"
              @click="activeCategory = cat.id"
            >
              {{ cat.icon }} {{ cat.name }}
            </button>
          </div>
        </div>

        <div class="row g-4">
          <div 
            v-for="(view, idx) in filteredShowcaseViews" 
            :key="view.id" 
            class="col-lg-6 col-xl-4"
          >
            <div :class="idx % 2 === 0 ? 'card-tilt-left' : 'card-tilt-right'" class="h-100">
              <div class="persona-skill-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 pb-2 mb-3">
                    <span class="badge bg-primary text-white fw-bold px-2 py-1 rounded-0">{{ view.categoryName }}</span>
                    <router-link :to="view.route" class="btn btn-sm btn-outline-info rounded-0 border-2">
                      <i class="bi bi-box-arrow-up-right me-1"></i> Buka View
                    </router-link>
                  </div>

                  <h4 class="fw-bold text-uppercase text-white d-flex align-items-center gap-2 mb-2 fs-5">
                    <i :class="view.icon" class="text-info fs-4"></i>
                    {{ view.title }}
                  </h4>

                  <p class="text-white-50 small mb-3" style="line-height: 1.6;">
                    {{ view.description }}
                  </p>

                  <div class="bg-black bg-opacity-50 p-2.5 rounded-0 border border-secondary border-opacity-25 mb-3">
                    <div class="text-info small fw-bold mb-1"><i class="bi bi-cpu-fill me-1"></i> Tech Components:</div>
                    <div class="text-white-50 small">{{ view.techSpec }}</div>
                  </div>
                </div>

                <div class="d-flex flex-wrap gap-1 mt-auto pt-2 border-top border-secondary border-opacity-25">
                  <span v-for="(tag, tIdx) in view.tags" :key="tIdx" class="badge bg-dark text-info border border-info border-opacity-25 small">
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bank Address Cards -->
    <section class="py-4">
      <div class="container">
        <BankAddressCards />
      </div>
    </section>

    <!-- Footer -->
    <footer class="persona-footer py-5 border-top border-primary border-opacity-50 text-center position-relative overflow-hidden">
      <div class="container position-relative z-1 text-white">
        <div class="d-flex justify-content-center flex-wrap gap-3 mb-4">
          <a href="https://itsmebroarif.medium.com" target="_blank" class="p3-social-btn"><i class="bi bi-medium fs-4"></i></a>
          <a href="https://www.instagram.com/eexxvvn/" target="_blank" class="p3-social-btn"><i class="bi bi-instagram fs-4"></i></a>
          <a href="https://linkedin.com/in/arif-permana-putrasuryana-121b761b9" target="_blank" class="p3-social-btn"><i class="bi bi-linkedin fs-4"></i></a>
          <a href="https://wa.me/6285817048266" target="_blank" class="p3-social-btn"><i class="bi bi-whatsapp fs-4"></i></a>
        </div>
        
        <p class="mb-2 fw-bold text-uppercase fs-5 text-info">© 2026 KAFEINARTS STUDIO • ALL-OUT DEVELOPMENT</p>
        <p class="mb-0 text-white-50">DESIGNED & ARCHITECTED BY <strong class="text-white">ARIF PERMANA (ITSMEBROARIF)</strong></p>
      </div>
    </footer>

    <!-- ========================================================================= -->
    <!-- CINEMATIC ALL-OUT ATTACK FINISHER MODAL / OVERLAY                         -->
    <!-- ========================================================================= -->
    <transition name="all-out-fade">
      <div class="all-out-attack-overlay" v-if="showAllOutAttack" @click="showAllOutAttack = false">
        <div class="aoa-backdrop"></div>
        <div class="aoa-slash-line aoa-slash-1"></div>
        <div class="aoa-slash-line aoa-slash-2"></div>

        <div class="aoa-content-box text-center text-white" @click.stop>
          <div class="aoa-top-tag mb-2">
            <span>FINISHING TOUCH // PRODUCTION DEPLOY</span>
          </div>

          <h1 class="aoa-big-title">ALL-OUT ATTACK!</h1>
          
          <div class="aoa-quote-banner my-3 p-3">
            <h3 class="fw-extrabold text-uppercase mb-1 text-warning">
              "THE BATTLE IS FINISHED! CODE HAS BEEN DEPLOYED TO PRODUCTION!"
            </h3>
            <p class="mb-0 text-info fw-bold">ARIF PERMANA PUTRASURYANA • PROTAGONIST VICTORY</p>
          </div>

          <div class="d-flex justify-content-center gap-3 mt-4">
            <a href="https://wa.me/6285817048266" target="_blank" class="btn btn-warning text-dark fw-bold px-4 py-2.5 rounded-0 shadow-lg">
              <i class="bi bi-whatsapp me-1"></i> Mulai Proyek Bersama
            </a>
            <button class="btn btn-outline-light fw-bold px-4 py-2.5 rounded-0" @click="showAllOutAttack = false">
              Kembali ke Arena
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';
import Swal from 'sweetalert2';
import BankAddressCards from '../components/BankAddressCards.vue';

export default {
  name: 'DeveloperPortfolioView',
  components: {
    BankAddressCards
  },
  setup() {
    const canvasContainer = ref(null);
    const currentLang = ref('id');
    const activeCategory = ref('all');
    const activeSkillFilter = ref('all');
    const showAllOutAttack = ref(false);
    const portfolioTheme = ref(localStorage.getItem('taskarts_portfolio_theme') || 'classic');

    // 3D Three.js variables
    let scene, camera, renderer, animationFrameId;
    let icoWire, torusWire, sphereWire;
    let mouseX = 0, mouseY = 0;

    const setPortfolioTheme = (theme) => {
      portfolioTheme.value = theme;
      localStorage.setItem('taskarts_portfolio_theme', theme);
      updateThreeColors();
    };

    const updateThreeColors = () => {
      if (!icoWire || !torusWire || !sphereWire) return;
      if (portfolioTheme.value === 'omori') {
        icoWire.material.color.setHex(0xffffff);
        torusWire.material.color.setHex(0xaaaaaa);
        sphereWire.material.color.setHex(0x333333);
      } else {
        icoWire.material.color.setHex(0x0066ff);
        torusWire.material.color.setHex(0x00d2ff);
        sphereWire.material.color.setHex(0x1e3a8a);
      }
    };

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

      const matMainBlue = new THREE.LineBasicMaterial({ color: 0x0066ff, linewidth: 2 });
      const matCyan = new THREE.LineBasicMaterial({ color: 0x00d2ff, linewidth: 2 });
      const matDark = new THREE.LineBasicMaterial({ color: 0x1e3a8a, linewidth: 1, transparent: true, opacity: 0.25 });

      const icoGeometry = new THREE.IcosahedronGeometry(8, 0);
      icoWire = new THREE.LineSegments(new THREE.WireframeGeometry(icoGeometry), matMainBlue);
      icoWire.position.set(15, 10, -5);
      scene.add(icoWire);

      const torusGeometry = new THREE.TorusKnotGeometry(7, 2, 64, 8);
      torusWire = new THREE.LineSegments(new THREE.WireframeGeometry(torusGeometry), matCyan);
      torusWire.position.set(-18, -12, -10);
      scene.add(torusWire);

      const sphereWireGeo = new THREE.SphereGeometry(22, 10, 10);
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

      updateThreeColors();
      animate();
    };

    // Persona Battle Skills Deck
    const personaSkills = [
      {
        id: 'sk1',
        title: 'Zio Fullstack: Vue 3 & Composition',
        type: 'magic',
        elementName: 'ZIO / ELEC',
        elementIcon: '⚡',
        elementBadgeClass: 'bg-primary text-white',
        spCost: 18,
        power: 96,
        mastery: 'LV.MAX',
        barClass: 'bg-info',
        description: 'Serangan petir reaktif instan dengan Vue 3 Composition API, Pinia/Vuex state persistence, dan rendering komponen tanpa jeda.'
      },
      {
        id: 'sk2',
        title: 'Agi Controller: Laravel 11 REST API',
        type: 'physical',
        elementName: 'AGI / FIRE',
        elementIcon: '🔥',
        elementBadgeClass: 'bg-danger text-white',
        spCost: 22,
        power: 94,
        mastery: 'LV.94',
        barClass: 'bg-danger',
        description: 'Tebasan api backend berdaya rusak tinggi: Eloquent ORM, migrasi database, autentikasi JWT/Sanctum, dan perakitan RESTful API kokoh.'
      },
      {
        id: 'sk3',
        title: 'Bufu Matrix: Three.js & 3D WebGL',
        type: 'magic',
        elementName: 'BUFU / ICE',
        elementIcon: '❄️',
        elementBadgeClass: 'bg-info text-dark',
        spCost: 30,
        power: 90,
        mastery: 'LV.88',
        barClass: 'bg-info',
        description: 'Membekukan antarmuka datar menjadi stage 3D interaktif dinamis dengan Three.js, pencahayaan matematis, dan orbit interaktif.'
      },
      {
        id: 'sk4',
        title: 'Garu Aesthetic: Neobrutalism UI/UX',
        type: 'magic',
        elementName: 'GARU / WIND',
        elementIcon: '🌪️',
        elementBadgeClass: 'bg-success text-white',
        spCost: 16,
        power: 98,
        mastery: 'LV.MAX',
        barClass: 'bg-success',
        description: 'Badai visual berkecepatan tinggi: Figma design system, tipografi presisi, Tailwind utility, dan arsitektur responsif bebas cela.'
      },
      {
        id: 'sk5',
        title: 'Megidolaon: Cloud Architecture',
        type: 'magic',
        elementName: 'ALMIGHTY / MEGIN',
        elementIcon: '🌟',
        elementBadgeClass: 'bg-warning text-dark',
        spCost: 55,
        power: 100,
        mastery: 'LV.MAX',
        barClass: 'bg-warning',
        description: 'Jurus tertinggi pamungkas: integrasi database MySQL/PostgreSQL, VPS Nginx deployment, containerization, dan scale-out sistem.'
      },
      {
        id: 'sk6',
        title: 'Tarukaja Shield: CI/CD & Performance',
        type: 'support',
        elementName: 'SUPPORT / BUFF',
        elementIcon: '🛡️',
        elementBadgeClass: 'bg-secondary text-white',
        spCost: 14,
        power: 92,
        mastery: 'LV.90',
        barClass: 'bg-secondary',
        description: 'Buff pertahanan seluruh tim: Git branching workflow, code review ketat, optimasi bundle Vite, dan automated deployment pipelines.'
      },
      {
        id: 'sk7',
        title: 'Samarecarm: Bug Hunt & Refactoring',
        type: 'support',
        elementName: 'REVIVE / HEAL',
        elementIcon: '🔮',
        elementBadgeClass: 'bg-info text-dark',
        spCost: 20,
        power: 97,
        mastery: 'LV.96',
        barClass: 'bg-info',
        description: 'Membangkitkan kembali codebase warisan (legacy) yang rusak, mengeliminasi memory leaks, dan memperbaiki error controller hingga pulih 100%.'
      },
      {
        id: 'sk8',
        title: 'Mazio Sprint: Electron & Desktop App',
        type: 'physical',
        elementName: 'PHYSICAL / DESK',
        elementIcon: '⚡',
        elementBadgeClass: 'bg-primary text-white',
        spCost: 26,
        power: 89,
        mastery: 'LV.88',
        barClass: 'bg-primary',
        description: 'Membangun aplikasi lintas platform desktop (Windows/Mac/Linux) dengan integrasi hardware, printer thermal pos, dan file system lokal.'
      }
    ];

    const filteredSkills = computed(() => {
      if (activeSkillFilter.value === 'all') return personaSkills;
      return personaSkills.filter(s => s.type === activeSkillFilter.value);
    });

    // Translation dictionary
    const translations = {
      id: {
        hero_role: "FULLSTACK WEB DEV & UI/UX ARCHITECT",
        hero_quote: "\"Inovatif dan bekerja dengan tenggat waktu, merancang dan mengembangkan solusi digital yang berpusat pada pengguna, mulai dari konsep awal hingga hasil akhir yang sempurna.\"",
        about_desc1: "Saya adalah seorang full stack web developer berbakat dan berpengalaman. Saya ahli dalam pengembangan web dan aplikasi, termasuk front-end dan back-end. Dengan keahlian di berbagai teknologi Vue.js, Laravel, dan ahli didalam administrasi basis data menggunakan MySQL, saya mampu menciptakan solusi digital yang inovatif dan efisien.",
        about_desc2: "Selain itu, saya juga seorang UI/UX Designer yang berfokus pada menciptakan antarmuka pengguna yang menarik, intuitif, dan memberikan pengalaman optimal. Kombinasi ini membuat saya mampu menghasilkan solusi digital yang tidak hanya fungsional tetapi juga estetis dan user-friendly.",
        sys_showcase_sub: "Analisis mendalam per tiap view dan komponen yang membangun sistem RajinKerja.id",
        exp_sintesa_desc: "Mengelola ekosistem sistem informasi Rumah Sakit, Puskesmas, dan Klinik.",
        exp_aya_1: "Membuat website untuk penjualan assets vtuber.",
        exp_sada_1: "Mengembangkan website pendaftaran marathon & platform serving result hasil lari peserta."
      },
      en: {
        hero_role: "FULLSTACK WEB DEV & UI/UX ARCHITECT",
        hero_quote: "\"Innovative and working with deadlines, designing and developing user-centric digital solutions from initial concept to a perfect final result.\"",
        about_desc1: "I am a talented and experienced full stack web developer. I excel in web and application development, covering both front-end and back-end. With expertise in Vue.js, Laravel, and solid database administration using MySQL, I create innovative and efficient digital solutions.",
        about_desc2: "Additionally, I am a UI/UX Designer focused on creating attractive, intuitive, and optimal user interfaces. This combination allows me to deliver digital solutions that are functional, aesthetically pleasing, and user-friendly.",
        sys_showcase_sub: "In-depth breakdown of every view and component building RajinKerja.id OS",
        exp_sintesa_desc: "Managing information system ecosystems for Hospitals and Clinics.",
        exp_aya_1: "Created a website for selling vtuber assets.",
        exp_sada_1: "Developed a marathon registration website & runner results serving platform."
      },
      jp: {
        hero_role: "フルスタックエンジニア & UI/UXアーキテクト",
        hero_quote: "「納期を守り、ユーザー中心のデジタルソリューションを初期の構想から完璧な最終結果まで設計・開発します。」",
        about_desc1: "私は才能豊かで経験豊富なフルスタックウェブ開発者です。フロントエンドとバックエンドの両方を網羅するウェブおよびアプリ開発を得意としています。Vue.js、Laravelなどの技術やMySQLデータベース管理の専門知識を活かし、革新的で効率的なソリューションを作成します。",
        about_desc2: "さらに、魅力的で直感的なUI/UXの設計に焦点を当てたデザイナーでもあります。この組み合わせにより、機能的であるだけでなく、美しくユーザーフレンドリーなデジタルソリューションを提供できます。",
        sys_showcase_sub: "RajinKerja.id OSを構築する各コンポーネントとViewの完全分析",
        exp_sintesa_desc: "病院やクリニック向けの情報システムエコシステムの管理。",
        exp_aya_1: "Vtuberアセット販売用のウェブサイト作成。",
        exp_sada_1: "マラソン登録ウェブサイトおよびランナー結果提供プラットフォームの開発。"
      }
    };

    const t = (key) => {
      if (translations[currentLang.value] && translations[currentLang.value][key]) {
        return translations[currentLang.value][key];
      }
      return translations.id[key] || key;
    };

    const setLanguage = (lang) => {
      currentLang.value = lang;
    };

    // Showcase views
    const showcaseCategories = [
      { id: 'all', name: 'Semua Views', icon: '⚡' },
      { id: 'workflow', name: 'Workflow & Proyek', icon: '📌' },
      { id: 'media', name: 'Media & Pemutar', icon: '🎵' },
      { id: 'finance', name: 'Keuangan & Data', icon: '💰' },
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
        id: 'videos',
        category: 'media',
        categoryName: 'Media & Pemutar',
        route: '/videos',
        icon: 'bi bi-collection-play-fill',
        title: 'UploadMediaView (Upload & Media Player)',
        description: 'Player musik dan video serba bisa dengan playlist manager terintegrasi. Upload berkas audio/video lokal, sinkronisasi link YouTube, dan putar langsung di browser dengan visualizer vinyl animasi.',
        techSpec: 'HTML5 Audio/Video Context, Dynamic Playlist Array, Drag & Drop Upload, ObjectURL Resolver',
        tags: ['MediaPlayer', 'MusicPlayer', 'Playlists', 'VideoHub']
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
        id: 'preferences',
        category: 'system',
        categoryName: 'System & Tools',
        route: '/preferences',
        icon: 'bi bi-sliders',
        title: 'PreferencesView (Theme Coffee & OLED)',
        description: 'Pusat kontrol tema (Light, Dark Slate, OLED True Black, Coffee Mode), pemilih warna aksen kustom, tombol Install PWA, serta fasilitas Ekspor & Impor JSON seluruh data aplikasi.',
        techSpec: 'CSS Variable Theme Swapper, JSON Blob Importer/Exporter, PWA ServiceWorker Bridge',
        tags: ['ThemeSettings', 'CoffeeMode', 'BackupRestore', 'PWAInstaller']
      }
    ];

    const filteredShowcaseViews = computed(() => {
      if (activeCategory.value === 'all') return showcaseViews;
      return showcaseViews.filter(v => v.category === activeCategory.value);
    });

    const scrollToSection = (id) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const triggerAllOutAttack = () => {
      showAllOutAttack.value = true;
    };

    onMounted(() => {
      initThreeCanvas();

      try {
        gsap.from('.gsap-hero-el', {
          y: 70,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out'
        });
      } catch (e) {
        console.warn('GSAP notice:', e);
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

    return {
      canvasContainer,
      currentLang,
      portfolioTheme,
      setPortfolioTheme,
      activeCategory,
      activeSkillFilter,
      personaSkills,
      filteredSkills,
      showcaseCategories,
      showcaseViews,
      filteredShowcaseViews,
      showAllOutAttack,
      setLanguage,
      t,
      scrollToSection,
      triggerAllOutAttack
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;900&family=Cabinet+Grotesk:wght@800;900&display=swap');

.developer-portfolio-page {
  font-family: 'Space Grotesk', sans-serif;
  background-color: #030714;
  color: #ffffff;
  position: relative;
  overflow-x: hidden;
  margin: -1rem -1rem;
  padding: 0;
  min-height: 100vh;
}

#portfolio-canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

/* Background Overlays: Halftone & Speedlines */
.manga-speedlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    -55deg,
    rgba(0, 102, 255, 0.03) 0px,
    rgba(0, 102, 255, 0.03) 2px,
    transparent 2px,
    transparent 14px
  );
  pointer-events: none;
  z-index: 0;
}

.halftone-dot-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(0, 210, 255, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
  z-index: 0;
}

.bg-navy-grid {
  background: linear-gradient(180deg, rgba(3, 7, 20, 0.7) 0%, rgba(6, 18, 44, 0.85) 50%, rgba(3, 7, 20, 0.7) 100%);
}

/* Top Persona HUD Bar */
.persona-hud-bar {
  background: rgba(2, 6, 23, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 2px solid rgba(0, 102, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 1030;
}

.hud-slash-badge {
  background: #0066ff;
  color: #ffffff;
  font-weight: 900;
  font-size: 0.75rem;
  padding: 2px 8px;
  clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);
  margin-right: 6px;
  display: inline-block;
}

.hud-title {
  letter-spacing: 1px;
  font-size: 1.1rem;
}

.hud-meter-wrap {
  width: 110px;
}

.hud-bar-bg {
  height: 6px;
  background: #1e293b;
  border-radius: 2px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hud-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.eq-pulse-dot {
  width: 8px;
  height: 8px;
  background: #00d2ff;
  border-radius: 50%;
  animation: pulse-dot 1s infinite alternate ease-in-out;
}

@keyframes pulse-dot {
  from { opacity: 0.4; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1.3); }
}

.p3-lang-btn {
  background: #0f172a;
  border: 1px solid rgba(0, 210, 255, 0.3);
  color: #94a3b8;
  font-weight: bold;
  font-size: 0.75rem;
  padding: 3px 10px;
  transition: all 0.2s;
}

.p3-lang-btn.active, .p3-lang-btn:hover {
  background: #0066ff;
  color: #ffffff;
  border-color: #00d2ff;
}

/* ========================================================================= */
/* 3D DIAGONAL MIRING KANAN KIRI ENGINE                                      */
/* ========================================================================= */
.card-tilt-left {
  perspective: 1200px;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s ease;
  transform: perspective(1000px) rotateY(6deg) skewX(-4deg) rotateZ(-1.2deg);
}

.card-tilt-right {
  perspective: 1200px;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s ease;
  transform: perspective(1000px) rotateY(-6deg) skewX(4deg) rotateZ(1.2deg);
}

.card-tilt-left:hover, .card-tilt-right:hover {
  transform: perspective(1000px) translateZ(30px) rotateY(0deg) skewX(0deg) rotateZ(0deg) scale(1.02);
  z-index: 10;
}

.card-tilt-left:hover .persona-skill-card,
.card-tilt-left:hover .persona-char-card,
.card-tilt-left:hover .persona-quest-card,
.card-tilt-right:hover .persona-skill-card,
.card-tilt-right:hover .persona-stats-card,
.card-tilt-right:hover .persona-quest-card {
  border-color: #00d2ff !important;
  box-shadow: -8px 8px 0px #020617, 0 0 35px rgba(0, 102, 255, 0.5) !important;
}

/* Hero Titles */
.p3r-battle-phase-pill {
  background: rgba(2, 6, 23, 0.85);
  border: 2px solid #0066ff;
  padding: 4px 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: -4px 4px 0 #000;
}

.phase-badge {
  font-weight: 900;
  font-size: 0.8rem;
  padding: 2px 8px;
}

.phase-title {
  font-weight: 800;
  letter-spacing: 1px;
  font-size: 0.85rem;
}

.phase-tag {
  font-weight: 900;
  font-size: 0.75rem;
  padding: 2px 6px;
}

.p3r-hero-3d-stage {
  perspective: 1000px;
  max-width: 900px;
}

.p3r-slanted-title-left {
  transform: perspective(900px) rotateY(8deg) skewX(-6deg) rotateZ(-2deg);
  display: inline-block;
  margin-bottom: 6px;
}

.p3r-slanted-title-right {
  transform: perspective(900px) rotateY(-8deg) skewX(6deg) rotateZ(2deg);
  display: inline-block;
}

.p3r-cutout-title {
  font-family: 'Cabinet Grotesk', 'Space Grotesk', sans-serif;
  font-size: clamp(2.8rem, 7vw, 5.5rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -1px;
  margin: 0;
  background: #ffffff;
  color: #030714;
  padding: 4px 24px;
  display: inline-block;
  box-shadow: -10px 10px 0px #0066ff, -18px 18px 0px #020617;
  border: 4px solid #000000;
}

.p3r-accent-title {
  background: #0066ff;
  color: #ffffff;
  box-shadow: 10px 10px 0px #00d2ff, 18px 18px 0px #020617;
  border: 4px solid #000000;
}

.p3r-role-banner {
  background: #0b1a3d;
  border: 2px solid #00d2ff;
  color: #00d2ff;
  font-weight: 900;
  padding: 8px 24px;
  box-shadow: -4px 4px 0px #020617;
  letter-spacing: 2px;
}

.p3r-quote-battle-card {
  background: rgba(11, 26, 61, 0.75);
  backdrop-filter: blur(10px);
  border: 2px solid #0066ff;
  border-left: 8px solid #00d2ff;
  padding: 20px 24px;
  box-shadow: -8px 8px 0px #020617;
  text-align: left;
}

/* Battle Command Buttons (Slanted Arc) */
.p3-cmd-pill {
  background: #0b1a3d;
  border: 2px solid #0066ff;
  color: #ffffff;
  text-decoration: none;
  padding: 12px 22px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: -5px 5px 0px #020617;
  transform: skewX(-6deg);
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  cursor: pointer;
}

.p3-cmd-pill:hover {
  background: #0066ff;
  color: #ffffff;
  border-color: #00d2ff;
  transform: skewX(-6deg) translateY(-5px);
  box-shadow: -8px 8px 0px #00d2ff, 0 0 25px rgba(0, 102, 255, 0.6);
}

.cmd-icon {
  font-size: 1.5rem;
}

.cmd-attack {
  border-color: #f59e0b;
}
.cmd-attack:hover {
  background: #b45309;
  border-color: #fbbf24;
}

/* Marquee */
.persona-marquee {
  background: #0066ff;
  color: #ffffff;
  font-weight: 900;
  padding: 10px 0;
  overflow: hidden;
  white-space: nowrap;
  border-top: 3px solid #000;
  border-bottom: 3px solid #000;
  transform: rotate(-1deg);
  margin: 30px -10px;
}

.persona-marquee-inner {
  display: inline-block;
  animation: marquee-scroll 25s linear infinite;
  letter-spacing: 2px;
}

@keyframes marquee-scroll {
  from { transform: translateX(0%); }
  to { transform: translateX(-50%); }
}

/* Persona Character & Status Cards */
.persona-char-card, .persona-stats-card, .persona-skill-card, .persona-quest-card {
  background: rgba(11, 26, 61, 0.85);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(0, 102, 255, 0.6);
  box-shadow: -8px 8px 0px #020617;
  position: relative;
  transition: all 0.3s ease;
}

.char-photo-wrap {
  width: 220px;
  height: 220px;
}

.char-photo-border {
  position: absolute;
  inset: -6px;
  border: 3px solid #00d2ff;
  transform: rotate(-3deg);
  box-shadow: -6px 6px 0px #0066ff;
}

.char-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 1;
  filter: contrast(1.1) saturate(1.1);
  border: 3px solid #000;
}

.char-persona-tag {
  position: absolute;
  bottom: -10px;
  right: -15px;
  background: #020617;
  border: 2px solid #00d2ff;
  padding: 4px 10px;
  z-index: 2;
  box-shadow: -4px 4px 0 #000;
}

/* Stat Meters */
.stat-track {
  height: 8px;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  transition: width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Filter Buttons */
.p3-filter-btn {
  background: #0f172a;
  border: 2px solid rgba(0, 102, 255, 0.5);
  color: #ffffff;
  font-weight: bold;
  padding: 8px 18px;
  transform: skewX(-4deg);
  transition: all 0.2s ease;
}

.p3-filter-btn.active, .p3-filter-btn:hover {
  background: #0066ff;
  border-color: #00d2ff;
  box-shadow: -4px 4px 0px #00d2ff;
}

/* Social Buttons */
.p3-social-btn {
  width: 50px;
  height: 50px;
  background: #0f172a;
  border: 2px solid #0066ff;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: -4px 4px 0 #020617;
  transform: skewX(-4deg);
  transition: all 0.2s;
}

.p3-social-btn:hover {
  background: #00d2ff;
  color: #030714;
  transform: skewX(-4deg) translateY(-4px);
}

/* All-Out Attack Cinematic Overlay */
.all-out-attack-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 20, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.aoa-backdrop {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    rgba(0, 102, 255, 0.15) 0px,
    rgba(0, 102, 255, 0.15) 10px,
    transparent 10px,
    transparent 20px
  );
}

.aoa-slash-line {
  position: absolute;
  height: 8px;
  width: 150%;
  background: #00d2ff;
  box-shadow: 0 0 25px #00d2ff;
}

.aoa-slash-1 {
  top: 30%;
  left: -25%;
  transform: rotate(-25deg);
}

.aoa-slash-2 {
  bottom: 25%;
  left: -25%;
  transform: rotate(20deg);
  background: #ff0055;
  box-shadow: 0 0 25px #ff0055;
}

.aoa-content-box {
  position: relative;
  z-index: 2;
  max-width: 750px;
  padding: 30px;
  background: #020617;
  border: 4px solid #0066ff;
  box-shadow: -15px 15px 0px #00d2ff, 0 0 50px rgba(0, 102, 255, 0.8);
  transform: skewX(-4deg);
}

.aoa-big-title {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  letter-spacing: 2px;
  color: #ffffff;
  text-shadow: 5px 5px 0px #0066ff, 10px 10px 0px #000;
}

.aoa-quote-banner {
  background: #0b1a3d;
  border: 2px solid #00d2ff;
}

.aoa-top-tag {
  display: inline-block;
  background: #ff0055;
  padding: 4px 14px;
  font-weight: 900;
  font-size: 0.85rem;
  letter-spacing: 1px;
}

/* Animations */
.all-out-fade-enter-active, .all-out-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.all-out-fade-enter-from, .all-out-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

/* =========================================================================
   OMORI DARK THEME MODE (WHITE SPACE / HANDWRITTEN NOTEBOOK AESTHETIC)
   ========================================================================= */
.omori-theme-mode {
  font-family: 'Patrick Hand', 'Caveat', cursive, sans-serif !important;
  background-color: #08080a !important;
  color: #f3f4f6 !important;
}

.omori-theme-mode h1,
.omori-theme-mode h2,
.omori-theme-mode h3,
.omori-theme-mode h4,
.omori-theme-mode h5,
.omori-theme-mode h6,
.omori-theme-mode .hud-title,
.omori-theme-mode .p3r-cutout-title,
.omori-theme-mode .skill-name {
  font-family: 'Patrick Hand', 'Caveat', cursive, sans-serif !important;
  letter-spacing: 1px !important;
}

/* Hand-drawn borders for OMORI cards */
.omori-theme-mode .persona-quest-card,
.omori-theme-mode .p3r-quote-battle-card,
.omori-theme-mode .p3r-skill-slot,
.omori-theme-mode .showcase-item-card,
.omori-theme-mode .hud-bar-bg,
.omori-theme-mode .aoa-content-box {
  border: 2px solid #e2e8f0 !important;
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px !important;
  background: #111114 !important;
  box-shadow: 4px 4px 0px rgba(255, 255, 255, 0.25) !important;
  transform: none !important;
}

.omori-theme-mode .p3r-slanted-title-left,
.omori-theme-mode .p3r-slanted-title-right,
.omori-theme-mode .card-tilt-left,
.omori-theme-mode .card-tilt-right {
  transform: none !important;
}

.omori-theme-mode .p3r-cutout-title {
  color: #ffffff !important;
  text-shadow: 3px 3px 0px #222 !important;
  font-weight: 700 !important;
}

.omori-theme-mode .p3r-accent-title {
  color: #e2e8f0 !important;
  -webkit-text-stroke: 1px #ffffff !important;
}

.omori-theme-mode .btn {
  font-family: 'Patrick Hand', cursive, sans-serif !important;
  font-size: 1.1rem !important;
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px !important;
}

/* OMORI Hanging Black Lightbulb in White Space */
.omori-lightbulb-dangle {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  pointer-events: none;
  animation: bulbSwing 4s ease-in-out infinite alternate;
}

.omori-bulb-cord {
  width: 2px;
  height: 60px;
  background: #ffffff;
  margin: 0 auto;
  opacity: 0.8;
}

.omori-bulb-glow {
  color: #ffffff;
  font-size: 22px;
  text-align: center;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.85));
}

@keyframes bulbSwing {
  0% { transform: translateX(-50%) rotate(-4deg); }
  100% { transform: translateX(-50%) rotate(4deg); }
}

.theme-mode-switch-group button {
  cursor: pointer;
  border: none;
  font-size: 11px;
}
</style>
