<template>
  <div class="card border-0 shadow-sm rounded-4 bg-white p-3 p-md-4 mb-4 motivational-booster-card position-relative overflow-hidden" id="motivationalBoosterSection">
    <!-- Bright Atmospheric Ambient Glows -->
    <div class="ambient-glow-top"></div>
    <div class="ambient-glow-bottom"></div>

    <!-- Header & Action Controls -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3 border-bottom pb-3 position-relative" style="z-index: 5;">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
          <span class="badge bg-warning text-dark fw-bold px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1 shadow-xs">
            <i class="bi bi-fire text-danger"></i> BOOSTER ENERGI KERJA 3D
          </span>
          <span class="badge bg-primary-subtle text-primary fw-bold px-2.5 py-1 rounded-pill small">
            Three.js & GSAP Engine
          </span>
          <span class="badge bg-success-subtle text-success fw-bold px-2.5 py-1 rounded-pill small">
            <i class="bi bi-aspect-ratio me-1"></i> Frame Adaptif ({{ currentOrientationLabel }})
          </span>
        </div>
        <h4 class="fw-black text-dark mb-0 d-flex align-items-center gap-2">
          <span>🖼️ Bingkai Motivasi & Tujuan Bekerja</span>
          <span class="sparkle-icon">✨</span>
        </h4>
        <p class="small text-muted mb-0">
          Visualisasi 3D foto penyemangat (Keluarga, Target Impian, atau Cita-cita) dengan pencahayaan studio cerah & bingkai adaptif otomatis.
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="d-flex flex-wrap align-items-center gap-2">
        <button
          class="btn btn-sm btn-outline-warning text-dark rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-1.5 shadow-xs"
          @click="triggerCheerBoost"
          title="Kirim sentuhan energi positif & efek partikel"
        >
          <i class="bi bi-lightning-charge-fill text-warning"></i>
          <span>{{ cheerCount > 0 ? `Semangat (${cheerCount})` : 'Booster Semangat!' }}</span>
        </button>

        <button
          class="btn btn-sm btn-primary rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-1.5 shadow-xs"
          @click="triggerFileInput"
        >
          <i class="bi bi-cloud-arrow-up-fill"></i>
          <span>Upload Foto Motivasi</span>
        </button>

        <router-link
          to="/custom-bingkai"
          class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
          title="Kustomisasi Bingkai & Tulisan (Halaman Penuh)"
        >
          <i class="bi bi-sliders"></i>
          <span>Custom Bingkai</span>
        </router-link>

        <button
          class="btn btn-sm btn-light border rounded-pill px-2.5 py-1.5 text-muted"
          @click="resetCameraView"
          title="Reset Sudut Pandang 3D"
        >
          <i class="bi bi-arrow-counterclockwise"></i>
        </button>
      </div>
    </div>

    <!-- Main 3D Canvas Stage & Interactive Overlay -->
    <div class="row g-3 g-lg-4 align-items-center position-relative" style="z-index: 4;">
      <!-- 3D Viewport Column -->
      <div class="col-lg-8">
        <div 
          class="canvas-stage-wrapper rounded-4 border position-relative overflow-hidden"
          :class="{ 'is-dragging': isDragging }"
          ref="stageContainer"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
          @mouseleave="onMouseUp"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onFileDrop"
        >
          <!-- Three.js Canvas Container -->
          <div ref="threeCanvasRef" class="three-canvas-container"></div>

          <!-- Drop File Overlay (Drag & Drop) -->
          <div v-if="isDropHover" class="drag-drop-overlay d-flex flex-column align-items-center justify-content-center text-center p-4">
            <i class="bi bi-images display-4 text-primary mb-2 animate-bounce"></i>
            <h5 class="fw-bold text-dark mb-1">Lepaskan Foto Disini</h5>
            <p class="small text-muted mb-0">Format: JPG, PNG, WEBP, GIF (Landscape & Portrait didukung otomatis)</p>
          </div>

          <!-- Top Stage Badges -->
          <div class="stage-overlay-top position-absolute top-0 start-0 w-100 p-3 d-flex justify-content-between align-items-start pointer-events-none">
            <div class="d-flex flex-column gap-1">
              <span class="badge bg-white bg-opacity-90 backdrop-blur text-dark border shadow-xs px-2.5 py-1 rounded-pill small fw-bold">
                <i class="bi bi-sun-fill text-warning me-1"></i> {{ currentLightModeLabel }}
              </span>
              <span class="badge bg-white bg-opacity-90 backdrop-blur text-dark border shadow-xs px-2.5 py-1 rounded-pill small fw-bold">
                <i class="bi bi-palette-fill text-primary me-1"></i> {{ currentFrameStyleLabel }}
              </span>
            </div>

            <div class="pointer-events-auto d-flex gap-1">
              <button 
                class="btn btn-sm btn-white bg-white shadow-xs rounded-circle p-2 d-flex align-items-center justify-content-center text-secondary hover-primary"
                @click="toggleLightingMode"
                title="Ganti Suasana Pencahayaan (Siang Terang / Golden Hour / Vibrant)"
              >
                <i class="bi bi-brightness-high-fill text-warning fs-6"></i>
              </button>
              <button 
                class="btn btn-sm btn-white bg-white shadow-xs rounded-circle p-2 d-flex align-items-center justify-content-center text-secondary hover-primary"
                @click="cycleFrameStyle"
                title="Ganti Model Bingkai 3D"
              >
                <i class="bi bi-magic text-primary fs-6"></i>
              </button>
            </div>
          </div>

          <!-- Bottom Stage Plaque & Navigation -->
          <div class="stage-overlay-bottom position-absolute bottom-0 start-0 w-100 p-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-end gap-2 pointer-events-none">
            <!-- Dedication Plaque Box -->
            <div class="plaque-card p-2.5 px-3 rounded-3 bg-white bg-opacity-95 backdrop-blur border shadow-sm pointer-events-auto max-w-450">
              <div class="d-flex align-items-center justify-content-between gap-2 mb-1">
                <div class="d-flex align-items-center gap-1.5">
                  <span class="fs-6">🎯</span>
                  <span class="fw-extrabold text-dark small text-truncate">{{ activeItem.title || 'Tujuan Utama Bekerja' }}</span>
                </div>
                <button 
                  class="btn btn-link p-0 text-muted small text-decoration-none"
                  @click="openEditQuoteModal"
                  title="Edit Tulisan Motivasi"
                >
                  <i class="bi bi-pencil-fill" style="font-size: 11px;"></i>
                </button>
              </div>
              <p class="small text-secondary fst-italic mb-0 line-clamp-2" style="font-size: 12px; line-height: 1.4;">
                "{{ activeItem.quote || 'Bekerja dengan penuh rasa syukur dan dedikasi untuk kebaikan masa depan.' }}"
              </p>
            </div>

            <!-- 3D Navigation Controls -->
            <div class="d-flex align-items-center gap-1.5 pointer-events-auto align-self-end">
              <button 
                class="btn btn-sm btn-white bg-white shadow-sm rounded-pill px-2.5 py-1 text-dark fw-bold d-flex align-items-center gap-1"
                @click="prevPhoto"
                :disabled="photosList.length <= 1"
                title="Foto Sebelumnya"
              >
                <i class="bi bi-chevron-left"></i>
                <span class="d-none d-sm-inline">Prev</span>
              </button>
              <span class="badge bg-dark text-white rounded-pill px-2.5 py-1.5 small fw-bold">
                {{ activeIndex + 1 }} / {{ photosList.length }}
              </span>
              <button 
                class="btn btn-sm btn-white bg-white shadow-sm rounded-pill px-2.5 py-1 text-dark fw-bold d-flex align-items-center gap-1"
                @click="nextPhoto"
                :disabled="photosList.length <= 1"
                title="Foto Selanjutnya"
              >
                <span class="d-none d-sm-inline">Next</span>
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>

          <!-- 3D Interactive Helper Tooltip -->
          <div class="interactive-hint position-absolute top-50 start-50 translate-middle pointer-events-none" v-if="showHint">
            <span class="badge bg-dark bg-opacity-75 text-white px-3 py-1.5 rounded-pill small fw-normal shadow">
              <i class="bi bi-arrows-move me-1"></i> Geser kursor untuk memutar sudut bingkai 3D
            </span>
          </div>
        </div>
      </div>

      <!-- Right Sidebar: Quick Motivation Panel, Energy Meter & Gallery Carousel -->
      <div class="col-lg-4">
        <div class="d-flex flex-column gap-3 h-100 justify-content-between">
          <!-- Motivational Affirmation Card -->
          <div class="p-3.5 rounded-4 bg-gradient-amber-light border border-amber-light shadow-xs position-relative overflow-hidden">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="small fw-extrabold text-amber-dark text-uppercase tracking-wider">
                ⚡ Motivasi Harian Kamu
              </span>
              <span class="badge bg-warning text-dark fw-bold rounded-pill" style="font-size: 11px;">
                Fokus & Konsisten
              </span>
            </div>

            <h6 class="fw-bold text-dark mb-1">{{ activeItem.targetGoal || 'Dedikasi Terbaik Hari Ini' }}</h6>
            <p class="small text-muted mb-3" style="line-height: 1.45;">
              Ingatlah alasan mengapa kamu berjuang saat ini. Setiap tugas yang kamu selesaikan membawamu selangkah lebih dekat ke impianmu!
            </p>

            <!-- Energy & Focus Gauge -->
            <div class="bg-white p-2.5 rounded-3 border shadow-xs">
              <div class="d-flex justify-content-between align-items-center small fw-bold mb-1">
                <span class="text-secondary"><i class="bi bi-battery-charging text-success me-1"></i>Tingkat Semangat:</span>
                <span class="text-success">{{ currentEnergyPercent }}% MAKSIMAL</span>
              </div>
              <div class="progress" style="height: 7px;">
                <div 
                  class="progress-bar bg-gradient-success progress-bar-striped progress-bar-animated" 
                  role="progressbar" 
                  :style="{ width: `${currentEnergyPercent}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Photo Gallery Reel / Thumbnails Strip -->
          <div class="gallery-reel-box p-3 rounded-4 bg-light border">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="small fw-bold text-dark d-flex align-items-center gap-1">
                <i class="bi bi-collection-fill text-primary"></i> Koleksi Foto Motivasi
              </span>
              <button 
                class="btn btn-link p-0 text-primary small fw-semibold text-decoration-none"
                @click="triggerFileInput"
              >
                + Tambah Foto
              </button>
            </div>

            <!-- Horizontal Scrollable Thumbnails -->
            <div class="d-flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              <div 
                v-for="(item, idx) in photosList" 
                :key="item.id || idx"
                class="thumb-card rounded-3 border position-relative overflow-hidden flex-shrink-0 cursor-pointer"
                :class="{ 'thumb-active': idx === activeIndex }"
                @click="selectPhoto(idx)"
                :title="item.title"
              >
                <img :src="item.src" :alt="item.title" class="thumb-img" />
                <div class="thumb-badge">
                  <i v-if="item.orientation === 'landscape'" class="bi bi-layout-sidebar-inset-reverse"></i>
                  <i v-else-if="item.orientation === 'portrait'" class="bi bi-file-earmark-person"></i>
                  <i v-else class="bi bi-square"></i>
                </div>
                <div v-if="idx === activeIndex" class="thumb-active-indicator">
                  <i class="bi bi-check-circle-fill text-white"></i>
                </div>
              </div>
            </div>

            <!-- Quick Preset Inspirations -->
            <div class="mt-2.5 pt-2 border-top d-flex align-items-center justify-content-between flex-wrap gap-1">
              <span class="small text-muted fw-semibold" style="font-size: 11px;">Inspirasi Bawaan:</span>
              <div class="d-flex gap-1">
                <button 
                  v-for="preset in defaultPresets" 
                  :key="preset.id"
                  class="btn btn-xs btn-outline-secondary rounded-pill px-2 py-0.5"
                  style="font-size: 10px;"
                  @click="applyPreset(preset)"
                >
                  {{ preset.shortName }}
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom Action Row: Customize & Fullscreen Inspiration -->
          <div class="d-flex gap-2">
            <router-link 
              to="/custom-bingkai"
              class="btn btn-outline-primary rounded-3 w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-1.5 shadow-xs text-decoration-none"
            >
              <i class="bi bi-sliders"></i>
              <span>Kustomisasi Bingkai</span>
            </router-link>
            <button 
              class="btn btn-warning rounded-3 w-100 py-2 fw-bold text-dark d-flex align-items-center justify-content-center gap-1.5 shadow-xs"
              @click="triggerCheerBoost"
            >
              <i class="bi bi-stars"></i>
              <span>Booster Energi!</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden Native File Input -->
    <input 
      type="file" 
      ref="fileInputRef" 
      class="d-none" 
      accept="image/png, image/jpeg, image/webp, image/gif"
      @change="handleFileUpload"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';

