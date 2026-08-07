<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-warning text-dark fw-bold px-3 py-1.5 rounded-pill">📸 Mood & Happiness</span>
          <span class="badge bg-success text-white fw-bold px-3 py-1.5 rounded-pill">⚡ Auto-Backup Drive Aktif</span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">📸 Selfie for Happiness & Auto Drive Sync</h2>
        <p class="text-muted mb-0">Abadikan momen kebahagiaan Anda. Foto otomatis diunduh ke folder perangkat agar tersinkronisasi otomatis ke Google Drive.</p>
      </div>

      <div class="d-flex flex-wrap gap-2 align-items-center">
        <a
          href="https://drive.google.com/drive/folders/1RRzl1aLt4Vd2OQ3lMjTo9Trod0pcVoat?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-success rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
        >
          <i class="bi bi-google-drive fs-5"></i> Buka Folder Google Drive
        </a>
      </div>
    </div>

    <!-- Camera Capture & Preview Section -->
    <div class="row g-4 mb-4">
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
          <h5 class="fw-bold text-dark mb-3"><i class="bi bi-camera text-primary me-2"></i>Webcam Scanner</h5>

          <!-- Camera Stream Box -->
          <div class="bg-dark rounded-4 overflow-hidden position-relative mb-3 d-flex align-items-center justify-content-center" style="min-height: 280px;">
            <video ref="videoElement" autoplay playsinline class="w-100 h-100 object-fit-cover" v-show="isCameraActive"></video>
            <canvas ref="canvasElement" class="d-none"></canvas>

            <div v-if="!isCameraActive" class="text-center p-4 text-light">
              <i class="bi bi-camera-video-off fs-1 text-muted d-block mb-2"></i>
              <p class="small text-muted">Kamera belum diaktifkan.</p>
              <button class="btn btn-primary rounded-pill px-4 fw-bold" @click="startCamera">
                <i class="bi bi-camera-video me-1"></i> Buka Kamera
              </button>
            </div>
          </div>

          <!-- Capture Controls -->
          <div v-if="isCameraActive" class="d-flex justify-content-center gap-2">
            <button class="btn btn-warning text-dark btn-lg rounded-pill px-5 fw-bold shadow" @click="takeSelfie">
              <i class="bi bi-camera-fill me-1"></i> Ambil Selfie
            </button>
            <button class="btn btn-outline-secondary rounded-pill px-3" @click="stopCamera">
              Tutup Kamera
            </button>
          </div>
        </div>
      </div>

      <!-- Snapshot Preview & Meta Input -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
          <h5 class="fw-bold text-dark mb-3"><i class="bi bi-image text-success me-2"></i>Hasil Foto Snapshot</h5>

          <div v-if="!capturedImage" class="text-center py-5 border rounded-4 bg-light text-muted">
            <i class="bi bi-emoji-smile fs-1 d-block mb-2 text-warning"></i>
            <p class="small mb-0">Klik "Ambil Selfie" untuk mengambil foto kebahagiaan Anda hari ini.</p>
          </div>

          <div v-else class="d-flex flex-column gap-3">
            <div class="rounded-4 overflow-hidden border shadow-sm max-w-md mx-auto position-relative">
              <img :src="capturedImage" class="img-fluid w-100" alt="Selfie Preview" />
              <span class="badge bg-success position-absolute top-0 end-0 m-2 px-3 py-1.5 shadow fw-bold">
                <i class="bi bi-cloud-arrow-up-fill me-1"></i> Ready for Drive
              </span>
            </div>

            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Ekspresi Mood</label>
                <select class="form-select" v-model="selfieMood">
                  <option value="😃 Bahagia">😃 Bahagia & Senang</option>
                  <option value="🚀 Semangat">🚀 Semangat Kerja</option>
                  <option value="☕ Santai">☕ Relax & Santai</option>
                  <option value="💡 Terinspirasi">💡 Terinspirasi Ide Baru</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Catatan Momen</label>
                <input type="text" class="form-control" placeholder="Contoh: Selesai tugas sebelum deadline!" v-model="selfieNote" />
              </div>
            </div>

            <!-- Auto Backup Drive Checkbox -->
            <div class="form-check form-switch p-2 bg-success-subtle rounded-3 border border-success-subtle d-flex align-items-center justify-content-between px-3">
              <div>
                <label class="form-check-label fw-bold text-success small d-block" for="autoDriveToggle">
                  <i class="bi bi-cloud-check-fill me-1"></i> Auto-Download file JPG ke Google Drive Folder
                </label>
                <small class="text-muted d-block" style="font-size: 0.75rem;">Otomatis mengunduh file foto untuk tersinkron langsung ke Google Drive perangkat Anda.</small>
              </div>
              <input class="form-check-input ms-2 fs-5" type="checkbox" role="switch" id="autoDriveToggle" v-model="autoDriveSync" />
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-success flex-grow-1 rounded-pill px-4 fw-bold shadow-sm py-2" @click="saveSelfieToGallery">
                <i class="bi bi-bookmark-heart me-1"></i> Simpan & Auto-Backup
              </button>
              <button class="btn btn-outline-primary rounded-pill px-3 fw-bold" @click="downloadSinglePhoto(capturedImage, 'Selfie_Happiness')" title="Unduh File JPG Langsung">
                <i class="bi bi-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Local Happiness Gallery -->
    <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-3 gap-2">
        <div class="d-flex align-items-center gap-2">
          <h5 class="fw-bold text-dark mb-0"><i class="bi bi-grid-fill text-warning me-2"></i>Galeri Foto Kebahagiaan</h5>
          <span class="badge bg-light text-dark border px-3 py-1 fw-bold">{{ gallery.length }} Foto Tersimpan</span>
        </div>

        <div class="d-flex gap-2" v-if="gallery.length > 0">
          <button class="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold d-flex align-items-center gap-1" @click="downloadAllSelfies">
            <i class="bi bi-download"></i> Unduh Semua JPG untuk Backup Drive
          </button>
        </div>
      </div>

      <div v-if="gallery.length === 0" class="text-center py-5 text-muted">
        <i class="bi bi-images fs-1 text-muted d-block mb-2"></i>
        <p class="small mb-0">Belum ada foto tersimpan di galeri kebahagiaan Anda.</p>
      </div>

      <div v-else class="row g-3">
        <div v-for="item in gallery" :key="item.id" class="col-6 col-md-4 col-lg-3">
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100 position-relative group-hover border">
            <img :src="item.image" class="card-img-top object-fit-cover" style="height: 180px;" alt="Happiness Snapshot" />
            <div class="card-body p-3 bg-white">
              <span class="badge bg-warning text-dark small fw-bold mb-1">{{ item.mood }}</span>
              <p class="small text-dark fw-semibold mb-1 text-truncate">{{ item.note || 'Momen Hari Ini' }}</p>
              <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                <small class="text-muted" style="font-size: 0.7rem;">{{ item.date }}</small>
                <button class="btn btn-xs btn-outline-primary rounded-pill px-2 py-0.5 fw-bold" style="font-size: 0.7rem;" @click="downloadSinglePhoto(item.image, `Selfie_${item.mood}_${item.id}`)" title="Unduh File JPG">
                  <i class="bi bi-download me-1"></i> Unduh
                </button>
              </div>
            </div>
            <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle p-1" @click="deleteSelfie(item.id)" title="Hapus">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { sendOnDeviceNotification } from '../utils/notification';

