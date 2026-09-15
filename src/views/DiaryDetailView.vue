<template>
  <div class="container-fluid py-4" data-aos="fade-up">
    <!-- Top Nav / Controls Bar -->
    <div class="card border-0 rounded-4 shadow-sm bg-white p-3 p-md-4 mb-4">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-outline-secondary rounded-3 px-3 py-2 fw-bold d-flex align-items-center gap-2" @click="goBack">
            <i class="bi bi-arrow-left fs-5"></i>
            <span>Kembali ke Jurnal</span>
          </button>
          <div class="border-start ps-3" v-if="diary">
            <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <span class="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill">
                {{ diary.mood || '🤩' }} {{ diary.moodLabel || 'Cerita Harian' }}
              </span>
              <span class="badge bg-light text-secondary border px-2.5 py-1 rounded-pill">
                {{ diary.weather || '☀️' }} {{ diary.weatherLabel || 'Cerah' }}
              </span>
              <span class="badge bg-primary-subtle text-primary px-2.5 py-1 rounded-pill fw-semibold">
                {{ diary.category || 'Refleksi Harian' }}
              </span>
            </div>
            <h3 class="fw-extrabold text-dark mb-0 text-truncate" style="max-width: 600px;">
              {{ diary.title || 'Cerita Diary Tanpa Judul' }}
            </h3>
          </div>
        </div>

        <!-- Action Controls -->
        <div class="d-flex flex-wrap align-items-center gap-2" v-if="diary && isUnlocked">
          <button 
            class="btn btn-sm btn-outline-warning text-dark fw-bold rounded-pill px-3 py-2"
            @click="toggleFavorite"
          >
            <i :class="diary.isFavorite ? 'bi bi-star-fill text-warning' : 'bi bi-star'"></i>
            <span class="ms-1">{{ diary.isFavorite ? 'Favorit' : 'Jadikan Favorit' }}</span>
          </button>

          <button 
            class="btn btn-sm btn-outline-primary rounded-pill px-3 py-2 fw-semibold"
            @click="togglePin"
          >
            <i :class="diary.isPinned ? 'bi bi-pin-angle-fill text-primary' : 'bi bi-pin-angle'"></i>
            <span class="ms-1">{{ diary.isPinned ? 'Tersemat' : 'Sematkan' }}</span>
          </button>

          <button 
            class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-2 fw-semibold"
            @click="printStory"
            title="Cetak atau Simpan PDF Cerita"
          >
            <i class="bi bi-printer-fill me-1"></i> Cetak / PDF
          </button>

          <button 
            class="btn btn-sm btn-primary rounded-pill px-3.5 py-2 fw-bold"
            @click="editStory"
          >
            <i class="bi bi-pencil-square me-1"></i> Edit Cerita
          </button>

          <button 
            class="btn btn-sm btn-outline-danger rounded-pill px-3 py-2 fw-semibold"
            @click="deleteStory"
          >
            <i class="bi bi-trash-fill me-1"></i> Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- PIN PROTECTION PROMPT (IF PRIVATE & LOCKED)                      -->
    <!-- ================================================================= -->
    <div v-if="diary && !isUnlocked" class="card border-0 rounded-4 shadow-sm bg-white p-5 text-center my-4 mx-auto" style="max-width: 500px;">
      <div class="p-4 bg-warning-subtle text-warning rounded-circle d-inline-flex mx-auto mb-3">
        <i class="bi bi-shield-lock-fill display-4"></i>
      </div>
      <h4 class="fw-bold text-dark mb-2">Cerita Terkunci PIN Rahasia</h4>
      <p class="text-muted small mb-4">Catatan harian ini bersifat pribadi. Silakan masukkan PIN 4 digit untuk membukanya.</p>

      <div class="mb-3">
        <input 
          type="password" 
          maxlength="6"
          class="form-control form-control-lg text-center font-monospace fs-3 letter-spacing-4 rounded-3"
          placeholder="••••"
          v-model="pinInput"
          @keyup.enter="unlockWithPin"
        />
      </div>

      <button class="btn btn-warning text-dark fw-bold rounded-pill py-2.5 shadow-sm" @click="unlockWithPin">
        <i class="bi bi-unlock-fill me-1"></i> Buka Kunci Cerita
      </button>
    </div>

    <!-- ================================================================= -->
    <!-- IMMERSIVE STORY PAPER & CONTENT                                  -->
    <!-- ================================================================= -->
    <div v-else-if="diary && isUnlocked" class="story-paper-wrapper card border-0 rounded-4 shadow-lg overflow-hidden bg-white mx-auto" :class="`theme-${diary.theme || 'vintage'}`" style="max-width: 960px;">
      <!-- Story Cover Banner -->
      <div v-if="diary.coverImage || (diary.images && diary.images.length > 0)" class="story-cover-stage position-relative ratio ratio-21x9 overflow-hidden bg-dark">
        <img :src="diary.coverImage || diary.images[0]" alt="Cover Cerita" class="w-100 h-100 object-fit-cover opacity-90" />
        <div class="cover-gradient-overlay position-absolute bottom-0 start-0 w-100 p-4 d-flex justify-content-between align-items-end text-white">
          <div>
            <span class="badge bg-dark bg-opacity-75 text-white px-3 py-1.5 rounded-pill mb-2">
              <i class="bi bi-geo-alt-fill text-danger me-1"></i> {{ diary.location || 'Buku Catatan Harian' }}
            </span>
          </div>
          <span class="badge bg-white text-dark fw-bold px-3 py-1.5 rounded-pill shadow-xs">
            <i class="bi bi-images me-1 text-primary"></i> {{ diary.images ? diary.images.length : 1 }} Foto
          </span>
        </div>
      </div>

      <!-- Story Body -->
      <div class="p-4 p-md-5 story-print-target">
        <!-- Story Metadata Bar -->
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-4 border-bottom border-dark border-opacity-10">
          <div class="d-flex align-items-center gap-3">
            <div class="p-3 bg-white bg-opacity-90 rounded-4 border shadow-xs text-center" style="min-width: 65px;">
              <span class="fs-2 lh-1 d-block">{{ diary.mood || '🤩' }}</span>
              <small class="fw-bold text-dark d-block mt-1" style="font-size: 10px;">{{ diary.moodLabel || 'Mood' }}</small>
            </div>
            <div>
              <h2 class="fw-black text-dark mb-1 story-headline-title">{{ diary.title || 'Cerita Harian' }}</h2>
              <div class="d-flex flex-wrap align-items-center gap-2 small text-muted">
                <span><i class="bi bi-calendar3 me-1"></i> {{ diary.date || 'Hari ini' }}</span>
                <span>•</span>
                <span><i class="bi bi-clock me-1"></i> {{ diary.time || '12:00' }} WIB</span>
                <span v-if="diary.location">•</span>
                <span v-if="diary.location"><i class="bi bi-geo-alt me-1 text-danger"></i> {{ diary.location }}</span>
              </div>
            </div>
          </div>

          <div class="d-flex flex-wrap gap-1">
            <span v-for="tag in (diary.tags || [])" :key="tag" class="badge bg-white bg-opacity-80 text-dark border rounded-pill px-2.5 py-1 small">
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- Markdown Rendered Content -->
        <div class="story-markdown-canvas py-2 mb-4">
          <MarkdownViewer :content="diary.content || '*Belum ada isi cerita.*'" />
        </div>

        <!-- Attached Images Gallery -->
        <div v-if="diary.images && diary.images.length > 0" class="pt-4 border-top border-dark border-opacity-10 mb-4">
          <h5 class="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
            <i class="bi bi-camera-fill text-danger"></i>
            <span>Galeri Foto Cerita ({{ diary.images.length }})</span>
          </h5>
          <div class="row g-3">
            <div v-for="(img, idx) in diary.images" :key="idx" class="col-sm-6 col-md-4">
              <div class="gallery-photo-card rounded-3 overflow-hidden border shadow-xs bg-white ratio ratio-4x3 position-relative">
                <img :src="img" :alt="`Foto ${idx + 1}`" class="w-100 h-100 object-fit-cover cursor-pointer" @click="openImagePreview(img)" />
              </div>
            </div>
          </div>
        </div>

        <!-- Story Footer Quote / Footnote -->
        <div class="p-3.5 bg-white bg-opacity-70 rounded-3 border border-dark border-opacity-10 text-center small text-muted font-monospace">
          <i class="bi bi-pen me-1"></i> Ditulis & disimpan dengan aman di TaskArts Personal Journal.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import MarkdownViewer from '../components/MarkdownViewer.vue';

