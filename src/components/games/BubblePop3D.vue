<template>
  <div class="game-container w-100 position-relative rounded-4 overflow-hidden bg-dark shadow-lg">
    <!-- Top HUD Overlay -->
    <div class="position-absolute top-0 start-0 end-0 p-2.5 p-md-3 d-flex justify-content-between align-items-center bg-dark bg-opacity-75 text-white z-3 border-bottom border-secondary border-opacity-25">
      <div class="d-flex align-items-center gap-2 gap-md-3">
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">GELEMBUNG PECAH</small>
          <span class="fs-4 fw-extrabold text-info font-monospace">{{ poppedCount }}</span>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">SKOR ZEN</small>
          <span class="fs-4 fw-extrabold text-warning font-monospace">{{ score }}</span>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">SISA WAKTU</small>
          <span class="fs-5 fw-bold font-monospace" :class="timeLeft <= 10 ? 'text-danger animate-pulse' : 'text-success'">{{ timeLeft }}s</span>
        </div>
      </div>

      <div class="d-flex align-items-center gap-1.5">
        <button class="btn btn-sm btn-outline-light rounded-circle p-1.5" @click="toggleSound" :title="muted ? 'Unmute' : 'Mute'">
          <i :class="muted ? 'bi bi-volume-mute-fill' : 'bi bi-volume-up-fill'"></i>
        </button>
        <button class="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 text-white" @click="resetGame">
          <i class="bi bi-arrow-counterclockwise"></i> <span class="d-none d-sm-inline">Reset</span>
        </button>
      </div>
    </div>

    <!-- Bubble Pop Arena (Interactive Floating Bubbles) -->
    <div
      ref="popArena"
      class="w-100 position-relative game-canvas-wrapper overflow-hidden user-select-none"
      style="background: radial-gradient(circle at center, #0f172a, #020617);"
      @touchstart="handleTouchMulti"
    >
      <!-- Floating translucent bubbles -->
      <div
        v-for="b in bubbles"
        :key="b.id"
        class="bubble-item position-absolute rounded-circle d-flex align-items-center justify-content-center shadow"
        :style="{
          left: b.x + '%',
          top: b.y + '%',
          width: b.size + 'px',
          height: b.size + 'px',
          background: b.bg,
          border: '2px solid rgba(255, 255, 255, 0.6)',
          boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.25)',
          transform: `scale(${b.popping ? 1.4 : 1})`,
          opacity: b.popping ? 0 : 0.9,
          transition: b.popping ? 'all 0.15s ease-out' : 'none',
          cursor: 'pointer'
        }"
        @mousedown.stop="popBubble(b)"
      >
        <div class="bubble-reflection rounded-circle position-absolute" style="top: 15%; left: 20%; width: 25%; height: 25%; background: rgba(255, 255, 255, 0.75);"></div>
        <span v-if="b.isGolden" class="fs-4">✨</span>
      </div>

      <!-- Pop floating score text effects -->
      <div
        v-for="effect in popEffects"
        :key="effect.id"
        class="position-absolute text-warning fw-extrabold font-monospace pointer-events-none"
        :style="{
          left: effect.x + '%',
          top: effect.y + '%',
          fontSize: '1.2rem',
          transform: 'translate(-50%, -50%)',
          animation: 'floatUp 0.6s forwards'
        }"
      >
        +{{ effect.pts }}
      </div>
    </div>

    <!-- Start / Game Over Screen -->
    <div v-if="!isPlaying || isGameOver" class="position-absolute inset-0 bg-dark bg-opacity-85 d-flex flex-column align-items-center justify-content-center text-white z-3 p-4 text-center">
      <div class="mb-3">
        <span class="fs-1 d-block mb-1">🫧✨🫧</span>
        <h3 class="fw-extrabold text-warning mb-1">BUBBLE POP ZEN 3D</h3>
        <p class="text-light opacity-75 small max-w-sm">Pecahkan gelembung sabun neon mengapung secepat mungkin! Nikmati kepuasan anti-stres dan raih skor combo tinggi.</p>
      </div>

      <div v-if="isGameOver" class="mb-3 bg-success bg-opacity-25 border border-success p-3 rounded-4 w-100 max-w-xs">
        <h5 class="fw-bold text-success mb-1">SESI POP SELESAI!</h5>
        <div class="display-6 fw-extrabold font-monospace text-warning mb-1">{{ score }} Poin</div>
        <small class="text-light opacity-75">Gelembung Pecah: {{ poppedCount }} | Rekor: {{ highScore }}</small>
      </div>

      <button class="btn btn-warning btn-lg rounded-pill px-5 fw-extrabold shadow-lg py-2 fs-5" @click="startGame">
        <i class="bi bi-play-circle-fill me-2"></i> {{ isGameOver ? 'Main Lagi' : 'Mulai Pecahkan Gelembung' }}
      </button>

      <div class="mt-3 pt-2 border-top border-secondary border-opacity-50 text-secondary small">
        <i class="bi bi-hand-index-thumb me-1"></i> Sentuh / klik langsung gelembung dengan semua jari tangan Anda!
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted } from 'vue';
import { playSound, toggleMuteSound, isSoundMuted } from '@/utils/gameAudio';

