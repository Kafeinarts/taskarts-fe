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
              YouTube Sync & Local Files
            </span>
          </div>
          <h2 class="fw-bold display-6 mb-1">Tonton & Upload Video 🎬</h2>
          <p class="mb-0 text-white-50">
            Upload file video lokal atau sinkronkan link YouTube (Public / Unlisted) dengan player bioskop layar penuh & catatan timestamps.
          </p>
        </div>

        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-outline-light fw-semibold rounded-3 px-3 py-2" @click="exportVideosJson" title="Backup Video Hub ke JSON">
            <i class="bi bi-filetype-json text-warning me-1"></i> Export JSON
          </button>
          <button class="btn btn-outline-light fw-semibold rounded-3 px-3 py-2" @click="triggerImportVideosJson" title="Import Video dari JSON">
            <i class="bi bi-upload text-info me-1"></i> Import JSON
          </button>
          <input type="file" ref="videoJsonInput" accept=".json" class="d-none" @change="onVideosJsonSelected" />

          <router-link to="/videos/new" class="btn btn-light text-danger fw-bold rounded-3 px-3.5 py-2 shadow-sm d-flex align-items-center gap-2 text-decoration-none">
            <i class="bi bi-plus-circle-fill fs-5"></i>
            <span>Tambah / Sync Video</span>
          </router-link>
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
    <div class="card border-0 shadow-sm rounded-4 bg-white p-3 p-md-4 mb-4">
      <div class="row g-3 align-items-center">
        <!-- Search Input -->
        <div class="col-12 col-md-4">
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
              <i class="bi bi-search"></i>
            </span>
            <input
              type="text"
              class="form-control bg-light border-start-0 rounded-end-3"
              placeholder="Cari video berdasarkan judul atau deskripsi..."
              v-model="searchQuery"
            />
          </div>
        </div>

        <!-- Source Tabs -->
        <div class="col-12 col-md-5">
          <div class="btn-group w-100" role="group">
            <button
              type="button"
              class="btn btn-sm py-2"
              :class="selectedSourceFilter === 'all' ? 'btn-danger fw-bold' : 'btn-outline-secondary'"
              @click="selectedSourceFilter = 'all'"
            >
              Semua ({{ videos.length }})
            </button>
            <button
              type="button"
              class="btn btn-sm py-2"
              :class="selectedSourceFilter === 'youtube' ? 'btn-danger fw-bold' : 'btn-outline-secondary'"
              @click="selectedSourceFilter = 'youtube'"
            >
              <i class="bi bi-youtube me-1"></i> YouTube ({{ youtubeCount }})
            </button>
            <button
              type="button"
              class="btn btn-sm py-2"
              :class="selectedSourceFilter === 'local' ? 'btn-danger fw-bold' : 'btn-outline-secondary'"
              @click="selectedSourceFilter = 'local'"
            >
              <i class="bi bi-folder me-1"></i> Lokal ({{ localCount }})
            </button>
            <button
              type="button"
              class="btn btn-sm py-2"
              :class="selectedSourceFilter === 'favorite' ? 'btn-danger fw-bold' : 'btn-outline-secondary'"
              @click="selectedSourceFilter = 'favorite'"
            >
              <i class="bi bi-star-fill text-warning me-1"></i> Favorit ({{ favoriteCount }})
            </button>
          </div>
        </div>

        <!-- Category Dropdown -->
        <div class="col-12 col-md-3">
          <select class="form-select rounded-3" v-model="selectedCategoryFilter">
            <option value="">Semua Kategori</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Video Grid / Empty State -->
    <div v-if="filteredVideos.length === 0" class="card border-0 shadow-sm rounded-4 bg-white p-5 text-center my-4">
      <div class="py-4">
        <i class="bi bi-camera-reels text-muted display-3 mb-3 d-block"></i>
        <h4 class="fw-bold text-dark mb-1">Belum Ada Video yang Sesuai</h4>
        <p class="text-muted small mb-4">Mulai dengan menambahkan tautan video YouTube atau mengunggah video lokal ke galeri.</p>
        <router-link to="/videos/new" class="btn btn-danger rounded-pill px-4 py-2 fw-bold shadow-sm text-decoration-none">
          <i class="bi bi-plus-circle me-1"></i> Tambah / Sync Video Pertama
        </router-link>
      </div>
    </div>

    <div v-else class="row g-4">
      <div v-for="video in filteredVideos" :key="video.id" class="col-12 col-sm-6 col-lg-4 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden h-100 video-card transition-all">
          <!-- Thumbnail Stage -->
          <div class="ratio ratio-16x9 bg-dark position-relative overflow-hidden cursor-pointer" @click="openVideo(video)">
            <img
              v-if="video.thumbnail"
              :src="video.thumbnail"
              :alt="video.title"
              class="object-fit-cover w-100 h-100 transition-transform"
              loading="lazy"
            />
            <div v-else class="d-flex flex-column align-items-center justify-content-center h-100 text-white bg-dark">
              <i class="bi bi-play-circle display-4 text-white-50"></i>
            </div>

            <!-- Play Overlay Button -->
            <div class="play-overlay d-flex align-items-center justify-content-center">
              <div class="play-button-circle">
                <i class="bi bi-play-fill fs-2 text-danger"></i>
              </div>
            </div>

            <!-- Source Badge -->
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

            <!-- Favorite Toggle -->
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
                  <i class="bi bi-calendar3 me-1"></i>{{ video.createdDate }}
                </small>
              </div>

              <h6 class="fw-bold text-dark text-truncate-2 mb-2 line-clamp-2 title-link cursor-pointer" @click="openVideo(video)" :title="video.title">
                {{ video.title }}
              </h6>

              <p class="text-muted small text-truncate-2 mb-3 line-clamp-2" style="font-size: 13px;">
                {{ video.description || 'Tidak ada deskripsi' }}
              </p>
            </div>

            <div class="pt-2 border-top d-flex align-items-center justify-content-between">
              <router-link :to="`/videos/${video.id}`" class="btn btn-sm btn-danger px-3 rounded-pill fw-bold d-flex align-items-center gap-1 text-decoration-none">
                <i class="bi bi-play-circle-fill"></i> Tonton
              </router-link>

              <div class="d-flex align-items-center gap-1">
                <router-link :to="`/videos/${video.id}`" class="btn btn-sm btn-light border text-primary rounded-circle" title="Detail & Edit Video">
                  <i class="bi bi-pencil-fill"></i>
                </router-link>
                <button class="btn btn-sm btn-light border text-danger rounded-circle" @click="confirmDeleteVideo(video)" title="Hapus Video">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

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
    const router = useRouter();
    const videos = ref([]);
    const searchQuery = ref('');
    const selectedSourceFilter = ref('all');
    const selectedCategoryFilter = ref('');
    const videoJsonInput = ref(null);

    const categories = ref([
      'Edukasi & Tutorial',
      'Presentasi Proyek',
      'Dokumentasi Internal',
      'Produktivitas',
      'Meeting Record',
      'Hiburan'
    ]);

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

    const youtubeCount = computed(() => videos.value.filter(v => v.type === 'youtube').length);
    const localCount = computed(() => videos.value.filter(v => v.type === 'local').length);
    const favoriteCount = computed(() => videos.value.filter(v => v.isFavorite).length);

    const filteredVideos = computed(() => {
      return videos.value.filter(v => {
        const matchesQuery = !searchQuery.value ||
          v.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (v.description && v.description.toLowerCase().includes(searchQuery.value.toLowerCase()));

        let matchesSource = true;
        if (selectedSourceFilter.value === 'youtube') matchesSource = v.type === 'youtube';
        else if (selectedSourceFilter.value === 'local') matchesSource = v.type === 'local';
        else if (selectedSourceFilter.value === 'favorite') matchesSource = !!v.isFavorite;

        const matchesCat = !selectedCategoryFilter.value || v.category === selectedCategoryFilter.value;

        return matchesQuery && matchesSource && matchesCat;
      });
    });

    const openVideo = (v) => {
      router.push(`/videos/${v.id}`);
    };

    const toggleFavorite = (v) => {
      v.isFavorite = !v.isFavorite;
      saveVideosToStorage();
    };

    const confirmDeleteVideo = (v) => {
      if (window.confirm(`Apakah Anda yakin ingin menghapus video "${v.title}"?`)) {
        videos.value = videos.value.filter(item => item.id !== v.id);
        saveVideosToStorage();
        window.alert('Video berhasil dihapus dari galeri.');
      }
    };

    const loadSampleVideos = () => {
      if (window.confirm('Muat ulang video contoh standar?')) {
        videos.value = [...SAMPLE_VIDEOS];
        saveVideosToStorage();
        window.alert('Video contoh berhasil dimuat!');
      }
    };

    const exportVideosJson = () => {
      try {
        const payload = {
          app: 'RajinKerja',
          type: 'videohub_backup',
          exportDate: new Date().toISOString(),
          videos: videos.value
        };
        const jsonStr = JSON.stringify(payload, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `VideoHub_RajinKerja_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        window.alert('Data Video Hub berhasil diekspor!');
      } catch (err) {
        window.alert('Gagal mengekspor data: ' + err.message);
      }
    };

    const triggerImportVideosJson = () => {
      if (videoJsonInput.value) videoJsonInput.value.click();
    };

    const onVideosJsonSelected = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          const incoming = Array.isArray(parsed) ? parsed : (parsed.videos || []);
          if (!Array.isArray(incoming) || incoming.length === 0) {
            window.alert('Berkas JSON tidak memuat daftar video yang valid.');
            return;
          }

          if (window.confirm(`Ditemukan ${incoming.length} video. Gabungkan ke koleksi yang sudah ada?`)) {
            const existingIds = new Set(videos.value.map(v => v.id));
            const newEntries = incoming.filter(v => !existingIds.has(v.id));
            videos.value = [...newEntries, ...videos.value];
            saveVideosToStorage();
            window.alert(`Berhasil mengimpor ${newEntries.length} video baru!`);
          }
        } catch (err) {
          window.alert('Gagal membaca berkas JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
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
      videoJsonInput,
      youtubeCount,
      localCount,
      favoriteCount,
      filteredVideos,
      openVideo,
      toggleFavorite,
      confirmDeleteVideo,
      loadSampleVideos,
      exportVideosJson,
      triggerImportVideosJson,
      onVideosJsonSelected
    };
  }
};
</script>

<style scoped>
.header-banner {
  background: linear-gradient(135deg, #e11d48 0%, #be123c 50%, #881337 100%);
}
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
}
.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08) !important;
}
.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  opacity: 0;
  transition: opacity 0.2s ease;
}
.video-card:hover .play-overlay {
  opacity: 1;
}
.play-button-circle {
  width: 54px;
  height: 54px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 3px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.title-link:hover {
  color: #e11d48 !important;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
