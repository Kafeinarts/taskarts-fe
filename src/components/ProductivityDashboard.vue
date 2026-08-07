<template>
  <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4" id="productivityDashboard">
    <!-- Header -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 border-bottom pb-3">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-1.5 rounded-pill" style="font-size: 11px;">
            <i class="bi bi-graph-up-arrow me-1"></i> 30-Day Analytics
          </span>
        </div>
        <h4 class="fw-bold text-dark mb-0">📊 Performa & Analisis Produktivitas (30 Hari Terakhir)</h4>
        <p class="small text-muted mb-0">Visualisasi real-time tren penyelesaian tugas harian dan statistik aktivitas kerja.</p>
      </div>

      <div class="d-flex align-items-center gap-2">
        <button
          class="btn btn-sm rounded-pill px-3 py-1.5 fw-semibold"
          :class="activeMetric === 'all' ? 'btn-dark' : 'btn-outline-secondary'"
          @click="activeMetric = 'all'"
        >
          Semua Tren
        </button>
        <button
          class="btn btn-sm rounded-pill px-3 py-1.5 fw-semibold"
          :class="activeMetric === 'tasks' ? 'btn-primary' : 'btn-outline-primary'"
          @click="activeMetric = 'tasks'"
        >
          <i class="bi bi-check2-circle me-1"></i> Tugas Selesai
        </button>
      </div>
    </div>

    <!-- Summary Metrics Bar -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <div class="p-3 bg-light rounded-3 border">
          <span class="small text-muted fw-semibold d-block mb-1">Total Tugas Selesai (30 Hari)</span>
          <h3 class="fw-extrabold text-primary mb-0">{{ totalCompleted30Days }}</h3>
          <small class="text-success fw-bold" style="font-size: 11px;">
            <i class="bi bi-arrow-up-right me-1"></i>Avg {{ dailyTaskAvg }} / hari
          </small>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="p-3 bg-light rounded-3 border">
          <span class="small text-muted fw-semibold d-block mb-1">Rata-rata Penyelesaian</span>
          <h3 class="fw-extrabold text-success mb-0">{{ dailyTaskAvg }}</h3>
          <small class="text-muted fw-semibold" style="font-size: 11px;">
            Tugas / Hari
          </small>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="p-3 bg-light rounded-3 border">
          <span class="small text-muted fw-semibold d-block mb-1">Hari Paling Produktif</span>
          <h4 class="fw-bold text-dark mb-0">{{ mostProductiveDayName }}</h4>
          <small class="text-muted" style="font-size: 11px;">
            {{ maxDayVolume }} aktivitas diselesaikan
          </small>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="p-3 bg-light rounded-3 border">
          <span class="small text-muted fw-semibold d-block mb-1">Tingkat Efisiensi Kerja</span>
          <h3 class="fw-extrabold text-warning mb-0">{{ efficiencyRate }}%</h3>
          <small class="text-dark fw-bold" style="font-size: 11px;">
            Target Konsistensi Work Suite
          </small>
        </div>
      </div>
    </div>

    <!-- Main Responsive Interactive SVG Productivity Chart -->
    <div class="chart-wrapper position-relative p-2 bg-light rounded-4 border overflow-hidden">
      <!-- Chart Legend Header -->
      <div class="d-flex justify-content-between align-items-center mb-2 px-2 pt-2">
        <span class="small fw-bold text-dark"><i class="bi bi-bar-chart-line-fill me-1 text-primary"></i> Grafik Performa 30 Hari</span>
        <div class="d-flex align-items-center gap-3 small">
          <span class="d-flex align-items-center gap-1 fw-semibold text-primary">
            <span class="d-inline-block rounded-pill" style="width: 12px; height: 12px; background-color: #2563eb;"></span>
            Tugas Selesai
          </span>
        </div>
      </div>

      <!-- SVG Area & Bar Chart Rendering -->
      <div class="svg-container w-100 overflow-x-auto py-2">
        <svg viewBox="0 0 900 240" class="w-100" style="min-width: 650px;" preserveAspectRatio="none">
          <defs>
            <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2563eb" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0" />
            </linearGradient>
            <linearGradient id="habitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <!-- Grid Lines -->
          <line v-for="i in 4" :key="'g' + i" x1="40" :y1="40 + (i - 1) * 45" x2="880" :y2="40 + (i - 1) * 45" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3" />

          <!-- Y-Axis Labels -->
          <text x="30" y="45" font-size="10" fill="#64748b" text-anchor="end">{{ maxScale }}</text>
          <text x="30" y="90" font-size="10" fill="#64748b" text-anchor="end">{{ Math.round(maxScale * 0.75) }}</text>
          <text x="30" y="135" font-size="10" fill="#64748b" text-anchor="end">{{ Math.round(maxScale * 0.5) }}</text>
          <text x="30" y="180" font-size="10" fill="#64748b" text-anchor="end">{{ Math.round(maxScale * 0.25) }}</text>

          <!-- Task Area Path -->
          <path
            v-if="activeMetric === 'all' || activeMetric === 'tasks'"
            :d="taskAreaD"
            fill="url(#taskGrad)"
          />
          <path
            v-if="activeMetric === 'all' || activeMetric === 'tasks'"
            :d="taskLineD"
            fill="none"
            stroke="#2563eb"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Habit Area Path -->
          <path
            v-if="activeMetric === 'all' || activeMetric === 'habits'"
            :d="habitAreaD"
            fill="url(#habitGrad)"
          />
          <path
            v-if="activeMetric === 'all' || activeMetric === 'habits'"
            :d="habitLineD"
            fill="none"
            stroke="#10b981"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Data Points and Interactive Hover Columns -->
          <g v-for="(day, idx) in chartData" :key="idx">
            <!-- X Axis Day Label -->
            <text
              :x="getX(idx)"
              y="215"
              font-size="9"
              fill="#64748b"
              text-anchor="middle"
              :font-weight="hoveredIdx === idx ? 'bold' : 'normal'"
            >
              {{ day.shortDate }}
            </text>

            <!-- Task Point Circle -->
            <circle
              v-if="activeMetric === 'all' || activeMetric === 'tasks'"
              :cx="getX(idx)"
              :cy="getY(day.completedTasks)"
              r="4"
              fill="#2563eb"
              stroke="#ffffff"
              stroke-width="2"
            />

            <!-- Habit Point Circle -->
            <circle
              v-if="activeMetric === 'all' || activeMetric === 'habits'"
              :cx="getX(idx)"
              :cy="getY(day.habitCheckins)"
              r="4"
              fill="#10b981"
              stroke="#ffffff"
              stroke-width="2"
            />

            <!-- Hover Bar Trigger Overlay -->
            <rect
              :x="getX(idx) - 12"
              y="20"
              width="24"
              height="180"
              fill="transparent"
              class="cursor-pointer"
              @mouseenter="hoveredIdx = idx"
              @mouseleave="hoveredIdx = null"
            />

            <!-- Active Hover Highlight Line -->
            <line
              v-if="hoveredIdx === idx"
              :x1="getX(idx)"
              y1="20"
              :x2="getX(idx)"
              y2="195"
              stroke="#0f172a"
              stroke-width="1.5"
              stroke-dasharray="2 2"
            />
          </g>
        </svg>

        <!-- Tooltip Box on Hover -->
        <div
          v-if="hoveredIdx !== null && chartData[hoveredIdx]"
          class="position-absolute bg-dark text-white rounded-3 p-2 shadow-lg small pointer-events-none"
          :style="tooltipStyle"
        >
          <div class="fw-bold text-warning mb-1 border-bottom border-secondary pb-1">
            {{ chartData[hoveredIdx].fullDate }}
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-primary px-2 py-0.5">Tugas Selesai</span>
            <strong class="text-white">{{ chartData[hoveredIdx].completedTasks }}</strong>
          </div>
          <div class="d-flex align-items-center gap-2 mt-1">
            <span class="badge bg-success px-2 py-0.5">Habit Check-in</span>
            <strong class="text-white">{{ chartData[hoveredIdx].habitCheckins }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ProductivityDashboard',
  setup() {
    const store = useStore();
    const activeMetric = ref('all'); // 'all', 'tasks', 'habits'
    const hoveredIdx = ref(null);

    const tasks = computed(() => store.getters.getTasks || []);
    const habits = computed(() => store.getters.getHabits || []);

    // Generate 30 days data based 100% on actual store data
    const chartData = computed(() => {
      const list = [];
      const now = new Date();

      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const isoKey = d.toISOString().split('T')[0];
        const dayOfWeek = d.toLocaleDateString('id-ID', { weekday: 'short' });
        const shortDate = `${d.getDate()}/${d.getMonth() + 1}`;
        const fullDate = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

        // Calculate completed tasks for this date strictly from actual tasks
        let completedTasks = 0;
        tasks.value.forEach(task => {
          if (task.done || task.statusColumn === 'done' || task.status === 'Selesai' || task.status === 'Done') {
            const taskDate = task.completedAt || task.deadline || task.dueDate || task.date;
            if (taskDate === isoKey) {
              completedTasks++;
            }
          }
        });

        // Calculate habit check-ins strictly from actual habit histories
        let habitCheckins = 0;
        habits.value.forEach(h => {
          if (h.history && h.history[isoKey]) {
            habitCheckins++;
          }
        });

        list.push({
          dateKey: isoKey,
          shortDate,
          fullDate,
          dayOfWeek,
          completedTasks,
          habitCheckins
        });
      }
      return list;
    });

    const totalCompleted30Days = computed(() => {
      return chartData.value.reduce((s, d) => s + d.completedTasks, 0);
    });

    const totalHabitCheckins30Days = computed(() => {
      return chartData.value.reduce((s, d) => s + d.habitCheckins, 0);
    });

    const dailyTaskAvg = computed(() => {
      if (totalCompleted30Days.value === 0) return '0.0';
      return (totalCompleted30Days.value / 30).toFixed(1);
    });

    const maxStreak = computed(() => {
      let current = 0;
      let max = 0;
      chartData.value.forEach(d => {
        if (d.completedTasks > 0 || d.habitCheckins > 0) {
          current++;
          if (current > max) max = current;
        } else {
          current = 0;
        }
      });
      return max;
    });

    const mostProductiveDayName = computed(() => {
      const daysCount = { 'Sen': 0, 'Sel': 0, 'Rab': 0, 'Kam': 0, 'Jum': 0, 'Sab': 0, 'Min': 0 };
      let totalVol = 0;
      chartData.value.forEach(d => {
        if (daysCount[d.dayOfWeek] !== undefined) {
          const vol = d.completedTasks + d.habitCheckins;
          daysCount[d.dayOfWeek] += vol;
          totalVol += vol;
        }
      });

      if (totalVol === 0) return 'Belum ada data';

      let bestDay = '-';
      let maxVol = 0;
      const mapFull = { 'Sen': 'Senin', 'Sel': 'Selasa', 'Rab': 'Rabu', 'Kam': 'Kamis', 'Jum': 'Jumat', 'Sab': 'Sabtu', 'Min': 'Minggu' };
      Object.keys(daysCount).forEach(k => {
        if (daysCount[k] > maxVol) {
          maxVol = daysCount[k];
          bestDay = mapFull[k] || k;
        }
      });
      return bestDay;
    });

    const maxDayVolume = computed(() => {
      return Math.max(...chartData.value.map(d => d.completedTasks + d.habitCheckins), 0);
    });

    const efficiencyRate = computed(() => {
      const activeDays = chartData.value.filter(d => d.completedTasks > 0 || d.habitCheckins > 0).length;
      return Math.round((activeDays / 30) * 100);
    });

    // Chart Coordinate Calculations
    const maxScale = computed(() => {
      const maxVal = Math.max(
        ...chartData.value.map(d => Math.max(d.completedTasks, d.habitCheckins)),
        0
      );
      if (maxVal === 0) return 5; // Default grid axis when all metrics are 0
      return Math.ceil(maxVal * 1.2);
    });

    const getX = (idx) => {
      return 50 + idx * (820 / 29);
    };

    const getY = (val) => {
      const height = 150;
      const topY = 40;
      return topY + height - (val / maxScale.value) * height;
    };

    // SVG D Paths
    const taskLineD = computed(() => {
      return chartData.value.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.completedTasks)}`).join(' ');
    });

    const taskAreaD = computed(() => {
      if (chartData.value.length === 0) return '';
      const line = taskLineD.value;
      const lastX = getX(29);
      const firstX = getX(0);
      return `${line} L ${lastX} 190 L ${firstX} 190 Z`;
    });

    const habitLineD = computed(() => {
      return chartData.value.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.habitCheckins)}`).join(' ');
    });

    const habitAreaD = computed(() => {
      if (chartData.value.length === 0) return '';
      const line = habitLineD.value;
      const lastX = getX(29);
      const firstX = getX(0);
      return `${line} L ${lastX} 190 L ${firstX} 190 Z`;
    });

    const tooltipStyle = computed(() => {
      if (hoveredIdx.value === null) return {};
      const leftPercent = (hoveredIdx.value / 29) * 85 + 5;
      return {
        top: '30px',
        left: `${Math.min(Math.max(leftPercent, 10), 80)}%`,
        zIndex: 10
      };
    });

    return {
      activeMetric,
      hoveredIdx,
      chartData,
      totalCompleted30Days,
      totalHabitCheckins30Days,
      dailyTaskAvg,
      maxStreak,
      mostProductiveDayName,
      maxDayVolume,
      efficiencyRate,
      maxScale,
      getX,
      getY,
      taskLineD,
      taskAreaD,
      habitLineD,
      habitAreaD,
      tooltipStyle
    };
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.pointer-events-none {
  pointer-events: none;
}

/* Fluid CSS transitions for SVG chart paths, points, and bars */
path {
  transition: d 0.5s cubic-bezier(0.16, 1, 0.3, 1), fill 0.3s ease, stroke 0.3s ease;
}

circle {
  transition: cx 0.5s cubic-bezier(0.16, 1, 0.3, 1), cy 0.5s cubic-bezier(0.16, 1, 0.3, 1), r 0.2s ease;
}

circle:hover {
  r: 7px;
  cursor: pointer;
}

.btn {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.bg-light.rounded-3 {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.bg-light.rounded-3:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>
