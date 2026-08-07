<template>
  <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden my-4" id="3d-simulator-card">
    <div class="card-header bg-dark text-white p-3 p-md-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-primary text-white fw-bold px-2.5 py-1 rounded-pill" style="font-size: 11px;">
            <i class="bi bi-box-seam me-1"></i> Three.js WebGL Engine
          </span>
          <span class="badge bg-success-subtle text-success fw-bold px-2.5 py-1 rounded-pill" style="font-size: 11px;">
            <i class="bi bi-sliders me-1"></i> Interactive 3D Simulator
          </span>
        </div>
        <h4 class="fw-bold mb-1 text-white">🖥️ 3D Virtual Desk & Office Setup Simulator</h4>
        <p class="text-white-50 small mb-0">Atur tata letak meja kerja 3D Anda, rotasi kamera 360°, nyalakan lampu meja, dan atur tema suasana ruang kerja ideal!</p>
      </div>

      <!-- Controls Header -->
      <div class="d-flex flex-wrap align-items-center gap-2">
        <button
          class="btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
          :class="isNightMode ? 'btn-warning text-dark' : 'btn-outline-light'"
          @click="toggleNightMode"
          title="Toggle Mode Siang / Malam"
        >
          <i :class="isNightMode ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill'"></i>
          <span>{{ isNightMode ? 'Malam' : 'Siang' }}</span>
        </button>

        <button
          class="btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
          :class="isLampOn ? 'btn-warning text-dark' : 'btn-outline-light'"
          @click="toggleLamp"
          title="Toggle Lampu Meja"
        >
          <i class="bi bi-lightbulb-fill"></i>
          <span>Lampu {{ isLampOn ? 'ON' : 'OFF' }}</span>
        </button>

        <button
          class="btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
          :class="isRgbOn ? 'btn-info text-dark' : 'btn-outline-light'"
          @click="toggleRgb"
          title="Toggle RGB Backlight Meja"
        >
          <i class="bi bi-palette-fill"></i>
          <span>RGB {{ isRgbOn ? 'ON' : 'OFF' }}</span>
        </button>

        <button
          class="btn btn-sm btn-outline-light rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
          @click="resetCamera"
          title="Reset Sudut Pandang Kamera"
        >
          <i class="bi bi-arrow-counterclockwise"></i>
          <span>Reset View</span>
        </button>
      </div>
    </div>

    <div class="card-body p-0 position-relative style-3d-container">
      <!-- 3D Canvas Area -->
      <div ref="canvasContainer" class="three-canvas-holder w-full"></div>

      <!-- Interactive Overlay Tooltip / Hint -->
      <div class="position-absolute top-0 start-0 m-3 p-2.5 bg-dark bg-opacity-75 text-white rounded-3 backdrop-blur small d-none d-sm-block pointer-events-none" style="z-index: 10;">
        <div class="d-flex align-items-center gap-2 fw-semibold">
          <i class="bi bi-mouse2 text-warning fs-5"></i>
          <span>Drag mouse untuk putar 360° | Scroll untuk Zoom | Klik objek untuk interaksi</span>
        </div>
      </div>

      <!-- Theme Control Floating Toolbar -->
      <div class="position-absolute bottom-0 start-0 end-0 p-3 bg-dark bg-opacity-80 backdrop-blur text-white border-top border-secondary border-opacity-25 d-flex flex-wrap align-items-center justify-content-between gap-2" style="z-index: 10;">
        <div class="d-flex align-items-center gap-2">
          <span class="small fw-semibold text-white-50">Tema Meja & Ruangan:</span>
          <div class="btn-group btn-group-sm" role="group">
            <button
              v-for="t in themes"
              :key="t.id"
              class="btn btn-sm text-white border-secondary border-opacity-50 px-2.5 py-1"
              :class="{ 'btn-primary fw-bold': currentTheme === t.id }"
              @click="setTheme(t.id)"
            >
              {{ t.name }}
            </button>
          </div>
        </div>

        <div class="d-flex align-items-center gap-3">
          <div class="d-flex align-items-center gap-2">
            <span class="small text-white-50">Layar Monitor:</span>
            <select class="form-select form-select-sm bg-dark text-white border-secondary border-opacity-50 style-select" v-model="monitorDisplay">
              <option value="code">VS Code / IDE Mode</option>
              <option value="kanban">Kanban Board Mode</option>
              <option value="matrix">Matrix Code Glow</option>
              <option value="dashboard">Analytics Chart Mode</option>
            </select>
          </div>

          <div class="badge bg-secondary bg-opacity-50 text-white border border-secondary border-opacity-50 px-3 py-1.5 rounded-pill small">
            <i class="bi bi-cpu me-1 text-info"></i> {{ fps }} FPS
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
  name: 'Workspace3DSimulator',
  setup() {
    const canvasContainer = ref(null);
    const isNightMode = ref(false);
    const isLampOn = ref(true);
    const isRgbOn = ref(true);
    const currentTheme = ref('dark');
    const monitorDisplay = ref('code');
    const fps = ref(60);

    let scene, camera, renderer, controls;
    let deskMesh, wallMesh, floorMesh;
    let lampLight, ambientLight, directionalLight, rgbLight;
    let monitorScreenMesh, laptopScreenMesh;
    let coffeeMugMesh, steamParticles;
    let animationFrameId = null;
    let raycaster, mouse;

    let frameCount = 0;
    let lastTime = performance.now();

    const themes = [
      { id: 'dark', name: '🎮 Studio Dark' },
      { id: 'wood', name: '🪵 Warm Wood' },
      { id: 'nordic', name: '🤍 Minimalist White' },
      { id: 'cyberpunk', name: '🌆 Cyberpunk' }
    ];

    const initThreeScene = () => {
      if (!canvasContainer.value) return;

      const width = canvasContainer.value.clientWidth || 800;
      const height = 480;

      // 1. Scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);
      scene.fog = new THREE.FogExp2(0x0f172a, 0.025);

      // 2. Camera
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 3.8, 6.2);

      // 3. Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputEncoding = THREE.sRGBEncoding;

      canvasContainer.value.appendChild(renderer.domElement);

      // 4. Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera going under floor
      controls.minDistance = 3;
      controls.maxDistance = 12;
      controls.target.set(0, 1.2, 0);

      // Raycaster for click interaction
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      // 5. Lights
      setupLights();

      // 6. Build Workspace Models
      buildRoom();
      buildDeskAndChair();
      buildMonitors();
      buildLaptop();
      buildPeripherals();
      buildLamp();
      buildDecorations();
      buildSteamParticles();

      // Event listener for window resize
      window.addEventListener('resize', onWindowResize);
      renderer.domElement.addEventListener('pointerdown', onCanvasClick);

      // Start render loop
      animate();
    };

    const setupLights = () => {
      ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      directionalLight = new THREE.DirectionalLight(0xfff8e7, 1.2);
      directionalLight.position.set(4, 8, 4);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 20;
      directionalLight.shadow.camera.left = -4;
      directionalLight.shadow.camera.right = 4;
      directionalLight.shadow.camera.top = 4;
      directionalLight.shadow.camera.bottom = -4;
      directionalLight.shadow.bias = -0.0005;
      scene.add(directionalLight);

      // Desk Lamp Light Point
      lampLight = new THREE.SpotLight(0xffe0b2, 3.5, 8, Math.PI / 4, 0.4, 1);
      lampLight.position.set(-1.6, 2.6, -0.2);
      lampLight.target.position.set(-0.8, 1.2, 0);
      lampLight.castShadow = true;
      lampLight.shadow.mapSize.width = 1024;
      lampLight.shadow.mapSize.height = 1024;
      scene.add(lampLight);
      scene.add(lampLight.target);

      // RGB Backlight strip light behind desk
      rgbLight = new THREE.PointLight(0x2563eb, 2.5, 6);
      rgbLight.position.set(0, 1.3, -1.2);
      scene.add(rgbLight);
    };

    const buildRoom = () => {
      // Floor
      const floorGeo = new THREE.PlaneGeometry(16, 16);
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.4,
        metalness: 0.1
      });
      floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.receiveShadow = true;
      scene.add(floorMesh);

      // Back Wall
      const wallGeo = new THREE.PlaneGeometry(16, 10);
      const wallMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.8
      });
      wallMesh = new THREE.Mesh(wallGeo, wallMat);
      wallMesh.position.set(0, 5, -3);
      wallMesh.receiveShadow = true;
      scene.add(wallMesh);
    };

    const buildDeskAndChair = () => {
      // Desk Tabletop
      const deskGeo = new THREE.BoxGeometry(3.6, 0.12, 1.8);
      const deskMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.3,
        metalness: 0.2
      });
      deskMesh = new THREE.Mesh(deskGeo, deskMat);
      deskMesh.position.set(0, 1.2, 0);
      deskMesh.castShadow = true;
      deskMesh.receiveShadow = true;
      scene.add(deskMesh);

      // Desk Legs (Steel frame)
      const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
      const legPositions = [
        [-1.7, 0.6, -0.8],
        [1.7, 0.6, -0.8],
        [-1.7, 0.6, 0.8],
        [1.7, 0.6, 0.8]
      ];

      legPositions.forEach(pos => {
        const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 16);
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(...pos);
        leg.castShadow = true;
        scene.add(leg);
      });

      // Mousepad / Desk Mat
      const padGeo = new THREE.BoxGeometry(2.4, 0.01, 0.9);
      const padMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.9 });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(0, 1.261, 0.1);
      pad.receiveShadow = true;
      scene.add(pad);
    };

    const createScreenTexture = (text) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 512, 256);

      if (text === 'code') {
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 22px monospace';
        ctx.fillText('// RajinKerja.id IDE Suite', 30, 45);

        ctx.fillStyle = '#f43f5e';
        ctx.font = '16px monospace';
        ctx.fillText('import { ref, computed } from "vue";', 30, 85);
        ctx.fillText('import { useStore } from "vuex";', 30, 110);

        ctx.fillStyle = '#10b981';
        ctx.fillText('const store = useStore();', 30, 145);
        ctx.fillText('const tasks = computed(() => store.getters.getTasks);', 30, 170);

        ctx.fillStyle = '#fbbf24';
        ctx.fillText('console.log("Productivity engine loaded!");', 30, 210);
      } else if (text === 'kanban') {
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(20, 20, 140, 216);
        ctx.fillRect(180, 20, 140, 216);
        ctx.fillRect(340, 20, 140, 216);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('TO-DO (3)', 35, 50);
        ctx.fillText('IN PROGRESS', 190, 50);
        ctx.fillText('DONE (8)', 355, 50);
      } else if (text === 'matrix') {
        ctx.fillStyle = '#052e16';
        ctx.fillRect(0, 0, 512, 256);
        ctx.fillStyle = '#22c55e';
        ctx.font = '14px monospace';
        for (let i = 0; i < 12; i++) {
          ctx.fillText('01101001 10110100 11010101 01010101 10101010', 20, 25 + i * 19);
        }
      } else {
        // Analytics Dashboard
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(20, 30, 220, 90);
        ctx.fillRect(260, 30, 230, 90);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('Total Completed: 85', 35, 80);
        ctx.fillText('Efficiency: 94%', 280, 80);

        // Draw green chart line
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(30, 210);
        ctx.lineTo(100, 170);
        ctx.lineTo(180, 190);
        ctx.lineTo(260, 140);
        ctx.lineTo(340, 160);
        ctx.lineTo(480, 130);
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const buildMonitors = () => {
      // Main Ultra-wide Curved Monitor Frame
      const frameGeo = new THREE.BoxGeometry(2.0, 1.0, 0.08);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.2, metalness: 0.8 });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.set(0, 1.85, -0.5);
      frame.castShadow = true;
      scene.add(frame);

      // Monitor Stand
      const standGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.6, 16);
      const stand = new THREE.Mesh(standGeo, frameMat);
      stand.position.set(0, 1.5, -0.52);
      stand.castShadow = true;
      scene.add(stand);

      const baseGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.03, 32);
      const base = new THREE.Mesh(baseGeo, frameMat);
      base.position.set(0, 1.265, -0.52);
      base.castShadow = true;
      scene.add(base);

      // Glowing Screen
      const screenGeo = new THREE.PlaneGeometry(1.92, 0.92);
      const initialTex = createScreenTexture(monitorDisplay.value);
      const screenMat = new THREE.MeshBasicMaterial({ map: initialTex });
      monitorScreenMesh = new THREE.Mesh(screenGeo, screenMat);
      monitorScreenMesh.position.set(0, 1.85, -0.458);
      scene.add(monitorScreenMesh);
    };

    const buildLaptop = () => {
      // Laptop Base
      const baseGeo = new THREE.BoxGeometry(0.8, 0.02, 0.55);
      const aluMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.9 });
      const laptopBase = new THREE.Mesh(baseGeo, aluMat);
      laptopBase.position.set(1.1, 1.27, 0.1);
      laptopBase.rotation.y = -0.3;
      laptopBase.castShadow = true;
      scene.add(laptopBase);

      // Laptop Screen Lid
      const lidGeo = new THREE.BoxGeometry(0.8, 0.52, 0.015);
      const laptopLid = new THREE.Mesh(lidGeo, aluMat);
      laptopLid.position.set(1.18, 1.5, -0.12);
      laptopLid.rotation.y = -0.3;
      laptopLid.rotation.x = -0.15;
      laptopLid.castShadow = true;
      scene.add(laptopLid);

      // Laptop Screen Display
      const lapScreenGeo = new THREE.PlaneGeometry(0.76, 0.48);
      const tex = createScreenTexture('dashboard');
      const lapMat = new THREE.MeshBasicMaterial({ map: tex });
      laptopScreenMesh = new THREE.Mesh(lapScreenGeo, lapMat);
      laptopScreenMesh.position.set(1.18, 1.5, -0.11);
      laptopScreenMesh.rotation.y = -0.3;
      laptopScreenMesh.rotation.x = -0.15;
      scene.add(laptopScreenMesh);
    };

    const buildPeripherals = () => {
      // Mechanical Keyboard
      const kbGeo = new THREE.BoxGeometry(0.9, 0.03, 0.32);
      const kbMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
      const keyboard = new THREE.Mesh(kbGeo, kbMat);
      keyboard.position.set(-0.15, 1.28, 0.15);
      keyboard.castShadow = true;
      scene.add(keyboard);

      // Mouse
      const mouseGeo = new THREE.BoxGeometry(0.14, 0.04, 0.22);
      const mouseMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.2, metalness: 0.5 });
      const wirelessMouse = new THREE.Mesh(mouseGeo, mouseMat);
      wirelessMouse.position.set(0.6, 1.28, 0.2);
      wirelessMouse.rotation.y = -0.1;
      wirelessMouse.castShadow = true;
      wirelessMouse.name = 'mouse';
      scene.add(wirelessMouse);
    };

    const buildLamp = () => {
      const lampMat = new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.8, roughness: 0.2 });

      // Base
      const bGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.03, 32);
      const bMesh = new THREE.Mesh(bGeo, lampMat);
      bMesh.position.set(-1.4, 1.27, -0.3);
      bMesh.castShadow = true;
      scene.add(bMesh);

      // Arm
      const aGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.2, 16);
      const aMesh = new THREE.Mesh(aGeo, lampMat);
      aMesh.position.set(-1.5, 1.85, -0.3);
      aMesh.rotation.z = -0.25;
      aMesh.castShadow = true;
      scene.add(aMesh);

      // Shade / Head
      const hGeo = new THREE.ConeGeometry(0.18, 0.3, 32);
      const hMesh = new THREE.Mesh(hGeo, lampMat);
      hMesh.position.set(-1.3, 2.35, -0.2);
      hMesh.rotation.z = Math.PI / 4;
      hMesh.castShadow = true;
      hMesh.name = 'lampHead';
      scene.add(hMesh);
    };

    const buildDecorations = () => {
      // Ceramic Coffee Mug
      const mugGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.24, 32);
      const mugMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
      coffeeMugMesh = new THREE.Mesh(mugGeo, mugMat);
      coffeeMugMesh.position.set(-0.85, 1.38, 0.25);
      coffeeMugMesh.castShadow = true;
      coffeeMugMesh.name = 'coffeeMug';
      scene.add(coffeeMugMesh);

      // Plant Pot + Succulent
      const potGeo = new THREE.CylinderGeometry(0.14, 0.1, 0.22, 32);
      const potMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
      const pot = new THREE.Mesh(potGeo, potMat);
      pot.position.set(-1.3, 1.37, 0.35);
      pot.castShadow = true;
      scene.add(pot);

      // Green Succulent Leaves (Group of spheres)
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
      for (let i = 0; i < 5; i++) {
        const leafGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        const angle = (i / 5) * Math.PI * 2;
        leaf.position.set(-1.3 + Math.cos(angle) * 0.06, 1.52, 0.35 + Math.sin(angle) * 0.06);
        leaf.castShadow = true;
        scene.add(leaf);
      }
    };

    const buildSteamParticles = () => {
      const particleCount = 20;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = -0.85 + (Math.random() - 0.5) * 0.06;
        positions[i * 3 + 1] = 1.5 + Math.random() * 0.3;
        positions[i * 3 + 2] = 0.25 + (Math.random() - 0.5) * 0.06;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.03,
        transparent: true,
        opacity: 0.4
      });

      steamParticles = new THREE.Points(geometry, material);
      scene.add(steamParticles);
    };

    const updateSteam = () => {
      if (!steamParticles) return;
      const positions = steamParticles.geometry.attributes.position.array;
      for (let i = 0; i < 20; i++) {
        positions[i * 3 + 1] += 0.002;
        if (positions[i * 3 + 1] > 1.85) {
          positions[i * 3 + 1] = 1.5;
        }
      }
      steamParticles.geometry.attributes.position.needsUpdate = true;
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Calculate FPS
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        fps.value = frameCount;
        frameCount = 0;
        lastTime = now;
      }

      // Smooth camera orbit damping
      if (controls) controls.update();

      // Animate RGB Light Color shift
      if (isRgbOn.value && rgbLight) {
        const time = Date.now() * 0.0015;
        rgbLight.color.setHSL((time * 0.2) % 1, 0.9, 0.5);
      }

      // Animate Steam particles
      updateSteam();

      // Render
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    const onWindowResize = () => {
      if (!canvasContainer.value || !renderer || !camera) return;
      const width = canvasContainer.value.clientWidth || 800;
      const height = 480;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const onCanvasClick = (event) => {
      if (!canvasContainer.value || !renderer || !camera) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.name === 'lampHead') {
          toggleLamp();
        } else if (obj.name === 'coffeeMug') {
          // Bounce coffee mug
          obj.position.y += 0.08;
          setTimeout(() => {
            if (obj) obj.position.y = 1.38;
          }, 200);
        }
      }
    };

    const toggleNightMode = () => {
      isNightMode.value = !isNightMode.value;
      if (isNightMode.value) {
        scene.background.setHex(0x020617);
        scene.fog.color.setHex(0x020617);
        ambientLight.intensity = 0.2;
        directionalLight.intensity = 0.3;
      } else {
        scene.background.setHex(0x0f172a);
        scene.fog.color.setHex(0x0f172a);
        ambientLight.intensity = 0.6;
        directionalLight.intensity = 1.2;
      }
    };

    const toggleLamp = () => {
      isLampOn.value = !isLampOn.value;
      lampLight.intensity = isLampOn.value ? 3.5 : 0;
    };

    const toggleRgb = () => {
      isRgbOn.value = !isRgbOn.value;
      rgbLight.intensity = isRgbOn.value ? 2.5 : 0;
    };

    const resetCamera = () => {
      if (camera && controls) {
        camera.position.set(0, 3.8, 6.2);
        controls.target.set(0, 1.2, 0);
        controls.update();
      }
    };

    const setTheme = (themeId) => {
      currentTheme.value = themeId;
      if (!deskMesh) return;

      if (themeId === 'wood') {
        deskMesh.material.color.setHex(0x78350f);
        wallMesh.material.color.setHex(0x1e1b4b);
        floorMesh.material.color.setHex(0x451a03);
      } else if (themeId === 'nordic') {
        deskMesh.material.color.setHex(0xf8fafc);
        wallMesh.material.color.setHex(0xcbd5e1);
        floorMesh.material.color.setHex(0x94a3b8);
      } else if (themeId === 'cyberpunk') {
        deskMesh.material.color.setHex(0x1e1b4b);
        wallMesh.material.color.setHex(0x311042);
        floorMesh.material.color.setHex(0x020617);
      } else {
        // Dark Studio
        deskMesh.material.color.setHex(0x1e293b);
        wallMesh.material.color.setHex(0x0f172a);
        floorMesh.material.color.setHex(0x1e293b);
      }
    };

    watch(monitorDisplay, (newVal) => {
      if (monitorScreenMesh) {
        monitorScreenMesh.material.map = createScreenTexture(newVal);
        monitorScreenMesh.material.map.needsUpdate = true;
      }
    });

    onMounted(() => {
      initThreeScene();
    });

    onUnmounted(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onWindowResize);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement) renderer.domElement.remove();
      }
    });

    return {
      canvasContainer,
      isNightMode,
      isLampOn,
      isRgbOn,
      currentTheme,
      monitorDisplay,
      fps,
      themes,
      toggleNightMode,
      toggleLamp,
      toggleRgb,
      resetCamera,
      setTheme
    };
  }
};
</script>

<style scoped>
.three-canvas-holder {
  width: 100%;
  height: 480px;
  background-color: #0f172a;
  cursor: grab;
}

.three-canvas-holder:active {
  cursor: grabbing;
}

.backdrop-blur {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.pointer-events-none {
  pointer-events: none;
}

.style-select {
  font-size: 12px;
  padding: 2px 24px 2px 8px;
}
</style>
