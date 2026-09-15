<template>
  <div class="game-container w-100 position-relative rounded-4 overflow-hidden bg-dark shadow-lg">
    <!-- Top HUD Overlay -->
    <div class="position-absolute top-0 start-0 end-0 p-2.5 p-md-3 d-flex justify-content-between align-items-center bg-dark bg-opacity-75 text-white z-3 border-bottom border-secondary border-opacity-25">
      <div class="d-flex align-items-center gap-2 gap-md-3">
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">SKOR RUNNER</small>
          <span class="fs-4 fw-extrabold text-warning font-monospace">{{ Math.floor(score) }}</span>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">KOIN TUGAS</small>
          <span class="fs-5 fw-bold text-info font-monospace">🪙 {{ coinsCollected }}</span>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">REKOR</small>
          <span class="fs-5 fw-bold text-success font-monospace">{{ highScore }}</span>
        </div>
      </div>

      <div class="d-flex align-items-center gap-1.5">
        <button class="btn btn-sm btn-outline-light rounded-circle p-1.5" @click="toggleSound" :title="muted ? 'Unmute' : 'Mute'">
          <i :class="muted ? 'bi bi-volume-mute-fill' : 'bi bi-volume-up-fill'"></i>
        </button>
        <button v-if="isPlaying && !isGameOver" class="btn btn-sm btn-warning fw-bold rounded-pill px-2.5 py-1" @click="togglePause">
          <i :class="isPaused ? 'bi bi-play-fill' : 'bi bi-pause-fill'"></i> <span class="d-none d-sm-inline">{{ isPaused ? 'Lanjut' : 'Jeda' }}</span>
        </button>
        <button class="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 text-white" @click="resetGame">
          <i class="bi bi-arrow-counterclockwise"></i> <span class="d-none d-sm-inline">Reset</span>
        </button>
      </div>
    </div>

    <!-- 3D Canvas Area (Responsive Height) -->
    <div ref="canvasContainer" class="w-100 position-relative game-canvas-wrapper"></div>

    <!-- Start / Game Over Overlay Screen -->
    <div v-if="!isPlaying || isGameOver" class="position-absolute inset-0 bg-dark bg-opacity-85 d-flex flex-column align-items-center justify-content-center text-white z-3 p-4 text-center">
      <div class="mb-3">
        <span class="fs-1 d-block mb-1">🏃‍♂️☕🚀</span>
        <h3 class="fw-extrabold text-warning mb-1">3D TASK RUNNER SPRINT</h3>
        <p class="text-light opacity-75 small max-w-sm">Hindari balok Deadline merah, lompati bug, dan kumpulkan Koin Tugas & Kopi Booster di 3 jalur lari!</p>
      </div>

      <div v-if="isGameOver" class="mb-3 bg-danger bg-opacity-25 border border-danger p-3 rounded-4 w-100 max-w-xs">
        <h5 class="fw-bold text-danger mb-1">TERTABRAK DEADLINE!</h5>
        <div class="display-6 fw-extrabold font-monospace text-warning mb-1">{{ Math.floor(score) }} Poin</div>
        <small class="text-light opacity-75">Koin Terkumpul: {{ coinsCollected }} | Rekor: {{ highScore }}</small>
      </div>

      <button class="btn btn-warning btn-lg rounded-pill px-5 fw-extrabold shadow-lg py-2 fs-5" @click="startGame">
        <i class="bi bi-play-circle-fill me-2"></i> {{ isGameOver ? 'Main Lagi' : 'Mulai Lari 3D' }}
      </button>

      <div class="mt-3 pt-2 border-top border-secondary border-opacity-50 text-secondary small d-flex flex-wrap justify-content-center gap-3">
        <span><i class="bi bi-keyboard me-1"></i> Jalur: <strong>A / D / Panah</strong></span>
        <span><i class="bi bi-arrow-up-circle me-1"></i> Lompat: <strong>Spasi / W</strong></span>
        <span><i class="bi bi-phone me-1"></i> HP: Tombol Sentuh di Bawah</span>
      </div>
    </div>

    <!-- On-Screen Mobile Touch Controls -->
    <div v-if="isPlaying && !isGameOver" class="position-absolute bottom-0 start-0 end-0 p-3 d-flex justify-content-between align-items-end z-3 pointer-events-none">
      <div class="d-flex gap-2 pointer-events-auto">
        <button class="btn btn-dark bg-opacity-75 text-warning border-warning rounded-circle p-3 shadow-lg" style="width: 58px; height: 58px;" @touchstart.prevent="moveLeft" @mousedown.prevent="moveLeft">
          <i class="bi bi-arrow-left-circle-fill fs-3"></i>
        </button>
        <button class="btn btn-dark bg-opacity-75 text-warning border-warning rounded-circle p-3 shadow-lg" style="width: 58px; height: 58px;" @touchstart.prevent="moveRight" @mousedown.prevent="moveRight">
          <i class="bi bi-arrow-right-circle-fill fs-3"></i>
        </button>
      </div>

      <button class="btn btn-warning rounded-pill px-4 py-3 fw-bold text-dark shadow-lg pointer-events-auto d-flex align-items-center gap-1.5" @touchstart.prevent="jump" @mousedown.prevent="jump">
        <i class="bi bi-arrow-up-circle-fill fs-4"></i>
        <span>LOMPAT</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { playSound, toggleMuteSound, isSoundMuted } from '@/utils/gameAudio';

