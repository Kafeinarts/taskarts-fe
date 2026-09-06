<template>
  <div class="q-pa-md insights-container" data-aos="fade-up">
    <!-- Header Card -->
    <q-card flat bordered class="bg-white rounded-borders q-pa-md q-mb-md shadow-1">
      <div class="row items-center justify-between q-col-gutter-md">
        <div class="col-12 col-md-7">
          <div class="row items-center q-gutter-x-sm q-mb-xs">
            <q-badge color="primary" text-color="white" rounded label="Analytics Engine v3.0" class="q-px-sm q-py-xs text-weight-bold" />
            <q-badge color="secondary" text-color="white" rounded label="D3.js & Three.js 3D" class="q-px-sm q-py-xs" />
            <q-badge color="grey-3" text-color="grey-9" rounded label="Material Design 3" class="q-px-sm q-py-xs" />
          </div>
          <div class="text-h5 text-weight-bold text-grey-9 q-mb-xs">📊 Productivity Insights & 3D Map</div>
          <div class="text-caption text-grey-7">
            Analisis kemajuan tugas 7 hari terakhir, tren mood, dan navigasi Peta 3D Produktivitas interaktif.
          </div>
        </div>

        <div class="col-12 col-md-5 text-right">
          <div class="row justify-end items-center q-gutter-sm">
            <!-- Mode Switcher: 2D vs 3D -->
            <q-btn-toggle
              v-model="viewMode"
              no-caps
              rounded
              unelevated
              toggle-color="primary"
              color="grey-2"
              text-color="grey-9"
              :options="[
                { label: 'Grafik 2D Biasa', value: '2d', icon: 'bar_chart' },
                { label: 'Peta 3D Interaktif', value: '3d', icon: 'map' }
              ]"
            />
            <q-btn
              outline
              color="grey-8"
              icon="arrow_back"
              label="Dashboard"
              to="/"
              no-caps
              class="rounded-borders"
            />
          </div>
        </div>
      </div>
    </q-card>

    <!-- Summary KPI Cards (Material Design 3) -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-6 col-md-3">
        <q-card flat bordered class="bg-white rounded-borders q-pa-md h-100 shadow-1">
          <div class="row items-center justify-between q-mb-xs">
            <span class="text-caption text-weight-bold text-grey-7">Completion Rate 7 Hari</span>
            <q-avatar size="36px" color="blue-1" text-color="primary" icon="done_all" font-size="20px" />
          </div>
          <div class="text-h4 text-weight-bolder text-primary">{{ weeklyCompletionPercent }}%</div>
          <div class="text-caption text-grey-6 q-mt-xs">
            {{ totalCompleted7Days }} dari {{ totalTasks7Days }} tugas selesai
          </div>
        </q-card>
      </div>

      <div class="col-6 col-md-3">
        <q-card flat bordered class="bg-white rounded-borders q-pa-md h-100 shadow-1">
          <div class="row items-center justify-between q-mb-xs">
            <span class="text-caption text-weight-bold text-grey-7">Rata-Rata Mood</span>
            <q-avatar size="36px" color="amber-1" text-color="amber-9" icon="sentiment_satisfied_alt" font-size="20px" />
          </div>
          <div class="text-h4 text-weight-bolder text-grey-9">{{ averageMoodScore }} <span class="text-subtitle2 text-grey-6">/ 5.0</span></div>
          <div class="text-caption text-grey-6 q-mt-xs">{{ moodStatusLabel }}</div>
        </q-card>
      </div>

      <div class="col-6 col-md-3">
        <q-card flat bordered class="bg-white rounded-borders q-pa-md h-100 shadow-1">
          <div class="row items-center justify-between q-mb-xs">
            <span class="text-caption text-weight-bold text-grey-7">Hari Paling Produktif</span>
            <q-avatar size="36px" color="green-1" text-color="positive" icon="emoji_events" font-size="20px" />
          </div>
          <div class="text-h5 text-weight-bolder text-positive ellipsis">{{ peakProductivityDay }}</div>
          <div class="text-caption text-grey-6 q-mt-xs">Penyelesaian tugas terbanyak</div>
        </q-card>
      </div>

      <div class="col-6 col-md-3">
        <q-card flat bordered class="bg-white rounded-borders q-pa-md h-100 shadow-1">
          <div class="row items-center justify-between q-mb-xs">
            <span class="text-caption text-weight-bold text-grey-7">Total Log Tercatat</span>
            <q-avatar size="36px" color="cyan-1" text-color="secondary" icon="history" font-size="20px" />
          </div>
          <div class="text-h4 text-weight-bolder text-grey-9">{{ totalLogsCount }}</div>
          <div class="text-caption text-grey-6 q-mt-xs">Tugas & catatan mood aktif</div>
        </q-card>
      </div>
    </div>

    <!-- MODE 1: 3D INTERACTIVE MAP VIEW -->
    <div v-show="viewMode === '3d'">
      <q-card flat bordered class="bg-white rounded-borders shadow-1 overflow-hidden q-mb-md">
        <!-- 3D Toolbar & Instructions -->
        <div class="q-pa-sm bg-grey-1 row items-center justify-between border-bottom">
          <div class="row items-center q-gutter-x-sm">
            <q-chip dense color="primary" text-color="white" icon="public" class="text-weight-bold">
              3D Productivity City Map
            </q-chip>
            <span class="text-caption text-grey-7">
              💡 Geser (Drag mouse) untuk putar/orbit, Klik kanan/2 jari untuk geser map, Scroll untuk zoom. Klik gedung untuk lihat detail data.
            </span>
          </div>
          <div class="row items-center q-gutter-xs">
            <q-btn flat round dense icon="zoom_in" color="grey-8" @click="zoomCamera(-15)" title="Zoom In" />
            <q-btn flat round dense icon="zoom_out" color="grey-8" @click="zoomCamera(15)" title="Zoom Out" />
            <q-btn flat round dense icon="center_focus_strong" color="grey-8" @click="resetCamera" title="Reset Pandangan" />
            <q-btn
              flat
              dense
              no-caps
              size="sm"
              :color="isAutoRotating ? 'primary' : 'grey-7'"
              :label="isAutoRotating ? 'Auto-Rotate ON' : 'Auto-Rotate OFF'"
              icon="sync"
              @click="toggleAutoRotate"
            />
          </div>
        </div>

        <div class="row no-wrap relative-position" style="min-height: 540px;">
          <!-- Three.js Canvas Container -->
          <div ref="threeCanvasContainer" class="col three-container relative-position"></div>

          <!-- Floating 3D Hover Tooltip HUD -->
          <transition name="fade">
            <div
              v-if="hovered3DNode"
              class="hover-3d-tooltip position-absolute pointer-events-none p-2.5 rounded-3 bg-dark text-white shadow-lg border border-primary border-opacity-50"
              :style="{ top: hoverTooltipPos.y + 'px', left: hoverTooltipPos.x + 'px', transform: 'translate(-50%, -125%)', zIndex: 25 }"
            >
              <div class="d-flex align-items-center gap-1.5 mb-1">
                <i :class="hovered3DNode.type === 'day' ? 'bi bi-calendar3 text-info' : 'bi bi-folder-fill text-warning'"></i>
                <strong class="small">{{ hovered3DNode.title }}</strong>
                <span class="badge bg-primary text-white ms-auto" style="font-size: 10px;">{{ hovered3DNode.rate }}% Selesai</span>
              </div>
              <div class="d-flex justify-content-between gap-3 text-white-50" style="font-size: 11px;">
                <span>Tugas: <strong class="text-white">{{ hovered3DNode.completed }}/{{ hovered3DNode.total }}</strong></span>
                <span v-if="hovered3DNode.moodScore">Mood: {{ hovered3DNode.moodEmoji }} {{ hovered3DNode.moodScore }}</span>
              </div>
            </div>
          </transition>

          <!-- Floating 3D Detail Sidebar / HUD Card -->
          <transition name="slide-fade">
            <div
              v-if="selected3DNode"
              class="selected-node-hud q-pa-md bg-white shadow-3 rounded-borders border"
              style="width: 340px; position: absolute; top: 16px; right: 16px; z-index: 20; max-height: 500px; overflow-y: auto;"
            >
              <div class="row items-center justify-between border-bottom q-pb-xs q-mb-sm">
                <div class="row items-center q-gutter-x-xs">
                  <q-icon :name="selected3DNode.type === 'day' ? 'calendar_today' : 'folder'" color="primary" size="20px" />
                  <span class="text-subtitle2 text-weight-bold text-grey-9">{{ selected3DNode.title }}</span>
                </div>
                <q-btn flat round dense icon="close" size="sm" @click="selected3DNode = null" />
              </div>

              <div class="q-mb-sm">
                <div class="row justify-between text-caption text-grey-7 q-mb-xs">
                  <span>Pencapaian:</span>
                  <span class="text-weight-bold text-primary">{{ selected3DNode.rate }}% Selesai</span>
                </div>
                <q-linear-progress
                  :value="selected3DNode.rate / 100"
                  rounded
                  size="8px"
                  :color="selected3DNode.rate >= 80 ? 'positive' : selected3DNode.rate >= 50 ? 'primary' : 'warning'"
                  track-color="grey-3"
                />
              </div>

              <div class="row q-col-gutter-xs q-mb-sm text-center">
                <div class="col-4">
                  <div class="bg-grey-1 q-pa-xs rounded-borders">
                    <div class="text-caption text-grey-6">Total</div>
                    <div class="text-weight-bold text-grey-9">{{ selected3DNode.total }}</div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="bg-green-1 q-pa-xs rounded-borders">
                    <div class="text-caption text-positive">Selesai</div>
                    <div class="text-weight-bold text-positive">{{ selected3DNode.completed }}</div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="bg-amber-1 q-pa-xs rounded-borders">
                    <div class="text-caption text-warning">Pending</div>
                    <div class="text-weight-bold text-warning">{{ selected3DNode.pending }}</div>
                  </div>
                </div>
              </div>

              <div v-if="selected3DNode.moodScore" class="bg-blue-1 q-pa-xs rounded-borders q-mb-sm row items-center justify-between text-caption">
                <span class="text-grey-8">Mood Harian:</span>
                <span class="text-weight-bold text-primary">{{ selected3DNode.moodScore }} / 5.0 {{ selected3DNode.moodEmoji }}</span>
              </div>

              <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Daftar Tugas Terkait:</div>
              <q-list v-if="selected3DNode.tasks && selected3DNode.tasks.length > 0" separator dense>
                <q-item v-for="t in selected3DNode.tasks" :key="t.id" class="q-px-none">
                  <q-item-section side>
                    <q-icon :name="t.done ? 'check_circle' : 'radio_button_unchecked'" :color="t.done ? 'positive' : 'grey-5'" size="16px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label :class="{ 'text-strike text-grey-6': t.done, 'text-weight-medium': !t.done }">
                      {{ t.name }}
                    </q-item-label>
                    <q-item-label caption v-if="t.projectTag">🏷️ {{ t.projectTag }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <div v-else class="text-caption text-grey-6 text-italic q-pa-xs">
                Tidak ada tugas spesifik yang tercatat.
              </div>
            </div>
          </transition>

          <!-- 3D Legend Bar -->
          <div class="legend-bar q-pa-xs bg-white rounded-borders shadow-1 border" style="position: absolute; bottom: 16px; left: 16px; z-index: 10;">
            <div class="row items-center q-gutter-x-sm text-caption">
              <span class="text-weight-bold text-grey-8">Legenda Tinggi Gedung:</span>
              <span class="row items-center"><span class="legend-color bg-positive q-mr-xs"></span> > 80% Selesai</span>
              <span class="row items-center"><span class="legend-color bg-primary q-mr-xs"></span> 50-80% Selesai</span>
              <span class="row items-center"><span class="legend-color bg-warning q-mr-xs"></span> &lt; 50% Selesai</span>
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <!-- MODE 2: 2D CHARTS SECTION (D3.js) -->
    <div v-show="viewMode === '2d'" class="row q-col-gutter-md">
      <!-- Chart 1: Task Completion Rates Bar Chart (D3.js) -->
      <div class="col-12 col-lg-6">
        <q-card flat bordered class="bg-white rounded-borders q-pa-md h-100 shadow-1">
          <div class="row items-center justify-between border-bottom q-pb-sm q-mb-md">
            <div>
              <div class="text-subtitle1 text-weight-bold text-grey-9 row items-center">
                <q-icon name="bar_chart" color="primary" class="q-mr-xs" /> Tingkat Penyelesaian Tugas (7 Hari)
              </div>
              <div class="text-caption text-grey-6">D3.js Bar Chart perbandingan task selesai vs total</div>
            </div>
            <q-badge color="blue-1" text-color="primary" rounded label="D3.js Engine" class="q-px-sm q-py-xs text-weight-bold" />
          </div>

          <div class="row justify-center items-center q-py-sm min-h-300">
            <div ref="taskChartContainer" class="full-width text-center"></div>
          </div>
        </q-card>
      </div>

      <!-- Chart 2: Mood Tracker Trends Curve (D3.js) -->
      <div class="col-12 col-lg-6">
        <q-card flat bordered class="bg-white rounded-borders q-pa-md h-100 shadow-1">
          <div class="row items-center justify-between border-bottom q-pb-sm q-mb-md">
            <div>
              <div class="text-subtitle1 text-weight-bold text-grey-9 row items-center">
                <q-icon name="show_chart" color="negative" class="q-mr-xs" /> Tren Mood & Kebugaran Mental
              </div>
              <div class="text-caption text-grey-6">D3.js Monotone Curve fluktuasi emosional</div>
            </div>
            <q-badge color="red-1" text-color="negative" rounded label="D3.js Monotone" class="q-px-sm q-py-xs text-weight-bold" />
          </div>

          <div class="row justify-center items-center q-py-sm min-h-300">
            <div ref="moodChartContainer" class="full-width text-center"></div>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useStore } from 'vuex';
