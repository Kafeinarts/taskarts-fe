<template>
  <div class="container-fluid p-0 max-w-100 overflow-x-hidden" data-aos="fade-up">
    <!-- Header Hero Banner -->
    <div class="bg-gradient-dark text-white p-4 p-md-5 rounded-4 shadow-sm mb-4" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
      <div class="row align-items-center g-4">
        <div class="col-lg-8">
          <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span class="badge bg-primary text-white fw-bold px-3 py-1.5 rounded-pill fs-6">
              <i class="bi bi-patch-check-fill me-1"></i> TaskArts Work Suite v2.5
            </span>
            <span class="badge bg-success text-white fw-bold px-3 py-1.5 rounded-pill" v-if="isOnline">
              <i class="bi bi-wifi me-1"></i> Online & PWA Active
            </span>
            <span class="badge bg-warning text-dark fw-bold px-3 py-1.5 rounded-pill" v-else>
              <i class="bi bi-wifi-off me-1"></i> Offline Local Mode
            </span>
            <span class="badge bg-info text-white fw-bold px-3 py-1.5 rounded-pill">
              <i class="bi bi-book-half me-1"></i> Dokumentasi Lengkap & Hidden Features
            </span>
          </div>

          <h1 class="fw-extrabold text-white display-6 mb-2">Pusat Dokumentasi, Panduan Fitur & Hidden Tricks</h1>
          <p class="lead text-slate-300 mb-4">
            Eksplorasi dokumentasi mendalam untuk setiap modul produktivitas, fitur tersembunyi, shortcut rahasia, arsitektur Local-First, repositori GitHub, serta panduan PWA mobile & desktop.
          </p>

          <div class="d-flex flex-wrap gap-2">
            <button @click="activeTab = 'tutorials'" class="btn btn-primary px-4 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-2 shadow-sm">
              <i class="bi bi-mortarboard-fill"></i> 🎓 Tutorial Lengkap Semua Menu
            </button>
            <button @click="activeTab = 'modules'" class="btn btn-outline-light px-4 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-2 shadow-sm">
              <i class="bi bi-grid-3x3-gap-fill"></i> Ensiklopedia Modul
            </button>
            <button @click="activeTab = 'hidden'" class="btn btn-warning text-dark px-4 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-2 shadow-sm">
              <i class="bi bi-stars"></i> Fitur & Shortcut Tersembunyi
            </button>
            <a href="https://github.com/itsmebroarif/rajinkerja-id" target="_blank" class="btn btn-outline-light px-4 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-2">
              <i class="bi bi-github fs-5"></i> GitHub Repo
            </a>
          </div>
        </div>

        <div class="col-lg-4 text-center">
          <div class="bg-white bg-opacity-10 p-4 rounded-4 border border-white border-opacity-10 shadow-sm backdrop-blur">
            <img src="/logo.svg" alt="TaskArts Logo" style="width: 80px; height: 80px;" class="mb-3 p-1 bg-white rounded-3 shadow-sm" />
            <h5 class="fw-extrabold text-white mb-1">Task<span class="text-primary">Arts</span></h5>
            <p class="small text-slate-300 mb-2">Workflow & Productivity OS</p>
            <div class="d-flex justify-content-center gap-1">
              <span class="badge bg-success rounded-pill px-2.5 py-1 small fw-bold">100% Local-First</span>
              <span class="badge bg-info rounded-pill px-2.5 py-1 small fw-bold">Zero Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Interactive Navigation Tabs -->
    <div class="card border-0 shadow-sm rounded-4 bg-white p-3 mb-4">
      <ul class="nav nav-pills nav-fill gap-2" role="tablist">
        <li class="nav-item">
          <button class="nav-link py-2.5 px-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2" :class="{ active: activeTab === 'tutorials' }" @click="activeTab = 'tutorials'">
            <i class="bi bi-mortarboard-fill text-warning"></i>
            <span>1. 🎓 Tutorial Lengkap per Menu</span>
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link py-2.5 px-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2" :class="{ active: activeTab === 'modules' }" @click="activeTab = 'modules'">
            <i class="bi bi-grid-3x3-gap-fill"></i>
            <span>2. 📖 Ensiklopedia Modul</span>
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link py-2.5 px-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2" :class="{ active: activeTab === 'hidden' }" @click="activeTab = 'hidden'">
            <i class="bi bi-stars text-warning"></i>
            <span>3. ⚡ Hidden Features & Shortcuts</span>
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link py-2.5 px-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2" :class="{ active: activeTab === 'pwa' }" @click="activeTab = 'pwa'">
            <i class="bi bi-phone-fill"></i>
            <span>4. 📱 Panduan Pasang PWA</span>
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link py-2.5 px-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2" :class="{ active: activeTab === 'dev' }" @click="activeTab = 'dev'">
            <i class="bi bi-code-slash"></i>
            <span>5. 💻 Arsitektur & Developer</span>
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link py-2.5 px-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2" :class="{ active: activeTab === 'faq' }" @click="activeTab = 'faq'">
            <i class="bi bi-question-circle-fill"></i>
            <span>6. ❓ FAQ & Pencarian</span>
          </button>
        </li>
      </ul>
    </div>

    <!-- ========================================================= -->
    <!-- TAB 1: TUTORIAL LENGKAP SEMUA MENU (STEP-BY-STEP)          -->
    <!-- ========================================================= -->
    <div v-show="activeTab === 'tutorials'" id="docTutorials" class="mb-4">
      <MenuTutorialsTab />
    </div>

    <!-- ========================================================= -->
    <!-- TAB 1: DOKUMENTASI LENGKAP PER TIAP MODUL FITUR           -->
    <!-- ========================================================= -->
    <div v-show="activeTab === 'modules'" id="docModules" class="mb-4">
      <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom gap-2">
          <div>
            <span class="badge bg-primary text-white fw-bold px-3 py-1 rounded-pill mb-1">📖 Ensiklopedia Modul</span>
            <h4 class="fw-extrabold text-dark mb-0">Panduan Mendalam & Cara Kerja Seluruh Modul Aplikasi</h4>
          </div>
          <div class="input-group style-search" style="max-width: 320px;">
            <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-primary"></i></span>
            <input type="text" class="form-control form-control-sm bg-light border-start-0" placeholder="Filter panduan modul..." v-model="moduleDocSearch" />
          </div>
        </div>

        <p class="text-muted small mb-4">
          Berikut adalah penjelasan mendalam tentang fungsi, keunggulan teknis, dan alur penggunaan dari 20 modul kerja yang tersedia di TaskArts:
        </p>

        <div class="row g-4">
          <div v-for="mod in filteredModuleDocs" :key="mod.id" class="col-md-6 col-xl-4">
            <div class="card h-100 border rounded-4 shadow-sm p-4 bg-light hover-shadow transition-all d-flex flex-column justify-content-between">
              <div>
                <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <div class="d-flex align-items-center gap-2">
                    <span class="fs-2">{{ mod.icon }}</span>
                    <div>
                      <h5 class="fw-bold text-dark mb-0">{{ mod.title }}</h5>
                      <span class="badge bg-primary-subtle text-primary small">{{ mod.badge }}</span>
                    </div>
                  </div>
                </div>

                <div class="small text-secondary mb-3 lh-base">
                  <strong>Fungsi Utama:</strong> {{ mod.purpose }}
                </div>

                <h6 class="fw-bold text-dark small mb-2"><i class="bi bi-check2-circle text-success me-1"></i>Fitur Unggulan Kunci:</h6>
                <ul class="small text-muted lh-base ps-3 mb-3">
                  <li v-for="(feat, idx) in mod.highlights" :key="idx" class="mb-1">{{ feat }}</li>
                </ul>

                <div class="p-2.5 bg-white rounded-3 border small mb-3">
                  <strong class="text-primary d-block mb-1"><i class="bi bi-lightbulb me-1"></i>Pro Tips / Cara Pakai:</strong>
                  <span class="text-secondary">{{ mod.tip }}</span>
                </div>
              </div>

              <router-link :to="mod.route" class="btn btn-sm btn-primary rounded-pill fw-bold w-100 d-flex align-items-center justify-content-center gap-2 mt-auto shadow-sm">
                <span>Buka Modul {{ mod.title }}</span>
                <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- TAB 2: FITUR TERSEMBUNYI (HIDDEN FEATURES & PRO TIPS)     -->
    <!-- ========================================================= -->
    <div v-show="activeTab === 'hidden'" id="hiddenFeatures" class="mb-4">
      <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
        <div class="d-flex align-items-center gap-3 mb-3 pb-2 border-bottom">
          <div class="bg-warning bg-opacity-25 text-warning-emphasis p-3 rounded-circle d-flex align-items-center justify-content-center" style="width: 52px; height: 52px;">
            <i class="bi bi-stars fs-2 text-warning"></i>
          </div>
          <div>
            <span class="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill mb-1">⚡ Secret Hacks & Shortcuts</span>
            <h4 class="fw-extrabold text-dark mb-0">Fitur & Pintasan Tersembunyi (Hidden Features)</h4>
          </div>
        </div>

        <p class="text-muted small mb-4">
          TaskArts menyimpan sejumlah fitur canggih dan integrasi otomatis yang dirancang untuk mempercepat produktivitas kerja harian Anda tanpa diketahui banyak pengguna:
        </p>

        <div class="row g-4">
          <!-- Hidden Feature 1: Nightly Auto-Backup -->
          <div class="col-md-6">
            <div class="p-3.5 bg-light rounded-4 border h-100">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-success text-white fw-bold">🌙 Auto-Protection</span>
                <h5 class="fw-bold text-dark mb-0">Nightly Automatic Backup (Pukul 00:00)</h5>
              </div>
              <p class="small text-secondary lh-base mb-2">
                Sistem secara otomatis mendeteksi pergantian hari dan membuat snapshot pencadangan seluruh data (To-Do, Keuangan, RAB, CV, Surat) ke dalam database berkapasitas tinggi IndexedDB (bebas dari batas kuota 5MB localStorage). Data cadangan semalam tersimpan aman dan dapat dipulihkan kapan saja.
              </p>
              <div class="small bg-white p-2 rounded border font-monospace text-success">
                App.vue ➔ IndexedDB High-Capacity Storage ➔ Safe Snapshot
              </div>
            </div>
          </div>

          <!-- Hidden Feature 2: Universal JSON Migration Schema -->
          <div class="col-md-6">
            <div class="p-3.5 bg-light rounded-4 border h-100">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-primary text-white fw-bold">🔄 Portabilitas Penuh</span>
                <h5 class="fw-bold text-dark mb-0">Skema Universal JSON Export & Import</h5>
              </div>
              <p class="small text-secondary lh-base mb-2">
                Setiap file JSON cadangan yang diekspor dari TaskArts memiliki struktur standar <code>{ app: "TaskArts", version: "2.5", ... }</code>. Anda dapat mengimpor file satu modul (seperti CV atau Invoice saja) atau memulihkan seluruh aplikasi (Full Restore) dengan tombol <em>Pulihkan & Timpa</em> di menu Preferences.
              </p>
              <div class="small bg-white p-2 rounded border font-monospace text-primary">
                Export JSON ➔ Cross-Browser Sync ➔ Offline Storage Migration
              </div>
            </div>
          </div>

          <!-- Hidden Feature 3: Keyboard Shortcuts -->
          <div class="col-md-6">
            <div class="p-3.5 bg-light rounded-4 border h-100">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-info text-white fw-bold">⌨️ Hotkeys</span>
                <h5 class="fw-bold text-dark mb-0">Pintasan Keyboard Tersembunyi (Hotkeys)</h5>
              </div>
              <p class="small text-secondary lh-base mb-2">
                Gunakan tombol shortcut keyboard untuk berpindah dan mengekspor dokumen dalam hitungan detik:
              </p>
              <ul class="small text-muted lh-lg mb-0 ps-3">
                <li><kbd>Ctrl</kbd> + <kbd>P</kbd> : Cetak langsung / Export PDF pada CV Builder, Surat, & Invoice.</li>
                <li><kbd>Alt</kbd> + <kbd>N</kbd> : Buka Quick Capture Scratchpad untuk mencatat ide cepat.</li>
                <li><kbd>Alt</kbd> + <kbd>K</kbd> : Buka Kamera & Scan Dokumen instan.</li>
                <li><kbd>Alt</kbd> + <kbd>T</kbd> : Mulai timer Pomodoro 25 menit fokus.</li>
              </ul>
            </div>
          </div>

          <!-- Hidden Feature 4: Filter Citra Kamera Adaptive Threshold -->
          <div class="col-md-6">
            <div class="p-3.5 bg-light rounded-4 border h-100">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-danger text-white fw-bold">📷 Computer Vision</span>
                <h5 class="fw-bold text-dark mb-0">Pemroses Gambar Dokumen High-Contrast</h5>
              </div>
              <p class="small text-secondary lh-base mb-2">
                Pada menu Kamera & Scan Dokumen, algoritma canvas kami menerapkan filter <strong>Adaptive Grayscale</strong> dan <strong>Magic Document Enhancer</strong> yang mengubah foto kuitansi/dokumen fisik menjadi hitam-putih tajam menyerupai hasil scanner mesin perkantoran resmi.
              </p>
              <div class="small bg-white p-2 rounded border font-monospace text-danger">
                Canvas 2D Context ➔ Pixel Matrix Manipulation ➔ Instant PDF Merge
              </div>
            </div>
          </div>

          <!-- Hidden Feature 5: Zero-Telemetry Privacy -->
          <div class="col-md-6">
            <div class="p-3.5 bg-light rounded-4 border h-100">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-dark text-white fw-bold">🔒 Zero Telemetry</span>
                <h5 class="fw-bold text-dark mb-0">Privasi 100% Client-Side & Tanpa Tracking</h5>
              </div>
              <p class="small text-secondary lh-base mb-0">
                Aplikasi ini tidak memiliki database cloud tersembunyi yang merekam transaksi uang, selfie, atau data kontak Anda. Seluruh query SQL, perhitungan gaji, dan template persuratan diproses murni di JavaScript runtime browser Anda.
              </p>
            </div>
          </div>

          <!-- Hidden Feature 6: WhatsApp Direct Link Converter -->
          <div class="col-md-6">
            <div class="p-3.5 bg-light rounded-4 border h-100">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-success text-white fw-bold">💬 WhatsApp Engine</span>
                <h5 class="fw-bold text-dark mb-0">Normalisasi Nomor Telepon Otomatis</h5>
              </div>
              <p class="small text-secondary lh-base mb-0">
                Saat mengirim Surat atau Invoice via WhatsApp, nomor tujuan berawalan <code>08...</code> atau format tanda baca (misal: <code>0812-3456-7890</code>) akan otomatis dibersihkan dan dikonversi ke kode negara internasional <code>6281234567890</code> tanpa perlu Anda ubah manual.
              </p>
            </div>
          </div>

          <!-- Hidden Feature 7: Multi-Candidate Batch CV Generator -->
          <div class="col-md-6">
            <div class="p-3.5 bg-light rounded-4 border h-100">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-primary text-white fw-bold">👥 Bulk CV Engine</span>
                <h5 class="fw-bold text-dark mb-0">Generator CV Multi-Kandidat (Batch Mode)</h5>
              </div>
              <p class="small text-secondary lh-base mb-2">
                Pada menu CV Builder, aktifkan <strong>Mode Multi-Kandidat</strong> untuk mengelola puluhan resume pelamar kerja dalam satu workspace. Anda dapat mengimpor data teks berformat pipa <code>|</code>, menduplikasi profil pelamar, menyinkronkan 15 layout struktur, dan mencetak seluruh CV sekaligus dengan pemisah halaman cetak (<code>@media print page-break</code>).
              </p>
              <div class="small bg-white p-2 rounded border font-monospace text-primary">
                Bulk Profil Array ➔ 15 Layout Renderer ➔ CSS Print Page-Break
              </div>
            </div>
          </div>

          <!-- Hidden Feature 8: Mail Merge Dynamic Replacement -->
          <div class="col-md-6">
            <div class="p-3.5 bg-light rounded-4 border h-100">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-success text-white fw-bold">✉️ Mail Merge</span>
                <h5 class="fw-bold text-dark mb-0">Engine Pengganti Variabel Surat Massal</h5>
              </div>
              <p class="small text-secondary lh-base mb-2">
                Gunakan placeholder dinamis seperti <code>{{nama}}</code>, <code>{{posisi}}</code>, <code>{{perusahaan}}</code>, dan <code>{{nomor_surat}}</code> di dalam naskah surat. Sistem secara otomatis menyuntikkan data masing-masing penerima saat mencetak massal atau melakukan broadcast WhatsApp.
              </p>
              <div class="small bg-white p-2 rounded border font-monospace text-success">
                Regex Tokenizer ➔ Dynamic Scope Injection ➔ Batch PDF Synthesis
              </div>
            </div>
          </div>

          <!-- Hidden Feature 9: 5-in-1 Task Management Views -->
          <div class="col-md-6">
            <div class="p-3.5 bg-light rounded-4 border h-100">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-info text-white fw-bold">📋 5 View Modes</span>
                <h5 class="fw-bold text-dark mb-0">5 Sudut Pandang Manajemen Tugas Terintegrasi</h5>
              </div>
              <p class="small text-secondary lh-base mb-2">
                Satu basis data tugas (To-Do) dapat dilihat dan dikelola melalui 5 sudut pandang tanpa kehilangan status: <strong>1. Board Kanban</strong> (Drag & Drop), <strong>2. List Prioritas</strong>, <strong>3. Matriks Eisenhower</strong> (Mendesak vs Penting), <strong>4. Kalender Bulanan</strong>, dan <strong>5. Tabel Spreadsheet Data</strong>.
              </p>
              <div class="small bg-white p-2 rounded border font-monospace text-info">
                Vuex Single Source of Truth ➔ Reactive Filter Transformers
              </div>
            </div>
          </div>

          <!-- Hidden Feature 10: Web Audio API & Notification System -->
          <div class="col-md-6">
            <div class="p-3.5 bg-light rounded-4 border h-100">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-warning text-dark fw-bold">🔔 Audio & Alarms</span>
                <h5 class="fw-bold text-dark mb-0">Audio Bell Sintesis & Notifikasi On-Device</h5>
              </div>
              <p class="small text-secondary lh-base mb-2">
                Suara alarm kerja dan lonceng selesai Pomodoro disintesis langsung menggunakan <strong>Web Audio API Oscillator</strong> tanpa perlu mendownload file audio eksternal. Notifikasi on-device juga terpasang otomatis dengan dukungan browser Notification API.
              </p>
              <div class="small bg-white p-2 rounded border font-monospace text-warning">
                AudioContext ➔ Sine/Triangle Oscillator ➔ Notification Permission API
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- TAB 3: PANDUAN INSTALASI PWA (ANDROID, IOS, WINDOWS)      -->
    <!-- ========================================================= -->
    <div v-show="activeTab === 'pwa'" class="mb-4">
      <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
        <div class="d-flex align-items-center gap-3 mb-3 pb-2 border-bottom">
          <div class="bg-success bg-opacity-25 text-success p-3 rounded-circle d-flex align-items-center justify-content-center" style="width: 52px; height: 52px;">
            <i class="bi bi-phone-vibrate fs-2"></i>
          </div>
          <div>
            <span class="badge bg-success text-white fw-bold px-3 py-1 rounded-pill mb-1">📱 Progressive Web App</span>
            <h4 class="fw-extrabold text-dark mb-0">Panduan Pasang Aplikasi ke Layar Utama (PWA Install)</h4>
          </div>
        </div>

        <p class="text-muted small mb-4">
          TaskArts adalah Progressive Web App (PWA) yang dapat diinstall layaknya aplikasi native tanpa memerlukan Google Play Store atau App Store. Aplikasi dapat dibuka secara offline, memiliki ikon mandiri di home screen, dan berjalan dengan layar penuh.
        </p>

        <div class="row g-4">
          <!-- Android Guide -->
          <div class="col-md-4">
            <div class="p-3.5 bg-light rounded-4 border h-100">
              <div class="d-flex align-items-center gap-2 mb-3">
                <i class="bi bi-android2 fs-3 text-success"></i>
                <h6 class="fw-bold text-dark mb-0">Google Chrome di Android</h6>
              </div>
              <ol class="small text-secondary lh-lg mb-0 ps-3">
                <li>Buka situs TaskArts di browser Chrome Android.</li>
                <li>Klik ikon titik tiga (⋮) di sudut kanan atas layar.</li>
                <li>Pilih menu <strong>"Tambahkan ke Layar Utama"</strong> atau <strong>"Install Aplikasi"</strong>.</li>
                <li>Konfirmasi pemasangan. Ikon aplikasi akan muncul di app drawer smartphone Anda.</li>
              </ol>
            </div>
          </div>

          <!-- iOS Guide -->
          <div class="col-md-4">
            <div class="p-3.5 bg-light rounded-4 border h-100">
              <div class="d-flex align-items-center gap-2 mb-3">
                <i class="bi bi-apple fs-3 text-dark"></i>
                <h6 class="fw-bold text-dark mb-0">Safari di iPhone / iPad (iOS)</h6>
              </div>
              <ol class="small text-secondary lh-lg mb-0 ps-3">
                <li>Buka situs di browser Safari iOS.</li>
                <li>Tekan tombol <strong>Share / Bagikan</strong> (ikon kotak dengan panah ke atas di bilah bawah).</li>
                <li>Gulir ke bawah dan pilih <strong>"Add to Home Screen" (Tambah ke Layar Utama)</strong>.</li>
                <li>Beri nama aplikasi lalu tekan <strong>Add</strong> di kanan atas.</li>
              </ol>
            </div>
          </div>

          <!-- Windows / Mac Guide -->
          <div class="col-md-4">
            <div class="p-3.5 bg-light rounded-4 border h-100">
              <div class="d-flex align-items-center gap-2 mb-3">
                <i class="bi bi-laptop fs-3 text-primary"></i>
                <h6 class="fw-bold text-dark mb-0">Chrome / Edge di Windows & Mac</h6>
              </div>
              <ol class="small text-secondary lh-lg mb-0 ps-3">
                <li>Buka aplikasi di Chrome atau Microsoft Edge.</li>
                <li>Lihat ikon monitor kecil bertanda (+) di sisi kanan address bar URL.</li>
                <li>Klik tombol <strong>"Install TaskArts"</strong>.</li>
                <li>Aplikasi akan terbuka di jendela tersendiri tanpa address bar browser.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- TAB 4: ARSITEKTUR, REPO GITHUB & DEVELOPER                -->
    <!-- ========================================================= -->
    <div v-show="activeTab === 'dev'" class="mb-4">
      <div class="row g-4 mb-4">
        <!-- Developer Profile -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
            <div class="d-flex align-items-center gap-3 mb-3 border-bottom pb-3">
              <div class="bg-primary bg-opacity-10 rounded-circle p-3 text-primary d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                <i class="bi bi-person-fill-check fs-2"></i>
              </div>
              <div>
                <span class="badge bg-primary-subtle text-primary rounded-pill px-2.5 py-1 fw-bold small mb-1">Lead Architect & Developer</span>
                <h5 class="fw-extrabold text-dark mb-0">Arif Permana Putrasuryana</h5>
                <small class="text-muted">Creator & Lead Engineer TaskArts</small>
              </div>
            </div>

            <p class="small text-secondary lh-base mb-4">
              TaskArts dikembangkan secara independen oleh Arif Permana Putrasuryana (By Kafeinarts) sebagai solusi sistem operasi produktivitas yang memprioritaskan portabilitas data, privasi penuh tanpa tracking, serta kenyamanan di berbagai perangkat mobile dan desktop.
            </p>

            <h6 class="fw-bold text-dark mb-2 small"><i class="bi bi-link-45deg me-1 text-primary"></i>Media Sosial & Portofolio Resmi:</h6>
            <div class="d-flex flex-column gap-2">
              <a href="https://www.linkedin.com/in/arif-permana-putrasuryana-121b761b9/?locale=in" target="_blank" class="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-between p-2.5 text-start">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-linkedin fs-5 text-primary"></i>
                  <div>
                    <span class="fw-bold text-dark d-block small">LinkedIn Profile</span>
                    <small class="text-muted" style="font-size: 10px;">Arif Permana Putrasuryana</small>
                  </div>
                </div>
                <i class="bi bi-box-arrow-up-right small"></i>
              </a>

              <a href="https://itsmebroarif.medium.com/" target="_blank" class="btn btn-outline-dark rounded-pill d-flex align-items-center justify-content-between p-2.5 text-start">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-medium fs-5 text-dark"></i>
                  <div>
                    <span class="fw-bold text-dark d-block small">Medium Technical Blog</span>
                    <small class="text-muted" style="font-size: 10px;">itsmebroarif.medium.com</small>
                  </div>
                </div>
                <i class="bi bi-box-arrow-up-right small"></i>
              </a>

              <a href="https://www.instagram.com/eexxvvn/" target="_blank" class="btn btn-outline-danger rounded-pill d-flex align-items-center justify-content-between p-2.5 text-start">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-instagram fs-5 text-danger"></i>
                  <div>
                    <span class="fw-bold text-dark d-block small">Instagram Official</span>
                    <small class="text-muted" style="font-size: 10px;">@eexxvvn</small>
                  </div>
                </div>
                <i class="bi bi-box-arrow-up-right small"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- GitHub Repository Card -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm rounded-4 bg-dark text-white p-4 h-100">
            <div class="d-flex align-items-center gap-3 mb-3 border-bottom border-secondary border-opacity-25 pb-3">
              <div class="bg-white bg-opacity-10 rounded-3 p-3 text-white d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                <i class="bi bi-github fs-2"></i>
              </div>
              <div>
                <span class="badge bg-success rounded-pill px-2.5 py-1 fw-bold small mb-1">Open Source Repository</span>
                <h5 class="fw-bold text-white mb-0">itsmebroarif/rajinkerja-id</h5>
                <small class="text-slate-300">Public GitHub Repository</small>
              </div>
            </div>

            <p class="small text-slate-300 lh-base mb-3">
              Source code lengkap TaskArts tersedia secara terbuka di GitHub. Anda dapat melakukan fork, kloning, kontribusi, atau self-hosting aplikasi ini secara gratis.
            </p>

            <div class="p-3 bg-black bg-opacity-50 rounded-3 mb-3 border border-secondary border-opacity-25">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <small class="text-slate-400 font-mono">Git Clone Repository:</small>
                <button @click="copyRepoUrl" class="btn btn-xs btn-outline-light rounded-pill px-2">
                  <i class="bi bi-clipboard me-1"></i> Copy URL
                </button>
              </div>
              <code class="text-success small d-block font-mono text-break">https://github.com/itsmebroarif/rajinkerja-id.git</code>
            </div>

            <a href="https://github.com/itsmebroarif/rajinkerja-id" target="_blank" class="btn btn-primary btn-lg rounded-pill fw-bold w-100 mt-auto d-flex align-items-center justify-content-center gap-2">
              <i class="bi bi-box-arrow-up-right"></i> Buka Repository di GitHub
            </a>
          </div>
        </div>
      </div>

      <!-- Support Developer & Bank Address in Docs -->
      <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
        <BankAddressCards />
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- TAB 5: FAQ & PENCARIAN PERTANYAAN                         -->
    <!-- ========================================================= -->
    <div v-show="activeTab === 'faq'" class="mb-4">
      <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom gap-2">
          <h4 class="fw-bold text-dark mb-0">
            <i class="bi bi-question-square-fill text-primary me-2"></i>Pertanyaan Sering Diajukan (FAQ)
          </h4>
          <div class="input-group style-search" style="max-width: 280px;">
            <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control form-control-sm bg-light border-start-0" placeholder="Cari pertanyaan..." v-model="faqSearch" />
          </div>
        </div>

        <div class="accordion accordion-flush" id="faqAccordion">
          <div v-for="(item, idx) in filteredFaqs" :key="idx" class="accordion-item border-bottom py-2">
            <h2 class="accordion-header" :id="'heading' + idx">
              <button class="accordion-button collapsed fw-bold text-dark px-0 bg-transparent fs-6" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + idx" aria-expanded="false" :aria-controls="'collapse' + idx">
                <i class="bi bi-check2-circle text-primary me-2"></i>
                {{ item.question }}
              </button>
            </h2>
            <div :id="'collapse' + idx" class="accordion-collapse collapse" :aria-labelledby="'heading' + idx" data-bs-parent="#faqAccordion">
              <div class="accordion-body px-0 text-secondary lh-lg small" v-html="item.answer"></div>
            </div>
          </div>

          <div v-if="filteredFaqs.length === 0" class="text-center py-4 text-muted">
            Tidak ditemukan FAQ yang sesuai dengan kata kunci "{{ faqSearch }}".
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { sendOnDeviceNotification } from '../utils/notification';
import BankAddressCards from '../components/BankAddressCards.vue';
import MenuTutorialsTab from '../components/MenuTutorialsTab.vue';

