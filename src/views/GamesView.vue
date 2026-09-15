<template>
  <div class="container-fluid p-0 games-view-wrapper" data-aos="fade-up">

    <!-- ========================================== -->
    <!-- VIEW MODE 1: DEDICATED GAME ARENA PAGE (/games/:id) -->
    <!-- ========================================== -->
    <div v-if="activeGameId" class="game-arena-page">
      <!-- Arena Top Bar -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2.5 bg-white p-3 p-md-3.5 rounded-4 shadow-sm border">
        <div class="d-flex align-items-center gap-3">
          <router-link to="/games" class="btn btn-outline-dark rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-1.5 shadow-xs">
            <i class="bi bi-arrow-left-circle-fill fs-5 text-primary"></i>
            <span class="small">Hub Game</span>
          </router-link>
          <div>
            <div class="d-flex align-items-center gap-2 mb-0.5">
              <span class="badge bg-danger text-white fw-bold px-2 py-0.5 rounded-pill" style="font-size: 0.7rem;">
                🎮 3D Three.js
              </span>
              <span class="badge bg-primary-subtle text-primary fw-bold px-2 py-0.5 rounded-pill" style="font-size: 0.7rem;">
                {{ currentGameMeta.category }}
              </span>
              <span v-if="currentGameMeta.badge" class="badge bg-warning text-dark fw-bold px-2 py-0.5 rounded-pill" style="font-size: 0.7rem;">
                {{ currentGameMeta.badge }}
              </span>
            </div>
            <h4 class="fw-extrabold text-dark mb-0 d-flex align-items-center gap-2 fs-5 fs-md-4">
              <span>{{ currentGameMeta.icon }}</span> {{ currentGameMeta.title }}
            </h4>
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 fw-semibold text-nowrap" @click="toggleFullscreen">
            <i class="bi bi-arrows-fullscreen me-1"></i> Layar Penuh
          </button>
        </div>
      </div>

      <!-- MAIN GAME STAGE CONTAINER -->
      <div class="row g-3 g-md-4 mb-4">
        <div class="col-12">
          <!-- Dynamic Game Renderer Component -->
          <div class="game-stage-card rounded-4 overflow-hidden border shadow-sm bg-dark">
            <component :is="activeGameComponent" />
          </div>

          <!-- GAME CONTROLS & INSTRUCTIONS GUIDE CARD -->
          <div class="card border-0 shadow-sm rounded-4 mt-3 bg-white">
            <div class="card-body p-3 p-md-4">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <h5 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2 fs-6 fs-md-5">
                  <i class="bi bi-controller text-primary fs-4"></i> Panduan Kontrol & Cara Bermain
                </h5>
                <span class="badge bg-light text-muted border rounded-pill px-2.5 py-1 small">
                  Mobile & Desktop Ready
                </span>
              </div>
              <p class="text-muted small mb-3">{{ currentGameMeta.description }}</p>

              <div class="row g-2.5">
                <div class="col-12 col-md-4">
                  <div class="p-2.5 rounded-3 bg-light border h-100">
                    <small class="fw-bold text-dark d-block mb-1"><i class="bi bi-keyboard text-danger me-1"></i> Keyboard Desktop</small>
                    <small class="text-muted d-block lh-sm">{{ currentGameMeta.controls.keyboard }}</small>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="p-2.5 rounded-3 bg-light border h-100">
                    <small class="fw-bold text-dark d-block mb-1"><i class="bi bi-mouse text-info me-1"></i> Mouse / Klik</small>
                    <small class="text-muted d-block lh-sm">{{ currentGameMeta.controls.mouse }}</small>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="p-2.5 rounded-3 bg-light border h-100">
                    <small class="fw-bold text-dark d-block mb-1"><i class="bi bi-phone text-success me-1"></i> HP / Layar Sentuh</small>
                    <small class="text-muted d-block lh-sm">{{ currentGameMeta.controls.touch }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- SLIDER MENU DI BAWAH GAME (QUICK ACCESS TO OTHER 19 GAMES) -->
      <!-- ========================================== -->
      <div class="card border-0 shadow-sm rounded-4 bg-white p-3 p-md-4 mb-4">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div class="d-flex align-items-center gap-2">
            <span class="fs-5">🕹️</span>
            <div>
              <h6 class="fw-extrabold text-dark mb-0">Slider Menu Game Lainnya ({{ otherGames.length }} Game)</h6>
              <small class="text-muted">Geser ke samping untuk memilih dan berganti game secara instan</small>
            </div>
          </div>
          <div class="d-flex align-items-center gap-1.5">
            <button class="btn btn-sm btn-light border rounded-circle slider-arrow-btn" @click="scrollSlider('arena-slider', -280)">
              <i class="bi bi-chevron-left"></i>
            </button>
            <button class="btn btn-sm btn-light border rounded-circle slider-arrow-btn" @click="scrollSlider('arena-slider', 280)">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Horizontal Smooth Scroll Carousel -->
        <div id="arena-slider" class="m3-horizontal-game-slider d-flex gap-3 overflow-x-auto pb-2 scrollbar-hidden">
          <router-link
            v-for="g in otherGames"
            :key="g.id"
            :to="'/games/' + g.id"
            class="m3-slider-item text-decoration-none"
          >
            <div class="m3-app-icon-squircle" :style="{ background: g.bgGradient }">
              <span class="m3-app-icon-emoji">{{ g.icon }}</span>
              <span v-if="g.badge" class="m3-app-badge bg-danger text-white">
                {{ g.badge }}
              </span>
            </div>
            <span class="m3-app-label text-truncate">{{ g.title }}</span>
            <span class="m3-slider-category-pill">{{ g.category }}</span>
          </router-link>
        </div>
      </div>
    </div>


    <!-- ========================================== -->
    <!-- VIEW MODE 2: OVERVIEW GALLERY HUB (/games) -->
    <!-- ========================================== -->
    <div v-else class="game-gallery-hub">
      <!-- Header Banner (Material 3 Style) -->
      <div class="bg-white p-3.5 p-md-4 rounded-4 shadow-sm border mb-3.5">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1.5">
              <span class="badge bg-danger text-white fw-bold px-2.5 py-1 rounded-pill small">
                🎮 20 Game 3D & Arcade
              </span>
              <span class="badge bg-primary-subtle text-primary fw-bold px-2.5 py-1 rounded-pill small">
                Mobile & Desktop Ready
              </span>
              <span class="badge bg-warning-subtle text-warning-emphasis fw-bold px-2.5 py-1 rounded-pill small d-none d-sm-inline">
                ⚡ Anti-Stres
              </span>
            </div>
            <h2 class="fw-extrabold mb-1 text-dark fs-4 fs-md-3">🕹️ Koleksi Game & Mini Arcade</h2>
            <p class="text-muted mb-0 small">Pilih game favoritmu dalam format ikon aplikasi seperti di Home! Kompatibel penuh sentuh di HP dan keyboard mouse di desktop.</p>
          </div>

          <!-- View Switcher (Icon Grid vs Cards) -->
          <div class="d-flex align-items-center gap-1.5 bg-light p-1 rounded-pill border align-self-start align-self-md-center">
            <button
              class="btn btn-sm rounded-pill px-3 py-1 fw-bold transition-all"
              :class="displayMode === 'icons' ? 'btn-primary shadow-xs' : 'btn-light border-0 text-muted'"
              @click="displayMode = 'icons'"
            >
              <i class="bi bi-grid-fill me-1"></i> Ikon Home
            </button>
            <button
              class="btn btn-sm rounded-pill px-3 py-1 fw-bold transition-all"
              :class="displayMode === 'cards' ? 'btn-primary shadow-xs' : 'btn-light border-0 text-muted'"
              @click="displayMode = 'cards'"
            >
              <i class="bi bi-card-text me-1"></i> Kartu Lengkap
            </button>
          </div>
        </div>
      </div>

      <!-- Materialized Search Form & Category Filter Chips -->
      <div class="bg-white p-3.5 p-md-4 rounded-4 shadow-sm border mb-3.5">
        <!-- Materialized Search Bar -->
        <div class="m3-search-bar-materialized d-flex align-items-center rounded-pill px-3.5 py-2.5 border mb-3">
          <i class="bi bi-search text-primary me-2.5 fs-5"></i>
          <input
            v-model="searchQuery"
            type="text"
            class="border-0 bg-transparent flex-grow-1 shadow-none outline-none text-dark fw-medium"
            placeholder="Cari game (Tank, Ular, Balap, Drone, Warkop, Pisau, Bug...)"
            style="font-size: 14px;"
          />
          <span v-if="!searchQuery" class="badge bg-light text-muted border rounded-pill px-2.5 py-1 small me-2 d-none d-md-inline font-monospace">
            {{ filteredGames.length }} Game
          </span>
          <button v-if="searchQuery" @click="searchQuery = ''" class="btn btn-link p-0 text-muted hover-opacity me-1">
            <i class="bi bi-x-circle-fill fs-5"></i>
          </button>
        </div>

        <!-- Material 3 Category Horizontal Scroll Filter Chips -->
        <div class="m3-category-scroll d-flex gap-2 overflow-x-auto pb-1 scrollbar-hidden">
          <button
            v-for="cat in categories"
            :key="cat.name"
            class="m3-chip"
            :class="{ active: selectedCategory === cat.name }"
            @click="selectedCategory = cat.name"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ cat.name }}</span>
            <span class="m3-chip-count" :class="{ 'text-white-50': selectedCategory === cat.name }">
              {{ getCategoryCount(cat.name) }}
            </span>
          </button>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- DISPLAY OPTION 1: FULL ICON GRID (IDENTICAL TO HOME VIEW) -->
      <!-- ========================================================= -->
      <div v-if="displayMode === 'icons'" class="card border-0 shadow-sm rounded-4 bg-white p-3 p-md-4 mb-4">
        <div class="d-flex align-items-center justify-content-between mb-3 px-1">
          <div class="d-flex align-items-center gap-2">
            <span class="text-sub fw-bold small text-uppercase" style="letter-spacing: 0.5px; font-size: 11.5px;">
              Pintasan Icon Game ({{ filteredGames.length }} Tersedia)
            </span>
          </div>
          <span class="badge bg-light text-muted border rounded-pill small">Sentuh untuk Main</span>
        </div>

        <!-- Empty State -->
        <div v-if="filteredGames.length === 0" class="text-center py-5">
          <i class="bi bi-controller fs-1 text-muted opacity-40 mb-2 d-block"></i>
          <h6 class="fw-bold text-dark">Game Tidak Ditemukan</h6>
          <p class="text-muted small mb-3">Tidak ada game dengan kata kunci "{{ searchQuery }}"</p>
          <button @click="searchQuery = ''; selectedCategory = 'Semua'" class="btn btn-sm btn-primary rounded-pill px-4">
            Reset Pencarian
          </button>
        </div>

        <!-- Material 3 App Launcher Grid (4 cols on mobile, 5-7 on desktop) -->
        <div v-else class="m3-game-app-grid">
          <router-link
            v-for="game in filteredGames"
            :key="game.id"
            :to="'/games/' + game.id"
            class="m3-app-item text-decoration-none"
          >
            <div class="m3-app-icon-squircle" :style="{ background: game.bgGradient }">
              <span class="m3-app-icon-emoji">{{ game.icon }}</span>
              <!-- Contextual badge on top-right -->
              <span v-if="game.badge" class="m3-app-badge" :class="game.badgeClass || 'bg-danger text-white'">
                {{ game.badge }}
              </span>
            </div>
            <span class="m3-app-label text-truncate">{{ game.title }}</span>
            <span class="m3-app-sublabel text-truncate">{{ game.category }}</span>
          </router-link>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- DISPLAY OPTION 2: DETAILED CARDS GRID                     -->
      <!-- ========================================================= -->
      <div v-else class="mb-4">
        <div v-if="filteredGames.length === 0" class="card border-0 shadow-sm rounded-4 bg-white p-5 text-center">
          <i class="bi bi-controller fs-1 text-muted opacity-40 mb-2 d-block"></i>
          <h6 class="fw-bold text-dark">Game Tidak Ditemukan</h6>
          <p class="text-muted small mb-3">Tidak ada game dengan kata kunci "{{ searchQuery }}"</p>
          <button @click="searchQuery = ''; selectedCategory = 'Semua'" class="btn btn-sm btn-primary rounded-pill px-4">
            Reset Pencarian
          </button>
        </div>

        <div v-else class="row g-3">
          <div v-for="game in filteredGames" :key="game.id" class="col-sm-6 col-md-4 col-lg-3">
            <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden bg-white hover-up transition-all">
              <div class="card-body p-3.5 d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex align-items-center justify-content-between mb-2.5">
                    <div class="m3-app-icon-squircle-sm" :style="{ background: game.bgGradient }">
                      <span class="fs-4">{{ game.icon }}</span>
                    </div>
                    <span class="badge bg-light text-dark border px-2.5 py-1 fw-bold small">{{ game.category }}</span>
                  </div>
                  <h6 class="fw-bold text-dark mb-1">{{ game.title }}</h6>
                  <p class="small text-muted mb-3 lh-sm" style="font-size: 0.8rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                    {{ game.description }}
                  </p>
                </div>

                <router-link :to="'/games/' + game.id" class="btn btn-primary rounded-pill w-100 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 py-1.5">
                  <i class="bi bi-play-circle-fill fs-6"></i> Mainkan Game
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- BOTTOM SLIDER: REKOMENDASI GAME POPULER DI BAWAH HUB      -->
      <!-- ========================================================= -->
      <div class="card border-0 shadow-sm rounded-4 bg-white p-3 p-md-4 mb-4">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div class="d-flex align-items-center gap-2">
            <span class="fs-4">🔥</span>
            <div>
              <h6 class="fw-extrabold text-dark mb-0">Rekomendasi Game Paling Populer</h6>
              <small class="text-muted">Paling sering dimainkan saat rehat kerja</small>
            </div>
          </div>
          <div class="d-flex align-items-center gap-1.5">
            <button class="btn btn-sm btn-light border rounded-circle slider-arrow-btn" @click="scrollSlider('hub-slider', -280)">
              <i class="bi bi-chevron-left"></i>
            </button>
            <button class="btn btn-sm btn-light border rounded-circle slider-arrow-btn" @click="scrollSlider('hub-slider', 280)">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Horizontal Carousel for Hub -->
        <div id="hub-slider" class="m3-horizontal-game-slider d-flex gap-3 overflow-x-auto pb-2 scrollbar-hidden">
          <router-link
            v-for="g in popularGames"
            :key="'pop-' + g.id"
            :to="'/games/' + g.id"
            class="m3-slider-item text-decoration-none"
          >
            <div class="m3-app-icon-squircle" :style="{ background: g.bgGradient }">
              <span class="m3-app-icon-emoji">{{ g.icon }}</span>
              <span class="m3-app-badge bg-warning text-dark fw-bold">🔥 Hits</span>
            </div>
            <span class="m3-app-label text-truncate">{{ g.title }}</span>
            <span class="m3-slider-category-pill">{{ g.category }}</span>
          </router-link>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