import * as d3 from 'd3';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
  name: 'ProductivityInsightsView',
  setup() {
    const store = useStore();
    const viewMode = ref('3d'); // Default to 3D mode as requested by user

    const taskChartContainer = ref(null);
    const moodChartContainer = ref(null);
    const threeCanvasContainer = ref(null);

    const tasks = computed(() => store.getters.getTasks || []);
    const moodLogs = computed(() => store.getters.getMoodLogs || []);

    // Last 7 days helper
    const getLast7Days = () => {
      const days = [];
      const daysName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const isoDate = d.toISOString().split('T')[0];
        const dayLabel = `${daysName[d.getDay()]} (${d.getDate()}/${d.getMonth() + 1})`;
        days.push({ isoDate, dayLabel, shortDay: daysName[d.getDay()], rawDate: d });
      }
      return days;
    };

    const days7 = getLast7Days();

    // Data 1: Task Completion stats for last 7 days
    const taskStatsData = computed(() => {
      return days7.map(day => {
        const dayTasks = tasks.value.filter(t => t.deadline === day.isoDate || t.createdAt?.startsWith(day.isoDate));
        const total = dayTasks.length || (tasks.value.length > 0 ? 0 : 3);
        const completed = dayTasks.filter(t => t.done).length || (total > 0 && tasks.value.length === 0 ? 2 : 0);
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
          isoDate: day.isoDate,
          dayLabel: day.dayLabel,
          shortDay: day.shortDay,
          total,
          completed,
          rate,
          tasks: dayTasks
        };
      });
    });

    // Data 2: Mood stats for last 7 days
    const moodStatsData = computed(() => {
      const moodMap = { 'Sangat Baik': 5, 'Baik': 4, 'Netral': 3, 'Buruk': 2, 'Sangat Buruk': 1 };
      const moodEmojiMap = { 5: '😄', 4: '😊', 3: '😐', 2: '🙁', 1: '😫' };
      return days7.map(day => {
        const logsForDay = moodLogs.value.filter(m => m.date === day.isoDate || m.timestamp?.startsWith(day.isoDate));
        let avgScore = 4.0;
        let emoji = '😊';
        if (logsForDay.length > 0) {
          const sum = logsForDay.reduce((acc, curr) => acc + (moodMap[curr.mood] || 3), 0);
          avgScore = Number((sum / logsForDay.length).toFixed(1));
          emoji = moodEmojiMap[Math.round(avgScore)] || '😊';
        }
        return {
          dayLabel: day.dayLabel,
          score: avgScore,
          emoji
        };
      });
    });

    const totalTasks7Days = computed(() => taskStatsData.value.reduce((a, b) => a + b.total, 0));
    const totalCompleted7Days = computed(() => taskStatsData.value.reduce((a, b) => a + b.completed, 0));
    const weeklyCompletionPercent = computed(() => {
      return totalTasks7Days.value > 0 ? Math.round((totalCompleted7Days.value / totalTasks7Days.value) * 100) : 85;
    });

    const averageMoodScore = computed(() => {
      const sum = moodStatsData.value.reduce((a, b) => a + b.score, 0);
      return (sum / moodStatsData.value.length).toFixed(1);
    });

    const moodStatusLabel = computed(() => {
      const score = Number(averageMoodScore.value);
      if (score >= 4.2) return '😄 Sangat Positif';
      if (score >= 3.5) return '😊 Stabil & Produktif';
      if (score >= 2.5) return '😐 Cukup / Normal';
      return '🙁 Perlu Rehat';
    });

    const peakProductivityDay = computed(() => {
      let maxComp = -1;
      let maxDay = 'Senin';
      taskStatsData.value.forEach(d => {
        if (d.completed > maxComp) {
          maxComp = d.completed;
          maxDay = d.dayLabel;
        }
      });
      return maxDay;
    });

    const totalLogsCount = computed(() => tasks.value.length + moodLogs.value.length);

    // =========================================================================
    // THREE.JS 3D INTERACTIVE PRODUCTIVITY MAP
    // =========================================================================
    let scene, camera, renderer, controls, animationFrameId;
    const interactiveMeshes = [];
    const isAutoRotating = ref(false);
    const selected3DNode = ref(null);
    const hovered3DNode = ref(null);
    const hoverTooltipPos = ref({ x: 0, y: 0 });
    let currentHoveredMesh = null;

    const initThreeScene = () => {
      if (!threeCanvasContainer.value) return;

      const container = threeCanvasContainer.value;
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 540;

      // 1. Scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf8fafc); // Light calm Material background

      // 2. Camera
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(40, 50, 60);

      // 3. Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // 4. Controls (OrbitControls for pan, zoom, rotate like google map)
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2.05; // Don't allow going below ground
      controls.minDistance = 15;
      controls.maxDistance = 150;
      controls.target.set(0, 0, 0);

      // 5. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
      dirLight.position.set(30, 60, 40);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      scene.add(dirLight);

      // 6. Ground Map Plane
      const groundGeo = new THREE.PlaneGeometry(120, 120);
      const groundMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // 7. Grid Map Lines
      const gridHelper = new THREE.GridHelper(120, 24, 0xcbd5e1, 0xe2e8f0);
      gridHelper.position.y = 0.05;
      scene.add(gridHelper);

      // 8. Build 3D City Buildings representing Days & Folders
      build3DCity();

      // 9. Raycasting for hover & click interaction
      setupRaycasting(container);

      // 10. Animation Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (isAutoRotating.value && controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 1.0;
        } else if (controls) {
          controls.autoRotate = false;
        }
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Window resize listener
      window.addEventListener('resize', onWindowResize);
    };

    const onWindowResize = () => {
      if (!threeCanvasContainer.value || !renderer || !camera) return;
      const width = threeCanvasContainer.value.clientWidth;
      const height = threeCanvasContainer.value.clientHeight || 540;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const build3DCity = () => {
      interactiveMeshes.length = 0;

      // DISTRICT 1: 7-Day Timeline Towers (Main Boulevard)
      const dayData = taskStatsData.value;
      const moodData = moodStatsData.value;

      dayData.forEach((day, index) => {
        const xPos = (index - 3) * 10;
        const zPos = -10;

        const compRate = day.rate;
        // Building height proportional to total tasks or completed
        const height = Math.max(4, (day.completed + 1) * 3);

        let buildingColor = 0x2563eb; // primary blue
        if (compRate >= 80) buildingColor = 0x10b981; // green
        else if (compRate < 50) buildingColor = 0xf59e0b; // amber

        // Main building tower
        const geo = new THREE.BoxGeometry(6, height, 6);
        const mat = new THREE.MeshStandardMaterial({
          color: buildingColor,
          roughness: 0.3,
          metalness: 0.2
        });
        const building = new THREE.Mesh(geo, mat);
        building.position.set(xPos, height / 2, zPos);
        building.castShadow = true;
        building.receiveShadow = true;

        // Rooftop glowing beacon
        const beaconGeo = new THREE.CylinderGeometry(1.5, 2.5, 1.2, 16);
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.set(0, height / 2 + 0.6, 0);
        building.add(beacon);

        // Attach metadata for raycaster
        building.userData = {
          type: 'day',
          title: day.dayLabel,
          rate: compRate,
          total: day.total,
          completed: day.completed,
          pending: Math.max(0, day.total - day.completed),
          moodScore: moodData[index]?.score || 4.0,
          moodEmoji: moodData[index]?.emoji || '😊',
          tasks: day.tasks || []
        };

        scene.add(building);
        interactiveMeshes.push(building);
      });

      // DISTRICT 2: Project Folder Hubs (South District)
      const folders = ['Work', 'Client Project', 'Marketing', 'Development'];
      folders.forEach((folder, idx) => {
        const xPos = (idx - 1.5) * 14;
        const zPos = 14;

        const folderTasks = tasks.value.filter(t => (t.category || 'Work') === folder);
        const completedCount = folderTasks.filter(t => t.done).length;
        const rate = folderTasks.length > 0 ? Math.round((completedCount / folderTasks.length) * 100) : 75;
        const height = Math.max(5, (folderTasks.length + 1) * 2.5);

        const geo = new THREE.CylinderGeometry(4, 4, height, 16);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x6366f1, // Indigo
          roughness: 0.4
        });
        const tower = new THREE.Mesh(geo, mat);
        tower.position.set(xPos, height / 2, zPos);
        tower.castShadow = true;
        tower.receiveShadow = true;

        tower.userData = {
          type: 'folder',
          title: `📁 Folder: ${folder}`,
          rate,
          total: folderTasks.length || 3,
          completed: completedCount,
          pending: Math.max(0, (folderTasks.length || 3) - completedCount),
          tasks: folderTasks
        };

        scene.add(tower);
        interactiveMeshes.push(tower);
      });

      // Default select the latest day
      if (interactiveMeshes.length > 0) {
        selected3DNode.value = interactiveMeshes[interactiveMeshes.length - 1].userData;
      }
    };

    const setupRaycasting = (container) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const onPointerMove = (event) => {
        if (!renderer?.domElement) return;
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        hoverTooltipPos.value = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshes, false);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (currentHoveredMesh !== hit) {
            if (currentHoveredMesh?.material?.emissive) {
              currentHoveredMesh.material.emissive.setHex(0x000000);
            }
            currentHoveredMesh = hit;
            if (currentHoveredMesh?.material?.emissive) {
              currentHoveredMesh.material.emissive.setHex(0x0284c7);
            }
          }
          hovered3DNode.value = hit.userData;
          renderer.domElement.style.cursor = 'pointer';
        } else {
          if (currentHoveredMesh?.material?.emissive) {
            currentHoveredMesh.material.emissive.setHex(0x000000);
          }
          currentHoveredMesh = null;
          hovered3DNode.value = null;
          renderer.domElement.style.cursor = 'default';
        }
      };

      const onPointerLeave = () => {
        if (currentHoveredMesh?.material?.emissive) {
          currentHoveredMesh.material.emissive.setHex(0x000000);
        }
        currentHoveredMesh = null;
        hovered3DNode.value = null;
        if (renderer?.domElement) {
          renderer.domElement.style.cursor = 'default';
        }
      };

      const onClickOrTap = (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshes, false);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          selected3DNode.value = hit.userData;

          // Camera gentle focus towards selected node
          if (controls) {
            controls.target.set(hit.position.x, hit.position.y / 2, hit.position.z);
          }
        }
      };

      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerleave', onPointerLeave);
      container.addEventListener('click', onClickOrTap);
    };

    const resetCamera = () => {
      if (!camera || !controls) return;
      camera.position.set(40, 50, 60);
      controls.target.set(0, 0, 0);
      controls.update();
    };

    const zoomCamera = (delta) => {
      if (!camera) return;
      const factor = delta > 0 ? 1.15 : 0.85;
      camera.position.multiplyScalar(factor);
    };

    const toggleAutoRotate = () => {
      isAutoRotating.value = !isAutoRotating.value;
    };

    // =========================================================================
    // D3.js Render Function 1: Task Completion Bar Chart (2D Mode)
    // =========================================================================
    const renderTaskD3Chart = () => {
      if (!taskChartContainer.value) return;
      d3.select(taskChartContainer.value).selectAll('*').remove();

      const data = taskStatsData.value;
      const margin = { top: 20, right: 20, bottom: 40, left: 40 };
      const width = 480 - margin.left - margin.right;
      const height = 260 - margin.top - margin.bottom;

      const svg = d3
        .select(taskChartContainer.value)
        .append('svg')
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr('width', '100%')
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleBand()
        .domain(data.map(d => d.dayLabel))
        .range([0, width])
        .padding(0.3);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.total, 5))])
        .nice()
        .range([height, 0]);

      svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(''))
        .attr('stroke-opacity', 0.1);

      svg.selectAll('.bar-completed')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar-completed')
        .attr('x', d => x(d.dayLabel))
        .attr('width', x.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('rx', 6)
        .attr('fill', '#2563eb')
        .transition()
        .duration(800)
        .attr('y', d => y(d.completed))
        .attr('height', d => height - y(d.completed));

      svg.selectAll('.label-text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', d => x(d.dayLabel) + x.bandwidth() / 2)
        .attr('y', d => y(d.completed) - 6)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('fill', '#1e293b')
        .text(d => `${d.completed}/${d.total}`);

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('font-size', '10px')
        .style('font-weight', '600');

      svg.append('g').call(d3.axisLeft(y).ticks(5));
    };

    // =========================================================================
    // D3.js Render Function 2: Mood Trend Monotone Curve (2D Mode)
    // =========================================================================
    const renderMoodD3Chart = () => {
      if (!moodChartContainer.value) return;
      d3.select(moodChartContainer.value).selectAll('*').remove();

      const data = moodStatsData.value;
      const margin = { top: 20, right: 20, bottom: 40, left: 40 };
      const width = 480 - margin.left - margin.right;
      const height = 260 - margin.top - margin.bottom;

      const svg = d3
        .select(moodChartContainer.value)
        .append('svg')
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr('width', '100%')
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3
        .scalePoint()
        .domain(data.map(d => d.dayLabel))
        .range([0, width])
        .padding(0.2);

      const y = d3
        .scaleLinear()
        .domain([1, 5])
        .range([height, 0]);

      const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'mood-gradient-quasar')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '0%').attr('y2', '100%');

      gradient.append('stop').attr('offset', '0%').attr('stop-color', '#ef4444').attr('stop-opacity', 0.4);
      gradient.append('stop').attr('offset', '100%').attr('stop-color', '#ef4444').attr('stop-opacity', 0.0);

      const area = d3.area()
        .x(d => x(d.dayLabel))
        .y0(height)
        .y1(d => y(d.score))
        .curve(d3.curveMonotoneX);

      svg.append('path')
        .datum(data)
        .attr('fill', 'url(#mood-gradient-quasar)')
        .attr('d', area);

      const line = d3.line()
        .x(d => x(d.dayLabel))
        .y(d => y(d.score))
        .curve(d3.curveMonotoneX);

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 3)
        .attr('d', line);

      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.dayLabel))
        .attr('cy', d => y(d.score))
        .attr('r', 5)
        .attr('fill', '#ffffff')
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2.5);

      svg.selectAll('.score-text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', d => x(d.dayLabel))
        .attr('y', d => y(d.score) - 10)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .style('fill', '#ef4444')
        .text(d => d.score);

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('font-size', '10px')
        .style('font-weight', '600');

      svg.append('g').call(d3.axisLeft(y).ticks(5));
    };

    onMounted(() => {
      initThreeScene();
      renderTaskD3Chart();
      renderMoodD3Chart();
    });

    onBeforeUnmount(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onWindowResize);
    });

    watch(viewMode, (newMode) => {
      if (newMode === '2d') {
        setTimeout(() => {
          renderTaskD3Chart();
          renderMoodD3Chart();
        }, 100);
      } else if (newMode === '3d') {
        setTimeout(() => {
          onWindowResize();
        }, 100);
      }
    });

    return {
      viewMode,
      taskChartContainer,
      moodChartContainer,
      threeCanvasContainer,
      weeklyCompletionPercent,
      totalCompleted7Days,
      totalTasks7Days,
      averageMoodScore,
      moodStatusLabel,
      peakProductivityDay,
      totalLogsCount,
      selected3DNode,
      hovered3DNode,
      hoverTooltipPos,
      isAutoRotating,
      toggleAutoRotate,
      resetCamera,
      zoomCamera
    };
  }
};
</script>

<style scoped>
.hover-3d-tooltip {
  pointer-events: none;
  min-width: 220px;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(56, 189, 248, 0.4);
  transition: opacity 0.15s ease;
}

.insights-container {
  max-width: 1400px;
  margin: 0 auto;
}

.border-bottom {
  border-bottom: 1px solid #e2e8f0;
}

.three-container {
  width: 100%;
  height: 540px;
  background: #f8fafc;
  cursor: grab;
}

.three-container:active {
  cursor: grabbing;
}

.legend-color {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.min-h-300 {
  min-height: 280px;
}
</style>
