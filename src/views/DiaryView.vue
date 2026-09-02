<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- ========================================================================= -->
    <!-- MODE 1: MAIN DIARY LIST, TIMELINE & CALENDAR VIEW -->
    <!-- ========================================================================= -->
    <div v-if="activeMode === 'list'">
      <!-- Header Banner -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border diary-header-banner">
        <div>
          <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-1.5 rounded-pill">
              <i class="bi bi-book-half me-1"></i> RajinKerja Diary & Journal
            </span>
            <span class="badge bg-warning-subtle text-dark fw-bold px-3 py-1.5 rounded-pill">
              <i class="bi bi-markdown-fill me-1"></i> Markdown & Rich Media
            </span>
            <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-1.5 rounded-pill d-flex align-items-center gap-1">
              <span class="pulse-dot bg-success"></span> {{ diaries.length }} Cerita Tersimpan
            </span>
          </div>
          <h2 class="fw-extrabold mb-1 text-dark">📖 Diary & Jurnal Cerita Harian</h2>
          <p class="text-muted mb-0">Tuliskan kisah keseharian, lampirkan foto momen berharga, rekam suasana hati (mood & cuaca), serta refleksi hidup dengan format Markdown yang rapi & cantik.</p>
        </div>

        <div class="d-flex flex-wrap gap-2">
          <button
            class="btn btn-warning text-dark px-3 py-2.5 rounded-3 fw-bold d-flex align-items-center gap-2 border shadow-sm"
            @click="toggleMode('scratchpad')"
          >
            <i class="bi bi-sticky-fill fs-5"></i>
            <span>Quick Scratchpad</span>
          </button>
          <button
            class="btn btn-primary text-white px-3 py-2.5 rounded-3 fw-bold d-flex align-items-center gap-2 border shadow-sm"
            @click="openNewStoryEditor"
          >
            <i class="bi bi-pencil-square fs-5"></i>
            <span>Tulis Cerita Baru</span>
          </button>
          <button
            class="btn btn-outline-dark px-3 py-2.5 rounded-3 fw-bold d-flex align-items-center gap-2 border shadow-sm"
            @click="togglePinLockModal"
            :title="isPinLockEnabled ? 'Pengaturan PIN Diary Aktif' : 'Atur PIN Kunci Diary'"
          >
            <i :class="isPinLockEnabled ? 'bi bi-shield-lock-fill text-warning fs-5' : 'bi bi-shield-lock fs-5'"></i>
            <span class="d-none d-sm-inline">{{ isPinLockEnabled ? 'Kunci PIN' : 'Kunci PIN' }}</span>
          </button>
        </div>
      </div>

      <!-- Quick Mood Stats & Summary Ribbon -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-primary-subtle text-primary rounded-4 fs-3">
              <i class="bi bi-journal-richtext"></i>
            </div>
            <div>
              <span class="text-muted small fw-semibold d-block">Total Cerita</span>
              <h4 class="fw-black text-dark mb-0">{{ diaries.length }}</h4>
              <small class="text-muted" style="font-size: 11px;">{{ totalPhotosCount }} Foto terlampir</small>
            </div>
          </div>
        </div>

        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-warning-subtle text-warning rounded-4 fs-3">
              <span>{{ dominantMoodEmoji }}</span>
            </div>
            <div>
              <span class="text-muted small fw-semibold d-block">Mood Dominan</span>
              <h4 class="fw-black text-dark mb-0 text-truncate" style="max-width: 140px;">{{ dominantMoodLabel }}</h4>
              <small class="text-muted" style="font-size: 11px;">Suasana hati tercatat</small>
            </div>
          </div>
        </div>

        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-danger-subtle text-danger rounded-4 fs-3">
              <i class="bi bi-heart-fill"></i>
            </div>
            <div>
              <span class="text-muted small fw-semibold d-block">Momen Favorit</span>
              <h4 class="fw-black text-dark mb-0">{{ favoriteDiariesCount }}</h4>
              <small class="text-muted" style="font-size: 11px;">Cerita bertanda suka</small>
            </div>
          </div>
        </div>

        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-success-subtle text-success rounded-4 fs-3">
              <i class="bi bi-fire"></i>
            </div>
            <div>
              <span class="text-muted small fw-semibold d-block">Runtutan Menulis</span>
              <h4 class="fw-black text-dark mb-0">{{ writingStreakDays }} Hari</h4>
              <small class="text-muted" style="font-size: 11px;">Aktif membuat jurnal</small>
            </div>
          </div>
        </div>
      </div>

      <!-- SEARCH, FILTER & VIEW TOGGLES BAR -->
      <div class="bg-white p-3 rounded-4 shadow-sm border mb-4">
        <div class="row g-3 align-items-center">
          <!-- Search Input -->
          <div class="col-lg-4 col-md-6">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-search"></i></span>
              <input
                type="text"
                class="form-control bg-light border-start-0 ps-0"
                placeholder="Cari judul cerita, quote, tag, atau tempat..."
                v-model="searchQuery"
              />
              <button v-if="searchQuery" class="btn btn-light border" @click="searchQuery = ''">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          <!-- Mood Filter Dropdown / Quick Filter -->
          <div class="col-lg-3 col-md-6">
            <select class="form-select bg-light" v-model="selectedMoodFilter">
              <option value="all">🎭 Semua Suasana Hati (Mood)</option>
              <option v-for="m in moodOptions" :key="m.label" :value="m.emoji">
                {{ m.emoji }} {{ m.label }}
              </option>
            </select>
          </div>

          <!-- Category / Tag Filter -->
          <div class="col-lg-2 col-md-6">
            <select class="form-select bg-light" v-model="selectedCategoryFilter">
              <option value="all">🏷️ Semua Kategori</option>
              <option v-for="cat in availableCategories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <!-- View Mode Switcher (Cards / Timeline / Calendar) -->
          <div class="col-lg-3 col-md-6 d-flex justify-content-lg-end gap-2">
            <div class="btn-group w-100" role="group">
              <button
                type="button"
                class="btn btn-sm py-2 px-3 fw-semibold"
                :class="diaryViewStyle === 'cards' ? 'btn-primary text-white shadow-xs' : 'btn-outline-secondary'"
                @click="diaryViewStyle = 'cards'"
                title="Tampilan Grid Kartu Cerita"
              >
                <i class="bi bi-grid-fill me-1"></i> Kartu
              </button>
              <button
                type="button"
                class="btn btn-sm py-2 px-3 fw-semibold"
                :class="diaryViewStyle === 'timeline' ? 'btn-primary text-white shadow-xs' : 'btn-outline-secondary'"
                @click="diaryViewStyle = 'timeline'"
                title="Tampilan Kronologi Waktu (Timeline)"
              >
                <i class="bi bi-bezier2 me-1"></i> Timeline
              </button>
              <button
                type="button"
                class="btn btn-sm py-2 px-3 fw-semibold"
                :class="diaryViewStyle === 'calendar' ? 'btn-primary text-white shadow-xs' : 'btn-outline-secondary'"
                @click="diaryViewStyle = 'calendar'"
                title="Tampilan Kalender Bulanan"
              >
                <i class="bi bi-calendar3 me-1"></i> Kalender
              </button>
            </div>
          </div>
        </div>

        <!-- Bulk Selection Toolbar -->
        <div v-if="selectedIds.length > 0" class="mt-3 pt-2 border-top d-flex justify-content-between align-items-center bg-primary-subtle p-2.5 rounded-3">
          <span class="small fw-bold text-primary">
            <i class="bi bi-check-square-fill me-1"></i> {{ selectedIds.length }} cerita diary terpilih
          </span>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary bg-white rounded-pill px-3" @click="selectedIds = []">
              Batal Pilihan
            </button>
            <button class="btn btn-sm btn-danger rounded-pill px-3" @click="bulkDeleteSelected">
              <i class="bi bi-trash-fill me-1"></i> Hapus Terpilih
            </button>
          </div>
        </div>
      </div>

      <!-- ===================================================================== -->
      <!-- VIEW A: STORY CARDS GRID -->
      <!-- ===================================================================== -->
      <div v-if="diaryViewStyle === 'cards'">
        <div class="row g-4" v-if="filteredDiaries.length > 0">
          <div v-for="diary in filteredDiaries" :key="diary.id" class="col-md-6 col-lg-4">
            <div 
              class="card border-0 shadow-sm rounded-4 h-100 p-0 hover-card position-relative diary-story-card overflow-hidden"
              :class="[`theme-${diary.theme || 'vintage'}`, { 'is-pinned-card': diary.isPinned }]"
            >
              <!-- Card Top Color Accent Stripe -->
              <div class="diary-color-stripe"></div>

              <!-- Pinned & Privacy Badges -->
              <div class="position-absolute top-0 end-0 p-3 d-flex gap-1 z-3">
                <span v-if="diary.isPinned" class="badge bg-warning text-dark shadow-xs rounded-pill px-2.5 py-1 fw-bold" title="Dipasangi Pin di Atas">
                  <i class="bi bi-pin-angle-fill me-1"></i> Pin
                </span>
                <span v-if="diary.isPrivate" class="badge bg-dark text-white shadow-xs rounded-pill px-2.5 py-1" title="Cerita Terkunci PIN">
                  <i class="bi bi-lock-fill"></i>
                </span>
              </div>

              <!-- Cover Image (If Available) -->
              <div 
                v-if="diary.coverImage || (diary.images && diary.images.length > 0)" 
                class="diary-card-cover position-relative overflow-hidden cursor-pointer"
                @click="readDiaryDetail(diary)"
              >
                <img 
                  :src="diary.coverImage || diary.images[0]" 
                  :alt="diary.title" 
                  class="w-100 h-100 object-fit-cover transition-zoom"
                  loading="lazy"
                />
                <div class="cover-gradient-overlay position-absolute bottom-0 start-0 w-100 p-2 text-white small d-flex justify-content-between align-items-end">
                  <span class="badge bg-dark bg-opacity-75 backdrop-blur rounded-pill px-2 py-0.5" style="font-size: 10px;">
                    <i class="bi bi-images me-1"></i> {{ (diary.images || []).length }} Foto
                  </span>
                  <span v-if="diary.location" class="badge bg-dark bg-opacity-75 backdrop-blur rounded-pill px-2 py-0.5 text-truncate max-w-160" style="font-size: 10px;">
                    <i class="bi bi-geo-alt-fill text-danger me-1"></i> {{ diary.location }}
                  </span>
                </div>
              </div>

              <!-- Card Inner Body -->
              <div class="p-4 d-flex flex-column flex-grow-1">
                <!-- Header: Date, Mood & Weather Pill Strip -->
                <div class="d-flex align-items-center justify-content-between gap-2 mb-2 flex-wrap">
                  <div class="d-flex align-items-center gap-1.5">
                    <input type="checkbox" class="form-check-input mt-0 cursor-pointer me-1" :value="diary.id" v-model="selectedIds" />
                    <span class="badge bg-light text-dark border rounded-pill px-2.5 py-1 small fw-bold">
                      <i class="bi bi-calendar-event me-1 text-primary"></i> {{ formatStoryDate(diary.date || diary.createdAt) }}
                    </span>
                  </div>

                  <div class="d-flex align-items-center gap-1">
                    <span v-if="diary.mood" class="badge bg-warning-subtle text-dark border border-warning-subtle rounded-pill px-2 py-1" :title="`Mood: ${diary.moodLabel || diary.mood}`">
                      <span class="fs-6">{{ diary.mood }}</span>
                    </span>
                    <span v-if="diary.weather" class="badge bg-info-subtle text-dark border border-info-subtle rounded-pill px-2 py-1" :title="`Cuaca: ${diary.weatherLabel || diary.weather}`">
                      <span class="fs-6">{{ diary.weather }}</span>
                    </span>
                  </div>
                </div>

                <!-- Story Title -->
                <h5 
                  class="fw-bold text-dark mb-2 hover-title diary-card-title cursor-pointer line-clamp-2"
                  @click="readDiaryDetail(diary)"
                >
                  {{ diary.title || 'Untitled Story' }}
                </h5>

                <!-- Story Excerpt (Markdown Rendered or Plain Preview) -->
                <div 
                  class="diary-card-excerpt flex-grow-1 text-secondary mb-3 cursor-pointer"
                  @click="readDiaryDetail(diary)"
                >
                  <p class="small mb-0 line-clamp-3" style="line-height: 1.55;">
                    {{ getCleanExcerpt(diary.content) }}
                  </p>
                </div>

                <!-- Tags Strip -->
                <div v-if="diary.tags && diary.tags.length > 0" class="d-flex flex-wrap gap-1 mb-3">
                  <span 
                    v-for="(t, idx) in diary.tags.slice(0, 3)" 
                    :key="idx"
                    class="badge bg-light text-secondary border rounded-pill px-2 py-0.5"
                    style="font-size: 10.5px;"
                  >
                    #{{ t }}
                  </span>
                  <span v-if="diary.tags.length > 3" class="badge bg-light text-muted rounded-pill" style="font-size: 10px;">
                    +{{ diary.tags.length - 3 }}
                  </span>
                </div>

                <!-- Card Footer & Quick Action Buttons -->
                <div class="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                  <div class="d-flex align-items-center gap-1">
                    <button 
                      class="btn btn-xs rounded-circle p-1.5 btn-action-icon"
                      :class="diary.isFavorite ? 'text-danger' : 'text-muted'"
                      @click="toggleFavorite(diary.id)"
                      title="Sukai Cerita Ini"
                    >
                      <i :class="diary.isFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                    </button>
                    <button 
                      class="btn btn-xs rounded-circle p-1.5 btn-action-icon"
                      :class="diary.isPinned ? 'text-warning' : 'text-muted'"
                      @click="togglePin(diary.id)"
                      title="Pasang Pin di Atas"
                    >
                      <i :class="diary.isPinned ? 'bi bi-pin-angle-fill' : 'bi bi-pin-angle'"></i>
                    </button>
                    <button 
                      class="btn btn-xs rounded-circle p-1.5 btn-action-icon text-muted"
                      @click="copyDiaryContent(diary)"
                      title="Salin Teks Cerita"
                    >
                      <i class="bi bi-clipboard"></i>
                    </button>
                  </div>

                  <div class="d-flex align-items-center gap-1.5">
                    <button 
                      class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-1"
                      @click="readDiaryDetail(diary)"
                    >
                      <i class="bi bi-book-half"></i> Baca
                    </button>
                    <button 
                      class="btn btn-sm btn-light border rounded-circle p-1.5 text-secondary"
                      @click="editDiaryStory(diary)"
                      title="Edit Cerita"
                    >
                      <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-light border rounded-circle p-1.5 text-danger"
                      @click="deleteDiarySingle(diary.id)"
                      title="Hapus Cerita"
                    >
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5 bg-white rounded-4 shadow-sm border my-4">
          <div class="empty-state-icon mb-3 fs-1">📖</div>
          <h4 class="fw-bold mt-2 text-dark">Belum Ada Cerita Diary</h4>
          <p class="text-muted max-w-md mx-auto">
            Mulailah menuliskan kisah hari ini, perasaanmu, ide baru, atau unggah foto kenangan berharga untuk menyemangati produktivitas kerjamu.
          </p>
          <div class="d-flex justify-content-center gap-2 mt-3">
            <button class="btn btn-primary rounded-3 px-4 py-2 fw-semibold" @click="openNewStoryEditor">
              <i class="bi bi-plus-lg me-1"></i> Tulis Cerita Baru
            </button>
            <button class="btn btn-warning rounded-3 px-4 py-2 fw-semibold text-dark" @click="toggleMode('scratchpad')">
              <i class="bi bi-sticky-fill me-1"></i> Quick Scratchpad
            </button>
          </div>
        </div>
      </div>

      <!-- ===================================================================== -->
      <!-- VIEW B: CHRONOLOGICAL TIMELINE STREAM -->
      <!-- ===================================================================== -->
      <div v-else-if="diaryViewStyle === 'timeline'" class="diary-timeline-container my-3">
        <div v-if="filteredDiaries.length > 0" class="position-relative ps-4 ps-md-5">
          <div class="timeline-vertical-spine"></div>

          <div 
            v-for="diary in filteredDiaries" 
            :key="diary.id" 
            class="timeline-item mb-4 position-relative"
          >
            <!-- Timeline Icon Dot -->
            <div class="timeline-dot shadow-sm">
              <span>{{ diary.mood || '📝' }}</span>
            </div>

            <!-- Timeline Content Card -->
            <div class="card border-0 shadow-sm rounded-4 bg-white p-4 hover-card" :class="`theme-${diary.theme || 'vintage'}`">
              <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-2 pb-2 border-bottom">
                <div class="d-flex align-items-center gap-2 flex-wrap">
                  <span class="badge bg-primary text-white rounded-pill px-3 py-1 fw-bold">
                    <i class="bi bi-clock me-1"></i> {{ formatStoryDateTime(diary.date, diary.time) }}
                  </span>
                  <span v-if="diary.category" class="badge bg-light text-dark border rounded-pill px-2.5 py-1">
                    🏷️ {{ diary.category }}
                  </span>
                  <span v-if="diary.location" class="badge bg-light text-secondary border rounded-pill px-2.5 py-1">
                    <i class="bi bi-geo-alt-fill text-danger me-1"></i> {{ diary.location }}
                  </span>
                </div>

                <div class="d-flex align-items-center gap-1">
                  <button class="btn btn-sm btn-light border rounded-pill px-2.5 py-1" @click="editDiaryStory(diary)">
                    <i class="bi bi-pencil me-1"></i> Edit
                  </button>
                  <button class="btn btn-sm btn-primary rounded-pill px-3 py-1 fw-bold" @click="readDiaryDetail(diary)">
                    <i class="bi bi-book me-1"></i> Baca Lengkap
                  </button>
                </div>
              </div>

              <div class="row g-3 align-items-center">
                <!-- If photo available, show side preview -->
                <div v-if="diary.coverImage || (diary.images && diary.images.length > 0)" class="col-md-3">
                  <div class="rounded-3 overflow-hidden border ratio ratio-4x3 cursor-pointer" @click="readDiaryDetail(diary)">
                    <img :src="diary.coverImage || diary.images[0]" :alt="diary.title" class="object-fit-cover" />
                  </div>
                </div>

                <div :class="diary.coverImage || (diary.images && diary.images.length > 0) ? 'col-md-9' : 'col-12'">
                  <h5 class="fw-bold text-dark mb-1 cursor-pointer" @click="readDiaryDetail(diary)">
                    {{ diary.title || 'Untitled Story' }}
                  </h5>
                  <p class="text-secondary small mb-2 line-clamp-2" style="line-height: 1.5;">
                    {{ getCleanExcerpt(diary.content) }}
                  </p>
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex gap-1 flex-wrap">
                      <span v-for="(t, idx) in diary.tags" :key="idx" class="badge bg-light text-muted small">
                        #{{ t }}
                      </span>
                    </div>
                    <span class="small text-muted font-monospace">{{ getWordCount(diary.content) }} Kata</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5 bg-white rounded-4 border shadow-sm">
          <p class="text-muted mb-0">Tidak ada cerita ditemukan untuk kriteria pencarian ini.</p>
        </div>
      </div>

      <!-- ===================================================================== -->
      <!-- VIEW C: MONTHLY CALENDAR JOURNAL GRID -->
      <!-- ===================================================================== -->
      <div v-else-if="diaryViewStyle === 'calendar'" class="diary-calendar-view bg-white p-4 rounded-4 shadow-sm border mb-4">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-outline-secondary rounded-circle p-2" @click="prevCalendarMonth">
              <i class="bi bi-chevron-left"></i>
            </button>
            <h4 class="fw-black text-dark mb-0">{{ currentMonthYearLabel }}</h4>
            <button class="btn btn-outline-secondary rounded-circle p-2" @click="nextCalendarMonth">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>

          <button class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-bold" @click="jumpToTodayMonth">
            Bulan Ini
          </button>
        </div>

        <!-- Days of Week Header -->
        <div class="row g-2 text-center fw-bold text-muted small mb-2 text-uppercase">
          <div class="col" v-for="d in ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']" :key="d">
            {{ d }}
          </div>
        </div>

        <!-- Days Grid -->
        <div class="row g-2 calendar-cells-row">
          <div 
            v-for="(cell, idx) in calendarMonthDays" 
            :key="idx"
            class="col calendar-day-col"
          >
            <div 
              class="calendar-day-box p-2 rounded-3 border h-100 d-flex flex-column justify-content-between transition-all"
              :class="{ 
                'bg-light text-muted opacity-50': !cell.isCurrentMonth,
                'border-primary bg-primary-subtle border-2': cell.isToday,
                'has-diary-entry bg-white shadow-xs cursor-pointer': cell.diaries.length > 0
              }"
              @click="handleCalendarDateClick(cell)"
            >
              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold small" :class="cell.isToday ? 'text-primary' : 'text-dark'">
                  {{ cell.dayNumber }}
                </span>
                <span v-if="cell.diaries.length > 0" class="badge bg-primary text-white rounded-circle p-1" style="font-size: 9px;">
                  {{ cell.diaries.length }}
                </span>
              </div>

              <!-- Diary Icons / Mini badges inside cell -->
              <div v-if="cell.diaries.length > 0" class="mt-1 d-flex flex-column gap-1">
                <div 
                  v-for="d in cell.diaries.slice(0, 2)" 
                  :key="d.id"
                  class="badge bg-light text-dark border text-truncate text-start p-1 small"
                  :title="d.title"
                >
                  <span>{{ d.mood || '📝' }}</span> {{ d.title }}
                </div>
              </div>
              <div v-else class="py-2 text-center text-muted-subtle" style="font-size: 10px;">
                -
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODE 2: QUICK DIARY SCRATCHPAD (DAILY AUTO-SAVING STORY DRAFT) -->
    <!-- ========================================================================= -->
    <div v-else-if="activeMode === 'scratchpad'">
      <div class="bg-white p-4 rounded-4 shadow-sm border mb-4">
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div class="d-flex align-items-center gap-3">
            <button class="btn btn-outline-secondary rounded-3 px-3 py-2 fw-bold d-flex align-items-center gap-2" @click="activeMode = 'list'">
              <i class="bi bi-arrow-left fs-5"></i>
              <span>Kembali ke Diary</span>
            </button>
            <div class="border-start ps-3">
              <span class="badge bg-warning-subtle text-warning-emphasis fw-bold px-3 py-1 rounded-pill mb-1">
                <i class="bi bi-sticky-fill me-1"></i> Coretan Cerita Cepat
              </span>
              <h3 class="fw-extrabold text-dark mb-0">Quick Diary Scratchpad (Auto-Save Active)</h3>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2">
            <div class="d-flex align-items-center gap-2 px-3 py-1.5 bg-light rounded-pill border small">
              <i class="bi bi-floppy-fill text-success" :class="{ 'spin-icon': isAutoSavingScratchpad }"></i>
              <span class="fw-bold text-dark">{{ scratchpadSaveStatus }}</span>
            </div>
            <button type="button" class="btn btn-outline-danger rounded-pill px-3 py-1.5 fw-bold" @click="clearScratchpad" v-if="scratchpadContent">
              <i class="bi bi-eraser me-1"></i> Bersihkan
            </button>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5 border-start border-4 border-warning">
        <!-- Scratchpad Quick Mood, Weather & Format Toolbar -->
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 p-2.5 bg-light rounded-3 border mb-3">
          <div class="d-flex flex-wrap align-items-center gap-1.5">
            <!-- Mood Quick Stamper -->
            <div class="dropdown">
              <button class="btn btn-sm btn-white border rounded-2 px-2.5 py-1 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <span>{{ scratchpadMood }} Mood</span>
              </button>
              <ul class="dropdown-menu shadow-sm">
                <li v-for="m in moodOptions" :key="m.label">
                  <a class="dropdown-item d-flex align-items-center gap-2" href="#" @click.prevent="scratchpadMood = m.emoji">
                    <span>{{ m.emoji }}</span> <span>{{ m.label }}</span>
                  </a>
                </li>
              </ul>
            </div>

            <!-- Weather Stamper -->
            <div class="dropdown">
              <button class="btn btn-sm btn-white border rounded-2 px-2.5 py-1 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <span>{{ scratchpadWeather }} Cuaca</span>
              </button>
              <ul class="dropdown-menu shadow-sm">
                <li v-for="w in weatherOptions" :key="w.label">
                  <a class="dropdown-item d-flex align-items-center gap-2" href="#" @click.prevent="scratchpadWeather = w.emoji">
                    <span>{{ w.emoji }}</span> <span>{{ w.label }}</span>
                  </a>
                </li>
              </ul>
            </div>

            <div class="vr mx-1"></div>

            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1 fw-bold text-primary" @click="openImageModalFor('scratchpad')">
              <i class="bi bi-image me-1"></i> Upload Foto
            </button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToScratchpad('**', '**')" title="Tebal"><i class="bi bi-type-bold"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToScratchpad('*', '*')" title="Miring"><i class="bi bi-type-italic"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToScratchpad('# ')" title="Heading">H1</button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToScratchpad('> ')" title="Kutipan (Quote)"><i class="bi bi-quote"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToScratchpad('- [ ] ')" title="Checklist"><i class="bi bi-check2-square"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTimestampToScratchpad" title="Sisipkan Waktu & Tanggal"><i class="bi bi-clock-history"></i></button>
          </div>

          <span class="small text-muted font-monospace">{{ (scratchpadContent || '').length }} Karakter | {{ getWordCount(scratchpadContent) }} Kata</span>
        </div>

        <div class="row g-4">
          <!-- Textarea Left Column -->
          <div class="col-lg-6">
            <label class="form-label fw-bold text-dark small d-flex justify-content-between align-items-center">
              <span>Tuliskan Ceritamu (Support Paste Gambar <kbd>Ctrl+V</kbd> & Drag Drop)</span>
              <span class="badge bg-light text-muted">Markdown Support</span>
            </label>
            <textarea
              ref="scratchpadTextarea"
              class="form-control font-monospace border-2 p-3 rounded-3"
              rows="16"
              v-model="scratchpadContent"
              @input="handleScratchpadInput"
              @paste="handlePasteImage($event, 'scratchpad')"
              placeholder="Tuliskan cerita keseharian atau refleksi di sini...&#10;&#10;# Hari yang Luar Biasa! 🌟&#10;Hari ini aku belajar banyak hal tentang...&#10;&#10;> 'Tetaplah berbuat baik dan bersyukur atas setiap proses.'&#10;&#10;Isi ini tersimpan otomatis!"
            ></textarea>
          </div>

          <!-- Live Rendered Markdown Right Column -->
          <div class="col-lg-6">
            <label class="form-label fw-bold text-dark small">Live Rendered Preview (Format Cerita Cantik)</label>
            <div class="card p-4 rounded-3 border-2 bg-light h-100 d-flex flex-column overflow-hidden">
              <div class="overflow-auto flex-grow-1 p-3 bg-white rounded-3 border custom-scrollbar" style="max-height: 380px;">
                <MarkdownViewer :content="scratchpadContent || '*Mulai ketik cerita di sebelah kiri untuk melihat pratinjau langsung di sini...*'" />
              </div>
              <div class="border-top pt-3 mt-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span class="small text-muted">
                  Mood: {{ scratchpadMood }} | Cuaca: {{ scratchpadWeather }}
                </span>
                <button class="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm" @click="convertScratchpadToDiaryStory" v-if="scratchpadContent.trim()">
                  <i class="bi bi-book-half me-1"></i> Simpan Jadi Cerita Diary Permanen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODE 3: FULL DIARY EDITOR (STUDIO TULIS CERITA LENGKAP) -->
    <!-- ========================================================================= -->
    <div v-else-if="activeMode === 'editor'" class="diary-editor-studio">
      <div class="bg-white p-4 rounded-4 shadow-sm border mb-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div class="d-flex align-items-center gap-3">
            <button class="btn btn-outline-secondary rounded-3 px-3 py-2 fw-bold d-flex align-items-center gap-2" @click="activeMode = 'list'">
              <i class="bi bi-arrow-left fs-5"></i>
              <span>Kembali ke Koleksi</span>
            </button>
            <div class="border-start ps-3">
              <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-1 rounded-pill mb-1">
                <i class="bi bi-feather me-1"></i> {{ isEditingExisting ? 'Edit Cerita Diary' : 'Tulis Cerita Baru' }}
              </span>
              <h3 class="fw-extrabold text-dark mb-0">Story & Journal Editor</h3>
            </div>
          </div>

          <div class="d-flex flex-wrap align-items-center gap-2">
            <!-- Theme Color Selector -->
            <div class="d-flex align-items-center gap-1 bg-light p-1.5 rounded-3 border">
              <span class="small text-muted fw-bold px-1" style="font-size: 11px;">Tema:</span>
              <button 
                v-for="th in themeOptions" 
                :key="th.id"
                class="btn btn-xs rounded-circle p-0 border"
                :style="{ background: th.color, width: '22px', height: '22px' }"
                :class="{ 'ring-active': editorForm.theme === th.id }"
                @click="editorForm.theme = th.id"
                :title="th.name"
              ></button>
            </div>

            <!-- View Toggles -->
            <div class="btn-group" role="group">
              <button type="button" class="btn btn-sm py-2 px-3 fw-semibold" :class="editorLayout === 'split' ? 'btn-dark' : 'btn-outline-secondary'" @click="editorLayout = 'split'">
                <i class="bi bi-layout-split me-1"></i> Split
              </button>
              <button type="button" class="btn btn-sm py-2 px-3 fw-semibold" :class="editorLayout === 'editor' ? 'btn-dark' : 'btn-outline-secondary'" @click="editorLayout = 'editor'">
                <i class="bi bi-pencil me-1"></i> Editor
              </button>
              <button type="button" class="btn btn-sm py-2 px-3 fw-semibold" :class="editorLayout === 'preview' ? 'btn-dark' : 'btn-outline-secondary'" @click="editorLayout = 'preview'">
                <i class="bi bi-eye me-1"></i> Preview
              </button>
            </div>

            <button class="btn btn-light border rounded-3 px-3 py-2 fw-semibold" @click="activeMode = 'list'">
              Batal
            </button>
            <button class="btn btn-primary rounded-3 px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm" @click="saveDiaryStory">
              <i class="bi bi-check-circle-fill"></i>
              <span>Simpan Cerita</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Editor Main Container -->
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 p-4 p-md-5 bg-white" :class="`theme-${editorForm.theme || 'vintage'}`">
        <!-- Top Title & Mood Strip -->
        <div class="row g-3 mb-4">
          <!-- Title Input -->
          <div class="col-lg-8">
            <label class="form-label fw-bold text-dark small mb-1">
              Judul Cerita / Kisah Hari Ini <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              class="form-control form-control-lg border-2 fw-extrabold fs-4 rounded-3"
              v-model="editorForm.title"
              placeholder="Contoh: 🌅 Secangkir Semangat di Pagi Hari..."
              required
            />
          </div>

          <!-- Date & Time Picker -->
          <div class="col-sm-6 col-lg-2">
            <label class="form-label fw-bold text-dark small mb-1">Tanggal</label>
            <input type="date" class="form-control rounded-3" v-model="editorForm.date" />
          </div>
          <div class="col-sm-6 col-lg-2">
            <label class="form-label fw-bold text-dark small mb-1">Waktu</label>
            <input type="time" class="form-control rounded-3" v-model="editorForm.time" />
          </div>
        </div>

        <!-- Mood, Weather, Location & Category Selector -->
        <div class="row g-3 p-3 bg-light rounded-4 border mb-4 align-items-center">
          <!-- Mood Selection -->
          <div class="col-md-3">
            <label class="form-label fw-bold text-dark small mb-1">🎭 Suasana Hati (Mood):</label>
            <select class="form-select rounded-3" v-model="editorForm.mood" @change="syncMoodLabel">
              <option v-for="m in moodOptions" :key="m.label" :value="m.emoji">
                {{ m.emoji }} {{ m.label }}
              </option>
            </select>
          </div>

          <!-- Weather Selection -->
          <div class="col-md-3">
            <label class="form-label fw-bold text-dark small mb-1">☀️ Cuaca & Lingkungan:</label>
            <select class="form-select rounded-3" v-model="editorForm.weather" @change="syncWeatherLabel">
              <option v-for="w in weatherOptions" :key="w.label" :value="w.emoji">
                {{ w.emoji }} {{ w.label }}
              </option>
            </select>
          </div>

          <!-- Location -->
          <div class="col-md-3">
            <label class="form-label fw-bold text-dark small mb-1">📍 Lokasi / Tempat:</label>
            <input type="text" class="form-control rounded-3" placeholder="Misal: Kantor, Cafe Favorit, Rumah" v-model="editorForm.location" />
          </div>

          <!-- Category -->
          <div class="col-md-3">
            <label class="form-label fw-bold text-dark small mb-1">🏷️ Kategori Cerita:</label>
            <input type="text" class="form-control rounded-3" placeholder="Refleksi, Pekerjaan, Perjalanan" v-model="editorForm.category" />
          </div>
        </div>

        <!-- Attached Images & Photo Gallery Manager -->
        <div class="mb-4 p-3 rounded-4 bg-light border">
          <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
            <div>
              <span class="small fw-bold text-dark d-flex align-items-center gap-1">
                <i class="bi bi-images text-primary fs-5"></i> Foto Lampiran Cerita ({{ editorForm.images.length }} Foto)
              </span>
              <small class="text-muted">Foto ini akan tampil di galeri cerita dan dapat dijadikan Foto Sampul (Cover).</small>
            </div>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-sm btn-primary rounded-pill px-3 py-1.5 fw-bold" @click="openImageModalFor('editor')">
                <i class="bi bi-cloud-arrow-up-fill me-1"></i> Upload Foto Baru
              </button>
            </div>
          </div>

          <!-- Photo Thumbnails Strip -->
          <div v-if="editorForm.images && editorForm.images.length > 0" class="d-flex gap-3 overflow-x-auto py-2 custom-scrollbar">
            <div 
              v-for="(imgSrc, idx) in editorForm.images" 
              :key="idx"
              class="diary-editor-thumb position-relative rounded-3 border overflow-hidden flex-shrink-0"
              :class="{ 'is-cover-thumb': editorForm.coverImage === imgSrc }"
            >
              <img :src="imgSrc" alt="Thumbnail" class="w-100 h-100 object-fit-cover" />
              <div class="thumb-hover-actions position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between p-1.5">
                <div class="d-flex justify-content-between">
                  <span v-if="editorForm.coverImage === imgSrc" class="badge bg-warning text-dark fw-bold" style="font-size: 9px;">
                    Cover
                  </span>
                  <span v-else></span>
                  <button type="button" class="btn btn-xs btn-danger rounded-circle p-1" @click="removeEditorImage(idx)" title="Hapus Foto">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
                <div class="d-flex gap-1 justify-content-center">
                  <button 
                    type="button" 
                    class="btn btn-xs btn-dark bg-opacity-75 rounded-pill px-2 py-0.5 small" 
                    style="font-size: 10px;"
                    @click="setAsCoverImage(imgSrc)"
                  >
                    Set Cover
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-xs btn-light rounded-pill px-2 py-0.5 small" 
                    style="font-size: 10px;"
                    @click="insertImageMarkdown(imgSrc)"
                    title="Sisipkan ke teks Markdown"
                  >
                    + Sisip
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-3 text-muted small border border-dashed rounded-3 bg-white">
            <i class="bi bi-camera fs-3 d-block text-muted mb-1"></i>
            <span>Belum ada foto terunggah. Klik tombol "Upload Foto Baru" atau Drag & Drop gambar langsung ke editor.</span>
          </div>
        </div>

        <!-- Markdown Formatting Toolbar -->
        <div class="markdown-toolbar p-2 rounded-3 border bg-light mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div class="d-flex flex-wrap align-items-center gap-1.5">
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1 fw-bold text-primary" @click="openImageModalFor('editor')">
              <i class="bi bi-image me-1"></i> Gambar
            </button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1 fw-bold text-purple" @click="openMermaidModalFor('editor')">
              <i class="bi bi-diagram-3-fill me-1"></i> Mermaid
            </button>
            <div class="vr mx-1"></div>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToEditor('**', '**')" title="Tebal"><i class="bi bi-type-bold"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToEditor('*', '*')" title="Miring"><i class="bi bi-type-italic"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToEditor('~~', '~~')" title="Coret"><i class="bi bi-type-strikethrough"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToEditor('# ')" title="Heading 1">H1</button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToEditor('## ')" title="Heading 2">H2</button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToEditor('> ')" title="Quote"><i class="bi bi-quote"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToEditor('- ')" title="List"><i class="bi bi-list-ul"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToEditor('1. ')" title="Numbered List"><i class="bi bi-list-ol"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToEditor('- [ ] ')" title="Checklist"><i class="bi bi-check2-square"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToEditor('```\n', '\n```')" title="Code Block"><i class="bi bi-code-square"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertTextToEditor('\n---\n')" title="Garis Pembatas">---</button>
          </div>

          <div class="d-flex align-items-center gap-2 small text-muted font-monospace">
            <span>⏱️ {{ estimateReadingTime(editorForm.content) }} min baca</span>
            <span>|</span>
            <span>{{ getWordCount(editorForm.content) }} Kata</span>
          </div>
        </div>

        <!-- Editor Split / Single Workspace -->
        <div class="row g-4">
          <!-- Textarea Left Column -->
          <div :class="editorLayout === 'split' ? 'col-lg-6' : (editorLayout === 'editor' ? 'col-12' : 'd-none')">
            <textarea
              ref="editorTextarea"
              class="form-control font-monospace border-2 p-4 rounded-3 diary-textarea"
              rows="18"
              v-model="editorForm.content"
              @paste="handlePasteImage($event, 'editor')"
              placeholder="Tuliskan kisah, perasaan, atau catatan harianmu di sini...&#10;&#10;Bisa menggunakan format Markdown lengkap, sisipkan kutipan, checklist kegiatan, serta drag/paste gambar langsung!"
            ></textarea>
          </div>

          <!-- Preview Right Column -->
          <div :class="editorLayout === 'split' ? 'col-lg-6' : (editorLayout === 'preview' ? 'col-12' : 'd-none')">
            <div class="card p-4 rounded-3 border-2 bg-light h-100 overflow-auto custom-scrollbar" style="max-height: 520px;">
              <h4 class="fw-bold text-dark border-bottom pb-2 mb-3">{{ editorForm.title || 'Judul Cerita' }}</h4>
              <MarkdownViewer :content="editorForm.content || '*Pratinjau cerita akan muncul di sini...*'" />
            </div>
          </div>
        </div>

        <!-- Tags & Privacy Settings Row -->
        <div class="row g-3 mt-4 pt-3 border-top align-items-center">
          <div class="col-md-7">
            <label class="form-label fw-bold text-dark small mb-1">🏷️ Tags (Pisahkan dengan koma):</label>
            <input type="text" class="form-control rounded-3" placeholder="semangat, keluarga, kerja, impian2026" v-model="editorForm.tagsInput" />
          </div>

          <div class="col-md-5 d-flex justify-content-md-end gap-3 align-items-center pt-md-3">
            <div class="form-check form-switch">
              <input class="form-check-input cursor-pointer" type="checkbox" id="privateCheck" v-model="editorForm.isPrivate">
              <label class="form-check-label small fw-bold text-dark cursor-pointer" for="privateCheck">
                <i class="bi bi-shield-lock me-1"></i> Cerita Rahasia (PIN Lock)
              </label>
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input cursor-pointer" type="checkbox" id="pinCheck" v-model="editorForm.isPinned">
              <label class="form-check-label small fw-bold text-dark cursor-pointer" for="pinCheck">
                <i class="bi bi-pin-angle me-1"></i> Pin di Atas
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden Native File Input for Photo Uploads -->
    <input type="file" ref="nativeFileInput" class="d-none" accept="image/*" @change="onNativeFileSelected" />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import MarkdownViewer from '../components/MarkdownViewer.vue';