// 20 Game Components
import Tank3D from '@/components/games/Tank3D.vue';
import TowerAttack3D from '@/components/games/TowerAttack3D.vue';
import WarkopSimulator3D from '@/components/games/WarkopSimulator3D.vue';
import CyberRacer3D from '@/components/games/CyberRacer3D.vue';
import BrickBreaker3D from '@/components/games/BrickBreaker3D.vue';
import TowerBuilder3D from '@/components/games/TowerBuilder3D.vue';
import AimTrainer3D from '@/components/games/AimTrainer3D.vue';
import Snake3D from '@/components/games/Snake3D.vue';
import TicTacToe3D from '@/components/games/TicTacToe3D.vue';
import Pong3D from '@/components/games/Pong3D.vue';
import Memory3D from '@/components/games/Memory3D.vue';
import SpeedClicker from '@/components/games/SpeedClicker.vue';
import TaskRunner3D from '@/components/games/TaskRunner3D.vue';
import TypingSprint from '@/components/games/TypingSprint.vue';
import FlappyDrone3D from '@/components/games/FlappyDrone3D.vue';
import WhackABug3D from '@/components/games/WhackABug3D.vue';
import SpaceDefender3D from '@/components/games/SpaceDefender3D.vue';
import KnifeHit3D from '@/components/games/KnifeHit3D.vue';
import ColorRush3D from '@/components/games/ColorRush3D.vue';
import BubblePop3D from '@/components/games/BubblePop3D.vue';

