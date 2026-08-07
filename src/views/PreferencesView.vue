<template>
  <div class="container-fluid p-0 max-w-100 overflow-x-hidden">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-primary-subtle text-primary fw-semibold px-3 py-1.5 rounded-pill">App Preferences, PWA & Data Management</span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">⚙️ Preferences & Setelan Perangkat</h2>
        <p class="text-muted mb-0">Atur instalasi aplikasi di HP Android/iOS, notifikasi sistem, backup & recovery JSON, serta tema warna aksen.</p>
      </div>
    </div>

    <div class="row g-4">
      <!-- PWA Android / Mobile Device Installation Card (HITAM PEKAT & CLEAR) -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-lg rounded-4 text-white p-4 h-100 pwa-pure-black-card" style="background-color: #000000 !important; border: 1px solid #334155 !important;">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="bg-primary rounded-3 p-3 text-white d-flex align-items-center justify-content-center shadow" style="width: 52px; height: 52px;">
              <i class="bi bi-phone-vibrate-fill fs-2"></i>
            </div>
            <div>
              <h5 class="fw-extrabold mb-1 text-white fs-5" style="letter-spacing: -0.2px;">Install to Your Device (Android / iOS)</h5>
              <p class="small text-light fw-medium mb-0" style="color: #f1f5f9 !important; font-size: 0.88rem;">Pasang aplikasi di layar utama HP agar berjalan layaknya aplikasi native Android.</p>
            </div>
          </div>

          <div class="p-3 rounded-3 mb-3 border" style="background-color: #111827 !important; border-color: #374151 !important;">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="small fw-bold text-white">Status PWA Perangkat:</span>
              <span v-if="isStandalone" class="badge bg-success text-white rounded-pill px-3 py-1.5 fw-extrabold shadow-sm fs-6">✓ Terpasang (Standalone App)</span>
              <span v-else-if="canInstallPwa" class="badge bg-warning text-dark rounded-pill px-3 py-1.5 fw-extrabold shadow-sm fs-6">⚡ Siap Di-install</span>
              <span v-else class="badge bg-primary text-white rounded-pill px-3 py-1.5 fw-extrabold fs-6">PWA Ready</span>
            </div>
            <p class="small text-white mb-0 fw-normal" style="color: #e2e8f0 !important; line-height: 1.5;">
              Aplikasi ini dilengkapi Service Worker PWA & Web Manifest agar cepat dibuka dan bekerja secara offline di HP Anda.
            </p>
          </div>

          <button v-if="canInstallPwa" @click="triggerPwaInstall" class="btn btn-success btn-lg w-100 rounded-pill fw-extrabold shadow mb-3 d-flex align-items-center justify-content-center gap-2 py-3 fs-6">
            <i class="bi bi-download fs-5"></i> Install RajinKerja ke HP / Device
          </button>
          <div v-else class="mb-3 p-3 rounded-3" style="background-color: #0f172a !important; border: 1px solid #1e293b !important;">
            <div class="small fw-bold mb-2 text-warning fs-6" style="color: #fef08a !important;">
              <i class="bi bi-info-circle-fill me-1"></i>Cara Manual Tambahkan ke Layar HP:
            </div>
            <ol class="small text-white mb-0 ps-3 fw-medium" style="color: #f8fafc !important; line-height: 1.6;">
              <li class="mb-1">Di Google Chrome Android: Klik ikon titik tiga <strong style="color: #fef08a;">(⋮)</strong> di sudut kanan atas.</li>
              <li class="mb-1">Pilih menu <strong style="color: #38bdf8;">"Tambahkan ke Layar Utama"</strong> atau <strong style="color: #38bdf8;">"Install Aplikasi"</strong>.</li>
              <li>Aplikasi akan otomatis muncul di app drawer Android Anda.</li>
            </ol>
          </div>

          <div class="mt-auto pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
            <span class="small fw-bold text-white">PWA Manifest & Cache Engine:</span>
            <span class="badge bg-info text-dark rounded-pill px-3 py-1 fw-extrabold">Active v2.5</span>
          </div>
        </div>
      </div>

      <!-- On-Device System Notifications Card -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="bg-primary bg-opacity-10 rounded-3 p-3 text-primary d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="bi bi-bell-fill fs-3"></i>
            </div>
            <div>
              <h5 class="fw-bold text-dark mb-0">Notifikasi On-Device System</h5>
              <small class="text-muted">Pemberitahuan resmi browser & perangkat HP untuk semua aktivitas.</small>
            </div>
          </div>

          <div class="p-3 bg-light rounded-3 mb-3 border">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="fw-semibold text-dark small">Izin Notifikasi HP:</span>
              <span :class="['badge', 'rounded-pill', 'px-3', 'py-1', 'fw-bold', getNotifBadgeClass(notifPermission)]">
                {{ getNotifPermissionLabel(notifPermission) }}
              </span>
            </div>
            <p class="small text-muted mb-0">Notifikasi akan dikirim secara rapi saat Anda menambah tugas, invoice, pindaian kamera, atau menyelesaikan proyek.</p>
          </div>

          <div class="d-flex flex-column gap-2 mb-3">
            <button v-if="notifPermission !== 'granted'" @click="requestNotifPermission" class="btn btn-primary rounded-pill fw-bold py-2.5 d-flex align-items-center justify-content-center gap-2">
              <i class="bi bi-shield-check"></i> Izinkan Notifikasi On-Device
            </button>
            <button @click="testNotif" class="btn btn-outline-primary rounded-pill fw-semibold py-2 d-flex align-items-center justify-content-center gap-2">
              <i class="bi bi-bell-pulse"></i> Uji Coba Kirim Notifikasi Sistem
            </button>
          </div>

          <div class="form-check form-switch pt-2">
            <input class="form-check-input" type="checkbox" id="notifSwitch" v-model="notifEnabled" @change="saveNotifToggle" />
            <label class="form-check-label fw-bold text-dark small" for="notifSwitch">
              Aktifkan sistem notifikasi otomatis di perangkat
            </label>
          </div>
        </div>
      </div>

      <!-- Custom Welcome & Greeting Banner Dashboard Editor Card -->
      <div class="col-lg-12">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div class="d-flex align-items-center gap-3 mb-3 border-bottom pb-3">
            <div class="bg-primary bg-opacity-10 rounded-3 p-3 text-primary d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="bi bi-chat-quote-fill fs-3"></i>
            </div>
            <div>
              <h5 class="fw-bold text-dark mb-0">✏️ Kustomisasi Teks Welcome Banner Dashboard</h5>
              <p class="small text-muted mb-0">Ubah judul ucapan dan teks deskripsi greeting di halaman utama Dashboard sesuai keinginan Anda.</p>
            </div>
          </div>

          <form @submit.prevent="saveWelcomeBannerSettings">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small mb-1">Judul Welcome / Greeting Title</label>
                <input type="text" class="form-control border-2 rounded-3" v-model="welcomeTitleInput" placeholder="misal: Selamat Datang, Rekan Kerja!" />
                <small class="text-muted d-block mt-1" style="font-size: 0.78rem;">
                  Tips: Kata 'Rekan Kerja' akan otomatis diganti nama Anda jika profil terisi.
                </small>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small mb-1">Teks Subtitle / Deskripsi Banner</label>
                <textarea class="form-control border-2 rounded-3" rows="2" v-model="welcomeSubtitleInput" placeholder="Deskripsi ringkas banner..."></textarea>
              </div>
            </div>

            <div class="d-flex justify-content-end gap-2 mt-3 pt-2">
              <button type="button" class="btn btn-outline-secondary rounded-pill px-3 btn-sm" @click="resetWelcomeBannerDefault">
                Reset Teks Standard
              </button>
              <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm py-2">
                <i class="bi bi-check-lg me-1"></i> Simpan Teks Banner
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- AI Integration & API Key Settings Card (Baru) -->
      <div class="col-lg-12">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 border-bottom pb-3">
            <div class="d-flex align-items-center gap-3">
              <div class="p-3 bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px;">
                <i class="bi bi-cpu-fill fs-2"></i>
              </div>
              <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                  <h5 class="fw-extrabold text-dark mb-0 fs-5">🤖 Integrasi AI Engine & API Key</h5>
                  <span v-if="geminiApiKey" class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold">✓ API Key Terhubung</span>
                  <span v-else class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-3 py-1 fw-bold">⚠️ Belum Diisi</span>
                </div>
                <p class="small text-muted mb-0">Tautkan API Key resmi dari <strong>Google Gemini AI</strong> untuk mengaktifkan asisten AI pintar, ringkasan tugas otomatis, dan analisa mood.</p>
              </div>
            </div>

            <a href="https://aistudio.google.com/app/apikey" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill fw-bold px-3 py-2 d-flex align-items-center gap-1.5 align-self-start align-self-md-center">
              <i class="bi bi-box-arrow-up-right"></i> Dapatkan Gemini API Key Gratis
            </a>
          </div>

          <div class="row g-4">
            <!-- Left Side: Form Controls -->
            <div class="col-lg-7">
              <form @submit.prevent="saveAiSettings">
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label fw-bold text-dark small mb-1">Penyedia AI (AI Provider)</label>
                    <select class="form-select border-2 rounded-3" v-model="aiProvider">
                      <option value="gemini">Google Gemini AI (Direkomendasikan)</option>
                      <option value="openai">OpenAI / Custom Endpoint</option>
                      <option value="anthropic">Claude / Anthropic</option>
                    </select>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label fw-bold text-dark small mb-1">Pilihan Model AI</label>
                    <select class="form-select border-2 rounded-3" v-model="aiModel">
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash (Super Cepat & Hemat)</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (Akurasi Tinggi)</option>
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash Experimental</option>
                      <option value="gpt-4o-mini">GPT-4o Mini / Custom</option>
                    </select>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold text-dark small mb-1">Masukkan API Key <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-2"><i class="bi bi-key-fill text-primary"></i></span>
                    <input
                      :type="showApiKey ? 'text' : 'password'"
                      class="form-control border-2 font-monospace"
                      v-model="geminiApiKey"
                      placeholder="misal: AIzaSyD..."
                    />
                    <button class="btn btn-outline-secondary border-2" type="button" @click="showApiKey = !showApiKey" title="Tampilkan/Sembunyikan API Key">
                      <i :class="showApiKey ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                    </button>
                  </div>
                  <small class="text-muted mt-1 d-block" style="font-size: 0.8rem;">API Key disimpan secara aman di penyimpanan lokal browser (localStorage) Anda dan tidak akan pernah dikirim ke server luar selain Google Gemini API.</small>
                </div>

                <!-- Test Result Alert -->
                <div v-if="aiTestResult" class="alert rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between" :class="aiTestResult.success ? 'alert-success border-success-subtle' : 'alert-danger border-danger-subtle'">
                  <div class="d-flex align-items-center gap-2">
                    <i :class="aiTestResult.success ? 'bi bi-check-circle-fill text-success fs-5' : 'bi bi-exclamation-triangle-fill text-danger fs-5'"></i>
                    <span class="small fw-semibold">{{ aiTestResult.message }}</span>
                  </div>
                  <button type="button" class="btn-close" @click="aiTestResult = null"></button>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex flex-wrap gap-2">
                  <button type="button" class="btn btn-outline-primary rounded-3 fw-bold py-2.5 px-4 d-flex align-items-center gap-2" :disabled="isTestingAiKey" @click="testAiConnection">
                    <span v-if="isTestingAiKey" class="spinner-border spinner-border-sm" role="status"></span>
                    <i v-else class="bi bi-broadcast"></i>
                    <span>{{ isTestingAiKey ? 'Menguji Koneksi...' : 'Uji Koneksi API Key' }}</span>
                  </button>

                  <button type="submit" class="btn btn-primary rounded-3 fw-bold py-2.5 px-4 d-flex align-items-center gap-2 shadow-sm">
                    <i class="bi bi-check-lg"></i>
                    <span>Simpan Pengaturan AI</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- Right Side: Features unlocked with AI -->
            <div class="col-lg-5">
              <div class="p-3.5 bg-light rounded-4 border h-100">
                <h6 class="fw-bold text-dark mb-2"><i class="bi bi-stars text-warning me-2"></i>Fitur AI Otomatis yang Diaktifkan:</h6>
                <ul class="list-unstyled mb-0 small text-dark d-flex flex-column gap-2">
                  <li class="d-flex align-items-start gap-2">
                    <i class="bi bi-check-circle-fill text-success mt-0.5 flex-shrink-0"></i>
                    <span><strong>Pemindai Mood Kamera AI:</strong> Analisa gestur wajah & rekomendasi ritme kerja harian.</span>
                  </li>
                  <li class="d-flex align-items-start gap-2">
                    <i class="bi bi-check-circle-fill text-success mt-0.5 flex-shrink-0"></i>
                    <span><strong>Auto-Generate Subtasks:</strong> Pembagian otomatis proyek besar menjadi daftar tugas terperinci di Kanban.</span>
                  </li>
                  <li class="d-flex align-items-start gap-2">
                    <i class="bi bi-check-circle-fill text-success mt-0.5 flex-shrink-0"></i>
                    <span><strong>Smart Invoice Summarizer:</strong> Pembuatan draf deskripsi pekerjaan invoice otomatis untuk klien.</span>
                  </li>
                  <li class="d-flex align-items-start gap-2">
                    <i class="bi bi-check-circle-fill text-success mt-0.5 flex-shrink-0"></i>
                    <span><strong>OCR Scan Kwitansi:</strong> Ekstraksi cepat nominal kwitansi transaksi dari hasil jepretan kamera.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- JSON Backup & Data Recovery Card -->
      <div class="col-lg-12">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div class="d-flex align-items-center gap-3 mb-3 border-bottom pb-3">
            <div class="bg-success bg-opacity-10 rounded-3 p-3 text-success d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="bi bi-database-fill-gear fs-3"></i>
            </div>
            <div>
              <h5 class="fw-bold text-dark mb-0">Backup & Tombol Recovery Data JSON</h5>
              <p class="small text-muted mb-0">Ekspor berkas backup JSON dan manfaatkan fitur pemulihan (recovery) dengan preview detail data.</p>
            </div>
          </div>

          <div class="row g-4">
            <!-- Download Backup -->
            <div class="col-md-5">
              <div class="p-3 bg-light rounded-3 border h-100 d-flex flex-column justify-content-between">
                <div>
                  <h6 class="fw-bold text-dark mb-1"><i class="bi bi-download text-success me-2"></i>1. Ekspor Full Backup JSON</h6>
                  <p class="small text-muted mb-3">Simpan seluruh histori pekerjaan, catatan, transaksi, dan daftar kontak ke berkas JSON.</p>
                </div>
                <button class="btn btn-success w-100 rounded-pill fw-semibold py-2.5" @click="exportJSONBackup">
                  <i class="bi bi-file-earmark-code me-1"></i> Unduh Berkas JSON Backup
                </button>
              </div>
            </div>

            <!-- Import & Recovery -->
            <div class="col-md-7">
              <div class="p-3 bg-light rounded-3 border">
                <h6 class="fw-bold text-dark mb-1"><i class="bi bi-arrow-counterclockwise text-primary me-2"></i>2. Import & Recovery Data JSON</h6>
                <p class="small text-muted mb-2">Pilih file JSON untuk menampilkan tombol pemulihan data (Restore/Merge).</p>
                <input type="file" class="form-control mb-3" accept=".json" @change="handleJSONSelect" ref="jsonFileInput" />

                <!-- Recovery Preview Card when JSON loaded -->
                <div v-if="recoveryPreview" class="card border border-primary bg-primary bg-opacity-10 p-3 rounded-3 mb-3">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="fw-bold text-primary small"><i class="bi bi-search me-1"></i>Preview Isi File Backup:</span>
                    <span class="badge bg-primary rounded-pill px-2.5 py-1 text-white small">{{ recoveryPreview.exportDate || 'Tanggal N/A' }}</span>
                  </div>

                  <div class="row g-2 mb-3 text-center">
                    <div class="col-4">
                      <div class="p-2 bg-white rounded-3 border">
                        <small class="text-muted d-block opacity-75" style="font-size: 10px;">Tugas</small>
                        <strong class="text-dark fs-6">{{ recoveryPreview.tasksCount }}</strong>
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="p-2 bg-white rounded-3 border">
                        <small class="text-muted d-block opacity-75" style="font-size: 10px;">Proyek</small>
                        <strong class="text-dark fs-6">{{ recoveryPreview.projectsCount }}</strong>
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="p-2 bg-white rounded-3 border">
                        <small class="text-muted d-block opacity-75" style="font-size: 10px;">Transaksi</small>
                        <strong class="text-dark fs-6">{{ recoveryPreview.transactionsCount }}</strong>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex flex-wrap gap-2">
                    <button @click="executeFullRecovery" class="btn btn-primary rounded-pill btn-sm fw-bold flex-fill py-2">
                      <i class="bi bi-arrow-repeat me-1"></i> Pulihkan & Timpa (Full Recovery)
                    </button>
                    <button @click="cancelRecovery" class="btn btn-outline-secondary rounded-pill btn-sm fw-semibold px-3">
                      Batal
                    </button>
                  </div>
                </div>

                <div class="small text-danger fw-semibold" v-if="importError">{{ importError }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Theme Mode & Dark Reader OLED Card -->
      <div class="col-lg-12">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3 border-bottom pb-3">
            <div class="d-flex align-items-center gap-3">
              <div class="p-3 bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                <i class="bi bi-moon-stars-fill fs-3"></i>
              </div>
              <div>
                <h5 class="fw-bold text-dark mb-0">🌙 Setelan Dark Mode & True Black OLED</h5>
                <p class="small text-muted mb-0">Dukungan auto-conversion warna Dark Reader dengan mode khusus layar HP OLED/AMOLED.</p>
              </div>
            </div>

            <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5 align-self-start align-self-md-center">
              <i class="bi bi-shield-check"></i> Dark Reader Engine Active
            </span>
          </div>

          <div class="row g-3">
            <!-- Option 1: Light Mode -->
            <div class="col-md-4">
              <div 
                class="p-3.5 rounded-4 border-2 transition-all position-relative h-100 d-flex flex-column justify-content-between"
                :class="themeMode === 'light' ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'border-secondary-subtle bg-light'"
                @click="selectTheme('light')"
                style="cursor: pointer;"
              >
                <div>
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-warning text-dark rounded-pill px-2.5 py-1 fw-bold">☀️ Light Mode</span>
                    <i v-if="themeMode === 'light'" class="bi bi-check-circle-fill text-primary fs-5"></i>
                  </div>
                  <h6 class="fw-bold text-dark mb-1">Mode Terang Standard</h6>
                  <p class="small text-muted mb-0" style="font-size: 0.82rem;">Latar putih cerah (#f8fafc) ideal untuk penggunaan di siang hari atau ruangan terang.</p>
                </div>
                <div class="mt-3 p-2 bg-white rounded-3 border d-flex align-items-center justify-content-between">
                  <small class="text-dark fw-semibold" style="font-size: 11px;">Preview Warna</small>
                  <div class="d-flex gap-1">
                    <span class="rounded-circle border" style="width: 14px; height: 14px; background-color: #f8fafc;"></span>
                    <span class="rounded-circle border" style="width: 14px; height: 14px; background-color: #ffffff;"></span>
                    <span class="rounded-circle border" style="width: 14px; height: 14px; background-color: #0f172a;"></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Option 2: Dark Slate Mode -->
            <div class="col-md-4">
              <div 
                class="p-3.5 rounded-4 border-2 transition-all position-relative h-100 d-flex flex-column justify-content-between"
                :class="themeMode === 'dark' ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'border-secondary-subtle bg-light'"
                @click="selectTheme('dark')"
                style="cursor: pointer;"
              >
                <div>
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-info text-dark rounded-pill px-2.5 py-1 fw-bold">🌙 Dark Slate</span>
                    <i v-if="themeMode === 'dark'" class="bi bi-check-circle-fill text-primary fs-5"></i>
                  </div>
                  <h6 class="fw-bold text-dark mb-1">Mode Gelap Charcoal</h6>
                  <p class="small text-muted mb-0" style="font-size: 0.82rem;">Warna abu-abu pekat (#090d16) yang nyaman dan redup di mata tanpa membuat kontras terlalu tajam.</p>
                </div>
                <div class="mt-3 p-2 rounded-3 border d-flex align-items-center justify-content-between" style="background-color: #131b2e; border-color: #1e293b !important;">
                  <small class="text-light fw-semibold" style="font-size: 11px;">Preview Warna</small>
                  <div class="d-flex gap-1">
                    <span class="rounded-circle border border-secondary" style="width: 14px; height: 14px; background-color: #090d16;"></span>
                    <span class="rounded-circle border border-secondary" style="width: 14px; height: 14px; background-color: #131b2e;"></span>
                    <span class="rounded-circle border border-secondary" style="width: 14px; height: 14px; background-color: #f1f5f9;"></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Option 3: OLED True Black Mode -->
            <div class="col-md-4">
              <div 
                class="p-3.5 rounded-4 border-2 transition-all position-relative h-100 d-flex flex-column justify-content-between"
                :class="themeMode === 'oled' ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'border-secondary-subtle bg-light'"
                @click="selectTheme('oled')"
                style="cursor: pointer;"
              >
                <div>
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-dark text-white border border-secondary rounded-pill px-2.5 py-1 fw-bold">⬛ True Black OLED</span>
                    <i v-if="themeMode === 'oled'" class="bi bi-check-circle-fill text-primary fs-5"></i>
                  </div>
                  <h6 class="fw-bold text-dark mb-1">True Black OLED / AMOLED</h6>
                  <p class="small text-muted mb-0" style="font-size: 0.82rem;">Hitam pekat sempurna (#000000). Mematikan piksel layar OLED HP, hemat daya baterai & kontras tajam.</p>
                </div>
                <div class="mt-3 p-2 rounded-3 border d-flex align-items-center justify-content-between" style="background-color: #000000; border-color: #333333 !important;">
                  <small class="text-white fw-semibold" style="font-size: 11px;">Preview Warna OLED</small>
                  <div class="d-flex gap-1">
                    <span class="rounded-circle border border-dark" style="width: 14px; height: 14px; background-color: #000000;"></span>
                    <span class="rounded-circle border border-secondary" style="width: 14px; height: 14px; background-color: #0d0d0d;"></span>
                    <span class="rounded-circle border border-light" style="width: 14px; height: 14px; background-color: #ffffff;"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Theme & Accent Palette Card -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
          <div class="d-flex align-items-center gap-2 mb-3 border-bottom pb-3">
            <i class="bi bi-palette-fill fs-3 text-primary"></i>
            <div>
              <h5 class="fw-bold text-dark mb-0">Warna Aksen Material</h5>
              <p class="small text-muted mb-0">Pilih tema aksen warna untuk tombol & highlight.</p>
            </div>
          </div>

          <div class="d-flex flex-wrap gap-2 mb-3">
            <button
              v-for="color in accentPalette"
              :key="color.hex"
              class="btn rounded-circle p-0 d-flex align-items-center justify-content-center color-swatch"
              :style="{ backgroundColor: color.hex, width: '42px', height: '42px' }"
              :title="color.name"
              @click="setAccent(color.hex)"
            >
              <i v-if="accentColor === color.hex" class="bi bi-check-lg text-white fs-5 fw-bold"></i>
            </button>
          </div>
          <small class="text-muted d-block">
            Warna aksen aktif: <strong class="text-dark">{{ currentAccentName }}</strong> ({{ accentColor }})
          </small>
        </div>
      </div>

      <!-- Automated Nightly LocalStorage Backup & JSON Export Card -->
      <div class="col-lg-12">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-bottom pb-3 mb-3">
            <div class="d-flex align-items-center gap-3">
              <div class="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
                <i class="bi bi-shield-check fs-2"></i>
              </div>
              <div>
                <h5 class="fw-bold text-dark mb-0">💾 Automated Nightly Local Storage Backup & Export</h5>
                <p class="small text-muted mb-0">Pencadangan otomatis setiap malam ke Local Storage & Export lengkap seluruh database aplikasi (.json).</p>
              </div>
            </div>

            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-primary fw-bold px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2" @click="exportAllDataJson">
                <i class="bi bi-download"></i>
                <span>Export All Data (JSON)</span>
              </button>
              <button class="btn btn-outline-secondary fw-semibold px-3 py-2 rounded-3" @click="triggerNightlyBackupNow">
                <i class="bi bi-arrow-repeat me-1"></i> Cadangkan Sekarang
              </button>
            </div>
          </div>

          <div class="row g-3 align-items-center">
            <div class="col-md-6">
              <div class="form-check form-switch p-3 rounded-3 bg-light border d-flex align-items-center justify-content-between">
                <div>
                  <label class="form-check-label fw-bold text-dark d-block" for="nightlyBackupSwitch">
                    ⚡ Automated Nightly Backup (Tiap Malam)
                  </label>
                  <small class="text-muted" style="font-size: 0.8rem;">
                    Secara otomatis menyimpan snapshot lengkap seluruh data aplikasi ke memori aman setiap pergantian hari.
                  </small>
                </div>
                <input
                  class="form-check-input ms-3 fs-4"
                  type="checkbox"
                  id="nightlyBackupSwitch"
                  v-model="autoNightlyBackup"
                  @change="toggleNightlyBackupSetting"
                  style="cursor: pointer;"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="p-3 rounded-3 bg-light border">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="small fw-bold text-dark">Status Cadangan Terakhir:</span>
                  <span class="badge bg-success-subtle text-success fw-bold px-2.5 py-1 rounded-pill">
                    <i class="bi bi-check-circle-fill me-1"></i>Aktif
                  </span>
                </div>
                <div class="small text-muted">Tanggal: <strong class="text-dark">{{ lastBackupDate || 'Hari ini' }}</strong></div>
                <div class="small text-muted">Waktu: <strong class="text-dark">{{ lastBackupTime || '23:59:00' }}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Excel Export Card -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
          <div class="d-flex align-items-center gap-2 mb-3 border-bottom pb-3">
            <i class="bi bi-file-earmark-excel-fill fs-3 text-success"></i>
            <div>
              <h5 class="fw-bold text-dark mb-0">Export Laporan Excel (.xlsx)</h5>
              <p class="small text-muted mb-0">Unduh berkas spreadsheet terpisah untuk pembukuan.</p>
            </div>
          </div>

          <div class="d-flex flex-column gap-2">
            <button class="btn btn-outline-success d-flex justify-content-between align-items-center p-2.5 rounded-3 text-start" @click="exportTransactionsExcel">
              <div>
                <span class="fw-bold d-block text-dark small"><i class="bi bi-wallet2 me-2 text-success"></i>Laporan Transaksi Keuangan</span>
              </div>
              <i class="bi bi-download"></i>
            </button>

            <button class="btn btn-outline-success d-flex justify-content-between align-items-center p-2.5 rounded-3 text-start" @click="exportContactsExcel">
              <div>
                <span class="fw-bold d-block text-dark small"><i class="bi bi-person-lines-fill me-2 text-info"></i>Database Kontak Klien</span>
              </div>
              <i class="bi bi-download"></i>
            </button>

            <button class="btn btn-outline-success d-flex justify-content-between align-items-center p-2.5 rounded-3 text-start" @click="exportProjectsExcel">
              <div>
                <span class="fw-bold d-block text-dark small"><i class="bi bi-folder-fill me-2 text-primary"></i>Daftar Proyek & Kontrak</span>
              </div>
              <i class="bi bi-download"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Raw Reset & Demo Controls -->
      <div class="col-lg-12">
        <div class="card border border-2 border-danger shadow-sm rounded-4 bg-danger bg-opacity-10 p-4">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 class="fw-bold text-danger mb-1">🔥 Reset Data Ke Setelan Pabrik</h5>
              <p class="small text-danger mb-0">Bersihkan seluruh data menjadi kosong (Raw State) atau muat data contoh untuk demo.</p>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-outline-danger fw-bold rounded-3" @click="resetToRawEmpty">
                <i class="bi bi-trash3-fill me-1"></i> Bersihkan Semua Data
              </button>
              <button class="btn btn-secondary fw-semibold rounded-3" @click="loadSampleData">
                <i class="bi bi-box-seam me-1"></i> Muat Data Contoh (Demo)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import * as XLSX from 'xlsx';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendOnDeviceNotification 
} from '../utils/notification';

export default {
  name: 'PreferencesView',
  setup() {
    const store = useStore();
    const jsonFileInput = ref(null);
    const importError = ref('');
    const recoveryPreview = ref(null);
    const parsedDataTemp = ref(null);

    const canInstallPwa = ref(false);
    const isStandalone = ref(false);

    const notifPermission = ref('default');
    const notifEnabled = ref(localStorage.getItem('ft_notifications_enabled') !== 'false');

    // Welcome Banner Settings
    const currentBanner = store.getters.getWelcomeBanner || {};
    const welcomeTitleInput = ref(currentBanner.title || 'Selamat Datang, Rekan Kerja!');
    const welcomeSubtitleInput = ref(currentBanner.subtitle || 'Pusat kendali produktivitas & organizer karir karyawan Anda: kelola tugas (5 view modes), proyek kantor, arus kas, dan invoice.');

    const saveWelcomeBannerSettings = () => {
      store.commit('UPDATE_WELCOME_BANNER', {
        title: welcomeTitleInput.value,
        subtitle: welcomeSubtitleInput.value
      });
      sendOnDeviceNotification('✏️ Teks Banner Diperbarui', {
        body: 'Teks welcome banner dashboard berhasil disimpan!',
        type: 'success'
      });
    };

    const resetWelcomeBannerDefault = () => {
      welcomeTitleInput.value = 'Selamat Datang, Rekan Kerja!';
      welcomeSubtitleInput.value = 'Pusat kendali produktivitas & organizer karir karyawan Anda: kelola tugas (5 view modes), proyek kantor, arus kas, dan invoice.';
      saveWelcomeBannerSettings();
    };

    // Automated Nightly Backup State
    const autoNightlyBackup = ref(localStorage.getItem('ft_auto_nightly_backup') !== 'false');
    const lastBackupDate = ref(localStorage.getItem('ft_last_nightly_backup_date') || new Date().toISOString().split('T')[0]);
    const lastBackupTime = ref(localStorage.getItem('ft_last_nightly_backup_time') || new Date().toLocaleTimeString('id-ID'));

    const toggleNightlyBackupSetting = () => {
      localStorage.setItem('ft_auto_nightly_backup', autoNightlyBackup.value ? 'true' : 'false');
      if (autoNightlyBackup.value) {
        triggerNightlyBackupNow();
      }
    };

    const triggerNightlyBackupNow = () => {
      const fullState = {
        todos: store.state.todos,
        projects: store.state.projects,
        finances: store.state.finances,
        notes: store.state.notes,
        contacts: store.state.contacts,
        events: store.state.events,
        moodLogs: store.state.moodLogs,
        myBusiness: store.state.myBusiness,
        exportDate: new Date().toISOString()
      };

      const today = new Date().toISOString().split('T')[0];
      const time = new Date().toLocaleTimeString('id-ID');

      localStorage.setItem('ft_nightly_backup_snapshot', JSON.stringify(fullState));
      localStorage.setItem('ft_last_nightly_backup_date', today);
      localStorage.setItem('ft_last_nightly_backup_time', time);

      lastBackupDate.value = today;
      lastBackupTime.value = time;

      sendOnDeviceNotification('💾 Nightly Backup Berhasil', {
        body: `Snapshot data lokal tersimpan aman pada ${time}.`,
        type: 'success'
      });
    };

    const exportAllDataJson = () => {
      const fullData = {
        todos: store.state.todos,
        projects: store.state.projects,
        finances: store.state.finances,
        notes: store.state.notes,
        contacts: store.state.contacts,
        events: store.state.events,
        moodLogs: store.state.moodLogs,
        myBusiness: store.state.myBusiness,
        exportTimestamp: new Date().toISOString(),
        version: '2.5'
      };

      const jsonStr = JSON.stringify(fullData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `rajinkerja-full-backup-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      sendOnDeviceNotification('📥 Export Data Selesai', {
        body: `Berkas rajinkerja-full-backup-${dateStr}.json berhasil diunduh.`,
        type: 'success'
      });
    };

    // AI Integration state
    const geminiApiKey = ref(store.getters.getGeminiApiKey || '');
    const aiProvider = ref(store.getters.getAiProvider || 'gemini');
    const aiModel = ref(store.getters.getAiModel || 'gemini-1.5-flash');
    const showApiKey = ref(false);
    const isTestingAiKey = ref(false);
    const aiTestResult = ref(null);

    const saveAiSettings = () => {
      store.commit('UPDATE_AI_CONFIG', {
        geminiApiKey: geminiApiKey.value.trim(),
        aiProvider: aiProvider.value,
        aiModel: aiModel.value
      });

      sendOnDeviceNotification('🤖 Pengaturan AI Disimpan!', {
        body: `Kunci API Key AI (${aiProvider.value.toUpperCase()}) telah berhasil tersimpan di sistem.`,
        type: 'success'
      });
    };

    const testAiConnection = async () => {
      const key = geminiApiKey.value.trim();
      if (!key) {
        aiTestResult.value = {
          success: false,
          message: 'Silakan masukkan API Key terlebih dahulu.'
        };
        return;
      }

      isTestingAiKey.value = true;
      aiTestResult.value = null;

      try {
        if (aiProvider.value === 'gemini') {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
          const data = await res.json();

          if (res.ok && data.models) {
            aiTestResult.value = {
              success: true,
              message: `Koneksi Berhasil! ${data.models.length} model Google Gemini siap digunakan.`
            };
            saveAiSettings();
          } else {
            aiTestResult.value = {
              success: false,
              message: data.error?.message || 'API Key Gemini tidak valid atau kuota habis.'
            };
          }
        } else {
          if (key.length > 10) {
            aiTestResult.value = {
              success: true,
              message: 'Format API Key valid dan siap digunakan.'
            };
            saveAiSettings();
          } else {
            aiTestResult.value = {
              success: false,
              message: 'Format API Key terlalu pendek / tidak valid.'
            };
          }
        }
      } catch (err) {
        aiTestResult.value = {
          success: false,
          message: 'Gagal terhubung ke server API. Periksa koneksi internet Anda.'
        };
      } finally {
        isTestingAiKey.value = false;
      }
    };

    const accentColor = computed(() => store.getters.getAccentColor);
    const themeMode = computed(() => store.getters.getThemeMode);

    const selectTheme = (mode) => {
      store.dispatch('setThemeMode', mode);
      const modeNames = {
        light: 'Mode Terang (Light)',
        dark: 'Mode Gelap Slate (Dark)',
        oled: 'True Black OLED (Pure #000000)'
      };
      sendOnDeviceNotification('🌙 Mode Tampilan Diperbarui', {
        body: `Tema tampilan berhasil diubah ke ${modeNames[mode] || mode}.`,
        type: 'success'
      });
    };

    const accentPalette = [
      { name: 'Material Blue', hex: '#2563eb' },
      { name: 'Emerald Green', hex: '#10b981' },
      { name: 'Deep Purple', hex: '#7c3aed' },
      { name: 'Crimson Rose', hex: '#e11d48' },
      { name: 'Warm Amber', hex: '#f59e0b' },
      { name: 'Indigo Blue', hex: '#3f51b5' },
      { name: 'Teal Cyan', hex: '#0d9488' }
    ];

    const currentAccentName = computed(() => {
      const found = accentPalette.find(c => c.hex.toLowerCase() === accentColor.value.toLowerCase());
      return found ? found.name : 'Custom';
    });

    const setAccent = (colorHex) => {
      store.dispatch('setAccentColor', colorHex);
      sendOnDeviceNotification('🎨 Warna Aksen Diperbarui', {
        body: `Warna aksen Material berhasil diubah.`,
        type: 'success'
      });
    };

    // PWA & Notification Setup
    const checkPwaStatus = () => {
      isStandalone.value = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      canInstallPwa.value = !!window.deferredPwaPrompt;
    };

    const triggerPwaInstall = async () => {
      if (!window.deferredPwaPrompt) return;
      window.deferredPwaPrompt.prompt();
      const choice = await window.deferredPwaPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        sendOnDeviceNotification('📱 PWA Berhasil Terpasang!', {
          body: 'Aplikasi RajinKerja kini ada di layar HP Anda.',
          type: 'success'
        });
      }
      window.deferredPwaPrompt = null;
      canInstallPwa.value = false;
    };

    const updateNotifPermissionState = () => {
      notifPermission.value = getNotificationPermission();
    };

    const requestNotifPermission = async () => {
      const perm = await requestNotificationPermission();
      notifPermission.value = perm;
      if (perm === 'granted') {
        sendOnDeviceNotification('🔔 Notifikasi HP Aktif!', {
          body: 'Anda akan menerima notifikasi langsung di perangkat Anda.',
          type: 'success'
        });
      }
    };

    const testNotif = () => {
      sendOnDeviceNotification('🔔 Uji Coba Notifikasi RajinKerja', {
        body: 'Notifikasi sistem On-Device berfungsi dengan sangat baik!',
        type: 'info'
      });
    };

    const saveNotifToggle = () => {
      localStorage.setItem('ft_notifications_enabled', notifEnabled.value ? 'true' : 'false');
    };

    const getNotifBadgeClass = (perm) => {
      if (perm === 'granted') return 'bg-success text-white';
      if (perm === 'denied') return 'bg-danger text-white';
      return 'bg-warning text-dark';
    };

    const getNotifPermissionLabel = (perm) => {
      if (perm === 'granted') return '✓ Diizinkan';
      if (perm === 'denied') return '✗ Ditolak';
      return 'Belum Diizinkan';
    };

    // JSON Backup & Recovery
    const exportJSONBackup = () => {
      const fullState = {
        contacts: store.getters.getContacts,
        projects: store.getters.getProjects,
        tasks: store.getters.getTasks,
        transactions: store.getters.getTransactions,
        invoices: store.getters.getInvoices,
        habits: store.getters.getHabits,
        notes: store.getters.getNotes,
        events: store.getters.getEvents,
        accentColor: accentColor.value,
        budgetThreshold: store.getters.getBudgetThreshold,
        myBusiness: store.getters.getMyBusiness,
        exportDate: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID')
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullState, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `rajinkerja_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      sendOnDeviceNotification('💾 Backup JSON Berhasil', {
        body: 'Berkas JSON backup data telah terunduh.',
        type: 'success'
      });
    };

    const handleJSONSelect = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          parsedDataTemp.value = parsed;
          recoveryPreview.value = {
            exportDate: parsed.exportDate || 'Format Lama',
            tasksCount: (parsed.tasks || []).length,
            projectsCount: (parsed.projects || []).length,
            transactionsCount: (parsed.transactions || []).length
          };
          importError.value = '';
        } catch (err) {
          importError.value = 'Format berkas JSON tidak valid. Pilih file backup RajinKerja yang sesuai.';
          recoveryPreview.value = null;
        }
      };
      reader.readAsText(file);
    };

    const executeFullRecovery = () => {
      if (!parsedDataTemp.value) return;
      store.dispatch('importFullData', parsedDataTemp.value);
      
      sendOnDeviceNotification('🔄 Restorasi Data Berhasil!', {
        body: 'Seluruh data telah dipulihkan dari file JSON.',
        type: 'success'
      });

      recoveryPreview.value = null;
      parsedDataTemp.value = null;
      if (jsonFileInput.value) jsonFileInput.value.value = '';
    };

    const cancelRecovery = () => {
      recoveryPreview.value = null;
      parsedDataTemp.value = null;
      if (jsonFileInput.value) jsonFileInput.value.value = '';
    };

    const resetToRawEmpty = () => {
      if (confirm('Lakukan reset total? Seluruh data akan dikosongkan.')) {
        store.dispatch('clearAllData');
        sendOnDeviceNotification('🗑️ Data Berhasil Dikosongkan', {
          body: 'Sistem kembali ke Raw Clean State.',
          type: 'warning'
        });
      }
    };

    const loadSampleData = () => {
      if (confirm('Muat data contoh / demo?')) {
        store.dispatch('loadSampleData');
        sendOnDeviceNotification('📦 Data Contoh Berhasil Dimuat', {
          body: 'Daftar tugas, proyek, dan kontak demo telah tersedia.',
          type: 'success'
        });
      }
    };

    // Excel Exports
    const exportTransactionsExcel = () => {
      const data = store.getters.getTransactions.map((t, i) => ({
        No: i + 1, Deskripsi: t.item, Kategori: t.category, Tipe: t.type, Nominal: t.amount, Tanggal: t.date, Metode: t.method
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Transaksi');
      XLSX.writeFile(wb, 'transaksi_keuangan.xlsx');
    };

    const exportContactsExcel = () => {
      const data = store.getters.getContacts.map((c, i) => ({
        No: i + 1, Nama: c.name, Perusahaan: c.company, Email: c.email, Telepon: c.phone, Status: c.status
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Kontak');
      XLSX.writeFile(wb, 'kontak_klien.xlsx');
    };

    const exportProjectsExcel = () => {
      const data = store.getters.getProjects.map((p, i) => ({
        No: i + 1, Judul: p.projectTitle, Klien: p.clientName, Rate: p.rate, Status: p.status, Progres: p.progress + '%', Deadline: p.deadline
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Proyek');
      XLSX.writeFile(wb, 'daftar_proyek.xlsx');
    };

    onMounted(() => {
      checkPwaStatus();
      updateNotifPermissionState();
      window.addEventListener('pwa-prompt-available', checkPwaStatus);
    });

    return {
      jsonFileInput,
      importError,
      recoveryPreview,
      canInstallPwa,
      isStandalone,
      notifPermission,
      notifEnabled,
      welcomeTitleInput,
      welcomeSubtitleInput,
      saveWelcomeBannerSettings,
      resetWelcomeBannerDefault,
      geminiApiKey,
      aiProvider,
      aiModel,
      showApiKey,
      isTestingAiKey,
      aiTestResult,
      saveAiSettings,
      testAiConnection,
      accentColor,
      themeMode,
      selectTheme,
      accentPalette,
      currentAccentName,
      setAccent,
      triggerPwaInstall,
      requestNotifPermission,
      testNotif,
      saveNotifToggle,
      getNotifBadgeClass,
      getNotifPermissionLabel,
      autoNightlyBackup,
      lastBackupDate,
      lastBackupTime,
      toggleNightlyBackupSetting,
      triggerNightlyBackupNow,
      exportAllDataJson,
      exportJSONBackup,
      handleJSONSelect,
      executeFullRecovery,
      cancelRecovery,
      resetToRawEmpty,
      loadSampleData,
      exportTransactionsExcel,
      exportContactsExcel,
      exportProjectsExcel
    };
  }
};
</script>

<style scoped>
.color-swatch {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}
.color-swatch:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
</style>
