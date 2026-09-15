<template>
  <div class="game-container w-100 position-relative rounded-4 overflow-hidden bg-dark shadow-lg">
    <!-- Top HUD Overlay -->
    <div class="position-absolute top-0 start-0 end-0 p-2.5 p-md-3 d-flex justify-content-between align-items-center bg-dark bg-opacity-75 text-white z-3 border-bottom border-secondary border-opacity-25">
      <div class="d-flex align-items-center gap-2 gap-md-3">
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">STAGE KAYU</small>
          <span class="fs-4 fw-extrabold text-warning font-monospace">Stage {{ stage }}</span>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">SISA PISAU</small>
          <div class="d-flex gap-1">
            <span v-for="k in knivesLeft" :key="k" class="text-warning">🗡️</span>
          </div>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">SKOR PISAU</small>
          <span class="fs-5 fw-bold text-success font-monospace">{{ score }}</span>
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

    <!-- 3D Canvas Area (Touch/Click Anywhere to Throw) -->
    <div
      ref="canvasContainer"
      class="w-100 position-relative game-canvas-wrapper"
      @mousedown="throwKnife"
      @touchstart.prevent="throwKnife"
    ></div>

    <!-- Start / Game Over Screen -->
    <div v-if="!isPlaying || isGameOver" class="position-absolute inset-0 bg-dark bg-opacity-85 d-flex flex-column align-items-center justify-content-center text-white z-3 p-4 text-center">
      <div class="mb-3">
        <span class="fs-1 d-block mb-1">🗡️🎯🪵</span>
        <h3 class="fw-extrabold text-warning mb-1">TARGET BLADE (LEMPAR PISAU)</h3>
        <p class="text-light opacity-75 small max-w-sm">Tancapkan seluruh pisau ke balok kayu yang berputar. Jangan sampai menabrak bilah pisau lain!</p>
      </div>

      <div v-if="isGameOver" class="mb-3 bg-danger bg-opacity-25 border border-danger p-3 rounded-4 w-100 max-w-xs">
        <h5 class="fw-bold text-danger mb-1">PISAU SALING MENABRAK!</h5>
        <div class="display-6 fw-extrabold font-monospace text-warning mb-1">{{ score }} Poin</div>
        <small class="text-light opacity-75">Stage Terakhir: {{ stage }} | Rekor: {{ highScore }}</small>
      </div>

      <button class="btn btn-warning btn-lg rounded-pill px-5 fw-extrabold shadow-lg py-2 fs-5" @click="startGame">
        <i class="bi bi-play-circle-fill me-2"></i> {{ isGameOver ? 'Main Lagi' : 'Mulai Lempar Pisau' }}
      </button>

      <div class="mt-3 pt-2 border-top border-secondary border-opacity-50 text-secondary small">
        <i class="bi bi-hand-index-thumb me-1"></i> Ketuk layar / klik mouse / Spasi untuk melontarkan pisau
      </div>
    </div>

    <!-- Bottom Mobile Big Throw Button -->
    <div v-if="isPlaying && !isGameOver" class="position-absolute bottom-0 start-0 end-0 p-3 text-center z-3 pointer-events-none">
      <button class="btn btn-warning btn-lg rounded-pill px-5 py-2.5 fw-extrabold shadow-lg text-dark pointer-events-auto" @touchstart.prevent="throwKnife" @mousedown.prevent="throwKnife">
        🗡️ LEMPAR PISAU
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { playSound, toggleMuteSound, isSoundMuted } from '@/utils/gameAudio';

