<template>
  <div class="container-fluid py-4 media-hub-page" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="card border-0 rounded-4 text-white shadow-lg mb-4 p-4 position-relative overflow-hidden header-banner">
      <div class="position-relative z-1 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
        <div>
          <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span class="badge bg-white text-dark fw-bold px-3 py-1.5 rounded-pill shadow-sm">
              <i class="bi bi-collection-play-fill text-primary me-1"></i> Upload Media & Studio Player
            </span>
            <span class="badge bg-info bg-opacity-75 text-dark fw-bold px-3 py-1.5 rounded-pill">
              🎵 Musik & 🎬 Video Player
            </span>
            <span class="badge bg-warning text-dark fw-bold px-3 py-1.5 rounded-pill">
              📁 Playlist Manager
            </span>
          </div>
          <h2 class="fw-bold display-6 mb-1">Upload Media & Media Player 🎵🎬</h2>
          <p class="mb-0 text-white-50" style="max-width: 750px;">
            Upload musik dan video kerja Anda, atur dalam playlist terorganisir, dan putar langsung di sini tanpa perlu membuka tab atau aplikasi lain.
          </p>
        </div>

        <div class="d-flex flex-wrap gap-2 align-items-center">
          <button class="btn btn-light text-primary fw-bold rounded-3 px-3.5 py-2 shadow-sm d-flex align-items-center gap-2" @click="showUploadForm = !showUploadForm">
            <i :class="showUploadForm ? 'bi bi-x-circle-fill text-danger' : 'bi bi-cloud-arrow-up-fill fs-5 text-primary'"></i>
            <span>{{ showUploadForm ? 'Tutup Form Upload' : 'Upload Media Baru' }}</span>
          </button>
          
          <button class="btn btn-outline-light fw-semibold rounded-3 px-3 py-2" @click="showPlaylistModal = true">
            <i class="bi bi-folder-plus text-warning me-1"></i> Kelola Playlist
          </button>

          <button class="btn btn-outline-light fw-semibold rounded-3 px-3 py-2" @click="exportMediaJson" title="Backup Playlist & Media ke JSON">
            <i class="bi bi-filetype-json text-warning me-1"></i> Export
          </button>
          <button class="btn btn-outline-light fw-semibold rounded-3 px-3 py-2" @click="triggerImportMediaJson" title="Import Media dari JSON">
            <i class="bi bi-upload text-info me-1"></i> Import
          </button>
          <input type="file" ref="mediaJsonInput" accept=".json" class="d-none" @change="onMediaJsonSelected" />
        </div>
      </div>
    </div>

    <!-- Active Media Player Stage (Plays directly here!) -->
    <div class="card border-0 rounded-4 shadow-lg mb-4 overflow-hidden player-card" v-if="currentMedia">
      <div class="card-header bg-dark text-white p-3 d-flex justify-content-between align-items-center border-0">
        <div class="d-flex align-items-center gap-2 text-truncate">
          <span class="badge rounded-pill px-2.5 py-1 fw-bold" :class="currentMedia.mediaType === 'audio' ? 'bg-primary' : 'bg-danger'">
            <i :class="currentMedia.mediaType === 'audio' ? 'bi bi-music-note-beamed me-1' : 'bi bi-film me-1'"></i>
            {{ currentMedia.mediaType === 'audio' ? 'NOW PLAYING AUDIO' : 'NOW PLAYING VIDEO' }}
          </span>
          <span class="fw-bold fs-6 text-truncate text-white">{{ currentMedia.title }}</span>
          <span class="text-white-50 small d-none d-md-inline" v-if="currentMedia.artist">• {{ currentMedia.artist }}</span>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-light border-0 rounded-circle" @click="toggleFavorite(currentMedia)" :title="currentMedia.isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'">
            <i :class="currentMedia.isFavorite ? 'bi bi-star-fill text-warning' : 'bi bi-star'"></i>
          </button>
          <button class="btn btn-sm btn-outline-light border-0 rounded-circle" @click="closePlayer" title="Tutup Pemutar">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <div class="player-body bg-black position-relative">
        <!-- 1. VIDEO SCREEN -->
        <div v-if="currentMedia.mediaType === 'video'" class="video-container position-relative ratio ratio-16x9">
          <!-- YouTube Iframe -->
          <iframe
            v-if="currentMedia.type === 'youtube' && currentMedia.youtubeId"
            :src="`https://www.youtube.com/embed/${currentMedia.youtubeId}?autoplay=1&enablejsapi=1`"
            class="w-100 h-100 border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <!-- Native HTML5 Video -->
          <video
            v-else
            ref="videoPlayerRef"
            :src="currentMedia.url"
            class="w-100 h-100 object-fit-contain"
            controls
            autoplay
            @timeupdate="onTimeUpdate"
            @loadedmetadata="onLoadedMetadata"
            @ended="onMediaEnded"
          ></video>
        </div>

        <!-- 2. AUDIO / MUSIC SCREEN (Anime Vinyl / Equalizer Studio) -->
        <div v-else class="audio-screen py-5 px-3 px-md-5 d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden">
          <!-- Ambient Glow Background -->
          <div class="ambient-glow" :class="{ 'playing': isPlaying }"></div>

          <div class="d-flex flex-column flex-md-row align-items-center gap-4 position-relative z-1 mb-4 w-100 justify-content-center">
            <!-- Vinyl Disc Animation -->
            <div class="vinyl-record-wrap shadow-lg" :class="{ 'spin-active': isPlaying }">
              <div class="vinyl-disc">
                <div class="vinyl-groove"></div>
                <div class="vinyl-center">
                  <i class="bi bi-disc text-primary fs-1" v-if="!currentMedia.thumbnail"></i>
                  <img v-else :src="currentMedia.thumbnail" alt="Cover" class="w-100 h-100 rounded-circle object-fit-cover" />
                </div>
              </div>
            </div>

            <!-- Track Info & Visualizer -->
            <div class="text-center text-md-start text-white">
              <span class="badge bg-primary bg-opacity-25 text-info border border-info border-opacity-25 rounded-pill px-3 py-1 mb-2 fw-semibold">
                <i class="bi bi-folder2-open me-1"></i> {{ currentMedia.playlist || 'Semua Musik' }}
              </span>
              <h3 class="fw-bold text-white mb-1">{{ currentMedia.title }}</h3>
              <p class="text-white-50 fs-6 mb-3">
                <i class="bi bi-person-fill me-1"></i> {{ currentMedia.artist || 'Unknown Artist' }}
                <span v-if="currentMedia.category" class="ms-2 badge bg-secondary-subtle text-white-50 fw-normal">#{{ currentMedia.category }}</span>
              </p>

              <!-- Equalizer Wave Bars -->
              <div class="equalizer-bars d-flex align-items-end gap-1 justify-content-center justify-content-md-start">
                <span v-for="i in 16" :key="i" class="eq-bar" :class="{ 'active': isPlaying }"></span>
              </div>
            </div>
          </div>

          <!-- Hidden Native Audio Element -->
          <audio
            ref="audioPlayerRef"
            :src="currentMedia.url"
            autoplay
            @timeupdate="onTimeUpdate"
            @loadedmetadata="onLoadedMetadata"
            @ended="onMediaEnded"
            @play="isPlaying = true"
            @pause="isPlaying = false"
          ></audio>
        </div>

        <!-- Custom Audio / Media Control Console -->
        <div class="media-controls-bar bg-dark bg-opacity-95 p-3 text-white border-top border-secondary border-opacity-25">
          <!-- Timeline Scrubber -->
          <div class="d-flex align-items-center gap-2 mb-2">
            <small class="text-white-50 text-monospace" style="min-width: 45px;">{{ formatTime(currentTime) }}</small>
            <input
              type="range"
              class="form-range flex-grow-1 custom-range"
              min="0"
              :max="duration || 100"
              step="0.5"
              :value="currentTime"
              @input="seekMedia"
            />
            <small class="text-white-50 text-monospace" style="min-width: 45px; text-align: right;">{{ formatTime(duration) }}</small>
          </div>

          <!-- Button Controls Row -->
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <!-- Left: Repeat & Shuffle -->
            <div class="d-flex align-items-center gap-2">
              <button 
                class="btn btn-sm btn-dark rounded-circle border-0" 
                :class="{ 'text-primary fw-bold': loopMode !== 'off', 'text-white-50': loopMode === 'off' }"
                @click="toggleLoopMode"
                :title="loopMode === 'one' ? 'Ulangi Lagu Ini' : (loopMode === 'all' ? 'Ulangi Seluruh Playlist' : 'Ulangi Mati')"
              >
                <i :class="loopMode === 'one' ? 'bi bi-repeat-1 fs-5' : 'bi bi-repeat fs-5'"></i>
              </button>
              <button 
                class="btn btn-sm btn-dark rounded-circle border-0" 
                :class="{ 'text-primary fw-bold': isShuffle, 'text-white-50': !isShuffle }"
                @click="isShuffle = !isShuffle"
                title="Acak Urutan Putar (Shuffle)"
              >
                <i class="bi bi-shuffle fs-5"></i>
              </button>
            </div>

            <!-- Center: Prev, Play/Pause, Next -->
            <div class="d-flex align-items-center gap-3">
              <button class="btn btn-dark rounded-circle border-0 p-2" @click="playPrev" title="Sebelumnya">
                <i class="bi bi-skip-start-fill fs-4 text-white"></i>
              </button>
              <button class="btn btn-primary rounded-circle p-3 shadow-lg play-btn d-flex align-items-center justify-content-center" @click="togglePlayPause" title="Play / Pause">
                <i :class="isPlaying ? 'bi bi-pause-fill fs-4 text-white' : 'bi bi-play-fill fs-4 text-white'"></i>
              </button>
              <button class="btn btn-dark rounded-circle border-0 p-2" @click="playNext" title="Selanjutnya">
                <i class="bi bi-skip-end-fill fs-4 text-white"></i>
              </button>
            </div>

            <!-- Right: Volume, Speed & Playlist Info -->
            <div class="d-flex align-items-center gap-3">
              <!-- Speed Selector -->
              <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary text-white dropdown-toggle rounded-pill px-2.5 py-1" type="button" data-bs-toggle="dropdown">
                  {{ playbackRate }}x
                </button>
                <ul class="dropdown-menu dropdown-menu-dark">
                  <li v-for="rate in [0.5, 0.75, 1, 1.25, 1.5, 2]" :key="rate">
                    <a class="dropdown-item" href="#" @click.prevent="setPlaybackRate(rate)">{{ rate }}x Normal</a>
                  </li>
                </ul>
              </div>

              <!-- Volume Control -->
              <div class="d-flex align-items-center gap-2" style="width: 130px;">
                <button class="btn btn-sm btn-dark rounded-circle border-0 p-0 text-white-50" @click="toggleMute">
                  <i :class="isMuted || volume === 0 ? 'bi bi-volume-mute-fill text-danger' : (volume < 0.5 ? 'bi bi-volume-down-fill' : 'bi bi-volume-up-fill')"></i>
                </button>
                <input
                  type="range"
                  class="form-range custom-range"
                  min="0"
                  max="1"
                  step="0.05"
                  v-model="volume"
                  @input="onVolumeChange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Form Card (Expandable Dropzone) -->
    <transition name="fade-slide">
      <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4 upload-card" v-if="showUploadForm">
        <div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
          <div class="d-flex align-items-center gap-2">
            <span class="p-2 bg-primary-subtle text-primary rounded-circle fs-5 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
              <i class="bi bi-cloud-arrow-up-fill"></i>
            </span>
            <div>
              <h5 class="fw-bold text-dark mb-0">Upload File Media (Musik & Video)</h5>
              <small class="text-muted">Dukung berkas audio (.mp3, .wav, .m4a, .ogg) & video (.mp4, .webm, .mkv) lokal atau link YouTube</small>
            </div>
          </div>
          <button class="btn btn-sm btn-light rounded-circle" @click="showUploadForm = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Mode Tab: File Upload vs Link / URL -->
        <ul class="nav nav-pills mb-3 gap-2">
          <li class="nav-item">
            <button 
              class="nav-link rounded-pill px-3 py-1.5 fw-bold" 
              :class="uploadMode === 'file' ? 'active bg-primary' : 'bg-light text-dark'"
              @click="uploadMode = 'file'"
            >
              <i class="bi bi-file-earmark-arrow-up-fill me-1"></i> Upload File Komputer/HP
            </button>
          </li>
          <li class="nav-item">
            <button 
              class="nav-link rounded-pill px-3 py-1.5 fw-bold" 
              :class="uploadMode === 'link' ? 'active bg-primary' : 'bg-light text-dark'"
              @click="uploadMode = 'link'"
            >
              <i class="bi bi-link-45deg me-1"></i> URL Web / YouTube Sync
            </button>
          </li>
        </ul>

        <!-- 1. FILE UPLOAD DROPZONE -->
        <div v-if="uploadMode === 'file'" class="mb-3">
          <div 
            class="dropzone-area p-4 p-md-5 rounded-4 border-2 border-dashed text-center transition-all cursor-pointer"
            :class="{ 'drag-over': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            @click="triggerFileInput"
          >
            <i class="bi bi-file-earmark-music-fill text-primary display-4 mb-2 d-block"></i>
            <h5 class="fw-bold text-dark mb-1">Tarik & Lepaskan File Audio / Video ke Sini</h5>
            <p class="text-muted small mb-3">Atau klik untuk memilih berkas dari komputer/HP Anda (MP3, WAV, M4A, MP4, WEBM, MKV)</p>
            <span class="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold">
              <i class="bi bi-folder2-open me-1"></i> Pilih Berkas Media
            </span>
            <input type="file" ref="fileInputRef" class="d-none" accept="audio/*,video/*" @change="handleFileSelect" />
          </div>

          <div v-if="selectedFileMeta" class="mt-3 p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3">
              <i :class="selectedFileMeta.mediaType === 'audio' ? 'bi bi-music-note-beamed text-primary fs-3' : 'bi bi-film text-danger fs-3'"></i>
              <div>
                <strong class="text-dark d-block">{{ selectedFileMeta.name }}</strong>
                <small class="text-muted">{{ formatFileSize(selectedFileMeta.size) }} • Tipe: {{ selectedFileMeta.mediaType.toUpperCase() }}</small>
              </div>
            </div>
            <button class="btn btn-sm btn-outline-danger rounded-circle" @click="selectedFileMeta = null" title="Batalkan">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <!-- 2. LINK / URL FORM -->
        <div v-else class="mb-3">
          <label class="form-label fw-bold text-dark">URL Video YouTube atau Link Media Stream</label>
          <div class="input-group mb-2">
            <span class="input-group-text bg-light border-end-0 text-muted">
              <i class="bi bi-link-45deg"></i>
            </span>
            <input 
              type="url" 
              class="form-control" 
              placeholder="https://www.youtube.com/watch?v=... atau link file .mp3 / .mp4 langsung" 
              v-model="newMedia.url" 
            />
          </div>
          <small class="text-muted">Masukkan link YouTube umum/unlisted atau tautan langsung audio/video online.</small>
        </div>

        <!-- Meta Details Form -->
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label fw-bold text-dark small">Judul Musik / Video *</label>
            <input type="text" class="form-control rounded-3" placeholder="Contoh: Lo-Fi Coding Beats vol.1 / Tutorial Vue" v-model="newMedia.title" required />
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold text-dark small">Artis / Pembuat / Channel</label>
            <input type="text" class="form-control rounded-3" placeholder="Contoh: Kafeinarts / Lofi Girl / DevTips" v-model="newMedia.artist" />
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold text-dark small">Masukkan ke Playlist</label>
            <select class="form-select rounded-3" v-model="newMedia.playlist">
              <option v-for="pl in playlists" :key="pl" :value="pl">{{ pl }}</option>
              <option value="+ Tambah Playlist Baru">+ Tambah Playlist Baru</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold text-dark small">Kategori</label>
            <select class="form-select rounded-3" v-model="newMedia.category">
              <option value="Musik Kerja">🎵 Musik Kerja & Fokus</option>
              <option value="Lo-Fi & Chill">☕ Lo-Fi & Chill</option>
              <option value="Edukasi & Tutorial">🎓 Edukasi & Tutorial</option>
              <option value="Presentasi Proyek">💼 Presentasi Proyek</option>
              <option value="Meeting Record">🎙️ Rekaman Rapat / Diskusi</option>
              <option value="Hiburan">🍿 Hiburan & Santai</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold text-dark small">Tipe Media</label>
            <select class="form-select rounded-3" v-model="newMedia.mediaType">
              <option value="audio">🎵 Audio / Musik</option>
              <option value="video">🎬 Video</option>
            </select>
          </div>
          <div class="col-12">
            <label class="form-label fw-bold text-dark small">Deskripsi / Catatan Tambahan (Opsional)</label>
            <textarea class="form-control rounded-3" rows="2" placeholder="Catatan singkat mengenai file atau timestamps lagu/video..." v-model="newMedia.description"></textarea>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <button class="btn btn-light rounded-pill px-4" @click="showUploadForm = false">Batal</button>
          <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" @click="saveNewMedia">
            <i class="bi bi-check2-circle me-1"></i> Simpan Media
          </button>
        </div>
      </div>
    </transition>

    <!-- Stats & Overview Cards -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 stat-card">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small fw-semibold">Total Media</span>
              <h3 class="fw-bold text-dark mb-0 mt-1">{{ mediaList.length }}</h3>
            </div>
            <div class="p-3 bg-primary-subtle text-primary rounded-3 fs-4">
              <i class="bi bi-collection-play-fill"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 stat-card">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small fw-semibold">Musik & Audio</span>
              <h3 class="fw-bold text-info mb-0 mt-1">{{ audioCount }}</h3>
            </div>
            <div class="p-3 bg-info-subtle text-info rounded-3 fs-4">
              <i class="bi bi-music-note-list"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 stat-card">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small fw-semibold">Video</span>
              <h3 class="fw-bold text-danger mb-0 mt-1">{{ videoCount }}</h3>
            </div>
            <div class="p-3 bg-danger-subtle text-danger rounded-3 fs-4">
              <i class="bi bi-camera-video-fill"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 stat-card">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small fw-semibold">Playlist Aktif</span>
              <h3 class="fw-bold text-warning mb-0 mt-1">{{ playlists.length }}</h3>
            </div>
            <div class="p-3 bg-warning-subtle text-warning rounded-3 fs-4">
              <i class="bi bi-folder-fill"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Playlist Tabs Bar -->
    <div class="card border-0 shadow-sm rounded-4 bg-white p-3 mb-4">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <!-- Playlist Pills -->
        <div class="d-flex align-items-center gap-2 overflow-x-auto pb-1 pb-md-0 playlist-scroll">
          <button
            class="btn btn-sm rounded-pill px-3 py-2 fw-semibold text-nowrap"
            :class="selectedPlaylist === 'all' ? 'btn-primary' : 'btn-light border'"
            @click="selectedPlaylist = 'all'"
          >
            <i class="bi bi-grid-fill me-1"></i> Semua Media ({{ mediaList.length }})
          </button>
          <button
            v-for="pl in playlists"
            :key="pl"
            class="btn btn-sm rounded-pill px-3 py-2 fw-semibold text-nowrap"
            :class="selectedPlaylist === pl ? 'btn-primary' : 'btn-light border'"
            @click="selectedPlaylist = pl"
          >
            <i class="bi bi-folder2 me-1"></i> {{ pl }} ({{ getPlaylistCount(pl) }})
          </button>
        </div>

        <!-- Action: Play All in Current Playlist -->
        <div class="d-flex align-items-center gap-2 flex-shrink-0">
          <button 
            class="btn btn-sm btn-success rounded-pill px-3.5 py-2 fw-bold d-flex align-items-center gap-1.5 shadow-sm"
            @click="playEntirePlaylist"
            :disabled="filteredMedia.length === 0"
            title="Putar semua media dalam daftar ini secara otomatis"
          >
            <i class="bi bi-play-circle-fill fs-6"></i>
            <span>Putar Playlist Ini</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="card border-0 shadow-sm rounded-4 bg-white p-3 p-md-4 mb-4">
      <div class="row g-3 align-items-center">
        <!-- Search Input -->
        <div class="col-12 col-md-5">
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
              <i class="bi bi-search"></i>
            </span>
            <input
              type="text"
              class="form-control bg-light border-start-0 rounded-end-3"
              placeholder="Cari lagu, video, atau artis..."
              v-model="searchQuery"
            />
          </div>
        </div>

        <!-- Media Type Selector -->
        <div class="col-12 col-md-4">
          <div class="btn-group w-100" role="group">
            <button
              type="button"
              class="btn btn-sm py-2"
              :class="mediaTypeFilter === 'all' ? 'btn-primary fw-bold' : 'btn-outline-secondary'"
              @click="mediaTypeFilter = 'all'"
            >
              Semua
            </button>
            <button
              type="button"
              class="btn btn-sm py-2"
              :class="mediaTypeFilter === 'audio' ? 'btn-primary fw-bold' : 'btn-outline-secondary'"
              @click="mediaTypeFilter = 'audio'"
            >
              <i class="bi bi-music-note me-1"></i> Musik ({{ audioCount }})
            </button>
            <button
              type="button"
              class="btn btn-sm py-2"
              :class="mediaTypeFilter === 'video' ? 'btn-primary fw-bold' : 'btn-outline-secondary'"
              @click="mediaTypeFilter = 'video'"
            >
              <i class="bi bi-film me-1"></i> Video ({{ videoCount }})
            </button>
            <button
              type="button"
              class="btn btn-sm py-2"
              :class="mediaTypeFilter === 'favorite' ? 'btn-primary fw-bold' : 'btn-outline-secondary'"
              @click="mediaTypeFilter = 'favorite'"
            >
              <i class="bi bi-star-fill text-warning me-1"></i> Favorit
            </button>
          </div>
        </div>

        <!-- View Mode: Grid vs List -->
        <div class="col-12 col-md-3 d-flex justify-content-md-end align-items-center gap-2">
          <span class="text-muted small">Tampilan:</span>
          <div class="btn-group" role="group">
            <button 
              class="btn btn-sm" 
              :class="viewLayout === 'grid' ? 'btn-primary' : 'btn-light border'"
              @click="viewLayout = 'grid'"
              title="Tampilan Grid Kartu"
            >
              <i class="bi bi-grid-3x3-gap-fill"></i>
            </button>
            <button 
              class="btn btn-sm" 
              :class="viewLayout === 'list' ? 'btn-primary' : 'btn-light border'"
              @click="viewLayout = 'list'"
              title="Tampilan List Rapi"
            >
              <i class="bi bi-list-ul"></i>
            </button>
          </div>
          <button class="btn btn-sm btn-outline-secondary rounded-3 ms-2" @click="loadSampleMedia" title="Muat Media Contoh">
            <i class="bi bi-arrow-repeat"></i> Contoh
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredMedia.length === 0" class="card border-0 shadow-sm rounded-4 bg-white text-center py-5 px-3">
      <div class="py-4">
        <i class="bi bi-music-note-beamed display-1 text-muted opacity-50 mb-3 d-block"></i>
        <h4 class="fw-bold text-dark">Belum Ada Media di Playlist Ini</h4>
        <p class="text-muted mb-4" style="max-width: 500px; margin: auto;">
          Upload lagu atau video kerja Anda sekarang untuk memulai mendengarkan dan menonton langsung dari RajinKerja.
        </p>
        <div class="d-flex justify-content-center gap-2">
          <button class="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm" @click="showUploadForm = true">
            <i class="bi bi-cloud-arrow-up-fill me-1"></i> Upload Media Baru
          </button>
          <button class="btn btn-outline-secondary rounded-pill px-4 py-2" @click="loadSampleMedia">
            Muat Sampel Musik & Video
          </button>
        </div>
      </div>
    </div>

    <!-- 1. GRID VIEW -->
    <div v-else-if="viewLayout === 'grid'" class="row g-3 g-md-4">
      <div v-for="item in filteredMedia" :key="item.id" class="col-12 col-sm-6 col-lg-4 col-xl-3">
        <div 
          class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden media-card transition-all"
          :class="{ 'border-primary border-2 shadow': currentMedia && currentMedia.id === item.id }"
        >
          <!-- Thumbnail / Visual Aspect -->
          <div class="position-relative media-thumb-wrap bg-dark ratio ratio-16x9">
            <!-- Video Thumbnail -->
            <img 
              v-if="item.thumbnail" 
              :src="item.thumbnail" 
              :alt="item.title" 
              class="w-100 h-100 object-fit-cover" 
            />
            <!-- Fallback Audio Cover -->
            <div v-else class="w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-gradient-audio text-white p-3 text-center">
              <i :class="item.mediaType === 'audio' ? 'bi bi-disc-fill display-5 mb-1 text-info' : 'bi bi-film display-5 mb-1 text-danger'"></i>
              <span class="small fw-bold text-truncate w-100">{{ item.artist || 'RajinKerja Audio' }}</span>
            </div>

            <!-- Play Overlay Button -->
            <button 
              class="btn btn-primary rounded-circle position-absolute top-50 start-50 translate-middle shadow-lg play-overlay-btn"
              @click="playMedia(item)"
              :title="'Putar ' + item.title"
            >
              <i :class="currentMedia && currentMedia.id === item.id && isPlaying ? 'bi bi-pause-fill fs-5' : 'bi bi-play-fill fs-5'"></i>
            </button>

            <!-- Duration Badge -->
            <span class="badge bg-black bg-opacity-75 text-white position-absolute bottom-0 end-0 m-2 px-2 py-1 rounded-2 text-monospace small">
              {{ item.duration || (item.mediaType === 'audio' ? '03:45' : '10:00') }}
            </span>

            <!-- Media Type Tag -->
            <span 
              class="badge position-absolute top-0 start-0 m-2 px-2.5 py-1 rounded-pill fw-bold"
              :class="item.mediaType === 'audio' ? 'bg-primary text-white' : 'bg-danger text-white'"
            >
              <i :class="item.mediaType === 'audio' ? 'bi bi-music-note me-1' : 'bi bi-camera-video me-1'"></i>
              {{ item.mediaType === 'audio' ? 'Audio' : 'Video' }}
            </span>
          </div>

          <!-- Card Content -->
          <div class="card-body p-3 d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex justify-content-between align-items-start gap-1 mb-1">
                <span class="badge bg-light text-muted border text-truncate" style="max-width: 140px;">
                  <i class="bi bi-folder2 me-1"></i>{{ item.playlist || 'Semua' }}
                </span>
                <button 
                  class="btn btn-sm btn-link p-0 text-muted" 
                  @click="toggleFavorite(item)" 
                  :title="item.isFavorite ? 'Favorit' : 'Jadikan Favorit'"
                >
                  <i :class="item.isFavorite ? 'bi bi-star-fill text-warning fs-6' : 'bi bi-star fs-6'"></i>
                </button>
              </div>

              <h6 class="fw-bold text-dark mb-1 text-truncate-2" :title="item.title" style="min-height: 2.4rem;">
                {{ item.title }}
              </h6>
              <p class="text-muted small mb-2 text-truncate">
                <i class="bi bi-person me-1"></i>{{ item.artist || 'Unknown' }}
              </p>
            </div>

            <!-- Footer Actions -->
            <div class="pt-2 border-top d-flex justify-content-between align-items-center">
              <button 
                class="btn btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                :class="currentMedia && currentMedia.id === item.id ? 'btn-success' : 'btn-primary'"
                @click="playMedia(item)"
              >
                <i :class="currentMedia && currentMedia.id === item.id && isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
                <span>{{ currentMedia && currentMedia.id === item.id && isPlaying ? 'Jeda' : 'Putar' }}</span>
              </button>

              <div class="dropdown">
                <button class="btn btn-sm btn-light rounded-circle" type="button" data-bs-toggle="dropdown" title="Menu Opsi">
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                  <li>
                    <h6 class="dropdown-header text-uppercase small">Pindahkan ke Playlist</h6>
                  </li>
                  <li v-for="pl in playlists" :key="pl">
                    <a class="dropdown-item small" href="#" @click.prevent="moveToPlaylist(item, pl)">
                      <i class="bi bi-folder-symlink me-1"></i> {{ pl }}
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <a class="dropdown-item text-danger small" href="#" @click.prevent="deleteMedia(item)">
                      <i class="bi bi-trash-fill me-1"></i> Hapus Media
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. LIST VIEW (Rapi & Kompak) -->
    <div v-else class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th style="width: 50px;">#</th>
              <th>Judul & Pembuat</th>
              <th>Tipe</th>
              <th>Playlist</th>
              <th>Kategori</th>
              <th>Durasi</th>
              <th class="text-end pe-4" style="width: 150px;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, idx) in filteredMedia" 
              :key="item.id"
              :class="{ 'table-primary': currentMedia && currentMedia.id === item.id }"
            >
              <td class="fw-semibold text-muted">
                <span v-if="currentMedia && currentMedia.id === item.id && isPlaying">
                  <i class="bi bi-volume-up-fill text-primary"></i>
                </span>
                <span v-else>{{ idx + 1 }}</span>
              </td>
              <td>
                <div class="d-flex align-items-center gap-3">
                  <div class="list-thumb rounded-2 bg-dark flex-shrink-0 d-flex align-items-center justify-content-center text-white" style="width: 44px; height: 44px;">
                    <img v-if="item.thumbnail" :src="item.thumbnail" class="w-100 h-100 object-fit-cover rounded-2" />
                    <i v-else :class="item.mediaType === 'audio' ? 'bi bi-music-note-beamed text-info' : 'bi bi-film text-danger'"></i>
                  </div>
                  <div class="text-truncate" style="max-width: 320px;">
                    <strong class="text-dark d-block text-truncate">{{ item.title }}</strong>
                    <small class="text-muted">{{ item.artist || 'Unknown Artist' }}</small>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge rounded-pill px-2.5 py-1" :class="item.mediaType === 'audio' ? 'bg-primary-subtle text-primary border border-primary-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'">
                  <i :class="item.mediaType === 'audio' ? 'bi bi-music-note me-1' : 'bi bi-film me-1'"></i>
                  {{ item.mediaType === 'audio' ? 'Musik' : 'Video' }}
                </span>
              </td>
              <td>
                <span class="badge bg-light text-dark border">
                  <i class="bi bi-folder2 me-1 text-primary"></i>{{ item.playlist || 'Semua' }}
                </span>
              </td>
              <td>
                <span class="small text-muted">{{ item.category || '-' }}</span>
              </td>
              <td class="text-monospace small">
                {{ item.duration || (item.mediaType === 'audio' ? '03:45' : '10:00') }}
              </td>
              <td class="text-end pe-4">
                <div class="d-flex align-items-center justify-content-end gap-1">
                  <button 
                    class="btn btn-sm rounded-circle" 
                    :class="currentMedia && currentMedia.id === item.id && isPlaying ? 'btn-success' : 'btn-primary'"
                    @click="playMedia(item)"
                    :title="currentMedia && currentMedia.id === item.id && isPlaying ? 'Jeda' : 'Putar'"
                  >
                    <i :class="currentMedia && currentMedia.id === item.id && isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
                  </button>
                  <button class="btn btn-sm btn-light rounded-circle border" @click="toggleFavorite(item)">
                    <i :class="item.isFavorite ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"></i>
                  </button>
                  <button class="btn btn-sm btn-light rounded-circle border text-danger" @click="deleteMedia(item)" title="Hapus">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Manage Playlists Modal -->
    <div class="modal fade show d-block" tabindex="-1" v-if="showPlaylistModal" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow-lg">
          <div class="modal-header border-bottom pb-3">
            <h5 class="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <i class="bi bi-folder-check text-primary"></i> Kelola Playlist Media
            </h5>
            <button type="button" class="btn-close" @click="showPlaylistModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <!-- Add New Playlist Input -->
            <label class="form-label fw-bold text-dark small">Buat Playlist Baru</label>
            <div class="input-group mb-4">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Nama playlist baru (misal: Focus Lo-Fi, Vlog Kerja)..." 
                v-model="newPlaylistName"
                @keyup.enter="addNewPlaylist"
              />
              <button class="btn btn-primary fw-bold px-3" @click="addNewPlaylist">
                <i class="bi bi-plus-lg me-1"></i> Buat
              </button>
            </div>

            <!-- Existing Playlists List -->
            <h6 class="fw-bold text-dark small text-uppercase mb-2">Daftar Playlist Saat Ini</h6>
            <div class="list-group rounded-3 border">
              <div 
                v-for="pl in playlists" 
                :key="pl" 
                class="list-group-item d-flex justify-content-between align-items-center py-2.5 px-3"
              >
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-folder-fill text-warning fs-5"></i>
                  <strong class="text-dark">{{ pl }}</strong>
                  <span class="badge bg-light text-muted border rounded-pill">{{ getPlaylistCount(pl) }} item</span>
                </div>
                <button 
                  class="btn btn-sm btn-outline-danger border-0 rounded-circle"
                  @click="removePlaylist(pl)"
                  title="Hapus Playlist"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer border-top pt-3">
            <button type="button" class="btn btn-primary rounded-pill px-4 fw-bold" @click="showPlaylistModal = false">
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import Swal from 'sweetalert2';