export default {
  name: 'MotivationalFrame3D',
  setup() {
    // -------------------------------------------------------------
    // DEFAULT INSPIRATIONAL PRESET IMAGES
    // -------------------------------------------------------------
    const defaultPresets = [
      {
        id: 'preset-family',
        shortName: 'Keluarga ❤️',
        title: 'Keluarga Tercinta & Rumah Bahagia',
        quote: 'Setiap tetes keringat dan lelah hari ini adalah senyum bahagia keluarga esok hari.',
        targetGoal: 'Membahagiakan Orang Tua & Anak',
        orientation: 'landscape',
        // High quality warm inspiring family & home SVG/data canvas
        src: createUpliftingArtSvg('family')
      },
      {
        id: 'preset-future-home',
        shortName: 'Rumah Impian 🏠',
        title: 'Target Rumah Impian & Masa Depan 2026',
        quote: 'Fokus konsisten setiap hari, langkah kecil akan mengantarkan kita ke rumah idaman yang nyaman.',
        targetGoal: 'Target Hunian Nyaman 2026',
        orientation: 'landscape',
        src: createUpliftingArtSvg('home')
      },
      {
        id: 'preset-success-career',
        shortName: 'Sukses Karir 🚀',
        title: 'Prestasi & Kemandirian Finansial',
        quote: 'Jangan menyerah saat proses terasa berat. Pemenang adalah mereka yang terus melangkah maju.',
        targetGoal: 'Kemandirian Finansial & Karir Gemilang',
        orientation: 'portrait',
        src: createUpliftingArtSvg('career')
      },
      {
        id: 'preset-spiritual',
        shortName: 'Ibadah & Berkah 🕋',
        title: 'Niat Suci & Keberkahan Rezeki',
        quote: 'Bismillah, niatkan setiap lelah sebagai ibadah dan pembuka pintu berkah untuk sesama.',
        targetGoal: 'Target Ibadah Umroh & Haji',
        orientation: 'portrait',
        src: createUpliftingArtSvg('spiritual')
      }
    ];

    // -------------------------------------------------------------
    // STATE & STORAGE
    // -------------------------------------------------------------
    const storageKey = 'rajinkerja_motivation_gallery_v2';
    const settingsKey = 'rajinkerja_motivation_settings_v2';

    const photosList = ref([]);
    const activeIndex = ref(0);
    const cheerCount = ref(0);
    const isDragging = ref(false);
    const isDropHover = ref(false);
    const showHint = ref(true);
    const showSettingsModal = ref(false);

    // Frame styling & Lighting presets
    const currentFrameStyle = ref('gold');
    const currentLightingMode = ref('daylight');

    const frameStyles = [
      { id: 'gold', name: 'Golden Elegance', desc: 'Emas Berkilau Mewah', previewColor: 'linear-gradient(135deg, #f59e0b, #d97706)' },
      { id: 'oak', name: 'Warm Oak Wood', desc: 'Kayu Oak Natural Hangat', previewColor: 'linear-gradient(135deg, #b45309, #78350f)' },
      { id: 'white', name: 'Studio White', desc: 'Minimalis Modern Putih', previewColor: 'linear-gradient(135deg, #ffffff, #e2e8f0)' },
      { id: 'noir', name: 'Matte Slate Noir', desc: 'Hitam Maskulin Elegan', previewColor: 'linear-gradient(135deg, #334155, #0f172a)' },
      { id: 'rosegold', name: 'Rose Gold Luxury', desc: 'Mewah Elegan Rose Gold', previewColor: 'linear-gradient(135deg, #fb7185, #f43f5e)' },
      { id: 'aura', name: 'Cyber Glow Aura', desc: 'Neon Cyan Ambience', previewColor: 'linear-gradient(135deg, #06b6d4, #0284c7)' }
    ];

    const lightingModes = [
      { id: 'daylight', name: 'Studio Siang Terang (Daylight)', desc: 'Pencahayaan terang maksimal, cerah & tajam', icon: '☀️' },
      { id: 'golden', name: 'Golden Hour Warm (Hangat)', desc: 'Nuansa sinar matahari terbit/terbenam penuh harapan', icon: '🌅' },
      { id: 'vibrant', name: 'Vibrant Bloom (Ceria)', desc: 'Pencahayaan lembut penuh energi positif', icon: '🌸' }
    ];

    const editForm = ref({
      title: '',
      quote: '',
      targetGoal: ''
    });

    // -------------------------------------------------------------
    // DOM REFS
    // -------------------------------------------------------------
    const stageContainer = ref(null);
    const threeCanvasRef = ref(null);
    const fileInputRef = ref(null);

    // -------------------------------------------------------------
    // THREE.JS ENGINE VARIABLES
    // -------------------------------------------------------------
    let scene, camera, renderer, animationFrameId;
    let frameGroup, photoMesh, outerFrameMesh, innerMatMesh, glassMesh, standMesh;
    let particleSystem, particlePositions, particleSpeeds;
    let ambientLight, mainSunLight, warmRimLight, keySpotLight;
    let currentTexture = null;

    // Interactive mouse drag tracking
    let isMouseDown = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };
    let currentRotation = { x: 0, y: 0 };

    // -------------------------------------------------------------
    // COMPUTED
    // -------------------------------------------------------------
    const activeItem = computed(() => {
      if (!photosList.value.length) {
        return defaultPresets[0];
      }
      return photosList.value[activeIndex.value] || photosList.value[0];
    });

    const currentOrientationLabel = computed(() => {
      const ori = activeItem.value.orientation || 'landscape';
      if (ori === 'portrait') return 'Portrait 3:4';
      if (ori === 'landscape') return 'Landscape 16:9';
      return 'Square 1:1';
    });

    const currentFrameStyleLabel = computed(() => {
      const f = frameStyles.find(s => s.id === currentFrameStyle.value);
      return f ? f.name : 'Golden Elegance';
    });

    const currentLightModeLabel = computed(() => {
      const l = lightingModes.find(m => m.id === currentLightingMode.value);
      return l ? l.name : 'Daylight Terang';
    });

    const currentEnergyPercent = computed(() => {
      return Math.min(100, 85 + (cheerCount.value * 3));
    });

    // -------------------------------------------------------------
    // INITIALIZATION & LOCAL STORAGE
    // -------------------------------------------------------------
    const loadStoredData = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            photosList.value = parsed;
          } else {
            photosList.value = [...defaultPresets];
          }
        } else {
          photosList.value = [...defaultPresets];
        }

        const savedSettings = localStorage.getItem(settingsKey);
        if (savedSettings) {
          const s = JSON.parse(savedSettings);
          if (s.frameStyle) currentFrameStyle.value = s.frameStyle;
          if (s.lightingMode) currentLightingMode.value = s.lightingMode;
          if (typeof s.activeIndex === 'number' && s.activeIndex < photosList.value.length) {
            activeIndex.value = s.activeIndex;
          }
        }
      } catch (e) {
        photosList.value = [...defaultPresets];
      }

      syncEditForm();
    };

    const persistData = () => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(photosList.value));
        localStorage.setItem(settingsKey, JSON.stringify({
          frameStyle: currentFrameStyle.value,
          lightingMode: currentLightingMode.value,
          activeIndex: activeIndex.value
        }));
      } catch (e) {
        console.warn('Storage limit reached, keeping in-memory state');
      }
    };

    const syncEditForm = () => {
      if (activeItem.value) {
        editForm.value = {
          title: activeItem.value.title || '',
          quote: activeItem.value.quote || '',
          targetGoal: activeItem.value.targetGoal || ''
        };
      }
    };

    // -------------------------------------------------------------
    // THREE.JS SCENE SETUP (Bright, Uplifting Atmosphere)
    // -------------------------------------------------------------
    const initThreeScene = () => {
      if (!threeCanvasRef.value) return;

      const container = threeCanvasRef.value;
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 420;

      // 1. Scene
      scene = new THREE.Scene();
      // Bright studio ambient clear color
      scene.background = new THREE.Color('#f8fafc');

      // 2. Camera
      camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0, 7.2);
      camera.lookAt(0, 0, 0);

      // 3. Renderer with antialias and sRGB
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      // Clear container and append
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // 4. Studio Lighting Rig (Bright, Warm, Uplifting)
      setupLighting();

      // 5. Floating Shimmering Sparkles (200 particles)
      setupParticles();

      // 6. 3D Picture Frame Model Group
      frameGroup = new THREE.Group();
      scene.add(frameGroup);

      // 7. Initial Frame Construction
      buildFrame3D();

      // 8. Animation Loop
      startAnimationLoop();

      // Hide hint after 4 seconds
      setTimeout(() => {
        showHint.value = false;
      }, 4000);
    };

    // -------------------------------------------------------------
    // LIGHTING SETUP
    // -------------------------------------------------------------
    const setupLighting = () => {
      // Ambient Light
      ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      // Main Sun / Key Light
      mainSunLight = new THREE.DirectionalLight(0xfff8ee, 2.2);
      mainSunLight.position.set(5, 8, 7);
      mainSunLight.castShadow = true;
      mainSunLight.shadow.mapSize.width = 1024;
      mainSunLight.shadow.mapSize.height = 1024;
      scene.add(mainSunLight);

      // Warm Rim Light for edges
      warmRimLight = new THREE.DirectionalLight(0x93c5fd, 1.1);
      warmRimLight.position.set(-6, 3, -4);
      scene.add(warmRimLight);

      // Key Focus Spotlight
      keySpotLight = new THREE.SpotLight(0xfef08a, 1.5);
      keySpotLight.position.set(0, 4, 6);
      keySpotLight.angle = Math.PI / 4;
      keySpotLight.penumbra = 0.6;
      scene.add(keySpotLight);

      applyLightingMode(currentLightingMode.value);
    };

    const applyLightingMode = (mode) => {
      if (!scene || !ambientLight) return;

      if (mode === 'daylight') {
        scene.background = new THREE.Color('#f8fafc');
        ambientLight.color.setHex(0xffffff);
        ambientLight.intensity = 1.45;
        mainSunLight.color.setHex(0xfff8ee);
        mainSunLight.intensity = 2.2;
        warmRimLight.color.setHex(0xbbf7d0);
        warmRimLight.intensity = 1.0;
        keySpotLight.color.setHex(0xfef08a);
        keySpotLight.intensity = 1.4;
      } else if (mode === 'golden') {
        scene.background = new THREE.Color('#fffbeb');
        ambientLight.color.setHex(0xfef3c7);
        ambientLight.intensity = 1.5;
        mainSunLight.color.setHex(0xf59e0b);
        mainSunLight.intensity = 2.6;
        warmRimLight.color.setHex(0xfbbf24);
        warmRimLight.intensity = 1.3;
        keySpotLight.color.setHex(0xfde047);
        keySpotLight.intensity = 1.8;
      } else if (mode === 'vibrant') {
        scene.background = new THREE.Color('#fdf4ff');
        ambientLight.color.setHex(0xfae8ff);
        ambientLight.intensity = 1.5;
        mainSunLight.color.setHex(0xf472b6);
        mainSunLight.intensity = 2.0;
        warmRimLight.color.setHex(0x38bdf8);
        warmRimLight.intensity = 1.4;
        keySpotLight.color.setHex(0xc084fc);
        keySpotLight.intensity = 1.6;
      }
    };

    // -------------------------------------------------------------
    // PARTICLES (Shimmering Floating Sparks)
    // -------------------------------------------------------------
    const setupParticles = () => {
      const particleCount = 160;
      const geometry = new THREE.BufferGeometry();
      particlePositions = new Float32Array(particleCount * 3);
      particleSpeeds = [];

      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 14;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;

        particleSpeeds.push({
          x: (Math.random() - 0.5) * 0.004,
          y: Math.random() * 0.006 + 0.002,
          z: (Math.random() - 0.5) * 0.004
        });
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

      // Golden soft glowing circle canvas texture
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 230, 120, 1)');
      grad.addColorStop(0.4, 'rgba(250, 204, 21, 0.7)');
      grad.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();

      const particleTexture = new THREE.CanvasTexture(canvas);

      const material = new THREE.PointsMaterial({
        size: 0.16,
        map: particleTexture,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);
    };

    // -------------------------------------------------------------
    // FRAME & ARTWORK BUILDER (Adaptive Landscape vs Portrait)
    // -------------------------------------------------------------
    const getFrameDimensions = (orientation) => {
      if (orientation === 'portrait') {
        // Tall 3:4
        return {
          photoW: 2.8,
          photoH: 3.8,
          matW: 3.2,
          matH: 4.2,
          frameW: 3.6,
          frameH: 4.6,
          depth: 0.22
        };
      } else if (orientation === 'square') {
        return {
          photoW: 3.2,
          photoH: 3.2,
          matW: 3.6,
          matH: 3.6,
          frameW: 4.0,
          frameH: 4.0,
          depth: 0.22
        };
      } else {
        // Landscape 16:9 / 4:3
        return {
          photoW: 4.2,
          photoH: 2.7,
          matW: 4.6,
          matH: 3.1,
          frameW: 5.0,
          frameH: 3.5,
          depth: 0.22
        };
      }
    };

    const getFrameMaterial = (styleId) => {
      switch (styleId) {
        case 'oak':
          return new THREE.MeshStandardMaterial({
            color: 0x92400e,
            roughness: 0.55,
            metalness: 0.08
          });
        case 'white':
          return new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            roughness: 0.25,
            metalness: 0.12
          });
        case 'noir':
          return new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.35,
            metalness: 0.3
          });
        case 'rosegold':
          return new THREE.MeshStandardMaterial({
            color: 0xfb7185,
            roughness: 0.22,
            metalness: 0.78
          });
        case 'aura':
          return new THREE.MeshStandardMaterial({
            color: 0x06b6d4,
            roughness: 0.2,
            metalness: 0.5,
            emissive: 0x0891b2,
            emissiveIntensity: 0.35
          });
        case 'gold':
        default:
          return new THREE.MeshStandardMaterial({
            color: 0xd97706,
            roughness: 0.22,
            metalness: 0.85
          });
      }
    };

    const buildFrame3D = () => {
      if (!frameGroup) return;

      // Clear existing children
      while (frameGroup.children.length > 0) {
        const obj = frameGroup.children[0];
        frameGroup.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      }

      const orientation = activeItem.value.orientation || 'landscape';
      const dims = getFrameDimensions(orientation);

      // 1. Outer Frame Box with beveled look
      const frameGeo = new THREE.BoxGeometry(dims.frameW, dims.frameH, dims.depth);
      const frameMat = getFrameMaterial(currentFrameStyle.value);
      outerFrameMesh = new THREE.Mesh(frameGeo, frameMat);
      outerFrameMesh.castShadow = true;
      outerFrameMesh.receiveShadow = true;
      frameGroup.add(outerFrameMesh);

      // 2. Inner Matting (Passe-partout)
      const matGeo = new THREE.PlaneGeometry(dims.matW, dims.matH);
      const matMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.8,
        metalness: 0.05
      });
      innerMatMesh = new THREE.Mesh(matGeo, matMat);
      innerMatMesh.position.z = dims.depth / 2 + 0.005;
      frameGroup.add(innerMatMesh);

      // 3. Artwork Photo Plane
      const photoGeo = new THREE.PlaneGeometry(dims.photoW, dims.photoH);
      const photoMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.05
      });
      photoMesh = new THREE.Mesh(photoGeo, photoMat);
      photoMesh.position.z = dims.depth / 2 + 0.012;
      frameGroup.add(photoMesh);

      // 4. Glass Cover (Reflective Specular Highlight)
      const glassGeo = new THREE.PlaneGeometry(dims.matW, dims.matH);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.16,
        roughness: 0.04,
        metalness: 0.1,
        reflectivity: 0.85,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
      });
      glassMesh = new THREE.Mesh(glassGeo, glassMat);
      glassMesh.position.z = dims.depth / 2 + 0.02;
      frameGroup.add(glassMesh);

      // 5. Modern Studio Desk Stand Shadow / Base below frame
      const standGeo = new THREE.BoxGeometry(dims.frameW * 0.7, 0.12, 0.8);
      const standMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.4,
        metalness: 0.1
      });
      standMesh = new THREE.Mesh(standGeo, standMat);
      standMesh.position.set(0, -dims.frameH / 2 - 0.08, -0.2);
      standMesh.receiveShadow = true;
      frameGroup.add(standMesh);

      // Load Image Texture
      loadActiveTexture();
    };

    const loadActiveTexture = () => {
      if (!photoMesh || !activeItem.value) return;

      const loader = new THREE.TextureLoader();
      loader.load(
        activeItem.value.src,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          photoMesh.material.map = texture;
          photoMesh.material.needsUpdate = true;
          currentTexture = texture;
        },
        undefined,
        (err) => {
          console.warn('Failed loading texture:', err);
        }
      );
    };

    // -------------------------------------------------------------
    // GSAP TRANSITIONS & ENTRANCES
    // -------------------------------------------------------------
    const animateToNewPhoto = (direction = 1) => {
      if (!frameGroup) return;

      // GSAP Smooth 3D Flip/Spin Effect
      gsap.to(frameGroup.rotation, {
        y: frameGroup.rotation.y + (Math.PI * 2 * direction),
        x: 0,
        duration: 0.85,
        ease: 'power3.out',
        onStart: () => {
          // Re-build geometry for new aspect ratio halfway
          setTimeout(() => {
            buildFrame3D();
          }, 350);
        }
      });

      gsap.fromTo(frameGroup.scale, 
        { x: 0.88, y: 0.88, z: 0.88 },
        { x: 1, y: 1, z: 1, duration: 0.85, ease: 'back.out(1.4)' }
      );
    };

    // -------------------------------------------------------------
    // ANIMATION LOOP (Float & Swaying Ambient)
    // -------------------------------------------------------------
    let clock = new THREE.Clock();

    const startAnimationLoop = () => {
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // 1. Gentle Floating & Breathing Sway
        if (frameGroup) {
          // Interpolate rotation towards target (mouse drag & sway)
          currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
          currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;

          const floatingOffset = Math.sin(elapsedTime * 1.5) * 0.06;
          frameGroup.position.y = floatingOffset;

          // Subtle ambient idle sway
          const idleTiltY = Math.sin(elapsedTime * 0.8) * 0.04;
          const idleTiltX = Math.cos(elapsedTime * 0.6) * 0.03;

          frameGroup.rotation.x = currentRotation.x + idleTiltX;
          frameGroup.rotation.y = currentRotation.y + idleTiltY;
        }

        // 2. Animate Shimmering Golden Sparkles
        if (particleSystem && particlePositions) {
          const positions = particleSystem.geometry.attributes.position.array;
          for (let i = 0; i < particleSpeeds.length; i++) {
            positions[i * 3 + 1] += particleSpeeds[i].y;
            positions[i * 3] += particleSpeeds[i].x;

            // Reset loop when reaching top
            if (positions[i * 3 + 1] > 5) {
              positions[i * 3 + 1] = -5;
              positions[i * 3] = (Math.random() - 0.5) * 14;
            }
          }
          particleSystem.geometry.attributes.position.needsUpdate = true;
          particleSystem.rotation.y = elapsedTime * 0.03;
        }

        renderer.render(scene, camera);
      };

      animate();
    };

    // -------------------------------------------------------------
    // INTERACTIVE MOUSE & TOUCH PARALLAX
    // -------------------------------------------------------------
    const onMouseDown = (e) => {
      isMouseDown = true;
      isDragging.value = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isMouseDown) {
        // Subtle mouse parallax when hovering
        if (stageContainer.value) {
          const rect = stageContainer.value.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;

          targetRotation.y = normX * 0.5;
          targetRotation.x = normY * 0.35;
        }
        return;
      }

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.008;
      targetRotation.x += deltaY * 0.008;

      // Clamp vertical tilt
      targetRotation.x = Math.max(-0.6, Math.min(0.6, targetRotation.x));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isMouseDown = false;
      isDragging.value = false;
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isMouseDown = true;
        isDragging.value = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (!isMouseDown || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.01;
      targetRotation.x += deltaY * 0.01;
      targetRotation.x = Math.max(-0.6, Math.min(0.6, targetRotation.x));

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isMouseDown = false;
      isDragging.value = false;
    };

    const resetCameraView = () => {
      gsap.to(targetRotation, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
      if (camera) {
        gsap.to(camera.position, { x: 0, y: 0, z: 7.2, duration: 0.6, ease: 'power2.out' });
      }
    };

    // -------------------------------------------------------------
    // PHOTO SELECTION & UPLOAD HANDLERS
    // -------------------------------------------------------------
    const selectPhoto = (index) => {
      if (index === activeIndex.value) return;
      const dir = index > activeIndex.value ? 1 : -1;
      activeIndex.value = index;
      syncEditForm();
      persistData();
      animateToNewPhoto(dir);
    };

    const prevPhoto = () => {
      const newIdx = (activeIndex.value - 1 + photosList.value.length) % photosList.value.length;
      selectPhoto(newIdx);
    };

    const nextPhoto = () => {
      const newIdx = (activeIndex.value + 1) % photosList.value.length;
      selectPhoto(newIdx);
    };

    const triggerFileInput = () => {
      if (fileInputRef.value) {
        fileInputRef.value.click();
      }
    };

    const handleFileUpload = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      processImageFile(file);
      e.target.value = ''; // Reset input
    };

    const onDragOver = () => {
      isDropHover.value = true;
    };

    const onDragLeave = () => {
      isDropHover.value = false;
    };

    const onFileDrop = (e) => {
      isDropHover.value = false;
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (!file || !file.type.startsWith('image/')) {
        window.alert('Harap masukkan file gambar (JPG, PNG, WEBP, atau GIF).');
        return;
      }
      processImageFile(file);
    };

    const processImageFile = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawDataUrl = e.target.result;
        const img = new Image();
        img.onload = () => {
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;
          const aspect = w / h;

          let detectedOrientation = 'landscape';
          if (aspect < 0.88) {
            detectedOrientation = 'portrait';
          } else if (aspect >= 0.88 && aspect <= 1.15) {
            detectedOrientation = 'square';
          }

          // Compress to optimal dimensions for fast canvas rendering & storage
          const compressedDataUrl = compressImage(img, 1200);

          const newPhotoItem = {
            id: 'user-photo-' + Date.now(),
            shortName: 'Foto Baru',
            title: file.name.replace(/\.[^/.]+$/, ''),
            quote: 'Bekerja dengan dedikasi tinggi untuk meraih masa depan terbaik!',
            targetGoal: 'Target Prestasi & Keberhasilan',
            orientation: detectedOrientation,
            src: compressedDataUrl
          };

          photosList.value.unshift(newPhotoItem);
          activeIndex.value = 0;
          syncEditForm();
          persistData();
          animateToNewPhoto(1);

          window.alert(`Foto Motivasi Ditambahkan! Berhasil diunggah dengan bingkai adaptif ${detectedOrientation.toUpperCase()}. Semangat bekerja! 🔥`);
        };
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    };

    const compressImage = (img, maxDimension) => {
      let width = img.width;
      let height = img.height;

      if (width > height && width > maxDimension) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else if (height > maxDimension) {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      return canvas.toDataURL('image/jpeg', 0.88);
    };

    const deleteCurrentPhoto = () => {
      if (photosList.value.length <= 1) return;

      if (window.confirm('Hapus foto ini dari galeri motivasi 3D?')) {
        photosList.value.splice(activeIndex.value, 1);
        if (activeIndex.value >= photosList.value.length) {
          activeIndex.value = photosList.value.length - 1;
        }
        syncEditForm();
        persistData();
        animateToNewPhoto(1);
        showSettingsModal.value = false;
        window.alert('Foto motivasi telah dihapus.');
      }
    };

    const applyPreset = (preset) => {
      // Check if already in list
      const existingIdx = photosList.value.findIndex(p => p.id === preset.id);
      if (existingIdx !== -1) {
        selectPhoto(existingIdx);
      } else {
        photosList.value.push({ ...preset });
        selectPhoto(photosList.value.length - 1);
      }
    };

    // -------------------------------------------------------------
    // CUSTOMIZATION & LIGHTING CONTROLS
    // -------------------------------------------------------------
    const setFrameStyle = (styleId) => {
      currentFrameStyle.value = styleId;
      persistData();
      buildFrame3D();
    };

    const cycleFrameStyle = () => {
      const styles = frameStyles.map(s => s.id);
      const curIdx = styles.indexOf(currentFrameStyle.value);
      const nextIdx = (curIdx + 1) % styles.length;
      setFrameStyle(styles[nextIdx]);
    };

    const setLightingMode = (modeId) => {
      currentLightingMode.value = modeId;
      persistData();
      applyLightingMode(modeId);
    };

    const toggleLightingMode = () => {
      const modes = lightingModes.map(m => m.id);
      const curIdx = modes.indexOf(currentLightingMode.value);
      const nextIdx = (curIdx + 1) % modes.length;
      setLightingMode(modes[nextIdx]);
    };

    const setPhotoOrientation = (orientation) => {
      if (photosList.value[activeIndex.value]) {
        photosList.value[activeIndex.value].orientation = orientation;
        persistData();
        buildFrame3D();
      }
    };

    const openEditQuoteModal = () => {
      syncEditForm();
      showSettingsModal.value = true;
    };

    const saveCustomText = () => {
      if (photosList.value[activeIndex.value]) {
        photosList.value[activeIndex.value].title = editForm.value.title;
        photosList.value[activeIndex.value].quote = editForm.value.quote;
        photosList.value[activeIndex.value].targetGoal = editForm.value.targetGoal;
        persistData();
        showSettingsModal.value = false;
        window.alert('Motivasi diperbarui! Plaque dan dedikasi foto motivasi berhasil disimpan.');
      }
    };

    // -------------------------------------------------------------
    // CHEER BOOSTER SOUND & SPARKLE BLAST
    // -------------------------------------------------------------
    const triggerCheerBoost = () => {
      cheerCount.value++;

      // Play soft uplifting chime with Web Audio API
      playUpliftingChime();

      // GSAP Burst Animation on 3D Frame
      if (frameGroup) {
        gsap.to(frameGroup.scale, {
          x: 1.08,
          y: 1.08,
          z: 1.08,
          duration: 0.18,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out'
        });
      }
    };

    const playUpliftingChime = () => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        // 3 Harmonious chime notes: C5 (523Hz), E5 (659Hz), G5 (784Hz)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

          gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.5);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.5);
        });
      } catch (e) {
        // audio context silent catch
      }
    };

    // -------------------------------------------------------------
    // WINDOW RESIZE HANDLER
    // -------------------------------------------------------------
    const handleResize = () => {
      if (!threeCanvasRef.value || !renderer || !camera) return;
      const width = threeCanvasRef.value.clientWidth;
      const height = threeCanvasRef.value.clientHeight || 420;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    // -------------------------------------------------------------
    // LIFECYCLE
    // -------------------------------------------------------------
    onMounted(() => {
      loadStoredData();
      nextTick(() => {
        initThreeScene();
        window.addEventListener('resize', handleResize);
      });
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer) renderer.dispose();
      if (currentTexture) currentTexture.dispose();
    });

    return {
      stageContainer,
      threeCanvasRef,
      fileInputRef,
      photosList,
      activeIndex,
      activeItem,
      currentOrientationLabel,
      currentFrameStyle,
      currentFrameStyleLabel,
      currentLightingMode,
      currentLightModeLabel,
      frameStyles,
      lightingModes,
      cheerCount,
      currentEnergyPercent,
      isDragging,
      isDropHover,
      showHint,
      showSettingsModal,
      editForm,
      defaultPresets,
      selectPhoto,
      prevPhoto,
      nextPhoto,
      triggerFileInput,
      handleFileUpload,
      onDragOver,
      onDragLeave,
      onFileDrop,
      deleteCurrentPhoto,
      applyPreset,
      setFrameStyle,
      cycleFrameStyle,
      setLightingMode,
      toggleLightingMode,
      setPhotoOrientation,
      openEditQuoteModal,
      saveCustomText,
      triggerCheerBoost,
      resetCameraView,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onTouchStart,
      onTouchMove,
      onTouchEnd
    };
  }
};

