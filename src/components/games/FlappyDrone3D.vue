<template>
  <div class="game-container w-100 position-relative rounded-4 overflow-hidden bg-dark shadow-lg">
    <!-- Top HUD Overlay -->
    <div class="position-absolute top-0 start-0 end-0 p-2.5 p-md-3 d-flex justify-content-between align-items-center bg-dark bg-opacity-75 text-white z-3 border-bottom border-secondary border-opacity-25">
      <div class="d-flex align-items-center gap-2 gap-md-3">
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">SKOR GERBANG</small>
          <span class="fs-4 fw-extrabold text-warning font-monospace">{{ score }}</span>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">REKOR TERTINGGI</small>
          <span class="fs-5 fw-bold text-info font-monospace">{{ highScore }}</span>
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

    <!-- 3D Canvas Area with Click/Touch to Flap -->
    <div
      ref="canvasContainer"
      class="w-100 position-relative game-canvas-wrapper"
      @mousedown="flap"
      @touchstart.prevent="flap"
    ></div>

    <!-- Start / Game Over Screen -->
    <div v-if="!isPlaying || isGameOver" class="position-absolute inset-0 bg-dark bg-opacity-85 d-flex flex-column align-items-center justify-content-center text-white z-3 p-4 text-center">
      <div class="mb-3">
        <span class="fs-1 d-block mb-1">🛸⚡</span>
        <h3 class="fw-extrabold text-warning mb-1">3D FLAPPY CYBER DRONE</h3>
        <p class="text-light opacity-75 small max-w-sm">Ketuk layar atau tekan Spasi untuk menerbangkan drone melintasi celah gerbang laser neon!</p>
      </div>

      <div v-if="isGameOver" class="mb-3 bg-danger bg-opacity-25 border border-danger p-3 rounded-4 w-100 max-w-xs">
        <h5 class="fw-bold text-danger mb-1">DRONE MENABRAK!</h5>
        <div class="display-6 fw-extrabold font-monospace text-warning mb-1">{{ score }} Gerbang</div>
        <small class="text-light opacity-75">Rekor Terbaik: {{ highScore }}</small>
      </div>

      <button class="btn btn-warning btn-lg rounded-pill px-5 fw-extrabold shadow-lg py-2 fs-5" @click="startGame">
        <i class="bi bi-play-circle-fill me-2"></i> {{ isGameOver ? 'Terbang Lagi' : 'Mulai Terbang 3D' }}
      </button>

      <div class="mt-3 pt-2 border-top border-secondary border-opacity-50 text-secondary small">
        <i class="bi bi-phone me-1"></i> Ketuk Layar HP / Klik Mouse / Tekan Spasi untuk Melayang
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { playSound, toggleMuteSound, isSoundMuted } from '@/utils/gameAudio';

