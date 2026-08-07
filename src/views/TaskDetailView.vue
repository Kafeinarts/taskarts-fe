<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Top Bar Navigation -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border top-bar-card">
      <div class="d-flex align-items-center gap-3">
        <router-link to="/tasks" class="btn btn-outline-secondary rounded-3 px-3 py-2 d-flex align-items-center gap-2 fw-semibold">
          <i class="bi bi-arrow-left fs-5"></i>
          <span>Kembali ke Tasks</span>
        </router-link>
        <div class="border-start ps-3 d-none d-sm-block" v-if="task">
          <span class="badge bg-warning-subtle text-warning-emphasis fw-bold px-3 py-1.5 rounded-pill mb-1">
            <i class="bi bi-check2-square me-1"></i> Detail Tugas & Aktivitas
          </span>
          <h4 class="fw-bold mb-0 text-truncate header-title" style="max-width: 420px;">{{ task.name }}</h4>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex flex-wrap align-items-center gap-2" v-if="task">
        <button
          class="btn rounded-3 px-3 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm"
          :class="task.done ? 'btn-success' : 'btn-outline-success'"
          @click="toggleTaskDone"
        >
          <i :class="task.done ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
          <span>{{ task.done ? 'Selesai (Completed)' : 'Tandai Selesai' }}</span>
        </button>
        <button class="btn btn-warning rounded-3 px-3 py-2 fw-semibold d-flex align-items-center gap-2 text-dark" @click="openEditModal">
          <i class="bi bi-pencil-square"></i>
          <span>Edit Task</span>
        </button>
        <button class="btn btn-outline-danger rounded-3 px-3 py-2 fw-semibold d-flex align-items-center gap-2" @click="deleteTask">
          <i class="bi bi-trash"></i>
          <span>Hapus</span>
        </button>
      </div>
    </div>

    <!-- MAIN TASK DETAIL CARD -->
    <div v-if="task" class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 main-task-card">
      <!-- Task Header -->
      <div class="p-4 p-md-5 border-bottom task-header-bar d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
        <div>
          <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span class="badge rounded-pill px-3 py-1.5 fw-semibold" :class="getCategoryBadgeClass(task.category)">
              {{ getCategoryLabel(task.category) }}
            </span>
            <span class="badge bg-light text-dark border px-3 py-1.5 rounded-pill project-tag-badge">
              <i class="bi bi-tag-fill me-1 text-primary"></i>{{ task.projectTag || 'Umum' }}
            </span>
            <span :class="badgeClass(task.level)" class="px-3 py-1.5 rounded-pill small fw-bold">
              Prioritas: {{ task.level }}
            </span>
            <span v-if="task.recurring && task.recurring !== 'none'" class="badge bg-info-subtle text-info fw-bold px-3 py-1.5 rounded-pill">
              <i class="bi bi-repeat me-1"></i>{{ task.recurring }}
            </span>
          </div>

          <h1 class="display-6 fw-extrabold main-task-title mb-3" :class="{ 'text-decoration-line-through opacity-60': task.done }">
            {{ task.name }}
          </h1>

          <div class="d-flex flex-wrap align-items-center gap-3 text-sub-heading small">
            <span>
              <i class="bi bi-calendar-event me-1 text-primary"></i> Target Deadline: 
              <strong :class="getDeadlineInfo(task.deadline, task.done).textClass">
                {{ getDeadlineInfo(task.deadline, task.done).label }}
              </strong>
            </span>
            <span class="border-start ps-3"><i class="bi bi-kanban me-1 text-info"></i> Status Kolom: <strong class="text-heading">{{ getStatusLabel(task.statusColumn) }}</strong></span>
            <span class="border-start ps-3"><i class="bi bi-grid-1x2 me-1 text-warning"></i> Eisenhower: <strong class="text-heading">{{ getEisenhowerLabel(task.eisenhower) }}</strong></span>
          </div>
        </div>

        <div class="p-4 rounded-4 text-center border shadow-sm style-status-box" :class="task.done ? 'bg-success-subtle border-success text-success' : (getDeadlineInfo(task.deadline, task.done).isDanger ? 'bg-danger-subtle border-danger text-danger' : 'bg-warning-subtle border-warning text-warning-emphasis')">
          <i :class="task.done ? 'bi bi-check-circle-fill display-4' : (getDeadlineInfo(task.deadline, task.done).isDanger ? 'bi bi-exclamation-triangle-fill display-4 text-danger' : 'bi bi-hourglass-split display-4')"></i>
          <div class="fw-extrabold fs-5 mt-1">{{ task.done ? 'STATUS: SELESAI' : 'MENUNGGU PENYELESAIAN' }}</div>
          <small class="d-block mt-1 fw-bold" :class="getDeadlineInfo(task.deadline, task.done).textClass" v-if="task.deadline">
            {{ getDeadlineInfo(task.deadline, task.done).label }}
          </small>
        </div>
      </div>

      <!-- Task Details & Notes Body -->
      <div class="card-body p-4 p-md-5 task-body-wrapper">
        <h5 class="fw-bold section-title mb-3 d-flex align-items-center gap-2">
          <i class="bi bi-journal-text text-primary fs-4"></i>
          <span>Catatan & Petunjuk Pekerjaan</span>
        </h5>

        <div class="p-4 rounded-4 border notes-container">
          <div v-if="task.notes" class="notes-text" style="line-height: 1.8; white-space: pre-wrap;">
            {{ task.notes }}
          </div>
          <div v-else class="text-sub-heading italic py-4 text-center">
            <i class="bi bi-info-circle me-1"></i> Tidak ada catatan khusus untuk tugas ini.
          </div>
        </div>

        <!-- Task Metadata Info Grid -->
        <div class="row g-3 mt-4 pt-4 border-top grid-border">
          <div class="col-sm-6 col-md-3">
            <div class="p-3 rounded-3 border meta-card">
              <span class="small text-sub-heading d-block fw-semibold mb-1">ID TUGAS</span>
              <code class="text-primary fw-bold fs-6">{{ task.id }}</code>
            </div>
          </div>
          <div class="col-sm-6 col-md-3">
            <div class="p-3 rounded-3 border meta-card">
              <span class="small text-sub-heading d-block fw-semibold mb-1">KATEGORI</span>
              <span class="fw-bold text-heading">{{ getCategoryLabel(task.category) }}</span>
            </div>
          </div>
          <div class="col-sm-6 col-md-3">
            <div class="p-3 rounded-3 border meta-card">
              <span class="small text-sub-heading d-block fw-semibold mb-1">RECURRING</span>
              <span class="fw-bold text-heading">{{ task.recurring || 'Tidak' }}</span>
            </div>
          </div>
          <div class="col-sm-6 col-md-3">
            <div class="p-3 rounded-3 border meta-card">
              <span class="small text-sub-heading d-block fw-semibold mb-1">DEADLINE</span>
              <span class="fw-bold text-heading">{{ formatDate(task.deadline) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer p-4 border-top task-footer-bar d-flex justify-content-between align-items-center">
        <span class="small text-sub-heading">
          <i class="bi bi-shield-check text-success me-1"></i> Task ini tersimpan otomatis di Vuex Store lokal.
        </span>
        <router-link to="/tasks" class="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold">
          Lihat Semua Task
        </router-link>
      </div>
    </div>

    <!-- TASK NOT FOUND -->
    <div v-else class="text-center py-5 bg-white rounded-4 shadow-sm border my-4 not-found-box">
      <div class="display-1 text-muted opacity-50 mb-3">📝</div>
      <h3 class="fw-bold text-dark">Tugas Tidak Ditemukan</h3>
      <p class="text-muted max-w-md mx-auto">Tugas yang Anda cari tidak ada atau mungkin telah dihapus.</p>
      <router-link to="/tasks" class="btn btn-primary rounded-3 px-4 py-2 mt-2 fw-semibold">
        <i class="bi bi-arrow-left me-1"></i> Kembali ke Daftar Tasks
      </router-link>
    </div>

    <!-- Edit Task Drawer / Modal -->
    <div v-if="isEditing" class="drawer-backdrop" @click="isEditing = false"></div>
    <div class="drawer-panel bg-white shadow-lg border-start" :class="{ 'drawer-show': isEditing }">
      <div class="drawer-header p-4 border-bottom d-flex align-items-center justify-content-between bg-light">
        <div>
          <span class="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill mb-1">
            ✏️ Quick Edit
          </span>
          <h5 class="fw-bold mb-0 text-dark">Edit Task / Activity</h5>
        </div>
        <button type="button" class="btn btn-light rounded-circle border p-2" @click="isEditing = false">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="drawer-body p-4 overflow-y-auto" style="height: calc(100vh - 85px);" v-if="editForm">
        <form @submit.prevent="saveEditTask" class="row g-3">
          <div class="col-12">
            <label class="form-label fw-bold small">Nama Tugas <span class="text-danger">*</span></label>
            <input type="text" class="form-control form-control-lg border-2 fs-6" v-model="editForm.name" required />
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold small">Kategori</label>
            <select class="form-select" v-model="editForm.category">
              <option value="Work">💼 Work / Pekerjaan</option>
              <option value="Personal">🏠 Personal / Pribadi</option>
              <option value="Urgent">🔥 Urgent / Mendesak</option>
              <option value="Client">🤝 Client Project</option>
              <option value="Routine">🔄 Routine / Rutinitas</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold small">Prioritas</label>
            <select class="form-select" v-model="editForm.level">
              <option value="Menengah">Menengah</option>
              <option value="Penting">Penting</option>
              <option value="Biasa">Biasa</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold small">Proyek / Tag</label>
            <input type="text" class="form-control" v-model="editForm.projectTag" />
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold small">Target Deadline</label>
            <input type="date" class="form-control" v-model="editForm.deadline" />
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold small">Status Kolom</label>
            <select class="form-select" v-model="editForm.statusColumn">
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Completed</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold small">Matriks Eisenhower</label>
            <select class="form-select" v-model="editForm.eisenhower">
              <option value="do_first">Do First</option>
              <option value="schedule">Schedule</option>
              <option value="delegate">Delegate</option>
              <option value="eliminate">Eliminate</option>
            </select>
          </div>

          <div class="col-12">
            <label class="form-label fw-bold small">Catatan / Detail</label>
            <textarea class="form-control" rows="4" v-model="editForm.notes"></textarea>
          </div>

          <div class="col-12 pt-3 border-top mt-4 d-flex gap-2">
            <button type="button" class="btn btn-light rounded-3 px-4 flex-grow-1" @click="isEditing = false">Batal</button>
            <button type="submit" class="btn btn-primary rounded-3 px-4 py-2 fw-bold flex-grow-1 shadow-sm">
              <i class="bi bi-check-circle-fill me-1"></i> Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast Notification -->
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

    <!-- DELETE CONFIRMATION MODAL DIALOG -->
    <!-- IN-PAGE DELETE CONFIRMATION PANEL (NO MODAL OVERLAY) -->
    <transition name="fade-slide">
      <div v-if="showDeleteModal && task" class="card border border-2 border-danger shadow-lg rounded-4 overflow-hidden my-4 bg-white p-4">
        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div class="d-flex align-items-center gap-3">
            <div class="p-3 bg-danger text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width: 48px; height: 48px;">
              <i class="bi bi-exclamation-triangle-fill fs-3"></i>
            </div>
            <div>
              <h5 class="fw-bold text-danger mb-1">Konfirmasi Hapus Tugas</h5>
              <p class="small text-muted mb-0">Hapus "<strong>{{ task.name }}</strong>" secara permanen?</p>
            </div>
          </div>

          <div class="d-flex gap-2 justify-content-end">
            <button type="button" class="btn btn-light px-4 py-2 rounded-pill fw-bold border" @click="showDeleteModal = false">Batal</button>
            <button type="button" class="btn btn-danger px-4 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2" @click="executeDeleteTask">
              <i class="bi bi-trash-fill"></i>
              <span>Ya, Hapus Permanen</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'TaskDetailView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const toast = ref({ show: false, message: '' });
    const isEditing = ref(false);
    const editForm = ref(null);
    const showDeleteModal = ref(false);

    const task = computed(() => {
      const id = route.params.id;
      const allTasks = store.getters.getTasks || [];
      return allTasks.find(t => String(t.id) === String(id)) || null;
    });

    const toggleTaskDone = () => {
      if (!task.value) return;
      store.commit('TOGGLE_TASK', task.value.id);
      showToast(task.value.done ? 'Status tugas diubah menjadi Selesai!' : 'Status tugas dikembalikan!');
    };

    const openEditModal = () => {
      if (!task.value) return;
      editForm.value = { ...task.value };
      isEditing.value = true;
    };

    const saveEditTask = () => {
      if (!editForm.value) return;
      store.commit('UPDATE_TASK', editForm.value);
      isEditing.value = false;
      showToast('Data tugas berhasil diperbarui!');
    };

    const deleteTask = () => {
      if (!task.value) return;
      showDeleteModal.value = true;
    };

    const executeDeleteTask = () => {
      if (!task.value) return;
      const targetName = task.value.name;
      store.commit('DELETE_TASK', task.value.id);
      showDeleteModal.value = false;
      showToast(`Tugas "${targetName}" telah dihapus permanen!`);
      setTimeout(() => {
        router.push('/tasks');
      }, 500);
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return '-';
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      } catch (e) {
        return dateStr;
      }
    };

    const getDeadlineInfo = (deadlineStr, done) => {
      if (done) {
        return {
          status: 'completed',
          isDanger: false,
          label: 'Selesai',
          textClass: 'text-success fw-bold'
        };
      }
      if (!deadlineStr) {
        return {
          status: 'none',
          isDanger: false,
          label: 'Tanpa Deadline',
          textClass: 'text-muted'
        };
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const deadline = new Date(deadlineStr);
      deadline.setHours(0, 0, 0, 0);

      const diffTime = deadline - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        const absDays = Math.abs(diffDays);
        return {
          status: 'overdue',
          isDanger: true,
          label: `⚠️ Overdue (${absDays} hari lalu)`,
          textClass: 'text-danger fw-extrabold'
        };
      } else if (diffDays === 0) {
        return {
          status: 'today',
          isDanger: true,
          label: '🔥 Deadline Hari Ini!',
          textClass: 'text-danger fw-extrabold'
        };
      } else if (diffDays === 1) {
        return {
          status: 'tomorrow',
          isDanger: true,
          label: '⏰ Deadline Besok!',
          textClass: 'text-danger fw-bold'
        };
      } else {
        return {
          status: 'future',
          isDanger: false,
          label: formatDate(deadlineStr),
          textClass: 'text-dark'
        };
      }
    };

    const isOverdue = (deadlineStr, done) => {
      if (done || !deadlineStr) return false;
      const today = new Date().toISOString().split('T')[0];
      return deadlineStr < today;
    };

    const badgeClass = (level) => {
      if (level === 'Penting') return 'bg-danger text-white';
      if (level === 'Biasa') return 'bg-secondary text-white';
      return 'bg-warning text-dark';
    };

    const getCategoryBadgeClass = (cat) => {
      if (cat === 'Work') return 'bg-primary-subtle text-primary';
      if (cat === 'Personal') return 'bg-success-subtle text-success';
      if (cat === 'Urgent') return 'bg-danger-subtle text-danger';
      if (cat === 'Client') return 'bg-info-subtle text-info';
      return 'bg-secondary-subtle text-secondary';
    };

    const getCategoryLabel = (cat) => {
      const map = {
        Work: '💼 Work',
        Personal: '🏠 Personal',
        Urgent: '🔥 Urgent',
        Client: '🤝 Client',
        Routine: '🔄 Routine'
      };
      return map[cat] || cat || 'Umum';
    };

    const getStatusLabel = (col) => {
      const map = {
        backlog: 'Backlog',
        todo: 'To Do',
        in_progress: 'In Progress',
        done: 'Completed'
      };
      return map[col] || 'To Do';
    };

    const getEisenhowerLabel = (e) => {
      const map = {
        do_first: '🔥 Do First (Kerjakan Sekarang)',
        schedule: '📅 Schedule (Jadwalkan)',
        delegate: '👥 Delegate (Delegasikan)',
        eliminate: '🧹 Eliminate (Eliminasi)'
      };
      return map[e] || 'General';
    };

    const showToast = (msg) => {
      toast.value = { show: true, message: msg };
      setTimeout(() => {
        toast.value.show = false;
      }, 3000);
    };

    return {
      task,
      toggleTaskDone,
      openEditModal,
      saveEditTask,
      deleteTask,
      showDeleteModal,
      executeDeleteTask,
      isEditing,
      editForm,
      formatDate,
      isOverdue,
      badgeClass,
      getCategoryBadgeClass,
      getCategoryLabel,
      getStatusLabel,
      getEisenhowerLabel,
      getDeadlineInfo,
      toast
    };
  }
};
</script>

