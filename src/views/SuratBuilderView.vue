<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border">
      <div>
        <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
          <span class="badge bg-danger text-white fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-file-earmark-check-fill me-1"></i> Persuratan Resmi Indonesia
          </span>
          <span class="badge bg-primary text-white fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-image me-1"></i> Custom Logo Kop Surat
          </span>
          <span class="badge bg-success text-white fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-collection-fill me-1"></i> 12 Template Siap Pakai
          </span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">✉️ Generator Surat Resmi & Desain Kop Surat Custom</h2>
        <p class="text-muted mb-0">Buat surat kedinasan, lamaran, izin, penawaran, dan perjanjian kerja dengan Kop Surat otomatis, logo instansi kustom, dan cetak PDF standar instansi.</p>
      </div>

      <div class="d-flex flex-wrap align-items-center gap-2">
        <button class="btn btn-outline-warning text-dark rounded-pill px-3 fw-semibold" @click="exportSuratJson" title="Download data Surat sebagai JSON">
          <i class="bi bi-filetype-json text-warning me-1"></i> Export JSON
        </button>
        <button class="btn btn-outline-info text-dark rounded-pill px-3 fw-semibold" @click="triggerImportSuratJson" title="Import data Surat dari JSON">
          <i class="bi bi-upload text-info me-1"></i> Import JSON
        </button>
        <input type="file" ref="suratJsonInput" accept=".json" class="d-none" @change="onSuratJsonSelected" />
        <button class="btn btn-outline-success rounded-pill px-3 fw-semibold" @click="saveLetter">
          <i class="bi bi-floppy me-1"></i> Simpan Surat
        </button>
        <button class="btn btn-success rounded-pill px-3.5 fw-bold shadow-sm" @click="openWaModal">
          <i class="bi bi-whatsapp me-1"></i> Kirim Text via WA
        </button>
        <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" @click="printLetter">
          <i class="bi bi-printer me-1"></i> Cetak / Save PDF
        </button>
      </div>
    </div>

    <!-- Letter Templates Gallery Carousel / Grid -->
    <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold text-dark mb-0"><i class="bi bi-collection text-primary me-2"></i>Pilih 12 Template Surat Siap Pakai</h5>
        <div class="d-flex gap-1">
          <button
            v-for="cat in templateCategories"
            :key="cat.id"
            class="btn btn-xs rounded-pill px-2.5 py-1"
            :class="activeTemplateCat === cat.id ? 'btn-primary fw-bold' : 'btn-light border text-muted'"
            @click="activeTemplateCat = cat.id"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <div class="row g-3">
        <div v-for="tmpl in filteredTemplates" :key="tmpl.id" class="col-6 col-md-4 col-lg-3">
          <div
            class="card h-100 border-2 rounded-3 p-3 cursor-pointer transition-all text-center hover-shadow"
            :class="selectedTemplateId === tmpl.id ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'border-light bg-light'"
            @click="selectTemplate(tmpl)"
          >
            <div class="p-2 rounded-circle bg-white shadow-sm d-inline-block mx-auto mb-2" style="width: 44px; height: 44px;">
              <i :class="tmpl.icon" class="fs-4 text-primary"></i>
            </div>
            <h6 class="fw-bold text-dark small mb-1 text-truncate">{{ tmpl.title }}</h6>
            <span class="badge bg-secondary-subtle text-secondary small rounded-pill">{{ tmpl.category }}</span>
            <small class="d-block text-muted mt-1" style="font-size: 10px;">{{ tmpl.desc }}</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Editor & Preview Grid -->
    <div class="row g-4">
      <!-- Form Controls -->
      <div class="col-lg-5">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
          <h5 class="fw-bold text-dark mb-3 border-bottom pb-2">
            <i class="bi bi-pencil-square text-primary me-2"></i>Pengaturan & Isi Surat
          </h5>

          <!-- Nav Tabs for Form: Kop Surat, Metadata, Isi & Tanda Tangan -->
          <ul class="nav nav-pills nav-fill mb-3 bg-light p-1 rounded-3">
            <li class="nav-item">
              <button class="nav-link py-1.5 small fw-semibold" :class="{ active: formTab === 'kop' }" @click="formTab = 'kop'">
                <i class="bi bi-image me-1"></i> Kop & Logo
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link py-1.5 small fw-semibold" :class="{ active: formTab === 'meta' }" @click="formTab = 'meta'">
                <i class="bi bi-card-heading me-1"></i> Metadata
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link py-1.5 small fw-semibold" :class="{ active: formTab === 'body' }" @click="formTab = 'body'">
                <i class="bi bi-text-paragraph me-1"></i> Isi Surat
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link py-1.5 small fw-semibold" :class="{ active: formTab === 'sign' }" @click="formTab = 'sign'">
                <i class="bi bi-pen me-1"></i> TTD & Cap
              </button>
            </li>
          </ul>

          <!-- ===================================== -->
          <!-- TAB 1: KOP SURAT & LOGO CUSTOMIZATION -->
          <!-- ===================================== -->
          <div v-show="formTab === 'kop'">
            <div class="form-check form-switch mb-3 bg-light p-3 rounded-3 border">
              <input class="form-check-input" type="checkbox" id="enableKop" v-model="letter.showKop" />
              <label class="form-check-label fw-bold text-dark small" for="enableKop">
                Aktifkan Kop Surat Resmi (Header Instansi)
              </label>
            </div>

            <div v-if="letter.showKop" class="p-3 bg-light border rounded-3 mb-3">
              <!-- Logo Upload & Presets -->
              <div class="mb-3">
                <label class="form-label fw-bold text-dark small">Gambar Logo Kop Surat</label>
                <div class="d-flex align-items-center gap-2 mb-2">
                  <input type="file" ref="logoInput" accept="image/*" class="d-none" @change="onLogoSelected" />
                  <button type="button" class="btn btn-sm btn-primary rounded-pill px-3" @click="$refs.logoInput.click()">
                    <i class="bi bi-upload me-1"></i> Upload Logo Baru
                  </button>
                  <button v-if="letter.kopLogo" type="button" class="btn btn-sm btn-outline-danger rounded-pill px-2" @click="letter.kopLogo = ''" title="Hapus logo">
                    <i class="bi bi-trash"></i> Hapus
                  </button>
                  <span v-if="letter.kopLogo" class="badge bg-success text-white small">Logo Terpasang</span>
                </div>

                <!-- Ready Preset Logos -->
                <div class="small text-muted mb-1">Atau pilih Logo Preset Instansi:</div>
                <div class="d-flex flex-wrap gap-1.5">
                  <button
                    v-for="preset in logoPresets"
                    :key="preset.id"
                    type="button"
                    class="btn btn-xs rounded-pill"
                    :class="letter.kopLogoPreset === preset.id ? 'btn-dark' : 'btn-outline-secondary'"
                    @click="applyLogoPreset(preset)"
                  >
                    {{ preset.name }}
                  </button>
                </div>
              </div>

              <!-- Logo Placement & Size -->
              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label fw-semibold text-muted small mb-1">Posisi Logo:</label>
                  <select class="form-select form-select-sm" v-model="letter.kopLogoPosition">
                    <option value="left">Kiri (Standar)</option>
                    <option value="center">Tengah Atas</option>
                    <option value="right">Kanan</option>
                  </select>
                </div>
                <div class="col-6">
                  <label class="form-label fw-semibold text-muted small mb-1">Ukuran Logo (px): {{ letter.kopLogoHeight }}px</label>
                  <input type="range" class="form-range" min="35" max="95" step="5" v-model="letter.kopLogoHeight" />
                </div>
              </div>

              <!-- Kop Text Details -->
              <div class="mb-2">
                <label class="form-label fw-bold text-dark small">Nama Lembaga / Perusahaan (Huruf Besar)</label>
                <input type="text" class="form-control form-control-sm" v-model="letter.kopName" placeholder="PT RAJINKERJA GLOBAL INDONESIA" />
              </div>
              <div class="mb-2">
                <label class="form-label fw-bold text-dark small">Sub-Nama / Unit Kerja / Departemen</label>
                <input type="text" class="form-control form-control-sm" v-model="letter.kopSubname" placeholder="DIVISI PENGEMBANGAN TEKNOLOGI & INOVASI" />
              </div>
              <div class="mb-2">
                <label class="form-label fw-bold text-dark small">Alamat Lengkap & Kontak</label>
                <input type="text" class="form-control form-control-sm" v-model="letter.kopAddress" placeholder="Gedung Menara RajinKerja Lt. 12, Jl. Jend. Sudirman No. 88 Jakarta | Telp: (021) 555-1234" />
              </div>
              <div class="mb-2">
                <label class="form-label fw-bold text-dark small">Email & Website</label>
                <input type="text" class="form-control form-control-sm" v-model="letter.kopContact" placeholder="Email: info@rajinkerja.id | Website: www.rajinkerja.id | Kode Pos 12190" />
              </div>

              <!-- Kop Divider Style -->
              <div class="mb-2">
                <label class="form-label fw-semibold text-muted small mb-1">Garis Pembatas Kop:</label>
                <select class="form-select form-select-sm" v-model="letter.kopStyle">
                  <option value="double">Garis Ganda Resmi (Tebal & Tipis - Standar Instansi)</option>
                  <option value="single">Garis Tunggal Modern</option>
                  <option value="thick">Garis Tunggal Tebal</option>
                  <option value="none">Tanpa Garis</option>
                </select>
              </div>
            </div>
          </div>

          <!-- ===================================== -->
          <!-- TAB 2: METADATA SURAT                 -->
          <!-- ===================================== -->
          <div v-show="formTab === 'meta'">
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Nomor Surat</label>
                <input type="text" class="form-control form-control-sm" v-model="letter.number" placeholder="001/SK/RK/VIII/2026" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Kota & Tanggal Surat</label>
                <div class="input-group input-group-sm">
                  <input type="text" class="form-control" v-model="letter.city" placeholder="Jakarta" style="max-width: 90px;" />
                  <input type="date" class="form-control" v-model="letter.date" />
                </div>
              </div>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Lampiran (Opsional)</label>
                <input type="text" class="form-control form-control-sm" v-model="letter.attachment" placeholder="1 (Satu) Berkas Proposal" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Perihal / Hal Surat</label>
                <input type="text" class="form-control form-control-sm" v-model="letter.subject" placeholder="Surat Penawaran Kerjasama" />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold text-dark small">Penerima / Kepada Yth.</label>
              <input type="text" class="form-control form-control-sm mb-1" v-model="letter.recipientName" placeholder="Bapak / Ibu Pimpinan PT Mitra Utama" />
              <input type="text" class="form-control form-control-sm mb-1" v-model="letter.recipientTitle" placeholder="Direktur Operasional / HRD Manager" />
              <input type="text" class="form-control form-control-sm" v-model="letter.recipientAddress" placeholder="Di Tempat / Jakarta Selatan" />
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold text-dark small">Salam Pembuka</label>
              <input type="text" class="form-control form-control-sm" v-model="letter.salutation" placeholder="Dengan hormat," />
            </div>
          </div>

          <!-- ===================================== -->
          <!-- TAB 3: ISI & NARASI SURAT             -->
          <!-- ===================================== -->
          <div v-show="formTab === 'body'">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="form-label fw-bold text-dark small mb-0">Isi Surat / Narasi Utama</label>
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-xs btn-outline-primary rounded-pill px-2 py-0.5" @click="insertNewParagraph" title="Tambah Paragraf Baru">
                  <i class="bi bi-plus-circle me-1"></i> + Paragraf
                </button>
                <button type="button" class="btn btn-xs btn-outline-secondary rounded-pill px-2 py-0.5 ms-1" @click="insertBulletList" title="Tambah Poin Rincian">
                  <i class="bi bi-list-task me-1"></i> + Poin
                </button>
              </div>
            </div>
            <textarea class="form-control form-control-sm border-2 rounded-3" rows="11" v-model="letter.bodyContent" placeholder="Tuliskan isi surat lengkap di sini..."></textarea>
            <div class="form-text small text-muted mt-1" style="font-size: 0.78rem;">
              <i class="bi bi-info-circle text-primary me-1"></i>Tekan <code>Enter</code> 2x untuk membuat alinea baru yang menjorok otomatis.
            </div>

            <div class="mt-3">
              <label class="form-label fw-bold text-dark small">Salam Penutup</label>
              <input type="text" class="form-control form-control-sm" v-model="letter.closing" placeholder="Hormat kami," />
            </div>
          </div>

          <!-- ===================================== -->
          <!-- TAB 4: TANDA TANGAN & STEMPEL CAP     -->
          <!-- ===================================== -->
          <div v-show="formTab === 'sign'">
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Nama Penandatangan</label>
                <input type="text" class="form-control form-control-sm" v-model="letter.signerName" placeholder="Arif Permana, S.Kom" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Jabatan Penandatangan</label>
                <input type="text" class="form-control form-control-sm" v-model="letter.signerTitle" placeholder="Direktur Utama" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">NIP / NIK / No. Karyawan (Opsional)</label>
                <input type="text" class="form-control form-control-sm" v-model="letter.signerNip" placeholder="NIP. 19850115 201001 1 002" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark small">Posisi Tanda Tangan</label>
                <select class="form-select form-select-sm" v-model="letter.signaturePosition">
                  <option value="right">Kanan Bawah (Standar)</option>
                  <option value="left">Kiri Bawah</option>
                  <option value="center">Tengah Bawah</option>
                </select>
              </div>
            </div>

            <!-- Upload Signature & Stamp Image -->
            <div class="p-3 bg-light border rounded-3 mb-3">
              <label class="form-label fw-bold text-dark small">Gambar Tanda Tangan / Stempel Digital (Opsional)</label>
              <div class="d-flex align-items-center gap-2 mb-2">
                <input type="file" ref="signInput" accept="image/*" class="d-none" @change="onSignSelected" />
                <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="$refs.signInput.click()">
                  <i class="bi bi-pen me-1"></i> Upload TTD (PNG Transparan)
                </button>
                <button v-if="letter.signatureImage" type="button" class="btn btn-sm btn-outline-danger rounded-pill px-2" @click="letter.signatureImage = ''" title="Hapus TTD">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <span v-if="letter.signatureImage" class="badge bg-success-subtle text-success small mb-2 d-inline-block">Gambar TTD Terpasang</span>
            </div>

            <!-- Tembusan / CC Section -->
            <div class="mb-2">
              <label class="form-label fw-bold text-dark small">Tembusan Surat (Opsional - Pisahkan dengan Enter)</label>
              <textarea class="form-control form-control-sm" rows="2" v-model="letter.ccText" placeholder="1. Direktur Keuangan&#10;2. Arsip Bagian Umum"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Printable Preview -->
      <div class="col-lg-7">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 p-md-4">
          <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 print-hide">
            <div class="d-flex align-items-center gap-2">
              <span class="fw-bold text-dark"><i class="bi bi-eye text-primary me-1"></i> Live Letter Preview</span>
              <span class="badge bg-light text-dark border small">{{ activeTemplateTitle }}</span>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-success rounded-pill px-3 fw-bold" @click="openWaModal">
                <i class="bi bi-whatsapp me-1"></i> Kirim WA
              </button>
              <button class="btn btn-sm btn-primary rounded-pill px-3 fw-bold" @click="printLetter">
                <i class="bi bi-printer me-1"></i> Cetak / PDF
              </button>
            </div>
          </div>

          <!-- Printable Letter Container -->
          <div id="letterPrintArea" class="letter-paper border shadow-sm p-4 p-md-5 bg-white text-dark mx-auto">
            <!-- ===================================== -->
            <!-- KOP SURAT HEADER (CUSTOMIZABLE)       -->
            <!-- ===================================== -->
            <div v-if="letter.showKop" class="kop-header-container mb-4" :class="'kop-align-' + (letter.kopLogoPosition || 'left')">
              <div class="d-flex align-items-center justify-content-between gap-3 mb-2" :class="{ 'flex-column text-center': letter.kopLogoPosition === 'center', 'flex-row-reverse': letter.kopLogoPosition === 'right' }">
                <!-- Logo Slot -->
                <div v-if="currentLogoSrc" class="kop-logo-wrapper flex-shrink-0">
                  <img :src="currentLogoSrc" :style="{ height: (letter.kopLogoHeight || 60) + 'px', maxWidth: '140px', objectFit: 'contain' }" alt="Logo Kop" />
                </div>

                <!-- Text Header -->
                <div class="kop-text-wrapper flex-grow-1 text-center">
                  <h3 class="fw-extrabold mb-0 tracking-wide text-uppercase" style="letter-spacing: 1px; font-size: 1.25rem;">
                    {{ letter.kopName || 'PT RAJINKERJA GLOBAL INDONESIA' }}
                  </h3>
                  <div v-if="letter.kopSubname" class="fw-bold text-secondary small text-uppercase mb-0.5" style="letter-spacing: 0.5px;">
                    {{ letter.kopSubname }}
                  </div>
                  <p class="small text-muted mb-0 lh-sm" style="font-size: 0.78rem;">
                    {{ letter.kopAddress || 'Jl. Jend. Sudirman No. 88, Jakarta Selatan | Telp: (021) 555-1234' }}
                  </p>
                  <p v-if="letter.kopContact" class="small text-muted mb-0 lh-sm" style="font-size: 0.78rem;">
                    {{ letter.kopContact }}
                  </p>
                </div>

                <!-- Right placeholder for symmetrical balance if logo on left -->
                <div v-if="currentLogoSrc && letter.kopLogoPosition === 'left'" style="width: 60px;" class="d-none d-md-block"></div>
              </div>

              <!-- Kop Divider Lines -->
              <div v-if="letter.kopStyle === 'double'" class="kop-divider-double mt-2">
                <div class="border-top border-dark border-3 mb-0.5"></div>
                <div class="border-top border-dark border-1"></div>
              </div>
              <div v-else-if="letter.kopStyle === 'thick'" class="border-top border-dark border-3 mt-2"></div>
              <div v-else-if="letter.kopStyle === 'single'" class="border-top border-secondary border-1 mt-2"></div>
            </div>

            <!-- Letter Metadata (Tanggal & Nomor) -->
            <div class="d-flex justify-content-between align-items-baseline mb-4">
              <div>
                <div><strong>Nomor:</strong> {{ letter.number || '001/SK/RK/VIII/2026' }}</div>
                <div v-if="letter.attachment"><strong>Lampiran:</strong> {{ letter.attachment }}</div>
                <div><strong>Perihal:</strong> {{ letter.subject || 'Surat Penawaran Kerjasama' }}</div>
              </div>
              <div class="text-end">
                <div>{{ letter.city || 'Jakarta' }}, {{ formattedDate }}</div>
              </div>
            </div>

            <!-- Recipient Block -->
            <div class="mb-4">
              <div>Kepada Yth.</div>
              <strong>{{ letter.recipientName || 'Bapak / Ibu Pimpinan' }}</strong>
              <div v-if="letter.recipientTitle">{{ letter.recipientTitle }}</div>
              <div>{{ letter.recipientAddress || 'Di Tempat' }}</div>
            </div>

            <!-- Salutation & Body -->
            <div class="mb-4">
              <p class="mb-3">{{ letter.salutation || 'Dengan hormat,' }}</p>

              <div v-if="bodyParagraphs.length > 0" class="d-flex flex-column gap-2">
                <div
                  v-for="(para, idx) in bodyParagraphs"
                  :key="idx"
                  class="lh-base text-dark"
                  :style="{
                    textAlign: 'justify',
                    textIndent: isListParagraph(para) ? '0' : '2rem',
                    whiteSpace: 'pre-line',
                    marginBottom: '0.75rem'
                  }"
                >
                  {{ para }}
                </div>
              </div>

              <div v-else class="lh-base text-muted fst-italic">
                (Isi surat masih kosong...)
              </div>
            </div>

            <!-- Closing & Signatures -->
            <div class="d-flex mt-5 pt-3" :class="{ 'justify-content-end': letter.signaturePosition === 'right', 'justify-content-start': letter.signaturePosition === 'left', 'justify-content-center': letter.signaturePosition === 'center' }">
              <div class="text-center" style="min-width: 220px;">
                <p class="mb-2">{{ letter.closing || 'Hormat Kami,' }}</p>

                <!-- Signature Image if uploaded, otherwise generous spacing for wet sign -->
                <div v-if="letter.signatureImage" class="my-1">
                  <img :src="letter.signatureImage" style="max-height: 65px; object-fit: contain;" alt="Tanda Tangan" />
                </div>
                <div v-else style="height: 60px;"></div>

                <strong class="d-block border-bottom border-dark pb-1 text-uppercase">{{ letter.signerName || 'Arif Permana, S.Kom' }}</strong>
                <span class="small text-muted d-block mt-1">{{ letter.signerTitle || 'Direktur Utama' }}</span>
                <span v-if="letter.signerNip" class="small text-muted d-block" style="font-size: 11px;">{{ letter.signerNip }}</span>
              </div>
            </div>

            <!-- Tembusan / CC (Optional) -->
            <div v-if="letter.ccText && letter.ccText.trim()" class="mt-4 pt-3 border-top small text-muted">
              <strong>Tembusan:</strong>
              <div class="white-space-pre-line">{{ letter.ccText }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- In-Page WhatsApp Panel -->
    <div v-if="showWaModal" class="card border-0 shadow rounded-4 p-4 my-4 bg-white border-top border-success border-4 print-hide">
      <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
        <h5 class="fw-bold mb-0 text-dark">
          <i class="bi bi-whatsapp text-success me-2"></i> Kirim Surat via WhatsApp
        </h5>
        <button type="button" class="btn-close" @click="closeWaModal"></button>
      </div>

      <div class="p-2">
        <div class="mb-3">
          <label class="form-label fw-bold text-dark small">Pilih Sumber Nomor Tujuan WhatsApp</label>
          <div class="btn-group w-100" role="group">
            <input type="radio" class="btn-check" name="waMode" id="waModeContact" value="contact" v-model="waRecipientMode" />
            <label class="btn btn-outline-success fw-semibold" for="waModeContact">
              <i class="bi bi-person-lines-fill me-1"></i> Pilih dari Kontak Tim & WA
            </label>

            <input type="radio" class="btn-check" name="waMode" id="waModeManual" value="manual" v-model="waRecipientMode" />
            <label class="btn btn-outline-success fw-semibold" for="waModeManual">
              <i class="bi bi-pencil-square me-1"></i> Input Nomor Manual
            </label>
          </div>
        </div>

        <div v-if="waRecipientMode === 'contact'" class="mb-3 bg-light p-3 rounded-3 border">
          <label class="form-label fw-bold text-dark small">Daftar Kontak Tim / Client</label>
          <div v-if="contactsList.length > 0">
            <select class="form-select form-select-sm border-2" v-model="selectedContactId" @change="onSelectContact">
              <option value="">-- Pilih Anggota Tim / Client --</option>
              <option v-for="c in contactsList" :key="c.id" :value="c.id">
                {{ c.name }} - {{ c.company || 'Umum' }} ({{ c.phone || 'Tanpa no hp' }})
              </option>
            </select>
            <div v-if="selectedContactPhone" class="form-text text-success mt-1 small">
              <i class="bi bi-check-circle-fill me-1"></i> Nomor Terpilih: <strong>{{ selectedContactPhone }}</strong>
            </div>
          </div>
          <div v-else class="text-center py-2">
            <p class="text-muted small mb-2">Belum ada data kontak di penyimpanan.</p>
            <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3" @click="loadSampleContacts">
              <i class="bi bi-download me-1"></i> Load Contoh Kontak Tim
            </button>
          </div>
        </div>

        <div v-if="waRecipientMode === 'manual'" class="mb-3 bg-light p-3 rounded-3 border">
          <label class="form-label fw-bold text-dark small">Nomor WhatsApp Tujuan</label>
          <input
            type="tel"
            class="form-control form-control-sm border-2"
            v-model="manualPhone"
            placeholder="Contoh: 081234567890 / 6281234567890"
          />
        </div>

        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <label class="form-label fw-bold text-dark small mb-0">Preview Pesan Teks Surat</label>
            <button type="button" class="btn btn-xs btn-link text-decoration-none text-success" @click="resetWaMessage">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Teks
            </button>
          </div>
          <textarea class="form-control font-monospace border-2 rounded-3 small" rows="8" v-model="waCustomMessage"></textarea>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-2">
        <button type="button" class="btn btn-outline-secondary rounded-pill px-3" @click="copyWaMessage">
          <i class="bi bi-clipboard me-1"></i> Salin Teks
        </button>
        <div>
          <button type="button" class="btn btn-light rounded-pill px-3 me-2" @click="closeWaModal">Batal</button>
          <button type="button" class="btn btn-success rounded-pill px-4 fw-bold shadow-sm" @click="sendWhatsApp">
            <i class="bi bi-whatsapp me-1"></i> Kirim via WhatsApp
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import { useStore } from 'vuex';
import { sendOnDeviceNotification } from '../utils/notification';

export default {
  name: 'SuratBuilderView',
  setup() {
    const store = useStore();

    const formTab = ref('kop');
    const selectedTemplateId = ref('lamaran');
    const activeTemplateCat = ref('all');

    const templateCategories = [
      { id: 'all', name: 'Semua (12)' },
      { id: 'karir', name: 'Karier & HRD' },
      { id: 'bisnis', name: 'Bisnis & Kontrak' },
      { id: 'dinas', name: 'Kedinasan & Resmi' }
    ];

    const logoPresets = [
      { id: 'logo_app', name: 'Logo RajinKerja', url: '/logo.svg' },
      { id: 'logo_garuda', name: 'Lambang Resmi Garuda', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg/200px-Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg.png' },
      { id: 'logo_corp', name: 'Gedung Korporat', url: 'https://cdn-icons-png.flaticon.com/512/2942/2942821.png' },
      { id: 'logo_tech', name: 'Startup Tech Node', url: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png' },
      { id: 'logo_edu', name: 'Institusi Pendidikan', url: 'https://cdn-icons-png.flaticon.com/512/2997/2997295.png' }
    ];

    // 12 Comprehensive Letter Templates
    const letterTemplates = [
      {
        id: 'lamaran',
        title: 'Surat Lamaran Kerja',
        category: 'karir',
        categoryLabel: 'Karier',
        icon: 'bi-briefcase-fill',
        desc: 'Standar lamaran kerja profesional',
        subject: 'Lamaran Pekerjaan - Senior Frontend Developer',
        recipientName: 'Bapak / Ibu Pimpinan HRD',
        recipientTitle: 'Head of Talent Acquisition',
        recipientAddress: 'PT Teknologi Digital Nusantara\nJakarta Selatan',
        bodyContent: 'Berdasarkan informasi lowongan pekerjaan yang saya peroleh, melalui surat ini saya bermaksud mengajukan diri untuk bergabung dengan PT Teknologi Digital Nusantara sebagai Senior Frontend Developer.\n\nSaya memiliki pengalaman profesional lebih dari 4 tahun dalam merancang dan mengembangkan aplikasi berbasis web modern menggunakan Vue.js, TypeScript, dan Progressive Web Apps (PWA). Selama berkarir, saya terbiasa berkolaborasi dalam tim agile, memimpin arsitektur antarmuka pengguna, serta mengoptimalkan performa web hingga 40%.\n\nBesar harapan saya untuk diberikan kesempatan wawancara agar dapat menjelaskan lebih mendalam mengenai kualifikasi dan kontribusi yang dapat saya berikan bagi kemajuan perusahaan Bapak/Ibu.'
      },
      {
        id: 'resign',
        title: 'Surat Pengunduran Diri (Resign)',
        category: 'karir',
        categoryLabel: 'Karier',
        icon: 'bi-box-arrow-right',
        desc: 'Pengunduran diri 1-month notice',
        subject: 'Surat Permohonan Pengunduran Diri Kerja',
        recipientName: 'Bapak / Ibu Pimpinan Manajemen',
        recipientTitle: 'Human Resources Division',
        recipientAddress: 'PT RajinKerja Global Indonesia\nDi Tempat',
        bodyContent: 'Melalui surat ini, saya menyampaikan permohonan pengunduran diri saya dari posisi Senior Software Engineer di PT RajinKerja Global Indonesia terhitung efektif per tanggal 30 September 2026.\n\nSaya mengucapkan terima kasih yang sebesar-besarnya atas kesempatan berharga, pengalaman kerja, serta bimbingan yang telah diberikan selama masa kerja saya. Saya memohon maaf apabila terdapat tutur kata atau perbuatan yang kurang berkenan selama saya bertugas.\n\nSebelum tanggal efektif pengunduran diri, saya berkomitmen untuk menyelesaikan seluruh tanggung jawab yang ada serta melakukan serah terima pekerjaan (handover) kepada rekan tim dengan sebaik-baiknya.'
      },
      {
        id: 'pakelaring',
        title: 'Surat Keterangan Kerja (Pakelaring)',
        category: 'karir',
        categoryLabel: 'HRD',
        icon: 'bi-file-earmark-person-fill',
        desc: 'Surat referensi masa bakti kerja',
        subject: 'Surat Keterangan Pengalaman Kerja',
        recipientName: 'Pihak yang Berkepentingan',
        recipientTitle: 'Instansi / Perusahaan Terkait',
        recipientAddress: 'Di Tempat',
        bodyContent: 'Menerangkan dengan sebenarnya bahwa:\n\nNama : Budi Pratama, S.Kom\nJabatan : Lead Frontend Architect\nMasa Kerja : 15 Januari 2023 s.d 30 Juli 2026\n\nAdalah benar pernah bekerja di perusahaan kami dan telah menyelesaikan masa tugasnya dengan predikat sangat baik.\n\nSelama bertugas, yang bersangkutan senantiasa menunjukkan dedikasi, loyalitas, integritas, dan profesionalisme yang tinggi. Kami mengucapkan terima kasih atas segala kontribusi positif yang telah diberikan dan mendoakan kesuksesan dalam karir selanjutnya.'
      },
      {
        id: 'penawaran',
        title: 'Surat Penawaran Kerjasama Bisnis',
        category: 'bisnis',
        categoryLabel: 'Bisnis',
        icon: 'bi-journal-check',
        desc: 'Penawaran proposal & jasa proyek',
        subject: 'Penawaran Kerjasama Pengembangan Web & E-Commerce',
        recipientName: 'Bapak Direktur Operasional',
        recipientTitle: 'PT Mitra Sukses Bersama',
        recipientAddress: 'Gedung Wisma Niaga Lt. 8, Jakarta',
        bodyContent: 'Merujuk pada pembicaraan sebelumnya mengenai rencana digitalisasi proses bisnis dan sistem kasir perusahaan Bapak/Ibu, dengan ini kami mengajukan penawaran jasa pengembangan sistem aplikasi web dan mobile.\n\nAdapun lingkup kerja sama yang kami tawarkan meliputi:\n1. Desain UI/UX Modern & Responsif\n2. Modul Inventori, POS, & Pembayaran Digital\n3. Pemeliharaan dan Garansi Sistem selama 6 Bulan\n\nDetail rincian anggaran biaya (RAB) dan jadwal implementasi telah kami lampirkan dalam dokumen proposal terpisah. Kami berharap dapat menjalin kemitraan yang produktif dan saling menguntungkan.'
      },
      {
        id: 'izin',
        title: 'Surat Izin Tidak Masuk Kerja',
        category: 'karir',
        categoryLabel: 'Pribadi',
        icon: 'bi-calendar-x-fill',
        desc: 'Izin sakit / keperluan mendesak',
        subject: 'Permohonan Izin Tidak Masuk Kerja',
        recipientName: 'Bapak / Ibu Supervisor',
        recipientTitle: 'Head of Division',
        recipientAddress: 'Di Tempat',
        bodyContent: 'Dengan ini saya bermaksud memberitahukan bahwa saya tidak dapat hadir untuk bekerja pada hari ini dikarenakan kondisi kesehatan yang kurang baik dan membutuhkan istirahat sesuai dengan anjuran dokter (surat keterangan dokter terlampir).\n\nTerkait tugas dan koordinasi proyek yang sedang berjalan, saya telah mendelegasikan beberapa penanganan mendesak kepada rekan tim sehingga operasional harian tetap dapat berjalan lancar.\n\nDemikian permohonan izin ini saya sampaikan. Atas perhatian dan pengertian Bapak/Ibu, saya ucapkan terima kasih.'
      },
      {
        id: 'undangan',
        title: 'Surat Undangan Rapat Resmi',
        category: 'dinas',
        categoryLabel: 'Kedinasan',
        icon: 'bi-people-fill',
        desc: 'Undangan rapat koordinasi & evaluasi',
        subject: 'Undangan Rapat Koordinasi Kuartal III Tahun 2026',
        recipientName: 'Bapak / Ibu Seluruh Kepala Divisi',
        recipientTitle: 'Internal Team Leaders',
        recipientAddress: 'Di Lingkungan Perusahaan',
        bodyContent: 'Mengharap dengan hormat kehadiran Bapak/Ibu dalam Rapat Koordinasi dan Evaluasi Target Kerja Kuartal III yang akan diselenggarakan pada:\n\nHari / Tanggal : Senin, 17 Agustus 2026\nWaktu : Pukul 09.00 WIB s.d Selesai\nTempat : Ruang Rapat Utama & Daring via Google Meet\nAgenda : 1. Evaluasi Capaian Semester I\n         2. Rencana Strategis & Roadmap Produk Baru\n\nMengingat pentingnya agenda pembahasan ini, dimohon kehadiran Bapak/Ibu tepat waktu.'
      },
      {
        id: 'tugas',
        title: 'Surat Perintah Tugas Dinas (SPTD)',
        category: 'dinas',
        categoryLabel: 'Kedinasan',
        icon: 'bi-card-checklist',
        desc: 'Penugasan dinas luar kota & audit',
        subject: 'Surat Perintah Tugas Pelaksanaan Audit Lapangan',
        recipientName: 'Pegawai yang Ditugaskan',
        recipientTitle: 'Tim Teknis & IT Auditor',
        recipientAddress: 'Di Tempat',
        bodyContent: 'Pimpinan PT RajinKerja Global Indonesia memberikan perintah kerja dinas kepada pegawai berikut untuk melaksanakan tugas audit infrastruktur server dan pelatihan pengguna di Kantor Cabang Surabaya:\n\n1. Arif Permana, S.Kom (Ketua Tim Teknis)\n2. Budi Santoso (System Administrator)\n\nWaktu Pelaksanaan: 20 Agustus 2026 s.d 24 Agustus 2026.\n\nSegala biaya akomodasi dan perjalanan dinas dibebankan pada anggaran operasional perusahaan. Setelah selesai melaksanakan tugas, tim diwajibkan menyusun laporan pertanggungjawaban tertulis.'
      },
      {
        id: 'kuasa',
        title: 'Surat Kuasa Resmi',
        category: 'dinas',
        categoryLabel: 'Legal',
        icon: 'bi-shield-shaded',
        desc: 'Pemberian kuasa perwakilan resmi',
        subject: 'Surat Kuasa Pengambilan Dokumen & Legalitas',
        recipientName: 'Pihak Berwenang / Instansi Terkait',
        recipientTitle: 'Bagian Legalitas & Perizinan',
        recipientAddress: 'Di Tempat',
        bodyContent: 'Saya yang bertanda tangan di bawah ini:\nNama : Arif Permana\nNIK : 3175000000000001\nJabatan : Direktur Utama\n\nDengan ini memberikan kuasa penuh kepada:\nNama : Rian Prasetyo\nNIK : 3276000000000002\nJabatan : Manager Operasional\n\nUntuk melakukan pengurusan, penandatanganan berkas, serta pengambilan dokumen perizinan resmi perusahaan di instansi terkait.\n\nDemikian surat kuasa ini dibuat dengan sebenarnya tanpa ada paksaan dari pihak manapun untuk dipergunakan sebagaimana mestinya.'
      },
      {
        id: 'rekomendasi',
        title: 'Surat Rekomendasi Kerja / Beasiswa',
        category: 'karir',
        categoryLabel: 'Karier',
        icon: 'bi-star-fill',
        desc: 'Rekomendasi kinerja staf berprestasi',
        subject: 'Surat Rekomendasi Profesional & Akademik',
        recipientName: 'Komite Seleksi / Recruitment Team',
        recipientTitle: 'Selection Committee',
        recipientAddress: 'Di Tempat',
        bodyContent: 'Saya memberikan rekomendasi setinggi-tingginya kepada Saudara Budi Pratama untuk posisi pekerjaan atau program beasiswa yang sedang diajukan.\n\nSelama 3 tahun bekerja di bawah supervisi saya, beliau membuktikan diri sebagai individu yang sangat kompeten, memiliki pemikiran analitis tajam, serta integritas kerja yang patut diteladani. Beliau selalu menyelesaikan setiap target proyek sebelum tenggat waktu dengan kualitas luar biasa.\n\nSaya meyakini beliau akan memberikan kontribusi signifikan di institusi Bapak/Ibu.'
      },
      {
        id: 'pernyataan',
        title: 'Surat Pernyataan Resmi Bermaterai',
        category: 'dinas',
        categoryLabel: 'Resmi',
        icon: 'bi-patch-check-fill',
        desc: 'Pernyataan kebenaran data & fakta',
        subject: 'Surat Pernyataan Kebenaran Dokumen',
        recipientName: 'Pihak Penyelenggara',
        recipientTitle: 'Panitia Seleksi',
        recipientAddress: 'Di Tempat',
        bodyContent: 'Menyatakan dengan sesungguhnya bahwa seluruh data, berkas identitas, riwayat pekerjaan, dan sertifikat kompetensi yang saya lampirkan adalah benar adanya dan dapat dipertanggungjawabkan keabsahannya secara hukum.\n\nApabila di kemudian hari ditemukan ketidaksesuaian atau pemalsuan data, saya bersedia menerima sanksi hukum sesuai ketentuan peraturan perundang-undangan yang berlaku.'
      },
      {
        id: 'sp',
        title: 'Surat Peringatan Karyawan (SP)',
        category: 'dinas',
        categoryLabel: 'HRD',
        icon: 'bi-exclamation-triangle-fill',
        desc: 'Peringatan disiplin & evaluasi kinerja',
        subject: 'Surat Peringatan Pertama (SP-1)',
        recipientName: 'Saudara Karyawan Terkait',
        recipientTitle: 'Staff Operasional',
        recipientAddress: 'Di Tempat',
        bodyContent: 'Berdasarkan catatan kehadiran dan evaluasi kedisiplinan kerja bulan Juli 2026, dengan ini manajemen mengeluarkan Surat Peringatan Pertama (SP-1) sehubungan dengan ketidakhadiran tanpa keterangan sebanyak 3 kali berturut-turut.\n\nSurat peringatan ini berlaku selama 6 (enam) bulan ke depan. Kami berharap Saudara dapat memperbaiki kedisiplinan serta menunjukkan peningkatan komitmen kerja.'
      },
      {
        id: 'mou',
        title: 'Surat Perjanjian Kerjasama (MoU)',
        category: 'bisnis',
        categoryLabel: 'Bisnis',
        icon: 'bi-handshake-fill',
        desc: 'Nota kesepahaman kemitraan usaha',
        subject: 'Nota Kesepahaman Kerjasama Kemitraan Strategis',
        recipientName: 'Pimpinan Pihak Kedua',
        recipientTitle: 'Managing Partner',
        recipientAddress: 'Di Tempat',
        bodyContent: 'Kedua belah pihak telah bersepakat untuk mengadakan perjanjian kemitraan strategis dalam rangka pengembangan dan pemasaran produk bersama dengan ketentuan umum sebagai berikut:\n\n1. Pihak Pertama bertindak sebagai penyedia infrastruktur teknologi dan aplikasi.\n2. Pihak Kedua bertindak sebagai penyedia jaringan distribusi dan hubungan masyarakat.\n3. Pembagian hasil operasional akan diatur dalam perjanjian teknis tersendiri.\n\nPerjanjian ini dibuat dalam rangkap 2 (dua) bermaterai cukup dan memiliki kekuatan hukum yang sama.'
      }
    ];

    const letter = ref({
      showKop: true,
      kopName: 'PT RAJINKERJA GLOBAL INDONESIA',
      kopSubname: 'PUSAT SISTEM OPERASI PRODUKTIVITAS KERJA',
      kopAddress: 'Gedung Menara RajinKerja Lt. 12, Jl. Jend. Sudirman No. 88 Jakarta | Telp: (021) 555-1234',
      kopContact: 'Email: corporate@rajinkerja.id | Website: www.rajinkerja.id',
      kopLogo: '',
      kopLogoPreset: 'logo_app',
      kopLogoPosition: 'left',
      kopLogoHeight: 60,
      kopStyle: 'double',
      number: '001/SK/RK/VIII/2026',
      city: 'Jakarta',
      date: new Date().toISOString().split('T')[0],
      attachment: '1 (Satu) Berkas',
      subject: letterTemplates[0].subject,
      salutation: 'Dengan hormat,',
      recipientName: letterTemplates[0].recipientName,
      recipientTitle: letterTemplates[0].recipientTitle,
      recipientAddress: letterTemplates[0].recipientAddress,
      bodyContent: letterTemplates[0].bodyContent,
      closing: 'Hormat kami,',
      signerName: 'Arif Permana, S.Kom',
      signerTitle: 'Direktur Utama',
      signerNip: 'NIK. 2026-RK-001',
      signaturePosition: 'right',
      signatureImage: '',
      ccText: ''
    });

    const filteredTemplates = computed(() => {
      if (activeTemplateCat.value === 'all') return letterTemplates;
      return letterTemplates.filter(t => t.category === activeTemplateCat.value);
    });

    const activeTemplateTitle = computed(() => {
      const tmpl = letterTemplates.find(t => t.id === selectedTemplateId.value);
      return tmpl ? tmpl.title : 'Surat Resmi';
    });

    const currentLogoSrc = computed(() => {
      if (letter.value.kopLogo) return letter.value.kopLogo;
      if (letter.value.kopLogoPreset) {
        const found = logoPresets.find(p => p.id === letter.value.kopLogoPreset);
        return found ? found.url : '/logo.svg';
      }
      return '/logo.svg';
    });

    const formattedDate = computed(() => {
      if (!letter.value.date) return '6 Agustus 2026';
      const d = new Date(letter.value.date);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    });

    const bodyParagraphs = computed(() => {
      if (!letter.value.bodyContent) return [];
      return letter.value.bodyContent
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(p => p.length > 0);
    });

    const isListParagraph = (p) => {
      if (!p) return false;
      const trimmed = p.trim();
      return (
        trimmed.startsWith('-') ||
        trimmed.startsWith('•') ||
        trimmed.startsWith('*') ||
        /^\d+[\.\)]/.test(trimmed) ||
        trimmed.includes('Hari / Tanggal') ||
        trimmed.startsWith('Nama :') ||
        trimmed.startsWith('Waktu') ||
        trimmed.startsWith('Tempat')
      );
    };

    const insertNewParagraph = () => {
      if (!letter.value.bodyContent) {
        letter.value.bodyContent = 'Paragraf baru...';
      } else {
        letter.value.bodyContent += '\n\nParagraf baru...';
      }
    };

    const insertBulletList = () => {
      if (!letter.value.bodyContent) {
        letter.value.bodyContent = '1. Poin pertama\n2. Poin kedua';
      } else {
        letter.value.bodyContent += '\n\n1. Poin pertama\n2. Poin kedua';
      }
    };

    const selectTemplate = (tmpl) => {
      selectedTemplateId.value = tmpl.id;
      letter.value.subject = tmpl.subject;
      letter.value.recipientName = tmpl.recipientName;
      letter.value.recipientTitle = tmpl.recipientTitle;
      letter.value.recipientAddress = tmpl.recipientAddress;
      letter.value.bodyContent = tmpl.bodyContent;

      sendOnDeviceNotification('📄 Template Surat Dimuat', {
        body: `Template "${tmpl.title}" siap diedit.`,
        type: 'info'
      });
    };

    const onLogoSelected = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        letter.value.kopLogo = evt.target.result;
        letter.value.kopLogoPreset = '';
        sendOnDeviceNotification('🖼️ Logo Kop Terpasang', {
          body: 'Logo custom berhasil dimuat ke Kop Surat.',
          type: 'success'
        });
      };
      reader.readAsDataURL(file);
    };

    const applyLogoPreset = (preset) => {
      letter.value.kopLogo = '';
      letter.value.kopLogoPreset = preset.id;
    };

    const onSignSelected = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        letter.value.signatureImage = evt.target.result;
        sendOnDeviceNotification('✍️ Tanda Tangan Terpasang', {
          body: 'Gambar tanda tangan digital berhasil dimuat.',
          type: 'success'
        });
      };
      reader.readAsDataURL(file);
    };

    const saveLetter = () => {
      store.dispatch('addSurat', { ...letter.value });
      sendOnDeviceNotification('✉️ Surat Tersimpan', {
        body: `Surat "${letter.value.subject}" berhasil disimpan di memori lokal.`,
        type: 'success'
      });
    };

    const printLetter = () => {
      saveLetter();
      window.print();
    };

    // WhatsApp Export Feature
    const showWaModal = ref(false);
    const waRecipientMode = ref('contact');
    const selectedContactId = ref('');
    const selectedContactPhone = ref('');
    const manualPhone = ref('');
    const waCustomMessage = ref('');

    const contactsList = computed(() => store.getters.getContacts || []);

    const generatedWaText = computed(() => {
      const kopText = letter.value.showKop
        ? `*${letter.value.kopName || 'PT RAJINKERJA GLOBAL INDONESIA'}*\n${letter.value.kopAddress || ''}\n------------------------------------------\n`
        : '';
      return `${kopText}*SURAT RESMI: ${letter.value.subject || 'Surat Menyurat'}*\nNomor: ${letter.value.number || '-'}\nTanggal: ${letter.value.city || 'Jakarta'}, ${formattedDate.value}\n\nKepada Yth.\n*${letter.value.recipientName || 'Bapak / Ibu Pimpinan'}*\n${letter.value.recipientAddress || 'Di Tempat'}\n\n${letter.value.salutation || 'Dengan hormat,'}\n\n${letter.value.bodyContent || ''}\n\n${letter.value.closing || 'Hormat Kami,'}\n*${letter.value.signerName || ''}*\n_${letter.value.signerTitle || ''}_`;
    });

    const openWaModal = () => {
      showWaModal.value = true;
      waCustomMessage.value = generatedWaText.value;
      if (contactsList.value.length > 0 && !selectedContactId.value) {
        selectedContactId.value = contactsList.value[0].id;
        onSelectContact();
      }
    };

    const closeWaModal = () => {
      showWaModal.value = false;
    };

    const resetWaMessage = () => {
      waCustomMessage.value = generatedWaText.value;
    };

    const onSelectContact = () => {
      const contact = contactsList.value.find(c => c.id === selectedContactId.value);
      if (contact) {
        selectedContactPhone.value = contact.phone || '';
        if (contact.name && (!letter.value.recipientName || letter.value.recipientName === 'Bapak / Ibu Pimpinan HRD')) {
          letter.value.recipientName = contact.name;
        }
      } else {
        selectedContactPhone.value = '';
      }
    };

    const loadSampleContacts = () => {
      store.dispatch('loadSampleData');
      sendOnDeviceNotification('👥 Kontak Dimuat', {
        body: 'Sampel Kontak Tim & Clients berhasil dimuat.',
        type: 'success'
      });
      if (contactsList.value.length > 0) {
        selectedContactId.value = contactsList.value[0].id;
        onSelectContact();
      }
    };

    const sendWhatsApp = () => {
      let targetPhone = waRecipientMode.value === 'contact' ? selectedContactPhone.value : manualPhone.value;

      if (!targetPhone) {
        sendOnDeviceNotification('⚠️ Nomor WA Kosong', {
          body: 'Silakan masukan atau pilih nomor WhatsApp tujuan terlebih dahulu.',
          type: 'warning'
        });
        return;
      }

      let clean = targetPhone.replace(/\D/g, '');
      if (clean.startsWith('0')) {
        clean = '62' + clean.slice(1);
      }

      const encodedText = encodeURIComponent(waCustomMessage.value);
      const url = `https://wa.me/${clean}?text=${encodedText}`;

      saveLetter();
      window.open(url, '_blank');
      showWaModal.value = false;

      sendOnDeviceNotification('💬 Mengirim ke WhatsApp', {
        body: `Membuka WhatsApp untuk mengirim surat ke nomor ${clean}`,
        type: 'success'
      });
    };

    const copyWaMessage = () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(waCustomMessage.value);
        sendOnDeviceNotification('📋 Teks Disalin', {
          body: 'Pesan surat berhasil disalin ke clipboard.',
          type: 'info'
        });
      }
    };

    const suratJsonInput = ref(null);

    const exportSuratJson = () => {
      try {
        const payload = {
          app: 'RajinKerja',
          type: 'surat_backup',
          version: '2.5',
          exportDate: new Date().toISOString(),
          letter: letter.value,
          selectedTemplateId: selectedTemplateId.value,
          suratList: store.getters.getSuratList || []
        };
        const jsonStr = JSON.stringify(payload, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const subjectSlug = (letter.value.subject || 'Surat').replace(/[^a-zA-Z0-9]/g, '_');
        link.download = `Surat_${subjectSlug}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        Swal.fire({
          icon: 'success',
          title: 'Export Surat Berhasil!',
          text: 'Data Surat resmi & logo kop berhasil diunduh dalam format JSON.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Export JSON',
          text: err.message
        });
      }
    };

    const triggerImportSuratJson = () => {
      if (suratJsonInput.value) {
        suratJsonInput.value.value = '';
        suratJsonInput.value.click();
      }
    };

    const onSuratJsonSelected = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          const incomingLetter = parsed.letter || (parsed.subject ? parsed : null);

          if (!incomingLetter && !(parsed.suratList && parsed.suratList.length)) {
            Swal.fire({
              icon: 'warning',
              title: 'Format Surat Tidak Ditemukan',
              text: 'Berkas JSON ini tidak memiliki struktur data surat yang valid.'
            });
            return;
          }

          Swal.fire({
            title: 'Pulihkan Data Surat & Kop?',
            html: `
              <div class="text-start p-2 bg-light rounded border mb-2 small">
                <p class="mb-1"><strong>Perihal:</strong> ${incomingLetter?.subject || 'Koleksi Surat'}</p>
                <p class="mb-1"><strong>Penerima:</strong> ${incomingLetter?.recipientName || '-'}</p>
                <p class="mb-0"><strong>Kop:</strong> ${incomingLetter?.kopName || '-'}</p>
              </div>
              <p class="small text-muted mb-0">Apakah Anda ingin memuat data surat dan kop ini ke editor?</p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Muat Data Surat',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#6c757d'
          }).then((result) => {
            if (result.isConfirmed) {
              if (incomingLetter) {
                letter.value = { ...letter.value, ...incomingLetter };
                if (parsed.selectedTemplateId) {
                  selectedTemplateId.value = parsed.selectedTemplateId;
                }
              }
              if (parsed.suratList && Array.isArray(parsed.suratList)) {
                store.dispatch('importSuratData', parsed.suratList);
              }
              saveLetter();
              Swal.fire({
                icon: 'success',
                title: 'Data Surat Berhasil Dimuat!',
                text: 'Formulir surat & kop telah diperbarui sesuai berkas JSON.',
                timer: 2000,
                showConfirmButton: false
              });
            }
          });
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Berkas Tidak Valid',
            text: 'Gagal membaca berkas JSON: ' + err.message
          });
        }
      };
      reader.readAsText(file);
    };

    return {
      formTab,
      selectedTemplateId,
      activeTemplateCat,
      templateCategories,
      letterTemplates,
      filteredTemplates,
      activeTemplateTitle,
      logoPresets,
      currentLogoSrc,
      letter,
      formattedDate,
      bodyParagraphs,
      isListParagraph,
      insertNewParagraph,
      insertBulletList,
      selectTemplate,
      onLogoSelected,
      applyLogoPreset,
      onSignSelected,
      saveLetter,
      printLetter,
      // WA Export
      showWaModal,
      waRecipientMode,
      selectedContactId,
      selectedContactPhone,
      manualPhone,
      waCustomMessage,
      contactsList,
      openWaModal,
      closeWaModal,
      resetWaMessage,
      onSelectContact,
      loadSampleContacts,
      sendWhatsApp,
      copyWaMessage,
      suratJsonInput,
      exportSuratJson,
      triggerImportSuratJson,
      onSuratJsonSelected
    };
  }
};
</script>

<style scoped>
.letter-paper {
  width: 100%;
  max-width: 794px; /* Standard A4 width in px at 96DPI */
  min-height: 1050px;
  box-sizing: border-box;
  font-family: 'Times New Roman', Times, 'Georgia', serif;
  font-size: 14px;
  line-height: 1.6;
}

.kop-align-left .kop-text-wrapper {
  text-align: center;
}

.kop-align-center .kop-text-wrapper {
  text-align: center;
}

.hover-shadow:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
}

.btn-xs {
  font-size: 11.5px;
}

@media print {
  body * {
    visibility: hidden;
  }
  .print-hide {
    display: none !important;
  }
  #letterPrintArea, #letterPrintArea * {
    visibility: visible;
  }
  #letterPrintArea {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    max-width: 100% !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
