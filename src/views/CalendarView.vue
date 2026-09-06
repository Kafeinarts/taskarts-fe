<template>
  <div class="q-pa-md calendar-container" data-aos="fade-up">
    <!-- Header Card (Material Design 3) -->
    <q-card flat bordered class="bg-white rounded-borders q-pa-md q-mb-md shadow-1">
      <div class="row items-center justify-between q-col-gutter-md">
        <div class="col-12 col-md-6">
          <div class="row items-center q-gutter-x-sm q-mb-xs">
            <q-badge color="primary" text-color="white" rounded label="Agenda & Kalender" class="q-px-sm q-py-xs text-weight-bold" />
            <q-badge color="red-1" text-color="negative" rounded label="🇮🇩 Tanggal Merah Indonesia" class="q-px-sm q-py-xs text-weight-bold" />
            <q-badge color="grey-3" text-color="grey-9" rounded label="Material Design 3" class="q-px-sm q-py-xs" />
          </div>
          <div class="text-h5 text-weight-bold text-grey-9 q-mb-xs">📅 Kalender, Agenda & Pengingat</div>
          <div class="text-caption text-grey-7">
            Kelola agenda meeting, deadline proyek/tugas harian, dan pantau hari libur nasional Indonesia.
          </div>
        </div>

        <div class="col-12 col-md-6 text-right">
          <div class="row justify-end items-center q-gutter-sm">
            <q-btn flat round dense icon="chevron_left" color="grey-8" @click="changeMonth(-1)" />
            <span class="text-subtitle1 text-weight-bold text-grey-9 q-px-sm text-center min-w-160">
              {{ monthYearLabel }}
            </span>
            <q-btn flat round dense icon="chevron_right" color="grey-8" @click="changeMonth(1)" />
            <q-btn
              outline
              color="grey-7"
              label="Hari Ini"
              no-caps
              dense
              class="q-px-sm rounded-borders"
              @click="goToToday"
            />
            <q-btn
              unelevated
              color="primary"
              icon="add"
              label="Tambah Agenda"
              no-caps
              class="rounded-borders text-weight-bold"
              @click="openAddEventModal()"
            />
          </div>
        </div>
      </div>
    </q-card>

    <!-- Legend Bar -->
    <q-card flat bordered class="bg-white rounded-borders q-pa-sm q-mb-md shadow-1">
      <div class="row items-center q-gutter-x-md q-gutter-y-xs text-caption">
        <span class="text-weight-bold text-grey-8">Keterangan:</span>
        <span class="row items-center"><q-badge color="red-1" text-color="negative" label="🇮🇩 Tanggal Merah" class="q-mr-xs text-weight-bold" /> Hari Libur Nasional</span>
        <span class="row items-center"><q-badge color="blue-1" text-color="primary" label="Meeting" class="q-mr-xs text-weight-bold" /> Agenda Jam</span>
        <span class="row items-center"><q-badge color="amber-1" text-color="amber-10" label="Deadline Task" class="q-mr-xs text-weight-bold" /> Tugas Harian</span>
        <span class="row items-center"><q-badge color="cyan-1" text-color="secondary" label="Proyek" class="q-mr-xs text-weight-bold" /> Deadline Proyek</span>
        <span class="row items-center"><q-badge color="purple-1" text-color="purple-9" label="Invoice" class="q-mr-xs text-weight-bold" /> Jatuh Tempo</span>
      </div>
    </q-card>

    <!-- Calendar Grid Card -->
    <q-card flat bordered class="bg-white rounded-borders q-pa-md shadow-1 q-mb-md">
      <!-- Days of Week Header -->
      <div class="calendar-grid-header text-center text-weight-bold q-pb-sm border-bottom">
        <div
          v-for="(day, idx) in weekDays"
          :key="day"
          :class="idx === 0 ? 'text-negative' : 'text-grey-7'"
          class="q-py-xs text-subtitle2"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Days Body -->
      <div class="calendar-grid-body q-pt-sm">
        <div
          v-for="(cell, idx) in calendarCells"
          :key="idx"
          class="calendar-cell q-pa-xs rounded-borders cursor-pointer"
          :class="[
            cell.currentMonth ? 'cell-active' : 'cell-inactive opacity-50',
            cell.isToday ? 'border-today shadow-1' : 'border-cell',
            cell.holidayInfo.isRedDate ? 'bg-red-0' : ''
          ]"
          @click="openDayDetail(cell)"
        >
          <!-- Top Row: Date Number & Badges -->
          <div class="row items-center justify-between no-wrap q-mb-xs">
            <span
              class="text-caption text-weight-bold"
              :class="cell.holidayInfo.isRedDate ? 'text-negative text-weight-bolder fs-13' : (cell.isToday ? 'text-primary' : (cell.currentMonth ? 'text-grey-9' : 'text-grey-5'))"
            >
              {{ cell.dayNum }}
            </span>
            <div class="row items-center q-gutter-xs">
              <q-badge v-if="cell.isToday" color="primary" label="HARI INI" rounded class="text-micro" />
              <q-icon
                v-if="cell.holidayInfo.isHoliday"
                name="flag"
                color="negative"
                size="13px"
                title="Hari Libur Nasional"
              />
            </div>
          </div>

          <!-- Holiday Name Tag if any -->
          <div v-if="cell.holidayInfo.isHoliday" class="holiday-pill q-px-xs q-py-none rounded-borders text-micro ellipsis q-mb-xs">
            🇮🇩 {{ cell.holidayInfo.holidayName }}
          </div>

          <!-- Scheduled Items for Date -->
          <div class="column q-gutter-y-xs overflow-hidden">
            <!-- Timed Events -->
            <div
              v-for="e in getEventsForDate(cell.dateStr)"
              :key="e.id"
              class="event-chip bg-blue-1 text-primary q-px-xs rounded-borders text-micro ellipsis row items-center justify-between"
            >
              <span class="ellipsis"><q-icon name="schedule" size="10px" class="q-mr-xs" />{{ e.startTime }} {{ e.title }}</span>
              <span v-if="e.reminder && e.reminder !== 'None'">🔔</span>
            </div>

            <!-- Tasks -->
            <div
              v-for="t in getTasksForDate(cell.dateStr)"
              :key="t.id"
              class="event-chip bg-amber-1 text-amber-10 q-px-xs rounded-borders text-micro ellipsis"
            >
              <q-icon name="task_alt" size="10px" class="q-mr-xs" />{{ t.name }}
            </div>

            <!-- Projects -->
            <div
              v-for="p in getProjectsForDate(cell.dateStr)"
              :key="p.id"
              class="event-chip bg-cyan-1 text-secondary q-px-xs rounded-borders text-micro ellipsis"
            >
              <q-icon name="folder" size="10px" class="q-mr-xs" />{{ p.projectTitle }}
            </div>

            <!-- Invoices -->
            <div
              v-for="inv in getInvoicesForDate(cell.dateStr)"
              :key="inv.id"
              class="event-chip bg-purple-1 text-purple-9 q-px-xs rounded-borders text-micro ellipsis"
            >
              <q-icon name="receipt" size="10px" class="q-mr-xs" />{{ inv.invoiceNumber }}
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <!-- DAY DETAIL PANEL / MODAL (No Modal Blocking, Clean Quasar Dialog) -->
    <q-dialog v-model="showDayDetailModal">
      <q-card style="width: 580px; max-width: 95vw;" class="rounded-borders">
        <q-card-section class="row items-center justify-between border-bottom q-pb-sm">
          <div>
            <div class="text-caption text-weight-bold text-primary">Detail Agenda Tanggal</div>
            <div class="text-h6 text-weight-bold text-grey-9">
              {{ formatFullDate(selectedCell?.dateStr) }}
            </div>
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <!-- Holiday Banner in Day Detail -->
        <q-banner
          v-if="selectedCell?.holidayInfo?.isHoliday"
          rounded
          class="bg-red-1 text-negative q-ma-md border-red-soft"
          dense
        >
          <template v-slot:avatar>
            <q-icon name="celebration" color="negative" />
          </template>
          <div class="text-weight-bold text-body2">
            🇮🇩 Hari Libur Nasional: {{ selectedCell.holidayInfo.holidayName }}
          </div>
          <div class="text-caption text-grey-7">
            Tanggal Merah resmi Republik Indonesia (SKB 3 Menteri).
          </div>
        </q-banner>

        <q-card-section class="q-pt-xs">
          <div class="row items-center justify-between bg-grey-1 q-pa-sm rounded-borders q-mb-sm">
            <span class="text-caption text-weight-bold text-grey-8">
              {{ getEventsForDate(selectedCell?.dateStr).length }} Event Terjadwal
            </span>
            <q-btn
              unelevated
              color="primary"
              icon="add"
              label="+ Tambah Agenda"
              no-caps
              dense
              size="sm"
              class="q-px-sm text-weight-bold"
              @click="openAddEventModal(selectedCell?.dateStr)"
            />
          </div>

          <!-- List of Timed Events -->
          <div v-if="getEventsForDate(selectedCell?.dateStr).length > 0" class="q-gutter-y-xs q-mb-md">
            <q-card
              v-for="e in getEventsForDate(selectedCell?.dateStr)"
              :key="e.id"
              flat
              bordered
              class="q-pa-sm rounded-borders bg-white"
            >
              <div class="row items-center justify-between">
                <div>
                  <div class="row items-center q-gutter-x-xs">
                    <q-badge color="primary" :label="e.startTime || 'All Day'" class="text-weight-bold" />
                    <span class="text-weight-bold text-body2 text-grey-9">{{ e.title }}</span>
                  </div>
                  <div v-if="e.notes" class="text-caption text-grey-7 q-mt-xs">{{ e.notes }}</div>
                </div>
                <div class="row q-gutter-xs">
                  <q-btn flat round dense icon="edit" size="sm" color="primary" @click="editEvent(e)" />
                  <q-btn flat round dense icon="delete" size="sm" color="negative" @click="deleteEvent(e.id)" />
                </div>
              </div>
            </q-card>
          </div>
          <div v-else class="text-caption text-grey-6 text-italic q-pa-sm text-center">
            Belum ada agenda manual pada tanggal ini.
          </div>

          <!-- Tasks on this day -->
          <div v-if="getTasksForDate(selectedCell?.dateStr).length > 0" class="bg-amber-1 text-amber-10 q-pa-sm rounded-borders q-mb-sm">
            <div class="text-caption text-weight-bold q-mb-xs">📋 Deadline Tugas Harian:</div>
            <div v-for="t in getTasksForDate(selectedCell?.dateStr)" :key="t.id" class="text-caption">
              • {{ t.name }}
            </div>
          </div>

          <!-- Projects on this day -->
          <div v-if="getProjectsForDate(selectedCell?.dateStr).length > 0" class="bg-cyan-1 text-secondary q-pa-sm rounded-borders q-mb-sm">
            <div class="text-caption text-weight-bold q-mb-xs">📁 Deadline Proyek:</div>
            <div v-for="p in getProjectsForDate(selectedCell?.dateStr)" :key="p.id" class="text-caption">
              • {{ p.projectTitle }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- MANUAL ADD/EDIT EVENT MODAL (Quasar Dialog) -->
    <q-dialog v-model="showEventFormModal" persistent>
      <q-card style="width: 540px; max-width: 95vw;" class="rounded-borders">
        <q-card-section class="row items-center justify-between border-bottom q-pb-sm">
          <div class="text-h6 text-weight-bold text-grey-9">
            {{ isEditingEvent ? 'Edit Agenda / Event' : 'Tambah Agenda Baru' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <q-form @submit.prevent="saveEvent">
            <div class="q-gutter-y-sm">
              <!-- Event Title -->
              <q-input
                v-model="eventForm.title"
                outlined
                dense
                label="Judul Agenda / Meeting *"
                placeholder="Contoh: Diskusi Scope Project dengan Klien A"
                :error="!!formError"
                :error-message="formError"
              />

              <!-- Event Date -->
              <q-input
                v-model="eventForm.date"
                outlined
                dense
                type="date"
                label="Tanggal Agenda *"
              />

              <!-- Holiday check indicator in form -->
              <div v-if="currentFormHoliday.isHoliday" class="bg-red-1 text-negative text-caption q-pa-xs rounded-borders row items-center">
                <q-icon name="flag" class="q-mr-xs" />
                <span>Tanggal ini adalah <strong>🇮🇩 {{ currentFormHoliday.holidayName }}</strong> (Tanggal Merah).</span>
              </div>

              <!-- Time Row -->
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-input
                    v-model="eventForm.startTime"
                    outlined
                    dense
                    label="Jam Mulai"
                    placeholder="09:00"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    v-model="eventForm.endTime"
                    outlined
                    dense
                    label="Jam Selesai"
                    placeholder="10:00"
                  />
                </div>
              </div>

              <!-- Quick Time Presets -->
              <div class="row items-center q-gutter-xs">
                <span class="text-caption text-grey-7">Preset Jam:</span>
                <q-btn outline dense size="sm" color="grey-8" label="09:00" no-caps @click="eventForm.startTime = '09:00'; eventForm.endTime = '10:00'" />
                <q-btn outline dense size="sm" color="grey-8" label="13:30" no-caps @click="eventForm.startTime = '13:30'; eventForm.endTime = '14:30'" />
                <q-btn outline dense size="sm" color="grey-8" label="16:00" no-caps @click="eventForm.startTime = '16:00'; eventForm.endTime = '17:00'" />
                <q-btn outline dense size="sm" color="grey-8" label="All Day" no-caps @click="eventForm.startTime = 'All Day'; eventForm.endTime = ''" />
              </div>

              <!-- Category & Reminder -->
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-select
                    v-model="eventForm.category"
                    :options="['Meeting', 'Panggilan Klien', 'Review Desain', 'Deadline', 'Rutin', 'Pribadi']"
                    outlined
                    dense
                    label="Kategori Agenda"
                  />
                </div>
                <div class="col-6">
                  <q-select
                    v-model="eventForm.reminder"
                    :options="[
                      { label: 'Tanpa Pengingat', value: 'None' },
                      { label: '15 Menit Sebelumnya', value: '15m' },
                      { label: '30 Menit Sebelumnya', value: '30m' },
                      { label: '1 Jam Sebelumnya', value: '1h' },
                      { label: '1 Hari Sebelumnya', value: '1d' }
                    ]"
                    emit-value
                    map-options
                    outlined
                    dense
                    label="Notifikasi Pengingat"
                  />
                </div>
              </div>

              <!-- Notes -->
              <q-input
                v-model="eventForm.notes"
                outlined
                dense
                type="textarea"
                rows="2"
                label="Catatan / Link Zoom / Lokasi (opsional)"
              />

              <div class="row justify-end q-gutter-sm q-mt-md">
                <q-btn flat label="Batal" color="grey-7" v-close-popup no-caps />
                <q-btn
                  unelevated
                  color="primary"
                  :label="isEditingEvent ? 'Simpan Perubahan' : 'Tambah Agenda'"
                  type="submit"
                  no-caps
                  class="text-weight-bold"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import Swal from 'sweetalert2';
import { getIndonesianHolidayInfo } from '../utils/indonesianHolidays';

export default {
  name: 'CalendarView',
  setup() {
    const store = useStore();
    const $q = useQuasar();

    const currentDate = ref(new Date());
    const weekDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    const monthYearLabel = computed(() => {
      return currentDate.value.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    });

    const changeMonth = (delta) => {
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + delta, 1);
    };

    const goToToday = () => {
      currentDate.value = new Date();
    };

    const tasks = computed(() => store.getters.getTasks || []);
    const projects = computed(() => store.getters.getProjects || []);
    const invoices = computed(() => store.getters.getInvoices || []);
    const events = computed(() => store.getters.getEvents || []);

    // Selection & Modals
    const selectedCell = ref(null);
    const showDayDetailModal = ref(false);
    const showEventFormModal = ref(false);
    const isEditingEvent = ref(false);
    const editingEventId = ref(null);
    const formError = ref('');

    const eventForm = ref({
      title: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      category: 'Meeting',
      reminder: '30m',
      notes: ''
    });

    const currentFormHoliday = computed(() => {
      return getIndonesianHolidayInfo(eventForm.value.date);
    });

    const calendarCells = computed(() => {
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const cells = [];
      const startDayOfWeek = firstDay.getDay();

      // Prev month padding
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const d = new Date(year, month - 1, prevMonthLastDay - i);
        const iso = d.toISOString().split('T')[0];
        cells.push({
          dayNum: d.getDate(),
          dateStr: iso,
          currentMonth: false,
          isToday: false,
          holidayInfo: getIndonesianHolidayInfo(iso)
        });
      }

      // Current month
      const todayStr = new Date().toISOString().split('T')[0];
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const d = new Date(year, month, day);
        const dateStr = d.toISOString().split('T')[0];
        cells.push({
          dayNum: day,
          dateStr: dateStr,
          currentMonth: true,
          isToday: dateStr === todayStr,
          holidayInfo: getIndonesianHolidayInfo(dateStr)
        });
      }

      // Remaining cells
      const totalSoFar = cells.length;
      const needed = 35 - totalSoFar > 0 ? 35 - totalSoFar : (42 - totalSoFar > 0 ? 42 - totalSoFar : 0);
      for (let i = 1; i <= needed; i++) {
        const d = new Date(year, month + 1, i);
        const iso = d.toISOString().split('T')[0];
        cells.push({
          dayNum: d.getDate(),
          dateStr: iso,
          currentMonth: false,
          isToday: false,
          holidayInfo: getIndonesianHolidayInfo(iso)
        });
      }

      return cells;
    });

    const getEventsForDate = (dateStr) => {
      if (!dateStr) return [];
      return events.value.filter(e => e.date === dateStr);
    };

    const getTasksForDate = (dateStr) => {
      if (!dateStr) return [];
      return tasks.value.filter(t => t.deadline === dateStr);
    };

    const getProjectsForDate = (dateStr) => {
      if (!dateStr) return [];
      return projects.value.filter(p => p.deadline === dateStr);
    };

    const getInvoicesForDate = (dateStr) => {
      if (!dateStr) return [];
      return invoices.value.filter(i => i.dueDate === dateStr);
    };

    const openDayDetail = (cell) => {
      selectedCell.value = cell;
      showDayDetailModal.value = true;
    };

    const openAddEventModal = (dateStr = null) => {
      isEditingEvent.value = false;
      editingEventId.value = null;
      formError.value = '';
      const chosenDate = dateStr || (selectedCell.value ? selectedCell.value.dateStr : new Date().toISOString().split('T')[0]);
      eventForm.value = {
        title: '',
        date: chosenDate,
        startTime: '09:00',
        endTime: '10:00',
        category: 'Meeting',
        reminder: '30m',
        notes: ''
      };
      showEventFormModal.value = true;
    };

    const editEvent = (ev) => {
      isEditingEvent.value = true;
      editingEventId.value = ev.id;
      formError.value = '';
      eventForm.value = { ...ev };
      showEventFormModal.value = true;
    };

    const saveEvent = () => {
      if (!eventForm.value.title || !eventForm.value.title.trim()) {
        formError.value = 'Judul agenda wajib diisi!';
        return;
      }
      formError.value = '';

      if (isEditingEvent.value) {
        store.dispatch('updateEvent', { ...eventForm.value, id: editingEventId.value });
        $q.notify({
          type: 'positive',
          message: 'Agenda berhasil diperbarui!',
          position: 'top-right'
        });
      } else {
        store.dispatch('addEvent', eventForm.value);
        $q.notify({
          type: 'positive',
          message: 'Agenda baru berhasil ditambahkan!',
          position: 'top-right'
        });
      }

      showEventFormModal.value = false;
    };

    const deleteEvent = (id) => {
      Swal.fire({
        title: 'Hapus Agenda?',
        text: 'Agenda ini akan dihapus dari kalender.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('deleteEvent', id);
          $q.notify({
            type: 'info',
            message: 'Agenda telah dihapus.',
            position: 'top-right'
          });
        }
      });
    };

    const formatFullDate = (dateStr) => {
      if (!dateStr) return '-';
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      } catch (e) {
        return dateStr;
      }
    };

    return {
      weekDays,
      currentDate,
      monthYearLabel,
      changeMonth,
      goToToday,
      calendarCells,
      getEventsForDate,
      getTasksForDate,
      getProjectsForDate,
      getInvoicesForDate,
      selectedCell,
      showDayDetailModal,
      showEventFormModal,
      isEditingEvent,
      eventForm,
      formError,
      currentFormHoliday,
      openDayDetail,
      openAddEventModal,
      editEvent,
      saveEvent,
      deleteEvent,
      formatFullDate
    };
  }
};
</script>

<style scoped>
.calendar-container {
  max-width: 1400px;
  margin: 0 auto;
}

.calendar-grid-header,
.calendar-grid-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-cell {
  min-height: 110px;
  transition: all 0.15s ease;
  background-color: #ffffff;
}

.border-cell {
  border: 1px solid #e2e8f0;
}

.border-cell:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.border-today {
  border: 2px solid #2563eb !important;
}

.bg-red-0 {
  background-color: #fff5f5 !important;
}

.border-red-soft {
  border: 1px solid #fecaca;
}

.holiday-pill {
  background-color: #fee2e2;
  color: #b91c1c;
  font-weight: 700;
  font-size: 10px;
  line-height: 1.3;
}

.event-chip {
  font-size: 10.5px;
  line-height: 1.4;
  font-weight: 600;
}

.text-micro {
  font-size: 9.5px;
}

.fs-13 {
  font-size: 13px;
}

.min-w-160 {
  min-width: 160px;
}

.border-bottom {
  border-bottom: 1px solid #e2e8f0;
}
</style>
