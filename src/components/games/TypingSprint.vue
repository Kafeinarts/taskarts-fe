<template>
  <div class="game-container w-100 position-relative rounded-4 overflow-hidden bg-dark shadow-lg">
    <!-- Top HUD Overlay -->
    <div class="position-absolute top-0 start-0 end-0 p-2.5 p-md-3 d-flex justify-content-between align-items-center bg-dark bg-opacity-75 text-white z-3 border-bottom border-secondary border-opacity-25">
      <div class="d-flex align-items-center gap-2 gap-md-3">
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">KECEPATAN (WPM)</small>
          <span class="fs-4 fw-extrabold text-success font-monospace">{{ wpm }}</span>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">AKURASI</small>
          <span class="fs-5 fw-bold text-info font-monospace">{{ accuracy }}%</span>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">REKOR WPM</small>
          <span class="fs-5 fw-bold text-warning font-monospace">{{ highWpm }}</span>
        </div>
      </div>

      <div class="d-flex align-items-center gap-1.5">
        <button class="btn btn-sm btn-outline-light rounded-circle p-1.5" @click="toggleSound" :title="muted ? 'Unmute' : 'Mute'">
          <i :class="muted ? 'bi bi-volume-mute-fill' : 'bi bi-volume-up-fill'"></i>
        </button>
        <button class="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 text-white" @click="nextQuote">
          <i class="bi bi-arrow-clockwise"></i> <span class="d-none d-sm-inline">Ganti Quote</span>
        </button>
      </div>
    </div>

    <!-- Main Typing Terminal Arena -->
    <div class="p-4 pt-5 pb-5 d-flex flex-column justify-content-center text-white" style="min-height: clamp(360px, 58vh, 500px); background: radial-gradient(circle at center, #1e293b, #0f172a);">
      <div class="w-100 max-w-2xl mx-auto mt-4">
        <!-- Target Quote Display with Color Coded Characters -->
        <div class="p-3 p-md-4 rounded-4 bg-black bg-opacity-40 border border-secondary border-opacity-30 mb-3 shadow-inner">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="badge bg-primary bg-opacity-20 text-info border border-info border-opacity-25 rounded-pill px-2.5 py-1 small">
              <i class="bi bi-chat-quote-fill me-1"></i> Quote Motivasi & Produktivitas #{{ quoteIndex + 1 }}
            </span>
            <span class="text-secondary small font-monospace">{{ inputChars.length }} / {{ targetQuote.length }} Karakter</span>
          </div>

          <div class="quote-text-display fs-5 fs-md-4 lh-base font-monospace text-wrap">
            <span
              v-for="(char, idx) in targetQuote.split('')"
              :key="idx"
              :class="getCharClass(idx)"
            >{{ char }}</span>
          </div>
        </div>

        <!-- Input Area (Desktop & Mobile Friendly) -->
        <div class="position-relative mb-3">
          <textarea
            ref="inputBox"
            v-model="inputChars"
            class="form-control form-control-lg bg-dark text-white border-2 rounded-4 font-monospace fs-5 py-3 px-3 shadow"
            :class="isError ? 'border-danger' : 'border-primary'"
            rows="2"
            placeholder="Mulai ketik di sini secepat mungkin..."
            @input="onTyping"
            @focus="onFocusInput"
          ></textarea>
          <div v-if="!hasStarted" class="position-absolute end-0 top-0 mt-3 me-3 pointer-events-none">
            <span class="badge bg-warning text-dark px-2.5 py-1.5 rounded-pill shadow-sm">
              <i class="bi bi-cursor-fill me-1"></i> Ketik untuk mulai timer
            </span>
          </div>
        </div>

        <!-- Progress & Quick Words helper for mobile touch typing -->
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div class="progress flex-grow-1" style="height: 8px;">
            <div class="progress-bar bg-success" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <button class="btn btn-sm btn-outline-info rounded-pill px-3" @click="focusInputBox">
            <i class="bi bi-keyboard-fill me-1"></i> Buka Keyboard HP
          </button>
        </div>
      </div>
    </div>

    <!-- Victory / Round Finish Modal -->
    <div v-if="isFinished" class="position-absolute inset-0 bg-dark bg-opacity-90 d-flex flex-column align-items-center justify-content-center text-white z-3 p-4 text-center">
      <span class="display-3 mb-2">🏆⚡</span>
      <h3 class="fw-extrabold text-warning mb-1">QUOTE SELESAI DITIK!</h3>
      <div class="d-flex justify-content-center gap-3 my-3">
        <div class="p-3 bg-light bg-opacity-10 rounded-4 border border-secondary">
          <span class="text-secondary small d-block">KECEPATAN</span>
          <span class="fs-2 fw-extrabold text-success font-monospace">{{ wpm }} WPM</span>
        </div>
        <div class="p-3 bg-light bg-opacity-10 rounded-4 border border-secondary">
          <span class="text-secondary small d-block">AKURASI</span>
          <span class="fs-2 fw-extrabold text-info font-monospace">{{ accuracy }}%</span>
        </div>
        <div class="p-3 bg-light bg-opacity-10 rounded-4 border border-secondary">
          <span class="text-secondary small d-block">WAKTU</span>
          <span class="fs-2 fw-extrabold text-warning font-monospace">{{ timeTaken }}s</span>
        </div>
      </div>

      <button class="btn btn-warning btn-lg rounded-pill px-5 fw-extrabold shadow-lg py-2 fs-5" @click="nextQuote">
        <i class="bi bi-arrow-right-circle-fill me-2"></i> Quote Berikutnya
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { playSound, toggleMuteSound, isSoundMuted } from '@/utils/gameAudio';

