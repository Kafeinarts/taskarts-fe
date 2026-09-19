<template>
  <div class="container-fluid py-4" data-aos="fade-up">
    <!-- Top Nav / Back Bar -->
    <div class="card border-0 rounded-4 shadow-sm bg-white p-3 p-md-4 mb-4">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-outline-secondary rounded-3 px-3 py-2 fw-bold d-flex align-items-center gap-2" @click="goBack">
            <i class="bi bi-arrow-left fs-5"></i>
            <span>Kembali ke Galeri Video</span>
          </button>
          <div class="border-start ps-3">
            <span class="badge bg-danger text-white fw-bold px-3 py-1 rounded-pill mb-1">
              <i class="bi bi-play-btn-fill me-1"></i> {{ isNewVideo ? 'Tambah Video Baru' : (isEditing ? 'Edit Informasi Video' : 'Cinema Video Player') }}
            </span>
            <h3 class="fw-extrabold text-dark mb-0 text-truncate" style="max-width: 600px;">
              {{ isNewVideo ? 'Tambah / Sinkronisasi Video' : (video ? video.title : 'Video Player') }}
            </h3>
          </div>
        </div>

        <!-- Right action buttons for Player / Form -->
        <div class="d-flex flex-wrap align-items-center gap-2" v-if="!isNewVideo && video">
          <button class="btn btn-sm btn-outline-warning text-dark fw-bold rounded-pill px-3 py-2" @click="toggleFavorite">
            <i :class="video.isFavorite ? 'bi bi-star-fill text-warning' : 'bi bi-star'"></i>
            <span class="ms-1">{{ video.isFavorite ? 'Favorit' : 'Jadikan Favorit' }}</span>
          </button>
          <button class="btn btn-sm btn-outline-primary rounded-pill px-3 py-2 fw-semibold" @click="isEditing = !isEditing">
            <i :class="isEditing ? 'bi bi-eye-fill me-1' : 'bi bi-pencil-fill me-1'"></i>
            <span>{{ isEditing ? 'Beralih ke Player' : 'Edit Video' }}</span>
          </button>
          <button class="btn btn-sm btn-outline-danger rounded-pill px-3 py-2 fw-semibold" @click="deleteVideo">
            <i class="bi bi-trash-fill me-1"></i> Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- VIEW A: FULL CINEMA PLAYER & NOTES THEATRE VIEW                           -->
    <!-- ========================================================================= -->
    <div v-if="!isNewVideo && !isEditing && video">
      <div class="row g-4">
        <!-- Main Video Screen Column -->
        <div class="col-lg-8">
          <div class="card border-0 rounded-4 shadow-lg bg-black text-white overflow-hidden p-0">
            <!-- Video Player Stage -->
            <div class="ratio ratio-16x9 bg-black position-relative">
              <!-- YouTube Embed -->
              <iframe
                v-if="video.type === 'youtube' && video.youtubeId"
                :src="`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`"
                title="YouTube Video Player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                class="w-100 h-100"
              ></iframe>

              <!-- Native HTML5 Video for Local Uploads -->
              <video
                v-else-if="video.type === 'local' && video.videoUrl"
                :src="video.videoUrl"
                controls
                autoplay
                class="w-100 h-100 object-fit-contain"
              ></video>

              <!-- Fallback placeholder -->
              <div v-else class="d-flex flex-column align-items-center justify-content-center text-muted p-4">
                <i class="bi bi-exclamation-triangle fs-1 text-warning mb-2"></i>
                <p class="mb-0">Sumber media video tidak dapat dimuat.</p>
              </div>
            </div>

            <!-- Video Info Bar below player -->
            <div class="p-4 bg-dark bg-opacity-75">
              <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span class="badge bg-danger rounded-pill px-3 py-1 fw-bold">
                  <i :class="video.type === 'youtube' ? 'bi bi-youtube me-1' : 'bi bi-folder-symlink me-1'"></i>
                  {{ video.type === 'youtube' ? 'YouTube Sync' : 'File Lokal' }}
                </span>
                <span class="badge bg-secondary rounded-pill px-2.5 py-1">
                  🏷️ {{ video.category || 'Umum' }}
                </span>
                <span v-if="video.duration" class="badge bg-light text-dark rounded-pill px-2.5 py-1">
                  ⏱️ {{ video.duration }}
                </span>
                <span class="text-white-50 small ms-auto">
                  <i class="bi bi-calendar3 me-1"></i> {{ video.createdDate || 'Hari ini' }}
                </span>
              </div>

              <h3 class="fw-bold text-white mb-2">{{ video.title }}</h3>
              <p class="text-white-50 mb-0" style="line-height: 1.6;">
                {{ video.description || 'Tidak ada deskripsi tambahan untuk video ini.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right Side: Timestamps & Notes Workspace -->
        <div class="col-lg-4">
          <div class="card border-0 rounded-4 shadow-sm bg-white p-4 h-100 d-flex flex-column">
            <h5 class="fw-bold text-dark mb-3 d-flex align-items-center justify-content-between">
              <span class="d-flex align-items-center gap-2">
                <i class="bi bi-journal-text text-primary fs-4"></i>
                <span>Catatan & Timestamps</span>
              </span>
              <span class="badge bg-primary text-white rounded-pill">{{ (video.notes || []).length }}</span>
            </h5>

            <!-- Add Note Input -->
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control rounded-start-3"
                placeholder="Contoh: 03:45 - Poin penting strategi..."
                v-model="newNoteInput"
                @keyup.enter="addNote"
              />
              <button class="btn btn-primary px-3 rounded-end-3 fw-bold" @click="addNote">
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>

            <!-- Notes List -->
            <div class="flex-grow-1 overflow-auto custom-scrollbar mb-3" style="max-height: 380px;">
              <div v-if="video.notes && video.notes.length > 0" class="d-flex flex-column gap-2">
                <div 
                  v-for="(note, idx) in video.notes" 
                  :key="idx"
                  class="p-3 rounded-3 bg-light border d-flex justify-content-between align-items-start gap-2"
                >
                  <div class="d-flex align-items-start gap-2">
                    <i class="bi bi-bookmark-fill text-warning mt-1"></i>
                    <span class="small text-dark fw-medium" style="line-height: 1.4;">{{ note }}</span>
                  </div>
                  <button class="btn btn-xs text-danger p-0 border-0" @click="deleteNote(idx)" title="Hapus Catatan">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>

              <div v-else class="text-center py-4 text-muted small bg-light rounded-3 border">
                <i class="bi bi-pencil fs-3 d-block text-muted mb-1"></i>
                <span>Belum ada catatan atau penanda waktu untuk video ini. Ketik di atas lalu tekan Enter.</span>
              </div>
            </div>

            <!-- Quick Action Links -->
            <div class="pt-3 border-top d-flex gap-2">
              <a 
                v-if="video.type === 'youtube' && video.youtubeUrl" 
                :href="video.youtubeUrl" 
                target="_blank" 
                rel="noopener"
                class="btn btn-outline-danger w-100 rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-1"
              >
                <i class="bi bi-box-arrow-up-right"></i>
                <span>Buka di YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- VIEW B: FULL-PAGE ADD / EDIT VIDEO FORM                                   -->
    <!-- ========================================================================= -->
    <div v-else-if="isNewVideo || isEditing" class="card border-0 rounded-4 shadow-sm bg-white p-4 p-md-5">
      <form @submit.prevent="submitForm">
        <h4 class="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
          <i class="bi bi-camera-video-fill text-danger fs-3"></i>
          <span>{{ isNewVideo ? 'Tambah / Sinkronkan Video Baru' : 'Edit Informasi & Tautan Video' }}</span>
        </h4>

        <!-- Method Selection -->
        <div class="mb-4">
          <label class="form-label fw-bold text-dark small text-uppercase">Pilih Sumber Media Video:</label>
          <div class="row g-3">
            <div class="col-sm-6">
              <div 
                class="p-3.5 rounded-3 border cursor-pointer text-center d-flex flex-column align-items-center gap-1 transition-all"
                :class="form.type === 'youtube' ? 'bg-danger text-white border-danger shadow-sm' : 'bg-light text-dark'"
                @click="form.type = 'youtube'"
              >
                <i class="bi bi-youtube fs-2"></i>
                <span class="fw-bold">Sinkronisasi Link YouTube</span>
                <small class="opacity-75" style="font-size: 11px;">Mendukung video Public & Unlisted</small>
              </div>
            </div>

            <div class="col-sm-6">
              <div 
                class="p-3.5 rounded-3 border cursor-pointer text-center d-flex flex-column align-items-center gap-1 transition-all"
                :class="form.type === 'local' ? 'bg-success text-white border-success shadow-sm' : 'bg-light text-dark'"
                @click="form.type = 'local'"
              >
                <i class="bi bi-upload fs-2"></i>
                <span class="fw-bold">Upload File Lokal</span>
                <small class="opacity-75" style="font-size: 11px;">MP4, WebM, OGG, MOV</small>
              </div>
            </div>
          </div>
        </div>

        <!-- YouTube Link Input -->
        <div v-if="form.type === 'youtube'" class="p-3.5 bg-danger-subtle rounded-3 border border-danger border-opacity-25 mb-4">
          <label class="form-label fw-bold text-danger d-flex justify-content-between align-items-center">
            <span><i class="bi bi-link-45deg me-1"></i> Tautan / URL YouTube:</span>
            <span class="badge bg-danger text-white">Public / Unlisted</span>
          </label>
          <input
            type="url"
            class="form-control form-control-lg rounded-3"
            placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
            v-model="form.youtubeUrl"
            @input="onYouTubeUrlChange"
            required
          />
          <small class="text-muted mt-1 d-block">Thumbnail dan ID video YouTube akan otomatis terdeteksi.</small>
        </div>

        <!-- Local File Input -->
        <div v-else class="p-3.5 bg-success-subtle rounded-3 border border-success border-opacity-25 mb-4">
          <label class="form-label fw-bold text-success mb-1">
            <i class="bi bi-file-earmark-play-fill me-1"></i> Pilih Berkas Video dari Komputer:
          </label>
          <input type="file" class="form-control rounded-3" accept="video/*" @change="onLocalVideoFileSelected" />
          <small class="text-muted mt-1 d-block">Video akan disimpan ke memori penyimpanan lokal browser.</small>
        </div>

        <!-- Video Metadata Inputs -->
        <div class="row g-3 mb-4">
          <div class="col-md-8">
            <label class="form-label fw-bold text-dark small mb-1">Judul Video <span class="text-danger">*</span></label>
            <input type="text" class="form-control rounded-3" placeholder="Contoh: Tutorial Lengkap Vue 3..." v-model="form.title" required />
          </div>

          <div class="col-md-4">
            <label class="form-label fw-bold text-dark small mb-1">Kategori Video</label>
            <select class="form-select rounded-3" v-model="form.category">
              <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div class="col-12">
            <label class="form-label fw-bold text-dark small mb-1">Deskripsi / Ringkasan Video</label>
            <textarea class="form-control rounded-3" rows="3" placeholder="Tuliskan keterangan isi video..." v-model="form.description"></textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-between align-items-center pt-3 border-top">
          <button type="button" class="btn btn-outline-secondary rounded-3 px-4 py-2 fw-semibold" @click="cancelForm">
            Batal
          </button>
          <button type="submit" class="btn btn-danger rounded-3 px-5 py-2.5 fw-bold shadow-sm d-flex align-items-center gap-2">
            <i class="bi bi-check-circle-fill"></i>
            <span>{{ isNewVideo ? 'Simpan Video Baru' : 'Simpan Perubahan' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const STORAGE_KEY = 'rk_video_hub_videos';

export default {
  name: 'VideoDetailView',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const videoId = computed(() => route.params.id);
    const isNewVideo = computed(() => videoId.value === 'new');
    const isEditing = ref(false);

    const video = ref(null);
    const newNoteInput = ref('');

    const categoryOptions = [
      'Edukasi & Tutorial',
      'Presentasi Proyek',
      'Dokumentasi Internal',
      'Produktivitas',
      'Meeting Record',
      'Hiburan'
    ];

    const form = ref({
      type: 'youtube',
      youtubeUrl: '',
      youtubeId: '',
      title: '',
      category: 'Edukasi & Tutorial',
      description: '',
      thumbnail: '',
      duration: '',
      videoUrl: '',
      notes: []
    });

    const loadVideosFromStorage = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    };

    const saveVideosToStorage = (videos) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    };

    const extractYouTubeId = (url) => {
      if (!url) return '';
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : '';
    };

    const onYouTubeUrlChange = () => {
      const yId = extractYouTubeId(form.value.youtubeUrl);
      if (yId) {
        form.value.youtubeId = yId;
        form.value.thumbnail = `https://img.youtube.com/vi/${yId}/hqdefault.jpg`;
      }
    };

    const onLocalVideoFileSelected = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!form.value.title) {
        form.value.title = file.name.replace(/\.[^/.]+$/, '');
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        form.value.videoUrl = ev.target.result;
      };
      reader.readAsDataURL(file);
    };

    const loadCurrentVideo = () => {
      if (isNewVideo.value) {
        form.value = {
          type: 'youtube',
          youtubeUrl: '',
          youtubeId: '',
          title: '',
          category: 'Edukasi & Tutorial',
          description: '',
          thumbnail: '',
          duration: '',
          videoUrl: '',
          notes: []
        };
        return;
      }

      const videos = loadVideosFromStorage();
      const found = videos.find(v => v.id === videoId.value);
      if (found) {
        video.value = JSON.parse(JSON.stringify(found));
        form.value = JSON.parse(JSON.stringify(found));
      } else {
        window.alert('Video tidak ditemukan!');
        router.push('/videos');
      }
    };

    const addNote = () => {
      if (!newNoteInput.value.trim() || !video.value) return;
      if (!video.value.notes) video.value.notes = [];
      video.value.notes.unshift(newNoteInput.value.trim());
      newNoteInput.value = '';
      persistVideoUpdate();
    };

    const deleteNote = (idx) => {
      if (window.confirm('Hapus catatan ini?')) {
        video.value.notes.splice(idx, 1);
        persistVideoUpdate();
      }
    };

    const toggleFavorite = () => {
      if (!video.value) return;
      video.value.isFavorite = !video.value.isFavorite;
      persistVideoUpdate();
    };

    const persistVideoUpdate = () => {
      const videos = loadVideosFromStorage();
      const index = videos.findIndex(v => v.id === video.value.id);
      if (index !== -1) {
        videos[index] = video.value;
        saveVideosToStorage(videos);
      }
    };

    const submitForm = () => {
      if (!form.value.title.trim()) {
        window.alert('Judul video tidak boleh kosong.');
        return;
      }

      const videos = loadVideosFromStorage();

      if (isNewVideo.value) {
        const newId = 'video_' + Date.now();
        const newEntry = {
          ...form.value,
          id: newId,
          createdDate: new Date().toISOString().split('T')[0],
          isFavorite: false,
          notes: []
        };
        videos.unshift(newEntry);
        saveVideosToStorage(videos);
        window.alert('Video baru berhasil ditambahkan!');
        router.push(`/videos/${newId}`);
      } else {
        const index = videos.findIndex(v => v.id === video.value.id);
        if (index !== -1) {
          videos[index] = {
            ...videos[index],
            ...form.value
          };
          saveVideosToStorage(videos);
          video.value = JSON.parse(JSON.stringify(videos[index]));
          isEditing.value = false;
          window.alert('Informasi video berhasil diperbarui!');
        }
      }
    };

    const deleteVideo = () => {
      if (window.confirm('Apakah Anda yakin ingin menghapus video ini dari galeri?')) {
        const videos = loadVideosFromStorage().filter(v => v.id !== video.value.id);
        saveVideosToStorage(videos);
        window.alert('Video telah dihapus.');
        router.push('/videos');
      }
    };

    const cancelForm = () => {
      if (isNewVideo.value) {
        router.push('/videos');
      } else {
        isEditing.value = false;
      }
    };

    const goBack = () => {
      router.push('/videos');
    };

    onMounted(() => {
      loadCurrentVideo();
    });

    return {
      videoId,
      isNewVideo,
      isEditing,
      video,
      newNoteInput,
      categoryOptions,
      form,
      onYouTubeUrlChange,
      onLocalVideoFileSelected,
      addNote,
      deleteNote,
      toggleFavorite,
      submitForm,
      deleteVideo,
      cancelForm,
      goBack
    };
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
</style>
