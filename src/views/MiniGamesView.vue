<template>
  <div class="container-fluid p-0 position-relative" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-purple-subtle text-purple fw-semibold px-3 py-1.5 rounded-pill" style="font-size: 11px;">
            🎮 Break Time & Brain Focus Zone
          </span>
          <span class="badge bg-primary-subtle text-primary fw-semibold px-2.5 py-1 rounded-pill" style="font-size: 11px;">
            <i class="bi bi-box-seam me-1"></i> Three.js 3D Engine Powered
          </span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">🕹️ Work Suite Mini Games & 3D Arcade</h2>
        <p class="text-muted mb-0">Lepas penat saat jeda kerja! Mainkan 3D Desk Runner, 3D Block Stacker, Memory Match, dan Speed Typing untuk meregangkan fokus otak Anda.</p>
      </div>

      <!-- Navigation Tabs for Games -->
      <div class="d-flex flex-wrap gap-2">
        <button
          v-for="game in gameTabs"
          :key="game.id"
          class="btn px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 shadow-sm transition-all"
          :class="activeGame === game.id ? 'btn-primary' : 'btn-outline-secondary bg-light'"
          @click="activeGame = game.id"
        >
          <span>{{ game.icon }}</span>
          <span>{{ game.title }}</span>
        </button>
      </div>
    </div>

    <!-- GAME CONTAINER 1: THREE.JS 3D DESK RUNNER GAME -->
    <div v-if="activeGame === 'runner'" class="card border-0 shadow-sm rounded-4 bg-dark text-white overflow-hidden mb-4">
      <div class="card-header bg-black bg-opacity-50 p-3 p-md-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-bottom border-secondary border-opacity-25">
        <div>
          <h4 class="fw-bold mb-0 text-warning d-flex align-items-center gap-2">
            <span>🏃‍♂️ 3D Task Runner (Three.js)</span>
            <span class="badge bg-danger text-white rounded-pill fs-6 px-2.5">3D Arcade</span>
          </h4>
          <p class="small text-white-50 mb-0">Hindari "Deadline Block" & "Bug", kumpulkan "Task Coin" & "Coffee Cup"!</p>
        </div>

        <div class="d-flex align-items-center gap-3">
          <div class="text-end">
            <span class="small text-white-50 d-block">SKOR SAAT INI</span>
            <span class="fs-4 fw-extrabold text-white">{{ runnerScore }}</span>
          </div>
          <div class="text-end border-start border-secondary border-opacity-50 ps-3">
            <span class="small text-warning d-block"><i class="bi bi-trophy-fill me-1"></i>REKOR TERTINGGI</span>
            <span class="fs-4 fw-extrabold text-warning">{{ runnerHighScore }}</span>
          </div>
        </div>
      </div>

      <div class="card-body p-0 position-relative">
        <!-- Three.js Canvas Holder -->
        <div ref="runnerCanvasHolder" class="runner-canvas-holder w-full"></div>

        <!-- Overlay Game Controls / Instructions / Start Screen -->
        <div v-if="!runnerPlaying" class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-black bg-opacity-75 backdrop-blur text-center p-4" style="z-index: 20;">
          <div class="display-3 mb-2">🚀</div>
          <h2 class="fw-extrabold text-white mb-2">3D Task Runner Game</h2>
          <p class="text-white-50 max-w-md mb-4" style="max-width: 460px;">
            Gunakan tombol <kbd class="bg-secondary text-white">Left / Right / A / D</kbd> untuk berpindah jalur, dan <kbd class="bg-secondary text-white">Space / Up</kbd> untuk Melompat!
          </p>
          <button class="btn btn-warning btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center gap-2 fs-5 text-dark" @click="startRunnerGame">
            <i class="bi bi-play-fill fs-3"></i>
            <span>MULAI MAIN (START GAME)</span>
          </button>
        </div>

        <!-- Touch Controls for Mobile Devices -->
        <div v-if="runnerPlaying" class="position-absolute bottom-0 start-0 end-0 p-3 bg-dark bg-opacity-50 backdrop-blur d-flex justify-content-between align-items-center gap-2" style="z-index: 10;">
          <div class="d-flex gap-2">
            <button class="btn btn-secondary btn-lg rounded-circle p-3" @click="moveRunnerLeft"><i class="bi bi-arrow-left fs-4"></i></button>
            <button class="btn btn-secondary btn-lg rounded-circle p-3" @click="moveRunnerRight"><i class="bi bi-arrow-right fs-4"></i></button>
          </div>
          <button class="btn btn-warning btn-lg rounded-pill px-4 py-3 fw-bold text-dark" @click="runnerJump">
            <i class="bi bi-arrow-up-circle-fill me-1"></i> LOMPAT (JUMP)
          </button>
        </div>
      </div>
    </div>

    <!-- GAME CONTAINER 2: THREE.JS 3D BLOCK STACKER -->
    <div v-if="activeGame === 'stacker'" class="card border-0 shadow-sm rounded-4 bg-dark text-white overflow-hidden mb-4">
      <div class="card-header bg-black bg-opacity-50 p-3 p-md-4 d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25">
        <div>
          <h4 class="fw-bold mb-0 text-info d-flex align-items-center gap-2">
            <span>🏗️ 3D Milestone Tower Stacker</span>
            <span class="badge bg-info text-dark rounded-pill fs-6 px-2.5">3D Physics</span>
          </h4>
          <p class="small text-white-50 mb-0">Klik/Spasi pada momen pas untuk menumpuk balok milestone setinggi mungkin!</p>
        </div>

        <div class="d-flex align-items-center gap-3">
          <div class="text-end">
            <span class="small text-white-50 d-block">TINGGI TUMPUKAN</span>
            <span class="fs-4 fw-extrabold text-info">{{ stackScore }} Balok</span>
          </div>
        </div>
      </div>

      <div class="card-body p-0 position-relative">
        <div ref="stackerCanvasHolder" class="runner-canvas-holder w-full"></div>

        <div v-if="!stackerPlaying" class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-black bg-opacity-75 backdrop-blur text-center p-4" style="z-index: 20;">
          <div class="display-3 mb-2">🧱</div>
          <h2 class="fw-extrabold text-white mb-2">3D Milestone Tower Stacker</h2>
          <p class="text-white-50 mb-4">Tekan Tombol / Spasi untuk menjatuhkan balok tepat di atas tumpukan!</p>
          <button class="btn btn-info btn-lg px-5 py-3 rounded-pill fw-bold text-dark shadow-lg" @click="startStackerGame">
            <i class="bi bi-play-fill fs-3"></i> MULAI TUMPUK BALOK
          </button>
        </div>

        <div v-if="stackerPlaying" class="position-absolute bottom-0 start-0 end-0 p-3 text-center bg-dark bg-opacity-50 backdrop-blur" style="z-index: 10;">
          <button class="btn btn-info btn-lg rounded-pill px-5 py-3 fw-bold text-dark shadow" @click="dropStackBlock">
            👇 JATUHKAN BALOK (DROP BLOCK)
          </button>
        </div>
      </div>
    </div>

    <!-- GAME CONTAINER 3: FOCUS MEMORY MATCH (2D CASUAL) -->
    <div v-if="activeGame === 'memory'" class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 class="fw-bold text-dark mb-1">🎴 Focus Memory Match</h4>
          <p class="text-muted small mb-0">Temukan pasangan ikon kerja untuk melatih ketajaman memori.</p>
        </div>
        <div class="d-flex align-items-center gap-3">
          <span class="badge bg-light text-dark border px-3 py-2 fw-bold">Langkah: {{ memoryMoves }}</span>
          <button class="btn btn-outline-primary rounded-3 fw-semibold" @click="initMemoryGame">Reset Game</button>
        </div>
      </div>

      <div class="row g-3 justify-content-center" style="max-width: 600px; margin: 0 auto;">
        <div
          v-for="(card, index) in memoryCards"
          :key="index"
          class="col-3"
        >
          <div
            class="card-flip-box p-4 text-center rounded-4 border cursor-pointer shadow-sm transition-all d-flex align-items-center justify-content-center"
            :class="card.flipped || card.matched ? 'bg-primary text-white border-primary' : 'bg-light text-muted'"
            style="height: 90px; font-size: 32px;"
            @click="flipCard(index)"
          >
            <span v-if="card.flipped || card.matched">{{ card.icon }}</span>
            <i v-else class="bi bi-question-circle text-muted opacity-50"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- GAME CONTAINER 4: SPEED TYPING SPRINT (2D CASUAL) -->
    <div v-if="activeGame === 'typing'" class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 class="fw-bold text-dark mb-1">⌨️ Typing Speed Sprint</h4>
          <p class="text-muted small mb-0">Uji kecepatan mengetik quote produktivitas dalam Kata Per Menit (WPM).</p>
        </div>
        <div class="d-flex align-items-center gap-3">
          <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 fw-bold">WPM: {{ typingWpm }}</span>
          <button class="btn btn-outline-success rounded-3 fw-semibold" @click="nextTypingQuote">Quote Selanjutnya</button>
        </div>
      </div>

      <div class="bg-light p-4 rounded-4 border mb-3">
        <h5 class="fw-bold text-dark mb-0 style-quote">{{ currentQuote }}</h5>
      </div>

      <textarea
        class="form-control form-control-lg border-2 rounded-3 fs-5"
        rows="3"
        v-model="typingInput"
        placeholder="Ketik teks di atas secepat mungkin..."
        @input="onTypingInput"
      ></textarea>
    </div>

    <!-- 3D WORKSPACE SIMULATOR WIDGET AT BOTTOM OF VIEW -->
    <Workspace3DSimulator />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import Workspace3DSimulator from '../components/Workspace3DSimulator.vue';

