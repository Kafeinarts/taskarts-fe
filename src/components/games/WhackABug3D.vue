<template>
  <div class="game-container w-100 position-relative rounded-4 overflow-hidden bg-dark shadow-lg">
    <!-- Top HUD Overlay -->
    <div class="position-absolute top-0 start-0 end-0 p-2.5 p-md-3 d-flex justify-content-between align-items-center bg-dark bg-opacity-75 text-white z-3 border-bottom border-secondary border-opacity-25">
      <div class="d-flex align-items-center gap-2 gap-md-3">
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">SKOR BUG</small>
          <span class="fs-4 fw-extrabold text-warning font-monospace">{{ score }}</span>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">SISA WAKTU</small>
          <span class="fs-5 fw-bold font-monospace" :class="timeLeft <= 5 ? 'text-danger animate-pulse' : 'text-info'">{{ timeLeft }}s</span>
        </div>
        <div>
          <small class="text-secondary d-block fw-bold" style="font-size: 0.68rem;">COMBO</small>
          <span class="badge bg-danger rounded-pill px-2 py-1 font-monospace">x{{ combo }}</span>
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

    <!-- 3x3 Server Rack Grid Arena -->
    <div class="p-3 p-md-4 pt-5 pb-5 d-flex flex-column align-items-center justify-content-center text-white" style="min-height: clamp(360px, 60vh, 520px); background: radial-gradient(circle at center, #1e1b4b, #09090b);">
      <div class="w-100 max-w-lg mt-4">
        <div class="row g-2.5 g-md-3 justify-content-center">
          <div
            v-for="(hole, idx) in holes"
            :key="idx"
            class="col-4"
          >
            <div
              class="server-hole position-relative rounded-4 border border-secondary border-opacity-40 p-2 d-flex flex-column align-items-center justify-content-center shadow-lg transition-all"
              :class="{
                'bg-slate-900': !hole.active,
                'bg-danger bg-opacity-30 border-danger': hole.active && !hole.hit,
                'bg-success bg-opacity-30 border-success': hole.hit
              }"
              style="height: clamp(88px, 16vh, 120px); cursor: pointer;"
              @mousedown="whack(idx)"
              @touchstart.prevent="whack(idx)"
            >
              <!-- Server node badge -->
              <div class="position-absolute top-0 start-0 m-1.5 small font-monospace text-secondary" style="font-size: 0.65rem;">
                #NODE-0{{ idx + 1 }}
              </div>

              <!-- Animated Bug or Hit Indicator -->
              <div v-if="hole.active" class="bug-character text-center animate-bounce">
                <span class="fs-1 d-block lh-1">{{ hole.hit ? '💥' : hole.icon }}</span>
                <span class="badge bg-danger rounded-pill mt-1" style="font-size: 0.65rem;">{{ hole.hit ? '+100' : hole.name }}</span>
              </div>
              <div v-else class="text-secondary opacity-30 text-center">
                <i class="bi bi-cpu fs-3 d-block"></i>
                <span style="font-size: 0.6rem;">OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Start / Game Over Overlay Screen -->
    <div v-if="!isPlaying || isGameOver" class="position-absolute inset-0 bg-dark bg-opacity-85 d-flex flex-column align-items-center justify-content-center text-white z-3 p-4 text-center">
      <div class="mb-3">
        <span class="fs-1 d-block mb-1">🔨🐛💥</span>
        <h3 class="fw-extrabold text-warning mb-1">WHACK-A-BUG (PUKUL BUG SERVER)</h3>
        <p class="text-light opacity-75 small max-w-sm">Bug kodingan merah bermunculan dari server terminal! Pukul dan perbaiki server sebelum waktu 30 detik habis.</p>
      </div>

      <div v-if="isGameOver" class="mb-3 bg-danger bg-opacity-25 border border-danger p-3 rounded-4 w-100 max-w-xs">
        <h5 class="fw-bold text-danger mb-1">WAKTU SPRINT HABIS!</h5>
        <div class="display-6 fw-extrabold font-monospace text-warning mb-1">{{ score }} Poin</div>
        <small class="text-light opacity-75">Combo Maksimal: x{{ maxCombo }} | Rekor: {{ highScore }}</small>
      </div>

      <button class="btn btn-warning btn-lg rounded-pill px-5 fw-extrabold shadow-lg py-2 fs-5" @click="startGame">
        <i class="bi bi-play-circle-fill me-2"></i> {{ isGameOver ? 'Main Lagi' : 'Mulai Pukul Bug' }}
      </button>

      <div class="mt-3 pt-2 border-top border-secondary border-opacity-50 text-secondary small">
        <i class="bi bi-hand-index-thumb me-1"></i> Sentuh atau klik langsung lubang server tempat bug muncul
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted } from 'vue';
import { playSound, toggleMuteSound, isSoundMuted } from '@/utils/gameAudio';