export default {
  name: 'TaskRunner3D',
  setup() {
    const canvasContainer = ref(null);
    const score = ref(0);
    const coinsCollected = ref(0);
    const highScore = ref(parseInt(localStorage.getItem('tr3d_highscore') || '0'));
    const isPlaying = ref(false);
    const isPaused = ref(false);
    const isGameOver = ref(false);
    const muted = ref(isSoundMuted());

    let scene, camera, renderer, animationFrameId;
    let player, playerTargetX = 0, currentLane = 0;
    let isJumping = false, jumpVelocity = 0;
    const laneWidth = 2.2;
    let obstacles = [];
    let coins = [];
    let speed = 0.35;

    const initThree = () => {
      if (!canvasContainer.value) return;
      const width = canvasContainer.value.clientWidth || 700;
      const height = canvasContainer.value.clientHeight || 460;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0f1d);
      scene.fog = new THREE.FogExp2(0x0a0f1d, 0.02);

      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.set(0, 3.8, 6.5);
      camera.lookAt(0, 1.2, -6);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      canvasContainer.value.innerHTML = '';
      canvasContainer.value.appendChild(renderer.domElement);

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
      dirLight.position.set(5, 15, 10);
      scene.add(dirLight);

      // Track floor
      const trackGeo = new THREE.PlaneGeometry(9, 120);
      const trackMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.3, metalness: 0.7 });
      const track = new THREE.Mesh(trackGeo, trackMat);
      track.rotation.x = -Math.PI / 2;
      track.position.z = -50;
      scene.add(track);

      // Neon Lane dividers
      [-laneWidth * 0.5, laneWidth * 0.5].forEach(lx => {
        const lineGeo = new THREE.BoxGeometry(0.08, 0.05, 120);
        const lineMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
        const line = new THREE.Mesh(lineGeo, lineMat);
        line.position.set(lx, 0.03, -50);
        scene.add(line);
      });

      // Player Avatar (Cyber Runner Hoverboard)
      player = new THREE.Group();
      const boardGeo = new THREE.BoxGeometry(1.1, 0.2, 1.8);
      const boardMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.8, roughness: 0.2 });
      const board = new THREE.Mesh(boardGeo, boardMat);
      board.position.y = 0.3;
      player.add(board);

      const glowGeo = new THREE.BoxGeometry(0.9, 0.05, 1.6);
      const glowMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.y = 0.18;
      player.add(glow);

      const riderGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.0, 12);
      const riderMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
      const rider = new THREE.Mesh(riderGeo, riderMat);
      rider.position.y = 1.0;
      player.add(rider);

      player.position.set(0, 0, 0);
      scene.add(player);

      window.addEventListener('resize', onWindowResize);
      window.addEventListener('keydown', onKeyDown);
      renderer.render(scene, camera);
    };

    const onWindowResize = () => {
      if (!canvasContainer.value || !renderer || !camera) return;
      const width = canvasContainer.value.clientWidth;
      const height = canvasContainer.value.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const onKeyDown = (e) => {
      if (!isPlaying.value || isGameOver.value || isPaused.value) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveRight();
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        jump();
      }
    };

    const moveLeft = () => {
      if (currentLane > -1) {
        currentLane--;
        playerTargetX = currentLane * laneWidth;
        playSound('select');
      }
    };

    const moveRight = () => {
      if (currentLane < 1) {
        currentLane++;
        playerTargetX = currentLane * laneWidth;
        playSound('select');
      }
    };

    const jump = () => {
      if (!isJumping) {
        isJumping = true;
        jumpVelocity = 0.22;
        playSound('hit');
      }
    };

    const spawnObstacle = () => {
      const lane = Math.floor(Math.random() * 3) - 1;
      const isBug = Math.random() > 0.5;

      const obsGeo = isBug ? new THREE.ConeGeometry(0.6, 1.2, 8) : new THREE.BoxGeometry(1.3, 1.0, 1.0);
      const obsMat = new THREE.MeshStandardMaterial({
        color: isBug ? 0xef4444 : 0xdc2626,
        roughness: 0.3,
        metalness: 0.5,
        emissive: 0x550000
      });
      const obs = new THREE.Mesh(obsGeo, obsMat);
      obs.position.set(lane * laneWidth, isBug ? 0.6 : 0.5, -70);
      scene.add(obs);
      obstacles.push(obs);

      // Spawn coins in other lanes
      const coinLane = (lane + (Math.random() > 0.5 ? 1 : 2)) % 3 - 1;
      const coinGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16);
      const coinMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.1, emissive: 0x886600 });
      const coin = new THREE.Mesh(coinGeo, coinMat);
      coin.rotation.x = Math.PI / 2;
      coin.position.set(coinLane * laneWidth, 0.8, -70);
      scene.add(coin);
      coins.push(coin);
    };

    const startGame = () => {
      score.value = 0;
      coinsCollected.value = 0;
      isGameOver.value = false;
      isPaused.value = false;
      isPlaying.value = true;
      speed = 0.35;
      currentLane = 0;
      playerTargetX = 0;
      if (player) {
        player.position.set(0, 0, 0);
      }

      // Clear existing
      obstacles.forEach(o => scene.remove(o));
      coins.forEach(c => scene.remove(c));
      obstacles = [];
      coins = [];

      playSound('select');
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animate();
    };

    const resetGame = () => {
      isPlaying.value = false;
      isGameOver.value = false;
      isPaused.value = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      obstacles.forEach(o => scene.remove(o));
      coins.forEach(c => scene.remove(c));
      obstacles = [];
      coins = [];
      if (player) player.position.set(0, 0, 0);
      if (renderer && scene && camera) renderer.render(scene, camera);
    };

    const togglePause = () => {
      isPaused.value = !isPaused.value;
      if (!isPaused.value) animate();
    };

    const toggleSound = () => {
      muted.value = toggleMuteSound();
    };

    let spawnTimer = 0;

    const animate = () => {
      if (!isPlaying.value || isGameOver.value || isPaused.value) return;
      animationFrameId = requestAnimationFrame(animate);

      score.value += 0.2;
      speed += 0.00005;

      // Smooth horizontal interpolation
      player.position.x += (playerTargetX - player.position.x) * 0.2;

      // Jump physics
      if (isJumping) {
        player.position.y += jumpVelocity;
        jumpVelocity -= 0.014;
        if (player.position.y <= 0) {
          player.position.y = 0;
          isJumping = false;
        }
      }

      // Spawning
      spawnTimer++;
      if (spawnTimer > 45) {
        spawnObstacle();
        spawnTimer = 0;
      }

      // Move obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.position.z += speed;

        // Collision check
        if (Math.abs(obs.position.z - player.position.z) < 1.0) {
          if (Math.abs(obs.position.x - player.position.x) < 0.9 && player.position.y < 0.8) {
            // Collision!
            isGameOver.value = true;
            playSound('explosion');
            if (score.value > highScore.value) {
              highScore.value = Math.floor(score.value);
              localStorage.setItem('tr3d_highscore', highScore.value.toString());
            }
            return;
          }
        }

        if (obs.position.z > 10) {
          scene.remove(obs);
          obstacles.splice(i, 1);
        }
      }

      // Move coins
      for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        coin.position.z += speed;
        coin.rotation.z += 0.05;

        // Collect check
        if (Math.abs(coin.position.z - player.position.z) < 1.0) {
          if (Math.abs(coin.position.x - player.position.x) < 0.9) {
            coinsCollected.value++;
            score.value += 15;
            playSound('coin');
            scene.remove(coin);
            coins.splice(i, 1);
            continue;
          }
        }

        if (coin.position.z > 10) {
          scene.remove(coin);
          coins.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    onMounted(() => {
      initThree();
    });

    onUnmounted(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('keydown', onKeyDown);
      if (renderer) renderer.dispose();
    });

    return {
      canvasContainer,
      score,
      coinsCollected,
      highScore,
      isPlaying,
      isPaused,
      isGameOver,
      muted,
      toggleSound,
      startGame,
      togglePause,
      resetGame,
      moveLeft,
      moveRight,
      jump
    };
  }
};
</script>

<style scoped>
.game-canvas-wrapper {
  height: clamp(340px, 58vh, 500px);
}
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.max-w-sm { max-width: 24rem; }
.max-w-xs { max-width: 20rem; }
.pointer-events-none { pointer-events: none; }
.pointer-events-auto { pointer-events: auto; }
</style>