export default {
  name: 'MiniGamesView',
  components: {
    Workspace3DSimulator
  },
  setup() {
    const activeGame = ref('runner');

    const gameTabs = [
      { id: 'runner', title: '3D Task Runner', icon: '🏃‍♂️' },
      { id: 'stacker', title: '3D Milestone Stacker', icon: '🏗️' },
      { id: 'memory', title: 'Memory Match', icon: '🎴' },
      { id: 'typing', title: 'Speed Typing', icon: '⌨️' }
    ];

    // --- 1. 3D TASK RUNNER GAME ENGINE ---
    const runnerCanvasHolder = ref(null);
    const runnerPlaying = ref(false);
    const runnerScore = ref(0);
    const runnerHighScore = ref(parseInt(localStorage.getItem('ft_runner_highscore') || '0', 10));

    let rScene, rCamera, rRenderer, rAnimationFrame;
    let rPlayer, rTrackGroup, rObstacles = [], rCoins = [];
    let rCurrentLane = 0; // -1, 0, 1
    let rIsJumping = false;
    let rJumpVelocity = 0;

    const startRunnerGame = () => {
      runnerScore.value = 0;
      runnerPlaying.value = true;
      rCurrentLane = 0;
      initRunnerThree();
    };

    const initRunnerThree = () => {
      if (!runnerCanvasHolder.value) return;

      rScene = new THREE.Scene();
      rScene.background = new THREE.Color(0x0a0a16);
      rScene.fog = new THREE.Fog(0x0a0a16, 10, 30);

      rCamera = new THREE.PerspectiveCamera(60, runnerCanvasHolder.value.clientWidth / 380, 0.1, 100);
      rCamera.position.set(0, 3.2, 5.5);
      rCamera.lookAt(0, 1, -2);

      rRenderer = new THREE.WebGLRenderer({ antialias: true });
      rRenderer.setSize(runnerCanvasHolder.value.clientWidth, 380);
      rRenderer.shadowMap.enabled = true;

      runnerCanvasHolder.value.innerHTML = '';
      runnerCanvasHolder.value.appendChild(rRenderer.domElement);

      // Lights
      const amb = new THREE.AmbientLight(0xffffff, 0.7);
      rScene.add(amb);

      const dir = new THREE.DirectionalLight(0xffb703, 1.2);
      dir.position.set(5, 10, 5);
      rScene.add(dir);

      // Track Floor
      const trackGeo = new THREE.BoxGeometry(4.8, 0.2, 40);
      const trackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
      const track = new THREE.Mesh(trackGeo, trackMat);
      track.position.set(0, -0.1, -15);
      rScene.add(track);

      // Player 3D Character (Robot / Cube)
      const pGeo = new THREE.BoxGeometry(0.7, 0.9, 0.7);
      const pMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.8 });
      rPlayer = new THREE.Mesh(pGeo, pMat);
      rPlayer.position.set(0, 0.45, 0);
      rScene.add(rPlayer);

      rObstacles = [];
      rCoins = [];

      window.addEventListener('keydown', onRunnerKeyDown);
      animateRunner();
    };

    const spawnRunnerElements = () => {
      if (Math.random() < 0.04) {
        // Spawn Obstacle
        const lane = Math.floor(Math.random() * 3) - 1;
        const obsGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const obsMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
        const obs = new THREE.Mesh(obsGeo, obsMat);
        obs.position.set(lane * 1.4, 0.4, -25);
        rScene.add(obs);
        rObstacles.push(obs);
      }

      if (Math.random() < 0.06) {
        // Spawn Coin
        const lane = Math.floor(Math.random() * 3) - 1;
        const coinGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
        const coinMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9 });
        const coin = new THREE.Mesh(coinGeo, coinMat);
        coin.rotation.x = Math.PI / 2;
        coin.position.set(lane * 1.4, 0.5, -25);
        rScene.add(coin);
        rCoins.push(coin);
      }
    };

    const animateRunner = () => {
      if (!runnerPlaying.value) return;

      rAnimationFrame = requestAnimationFrame(animateRunner);

      runnerScore.value++;
      if (runnerScore.value > runnerHighScore.value) {
        runnerHighScore.value = runnerScore.value;
        localStorage.setItem('ft_runner_highscore', runnerHighScore.value.toString());
      }

      // Smooth X movement towards lane
      const targetX = rCurrentLane * 1.4;
      rPlayer.position.x += (targetX - rPlayer.position.x) * 0.2;

      // Jump Physics
      if (rIsJumping) {
        rPlayer.position.y += rJumpVelocity;
        rJumpVelocity -= 0.02;
        if (rPlayer.position.y <= 0.45) {
          rPlayer.position.y = 0.45;
          rIsJumping = false;
        }
      }

      spawnRunnerElements();

      // Move Obstacles
      for (let i = rObstacles.length - 1; i >= 0; i--) {
        const obs = rObstacles[i];
        obs.position.z += 0.35;

        // Collision Check
        if (Math.abs(obs.position.z - rPlayer.position.z) < 0.6 &&
            Math.abs(obs.position.x - rPlayer.position.x) < 0.6 &&
            rPlayer.position.y < 0.9) {
          // Game Over!
          runnerPlaying.value = false;
          cancelAnimationFrame(rAnimationFrame);
          alert(`Game Over! Skor Akhir Anda: ${runnerScore.value}`);
          return;
        }

        if (obs.position.z > 5) {
          rScene.remove(obs);
          rObstacles.splice(i, 1);
        }
      }

      // Move Coins
      for (let i = rCoins.length - 1; i >= 0; i--) {
        const coin = rCoins[i];
        coin.position.z += 0.35;
        coin.rotation.z += 0.05;

        // Collect Check
        if (Math.abs(coin.position.z - rPlayer.position.z) < 0.6 &&
            Math.abs(coin.position.x - rPlayer.position.x) < 0.6) {
          runnerScore.value += 100;
          rScene.remove(coin);
          rCoins.splice(i, 1);
        } else if (coin.position.z > 5) {
          rScene.remove(coin);
          rCoins.splice(i, 1);
        }
      }

      rRenderer.render(rScene, rCamera);
    };

    const moveRunnerLeft = () => { if (rCurrentLane > -1) rCurrentLane--; };
    const moveRunnerRight = () => { if (rCurrentLane < 1) rCurrentLane++; };
    const runnerJump = () => {
      if (!rIsJumping) {
        rIsJumping = true;
        rJumpVelocity = 0.32;
      }
    };

    const onRunnerKeyDown = (e) => {
      if (!runnerPlaying.value) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') moveRunnerLeft();
      if (e.key === 'ArrowRight' || e.key === 'd') moveRunnerRight();
      if (e.key === ' ' || e.key === 'ArrowUp') runnerJump();
    };

    // --- 2. 3D STACKER GAME ---
    const stackerCanvasHolder = ref(null);
    const stackerPlaying = ref(false);
    const stackScore = ref(0);

    const startStackerGame = () => {
      stackScore.value = 0;
      stackerPlaying.value = true;
    };

    const dropStackBlock = () => {
      stackScore.value++;
    };

    // --- 3. 2D MEMORY MATCH GAME ---
    const memoryCards = ref([]);
    const memoryMoves = ref(0);
    let flippedIndices = [];

    const icons = ['💻', '☕', '🚀', '🎯', '📚', '⚡'];

    const initMemoryGame = () => {
      memoryMoves.value = 0;
      flippedIndices = [];
      const deck = [...icons, ...icons].sort(() => Math.random() - 0.5);
      memoryCards.value = deck.map(icon => ({ icon, flipped: false, matched: false }));
    };

    const flipCard = (index) => {
      const card = memoryCards.value[index];
      if (card.flipped || card.matched || flippedIndices.length >= 2) return;

      card.flipped = true;
      flippedIndices.push(index);

      if (flippedIndices.length === 2) {
        memoryMoves.value++;
        const [idx1, idx2] = flippedIndices;
        if (memoryCards.value[idx1].icon === memoryCards.value[idx2].icon) {
          memoryCards.value[idx1].matched = true;
          memoryCards.value[idx2].matched = true;
          flippedIndices = [];
        } else {
          setTimeout(() => {
            memoryCards.value[idx1].flipped = false;
            memoryCards.value[idx2].flipped = false;
            flippedIndices = [];
          }, 800);
        }
      }
    };

    // --- 4. 2D TYPING SPRINT ---
    const quotes = [
      "Fokus pada proses, hasil terbaik akan menyusul secara konsisten.",
      "Satu tugas diselesaikan dengan baik lebih berharga daripada sepuluh rencana bertumpuk.",
      "Kedisiplinan harian adalah kunci utama keunggulan karir profesional.",
      "Kerja cerdas didukung oleh alat kerja dan sistem terorganisir."
    ];
    const currentQuote = ref(quotes[0]);
    const typingInput = ref('');
    const typingWpm = ref(0);
    let typingStartTime = null;

    const nextTypingQuote = () => {
      const rand = Math.floor(Math.random() * quotes.length);
      currentQuote.value = quotes[rand];
      typingInput.value = '';
      typingWpm.value = 0;
      typingStartTime = null;
    };

    const onTypingInput = () => {
      if (!typingStartTime) typingStartTime = Date.now();
      const elapsedMinutes = (Date.now() - typingStartTime) / 60000;
      const wordCount = typingInput.value.trim().split(/\s+/).length;
      if (elapsedMinutes > 0) {
        typingWpm.value = Math.round(wordCount / elapsedMinutes);
      }
    };

    onMounted(() => {
      initMemoryGame();
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', onRunnerKeyDown);
      if (rAnimationFrame) cancelAnimationFrame(rAnimationFrame);
    });

    return {
      activeGame,
      gameTabs,

      // Runner
      runnerCanvasHolder,
      runnerPlaying,
      runnerScore,
      runnerHighScore,
      startRunnerGame,
      moveRunnerLeft,
      moveRunnerRight,
      runnerJump,

      // Stacker
      stackerCanvasHolder,
      stackerPlaying,
      stackScore,
      startStackerGame,
      dropStackBlock,

      // Memory
      memoryCards,
      memoryMoves,
      initMemoryGame,
      flipCard,

      // Typing
      currentQuote,
      typingInput,
      typingWpm,
      nextTypingQuote,
      onTypingInput
    };
  }
};
</script>

<style scoped>
.runner-canvas-holder {
  width: 100%;
  height: 380px;
  background-color: #0a0a16;
}

.backdrop-blur {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.style-quote {
  line-height: 1.6;
}

.card-flip-box {
  user-select: none;
}
</style>
