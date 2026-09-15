<template>
  <div class="game-container w-100 position-relative rounded-4 overflow-hidden bg-dark shadow-lg">
    <!-- Top HUD Overlay -->
    <div class="position-absolute top-0 start-0 end-0 p-2.5 p-md-3 d-flex justify-content-between align-items-center bg-dark bg-opacity-75 text-white z-3 border-bottom border-secondary border-opacity-25">
      <div class="d-flex align-items-center gap-2 gap-md-3">
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">SKOR TEMPUR</small>
          <span class="fs-4 fw-extrabold text-warning font-monospace">{{ score }}</span>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">SHIELD KAPAL</small>
          <div class="progress" style="width: 75px; height: 8px;">
            <div class="progress-bar bg-info" :style="{ width: shields + '%' }"></div>
          </div>
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
        <button class="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 text-white" @click="resetGame">
          <i class="bi bi-arrow-counterclockwise"></i> <span class="d-none d-sm-inline">Reset</span>
        </button>
      </div>
    </div>

    <!-- 3D Canvas Area -->
    <div
      ref="canvasContainer"
      class="w-100 position-relative game-canvas-wrapper"
      @mousemove="onMouseMove"
      @touchmove.prevent="onTouchMove"
    ></div>

    <!-- Start / Game Over Screen -->
    <div v-if="!isPlaying || isGameOver" class="position-absolute inset-0 bg-dark bg-opacity-85 d-flex flex-column align-items-center justify-content-center text-white z-3 p-4 text-center">
      <div class="mb-3">
        <span class="fs-1 d-block mb-1">🚀💥✨</span>
        <h3 class="fw-extrabold text-warning mb-1">3D SPACE DEFENDER</h3>
        <p class="text-light opacity-75 small max-w-sm">Kendalikan kapal antariksa foton 3D! Tembak asteroid luar angkasa dan pesawat alien penyerang.</p>
      </div>

      <div v-if="isGameOver" class="mb-3 bg-danger bg-opacity-25 border border-danger p-3 rounded-4 w-100 max-w-xs">
        <h5 class="fw-bold text-danger mb-1">KAPAL HANCUR!</h5>
        <div class="display-6 fw-extrabold font-monospace text-warning mb-1">{{ score }} Poin</div>
        <small class="text-light opacity-75">Rekor Terbaik: {{ highScore }}</small>
      </div>

      <button class="btn btn-warning btn-lg rounded-pill px-5 fw-extrabold shadow-lg py-2 fs-5" @click="startGame">
        <i class="bi bi-play-circle-fill me-2"></i> {{ isGameOver ? 'Terbang Lagi' : 'Luncurkan Kapal 3D' }}
      </button>

      <div class="mt-3 pt-2 border-top border-secondary border-opacity-50 text-secondary small">
        <i class="bi bi-hand-index-thumb me-1"></i> Geser jari di layar HP / kursor mouse untuk bermanuver (Laser otomatis menembak)
      </div>
    </div>

    <!-- On-Screen Mobile Touch Left/Right Helper Controls -->
    <div v-if="isPlaying && !isGameOver" class="position-absolute bottom-0 start-0 end-0 p-3 d-flex justify-content-between z-3 pointer-events-none">
      <button class="btn btn-dark bg-opacity-75 text-info border-info rounded-circle p-3 shadow-lg pointer-events-auto" style="width: 58px; height: 58px;" @touchstart.prevent="moveShipLeft" @mousedown.prevent="moveShipLeft">
        <i class="bi bi-arrow-left fs-3"></i>
      </button>
      <button class="btn btn-dark bg-opacity-75 text-info border-info rounded-circle p-3 shadow-lg pointer-events-auto" style="width: 58px; height: 58px;" @touchstart.prevent="moveShipRight" @mousedown.prevent="moveShipRight">
        <i class="bi bi-arrow-right fs-3"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { playSound, toggleMuteSound, isSoundMuted } from '@/utils/gameAudio';