export default {
  name: 'TypingSprint',
  setup() {
    const quotes = [
      'Disiplin adalah jembatan antara cita-cita dan pencapaian nyata setiap hari.',
      'Selesaikan pekerjaan prioritas terberatmu di pagi hari dengan ketenangan pikiran.',
      'Fokus pada proses berkualitas tinggi, maka hasil luar biasa akan mengikuti dengan sendirinya.',
      'Satu baris kode yang bersih dan teruji lebih berharga daripada seribu baris tanpa arah.',
      'Istirahat sejenak adalah bagian dari strategi untuk melaju dua kali lebih cepat nanti.',
      'Kunci sukses bukan pada seberapa sibuk Anda, melainkan seberapa berdampak apa yang Anda kerjakan.',
      'Keberanian untuk memulai langkah pertama adalah separuh dari kesuksesan yang kita raih.',
      'Produktivitas sejati adalah kemampuan mengelola energi, bukan sekadar menghitung waktu yang habis.'
    ];

    const inputBox = ref(null);
    const quoteIndex = ref(0);
    const targetQuote = ref(quotes[0]);
    const inputChars = ref('');
    const hasStarted = ref(false);
    const startTime = ref(0);
    const endTime = ref(0);
    const timeTaken = ref(0);
    const isFinished = ref(false);
    const isError = ref(false);
    const wpm = ref(0);
    const accuracy = ref(100);
    const highWpm = ref(parseInt(localStorage.getItem('typing_high_wpm') || '0'));
    const muted = ref(isSoundMuted());

    const progressPercent = computed(() => {
      if (!targetQuote.value.length) return 0;
      return Math.min(100, Math.floor((inputChars.value.length / targetQuote.value.length) * 100));
    });

    const getCharClass = (idx) => {
      if (idx >= inputChars.value.length) return 'text-secondary opacity-50';
      if (inputChars.value[idx] === targetQuote.value[idx]) return 'text-success fw-bold';
      return 'text-danger fw-bold bg-danger bg-opacity-25 px-0.5 rounded';
    };

    const onTyping = () => {
      if (!hasStarted.value && inputChars.value.length > 0) {
        hasStarted.value = true;
        startTime.value = Date.now();
      }

      // Check current character
      const currentIdx = inputChars.value.length - 1;
      if (currentIdx >= 0) {
        if (inputChars.value[currentIdx] === targetQuote.value[currentIdx]) {
          isError.value = false;
          playSound('click');
        } else {
          isError.value = true;
          playSound('hit');
        }
      }

      // Realtime WPM & Accuracy calculation
      if (startTime.value > 0) {
        const elapsedMinutes = (Date.now() - startTime.value) / 60000;
        if (elapsedMinutes > 0.02) {
          const wordsTyped = inputChars.value.trim().split(/\s+/).length;
          wpm.value = Math.max(0, Math.round(wordsTyped / elapsedMinutes));
        }
      }

      // Calculate accuracy
      let correct = 0;
      for (let i = 0; i < inputChars.value.length; i++) {
        if (inputChars.value[i] === targetQuote.value[i]) correct++;
      }
      accuracy.value = inputChars.value.length ? Math.round((correct / inputChars.value.length) * 100) : 100;

      // Completion check
      if (inputChars.value === targetQuote.value) {
        endTime.value = Date.now();
        timeTaken.value = Math.round((endTime.value - startTime.value) / 1000);
        isFinished.value = true;
        playSound('win');

        if (wpm.value > highWpm.value) {
          highWpm.value = wpm.value;
          localStorage.setItem('typing_high_wpm', highWpm.value.toString());
        }
      }
    };

    const nextQuote = () => {
      quoteIndex.value = (quoteIndex.value + 1) % quotes.length;
      targetQuote.value = quotes[quoteIndex.value];
      inputChars.value = '';
      hasStarted.value = false;
      startTime.value = 0;
      endTime.value = 0;
      isFinished.value = false;
      isError.value = false;
      wpm.value = 0;
      accuracy.value = 100;
      focusInputBox();
    };

    const focusInputBox = () => {
      if (inputBox.value) inputBox.value.focus();
    };

    const onFocusInput = () => {
      // ready
    };

    const toggleSound = () => {
      muted.value = toggleMuteSound();
    };

    onMounted(() => {
      focusInputBox();
    });

    return {
      inputBox,
      quotes,
      quoteIndex,
      targetQuote,
      inputChars,
      hasStarted,
      timeTaken,
      isFinished,
      isError,
      wpm,
      accuracy,
      highWpm,
      muted,
      progressPercent,
      getCharClass,
      onTyping,
      nextQuote,
      focusInputBox,
      onFocusInput,
      toggleSound
    };
  }
};
</script>

<style scoped>
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.max-w-2xl { max-width: 48rem; }
.pointer-events-none { pointer-events: none; }
.quote-text-display {
  user-select: none;
}
</style>