// -------------------------------------------------------------
// HELPER: GENERATE VIBRANT INSPIRING ART SVG DATA URLS
// -------------------------------------------------------------
function createUpliftingArtSvg(type) {
  let svgContent = '';

  if (type === 'family') {
    // Warm sunlit home & happy family silhouette with glowing sun & mountains
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
      <defs>
        <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdba74"/>
          <stop offset="40%" stop-color="#fed7aa"/>
          <stop offset="100%" stop-color="#fef08a"/>
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="40%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="url(#sky)"/>
      <circle cx="400" cy="220" r="160" fill="url(#sun)"/>
      <!-- Soft Mountain Ridges -->
      <path d="M0,380 Q200,280 400,340 T800,320 L800,500 L0,500 Z" fill="#bbf7d0" opacity="0.7"/>
      <path d="M0,400 Q250,340 500,390 T800,370 L800,500 L0,500 Z" fill="#86efac"/>
      <!-- Cozy Home Silhouette -->
      <polygon points="360,370 400,330 440,370" fill="#1e293b"/>
      <rect x="375" y="370" width="50" height="40" fill="#334155"/>
      <rect x="390" y="385" width="20" height="25" fill="#fbbf24"/>
      <!-- Family Figures -->
      <circle cx="470" cy="375" r="7" fill="#1e293b"/>
      <path d="M465,385 Q470,380 475,385 L475,410 L465,410 Z" fill="#1e293b"/>
      <circle cx="488" cy="378" r="6.5" fill="#1e293b"/>
      <path d="M483,387 Q488,382 493,387 L493,410 L483,410 Z" fill="#1e293b"/>
      <circle cx="502" cy="390" r="5" fill="#1e293b"/>
      <path d="M498,397 Q502,393 506,397 L506,410 L498,410 Z" fill="#1e293b"/>
      <!-- Inspirational Calligraphy Banner -->
      <rect x="80" y="50" width="640" height="80" rx="16" fill="rgba(255,255,255,0.85)"/>
      <text x="400" y="85" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" fill="#0f172a" text-anchor="middle">
        SEMANGAT BEKERJA UNTUK KELUARGA TERCINTA
      </text>
      <text x="400" y="112" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#059669" text-anchor="middle">
        "Senyuman Mereka Adalah Sumber Kekuatan Terbesarmu"
      </text>
    </svg>`;
  } else if (type === 'home') {
    // Dream modern luxury house & swimming pool sunset
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
      <defs>
        <linearGradient id="sunset" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#bae6fd"/>
          <stop offset="100%" stop-color="#fef08a"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#sunset)"/>
      <!-- Modern Villa Architecture -->
      <rect x="220" y="220" width="360" height="150" fill="#ffffff" rx="8"/>
      <rect x="250" y="240" width="120" height="110" fill="#0284c7" opacity="0.85"/>
      <rect x="400" y="250" width="150" height="90" fill="#38bdf8" opacity="0.6"/>
      <rect x="180" y="370" width="440" height="20" fill="#64748b"/>
      <rect x="140" y="390" width="520" height="60" fill="#06b6d4" opacity="0.9"/>
      <!-- Target Title Overlay -->
      <rect x="100" y="50" width="600" height="85" rx="16" fill="rgba(255,255,255,0.9)"/>
      <text x="400" y="88" font-family="system-ui, sans-serif" font-size="24" font-weight="900" fill="#1e293b" text-anchor="middle">
        TARGET HUNIAN & RUMAH IMPIAN 2026 🏠
      </text>
      <text x="400" y="116" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#0284c7" text-anchor="middle">
        "Kerja Keras & Cerdas Hari Ini, Kunci Istirahat Nyaman Esok Hari"
      </text>
    </svg>`;
  } else if (type === 'career') {
    // Portrait Graduation / Summit Career Peak
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="gradCareer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3b82f6"/>
          <stop offset="50%" stop-color="#6366f1"/>
          <stop offset="100%" stop-color="#9333ea"/>
        </linearGradient>
      </defs>
      <rect width="500" height="700" fill="url(#gradCareer)"/>
      <!-- Glowing Target Stars -->
      <circle cx="250" cy="260" r="90" fill="rgba(255,255,255,0.15)"/>
      <circle cx="250" cy="260" r="60" fill="rgba(255,255,255,0.25)"/>
      <text x="250" y="275" font-size="64" text-anchor="middle">🚀</text>
      <!-- Mountain Peak -->
      <polygon points="250,380 100,700 400,700" fill="rgba(255,255,255,0.15)"/>
      <!-- Top Text Banner -->
      <rect x="40" y="60" width="420" height="120" rx="20" fill="rgba(255,255,255,0.95)"/>
      <text x="250" y="105" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#1e1b4b" text-anchor="middle">
        SUKSES & BERKARYA
      </text>
      <text x="250" y="135" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#4f46e5" text-anchor="middle">
        "Kamu Adalah Nahkoda Masa Depanmu"
      </text>
      <text x="250" y="158" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#64748b" text-anchor="middle">
        Fokus • Disiplin • Konsisten
      </text>
    </svg>`;
  } else {
    // Spiritual / Sacred Kaaba / Blessings
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="gradSpiritual" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#065f46"/>
          <stop offset="50%" stop-color="#047857"/>
          <stop offset="100%" stop-color="#10b981"/>
        </linearGradient>
      </defs>
      <rect width="500" height="700" fill="url(#gradSpiritual)"/>
      <circle cx="250" cy="300" r="110" fill="rgba(255,255,255,0.1)"/>
      <text x="250" y="325" font-size="72" text-anchor="middle">🕋</text>
      <rect x="40" y="60" width="420" height="120" rx="20" fill="rgba(255,255,255,0.95)"/>
      <text x="250" y="105" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#064e3b" text-anchor="middle">
        NIAT SUCI & KEBERKAHAN
      </text>
      <text x="250" y="135" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#059669" text-anchor="middle">
        "Lelahmu Bernilai Ibadah & Pembuka Pintu Berkah"
      </text>
      <text x="250" y="158" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#64748b" text-anchor="middle">
        Bismillah Menuju Tanah Suci
      </text>
    </svg>`;
  }

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
}
</script>

<style scoped>
.fw-black {
  font-weight: 900;
}

.motivational-booster-card {
  background: linear-gradient(180deg, #ffffff 0%, #fcfdfe 100%);
  border: 1px solid #e2e8f0;
}

.ambient-glow-top {
  position: absolute;
  top: -120px;
  right: -80px;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(254, 240, 138, 0.35) 0%, rgba(254, 240, 138, 0) 70%);
  pointer-events: none;
  z-index: 1;
}

.ambient-glow-bottom {
  position: absolute;
  bottom: -100px;
  left: -80px;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(147, 197, 253, 0.25) 0%, rgba(147, 197, 253, 0) 70%);
  pointer-events: none;
  z-index: 1;
}