const STORAGE_KEY = 'rk_video_hub_videos';
const PLAYLISTS_STORAGE_KEY = 'rk_media_playlists';

const DEFAULT_PLAYLISTS = [
  'Musik Kerja & Fokus',
  'Lo-Fi Coding Beats',
  'Tutorial Video & Edukasi',
  'Presentasi & Meeting'
];

const SAMPLE_MEDIA = [
  {
    id: 'm1',
    title: 'Lo-Fi Chill Beats for Deep Coding & Focus',
    artist: 'Kafeinarts Lofi Sound',
    mediaType: 'audio',
    type: 'url',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
    category: 'Lo-Fi & Chill',
    playlist: 'Lo-Fi Coding Beats',
    duration: '02:40',
    description: 'Musik lo-fi santai untuk menjaga konsentrasi saat coding, merancang UI, atau menulis laporan.',
    isFavorite: true,
    createdDate: '2026-08-01'
  },
  {
    id: 'm2',
    title: 'Synthwave Neon Drive (Productive Work Rhythm)',
    artist: 'Retro Horizon',
    mediaType: 'audio',
    type: 'url',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=synthwave-80s-110045.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    category: 'Musik Kerja',
    playlist: 'Musik Kerja & Fokus',
    duration: '03:15',
    description: 'Irama synthwave energik untuk menuntaskan deadline dan sprint tugas proyek.',
    isFavorite: true,
    createdDate: '2026-08-03'
  },
  {
    id: 'm3',
    title: 'Peaceful Ambient Piano & Rain for Night Owl Developers',
    artist: 'Acoustic Solitude',
    mediaType: 'audio',
    type: 'url',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    category: 'Lo-Fi & Chill',
    playlist: 'Lo-Fi Coding Beats',
    duration: '04:12',
    description: 'Alunan piano lembut dengan efek hujan rintik untuk sesi kerja malam hari yang tenang.',
    isFavorite: false,
    createdDate: '2026-08-05'
  },
  {
    id: 'v1',
    title: 'Vue 3 Full Course 2026 - Master Options & Composition API',
    artist: 'Web Dev Mastery',
    mediaType: 'video',
    type: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=FXpIoQ_rT_c',
    youtubeId: 'FXpIoQ_rT_c',
    thumbnail: 'https://img.youtube.com/vi/FXpIoQ_rT_c/hqdefault.jpg',
    category: 'Edukasi & Tutorial',
    playlist: 'Tutorial Video & Edukasi',
    duration: '15:20',
    description: 'Panduan lengkap mempelajari Vue 3 dari dasar hingga tingkat lanjut termasuk Vuex, Vue Router, dan Vite.',
    isFavorite: true,
    createdDate: '2026-08-01'
  },
  {
    id: 'v2',
    title: 'Demo Presentasi Dashboard Client PT Teknologi Nusantara',
    artist: 'Arif Permana',
    mediaType: 'video',
    type: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    category: 'Presentasi Proyek',
    playlist: 'Presentasi & Meeting',
    duration: '03:32',
    description: 'Rekaman video walkthrough fitur dashboard e-commerce unlisted untuk klien korporat.',
    isFavorite: false,
    createdDate: '2026-08-05'
  },
  {
    id: 'v3',
    title: 'Productivity Workflows & Time Management Tips for Developers',
    artist: 'Kafeinarts Studio',
    mediaType: 'video',
    type: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=l40_hBf23_Q',
    youtubeId: 'l40_hBf23_Q',
    thumbnail: 'https://img.youtube.com/vi/l40_hBf23_Q/hqdefault.jpg',
    category: 'Edukasi & Tutorial',
    playlist: 'Tutorial Video & Edukasi',
    duration: '10:05',
    description: 'Strategi mengelola waktu, metode Pomodoro, dan mengoptimalkan task management harian.',
    isFavorite: true,
    createdDate: '2026-08-08'
  }
];

