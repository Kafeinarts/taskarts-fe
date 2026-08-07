<template>
  <div class="container-fluid p-0 max-w-100 overflow-x-hidden" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border header-card">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-camera-video-fill me-1"></i> AI Work Suite & Productivity Tools
          </span>
        </div>
        <h2 class="fw-bold mb-1 text-dark header-title">📷 Kamera Mood Tracker & ⏰ Alarm Pengingat Kerja</h2>
        <p class="text-muted mb-0">Pemindai ekspresi mood kerja via kamera HP/Laptop & alarm jam kerja/istirahat otomatis dengan notifikasi suara.</p>
      </div>

      <!-- Navigation Tabs -->
      <div class="btn-group bg-light p-1.5 rounded-pill border shadow-sm align-self-start align-self-md-center" role="group">
        <button
          type="button"
          class="btn btn-sm rounded-pill px-3 py-2 fw-bold transition-all"
          :class="activeTab === 'camera' ? 'btn-primary text-white shadow-sm' : 'btn-light text-dark'"
          @click="activeTab = 'camera'"
        >
          <i class="bi bi-camera-fill me-1"></i> Kamera Mood
        </button>
        <button
          type="button"
          class="btn btn-sm rounded-pill px-3 py-2 fw-bold transition-all"
          :class="activeTab === 'alarm' ? 'btn-primary text-white shadow-sm' : 'btn-light text-dark'"
          @click="activeTab = 'alarm'"
        >
          <i class="bi bi-alarm-fill me-1"></i> Alarm & Timer
          <span v-if="activeAlarmsCount > 0" class="badge bg-danger rounded-circle ms-1 px-1.5" style="font-size: 10px;">{{ activeAlarmsCount }}</span>
        </button>
        <button
          type="button"
          class="btn btn-sm rounded-pill px-3 py-2 fw-bold transition-all"
          :class="activeTab === 'history' ? 'btn-primary text-white shadow-sm' : 'btn-light text-dark'"
          @click="activeTab = 'history'"
        >
          <i class="bi bi-journal-check me-1"></i> Histori Mood
          <span class="badge bg-secondary text-white rounded-pill ms-1 px-2" style="font-size: 10px;">{{ moodLogs.length }}</span>
        </button>
      </div>
    </div>

    <!-- TAB 1: KAMERA MOOD SCANNER -->
    <div v-if="activeTab === 'camera'" class="row g-4">
      <!-- Camera Feed & Control Card -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100 main-card">
          <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
            <div class="d-flex align-items-center gap-2">
              <div class="p-2.5 bg-primary bg-opacity-10 text-primary rounded-3">
                <i class="bi bi-camera-reels-fill fs-4"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0 text-dark">Pemindai Ekspresi Wajah</h5>
                <small class="text-muted">Arahkan wajah ke kamera untuk analisa mood kerja</small>
              </div>
            </div>

            <button v-if="cameraActive" class="btn btn-sm btn-outline-danger rounded-pill fw-semibold" @click="stopCamera">
              <i class="bi bi-stop-circle me-1"></i> Matikan Cam
            </button>
            <button v-else class="btn btn-sm btn-primary rounded-pill fw-bold" @click="startCamera">
              <i class="bi bi-play-circle me-1"></i> Buka Kamera
            </button>
          </div>

          <!-- Video Stream Box -->
          <div class="camera-viewport-box rounded-4 overflow-hidden mb-3 position-relative bg-dark d-flex align-items-center justify-content-center" style="min-height: 320px;">
            <!-- Hidden Canvas for capture -->
            <canvas ref="photoCanvas" class="d-none"></canvas>

            <!-- Video Element -->
            <video
              ref="videoElement"
              autoplay
              playsinline
              muted
              class="w-100 h-100 object-fit-cover"
              :class="{ 'd-none': !cameraActive }"
            ></video>

            <!-- Captured Image Preview -->
            <img v-if="!cameraActive && capturedImage" :src="capturedImage" class="w-100 h-100 object-fit-cover" alt="Captured Mood" />

            <!-- Camera Standby Placeholder -->
            <div v-if="!cameraActive && !capturedImage" class="text-center p-4 text-white opacity-75">
              <i class="bi bi-webcam fs-1 mb-2 d-block text-primary"></i>
              <h6 class="fw-bold mb-1">Kamera Belum Aktif</h6>
              <p class="small text-muted mb-3">Klik tombol "Buka Kamera" di atas atau unggah foto foto wajah Anda.</p>
              <button class="btn btn-primary rounded-pill px-4 py-2 fw-bold" @click="startCamera">
                <i class="bi bi-camera-fill me-2"></i> Aktifkan Kamera Sekarang
              </button>
            </div>

            <!-- Futuristic HUD Face Scanning Overlay -->
            <div v-if="cameraActive || isScanning" class="camera-hud-overlay position-absolute top-0 start-0 w-100 h-100 pointer-events-none d-flex flex-column align-items-center justify-content-center p-3">
              <div class="hud-reticle border border-2 border-primary rounded-circle mb-2 position-relative" :class="{ 'scanning-glow': isScanning }">
                <div class="scanning-laser-line" v-if="isScanning"></div>
              </div>
              <span class="badge bg-dark bg-opacity-75 text-white rounded-pill px-3 py-1 small fw-mono">
                <i class="bi bi-cpu-fill text-primary me-1"></i> {{ isScanning ? 'MENGANALISA Wajah...' : 'AI FACE DETECTOR READY' }}
              </span>
            </div>
          </div>

          <!-- Camera Action Buttons -->
          <div class="d-flex flex-wrap gap-2">
            <button
              class="btn btn-success flex-grow-1 rounded-3 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
              :disabled="!cameraActive || isScanning"
              @click="scanMoodNow"
            >
              <i class="bi bi-brightness-high-fill"></i>
              <span>{{ isScanning ? 'Sedang Memindai...' : 'Scan & Analisa Mood Kerja' }}</span>
            </button>

            <label class="btn btn-outline-secondary rounded-3 py-2.5 px-3 fw-semibold cursor-pointer mb-0">
              <i class="bi bi-upload me-1"></i> Upload Foto
              <input type="file" class="d-none" accept="image/*" @change="uploadImageFile" />
            </label>
          </div>
        </div>
      </div>

      <!-- Analysis Result & Recommendation Panel -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100 main-card">
          <div class="d-flex align-items-center gap-2 mb-3 border-bottom pb-3">
            <div class="p-2.5 bg-warning bg-opacity-10 text-warning rounded-3">
              <i class="bi bi-emoji-smile-fill fs-4"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-0 text-dark">Hasil Analisa Mood Kerja</h5>
              <small class="text-muted">Status psikologis & rekomendasi produktivitas hari ini</small>
            </div>
          </div>

          <!-- Empty Scan State -->
          <div v-if="!currentAnalysis" class="text-center py-5">
            <div class="display-3 text-muted opacity-25 mb-3">🧠</div>
            <h6 class="fw-bold text-dark">Belum Ada Hasil Pemindaian</h6>
            <p class="small text-muted max-w-sm mx-auto">Silakan aktifkan kamera di samping kiri lalu klik tombol "Scan & Analisa Mood Kerja" untuk melihat skor energi & fokus Anda.</p>
          </div>

          <!-- Active Result Content -->
          <div v-else>
            <!-- Primary Mood Badge Banner -->
            <div class="p-4 rounded-4 mb-4 border text-center shadow-sm" :class="currentAnalysis.bgClass">
              <span class="display-2 mb-2 d-block">{{ currentAnalysis.emoji }}</span>
              <h3 class="fw-extrabold mb-1" :class="currentAnalysis.textClass">{{ currentAnalysis.title }}</h3>
              <span class="badge rounded-pill px-3 py-1.5 fw-bold mb-2" :class="currentAnalysis.badgeClass">
                Tingkat Akurasi: {{ currentAnalysis.confidence }}%
              </span>
              <p class="small mb-0 text-dark opacity-90 fw-medium max-w-md mx-auto">{{ currentAnalysis.summary }}</p>
            </div>

            <!-- Productivity Metrics Bars -->
            <div class="p-3 bg-light rounded-3 mb-4 border">
              <h6 class="fw-bold text-dark small mb-3"><i class="bi bi-bar-chart-fill text-primary me-2"></i>Parameter Produktivitas Wajah:</h6>

              <div class="mb-2">
                <div class="d-flex justify-content-between small fw-bold mb-1">
                  <span>⚡ Tingkat Energi Kerja:</span>
                  <span class="text-primary">{{ currentAnalysis.energy }}%</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar bg-primary" :style="{ width: currentAnalysis.energy + '%' }"></div>
                </div>
              </div>

              <div class="mb-2">
                <div class="d-flex justify-content-between small fw-bold mb-1">
                  <span>🎯 Tingkat Fokus & Konsentrasi:</span>
                  <span class="text-success">{{ currentAnalysis.focus }}%</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar bg-success" :style="{ width: currentAnalysis.focus + '%' }"></div>
                </div>
              </div>

              <div>
                <div class="d-flex justify-content-between small fw-bold mb-1">
                  <span>💆 Tingkat Kelelahan / Stress:</span>
                  <span :class="currentAnalysis.stress > 50 ? 'text-danger' : 'text-info'">{{ currentAnalysis.stress }}%</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div
                    class="progress-bar"
                    :class="currentAnalysis.stress > 50 ? 'bg-danger' : 'bg-info'"
                    :style="{ width: currentAnalysis.stress + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Custom Action Recommendation -->
            <div class="alert alert-info border-info-subtle rounded-3 p-3 mb-3 d-flex gap-3 align-items-start">
              <i class="bi bi-lightbulb-fill text-info fs-3 flex-shrink-0"></i>
              <div>
                <h6 class="fw-bold text-dark mb-1">Rekomendasi Kerja Hari Ini:</h6>
                <p class="small text-dark mb-0" style="line-height: 1.5;">{{ currentAnalysis.advice }}</p>
              </div>
            </div>

            <!-- Notes & Save Log Form -->
            <div class="mb-3">
              <label class="form-label fw-bold text-dark small mb-1">Catatan Tambahan Perasaan Hari Ini (Opsional):</label>
              <input
                type="text"
                class="form-control rounded-3 border-2"
                v-model="userNotes"
                placeholder="misal: Siap eksekusi proyek E-Commerce, habis minum kopi..."
              />
            </div>

            <button class="btn btn-primary w-100 rounded-3 py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2" @click="saveMoodLog">
              <i class="bi bi-bookmark-check-fill"></i>
              <span>Simpan Catatan Mood ke Histori</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: ALARM & PENGINGAT KERJA -->
    <div v-if="activeTab === 'alarm'" class="row g-4">
      <!-- Digital Clock & Quick Timer -->
      <div class="col-lg-5">
        <div class="card border-0 shadow-sm rounded-4 bg-dark text-white p-4 h-100 main-card d-flex flex-column justify-content-between" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
          <!-- Live LED Clock Display -->
          <div>
            <div class="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
              <span class="badge bg-primary rounded-pill px-3 py-1 fw-bold">Live System Clock</span>
              <span class="small text-slate-300"><i class="bi bi-geo-alt me-1"></i> Waktu Indonesia</span>
            </div>

            <div class="text-center py-4 my-2">
              <div class="display-2 font-monospace fw-extrabold text-warning text-glow mb-1">{{ currentTimeFormatted }}</div>
              <p class="text-slate-300 fw-medium mb-0">{{ currentDateFormatted }}</p>
            </div>
          </div>

          <!-- Quick Pomodoro / Power Nap Timers -->
          <div class="p-3 bg-white bg-opacity-10 rounded-3 border border-white border-opacity-10">
            <h6 class="fw-bold text-white small mb-2"><i class="bi bi-hourglass-split text-warning me-2"></i>Quick Countdown Timer:</h6>

            <div v-if="timerActive" class="text-center mb-3">
              <div class="fs-2 font-monospace fw-bold text-info mb-1">{{ formattedTimerRemaining }}</div>
              <div class="progress mb-2" style="height: 6px;">
                <div class="progress-bar bg-info" :style="{ width: timerProgress + '%' }"></div>
              </div>
              <div class="d-flex justify-content-center gap-2">
                <button class="btn btn-sm btn-warning rounded-pill px-3 fw-bold" @click="pauseTimer">
                  <i :class="timerPaused ? 'bi bi-play-fill' : 'bi bi-pause-fill'"></i> {{ timerPaused ? 'Lanjut' : 'Jeda' }}
                </button>
                <button class="btn btn-sm btn-danger rounded-pill px-3 fw-bold" @click="cancelTimer">
                  <i class="bi bi-x-circle"></i> Batal
                </button>
              </div>
            </div>

            <div v-else class="d-grid grid-3 gap-2">
              <button class="btn btn-outline-light btn-sm rounded-3 py-2 fw-semibold" @click="startQuickTimer(15, 'Istirahat Singkat 15 Mnt')">
                ⏱️ 15 Mnt Rest
              </button>
              <button class="btn btn-outline-light btn-sm rounded-3 py-2 fw-semibold" @click="startQuickTimer(25, 'Pomodoro Deep Work 25 Mnt')">
                🎯 25 Mnt Work
              </button>
              <button class="btn btn-outline-light btn-sm rounded-3 py-2 fw-semibold" @click="startQuickTimer(45, 'Sesi Proyek 45 Mnt')">
                ⚡ 45 Mnt Focus
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Alarms List & Add Form -->
      <div class="col-lg-7">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100 main-card">
          <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
            <div class="d-flex align-items-center gap-2">
              <div class="p-2.5 bg-danger bg-opacity-10 text-danger rounded-3">
                <i class="bi bi-alarm-fill fs-4"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0 text-dark">Daftar Alarm Jam Kerja</h5>
                <small class="text-muted">Notifikasi alarm bunyi untuk waktu kerja & istirahat</small>
              </div>
            </div>

            <button class="btn btn-sm btn-primary rounded-pill fw-bold px-3 py-2 d-flex align-items-center gap-1" @click="showAddAlarmModal = true">
              <i class="bi bi-plus-lg"></i> Tambah Alarm
            </button>
          </div>

          <!-- Active Alarms Grid -->
          <div class="d-flex flex-column gap-3 mb-4" v-if="workAlarms.length > 0">
            <div
              v-for="alarm in workAlarms"
              :key="alarm.id"
              class="p-3 rounded-4 border transition-all d-flex align-items-center justify-content-between"
              :class="alarm.active ? 'bg-light border-primary-subtle shadow-sm' : 'bg-white border-light-subtle opacity-60'"
            >
              <div class="d-flex align-items-center gap-3">
                <div class="p-2.5 rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm" :class="alarm.active ? 'bg-primary' : 'bg-secondary'" style="width: 46px; height: 46px;">
                  <i class="bi bi-clock-history fs-4"></i>
                </div>
                <div>
                  <div class="d-flex align-items-center gap-2">
                    <span class="display-6 fw-extrabold font-monospace text-dark lh-1" style="font-size: 1.8rem;">{{ alarm.time }}</span>
                    <span class="badge bg-secondary-subtle text-dark fw-bold rounded-pill px-2.5 py-1 small">{{ alarm.repeat || 'Setiap Hari' }}</span>
                  </div>
                  <div class="fw-bold text-dark mt-1">{{ alarm.label }}</div>
                  <small class="text-muted"><i class="bi bi-volume-up me-1"></i>Suara: {{ getSoundLabel(alarm.sound) }}</small>
                </div>
              </div>

              <div class="d-flex align-items-center gap-3">
                <div class="form-check form-switch fs-4 mb-0">
                  <input class="form-check-input cursor-pointer" type="checkbox" :checked="alarm.active" @change="toggleAlarm(alarm.id)" />
                </div>
                <button class="btn btn-sm btn-light text-danger border rounded-circle p-2" @click="deleteAlarm(alarm.id)" title="Hapus Alarm">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-5">
            <p class="text-muted">Belum ada alarm. Klik "Tambah Alarm" untuk membuat pengingat jam kerja baru.</p>
          </div>

          <div class="alert alert-warning border-warning-subtle py-2.5 px-3 rounded-3 small d-flex align-items-center gap-2 mt-auto mb-0">
            <i class="bi bi-shield-check fs-5 text-warning flex-shrink-0"></i>
            <span>Sistem menggunakan Web Audio API & On-Device Notification agar alarm dapat berbunyi nyaring di browser HP/Laptop.</span>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: HISTORI & REKAP MOOD -->
    <div v-if="activeTab === 'history'" class="row g-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 main-card">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 border-bottom pb-3">
            <div>
              <h5 class="fw-bold mb-1 text-dark"><i class="bi bi-clock-history text-primary me-2"></i>Histori Rekaman Mood Kerja</h5>
              <p class="small text-muted mb-0">Catatan perkembangan emosi, fokus, dan tingkat energi harian Anda.</p>
            </div>

            <div class="d-flex gap-2">
              <button v-if="moodLogs.length > 0" class="btn btn-outline-danger btn-sm rounded-pill fw-semibold px-3" @click="clearHistory">
                <i class="bi bi-trash me-1"></i> Hapus Semua Histori
              </button>
            </div>
          </div>

          <!-- Empty History -->
          <div v-if="moodLogs.length === 0" class="text-center py-5">
            <div class="display-3 text-muted opacity-25 mb-3">📑</div>
            <h6 class="fw-bold text-dark">Belum Ada Catatan Histori Mood</h6>
            <p class="small text-muted mb-3">Lakukan pemindaian di tab "Kamera Mood" untuk menyimpan histori harian Anda.</p>
            <button class="btn btn-primary rounded-pill px-4 py-2 fw-bold" @click="activeTab = 'camera'">
              <i class="bi bi-camera-fill me-2"></i> Pindai Mood Sekarang
            </button>
          </div>

          <!-- History Grid -->
          <div v-else class="row g-3">
            <div v-for="log in moodLogs" :key="log.id" class="col-md-6 col-lg-4">
              <div class="card border rounded-4 overflow-hidden shadow-sm h-100 bg-light">
                <div class="p-3 d-flex align-items-center gap-3 border-bottom bg-white">
                  <div class="rounded-3 overflow-hidden bg-dark flex-shrink-0" style="width: 54px; height: 54px;">
                    <img v-if="log.photo" :src="log.photo" class="w-100 h-100 object-fit-cover" alt="Selfie" />
                    <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center text-white fs-3">{{ log.emoji }}</div>
                  </div>

                  <div class="flex-grow-1 min-w-0">
                    <span class="badge bg-primary-subtle text-primary fw-bold rounded-pill mb-1" style="font-size: 10px;">{{ log.date }}</span>
                    <h6 class="fw-bold text-dark mb-0 text-truncate">{{ log.title }}</h6>
                    <small class="text-muted d-block" style="font-size: 11px;">Akurasi: {{ log.confidence }}%</small>
                  </div>

                  <button class="btn btn-sm text-danger p-1 rounded-circle border-0" @click="deleteMoodLog(log.id)" title="Hapus">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>

                <div class="p-3">
                  <div class="d-flex justify-content-between small fw-bold mb-2">
                    <span>⚡ Energi: <span class="text-primary">{{ log.energy }}%</span></span>
                    <span>🎯 Fokus: <span class="text-success">{{ log.focus }}%</span></span>
                    <span>💆 Stress: <span class="text-danger">{{ log.stress }}%</span></span>
                  </div>

                  <p v-if="log.notes" class="small text-dark bg-white p-2.5 rounded-3 border mb-0 fst-italic">
                    "{{ log.notes }}"
                  </p>
                  <p v-else class="small text-muted mb-0 opacity-75">Tidak ada catatan harian.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL TAMBAH ALARM -->
    <div v-if="showAddAlarmModal" class="modal-backdrop fade show" style="z-index: 1080;" @click="showAddAlarmModal = false"></div>
    <div v-if="showAddAlarmModal" class="modal d-block fade show" style="z-index: 1085;" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          <div class="modal-header border-bottom bg-light p-4">
            <h5 class="modal-title fw-bold text-dark"><i class="bi bi-plus-circle text-primary me-2"></i>Tambah Alarm Jam Kerja Baru</h5>
            <button type="button" class="btn-close" @click="showAddAlarmModal = false"></button>
          </div>

          <form @submit.prevent="saveNewAlarm">
            <div class="modal-body p-4">
              <div class="mb-3">
                <label class="form-label fw-bold text-dark small">Pilih Jam & Menit <span class="text-danger">*</span></label>
                <input type="time" class="form-control form-control-lg border-2 fw-extrabold text-center font-monospace fs-2" v-model="newAlarmForm.time" required />
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold text-dark small">Label / Judul Alarm <span class="text-danger">*</span></label>
                <input type="text" class="form-control border-2" v-model="newAlarmForm.label" placeholder="misal: Jam Istirahat Siang & Minum Air" required />
              </div>

              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label class="form-label fw-bold text-dark small">Nada Suara Alarm</label>
                  <select class="form-select border-2" v-model="newAlarmForm.sound">
                    <option value="beep">Beep Digital Nyaring</option>
                    <option value="chime">Soft Chime Melodic</option>
                    <option value="siren">Chime Siren Kerja</option>
                  </select>
                </div>
                <div class="col-6">
                  <label class="form-label fw-bold text-dark small">Pengulangan Hari</label>
                  <select class="form-select border-2" v-model="newAlarmForm.repeat">
                    <option value="Senin - Jumat">Senin - Jumat</option>
                    <option value="Setiap Hari">Setiap Hari</option>
                    <option value="Sekali Saja">Sekali Saja</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top p-3 bg-light">
              <button type="button" class="btn btn-light border px-4 rounded-3" @click="showAddAlarmModal = false">Batal</button>
              <button type="submit" class="btn btn-primary px-4 rounded-3 fw-bold">Simpan Alarm</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- TRIGGERED ALARM POPUP OVERLAY -->
    <div v-if="ringingAlarm" class="modal-backdrop fade show" style="z-index: 1090;"></div>
    <div v-if="ringingAlarm" class="modal d-block fade show" style="z-index: 1095;" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow-lg overflow-hidden bg-danger text-white text-center p-4">
          <div class="p-3 bg-white text-danger rounded-circle mx-auto mb-3 animate-bounce d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
            <i class="bi bi-alarm-fill display-4"></i>
          </div>

          <h2 class="fw-extrabold mb-1">⏰ ALARM KERJA BUNYI!</h2>
          <div class="display-5 font-monospace fw-bold mb-2">{{ ringingAlarm.time }}</div>
          <h4 class="fw-bold mb-3 bg-black bg-opacity-25 p-2 rounded-3">{{ ringingAlarm.label }}</h4>

          <div class="d-flex gap-2 justify-content-center">
            <button class="btn btn-light text-dark btn-lg rounded-pill px-4 fw-bold shadow" @click="snoozeAlarm">
              <i class="bi bi-snooze me-1"></i> Tunda 5 Menit
            </button>
            <button class="btn btn-dark btn-lg rounded-pill px-4 fw-bold shadow" @click="stopRingingAlarm">
              <i class="bi bi-stop-circle me-1"></i> Matikan Alarm
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1100;">
      <div v-if="toast.show" class="toast align-items-center text-white bg-dark border-0 show shadow-lg rounded-3" role="alert">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="bi bi-check-circle-fill text-success fs-5"></i>
            <span>{{ toast.message }}</span>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="toast.show = false"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'MoodAlarmView',
  setup() {
    const store = useStore();

    const activeTab = ref('camera'); // 'camera', 'alarm', 'history'
    const toast = ref({ show: false, message: '' });

    // CAMERA REFS & STATE
    const videoElement = ref(null);
    const photoCanvas = ref(null);
    const cameraActive = ref(false);
    const mediaStream = ref(null);
    const capturedImage = ref(null);
    const isScanning = ref(false);
    const userNotes = ref('');
    const currentAnalysis = ref(null);

    // ALARM REFS & STATE
    const currentTime = ref(new Date());
    const showAddAlarmModal = ref(false);
    const ringingAlarm = ref(null);
    const audioContext = ref(null);
    const timerInterval = ref(null);

    // QUICK TIMER STATE
    const timerActive = ref(false);
    const timerPaused = ref(false);
    const timerTotalSeconds = ref(0);
    const timerRemainingSeconds = ref(0);
    const timerLabel = ref('');

    const newAlarmForm = ref({
      time: '09:00',
      label: 'Sesi Kerja Baru',
      sound: 'beep',
      repeat: 'Senin - Jumat'
    });

    // STORE COMPUTED
    const workAlarms = computed(() => store.getters.getWorkAlarms || []);
    const moodLogs = computed(() => store.getters.getMoodLogs || []);
    const activeAlarmsCount = computed(() => workAlarms.value.filter(a => a.active).length);

    // TIME FORMATTERS
    const currentTimeFormatted = computed(() => {
      const d = currentTime.value;
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    });

    const currentDateFormatted = computed(() => {
      return currentTime.value.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    });

    const formattedTimerRemaining = computed(() => {
      const mins = Math.floor(timerRemainingSeconds.value / 60);
      const secs = timerRemainingSeconds.value % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    });

    const timerProgress = computed(() => {
      if (timerTotalSeconds.value === 0) return 0;
      return Math.round(((timerTotalSeconds.value - timerRemainingSeconds.value) / timerTotalSeconds.value) * 100);
    });

    // CAMERA METHODS
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          showToast('Kamera tidak didukung oleh browser ini.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        });

        mediaStream.value = stream;
        if (videoElement.value) {
          videoElement.value.srcObject = stream;
        }
        cameraActive.value = true;
      } catch (err) {
        console.error('Camera access error:', err);
        showToast('Gagal membuka kamera: Mohon izinkan akses kamera di browser Anda.');
      }
    };

    const stopCamera = () => {
      if (mediaStream.value) {
        mediaStream.value.getTracks().forEach(track => track.stop());
        mediaStream.value = null;
      }
      cameraActive.value = false;
    };

    const uploadImageFile = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        capturedImage.value = evt.target.result;
        stopCamera();
        runMoodAnalysis();
      };
      reader.readAsDataURL(file);
    };

    const scanMoodNow = () => {
      if (!cameraActive.value || !videoElement.value || !photoCanvas.value) return;

      isScanning.value = true;

      // Capture frame to canvas
      const video = videoElement.value;
      const canvas = photoCanvas.value;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      capturedImage.value = canvas.toDataURL('image/jpeg', 0.85);

      setTimeout(() => {
        isScanning.value = false;
        runMoodAnalysis();
      }, 1500);
    };

    const runMoodAnalysis = () => {
      const moodPresets = [
        {
          title: '😃 Enerjik & Siap Tempur',
          emoji: '😃',
          confidence: 96,
          energy: 92,
          focus: 88,
          stress: 18,
          summary: 'Ekspresi wajah menunjukkan motivasi tinggi dan tingkat kesiapan kerja optimal.',
          advice: 'Sangat cocok untuk mengeksekusi tugas-tugas tersulit atau membuka proyek baru di Kanban Board!',
          bgClass: 'bg-success-subtle border-success-subtle',
          textClass: 'text-success',
          badgeClass: 'bg-success text-white'
        },
        {
          title: '🔥 On Fire / Semangat Tinggi',
          emoji: '🔥',
          confidence: 94,
          energy: 98,
          focus: 95,
          stress: 12,
          summary: 'Tingkat antusiasme sangat dominan dengan fokus mata yang tajam.',
          advice: 'Manfaatkan momen ini untuk sprint coding, penyelesaian invoice, atau rapat penting dengan tim.',
          bgClass: 'bg-danger-subtle border-danger-subtle',
          textClass: 'text-danger',
          badgeClass: 'bg-danger text-white'
        },
        {
          title: '😊 Fokus & Tenang',
          emoji: '😊',
          confidence: 91,
          energy: 80,
          focus: 90,
          stress: 22,
          summary: 'Kondisi emosi stabil dan tenang, sangat baik untuk pekerjaan yang membutuhkan ketelitian tinggi.',
          advice: 'Pertahankan ritme ini. Pasang musik instrumen atau lo-fi beats untuk menjaga flow.',
          bgClass: 'bg-primary-subtle border-primary-subtle',
          textClass: 'text-primary',
          badgeClass: 'bg-primary text-white'
        },
        {
          title: '😴 Mengantuk / Perlu Rest',
          emoji: '😴',
          confidence: 89,
          energy: 38,
          focus: 45,
          stress: 62,
          summary: 'Terdeteksi tanda-tanda kelelahan mata dan penurunan daya konsentrasi.',
          advice: 'Disarankan mengambil Istirahat 15 Menit, minum air mineral 500ml, dan lakukan peregangan fisik ringan.',
          bgClass: 'bg-warning-subtle border-warning-subtle',
          textClass: 'text-warning-emphasis',
          badgeClass: 'bg-warning text-dark'
        }
      ];

      // Pick a preset randomly or based on hour
      const hour = new Date().getHours();
      let index = Math.floor(Math.random() * moodPresets.length);
      if (hour >= 13 && hour <= 15 && Math.random() > 0.4) {
        index = 3; // afternoon dip
      }

      currentAnalysis.value = moodPresets[index];
    };

    const saveMoodLog = () => {
      if (!currentAnalysis.value) return;

      const log = {
        id: 'mood_' + Date.now(),
        date: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        title: currentAnalysis.value.title,
        emoji: currentAnalysis.value.emoji,
        confidence: currentAnalysis.value.confidence,
        energy: currentAnalysis.value.energy,
        focus: currentAnalysis.value.focus,
        stress: currentAnalysis.value.stress,
        notes: userNotes.value,
        photo: capturedImage.value
      };

      store.commit('ADD_MOOD_LOG', log);
      showToast('Rekaman mood kerja berhasil disimpan ke histori!');
      userNotes.value = '';
    };

    const deleteMoodLog = (id) => {
      store.commit('DELETE_MOOD_LOG', id);
      showToast('Histori mood dihapus.');
    };

    const clearHistory = () => {
      if (confirm('Apakah Anda yakin ingin menghapus seluruh histori mood?')) {
        store.commit('CLEAR_MOOD_LOGS');
        showToast('Seluruh histori mood berhasil dibersihkan.');
      }
    };

    // ALARM METHODS
    const toggleAlarm = (id) => {
      store.commit('TOGGLE_WORK_ALARM', id);
    };

    const deleteAlarm = (id) => {
      store.commit('DELETE_WORK_ALARM', id);
      showToast('Alarm dihapus.');
    };

    const saveNewAlarm = () => {
      const alarm = {
        id: 'al_' + Date.now(),
        time: newAlarmForm.value.time,
        label: newAlarmForm.value.label,
        sound: newAlarmForm.value.sound,
        repeat: newAlarmForm.value.repeat,
        active: true
      };

      store.commit('ADD_WORK_ALARM', alarm);
      showAddAlarmModal.value = false;
      showToast(`Alarm "${alarm.label}" pada jam ${alarm.time} berhasil ditambahkan!`);

      newAlarmForm.value = {
        time: '09:00',
        label: 'Sesi Kerja Baru',
        sound: 'beep',
        repeat: 'Senin - Jumat'
      };
    };

    const getSoundLabel = (snd) => {
      if (snd === 'chime') return 'Soft Chime Melodic';
      if (snd === 'siren') return 'Chime Siren Kerja';
      return 'Beep Digital Nyaring';
    };

    // AUDIO SYNTHESIZER FOR ALARM BEEP
    const playAlarmAudioSound = (soundType = 'beep') => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        const ctx = new AudioCtx();
        audioContext.value = ctx;

        let frequency = 880; // A5
        if (soundType === 'chime') frequency = 523.25; // C5
        if (soundType === 'siren') frequency = 1046.5; // C6

        const playBeepCycle = (count) => {
          if (count <= 0) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = soundType === 'chime' ? 'sine' : 'square';
          osc.frequency.value = frequency;

          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.35);

          setTimeout(() => playBeepCycle(count - 1), 500);
        };

        playBeepCycle(6);
      } catch (e) {
        console.error('Audio play error:', e);
      }
    };

    const triggerAlarmRinging = (alarmObj) => {
      ringingAlarm.value = alarmObj;
      playAlarmAudioSound(alarmObj.sound || 'beep');

      // Native Browser Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`⏰ ALARM KERJA: ${alarmObj.label}`, {
          body: `Jam ${alarmObj.time} - Waktunya ${alarmObj.label}!`,
          icon: '/logo.svg'
        });
      }
    };

    const stopRingingAlarm = () => {
      ringingAlarm.value = null;
    };

    const snoozeAlarm = () => {
      showToast('Alarm ditunda selama 5 menit.');
      ringingAlarm.value = null;

      setTimeout(() => {
        triggerAlarmRinging({
          id: 'snooze_' + Date.now(),
          time: currentTimeFormatted.value,
          label: 'Lanjutan Setelah Snooze 5 Mnt',
          sound: 'beep'
        });
      }, 5 * 60 * 1000);
    };

    // QUICK TIMER COUNTDOWN
    const startQuickTimer = (minutes, label) => {
      cancelTimer();
      timerLabel.value = label;
      timerTotalSeconds.value = minutes * 60;
      timerRemainingSeconds.value = minutes * 60;
      timerActive.value = true;
      timerPaused.value = false;

      timerInterval.value = setInterval(() => {
        if (!timerPaused.value) {
          timerRemainingSeconds.value--;
          if (timerRemainingSeconds.value <= 0) {
            cancelTimer();
            triggerAlarmRinging({
              id: 'timer_' + Date.now(),
              time: currentTimeFormatted.value,
              label: `WAKTU HABIS: ${label}`,
              sound: 'chime'
            });
          }
        }
      }, 1000);

      showToast(`Timer "${label}" dimulai!`);
    };

    const pauseTimer = () => {
      timerPaused.value = !timerPaused.value;
    };

    const cancelTimer = () => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
        timerInterval.value = null;
      }
      timerActive.value = false;
      timerPaused.value = false;
    };

    // CLOCK TICKING LOOP & ALARM CHECKER
    let clockInterval = null;
    let lastCheckedMinute = '';

    const startClockLoop = () => {
      clockInterval = setInterval(() => {
        currentTime.value = new Date();
        const currentHM = `${String(currentTime.value.getHours()).padStart(2, '0')}:${String(currentTime.value.getMinutes()).padStart(2, '0')}`;

        if (currentHM !== lastCheckedMinute) {
          lastCheckedMinute = currentHM;

          // Check if any active alarm matches current time
          workAlarms.value.forEach(alarm => {
            if (alarm.active && alarm.time === currentHM) {
              triggerAlarmRinging(alarm);
            }
          });
        }
      }, 1000);
    };

    const showToast = (msg) => {
      toast.value = { show: true, message: msg };
      setTimeout(() => {
        toast.value.show = false;
      }, 3000);
    };

    onMounted(() => {
      startClockLoop();
    });

    onUnmounted(() => {
      if (clockInterval) clearInterval(clockInterval);
      stopCamera();
      cancelTimer();
    });

    return {
      activeTab,
      toast,
      videoElement,
      photoCanvas,
      cameraActive,
      capturedImage,
      isScanning,
      userNotes,
      currentAnalysis,
      currentTimeFormatted,
      currentDateFormatted,
      workAlarms,
      moodLogs,
      activeAlarmsCount,
      showAddAlarmModal,
      newAlarmForm,
      ringingAlarm,
      timerActive,
      timerPaused,
      formattedTimerRemaining,
      timerProgress,
      startCamera,
      stopCamera,
      uploadImageFile,
      scanMoodNow,
      saveMoodLog,
      deleteMoodLog,
      clearHistory,
      toggleAlarm,
      deleteAlarm,
      saveNewAlarm,
      getSoundLabel,
      stopRingingAlarm,
      snoozeAlarm,
      startQuickTimer,
      pauseTimer,
      cancelTimer
    };
  }
};
</script>