<style scoped>
.style-status-box {
  min-width: 230px;
}

.header-title,
.main-task-title,
.section-title,
.text-heading {
  color: #0f172a;
}

.text-sub-heading {
  color: #64748b;
}

.top-bar-card,
.main-task-card,
.task-header-bar,
.task-body-wrapper {
  background-color: #ffffff;
  border-color: #e2e8f0;
}

.notes-container {
  background-color: #f8fafc;
  border-color: #e2e8f0;
  min-height: 180px;
}

.notes-text {
  font-size: 1.08rem;
  color: #1e293b;
}

.meta-card {
  background-color: #f8fafc;
  border-color: #e2e8f0;
}

.task-footer-bar {
  background-color: #f8fafc;
  border-color: #e2e8f0;
}

/* DARK MODE SPECIFIC OVERRIDES */
:global(.dark-theme) .header-title,
:global(.dark-theme) .main-task-title,
:global(.dark-theme) .section-title,
:global(.dark-theme) .text-heading {
  color: #f8fafc !important;
}

:global(.dark-theme) .text-sub-heading {
  color: #94a3b8 !important;
}

:global(.dark-theme) .top-bar-card,
:global(.dark-theme) .main-task-card,
:global(.dark-theme) .task-header-bar,
:global(.dark-theme) .task-body-wrapper,
:global(.dark-theme) .not-found-box {
  background-color: #1e293b !important;
  border-color: #334155 !important;
}

:global(.dark-theme) .notes-container,
:global(.dark-theme) .meta-card,
:global(.dark-theme) .task-footer-bar {
  background-color: #131b2e !important;
  border-color: #334155 !important;
}

:global(.dark-theme) .notes-text {
  color: #f1f5f9 !important;
}

:global(.dark-theme) .project-tag-badge {
  background-color: #131b2e !important;
  color: #e2e8f0 !important;
  border-color: #334155 !important;
}

:global(.dark-theme) .grid-border {
  border-color: #334155 !important;
}

/* Slide-over Drawer Styles */
.drawer-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 1070;
}

.drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 540px;
  max-width: 100vw;
  height: 100vh;
  z-index: 1080;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-panel.drawer-show {
  transform: translateX(0);
}

:global(.dark-theme) .drawer-panel {
  background-color: #1e293b !important;
  color: #f8fafc !important;
  border-color: #334155 !important;
}

:global(.dark-theme) .drawer-header {
  background-color: #131b2e !important;
  border-color: #334155 !important;
}
</style>

