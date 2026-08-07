<template>
  <div class="game-container w-100 position-relative rounded-4 overflow-hidden bg-dark shadow-lg p-4 text-center text-white min-h-480 d-flex flex-column justify-content-between">
    <!-- Top HUD -->
    <div class="d-flex justify-content-between align-items-center bg-dark bg-opacity-75 p-3 rounded-4 border border-secondary border-opacity-25 mb-3">
      <div class="d-flex align-items-center gap-3">
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.7rem;">TOTAL KLIK</small>
          <span class="fs-4 fw-extrabold text-warning font-monospace">{{ clicks }}</span>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.7rem;">CPS (KLIK/DETIK)</small>
          <span class="fs-4 fw-extrabold text-info font-monospace">{{ cps }}</span>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.7rem;">REKOR TERTINGGI</small>
          <span class="fs-5 fw-bold text-success font-monospace">{{ highScore }}</span>
        </div>
      </div>

      <div>
        <small class="text-secondary d-block fw-bold" style="font-size: 0.7rem;">SISA WAKTU</small>
        <span class="fs-3 fw-extrabold text-danger font-monospace">{{ timeLeft }}s</span>
      </div>
    </div>

    <!-- Center Click Arena -->
    <div class="my-auto py-4">
      <div v-if="!isPlaying" class="mb-4">
        <h3 class="fw-extrabold text-warning mb-2">⚡ SPEED CLICKER TEST</h3>
        <p class="text-light opacity-75 small max-w-sm mx-auto">Uji Kecepatan Jari Anda! Klik tombol merah sebanyak mungkin dalam waktu 10 detik!</p>
        <button class="btn btn-warning btn-lg rounded-pill px-5 fw-extrabold shadow-lg py-3 fs-5 mt-2" @click="startTest">
          <i class="bi bi-lightning-charge-fill me-2"></i> MULAI UJI REFLEKS
        </button>
      </div>

      <div v-else class="d-flex flex-column align-items-center justify-content-center">
        <button
          class="btn btn-danger btn-lg rounded-circle shadow-lg p-4 fw-extrabold animate-pulse hover-scale border-4 border-warning"
          style="width: 180px; height: 180px; font-size: 2rem; user-select: none;"
          @mousedown="handleClick"
          @touchstart.prevent="handleClick"
        >
          KLIK!
          <small class="d-block fs-6 opacity-75">+1</small>
        </button>
        <p class="text-info mt-3 fw-bold font-monospace">Lakukan Klik Secepat Mungkin!</p>
      </div>
    </div>

    <!-- Bottom Info -->
    <div class="border-top border-secondary border-opacity-25 pt-3 text-secondary small">
      <i class="bi bi-hand-index me-1"></i> Tips: Pakai 2 jari bergantian di layar hp atau tombol mouse untuk hasil maksimal!
    </div>
  </div>
</template>

<script>
import { ref, computed, onUnmounted } from 'vue';
import { playSound } from '@/utils/gameAudio';

export default {
  name: 'SpeedClicker',
  setup() {
    const clicks = ref(0);
    const timeLeft = ref(10);
    const isPlaying = ref(false);
    const highScore = ref(parseInt(localStorage.getItem('clicker_highscore') || '0'));
    let timerInterval = null;

    const cps = computed(() => {
      const elapsed = 10 - timeLeft.value;
      if (elapsed <= 0) return 0;
      return (clicks.value / elapsed).toFixed(1);
    });

    const startTest = () => {
      clicks.value = 0;
      timeLeft.value = 10;
      isPlaying.value = true;
      playSound('select');

      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value--;
        } else {
          clearInterval(timerInterval);
          isPlaying.value = false;
          playSound('win');
          if (clicks.value > highScore.value) {
            highScore.value = clicks.value;
            localStorage.setItem('clicker_highscore', clicks.value.toString());
          }
        }
      }, 1000);
    };

    const handleClick = () => {
      if (!isPlaying.value) return;
      clicks.value++;
      playSound('click');
    };

    onUnmounted(() => {
      if (timerInterval) clearInterval(timerInterval);
    });

    return {
      clicks,
      timeLeft,
      cps,
      highScore,
      isPlaying,
      startTest,
      handleClick
    };
  }
};
</script>

<style scoped>
.min-h-480 { min-height: 480px; }
.hover-scale:active { transform: scale(0.92); }
</style>
