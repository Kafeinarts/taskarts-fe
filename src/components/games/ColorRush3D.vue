<template>
  <div class="game-container w-100 position-relative rounded-4 overflow-hidden bg-dark shadow-lg">
    <!-- Top HUD Overlay -->
    <div class="position-absolute top-0 start-0 end-0 p-2.5 p-md-3 d-flex justify-content-between align-items-center bg-dark bg-opacity-75 text-white z-3 border-bottom border-secondary border-opacity-25">
      <div class="d-flex align-items-center gap-2 gap-md-3">
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">SKOR WARNA</small>
          <span class="fs-4 fw-extrabold text-warning font-monospace">{{ score }}</span>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">NYAWA</small>
          <div class="d-flex gap-1 text-danger">
            <i v-for="n in lives" :key="n" class="bi bi-heart-fill fs-6"></i>
          </div>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">COMBO</small>
          <span class="badge bg-primary rounded-pill px-2 py-1 font-monospace">x{{ combo }}</span>
        </div>
      </div>

      <div class="d-flex align-items-center gap-1.5">
        <button class="btn btn-sm btn-outline-light rounded-circle p-1.5" @click="toggleSound" :title="muted ? 'Unmute' : 'Mute'">
          <i :class="muted ? 'bi bi-volume-mute-fill' : 'bi bi-volume-up-fill'"></i>
        </button>
        <button class="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 text-white" @click="resetGame">
          <i class="bi bi-arrow-counterclockwise"></i> <span class="d-none d-sm-inline">Reset</span>
        </button>
      </div>
    </div>

    <!-- 3D Canvas Area (Falling Balls & Center Shield) -->
    <div ref="canvasContainer" class="w-100 position-relative game-canvas-wrapper"></div>

    <!-- Start / Game Over Screen -->
    <div v-if="!isPlaying || isGameOver" class="position-absolute inset-0 bg-dark bg-opacity-85 d-flex flex-column align-items-center justify-content-center text-white z-3 p-4 text-center">
      <div class="mb-3">
        <span class="fs-1 d-block mb-1">🎨🔴🔵🟢🟡</span>
        <h3 class="fw-extrabold text-warning mb-1">COLOR RUSH REFLEX</h3>
        <p class="text-light opacity-75 small max-w-sm">Ganti warna perisai di bawah agar cocok dengan warna bola energi yang meluncur turun!</p>
      </div>

      <div v-if="isGameOver" class="mb-3 bg-danger bg-opacity-25 border border-danger p-3 rounded-4 w-100 max-w-xs">
        <h5 class="fw-bold text-danger mb-1">ENERGI HABIS!</h5>
        <div class="display-6 fw-extrabold font-monospace text-warning mb-1">{{ score }} Poin</div>
        <small class="text-light opacity-75">Combo Terbaik: x{{ maxCombo }} | Rekor: {{ highScore }}</small>
      </div>

      <button class="btn btn-warning btn-lg rounded-pill px-5 fw-extrabold shadow-lg py-2 fs-5" @click="startGame">
        <i class="bi bi-play-circle-fill me-2"></i> {{ isGameOver ? 'Main Lagi' : 'Mulai Game Warna' }}
      </button>

      <div class="mt-3 pt-2 border-top border-secondary border-opacity-50 text-secondary small">
        <i class="bi bi-hand-index-thumb me-1"></i> Sentuh 4 tombol warna di bawah atau tekan tombol 1, 2, 3, 4 di keyboard
      </div>
    </div>

    <!-- 4 Big Color Control Pads (Perfect for Mobile & Desktop) -->
    <div v-if="isPlaying && !isGameOver" class="position-absolute bottom-0 start-0 end-0 p-2.5 p-md-3 z-3 bg-dark bg-opacity-75 border-top border-secondary border-opacity-25">
      <div class="row g-2 justify-content-center max-w-md mx-auto">
        <div v-for="(col, idx) in colors" :key="col.id" class="col-3">
          <button
            class="btn w-100 py-2.5 rounded-3 fw-bold shadow-lg transition-all d-flex flex-column align-items-center justify-content-center"
            :style="{
              background: col.hex,
              color: '#ffffff',
              border: activeColorIndex === idx ? '3px solid #ffffff' : '2px solid rgba(255,255,255,0.2)',
              transform: activeColorIndex === idx ? 'scale(1.05)' : 'scale(1)'
            }"
            @touchstart.prevent="setColor(idx)"
            @mousedown.prevent="setColor(idx)"
          >
            <span class="fs-6 fw-extrabold">{{ col.name }}</span>
            <small class="opacity-75 font-monospace" style="font-size: 0.65rem;">[{{ idx + 1 }}]</small>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { playSound, toggleMuteSound, isSoundMuted } from '@/utils/gameAudio';