export default {
  name: 'FaqAboutView',
  components: {
    BankAddressCards,
    MenuTutorialsTab
  },
  setup() {
    const activeTab = ref('tutorials');
    const moduleDocSearch = ref('');
    const faqSearch = ref('');
    const isOnline = ref(navigator.onLine);

    // 20 Comprehensive Module Documentations
    const moduleDocs = ref([
      {
        id: 'cv',
        title: 'ATS CV & 15 Layout Resume Generator',
        icon: '📄',
        badge: 'Karir & Multi-Kandidat',
        route: '/cv',
        purpose: 'Menyusun Curriculum Vitae (CV) terstandarisasi Applicant Tracking System (ATS) internasional untuk 1 profil maupun banyak kandidat sekaligus (Bulk Batch CV) dengan 15 jenis arsitektur layout dan cetak PDF instan.',
        highlights: [
          '15 Varian Layout Struktur: ATS Single Column Classic, Executive Horizon, Split Sidebar Left (32:68), Split Sidebar Right (68:32), Nordic Slate, Tech Developer Emerald, Compact One-Page Fit, Harvard Academic Serif, Creative Accent Banner, Swiss High-Contrast Grid, Timeline Flow, Dual Balanced 50:50, Functional Skills-First, Boxed Framed Executive, dan Startup Sleek.',
          'Mode Multi-Kandidat (Bulk CV Generator): Kelola banyak profil pelamar kerja/karyawan sekaligus, duplikasi profil, impor teks multi-baris otomatis, dan cetak semua CV dalam 1 batch PDF dengan auto page-break.',
          'Real-time ATS Score Engine: Algoritma cerdas yang mengevaluasi kelengkapan kontak, ringkasan profil, bobot pengalaman kerja, metrik pencapaian, dan rasio kata kunci (Skor 0-100 & Grade A/B/C).',
          'Kustomisasi Desain Penuh: Pemilih warna aksen kustom (HEX), palet warna korporat, 3 pilihan tipografi (Modern Sans, Classic Serif, Technical Mono), serta unggah avatar foto profil.',
          'Portabilitas JSON: Ekspor dan impor file `.json` untuk mencadangkan seluruh profil kandidat.'
        ],
        tip: 'Gunakan fitur "Samakan Layout Semua" pada Mode Multi-Kandidat untuk menerapkan desain yang seragam ke seluruh profil dalam satu kali klik.'
      },
      {
        id: 'surat',
        title: 'Generator Surat Resmi & Kop Surat Custom',
        icon: '✉️',
        badge: 'Administrasi & Bulk Mail Merge',
        route: '/surat',
        purpose: 'Membuat naskah dinas, surat lamaran kerja, izin, penawaran harga, dan perjanjian kerja untuk 1 penerima maupun massal (Bulk Mail Merge) dengan Kop Surat otomatis dan tanda tangan digital.',
        highlights: [
          '12 Template Naskah Dinas Siap Pakai: Surat Lamaran Kerja, Pengunduran Diri (Resign), Pengalaman Kerja (Pakelaring), Penawaran Harga Proyek, Tugas Kedinasan (SPTD), Surat Kuasa, Peringatan Karyawan (SP-1), Perjanjian Kerja (MoU/PKWT), Keterangan Aktif Bekerja, Permohonan Magang, Undangan Resmi, dan Rekomendasi Karir.',
          'Custom Logo & Kop Surat Instansi: Unggah logo perusahaan/instansi (PNG/JPG), atur tinggi logo (pixel slider), posisi tata letak (kiri, tengah, kanan), serta garis ganda tebal-tipis khas surat dinas.',
          'Bulk Mail Merge (Multi-Penerima): Masukkan puluhan daftar penerima via tabel atau impor teks berformat, gunakan placeholder dinamis {{nama}}, {{posisi}}, {{perusahaan}}, dan {{nomor_surat}} untuk menghasilkan surat massal otomatis.',
          'Broadcast WhatsApp Massal: Kirim pesan konfirmasi surat ke seluruh penerima dengan konversi otomatis nomor 08 ke format internasional 628.',
          'Tanda Tangan Digital: Unggah gambar tanda tangan transparan atau gunakan placeholder tanda tangan resmi.'
        ],
        tip: 'Gunakan tombol "Nomor Otomatis" di tab Mode Massal untuk menomori seluruh surat penerima secara berurutan dalam hitungan detik.'
      },
      {
        id: 'rab',
        title: 'RAB & Kas Kepanitiaan',
        icon: '📊',
        badge: 'Budgeting & Event',
        route: '/rab',
        purpose: 'Menyusun Rencana Anggaran Biaya (RAB) proyek/kepanitiaan, mencatat realisasi kas masuk dan kas keluar, serta menghitung surplus/defisit anggaran secara otomatis.',
        highlights: [
          'Ringkasan Finansial Real-time: Total Rencana Anggaran, Total Kas Masuk, Total Kas Keluar, dan Sisa Saldo Kas Aktual.',
          'Indikator Status Anggaran Otomatis: Menampilkan label "Hemat", "Sesuai Target RAB", atau "Over Budget" beserta nominal selisihnya.',
          'Pencatatan Realisasi Transaksi Kas: Catat setiap pengeluaran riil per nota dengan tanggal, divisi penanggung jawab, dan nomor bukti belanja.',
          'Ekspor Lengkap: Unduh laporan pembukuan ke format Spreadsheet Excel (XLSX), CSV, dan file JSON backup.'
        ],
        tip: 'Catat setiap transaksi belanja di tab "Catat Pengeluaran Kas" agar realisasi dana terkontrol rapi dan tidak melebihi alokasi anggaran.'
      },
      {
        id: 'finance',
        title: 'Keuangan & Money Tracker',
        icon: '💰',
        badge: 'Arus Kas & Excel',
        route: '/finance',
        purpose: 'Mencatat pemasukan dan pengeluaran harian, mengelola kategori belanja, memantau batas anggaran (budget threshold), serta spreadsheet mini rumus Excel.',
        highlights: [
          'Grafik visualisasi arus kas bulanan dan persentase kategori pengeluaran.',
          'Indikator peringatan "Over Budget" jika pengeluaran melebihi batas yang ditentukan.',
          'Export data transaksi ke CSV dan PDF laporan keuangan berkala.'
        ],
        tip: 'Atur batas budget bulanan di menu Preferences agar sistem otomatis memberi alert warna merah saat anggaran menipis.'
      },
      {
        id: 'invoice',
        title: 'Invoice Generator PDF',
        icon: '🧾',
        badge: 'Billing & Faktur',
        route: '/invoice',
        purpose: 'Menerbitkan faktur tagihan pembayaran profesional untuk klien dengan perhitungan pajak PPN, diskon, dan status pembayaran.',
        highlights: [
          'Dukungan multi-item tagihan dengan perhitungan subtotal otomatis.',
          'Pajak PPN kustom dan opsi diskon potongan harga nominal/persen.',
          'Cetak langsung ke format PDF standar billing internasional atau bagikan via WhatsApp.'
        ],
        tip: 'Simpan data bisnis Anda di profil agar nama perusahaan dan nomor rekening bank otomatis terisi pada setiap invoice baru.'
      },
      {
        id: 'tasks',
        title: 'To-Do List & Kanban Board',
        icon: '✅',
        badge: 'Manajemen Tugas',
        route: '/todo',
        purpose: 'Mengorganisir tugas harian dan target deadline dengan 5 mode tampilan: Board Kanban, List Prioritas, Matriks Eisenhower, Kalender, dan Tabel.',
        highlights: [
          'Matriks Eisenhower: Memisahkan tugas Mendesak vs Penting untuk fokus maksimal.',
          'Drag and Drop kartu tugas antar kolom To-Do, In Progress, dan Done.',
          'Pengingat deadline otomatis dan filter label proyek.'
        ],
        tip: 'Tugas yang diberi tanda bintang penting akan mendapatkan prioritas teratas di widget dashboard utama.'
      },
      {
        id: 'project',
        title: 'Proyek & Kontrak Klien',
        icon: '💼',
        badge: 'Milestone & Progres',
        route: '/project',
        purpose: 'Mengelola portofolio proyek kantor/freelance, memantau progres milestone per persentase (%), nilai kontrak, dan termin pembayaran.',
        highlights: [
          'Progress bar progres pengerjaan proyek dari 0% hingga 100%.',
          'Pencatatan termin Down Payment (DP) dan sisa pelunasan klien.',
          'Integrasi langsung dengan modul Invoice dan Kontak Klien.'
        ],
        tip: 'Hubungkan proyek dengan modul Keuangan agar penerimaan DP langsung tercatat sebagai kas masuk.'
      },
      {
        id: 'camera',
        title: 'Kamera & Scanner Dokumen',
        icon: '📸',
        badge: 'Vision & OCR',
        route: '/camera',
        purpose: 'Memindai kuitansi fisik, nota belanja, atau dokumen kertas langsung dari kamera HP/laptop dengan filter pembersih citra berkas.',
        highlights: [
          'Filter Adaptive Grayscale & High-Contrast untuk menghasilkan pindaian dokumen bersih.',
          'Simpan hasil scan ke galeri dokumen, unduh sebagai PNG, atau gabungkan ke berkas PDF.',
          'Dukungan kamera depan dan belakang dengan kontrol resolusi tinggi.'
        ],
        tip: 'Pastikan pencahayaan cukup saat memindai nota untuk mendapatkan kontras teks optimal.'
      },
      {
        id: 'insights',
        title: 'Productivity Insights & D3.js',
        icon: '📈',
        badge: 'Analitik & Grafik',
        route: '/productivity-insights',
        purpose: 'Menganalisis performa kerja dan efisiensi waktu harian melalui grafik interaktif visual yang ditenagai oleh D3.js.',
        highlights: [
          'Visualisasi tren penyelesaian tugas harian dan mingguan.',
          'Rasio distribusi waktu kerja produktif vs sesi istirahat.',
          'Heatmap aktivitas komitmen kerja harian.'
        ],
        tip: 'Rutin menyelesaikan tugas di To-Do List agar grafik produktivitas Anda tercatat hijau setiap hari.'
      },
      {
        id: 'time',
        title: 'Time Suite & Pomodoro',
        icon: '⏱️',
        badge: 'Fokus & Interval',
        route: '/time-suite',
        purpose: 'Meningkatkan konsentrasi kerja menggunakan teknik Pomodoro 25 menit kerja dan 5 menit jeda istirahat dengan audio bell notifikasi.',
        highlights: [
          'Timer Pomodoro dengan siklus otomatis dan interval long break.',
          'Stopwatch presisi milidetik untuk mengukur durasi pengerjaan task.',
          'Jam dunia untuk koordinasi zona waktu meeting internasional.'
        ],
        tip: 'Jalankan Pomodoro di latar belakang; aplikasi akan membunyikan lonceng saat sesi kerja berakhir.'
      },
      {
        id: 'selfie',
        title: 'Selfie for Happiness',
        icon: '🤳',
        badge: 'Mental Health',
        route: '/selfie',
        purpose: 'Mengabadikan foto senyum kebahagiaan harian saat bekerja untuk menjaga kesehatan mental dan merefleksikan suasana hati tim.',
        highlights: [
          'Galeri foto harian lokal dengan caption catatan momen bahagia.',
          'Fitur backup gambar otomatis dan unduh galeri kenangan kerja.',
          'Privasi lokal murni tanpa upload ke server luar.'
        ],
        tip: 'Ambil 1 foto selfie di awal atau akhir jam kerja sebagai rekam jejak mood positif Anda.'
      },
      {
        id: 'mood',
        title: 'Kamera Mood & Alarm Kerja',
        icon: '⏰',
        badge: 'Deteksi Emosi & Alarm',
        route: '/mood',
        purpose: 'Deteksi ekspresi suasana hati melalui webcam serta sistem alarm jadwal kerja resmi (08:00 mulai, 12:00 istirahat, 13:00 masuk, 17:00 pulang).',
        highlights: [
          'Alarm terjadwal dengan pilihan suara lonceng, sirene, dan chime.',
          'Log riwayat mood harian untuk evaluasi tingkat stres kerja.',
          'Notifikasi on-device saat jam istirahat tiba.'
        ],
        tip: 'Aktifkan izin notifikasi browser agar alarm jam kerja tetap berbunyi saat tab terminimalkan.'
      },
      {
        id: 'notes',
        title: 'Sticky Notes & Scratchpad',
        icon: '📝',
        badge: 'Catatan Cepat',
        route: '/notes',
        purpose: 'Papan catatan tempel virtual untuk mencoret ide spontan, nomor telepon sementara, atau draf memo kerja dengan kode warna.',
        highlights: [
          'Warna sticky note bervariasi (kuning, hijau, biru, pink, ungu).',
          'Pencarian instan kata kunci catatan dan pin catatan penting ke atas.',
          'Ekspor memo ke file teks atau simpan permanen ke penyimpanan lokal.'
        ],
        tip: 'Gunakan shortcut Alt+N untuk membuka modul catatan cepat dari halaman manapun.'
      },
      {
        id: 'code',
        title: 'Code Snippets & Tech Notes',
        icon: '💻',
        badge: 'Developer Snippets',
        route: '/code-notes',
        purpose: 'Buku catatan khusus potongan kode pemrograman (JavaScript, Python, HTML, CSS, SQL) dengan penyorot sintaks (syntax highlighting).',
        highlights: [
          'Editor kode dengan pewarnaan sintaks rapi dan tombol 1-klik salin ke clipboard.',
          'Kategorisasi tag bahasa pemrograman dan pencarian cepat.',
          'Simpan konfigurasi skrip, query database, dan snippet API penting.'
        ],
        tip: 'Simpan query SQL yang sering dipakai di sini agar mudah dijalankan pada modul SQL Data Export.'
      },
      {
        id: 'contacts',
        title: 'Kontak Tim & WhatsApp CRM',
        icon: '👥',
        badge: 'Direktori & WA',
        route: '/contacts',
        purpose: 'Direktori rekan kerja, klien, dan vendor dengan fitur kirim pesan WhatsApp langsung tanpa harus menyimpan nomor di HP.',
        highlights: [
          'Quick WhatsApp chat opener dengan format nomor Indonesia otomatis.',
          'Kategorisasi kontak: Klien VIP, Tim Internal, Vendor, dan Rekan Kerja.',
          'Terhubung langsung ke modul Surat Generator dan Invoice.'
        ],
        tip: 'Kelompokkan klien VIP Anda agar mudah dihubungi saat pengiriman invoice atau penawaran baru.'
      },
      {
        id: 'videos',
        title: 'Tonton & Sync Video Hub',
        icon: '🎥',
        badge: 'Media & YouTube',
        route: '/videos',
        purpose: 'Pusat tontonan video pembelajaran, tutorial kerja, dan sinkronisasi playlist YouTube untuk menemani sesi belajar/kerja.',
        highlights: [
          'Pemutar video YouTube terintegrasi tanpa gangguan iklan luar.',
          'Daftar putar video tutorial coding, desain UI/UX, dan manajemen bisnis.',
          'Simpan link video favorit pribadi ke koleksi lokal.'
        ],
        tip: 'Simpan URL video tutorial penting untuk ditonton ulang kapan saja tanpa repot mencari di browser.'
      },
      {
        id: 'sql',
        title: 'SQL Data Export & Runner',
        icon: '🗄️',
        badge: 'Database & SQL',
        route: '/sql',
        purpose: 'Mengekspor seluruh tabel aplikasi ke skrip SQL DDL & DML, menjalankan query SQLite virtual, dan membackup skema database.',
        highlights: [
          'Generator otomatis perintah CREATE TABLE dan INSERT INTO untuk MySQL / PostgreSQL.',
          'Ekspor file `.sql` untuk keperluan migrasi sistem atau developer.',
          'Runner query lokal untuk menguji logika filter data.'
        ],
        tip: 'Ekspor berkas SQL secara berkala jika Anda ingin memindahkan data lokal ke server database perusahaan.'
      },
      {
        id: 'chatai',
        title: 'Live Chat AI Assistant',
        icon: '🤖',
        badge: 'Asisten Cerdas',
        route: '/chat-ai',
        purpose: 'Konsultasi ide kerja, pembuatan draf email, perbaikan kode pemrograman, dan brainstorming strategi bersama AI.',
        highlights: [
          'Dukungan integrasi Google Gemini API dengan respons super cepat.',
          'Template prompt karir, pemrograman, bisnis, dan revisi naskah.',
          'Riwayat percakapan yang dapat disimpan dan disalin.'
        ],
        tip: 'Gunakan template prompt yang tersedia di panel samping untuk mempercepat perumusan pertanyaan.'
      },
      {
        id: 'games',
        title: '3D Mini Games & Anti-Stres',
        icon: '🎮',
        badge: 'Relaksasi Kerja',
        route: '/games',
        purpose: 'Kumpulan 20 mini game santai (TicTacToe, Snake, 2048, Math Quiz, Speed Clicker, 3D Runner) untuk mengistirahatkan pikiran di sela jam kerja.',
        highlights: [
          '20 permainan interaktif tanpa perlu koneksi internet.',
          'Pencatatan rekor skor tertinggi (High Score) harian.',
          'Simulator visual 3D untuk menyegarkan fokus otak.'
        ],
        tip: 'Mainkan 1 ronde game saat jeda istirahat Pomodoro 5 menit untuk menyegarkan konsentrasi.'
      },
      {
        id: 'preferences',
        title: 'Preferences & Backup Restore',
        icon: '⚙️',
        badge: 'Pusat Pengaturan',
        route: '/preferences',
        purpose: 'Pusat kontrol warna tema Material, mode gelap/terang, pengaturan notifikasi on-device, dan Full App Data Backup & Recovery.',
        highlights: [
          'Ganti tema warna aksen Material Design sesuai selera Anda.',
          'Full Backup JSON: Download seluruh isi aplikasi dalam 1 berkas aman.',
          'Full Recovery: Pulihkan seluruh data dengan 1 klik dari file cadangan.'
        ],
        tip: 'Lakukan backup JSON setiap minggu dan simpan filenya di Google Drive atau flashdisk Anda.'
      }
    ]);

    const filteredModuleDocs = computed(() => {
      if (!moduleDocSearch.value.trim()) return moduleDocs.value;
      const q = moduleDocSearch.value.toLowerCase();
      return moduleDocs.value.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.purpose.toLowerCase().includes(q) ||
        m.badge.toLowerCase().includes(q)
      );
    });

    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine;
    };

    onMounted(() => {
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
    });

    onUnmounted(() => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    });

    const copyRepoUrl = () => {
      navigator.clipboard.writeText('https://github.com/itsmebroarif/rajinkerja-id.git');
      sendOnDeviceNotification('📋 URL Repository Disalin!', {
        body: 'https://github.com/itsmebroarif/rajinkerja-id.git telah tersimpan di clipboard.',
        type: 'success'
      });
    };

    const faqs = [
      {
        question: 'Bagaimana cara menggunakan 15 varian layout pada CV Builder?',
        answer: 'Buka menu <strong>CV & Resume Builder</strong> ➔ Isi wizard data kontak, pengalaman, pendidikan, dan skills ➔ Pada <strong>Langkah 5 (15 Layout Desain)</strong>, pilih salah satu arsitektur layout (misal: Modern Single Col, Harvard Serif, Sidebar 32:68, Timeline, atau Creative Banner). Tampilan preview di sebelah kanan akan seketika berubah mengikuti struktur yang dipilih dan siap dicetak ke PDF.'
      },
      {
        question: 'Bagaimana cara mengganti gambar/logo pada Kop Surat resmi?',
        answer: 'Buka menu <strong>Surat Generator</strong> ➔ Pada form editor pilih tab <strong>"Kop & Logo"</strong> ➔ Klik tombol <strong>Upload Logo Baru</strong> untuk memasukkan file logo instansi (PNG/JPG) atau pilih salah satu preset logo instansi yang tersedia. Anda juga dapat mengatur posisi logo (kiri/tengah/kanan), ukuran tinggi logo (slider piksel), serta memilih model garis ganda resmi.'
      },
      {
        question: 'Bagaimana cara mencadangkan (backup) dan memulihkan (restore) seluruh data aplikasi?',
        answer: 'Buka menu <strong>Preferences</strong> ➔ Pada bagian <em>Pencadangan & Pemulihan Seluruh Data</em>, klik tombol <strong>Ekspor Semua Data (Full Backup)</strong> untuk mengunduh berkas `.json`. Untuk memulihkan, pilih file JSON cadangan Anda lalu klik tombol <strong>Pulihkan & Timpa (Full Recovery)</strong>.'
      },
      {
        question: 'Apakah TaskArts dapat digunakan saat tidak ada jaringan internet (Offline)?',
        answer: 'Ya, 100%! Aplikasi ini dirancang dengan prinsip <em>Offline-First</em> dan Service Worker PWA. Semua data Anda tersimpan di memori lokal peramban (localStorage) sehingga aplikasi tetap dapat dibuka dan digunakan dengan lancar di mana saja tanpa koneksi internet.'
      },
      {
        question: 'Bagaimana cara menginstall aplikasi ini ke layar utama HP Android atau iPhone?',
        answer: 'Di Android (Chrome), tekan menu titik tiga (⋮) di kanan atas lalu pilih <strong>"Tambahkan ke Layar Utama"</strong>. Di iOS (Safari), tekan tombol <strong>Share</strong> lalu pilih <strong>"Add to Home Screen"</strong>.'
      }
    ];

    const filteredFaqs = computed(() => {
      if (!faqSearch.value.trim()) return faqs;
      const q = faqSearch.value.toLowerCase();
      return faqs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
    });

    return {
      activeTab,
      moduleDocSearch,
      faqSearch,
      isOnline,
      moduleDocs,
      filteredModuleDocs,
      faqs,
      filteredFaqs,
      copyRepoUrl
    };
  }
};
</script>

<style scoped>
.style-search {
  border-radius: 20px;
  overflow: hidden;
}
.backdrop-blur {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.btn-xs {
  font-size: 11px;
}
.hover-shadow:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.08) !important;
}
</style>
