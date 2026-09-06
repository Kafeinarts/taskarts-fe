<template>
  <div class="q-pa-md todo-container" data-aos="fade-up">
    <!-- Header Card (Material Design 3) -->
    <q-card flat bordered class="bg-white rounded-borders q-pa-md q-mb-md shadow-1">
      <div class="row items-center justify-between q-col-gutter-md">
        <div class="col-12 col-md-7">
          <div class="row items-center q-gutter-x-sm q-mb-xs">
            <q-badge color="primary" text-color="white" rounded label="Task Manager Pro" class="q-px-sm q-py-xs text-weight-bold" />
            <q-badge color="grey-3" text-color="grey-9" rounded label="Material Design 3" class="q-px-sm q-py-xs" />
            <q-badge color="amber-1" text-color="amber-10" rounded label="By Kafeinarts" class="q-px-sm q-py-xs text-weight-medium" />
          </div>
          <div class="text-h5 text-weight-bold text-grey-9 q-mb-xs">To-Do & Daily Productivity Tracker</div>
          <div class="text-caption text-grey-7">
            Kelola tugas harian, kelompokkan ke folder proyek, pantau deadline & tingkat produktivitas Anda.
          </div>
        </div>
        <div class="col-12 col-md-5 text-right">
          <div class="row justify-end q-gutter-sm">
            <q-btn
              outline
              color="positive"
              icon="file_download"
              label="Export Excel"
              no-caps
              class="rounded-borders"
              @click="exportToExcel"
            />
            <q-btn
              unelevated
              color="primary"
              :icon="showForm ? 'close' : 'add'"
              :label="showForm ? 'Tutup Form' : 'Tugas Baru'"
              no-caps
              class="rounded-borders text-weight-bold"
              @click="toggleShowForm"
            />
          </div>
        </div>
      </div>
    </q-card>

    <!-- Quick Add Input Bar (Frictionless Note Taking) -->
    <q-card flat bordered class="bg-white rounded-borders q-pa-sm q-mb-md shadow-1">
      <div class="row items-center q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <q-input
            v-model="quickTaskName"
            outlined
            dense
            placeholder="⚡ Ketik tugas baru & tekan Enter..."
            class="bg-grey-1"
            @keyup.enter="submitQuickTask"
          >
            <template v-slot:prepend>
              <q-icon name="check_circle_outline" color="primary" />
            </template>
          </q-input>
        </div>
        <div class="col-6 col-md-2">
          <q-select
            v-model="quickCategory"
            :options="projectFolders"
            outlined
            dense
            label="Folder"
            class="bg-grey-1"
          />
        </div>
        <div class="col-6 col-md-2">
          <q-select
            v-model="quickLevel"
            :options="['Menengah', 'Penting', 'Biasa']"
            outlined
            dense
            label="Prioritas"
            class="bg-grey-1"
          />
        </div>
        <div class="col-12 col-md-2 text-right">
          <q-btn
            unelevated
            color="primary"
            icon="send"
            label="Tambah"
            no-caps
            class="full-width rounded-borders text-weight-bold"
            @click="submitQuickTask"
          />
        </div>
      </div>
    </q-card>

    <!-- Productivity & Task Ratio Card -->
    <q-card flat bordered class="bg-white rounded-borders q-pa-md q-mb-md shadow-1">
      <div class="row items-center q-col-gutter-md">
        <!-- Progress Counter -->
        <div class="col-12 col-md-4">
          <div class="row items-center no-wrap q-gutter-x-md">
            <q-avatar size="56px" color="blue-1" text-color="primary" icon="task_alt" font-size="32px" />
            <div>
              <div class="text-caption text-weight-bold text-uppercase text-grey-6">Rasio Produktivitas</div>
              <div class="row items-baseline q-gutter-x-xs">
                <span class="text-h4 text-weight-bolder text-primary">{{ completedCount }}</span>
                <span class="text-subtitle1 text-weight-bold text-grey-6">/ {{ tasks.length }}</span>
                <q-chip
                  dense
                  :color="productivityBadge.chipColor"
                  text-color="white"
                  class="q-ml-sm text-weight-bold"
                >
                  {{ productivityBadge.label }}
                </q-chip>
              </div>
              <div class="text-caption text-grey-7">
                {{ completedCount }} tugas selesai dari {{ tasks.length }} tugas terdaftar.
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar Meter -->
        <div class="col-12 col-md-5">
          <div class="row justify-between items-center q-mb-xs">
            <span class="text-weight-bold text-caption text-grey-8">Pencapaian Hari Ini</span>
            <span class="text-weight-bolder text-primary text-subtitle2">{{ completionPercent }}% Selesai</span>
          </div>
          <q-linear-progress
            :value="completionPercent / 100"
            rounded
            size="10px"
            color="positive"
            track-color="grey-3"
            class="q-mb-xs"
          />
          <div class="row justify-between text-caption text-grey-7">
            <span><q-icon name="check_circle" color="positive" size="14px" /> {{ completedCount }} Selesai</span>
            <span><q-icon name="hourglass_empty" color="warning" size="14px" /> {{ pendingCount }} Pending</span>
          </div>
        </div>

        <!-- Deadline Notice & Clear Action -->
        <div class="col-12 col-md-3">
          <div class="bg-grey-1 q-pa-sm rounded-borders text-right">
            <div class="row items-center justify-end q-gutter-x-xs q-mb-xs">
              <q-icon :name="urgentOrOverdueCount > 0 ? 'warning' : 'verified'" :color="urgentOrOverdueCount > 0 ? 'negative' : 'positive'" size="18px" />
              <span class="text-weight-bold text-caption" :class="urgentOrOverdueCount > 0 ? 'text-negative' : 'text-positive'">
                {{ urgentOrOverdueCount > 0 ? `${urgentOrOverdueCount} Tugas Urgent/Overdue` : 'Semua Deadline Aman' }}
              </span>
            </div>
            <q-btn
              v-if="completedCount > 0"
              outline
              dense
              color="negative"
              icon="delete_sweep"
              label="Bersihkan Selesai"
              no-caps
              size="sm"
              class="q-mt-xs full-width rounded-borders"
              @click="confirmClearCompleted"
            />
          </div>
        </div>
      </div>
    </q-card>

    <!-- Filter & View Mode Bar -->
    <q-card flat bordered class="bg-white rounded-borders q-pa-sm q-mb-md shadow-1">
      <div class="row items-center justify-between q-col-gutter-sm">
        <!-- View Tabs -->
        <div class="col-12 col-md-8">
          <q-tabs
            v-model="currentViewMode"
            dense
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
            no-caps
            class="text-grey-7"
          >
            <q-tab name="list" icon="format_list_bulleted" label="Daftar (List)" />
            <q-tab name="kanban" icon="view_kanban" label="Kanban" />
            <q-tab name="eisenhower" icon="grid_view" label="Matriks Eisenhower" />
            <q-tab name="folder" icon="folder" label="Folder Proyek" />
            <q-tab name="timeline" icon="schedule" label="Timeline" />
            <q-tab name="compact" icon="checklist" label="Ringkas" />
          </q-tabs>
        </div>

        <!-- Search Input -->
        <div class="col-12 col-md-4">
          <q-input
            v-model="searchQuery"
            outlined
            dense
            placeholder="Cari tugas / tag..."
            class="bg-grey-1"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="grey-6" />
            </template>
            <template v-if="searchQuery" v-slot:append>
              <q-icon name="close" class="cursor-pointer" @click="searchQuery = ''" />
            </template>
          </q-input>
        </div>
      </div>

      <!-- Folder Chips Row -->
      <q-separator class="q-my-xs" />
      <div class="row items-center q-gutter-xs q-pt-xs overflow-auto no-wrap">
        <span class="text-caption text-weight-bold text-grey-7 q-mr-xs">Folder:</span>
        <q-chip
          clickable
          dense
          :outline="selectedCategory !== 'all'"
          color="primary"
          :text-color="selectedCategory === 'all' ? 'white' : 'primary'"
          @click="selectedCategory = 'all'"
        >
          Semua ({{ tasks.length }})
        </q-chip>
        <q-chip
          v-for="folder in projectFolders"
          :key="folder"
          clickable
          dense
          :outline="selectedCategory !== folder"
          color="primary"
          :text-color="selectedCategory === folder ? 'white' : 'primary'"
          @click="selectedCategory = folder"
        >
          📁 {{ folder }} ({{ getTaskCountInFolder(folder) }})
        </q-chip>
        <q-btn
          flat
          dense
          color="primary"
          icon="add"
          label="Folder Baru"
          no-caps
          size="sm"
          class="q-ml-sm"
          @click="promptAddCustomFolder"
        />
      </div>
    </q-card>

    <!-- Bulk Action Toolbar -->
    <q-banner
      v-if="selectedIds.length > 0"
      rounded
      class="bg-primary text-white q-mb-md shadow-1"
      dense
    >
      <template v-slot:avatar>
        <q-icon name="check_box" color="white" />
      </template>
      <span class="text-weight-bold">{{ selectedIds.length }} tugas terpilih</span>
      <template v-slot:action>
        <q-btn flat color="white" label="Tandai Selesai" no-caps @click="bulkMarkDone" />
        <q-btn flat color="white" label="Hapus Terpilih" no-caps @click="bulkDelete" />
        <q-btn flat color="white" label="Batal" no-caps @click="selectedIds = []" />
      </template>
    </q-banner>

    <!-- VIEW MODE 1: Standard List / Table -->
    <div v-if="currentViewMode === 'list'">
      <q-card flat bordered class="bg-white rounded-borders shadow-1 overflow-hidden">
        <div v-if="filteredTasks.length > 0" class="q-table__container">
          <table class="q-table full-width">
            <thead>
              <tr class="bg-grey-1 text-grey-8">
                <th style="width: 48px;" class="text-center">
                  <q-checkbox :model-value="isAllSelected" @update:model-value="toggleSelectAll" color="primary" dense />
                </th>
                <th class="text-left">Nama Tugas & Catatan</th>
                <th class="text-left" style="width: 140px;">Folder</th>
                <th class="text-left" style="width: 110px;">Prioritas</th>
                <th class="text-left" style="width: 130px;">Deadline</th>
                <th class="text-right" style="width: 130px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="task in filteredTasks"
                :key="task.id"
                :class="{ 'bg-blue-0': selectedIds.includes(task.id), 'bg-grey-1 opacity-70': task.done }"
              >
                <td class="text-center">
                  <q-checkbox v-model="selectedIds" :val="task.id" color="primary" dense />
                </td>
                <td>
                  <div class="row items-center no-wrap">
                    <q-checkbox
                      :model-value="task.done"
                      @update:model-value="toggleTaskDone(task.id)"
                      color="positive"
                      dense
                      class="q-mr-sm"
                    />
                    <div>
                      <div
                        class="text-weight-medium text-body2"
                        :class="{ 'text-strike text-grey-6': task.done, 'text-grey-9': !task.done }"
                      >
                        {{ task.name }}
                      </div>
                      <div v-if="task.notes" class="text-caption text-grey-6 text-italic">
                        {{ task.notes }}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <q-chip dense outline color="primary" class="text-weight-medium">
                    📁 {{ task.category || 'Work' }}
                  </q-chip>
                  <span v-if="task.projectTag" class="text-caption text-grey-6 d-block q-mt-xs">
                    🏷️ {{ task.projectTag }}
                  </span>
                </td>
                <td>
                  <q-chip
                    dense
                    :color="getPriorityColor(task.level)"
                    text-color="white"
                    class="text-weight-bold"
                  >
                    {{ task.level }}
                  </q-chip>
                </td>
                <td>
                  <div :class="getDeadlineInfo(task.deadline, task.done).textClass" class="text-caption text-weight-bold">
                    <q-icon name="event" size="14px" class="q-mr-xs" />
                    {{ getDeadlineInfo(task.deadline, task.done).label }}
                  </div>
                </td>
                <td class="text-right">
                  <div class="row justify-end q-gutter-xs">
                    <q-btn flat round dense color="info" icon="visibility" :to="'/tasks/' + task.id" title="Detail" size="sm" />
                    <q-btn flat round dense color="primary" icon="edit" @click="editTask(task)" title="Edit" size="sm" />
                    <q-btn flat round dense color="negative" icon="delete" @click="removeTask(task.id)" title="Hapus" size="sm" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center q-pa-xl text-grey-6">
          <q-icon name="inbox" size="48px" class="q-mb-sm text-grey-4" />
          <div class="text-subtitle1">Tidak ada tugas ditemukan</div>
          <div class="text-caption">Ketik tugas di bar atas atau buat tugas baru.</div>
        </div>
      </q-card>
    </div>

    <!-- VIEW MODE 2: Kanban Board -->
    <div v-else-if="currentViewMode === 'kanban'" class="row q-col-gutter-md">
      <div v-for="col in kanbanColumns" :key="col.id" class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="bg-grey-1 rounded-borders h-100 shadow-1">
          <div class="q-pa-sm row items-center justify-between border-bottom">
            <div class="row items-center q-gutter-x-xs">
              <q-badge :color="getColBadgeColor(col.id)" rounded :label="col.title" class="text-weight-bold q-px-sm" />
              <span class="text-caption text-grey-7 text-weight-bold">({{ getTaskCountInCol(col.id) }})</span>
            </div>
            <q-btn flat round dense icon="add" size="sm" color="grey-7" @click="openAddForCol(col.id)" />
          </div>

          <div class="q-pa-sm" style="min-height: 250px;">
            <q-card
              v-for="task in getTasksInCol(col.id)"
              :key="task.id"
              flat
              bordered
              class="bg-white q-pa-sm q-mb-sm rounded-borders shadow-1"
              :class="{ 'opacity-60 bg-green-1': task.done, 'border-red-4': getDeadlineInfo(task.deadline, task.done).isDanger }"
            >
              <div class="row items-start justify-between no-wrap q-mb-xs">
                <q-checkbox
                  :model-value="task.done"
                  @update:model-value="toggleTaskDone(task.id)"
                  color="positive"
                  dense
                  class="q-mr-xs"
                />
                <div
                  class="text-weight-bold text-body2 col"
                  :class="{ 'text-strike text-grey-6': task.done }"
                >
                  {{ task.name }}
                </div>
              </div>
              <p v-if="task.notes" class="text-caption text-grey-6 q-mb-xs ellipsis-2-lines">{{ task.notes }}</p>

              <div class="row items-center justify-between q-mt-xs">
                <q-chip dense outline color="primary" size="xs">📁 {{ task.category || 'Work' }}</q-chip>
                <q-chip dense :color="getPriorityColor(task.level)" text-color="white" size="xs">{{ task.level }}</q-chip>
              </div>

              <!-- Deadline info -->
              <div class="text-caption q-mt-xs" :class="getDeadlineInfo(task.deadline, task.done).textClass">
                <q-icon name="schedule" size="12px" /> {{ getDeadlineInfo(task.deadline, task.done).label }}
              </div>

              <q-separator class="q-my-xs" />
              <div class="row items-center justify-between">
                <div class="row q-gutter-xs">
                  <q-btn v-if="getPrevCol(col.id)" flat dense round icon="chevron_left" size="sm" @click="moveTaskCol(task, getPrevCol(col.id))" />
                  <q-btn v-if="getNextCol(col.id)" flat dense round icon="chevron_right" size="sm" @click="moveTaskCol(task, getNextCol(col.id))" />
                </div>
                <div class="row q-gutter-xs">
                  <q-btn flat round dense icon="edit" size="sm" color="primary" @click="editTask(task)" />
                  <q-btn flat round dense icon="delete" size="sm" color="negative" @click="removeTask(task.id)" />
                </div>
              </div>
            </q-card>
          </div>
        </q-card>
      </div>
    </div>

    <!-- VIEW MODE 3: Matriks Eisenhower -->
    <div v-else-if="currentViewMode === 'eisenhower'" class="row q-col-gutter-md">
      <!-- 1. Do First -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="bg-white rounded-borders q-pa-md shadow-1 border-left-danger">
          <div class="text-subtitle1 text-weight-bold text-negative row items-center q-mb-xs">
            <q-icon name="local_fire_department" class="q-mr-xs" /> 1. Kerjakan Sekarang (Do First)
          </div>
          <div class="text-caption text-grey-6 q-mb-sm">Penting & Mendesak</div>
          <q-list separator>
            <q-item v-for="t in getEisenhowerTasks('do_first')" :key="t.id" dense class="q-px-none">
              <q-item-section side>
                <q-checkbox :model-value="t.done" @update:model-value="toggleTaskDone(t.id)" color="positive" dense />
              </q-item-section>
              <q-item-section>
                <q-item-label :class="{ 'text-strike text-grey-6': t.done, 'text-weight-bold text-negative': getDeadlineInfo(t.deadline, t.done).isDanger }">
                  {{ t.name }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <span class="text-caption" :class="getDeadlineInfo(t.deadline, t.done).textClass">
                  {{ getDeadlineInfo(t.deadline, t.done).label }}
                </span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- 2. Schedule -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="bg-white rounded-borders q-pa-md shadow-1 border-left-primary">
          <div class="text-subtitle1 text-weight-bold text-primary row items-center q-mb-xs">
            <q-icon name="event" class="q-mr-xs" /> 2. Jadwalkan (Schedule)
          </div>
          <div class="text-caption text-grey-6 q-mb-sm">Penting, Tidak Mendesak</div>
          <q-list separator>
            <q-item v-for="t in getEisenhowerTasks('schedule')" :key="t.id" dense class="q-px-none">
              <q-item-section side>
                <q-checkbox :model-value="t.done" @update:model-value="toggleTaskDone(t.id)" color="positive" dense />
              </q-item-section>
              <q-item-section>
                <q-item-label :class="{ 'text-strike text-grey-6': t.done }">{{ t.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <span class="text-caption text-grey-7">{{ getDeadlineInfo(t.deadline, t.done).label }}</span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- 3. Delegate -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="bg-white rounded-borders q-pa-md shadow-1 border-left-warning">
          <div class="text-subtitle1 text-weight-bold text-warning row items-center q-mb-xs">
            <q-icon name="group" class="q-mr-xs" /> 3. Delegasikan (Delegate)
          </div>
          <div class="text-caption text-grey-6 q-mb-sm">Mendesak, Tidak Penting</div>
          <q-list separator>
            <q-item v-for="t in getEisenhowerTasks('delegate')" :key="t.id" dense class="q-px-none">
              <q-item-section side>
                <q-checkbox :model-value="t.done" @update:model-value="toggleTaskDone(t.id)" color="positive" dense />
              </q-item-section>
              <q-item-section>
                <q-item-label :class="{ 'text-strike text-grey-6': t.done }">{{ t.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <span class="text-caption text-grey-7">{{ getDeadlineInfo(t.deadline, t.done).label }}</span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- 4. Eliminate -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="bg-white rounded-borders q-pa-md shadow-1 border-left-grey">
          <div class="text-subtitle1 text-weight-bold text-grey-8 row items-center q-mb-xs">
            <q-icon name="delete_sweep" class="q-mr-xs" /> 4. Eliminasi (Eliminate)
          </div>
          <div class="text-caption text-grey-6 q-mb-sm">Tidak Penting & Tidak Mendesak</div>
          <q-list separator>
            <q-item v-for="t in getEisenhowerTasks('eliminate')" :key="t.id" dense class="q-px-none">
              <q-item-section side>
                <q-checkbox :model-value="t.done" @update:model-value="toggleTaskDone(t.id)" color="positive" dense />
              </q-item-section>
              <q-item-section>
                <q-item-label :class="{ 'text-strike text-grey-6': t.done }">{{ t.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <span class="text-caption text-grey-7">{{ getDeadlineInfo(t.deadline, t.done).label }}</span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- VIEW MODE 4: Project Folder Group -->
    <div v-else-if="currentViewMode === 'folder'" class="row q-col-gutter-md">
      <div v-for="folder in projectFolders" :key="folder" class="col-12 col-md-6">
        <q-card flat bordered class="bg-white rounded-borders shadow-1 h-100">
          <div class="q-pa-sm bg-grey-1 row items-center justify-between border-bottom">
            <div class="row items-center q-gutter-x-xs">
              <q-icon name="folder" color="primary" size="20px" />
              <span class="text-weight-bold text-body2">{{ folder }}</span>
              <span class="text-caption text-grey-6">({{ getTasksInFolder(folder).length }})</span>
            </div>
            <q-chip dense color="positive" text-color="white" class="text-weight-bold">
              {{ getFolderCompletedCount(folder) }} / {{ getTasksInFolder(folder).length }} Selesai
            </q-chip>
          </div>

          <q-card-section class="q-pa-sm">
            <q-list v-if="getTasksInFolder(folder).length > 0" separator>
              <q-item v-for="t in getTasksInFolder(folder)" :key="t.id" dense class="q-px-xs">
                <q-item-section side>
                  <q-checkbox :model-value="t.done" @update:model-value="toggleTaskDone(t.id)" color="positive" dense />
                </q-item-section>
                <q-item-section>
                  <q-item-label :class="{ 'text-strike text-grey-6': t.done }">{{ t.name }}</q-item-label>
                  <q-item-label caption v-if="t.projectTag">🏷️ {{ t.projectTag }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row items-center q-gutter-xs">
                    <span class="text-caption" :class="getDeadlineInfo(t.deadline, t.done).textClass">
                      {{ getDeadlineInfo(t.deadline, t.done).label }}
                    </span>
                    <q-btn flat round dense icon="edit" size="xs" color="primary" @click="editTask(t)" />
                    <q-btn flat round dense icon="delete" size="xs" color="negative" @click="removeTask(t.id)" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-center text-grey-5 q-pa-md text-caption">
              Belum ada tugas di folder ini.
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- VIEW MODE 5: Timeline -->
    <div v-else-if="currentViewMode === 'timeline'" class="q-gutter-y-md">
      <q-card v-for="(groupTasks, dateStr) in timelineGroupedTasks" :key="dateStr" flat bordered class="bg-white rounded-borders shadow-1 q-pa-md">
        <div class="row items-center q-gutter-x-sm q-mb-sm">
          <q-badge :color="getDeadlineInfo(dateStr, false).isDanger ? 'negative' : 'primary'" class="text-weight-bold q-px-sm q-py-xs">
            <q-icon name="event" size="14px" class="q-mr-xs" /> {{ formatDate(dateStr) }}
          </q-badge>
          <span class="text-caption text-weight-bold" :class="getDeadlineInfo(dateStr, false).textClass">
            ({{ groupTasks.length }} tugas) - {{ getDeadlineInfo(dateStr, false).label }}
          </span>
        </div>
        <div class="row q-col-gutter-sm">
          <div v-for="t in groupTasks" :key="t.id" class="col-12 col-md-6">
            <div class="bg-grey-1 q-pa-sm rounded-borders row items-center justify-between border">
              <div>
                <span class="text-weight-medium text-body2" :class="{ 'text-strike text-grey-6': t.done, 'text-negative text-weight-bold': getDeadlineInfo(t.deadline, t.done).isDanger }">
                  {{ t.name }}
                </span>
                <div class="row q-gutter-x-xs q-mt-xs">
                  <q-chip dense outline color="primary" size="xs">📁 {{ t.category || 'Work' }}</q-chip>
                  <q-chip dense outline color="grey-7" size="xs" v-if="t.projectTag">{{ t.projectTag }}</q-chip>
                </div>
              </div>
              <q-checkbox :model-value="t.done" @update:model-value="toggleTaskDone(t.id)" color="positive" dense />
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <!-- VIEW MODE 6: Compact Checklist -->
    <div v-else-if="currentViewMode === 'compact'">
      <q-card flat bordered class="bg-white rounded-borders q-pa-md shadow-1">
        <q-list separator>
          <q-item v-for="t in filteredTasks" :key="t.id" dense>
            <q-item-section side>
              <q-checkbox :model-value="t.done" @update:model-value="toggleTaskDone(t.id)" color="positive" dense />
            </q-item-section>
            <q-item-section>
              <q-item-label :class="{ 'text-strike text-grey-6': t.done }">{{ t.name }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="row items-center q-gutter-x-xs">
                <q-chip dense outline color="primary" size="xs">📁 {{ t.category || 'Work' }}</q-chip>
                <span class="text-caption text-weight-bold" :class="getDeadlineInfo(t.deadline, t.done).textClass">
                  {{ getDeadlineInfo(t.deadline, t.done).label }}
                </span>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <!-- Full Add/Edit Modal (Quasar Dialog) -->
    <q-dialog v-model="showForm" persistent>
      <q-card style="width: 650px; max-width: 95vw;" class="rounded-borders">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Edit Tugas' : 'Tambah Tugas Baru' }}</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <q-form @submit.prevent="saveTask">
            <div class="q-gutter-y-sm">
              <!-- Task Name + Speech Dictation -->
              <q-input
                v-model="form.name"
                outlined
                dense
                label="Nama Tugas / Aktivitas *"
                :error="!!formErrors.name"
                :error-message="formErrors.name"
              >
                <template v-slot:append>
                  <q-btn
                    round
                    dense
                    flat
                    :icon="isListening ? 'mic' : 'mic_none'"
                    :color="isListening ? 'negative' : 'grey-7'"
                    @click="toggleSpeechRecognition('name')"
                    title="Dikte Suara"
                  />
                </template>
              </q-input>

              <!-- Folder Selector + Add Folder -->
              <div class="row q-col-gutter-sm">
                <div class="col-8">
                  <q-select
                    v-model="form.category"
                    :options="projectFolders"
                    outlined
                    dense
                    label="Project Folder *"
                  />
                </div>
                <div class="col-4">
                  <q-btn
                    outline
                    color="primary"
                    icon="create_new_folder"
                    label="+ Folder"
                    no-caps
                    dense
                    class="full-width rounded-borders"
                    style="height: 40px;"
                    @click="promptAddCustomFolder"
                  />
                </div>
              </div>

              <!-- Priority + Smart Priority AI -->
              <div class="row items-center justify-between">
                <span class="text-caption text-weight-bold text-grey-8">Prioritas</span>
                <q-btn
                  flat
                  dense
                  color="primary"
                  icon="auto_awesome"
                  label="Smart AI Suggestion"
                  no-caps
                  size="sm"
                  @click="runSmartPriorityAi"
                />
              </div>
              <div v-if="smartPriorityReason" class="text-caption text-primary text-weight-medium bg-blue-1 q-pa-xs rounded-borders">
                {{ smartPriorityReason }}
              </div>
              <q-select
                v-model="form.level"
                :options="['Menengah', 'Penting', 'Biasa']"
                outlined
                dense
                label="Tingkat Prioritas"
              />

              <!-- Subtag & Kanban Column -->
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-input v-model="form.projectTag" outlined dense label="Sub-tag (opsional)" />
                </div>
                <div class="col-6">
                  <q-select
                    v-model="form.statusColumn"
                    :options="[
                      { label: 'Backlog', value: 'backlog' },
                      { label: 'To Do', value: 'todo' },
                      { label: 'In Progress', value: 'in_progress' },
                      { label: 'Completed', value: 'done' }
                    ]"
                    emit-value
                    map-options
                    outlined
                    dense
                    label="Kolom Kanban"
                  />
                </div>
              </div>

              <!-- Deadline Picker -->
              <div>
                <q-input
                  v-model="form.deadline"
                  outlined
                  dense
                  type="date"
                  label="Target Deadline *"
                  :error="!!formErrors.deadline"
                  :error-message="formErrors.deadline"
                />
                <div class="row q-gutter-xs q-mt-xs">
                  <q-btn outline dense size="sm" color="grey-8" label="Hari Ini" no-caps @click="setFormDeadline('today')" />
                  <q-btn outline dense size="sm" color="grey-8" label="Besok" no-caps @click="setFormDeadline('tomorrow')" />
                  <q-btn outline dense size="sm" color="grey-8" label="+3 Hari" no-caps @click="setFormDeadline('in3days')" />
                  <q-btn outline dense size="sm" color="grey-8" label="Minggu Depan" no-caps @click="setFormDeadline('nextweek')" />
                </div>
              </div>

              <!-- Recurring & Eisenhower -->
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-select
                    v-model="form.recurring"
                    :options="[
                      { label: 'Sekali (none)', value: 'none' },
                      { label: 'Harian (daily)', value: 'daily' },
                      { label: 'Mingguan (weekly)', value: 'weekly' },
                      { label: 'Bulanan (monthly)', value: 'monthly' }
                    ]"
                    emit-value
                    map-options
                    outlined
                    dense
                    label="Pengulangan (Recurring)"
                  />
                </div>
                <div class="col-6">
                  <q-select
                    v-model="form.eisenhower"
                    :options="[
                      { label: 'Do First (Penting & Mendesak)', value: 'do_first' },
                      { label: 'Schedule (Penting, Tidak Mendesak)', value: 'schedule' },
                      { label: 'Delegate (Mendesak, Tidak Penting)', value: 'delegate' },
                      { label: 'Eliminate (Santai/Opsional)', value: 'eliminate' }
                    ]"
                    emit-value
                    map-options
                    outlined
                    dense
                    label="Kategori Eisenhower"
                  />
                </div>
              </div>

              <!-- Notes -->
              <q-input
                v-model="form.notes"
                outlined
                dense
                type="textarea"
                rows="2"
                label="Catatan Tambahan (opsional)"
              />

              <div class="row justify-end q-gutter-sm q-mt-md">
                <q-btn flat label="Batal" color="grey-7" v-close-popup no-caps />
                <q-btn unelevated color="primary" :label="isEditing ? 'Simpan Perubahan' : 'Tambah Tugas'" type="submit" no-caps class="text-weight-bold" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Toast Notice -->
    <q-banner
      v-if="toast.show"
      dense
      rounded
      class="bg-positive text-white fixed-bottom-right q-ma-md shadow-3"
      style="z-index: 9999;"
    >
      <template v-slot:avatar>
        <q-icon name="check_circle" color="white" />
      </template>
      {{ toast.message }}
      <template v-slot:action>
        <q-btn flat round dense icon="close" color="white" @click="toast.show = false" />
      </template>
    </q-banner>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { safeSetItem } from '../utils/storageManager';

export default {
  name: 'TodoList',
  setup() {
    const store = useStore();

    const currentViewMode = ref('list');
    const searchQuery = ref('');
    const selectedCategory = ref('all');
    const showForm = ref(false);
    const formTab = ref('single');
    const isEditing = ref(false);
    const editingId = ref(null);
    const selectedIds = ref([]);

    // Quick Add Bar state
    const quickTaskName = ref('');
    const quickCategory = ref('Work');
    const quickLevel = ref('Menengah');

    const submitQuickTask = () => {
      if (!quickTaskName.value || !quickTaskName.value.trim()) return;
      const payload = {
        name: quickTaskName.value.trim(),
        category: quickCategory.value || 'Work',
        level: quickLevel.value || 'Menengah',
        projectTag: 'Umum',
        deadline: new Date().toISOString().split('T')[0],
        statusColumn: 'todo',
        eisenhower: 'do_first',
        done: false
      };
      store.dispatch('addTask', payload);
      quickTaskName.value = '';
      showToastMsg('Tugas baru berhasil ditambahkan!');
    };

    // Web Speech API Voice Recognition
    const isListening = ref(false);
    let recognition = null;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const toggleSpeechRecognition = (field = 'notes') => {
      if (!SpeechRecognition) {
        showToastMsg('Browser Anda tidak mendukung Web Speech API atau butuh izin mikrofon.');
        return;
      }

      if (isListening.value) {
        if (recognition) recognition.stop();
        isListening.value = false;
        return;
      }

      recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.interimResults = true;
      isListening.value = true;

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (field === 'name') {
          form.value.name = transcript;
        } else {
          form.value.notes = (form.value.notes ? form.value.notes + ' ' : '') + transcript;
        }
      };

      recognition.onerror = () => {
        isListening.value = false;
      };

      recognition.onend = () => {
        isListening.value = false;
      };

      recognition.start();
    };

    // Smart Priority AI Engine
    const smartPriorityReason = ref('');

    const runSmartPriorityAi = () => {
      const nameStr = ((form.value.name || '') + ' ' + (form.value.notes || '')).toLowerCase();
      if (!nameStr.trim()) {
        smartPriorityReason.value = '⚠️ Masukkan nama atau detail tugas untuk analisa AI.';
        return;
      }

      const urgentKeywords = ['urgent', 'penting', 'secepatnya', 'asap', 'klien', 'bug', 'error', 'bayar', 'invoice', 'atasan', 'presentasi', 'critical', 'mendesak', 'deadline'];
      const lowKeywords = ['santai', 'nanti', 'opsional', 'baca', 'rutin', 'nonton', 'hobi', 'resep', 'iseng'];

      const isUrgent = urgentKeywords.some(kw => nameStr.includes(kw));
      const isLow = lowKeywords.some(kw => nameStr.includes(kw));

      if (isUrgent) {
        form.value.level = 'Penting';
        form.value.eisenhower = 'do_first';
        smartPriorityReason.value = '✨ AI: Terdeteksi kata kunci mendesak. Level disesuaikan ke Penting (Urgent).';
      } else if (isLow) {
        form.value.level = 'Biasa';
        form.value.eisenhower = 'eliminate';
        smartPriorityReason.value = '✨ AI: Aktivitas santai/opsional. Level disesuaikan ke Biasa (Low).';
      } else {
        form.value.level = 'Menengah';
        form.value.eisenhower = 'schedule';
        smartPriorityReason.value = '✨ AI: Tugas standar. Level disesuaikan ke Menengah (Medium).';
      }
    };

    const toast = ref({ show: false, message: '' });

    // Custom Project Folders list state
    const DEFAULT_FOLDERS = ['Work', 'Personal', 'Urgent', 'Client Project', 'Routine', 'Marketing', 'Development'];
    const projectFolders = ref([]);

    const loadFolders = () => {
      try {
        const stored = localStorage.getItem('ft_custom_folders');
        if (stored) {
          projectFolders.value = JSON.parse(stored);
        } else {
          projectFolders.value = [...DEFAULT_FOLDERS];
          safeSetItem('ft_custom_folders', projectFolders.value);
        }
      } catch (e) {
        projectFolders.value = [...DEFAULT_FOLDERS];
      }
    };

    const addCustomFolder = (folderName) => {
      if (!folderName || !folderName.trim()) return;
      const clean = folderName.trim();
      if (!projectFolders.value.includes(clean)) {
        projectFolders.value.push(clean);
        safeSetItem('ft_custom_folders', projectFolders.value);
        showToastMsg(`Folder proyek "${clean}" berhasil ditambahkan!`);
      }
    };

    const promptAddCustomFolder = () => {
      Swal.fire({
        title: 'Folder Baru',
        input: 'text',
        inputLabel: 'Masukkan nama Project Folder baru:',
        inputPlaceholder: 'misal: Marketing, Desain, Client A...',
        showCancelButton: true,
        confirmButtonText: 'Simpan Folder',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#2563eb',
        inputValidator: (value) => {
          if (!value || !value.trim()) {
            return 'Nama folder tidak boleh kosong!';
          }
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          addCustomFolder(result.value);
          form.value.category = result.value.trim();
          quickCategory.value = result.value.trim();
        }
      });
    };

    onMounted(() => {
      loadFolders();
    });

    const form = ref({
      name: '',
      category: 'Work',
      level: 'Menengah',
      projectTag: 'Umum',
      deadline: new Date().toISOString().split('T')[0],
      notes: '',
      recurring: 'none',
      statusColumn: 'todo',
      eisenhower: 'do_first',
      done: false
    });

    const formErrors = ref({});

    const kanbanColumns = [
      { id: 'backlog', title: 'Backlog' },
      { id: 'todo', title: 'To Do' },
      { id: 'in_progress', title: 'In Progress' },
      { id: 'done', title: 'Completed' }
    ];

    const getColBadgeColor = (colId) => {
      switch (colId) {
        case 'backlog': return 'grey-7';
        case 'todo': return 'primary';
        case 'in_progress': return 'warning';
        case 'done': return 'positive';
        default: return 'grey';
      }
    };

    const tasks = computed(() => store.getters.getTasks || []);
    const completedCount = computed(() => tasks.value.filter(t => t.done || t.statusColumn === 'done').length);
    const pendingCount = computed(() => tasks.value.filter(t => !t.done && t.statusColumn !== 'done').length);
    const completionPercent = computed(() => {
      if (tasks.value.length === 0) return 0;
      return Math.round((completedCount.value / tasks.value.length) * 100);
    });

    const productivityBadge = computed(() => {
      const pct = completionPercent.value;
      if (pct === 100) {
        return { label: '🔥 100% Selesai!', chipColor: 'positive' };
      } else if (pct >= 70) {
        return { label: '⚡ Produktif', chipColor: 'primary' };
      } else if (pct >= 40) {
        return { label: '📈 Sedang', chipColor: 'secondary' };
      } else {
        return { label: '🌱 Ayo Mulai', chipColor: 'warning' };
      }
    });

    const getDeadlineInfo = (deadlineStr, done) => {
      if (done) {
        return { status: 'completed', isDanger: false, label: 'Selesai', textClass: 'text-grey-6' };
      }
      if (!deadlineStr) {
        return { status: 'none', isDanger: false, label: 'Tanpa Deadline', textClass: 'text-grey-6' };
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const deadline = new Date(deadlineStr);
      deadline.setHours(0, 0, 0, 0);

      const diffTime = deadline - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        const absDays = Math.abs(diffDays);
        return { status: 'overdue', isDanger: true, label: `⚠️ Overdue (${absDays} hari lalu)`, textClass: 'text-negative text-weight-bold' };
      } else if (diffDays === 0) {
        return { status: 'today', isDanger: true, label: '🔥 Deadline Hari Ini!', textClass: 'text-negative text-weight-bold' };
      } else if (diffDays === 1) {
        return { status: 'tomorrow', isDanger: true, label: '⏰ Deadline Besok!', textClass: 'text-negative text-weight-bold' };
      } else {
        return { status: 'future', isDanger: false, label: formatDate(deadlineStr), textClass: 'text-grey-8' };
      }
    };

    const urgentOrOverdueCount = computed(() => {
      return tasks.value.filter(t => !t.done && getDeadlineInfo(t.deadline, false).isDanger).length;
    });

    const filteredTasks = computed(() => {
      return tasks.value.filter(t => {
        const query = searchQuery.value.toLowerCase();
        const matchesQuery = !query ||
          t.name.toLowerCase().includes(query) ||
          (t.projectTag && t.projectTag.toLowerCase().includes(query)) ||
          (t.category && t.category.toLowerCase().includes(query));

        const matchesCategory = selectedCategory.value === 'all' || (t.category || 'Work') === selectedCategory.value;
        return matchesQuery && matchesCategory;
      });
    });

    const isAllSelected = computed(() => {
      if (filteredTasks.value.length === 0) return false;
      return filteredTasks.value.every(t => selectedIds.value.includes(t.id));
    });

    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selectedIds.value = [];
      } else {
        selectedIds.value = filteredTasks.value.map(t => t.id);
      }
    };

    const getTasksInCol = (colId) => {
      return filteredTasks.value.filter(t => (t.statusColumn || 'todo') === colId);
    };

    const getTaskCountInCol = (colId) => {
      return getTasksInCol(colId).length;
    };

    const getTasksInFolder = (folderName) => {
      return filteredTasks.value.filter(t => (t.category || 'Work') === folderName);
    };

    const getTaskCountInFolder = (folderName) => {
      return tasks.value.filter(t => (t.category || 'Work') === folderName).length;
    };

    const getFolderCompletedCount = (folderName) => {
      return getTasksInFolder(folderName).filter(t => t.done).length;
    };

    const getEisenhowerTasks = (quadrant) => {
      return filteredTasks.value.filter(t => (t.eisenhower || 'do_first') === quadrant);
    };

    const timelineGroupedTasks = computed(() => {
      const groups = {};
      filteredTasks.value.forEach(t => {
        const dateKey = t.deadline || 'Tanpa Deadline';
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(t);
      });
      return groups;
    });

    const showToastMsg = (msg) => {
      toast.value.message = msg;
      toast.value.show = true;
      setTimeout(() => (toast.value.show = false), 3000);
    };

    const toggleShowForm = () => {
      if (showForm.value) {
        showForm.value = false;
      } else {
        openAddModal();
      }
    };

    const openAddModal = () => {
      isEditing.value = false;
      editingId.value = null;
      formErrors.value = {};
      form.value = {
        name: '',
        category: quickCategory.value || 'Work',
        level: 'Menengah',
        projectTag: 'Umum',
        deadline: new Date().toISOString().split('T')[0],
        notes: '',
        recurring: 'none',
        statusColumn: 'todo',
        eisenhower: 'do_first',
        done: false
      };
      showForm.value = true;
    };

    const setFormDeadline = (type) => {
      const d = new Date();
      if (type === 'today') {
        // today
      } else if (type === 'tomorrow') {
        d.setDate(d.getDate() + 1);
      } else if (type === 'in3days') {
        d.setDate(d.getDate() + 3);
      } else if (type === 'nextweek') {
        d.setDate(d.getDate() + 7);
      }
      form.value.deadline = d.toISOString().split('T')[0];
    };

    const openAddForCol = (colId) => {
      openAddModal();
      form.value.statusColumn = colId;
    };

    const editTask = (task) => {
      isEditing.value = true;
      editingId.value = task.id;
      formErrors.value = {};
      form.value = { ...task };
      showForm.value = true;
    };

    const saveTask = () => {
      formErrors.value = {};
      if (!form.value.name || !form.value.name.trim()) {
        formErrors.value.name = 'Nama tugas tidak boleh kosong!';
        return;
      }
      if (!form.value.deadline) {
        formErrors.value.deadline = 'Target deadline wajib diisi!';
        return;
      }

      if (form.value.category) {
        addCustomFolder(form.value.category);
      }

      if (isEditing.value) {
        store.dispatch('updateTask', { ...form.value, id: editingId.value });
        showToastMsg('Tugas berhasil diperbarui!');
      } else {
        store.dispatch('addTask', form.value);
        showToastMsg('Tugas baru berhasil ditambahkan!');
      }
      showForm.value = false;
    };

    const toggleTaskDone = (id) => {
      store.dispatch('toggleTask', id);
    };

    const moveTaskCol = (task, newCol) => {
      if (!newCol) return;
      store.dispatch('updateTaskStatus', { id: task.id, statusColumn: newCol });
      showToastMsg(`Status dipindah ke ${newCol}`);
    };

    const getPrevCol = (colId) => {
      if (colId === 'done') return 'in_progress';
      if (colId === 'in_progress') return 'todo';
      if (colId === 'todo') return 'backlog';
      return null;
    };

    const getNextCol = (colId) => {
      if (colId === 'backlog') return 'todo';
      if (colId === 'todo') return 'in_progress';
      if (colId === 'in_progress') return 'done';
      return null;
    };

    const removeTask = (taskOrId) => {
      let targetTask = null;
      if (typeof taskOrId === 'object' && taskOrId !== null) {
        targetTask = taskOrId;
      } else {
        targetTask = tasks.value.find(t => String(t.id) === String(taskOrId));
      }
      const targetId = targetTask ? targetTask.id : taskOrId;
      const targetTitle = targetTask ? targetTask.name : 'Tugas ini';

      Swal.fire({
        title: 'Hapus Tugas?',
        html: `Hapus tugas <strong>"${targetTitle}"</strong> secara permanen?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('deleteTask', targetId);
          showToastMsg('Tugas berhasil dihapus.');
        }
      });
    };

    const bulkDelete = () => {
      if (selectedIds.value.length === 0) return;
      Swal.fire({
        title: 'Hapus Masal Tugas?',
        html: `Hapus <strong>${selectedIds.value.length} tugas terpilih</strong> secara permanen?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus Semua',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('deleteTasksBulk', selectedIds.value);
          selectedIds.value = [];
          showToastMsg('Tugas terpilih berhasil dihapus.');
        }
      });
    };

    const bulkMarkDone = () => {
      if (selectedIds.value.length === 0) return;
      selectedIds.value.forEach(id => {
        const t = tasks.value.find(item => item.id === id);
        if (t && !t.done) {
          store.dispatch('toggleTask', id);
        }
      });
      showToastMsg(`${selectedIds.value.length} tugas ditandai selesai.`);
      selectedIds.value = [];
    };

    const confirmClearCompleted = () => {
      if (completedCount.value === 0) return;
      Swal.fire({
        title: 'Bersihkan Task Selesai?',
        html: `Bersihkan <strong>${completedCount.value} tugas yang telah selesai</strong>?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Bersihkan',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          const completedIds = tasks.value.filter(t => t.done || t.statusColumn === 'done').map(t => t.id);
          if (completedIds.length > 0) {
            store.dispatch('deleteTasksBulk', completedIds);
            showToastMsg('Semua tugas selesai berhasil dibersihkan.');
          }
        }
      });
    };

    const getPriorityColor = (level) => {
      switch (level) {
        case 'Penting': return 'negative';
        case 'Menengah': return 'warning';
        default: return 'grey-7';
      }
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return '-';
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      } catch (e) {
        return dateStr;
      }
    };

    const exportToExcel = () => {
      const exportData = tasks.value.map((t, idx) => ({
        No: idx + 1,
        NamaTugas: t.name,
        ProjectFolder: t.category || 'Work',
        ProyekTag: t.projectTag || 'Umum',
        Prioritas: t.level,
        Recurring: t.recurring || 'none',
        KolomStatus: t.statusColumn || 'todo',
        Deadline: t.deadline,
        Status: t.done ? 'Selesai' : 'Pending',
        Catatan: t.notes || ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Tugas');
      XLSX.writeFile(workbook, 'daftar_tugas_freelance.xlsx');
      showToastMsg('File Excel daftar tugas berhasil diunduh!');
    };

    return {
      currentViewMode,
      kanbanColumns,
      getColBadgeColor,
      searchQuery,
      selectedCategory,
      projectFolders,
      promptAddCustomFolder,
      quickTaskName,
      quickCategory,
      quickLevel,
      submitQuickTask,
      getTaskCountInFolder,
      getTasksInFolder,
      getFolderCompletedCount,
      tasks,
      filteredTasks,
      completedCount,
      pendingCount,
      completionPercent,
      productivityBadge,
      getDeadlineInfo,
      urgentOrOverdueCount,
      getTasksInCol,
      getTaskCountInCol,
      getEisenhowerTasks,
      timelineGroupedTasks,
      showForm,
      formTab,
      isEditing,
      form,
      formErrors,
      setFormDeadline,
      selectedIds,
      isAllSelected,
      toggleSelectAll,
      isListening,
      toggleSpeechRecognition,
      smartPriorityReason,
      runSmartPriorityAi,
      toast,
      toggleShowForm,
      openAddModal,
      openAddForCol,
      editTask,
      saveTask,
      toggleTaskDone,
      moveTaskCol,
      getPrevCol,
      getNextCol,
      removeTask,
      bulkDelete,
      bulkMarkDone,
      confirmClearCompleted,
      getPriorityColor,
      formatDate,
      exportToExcel
    };
  }
};
</script>

<style scoped>
.todo-container {
  max-width: 1400px;
  margin: 0 auto;
}

.border-bottom {
  border-bottom: 1px solid #e2e8f0;
}

.border-left-danger {
  border-left: 4px solid #ef4444;
}

.border-left-primary {
  border-left: 4px solid #2563eb;
}

.border-left-warning {
  border-left: 4px solid #f59e0b;
}

.border-left-grey {
  border-left: 4px solid #64748b;
}

.border-red-4 {
  border: 1.5px solid #ef4444 !important;
}

.q-table tbody td {
  font-size: 13.5px;
  padding: 10px 12px;
}

.q-table thead th {
  font-size: 12.5px;
  font-weight: 700;
  padding: 10px 12px;
}

.opacity-70 {
  opacity: 0.7;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