export default {
  name: 'DiaryView',
  components: {
    MarkdownViewer
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    // -------------------------------------------------------------
    // NAVIGATION & VIEW MODES
    // -------------------------------------------------------------
    const activeMode = ref('list'); // 'list' | 'scratchpad' | 'editor'
    const diaryViewStyle = ref('cards'); // 'cards' | 'timeline' | 'calendar'
    const editorLayout = ref('split'); // 'split' | 'editor' | 'preview'
    const isEditingExisting = ref(false);
    const selectedIds = ref([]);

    // Filters
    const searchQuery = ref('');
    const selectedMoodFilter = ref('all');
    const selectedCategoryFilter = ref('all');

    // Scratchpad Auto-save State
    const scratchpadContent = ref('');
    const scratchpadMood = ref('🤩');
    const scratchpadWeather = ref('☀️');
    const scratchpadSaveStatus = ref('Tersimpan');
    const isAutoSavingScratchpad = ref(false);
    let scratchpadTimer = null;

    // Full Editor State
    const editorForm = ref({
      id: '',
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      mood: '🤩',
      moodLabel: 'Bersemangat',
      weather: '☀️',
      weatherLabel: 'Cerah',
      location: '',
      category: 'Refleksi Harian',
      tagsInput: '',
      tags: [],
      theme: 'vintage',
      images: [],
      coverImage: '',
      isPinned: false,
      isFavorite: false,
      isPrivate: false
    });

    // Image Upload State
    const imageTarget = ref('scratchpad'); // 'scratchpad' | 'editor'
    const imageTab = ref('upload');
    const uploadedPreviewData = ref('');
    const imageUrlInput = ref('');
    const imageCaptionInput = ref('');

    // DOM Refs
    const scratchpadTextarea = ref(null);
    const editorTextarea = ref(null);
    const imageFileInputRef = ref(null);
    const nativeFileInput = ref(null);

    // PIN Lock State
    const pinInput = ref('');
    const savedPin = ref(localStorage.getItem('rajinkerja_diary_pin') || '');
    const isPinLockEnabled = computed(() => !!savedPin.value);

    // Calendar State
    const calendarCurrentDate = ref(new Date());

    // -------------------------------------------------------------
    // CONSTANTS: MOODS, WEATHERS & THEMES
    // -------------------------------------------------------------
    const moodOptions = [
      { emoji: '🤩', label: 'Bersemangat & Produktif' },
      { emoji: '😊', label: 'Bahagia & Ceria' },
      { emoji: '🌿', label: 'Bersyukur & Tenang' },
      { emoji: '☕', label: 'Santai / Recharging' },
      { emoji: '💡', label: 'Terinspirasi & Kreatif' },
      { emoji: '💭', label: 'Reflektif & Kontemplasi' },
      { emoji: '😓', label: 'Lelah / Butuh Istirahat' },
      { emoji: '🌧️', label: 'Galau / Emosional' },
      { emoji: '🎯', label: 'Fokus Target' }
    ];

    const weatherOptions = [
      { emoji: '☀️', label: 'Cerah Bersemangat' },
      { emoji: '⛅', label: 'Berawan Teduh' },
      { emoji: '🌧️', label: 'Hujan Sejuk' },
      { emoji: '🌙', label: 'Malam Tenang' },
      { emoji: '🌈', label: 'Pelangi Indah' },
      { emoji: '❄️', label: 'Sejuk & Dingin' }
    ];

    const themeOptions = [
      { id: 'vintage', name: 'Warm Vintage Paper', color: '#fef3c7' },
      { id: 'peach', name: 'Sunset Coral Peach', color: '#fed7aa' },
      { id: 'lavender', name: 'Lavender Serenity', color: '#e9d5ff' },
      { id: 'mint', name: 'Fresh Mint Morning', color: '#bbf7d0' },
      { id: 'sky', name: 'Clear Sky Blue', color: '#bae6fd' },
      { id: 'rose', name: 'Rose Bloom Elegance', color: '#fecdd3' }
    ];

    // -------------------------------------------------------------
    // COMPUTED PROPERTIES
    // -------------------------------------------------------------
    const diaries = computed(() => {
      return store.state.diaries || [];
    });

    const totalPhotosCount = computed(() => {
      return diaries.value.reduce((acc, d) => acc + (d.images ? d.images.length : (d.coverImage ? 1 : 0)), 0);
    });

    const favoriteDiariesCount = computed(() => {
      return diaries.value.filter(d => d.isFavorite).length;
    });

    const dominantMoodEmoji = computed(() => {
      if (!diaries.value.length) return '🤩';
      const counts = {};
      diaries.value.forEach(d => {
        if (d.mood) counts[d.mood] = (counts[d.mood] || 0) + 1;
      });
      let maxMood = '🤩';
      let maxCount = 0;
      for (const m in counts) {
        if (counts[m] > maxCount) {
          maxCount = counts[m];
          maxMood = m;
        }
      }
      return maxMood;
    });

    const dominantMoodLabel = computed(() => {
      const found = moodOptions.find(m => m.emoji === dominantMoodEmoji.value);
      return found ? found.label.split(' ')[0] : 'Bersemangat';
    });

    const writingStreakDays = computed(() => {
      if (!diaries.value.length) return 0;
      // Unique dates
      const uniqueDates = new Set(diaries.value.map(d => (d.date || d.createdAt || '').slice(0, 10)));
      return uniqueDates.size;
    });

    const availableCategories = computed(() => {
      const cats = new Set();
      diaries.value.forEach(d => {
        if (d.category) cats.add(d.category);
      });
      return Array.from(cats);
    });

    const filteredDiaries = computed(() => {
      let list = [...diaries.value];

      // Sort: Pinned first, then newest date
      list.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        const dateA = new Date(a.date || a.createdAt || 0).getTime();
        const dateB = new Date(b.date || b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      // Filter Mood
      if (selectedMoodFilter.value !== 'all') {
        list = list.filter(d => d.mood === selectedMoodFilter.value);
      }

      // Filter Category
      if (selectedCategoryFilter.value !== 'all') {
        list = list.filter(d => d.category === selectedCategoryFilter.value);
      }

      // Filter Search
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        list = list.filter(d => {
          const matchTitle = (d.title || '').toLowerCase().includes(q);
          const matchContent = (d.content || '').toLowerCase().includes(q);
          const matchLocation = (d.location || '').toLowerCase().includes(q);
          const matchTags = (d.tags || []).some(t => t.toLowerCase().includes(q));
          return matchTitle || matchContent || matchLocation || matchTags;
        });
      }

      return list;
    });

    // Calendar computations
    const currentMonthYearLabel = computed(() => {
      return calendarCurrentDate.value.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    });

    const calendarMonthDays = computed(() => {
      const date = new Date(calendarCurrentDate.value.getFullYear(), calendarCurrentDate.value.getMonth(), 1);
      const year = date.getFullYear();
      const month = date.getMonth();

      const firstDayIndex = date.getDay(); // 0 = Sunday
      const lastDate = new Date(year, month + 1, 0).getDate();
      const prevLastDate = new Date(year, month, 0).getDate();

      const days = [];

      // Prev month filler
      for (let i = firstDayIndex - 1; i >= 0; i--) {
        const d = prevLastDate - i;
        const fullDateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        days.push({
          dayNumber: d,
          dateStr: fullDateStr,
          isCurrentMonth: false,
          isToday: false,
          diaries: []
        });
      }

      // Current month days
      const todayStr = new Date().toISOString().split('T')[0];
      for (let i = 1; i <= lastDate; i++) {
        const fullDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayDiaries = diaries.value.filter(d => (d.date || d.createdAt || '').slice(0, 10) === fullDateStr);
        days.push({
          dayNumber: i,
          dateStr: fullDateStr,
          isCurrentMonth: true,
          isToday: fullDateStr === todayStr,
          diaries: dayDiaries
        });
      }

      // Next month filler to make 35 or 42 cells
      const remaining = 35 - days.length;
      if (remaining > 0) {
        for (let i = 1; i <= remaining; i++) {
          days.push({
            dayNumber: i,
            dateStr: '',
            isCurrentMonth: false,
            isToday: false,
            diaries: []
          });
        }
      }

      return days;
    });

    // -------------------------------------------------------------
    // LOCAL STORAGE SCRATCHPAD LOAD & SYNC
    // -------------------------------------------------------------
    onMounted(() => {
      const savedScratch = localStorage.getItem('rajinkerja_diary_scratchpad');
      if (savedScratch) {
        scratchpadContent.value = savedScratch;
      }
      const savedMood = localStorage.getItem('rajinkerja_diary_scratchpad_mood');
      if (savedMood) {
        scratchpadMood.value = savedMood;
      }
      const savedWeather = localStorage.getItem('rajinkerja_diary_scratchpad_weather');
      if (savedWeather) {
        scratchpadWeather.value = savedWeather;
      }

      if (route.query.editId) {
        const target = (store.state.diaries || []).find(d => d.id === route.query.editId);
        if (target) {
          editDiaryStory(target);
        }
      }
    });

    const handleScratchpadInput = () => {
      isAutoSavingScratchpad.value = true;
      scratchpadSaveStatus.value = 'Menyimpan...';

      if (scratchpadTimer) clearTimeout(scratchpadTimer);
      scratchpadTimer = setTimeout(() => {
        localStorage.setItem('rajinkerja_diary_scratchpad', scratchpadContent.value);
        localStorage.setItem('rajinkerja_diary_scratchpad_mood', scratchpadMood.value);
        localStorage.setItem('rajinkerja_diary_scratchpad_weather', scratchpadWeather.value);
        isAutoSavingScratchpad.value = false;
        scratchpadSaveStatus.value = 'Tersimpan Otomatis';
      }, 500);
    };

    const clearScratchpad = () => {
      if (window.confirm('Bersihkan coretan scratchpad ini?')) {
        scratchpadContent.value = '';
        localStorage.removeItem('rajinkerja_diary_scratchpad');
        scratchpadSaveStatus.value = 'Tersimpan Kosong';
      }
    };

    const insertTextToScratchpad = (prefix, suffix = '') => {
      const textarea = scratchpadTextarea.value;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selected = text.substring(start, end);

      const replacement = prefix + (selected || '') + suffix;
      scratchpadContent.value = text.substring(0, start) + replacement + text.substring(end);

      nextTick(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || '').length);
        handleScratchpadInput();
      });
    };

    const insertTimestampToScratchpad = () => {
      const now = new Date();
      const timeStr = `\n> 📅 **${now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} - ${now.toTimeString().slice(0, 5)} WIB** | Mood: ${scratchpadMood.value} | Cuaca: ${scratchpadWeather.value}\n\n`;
      insertTextToScratchpad(timeStr);
    };

    const convertScratchpadToDiaryStory = () => {
      if (!scratchpadContent.value.trim()) return;

      // Extract first line as title if possible
      const lines = scratchpadContent.value.trim().split('\n');
      let title = lines[0].replace(/^[#>\s*-]+/, '').trim() || 'Cerita Refleksi Harian';
      if (title.length > 60) title = title.substring(0, 57) + '...';

      editorForm.value = {
        id: 'diary_' + Date.now(),
        title: title,
        content: scratchpadContent.value,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        mood: scratchpadMood.value,
        moodLabel: syncMoodLabelText(scratchpadMood.value),
        weather: scratchpadWeather.value,
        weatherLabel: syncWeatherLabelText(scratchpadWeather.value),
        location: 'Ruang Kerja',
        category: 'Refleksi Harian',
        tagsInput: 'scratchpad, catatan',
        tags: ['scratchpad', 'catatan'],
        theme: 'vintage',
        images: extractImagesFromMarkdown(scratchpadContent.value),
        coverImage: extractFirstImage(scratchpadContent.value),
        isPinned: false,
        isFavorite: false,
        isPrivate: false
      };

      isEditingExisting.value = false;
      activeMode.value = 'editor';
    };

    // -------------------------------------------------------------
    // FULL EDITOR ACTIONS
    // -------------------------------------------------------------
    const openNewStoryEditor = () => {
      editorForm.value = {
        id: 'diary_' + Date.now(),
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        mood: '🤩',
        moodLabel: 'Bersemangat',
        weather: '☀️',
        weatherLabel: 'Cerah',
        location: '',
        category: 'Refleksi Harian',
        tagsInput: '',
        tags: [],
        theme: 'vintage',
        images: [],
        coverImage: '',
        isPinned: false,
        isFavorite: false,
        isPrivate: false
      };
      isEditingExisting.value = false;
      activeMode.value = 'editor';
    };

    const editDiaryStory = (diary) => {
      editorForm.value = {
        ...diary,
        tagsInput: (diary.tags || []).join(', ')
      };
      isEditingExisting.value = true;
      activeMode.value = 'editor';
    };

    const insertTextToEditor = (prefix, suffix = '') => {
      const textarea = editorTextarea.value;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selected = text.substring(start, end);

      const replacement = prefix + (selected || '') + suffix;
      editorForm.value.content = text.substring(0, start) + replacement + text.substring(end);

      nextTick(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || '').length);
      });
    };

    const saveDiaryStory = () => {
      if (!editorForm.value.title.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Judul Diperlukan',
          text: 'Harap masukkan judul cerita diary Anda.'
        });
        return;
      }

      // Process tags
      const tags = (editorForm.value.tagsInput || '')
        .split(',')
        .map(t => t.trim().replace(/^#/, ''))
        .filter(t => t.length > 0);

      const finalStory = {
        ...editorForm.value,
        id: editorForm.value.id || ('diary_' + Date.now()),
        tags: tags,
        moodLabel: syncMoodLabelText(editorForm.value.mood),
        weatherLabel: syncWeatherLabelText(editorForm.value.weather),
        coverImage: editorForm.value.coverImage || (editorForm.value.images && editorForm.value.images[0]) || '',
        updatedAt: new Date().toISOString()
      };

      if (isEditingExisting.value) {
        store.commit('UPDATE_DIARY', finalStory);
        window.alert('Cerita diary berhasil diperbarui!');
      } else {
        finalStory.createdAt = new Date().toISOString();
        store.commit('ADD_DIARY', finalStory);
        window.alert('Cerita diary berhasil disimpan!');
      }

      activeMode.value = 'list';
    };

    const syncMoodLabel = () => {
      editorForm.value.moodLabel = syncMoodLabelText(editorForm.value.mood);
    };

    const syncWeatherLabel = () => {
      editorForm.value.weatherLabel = syncWeatherLabelText(editorForm.value.weather);
    };

    const syncMoodLabelText = (emoji) => {
      const found = moodOptions.find(m => m.emoji === emoji);
      return found ? found.label : 'Mood';
    };

    const syncWeatherLabelText = (emoji) => {
      const found = weatherOptions.find(w => w.emoji === emoji);
      return found ? found.label : 'Cuaca';
    };

    // -------------------------------------------------------------
    // READING & DETAIL VIEW (DEDICATED PAGE)
    // -------------------------------------------------------------
    const readDiaryDetail = (diary) => {
      router.push(`/diary/${diary.id}`);
    };

    const printStoryPdf = () => {
      window.print();
    };

    // -------------------------------------------------------------
    // IMAGE HANDLING (UPLOAD, DROP, CLIPBOARD PASTE)
    // -------------------------------------------------------------
    const openImageModalFor = (target) => {
      imageTarget.value = target;
      uploadedPreviewData.value = '';
      imageUrlInput.value = '';
      imageCaptionInput.value = '';
      showImageModal.value = true;
    };

    const triggerFileInput = () => {
      if (imageFileInputRef.value) {
        imageFileInputRef.value.click();
      }
    };

    const onImageFileSelected = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      processSelectedImage(file);
      e.target.value = '';
    };

    const handleDropImageUpload = (e) => {
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        processSelectedImage(file);
      }
    };

    const processSelectedImage = (file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const rawUrl = ev.target.result;
        compressImageToFit(rawUrl, (compressedUrl) => {
          uploadedPreviewData.value = compressedUrl;
        });
      };
      reader.readAsDataURL(file);
    };

    const compressImageToFit = (dataUrl, callback) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 1200;
        const maxH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxW || height > maxH) {
          if (width > height) {
            height = Math.round((height * maxW) / width);
            width = maxW;
          } else {
            width = Math.round((width * maxH) / height);
            height = maxH;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', 0.82);
        callback(compressed);
      };
      img.src = dataUrl;
    };

    const handlePasteImage = (e, target) => {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (ev) => {
            compressImageToFit(ev.target.result, (comp) => {
              insertImageDirectly(comp, 'Pasted Image', target);
            });
          };
          reader.readAsDataURL(blob);
          e.preventDefault();
          break;
        }
      }
    };

    const confirmImageInsertion = () => {
      const src = imageTab.value === 'upload' ? uploadedPreviewData.value : imageUrlInput.value.trim();
      if (!src) {
        window.alert('Harap upload foto atau masukkan link URL gambar yang valid.');
        return;
      }

      insertImageDirectly(src, imageCaptionInput.value.trim() || 'Foto Cerita', imageTarget.value);
    };

    const insertImageDirectly = (src, caption, target) => {
      const mdSnippet = `\n\n![${caption}](${src})\n*${caption}*\n\n`;

      if (target === 'scratchpad') {
        insertTextToScratchpad(mdSnippet);
      } else if (target === 'editor') {
        if (!editorForm.value.images) editorForm.value.images = [];
        if (!editorForm.value.images.includes(src)) {
          editorForm.value.images.push(src);
          if (!editorForm.value.coverImage) {
            editorForm.value.coverImage = src;
          }
        }
        insertTextToEditor(mdSnippet);
      }
    };

    const setAsCoverImage = (imgSrc) => {
      editorForm.value.coverImage = imgSrc;
      window.alert('Foto sampul berhasil diubah!');
    };

    const removeEditorImage = (index) => {
      const removed = editorForm.value.images.splice(index, 1)[0];
      if (editorForm.value.coverImage === removed) {
        editorForm.value.coverImage = editorForm.value.images[0] || '';
      }
    };

    const insertImageMarkdown = (imgSrc) => {
      insertTextToEditor(`\n\n![Foto Cerita](${imgSrc})\n\n`);
    };

    const openMermaidModalFor = (target) => {
      const sample = `\n\`\`\`mermaid\nflowchart TD\n    A([🌟 Niat Awal]) --> B[Langkah Nyata]\n    B --> C{Evaluasi}\n    C -- Selesai --> D([🎉 Target Tercapai])\n\`\`\`\n`;
      if (target === 'scratchpad') insertTextToScratchpad(sample);
      else insertTextToEditor(sample);
    };

    // -------------------------------------------------------------
    // UTILITY & HELPERS
    // -------------------------------------------------------------
    const toggleMode = (mode) => {
      activeMode.value = mode;
    };

    const toggleFavorite = (id) => {
      store.commit('TOGGLE_DIARY_FAVORITE', id);
    };

    const togglePin = (id) => {
      store.commit('TOGGLE_DIARY_PIN', id);
    };

    const deleteDiarySingle = (id) => {
      if (window.confirm('Hapus cerita diary ini? Cerita yang dihapus tidak dapat dikembalikan.')) {
        store.commit('DELETE_DIARY', id);
        window.alert('Cerita diary telah dihapus.');
      }
    };

    const bulkDeleteSelected = () => {
      if (!selectedIds.value.length) return;
      if (window.confirm(`Hapus ${selectedIds.value.length} cerita yang dipilih secara permanen?`)) {
        store.commit('DELETE_DIARIES_BULK', selectedIds.value);
        selectedIds.value = [];
        window.alert('Semua cerita yang dipilih telah dihapus.');
      }
    };

    const copyDiaryContent = (diary) => {
      const fullText = `# ${diary.title}\n\n${diary.content}`;
      navigator.clipboard.writeText(fullText).then(() => {
        window.alert('Teks cerita berhasil disalin ke clipboard!');
      });
    };

    const formatStoryDate = (dateStr) => {
      if (!dateStr) return 'Hari Ini';
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      } catch (e) {
        return dateStr;
      }
    };

    const formatStoryDateTime = (dateStr, timeStr) => {
      if (!dateStr) return '';
      try {
        const d = new Date(dateStr);
        const formatted = d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        return timeStr ? `${formatted} • ${timeStr} WIB` : formatted;
      } catch (e) {
        return `${dateStr} ${timeStr || ''}`;
      }
    };

    const getCleanExcerpt = (content) => {
      if (!content) return 'Tidak ada catatan...';
      return content
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/[#*`_>~-]/g, '')
        .trim();
    };

    const getWordCount = (content) => {
      if (!content) return 0;
      return content.trim().split(/\s+/).filter(Boolean).length;
    };

    const estimateReadingTime = (content) => {
      const words = getWordCount(content);
      return Math.max(1, Math.ceil(words / 180));
    };

    const extractImagesFromMarkdown = (md) => {
      const regex = /!\[.*?\]\((.*?)\)/g;
      const images = [];
      let match;
      while ((match = regex.exec(md)) !== null) {
        images.push(match[1]);
      }
      return images;
    };

    const extractFirstImage = (md) => {
      const imgs = extractImagesFromMarkdown(md);
      return imgs.length ? imgs[0] : '';
    };

    // -------------------------------------------------------------
    // PIN LOCK MANAGEMENT
    // -------------------------------------------------------------
    const togglePinLockModal = () => {
      if (isPinLockEnabled.value) {
        if (window.confirm('Matikan proteksi PIN untuk Diary?')) {
          localStorage.removeItem('rajinkerja_diary_pin');
          savedPin.value = '';
          window.alert('Kunci PIN dinonaktifkan.');
        }
      } else {
        const entered = window.prompt('Masukkan 4 digit angka untuk PIN rahasia Diary:');
        if (entered && entered.length === 4 && !isNaN(entered)) {
          localStorage.setItem('rajinkerja_diary_pin', entered);
          savedPin.value = entered;
          window.alert('Kunci PIN aktif! Cerita berlabel privat kini dilindungi PIN Anda.');
        } else if (entered !== null) {
          window.alert('PIN harus berupa 4 digit angka.');
        }
      }
    };

    // -------------------------------------------------------------
    // CALENDAR CONTROLS
    // -------------------------------------------------------------
    const prevCalendarMonth = () => {
      calendarCurrentDate.value = new Date(calendarCurrentDate.value.getFullYear(), calendarCurrentDate.value.getMonth() - 1, 1);
    };

    const nextCalendarMonth = () => {
      calendarCurrentDate.value = new Date(calendarCurrentDate.value.getFullYear(), calendarCurrentDate.value.getMonth() + 1, 1);
    };

    const jumpToTodayMonth = () => {
      calendarCurrentDate.value = new Date();
    };

    const handleCalendarDateClick = (cell) => {
      if (cell.diaries && cell.diaries.length === 1) {
        readDiaryDetail(cell.diaries[0]);
      } else if (cell.diaries && cell.diaries.length > 1) {
        searchQuery.value = cell.dateStr;
        diaryViewStyle.value = 'cards';
      } else if (cell.isCurrentMonth) {
        openNewStoryEditor();
        editorForm.value.date = cell.dateStr;
      }
    };

    return {
      activeMode,
      diaryViewStyle,
      editorLayout,
      isEditingExisting,
      selectedIds,
      searchQuery,
      selectedMoodFilter,
      selectedCategoryFilter,
      scratchpadContent,
      scratchpadMood,
      scratchpadWeather,
      scratchpadSaveStatus,
      isAutoSavingScratchpad,
      editorForm,
      imageTab,
      uploadedPreviewData,
      imageUrlInput,
      imageCaptionInput,
      scratchpadTextarea,
      editorTextarea,
      imageFileInputRef,
      nativeFileInput,
      pinInput,
      isPinLockEnabled,
      moodOptions,
      weatherOptions,
      themeOptions,
      diaries,
      totalPhotosCount,
      favoriteDiariesCount,
      dominantMoodEmoji,
      dominantMoodLabel,
      writingStreakDays,
      availableCategories,
      filteredDiaries,
      currentMonthYearLabel,
      calendarMonthDays,
      toggleMode,
      handleScratchpadInput,
      clearScratchpad,
      insertTextToScratchpad,
      insertTimestampToScratchpad,
      convertScratchpadToDiaryStory,
      openNewStoryEditor,
      editDiaryStory,
      insertTextToEditor,
      saveDiaryStory,
      syncMoodLabel,
      syncWeatherLabel,
      readDiaryDetail,
      printStoryPdf,
      openImageModalFor,
      triggerFileInput,
      onImageFileSelected,
      handleDropImageUpload,
      handlePasteImage,
      confirmImageInsertion,
      setAsCoverImage,
      removeEditorImage,
      insertImageMarkdown,
      openMermaidModalFor,
      toggleFavorite,
      togglePin,
      deleteDiarySingle,
      bulkDeleteSelected,
      copyDiaryContent,
      formatStoryDate,
      formatStoryDateTime,
      getCleanExcerpt,
      getWordCount,
      estimateReadingTime,
      togglePinLockModal,
      prevCalendarMonth,
      nextCalendarMonth,
      jumpToTodayMonth,
      handleCalendarDateClick
    };
  }
};
</script>