export default {
  name: 'GamesView',
  components: {
    Tank3D,
    TowerAttack3D,
    WarkopSimulator3D,
    CyberRacer3D,
    BrickBreaker3D,
    TowerBuilder3D,
    AimTrainer3D,
    Snake3D,
    TicTacToe3D,
    Pong3D,
    Memory3D,
    SpeedClicker,
    TaskRunner3D,
    TypingSprint,
    FlappyDrone3D,
    WhackABug3D,
    SpaceDefender3D,
    KnifeHit3D,
    ColorRush3D,
    BubblePop3D
  },
  setup() {
    const route = useRoute();
    const searchQuery = ref('');
    const selectedCategory = ref('Semua');
    const displayMode = ref('icons'); // 'icons' or 'cards'

    const categories = [
      { name: 'Semua', icon: '✨' },
      { name: '3D Arcade', icon: '🕹️' },
      { name: 'Reflex', icon: '⚡' },
      { name: 'Strategy', icon: '⚔️' },
      { name: 'Brain', icon: '🧠' },
      { name: 'Simulation', icon: '☕' }
    ];

    // Complete Catalog of 20 Games
    const games = ref([
      {
        id: 'tank-3d',
        title: '3D Tank Battle',
        icon: '🛡️',
        category: '3D Arcade',
        badge: '3D',
        badgeClass: 'bg-primary text-white',
        bgGradient: 'linear-gradient(135deg, #1e3a8a, #0284c7)',
        description: 'Kendalikan tank tempur baja 3D dengan meriam balistik. Hancurkan bunker dan menara radar musuh!',
        controls: {
          keyboard: 'W/A/S/D atau Panah untuk gerak, Spasi untuk tembak, R isi peluru',
          mouse: 'Klik Kiri untuk menembak meriam tank',
          touch: 'D-Pad arah sentuh di kiri bawah & tombol tembak di kanan'
        },
        component: Tank3D
      },
      {
        id: 'tower-attack',
        title: 'Petualang Mas (Tower)',
        icon: '⚔️',
        category: 'Strategy',
        badge: 'Hits',
        badgeClass: 'bg-warning text-dark',
        bgGradient: 'linear-gradient(135deg, #d97706, #b45309)',
        description: 'Serbu benteng musuh dengan Keris Emas & Hujan Panah Sakti Sang Petualang Mas!',
        controls: {
          keyboard: 'Spasi / Klik untuk serang, Tombol 1, 2, 3 untuk jurus sakti',
          mouse: 'Klik menara musuh untuk meluncurkan tebasan pedang',
          touch: 'Ketuk layar / tombol jurus di bawah'
        },
        component: TowerAttack3D
      },
      {
        id: 'warkop-3d',
        title: 'Warkop Simulator 3D',
        icon: '☕',
        category: 'Simulation',
        badge: 'Nusantara',
        badgeClass: 'bg-success text-white',
        bgGradient: 'linear-gradient(135deg, #78350f, #92400e)',
        description: 'Kelola warung kopi 3D khas nusantara! Racik Kopi Tubruk, Es Teh, Indomie, dan Gorengan renyah.',
        controls: {
          keyboard: 'Klik mouse pada bahan resep',
          mouse: 'Klik bahan resep pesanan lalu klik Sajikan Pesanan',
          touch: 'Sentuh bahan makanan & tombol sajikan di layar HP'
        },
        component: WarkopSimulator3D
      },
      {
        id: 'cyber-racer',
        title: '3D Cyber Racer',
        icon: '🏎️',
        category: '3D Arcade',
        badge: 'Favorit',
        badgeClass: 'bg-info text-white',
        bgGradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
        description: 'Balapan neon 3D di jalan tol futuristik. Hindari rintangan merah dan raih skor tertinggi!',
        controls: {
          keyboard: 'Panah ← / → atau Tombol A / D',
          mouse: 'Gunakan Tombol Kiri/Kanan On-screen',
          touch: 'Sentuh Tombol Kiri / Kanan di bawah layar HP'
        },
        component: CyberRacer3D
      },
      {
        id: 'brick-breaker',
        title: '3D Brick Breaker',
        icon: '🧱',
        category: '3D Arcade',
        badge: 'Klasik',
        badgeClass: 'bg-secondary text-white',
        bgGradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        description: 'Pantulkan bola energi neon 3D untuk menghancurkan barisan balok prisma secara bertingkat!',
        controls: {
          keyboard: 'Geser kursor mouse untuk pergerakan halus',
          mouse: 'Geser mouse ke kiri/kanan di arena',
          touch: 'Sentuh dan geser jari di area layar'
        },
        component: BrickBreaker3D
      },
      {
        id: 'tower-builder',
        title: '3D Tower Builder',
        icon: '🏗️',
        category: 'Strategy',
        badge: 'Presisi',
        badgeClass: 'bg-primary text-white',
        bgGradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
        description: 'Tumpuk balok milestone 3D presisi setinggi mungkin ke angkasa. Potong sisa balok yang tidak sejajar!',
        controls: {
          keyboard: 'Tekan Tombol Spasi',
          mouse: 'Klik Kiri di mana saja pada arena',
          touch: 'Ketuk layar HP di mana saja untuk menjatuhkan balok'
        },
        component: TowerBuilder3D
      },
      {
        id: 'aim-trainer',
        title: '3D Aim Trainer',
        icon: '🎯',
        category: 'Reflex',
        badge: 'Refleks',
        badgeClass: 'bg-danger text-white',
        bgGradient: 'linear-gradient(135deg, #dc2626, #f97316)',
        description: 'Uji kecepatan dan presisi refleks bidikan target 3D dalam tantangan 30 detik!',
        controls: {
          keyboard: 'Kombinasi dengan klik mouse',
          mouse: 'Klik Kiri langsung pada bola target',
          touch: 'Ketuk bola target secara presisi di layar'
        },
        component: AimTrainer3D
      },
      {
        id: 'snake-3d',
        title: '3D Snake Arena',
        icon: '🐍',
        category: '3D Arcade',
        badge: 'Retro',
        badgeClass: 'bg-success text-white',
        bgGradient: 'linear-gradient(135deg, #10b981, #059669)',
        description: 'Kendalikan ular voxel 3D melahap apel kristal neon tanpa menabrak dinding!',
        controls: {
          keyboard: 'Panah ↑ ↓ ← → atau WASD',
          mouse: 'Gunakan D-Pad On-screen',
          touch: 'Ketuk Tombol D-Pad di kanan bawah'
        },
        component: Snake3D
      },
      {
        id: 'ttt-3d',
        title: '3D Tic-Tac-Toe AI',
        icon: '❌',
        category: 'Strategy',
        badge: 'Taktik',
        badgeClass: 'bg-dark text-white',
        bgGradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
        description: 'Duel asah taktik di papan 3D interaktif melawan kecerdasan buatan cerdas.',
        controls: {
          keyboard: 'Gunakan mouse untuk memilih petak',
          mouse: 'Klik petak papan 3D',
          touch: 'Ketuk petak papan 3D'
        },
        component: TicTacToe3D
      },
      {
        id: 'pong-3d',
        title: '3D Pong Tennis',
        icon: '🏓',
        category: '3D Arcade',
        badge: 'Duel',
        badgeClass: 'bg-info text-white',
        bgGradient: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
        description: 'Tenis meja retro modern 3D seru dengan fisika pantulan dinamis melawan AI.',
        controls: {
          keyboard: 'Gunakan gerak kursor vertikal',
          mouse: 'Geser mouse ke atas/bawah',
          touch: 'Geser jari vertikal di layar HP'
        },
        component: Pong3D
      },
      {
        id: 'memory-3d',
        title: '3D Memory Flip',
        icon: '🧠',
        category: 'Brain',
        badge: 'Memori',
        badgeClass: 'bg-purple text-white',
        bgGradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
        description: 'Balik kartu 3D dan cocokkan pasangan simbol kerja untuk melatih daya ingat.',
        controls: {
          keyboard: 'Gunakan mouse untuk memilih kartu',
          mouse: 'Klik kartu untuk membalik 180 derajat',
          touch: 'Ketuk kartu untuk membalik'
        },
        component: Memory3D
      },
      {
        id: 'speed-clicker',
        title: 'Speed Clicker Blitz',
        icon: '⚡',
        category: 'Reflex',
        badge: 'Sprint',
        badgeClass: 'bg-warning text-dark',
        bgGradient: 'linear-gradient(135deg, #facc15, #ea580c)',
        description: 'Pacu kecepatan ketukan jari tangan Anda dalam tantangan 10 detik rekor klik!',
        controls: {
          keyboard: 'Klik mouse secepatnya',
          mouse: 'Klik tombol merah berulang kali',
          touch: 'Gunakan 2 jari bergantian mengetuk tombol di layar'
        },
        component: SpeedClicker
      },
      {
        id: 'task-runner',
        title: '3D Task Runner',
        icon: '🏃‍♂️',
        category: '3D Arcade',
        badge: 'Baru',
        badgeClass: 'bg-success text-white',
        bgGradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
        description: 'Hindari Deadline Block & Bug, kumpulkan Task Coin & Cangkir Kopi di lintasan hoverboard 3D!',
        controls: {
          keyboard: 'A/D atau Panah kiri-kanan, Spasi/W untuk lompat',
          mouse: 'Klik tombol on-screen di bawah',
          touch: 'Sentuh tombol panah & tombol LOMPAT di layar'
        },
        component: TaskRunner3D
      },
      {
        id: 'typing-sprint',
        title: 'Typing Sprint WPM',
        icon: '⌨️',
        category: 'Brain',
        badge: 'Baru',
        badgeClass: 'bg-primary text-white',
        bgGradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        description: 'Asah kecepatan jari dan ketelitian mengetik kata motivasi & produktivitas kerja dengan kalkulator WPM live.',
        controls: {
          keyboard: 'Ketik langsung kata yang tertera pada keyboard desktop',
          mouse: 'Klik area teks untuk memfokuskan',
          touch: 'Ketuk tombol keyboard virtual HP dan mulai mengetik'
        },
        component: TypingSprint
      },
      {
        id: 'flappy-drone',
        title: '3D Flappy Drone',
        icon: '🛸',
        category: 'Reflex',
        badge: 'Baru',
        badgeClass: 'bg-info text-white',
        bgGradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        description: 'Ketuk layar atau tekan spasi untuk menerbangkan quadcopter drone cyber melintasi celah gerbang laser neon!',
        controls: {
          keyboard: 'Tekan Tombol Spasi atau W / Panah Atas',
          mouse: 'Klik Kiri di mana saja pada arena',
          touch: 'Ketuk layar HP di mana saja untuk melayang terbang'
        },
        component: FlappyDrone3D
      },
      {
        id: 'whack-a-bug',
        title: 'Whack-A-Bug (Pukul)',
        icon: '🔨',
        category: 'Reflex',
        badge: 'Baru',
        badgeClass: 'bg-danger text-white',
        bgGradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
        description: 'Bug coding nakal bermunculan dari server terminal! Pukul dan perbaiki server sebelum waktu 30 detik habis.',
        controls: {
          keyboard: 'Gunakan mouse untuk klik',
          mouse: 'Klik cepat lubang server yang mengeluarkan bug',
          touch: 'Sentuh langsung lubang server tempat bug muncul'
        },
        component: WhackABug3D
      },
      {
        id: 'space-defender',
        title: '3D Space Defender',
        icon: '🚀',
        category: '3D Arcade',
        badge: 'Baru',
        badgeClass: 'bg-purple text-white',
        bgGradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
        description: 'Kapal antariksa 3D menembak asteroid dan pesawat alien dengan meriam foton laser!',
        controls: {
          keyboard: 'A/D atau Panah kiri-kanan untuk manuver kapal',
          mouse: 'Geser kursor mouse ke kiri dan kanan',
          touch: 'Sentuh dan geser jari / tombol navigasi di layar'
        },
        component: SpaceDefender3D
      },
      {
        id: 'knife-hit',
        title: 'Target Blade 3D',
        icon: '🗡️',
        category: 'Strategy',
        badge: 'Baru',
        badgeClass: 'bg-warning text-dark',
        bgGradient: 'linear-gradient(135deg, #f97316, #ea580c)',
        description: 'Tancapkan seluruh bilah pisau ke balok kayu yang berputar. Jangan sampai menabrak bilah pisau lain!',
        controls: {
          keyboard: 'Tekan Tombol Spasi atau Panah Atas',
          mouse: 'Klik Kiri di mana saja pada layar',
          touch: 'Ketuk layar HP atau tombol LEMPAR PISAU'
        },
        component: KnifeHit3D
      },
      {
        id: 'color-rush',
        title: 'Color Rush Reflex',
        icon: '🎨',
        category: 'Brain',
        badge: 'Baru',
        badgeClass: 'bg-danger text-white',
        bgGradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
        description: 'Ganti warna perisai di bawah agar cocok dengan warna bola energi yang meluncur turun!',
        controls: {
          keyboard: 'Tekan Tombol Angka 1, 2, 3, 4',
          mouse: 'Klik pada 4 tombol warna di bawah',
          touch: 'Sentuh 4 bantalan tombol warna di layar HP'
        },
        component: ColorRush3D
      },
      {
        id: 'bubble-pop',
        title: 'Bubble Pop Zen 3D',
        icon: '🫧',
        category: 'Simulation',
        badge: 'Zen',
        badgeClass: 'bg-success text-white',
        bgGradient: 'linear-gradient(135deg, #06b6d4, #10b981)',
        description: 'Relaksasi anti-stres! Pecahkan gelembung sabun neon mengapung dengan suara pop menenangkan dan raih kombo.',
        controls: {
          keyboard: 'Klik mouse pada gelembung',
          mouse: 'Klik langsung gelembung yang melayang',
          touch: 'Sentuh langsung gelembung dengan semua jari tangan'
        },
        component: BubblePop3D
      }
    ]);

    const activeGameId = computed(() => route.params.id);

    const currentGameMeta = computed(() => {
      if (!activeGameId.value) return null;
      return games.value.find(g => g.id === activeGameId.value) || games.value[0];
    });

    const activeGameComponent = computed(() => {
      if (!currentGameMeta.value) return CyberRacer3D;
      return currentGameMeta.value.component;
    });

    const otherGames = computed(() => {
      if (!activeGameId.value) return games.value;
      return games.value.filter(g => g.id !== activeGameId.value);
    });

    const popularGames = computed(() => {
      // 6 top trending games
      return games.value.filter(g => ['tank-3d', 'cyber-racer', 'task-runner', 'flappy-drone', 'knife-hit', 'warkop-3d', 'whack-a-bug'].includes(g.id));
    });

    const filteredGames = computed(() => {
      return games.value.filter(g => {
        const matchCategory = selectedCategory.value === 'Semua' || g.category === selectedCategory.value;
        const q = searchQuery.value.trim().toLowerCase();
        const matchSearch = !q ||
          g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q);
        return matchCategory && matchSearch;
      });
    });

    const getCategoryCount = (catName) => {
      if (catName === 'Semua') return games.value.length;
      return games.value.filter(g => g.category === catName).length;
    };

    const scrollSlider = (elemId, distance) => {
      const el = document.getElementById(elemId);
      if (el) {
        el.scrollBy({ left: distance, behavior: 'smooth' });
      }
    };

    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    };

    return {
      searchQuery,
      selectedCategory,
      categories,
      games,
      activeGameId,
      currentGameMeta,
      activeGameComponent,
      otherGames,
      popularGames,
      filteredGames,
      displayMode,
      getCategoryCount,
      scrollSlider,
      toggleFullscreen
    };
  }
};
</script>

