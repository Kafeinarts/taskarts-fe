<template>
  <div class="container-fluid py-4" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="card border-0 rounded-4 text-white shadow-lg mb-4 p-4 position-relative overflow-hidden header-banner">
      <div class="position-relative z-1 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="badge bg-white text-dark fw-bold px-3 py-2 rounded-pill shadow-sm">
              <i class="bi bi-play-btn-fill text-danger me-1"></i> Video Studio & Player
            </span>
            <span class="badge bg-danger bg-opacity-75 text-white fw-semibold px-3 py-2 rounded-pill">
              YouTube Public / Unlisted Sync
            </span>
          </div>
          <h2 class="fw-bold display-6 mb-1">Tonton & Upload Video 🎬</h2>
          <p class="mb-0 text-white-50">
            Upload file video lokal atau sinkronkan link YouTube (Public / Unlisted) dengan preview langsung & player bioskop interaktif.
          </p>
        </div>

        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-light text-danger fw-bold rounded-3 px-3 py-2 shadow-sm d-flex align-items-center gap-2" @click="openAddModal">
            <i class="bi bi-plus-circle-fill fs-5"></i>
            <span>Tambah / Sync Video</span>
          </button>
          <button class="btn btn-outline-light fw-semibold rounded-3 px-3 py-2" @click="loadSampleVideos">
            <i class="bi bi-collection-play me-1"></i> Muat Video Contoh
          </button>
        </div>
      </div>
    </div>

    <!-- Stat Overview Bar -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 hover-card">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small fw-semibold">Total Video</span>
              <h3 class="fw-bold text-dark mb-0 mt-1">{{ videos.length }}</h3>
            </div>
            <div class="p-3 bg-danger-subtle text-danger rounded-3 fs-3">
              <i class="bi bi-film"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 hover-card">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small fw-semibold">YouTube Sync</span>
              <h3 class="fw-bold text-primary mb-0 mt-1">{{ youtubeCount }}</h3>
            </div>
            <div class="p-3 bg-primary-subtle text-primary rounded-3 fs-3">
              <i class="bi bi-youtube"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 hover-card">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small fw-semibold">Upload Lokal</span>
              <h3 class="fw-bold text-success mb-0 mt-1">{{ localCount }}</h3>
            </div>
            <div class="p-3 bg-success-subtle text-success rounded-3 fs-3">
              <i class="bi bi-folder-symlink"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 h-100 hover-card">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small fw-semibold">Video Favorit</span>
              <h3 class="fw-bold text-warning mb-0 mt-1">{{ favoriteCount }}</h3>
            </div>
            <div class="p-3 bg-warning-subtle text-warning rounded-3 fs-3">
              <i class="bi bi-star-fill"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter & Search Controls -->
    <div class="card border-0 shadow-sm rounded-4 bg-white p-3 mb-4">
      <div class="row g-3 align-items-center">
        <!-- Search -->
        <div class="col-12 col-md-4">
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0 rounded-start-pill ps-3">
              <i class="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              class="form-control bg-light border-start-0 rounded-end-pill py-2"
              placeholder="Cari judul video, tag, deskripsi..."
              v-model="searchQuery"
            />
          </div>
        </div>

        <!-- Filter Source Type Pills -->
        <div class="col-12 col-md-5 d-flex flex-wrap gap-2">
          <button
            class="btn btn-sm rounded-pill px-3 fw-bold"
            :class="selectedSourceFilter === 'all' ? 'btn-danger text-white' : 'btn-light border text-secondary'"
            @click="selectedSourceFilter = 'all'"
          >
            Semua ({{ videos.length }})
          </button>
          <button
            class="btn btn-sm rounded-pill px-3 fw-bold"
            :class="selectedSourceFilter === 'youtube' ? 'btn-danger text-white' : 'btn-light border text-secondary'"
            @click="selectedSourceFilter = 'youtube'"
          >
            <i class="bi bi-youtube me-1"></i> YouTube
          </button>
          <button
            class="btn btn-sm rounded-pill px-3 fw-bold"
            :class="selectedSourceFilter === 'local' ? 'btn-danger text-white' : 'btn-light border text-secondary'"
            @click="selectedSourceFilter = 'local'"
          >
            <i class="bi bi-upload me-1"></i> File Lokal
          </button>
          <button
            class="btn btn-sm rounded-pill px-3 fw-bold"
            :class="selectedSourceFilter === 'favorite' ? 'btn-warning text-dark' : 'btn-light border text-secondary'"
            @click="selectedSourceFilter = 'favorite'"
          >
            <i class="bi bi-star-fill me-1"></i> Favorit
          </button>
        </div>

        <!-- Category Dropdown -->
        <div class="col-6 col-md-3 ms-auto">
          <select class="form-select rounded-pill border-secondary-subtle" v-model="selectedCategoryFilter">
            <option value="">📁 Semua Kategori</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Video Grid Gallery -->
    <div v-if="filteredVideos.length === 0" class="card border-0 shadow-sm rounded-4 bg-white p-5 text-center my-4">
      <div class="p-4 bg-light rounded-circle mx-auto mb-3" style="width: 80px; height: 80px;">
        <i class="bi bi-film fs-1 text-muted"></i>
      </div>
      <h5 class="fw-bold text-dark mb-2">Belum Ada Video</h5>
      <p class="text-muted small mx-auto" style="max-width: 450px;">
        Belum ada video yang cocok dengan pencarian Anda. Tambahkan video baru dari URL YouTube (Public/Unlisted) atau upload file lokal.
      </p>
      <div class="d-flex justify-content-center gap-2 mt-2">
        <button class="btn btn-danger rounded-pill px-4 fw-bold" @click="openAddModal">
          <i class="bi bi-plus-lg me-1"></i> Tambah Video Sekarang
        </button>
        <button class="btn btn-outline-secondary rounded-pill px-4 fw-bold" @click="loadSampleVideos">
          <i class="bi bi-play-circle me-1"></i> Muat Contoh
        </button>
      </div>
    </div>

    <div v-else class="row g-4 mb-5">
      <div v-for="video in filteredVideos" :key="video.id" class="col-12 col-md-6 col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white hover-video-card position-relative">
          <!-- Thumbnail Container -->
          <div class="position-relative bg-dark ratio ratio-16x9 cursor-pointer overflow-hidden group-hover-zoom" @click="playVideo(video)">
            <img
              v-if="video.thumbnail"
              :src="video.thumbnail"
              :alt="video.title"
              class="object-fit-cover w-100 h-100"
              @error="onThumbnailError($event, video)"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-100 bg-secondary bg-gradient text-white">
              <i class="bi bi-play-btn fs-1 opacity-75"></i>
            </div>

            <!-- Overlay Play Button -->
            <div class="play-overlay d-flex align-items-center justify-content-center position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-40">
              <div class="play-btn-circle bg-danger text-white rounded-circle shadow-lg d-flex align-items-center justify-content-center">
                <i class="bi bi-play-fill fs-2 ms-1"></i>
              </div>
            </div>

            <!-- Source Badge (YouTube vs Local) -->
            <div class="position-absolute top-0 start-0 m-2">
              <span v-if="video.type === 'youtube'" class="badge bg-danger text-white shadow-sm px-2.5 py-1.5 rounded-pill small fw-bold d-flex align-items-center gap-1">
                <i class="bi bi-youtube"></i> YouTube
                <span v-if="video.visibility" class="badge bg-white text-danger px-1.5 ms-1 text-uppercase" style="font-size: 9px;">
                  {{ video.visibility }}
                </span>
              </span>
              <span v-else class="badge bg-success text-white shadow-sm px-2.5 py-1.5 rounded-pill small fw-bold d-flex align-items-center gap-1">
                <i class="bi bi-file-earmark-play-fill"></i> Lokal
              </span>
            </div>

            <!-- Watched / Favorite Indicator -->
            <div class="position-absolute top-0 end-0 m-2 d-flex gap-1">
              <button
                class="btn btn-sm btn-dark bg-opacity-75 text-warning border-0 rounded-circle p-1.5 shadow-sm"
                @click.stop="toggleFavorite(video)"
                :title="video.isFavorite ? 'Hapus dari Favorit' : 'Tandai Favorit'"
              >
                <i :class="video.isFavorite ? 'bi bi-star-fill' : 'bi bi-star'"></i>
              </button>
            </div>

            <!-- Duration Badge -->
            <div v-if="video.duration" class="position-absolute bottom-0 end-0 m-2">
              <span class="badge bg-dark bg-opacity-75 text-white fw-bold px-2 py-1 rounded small">
                {{ video.duration }}
              </span>
            </div>
          </div>

          <!-- Card Content -->
          <div class="card-body p-3 d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="badge bg-light text-secondary border fw-semibold px-2.5 py-1 rounded-pill small">
                  {{ video.category || 'Umum' }}
                </span>
                <small class="text-muted" style="font-size: 11px;">
                  <i class="bi bi-calendar3 me-1"></i>{{ formatDate(video.createdDate) }}
                </small>
              </div>

              <h6 class="fw-bold text-dark text-truncate-2 mb-2 line-clamp-2 title-link" @click="playVideo(video)" :title="video.title">
                {{ video.title }}
              </h6>

              <p class="text-muted small text-truncate-2 mb-3 line-clamp-2" style="font-size: 13px;">
                {{ video.description || 'Tidak ada deskripsi' }}
              </p>
            </div>

            <div class="pt-2 border-top d-flex align-items-center justify-content-between">
              <button class="btn btn-sm btn-danger px-3 rounded-pill fw-bold d-flex align-items-center gap-1" @click="playVideo(video)">
                <i class="bi bi-play-circle-fill"></i> Tonton
              </button>

              <div class="d-flex align-items-center gap-1">
                <button
                  v-if="video.youtubeUrl"
                  class="btn btn-sm btn-light border text-secondary rounded-circle"
                  @click="copyVideoLink(video.youtubeUrl)"
                  title="Salin Link YouTube"
                >
                  <i class="bi bi-link-45deg"></i>
                </button>
                <button class="btn btn-sm btn-light border text-primary rounded-circle" @click="editVideo(video)" title="Edit Video">
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="btn btn-sm btn-light border text-danger rounded-circle" @click="confirmDeleteVideo(video)" title="Hapus Video">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL 1: WATCH VIDEO PLAYER (THEATER MODE) -->
    <!-- ========================================== -->
    <div
      v-if="activePlayerVideo"
      class="modal fade show d-block backdrop-blur"
      tabindex="-1"
      style="background: rgba(0, 0, 0, 0.85); z-index: 1060;"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow-2xl bg-dark text-white overflow-hidden">
          <!-- Modal Header -->
          <div class="modal-header border-secondary border-opacity-25 px-4 py-3 bg-black bg-opacity-50">
            <div class="d-flex align-items-center gap-2">
              <span v-if="activePlayerVideo.type === 'youtube'" class="badge bg-danger text-white rounded-pill px-3 py-1.5 fw-bold">
                <i class="bi bi-youtube me-1"></i> YouTube {{ activePlayerVideo.visibility ? `(${activePlayerVideo.visibility})` : '' }}
              </span>
              <span v-else class="badge bg-success text-white rounded-pill px-3 py-1.5 fw-bold">
                <i class="bi bi-file-earmark-play-fill me-1"></i> Video Lokal
              </span>
              <span class="badge bg-secondary text-white rounded-pill px-2.5 py-1 small">
                {{ activePlayerVideo.category }}
              </span>
            </div>
            <button type="button" class="btn-close btn-close-white" @click="closePlayer"></button>
          </div>

          <!-- Modal Body (Video Screen + Details) -->
          <div class="modal-body p-0">
            <div class="row g-0">
              <!-- Left / Main: Video Player Container -->
              <div class="col-12 col-lg-8 bg-black d-flex flex-column align-items-center justify-content-center">
                <!-- YouTube Embed Player -->
                <div v-if="activePlayerVideo.type === 'youtube'" class="ratio ratio-16x9 w-100 h-100">
                  <iframe
                    :src="getYouTubeEmbedUrl(activePlayerVideo.youtubeId)"
                    title="YouTube Video Player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen="true"
                    class="w-100 h-100"
                  ></iframe>
                </div>

                <!-- Local File HTML5 Player -->
                <div v-else-if="activePlayerVideo.localUrl" class="ratio ratio-16x9 w-100 h-100">
                  <video
                    controls
                    autoplay
                    class="w-100 h-100 object-fit-contain bg-black"
                    :src="activePlayerVideo.localUrl"
                  >
                    Browser Anda tidak mendukung elemen video HTML5.
                  </video>
                </div>

                <!-- Fallback No Media -->
                <div v-else class="p-5 text-center text-white-50">
                  <i class="bi bi-exclamation-triangle fs-1 text-warning mb-2"></i>
                  <p>Media video tidak dapat dirender atau URL tidak valid.</p>
                </div>
              </div>

              <!-- Right: Video Meta, Notes, Timestamps -->
              <div class="col-12 col-lg-4 p-4 bg-dark border-start border-secondary border-opacity-25 d-flex flex-column justify-content-between" style="max-height: 80vh; overflow-y: auto;">
                <div>
                  <h5 class="fw-bold text-white mb-2">{{ activePlayerVideo.title }}</h5>
                  <div class="d-flex align-items-center gap-3 text-white-50 small mb-3">
                    <span><i class="bi bi-calendar3 me-1"></i> {{ formatDate(activePlayerVideo.createdDate) }}</span>
                    <button
                      class="btn btn-sm btn-link text-warning p-0 text-decoration-none fw-bold ms-auto"
                      @click="toggleFavorite(activePlayerVideo)"
                    >
                      <i :class="activePlayerVideo.isFavorite ? 'bi bi-star-fill me-1' : 'bi bi-star me-1'"></i>
                      {{ activePlayerVideo.isFavorite ? 'Favorit' : 'Tambah Favorit' }}
                    </button>
                  </div>

                  <hr class="border-secondary border-opacity-25 my-3" />

                  <!-- Description -->
                  <div class="mb-4">
                    <label class="form-label text-uppercase fw-bold text-white-50 small mb-1" style="letter-spacing: 0.5px;">Deskripsi & Ringkasan</label>
                    <p class="text-white-50 small bg-black bg-opacity-40 p-3 rounded-3 border border-secondary border-opacity-25 mb-0" style="white-space: pre-line;">
                      {{ activePlayerVideo.description || 'Tidak ada deskripsi khusus.' }}
                    </p>
                  </div>

                  <!-- Direct YouTube Link Info -->
                  <div v-if="activePlayerVideo.youtubeUrl" class="mb-4">
                    <label class="form-label text-uppercase fw-bold text-white-50 small mb-1" style="letter-spacing: 0.5px;">Tautan Sumber YouTube</label>
                    <div class="input-group input-group-sm">
                      <input type="text" class="form-control bg-black text-white border-secondary border-opacity-25 small" :value="activePlayerVideo.youtubeUrl" readonly />
                      <button class="btn btn-outline-danger fw-bold" @click="copyVideoLink(activePlayerVideo.youtubeUrl)">
                        <i class="bi bi-clipboard me-1"></i> Salin
                      </button>
                    </div>
                  </div>

                  <!-- Quick Video Notes & Timestamps Bookmark -->
                  <div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <label class="form-label text-uppercase fw-bold text-white-50 small mb-0" style="letter-spacing: 0.5px;">Catatan Penonton & Timestamps</label>
                      <span class="badge bg-primary bg-opacity-50 text-white rounded-pill small">{{ activePlayerVideo.notes ? activePlayerVideo.notes.length : 0 }} catatan</span>
                    </div>

                    <div class="input-group input-group-sm mb-3">
                      <input
                        type="text"
                        class="form-control bg-black text-white border-secondary border-opacity-25"
                        placeholder="Ketik catatan / timestamp, e.g. 02:15 - Tips penting..."
                        v-model="newNoteText"
                        @keyup.enter="addNoteToActiveVideo"
                      />
                      <button class="btn btn-primary fw-bold" @click="addNoteToActiveVideo">
                        <i class="bi bi-plus-lg"></i>
                      </button>
                    </div>

                    <div v-if="activePlayerVideo.notes && activePlayerVideo.notes.length > 0" class="d-flex flex-column gap-2 mb-3">
                      <div
                        v-for="(note, idx) in activePlayerVideo.notes"
                        :key="idx"
                        class="p-2.5 rounded bg-black bg-opacity-30 border border-secondary border-opacity-25 d-flex justify-content-between align-items-center text-white-50 small"
                      >
                        <span><i class="bi bi-journal-text text-info me-2"></i>{{ note }}</span>
                        <button class="btn btn-sm text-danger p-0 border-0" @click="removeNoteFromActiveVideo(idx)" title="Hapus catatan">
                          <i class="bi bi-x-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                  <span class="text-white-50 small">Mode Sinema Active</span>
                  <button class="btn btn-sm btn-outline-light rounded-pill px-4 fw-bold" @click="closePlayer">
                    Tutup Player
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL 2: ADD / EDIT / SYNC VIDEO FORM      -->
    <!-- ========================================== -->
    <div v-if="showAddModal" class="modal fade show d-block backdrop-blur" tabindex="-1" style="background: rgba(0,0,0,0.6); z-index: 1055;">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow-lg bg-white overflow-hidden">
          <div class="modal-header border-bottom bg-light px-4 py-3">
            <h5 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <i class="bi bi-cloud-upload-fill text-danger fs-4"></i>
              <span>{{ isEditing ? 'Edit Informasi Video' : 'Tambah / Sync Video Baru' }}</span>
            </h5>
            <button type="button" class="btn-close" @click="closeAddModal"></button>
          </div>

          <form @submit.prevent="saveVideo">
            <div class="modal-body p-4">
              <!-- Source Selection (YouTube Link vs Local Video Upload) -->
              <div class="mb-4">
                <label class="form-label fw-bold text-dark small text-uppercase" style="letter-spacing: 0.5px;">Metode Media Video</label>
                <div class="row g-2">
                  <div class="col-6">
                    <button
                      type="button"
                      class="btn w-100 py-3 rounded-3 fw-bold d-flex flex-column align-items-center gap-1"
                      :class="form.type === 'youtube' ? 'btn-danger text-white shadow-sm' : 'btn-outline-secondary'"
                      @click="setFormType('youtube')"
                    >
                      <i class="bi bi-youtube fs-3"></i>
                      <span>Sync Link YouTube</span>
                      <small class="fw-normal opacity-75" style="font-size: 10px;">Public / Unlisted Video</small>
                    </button>
                  </div>
                  <div class="col-6">
                    <button
                      type="button"
                      class="btn w-100 py-3 rounded-3 fw-bold d-flex flex-column align-items-center gap-1"
                      :class="form.type === 'local' ? 'btn-success text-white shadow-sm' : 'btn-outline-secondary'"
                      @click="setFormType('local')"
                    >
                      <i class="bi bi-upload fs-3"></i>
                      <span>Upload File Lokal</span>
                      <small class="fw-normal opacity-75" style="font-size: 10px;">MP4, WebM, OGG, MOV</small>
                    </button>
                  </div>
                </div>
              </div>

              <!-- TYPE 1: YOUTUBE SYNC FIELD -->
              <div v-if="form.type === 'youtube'" class="mb-4 p-3 bg-danger-subtle rounded-3 border border-danger border-opacity-25">
                <label class="form-label fw-bold text-danger d-flex align-items-center justify-content-between">
                  <span><i class="bi bi-link-45deg me-1"></i> Tautan / Link Video YouTube</span>
                  <span class="badge bg-danger text-white rounded-pill px-2.5 py-1" style="font-size: 10px;">Support Public & Unlisted</span>
                </label>
                <div class="input-group mb-2">
                  <span class="input-group-text bg-white border-end-0"><i class="bi bi-youtube text-danger"></i></span>
                  <input
                    type="url"
                    class="form-control border-start-0 py-2"
                    placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                    v-model="form.youtubeUrl"
                    @input="onYouTubeUrlInput"
                    required
                  />
                  <button type="button" class="btn btn-danger fw-bold px-3" @click="syncYouTubeDetails">
                    <i class="bi bi-arrow-repeat me-1"></i> Sync Preview
                  </button>
                </div>
                <small class="text-muted d-block">
                  <i class="bi bi-info-circle me-1"></i>
                  Masukkan URL video YouTube apapun (Public atau Unlisted). Sistem akan otomatis mengekstrak ID video & thumbnail secara real-time.
                </small>

                <!-- REAL-TIME YOUTUBE PREVIEW BOX -->
                <div v-if="youtubePreviewId" class="mt-3 p-3 bg-white rounded-3 border shadow-sm">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="fw-bold text-dark small"><i class="bi bi-eye-fill text-danger me-1"></i> Live Interactive Preview</span>
                    <span class="badge bg-success text-white small">ID Verified: {{ youtubePreviewId }}</span>
                  </div>
                  <div class="ratio ratio-16x9 rounded overflow-hidden shadow-sm bg-black">
                    <iframe
                      :src="getYouTubeEmbedUrl(youtubePreviewId)"
                      title="YouTube Preview"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </div>
                </div>
              </div>

              <!-- TYPE 2: LOCAL FILE UPLOAD FIELD -->
              <div v-if="form.type === 'local'" class="mb-4 p-3 bg-success-subtle rounded-3 border border-success border-opacity-25">
                <label class="form-label fw-bold text-success"><i class="bi bi-file-earmark-arrow-up me-1"></i> Pilih Berkas Video (Lokal)</label>
                <input
                  type="file"
                  class="form-control py-2 mb-2 bg-white"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  @change="handleFileUpload"
                />
                <small class="text-muted d-block mb-2">
                  Format didukung: .mp4, .webm, .ogg, .mov. Ukuran disarankan &lt; 200MB.
                </small>

                <!-- REAL-TIME LOCAL VIDEO PREVIEW BOX -->
                <div v-if="localVideoPreviewUrl" class="mt-3 p-3 bg-white rounded-3 border shadow-sm">
                  <span class="fw-bold text-dark small d-block mb-2"><i class="bi bi-play-circle-fill text-success me-1"></i> Preview Video File</span>
                  <div class="ratio ratio-16x9 rounded overflow-hidden shadow-sm bg-black">
                    <video controls class="w-100 h-100 object-fit-contain" :src="localVideoPreviewUrl"></video>
                  </div>
                </div>
              </div>

              <!-- GENERAL FORM FIELDS -->
              <div class="row g-3 mb-3">
                <!-- Title -->
                <div class="col-12">
                  <label class="form-label fw-bold text-dark small">Judul Video <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    class="form-control py-2"
                    placeholder="Masukkan judul materi/video..."
                    v-model="form.title"
                    required
                  />
                </div>

                <!-- Category -->
                <div class="col-md-6">
                  <label class="form-label fw-bold text-dark small">Kategori / Playlist</label>
                  <div class="input-group">
                    <select class="form-select" v-model="form.category">
                      <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                    <button type="button" class="btn btn-outline-secondary" @click="promptAddCustomCategory" title="Tambah Kategori Baru">
                      <i class="bi bi-plus-lg"></i>
                    </button>
                  </div>
                </div>

                <!-- Visibility Tag -->
                <div class="col-md-6">
                  <label class="form-label fw-bold text-dark small">Visibilitas / Aksesibilitas</label>
                  <select class="form-select" v-model="form.visibility">
                    <option value="Public">Public (Terbuka untuk Umum)</option>
                    <option value="Unlisted">Unlisted (Hanya Pemilik Link)</option>
                    <option value="Private">Private / Internal</option>
                  </select>
                </div>

                <!-- Description -->
                <div class="col-12">
                  <label class="form-label fw-bold text-dark small">Deskripsi / Catatan Video</label>
                  <textarea
                    class="form-control"
                    rows="3"
                    placeholder="Tuliskan poin-poin penting, ringkasan, atau instruksi tontonan..."
                    v-model="form.description"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="modal-footer bg-light px-4 py-3">
              <button type="button" class="btn btn-outline-secondary rounded-pill px-4 fw-bold" @click="closeAddModal">
                Batal
              </button>
              <button type="submit" class="btn btn-danger rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2">
                <i class="bi bi-check-circle-fill"></i>
                <span>{{ isEditing ? 'Simpan Perubahan' : 'Simpan & Publikasikan Video' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';

const STORAGE_KEY = 'rk_video_hub_videos';

const SAMPLE_VIDEOS = [
  {
    id: 'v1',
    title: 'Vue 3 Full Course 2026 - Master Options & Composition API',
    type: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=FXpIoQ_rT_c',
    youtubeId: 'FXpIoQ_rT_c',
    thumbnail: 'https://img.youtube.com/vi/FXpIoQ_rT_c/hqdefault.jpg',
    category: 'Edukasi & Tutorial',
    visibility: 'Public',
    duration: '15:20',
    description: 'Panduan lengkap mempelajari Vue 3 dari dasar hingga tingkat lanjut termasuk Vuex, Vue Router, dan Vite.',
    isFavorite: true,
    createdDate: '2026-08-01',
    notes: ['02:15 - Penjelasan Reactive state ref vs reactive', '08:40 - Integrasi Vuex Store']
  },
  {
    id: 'v2',
    title: 'Demo Presentasi Proyek E-Commerce Dashboard Client PT Teknologi Nusantara',
    type: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    category: 'Presentasi Proyek',
    visibility: 'Unlisted',
    duration: '03:32',
    description: 'Rekaman video walkthrough fitur dashboard e-commerce unlisted untuk klien korporat.',
    isFavorite: false,
    createdDate: '2026-08-05',
    notes: ['Fitur invoice otomatis sudah diperagakan']
  },
  {
    id: 'v3',
    title: 'Productivity Workflows & Time Management Tips for Developers',
    type: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=l40_hBf23_Q',
    youtubeId: 'l40_hBf23_Q',
    thumbnail: 'https://img.youtube.com/vi/l40_hBf23_Q/hqdefault.jpg',
    category: 'Produktivitas',
    visibility: 'Public',
    duration: '10:05',
    description: 'Strategi mengelola waktu, metode Pomodoro, dan mengoptimalkan task management harian.',
    isFavorite: true,
    createdDate: '2026-08-08',
    notes: []
  }
];

export default {
  name: 'VideoHubView',
  setup() {
    const videos = ref([]);
    const searchQuery = ref('');
    const selectedSourceFilter = ref('all'); // 'all' | 'youtube' | 'local' | 'favorite'
    const selectedCategoryFilter = ref('');

    const categories = ref([
      'Edukasi & Tutorial',
      'Presentasi Proyek',
      'Dokumentasi Internal',
      'Produktivitas',
      'Meeting Record',
      'Hiburan'
    ]);

    // Modal state
    const showAddModal = ref(false);
    const isEditing = ref(false);
    const editingVideoId = ref(null);

    // Player state
    const activePlayerVideo = ref(null);
    const newNoteText = ref('');

    // Form state
    const form = ref({
      type: 'youtube', // 'youtube' | 'local'
      title: '',
      youtubeUrl: '',
      category: 'Edukasi & Tutorial',
      visibility: 'Public',
      description: ''
    });

    const localVideoFile = ref(null);
    const localVideoPreviewUrl = ref('');
    const youtubePreviewId = ref('');

    // Helper: Extract YouTube Video ID from any link
    const extractYouTubeId = (url) => {
      if (!url) return null;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    // Load videos from localStorage
    const loadVideosFromStorage = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          videos.value = JSON.parse(saved);
        } else {
          videos.value = [...SAMPLE_VIDEOS];
          saveVideosToStorage();
        }
      } catch (err) {
        videos.value = [...SAMPLE_VIDEOS];
      }
    };

    const saveVideosToStorage = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(videos.value));
      } catch (err) {
        console.error('Failed to save videos to localStorage', err);
      }
    };

    const loadSampleVideos = () => {
      videos.value = [...SAMPLE_VIDEOS];
      saveVideosToStorage();
      Swal.fire({
        icon: 'success',
        title: 'Video Contoh Dimuat!',
        text: 'Daftar video sampel YouTube public & unlisted telah tersedia.',
        timer: 1800,
        showConfirmButton: false
      });
    };

    // Stats Computed
    const youtubeCount = computed(() => videos.value.filter(v => v.type === 'youtube').length);
    const localCount = computed(() => videos.value.filter(v => v.type === 'local').length);
    const favoriteCount = computed(() => videos.value.filter(v => v.isFavorite).length);

    // Filtered Videos
    const filteredVideos = computed(() => {
      return videos.value.filter(v => {
        // Search
        const query = searchQuery.value.toLowerCase().trim();
        const matchesQuery = !query ||
          v.title.toLowerCase().includes(query) ||
          (v.description && v.description.toLowerCase().includes(query)) ||
          (v.category && v.category.toLowerCase().includes(query));

        // Source filter
        let matchesSource = true;
        if (selectedSourceFilter.value === 'youtube') matchesSource = v.type === 'youtube';
        if (selectedSourceFilter.value === 'local') matchesSource = v.type === 'local';
        if (selectedSourceFilter.value === 'favorite') matchesSource = v.isFavorite;

        // Category filter
        const matchesCategory = !selectedCategoryFilter.value || v.category === selectedCategoryFilter.value;

        return matchesQuery && matchesSource && matchesCategory;
      });
    });

    // YouTube Embed URL Generator
    const getYouTubeEmbedUrl = (videoId) => {
      if (!videoId) return '';
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    };

    // Real-time YouTube Link Input Handler
    const onYouTubeUrlInput = () => {
      const id = extractYouTubeId(form.value.youtubeUrl);
      youtubePreviewId.value = id || '';
    };

    const syncYouTubeDetails = () => {
      const id = extractYouTubeId(form.value.youtubeUrl);
      if (id) {
        youtubePreviewId.value = id;
        if (!form.value.title) {
          form.value.title = `YouTube Video (${id})`;
        }
        Swal.fire({
          icon: 'success',
          title: 'YouTube Sync Berhasil!',
          text: `Video ID extracted: ${id}. Real-time preview siap ditonton.`,
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Link Tidak Valid',
          text: 'Mohon masukkan URL video YouTube yang valid (e.g., https://www.youtube.com/watch?v=... atau https://youtu.be/...)',
          confirmButtonColor: '#dc3545'
        });
      }
    };

    // File Upload Handler
    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        localVideoFile.value = file;
        localVideoPreviewUrl.value = URL.createObjectURL(file);
        if (!form.value.title) {
          // Default title from filename
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
          form.value.title = nameWithoutExt;
        }
      }
    };

    const setFormType = (type) => {
      form.value.type = type;
    };

    const openAddModal = () => {
      isEditing.value = false;
      editingVideoId.value = null;
      form.value = {
        type: 'youtube',
        title: '',
        youtubeUrl: '',
        category: 'Edukasi & Tutorial',
        visibility: 'Public',
        description: ''
      };
      localVideoFile.value = null;
      localVideoPreviewUrl.value = '';
      youtubePreviewId.value = '';
      showAddModal.value = true;
    };

    const editVideo = (video) => {
      isEditing.value = true;
      editingVideoId.value = video.id;
      form.value = {
        type: video.type || 'youtube',
        title: video.title || '',
        youtubeUrl: video.youtubeUrl || '',
        category: video.category || 'Edukasi & Tutorial',
        visibility: video.visibility || 'Public',
        description: video.description || ''
      };
      youtubePreviewId.value = video.youtubeId || extractYouTubeId(video.youtubeUrl) || '';
      localVideoPreviewUrl.value = video.localUrl || '';
      showAddModal.value = true;
    };

    const closeAddModal = () => {
      showAddModal.value = false;
    };

    const saveVideo = () => {
      if (form.value.type === 'youtube') {
        const id = extractYouTubeId(form.value.youtubeUrl);
        if (!id) {
          Swal.fire({
            icon: 'error',
            title: 'Link YouTube Perlu Diperbaiki',
            text: 'Pastikan memasukkan URL video YouTube public atau unlisted yang sah.',
            confirmButtonColor: '#dc3545'
          });
          return;
        }

        const videoObj = {
          id: isEditing.value ? editingVideoId.value : 'v_' + Date.now(),
          title: form.value.title.trim(),
          type: 'youtube',
          youtubeUrl: form.value.youtubeUrl.trim(),
          youtubeId: id,
          thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
          category: form.value.category,
          visibility: form.value.visibility,
          duration: 'YouTube',
          description: form.value.description.trim(),
          isFavorite: false,
          createdDate: new Date().toISOString().split('T')[0],
          notes: []
        };

        if (isEditing.value) {
          const idx = videos.value.findIndex(v => v.id === editingVideoId.value);
          if (idx !== -1) {
            videos.value[idx] = { ...videos.value[idx], ...videoObj };
          }
        } else {
          videos.value.unshift(videoObj);
        }
      } else {
        // LOCAL FILE VIDEO
        if (!localVideoPreviewUrl.value && !isEditing.value) {
          Swal.fire({
            icon: 'error',
            title: 'File Video Belum Dipilih',
            text: 'Silakan pilih file berkas video dari komputer/perangkat Anda.',
            confirmButtonColor: '#dc3545'
          });
          return;
        }

        const videoObj = {
          id: isEditing.value ? editingVideoId.value : 'v_' + Date.now(),
          title: form.value.title.trim(),
          type: 'local',
          localUrl: localVideoPreviewUrl.value,
          thumbnail: '', // Uses video element preview
          category: form.value.category,
          visibility: form.value.visibility,
          duration: 'Video Lokal',
          description: form.value.description.trim(),
          isFavorite: false,
          createdDate: new Date().toISOString().split('T')[0],
          notes: []
        };

        if (isEditing.value) {
          const idx = videos.value.findIndex(v => v.id === editingVideoId.value);
          if (idx !== -1) {
            videos.value[idx] = { ...videos.value[idx], ...videoObj };
          }
        } else {
          videos.value.unshift(videoObj);
        }
      }

      saveVideosToStorage();
      closeAddModal();

      Swal.fire({
        icon: 'success',
        title: isEditing.value ? 'Video Diperbarui!' : 'Video Berhasil Ditambahkan!',
        text: 'Video tersimpan di studio dan siap diputar kapan saja.',
        timer: 1800,
        showConfirmButton: false
      });
    };

    const confirmDeleteVideo = (video) => {
      Swal.fire({
        title: 'Hapus Video Ini?',
        html: `Apakah Anda yakin ingin menghapus <strong>"${video.title}"</strong> dari koleksi?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus Video',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          videos.value = videos.value.filter(v => v.id !== video.id);
          saveVideosToStorage();
          Swal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: 'Video berhasil dihapus.',
            timer: 1500,
            showConfirmButton: false
          });
        }
      });
    };

    const toggleFavorite = (video) => {
      video.isFavorite = !video.isFavorite;
      saveVideosToStorage();
    };

    const playVideo = (video) => {
      activePlayerVideo.value = video;
      newNoteText.value = '';
    };

    const closePlayer = () => {
      activePlayerVideo.value = null;
    };

    const addNoteToActiveVideo = () => {
      if (!newNoteText.value.trim() || !activePlayerVideo.value) return;
      if (!activePlayerVideo.value.notes) {
        activePlayerVideo.value.notes = [];
      }
      activePlayerVideo.value.notes.push(newNoteText.value.trim());
      newNoteText.value = '';
      saveVideosToStorage();
    };

    const removeNoteFromActiveVideo = (index) => {
      if (activePlayerVideo.value && activePlayerVideo.value.notes) {
        activePlayerVideo.value.notes.splice(index, 1);
        saveVideosToStorage();
      }
    };

    const copyVideoLink = (link) => {
      if (navigator.clipboard && link) {
        navigator.clipboard.writeText(link);
        Swal.fire({
          icon: 'success',
          title: 'Link Disalin!',
          text: 'Link YouTube disalin ke clipboard.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    };

    const promptAddCustomCategory = () => {
      Swal.fire({
        title: 'Kategori / Playlist Baru',
        input: 'text',
        inputLabel: 'Masukkan nama kategori baru:',
        inputPlaceholder: 'misal: Dokumentasi Klien, Webinar, Short Video...',
        showCancelButton: true,
        confirmButtonText: 'Tambah',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#0d6efd',
        inputValidator: (val) => {
          if (!val || !val.trim()) return 'Nama kategori tidak boleh kosong!';
        }
      }).then((res) => {
        if (res.isConfirmed && res.value) {
          const clean = res.value.trim();
          if (!categories.value.includes(clean)) {
            categories.value.push(clean);
          }
          form.value.category = clean;
        }
      });
    };

    const onThumbnailError = (e, video) => {
      // Fallback thumbnail if HQ fails
      if (video.type === 'youtube' && video.youtubeId) {
        e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/0.jpg`;
      }
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
      } catch (err) {
        return dateStr;
      }
    };

    onMounted(() => {
      loadVideosFromStorage();
    });

    return {
      videos,
      searchQuery,
      selectedSourceFilter,
      selectedCategoryFilter,
      categories,
      youtubeCount,
      localCount,
      favoriteCount,
      filteredVideos,
      showAddModal,
      isEditing,
      activePlayerVideo,
      newNoteText,
      form,
      localVideoPreviewUrl,
      youtubePreviewId,
      openAddModal,
      editVideo,
      closeAddModal,
      setFormType,
      onYouTubeUrlInput,
      syncYouTubeDetails,
      handleFileUpload,
      saveVideo,
      confirmDeleteVideo,
      toggleFavorite,
      playVideo,
      closePlayer,
      addNoteToActiveVideo,
      removeNoteFromActiveVideo,
      copyVideoLink,
      promptAddCustomCategory,
      getYouTubeEmbedUrl,
      loadSampleVideos,
      onThumbnailError,
      formatDate
    };
  }
};
</script>

<style scoped>
.header-banner {
  background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #dc2626 100%);
}

.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
}

.hover-video-card {
  transition: all 0.25s ease;
}
.hover-video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12) !important;
}

.play-overlay {
  opacity: 0;
  transition: opacity 0.2s ease;
}
.group-hover-zoom:hover .play-overlay {
  opacity: 1;
}

.play-btn-circle {
  width: 54px;
  height: 54px;
  transition: transform 0.2s ease;
}
.play-overlay:hover .play-btn-circle {
  transform: scale(1.15);
}

.backdrop-blur {
  backdrop-filter: blur(8px);
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.title-link {
  cursor: pointer;
  transition: color 0.15s ease;
}
.title-link:hover {
  color: #dc2626 !important;
}
</style>