export default {
  name: 'FlappyDrone3D',
  setup() {
    const canvasContainer = ref(null);
    const score = ref(0);
    const highScore = ref(parseInt(localStorage.getItem('flappy_drone_highscore') || '0'));
    const isPlaying = ref(false);
    const isGameOver = ref(false);
    const muted = ref(isSoundMuted());

    let scene, camera, renderer, animationFrameId;
    let drone, dronePropellers = [];
    let velocity = 0;
    const gravity = -0.016;
    const flapStrength = 0.28;
    let gates = [];
    let gateTimer = 0;

    const initThree = () => {
      if (!canvasContainer.value) return;
      const width = canvasContainer.value.clientWidth || 700;
      const height = canvasContainer.value.clientHeight || 460;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x060814);
      scene.fog = new THREE.FogExp2(0x060814, 0.02);

      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.set(-6, 0, 10);
      camera.lookAt(2, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      canvasContainer.value.innerHTML = '';
      canvasContainer.value.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
      dirLight.position.set(5, 10, 8);
      scene.add(dirLight);

      // Build 3D Quadcopter Drone
      drone = new THREE.Group();
      const bodyGeo = new THREE.SphereGeometry(0.5, 16, 16);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.8 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      drone.add(body);

      const eyeGeo = new THREE.SphereGeometry(0.2, 12, 12);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(0.4, 0.1, 0);
      drone.add(eye);

      // 4 Arms & Propellers
      [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]].forEach(([ax, az]) => {
        const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
        const armMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
        const arm = new THREE.Mesh(armGeo, armMat);
        arm.position.set(ax * 0.6, 0.1, az * 0.6);
        arm.rotation.z = Math.PI / 4;
        drone.add(arm);

        const propGeo = new THREE.BoxGeometry(0.7, 0.02, 0.1);
        const propMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const prop = new THREE.Mesh(propGeo, propMat);
        prop.position.set(ax, 0.2, az);
        drone.add(prop);
        dronePropellers.push(prop);
      });

      drone.position.set(0, 0, 0);
      scene.add(drone);

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
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        flap();
      }
    };

    const flap = () => {
      if (!isPlaying.value || isGameOver.value) return;
      velocity = flapStrength;
      playSound('hit');
    };

    const spawnGate = () => {
      const gapY = (Math.random() - 0.5) * 4.5;
      const gapSize = 3.2;

      const gateGroup = new THREE.Group();
      gateGroup.position.set(16, 0, 0);

      // Top pillar
      const topGeo = new THREE.BoxGeometry(0.8, 12, 1.2);
      const topMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.2, metalness: 0.5, emissive: 0x4a044e });
      const topPillar = new THREE.Mesh(topGeo, topMat);
      topPillar.position.y = gapY + gapSize / 2 + 6;
      gateGroup.add(topPillar);

      // Bottom pillar
      const botPillar = new THREE.Mesh(topGeo, topMat);
      botPillar.position.y = gapY - gapSize / 2 - 6;
      gateGroup.add(botPillar);

      // Glowing border rings
      [topPillar.position.y - 6, botPillar.position.y + 6].forEach(ry => {
        const ringGeo = new THREE.BoxGeometry(1.0, 0.15, 1.4);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.y = ry;
        gateGroup.add(ring);
      });

      gateGroup.userData = { passed: false, gapY, gapSize };
      scene.add(gateGroup);
      gates.push(gateGroup);
    };

    const startGame = () => {
      score.value = 0;
      isGameOver.value = false;
      isPlaying.value = true;
      velocity = flapStrength;
      drone.position.set(0, 0, 0);
      drone.rotation.set(0, 0, 0);

      gates.forEach(g => scene.remove(g));
      gates = [];
      gateTimer = 0;

      playSound('select');
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animate();
    };

    const resetGame = () => {
      isPlaying.value = false;
      isGameOver.value = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      gates.forEach(g => scene.remove(g));
      gates = [];
      if (drone) drone.position.set(0, 0, 0);
      if (renderer && scene && camera) renderer.render(scene, camera);
    };

    const toggleSound = () => {
      muted.value = toggleMuteSound();
    };

    const animate = () => {
      if (!isPlaying.value || isGameOver.value) return;
      animationFrameId = requestAnimationFrame(animate);

      // Drone physics
      velocity += gravity;
      drone.position.y += velocity;
      drone.rotation.z = Math.max(-0.6, Math.min(0.4, velocity * 1.5));

      // Spin propellers
      dronePropellers.forEach(p => p.rotation.y += 0.35);

      // Ground & ceiling collision
      if (drone.position.y < -5.5 || drone.position.y > 6.0) {
        gameOver();
        return;
      }

      // Gate spawning
      gateTimer++;
      if (gateTimer > 75) {
        spawnGate();
        gateTimer = 0;
      }

      // Move gates
      for (let i = gates.length - 1; i >= 0; i--) {
        const gate = gates[i];
        gate.position.x -= 0.12;

        // Check score
        if (!gate.userData.passed && gate.position.x < drone.position.x) {
          gate.userData.passed = true;
          score.value++;
          playSound('score');
        }

        // Check collision
        if (Math.abs(gate.position.x - drone.position.x) < 0.8) {
          const { gapY, gapSize } = gate.userData;
          if (drone.position.y > gapY + gapSize / 2 - 0.3 || drone.position.y < gapY - gapSize / 2 + 0.3) {
            gameOver();
            return;
          }
        }

        // Remove offscreen
        if (gate.position.x < -14) {
          scene.remove(gate);
          gates.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    const gameOver = () => {
      isGameOver.value = true;
      playSound('explosion');
      if (score.value > highScore.value) {
        highScore.value = score.value;
        localStorage.setItem('flappy_drone_highscore', highScore.value.toString());
      }
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
      highScore,
      isPlaying,
      isGameOver,
      muted,
      toggleSound,
      startGame,
      resetGame,
      flap
    };
  }
};
</script>

<style scoped>
.game-canvas-wrapper {
  height: clamp(340px, 58vh, 500px);
  cursor: pointer;
}
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.max-w-sm { max-width: 24rem; }
.max-w-xs { max-width: 20rem; }
</style>