export default {
  name: 'DiaryDetailView',
  components: {
    MarkdownViewer
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const diaryId = computed(() => route.params.id);
    const pinInput = ref('');
    const isUnlocked = ref(false);

    const diary = computed(() => {
      const all = store.state.diaries || [];
      return all.find(d => d.id === diaryId.value) || null;
    });

    onMounted(() => {
      if (!diary.value) {
        window.alert('Cerita diary tidak ditemukan!');
        router.push('/diary');
        return;
      }
      // If diary is not private, auto unlock
      if (!diary.value.isPrivate) {
        isUnlocked.value = true;
      }
    });

    const unlockWithPin = () => {
      const savedPin = localStorage.getItem('rajinkerja_diary_pin') || '1234';
      if (pinInput.value === savedPin) {
        isUnlocked.value = true;
      } else {
        window.alert('Kode PIN salah. Silakan coba lagi!');
        pinInput.value = '';
      }
    };

    const toggleFavorite = () => {
      if (!diary.value) return;
      store.commit('TOGGLE_DIARY_FAVORITE', diary.value.id);
    };

    const togglePin = () => {
      if (!diary.value) return;
      store.commit('TOGGLE_DIARY_PIN', diary.value.id);
    };

    const editStory = () => {
      router.push({ path: '/diary', query: { editId: diary.value.id } });
    };

    const deleteStory = () => {
      if (window.confirm('Apakah Anda yakin ingin menghapus cerita diary ini?')) {
        store.commit('DELETE_DIARY', diary.value.id);
        window.alert('Cerita telah berhasil dihapus.');
        router.push('/diary');
      }
    };

    const printStory = () => {
      window.print();
    };

    const openImagePreview = (imgSrc) => {
      const w = window.open('');
      if (w) {
        w.document.write(`<img src="${imgSrc}" style="max-width: 100%; height: auto; display: block; margin: auto;" />`);
      }
    };

    const goBack = () => {
      router.push('/diary');
    };

    return {
      diary,
      isUnlocked,
      pinInput,
      unlockWithPin,
      toggleFavorite,
      togglePin,
      editStory,
      deleteStory,
      printStory,
      openImagePreview,
      goBack
    };
  }
};
</script>

<style scoped>
.story-paper-wrapper {
  transition: all 0.3s ease;
}
.cover-gradient-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
}
.story-headline-title {
  font-family: Georgia, 'Times New Roman', serif;
}
.letter-spacing-4 {
  letter-spacing: 12px;
}
.theme-vintage {
  background-color: #fefbf3 !important;
}
.theme-peach {
  background-color: #fff7ed !important;
}
.theme-lavender {
  background-color: #faf5ff !important;
}
.theme-mint {
  background-color: #f0fdf4 !important;
}
.theme-sky {
  background-color: #f0f9ff !important;
}
.theme-rose {
  background-color: #fff1f2 !important;
}
.gallery-photo-card img {
  transition: transform 0.3s ease;
}
.gallery-photo-card:hover img {
  transform: scale(1.05);
}
@media print {
  body * {
    visibility: hidden;
  }
  .story-print-target, .story-print-target * {
    visibility: visible;
  }
  .story-print-target {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
