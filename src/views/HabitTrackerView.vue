<template>
  <div class="container-fluid p-0 position-relative" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-danger-subtle text-danger fw-semibold px-3 py-1.5 rounded-pill">Daily Consistency & Streak Engine</span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">⚡ Habit Tracker & Streak Counter</h2>
        <p class="text-muted mb-0">Latih konsistensi harian, bangun rutinitas positif, dan jaga streak harian Anda tanpa terputus.</p>
      </div>
      <div class="d-flex flex-wrap align-items-center gap-2">
        <button
          v-if="habits.length > 0"
          class="btn btn-outline-success px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 shadow-sm"
          @click="checkInAllToday"
          title="Tandai semua habit selesai hari ini"
        >
          <i class="bi bi-check2-all fs-5"></i>
          <span>Check-in Semua Hari Ini</span>
        </button>
        <button class="btn btn-primary px-4 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 shadow-sm" @click="openAddDrawer">
          <i class="bi bi-plus-lg fs-5"></i>
          <span>Tambah Habit Baru</span>
        </button>
      </div>
    </div>

    <!-- Summary Stats Row -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-primary h-100">
          <div class="text-muted small fw-semibold">Total Kebiasaan</div>
          <div class="fs-3 fw-bold text-dark mt-1">{{ habits.length }}</div>
          <div class="small text-muted mt-1">{{ categoriesCount }} Kategori aktif</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-danger h-100">
          <div class="text-muted small fw-semibold">Streak Aktif</div>
          <div class="fs-3 fw-bold text-danger mt-1">
            <i class="bi bi-fire me-1"></i>{{ activeStreakCount }}
          </div>
          <div class="small text-muted mt-1">Habit sedang aktif beruntun</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-success h-100">
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-muted small fw-semibold">Selesai Hari Ini</div>
            <span class="badge bg-success-subtle text-success fw-bold">{{ todayCompletionPercent }}%</span>
          </div>
          <div class="fs-3 fw-bold text-success mt-1">{{ todayDoneCount }} / {{ habits.length }}</div>
          <div class="progress mt-2" style="height: 6px;">
            <div class="progress-bar bg-success rounded-pill" :style="{ width: todayCompletionPercent + '%' }"></div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-warning h-100">
          <div class="text-muted small fw-semibold">Streak Tertinggi</div>
          <div class="fs-3 fw-bold text-warning-emphasis mt-1">
            <i class="bi bi-trophy-fill me-1 text-warning"></i>{{ bestStreakEver }} Hari
          </div>
          <div class="small text-muted mt-1">Rekor konsistensi terbaik</div>
        </div>
      </div>
    </div>

    <!-- Quick Preset Templates Bar -->
    <div class="card border-0 shadow-sm rounded-4 bg-white p-3 mb-4">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <div class="fw-bold text-dark small d-flex align-items-center gap-2">
          <i class="bi bi-magic text-primary"></i>
          <span>Quick Preset Template (1-Click Tambah Habit Populer)</span>
        </div>
        <span class="small text-muted">Klik untuk langsung menambahkan</span>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <button
          v-for="preset in presets"
          :key="preset.name"
          class="btn btn-sm btn-light border rounded-pill px-3 py-1.5 fw-semibold style-preset-btn d-flex align-items-center gap-1.5"
          @click="addPresetHabit(preset)"
        >
          <span>{{ preset.icon }}</span>
          <span>{{ preset.name }}</span>
          <i class="bi bi-plus-circle text-primary ms-1" style="font-size: 11px;"></i>
        </button>
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="card border-0 shadow-sm rounded-4 bg-white mb-4 p-3">
      <div class="row g-2 align-items-center">
        <div class="col-md-5">
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-search"></i></span>
            <input
              type="text"
              class="form-control bg-light border-start-0"
              placeholder="Cari nama habit / kebiasaan..."
              v-model="searchQuery"
            />
          </div>
        </div>
        <div class="col-md-4">
          <select class="form-select bg-light border" v-model="selectedCategory">
            <option value="all">Semua Kategori ({{ habits.length }})</option>
            <option value="Productivity">💻 Productivity & Deep Work</option>
            <option value="Business">💼 Business & Client Outreach</option>
            <option value="Health">🏃 Health & Fitness</option>
            <option value="Learning">📚 Learning & Skill Upgrade</option>
            <option value="Routine">🔄 Routine & Personal</option>
          </select>
        </div>
        <div class="col-md-3 text-end">
          <span class="text-muted small fw-semibold">Menampilkan {{ filteredHabits.length }} dari {{ habits.length }} habit</span>
        </div>
      </div>
    </div>

    <!-- Habit Grid Table Card -->
    <div class="card border-0 shadow-sm rounded-4 bg-white">
      <div class="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2">
          <h5 class="fw-bold text-dark mb-0"><i class="bi bi-calendar-check text-danger me-2"></i>Tracking 7 Hari Terakhir</h5>
          <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5">Real-time Persistence</span>
        </div>
        <span class="badge bg-light text-muted border">Klik lingkaran untuk toggle check-in</span>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive" v-if="filteredHabits.length > 0">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th style="min-width: 220px;">Nama Kebiasaan / Habit</th>
                <th style="width: 140px;">Kategori</th>
                <th v-for="day in past7Days" :key="day.dateStr" class="text-center" style="width: 75px;">
                  <div class="small fw-bold" :class="{ 'text-primary': day.dateStr === todayStr }">{{ day.dayName }}</div>
                  <small class="text-muted" style="font-size: 11px;">{{ day.shortDate }}</small>
                </th>
                <th class="text-center" style="width: 130px;">Current Streak</th>
                <th class="text-center" style="width: 110px;">Best Streak</th>
                <th class="text-center" style="width: 100px;">Rate (7hr)</th>
                <th class="text-end pe-4" style="width: 110px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="habit in filteredHabits" :key="habit.id">
                <td>
                  <span class="fw-bold text-dark d-block mb-0.5">{{ habit.name }}</span>
                  <small class="text-muted d-block style-mini" style="font-size: 11px;">
                    Dibuat: {{ formatDate(habit.id) }}
                  </small>
                </td>
                <td>
                  <span class="badge rounded-pill px-2.5 py-1 fw-semibold" :class="getCategoryBadgeClass(habit.category)">
                    {{ habit.category || 'General' }}
                  </span>
                </td>
                <td v-for="day in past7Days" :key="day.dateStr" class="text-center">
                  <button
                    class="btn btn-sm rounded-circle p-0 style-check-btn"
                    :class="isHabitDone(habit, day.dateStr) ? 'btn-success shadow-sm' : 'btn-outline-secondary opacity-75'"
                    @click="toggleHabit(habit.id, day.dateStr)"
                    :title="isHabitDone(habit, day.dateStr) ? 'Sudah selesai pada ' + day.shortDate : 'Belum selesai pada ' + day.shortDate"
                  >
                    <i :class="isHabitDone(habit, day.dateStr) ? 'bi bi-check-lg text-white' : 'bi bi-plus'"></i>
                  </button>
                </td>
                <td class="text-center">
                  <span
                    class="badge rounded-pill px-3 py-1.5 fw-bold"
                    :class="getStreakBadgeClass(calculateStreak(habit))"
                  >
                    <i class="bi bi-fire me-1"></i>{{ calculateStreak(habit) }} Hari
                  </span>
                </td>
                <td class="text-center fw-semibold text-muted">
                  <i class="bi bi-award me-1 text-warning"></i>{{ calculateBestStreak(habit) }} Hari
                </td>
                <td class="text-center fw-bold text-dark">
                  {{ calculate7DayCompletionRate(habit) }}%
                </td>
                <td class="text-end pe-4">
                  <div class="d-flex justify-content-end gap-1">
                    <button
                      class="btn btn-sm btn-light text-primary rounded-circle"
                      @click="openHistoryModal(habit)"
                      title="Lihat Histori 30 Hari"
                    >
                      <i class="bi bi-calendar3"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-light text-secondary rounded-circle"
                      @click="openEditDrawer(habit)"
                      title="Edit Habit"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-light text-danger rounded-circle"
                      @click="confirmDeleteHabit(habit)"
                      title="Hapus Habit"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="text-center py-5">
          <i class="bi bi-lightning-charge display-1 text-muted opacity-50"></i>
          <h4 class="fw-bold mt-3 text-dark">Tidak Ada Habit Ditemukan</h4>
          <p class="text-muted">Coba ubah kata kunci pencarian atau buat habit harian baru.</p>
          <button class="btn btn-primary rounded-3 px-4 py-2 mt-2 fw-semibold" @click="openAddDrawer">
            <i class="bi bi-plus-lg me-1"></i> Tambah Habit Baru
          </button>
        </div>
      </div>
    </div>

    <!-- IN-PAGE 30-DAY HISTORY PANEL (NO MODAL OVERLAY) -->
    <transition name="fade-slide">
      <div v-if="historyModalOpen && activeModalHabit" class="card border-0 shadow-lg rounded-4 overflow-hidden mb-4 bg-white p-4">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
          <div>
            <span class="badge bg-primary-subtle text-primary fw-bold rounded-pill px-3 py-1 mb-1">
              <i class="bi bi-clock-history me-1"></i> 30-Day Activity History
            </span>
            <h5 class="fw-bold text-dark mb-0">{{ activeModalHabit?.name }}</h5>
          </div>
          <button type="button" class="btn btn-sm btn-light rounded-circle border shadow-sm p-2" @click="closeHistoryModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <p class="text-muted small mb-3">Histori check-in 30 hari terakhir. Klik kotak tanggal untuk menambah atau mengubah status check-in.</p>
        
        <div class="row g-2 mb-3" style="max-height: 380px; overflow-y: auto;">
          <div
            v-for="dayItem in past30Days"
            :key="dayItem.dateStr"
            class="col-4 col-sm-3 col-md-2"
          >
            <div
              class="p-2 border rounded-3 text-center cursor-pointer style-day-card"
              :class="isHabitDone(activeModalHabit, dayItem.dateStr) ? 'bg-success text-white border-success' : 'bg-light text-dark border-light-subtle'"
              @click="activeModalHabit && toggleHabit(activeModalHabit.id, dayItem.dateStr)"
            >
              <div class="style-mini fw-bold" style="font-size: 11px;">{{ dayItem.shortDate }}</div>
              <div class="mt-1">
                <i :class="isHabitDone(activeModalHabit, dayItem.dateStr) ? 'bi bi-check-circle-fill fs-5' : 'bi bi-circle fs-5 opacity-25'"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="text-end pt-2 border-top">
          <button type="button" class="btn btn-secondary rounded-pill px-4 fw-semibold" @click="closeHistoryModal">Tutup Panel Histori</button>
        </div>
      </div>
    </transition>

    <!-- RIGHT SLIDE-OVER DRAWER BACKDROP -->
    <transition name="overlay-fade">
      <div v-if="drawerOpen" class="drawer-backdrop" @click="closeDrawer"></div>
    </transition>

    <!-- RIGHT SLIDE-OVER DRAWER PANEL (FORM ADD / EDIT HABIT) -->
    <transition name="drawer-slide">
      <div v-if="drawerOpen" class="drawer-panel bg-white shadow-lg border-start">
        <div class="drawer-header p-4 border-bottom d-flex align-items-center justify-content-between bg-light">
          <div>
            <span class="badge bg-danger-subtle text-danger fw-bold px-3 py-1.5 rounded-pill mb-1" style="font-size: 11px;">
              <i class="bi bi-lightning-charge-fill me-1"></i> Habit Form
            </span>
            <h5 class="fw-bold text-dark mb-0">
              {{ isEditing ? '✏️ Edit Kebiasaan' : '➕ Tambah Kebiasaan Baru' }}
            </h5>
          </div>
          <button type="button" class="btn btn-light rounded-circle border shadow-sm p-2" @click="closeDrawer" title="Tutup">
            <i class="bi bi-x-lg fs-5"></i>
          </button>
        </div>

        <div class="drawer-body p-4 overflow-y-auto" style="height: calc(100vh - 90px);">
          <form @submit.prevent="saveHabit" class="row g-3">
            <div class="col-12">
              <label class="form-label fw-bold text-dark small">Nama Kebiasaan / Habit <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control form-control-lg border-2 fs-6"
                v-model="form.name"
                placeholder="Contoh: Coding 2 Jam Sehari / Deep Work 90m"
                required
              />
            </div>

            <div class="col-12">
              <label class="form-label fw-bold text-dark small">Kategori Rutinitas</label>
              <select class="form-select border-2" v-model="form.category">
                <option value="Productivity">💻 Productivity & Deep Work</option>
                <option value="Business">💼 Business & Client Outreach</option>
                <option value="Health">🏃 Health & Fitness</option>
                <option value="Learning">📚 Learning & Skill Upgrade</option>
                <option value="Routine">🔄 Rutinitas Harian / Personal</option>
              </select>
            </div>

            <div class="col-12 pt-3 border-top mt-4 d-flex gap-2">
              <button type="button" class="btn btn-light rounded-3 px-4 flex-grow-1" @click="closeDrawer">Batal</button>
              <button type="submit" class="btn btn-primary rounded-3 px-4 py-2 fw-bold flex-grow-1 shadow-sm">
                <i class="bi bi-check-circle-fill me-1"></i> {{ isEditing ? 'Simpan Perubahan' : 'Simpan Habit' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Sleek Toast Notification -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1090;">
      <div v-if="toast.show" class="toast align-items-center text-white bg-dark border-0 show shadow-lg rounded-3" role="alert">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="bi bi-check-circle-fill text-success fs-5"></i>
            <span>{{ toast.message }}</span>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="toast.show = false"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'HabitTrackerView',
  setup() {
    const store = useStore();

    const drawerOpen = ref(false);
    const isEditing = ref(false);
    const editingId = ref(null);
    const searchQuery = ref('');
    const selectedCategory = ref('all');
    const form = ref({ name: '', category: 'Productivity' });
    const toast = ref({ show: false, message: '' });

    const activeModalHabit = ref(null);
    const historyModalOpen = ref(false);

    const habits = computed(() => store.getters.getHabits || []);

    const presets = [
      { name: 'Minum 2L Air', category: 'Health', icon: '💧' },
      { name: 'Baca Buku 20 Mnt', category: 'Learning', icon: '📚' },
      { name: 'Olahraga 30 Mnt', category: 'Health', icon: '🏃' },
      { name: 'Coding 2 Jam', category: 'Productivity', icon: '💻' },
      { name: 'Meditasi 10 Mnt', category: 'Routine', icon: '🧘' },
      { name: 'Deep Work 90 Mnt', category: 'Productivity', icon: '🎯' },
      { name: 'Review Email Inbox', category: 'Business', icon: '📬' }
    ];

    const showToast = (msg) => {
      toast.value.message = msg;
      toast.value.show = true;
      setTimeout(() => (toast.value.show = false), 3000);
    };

    const todayStr = computed(() => new Date().toISOString().split('T')[0]);

    const past7Days = computed(() => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
        const shortDate = `${d.getDate()}/${d.getMonth() + 1}`;
        days.push({ dateStr, dayName, shortDate });
      }
      return days;
    });

    const past30Days = computed(() => {
      const days = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const shortDate = `${d.getDate()}/${d.getMonth() + 1}`;
        days.push({ dateStr, shortDate });
      }
      return days;
    });

    const filteredHabits = computed(() => {
      return habits.value.filter(h => {
        const q = searchQuery.value.toLowerCase().trim();
        const matchesQuery = !q || h.name.toLowerCase().includes(q);
        const matchesCategory = selectedCategory.value === 'all' || (h.category || 'Productivity') === selectedCategory.value;
        return matchesQuery && matchesCategory;
      });
    });

    const categoriesCount = computed(() => {
      const cats = new Set(habits.value.map(h => h.category || 'Productivity'));
      return cats.size;
    });

    const isHabitDone = (habit, dateStr) => {
      if (!habit || !habit.history) return false;
      return habit.history[dateStr] === true;
    };

    const toggleHabit = (id, dateStr) => {
      store.dispatch('toggleHabitDate', { id, dateStr });
    };

    const checkInAllToday = () => {
      const t = todayStr.value;
      habits.value.forEach(h => {
        if (!isHabitDone(h, t)) {
          store.dispatch('toggleHabitDate', { id: h.id, dateStr: t });
        }
      });
      showToast('Berhasil check-in semua habit hari ini! 🔥');
    };

    const calculateStreak = (habit) => {
      if (!habit || !habit.history) return 0;
      let streak = 0;
      const today = new Date();

      const todayDateStr = today.toISOString().split('T')[0];
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDateStr = yesterday.toISOString().split('T')[0];

      let startOffset = 0;
      if (habit.history[todayDateStr]) {
        startOffset = 0;
      } else if (habit.history[yesterdayDateStr]) {
        startOffset = 1;
      } else {
        return 0;
      }

      for (let i = startOffset; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        if (habit.history[dateStr]) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    };

    const calculateBestStreak = (habit) => {
      if (!habit || !habit.history) return 0;
      const dates = Object.keys(habit.history).filter(d => habit.history[d]).sort();
      if (dates.length === 0) return 0;

      let maxStreak = 0;
      let currentSeq = 0;
      let prevTime = null;

      for (const dStr of dates) {
        const time = new Date(dStr).getTime();
        if (prevTime === null) {
          currentSeq = 1;
        } else {
          const diffDays = Math.round((time - prevTime) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            currentSeq++;
          } else {
            currentSeq = 1;
          }
        }
        if (currentSeq > maxStreak) maxStreak = currentSeq;
        prevTime = time;
      }
      return Math.max(maxStreak, calculateStreak(habit));
    };

    const calculate7DayCompletionRate = (habit) => {
      if (!habit) return 0;
      let count = 0;
      past7Days.value.forEach(day => {
        if (isHabitDone(habit, day.dateStr)) count++;
      });
      return Math.round((count / 7) * 100);
    };

    const activeStreakCount = computed(() => {
      return habits.value.filter(h => calculateStreak(h) > 0).length;
    });

    const todayDoneCount = computed(() => {
      const t = todayStr.value;
      return habits.value.filter(h => isHabitDone(h, t)).length;
    });

    const todayCompletionPercent = computed(() => {
      if (habits.value.length === 0) return 0;
      return Math.round((todayDoneCount.value / habits.value.length) * 100);
    });

    const bestStreakEver = computed(() => {
      if (habits.value.length === 0) return 0;
      return Math.max(0, ...habits.value.map(h => calculateBestStreak(h)));
    });

    const getStreakBadgeClass = (streak) => {
      if (streak >= 14) return 'bg-warning text-dark border border-warning shadow-sm';
      if (streak >= 7) return 'bg-danger text-white shadow-sm';
      if (streak >= 3) return 'bg-danger-subtle text-danger border border-danger-subtle';
      if (streak > 0) return 'bg-primary-subtle text-primary border border-primary-subtle';
      return 'bg-light text-muted border';
    };

    const getCategoryBadgeClass = (category) => {
      switch (category) {
        case 'Productivity': return 'bg-primary-subtle text-primary border border-primary-subtle';
        case 'Business': return 'bg-info-subtle text-info-emphasis border border-info-subtle';
        case 'Health': return 'bg-success-subtle text-success border border-success-subtle';
        case 'Learning': return 'bg-purple-subtle text-purple border border-purple-subtle';
        case 'Routine': return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
        default: return 'bg-light text-dark border';
      }
    };

    const addPresetHabit = (preset) => {
      const exists = habits.value.some(h => h.name.toLowerCase() === preset.name.toLowerCase());
      if (exists) {
        showToast(`Habit "${preset.name}" sudah ada di daftar Anda!`);
        return;
      }
      store.dispatch('addHabit', { name: preset.name, category: preset.category });
      showToast(`Habit "${preset.name}" ditambahkan!`);
    };

    const openAddDrawer = () => {
      form.value = { name: '', category: 'Productivity' };
      isEditing.value = false;
      editingId.value = null;
      drawerOpen.value = true;
    };

    const openEditDrawer = (habit) => {
      form.value = { name: habit.name, category: habit.category || 'Productivity' };
      isEditing.value = true;
      editingId.value = habit.id;
      drawerOpen.value = true;
    };

    const closeDrawer = () => {
      drawerOpen.value = false;
    };

    const saveHabit = () => {
      if (!form.value.name || !form.value.name.trim()) {
        showToast('Nama kebiasaan tidak boleh kosong.');
        return;
      }

      if (isEditing.value && editingId.value) {
        const existing = habits.value.find(h => h.id === editingId.value);
        if (existing) {
          store.dispatch('updateHabit', { ...existing, name: form.value.name, category: form.value.category });
          showToast('Perubahan habit berhasil disimpan!');
        }
      } else {
        store.dispatch('addHabit', form.value);
        showToast('Habit baru berhasil ditambahkan!');
      }
      closeDrawer();
    };

    const confirmDeleteHabit = (habit) => {
      if (confirm(`Apakah Anda yakin ingin menghapus habit "${habit.name}"?`)) {
        store.dispatch('deleteHabit', habit.id);
        showToast('Habit berhasil dihapus.');
      }
    };

    const openHistoryModal = (habit) => {
      activeModalHabit.value = habit;
      historyModalOpen.value = true;
    };

    const closeHistoryModal = () => {
      historyModalOpen.value = false;
    };

    const formatDate = (id) => {
      if (!id) return '-';
      const timestamp = parseInt(id.replace('h_', ''), 10);
      if (isNaN(timestamp)) return 'Aktif';
      return new Date(timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    return {
      habits,
      past7Days,
      past30Days,
      todayStr,
      presets,
      searchQuery,
      selectedCategory,
      filteredHabits,
      categoriesCount,
      form,
      drawerOpen,
      isEditing,
      toast,
      activeModalHabit,
      historyModalOpen,
      isHabitDone,
      toggleHabit,
      checkInAllToday,
      calculateStreak,
      calculateBestStreak,
      calculate7DayCompletionRate,
      activeStreakCount,
      todayDoneCount,
      todayCompletionPercent,
      bestStreakEver,
      getStreakBadgeClass,
      getCategoryBadgeClass,
      addPresetHabit,
      openAddDrawer,
      openEditDrawer,
      closeDrawer,
      saveHabit,
      confirmDeleteHabit,
      openHistoryModal,
      closeHistoryModal,
      formatDate
    };
  }
};
</script>

<style scoped>
.style-check-btn {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.style-check-btn:hover {
  transform: scale(1.18);
}

.style-check-btn:active {
  transform: scale(0.92);
}

.style-preset-btn {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.style-preset-btn:hover {
  transform: translateY(-2px);
  background-color: #f1f5f9;
}

.style-day-card {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.style-day-card:hover {
  transform: scale(1.06);
}

.badge {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.badge:hover {
  transform: scale(1.05);
}

.card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-2px);
}

/* Transitions */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Custom Vue Modal Wrapper */
.custom-modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1085;
  padding: 1rem;
}

.custom-modal-content {
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
}

/* RIGHT SLIDE-OVER DRAWER STYLES */
.drawer-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1070;
}

.drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 440px;
  max-width: 100vw;
  height: 100vh;
  z-index: 1080;
  box-shadow: -6px 0 24px rgba(0, 0, 0, 0.18);
}
</style>