export default {
  name: 'KnifeHit3D',
  setup() {
    const canvasContainer = ref(null);
    const score = ref(0);
    const stage = ref(1);
    const knivesLeft = ref(7);
    const highScore = ref(parseInt(localStorage.getItem('knife_hit_highscore') || '0'));
    const isPlaying = ref(false);
    const isGameOver = ref(false);
    const muted = ref(isSoundMuted());

    let scene, camera, renderer, animationFrameId;
    let targetLog;
    let stuckAngles = []; // angles of knives in radians
    let activeKnife = null;
    let isThrowing = false;
    let rotationSpeed = 0.03;
    let directionChangeTimer = 0;

    const initThree = () => {
      if (!canvasContainer.value) return;
      const width = canvasContainer.value.clientWidth || 700;
      const height = canvasContainer.value.clientHeight || 460;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);

      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.set(0, 0, 9);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      canvasContainer.value.innerHTML = '';
      canvasContainer.value.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0xfacc15, 1.5);
      dirLight.position.set(5, 10, 8);
      scene.add(dirLight);

      // Wooden Log Target (Cylinder)
      targetLog = new THREE.Group();
      const logGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.7, 32);
      const logMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.7, metalness: 0.1 });
      const logMesh = new THREE.Mesh(logGeo, logMat);
      logMesh.rotation.x = Math.PI / 2;
      targetLog.add(logMesh);

      // Target core bullseye
      const coreGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.72, 24);
      const coreMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.rotation.x = Math.PI / 2;
      targetLog.add(coreMesh);

      targetLog.position.set(0, 1.8, 0);
      scene.add(targetLog);

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
      if (e.key === ' ' || e.key === 'ArrowUp') throwKnife();
    };

    const createKnifeMesh = () => {
      const knife = new THREE.Group();
      // Blade
      const bladeGeo = new THREE.ConeGeometry(0.18, 1.0, 4);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.y = 0.5;
      knife.add(blade);

      // Handle
      const handleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12 });
      const handle = new THREE.Mesh(handleGeo, handleMat);
      handle.position.y = -0.2;
      knife.add(handle);

      return knife;
    };

    const spawnReadyKnife = () => {
      if (activeKnife) scene.remove(activeKnife);
      activeKnife = createKnifeMesh();
      activeKnife.position.set(0, -3.2, 0);
      scene.add(activeKnife);
      isThrowing = false;
    };

    const throwKnife = () => {
      if (!isPlaying.value || isGameOver.value || isThrowing || !activeKnife) return;
      isThrowing = true;
      playSound('hit');
    };

    const startStage = (lvl) => {
      stage.value = lvl;
      knivesLeft.value = Math.min(10, 6 + lvl);
      stuckAngles = [];

      // Clear previous knives on log
      while (targetLog.children.length > 2) {
        targetLog.remove(targetLog.children[2]);
      }

      // Pre-populate 1 or 2 obstacle knives on higher stages
      if (lvl > 1) {
        const preKnives = Math.min(4, lvl - 1);
        for (let i = 0; i < preKnives; i++) {
          const angle = (Math.PI * 2 * i) / preKnives;
          addKnifeToLog(angle);
        }
      }

      rotationSpeed = (0.025 + lvl * 0.005) * (Math.random() > 0.5 ? 1 : -1);
      spawnReadyKnife();
    };

    const addKnifeToLog = (angle) => {
      stuckAngles.push(angle);
      const knife = createKnifeMesh();
      knife.position.set(Math.sin(angle) * 1.8, Math.cos(angle) * 1.8, 0);
      knife.rotation.z = -angle + Math.PI;
      targetLog.add(knife);
    };

    const startGame = () => {
      score.value = 0;
      isGameOver.value = false;
      isPlaying.value = true;
      startStage(1);

      playSound('select');
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animate();
    };

    const resetGame = () => {
      isPlaying.value = false;
      isGameOver.value = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (activeKnife) scene.remove(activeKnife);
      activeKnife = null;
      while (targetLog.children.length > 2) {
        targetLog.remove(targetLog.children[2]);
      }
      if (renderer && scene && camera) renderer.render(scene, camera);
    };

    const toggleSound = () => {
      muted.value = toggleMuteSound();
    };

    const animate = () => {
      if (!isPlaying.value || isGameOver.value) return;
      animationFrameId = requestAnimationFrame(animate);

      // Rotate log
      targetLog.rotation.z += rotationSpeed;

      // Periodically vary rotation
      directionChangeTimer++;
      if (directionChangeTimer > 180) {
        if (Math.random() > 0.6) rotationSpeed = -rotationSpeed;
        directionChangeTimer = 0;
      }

      // Flying knife animation
      if (isThrowing && activeKnife) {
        activeKnife.position.y += 0.35;

        // Check contact with target log
        if (activeKnife.position.y >= 0.0) {
          // Calculate hit angle relative to log's current rotation
          const currentLogAngle = targetLog.rotation.z % (Math.PI * 2);
          // Angle at the bottom (hit position)
          let hitAngle = -currentLogAngle;
          // Normalize 0 to 2*PI
          hitAngle = ((hitAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

          // Check collision with existing stuck knives (within 0.28 rad threshold)
          let hitExisting = false;
          for (const angle of stuckAngles) {
            const normAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            let diff = Math.abs(hitAngle - normAngle);
            if (diff > Math.PI) diff = Math.PI * 2 - diff;
            if (diff < 0.32) {
              hitExisting = true;
              break;
            }
          }

          if (hitExisting) {
            // Deflection & Game Over!
            isGameOver.value = true;
            playSound('fail');
            activeKnife.rotation.z = 0.5;
            activeKnife.position.y = -0.5;
            if (score.value > highScore.value) {
              highScore.value = score.value;
              localStorage.setItem('knife_hit_highscore', highScore.value.toString());
            }
            return;
          } else {
            // Successfully stuck!
            scene.remove(activeKnife);
            addKnifeToLog(hitAngle);
            score.value += 20;
            knivesLeft.value--;
            playSound('coin');

            if (knivesLeft.value <= 0) {
              // Stage cleared!
              playSound('levelUp');
              score.value += 100;
              setTimeout(() => {
                startStage(stage.value + 1);
              }, 400);
            } else {
              spawnReadyKnife();
            }
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
      stage,
      knivesLeft,
      highScore,
      isPlaying,
      isGameOver,
      muted,
      toggleSound,
      startGame,
      resetGame,
      throwKnife
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
.pointer-events-none { pointer-events: none; }
.pointer-events-auto { pointer-events: auto; }
</style>
