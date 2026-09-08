<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border no-print">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-primary-subtle text-primary fw-semibold px-3 py-1.5 rounded-pill">Billing & Invoicing</span>
          <span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 fw-bold px-2.5 py-1.5 rounded-pill small">By Kafeinarts</span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">Invoice Generator Pro</h2>
        <p class="text-muted mb-0">Buat invoice profesional, hitung otomatis PPN/pajak, dan unduh dokumen PDF / Excel.</p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <button class="btn btn-outline-warning text-dark px-3 py-2 rounded-3 fw-semibold" @click="exportInvoiceJson" title="Backup semua Invoice ke JSON">
          <i class="bi bi-filetype-json text-warning me-1"></i> Export JSON
        </button>
        <button class="btn btn-outline-info text-dark px-3 py-2 rounded-3 fw-semibold" @click="triggerImportInvoiceJson" title="Import / Recovery Invoice dari JSON">
          <i class="bi bi-upload text-info me-1"></i> Import JSON
        </button>
        <input type="file" ref="invoiceJsonInput" accept=".json" class="d-none" @change="onInvoiceJsonSelected" />
        <button class="btn btn-outline-success px-3 py-2 rounded-3 fw-semibold" @click="exportToExcel">
          <i class="bi bi-file-earmark-excel-fill me-1 text-success"></i> Export Excel
        </button>
        <button class="btn btn-outline-primary px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-1.5" :disabled="isPdfLoading" @click="triggerPrint">
          <span v-if="isPdfLoading" class="spinner-border spinner-border-sm text-primary" role="status"></span>
          <i v-else class="bi bi-printer"></i>
          <span>Cetak Dokumen</span>
        </button>
        <button class="btn btn-primary px-4 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 shadow-sm" :disabled="isPdfLoading" @click="downloadPDF">
          <span v-if="isPdfLoading" class="spinner-border spinner-border-sm text-white" role="status"></span>
          <i v-else class="bi bi-file-earmark-pdf-fill fs-5"></i>
          <span>{{ isPdfLoading ? 'Menyiapkan PDF...' : 'Buka PDF di Tab Baru' }}</span>
        </button>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <!-- Invoice Editor Form Panel (Left) -->
      <div class="col-lg-5 no-print">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold text-dark mb-0">
              <i class="bi bi-pencil-square text-primary me-2"></i>{{ invoice.id ? 'Edit Faktur Invoice' : 'Form Editor Invoice' }}
            </h5>
            <div class="d-flex align-items-center gap-1.5">
              <button v-if="invoice.id" class="btn btn-xs btn-outline-primary rounded-pill px-2.5 py-1 fw-semibold" @click="resetToNewInvoice">
                <i class="bi bi-plus-lg me-1"></i> Form Baru
              </button>
              <button class="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1 small" @click="showBulkItemBox = !showBulkItemBox">
                <i class="bi bi-list-task me-1"></i> {{ showBulkItemBox ? 'Tutup Bulk' : 'Bulk Input' }}
              </button>
            </div>
          </div>

          <!-- Active Editing Notice Banner -->
          <div v-if="invoice.id" class="alert alert-info py-2 px-3 rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 border-info border-opacity-25 bg-info-subtle shadow-xs">
            <div>
              <div class="small fw-bold text-dark d-flex align-items-center gap-1.5">
                <i class="bi bi-pencil-fill text-primary"></i>
                <span>Sedang Mengedit: <strong>{{ invoice.invoiceNumber }}</strong></span>
              </div>
              <div class="d-flex align-items-center gap-1.5 mt-1">
                <span class="badge rounded-pill fw-bold" :class="invoice.source === 'pos' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-slate-100 text-slate-700 border border-slate-300'">
                  <i :class="invoice.source === 'pos' ? 'bi bi-shop me-1' : 'bi bi-pencil-square me-1'"></i>
                  {{ invoice.source === 'pos' ? 'Asal: POS Kasir' : 'Asal: Manual' }}
                </span>
                <span class="badge rounded-pill fw-semibold" :class="getInvoiceStatusBadgeClass(invoice.status)">
                  <i :class="getInvoiceStatusIcon(invoice.status)"></i>
                  {{ formatInvoiceStatusLabel(invoice.status) }}
                </span>
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1" @click="resetToNewInvoice">
              <i class="bi bi-file-earmark-plus me-1"></i> Buat Baru
            </button>
          </div>

          <!-- Bulk Item Box -->
          <div v-if="showBulkItemBox" class="p-3 bg-light rounded-3 mb-3 border">
            <label class="form-label small fw-bold text-primary">Paste Banyak Item Layanan (Satu per baris)</label>
            <div class="alert alert-info py-1 px-2 small mb-2">
              Format: <strong>Nama Item, Qty, Biaya Unit</strong>
            </div>
            <textarea
              class="form-control form-control-sm font-monospace mb-2"
              rows="3"
              placeholder="Desain Wireframe, 1, 2500000&#10;Frontend Vue 3, 1, 5000000"
              v-model="bulkItemsText"
            ></textarea>
            <button class="btn btn-sm btn-primary w-100 rounded-2 fw-semibold" @click="importBulkItems">
              <i class="bi bi-plus-circle me-1"></i> Tambahkan Item ke Invoice
            </button>
          </div>

          <form @submit.prevent="saveInvoiceToStore" class="row g-3">
            <!-- Logo & Brand Header Configuration (Kafeinarts Inverted Vector) -->
            <div class="col-12 p-3 bg-light rounded-3 border">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="form-label small fw-bold mb-0 text-dark">
                  <i class="bi bi-image text-primary me-1"></i> Logo & Identitas Kop Invoice
                </label>
                <div class="btn-group btn-group-sm">
                  <button
                    type="button"
                    class="btn btn-xs"
                    :class="invoice.paperTheme === 'light' ? 'btn-primary text-white fw-semibold' : 'btn-outline-secondary bg-white'"
                    @click="invoice.paperTheme = 'light'"
                    title="Kertas Putih Terang (Standar Cetak A4)"
                  >
                    <i class="bi bi-sun me-1"></i> Putih Terang
                  </button>
                  <button
                    type="button"
                    class="btn btn-xs"
                    :class="invoice.paperTheme === 'dark' ? 'btn-dark text-white fw-semibold' : 'btn-outline-secondary bg-white'"
                    @click="invoice.paperTheme = 'dark'"
                    title="Kertas Gelap Modern (Dark Mode Invoice)"
                  >
                    <i class="bi bi-moon-stars me-1"></i> Gelap Modern
                  </button>
                </div>
              </div>

              <div class="row g-2">
                <div class="col-md-6">
                  <label class="form-label text-muted mb-1" style="font-size: 11.5px;">Pilihan Logo</label>
                  <select class="form-select form-select-sm" v-model="invoice.logoType">
                    <option value="kafeinarts">Logo Kafeinarts (Vector Inverted)</option>
                    <option value="custom">Upload Logo Kustom</option>
                    <option value="none">Tanpa Logo (Inisial Teks)</option>
                  </select>
                </div>

                <div class="col-md-6" v-if="invoice.logoType === 'kafeinarts'">
                  <label class="form-label text-muted mb-1" style="font-size: 11.5px;">Mode Garis Outline Logo</label>
                  <select class="form-select form-select-sm" v-model="invoice.logoOutlineMode">
                    <option value="auto">Otomatis Invert (Hitam di Putih / Putih di Gelap)</option>
                    <option value="dark">Hitam Pekat (#0f172a)</option>
                    <option value="light">Putih Terang (#ffffff)</option>
                  </select>
                </div>

                <div class="col-md-6" v-if="invoice.logoType === 'custom'">
                  <label class="form-label text-muted mb-1" style="font-size: 11.5px;">Upload Berkas Logo</label>
                  <input type="file" class="form-control form-control-sm" accept="image/*" @change="handleCustomLogoUpload" />
                </div>

                <div class="col-12" v-if="invoice.logoType === 'kafeinarts'">
                  <div class="d-flex align-items-center justify-content-between p-2 rounded-2 border mt-1" :class="invoice.paperTheme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark'">
                    <div class="d-flex align-items-center gap-2">
                      <KafeinartsLogo :size="38" :outline-mode="invoice.logoOutlineMode" :inverted="invoice.paperTheme === 'dark'" />
                      <div style="font-size: 11.5px;">
                        <strong class="text-primary d-block">Logo Kafeinarts Aktif</strong>
                        <span :class="invoice.paperTheme === 'dark' ? 'text-light opacity-75' : 'text-muted'">
                          Garis outline: <strong>{{ invoice.paperTheme === 'dark' || invoice.logoOutlineMode === 'light' ? 'Putih' : 'Hitam' }}</strong> • Background transparan
                        </span>
                      </div>
                    </div>
                    <div class="d-flex align-items-center gap-1">
                      <label class="small text-muted me-1 mb-0" style="font-size: 11px;">Ukuran:</label>
                      <select class="form-select form-select-sm py-0.5" v-model.number="invoice.logoSize" style="width: 80px; font-size: 11px;">
                        <option :value="46">Kecil</option>
                        <option :value="58">Sedang</option>
                        <option :value="74">Besar</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label small fw-bold">Nomor Invoice <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.invoiceNumber }"
                v-model="invoice.invoiceNumber"
              />
              <div class="invalid-feedback" v-if="errors.invoiceNumber">{{ errors.invoiceNumber }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label small fw-bold">Mata Uang (Currency)</label>
              <select class="form-select" v-model="invoice.currency">
                <option value="IDR">Rupiah (IDR)</option>
                <option value="USD">Dollar (USD)</option>
              </select>
            </div>

            <!-- Status Dokumen & Asal / Sumber Fixed Badges in Form -->
            <div class="col-md-6">
              <label class="form-label small fw-bold">Status Dokumen Invoice</label>
              <select class="form-select" v-model="invoice.status">
                <option value="Draft">Belum Dikirim (Draft)</option>
                <option value="Terkirim">Sudah Dikirim</option>
                <option value="Lunas">Lunas (Paid)</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label small fw-bold">Asal / Sumber Pembuatan</label>
              <div class="pt-1">
                <span class="badge rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center gap-1.5" :class="invoice.source === 'pos' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-slate-100 text-slate-700 border border-slate-300'">
                  <i :class="invoice.source === 'pos' ? 'bi bi-shop' : 'bi bi-pencil-square'"></i>
                  <span>{{ invoice.source === 'pos' ? 'Berasal dari POS Kasir' : 'Dibuat Manual' }}</span>
                </span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label small fw-bold">Tanggal Terbit <span class="text-danger">*</span></label>
              <input
                type="date"
                class="form-control"
                :class="{ 'is-invalid': errors.issueDate }"
                v-model="invoice.issueDate"
              />
              <div class="invalid-feedback" v-if="errors.issueDate">{{ errors.issueDate }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label small fw-bold">Jatuh Tempo (Due Date) <span class="text-danger">*</span></label>
              <input
                type="date"
                class="form-control"
                :class="{ 'is-invalid': errors.dueDate }"
                v-model="invoice.dueDate"
              />
              <div class="invalid-feedback" v-if="errors.dueDate">{{ errors.dueDate }}</div>
            </div>

            <div class="col-12 border-top pt-2">
              <label class="form-label small fw-bold">Pilih / Isikan Nama Klien <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control mb-2"
                :class="{ 'is-invalid': errors.clientName }"
                v-model="invoice.clientName"
                placeholder="PT Teknologi Nusantara (Pak Budi)"
              />
              <div class="invalid-feedback mb-2" v-if="errors.clientName">{{ errors.clientName }}</div>
              <input type="email" class="form-control mb-2" v-model="invoice.clientEmail" placeholder="client@perusahaan.com" />
              <input type="text" class="form-control" v-model="invoice.clientAddress" placeholder="Alamat lengkap klien..." />
            </div>

            <!-- Itemized Products/Services -->
            <div class="col-12 border-top pt-2">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="form-label small fw-bold mb-0">Rincian Item Pekerjaan <span class="text-danger">*</span></label>
                <button type="button" class="btn btn-xs btn-outline-primary rounded-pill px-2" @click="addItem">
                  <i class="bi bi-plus-lg me-1"></i> Tambah Item
                </button>
              </div>

              <div v-if="errors.items" class="text-danger small mb-2 fw-semibold">{{ errors.items }}</div>

              <div v-for="(item, idx) in invoice.items" :key="idx" class="p-3 bg-light rounded-3 mb-2 border">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="small fw-bold">Item #{{ idx + 1 }}</span>
                  <button type="button" class="btn btn-xs text-danger border-0 p-0" @click="removeItem(idx)" v-if="invoice.items.length > 1">
                    <i class="bi bi-x-circle-fill"></i> Hapus
                  </button>
                </div>
                <input type="text" class="form-control form-control-sm mb-2" v-model="item.nama" placeholder="Nama layanan/produk..." />
                <div class="row g-2">
                  <div class="col-4">
                    <input type="number" class="form-control form-control-sm" v-model.number="item.quantity" min="1" placeholder="Qty" />
                  </div>
                  <div class="col-8">
                    <input type="number" class="form-control form-control-sm" v-model.number="item.biaya" placeholder="Biaya per unit" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Tax & Discount -->
            <div class="col-md-6 border-top pt-2">
              <label class="form-label small fw-bold">Pajak / PPN (%)</label>
              <input type="number" class="form-control" v-model.number="invoice.taxPercent" min="0" />
            </div>

            <div class="col-md-6 border-top pt-2">
              <label class="form-label small fw-bold">Potongan / Diskon</label>
              <input type="number" class="form-control" v-model.number="invoice.discount" min="0" />
            </div>

            <div class="col-12">
              <label class="form-label small fw-bold">Catatan & Rekening Pembayaran</label>
              <textarea class="form-control" rows="2" v-model="invoice.notes"></textarea>
            </div>

            <div class="col-12 d-flex flex-column gap-2">
              <button type="submit" class="btn btn-success w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-xs">
                <i class="bi bi-save-fill"></i>
                <span>{{ invoice.id ? 'Perbarui Perubahan Invoice' : 'Simpan Invoice Baru ke Database' }}</span>
              </button>
              <div v-if="invoice.id" class="d-flex gap-2">
                <button type="button" class="btn btn-outline-primary rounded-pill py-1.5 flex-fill fw-semibold small" @click="saveAsNewCopy">
                  <i class="bi bi-copy me-1"></i> Simpan Sebagai Salinan Baru
                </button>
                <button type="button" class="btn btn-outline-secondary rounded-pill py-1.5 flex-fill fw-semibold small" @click="resetToNewInvoice">
                  <i class="bi bi-file-earmark-plus me-1"></i> Form Baru
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Professional Printable Invoice Preview (Right) -->
      <div class="col-lg-7">
        <!-- Interactive Typo Notice Bar -->
        <div class="alert alert-primary py-2 px-3 rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 no-print border-primary border-opacity-25 bg-primary-subtle shadow-sm">
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-primary text-white rounded-pill px-2.5 py-1">
              <i class="bi bi-pencil-square me-1"></i> Edit Typo Langsung
            </span>
            <span class="small text-dark fw-semibold">
              Klik teks di preview invoice untuk perbaiki typo secara langsung.
            </span>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span v-if="lastInvoiceAutoSaveTime" class="small text-success fw-bold d-flex align-items-center gap-1">
              <i class="bi bi-check2-circle"></i> Draft ({{ lastInvoiceAutoSaveTime }})
            </span>
            <button type="button" class="btn btn-sm btn-success rounded-pill px-3 fw-bold shadow-sm" @click="saveInvoiceToStore">
              <i class="bi bi-floppy me-1"></i> Simpan
            </button>
          </div>
        </div>

        <div
          class="card border-0 shadow-lg rounded-4 p-5 invoice-paper transition-all"
          :class="invoice.paperTheme === 'dark' ? 'bg-dark text-white' : 'bg-white text-dark'"
          id="invoicePreviewArea"
        >
          <!-- Letterhead Banner -->
          <div class="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4" :class="invoice.paperTheme === 'dark' ? 'border-secondary' : ''">
            <div>
              <div class="d-flex align-items-center gap-3 mb-1">
                <!-- Kafeinarts Inverted Vector Logo -->
                <div v-if="invoice.logoType === 'kafeinarts'" class="invoice-brand-logo flex-shrink-0">
                  <KafeinartsLogo
                    :size="invoice.logoSize || 58"
                    :outline-mode="invoice.logoOutlineMode || 'auto'"
                    :inverted="invoice.paperTheme === 'dark'"
                  />
                </div>
                <!-- Custom Uploaded Logo -->
                <div v-else-if="invoice.logoType === 'custom' && invoice.customLogoUrl" class="invoice-brand-logo flex-shrink-0">
                  <img :src="invoice.customLogoUrl" :style="{ maxHeight: (invoice.logoSize || 58) + 'px' }" class="rounded object-fit-contain" alt="Logo Bisnis" />
                </div>
                <!-- Fallback Initial Badge -->
                <div v-else class="bg-primary text-white fw-bold rounded-2 px-2 py-1 fs-5 flex-shrink-0">
                  FT
                </div>

                <div>
                  <h3
                    class="fw-extrabold mb-0 inv-editable"
                    contenteditable="true"
                    spellcheck="false"
                    title="Klik untuk ubah nama bisnis"
                    @blur="onDirectBusinessEdit('name', $event)"
                    :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'"
                  >{{ myBusiness.name }}</h3>
                  <p
                    class="small mb-0 inv-editable"
                    contenteditable="true"
                    spellcheck="false"
                    title="Klik untuk ubah tagline"
                    @blur="onDirectBusinessEdit('tagline', $event)"
                    :class="invoice.paperTheme === 'dark' ? 'text-light opacity-75' : 'text-muted'"
                  >{{ myBusiness.tagline }}</p>
                </div>
              </div>
              <small class="d-block mt-1" :class="invoice.paperTheme === 'dark' ? 'text-light opacity-75' : 'text-muted'">
                <span class="inv-editable" contenteditable="true" spellcheck="false" @blur="onDirectBusinessEdit('email', $event)">{{ myBusiness.email }}</span> • 
                <span class="inv-editable" contenteditable="true" spellcheck="false" @blur="onDirectBusinessEdit('phone', $event)">{{ myBusiness.phone }}</span>
              </small>
            </div>

            <div class="text-end">
              <div class="d-flex align-items-center justify-content-end gap-1.5 mb-2">
                <span class="badge bg-primary text-white text-uppercase px-3 py-1.5 rounded-pill fs-6">INVOICE</span>
                <!-- Fixed Origin Badge -->
                <span class="badge rounded-pill px-2.5 py-1 fw-bold" :class="invoice.source === 'pos' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-slate-100 text-slate-700 border border-slate-300'">
                  <i :class="invoice.source === 'pos' ? 'bi bi-shop me-1' : 'bi bi-pencil-square me-1'"></i>
                  {{ invoice.source === 'pos' ? 'POS' : 'Manual' }}
                </span>
              </div>
              <h5
                class="fw-bold mb-0 inv-editable"
                contenteditable="true"
                spellcheck="false"
                title="Klik untuk koreksi nomor invoice"
                @blur="onDirectInvoiceEdit('invoiceNumber', $event)"
                :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'"
              >{{ invoice.invoiceNumber }}</h5>
              <div :class="invoice.paperTheme === 'dark' ? 'text-light opacity-75' : 'text-muted'" class="d-flex align-items-center justify-content-end gap-1.5 mt-1.5">
                <span class="small">Status Dokumen:</span>
                <span
                  class="badge rounded-pill fw-semibold px-2.5 py-1"
                  :class="getInvoiceStatusBadgeClass(invoice.status)"
                >
                  <i :class="getInvoiceStatusIcon(invoice.status)"></i>
                  {{ formatInvoiceStatusLabel(invoice.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Dates & Client Metadata -->
          <div class="row mb-4">
            <div class="col-6">
              <span class="small text-uppercase fw-bold d-block" :class="invoice.paperTheme === 'dark' ? 'text-light opacity-75' : 'text-muted'">Diterbitkan Untuk:</span>
              <h6
                class="fw-bold mb-1 inv-editable"
                contenteditable="true"
                spellcheck="false"
                title="Klik untuk perbaiki nama klien"
                @blur="onDirectInvoiceEdit('clientName', $event)"
                :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'"
              >{{ invoice.clientName || 'Nama Klien / Perusahaan' }}</h6>
              <p
                class="small mb-0 inv-editable"
                contenteditable="true"
                spellcheck="false"
                title="Klik untuk perbaiki email klien"
                @blur="onDirectInvoiceEdit('clientEmail', $event)"
                :class="invoice.paperTheme === 'dark' ? 'text-light opacity-75' : 'text-secondary'"
              >{{ invoice.clientEmail || 'email@klien.com' }}</p>
              <p
                class="small mb-0 inv-editable"
                contenteditable="true"
                spellcheck="false"
                title="Klik untuk perbaiki alamat klien"
                @blur="onDirectInvoiceEdit('clientAddress', $event)"
                :class="invoice.paperTheme === 'dark' ? 'text-light opacity-75' : 'text-secondary'"
              >{{ invoice.clientAddress || 'Alamat Klien' }}</p>
            </div>

            <div class="col-6 text-end">
              <div class="mb-2">
                <span class="small text-uppercase fw-bold d-block" :class="invoice.paperTheme === 'dark' ? 'text-light opacity-75' : 'text-muted'">Tanggal Terbit:</span>
                <span class="fw-bold" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">{{ formatDate(invoice.issueDate) }}</span>
              </div>
              <div>
                <span class="small text-uppercase fw-bold d-block" :class="invoice.paperTheme === 'dark' ? 'text-light opacity-75' : 'text-muted'">Jatuh Tempo:</span>
                <span class="fw-bold text-danger">{{ formatDate(invoice.dueDate) }}</span>
              </div>
            </div>
          </div>

          <!-- Table of Services -->
          <div class="table-responsive mb-4">
            <table class="table align-middle border" :class="invoice.paperTheme === 'dark' ? 'table-dark border-secondary' : ''">
              <thead :class="invoice.paperTheme === 'dark' ? 'table-dark' : 'table-light'">
                <tr>
                  <th style="width: 40px;">#</th>
                  <th>Deskripsi Pekerjaan / Layanan</th>
                  <th class="text-center" style="width: 70px;">Qty</th>
                  <th class="text-end" style="width: 130px;">Harga Unit</th>
                  <th class="text-end" style="width: 140px;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in invoice.items" :key="idx">
                  <td>{{ idx + 1 }}</td>
                  <td>
                    <div
                      class="fw-bold inv-editable"
                      contenteditable="true"
                      spellcheck="false"
                      title="Klik untuk edit nama layanan/pekerjaan"
                      @blur="onDirectItemEdit(idx, 'nama', $event)"
                      :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'"
                    >{{ item.nama || 'Layanan Freelance' }}</div>
                  </td>
                  <td class="text-center fw-semibold">
                    <span class="inv-editable px-1" contenteditable="true" spellcheck="false" @blur="onDirectItemEdit(idx, 'quantity', $event)">{{ item.quantity || 1 }}</span>
                  </td>
                  <td class="text-end">
                    <span class="inv-editable px-1" contenteditable="true" spellcheck="false" @blur="onDirectItemPriceEdit(idx, $event)">{{ formatCurrency(item.biaya) }}</span>
                  </td>
                  <td class="text-end fw-bold" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">{{ formatCurrency(item.quantity * item.biaya) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Financial Calculation Totals -->
          <div class="row justify-content-end mb-4">
            <div class="col-md-6">
              <div class="p-3 rounded-3" :class="invoice.paperTheme === 'dark' ? 'bg-black bg-opacity-25 border border-secondary' : 'bg-light border'">
                <div class="d-flex justify-content-between mb-2">
                  <span class="small" :class="invoice.paperTheme === 'dark' ? 'text-light opacity-75' : 'text-muted'">Subtotal:</span>
                  <span class="fw-bold" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">{{ formatCurrency(subtotal) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2" v-if="invoice.taxPercent > 0">
                  <span class="small" :class="invoice.paperTheme === 'dark' ? 'text-light opacity-75' : 'text-muted'">PPN ({{ invoice.taxPercent }}%):</span>
                  <span>+ {{ formatCurrency(taxAmount) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2 text-danger" v-if="invoice.discount > 0">
                  <span class="small">Diskon:</span>
                  <span>- {{ formatCurrency(invoice.discount) }}</span>
                </div>
                <div class="d-flex justify-content-between pt-2 border-top fs-5 fw-bold text-primary">
                  <span>Total Tagihan:</span>
                  <span>{{ formatCurrency(totalAmount) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Notes Footer -->
          <div class="border-top pt-3" :class="invoice.paperTheme === 'dark' ? 'border-secondary' : ''">
            <h6 class="fw-bold mb-1" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">Instruksi Pembayaran & Rekening Bank:</h6>
            <p
              class="small mb-0 style-notes inv-editable p-1 rounded"
              contenteditable="true"
              spellcheck="false"
              title="Klik untuk perbaiki catatan atau nomor rekening bank"
              @blur="onDirectInvoiceEdit('notes', $event)"
              :class="invoice.paperTheme === 'dark' ? 'text-light opacity-75' : 'text-muted'"
            >{{ invoice.notes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Saved Invoices History Section -->
    <div class="card border-0 shadow-sm rounded-4 bg-white mb-4 no-print" v-if="savedInvoices.length > 0">
      <div class="card-header bg-transparent border-bottom p-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div class="d-flex align-items-center gap-2">
              <h5 class="fw-bold text-dark mb-0"><i class="bi bi-clock-history text-primary me-2"></i>Riwayat Invoice Tersimpan</h5>
              <span class="badge rounded-pill bg-primary bg-opacity-10 text-primary fw-bold px-2.5 py-1">
                {{ savedInvoices.length }} Total
              </span>
            </div>
            <span class="text-muted small">Semua invoice (baik dari POS maupun Manual) tersimpan rapi dan dapat diedit sewaktu-waktu.</span>
          </div>

          <div v-if="selectedIds.length > 0" class="d-flex gap-2 align-items-center">
            <span class="small fw-bold text-primary me-2">{{ selectedIds.length }} terpilih</span>
            <button class="btn btn-sm btn-danger rounded-pill px-3" @click="bulkDelete">
              <i class="bi bi-trash-fill me-1"></i> Hapus Terpilih
            </button>
          </div>
        </div>

        <!-- Filter Tabs & Search Bar -->
        <div class="row g-2 mt-3 align-items-center">
          <div class="col-lg-7">
            <div class="d-flex align-items-center gap-1.5 overflow-x-auto pb-1 category-pill-strip">
              <button
                class="btn btn-sm rounded-pill px-3 py-1 text-nowrap fw-semibold"
                :class="invoiceFilterTab === 'all' ? 'btn-primary' : 'btn-outline-secondary bg-light'"
                @click="invoiceFilterTab = 'all'"
              >
                Semua ({{ savedInvoices.length }})
              </button>
              <button
                class="btn btn-sm rounded-pill px-3 py-1 text-nowrap fw-semibold"
                :class="invoiceFilterTab === 'draft' ? 'btn-warning text-dark' : 'btn-outline-secondary bg-light'"
                @click="invoiceFilterTab = 'draft'"
              >
                Belum Dikirim / Draft ({{ countDraft }})
              </button>
              <button
                class="btn btn-sm rounded-pill px-3 py-1 text-nowrap fw-semibold"
                :class="invoiceFilterTab === 'sent' ? 'btn-info text-dark' : 'btn-outline-secondary bg-light'"
                @click="invoiceFilterTab = 'sent'"
              >
                Sudah Dikirim ({{ countSent }})
              </button>
              <button
                class="btn btn-sm rounded-pill px-3 py-1 text-nowrap fw-semibold"
                :class="invoiceFilterTab === 'paid' ? 'btn-success' : 'btn-outline-secondary bg-light'"
                @click="invoiceFilterTab = 'paid'"
              >
                Lunas ({{ countPaid }})
              </button>
              <button
                class="btn btn-sm rounded-pill px-3 py-1 text-nowrap fw-semibold"
                :class="invoiceFilterTab === 'pos' ? 'btn-purple text-white' : 'btn-outline-secondary bg-light'"
                @click="invoiceFilterTab = 'pos'"
              >
                <i class="bi bi-shop me-1"></i> Dari POS ({{ countPos }})
              </button>
              <button
                class="btn btn-sm rounded-pill px-3 py-1 text-nowrap fw-semibold"
                :class="invoiceFilterTab === 'manual' ? 'btn-secondary' : 'btn-outline-secondary bg-light'"
                @click="invoiceFilterTab = 'manual'"
              >
                <i class="bi bi-pencil-square me-1"></i> Manual ({{ countManual }})
              </button>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-light text-muted border-end-0 rounded-start-pill">
                <i class="bi bi-search"></i>
              </span>
              <input
                v-model="invoiceSearchQuery"
                type="text"
                class="form-control border-start-0 rounded-end-pill"
                placeholder="Cari No. Invoice / Nama Klien / Item..."
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card-body p-0">
        <div v-if="filteredSavedInvoices.length === 0" class="p-4 text-center text-muted small">
          Tidak ada invoice yang sesuai dengan filter atau pencarian Anda.
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 40px;" class="text-center">
                  <input type="checkbox" class="form-check-input" :checked="isAllSelected" @change="toggleSelectAll" />
                </th>
                <th>No. Invoice</th>
                <th>Asal / Sumber</th>
                <th>Status Dokumen</th>
                <th>Klien</th>
                <th>Tanggal Terbit</th>
                <th>Jatuh Tempo</th>
                <th>Total Tagihan</th>
                <th class="text-end pe-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inv in filteredSavedInvoices" :key="inv.id">
                <td class="text-center">
                  <input type="checkbox" class="form-check-input" :value="inv.id" v-model="selectedIds" />
                </td>
                <td class="fw-bold text-primary">{{ inv.invoiceNumber }}</td>
                <td>
                  <!-- Fixed Origin Badge -->
                  <span class="badge rounded-pill fw-bold px-2.5 py-1" :class="inv.source === 'pos' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-slate-100 text-slate-700 border border-slate-300'">
                    <i :class="inv.source === 'pos' ? 'bi bi-shop me-1' : 'bi bi-pencil-square me-1'"></i>
                    {{ inv.source === 'pos' ? 'POS' : 'Manual' }}
                  </span>
                </td>
                <td>
                  <!-- Quick Status Selector / Toggle -->
                  <select
                    class="form-select form-select-sm rounded-pill fw-semibold py-0.5 ps-2 pe-4"
                    :class="getInvoiceStatusBadgeClass(inv.status)"
                    style="font-size: 11.5px; width: auto; display: inline-block;"
                    :value="inv.status || 'Draft'"
                    @change="quickChangeStatus(inv, $event.target.value)"
                    title="Ubah status invoice secara instan"
                  >
                    <option value="Draft">Belum Dikirim (Draft)</option>
                    <option value="Terkirim">Sudah Dikirim</option>
                    <option value="Lunas">Lunas</option>
                  </select>
                </td>
                <td>{{ inv.clientName || 'Klien Umum' }}</td>
                <td>{{ formatDate(inv.issueDate) }}</td>
                <td>{{ formatDate(inv.dueDate) }}</td>
                <td class="fw-bold text-success">{{ formatCurrency(calcTotal(inv)) }}</td>
                <td class="text-end pe-4">
                  <button class="btn btn-sm btn-outline-primary rounded-pill px-3 me-1" @click="loadInvoice(inv)">
                    <i class="bi bi-pencil-square me-1"></i> Edit
                  </button>
                  <button class="btn btn-sm btn-light text-danger rounded-circle" @click="deleteSingleInvoice(inv.id)" title="Hapus Invoice">
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
      <div v-if="toast.show" class="toast align-items-center text-white bg-success border-0 show shadow-lg rounded-3" role="alert">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="bi bi-check-circle-fill fs-5"></i>
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

    const myBusiness = computed(() => store.getters.getMyBusiness);
    const savedInvoices = computed(() => store.getters.getInvoices);

    const invoice = ref({
      invoiceNumber: 'INV-' + new Date().getFullYear() + '-001',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      clientName: '',
      clientEmail: '',
      clientAddress: '',
      currency: 'IDR',
      status: 'Draft',
      // Kafeinarts Logo & Inverted Outline Configuration
      logoType: 'kafeinarts', // 'kafeinarts' | 'custom' | 'none'
      logoOutlineMode: 'auto', // 'auto' | 'dark' | 'light'
      logoSize: 58,
      customLogoUrl: '',
      paperTheme: 'light', // 'light' | 'dark'
      items: [
        { nama: '', quantity: 1, biaya: 0 }
      ],
      taxPercent: 0,
      discount: 0,
      notes: ''
    });

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

    onMounted(() => {
      if (route.query.id) {
        const found = savedInvoices.value.find(i => String(i.id) === String(route.query.id));
        if (found) {
          loadInvoice(found);
        }
      }
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
      invoice.value.items.splice(idx, 1);
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
      return Math.max(0, subtotal.value + taxAmount.value - Number(invoice.value.discount || 0));
    });

    const calcTotal = (inv) => {
      if (!inv.items) return 0;
      const sub = inv.items.reduce((s, item) => s + (Number(item.biaya || 0) * Number(item.quantity || 1)), 0);
      const tax = (sub * Number(inv.taxPercent || 0)) / 100;
      return Math.max(0, sub + tax - Number(inv.discount || 0));
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
      if (!invoice.value.status) invoice.value.status = 'Draft';
      if (!invoice.value.source) invoice.value.source = 'manual';
      showToastMsg(`Invoice ${inv.invoiceNumber} dimuat ke editor.`);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    };

    const resetToNewInvoice = () => {
      invoice.value = {
        invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + String(Math.floor(100 + Math.random() * 900)),
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        clientName: '',
        clientEmail: '',
        clientAddress: '',
        currency: 'IDR',
        status: 'Draft',
        source: 'manual',
        logoType: 'kafeinarts',
        logoOutlineMode: 'auto',
        logoSize: 58,
        customLogoUrl: '',
        paperTheme: 'light',
        items: [
          { nama: '', quantity: 1, biaya: 0 }
        ],
        taxPercent: 0,
        discount: 0,
        notes: ''
      };
      showToastMsg('Form siap untuk invoice baru.');
    };

    const saveAsNewCopy = () => {
      errors.value = {};
      if (!invoice.value.invoiceNumber || !invoice.value.invoiceNumber.trim()) {
        errors.value.invoiceNumber = 'Nomor invoice wajib diisi!';
      }
      if (Object.keys(errors.value).length > 0) return;

      const newNumber = invoice.value.invoiceNumber.includes('-COPY')
        ? invoice.value.invoiceNumber + '1'
        : invoice.value.invoiceNumber + '-COPY';

      const copyPayload = {
        ...JSON.parse(JSON.stringify(invoice.value)),
        id: undefined,
        invoiceNumber: newNumber,
        status: 'Draft',
        source: invoice.value.source || 'manual'
      };

      store.dispatch('addInvoice', copyPayload);
      invoice.value.id = undefined;
      invoice.value.invoiceNumber = newNumber;
      showToastMsg(`Salinan invoice ${newNumber} berhasil disimpan sebagai baru!`);
    };

    const quickChangeStatus = (inv, newStatus) => {
      store.dispatch('updateInvoice', {
        ...inv,
        status: newStatus
      });
      showToastMsg(`Status ${inv.invoiceNumber} diubah ke: ${formatInvoiceStatusLabel(newStatus)}`);
    };

    // Filter and Search for Saved Invoices
    const invoiceFilterTab = ref('all'); // 'all' | 'draft' | 'sent' | 'paid' | 'pos' | 'manual'
    const invoiceSearchQuery = ref('');

    const filteredSavedInvoices = computed(() => {
      let list = [...savedInvoices.value];

      if (invoiceFilterTab.value === 'draft') {
        list = list.filter(i => i.status === 'Draft' || !i.status);
      } else if (invoiceFilterTab.value === 'sent') {
        list = list.filter(i => i.status === 'Terkirim');
      } else if (invoiceFilterTab.value === 'paid') {
        list = list.filter(i => i.status === 'Lunas');
      } else if (invoiceFilterTab.value === 'pos') {
        list = list.filter(i => i.source === 'pos');
      } else if (invoiceFilterTab.value === 'manual') {
        list = list.filter(i => i.source !== 'pos');
      }

      if (invoiceSearchQuery.value.trim()) {
        const q = invoiceSearchQuery.value.toLowerCase().trim();
        list = list.filter(i =>
          (i.invoiceNumber && i.invoiceNumber.toLowerCase().includes(q)) ||
          (i.clientName && i.clientName.toLowerCase().includes(q)) ||
          (i.items && i.items.some(item => item.nama && item.nama.toLowerCase().includes(q)))
        );
      }

      return list;
    });

    const countDraft = computed(() => savedInvoices.value.filter(i => i.status === 'Draft' || !i.status).length);
    const countSent = computed(() => savedInvoices.value.filter(i => i.status === 'Terkirim').length);
    const countPaid = computed(() => savedInvoices.value.filter(i => i.status === 'Lunas').length);
    const countPos = computed(() => savedInvoices.value.filter(i => i.source === 'pos').length);
    const countManual = computed(() => savedInvoices.value.filter(i => i.source !== 'pos').length);

    const getInvoiceStatusBadgeClass = (status) => {
      if (status === 'Draft' || !status) return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
      if (status === 'Terkirim') return 'bg-info-subtle text-info-emphasis border border-info-subtle';
      if (status === 'Lunas') return 'bg-success-subtle text-success-emphasis border border-success-subtle';
      return 'bg-secondary-subtle text-secondary border border-secondary-subtle';
    };

    const getInvoiceStatusIcon = (status) => {
      if (status === 'Draft' || !status) return 'bi bi-hourglass-split me-1';
      if (status === 'Terkirim') return 'bi bi-send-check me-1';
      if (status === 'Lunas') return 'bi bi-check-all me-1';
      return 'bi bi-file-earmark me-1';
    };

    const formatInvoiceStatusLabel = (status) => {
      if (status === 'Draft' || !status) return 'Belum Dikirim (Draft)';
      if (status === 'Terkirim') return 'Sudah Dikirim';
      if (status === 'Lunas') return 'Lunas';
      return status;
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

    const lastInvoiceAutoSaveTime = ref('');

    const triggerInvoiceAutoSave = () => {
      const now = new Date();
      lastInvoiceAutoSaveTime.value = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      // update invoice in store if already present or update local draft
      if (invoice.value.id) {
        store.dispatch('updateInvoice', invoice.value);
      }
    };

    const onDirectInvoiceEdit = (field, e) => {
      if (!e || !e.target) return;
      const val = e.target.innerText ? e.target.innerText.trim() : '';
      invoice.value[field] = val;
      triggerInvoiceAutoSave();
    };

    const onDirectBusinessEdit = (field, e) => {
      if (!e || !e.target) return;
      const val = e.target.innerText ? e.target.innerText.trim() : '';
      myBusiness.value[field] = val;
    };

    const onDirectItemEdit = (idx, field, e) => {
      if (!e || !e.target || !invoice.value.items[idx]) return;
      const val = e.target.innerText ? e.target.innerText.trim() : '';
      if (field === 'quantity') {
        invoice.value.items[idx].quantity = Math.max(1, parseInt(val) || 1);
      } else {
        invoice.value.items[idx][field] = val;
      }
      triggerInvoiceAutoSave();
    };

    const onDirectItemPriceEdit = (idx, e) => {
      if (!e || !e.target || !invoice.value.items[idx]) return;
      const raw = e.target.innerText.replace(/[^0-9]/g, '');
      const parsed = parseInt(raw) || 0;
      invoice.value.items[idx].biaya = parsed;
      triggerInvoiceAutoSave();
    };

    const saveInvoiceToStore = () => {
      errors.value = {};
      if (!invoice.value.invoiceNumber || !invoice.value.invoiceNumber.trim()) {
        errors.value.invoiceNumber = 'Nomor invoice wajib diisi!';
      }
      if (!invoice.value.issueDate) {
        errors.value.issueDate = 'Tanggal terbit wajib diisi!';
      }
      if (!invoice.value.dueDate) {
        errors.value.dueDate = 'Jatuh tempo wajib diisi!';
      }
      if (!invoice.value.clientName || !invoice.value.clientName.trim()) {
        errors.value.clientName = 'Nama klien wajib diisi!';
      }
      if (!invoice.value.items || invoice.value.items.length === 0) {
        errors.value.items = 'Minimal sertakan 1 item pekerjaan!';
      }

      if (Object.keys(errors.value).length > 0) return;

      const payload = {
        ...invoice.value,
        status: invoice.value.status || 'Draft',
        source: invoice.value.source || 'manual'
      };

      if (invoice.value.id) {
        store.dispatch('updateInvoice', payload);
        showToastMsg(`Invoice ${invoice.value.invoiceNumber} berhasil diperbarui!`);
      } else {
        store.dispatch('addInvoice', payload);
        showToastMsg('Invoice baru berhasil disimpan ke database!');
      }

      const now = new Date();
      lastInvoiceAutoSaveTime.value = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const formatCurrency = (amount) => {
      if (isNaN(amount)) amount = 0;
      const symbol = invoice.value.currency === 'USD' ? '$' : 'Rp ';
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
          title: `Invoice - ${invoice.value.invoiceNumber || 'Inv'}_A4`,
          elementId: 'invoicePreviewArea',
          autoPrint: true,
          paperSize: 'a4',
          paperOrientation: 'portrait',
          marginTop: 10,
          marginBottom: 10,
          marginLeft: 12,
          marginRight: 12
        });
        isPdfLoading.value = false;
      }, 350);
    };

    const downloadPDF = async () => {
      if (isPdfLoading.value) return;
      isPdfLoading.value = true;

      try {
        const doc = new jsPDF();

        // 1. Add Kafeinarts Logo or Custom Logo
        let hasLogo = false;
        if (invoice.value.logoType === 'kafeinarts') {
          try {
            // For printed PDF document, use crisp inverted dark outline on white page
            const logoDataUrl = await getKafeinartsLogoDataUrl({
              inverted: false,
              outlineMode: invoice.value.logoOutlineMode === 'light' ? 'light' : 'dark',
              size: 240
            });
            if (logoDataUrl) {
              doc.addImage(logoDataUrl, 'PNG', 14, 13, 20, 20);
              hasLogo = true;
            }
          } catch (logoErr) {
            console.warn('Could not generate Kafeinarts logo data URL for PDF:', logoErr);
          }
        } else if (invoice.value.logoType === 'custom' && invoice.value.customLogoUrl) {
          try {
            doc.addImage(invoice.value.customLogoUrl, 'PNG', 14, 13, 20, 20);
            hasLogo = true;
          } catch (customErr) {
            console.warn('Could not add custom logo to PDF:', customErr);
          }
        }

        const textStartX = hasLogo ? 38 : 14;

        // Header Business Info
        doc.setFontSize(hasLogo ? 17 : 20);
        doc.setTextColor(37, 99, 235);
        doc.setFont('helvetica', 'bold');
        doc.text(myBusiness.value.name, textStartX, 20);

        doc.setFontSize(hasLogo ? 9 : 10);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text(myBusiness.value.tagline, textStartX, 26);
        doc.text(`${myBusiness.value.email} | ${myBusiness.value.phone}`, textStartX, 31);

        // Invoice Badge
        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', 196, 20, { align: 'right' });
        doc.setFontSize(12);
        doc.text(invoice.value.invoiceNumber, 196, 27, { align: 'right' });

        doc.line(14, 36, 196, 36);

        // Dates & Client info
        let yPos = 46;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Diterbitkan Untuk:', 14, yPos);
        doc.text('Tanggal Terbit:', 130, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(formatDate(invoice.value.issueDate), 196, yPos, { align: 'right' });

        yPos += 6;
        doc.setFont('helvetica', 'bold');
        doc.text(invoice.value.clientName || 'Klien Umum', 14, yPos);
        doc.text('Jatuh Tempo:', 130, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(formatDate(invoice.value.dueDate), 196, yPos, { align: 'right' });

        if (invoice.value.clientEmail) {
          yPos += 5;
          doc.text(invoice.value.clientEmail, 14, yPos);
        }

        yPos += 12;
        // Table Headers
        doc.setFillColor(241, 245, 249);
        doc.rect(14, yPos, 182, 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text('#', 16, yPos + 6);
        doc.text('Deskripsi Layanan', 26, yPos + 6);
        doc.text('Qty', 130, yPos + 6, { align: 'center' });
        doc.text('Harga Unit', 160, yPos + 6, { align: 'right' });
        doc.text('Total', 192, yPos + 6, { align: 'right' });

        yPos += 12;
        doc.setFont('helvetica', 'normal');
        invoice.value.items.forEach((item, idx) => {
          doc.text(String(idx + 1), 16, yPos);
          doc.text(item.nama || 'Layanan Freelance', 26, yPos);
          doc.text(String(item.quantity || 1), 130, yPos, { align: 'center' });
          doc.text(formatCurrency(item.biaya), 160, yPos, { align: 'right' });
          doc.text(formatCurrency(item.quantity * item.biaya), 192, yPos, { align: 'right' });
          yPos += 8;
        });

        doc.line(14, yPos, 196, yPos);
        yPos += 10;

        // Totals
        doc.setFont('helvetica', 'bold');
        doc.text('Subtotal:', 140, yPos);
        doc.text(formatCurrency(subtotal.value), 192, yPos, { align: 'right' });
        yPos += 6;

        if (taxAmount.value > 0) {
          doc.text(`PPN (${invoice.value.taxPercent}%):`, 140, yPos);
          doc.text(formatCurrency(taxAmount.value), 192, yPos, { align: 'right' });
          yPos += 6;
        }

        doc.setFontSize(12);
        doc.setTextColor(37, 99, 235);
        doc.text('TOTAL TAGIHAN:', 140, yPos + 2);
        doc.text(formatCurrency(totalAmount.value), 192, yPos + 2, { align: 'right' });

        yPos += 16;
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text('Instruksi Pembayaran:', 14, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);

        const notesLines = doc.splitTextToSize(invoice.value.notes || 'Terima kasih!', 180);
        doc.text(notesLines, 14, yPos + 6);

        // Open in clean new tab without popup
        const pdfBlob = doc.output('blob');
        openPdfBlobInNewTab(pdfBlob, `Invoice_${invoice.value.invoiceNumber}`);
        showToastMsg('Dokumen PDF berhasil dibuka di tab baru!');
      } catch (err) {
        console.error(err);
        showToastMsg('Gagal memproses PDF, membuka tampilan cetak...');
        triggerPrint();
      } finally {
        isPdfLoading.value = false;
      }
    };

    const exportToExcel = () => {
      const exportData = [
        {
          NomorInvoice: invoice.value.invoiceNumber,
          Klien: invoice.value.clientName,
          Email: invoice.value.clientEmail,
          TanggalTerbit: invoice.value.issueDate,
          JatuhTempo: invoice.value.dueDate,
          Subtotal: subtotal.value,
          Pajak: taxAmount.value,
          Diskon: invoice.value.discount,
          TotalAkhir: totalAmount.value,
          Currency: invoice.value.currency
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
          app: 'RajinKerja',
          type: 'invoices_backup',
          version: '2.5',
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
          title: 'Export Invoice Berhasil!',
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
              title: 'Format Invoice Tidak Ditemukan',
              text: 'Berkas JSON ini tidak memiliki struktur invoice yang valid.'
            });
            return;
          }

          Swal.fire({
            title: 'Pulihkan Data Invoice?',
            html: `
              <div class="text-start p-2 bg-light rounded border mb-2 small">
                <p class="mb-1"><strong>Jumlah Riwayat:</strong> ${incomingInvoices.length} Invoice</p>
                <p class="mb-0"><strong>Invoice Aktif:</strong> ${currentInv?.invoiceNumber || (incomingInvoices[0]?.invoiceNumber || '-')}</p>
              </div>
              <p class="small text-muted mb-0">Apakah Anda ingin memulihkan riwayat invoice dari berkas JSON ini?</p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Pulihkan Data',
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
              Swal.fire({
                icon: 'success',
                title: 'Data Invoice Berhasil Dipulihkan!',
                text: `${incomingInvoices.length} invoice tersimpan dan siap digunakan.`,
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
      myBusiness,
      savedInvoices,
      filteredSavedInvoices,
      invoiceFilterTab,
      invoiceSearchQuery,
      countDraft,
      countSent,
      countPaid,
      countPos,
      countManual,
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
      importBulkItems,
      subtotal,
      taxAmount,
      totalAmount,
      calcTotal,
      loadInvoice,
      resetToNewInvoice,
      saveAsNewCopy,
      quickChangeStatus,
      getInvoiceStatusBadgeClass,
      getInvoiceStatusIcon,
      formatInvoiceStatusLabel,
      deleteSingleInvoice,
      bulkDelete,
      saveInvoiceToStore,
      formatCurrency,
      formatDate,
      isPdfLoading,
      triggerPrint,
      downloadPDF,
      handleCustomLogoUpload,
      exportToExcel,
      invoiceJsonInput,
      exportInvoiceJson,
      triggerImportInvoiceJson,
      onInvoiceJsonSelected,
      lastInvoiceAutoSaveTime,
      onDirectInvoiceEdit,
      onDirectBusinessEdit,
      onDirectItemEdit,
      onDirectItemPriceEdit
    };
  }
};
</script>

<style scoped>
.inv-editable {
  outline: none;
  cursor: text;
  transition: all 0.15s ease;
  border-radius: 4px;
}
.inv-editable:hover {
  background-color: rgba(37, 99, 235, 0.08);
  box-shadow: 0 0 0 1.5px rgba(37, 99, 235, 0.3);
}
.inv-editable:focus {
  background-color: rgba(37, 99, 235, 0.12);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.6);
}
@media print {
  .inv-editable:hover,
  .inv-editable:focus {
    background-color: transparent !important;
    box-shadow: none !important;
  }
}

.invoice-paper {
  min-height: 680px;
  transition: all 0.25s ease;
}

.invoice-brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.style-notes {
  white-space: pre-line;
}

@media print {
  .no-print {
    display: none !important;
  }
  .invoice-paper {
    box-shadow: none !important;
    padding: 0 !important;
    min-height: auto !important;
    width: 100% !important;
    background-color: transparent !important;
    color: #000000 !important;
  }
}
</style>