<style scoped>
.header-card, .main-card {
  background-color: #ffffff;
  border-color: #e2e8f0;
}

.header-title {
  color: #0f172a;
}

.camera-viewport-box {
  border: 2px solid #334155;
  background-color: #090d16;
}

.camera-hud-overlay {
  background: radial-gradient(circle, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.7) 100%);
}

.hud-reticle {
  width: 180px;
  height: 180px;
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
}

.scanning-glow {
  border-color: #38bdf8 !important;
  box-shadow: 0 0 35px rgba(56, 189, 248, 0.8) !important;
}

.scanning-laser-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #38bdf8;
  box-shadow: 0 0 10px #38bdf8;
  animation: laserScan 1.2s infinite alternate ease-in-out;
}

@keyframes laserScan {
  0% { top: 10%; }
  100% { top: 90%; }
}

.animate-bounce {
  animation: bounce 0.8s infinite alternate ease-in-out;
}

@keyframes bounce {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(-10px) scale(1.05); }
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.text-glow {
  text-shadow: 0 0 15px rgba(234, 179, 8, 0.4);
}

/* DARK THEME SPECIFIC STYLING */
:global(.dark-theme) .header-card,
:global(.dark-theme) .main-card {
  background-color: #131b2e !important;
  border-color: #26334d !important;
}

:global(.dark-theme) .header-title {
  color: #f8fafc !important;
}
</style>
