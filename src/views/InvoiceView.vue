<template>
  <div class="container-fluid p-0 pb-5" data-aos="fade-up">
    <!-- Header Banner & Action Toolbar -->
    <div class="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border no-print">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
          <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-receipt me-1"></i> Billing & Invoicing Studio
          </span>
          <span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 fw-bold px-2.5 py-1.5 rounded-pill small">
            By Kafeinarts
          </span>
          <span class="badge bg-info-subtle text-info fw-bold px-2.5 py-1.5 rounded-pill small">
            <i class="bi bi-aspect-ratio me-1"></i> {{ currentPaperLabel }}
          </span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">Invoice Generator Pro</h2>
        <p class="text-muted mb-0">
          Buat dan kelola tagihan profesional, sesuaikan kop, format kertas A5/A4, watermark, dan rincian secara fleksibel tanpa batas.
        </p>
      </div>

      <!-- Action Buttons & Layout Mode Switcher -->
      <div class="d-flex flex-wrap gap-2 align-items-center">
        <!-- Layout Mode Selector -->
        <div class="btn-group btn-group-sm p-1 bg-light rounded-3 border me-xl-2">
          <button
            type="button"
            class="btn btn-sm px-2.5 py-1 fw-semibold transition-all rounded-2"
            :class="layoutMode === 'side-by-side' ? 'bg-white shadow-xs text-primary fw-bold' : 'text-muted border-0'"
            @click="setLayoutMode('side-by-side')"
            title="Tampilan Berdampingan (Side by Side)"
          >
            <i class="bi bi-layout-split me-1"></i>
            <span class="d-none d-sm-inline">Berdampingan</span>
          </button>
          <button
            type="button"
            class="btn btn-sm px-2.5 py-1 fw-semibold transition-all rounded-2"
            :class="layoutMode === 'stacked' ? 'bg-white shadow-xs text-primary fw-bold' : 'text-muted border-0'"
            @click="setLayoutMode('stacked')"
            title="Tampilan Bertumpuk Luas (Stacked)"
          >
            <i class="bi bi-distribute-vertical me-1"></i>
            <span class="d-none d-sm-inline">Bertumpuk</span>
          </button>
          <button
            type="button"
            class="btn btn-sm px-2.5 py-1 fw-semibold transition-all rounded-2"
            :class="layoutMode === 'editor-only' ? 'bg-white shadow-xs text-primary fw-bold' : 'text-muted border-0'"
            @click="setLayoutMode('editor-only')"
            title="Fokus Editor Formulir"
          >
            <i class="bi bi-pencil-square me-1"></i>
            <span class="d-none d-md-inline">Fokus Form</span>
          </button>
          <button
            type="button"
            class="btn btn-sm px-2.5 py-1 fw-semibold transition-all rounded-2"
            :class="layoutMode === 'preview-only' ? 'bg-white shadow-xs text-primary fw-bold' : 'text-muted border-0'"
            @click="setLayoutMode('preview-only')"
            title="Fokus Pratinjau Lembar"
          >
            <i class="bi bi-file-earmark-richtext me-1"></i>
            <span class="d-none d-md-inline">Fokus Kertas</span>
          </button>
        </div>

        <button class="btn btn-outline-warning text-dark px-3 py-2 rounded-3 fw-semibold btn-sm" @click="exportInvoiceJson" title="Backup semua invoice ke berkas JSON">
          <i class="bi bi-filetype-json text-warning me-1"></i> JSON
        </button>
        <button class="btn btn-outline-info text-dark px-3 py-2 rounded-3 fw-semibold btn-sm" @click="triggerImportInvoiceJson" title="Import invoice dari JSON">
          <i class="bi bi-upload text-info me-1"></i> Import
        </button>
        <input type="file" ref="invoiceJsonInput" accept=".json" class="d-none" @change="onInvoiceJsonSelected" />

        <button class="btn btn-outline-success px-3 py-2 rounded-3 fw-semibold btn-sm" @click="exportToExcel" title="Export rangkuman ke Excel">
          <i class="bi bi-file-earmark-excel-fill me-1 text-success"></i> Excel
        </button>

        <button class="btn btn-outline-primary px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-1.5 btn-sm" :disabled="isPdfLoading" @click="triggerPrint">
          <span v-if="isPdfLoading" class="spinner-border spinner-border-sm text-primary" role="status"></span>
          <i v-else class="bi bi-printer"></i>
          <span>Cetak</span>
        </button>

        <button class="btn btn-primary px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 shadow-sm btn-sm" :disabled="isPdfLoading" @click="downloadPDF">
          <span v-if="isPdfLoading" class="spinner-border spinner-border-sm text-white" role="status"></span>
          <i v-else class="bi bi-file-earmark-pdf-fill fs-6"></i>
          <span>{{ isPdfLoading ? 'Menyiapkan...' : 'Buka PDF' }}</span>
        </button>
      </div>
    </div>

    <!-- Dedicated Top Full-Width Wizard Stepper Bar (1-2-3-4 di paling atas secara rapih) -->
    <div class="card border-0 shadow-sm rounded-4 bg-white mb-4 no-print overflow-hidden">
      <div class="p-3 p-md-4">
        <!-- Top Toolbar inside Stepper Card: Title, Status Step, and Options -->
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 pb-2 border-bottom">
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-primary text-white px-2.5 py-1 rounded-pill fw-bold">
              Tahap {{ currentWizardStep }} dari 4
            </span>
            <h6 class="fw-bold text-dark mb-0 fs-6">
              {{ currentStepTitle }}
            </h6>
          </div>

          <div class="d-flex align-items-center gap-2 flex-wrap">
            <!-- Toggle Mode: Wizard Bertahap vs Semua Formulir -->
            <div class="btn-group btn-group-sm p-0.5 bg-light rounded-3 border">
              <button
                type="button"
                class="btn btn-xs rounded-2 px-2.5 py-1 transition-all"
                :class="editorFormMode === 'wizard' ? 'bg-white shadow-xs text-primary fw-bold' : 'text-muted border-0'"
                @click="editorFormMode = 'wizard'"
                title="Navigasi Langkah demi Langkah (Wizard)"
              >
                <i class="bi bi-signpost-split me-1"></i> Mode Wizard
              </button>
              <button
                type="button"
                class="btn btn-xs rounded-2 px-2.5 py-1 transition-all"
                :class="editorFormMode === 'all-in-one' ? 'bg-white shadow-xs text-primary fw-bold' : 'text-muted border-0'"
                @click="editorFormMode = 'all-in-one'"
                title="Tampilkan Semua Bagian Formulir Sekaligus"
              >
                <i class="bi bi-view-stacked me-1"></i> Semua Formulir
              </button>
            </div>

            <button type="button" class="btn btn-xs btn-outline-secondary rounded-pill px-2.5 py-1 bg-white" @click="loadSampleData" title="Isi dengan contoh data">
              <i class="bi bi-magic me-1"></i> Contoh
            </button>
            <button type="button" class="btn btn-xs btn-outline-danger rounded-pill px-2.5 py-1 bg-white" @click="resetInvoiceForm" title="Reset Form">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Reset
            </button>
          </div>
        </div>

        <!-- Horizontal Stepper 1 - 2 - 3 - 4 with Connecting Progress Line -->
        <div class="top-wizard-stepper">
          <!-- Background track line -->
          <div class="progress top-wizard-progress" style="height: 4px;">
            <div
              class="progress-bar bg-primary transition-all"
              role="progressbar"
              :style="{ width: (((currentWizardStep - 1) / 3) * 100) + '%' }"
            ></div>
          </div>

          <!-- 4 Step Interactive Buttons -->
          <div class="d-flex justify-content-between position-relative" style="z-index: 2;">
            <button
              type="button"
              v-for="step in wizardSteps"
              :key="step.number"
              class="top-step-btn btn p-2 rounded-3 text-center transition-all d-flex flex-column align-items-center"
              :class="currentWizardStep === step.number ? 'active-step bg-primary-subtle' : 'bg-white'"
              @click="currentWizardStep = step.number"
            >
              <div
                class="top-step-circle rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all mb-1.5"
                :class="[
                  currentWizardStep === step.number
                    ? 'bg-primary text-white shadow-sm ring-4'
                    : (currentWizardStep > step.number
                        ? 'bg-success text-white shadow-xs'
                        : 'bg-light border text-muted')
                ]"
              >
                <i v-if="currentWizardStep > step.number" class="bi bi-check-lg fw-bold"></i>
                <span v-else>{{ step.number }}</span>
              </div>
              <span
                class="small fw-bold d-block text-truncate w-100"
                :class="currentWizardStep === step.number ? 'text-primary' : (currentWizardStep > step.number ? 'text-dark' : 'text-muted')"
                style="font-size: 13px;"
              >
                {{ step.title }}
              </span>
              <span class="d-none d-md-block text-muted text-truncate w-100 opacity-75" style="font-size: 11px;">
                {{ step.desc }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Workspace Container -->
    <div class="row g-4 mb-4">
      <!-- FORM EDITOR (Left or Top) -->
      <div
        v-show="layoutMode !== 'preview-only'"
        :class="layoutMode === 'stacked' || layoutMode === 'editor-only' ? 'col-12 no-print' : 'col-xl-6 col-lg-6 no-print'"
      >
        <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <!-- Card Header for active section -->
          <div class="px-4 py-3 bg-light bg-opacity-75 border-bottom d-flex justify-content-between align-items-center">
            <h6 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <i class="bi bi-sliders2 text-primary"></i>
              <span>{{ editorFormMode === 'all-in-one' ? 'Formulir Tagihan Lengkap' : `Langkah ${currentWizardStep}: ${currentStepTitle}` }}</span>
            </h6>
            <span class="small text-muted" v-if="editorFormMode === 'wizard'">
              Langkah {{ currentWizardStep }} / 4
            </span>
          </div>

          <!-- Wizard Content Form -->
          <div class="card-body p-4">
            <form @submit.prevent="saveInvoiceToStore">
              <!-- ============================================ -->
              <!-- STEP 1: DOKUMEN, STATUS & KLIEN (BILL TO)    -->
              <!-- ============================================ -->
              <div v-show="editorFormMode === 'all-in-one' || currentWizardStep === 1" class="wizard-section mb-4">
                <div class="section-badge-header mb-3 pb-2 border-bottom d-flex align-items-center justify-content-between">
                  <h6 class="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
                    <span class="badge bg-primary text-white rounded-circle p-1 px-2">1</span>
                    <span>Informasi Dokumen & Identitas Klien</span>
                  </h6>
                  <span class="small text-muted">Nomor seri, status, tanggal & data pembeli</span>
                </div>

                <div class="row g-3">
                  <!-- Judul Dokumen Kustom (Invoice / Faktur / Kwitansi) -->
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">
                      Judul / Tipe Dokumen <span class="text-danger">*</span>
                    </label>
                    <div class="input-group input-group-sm">
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        v-model="invoice.documentTitle"
                        placeholder="INVOICE / FAKTUR TAGIHAN"
                      />
                      <button
                        class="btn btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        Pilihan
                      </button>
                      <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                        <li><a class="dropdown-item" href="javascript:;" @click="invoice.documentTitle = 'INVOICE'">INVOICE</a></li>
                        <li><a class="dropdown-item" href="javascript:;" @click="invoice.documentTitle = 'FAKTUR TAGIHAN'">FAKTUR TAGIHAN</a></li>
                        <li><a class="dropdown-item" href="javascript:;" @click="invoice.documentTitle = 'KWITANSI PEMBAYARAN'">KWITANSI PEMBAYARAN</a></li>
                        <li><a class="dropdown-item" href="javascript:;" @click="invoice.documentTitle = 'PROFORMA INVOICE'">PROFORMA INVOICE</a></li>
                        <li><a class="dropdown-item" href="javascript:;" @click="invoice.documentTitle = 'TAGIHAN / BILLING STATEMENT'">BILLING STATEMENT</a></li>
                      </ul>
                    </div>
                    <small class="text-muted" style="font-size: 11px;">Bisa diisi judul bebas sesuai jenis transaksi.</small>
                  </div>

                  <!-- Status Tagihan Dropdown -->
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">
                      <i class="bi bi-patch-check me-1 text-primary"></i>Status Tagihan
                    </label>
                    <select class="form-select form-select-sm fw-semibold" v-model="invoice.status">
                      <option value="Belum Bayar">Belum Bayar</option>
                      <option value="Lunas">Lunas</option>
                      <option value="Menunggu">Menunggu</option>
                      <option value="Draft">Draft</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                    <small class="text-muted" style="font-size: 11px;">Status pembayaran saat dokumen diterbitkan.</small>
                  </div>

                  <!-- Nomor Invoice -->
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Nomor Dokumen <span class="text-danger">*</span></label>
                    <div class="input-group input-group-sm">
                      <span class="input-group-text bg-light text-muted"><i class="bi bi-hash"></i></span>
                      <input
                        type="text"
                        class="form-control form-control-sm font-monospace"
                        :class="{ 'is-invalid': errors.invoiceNumber }"
                        v-model="invoice.invoiceNumber"
                        placeholder="INV-2026-001"
                      />
                    </div>
                    <div class="invalid-feedback d-block small" v-if="errors.invoiceNumber">{{ errors.invoiceNumber }}</div>
                  </div>

                  <!-- Nomor PO / Referensi Proyek (Opsional) -->
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">No. PO / SPK / Referensi Kontrak</label>
                    <input
                      type="text"
                      class="form-control form-control-sm"
                      v-model="invoice.poNumber"
                      placeholder="PO-2026/08/99 atau No. SPK (Opsional)"
                    />
                  </div>

                  <!-- Mata Uang -->
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Mata Uang Transaksi</label>
                    <select class="form-select form-select-sm" v-model="invoice.currency">
                      <option value="IDR">Rupiah Indonesia (Rp / IDR)</option>
                      <option value="USD">US Dollar ($ / USD)</option>
                      <option value="EUR">Euro (€ / EUR)</option>
                      <option value="SGD">Singapore Dollar (S$ / SGD)</option>
                    </select>
                  </div>

                  <!-- Tanggal Terbit & Jatuh Tempo -->
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Tanggal Terbit <span class="text-danger">*</span></label>
                    <input
                      type="date"
                      class="form-control form-control-sm"
                      :class="{ 'is-invalid': errors.issueDate }"
                      v-model="invoice.issueDate"
                    />
                    <div class="invalid-feedback d-block small" v-if="errors.issueDate">{{ errors.issueDate }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Tanggal Jatuh Tempo <span class="text-danger">*</span></label>
                    <input
                      type="date"
                      class="form-control form-control-sm"
                      :class="{ 'is-invalid': errors.dueDate }"
                      v-model="invoice.dueDate"
                    />
                    <div class="invalid-feedback d-block small" v-if="errors.dueDate">{{ errors.dueDate }}</div>
                  </div>

                  <!-- Data Penerima / Klien Header -->
                  <div class="col-12 mt-3 pt-3 border-top">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <label class="form-label small fw-bold text-primary mb-0 text-uppercase">
                        <i class="bi bi-building me-1"></i> Data Klien / Penerima Tagihan (Bill To)
                      </label>
                      <input
                        type="text"
                        class="form-control form-control-sm py-0 px-2"
                        v-model="invoice.labelBillTo"
                        placeholder="Label: DITAGIHKAN KEPADA"
                        style="max-width: 220px; font-size: 11px;"
                        title="Sesuaikan teks label penerima"
                      />
                    </div>
                  </div>

                  <!-- Nama Klien -->
                  <div class="col-md-7">
                    <label class="form-label small fw-bold text-dark">Nama Klien / Perusahaan <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      class="form-control form-control-sm"
                      :class="{ 'is-invalid': errors.clientName }"
                      v-model="invoice.clientName"
                      placeholder="PT Teknologi Nusantara / Pak Budi"
                    />
                    <div class="invalid-feedback d-block small" v-if="errors.clientName">{{ errors.clientName }}</div>
                  </div>

                  <div class="col-md-5">
                    <label class="form-label small fw-bold text-dark">Contact Person / Divisi</label>
                    <input
                      type="text"
                      class="form-control form-control-sm"
                      v-model="invoice.clientCompany"
                      placeholder="Bpk. Hendra (Procurement)"
                    />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Email Klien</label>
                    <input type="email" class="form-control form-control-sm" v-model="invoice.clientEmail" placeholder="finance@perusahaan.com" />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">No. Telepon / WhatsApp</label>
                    <input type="text" class="form-control form-control-sm" v-model="invoice.clientPhone" placeholder="0812-3456-7890" />
                  </div>

                  <div class="col-12">
                    <label class="form-label small fw-bold text-dark">Alamat Lengkap Klien</label>
                    <textarea class="form-control form-control-sm" rows="2" v-model="invoice.clientAddress" placeholder="Gedung Cyber 2 Lt. 8, Jl. HR Rasuna Said, Jakarta Selatan"></textarea>
                  </div>
                </div>
              </div>

              <!-- ============================================ -->
              <!-- STEP 2: RINCIAN ITEM & DAFTAR PEKERJAAN     -->
              <!-- ============================================ -->
              <div v-show="editorFormMode === 'all-in-one' || currentWizardStep === 2" class="wizard-section mb-4">
                <div class="section-badge-header mb-3 pb-2 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <h6 class="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
                    <span class="badge bg-primary text-white rounded-circle p-1 px-2">2</span>
                    <span>Rincian Layanan & Produk (Items)</span>
                  </h6>
                  <div class="d-flex gap-1.5 align-items-center">
                    <button type="button" class="btn btn-xs btn-outline-secondary rounded-pill px-2.5 py-1" @click="showBulkItemBox = !showBulkItemBox">
                      <i class="bi bi-list-task me-1"></i> {{ showBulkItemBox ? 'Tutup Bulk' : 'Bulk Paste' }}
                    </button>
                    <button type="button" class="btn btn-xs btn-primary rounded-pill px-3 py-1 fw-bold" @click="addItem">
                      <i class="bi bi-plus-lg me-1"></i> Tambah Baris
                    </button>
                  </div>
                </div>

                <!-- Template Preset Cepat -->
                <div class="mb-3 p-2.5 bg-light rounded-3 border">
                  <small class="fw-bold text-muted d-block mb-1.5">
                    <i class="bi bi-lightning-charge-fill text-warning me-1"></i> Tambah Cepat Layanan Populer:
                  </small>
                  <div class="d-flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      v-for="preset in servicePresets"
                      :key="preset.nama"
                      class="btn btn-xs btn-white bg-white border text-dark rounded-pill px-2.5 py-1 hover-primary"
                      @click="addPresetItem(preset)"
                    >
                      + {{ preset.nama }} ({{ formatCurrency(preset.biaya) }})
                    </button>
                  </div>
                </div>

                <!-- Bulk Item Importer Box -->
                <div v-if="showBulkItemBox" class="mb-3 p-3 bg-light rounded-3 border-2 border-dashed border-primary">
                  <label class="form-label small fw-bold text-primary mb-1">
                    <i class="bi bi-clipboard2-plus me-1"></i> Paste Banyak Item (Format per baris: Nama Layanan, Qty, Biaya Satuan)
                  </label>
                  <textarea
                    class="form-control form-control-sm font-monospace mb-2"
                    rows="3"
                    placeholder="UI/UX Prototyping Figma, 1, 3500000&#10;Frontend Web Slicing Vue 3, 1, 4500000&#10;Cloud Deployment VPS & SSL, 1, 1200000"
                    v-model="bulkItemsText"
                  ></textarea>
                  <button type="button" class="btn btn-sm btn-primary w-100 rounded-2 fw-semibold" @click="importBulkItems">
                    <i class="bi bi-plus-circle me-1"></i> Masukkan ke Rincian Item
                  </button>
                </div>

                <div v-if="errors.items" class="alert alert-danger py-1.5 px-3 small fw-bold mb-3">{{ errors.items }}</div>

                <!-- Item Rows with Spacious Inputs -->
                <div class="d-flex flex-column gap-2.5 mb-3" style="max-height: 480px; overflow-y: auto;">
                  <div
                    v-for="(item, idx) in invoice.items"
                    :key="idx"
                    class="p-3 rounded-3 border bg-light position-relative shadow-2xs hover-shadow-sm transition-all"
                  >
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-secondary-subtle text-dark px-2.5 py-1 small fw-bold">#{{ idx + 1 }}</span>
                        <span class="small fw-semibold text-muted">Item Pekerjaan</span>
                      </div>
                      <div class="d-flex align-items-center gap-2">
                        <span class="small fw-bold text-primary fs-6">
                          {{ formatCurrency((item.quantity || 1) * (item.biaya || 0)) }}
                        </span>
                        <!-- Move Up / Down Controls -->
                        <button
                          type="button"
                          class="btn btn-xs text-muted border-0 p-0"
                          :disabled="idx === 0"
                          @click="moveItem(idx, -1)"
                          title="Geser ke atas"
                        >
                          <i class="bi bi-chevron-up"></i>
                        </button>
                        <button
                          type="button"
                          class="btn btn-xs text-muted border-0 p-0"
                          :disabled="idx === invoice.items.length - 1"
                          @click="moveItem(idx, 1)"
                          title="Geser ke bawah"
                        >
                          <i class="bi bi-chevron-down"></i>
                        </button>
                        <button
                          type="button"
                          class="btn btn-xs text-danger border-0 p-0 ms-1"
                          @click="removeItem(idx)"
                          v-if="invoice.items.length > 1"
                          title="Hapus baris item ini"
                        >
                          <i class="bi bi-trash fs-6"></i>
                        </button>
                      </div>
                    </div>

                    <div class="row g-2">
                      <div class="col-12">
                        <input
                          type="text"
                          class="form-control form-control-sm bg-white"
                          v-model="item.nama"
                          placeholder="Deskripsi pekerjaan / layanan / nama produk..."
                        />
                      </div>
                      <div class="col-sm-4">
                        <div class="input-group input-group-sm">
                          <span class="input-group-text bg-white text-muted small">Qty</span>
                          <input
                            type="number"
                            class="form-control form-control-sm bg-white text-center font-monospace"
                            v-model.number="item.quantity"
                            min="1"
                          />
                        </div>
                      </div>
                      <div class="col-sm-8">
                        <div class="input-group input-group-sm">
                          <span class="input-group-text bg-white text-muted small">{{ invoice.currency }}</span>
                          <input
                            type="number"
                            class="form-control form-control-sm bg-white font-monospace"
                            v-model.number="item.biaya"
                            min="0"
                            placeholder="Harga Satuan"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Subtotal Quick Summary Pill -->
                <div class="p-3 rounded-3 bg-primary-subtle d-flex justify-content-between align-items-center">
                  <div>
                    <span class="small fw-bold text-primary d-block">Subtotal Sementara:</span>
                    <small class="text-muted">{{ invoice.items.length }} baris item tagihan</small>
                  </div>
                  <span class="fw-bold text-primary fs-5">{{ formatCurrency(subtotal) }}</span>
                </div>
              </div>

              <!-- ============================================ -->
              <!-- STEP 3: PEMBAYARAN, PAJAK, DISKON & SYARAT   -->
              <!-- ============================================ -->
              <div v-show="editorFormMode === 'all-in-one' || currentWizardStep === 3" class="wizard-section mb-4">
                <div class="section-badge-header mb-3 pb-2 border-bottom d-flex align-items-center justify-content-between">
                  <h6 class="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
                    <span class="badge bg-primary text-white rounded-circle p-1 px-2">3</span>
                    <span>Kalkulasi Keuangan & Instruksi Pembayaran</span>
                  </h6>
                  <span class="small text-muted">Pajak, diskon, rekening tujuan, & tanda tangan</span>
                </div>

                <div class="row g-3">
                  <!-- Diskon -->
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Potongan Harga / Diskon Khusus</label>
                    <div class="input-group input-group-sm">
                      <span class="input-group-text bg-light">{{ invoice.currency }}</span>
                      <input type="number" class="form-control" v-model.number="invoice.discount" min="0" />
                    </div>
                    <small class="text-danger" v-if="invoice.discount > 0">- {{ formatCurrency(invoice.discount) }}</small>
                  </div>

                  <!-- Pajak PPN -->
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Pajak PPN / VAT (%)</label>
                    <div class="input-group input-group-sm">
                      <input type="number" class="form-control" v-model.number="invoice.taxPercent" min="0" max="100" />
                      <span class="input-group-text bg-light">%</span>
                    </div>
                    <small class="text-muted" v-if="taxAmount > 0">+ {{ formatCurrency(taxAmount) }}</small>
                  </div>

                  <!-- Uang Muka / DP Opsional -->
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Uang Muka / DP Sudah Dibayar</label>
                    <div class="input-group input-group-sm">
                      <span class="input-group-text bg-light">{{ invoice.currency }}</span>
                      <input type="number" class="form-control" v-model.number="invoice.downPayment" min="0" />
                    </div>
                    <small class="text-success" v-if="invoice.downPayment > 0">Sisa tagihan otomatis dikurangi DP</small>
                  </div>

                  <!-- Biaya Pengiriman / Tambahan -->
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Biaya Lain / Ongkos Kirim</label>
                    <div class="input-group input-group-sm">
                      <span class="input-group-text bg-light">{{ invoice.currency }}</span>
                      <input type="number" class="form-control" v-model.number="invoice.shippingFee" min="0" />
                    </div>
                  </div>

                  <!-- Rekening Transfer Section -->
                  <div class="col-12 mt-3 pt-3 border-top">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <label class="form-label small fw-bold text-primary mb-0 text-uppercase">
                        <i class="bi bi-bank me-1"></i> Rekening Tujuan Transfer Pembayaran
                      </label>
                      <input
                        type="text"
                        class="form-control form-control-sm py-0 px-2"
                        v-model="invoice.labelPayment"
                        placeholder="Label: TRANSFER & PEMBAYARAN"
                        style="max-width: 230px; font-size: 11px;"
                        title="Sesuaikan teks label pembayaran"
                      />
                    </div>
                  </div>

                  <div class="col-md-4">
                    <label class="form-label small fw-bold text-dark">Nama Bank / Dompet Digital</label>
                    <input type="text" class="form-control form-control-sm" v-model="invoice.bankName" placeholder="Bank Central Asia (BCA)" />
                  </div>

                  <div class="col-md-4">
                    <label class="form-label small fw-bold text-dark">Nomor Rekening</label>
                    <input type="text" class="form-control form-control-sm font-monospace" v-model="invoice.bankAccount" placeholder="8830192831" />
                  </div>

                  <div class="col-md-4">
                    <label class="form-label small fw-bold text-dark">Atas Nama Rekening</label>
                    <input type="text" class="form-control form-control-sm" v-model="invoice.bankHolder" placeholder="Kafeinarts Digital Studio" />
                  </div>

                  <!-- Catatan & Ketentuan -->
                  <div class="col-12 mt-3 pt-3 border-top">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <label class="form-label small fw-bold text-dark mb-0">Catatan & Syarat Ketentuan</label>
                      <input
                        type="text"
                        class="form-control form-control-sm py-0 px-2"
                        v-model="invoice.labelNotes"
                        placeholder="Label: CATATAN & SYARAT"
                        style="max-width: 220px; font-size: 11px;"
                        title="Sesuaikan teks label catatan"
                      />
                    </div>
                    <textarea class="form-control form-control-sm" rows="3" v-model="invoice.notes" placeholder="Pembayaran mohon ditransfer dalam 14 hari kerja setelah invoice diterbitkan. Bukti transfer dapat dikirimkan melalui WhatsApp."></textarea>
                  </div>

                  <!-- Tanda Tangan Resmi -->
                  <div class="col-12 mt-3 pt-3 border-top">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <label class="form-label small fw-bold text-primary mb-0 text-uppercase">
                        <i class="bi bi-pen me-1"></i> Penandatangan Resmi Dokumen
                      </label>
                      <input
                        type="text"
                        class="form-control form-control-sm py-0 px-2"
                        v-model="invoice.labelSignature"
                        placeholder="Label: Hormat Kami,"
                        style="max-width: 180px; font-size: 11px;"
                      />
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Nama Penandatangan</label>
                    <input type="text" class="form-control form-control-sm" v-model="invoice.signerName" placeholder="Arif Permana Putrasuryana" />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Jabatan / Role</label>
                    <input type="text" class="form-control form-control-sm" v-model="invoice.signerTitle" placeholder="Lead Creative Director" />
                  </div>

                  <div class="col-12">
                    <div class="d-flex align-items-center justify-content-between p-2 rounded-2 border bg-light">
                      <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-stamp text-secondary fs-5"></i>
                        <div>
                          <span class="small fw-bold text-dark d-block">Gambar Tanda Tangan / Stempel Digital:</span>
                          <span class="small text-muted" style="font-size: 11px;">Upload file PNG transparan untuk ditampilkan di atas tanda tangan.</span>
                        </div>
                      </div>
                      <div class="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          class="btn btn-xs btn-outline-danger"
                          v-if="invoice.signatureImageUrl"
                          @click="invoice.signatureImageUrl = ''"
                        >
                          Hapus Gambar
                        </button>
                        <label class="btn btn-xs btn-outline-primary mb-0">
                          <i class="bi bi-upload me-1"></i> Upload Stempel / TTD
                          <input type="file" accept="image/*" class="d-none" @change="handleSignatureUpload" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ============================================ -->
              <!-- STEP 4: FULL CUSTOMIZATION & BRANDING        -->
              <!-- ============================================ -->
              <div v-show="editorFormMode === 'all-in-one' || currentWizardStep === 4" class="wizard-section mb-4">
                <div class="section-badge-header mb-3 pb-2 border-bottom d-flex align-items-center justify-content-between">
                  <h6 class="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
                    <span class="badge bg-primary text-white rounded-circle p-1 px-2">4</span>
                    <span>Kustomisasi Kop Bisnis & Tampilan Kertas</span>
                  </h6>
                  <span class="small text-muted">Format kertas, warna brand, logo & watermark</span>
                </div>

                <div class="row g-3">
                  <!-- Format & Orientasi Kertas -->
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Format Ukuran Kertas</label>
                    <select class="form-select form-select-sm" v-model="invoice.paperSize">
                      <option value="a5">A5 (148 × 210 mm) - Ringkas & Modern</option>
                      <option value="a4">A4 (210 × 297 mm) - Standar Resmi</option>
                    </select>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Orientasi Kertas</label>
                    <div class="btn-group btn-group-sm w-100">
                      <button
                        type="button"
                        class="btn"
                        :class="invoice.paperOrientation === 'landscape' ? 'btn-primary fw-bold' : 'btn-outline-secondary bg-white'"
                        @click="invoice.paperOrientation = 'landscape'"
                      >
                        <i class="bi bi-layout-sidebar-reverse me-1"></i> Mendatar (Landscape)
                      </button>
                      <button
                        type="button"
                        class="btn"
                        :class="invoice.paperOrientation === 'portrait' ? 'btn-primary fw-bold' : 'btn-outline-secondary bg-white'"
                        @click="invoice.paperOrientation = 'portrait'"
                      >
                        <i class="bi bi-file-earmark me-1"></i> Tegak (Portrait)
                      </button>
                    </div>
                  </div>

                  <!-- Tema Kertas & Skema Warna -->
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Tema Latar Kertas</label>
                    <div class="btn-group btn-group-sm w-100">
                      <button
                        type="button"
                        class="btn"
                        :class="invoice.paperTheme === 'light' ? 'btn-primary fw-bold' : 'btn-outline-secondary bg-white'"
                        @click="invoice.paperTheme = 'light'"
                      >
                        <i class="bi bi-sun me-1"></i> Putih Bersih (Light)
                      </button>
                      <button
                        type="button"
                        class="btn"
                        :class="invoice.paperTheme === 'dark' ? 'btn-dark fw-bold' : 'btn-outline-secondary bg-white'"
                        @click="invoice.paperTheme = 'dark'"
                      >
                        <i class="bi bi-moon-stars me-1"></i> Gelap Modern (Dark)
                      </button>
                    </div>
                  </div>

                  <!-- Warna Aksen Dokumen -->
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark d-flex justify-content-between">
                      <span>Warna Aksen Identitas Brand</span>
                      <span class="font-monospace small text-primary">{{ resolvedAccentHex }}</span>
                    </label>
                    <div class="d-flex gap-2 align-items-center flex-wrap">
                      <button
                        type="button"
                        v-for="color in accentColorOptions"
                        :key="color.id"
                        class="btn p-0 rounded-circle border-2 transition-transform hover-scale"
                        :style="{ backgroundColor: color.hex, width: '26px', height: '26px' }"
                        :class="invoice.accentColor === color.id ? 'border-dark shadow-sm' : 'border-transparent'"
                        @click="invoice.accentColor = color.id"
                        :title="color.name"
                      ></button>
                      <!-- Custom Hex Color Input -->
                      <div class="d-flex align-items-center gap-1 ms-1">
                        <input
                          type="color"
                          class="form-control form-control-color p-0 border-0 rounded-circle"
                          style="width: 26px; height: 26px; cursor: pointer;"
                          v-model="invoice.customAccentHex"
                          @input="invoice.accentColor = 'custom'"
                          title="Pilih Warna Kustom Sesuka Hati"
                        />
                        <span class="small text-muted" style="font-size: 11px;">Custom Hex</span>
                      </div>
                    </div>
                  </div>

                  <!-- Watermark / Cap Dokumen -->
                  <div class="col-12 border-top pt-3">
                    <div class="d-flex align-items-center justify-content-between p-2.5 rounded-3 bg-light border flex-wrap gap-2">
                      <div class="form-check form-switch mb-0">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="watermarkToggle"
                          v-model="invoice.showWatermark"
                        />
                        <label class="form-check-label small fw-bold text-dark" for="watermarkToggle">
                          Tampilkan Cap Stempel / Watermark Diagonal Dokumen
                        </label>
                      </div>

                      <div v-if="invoice.showWatermark" class="d-flex align-items-center gap-2">
                        <select class="form-select form-select-sm py-0.5" v-model="invoice.watermarkText" style="width: 140px;">
                          <option value="LUNAS">LUNAS / PAID</option>
                          <option value="DRAFT">DRAFT</option>
                          <option value="MENUNGGU">MENUNGGU</option>
                          <option value="ORIGINAL">ORIGINAL</option>
                          <option value="COPY">COPY</option>
                        </select>
                        <input
                          type="text"
                          class="form-control form-control-sm py-0.5"
                          v-model="invoice.watermarkText"
                          placeholder="Ketik teks custom..."
                          style="width: 140px;"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Kustomisasi Kop Bisnis Pengirim (Fully Customizable!) -->
                  <div class="col-12 border-top pt-3">
                    <div class="form-check form-switch mb-2">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="customSenderToggle"
                        v-model="invoice.useCustomSender"
                      />
                      <label class="form-check-label small fw-bold text-primary" for="customSenderToggle">
                        <i class="bi bi-pencil-square me-1"></i> Edit Identitas / Kop Bisnis Khusus untuk Invoice Ini
                      </label>
                    </div>
                    <small class="text-muted d-block mb-2" v-if="!invoice.useCustomSender">
                      Saat ini menggunakan data profil bisnis default ({{ myBusiness.name }}). Aktifkan tombol di atas untuk mengubah nama bisnis, kontak, alamat, atau slogan sesuka hati.
                    </small>

                    <div v-if="invoice.useCustomSender" class="p-3 rounded-3 bg-light border row g-2">
                      <div class="col-md-6">
                        <label class="form-label small fw-bold text-dark">Nama Bisnis / Studio / PT</label>
                        <input type="text" class="form-control form-control-sm" v-model="invoice.senderName" placeholder="Kafeinarts Creative Studio" />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small fw-bold text-dark">Slogan / Bidang Usaha</label>
                        <input type="text" class="form-control form-control-sm" v-model="invoice.senderTagline" placeholder="Digital Creative & Software Development" />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small fw-bold text-dark">Email Bisnis</label>
                        <input type="email" class="form-control form-control-sm" v-model="invoice.senderEmail" placeholder="studio@kafeinarts.id" />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small fw-bold text-dark">No. HP / WhatsApp Bisnis</label>
                        <input type="text" class="form-control form-control-sm" v-model="invoice.senderPhone" placeholder="0812-3456-7890" />
                      </div>
                      <div class="col-12">
                        <label class="form-label small fw-bold text-dark">Alamat Kantor Bisnis</label>
                        <input type="text" class="form-control form-control-sm" v-model="invoice.senderAddress" placeholder="Jl. Kreatif No. 10, Jakarta Selatan" />
                      </div>
                    </div>
                  </div>

                  <!-- Logo Dokumen -->
                  <div class="col-md-6 border-top pt-3">
                    <label class="form-label small fw-bold text-dark">Pilihan Logo Kop</label>
                    <select class="form-select form-select-sm" v-model="invoice.logoType">
                      <option value="kafeinarts">Logo Kafeinarts (Vector Inverted)</option>
                      <option value="custom">Upload Logo Kustom (PNG/JPG/SVG)</option>
                      <option value="none">Tanpa Logo (Inisial Teks Badge)</option>
                    </select>
                  </div>

                  <div class="col-md-6 border-top pt-3" v-if="invoice.logoType === 'kafeinarts'">
                    <label class="form-label small fw-bold text-dark">Garis Outline Vector Logo</label>
                    <select class="form-select form-select-sm" v-model="invoice.logoOutlineMode">
                      <option value="auto">Otomatis Invert (Hitam/Putih)</option>
                      <option value="dark">Hitam Pekat (#0f172a)</option>
                      <option value="light">Putih Terang (#ffffff)</option>
                    </select>
                  </div>

                  <div class="col-12" v-if="invoice.logoType === 'custom'">
                    <label class="form-label small fw-bold text-dark">Pilih Berkas Gambar Logo</label>
                    <input type="file" class="form-control form-control-sm" accept="image/*" @change="handleCustomLogoUpload" />
                  </div>

                  <div class="col-12" v-if="invoice.logoType === 'kafeinarts'">
                    <div class="d-flex align-items-center justify-content-between p-2 rounded-2 border" :class="invoice.paperTheme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-light text-dark'">
                      <div class="d-flex align-items-center gap-2">
                        <KafeinartsLogo :size="38" :outline-mode="invoice.logoOutlineMode" :inverted="invoice.paperTheme === 'dark'" />
                        <div class="small">
                          <strong class="text-primary d-block">Kafeinarts Vector Aktif</strong>
                          <span class="opacity-75">Tampilan proporsional di seluruh ukuran kertas</span>
                        </div>
                      </div>
                      <div class="d-flex align-items-center gap-1">
                        <label class="small text-muted me-1 mb-0">Ukuran:</label>
                        <select class="form-select form-select-sm py-0.5" v-model.number="invoice.logoSize" style="width: 85px;">
                          <option :value="44">Kecil</option>
                          <option :value="52">Sedang</option>
                          <option :value="64">Besar</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Wizard Stepper Navigation Footer & Action Buttons -->
              <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div class="d-flex gap-2">
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm px-3 rounded-3"
                    v-if="editorFormMode === 'wizard' && currentWizardStep > 1"
                    @click="currentWizardStep--"
                  >
                    <i class="bi bi-arrow-left me-1"></i> Langkah Sebelumnya
                  </button>

                  <button
                    type="button"
                    class="btn btn-primary btn-sm px-3 rounded-3 fw-semibold"
                    v-if="editorFormMode === 'wizard' && currentWizardStep < 4"
                    @click="currentWizardStep++"
                  >
                    Lanjut ke Langkah {{ currentWizardStep + 1 }} <i class="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>

                <div class="d-flex align-items-center gap-2 ms-auto">
                  <div class="text-end me-2">
                    <small class="text-muted d-block">Total Akhir:</small>
                    <strong class="text-dark fs-6">{{ formatCurrency(totalAmount) }}</strong>
                  </div>
                  <button type="submit" class="btn btn-success px-4 py-2 rounded-3 fw-bold shadow-sm d-flex align-items-center gap-1.5 btn-sm">
                    <i class="bi bi-save"></i>
                    <span>Simpan Riwayat</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- LIVE DOCUMENT PREVIEW (Right or Bottom) -->
      <div
        v-show="layoutMode !== 'editor-only'"
        :class="layoutMode === 'stacked' || layoutMode === 'preview-only' ? 'col-12' : 'col-xl-6 col-lg-6'"
      >
        <!-- Floating Preview Control Toolbar -->
        <div class="d-flex justify-content-between align-items-center mb-2 px-1 flex-wrap gap-2 no-print">
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-dark text-white px-3 py-1.5 rounded-pill small fw-bold d-flex align-items-center gap-1.5">
              <i class="bi bi-aspect-ratio text-warning"></i>
              <span>{{ currentPaperLabel }}</span>
            </span>
            <!-- Inline Edit Toggle -->
            <button
              type="button"
              class="btn btn-xs rounded-pill px-2.5 py-1 transition-all"
              :class="isInlineEditing ? 'btn-warning text-dark fw-bold shadow-xs' : 'btn-outline-secondary bg-white text-dark'"
              @click="isInlineEditing = !isInlineEditing"
              title="Edit Langsung di Lembar Kertas"
            >
              <i class="bi bi-pencil-fill me-1"></i>
              <span>{{ isInlineEditing ? 'Selesai Edit Langsung' : 'Edit Langsung di Kertas' }}</span>
            </button>
          </div>

          <!-- Preview Zoom Controls & Direct Actions -->
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-secondary bg-white px-2" :disabled="previewZoom <= 30" @click="previewZoom = Math.max(30, previewZoom - 10)" title="Perkecil Zoom">-</button>
              <button type="button" class="btn btn-light border px-2 fw-semibold" style="min-width: 44px; font-size: 11.5px;" @click="previewZoom = 100" title="Reset 100%">{{ previewZoom }}%</button>
              <button type="button" class="btn btn-outline-secondary bg-white px-2" :disabled="previewZoom >= 160" @click="previewZoom = Math.min(160, previewZoom + 10)" title="Perbesar Zoom">+</button>
              <button type="button" class="btn btn-outline-primary bg-white px-2 fw-bold" @click="fitPreviewToScreen" title="Sesuaikan dengan Lebar Layar">Fit</button>
            </div>

            <button
              class="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 bg-white text-dark"
              @click="invoice.paperTheme = invoice.paperTheme === 'dark' ? 'light' : 'dark'"
              title="Ganti Tema Kertas (Terang / Gelap)"
            >
              <i :class="invoice.paperTheme === 'dark' ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-stars-fill text-dark'"></i>
            </button>

            <button class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-semibold bg-white" @click="triggerPrint">
              <i class="bi bi-printer me-1"></i> Cetak
            </button>
            <button class="btn btn-sm btn-primary rounded-pill px-3 py-1 fw-bold" @click="downloadPDF">
              <i class="bi bi-box-arrow-up-right me-1"></i> PDF
            </button>
          </div>
        </div>

        <!-- Notification Banner when Inline Edit is active -->
        <div v-if="isInlineEditing" class="alert alert-warning py-1.5 px-3 mb-2 small d-flex align-items-center justify-content-between rounded-3 no-print">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-info-circle-fill text-warning"></i>
            <span><strong>Mode Edit Langsung Aktif:</strong> Anda dapat mengedit teks judul, nama klien, catatan & rincian langsung di atas lembar preview.</span>
          </div>
          <button type="button" class="btn btn-xs btn-dark rounded-pill px-2" @click="isInlineEditing = false">Tutup</button>
        </div>

        <!-- DOCUMENT VIEWPORT CONTAINER (ZOOMABLE) -->
        <div class="invoice-viewport-wrapper">
          <div
            class="invoice-zoom-container"
            :style="{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top center' }"
          >
            <!-- AUTHENTIC PRINTABLE DOCUMENT SHEET -->
            <div
              class="invoice-paper-sheet shadow-lg rounded-4 transition-all position-relative"
              :class="[
                paperSheetClass,
                invoice.paperTheme === 'dark' ? 'bg-dark text-white is-dark' : 'bg-white text-dark is-light',
                'accent-' + (invoice.accentColor || 'primary')
              ]"
              id="invoicePreviewArea"
            >
              <!-- ACCENT COLOR TOP STRIPE -->
              <div class="invoice-accent-bar" :style="{ backgroundColor: resolvedAccentHex }"></div>

              <!-- WATERMARK STAMP OVERLAY -->
              <div
                v-if="invoice.showWatermark"
                class="invoice-watermark-overlay"
                :style="{ borderColor: resolvedAccentHex, color: resolvedAccentHex }"
              >
                {{ invoice.watermarkText || 'LUNAS' }}
              </div>

              <div class="invoice-sheet-inner p-4 p-md-4-5">
                <!-- HEADER SECTION: KOP PERUSAHAAN & INVOICE META -->
                <div class="d-flex justify-content-between align-items-start pb-3 mb-3 border-bottom invoice-header-divider">
                  <!-- Left: Logo & Company Identity (Kop Bisnis) -->
                  <div class="d-flex align-items-center gap-3">
                    <!-- Kafeinarts Vector Logo -->
                    <div v-if="invoice.logoType === 'kafeinarts'" class="flex-shrink-0">
                      <KafeinartsLogo
                        :size="invoice.logoSize || 52"
                        :outline-mode="invoice.logoOutlineMode || 'auto'"
                        :inverted="invoice.paperTheme === 'dark'"
                      />
                    </div>
                    <!-- Custom Uploaded Logo -->
                    <div v-else-if="invoice.logoType === 'custom' && invoice.customLogoUrl" class="flex-shrink-0">
                      <img :src="invoice.customLogoUrl" :style="{ maxHeight: (invoice.logoSize || 52) + 'px' }" class="rounded object-fit-contain" alt="Logo Bisnis" />
                    </div>
                    <!-- Fallback Inisial Badge -->
                    <div v-else class="rounded-3 px-2.5 py-1.5 fw-bold fs-5 text-white flex-shrink-0" :style="{ backgroundColor: resolvedAccentHex }">
                      {{ (activeBusiness.name || 'KA').substring(0, 2).toUpperCase() }}
                    </div>

                    <div>
                      <div v-if="isInlineEditing">
                        <input
                          type="text"
                          class="form-control form-control-sm fw-bold mb-1"
                          v-model="activeBusiness.name"
                          placeholder="Nama Perusahaan / Bisnis"
                        />
                        <input
                          type="text"
                          class="form-control form-control-sm small mb-1"
                          v-model="activeBusiness.tagline"
                          placeholder="Slogan / Bidang Usaha"
                        />
                      </div>
                      <div v-else>
                        <h4 class="fw-extrabold mb-0 leading-tight" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">
                          {{ activeBusiness.name }}
                        </h4>
                        <p class="small mb-0 opacity-75" style="font-size: 11.5px;">{{ activeBusiness.tagline }}</p>
                      </div>
                      <div class="small opacity-65 d-flex gap-2 flex-wrap" style="font-size: 11px;">
                        <span><i class="bi bi-envelope me-1"></i>{{ activeBusiness.email }}</span>
                        <span>•</span>
                        <span><i class="bi bi-telephone me-1"></i>{{ activeBusiness.phone }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Right: Invoice Title, Number & Status -->
                  <div class="text-end">
                    <div class="d-flex align-items-center justify-content-end gap-2 mb-1">
                      <span
                        class="badge text-uppercase px-2.5 py-1 rounded-pill small fw-extrabold"
                        :style="{ backgroundColor: resolvedAccentHex, color: '#ffffff' }"
                      >
                        {{ invoice.documentTitle || 'INVOICE' }}
                      </span>
                      <span
                        class="badge rounded-pill px-2.5 py-1 small fw-bold"
                        :class="getStatusBadgeClass(invoice.status)"
                      >
                        {{ invoice.status || 'Belum Bayar' }}
                      </span>
                    </div>

                    <div v-if="isInlineEditing" class="d-flex justify-content-end mb-1">
                      <input
                        type="text"
                        class="form-control form-control-sm text-end font-monospace fw-bold"
                        v-model="invoice.invoiceNumber"
                        style="width: 170px;"
                      />
                    </div>
                    <h5 v-else class="fw-extrabold font-monospace mb-0" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">
                      {{ invoice.invoiceNumber }}
                    </h5>

                    <!-- PO Number if present -->
                    <div class="small fw-semibold opacity-75 text-truncate" style="font-size: 11px;" v-if="invoice.poNumber">
                      PO: <strong>{{ invoice.poNumber }}</strong>
                    </div>

                    <div class="small opacity-75" style="font-size: 11px;">
                      Terbit: <strong>{{ formatDate(invoice.issueDate) }}</strong> • Tempo: <strong class="text-danger">{{ formatDate(invoice.dueDate) }}</strong>
                    </div>
                  </div>
                </div>

                <!-- CLIENT & BILLING INFO METADATA (2-COLUMN BALANCED ROW) -->
                <div class="row g-2 mb-3">
                  <!-- Client Info Card -->
                  <div class="col-7">
                    <div class="p-2.5 rounded-3 border invoice-meta-card h-100" :class="invoice.paperTheme === 'dark' ? 'bg-dark-subtle-box' : 'bg-light-box'">
                      <span class="d-block text-uppercase fw-bold opacity-60 mb-0.5" style="font-size: 10px; letter-spacing: 0.5px;">
                        {{ invoice.labelBillTo || 'DITAGIHKAN KEPADA (BILL TO):' }}
                      </span>
                      <div v-if="isInlineEditing">
                        <input
                          type="text"
                          class="form-control form-control-sm mb-1 fw-bold"
                          v-model="invoice.clientName"
                          placeholder="Nama Klien"
                        />
                        <input
                          type="text"
                          class="form-control form-control-sm small"
                          v-model="invoice.clientAddress"
                          placeholder="Alamat Klien"
                        />
                      </div>
                      <div v-else>
                        <div class="fw-bold text-truncate" style="font-size: 13.5px;" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">
                          {{ invoice.clientName || 'Nama Klien / Perusahaan' }}
                        </div>
                        <div class="small opacity-75 text-truncate" style="font-size: 11px;" v-if="invoice.clientCompany">
                          Attn: {{ invoice.clientCompany }}
                        </div>
                        <div class="small opacity-75 text-truncate" style="font-size: 11px;" v-if="invoice.clientEmail || invoice.clientPhone">
                          {{ [invoice.clientEmail, invoice.clientPhone].filter(Boolean).join(' • ') }}
                        </div>
                        <div class="small opacity-75 text-truncate" style="font-size: 11px;" v-if="invoice.clientAddress">
                          {{ invoice.clientAddress }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Payment Destination Card -->
                  <div class="col-5">
                    <div class="p-2.5 rounded-3 border invoice-meta-card h-100" :class="invoice.paperTheme === 'dark' ? 'bg-dark-subtle-box' : 'bg-light-box'">
                      <span class="d-block text-uppercase fw-bold opacity-60 mb-0.5" style="font-size: 10px; letter-spacing: 0.5px;">
                        {{ invoice.labelPayment || 'TRANSFER & PEMBAYARAN:' }}
                      </span>
                      <div class="fw-bold text-truncate" style="font-size: 13px;" :style="{ color: resolvedAccentHex }">
                        {{ invoice.bankName || 'Bank Central Asia (BCA)' }}
                      </div>
                      <div class="small font-monospace fw-bold" style="font-size: 12px;">
                        {{ invoice.bankAccount || '8830-1928-31' }}
                      </div>
                      <div class="small opacity-75 text-truncate" style="font-size: 11px;">
                        a/n {{ invoice.bankHolder || 'Kafeinarts Studio' }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ITEMS TABLE -->
                <div class="table-responsive mb-3 invoice-table-container">
                  <table class="table table-sm align-middle border mb-0 invoice-items-table" :class="invoice.paperTheme === 'dark' ? 'table-dark border-secondary' : ''">
                    <thead>
                      <tr :class="invoice.paperTheme === 'dark' ? 'bg-secondary bg-opacity-25 text-light' : 'bg-light text-dark'">
                        <th class="text-center" style="width: 32px; font-size: 11px;">#</th>
                        <th style="font-size: 11px;">DESKRIPSI PEKERJAAN / LAYANAN</th>
                        <th class="text-center" style="width: 60px; font-size: 11px;">QTY</th>
                        <th class="text-end" style="width: 125px; font-size: 11px;">HARGA UNIT</th>
                        <th class="text-end" style="width: 135px; font-size: 11px;">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="invoice.items.length === 0 || (invoice.items.length === 1 && !invoice.items[0].nama && invoice.items[0].biaya === 0)">
                        <td colspan="5" class="text-center py-4 text-muted small fst-italic">
                          Belum ada item tagihan. Silakan tambahkan rincian item pekerjaan di formulir.
                        </td>
                      </tr>
                      <tr v-else v-for="(item, idx) in invoice.items" :key="idx" class="invoice-table-row">
                        <td class="text-center text-muted small" style="font-size: 11px;">{{ idx + 1 }}</td>
                        <td>
                          <div v-if="isInlineEditing">
                            <input type="text" class="form-control form-control-sm py-0.5" v-model="item.nama" placeholder="Nama item / layanan..." />
                          </div>
                          <div v-else class="fw-semibold" style="font-size: 12px;" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">
                            {{ item.nama || '-' }}
                          </div>
                        </td>
                        <td class="text-center fw-bold small" style="font-size: 11px;">
                          <input v-if="isInlineEditing" type="number" class="form-control form-control-sm text-center py-0.5" v-model.number="item.quantity" style="width: 50px; margin: auto;" />
                          <span v-else>{{ item.quantity || 1 }}</span>
                        </td>
                        <td class="text-end text-muted small" style="font-size: 11px;">
                          <input v-if="isInlineEditing" type="number" class="form-control form-control-sm text-end py-0.5" v-model.number="item.biaya" />
                          <span v-else>{{ formatCurrency(item.biaya || 0) }}</span>
                        </td>
                        <td class="text-end fw-bold" style="font-size: 12px;" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">
                          {{ formatCurrency((item.quantity || 1) * (item.biaya || 0)) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- BOTTOM SECTION: NOTES + SIGNATURE (LEFT) & TOTALS CALCULATION (RIGHT) -->
                <div class="row g-2 align-items-end pt-1">
                  <!-- Left: Notes & Signature -->
                  <div class="col-7">
                    <!-- Payment Instruction Notes -->
                    <div class="mb-2">
                      <span class="d-block fw-bold opacity-60 text-uppercase" style="font-size: 10px;">
                        {{ invoice.labelNotes || 'CATATAN & SYARAT KETENTUAN:' }}
                      </span>
                      <textarea
                        v-if="isInlineEditing"
                        class="form-control form-control-sm"
                        rows="2"
                        v-model="invoice.notes"
                      ></textarea>
                      <p v-else class="small mb-0 opacity-75 invoice-notes-text" style="font-size: 11px; line-height: 1.4;">
                        {{ invoice.notes || 'Pembayaran mohon ditransfer paling lambat sesuai tanggal jatuh tempo. Bukti transfer dapat dikirimkan melalui WhatsApp. Terima kasih!' }}
                      </p>
                    </div>

                    <!-- Signature Block -->
                    <div class="d-flex align-items-center gap-3 pt-1">
                      <div class="text-center" style="min-width: 150px;">
                        <small class="opacity-60 d-block" style="font-size: 10px;">{{ invoice.labelSignature || 'Hormat Kami,' }}</small>
                        <div class="my-1 text-muted d-flex align-items-center justify-content-center" style="height: 38px;">
                          <!-- Uploaded Signature Image if available -->
                          <img
                            v-if="invoice.signatureImageUrl"
                            :src="invoice.signatureImageUrl"
                            alt="Stempel / Tanda Tangan"
                            style="max-height: 36px; max-width: 120px;"
                            class="object-fit-contain"
                          />
                          <span v-else class="font-monospace text-primary opacity-60 fst-italic" style="font-size: 13px;">
                            {{ activeBusiness.name }}
                          </span>
                        </div>
                        <div class="border-top pt-0.5 fw-bold text-truncate" style="font-size: 11px;" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">
                          {{ invoice.signerName || 'Arif Permana Putrasuryana' }}
                        </div>
                        <div class="small opacity-60" style="font-size: 9.5px;" v-if="invoice.signerTitle">
                          {{ invoice.signerTitle }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right: Financial Summary Box -->
                  <div class="col-5">
                    <div class="p-2.5 rounded-3 border invoice-totals-box" :class="invoice.paperTheme === 'dark' ? 'bg-dark-subtle-box' : 'bg-light-box'">
                      <!-- Subtotal -->
                      <div class="d-flex justify-content-between mb-1 small" style="font-size: 11px;">
                        <span class="opacity-75">Subtotal:</span>
                        <span class="fw-semibold">{{ formatCurrency(subtotal) }}</span>
                      </div>

                      <!-- Discount -->
                      <div class="d-flex justify-content-between mb-1 small text-danger" style="font-size: 11px;" v-if="invoice.discount > 0">
                        <span>Diskon:</span>
                        <span>- {{ formatCurrency(invoice.discount) }}</span>
                      </div>

                      <!-- Tax -->
                      <div class="d-flex justify-content-between mb-1 small text-muted" style="font-size: 11px;" v-if="invoice.taxPercent > 0">
                        <span>PPN ({{ invoice.taxPercent }}%):</span>
                        <span>+ {{ formatCurrency(taxAmount) }}</span>
                      </div>

                      <!-- Shipping / Other Fee -->
                      <div class="d-flex justify-content-between mb-1 small text-muted" style="font-size: 11px;" v-if="invoice.shippingFee > 0">
                        <span>Biaya Lain:</span>
                        <span>+ {{ formatCurrency(invoice.shippingFee) }}</span>
                      </div>

                      <!-- Down Payment -->
                      <div class="d-flex justify-content-between mb-1 small text-success" style="font-size: 11px;" v-if="invoice.downPayment > 0">
                        <span>DP / Uang Muka:</span>
                        <span>- {{ formatCurrency(invoice.downPayment) }}</span>
                      </div>

                      <!-- Grand Total Highlight -->
                      <div
                        class="d-flex justify-content-between align-items-center p-2 rounded-2 mt-1.5 text-white fw-bold"
                        :style="{ backgroundColor: resolvedAccentHex }"
                      >
                        <span style="font-size: 11.5px; letter-spacing: 0.5px;">TOTAL:</span>
                        <span style="font-size: 14.5px;">{{ formatCurrency(totalAmount) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Saved Invoices History Section -->
    <div class="card border-0 shadow-sm rounded-4 bg-white mb-4 no-print" v-if="savedInvoices.length > 0">
      <div class="card-header bg-transparent border-bottom p-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-clock-history text-primary fs-5"></i>
          <h5 class="fw-bold text-dark mb-0">Riwayat Tagihan / Invoice Tersimpan</h5>
          <span class="badge bg-secondary-subtle text-dark rounded-pill">{{ savedInvoices.length }}</span>
        </div>
        <div v-if="selectedIds.length > 0" class="d-flex gap-2 align-items-center">
          <span class="small fw-bold text-primary me-2">{{ selectedIds.length }} terpilih</span>
          <button class="btn btn-sm btn-danger rounded-pill px-3" @click="bulkDelete">
            <i class="bi bi-trash-fill me-1"></i> Hapus Terpilih
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 40px;" class="text-center">
                  <input type="checkbox" class="form-check-input" :checked="isAllSelected" @change="toggleSelectAll" />
                </th>
                <th>Tipe / No. Dokumen</th>
                <th>Klien</th>
                <th>Tanggal Terbit</th>
                <th>Jatuh Tempo</th>
                <th>Status</th>
                <th>Total</th>
                <th class="text-end pe-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inv in savedInvoices" :key="inv.id">
                <td class="text-center">
                  <input type="checkbox" class="form-check-input" :value="inv.id" v-model="selectedIds" />
                </td>
                <td>
                  <span class="badge bg-light text-muted border me-1 small">{{ inv.documentTitle || 'INVOICE' }}</span>
                  <span class="fw-bold text-primary font-monospace">{{ inv.invoiceNumber }}</span>
                </td>
                <td>{{ inv.clientName || 'Klien Umum' }}</td>
                <td>{{ formatDate(inv.issueDate) }}</td>
                <td>{{ formatDate(inv.dueDate) }}</td>
                <td>
                  <span class="badge rounded-pill px-2.5 py-1 small fw-semibold" :class="getStatusBadgeClass(inv.status)">
                    {{ inv.status || 'Belum Bayar' }}
                  </span>
                </td>
                <td class="fw-bold text-success">{{ formatCurrency(calcTotal(inv)) }}</td>
                <td class="text-end pe-4">
                  <button class="btn btn-sm btn-outline-primary rounded-pill px-3 me-1" @click="loadInvoice(inv)" title="Muat ke Editor">
                    <i class="bi bi-pencil-square me-1"></i> Edit
                  </button>
                  <button class="btn btn-sm btn-light text-danger rounded-circle" @click="deleteSingleInvoice(inv.id)" title="Hapus">
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3 no-print" style="z-index: 1090;">
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
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { openPdfBlobInNewTab, openPrintableDocumentInNewTab } from '../utils/pdfTabOpener';
import KafeinartsLogo from '../components/KafeinartsLogo.vue';
import { getKafeinartsLogoDataUrl } from '../utils/kafeinartsLogoHelper';

export default {
  name: 'InvoiceView',
  components: {
    KafeinartsLogo
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const toast = ref({ show: false, message: '' });
    const errors = ref({});
    const showBulkItemBox = ref(false);
    const bulkItemsText = ref('');
    const selectedIds = ref([]);
    const isInlineEditing = ref(false);

    // Layout & Wizard States
    const layoutMode = ref(localStorage.getItem('ft_invoice_layout_mode') || 'side-by-side');
    const setLayoutMode = (mode) => {
      layoutMode.value = mode;
      localStorage.setItem('ft_invoice_layout_mode', mode);
      setTimeout(() => fitPreviewToScreen(), 100);
    };

    const editorFormMode = ref('wizard'); // 'wizard' | 'all-in-one'
    const currentWizardStep = ref(1);
    const previewZoom = ref(100);

    const wizardSteps = [
      { number: 1, title: 'Klien & Dokumen', desc: 'No. invoice, tanggal, data klien' },
      { number: 2, title: 'Rincian Item', desc: 'Daftar layanan, produk & harga' },
      { number: 3, title: 'Pembayaran & Catatan', desc: 'Diskon, pajak, rekening & TTD' },
      { number: 4, title: 'Kustomisasi & Kop', desc: 'Kertas, logo, warna & watermark' }
    ];

    const currentStepTitle = computed(() => {
      const s = wizardSteps.find(st => st.number === currentWizardStep.value);
      return s ? s.title : '';
    });

    const servicePresets = [
      { nama: 'Pengembangan Web Application Vue 3', biaya: 4500000 },
      { nama: 'Desain UI/UX & Prototyping Figma', biaya: 3000000 },
      { nama: 'Slicing Frontend Tailwind CSS', biaya: 2500000 },
      { nama: 'Integrasi API & Backend Cloud', biaya: 3500000 },
      { nama: 'Pemeliharaan & Server Cloud Hosting', biaya: 1200000 }
    ];

    const accentColorOptions = [
      { id: 'primary', name: 'Biru Royal', hex: '#2563eb' },
      { id: 'indigo', name: 'Indigo Deep', hex: '#4f46e5' },
      { id: 'emerald', name: 'Emerald Green', hex: '#059669' },
      { id: 'amber', name: 'Amber Gold', hex: '#d97706' },
      { id: 'slate', name: 'Slate Charcoal', hex: '#334155' },
      { id: 'rose', name: 'Rose Crimson', hex: '#e11d48' },
      { id: 'cyan', name: 'Cyan Teal', hex: '#0891b2' },
      { id: 'violet', name: 'Violet Purple', hex: '#7c3aed' }
    ];

    const myBusiness = computed(() => store.getters.getMyBusiness || {
      name: 'Kafeinarts Digital Creative',
      tagline: 'Solusi Desain, Web Application & Digital Creative Studio',
      email: 'studio@kafeinarts.id',
      phone: '0812-3456-7890',
      address: 'Jakarta, Indonesia'
    });

    const savedInvoices = computed(() => store.getters.getInvoices || []);

    const invoice = ref({
      invoiceNumber: '',
      documentTitle: 'INVOICE',
      poNumber: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      clientName: '',
      clientCompany: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      currency: 'IDR',
      status: 'Belum Bayar',

      // Kop & Sender Customization
      useCustomSender: false,
      senderName: '',
      senderTagline: '',
      senderEmail: '',
      senderPhone: '',
      senderAddress: '',

      // Custom Labels
      labelBillTo: 'DITAGIHKAN KEPADA (BILL TO):',
      labelPayment: 'TRANSFER & PEMBAYARAN:',
      labelNotes: 'CATATAN & SYARAT KETENTUAN:',
      labelSignature: 'Hormat Kami,',

      // Paper & Styling
      paperSize: 'a5', // 'a5' | 'a4'
      paperOrientation: 'landscape', // 'landscape' | 'portrait'
      paperTheme: 'light', // 'light' | 'dark'
      accentColor: 'primary',
      customAccentHex: '#2563eb',

      // Watermark
      showWatermark: false,
      watermarkText: 'LUNAS',

      // Logo
      logoType: 'kafeinarts',
      logoOutlineMode: 'auto',
      logoSize: 52,
      customLogoUrl: '',

      // Payment & Bank
      bankName: '',
      bankAccount: '',
      bankHolder: '',

      // Signature
      signerName: '',
      signerTitle: '',
      signatureImageUrl: '',

      // Financials
      items: [
        { nama: '', quantity: 1, biaya: null }
      ],
      taxPercent: null,
      discount: null,
      downPayment: null,
      shippingFee: null,
      notes: ''
    });

    const activeBusiness = computed(() => {
      if (invoice.value.useCustomSender) {
        return {
          name: invoice.value.senderName || 'Kafeinarts Studio',
          tagline: invoice.value.senderTagline || 'Digital Creative',
          email: invoice.value.senderEmail || '',
          phone: invoice.value.senderPhone || '',
          address: invoice.value.senderAddress || ''
        };
      }
      return myBusiness.value;
    });

    const resolvedAccentHex = computed(() => {
      if (invoice.value.accentColor === 'custom') {
        return invoice.value.customAccentHex || '#2563eb';
      }
      const found = accentColorOptions.find(c => c.id === invoice.value.accentColor);
      return found ? found.hex : '#2563eb';
    });

    const currentPaperLabel = computed(() => {
      const size = (invoice.value.paperSize || 'a5').toUpperCase();
      const orient = invoice.value.paperOrientation === 'portrait' ? 'Portrait (Tegak)' : 'Landscape (Mendatar)';
      return `${size} ${orient}`;
    });

    const paperSheetClass = computed(() => {
      const size = invoice.value.paperSize || 'a5';
      const orient = invoice.value.paperOrientation || 'landscape';
      return `paper-${size}-${orient}`;
    });

    const fitPreviewToScreen = () => {
      if (typeof window === 'undefined') return;
      const isStackedOrSingle = layoutMode.value === 'stacked' || layoutMode.value === 'preview-only';
      const containerWidth = isStackedOrSingle ? Math.min(window.innerWidth - 64, 980) : Math.min((window.innerWidth / 2) - 48, 680);
      const isLandscape = invoice.value.paperOrientation === 'landscape';
      const baseWidthPx = (invoice.value.paperSize === 'a4' ? (isLandscape ? 297 : 210) : (isLandscape ? 210 : 148)) * 3.78;
      const calculated = Math.floor((containerWidth / baseWidthPx) * 100);
      previewZoom.value = Math.max(35, Math.min(100, calculated));
    };

    const getStatusBadgeClass = (status) => {
      switch (status) {
        case 'Lunas':
          return 'bg-success text-white';
        case 'Belum Bayar':
          return 'bg-danger text-white';
        case 'Menunggu':
          return 'bg-warning text-dark';
        case 'Dibatalkan':
          return 'bg-dark text-white';
        default:
          return 'bg-secondary text-white';
      }
    };

    const handleCustomLogoUpload = (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          invoice.value.customLogoUrl = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSignatureUpload = (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          invoice.value.signatureImageUrl = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const addPresetItem = (preset) => {
      invoice.value.items.push({
        nama: preset.nama,
        quantity: 1,
        biaya: preset.biaya
      });
      showToastMsg(`Layanan "${preset.nama}" ditambahkan!`);
    };

    const loadSampleData = () => {
      invoice.value.clientName = 'PT Nusantara Mega Kreasi';
      invoice.value.clientCompany = 'Bpk. Hendra Pratama (Direktur Operasional)';
      invoice.value.clientEmail = 'finance@nusantarakreasi.co.id';
      invoice.value.clientPhone = '0811-9876-5432';
      invoice.value.clientAddress = 'Menara Palma Lt. 12, Jl. HR Rasuna Said, Jakarta Selatan';
      invoice.value.poNumber = 'PO-NMK/2026/09/014';
      invoice.value.items = [
        { nama: 'Desain Sistem & Prototyping UI/UX Mobile App', quantity: 1, biaya: 3500000 },
        { nama: 'Implementasi Frontend Vue 3 + Tailwind CSS', quantity: 1, biaya: 5000000 },
        { nama: 'Integrasi REST API & Modul Otentikasi Pengguna', quantity: 1, biaya: 2500000 }
      ];
      invoice.value.taxPercent = 11;
      invoice.value.discount = 500000;
      invoice.value.downPayment = 2000000;
      showToastMsg('Data contoh invoice lengkap berhasil dimuat!');
    };

    const resetInvoiceForm = () => {
      invoice.value = {
        invoiceNumber: '',
        documentTitle: 'INVOICE',
        poNumber: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        clientName: '',
        clientCompany: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
        currency: 'IDR',
        status: 'Belum Bayar',
        useCustomSender: false,
        senderName: '',
        senderTagline: '',
        senderEmail: '',
        senderPhone: '',
        senderAddress: '',
        labelBillTo: 'DITAGIHKAN KEPADA (BILL TO):',
        labelPayment: 'TRANSFER & PEMBAYARAN:',
        labelNotes: 'CATATAN & SYARAT KETENTUAN:',
        labelSignature: 'Hormat Kami,',
        paperSize: 'a5',
        paperOrientation: 'landscape',
        paperTheme: 'light',
        accentColor: 'primary',
        customAccentHex: '#2563eb',
        showWatermark: false,
        watermarkText: 'LUNAS',
        logoType: 'kafeinarts',
        logoOutlineMode: 'auto',
        logoSize: 52,
        customLogoUrl: '',
        bankName: '',
        bankAccount: '',
        bankHolder: '',
        signerName: '',
        signerTitle: '',
        signatureImageUrl: '',
        items: [{ nama: '', quantity: 1, biaya: null }],
        taxPercent: null,
        discount: null,
        downPayment: null,
        shippingFee: null,
        notes: ''
      };
      currentWizardStep.value = 1;
      showToastMsg('Form invoice telah direset.');
    };

    onMounted(() => {
      if (route.query.clientName) {
        invoice.value.clientName = route.query.clientName;
        invoice.value.clientEmail = route.query.clientEmail || '';
        if (route.query.projectTitle) {
          invoice.value.items[0].nama = route.query.projectTitle;
        }
        if (route.query.amount) {
          invoice.value.items[0].biaya = Number(route.query.amount) || 5000000;
        }
      }
      fitPreviewToScreen();
    });

    const showToastMsg = (msg) => {
      toast.value.message = msg;
      toast.value.show = true;
      setTimeout(() => (toast.value.show = false), 3000);
    };

    const addItem = () => {
      invoice.value.items.push({ nama: '', quantity: 1, biaya: 0 });
    };

    const removeItem = (idx) => {
      if (invoice.value.items.length > 1) {
        invoice.value.items.splice(idx, 1);
      }
    };

    const moveItem = (idx, direction) => {
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= invoice.value.items.length) return;
      const temp = invoice.value.items[idx];
      invoice.value.items[idx] = invoice.value.items[newIdx];
      invoice.value.items[newIdx] = temp;
    };

    const importBulkItems = () => {
      if (!bulkItemsText.value || !bulkItemsText.value.trim()) return;
      const lines = bulkItemsText.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      lines.forEach(line => {
        const parts = line.split(',').map(p => p.trim());
        invoice.value.items.push({
          nama: parts[0] || 'Layanan Baru',
          quantity: Number(parts[1]) || 1,
          biaya: Number(parts[2]) || 500000
        });
      });
      bulkItemsText.value = '';
      showBulkItemBox.value = false;
      showToastMsg('Item berhasil ditambahkan ke rincian invoice!');
    };

    const subtotal = computed(() => {
      return invoice.value.items.reduce((sum, item) => sum + (Number(item.biaya || 0) * Number(item.quantity || 1)), 0);
    });

    const taxAmount = computed(() => {
      return (subtotal.value * Number(invoice.value.taxPercent || 0)) / 100;
    });

    const totalAmount = computed(() => {
      const raw = subtotal.value + taxAmount.value + Number(invoice.value.shippingFee || 0) - Number(invoice.value.discount || 0) - Number(invoice.value.downPayment || 0);
      return Math.max(0, raw);
    });

    const calcTotal = (inv) => {
      if (!inv.items) return 0;
      const sub = inv.items.reduce((s, item) => s + (Number(item.biaya || 0) * Number(item.quantity || 1)), 0);
      const tax = (sub * Number(inv.taxPercent || 0)) / 100;
      const raw = sub + tax + Number(inv.shippingFee || 0) - Number(inv.discount || 0) - Number(inv.downPayment || 0);
      return Math.max(0, raw);
    };

    const isAllSelected = computed(() => {
      if (savedInvoices.value.length === 0) return false;
      return savedInvoices.value.every(inv => selectedIds.value.includes(inv.id));
    });

    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selectedIds.value = [];
      } else {
        selectedIds.value = savedInvoices.value.map(inv => inv.id);
      }
    };

    const loadInvoice = (inv) => {
      invoice.value = JSON.parse(JSON.stringify(inv));
      showToastMsg(`Invoice ${inv.invoiceNumber} dimuat ke editor.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteSingleInvoice = (id) => {
      Swal.fire({
        title: 'Hapus Invoice?',
        text: 'Hapus invoice ini dari riwayat tersimpan?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('deleteInvoice', id);
          showToastMsg('Invoice dihapus.');
        }
      });
    };

    const bulkDelete = () => {
      if (selectedIds.value.length === 0) return;
      Swal.fire({
        title: 'Hapus Masal Invoice?',
        text: `Hapus ${selectedIds.value.length} invoice terpilih?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus Semua',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('deleteInvoicesBulk', selectedIds.value);
          showToastMsg(`${selectedIds.value.length} invoice dihapus.`);
          selectedIds.value = [];
        }
      });
    };

    const saveInvoiceToStore = () => {
      errors.value = {};
      if (!invoice.value.invoiceNumber || !invoice.value.invoiceNumber.trim()) {
        errors.value.invoiceNumber = 'Nomor invoice wajib diisi!';
        currentWizardStep.value = 1;
      }
      if (!invoice.value.issueDate) {
        errors.value.issueDate = 'Tanggal terbit wajib diisi!';
        currentWizardStep.value = 1;
      }
      if (!invoice.value.dueDate) {
        errors.value.dueDate = 'Jatuh tempo wajib diisi!';
        currentWizardStep.value = 1;
      }
      if (!invoice.value.clientName || !invoice.value.clientName.trim()) {
        errors.value.clientName = 'Nama klien wajib diisi!';
        currentWizardStep.value = 1;
      }
      if (!invoice.value.items || invoice.value.items.length === 0 || !invoice.value.items[0].nama) {
        errors.value.items = 'Minimal sertakan 1 baris rincian item yang valid!';
        currentWizardStep.value = 2;
      }

      if (Object.keys(errors.value).length > 0) return;

      store.dispatch('addInvoice', invoice.value);
      showToastMsg('Invoice berhasil disimpan ke riwayat database!');
    };

    const formatCurrency = (amount) => {
      if (isNaN(amount)) amount = 0;
      let symbol = 'Rp ';
      if (invoice.value.currency === 'USD') symbol = '$ ';
      if (invoice.value.currency === 'EUR') symbol = '€ ';
      if (invoice.value.currency === 'SGD') symbol = 'S$ ';
      return symbol + new Intl.NumberFormat('id-ID').format(amount);
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return '-';
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      } catch (e) {
        return dateStr;
      }
    };

    const isPdfLoading = ref(false);

    const triggerPrint = () => {
      isPdfLoading.value = true;
      setTimeout(() => {
        openPrintableDocumentInNewTab({
          title: `${invoice.value.documentTitle || 'Invoice'}_${invoice.value.invoiceNumber || 'Doc'}`,
          elementId: 'invoicePreviewArea',
          autoPrint: true,
          paperSize: invoice.value.paperSize || 'a5',
          paperOrientation: invoice.value.paperOrientation || 'landscape',
          marginTop: 6,
          marginBottom: 6,
          marginLeft: 8,
          marginRight: 8
        });
        isPdfLoading.value = false;
      }, 300);
    };

    const downloadPDF = async () => {
      if (isPdfLoading.value) return;
      isPdfLoading.value = true;

      try {
        const paperSize = invoice.value.paperSize || 'a5';
        const paperOrient = invoice.value.paperOrientation || 'landscape';

        const doc = new jsPDF({
          orientation: paperOrient,
          unit: 'mm',
          format: paperSize
        });

        // Calculate dimensions
        let pageWidth = 210;
        let pageHeight = 148;
        if (paperSize === 'a5') {
          pageWidth = paperOrient === 'landscape' ? 210 : 148;
          pageHeight = paperOrient === 'landscape' ? 148 : 210;
        } else if (paperSize === 'a4') {
          pageWidth = paperOrient === 'landscape' ? 297 : 210;
          pageHeight = paperOrient === 'landscape' ? 210 : 297;
        }

        const marginX = 10;
        const contentWidth = pageWidth - (marginX * 2);
        const accentHex = resolvedAccentHex.value;

        // 1. Accent Top Stripe
        doc.setFillColor(accentHex);
        doc.rect(0, 0, pageWidth, 4, 'F');

        // Watermark if enabled
        if (invoice.value.showWatermark) {
          doc.saveGraphicsState();
          doc.setFontSize(55);
          doc.setTextColor(200, 200, 200);
          doc.setFont('helvetica', 'bold');
          doc.text(
            invoice.value.watermarkText || 'LUNAS',
            pageWidth / 2,
            pageHeight / 2,
            { align: 'center', angle: 30 }
          );
          doc.restoreGraphicsState();
        }

        // 2. Add Logo
        let hasLogo = false;
        if (invoice.value.logoType === 'kafeinarts') {
          try {
            const logoDataUrl = await getKafeinartsLogoDataUrl({
              inverted: false,
              outlineMode: invoice.value.logoOutlineMode === 'light' ? 'light' : 'dark',
              size: 200
            });
            if (logoDataUrl) {
              doc.addImage(logoDataUrl, 'PNG', marginX, 8, 16, 16);
              hasLogo = true;
            }
          } catch (logoErr) {
            console.warn('Kafeinarts logo PDF fallback:', logoErr);
          }
        } else if (invoice.value.logoType === 'custom' && invoice.value.customLogoUrl) {
          try {
            doc.addImage(invoice.value.customLogoUrl, 'PNG', marginX, 8, 16, 16);
            hasLogo = true;
          } catch (customErr) {
            console.warn('Custom logo PDF error:', customErr);
          }
        }

        const textStartX = hasLogo ? marginX + 19 : marginX;

        // Company Name & Tagline
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(activeBusiness.value.name || 'Kafeinarts Digital', textStartX, 13);

        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text(activeBusiness.value.tagline || 'Digital Creative & Web Studio', textStartX, 18);
        doc.text(`${activeBusiness.value.email} • ${activeBusiness.value.phone}`, textStartX, 22);

        // Top Right: INVOICE TITLE & Number
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(accentHex);
        doc.text(invoice.value.documentTitle || 'INVOICE', pageWidth - marginX, 13, { align: 'right' });

        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(invoice.value.invoiceNumber, pageWidth - marginX, 18, { align: 'right' });

        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text(`Status: ${invoice.value.status || 'Belum Bayar'}`, pageWidth - marginX, 22, { align: 'right' });

        // Divider Line
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.4);
        doc.line(marginX, 26, pageWidth - marginX, 26);

        // Metadata Cards: Bill To (Left) & Payment Dest (Right)
        let metaY = 31;
        const leftBoxWidth = Math.floor(contentWidth * 0.58);
        const rightBoxWidth = contentWidth - leftBoxWidth - 5;
        const rightBoxX = marginX + leftBoxWidth + 5;

        // Bill To Box
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(marginX, metaY, leftBoxWidth, 20, 1.5, 1.5, 'F');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100);
        doc.text(invoice.value.labelBillTo || 'DITAGIHKAN KEPADA (BILL TO):', marginX + 3, metaY + 4);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(invoice.value.clientName || 'Klien Umum', marginX + 3, metaY + 9);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        const clientMeta = [invoice.value.clientCompany, invoice.value.clientEmail, invoice.value.clientPhone].filter(Boolean).join(' • ');
        doc.text(clientMeta || '-', marginX + 3, metaY + 14);
        if (invoice.value.clientAddress) {
          doc.text(invoice.value.clientAddress, marginX + 3, metaY + 18);
        }

        // Dates & Bank Box
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(rightBoxX, metaY, rightBoxWidth, 20, 1.5, 1.5, 'F');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100);
        doc.text(invoice.value.labelPayment || 'TRANSFER & PEMBAYARAN:', rightBoxX + 3, metaY + 4);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`${invoice.value.bankName || 'BCA'}: ${invoice.value.bankAccount || '8830192831'}`, rightBoxX + 3, metaY + 9);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text(`a/n ${invoice.value.bankHolder || 'Kafeinarts Studio'}`, rightBoxX + 3, metaY + 14);
        doc.text(`Terbit: ${formatDate(invoice.value.issueDate)} • Tempo: ${formatDate(invoice.value.dueDate)}`, rightBoxX + 3, metaY + 18);

        // Table of Items
        let tableY = 56;
        doc.setFillColor(241, 245, 249);
        doc.rect(marginX, tableY, contentWidth, 7, 'F');
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(51, 65, 85);
        doc.text('#', marginX + 2, tableY + 4.5);
        doc.text('DESKRIPSI PEKERJAAN / LAYANAN', marginX + 10, tableY + 4.5);
        doc.text('QTY', marginX + contentWidth - 65, tableY + 4.5, { align: 'center' });
        doc.text('HARGA UNIT', marginX + contentWidth - 35, tableY + 4.5, { align: 'right' });
        doc.text('TOTAL', marginX + contentWidth - 2, tableY + 4.5, { align: 'right' });

        tableY += 10;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);

        // Render items
        const maxItems = paperSize === 'a4' && paperOrient === 'portrait' ? 18 : 7;
        const validItems = invoice.value.items.filter(it => it.nama || it.biaya > 0);
        const itemsToPrint = validItems.length > 0 ? validItems.slice(0, maxItems) : [];
        if (itemsToPrint.length === 0) {
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(150);
          doc.text('(Belum ada rincian item)', marginX + 10, tableY);
          tableY += 7.5;
        } else {
          itemsToPrint.forEach((item, idx) => {
            doc.text(String(idx + 1), marginX + 2, tableY);
            const descWidth = contentWidth - 75;
            const nameLines = doc.splitTextToSize(item.nama || '-', descWidth);
            doc.text(nameLines, marginX + 10, tableY);
            doc.text(String(item.quantity || 1), marginX + contentWidth - 65, tableY, { align: 'center' });
            doc.text(formatCurrency(item.biaya || 0), marginX + contentWidth - 35, tableY, { align: 'right' });
            doc.setFont('helvetica', 'bold');
            doc.text(formatCurrency((item.quantity || 1) * (item.biaya || 0)), marginX + contentWidth - 2, tableY, { align: 'right' });
            doc.setFont('helvetica', 'normal');
            tableY += 7.5;
          });
        }

        // Horizontal line under table
        doc.setDrawColor(226, 232, 240);
        doc.line(marginX, tableY + 1, pageWidth - marginX, tableY + 1);

        // Bottom Section: Notes & Signature (Left) and Totals (Right)
        let bottomY = tableY + 5;
        if (bottomY > pageHeight - 38) bottomY = pageHeight - 38;

        // Left: Payment Terms & Signature
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100);
        doc.text(invoice.value.labelNotes || 'CATATAN & SYARAT KETENTUAN:', marginX, bottomY);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const notesLines = doc.splitTextToSize(invoice.value.notes || 'Terima kasih atas kerjasama dan kepercayaannya.', leftBoxWidth);
        doc.text(notesLines, marginX, bottomY + 3.5);

        // Signature on bottom left
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text(invoice.value.labelSignature || 'Hormat Kami,', marginX, pageHeight - 16);

        if (invoice.value.signatureImageUrl) {
          try {
            doc.addImage(invoice.value.signatureImageUrl, 'PNG', marginX, pageHeight - 15, 20, 8);
          } catch (sigErr) {
            console.warn('Signature image PDF error:', sigErr);
          }
        }

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(invoice.value.signerName || 'Arif Permana Putrasuryana', marginX, pageHeight - 6);

        // Right: Totals Box
        const totalsBoxWidth = rightBoxWidth;
        const totalsBoxX = rightBoxX;
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(totalsBoxX, bottomY - 1, totalsBoxWidth, 26, 1.5, 1.5, 'F');

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text('Subtotal:', totalsBoxX + 3, bottomY + 4);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(formatCurrency(subtotal.value), totalsBoxX + totalsBoxWidth - 3, bottomY + 4, { align: 'right' });

        let currentTotalsY = bottomY + 8;
        if (invoice.value.discount > 0) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(220, 38, 38);
          doc.text('Diskon:', totalsBoxX + 3, currentTotalsY);
          doc.text(`- ${formatCurrency(invoice.value.discount)}`, totalsBoxX + totalsBoxWidth - 3, currentTotalsY, { align: 'right' });
          currentTotalsY += 4;
        }

        if (taxAmount.value > 0) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100);
          doc.text(`PPN (${invoice.value.taxPercent}%):`, totalsBoxX + 3, currentTotalsY);
          doc.text(`+ ${formatCurrency(taxAmount.value)}`, totalsBoxX + totalsBoxWidth - 3, currentTotalsY, { align: 'right' });
          currentTotalsY += 4;
        }

        if (invoice.value.downPayment > 0) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(22, 163, 74);
          doc.text('DP / Uang Muka:', totalsBoxX + 3, currentTotalsY);
          doc.text(`- ${formatCurrency(invoice.value.downPayment)}`, totalsBoxX + totalsBoxWidth - 3, currentTotalsY, { align: 'right' });
        }

        // Highlight Grand Total Box
        doc.setFillColor(accentHex);
        doc.roundedRect(totalsBoxX + 2, bottomY + 17, totalsBoxWidth - 4, 7, 1, 1, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('TOTAL TAGIHAN:', totalsBoxX + 5, bottomY + 21.5);
        doc.setFontSize(9);
        doc.text(formatCurrency(totalAmount.value), totalsBoxX + totalsBoxWidth - 5, bottomY + 21.5, { align: 'right' });

        const pdfBlob = doc.output('blob');
        openPdfBlobInNewTab(pdfBlob, `${invoice.value.documentTitle || 'Invoice'}_${invoice.value.invoiceNumber}`);
        showToastMsg('Dokumen PDF berhasil dibuka!');
      } catch (err) {
        console.error('PDF error:', err);
        showToastMsg('Gagal memproses PDF, membuka dialog cetak browser...');
        triggerPrint();
      } finally {
        isPdfLoading.value = false;
      }
    };

    const exportToExcel = () => {
      const exportData = [
        {
          JudulDokumen: invoice.value.documentTitle,
          NomorInvoice: invoice.value.invoiceNumber,
          NomorPO: invoice.value.poNumber || '-',
          Klien: invoice.value.clientName,
          Email: invoice.value.clientEmail,
          Telepon: invoice.value.clientPhone,
          TanggalTerbit: invoice.value.issueDate,
          JatuhTempo: invoice.value.dueDate,
          Status: invoice.value.status,
          Subtotal: subtotal.value,
          Pajak: taxAmount.value,
          Diskon: invoice.value.discount,
          UangMuka: invoice.value.downPayment,
          TotalAkhir: totalAmount.value,
          MataUang: invoice.value.currency
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoice Summary');
      XLSX.writeFile(workbook, `${invoice.value.invoiceNumber}_export.xlsx`);
      showToastMsg('Summary Invoice berhasil diunduh dalam format Excel!');
    };

    const invoiceJsonInput = ref(null);

    const exportInvoiceJson = () => {
      try {
        const payload = {
          app: 'TaskArts',
          type: 'invoices_backup',
          version: '4.0',
          exportDate: new Date().toISOString(),
          currentInvoice: invoice.value,
          invoices: store.getters.getInvoices || []
        };
        const jsonStr = JSON.stringify(payload, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoices_Backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        Swal.fire({
          icon: 'success',
          title: 'Export JSON Berhasil!',
          text: `Data invoice (${payload.invoices.length} tersimpan) berhasil diunduh sebagai JSON.`,
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

    const triggerImportInvoiceJson = () => {
      if (invoiceJsonInput.value) {
        invoiceJsonInput.value.value = '';
        invoiceJsonInput.value.click();
      }
    };

    const onInvoiceJsonSelected = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          const incomingInvoices = parsed.invoices || (Array.isArray(parsed) ? parsed : (parsed.currentInvoice ? [parsed.currentInvoice] : []));
          const currentInv = parsed.currentInvoice || (parsed.invoiceNumber ? parsed : null);

          if ((!incomingInvoices || incomingInvoices.length === 0) && !currentInv) {
            Swal.fire({
              icon: 'warning',
              title: 'Format Tidak Dikenali',
              text: 'Berkas JSON ini tidak memiliki struktur invoice yang valid.'
            });
            return;
          }

          Swal.fire({
            title: 'Pulihkan Data Invoice?',
            text: `Ditemukan ${incomingInvoices.length} riwayat invoice dari berkas backup. Pulihkan sekarang?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Pulihkan',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#6c757d'
          }).then((result) => {
            if (result.isConfirmed) {
              if (incomingInvoices.length > 0) {
                store.dispatch('importInvoicesData', incomingInvoices);
              }
              if (currentInv) {
                invoice.value = JSON.parse(JSON.stringify(currentInv));
              } else if (incomingInvoices.length > 0) {
                invoice.value = JSON.parse(JSON.stringify(incomingInvoices[0]));
              }
              showToastMsg('Data invoice berhasil dipulihkan!');
            }
          });
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Membaca File',
            text: err.message
          });
        }
      };
      reader.readAsText(file);
    };

    return {
      myBusiness,
      activeBusiness,
      savedInvoices,
      invoice,
      toast,
      errors,
      showBulkItemBox,
      bulkItemsText,
      selectedIds,
      isAllSelected,
      toggleSelectAll,
      addItem,
      removeItem,
      moveItem,
      importBulkItems,
      addPresetItem,
      servicePresets,
      subtotal,
      taxAmount,
      totalAmount,
      calcTotal,
      loadInvoice,
      deleteSingleInvoice,
      bulkDelete,
      saveInvoiceToStore,
      formatCurrency,
      formatDate,
      isPdfLoading,
      triggerPrint,
      downloadPDF,
      handleCustomLogoUpload,
      handleSignatureUpload,
      exportToExcel,
      invoiceJsonInput,
      exportInvoiceJson,
      triggerImportInvoiceJson,
      onInvoiceJsonSelected,
      accentColorOptions,
      resolvedAccentHex,
      getStatusBadgeClass,
      loadSampleData,
      resetInvoiceForm,
      // Layout, Wizard, Zoom & Customization states
      layoutMode,
      setLayoutMode,
      editorFormMode,
      currentWizardStep,
      wizardSteps,
      currentStepTitle,
      previewZoom,
      fitPreviewToScreen,
      currentPaperLabel,
      paperSheetClass,
      isInlineEditing
    };
  }
};
</script>

<style scoped>
/* Viewport Wrapper */
.invoice-viewport-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding: 8px 4px;
}

.invoice-zoom-container {
  display: flex;
  justify-content: center;
  width: 100%;
  transition: transform 0.2s ease;
}

/* Paper Aspect Ratios & Dimensioning */
.invoice-paper-sheet {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
  overflow: hidden;
}

/* A5 Landscape (210 x 148 mm) */
.paper-a5-landscape {
  max-width: 820px;
  min-height: 540px;
  aspect-ratio: 210 / 148;
}

/* A5 Portrait (148 x 210 mm) */
.paper-a5-portrait {
  max-width: 580px;
  min-height: 720px;
  aspect-ratio: 148 / 210;
}

/* A4 Portrait (210 x 297 mm) */
.paper-a4-portrait {
  max-width: 680px;
  min-height: 840px;
  aspect-ratio: 210 / 297;
}

/* A4 Landscape (297 x 210 mm) */
.paper-a4-landscape {
  max-width: 860px;
  min-height: 580px;
  aspect-ratio: 297 / 210;
}

.invoice-accent-bar {
  height: 5px;
  width: 100%;
}

.invoice-sheet-inner {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Diagonal Watermark Overlay */
.invoice-watermark-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-30deg);
  font-size: 5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 6px;
  opacity: 0.12;
  border: 8px dashed currentColor;
  padding: 8px 36px;
  border-radius: 18px;
  pointer-events: none;
  z-index: 10;
  user-select: none;
  white-space: nowrap;
}

/* Tonal Box backgrounds */
.bg-light-box {
  background-color: #f8fafc;
  border-color: #e2e8f0 !important;
}

.bg-dark-subtle-box {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12) !important;
}

.invoice-meta-card {
  min-height: 64px;
}

.invoice-table-container {
  overflow-x: auto;
}

.invoice-items-table th {
  padding: 6px 10px;
  letter-spacing: 0.5px;
}

.invoice-items-table td {
  padding: 6px 10px;
}

.invoice-notes-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Wizard Stepper Styling */
.top-wizard-stepper {
  position: relative;
  padding: 4px 6px;
}

.top-wizard-progress {
  position: absolute;
  top: 26px;
  left: 12%;
  right: 12%;
  z-index: 1;
  background-color: var(--border-color, #e2e8f0);
}

.top-step-btn {
  width: 24%;
  cursor: pointer;
  border: 1.5px solid transparent;
}

.top-step-btn.active-step {
  border-color: rgba(37, 99, 235, 0.3) !important;
}

.top-step-circle {
  width: 38px;
  height: 38px;
  font-size: 14px;
  z-index: 2;
}

.ring-4 {
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}

.shadow-2xs {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.shadow-xs {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.hover-primary:hover {
  border-color: #2563eb !important;
  color: #2563eb !important;
}

/* Print Rules */
@media print {
  @page {
    size: auto;
    margin: 6mm;
  }
  .no-print {
    display: none !important;
  }
  .invoice-viewport-wrapper {
    padding: 0 !important;
    overflow: visible !important;
  }
  .invoice-zoom-container {
    transform: none !important;
  }
  .invoice-paper-sheet {
    box-shadow: none !important;
    border: none !important;
    width: 100% !important;
    max-width: 100% !important;
    aspect-ratio: auto !important;
    min-height: auto !important;
    background-color: transparent !important;
    color: #000000 !important;
  }
}
</style>