export default {
  name: 'ColorRush3D',
  setup() {
    const canvasContainer = ref(null);
    const score = ref(0);
    const lives = ref(3);
    const combo = ref(0);
    const maxCombo = ref(0);
    const highScore = ref(parseInt(localStorage.getItem('color_rush_highscore') || '0'));
    const isPlaying = ref(false);
    const isGameOver = ref(false);
    const muted = ref(isSoundMuted());

    const colors = [
      { id: 'red', name: 'Merah', hex: '#ef4444', threeColor: 0xef4444 },
      { id: 'blue', name: 'Biru', hex: '#3b82f6', threeColor: 0x3b82f6 },
      { id: 'green', name: 'Hijau', hex: '#10b981', threeColor: 0x10b981 },
      { id: 'yellow', name: 'Kuning', hex: '#f59e0b', threeColor: 0xf59e0b }
    ];

    const activeColorIndex = ref(0);

    let scene, camera, renderer, animationFrameId;
    let shieldMesh;
    let balls = [];
    let spawnTimer = 0;
    let ballSpeed = 0.08;

    const initThree = () => {
      if (!canvasContainer.value) return;
      const width = canvasContainer.value.clientWidth || 700;
      const height = canvasContainer.value.clientHeight || 460;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0c16);

      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      canvasContainer.value.innerHTML = '';
      canvasContainer.value.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 1.3);
      scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
      dirLight.position.set(0, 10, 5);
      scene.add(dirLight);

      // Center Shield (Rounded Box)
      const shieldGeo = new THREE.BoxGeometry(2.4, 0.5, 0.8);
      const shieldMat = new THREE.MeshStandardMaterial({
        color: colors[0].threeColor,
        roughness: 0.2,
        metalness: 0.8
      });
      shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
      shieldMesh.position.set(0, -2.5, 0);
      scene.add(shieldMesh);

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
      if (!isPlaying.value || isGameOver.value) return;
      if (e.key === '1') setColor(0);
      if (e.key === '2') setColor(1);
      if (e.key === '3') setColor(2);
      if (e.key === '4') setColor(3);
    };

    const setColor = (idx) => {
      activeColorIndex.value = idx;
      if (shieldMesh) {
        shieldMesh.material.color.setHex(colors[idx].threeColor);
      }
      playSound('click');
    };

    const spawnBall = () => {
      const colorIdx = Math.floor(Math.random() * colors.length);
      const ballGeo = new THREE.SphereGeometry(0.45, 16, 16);
      const ballMat = new THREE.MeshStandardMaterial({
        color: colors[colorIdx].threeColor,
        roughness: 0.2,
        metalness: 0.5,
        emissive: colors[colorIdx].threeColor,
        emissiveIntensity: 0.3
      });
      const ball = new THREE.Mesh(ballGeo, ballMat);
      ball.position.set((Math.random() - 0.5) * 1.5, 5.5, 0);
      ball.userData = { colorIndex: colorIdx };
      scene.add(ball);
      balls.push(ball);
    };

    const startGame = () => {
      score.value = 0;
      lives.value = 3;
      combo.value = 0;
      maxCombo.value = 0;
      ballSpeed = 0.08;
      isGameOver.value = false;
      isPlaying.value = true;
      setColor(0);

      balls.forEach(b => scene.remove(b));
      balls = [];

      playSound('select');
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animate();
    };

    const resetGame = () => {
      isPlaying.value = false;
      isGameOver.value = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      balls.forEach(b => scene.remove(b));
      balls = [];
      if (renderer && scene && camera) renderer.render(scene, camera);
    };

    const toggleSound = () => {
      muted.value = toggleMuteSound();
    };

    const animate = () => {
      if (!isPlaying.value || isGameOver.value) return;
      animationFrameId = requestAnimationFrame(animate);

      // Ball spawning
      spawnTimer++;
      if (spawnTimer > 55) {
        spawnBall();
        spawnTimer = 0;
      }

      ballSpeed += 0.00002;

      // Move falling balls
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        b.position.y -= ballSpeed;
        b.rotation.x += 0.04;

        // Collision with shield at y = -2.2
        if (b.position.y <= -2.1 && b.position.y >= -2.7) {
          if (b.userData.colorIndex === activeColorIndex.value) {
            // Match!
            combo.value++;
            if (combo.value > maxCombo.value) maxCombo.value = combo.value;
            score.value += 50 + combo.value * 10;
            playSound('coin');
            scene.remove(b);
            balls.splice(i, 1);
            continue;
          } else {
            // Mismatch!
            lives.value--;
            combo.value = 0;
            playSound('hit');
            scene.remove(b);
            balls.splice(i, 1);

            if (lives.value <= 0) {
              isGameOver.value = true;
              playSound('explosion');
              if (score.value > highScore.value) {
                highScore.value = score.value;
                localStorage.setItem('color_rush_highscore', highScore.value.toString());
              }
              return;
            }
            continue;
          }
        }

        // Missed past shield
        if (b.position.y < -4) {
          lives.value--;
          combo.value = 0;
          playSound('hit');
          scene.remove(b);
          balls.splice(i, 1);

          if (lives.value <= 0) {
            isGameOver.value = true;
            playSound('explosion');
            if (score.value > highScore.value) {
              highScore.value = score.value;
              localStorage.setItem('color_rush_highscore', highScore.value.toString());
            }
            return;
          }
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
      lives,
      combo,
      maxCombo,
      highScore,
      isPlaying,
      isGameOver,
      muted,
      colors,
      activeColorIndex,
      setColor,
      toggleSound,
      startGame,
      resetGame
    };
  }
};
</script>

<style scoped>
.game-canvas-wrapper {
  height: clamp(340px, 55vh, 480px);
}
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.max-w-sm { max-width: 24rem; }
.max-w-md { max-width: 28rem; }
.max-w-xs { max-width: 20rem; }
</style>