<style scoped>
.games-view-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

/* Material 3 Search Bar Materialized */
.m3-search-bar-materialized {
  background: var(--bg-surface, #f8fafc);
  border-color: var(--border-color, #e2e8f0);
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
}

.m3-search-bar-materialized:focus-within {
  background: #ffffff;
  border-color: #2563eb !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

/* Material 3 Filter Chips */
.m3-category-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.m3-category-scroll::-webkit-scrollbar {
  display: none;
}

.m3-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 12.5px;
  font-weight: 700;
  white-space: nowrap;
  border: 1px solid var(--border-color, #e2e8f0);
  background: var(--bg-surface, #ffffff);
  color: var(--text-sub, #64748b);
  transition: all 0.18s cubic-bezier(0.2, 0, 0, 1);
  cursor: pointer;
  user-select: none;
}

.m3-chip:hover {
  background: var(--sidebar-hover-bg, #f1f5f9);
  color: var(--text-main, #0f172a);
  border-color: rgba(37, 99, 235, 0.3);
}

.m3-chip.active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 3px 10px -2px rgba(37, 99, 235, 0.45);
}

.m3-chip-count {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.08);
}
.m3-chip.active .m3-chip-count {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

/* =========================================================
   MATERIAL 3 APP GRID (IDENTICAL TO HOME VIEW LAUNCHER)
   ========================================================= */
.m3-game-app-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px 8px;
}

@media (min-width: 576px) {
  .m3-game-app-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 18px 10px;
  }
}

@media (min-width: 768px) {
  .m3-game-app-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 20px 12px;
  }
}

@media (min-width: 1024px) {
  .m3-game-app-grid {
    grid-template-columns: repeat(7, 1fr);
    gap: 22px 14px;
  }
}

.m3-app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  cursor: pointer;
  user-select: none;
  padding: 6px 4px;
  border-radius: 14px;
  transition: transform 0.16s cubic-bezier(0.2, 0, 0, 1);
}

.m3-app-item:active {
  transform: scale(0.91);
}

.m3-app-icon-squircle {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 14px -2px rgba(0, 0, 0, 0.16);
  transition: transform 0.16s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.16s ease;
}

@media (min-width: 768px) {
  .m3-app-icon-squircle {
    width: 64px;
    height: 64px;
    border-radius: 20px;
  }
}

.m3-app-item:hover .m3-app-icon-squircle {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px -2px rgba(0, 0, 0, 0.22);
}

.m3-app-icon-emoji {
  font-size: 28px;
  line-height: 1;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
}

@media (min-width: 768px) {
  .m3-app-icon-emoji {
    font-size: 32px;
  }
}

.m3-app-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  border-radius: 9999px;
  font-size: 9.5px;
  font-weight: 800;
  padding: 1px 6px;
  line-height: 1.1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  border: 1.5px solid #ffffff;
}

.m3-app-label {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-main, #0f172a);
  margin-top: 7px;
  width: 100%;
  text-align: center;
  line-height: 1.2;
  letter-spacing: -0.1px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.m3-app-sublabel {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-sub, #64748b);
  margin-top: 1px;
  width: 100%;
  text-align: center;
  opacity: 0.8;
}

/* Smaller squircle for cards view */
.m3-app-icon-squircle-sm {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px -2px rgba(0, 0, 0, 0.15);
}

/* =========================================================
   BOTTOM SLIDER MENU (M3 HORIZONTAL CAROUSEL)
   ========================================================= */
.m3-horizontal-game-slider {
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.m3-slider-item {
  flex: 0 0 100px;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 6px 4px;
  border-radius: 14px;
  transition: transform 0.15s ease;
}

@media (min-width: 576px) {
  .m3-slider-item {
    flex: 0 0 110px;
  }
}

.m3-slider-item:active {
  transform: scale(0.92);
}

.m3-slider-category-pill {
  font-size: 9.5px;
  font-weight: 700;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 7px;
  border-radius: 9999px;
  margin-top: 3px;
  white-space: nowrap;
}

.slider-arrow-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.slider-arrow-btn:hover {
  background: #e2e8f0;
}

/* General helpers */
.hover-up:hover {
  transform: translateY(-4px);
}
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hover-opacity:hover {
  opacity: 0.75;
}
.shadow-xs {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
</style>
