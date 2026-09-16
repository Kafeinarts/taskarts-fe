<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Header Banner & Action Toolbar -->
    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border no-print">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
          <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-receipt me-1"></i> Billing & Invoicing
          </span>
          <span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 fw-bold px-2.5 py-1.5 rounded-pill small">
            By Kafeinarts
          </span>
          <span class="badge bg-info-subtle text-info fw-bold px-2.5 py-1.5 rounded-pill small">
            <i class="bi bi-aspect-ratio me-1"></i> Format A5 Landscape (210 × 148 mm)
          </span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">Invoice Generator Pro</h2>
        <p class="text-muted mb-0">Kelola tagihan profesional proporsional A5 Landscape, hitung otomatis pajak & diskon, cetak atau unduh PDF siap pakai.</p>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex flex-wrap gap-2 align-items-center">
        <button class="btn btn-outline-warning text-dark px-3 py-2 rounded-3 fw-semibold" @click="exportInvoiceJson" title="Backup semua invoice ke berkas JSON">
          <i class="bi bi-filetype-json text-warning me-1"></i> Export JSON
        </button>
        <button class="btn btn-outline-info text-dark px-3 py-2 rounded-3 fw-semibold" @click="triggerImportInvoiceJson" title="Import / Recovery invoice dari JSON">
          <i class="bi bi-upload text-info me-1"></i> Import JSON
        </button>
        <input type="file" ref="invoiceJsonInput" accept=".json" class="d-none" @change="onInvoiceJsonSelected" />

        <button class="btn btn-outline-success px-3 py-2 rounded-3 fw-semibold" @click="exportToExcel" title="Export rangkuman ke Excel">
          <i class="bi bi-file-earmark-excel-fill me-1 text-success"></i> Excel
        </button>

        <button class="btn btn-outline-primary px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-1.5" :disabled="isPdfLoading" @click="triggerPrint">
          <span v-if="isPdfLoading" class="spinner-border spinner-border-sm text-primary" role="status"></span>
          <i v-else class="bi bi-printer"></i>
          <span>Cetak A5</span>
        </button>

        <button class="btn btn-primary px-4 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 shadow-sm" :disabled="isPdfLoading" @click="downloadPDF">
          <span v-if="isPdfLoading" class="spinner-border spinner-border-sm text-white" role="status"></span>
          <i v-else class="bi bi-file-earmark-pdf-fill fs-5"></i>
          <span>{{ isPdfLoading ? 'Menyiapkan...' : 'Buka PDF A5' }}</span>
        </button>
      </div>
    </div>

    <!-- Main Workspace Grid: Form Editor (Left) & A5 Landscape Preview (Right) -->
    <div class="row g-4 mb-4">
      <!-- Form Editor Panel -->
      <div class="col-xl-5 no-print">
        <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <!-- Card Header & Navigation Tabs -->
          <div class="p-3 bg-light border-bottom">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i class="bi bi-sliders2 text-primary"></i>
                <span>Editor Form Invoice</span>
              </h5>
              <div class="d-flex gap-1">
                <button type="button" class="btn btn-xs btn-outline-secondary rounded-pill px-2.5 py-1" @click="loadSampleData" title="Isi dengan contoh data">
                  <i class="bi bi-magic me-1"></i> Contoh
                </button>
                <button type="button" class="btn btn-xs btn-outline-danger rounded-pill px-2.5 py-1" @click="resetInvoiceForm" title="Reset Form">
                  <i class="bi bi-arrow-counterclockwise me-1"></i> Reset
                </button>
              </div>
            </div>

            <!-- Tab Pills Navigation -->
            <ul class="nav nav-pills nav-fill bg-white p-1 rounded-3 border shadow-2xs gap-1" role="tablist">
              <li class="nav-item">
                <button
                  class="nav-link py-1.5 px-2 rounded-2 small fw-bold text-nowrap"
                  :class="activeFormTab === 'client' ? 'active bg-primary text-white shadow-sm' : 'text-secondary'"
                  @click="activeFormTab = 'client'"
                >
                  <i class="bi bi-person-lines-fill me-1"></i> Klien
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link py-1.5 px-2 rounded-2 small fw-bold text-nowrap"
                  :class="activeFormTab === 'items' ? 'active bg-primary text-white shadow-sm' : 'text-secondary'"
                  @click="activeFormTab = 'items'"
                >
                  <i class="bi bi-cart-check me-1"></i> Item ({{ invoice.items.length }})
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link py-1.5 px-2 rounded-2 small fw-bold text-nowrap"
                  :class="activeFormTab === 'payment' ? 'active bg-primary text-white shadow-sm' : 'text-secondary'"
                  @click="activeFormTab = 'payment'"
                >
                  <i class="bi bi-wallet2 me-1"></i> Bayar
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link py-1.5 px-2 rounded-2 small fw-bold text-nowrap"
                  :class="activeFormTab === 'branding' ? 'active bg-primary text-white shadow-sm' : 'text-secondary'"
                  @click="activeFormTab = 'branding'"
                >
                  <i class="bi bi-palette me-1"></i> Desain
                </button>
              </li>
            </ul>
          </div>

          <!-- Tab Content Body -->
          <div class="card-body p-4">
            <form @submit.prevent="saveInvoiceToStore">
              <!-- TAB 1: INFORMASI INVOICE & KLIEN -->
              <div v-show="activeFormTab === 'client'" class="row g-3">
                <div class="col-12">
                  <div class="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border">
                    <span class="small fw-bold text-muted"><i class="bi bi-hash me-1"></i>Status Dokumen:</span>
                    <div class="d-flex gap-1">
                      <button
                        type="button"
                        v-for="st in ['Belum Bayar', 'Lunas', 'Menunggu', 'Draft']"
                        :key="st"
                        class="btn btn-xs rounded-pill px-2.5 py-1"
                        :class="invoice.status === st ? 'btn-dark fw-bold' : 'btn-outline-secondary bg-white'"
                        @click="invoice.status = st"
                      >
                        {{ st }}
                      </button>
                    </div>
                  </div>
                </div>

                <div class="col-md-7">
                  <label class="form-label small fw-bold text-dark">Nomor Invoice <span class="text-danger">*</span></label>
                  <div class="input-group input-group-sm">
                    <span class="input-group-text bg-light text-muted"><i class="bi bi-tag"></i></span>
                    <input
                      type="text"
                      class="form-control form-control-sm"
                      :class="{ 'is-invalid': errors.invoiceNumber }"
                      v-model="invoice.invoiceNumber"
                      placeholder="INV-2026-001"
                    />
                  </div>
                  <div class="invalid-feedback d-block small" v-if="errors.invoiceNumber">{{ errors.invoiceNumber }}</div>
                </div>

                <div class="col-md-5">
                  <label class="form-label small fw-bold text-dark">Mata Uang</label>
                  <select class="form-select form-select-sm" v-model="invoice.currency">
                    <option value="IDR">Rupiah (IDR)</option>
                    <option value="USD">US Dollar (USD)</option>
                  </select>
                </div>

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
                  <label class="form-label small fw-bold text-dark">Jatuh Tempo <span class="text-danger">*</span></label>
                  <input
                    type="date"
                    class="form-control form-control-sm"
                    :class="{ 'is-invalid': errors.dueDate }"
                    v-model="invoice.dueDate"
                  />
                  <div class="invalid-feedback d-block small" v-if="errors.dueDate">{{ errors.dueDate }}</div>
                </div>

                <div class="col-12 mt-3 pt-3 border-top">
                  <h6 class="fw-bold text-primary mb-2 small text-uppercase">
                    <i class="bi bi-building me-1"></i> Data Klien / Penerima Tagihan
                  </h6>
                </div>

                <div class="col-12">
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

                <div class="col-md-6">
                  <label class="form-label small fw-bold text-dark">Email Klien</label>
                  <input type="email" class="form-control form-control-sm" v-model="invoice.clientEmail" placeholder="client@perusahaan.com" />
                </div>

                <div class="col-md-6">
                  <label class="form-label small fw-bold text-dark">No. Telepon / WhatsApp</label>
                  <input type="text" class="form-control form-control-sm" v-model="invoice.clientPhone" placeholder="0812-3456-7890" />
                </div>

                <div class="col-12">
                  <label class="form-label small fw-bold text-dark">Alamat Klien</label>
                  <textarea class="form-control form-control-sm" rows="2" v-model="invoice.clientAddress" placeholder="Gedung Cyber 2 Lt. 8, Jl. HR Rasuna Said, Jakarta"></textarea>
                </div>
              </div>

              <!-- TAB 2: RINCIAN ITEM PEKERJAAN -->
              <div v-show="activeFormTab === 'items'" class="row g-3">
                <div class="col-12 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="fw-bold text-dark mb-0">Daftar Layanan / Produk</h6>
                    <small class="text-muted">Rincikan pekerjaan yang ditagihkan</small>
                  </div>
                  <div class="d-flex gap-1.5">
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 small" @click="showBulkItemBox = !showBulkItemBox">
                      <i class="bi bi-list-task me-1"></i> {{ showBulkItemBox ? 'Tutup Bulk' : 'Bulk Paste' }}
                    </button>
                    <button type="button" class="btn btn-sm btn-primary rounded-pill px-3 py-1 fw-bold" @click="addItem">
                      <i class="bi bi-plus-lg me-1"></i> Tambah Item
                    </button>
                  </div>
                </div>

                <!-- Bulk Item Importer Box -->
                <div v-if="showBulkItemBox" class="col-12">
                  <div class="p-3 bg-light rounded-3 border-2 border-dashed border-primary">
                    <label class="form-label small fw-bold text-primary mb-1">
                      <i class="bi bi-clipboard2-plus me-1"></i> Paste Banyak Item (Format: Nama Layanan, Qty, Biaya Satuan)
                    </label>
                    <textarea
                      class="form-control form-control-sm font-monospace mb-2"
                      rows="3"
                      placeholder="UI/UX Prototyping Figma, 1, 3500000&#10;Frontend Web Slicing, 1, 4500000"
                      v-model="bulkItemsText"
                    ></textarea>
                    <button type="button" class="btn btn-sm btn-primary w-100 rounded-2 fw-semibold" @click="importBulkItems">
                      <i class="bi bi-plus-circle me-1"></i> Masukkan ke Daftar Item
                    </button>
                  </div>
                </div>

                <div v-if="errors.items" class="col-12">
                  <div class="alert alert-danger py-1.5 px-3 small fw-bold mb-0">{{ errors.items }}</div>
                </div>

                <!-- Item Rows -->
                <div class="col-12">
                  <div class="d-flex flex-column gap-2" style="max-height: 380px; overflow-y: auto;">
                    <div
                      v-for="(item, idx) in invoice.items"
                      :key="idx"
                      class="p-2.5 rounded-3 border bg-light position-relative"
                    >
                      <div class="d-flex justify-content-between align-items-center mb-1.5">
                        <span class="badge bg-secondary-subtle text-dark px-2 py-0.5 small fw-bold">#{{ idx + 1 }}</span>
                        <div class="d-flex align-items-center gap-2">
                          <span class="small fw-bold text-primary">
                            {{ formatCurrency((item.quantity || 1) * (item.biaya || 0)) }}
                          </span>
                          <button
                            type="button"
                            class="btn btn-xs text-danger border-0 p-0"
                            @click="removeItem(idx)"
                            v-if="invoice.items.length > 1"
                            title="Hapus baris item ini"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>

                      <div class="row g-2">
                        <div class="col-12">
                          <input
                            type="text"
                            class="form-control form-control-sm bg-white"
                            v-model="item.nama"
                            placeholder="Deskripsi layanan / nama produk..."
                          />
                        </div>
                        <div class="col-4">
                          <div class="input-group input-group-sm">
                            <span class="input-group-text bg-white px-1.5 text-muted small">Qty</span>
                            <input
                              type="number"
                              class="form-control form-control-sm bg-white text-center"
                              v-model.number="item.quantity"
                              min="1"
                            />
                          </div>
                        </div>
                        <div class="col-8">
                          <div class="input-group input-group-sm">
                            <span class="input-group-text bg-white px-1.5 text-muted small">{{ invoice.currency }}</span>
                            <input
                              type="number"
                              class="form-control form-control-sm bg-white"
                              v-model.number="item.biaya"
                              min="0"
                              placeholder="Harga Satuan"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Subtotal Quick Bar -->
                <div class="col-12">
                  <div class="p-2.5 rounded-3 bg-primary-subtle d-flex justify-content-between align-items-center">
                    <span class="small fw-bold text-primary">Subtotal ({{ invoice.items.length }} item):</span>
                    <span class="fw-bold text-primary fs-6">{{ formatCurrency(subtotal) }}</span>
                  </div>
                </div>
              </div>

              <!-- TAB 3: PEMBAYARAN, PAJAK & CATATAN -->
              <div v-show="activeFormTab === 'payment'" class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-dark">PPN / Pajak (%)</label>
                  <div class="input-group input-group-sm">
                    <input type="number" class="form-control" v-model.number="invoice.taxPercent" min="0" max="100" />
                    <span class="input-group-text bg-light">%</span>
                  </div>
                  <small class="text-muted" v-if="taxAmount > 0">+ {{ formatCurrency(taxAmount) }}</small>
                </div>

                <div class="col-md-6">
                  <label class="form-label small fw-bold text-dark">Potongan / Diskon</label>
                  <div class="input-group input-group-sm">
                    <span class="input-group-text bg-light">{{ invoice.currency }}</span>
                    <input type="number" class="form-control" v-model.number="invoice.discount" min="0" />
                  </div>
                  <small class="text-danger" v-if="invoice.discount > 0">- {{ formatCurrency(invoice.discount) }}</small>
                </div>

                <div class="col-12 border-top pt-2">
                  <h6 class="fw-bold text-primary mb-2 small text-uppercase">
                    <i class="bi bi-bank me-1"></i> Rekening Tujuan Transfer
                  </h6>
                </div>

                <div class="col-md-6">
                  <label class="form-label small fw-bold text-dark">Nama Bank / E-Wallet</label>
                  <input type="text" class="form-control form-control-sm" v-model="invoice.bankName" placeholder="Bank Central Asia (BCA)" />
                </div>

                <div class="col-md-6">
                  <label class="form-label small fw-bold text-dark">Nomor Rekening</label>
                  <input type="text" class="form-control form-control-sm font-monospace" v-model="invoice.bankAccount" placeholder="8830192831" />
                </div>

                <div class="col-12">
                  <label class="form-label small fw-bold text-dark">Atas Nama Rekening</label>
                  <input type="text" class="form-control form-control-sm" v-model="invoice.bankHolder" placeholder="Kafeinarts Digital Studio / Arip Tri Prayogo" />
                </div>

                <div class="col-12 border-top pt-2">
                  <label class="form-label small fw-bold text-dark">Catatan & Syarat Ketentuan</label>
                  <textarea class="form-control form-control-sm" rows="3" v-model="invoice.notes" placeholder="Pembayaran mohon ditransfer dalam 14 hari kerja setelah invoice diterbitkan. Terima kasih atas kerjasamanya!"></textarea>
                </div>

                <div class="col-12">
                  <label class="form-label small fw-bold text-dark">Nama Penandatangan Resmi</label>
                  <input type="text" class="form-control form-control-sm" v-model="invoice.signerName" placeholder="Arip Tri Prayogo (Lead Creative)" />
                </div>
              </div>

              <!-- TAB 4: KUSTOMISASI DESAIN & LOGO KOP -->
              <div v-show="activeFormTab === 'branding'" class="row g-3">
                <div class="col-12">
                  <div class="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light border">
                    <span class="small fw-bold text-dark">Tema Kertas A5:</span>
                    <div class="btn-group btn-group-sm">
                      <button
                        type="button"
                        class="btn btn-xs"
                        :class="invoice.paperTheme === 'light' ? 'btn-primary text-white fw-bold' : 'btn-outline-secondary bg-white'"
                        @click="invoice.paperTheme = 'light'"
                      >
                        <i class="bi bi-sun me-1"></i> Putih Terang
                      </button>
                      <button
                        type="button"
                        class="btn btn-xs"
                        :class="invoice.paperTheme === 'dark' ? 'btn-dark text-white fw-bold' : 'btn-outline-secondary bg-white'"
                        @click="invoice.paperTheme = 'dark'"
                      >
                        <i class="bi bi-moon-stars me-1"></i> Gelap Modern
                      </button>
                    </div>
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label small fw-bold text-dark">Warna Aksen Dokumen</label>
                  <div class="d-flex gap-2 align-items-center">
                    <button
                      type="button"
                      v-for="color in accentColorOptions"
                      :key="color.id"
                      class="btn p-0 rounded-circle border-2"
                      :style="{ backgroundColor: color.hex, width: '28px', height: '28px' }"
                      :class="invoice.accentColor === color.id ? 'border-dark shadow-sm' : 'border-transparent'"
                      @click="invoice.accentColor = color.id"
                      :title="color.name"
                    ></button>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label small fw-bold text-dark">Pilihan Logo Kop</label>
                  <select class="form-select form-select-sm" v-model="invoice.logoType">
                    <option value="kafeinarts">Logo Kafeinarts (Vector Inverted)</option>
                    <option value="custom">Upload Logo Kustom</option>
                    <option value="none">Tanpa Logo (Inisial Teks)</option>
                  </select>
                </div>

                <div class="col-md-6" v-if="invoice.logoType === 'kafeinarts'">
                  <label class="form-label small fw-bold text-dark">Garis Outline Vector</label>
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
                        <span class="opacity-75">Tampilan proporsional di A5 Landscape</span>
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

              <!-- Submit & Save Bar -->
              <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                <div class="small text-muted">
                  Total: <strong class="text-dark fs-6">{{ formatCurrency(totalAmount) }}</strong>
                </div>
                <button type="submit" class="btn btn-success px-4 py-2 rounded-3 fw-bold shadow-sm d-flex align-items-center gap-1.5">
                  <i class="bi bi-save"></i>
                  <span>Simpan ke Riwayat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- A5 Landscape Live Document Preview (Right) -->
      <div class="col-xl-7">
        <!-- Floating Preview Control Toolbar -->
        <div class="d-flex justify-content-between align-items-center mb-2 px-1 no-print">
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-dark text-white px-3 py-1.5 rounded-pill small fw-bold d-flex align-items-center gap-1.5">
              <i class="bi bi-aspect-ratio text-warning"></i>
              <span>A5 Landscape Sheet</span>
            </span>
            <small class="text-muted d-none d-sm-inline">210 mm × 148 mm</small>
          </div>

          <div class="d-flex align-items-center gap-2">
            <button
              class="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 bg-white text-dark"
              @click="invoice.paperTheme = invoice.paperTheme === 'dark' ? 'light' : 'dark'"
              title="Ganti Tema Kertas (Terang / Gelap)"
            >
              <i :class="invoice.paperTheme === 'dark' ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-stars-fill text-dark'"></i>
              <span class="ms-1 small d-none d-md-inline">{{ invoice.paperTheme === 'dark' ? 'Kertas Terang' : 'Kertas Gelap' }}</span>
            </button>
            <button class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-semibold bg-white" @click="triggerPrint">
              <i class="bi bi-printer me-1"></i> Cetak
            </button>
            <button class="btn btn-sm btn-primary rounded-pill px-3 py-1 fw-bold" @click="downloadPDF">
              <i class="bi bi-box-arrow-up-right me-1"></i> PDF
            </button>
          </div>
        </div>

        <!-- A5 LANDSCAPE DOCUMENT CONTAINER (PROPORTIONAL 210 : 148) -->
        <div class="a5-landscape-viewport-wrapper">
          <div
            class="a5-landscape-sheet shadow-lg rounded-4 transition-all"
            :class="[
              invoice.paperTheme === 'dark' ? 'bg-dark text-white is-dark' : 'bg-white text-dark is-light',
              'accent-' + (invoice.accentColor || 'primary')
            ]"
            id="invoicePreviewArea"
          >
            <!-- ACCENT COLOR TOP STRIPE -->
            <div class="a5-accent-bar" :style="{ backgroundColor: getAccentHex(invoice.accentColor) }"></div>

            <div class="a5-sheet-inner p-4 p-md-4-5">
              <!-- HEADER SECTION: KOP PERUSAHAAN & INVOICE META -->
              <div class="d-flex justify-content-between align-items-start pb-3 mb-3 border-bottom a5-header-divider">
                <!-- Left: Logo & Company Identity -->
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
                  <div v-else class="rounded-3 px-2.5 py-1.5 fw-bold fs-5 text-white flex-shrink-0" :style="{ backgroundColor: getAccentHex(invoice.accentColor) }">
                    KA
                  </div>

                  <div>
                    <h4 class="fw-extrabold mb-0 leading-tight" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">
                      {{ myBusiness.name || 'KAFEINARTS STUDIO' }}
                    </h4>
                    <p class="small mb-0 opacity-75" style="font-size: 11.5px;">{{ myBusiness.tagline || 'Digital Creative & Software Development' }}</p>
                    <div class="small opacity-65 d-flex gap-2 flex-wrap" style="font-size: 11px;">
                      <span><i class="bi bi-envelope me-1"></i>{{ myBusiness.email }}</span>
                      <span>•</span>
                      <span><i class="bi bi-telephone me-1"></i>{{ myBusiness.phone }}</span>
                    </div>
                  </div>
                </div>

                <!-- Right: Invoice Title, Number & Status -->
                <div class="text-end">
                  <div class="d-flex align-items-center justify-content-end gap-2 mb-1">
                    <span
                      class="badge text-uppercase px-2.5 py-1 rounded-pill small fw-extrabold"
                      :style="{ backgroundColor: getAccentHex(invoice.accentColor), color: '#ffffff' }"
                    >
                      INVOICE
                    </span>
                    <span
                      class="badge rounded-pill px-2.5 py-1 small fw-bold"
                      :class="getStatusBadgeClass(invoice.status)"
                    >
                      {{ invoice.status || 'Belum Bayar' }}
                    </span>
                  </div>
                  <h5 class="fw-extrabold font-monospace mb-0" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">
                    {{ invoice.invoiceNumber }}
                  </h5>
                  <div class="small opacity-75" style="font-size: 11px;">
                    Terbit: <strong>{{ formatDate(invoice.issueDate) }}</strong> • Tempo: <strong class="text-danger">{{ formatDate(invoice.dueDate) }}</strong>
                  </div>
                </div>
              </div>

              <!-- CLIENT & BILLING INFO METADATA (2-COLUMN BALANCED ROW) -->
              <div class="row g-2 mb-3">
                <!-- Client Info Card -->
                <div class="col-7">
                  <div class="p-2.5 rounded-3 border a5-meta-card h-100" :class="invoice.paperTheme === 'dark' ? 'bg-dark-subtle-box' : 'bg-light-box'">
                    <span class="d-block text-uppercase fw-bold opacity-60 mb-0.5" style="font-size: 10px; letter-spacing: 0.5px;">
                      DITAGIHKAN KEPADA (BILL TO):
                    </span>
                    <div class="fw-bold text-truncate" style="font-size: 13.5px;" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">
                      {{ invoice.clientName || 'Nama Klien / Perusahaan' }}
                    </div>
                    <div class="small opacity-75 text-truncate" style="font-size: 11px;" v-if="invoice.clientEmail || invoice.clientPhone">
                      {{ [invoice.clientEmail, invoice.clientPhone].filter(Boolean).join(' • ') }}
                    </div>
                    <div class="small opacity-75 text-truncate" style="font-size: 11px;" v-if="invoice.clientAddress">
                      {{ invoice.clientAddress }}
                    </div>
                  </div>
                </div>

                <!-- Payment Destination Card -->
                <div class="col-5">
                  <div class="p-2.5 rounded-3 border a5-meta-card h-100" :class="invoice.paperTheme === 'dark' ? 'bg-dark-subtle-box' : 'bg-light-box'">
                    <span class="d-block text-uppercase fw-bold opacity-60 mb-0.5" style="font-size: 10px; letter-spacing: 0.5px;">
                      TRANSFER & PEMBAYARAN:
                    </span>
                    <div class="fw-bold text-truncate" style="font-size: 13px;" :style="{ color: getAccentHex(invoice.accentColor) }">
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

              <!-- ITEMS TABLE (OPTIMIZED FOR A5 LANDSCAPE DENSITY) -->
              <div class="table-responsive mb-3 a5-table-container">
                <table class="table table-sm align-middle border mb-0 a5-items-table" :class="invoice.paperTheme === 'dark' ? 'table-dark border-secondary' : ''">
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
                    <tr v-for="(item, idx) in invoice.items" :key="idx" class="a5-table-row">
                      <td class="text-center text-muted small" style="font-size: 11px;">{{ idx + 1 }}</td>
                      <td>
                        <div class="fw-semibold text-truncate" style="font-size: 12px;" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">
                          {{ item.nama || 'Layanan Digital & Pengembangan Proyek' }}
                        </div>
                      </td>
                      <td class="text-center fw-bold small" style="font-size: 11px;">{{ item.quantity || 1 }}</td>
                      <td class="text-end text-muted small" style="font-size: 11px;">{{ formatCurrency(item.biaya) }}</td>
                      <td class="text-end fw-bold" style="font-size: 12px;" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">
                        {{ formatCurrency((item.quantity || 1) * (item.biaya || 0)) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- BOTTOM SECTION: NOTES + SIGNATURE (LEFT) & TOTALS CALCULATION (RIGHT) -->
              <div class="row g-2 align-items-end pt-1">
                <!-- Left: Payment Terms & Official Signature Block -->
                <div class="col-7">
                  <!-- Payment Instruction Notes -->
                  <div class="mb-2">
                    <span class="d-block fw-bold opacity-60 text-uppercase" style="font-size: 10px;">Catatan & Ketentuan:</span>
                    <p class="small mb-0 opacity-75 a5-notes-text" style="font-size: 11px; line-height: 1.4;">
                      {{ invoice.notes || 'Pembayaran mohon ditransfer paling lambat sesuai tanggal jatuh tempo. Bukti transfer dapat dikirimkan melalui WhatsApp/Email. Terima kasih atas kepercayaan Anda!' }}
                    </p>
                  </div>

                  <!-- Signature Block -->
                  <div class="d-flex align-items-center gap-3 pt-1">
                    <div class="text-center" style="min-width: 150px;">
                      <small class="opacity-60 d-block" style="font-size: 10px;">Hormat Kami,</small>
                      <div class="my-1 text-muted" style="height: 32px; display: flex; align-items: center; justify-content: center;">
                        <span class="font-monospace text-primary opacity-60 fst-italic" style="font-size: 14px;">Kafeinarts Digital</span>
                      </div>
                      <div class="border-top pt-0.5 fw-bold text-truncate" style="font-size: 11px;" :class="invoice.paperTheme === 'dark' ? 'text-white' : 'text-dark'">
                        {{ invoice.signerName || myBusiness.name || 'Arip Tri Prayogo' }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right: Financial Summary Box -->
                <div class="col-5">
                  <div class="p-2.5 rounded-3 border a5-totals-box" :class="invoice.paperTheme === 'dark' ? 'bg-dark-subtle-box' : 'bg-light-box'">
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

                    <!-- Grand Total Highlight -->
                    <div
                      class="d-flex justify-content-between align-items-center p-2 rounded-2 mt-1.5 text-white fw-bold"
                      :style="{ backgroundColor: getAccentHex(invoice.accentColor) }"
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

    <!-- Saved Invoices History Section -->
    <div class="card border-0 shadow-sm rounded-4 bg-white mb-4 no-print" v-if="savedInvoices.length > 0">
      <div class="card-header bg-transparent border-bottom p-4 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-clock-history text-primary fs-5"></i>
          <h5 class="fw-bold text-dark mb-0">Riwayat Invoice Tersimpan</h5>
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
                <th>No. Invoice</th>
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
                <td class="fw-bold text-primary font-monospace">{{ inv.invoiceNumber }}</td>
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
    const activeFormTab = ref('client'); // 'client', 'items', 'payment', 'branding'

    const accentColorOptions = [
      { id: 'primary', name: 'Biru Royal', hex: '#2563eb' },
      { id: 'indigo', name: 'Indigo Deep', hex: '#4f46e5' },
      { id: 'emerald', name: 'Emerald Green', hex: '#059669' },
      { id: 'amber', name: 'Amber Gold', hex: '#d97706' },
      { id: 'slate', name: 'Slate Charcoal', hex: '#334155' }
    ];

    const myBusiness = computed(() => store.getters.getMyBusiness || {
      name: 'Kafeinarts Digital Creative',
      tagline: 'Solusi Desain, Web Application & Digital Creative Studio',
      email: 'studio@kafeinarts.id',
      phone: '0812-3456-7890'
    });

    const savedInvoices = computed(() => store.getters.getInvoices || []);

    const invoice = ref({
      invoiceNumber: 'INV-' + new Date().getFullYear() + '-001',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      currency: 'IDR',
      status: 'Belum Bayar', // 'Belum Bayar' | 'Lunas' | 'Menunggu' | 'Draft'
      logoType: 'kafeinarts', // 'kafeinarts' | 'custom' | 'none'
      logoOutlineMode: 'auto', // 'auto' | 'dark' | 'light'
      logoSize: 52,
      customLogoUrl: '',
      paperTheme: 'light', // 'light' | 'dark'
      accentColor: 'primary',
      bankName: 'Bank Central Asia (BCA)',
      bankAccount: '8830-1928-31',
      bankHolder: 'Kafeinarts Studio / Arip Tri Prayogo',
      signerName: 'Arip Tri Prayogo',
      items: [
        { nama: 'Pengembangan Web Application & UI/UX', quantity: 1, biaya: 4500000 }
      ],
      taxPercent: 0,
      discount: 0,
      notes: 'Pembayaran mohon ditransfer ke rekening di atas dalam 14 hari kerja. Terima kasih atas kerjasamanya!'
    });

    const getAccentHex = (colorId) => {
      const found = accentColorOptions.find(c => c.id === colorId);
      return found ? found.hex : '#2563eb';
    };

    const getStatusBadgeClass = (status) => {
      switch (status) {
        case 'Lunas':
          return 'bg-success text-white';
        case 'Belum Bayar':
          return 'bg-danger text-white';
        case 'Menunggu':
          return 'bg-warning text-dark';
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

    const loadSampleData = () => {
      invoice.value.clientName = 'PT Nusantara Mega Kreasi';
      invoice.value.clientEmail = 'finance@nusantarakreasi.co.id';
      invoice.value.clientPhone = '0811-9876-5432';
      invoice.value.clientAddress = 'Menara Palma Lt. 12, Jl. HR Rasuna Said, Jakarta Selatan';
      invoice.value.items = [
        { nama: 'Desain Sistem & Prototyping UI/UX Mobile App', quantity: 1, biaya: 3500000 },
        { nama: 'Implementasi Frontend Vue 3 + Tailwind CSS', quantity: 1, biaya: 5000000 },
        { nama: 'Integrasi API & Modul Otentikasi Pengguna', quantity: 1, biaya: 2500000 }
      ];
      invoice.value.taxPercent = 11;
      invoice.value.discount = 500000;
      showToastMsg('Data contoh invoice A5 berhasil dimuat!');
    };

    const resetInvoiceForm = () => {
      invoice.value = {
        invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900),
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
        currency: 'IDR',
        status: 'Belum Bayar',
        logoType: 'kafeinarts',
        logoOutlineMode: 'auto',
        logoSize: 52,
        customLogoUrl: '',
        paperTheme: 'light',
        accentColor: 'primary',
        bankName: 'Bank Central Asia (BCA)',
        bankAccount: '8830-1928-31',
        bankHolder: 'Kafeinarts Studio / Arip Tri Prayogo',
        signerName: 'Arip Tri Prayogo',
        items: [{ nama: '', quantity: 1, biaya: 0 }],
        taxPercent: 0,
        discount: 0,
        notes: 'Pembayaran mohon ditransfer dalam 14 hari kerja. Terima kasih!'
      };
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
        activeFormTab.value = 'client';
      }
      if (!invoice.value.issueDate) {
        errors.value.issueDate = 'Tanggal terbit wajib diisi!';
        activeFormTab.value = 'client';
      }
      if (!invoice.value.dueDate) {
        errors.value.dueDate = 'Jatuh tempo wajib diisi!';
        activeFormTab.value = 'client';
      }
      if (!invoice.value.clientName || !invoice.value.clientName.trim()) {
        errors.value.clientName = 'Nama klien wajib diisi!';
        activeFormTab.value = 'client';
      }
      if (!invoice.value.items || invoice.value.items.length === 0 || !invoice.value.items[0].nama) {
        errors.value.items = 'Minimal sertakan 1 item pekerjaan yang valid!';
        activeFormTab.value = 'items';
      }

      if (Object.keys(errors.value).length > 0) return;

      store.dispatch('addInvoice', invoice.value);
      showToastMsg('Invoice berhasil disimpan ke riwayat database!');
    };

    const formatCurrency = (amount) => {
      if (isNaN(amount)) amount = 0;
      const symbol = invoice.value.currency === 'USD' ? '$ ' : 'Rp ';
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
          title: `Invoice_${invoice.value.invoiceNumber || 'Inv'}_A5_Landscape`,
          elementId: 'invoicePreviewArea',
          autoPrint: true,
          paperSize: 'a5',
          paperOrientation: 'landscape',
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
        // Create Authentic A5 Landscape PDF: 210mm Width x 148mm Height
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a5'
        });

        const pageWidth = 210;
        const pageHeight = 148;
        const marginX = 10;
        const contentWidth = pageWidth - (marginX * 2); // 190mm

        // 1. Accent Top Stripe
        const accentHex = getAccentHex(invoice.value.accentColor);
        doc.setFillColor(accentHex);
        doc.rect(0, 0, pageWidth, 4, 'F');

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
        doc.setTextColor(15, 23, 42); // dark slate
        doc.setFont('helvetica', 'bold');
        doc.text(myBusiness.value.name || 'Kafeinarts Digital', textStartX, 13);

        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text(myBusiness.value.tagline || 'Digital Creative & Web Studio', textStartX, 18);
        doc.text(`${myBusiness.value.email} • ${myBusiness.value.phone}`, textStartX, 22);

        // Top Right: INVOICE BADGE & Number
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(accentHex);
        doc.text('INVOICE', pageWidth - marginX, 13, { align: 'right' });

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
        // Bill To Box
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(marginX, metaY, 105, 18, 1.5, 1.5, 'F');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100);
        doc.text('DITAGIHKAN KEPADA (BILL TO):', marginX + 3, metaY + 4);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(invoice.value.clientName || 'Klien Umum', marginX + 3, metaY + 9);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        const clientMeta = [invoice.value.clientEmail, invoice.value.clientPhone].filter(Boolean).join(' • ');
        doc.text(clientMeta || invoice.value.clientAddress || '-', marginX + 3, metaY + 14);

        // Dates & Bank Box
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(marginX + 110, metaY, 80, 18, 1.5, 1.5, 'F');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100);
        doc.text('INFO PEMBAYARAN & TANGGAL:', marginX + 113, metaY + 4);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`${invoice.value.bankName || 'BCA'}: ${invoice.value.bankAccount || '8830192831'}`, marginX + 113, metaY + 9);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text(`Terbit: ${formatDate(invoice.value.issueDate)} • Tempo: ${formatDate(invoice.value.dueDate)}`, marginX + 113, metaY + 14);

        // Table of Items
        let tableY = 53;
        doc.setFillColor(241, 245, 249);
        doc.rect(marginX, tableY, contentWidth, 7, 'F');
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(51, 65, 85);
        doc.text('#', marginX + 2, tableY + 4.5);
        doc.text('DESKRIPSI PEKERJAAN / LAYANAN', marginX + 10, tableY + 4.5);
        doc.text('QTY', marginX + 125, tableY + 4.5, { align: 'center' });
        doc.text('HARGA UNIT', marginX + 155, tableY + 4.5, { align: 'right' });
        doc.text('TOTAL', marginX + contentWidth - 2, tableY + 4.5, { align: 'right' });

        tableY += 10;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);

        // Render at most 6 items neatly on A5 single page
        const itemsToPrint = invoice.value.items.slice(0, 6);
        itemsToPrint.forEach((item, idx) => {
          doc.text(String(idx + 1), marginX + 2, tableY);
          const nameLines = doc.splitTextToSize(item.nama || 'Layanan Digital', 105);
          doc.text(nameLines, marginX + 10, tableY);
          doc.text(String(item.quantity || 1), marginX + 125, tableY, { align: 'center' });
          doc.text(formatCurrency(item.biaya), marginX + 155, tableY, { align: 'right' });
          doc.setFont('helvetica', 'bold');
          doc.text(formatCurrency((item.quantity || 1) * (item.biaya || 0)), marginX + contentWidth - 2, tableY, { align: 'right' });
          doc.setFont('helvetica', 'normal');
          tableY += 7.5;
        });

        // Horizontal line under table
        doc.setDrawColor(226, 232, 240);
        doc.line(marginX, tableY + 1, pageWidth - marginX, tableY + 1);

        // Bottom Section: Notes & Signature (Left) and Totals (Right)
        let bottomY = tableY + 5;
        if (bottomY > 115) bottomY = 115; // constrain to page bounds

        // Left: Payment Terms & Signature
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100);
        doc.text('CATATAN & SYARAT KETENTUAN:', marginX, bottomY);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const notesLines = doc.splitTextToSize(invoice.value.notes || 'Terima kasih atas kerjasama dan kepercayaannya.', 105);
        doc.text(notesLines, marginX, bottomY + 3.5);

        // Signature on bottom left
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text('Hormat Kami,', marginX, pageHeight - 16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(invoice.value.signerName || myBusiness.value.name || 'Kafeinarts Studio', marginX, pageHeight - 8);

        // Right: Totals Box
        const totalsBoxX = marginX + 115;
        const totalsBoxWidth = 75;
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(totalsBoxX, bottomY - 1, totalsBoxWidth, 24, 1.5, 1.5, 'F');

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
        }

        // Highlight Grand Total Box
        doc.setFillColor(accentHex);
        doc.roundedRect(totalsBoxX + 2, bottomY + 14, totalsBoxWidth - 4, 7, 1, 1, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('TOTAL TAGIHAN:', totalsBoxX + 5, bottomY + 18.5);
        doc.setFontSize(9);
        doc.text(formatCurrency(totalAmount.value), totalsBoxX + totalsBoxWidth - 5, bottomY + 18.5, { align: 'right' });

        // Open in clean new tab without popup
        const pdfBlob = doc.output('blob');
        openPdfBlobInNewTab(pdfBlob, `Invoice_${invoice.value.invoiceNumber}_A5_Landscape`);
        showToastMsg('Dokumen PDF A5 Landscape berhasil dibuka!');
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
          NomorInvoice: invoice.value.invoiceNumber,
          Klien: invoice.value.clientName,
          Email: invoice.value.clientEmail,
          Telepon: invoice.value.clientPhone,
          TanggalTerbit: invoice.value.issueDate,
          JatuhTempo: invoice.value.dueDate,
          Status: invoice.value.status,
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
          app: 'TaskArts',
          type: 'invoices_backup',
          version: '3.0',
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
      importBulkItems,
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
      exportToExcel,
      invoiceJsonInput,
      exportInvoiceJson,
      triggerImportInvoiceJson,
      onInvoiceJsonSelected,
      activeFormTab,
      accentColorOptions,
      getAccentHex,
      getStatusBadgeClass,
      loadSampleData,
      resetInvoiceForm
    };
  }
};
</script>

<style scoped>
/* A5 Landscape Proportional Viewport */
.a5-landscape-viewport-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding: 4px;
}

/* Authentic A5 Landscape Paper Aspect Ratio (210mm x 148mm = ~1.419) */
.a5-landscape-sheet {
  width: 100%;
  max-width: 820px;
  min-height: 540px;
  aspect-ratio: 210 / 148;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
}

.a5-accent-bar {
  height: 4px;
  width: 100%;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.a5-sheet-inner {
  display: flex;
  flex-direction: column;
  flex: 1;
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

.a5-meta-card {
  min-height: 64px;
}

.a5-table-container {
  overflow-x: auto;
}

.a5-items-table th {
  padding: 6px 10px;
  letter-spacing: 0.5px;
}

.a5-items-table td {
  padding: 6px 10px;
}

.a5-notes-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive print rules */
@media print {
  @page {
    size: A5 landscape;
    margin: 6mm;
  }
  .no-print {
    display: none !important;
  }
  .a5-landscape-viewport-wrapper {
    padding: 0 !important;
    overflow: visible !important;
  }
  .a5-landscape-sheet {
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