export default {
  name: 'SelfieHappinessView',
  setup() {
    const store = useStore();

    const videoElement = ref(null);
    const canvasElement = ref(null);
    const isCameraActive = ref(false);
    const capturedImage = ref(null);
    const selfieMood = ref('😃 Bahagia');
    const selfieNote = ref('');
    const autoDriveSync = ref(true);
    let stream = null;

    const gallery = computed(() => store.getters.getSelfieGallery || []);

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoElement.value) {
          videoElement.value.srcObject = stream;
        }
        isCameraActive.value = true;
      } catch (err) {
        alert('Tidak dapat mengakses webcam. Pastikan izin kamera telah diberikan.');
      }
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
      isCameraActive.value = false;
    };

    const takeSelfie = () => {
      const video = videoElement.value;
      const canvas = canvasElement.value;
      if (video && canvas) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        capturedImage.value = canvas.toDataURL('image/jpeg');
      }
    };

    const downloadSinglePhoto = (dataUrl, filenamePrefix = 'Selfie_Happiness') => {
      if (!dataUrl) return;
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    const downloadAllSelfies = () => {
      if (!gallery.value || gallery.value.length === 0) return;
      gallery.value.forEach((item, idx) => {
        setTimeout(() => {
          downloadSinglePhoto(item.image, `Selfie_${idx + 1}`);
        }, idx * 300);
      });
      sendOnDeviceNotification('📥 Backup Google Drive Diunduh', {
        body: `${gallery.value.length} foto kebahagiaan diunduh ke folder Drive perangkat Anda.`,
        type: 'success'
      });
    };

    const saveSelfieToGallery = () => {
      if (!capturedImage.value) return;

      const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

      store.dispatch('addSelfie', {
        image: capturedImage.value,
        mood: selfieMood.value,
        note: selfieNote.value,
        date: dateStr
      });

      // Auto-download file JPG to local device / Drive sync folder if toggle is ON
      if (autoDriveSync.value) {
        downloadSinglePhoto(capturedImage.value, `Selfie_DriveBackup_${selfieMood.value.replace(/[^a-zA-Z0-9]/g, '')}`);
      }

      sendOnDeviceNotification('📸 Foto & Backup Drive Tersimpan', {
        body: autoDriveSync.value
          ? 'Foto kebahagiaan disimpan & otomatis terunduh untuk disinkronkan ke Google Drive!'
          : 'Foto kebahagiaan berhasil disimpan ke galeri lokal Anda.',
        type: 'success'
      });

      capturedImage.value = null;
      selfieNote.value = '';
    };

    const deleteSelfie = (id) => {
      store.dispatch('deleteSelfie', id);
    };

    onUnmounted(() => {
      stopCamera();
    });

    return {
      videoElement,
      canvasElement,
      isCameraActive,
      capturedImage,
      selfieMood,
      selfieNote,
      autoDriveSync,
      gallery,
      startCamera,
      stopCamera,
      takeSelfie,
      downloadSinglePhoto,
      downloadAllSelfies,
      saveSelfieToGallery,
      deleteSelfie
    };
  }
};
</script>

<style scoped>
.max-w-md { max-width: 28rem; }
.object-fit-cover { object-fit: cover; }
</style>