.canvas-stage-wrapper {
  height: 440px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.canvas-stage-wrapper.is-dragging {
  cursor: grabbing;
}

.three-canvas-container {
  width: 100%;
  height: 100%;
}

.pointer-events-none {
  pointer-events: none;
}

.pointer-events-auto {
  pointer-events: auto;
}

.backdrop-blur {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.shadow-xs {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.max-w-450 {
  max-width: 450px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.drag-drop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  z-index: 20;
  border: 3px dashed #3b82f6;
  border-radius: 1rem;
}

.animate-bounce {
  animation: bounce 1s infinite alternate;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-8px); }
}

.sparkle-icon {
  display: inline-block;
  animation: sparkleTwinkle 2s infinite alternate ease-in-out;
}

@keyframes sparkleTwinkle {
  0% { transform: scale(1) rotate(0deg); opacity: 0.8; }
  100% { transform: scale(1.25) rotate(15deg); opacity: 1; }
}

/* Gallery Strip */
.thumb-card {
  width: 68px;
  height: 68px;
  position: relative;
  background-color: #e2e8f0;
  transition: all 0.2s ease;
}

.thumb-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.thumb-card.thumb-active {
  border: 2.5px solid #2563eb !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.65);
  color: white;
  border-radius: 4px;
  padding: 1px 3px;
  font-size: 9px;
}

.thumb-active-indicator {
  position: absolute;
  top: 2px;
  left: 2px;
  background: #2563eb;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.bg-gradient-amber-light {
  background: linear-gradient(135deg, #fefce8 0%, #fffbeb 100%);
}

.border-amber-light {
  border-color: #fef08a !important;
}

.text-amber-dark {
  color: #854d0e !important;
}

.tracking-wider {
  letter-spacing: 0.5px;
}

.bg-gradient-success {
  background: linear-gradient(90deg, #10b981, #059669);
}

.style-option-card {
  background-color: #f8fafc;
  transition: all 0.2s ease;
}

.style-option-card:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.style-option-card.selected-option {
  background-color: #eff6ff;
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.color-preview-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 2200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow-y: auto;
}

.btn-xs {
  font-size: 11px;
  padding: 2px 8px;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 5px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
</style>