export default {
  name: 'SpaceDefender3D',
  setup() {
    const canvasContainer = ref(null);
    const score = ref(0);
    const shields = ref(100);
    const highScore = ref(parseInt(localStorage.getItem('space_def_highscore') || '0'));
    const isPlaying = ref(false);
    const isGameOver = ref(false);
    const muted = ref(isSoundMuted());

    let scene, camera, renderer, animationFrameId;
    let ship, shipTargetX = 0;
    let lasers = [];
    let enemies = [];
    let stars = [];
    let fireTimer = 0;
    let spawnTimer = 0;

    const initThree = () => {
      if (!canvasContainer.value) return;
      const width = canvasContainer.value.clientWidth || 700;
      const height = canvasContainer.value.clientHeight || 460;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x050510);

      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.set(0, 10, 8);
      camera.lookAt(0, 0, -5);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      canvasContainer.value.innerHTML = '';
      canvasContainer.value.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0xa855f7, 2);
      dirLight.position.set(0, 10, 5);
      scene.add(dirLight);

      // Starfield
      const starGeo = new THREE.BufferGeometry();
      const starCount = 300;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i += 3) {
        starPos[i] = (Math.random() - 0.5) * 30;
        starPos[i + 1] = (Math.random() - 0.5) * 10;
        starPos[i + 2] = -Math.random() * 40;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 });
      const starField = new THREE.Points(starGeo, starMat);
      scene.add(starField);

      // Spaceship 3D Model
      ship = new THREE.Group();
      const hullGeo = new THREE.ConeGeometry(0.6, 1.6, 4);
      const hullMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.2, metalness: 0.8 });
      const hull = new THREE.Mesh(hullGeo, hullMat);
      hull.rotation.x = -Math.PI / 2;
      ship.add(hull);

      const wingGeo = new THREE.BoxGeometry(2.0, 0.08, 0.7);
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
      const wings = new THREE.Mesh(wingGeo, wingMat);
      wings.position.z = 0.3;
      ship.add(wings);

      const engineGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x00ffff })
      );
      engineGlow.position.z = 0.7;
      ship.add(engineGlow);

      ship.position.set(0, 0, 1);
      scene.add(ship);

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
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveShipLeft();
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveShipRight();
    };

    const moveShipLeft = () => {
      shipTargetX = Math.max(-5.5, shipTargetX - 1.2);
    };

    const moveShipRight = () => {
      shipTargetX = Math.min(5.5, shipTargetX + 1.2);
    };

    const updateShipTarget = (clientX) => {
      if (!canvasContainer.value) return;
      const rect = canvasContainer.value.getBoundingClientRect();
      const normX = (clientX - rect.left) / rect.width; // 0 to 1
      shipTargetX = (normX - 0.5) * 11;
    };

    const onMouseMove = (e) => {
      if (isPlaying.value && !isGameOver.value) updateShipTarget(e.clientX);
    };

    const onTouchMove = (e) => {
      if (isPlaying.value && !isGameOver.value && e.touches.length > 0) {
        updateShipTarget(e.touches[0].clientX);
      }
    };

    const spawnEnemy = () => {
      const isDrone = Math.random() > 0.4;
      const enemyGeo = isDrone ? new THREE.OctahedronGeometry(0.6) : new THREE.DodecahedronGeometry(0.7);
      const enemyMat = new THREE.MeshStandardMaterial({
        color: isDrone ? 0xef4444 : 0xf59e0b,
        roughness: 0.3,
        metalness: 0.6,
        emissive: isDrone ? 0x660000 : 0x442200
      });
      const enemy = new THREE.Mesh(enemyGeo, enemyMat);
      enemy.position.set((Math.random() - 0.5) * 11, 0, -26);
      scene.add(enemy);
      enemies.push(enemy);
    };

    const fireLaser = () => {
      if (!ship) return;
      [-0.6, 0.6].forEach(offset => {
        const laserGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.8);
        const laserMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
        const laser = new THREE.Mesh(laserGeo, laserMat);
        laser.rotation.x = Math.PI / 2;
        laser.position.set(ship.position.x + offset, 0, ship.position.z - 0.8);
        scene.add(laser);
        lasers.push(laser);
      });
      playSound('laser');
    };

    const startGame = () => {
      score.value = 0;
      shields.value = 100;
      isGameOver.value = false;
      isPlaying.value = true;
      shipTargetX = 0;
      if (ship) ship.position.set(0, 0, 1);

      enemies.forEach(e => scene.remove(e));
      lasers.forEach(l => scene.remove(l));
      enemies = [];
      lasers = [];

      playSound('select');
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animate();
    };

    const resetGame = () => {
      isPlaying.value = false;
      isGameOver.value = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      enemies.forEach(e => scene.remove(e));
      lasers.forEach(l => scene.remove(l));
      enemies = [];
      lasers = [];
      if (ship) ship.position.set(0, 0, 1);
      if (renderer && scene && camera) renderer.render(scene, camera);
    };

    const toggleSound = () => {
      muted.value = toggleMuteSound();
    };

    const animate = () => {
      if (!isPlaying.value || isGameOver.value) return;
      animationFrameId = requestAnimationFrame(animate);

      // Smooth ship movement
      ship.position.x += (shipTargetX - ship.position.x) * 0.18;
      ship.rotation.z = -(shipTargetX - ship.position.x) * 0.35;

      // Auto fire laser
      fireTimer++;
      if (fireTimer > 16) {
        fireLaser();
        fireTimer = 0;
      }

      // Spawn enemy
      spawnTimer++;
      if (spawnTimer > 35) {
        spawnEnemy();
        spawnTimer = 0;
      }

      // Move lasers
      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        l.position.z -= 0.6;
        if (l.position.z < -30) {
          scene.remove(l);
          lasers.splice(i, 1);
        }
      }

      // Move enemies & check laser collision
      for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.position.z += 0.18;
        enemy.rotation.x += 0.03;
        enemy.rotation.y += 0.04;

        // Check laser collision
        let destroyed = false;
        for (let j = lasers.length - 1; j >= 0; j--) {
          const l = lasers[j];
          if (l.position.distanceTo(enemy.position) < 1.0) {
            scene.remove(l);
            lasers.splice(j, 1);
            destroyed = true;
            break;
          }
        }

        if (destroyed) {
          score.value += 50;
          playSound('explosion');
          scene.remove(enemy);
          enemies.splice(i, 1);
          continue;
        }

        // Check ship collision
        if (enemy.position.distanceTo(ship.position) < 1.2) {
          shields.value -= 25;
          playSound('hit');
          scene.remove(enemy);
          enemies.splice(i, 1);

          if (shields.value <= 0) {
            isGameOver.value = true;
            playSound('fail');
            if (score.value > highScore.value) {
              highScore.value = score.value;
              localStorage.setItem('space_def_highscore', highScore.value.toString());
            }
            return;
          }
          continue;
        }

        // Offscreen past player
        if (enemy.position.z > 5) {
          scene.remove(enemy);
          enemies.splice(i, 1);
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
      shields,
      highScore,
      isPlaying,
      isGameOver,
      muted,
      toggleSound,
      startGame,
      resetGame,
      moveShipLeft,
      moveShipRight,
      onMouseMove,
      onTouchMove
    };
  }
};
</script>

<style scoped>
.game-canvas-wrapper {
  height: clamp(340px, 58vh, 500px);
  cursor: crosshair;
}
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.max-w-sm { max-width: 24rem; }
.max-w-xs { max-width: 20rem; }
.pointer-events-none { pointer-events: none; }
.pointer-events-auto { pointer-events: auto; }
</style>