export default {
  name: 'WhackABug3D',
  setup() {
    const score = ref(0);
    const timeLeft = ref(30);
    const combo = ref(0);
    const maxCombo = ref(0);
    const highScore = ref(parseInt(localStorage.getItem('whack_bug_highscore') || '0'));
    const isPlaying = ref(false);
    const isGameOver = ref(false);
    const muted = ref(isSoundMuted());

    const bugTypes = [
      { name: '404 Error', icon: '👾' },
      { name: 'NullPointer', icon: '🐛' },
      { name: 'SyntaxBug', icon: '🕷️' },
      { name: 'MemoryLeak', icon: '🦠' }
    ];

    const holes = ref(Array.from({ length: 9 }, () => ({
      active: false,
      hit: false,
      name: 'Bug',
      icon: '👾'
    })));

    let timerInterval = null;
    let spawnInterval = null;

    const whack = (idx) => {
      if (!isPlaying.value || isGameOver.value) return;
      const hole = holes.value[idx];
      if (hole.active && !hole.hit) {
        hole.hit = true;
        combo.value++;
        if (combo.value > maxCombo.value) maxCombo.value = combo.value;
        const pts = 100 + (combo.value * 10);
        score.value += pts;
        playSound('coin');

        setTimeout(() => {
          hole.active = false;
          hole.hit = false;
        }, 180);
      } else if (!hole.active) {
        // Missed click resets combo
        combo.value = 0;
        playSound('hit');
      }
    };

    const spawnBug = () => {
      if (!isPlaying.value || isGameOver.value) return;

      // Select 1 or 2 random holes
      const inactiveIndices = holes.value
        .map((h, i) => (!h.active ? i : null))
        .filter(i => i !== null);

      if (inactiveIndices.length === 0) return;

      const randomIdx = inactiveIndices[Math.floor(Math.random() * inactiveIndices.length)];
      const randomBug = bugTypes[Math.floor(Math.random() * bugTypes.length)];

      const hole = holes.value[randomIdx];
      hole.active = true;
      hole.hit = false;
      hole.name = randomBug.name;
      hole.icon = randomBug.icon;

      // Stay duration
      const duration = Math.max(600, 1100 - (30 - timeLeft.value) * 15);
      setTimeout(() => {
        if (hole.active && !hole.hit) {
          hole.active = false;
          combo.value = 0; // Missed
        }
      }, duration);
    };

    const startGame = () => {
      score.value = 0;
      timeLeft.value = 30;
      combo.value = 0;
      maxCombo.value = 0;
      isGameOver.value = false;
      isPlaying.value = true;

      holes.value.forEach(h => {
        h.active = false;
        h.hit = false;
      });

      clearInterval(timerInterval);
      clearInterval(spawnInterval);

      playSound('select');

      timerInterval = setInterval(() => {
        timeLeft.value--;
        if (timeLeft.value <= 0) {
          endGame();
        }
      }, 1000);

      spawnInterval = setInterval(() => {
        spawnBug();
      }, 700);
    };

    const endGame = () => {
      isPlaying.value = false;
      isGameOver.value = true;
      clearInterval(timerInterval);
      clearInterval(spawnInterval);
      playSound('win');

      if (score.value > highScore.value) {
        highScore.value = score.value;
        localStorage.setItem('whack_bug_highscore', highScore.value.toString());
      }
    };

    const resetGame = () => {
      isPlaying.value = false;
      isGameOver.value = false;
      clearInterval(timerInterval);
      clearInterval(spawnInterval);
      holes.value.forEach(h => {
        h.active = false;
        h.hit = false;
      });
    };

    const toggleSound = () => {
      muted.value = toggleMuteSound();
    };

    onUnmounted(() => {
      clearInterval(timerInterval);
      clearInterval(spawnInterval);
    });

    return {
      score,
      timeLeft,
      combo,
      maxCombo,
      highScore,
      isPlaying,
      isGameOver,
      muted,
      holes,
      whack,
      startGame,
      resetGame,
      toggleSound
    };
  }
};
</script>

<style scoped>
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.max-w-lg { max-width: 32rem; }
.max-w-xs { max-width: 20rem; }
.server-hole:active {
  transform: scale(0.94);
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.animate-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.animate-bounce {
  animation: bounce 0.4s infinite;
}
</style>