export default {
  name: 'VideoHubView',
  setup() {
    const mediaList = ref([]);
    const playlists = ref([]);
    const searchQuery = ref('');
    const selectedPlaylist = ref('all');
    const mediaTypeFilter = ref('all');
    const viewLayout = ref('grid'); // 'grid' | 'list'

    const showUploadForm = ref(false);
    const showPlaylistModal = ref(false);
    const uploadMode = ref('file'); // 'file' | 'link'
    const isDragging = ref(false);
    const selectedFileMeta = ref(null);
    const newPlaylistName = ref('');
    const mediaJsonInput = ref(null);
    const fileInputRef = ref(null);

    // Active Player state
    const currentMedia = ref(null);
    const isPlaying = ref(false);
    const currentTime = ref(0);
    const duration = ref(0);
    const volume = ref(0.85);
    const isMuted = ref(false);
    const playbackRate = ref(1);
    const loopMode = ref('all'); // 'off' | 'all' | 'one'
    const isShuffle = ref(false);

    const audioPlayerRef = ref(null);
    const videoPlayerRef = ref(null);

    const newMedia = reactive({
      title: '',
      artist: '',
      playlist: 'Musik Kerja & Fokus',
      category: 'Musik Kerja',
      mediaType: 'audio',
      url: '',
      description: ''
    });

    // Load from LocalStorage
    const loadMediaFromStorage = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // ensure backwards compatibility: if old videos don't have mediaType, assign 'video'
          mediaList.value = parsed.map(item => ({
            ...item,
            mediaType: item.mediaType || 'video'
          }));
        } else {
          mediaList.value = [...SAMPLE_MEDIA];
          saveMediaToStorage();
        }
      } catch (err) {
        mediaList.value = [...SAMPLE_MEDIA];
      }

      try {
        const savedPl = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
        if (savedPl) {
          playlists.value = JSON.parse(savedPl);
        } else {
          playlists.value = [...DEFAULT_PLAYLISTS];
          savePlaylistsToStorage();
        }
      } catch (err) {
        playlists.value = [...DEFAULT_PLAYLISTS];
      }
    };

    const saveMediaToStorage = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mediaList.value));
      } catch (err) {
        console.error('Failed to save media', err);
      }
    };

    const savePlaylistsToStorage = () => {
      try {
        localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists.value));
      } catch (err) {
        console.error('Failed to save playlists', err);
      }
    };

    const audioCount = computed(() => mediaList.value.filter(m => m.mediaType === 'audio').length);
    const videoCount = computed(() => mediaList.value.filter(m => m.mediaType === 'video').length);

    const getPlaylistCount = (plName) => {
      return mediaList.value.filter(m => m.playlist === plName).length;
    };

    const filteredMedia = computed(() => {
      return mediaList.value.filter(item => {
        // Filter Playlist
        if (selectedPlaylist.value !== 'all' && item.playlist !== selectedPlaylist.value) {
          return false;
        }
        // Filter Type
        if (mediaTypeFilter.value === 'audio' && item.mediaType !== 'audio') return false;
        if (mediaTypeFilter.value === 'video' && item.mediaType !== 'video') return false;
        if (mediaTypeFilter.value === 'favorite' && !item.isFavorite) return false;

        // Search Query
        if (searchQuery.value.trim()) {
          const q = searchQuery.value.toLowerCase();
          const matchTitle = (item.title || '').toLowerCase().includes(q);
          const matchArtist = (item.artist || '').toLowerCase().includes(q);
          const matchCat = (item.category || '').toLowerCase().includes(q);
          if (!matchTitle && !matchArtist && !matchCat) return false;
        }
        return true;
      });
    });

    // Player Actions
    const playMedia = (item) => {
      if (currentMedia.value && currentMedia.value.id === item.id) {
        togglePlayPause();
        return;
      }
      currentMedia.value = item;
      isPlaying.value = true;
      currentTime.value = 0;
      duration.value = 0;
    };

    const closePlayer = () => {
      if (audioPlayerRef.value) audioPlayerRef.value.pause();
      if (videoPlayerRef.value) videoPlayerRef.value.pause();
      isPlaying.value = false;
      currentMedia.value = null;
    };

    const togglePlayPause = () => {
      const activeEl = currentMedia.value?.mediaType === 'audio' ? audioPlayerRef.value : videoPlayerRef.value;
      if (!activeEl) return;

      if (activeEl.paused) {
        activeEl.play().then(() => {
          isPlaying.value = true;
        }).catch(() => {});
      } else {
        activeEl.pause();
        isPlaying.value = false;
      }
    };

    const onTimeUpdate = (e) => {
      currentTime.value = e.target.currentTime;
    };

    const onLoadedMetadata = (e) => {
      duration.value = e.target.duration || 0;
    };

    const seekMedia = (e) => {
      const newTime = parseFloat(e.target.value);
      currentTime.value = newTime;
      const activeEl = currentMedia.value?.mediaType === 'audio' ? audioPlayerRef.value : videoPlayerRef.value;
      if (activeEl) {
        activeEl.currentTime = newTime;
      }
    };

    const onVolumeChange = () => {
      const activeEl = currentMedia.value?.mediaType === 'audio' ? audioPlayerRef.value : videoPlayerRef.value;
      if (activeEl) {
        activeEl.volume = volume.value;
        activeEl.muted = isMuted.value;
      }
    };

    const toggleMute = () => {
      isMuted.value = !isMuted.value;
      const activeEl = currentMedia.value?.mediaType === 'audio' ? audioPlayerRef.value : videoPlayerRef.value;
      if (activeEl) {
        activeEl.muted = isMuted.value;
      }
    };

    const setPlaybackRate = (rate) => {
      playbackRate.value = rate;
      const activeEl = currentMedia.value?.mediaType === 'audio' ? audioPlayerRef.value : videoPlayerRef.value;
      if (activeEl) {
        activeEl.playbackRate = rate;
      }
    };

    const toggleLoopMode = () => {
      if (loopMode.value === 'off') loopMode.value = 'all';
      else if (loopMode.value === 'all') loopMode.value = 'one';
      else loopMode.value = 'off';
    };

    const playNext = () => {
      const list = filteredMedia.value;
      if (list.length === 0) return;

      if (isShuffle.value) {
        const randIdx = Math.floor(Math.random() * list.length);
        playMedia(list[randIdx]);
        return;
      }

      const curIdx = list.findIndex(m => m.id === currentMedia.value?.id);
      if (curIdx === -1 || curIdx >= list.length - 1) {
        if (loopMode.value !== 'off') {
          playMedia(list[0]);
        }
      } else {
        playMedia(list[curIdx + 1]);
      }
    };

    const playPrev = () => {
      const list = filteredMedia.value;
      if (list.length === 0) return;

      const curIdx = list.findIndex(m => m.id === currentMedia.value?.id);
      if (curIdx <= 0) {
        playMedia(list[list.length - 1]);
      } else {
        playMedia(list[curIdx - 1]);
      }
    };

    const onMediaEnded = () => {
      if (loopMode.value === 'one') {
        const activeEl = currentMedia.value?.mediaType === 'audio' ? audioPlayerRef.value : videoPlayerRef.value;
        if (activeEl) {
          activeEl.currentTime = 0;
          activeEl.play();
        }
      } else {
        playNext();
      }
    };

    const playEntirePlaylist = () => {
      if (filteredMedia.value.length > 0) {
        playMedia(filteredMedia.value[0]);
      }
    };

    // File Upload handling
    const triggerFileInput = () => {
      fileInputRef.value?.click();
    };

    const handleFileSelect = (e) => {
      const file = e.target.files?.[0];
      if (file) processLocalFile(file);
    };

    const handleFileDrop = (e) => {
      isDragging.value = false;
      const file = e.dataTransfer.files?.[0];
      if (file) processLocalFile(file);
    };

    const processLocalFile = (file) => {
      const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|m4a|ogg|flac|aac)$/i.test(file.name);
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mkv|mov|avi)$/i.test(file.name);

      if (!isAudio && !isVideo) {
        Swal.fire({
          icon: 'warning',
          title: 'Format Tidak Didukung',
          text: 'Harap upload file audio (.mp3, .wav, .m4a) atau video (.mp4, .webm, .mkv).'
        });
        return;
      }

      const objUrl = URL.createObjectURL(file);
      const detectedType = isAudio ? 'audio' : 'video';

      // Clean name
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "");

      selectedFileMeta.value = {
        name: file.name,
        size: file.size,
        mediaType: detectedType,
        url: objUrl
      };

      newMedia.title = cleanTitle;
      newMedia.mediaType = detectedType;
      newMedia.url = objUrl;
    };

    const saveNewMedia = () => {
      if (!newMedia.title.trim()) {
        Swal.fire({ icon: 'warning', title: 'Judul Wajib Diisi', text: 'Silakan masukkan judul media.' });
        return;
      }

      let finalUrl = newMedia.url;
      let yId = '';

      // Check if YouTube
      if (uploadMode.value === 'link' && newMedia.url.includes('youtube.com') || newMedia.url.includes('youtu.be')) {
        const match = newMedia.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (match && match[1]) {
          yId = match[1];
          newMedia.mediaType = 'video';
        }
      }

      if (!finalUrl && !selectedFileMeta.value) {
        Swal.fire({ icon: 'warning', title: 'File / URL Kosong', text: 'Silakan pilih file atau masukkan link URL media.' });
        return;
      }

      const newEntry = {
        id: 'media_' + Date.now(),
        title: newMedia.title.trim(),
        artist: newMedia.artist.trim() || 'Lokal File',
        mediaType: newMedia.mediaType,
        type: yId ? 'youtube' : 'url',
        url: finalUrl,
        youtubeId: yId,
        thumbnail: yId ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : '',
        playlist: newMedia.playlist,
        category: newMedia.category,
        description: newMedia.description.trim(),
        duration: newMedia.mediaType === 'audio' ? '03:30' : '10:00',
        isFavorite: false,
        createdDate: new Date().toISOString().split('T')[0]
      };

      mediaList.value.unshift(newEntry);
      saveMediaToStorage();

      showUploadForm.value = false;
      selectedFileMeta.value = null;
      newMedia.title = '';
      newMedia.artist = '';
      newMedia.url = '';
      newMedia.description = '';

      Swal.fire({
        icon: 'success',
        title: 'Media Berhasil Disimpan!',
        text: `"${newEntry.title}" telah ditambahkan ke playlist ${newEntry.playlist}.`,
        timer: 2000,
        showConfirmButton: false
      });

      // Automatically play it
      playMedia(newEntry);
    };

    // Playlist Management
    const addNewPlaylist = () => {
      const name = newPlaylistName.value.trim();
      if (!name) return;
      if (playlists.value.includes(name)) {
        Swal.fire({ icon: 'info', title: 'Playlist Sudah Ada' });
        return;
      }
      playlists.value.push(name);
      savePlaylistsToStorage();
      newPlaylistName.value = '';
    };

    const removePlaylist = (name) => {
      playlists.value = playlists.value.filter(p => p !== name);
      // Reassign items to default
      mediaList.value.forEach(item => {
        if (item.playlist === name) {
          item.playlist = playlists.value[0] || 'Semua Media';
        }
      });
      savePlaylistsToStorage();
      saveMediaToStorage();
    };

    const moveToPlaylist = (item, plName) => {
      item.playlist = plName;
      saveMediaToStorage();
      Swal.fire({
        icon: 'success',
        title: 'Dipindahkan!',
        text: `Media dipindahkan ke playlist ${plName}`,
        timer: 1500,
        showConfirmButton: false
      });
    };

    const toggleFavorite = (item) => {
      item.isFavorite = !item.isFavorite;
      saveMediaToStorage();
    };

    const deleteMedia = (item) => {
      Swal.fire({
        title: 'Hapus Media?',
        text: `Apakah Anda yakin ingin menghapus "${item.title}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
      }).then((res) => {
        if (res.isConfirmed) {
          if (currentMedia.value?.id === item.id) {
            closePlayer();
          }
          mediaList.value = mediaList.value.filter(m => m.id !== item.id);
          saveMediaToStorage();
        }
      });
    };

    const loadSampleMedia = () => {
      mediaList.value = [...SAMPLE_MEDIA];
      playlists.value = [...DEFAULT_PLAYLISTS];
      saveMediaToStorage();
      savePlaylistsToStorage();
      Swal.fire({
        icon: 'success',
        title: 'Sampel Dimuat!',
        text: '6 file sampel musik dan video berhasil dimuat.',
        timer: 2000,
        showConfirmButton: false
      });
    };

    // Export / Import
    const exportMediaJson = () => {
      const dataStr = JSON.stringify({
        media: mediaList.value,
        playlists: playlists.value,
        exportDate: new Date().toISOString()
      }, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rajinkerja-media-hub-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    };

    const triggerImportMediaJson = () => {
      mediaJsonInput.value?.click();
    };

    const onMediaJsonSelected = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          const incoming = Array.isArray(parsed) ? parsed : (parsed.media || parsed.videos || []);
          if (incoming.length > 0) {
            mediaList.value = [...incoming];
            if (parsed.playlists) playlists.value = [...parsed.playlists];
            saveMediaToStorage();
            savePlaylistsToStorage();
            Swal.fire({ icon: 'success', title: 'Import Sukses!', text: `${incoming.length} media berhasil diimpor.` });
          }
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Format File Tidak Valid' });
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    };

    const formatTime = (secs) => {
      if (!secs || isNaN(secs)) return '00:00';
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const formatFileSize = (bytes) => {
      if (!bytes) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    onMounted(() => {
      loadMediaFromStorage();
    });

    onUnmounted(() => {
      if (audioPlayerRef.value) audioPlayerRef.value.pause();
      if (videoPlayerRef.value) videoPlayerRef.value.pause();
    });

    return {
      mediaList,
      playlists,
      searchQuery,
      selectedPlaylist,
      mediaTypeFilter,
      viewLayout,
      showUploadForm,
      showPlaylistModal,
      uploadMode,
      isDragging,
      selectedFileMeta,
      newPlaylistName,
      mediaJsonInput,
      fileInputRef,
      currentMedia,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      playbackRate,
      loopMode,
      isShuffle,
      audioPlayerRef,
      videoPlayerRef,
      newMedia,
      audioCount,
      videoCount,
      filteredMedia,
      getPlaylistCount,
      playMedia,
      closePlayer,
      togglePlayPause,
      onTimeUpdate,
      onLoadedMetadata,
      seekMedia,
      onVolumeChange,
      toggleMute,
      setPlaybackRate,
      toggleLoopMode,
      playNext,
      playPrev,
      onMediaEnded,
      playEntirePlaylist,
      triggerFileInput,
      handleFileSelect,
      handleFileDrop,
      saveNewMedia,
      addNewPlaylist,
      removePlaylist,
      moveToPlaylist,
      toggleFavorite,
      deleteMedia,
      loadSampleMedia,
      exportMediaJson,
      triggerImportMediaJson,
      onMediaJsonSelected,
      formatTime,
      formatFileSize
    };
  }
};
</script>

<style scoped>
.header-banner {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0f172a 100%);
}

.ambient-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 350px;
  height: 350px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(14, 165, 233, 0.45) 0%, rgba(2, 132, 199, 0.15) 50%, transparent 75%);
  filter: blur(50px);
  pointer-events: none;
  transition: opacity 0.5s ease;
  opacity: 0.3;
}

.ambient-glow.playing {
  opacity: 0.85;
  animation: pulse-glow 3s infinite alternate ease-in-out;
}

@keyframes pulse-glow {
  0% { transform: translate(-50%, -50%) scale(0.9); }
  100% { transform: translate(-50%, -50%) scale(1.2); }
}

/* Vinyl Disc Animation */
.vinyl-record-wrap {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: #000;
  padding: 8px;
  border: 4px solid #1e293b;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
  flex-shrink: 0;
}

.vinyl-disc {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: repeating-radial-gradient(#18181b, #09090b 2px, #18181b 4px);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vinyl-center {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: #0284c7;
  border: 4px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.spin-active .vinyl-disc {
  animation: spin-record 8s linear infinite;
}

@keyframes spin-record {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Equalizer Bars */
.equalizer-bars {
  height: 28px;
}

.eq-bar {
  width: 4px;
  background: #38bdf8;
  border-radius: 3px;
  height: 6px;
  transition: height 0.15s ease;
}

.eq-bar.active:nth-child(2n) {
  animation: eq-bounce 0.8s infinite alternate ease-in-out;
}
.eq-bar.active:nth-child(2n+1) {
  animation: eq-bounce 1.1s infinite alternate ease-in-out;
}
.eq-bar.active:nth-child(3n) {
  animation: eq-bounce 0.6s infinite alternate ease-in-out;
}

@keyframes eq-bounce {
  0% { height: 4px; }
  50% { height: 26px; }
  100% { height: 10px; }
}

/* Custom Range Input */
.custom-range {
  cursor: pointer;
}

.custom-range::-webkit-slider-thumb {
  background-color: #38bdf8;
  box-shadow: 0 0 8px rgba(56, 189, 248, 0.8);
}

/* Dropzone Area */
.dropzone-area {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.dropzone-area:hover, .dropzone-area.drag-over {
  background-color: #f0f9ff;
  border-color: #0284c7;
}

/* Media Cards */
.media-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.media-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
}

.media-thumb-wrap {
  position: relative;
  overflow: hidden;
}

.play-overlay-btn {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
  transition: all 0.25s ease;
}

.media-card:hover .play-overlay-btn {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.bg-gradient-audio {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%);
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.playlist-scroll::-webkit-scrollbar {
  height: 4px;
}
.playlist-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

/* Animation */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