export default {
  name: 'BubblePop3D',
  setup() {
    const popArena = ref(null);
    const score = ref(0);
    const poppedCount = ref(0);
    const timeLeft = ref(45);
    const highScore = ref(parseInt(localStorage.getItem('bubble_pop_highscore') || '0'));
    const isPlaying = ref(false);
    const isGameOver = ref(false);
    const muted = ref(isSoundMuted());

    const bubbles = ref([]);
    const popEffects = ref([]);
    let gameInterval = null;
    let timerInterval = null;
    let nextId = 1;

    const gradients = [
      'radial-gradient(circle at 35% 35%, rgba(56, 189, 248, 0.8), rgba(2, 132, 199, 0.4))',
      'radial-gradient(circle at 35% 35%, rgba(244, 114, 182, 0.8), rgba(219, 39, 119, 0.4))',
      'radial-gradient(circle at 35% 35%, rgba(52, 211, 153, 0.8), rgba(5, 150, 105, 0.4))',
      'radial-gradient(circle at 35% 35%, rgba(167, 139, 250, 0.8), rgba(124, 58, 237, 0.4))',
      'radial-gradient(circle at 35% 35%, rgba(251, 191, 36, 0.9), rgba(217, 119, 6, 0.5))'
    ];

    const spawnBubble = () => {
      if (!isPlaying.value || isGameOver.value) return;
      const isGolden = Math.random() < 0.15;
      const size = Math.floor(Math.random() * 32) + 48; // 48px to 80px
      const x = Math.floor(Math.random() * 82) + 4; // 4% to 86%
      const speed = (Math.random() * 0.4) + 0.35;

      bubbles.value.push({
        id: nextId++,
        x,
        y: 105, // start below bottom
        size,
        isGolden,
        bg: isGolden
          ? 'radial-gradient(circle at 35% 35%, rgba(250, 204, 21, 0.95), rgba(180, 83, 9, 0.6))'
          : gradients[Math.floor(Math.random() * gradients.length)],
        speed,
        popping: false
      });
    };

    const popBubble = (bubble) => {
      if (!isPlaying.value || isGameOver.value || bubble.popping) return;
      bubble.popping = true;
      poppedCount.value++;
      const pts = bubble.isGolden ? 150 : 50;
      score.value += pts;

      playSound('coin');

      // Add float effect
      popEffects.value.push({
        id: nextId++,
        x: bubble.x,
        y: bubble.y,
        pts
      });

      setTimeout(() => {
        const idx = bubbles.value.findIndex(b => b.id === bubble.id);
        if (idx !== -1) bubbles.value.splice(idx, 1);
      }, 120);

      // Clean effects
      setTimeout(() => {
        if (popEffects.value.length > 0) popEffects.value.shift();
      }, 600);
    };

    const handleTouchMulti = (e) => {
      if (!isPlaying.value || isGameOver.value || !popArena.value) return;
      const rect = popArena.value.getBoundingClientRect();

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const touchX = ((touch.clientX - rect.left) / rect.width) * 100;
        const touchY = ((touch.clientY - rect.top) / rect.height) * 100;

        // Check if touches any bubble
        for (const b of bubbles.value) {
          if (!b.popping) {
            const bWidthPct = (b.size / rect.width) * 100;
            const bHeightPct = (b.size / rect.height) * 100;
            if (
              touchX >= b.x &&
              touchX <= b.x + bWidthPct &&
              touchY >= b.y &&
              touchY <= b.y + bHeightPct
            ) {
              popBubble(b);
            }
          }
        }
      }
    };

    const startGame = () => {
      score.value = 0;
      poppedCount.value = 0;
      timeLeft.value = 45;
      isGameOver.value = false;
      isPlaying.value = true;
      bubbles.value = [];
      popEffects.value = [];

      clearInterval(gameInterval);
      clearInterval(timerInterval);

      playSound('select');

      // Initial batch of bubbles
      for (let i = 0; i < 6; i++) {
        spawnBubble();
        if (bubbles.value[i]) {
          bubbles.value[i].y = Math.random() * 80;
        }
      }

      // Game animation loop
      gameInterval = setInterval(() => {
        if (!isPlaying.value || isGameOver.value) return;

        // Spawn new
        if (Math.random() < 0.45 && bubbles.value.length < 16) {
          spawnBubble();
        }

        // Float bubbles up
        for (let i = bubbles.value.length - 1; i >= 0; i--) {
          const b = bubbles.value[i];
          if (!b.popping) {
            b.y -= b.speed;
            if (b.y < -15) {
              bubbles.value.splice(i, 1);
            }
          }
        }
      }, 30);

      // Countdown timer
      timerInterval = setInterval(() => {
        timeLeft.value--;
        if (timeLeft.value <= 0) {
          endGame();
        }
      }, 1000);
    };

    const endGame = () => {
      isPlaying.value = false;
      isGameOver.value = true;
      clearInterval(gameInterval);
      clearInterval(timerInterval);
      playSound('win');

      if (score.value > highScore.value) {
        highScore.value = score.value;
        localStorage.setItem('bubble_pop_highscore', highScore.value.toString());
      }
    };

    const resetGame = () => {
      isPlaying.value = false;
      isGameOver.value = false;
      clearInterval(gameInterval);
      clearInterval(timerInterval);
      bubbles.value = [];
      popEffects.value = [];
    };

    const toggleSound = () => {
      muted.value = toggleMuteSound();
    };

    onUnmounted(() => {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
    });

    return {
      popArena,
      score,
      poppedCount,
      timeLeft,
      highScore,
      isPlaying,
      isGameOver,
      muted,
      bubbles,
      popEffects,
      popBubble,
      handleTouchMulti,
      startGame,
      resetGame,
      toggleSound
    };
  }
};
</script>

<style scoped>
.game-canvas-wrapper {
  height: clamp(340px, 58vh, 500px);
}
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.max-w-sm { max-width: 24rem; }
.max-w-xs { max-width: 20rem; }
.pointer-events-none { pointer-events: none; }
@keyframes floatUp {
  0% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, -30px); }
}
</style>