<style scoped>
.diary-header-banner {
  background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%);
  border-left: 5px solid #f59e0b !important;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulseAnim 2s infinite;
}

@keyframes pulseAnim {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

/* Journal Themes */
.theme-vintage { background-color: #fffef9; border-color: #fef08a; }
.theme-peach { background-color: #fffaf5; border-color: #fed7aa; }
.theme-lavender { background-color: #faf5ff; border-color: #e9d5ff; }
.theme-mint { background-color: #f0fdf4; border-color: #bbf7d0; }
.theme-sky { background-color: #f0f9ff; border-color: #bae6fd; }
.theme-rose { background-color: #fff1f2; border-color: #fecdd3; }

.diary-color-stripe {
  height: 4px;
  background: linear-gradient(90deg, #f59e0b, #ec4899, #6366f1);
}

.is-pinned-card {
  box-shadow: 0 8px 24px -4px rgba(245, 158, 11, 0.18) !important;
  border: 1.5px solid #f59e0b !important;
}

.diary-card-cover {
  height: 180px;
  background-color: #f8fafc;
}

.cover-gradient-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
}

.hover-zoom:hover, .transition-zoom:hover {
  transform: scale(1.04);
  transition: transform 0.3s ease;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Timeline */
.diary-timeline-container {
  position: relative;
}

.timeline-vertical-spine {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 20px;
  width: 3px;
  background: linear-gradient(180deg, #f59e0b 0%, #3b82f6 100%);
  border-radius: 4px;
}

.timeline-dot {
  position: absolute;
  left: -32px;
  top: 14px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: white;
  border: 3px solid #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  z-index: 2;
}

/* Calendar Day Box */
.calendar-day-box {
  min-height: 90px;
  font-size: 13px;
}

.calendar-day-box:hover {
  border-color: #3b82f6 !important;
  transform: translateY(-2px);
}

.diary-editor-thumb {
  width: 90px;
  height: 90px;
}

.is-cover-thumb {
  border: 2px solid #f59e0b !important;
}

.thumb-hover-actions {
  background: rgba(0, 0, 0, 0.45);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.diary-editor-thumb:hover .thumb-hover-actions {
  opacity: 1;
}

.ring-active {
  box-shadow: 0 0 0 2px #3b82f6;
}

/* Reading modal */
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(5px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.reading-paper-canvas {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.8;
  font-size: 16.5px;
}

.letter-spacing-4 {
  letter-spacing: 12px;
}

.max-w-160 { max-width: 160px; }
.max-w-300 { max-width: 300px; }
.max-w-md { max-width: 460px; }

@media print {
  body * {
    visibility: hidden;
  }
  .print-story-target, .print-story-target * {
    visibility: visible;
  }
  .print-story-target {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
