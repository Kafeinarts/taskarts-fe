<template>
  <div class="pos-container py-3 px-2 px-md-4" data-aos="fade-up">
    <!-- TOP EXECUTIVE BAR: Modern Material 3 Header & Cashier Metrics -->
    <header class="card border-0 rounded-4 shadow-sm mb-4 p-4 pos-hero-card text-white position-relative overflow-hidden">
      <div class="position-absolute end-0 top-0 w-50 h-100 opacity-10 pointer-events-none d-none d-lg-block">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-100 h-100">
          <circle cx="200" cy="200" r="180" stroke="currentColor" stroke-width="20" stroke-dasharray="10 15" />
          <circle cx="200" cy="200" r="120" stroke="currentColor" stroke-width="12" />
          <circle cx="200" cy="200" r="60" fill="currentColor" />
        </svg>
      </div>

      <div class="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-3 position-relative z-1">
        <div>
          <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span class="badge bg-white text-dark fw-bold px-3 py-1.5 rounded-pill shadow-xs d-inline-flex align-items-center gap-1.5">
              <span class="pos-pulse-dot"></span>
              <i class="bi bi-shop-window text-primary"></i> Point of Sale & Kasir Paket
            </span>
            <span class="badge bg-white bg-opacity-20 text-white border border-white border-opacity-25 px-2.5 py-1 rounded-pill">
              <i class="bi bi-arrow-repeat me-1 text-warning"></i> Sinkronisasi Invoice Aktif
            </span>
            <span class="badge bg-emerald-500 text-white px-2.5 py-1 rounded-pill fw-semibold">
              <i class="bi bi-whatsapp me-1"></i> WhatsApp Instant Ready
            </span>
          </div>
          <h2 class="fw-extrabold display-6 mb-1 text-white">Kasir POS Paket & Layanan Freelance 💼</h2>
          <p class="mb-0 text-white-70" style="max-width: 820px; font-size: 14.5px;">
            Pilih paket layanan berulang, atur rincian transaksi kasir secara teratur (tampilan stacked atas-bawah tanpa terbelah), dan langsung sinkronkan ke sistem Faktur / Invoice dengan status <strong>Draft</strong> atau <strong>Sudah Dikirim</strong>.
          </p>
        </div>

        <div class="d-flex flex-wrap gap-2 align-items-center">
          <button class="btn btn-light text-primary fw-bold rounded-pill px-3.5 py-2 shadow-sm d-flex align-items-center gap-2 hover-elevate" @click="openAddModal">
            <i class="bi bi-plus-circle-fill fs-5 text-primary"></i>
            <span>Tambah Paket Baru</span>
          </button>
          <router-link to="/invoice" class="btn btn-outline-light rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1.5">
            <i class="bi bi-receipt-cutoff text-warning"></i>
            <span>Lihat Invoice ({{ syncedInvoicesCount }})</span>
          </router-link>
          <button class="btn btn-outline-light rounded-pill px-3 py-2 fw-semibold" @click="exportCatalogJson" title="Backup Katalog ke File JSON">
            <i class="bi bi-filetype-json text-warning me-1"></i> Export
          </button>
          <button class="btn btn-outline-light rounded-pill px-3 py-2 fw-semibold" @click="triggerImport" title="Import Katalog dari File JSON">
            <i class="bi bi-upload text-info me-1"></i> Import
          </button>
          <input type="file" ref="fileInput" accept=".json" class="d-none" @change="onFileSelected" />
        </div>
      </div>

      <!-- Quick Metrics Bento Strip (Stacked in Header) -->
      <div class="row g-2 mt-3 pt-3 border-top border-white border-opacity-15 position-relative z-1">
        <div class="col-6 col-md-3">
          <div class="p-2.5 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10">
            <div class="small text-white-70 text-uppercase fw-semibold" style="font-size: 11px;">Total Menu Paket</div>
            <div class="fs-5 fw-extrabold text-white mt-0.5">{{ products.length }} Paket</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-2.5 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10">
            <div class="small text-white-70 text-uppercase fw-semibold" style="font-size: 11px;">Item di Keranjang</div>
            <div class="fs-5 fw-extrabold text-warning mt-0.5">{{ totalCartItemsCount }} Item</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-2.5 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10">
            <div class="small text-white-70 text-uppercase fw-semibold" style="font-size: 11px;">Total Tagihan Berjalan</div>
            <div class="fs-5 fw-extrabold text-emerald-300 mt-0.5">{{ formatCurrency(grandTotal) }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-2.5 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10">
            <div class="small text-white-70 text-uppercase fw-semibold" style="font-size: 11px;">Tersinkron ke Invoice</div>
            <div class="fs-5 fw-extrabold text-cyan-200 mt-0.5">{{ syncedInvoicesCount }} Invoice</div>
          </div>
        </div>
      </div>
    </header>

    <!-- SECTION 1 (UPPER STACK): KATALOG MENU & PAKET LAYANAN -->
    <section class="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-surface">
      <!-- Section Header with Search & Filter Controls -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3 pb-2 border-bottom">
        <div class="d-flex align-items-center gap-2">
          <div class="m3-icon-badge bg-primary text-white">
            <i class="bi bi-grid-fill"></i>
          </div>
          <div>
            <h4 class="fw-bold mb-0 text-dark">Katalog Menu & Paket Layanan</h4>
            <span class="small text-muted">Klik kartu atau tombol <strong>"+ Tambah"</strong> untuk memasukkan paket ke kasir pesanan di bawah</span>
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-primary rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 shadow-xs" @click="openAddModal">
            <i class="bi bi-plus-lg"></i>
            <span>Tambah Paket Baru</span>
          </button>
        </div>
      </div>

      <!-- Search, Sort & Category Filter Bar -->
      <div class="row g-2 align-items-center mb-3">
        <div class="col-lg-6">
          <div class="m3-search-input d-flex align-items-center rounded-pill px-3 py-2 border bg-light">
            <i class="bi bi-search text-muted me-2"></i>
            <input
              v-model="searchQuery"
              type="text"
              class="border-0 bg-transparent flex-grow-1 shadow-none outline-none text-dark"
              placeholder="Cari nama paket, fitur deliverables, atau deskripsi (Web, UI/UX, SEO, Maintenance...)"
              style="font-size: 14px;"
            />
            <button v-if="searchQuery" @click="searchQuery = ''" class="btn btn-link p-0 text-muted border-0 ms-1">
              <i class="bi bi-x-circle-fill"></i>
            </button>
          </div>
        </div>

        <div class="col-sm-6 col-lg-3">
          <select v-model="sortBy" class="form-select rounded-pill text-dark" style="font-size: 13.5px;">
            <option value="default">Urutan Standar</option>
            <option value="price-low">Harga: Termurah ke Termahal</option>
            <option value="price-high">Harga: Termahal ke Termurah</option>
            <option value="name">Nama Paket (A - Z)</option>
          </select>
        </div>

        <div class="col-sm-6 col-lg-3 text-sm-end text-muted small">
          Menampilkan <strong>{{ filteredProducts.length }}</strong> dari {{ products.length }} paket
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="d-flex align-items-center gap-1.5 overflow-x-auto pb-2 mb-3 category-pill-strip">
        <button
          v-for="cat in categories"
          :key="cat"
          class="btn btn-sm rounded-pill px-3 py-1.5 text-nowrap fw-semibold transition-all"
          :class="selectedCategory === cat ? 'btn-primary shadow-xs' : 'btn-outline-secondary bg-light-subtle'"
          @click="selectedCategory = cat"
        >
          {{ cat }}
          <span class="badge rounded-pill ms-1" :class="selectedCategory === cat ? 'bg-white text-primary' : 'bg-secondary bg-opacity-25 text-dark'">
            {{ getCategoryCount(cat) }}
          </span>
        </button>
      </div>

      <!-- Product / Menu Cards Grid -->
      <div v-if="filteredProducts.length === 0" class="p-5 text-center rounded-4 border border-dashed bg-light my-2">
        <i class="bi bi-inbox fs-1 text-muted opacity-50 d-block mb-2"></i>
        <h5 class="fw-bold text-dark">Tidak ada menu atau paket yang cocok</h5>
        <p class="text-muted small mb-3">Coba gunakan kata kunci lain atau tambahkan paket baru ke katalog Anda.</p>
        <button class="btn btn-primary rounded-pill px-4 py-2 fw-semibold" @click="openAddModal">
          <i class="bi bi-plus-lg me-1"></i> Tambah Paket Layanan Sekarang
        </button>
      </div>

      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
        <!-- Package Card Item -->
        <div v-for="prod in filteredProducts" :key="prod.id" class="col">
          <div
            class="card h-100 border rounded-4 p-3.5 m3-product-card transition-all d-flex flex-column justify-content-between"
            :class="{ 'card-active-selected border-primary': getCartItemQty(prod.id) > 0 }"
          >
            <div>
              <!-- Card Top Header -->
              <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
                <span class="badge rounded-pill px-2.5 py-1 small fw-bold" :class="getCategoryBadgeClass(prod.category)">
                  {{ prod.category || 'Umum' }}
                </span>

                <div class="d-flex align-items-center gap-1">
                  <span
                    class="badge rounded-pill px-2 py-0.5 small fw-semibold"
                    :class="prod.is_negotiable ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-secondary-subtle text-secondary border border-secondary-subtle'"
                  >
                    {{ prod.is_negotiable ? 'Bisa Nego' : 'Harga Pas' }}
                  </span>
                  <!-- Menu item actions -->
                  <div class="dropdown">
                    <button class="btn btn-sm btn-link text-muted p-0 ms-1" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Menu Layanan">
                      <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 py-1">
                      <li>
                        <button class="dropdown-item small d-flex align-items-center gap-2" @click="openEditModal(prod)">
                          <i class="bi bi-pencil text-primary"></i> Edit Paket
                        </button>
                      </li>
                      <li>
                        <button class="dropdown-item small d-flex align-items-center gap-2" @click="duplicateProduct(prod)">
                          <i class="bi bi-copy text-info"></i> Duplikat Paket
                        </button>
                      </li>
                      <li><hr class="dropdown-divider my-1"></li>
                      <li>
                        <button class="dropdown-item small text-danger d-flex align-items-center gap-2" @click="confirmDelete(prod.id)">
                          <i class="bi bi-trash3"></i> Hapus Paket
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Package Title & Icon -->
              <div class="d-flex align-items-center gap-2 mb-1.5">
                <div class="pkg-icon-wrap rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0" style="width: 34px; height: 34px;">
                  <i :class="getPackageIcon(prod)"></i>
                </div>
                <h5 class="fw-bold text-dark mb-0 line-clamp-1" :title="prod.title">{{ prod.title }}</h5>
              </div>

              <!-- Description -->
              <p class="text-muted small mb-2.5 line-clamp-2" style="min-height: 38px;" :title="prod.description">
                {{ prod.description || 'Paket layanan berkualitas siap dikerjakan.' }}
              </p>

              <!-- Deliverables / Features List -->
              <div class="p-2.5 rounded-3 bg-light border mb-3">
                <div class="small fw-bold text-dark mb-1 d-flex align-items-center gap-1" style="font-size: 11.5px;">
                  <i class="bi bi-check2-circle text-primary"></i> Cakupan & Deliverables Paket:
                </div>
                <ul class="list-unstyled mb-0 small text-muted" style="font-size: 12px;">
                  <li v-for="(feat, fIdx) in (prod.features || []).slice(0, 3)" :key="fIdx" class="d-flex align-items-baseline gap-1.5 mb-0.5 text-truncate">
                    <i class="bi bi-check text-success fw-bold flex-shrink-0 fs-6"></i>
                    <span class="text-truncate">{{ feat }}</span>
                  </li>
                  <li v-if="(prod.features || []).length > 3" class="text-primary fw-semibold" style="font-size: 11px;">
                    +{{ (prod.features || []).length - 3 }} cakupan lainnya
                  </li>
                  <li v-if="!prod.features || prod.features.length === 0" class="text-muted fst-italic" style="font-size: 11px;">
                    Cakupan standar proyek
                  </li>
                </ul>
              </div>
            </div>

            <!-- Card Bottom: Price, Delivery Time, and Cart Stepper -->
            <div class="pt-2 border-top d-flex align-items-center justify-content-between gap-2">
              <div>
                <div class="fw-extrabold text-primary fs-5">{{ formatCurrency(prod.price) }}</div>
                <div v-if="prod.delivery_time" class="text-muted small d-flex align-items-center gap-1" style="font-size: 11px;">
                  <i class="bi bi-stopwatch"></i>{{ prod.delivery_time }}
                </div>
              </div>

              <!-- Cart Control: Add or Stepper -->
              <div>
                <div v-if="getCartItemQty(prod.id) === 0">
                  <button
                    class="btn btn-sm btn-primary rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 shadow-xs"
                    @click="addToCart(prod)"
                  >
                    <i class="bi bi-cart-plus"></i>
                    <span>+ Tambah</span>
                  </button>
                </div>
                <div v-else class="d-flex align-items-center gap-1 bg-primary-subtle p-1 rounded-pill border border-primary-subtle">
                  <button class="btn btn-xs btn-white rounded-circle p-1 shadow-xs" style="width: 26px; height: 26px;" @click="decrementCart(prod.id)">
                    <i class="bi bi-dash fw-bold text-primary"></i>
                  </button>
                  <span class="fw-bold px-2 text-primary small" style="min-width: 24px; text-align: center;">
                    {{ getCartItemQty(prod.id) }}
                  </span>
                  <button class="btn btn-xs btn-primary rounded-circle p-1 shadow-xs" style="width: 26px; height: 26px;" @click="addToCart(prod)">
                    <i class="bi bi-plus fw-bold text-white"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Add New Package Quick Card Placeholder -->
        <div class="col">
          <div
            class="card h-100 border-2 border-dashed rounded-4 p-4 d-flex flex-column align-items-center justify-content-center text-center cursor-pointer hover-elevate bg-light-subtle"
            style="min-height: 240px;"
            @click="openAddModal"
          >
            <div class="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center mb-2" style="width: 52px; height: 52px;">
              <i class="bi bi-plus-lg fs-4"></i>
            </div>
            <h6 class="fw-bold text-dark mb-1">Tambah Paket Layanan Baru</h6>
            <p class="text-muted small mb-0" style="max-width: 240px;">
              Buat paket berulang kustom dengan harga, waktu pengerjaan, dan deliverables baru.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2 (MIDDLE STACK): MEJA KASIR & TRANSAKSI AKTIF (CHECKOUT WORKBENCH) -->
    <section class="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-surface">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3 pb-2 border-bottom">
        <div class="d-flex align-items-center gap-2">
          <div class="m3-icon-badge bg-emerald-600 text-white">
            <i class="bi bi-cart-check-fill"></i>
          </div>
          <div>
            <div class="d-flex align-items-center gap-2">
              <h4 class="fw-bold mb-0 text-dark">Rincian Transaksi & Keranjang Kasir</h4>
              <span class="badge rounded-pill bg-emerald-100 text-emerald-800 border border-emerald-200 fw-bold px-2.5 py-1">
                {{ cart.length }} Layanan Dipilih
              </span>
            </div>
            <span class="small text-muted">Sesuaikan kuantitas, masukkan data klien, dan sinkronkan transaksi langsung ke Faktur Invoice</span>
          </div>
        </div>

        <div v-if="cart.length > 0" class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-danger rounded-pill px-3 py-1.5" @click="clearCart">
            <i class="bi bi-trash me-1"></i> Kosongkan Keranjang
          </button>
        </div>
      </div>

      <!-- Empty Cart State -->
      <div v-if="cart.length === 0" class="p-5 text-center rounded-4 border border-dashed bg-light my-2">
        <div class="rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center p-3 mb-2">
          <i class="bi bi-cart-x fs-2"></i>
        </div>
        <h5 class="fw-bold text-dark">Keranjang Kasir Masih Kosong</h5>
        <p class="text-muted small mb-3" style="max-width: 480px; margin: 0 auto;">
          Silakan pilih satu atau beberapa paket layanan pada katalog di atas dengan menekan tombol <strong>"+ Tambah"</strong> untuk mulai memproses transaksi dan pembuatan invoice.
        </p>
        <div class="d-flex flex-wrap justify-content-center gap-2">
          <button
            v-for="p in products.slice(0, 3)"
            :key="p.id"
            class="btn btn-sm btn-outline-primary rounded-pill px-3"
            @click="addToCart(p)"
          >
            + {{ p.title }}
          </button>
        </div>
      </div>

      <!-- Active Cart Items Table & Checkout Configuration -->
      <div v-else>
        <!-- Table of Selected Items -->
        <div class="table-responsive rounded-3 border mb-4">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 40px;" class="text-center">#</th>
                <th>Paket Layanan & Deliverables</th>
                <th style="width: 140px;">Kategori</th>
                <th style="width: 150px;">Harga Satuan</th>
                <th style="width: 150px;" class="text-center">Kuantitas (Qty)</th>
                <th style="width: 160px;" class="text-end">Subtotal</th>
                <th style="width: 60px;" class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in cart" :key="item.id">
                <td class="text-center text-muted fw-semibold">{{ idx + 1 }}</td>
                <td>
                  <div class="fw-bold text-dark">{{ item.title }}</div>
                  <div class="text-muted small" style="font-size: 11.5px;">
                    {{ (item.features || []).slice(0, 2).join(' • ') }}
                    <span v-if="(item.features || []).length > 2">... (+{{ item.features.length - 2 }} lainnya)</span>
                  </div>
                </td>
                <td>
                  <span class="badge rounded-pill px-2.5 py-1 small" :class="getCategoryBadgeClass(item.category)">
                    {{ item.category || 'Umum' }}
                  </span>
                </td>
                <td class="fw-semibold text-dark">{{ formatCurrency(item.price) }}</td>
                <td class="text-center">
                  <div class="d-inline-flex align-items-center gap-1 bg-light p-1 rounded-pill border">
                    <button class="btn btn-xs btn-white rounded-circle p-1 shadow-xs" style="width: 24px; height: 24px;" @click="decrementCart(item.id)">
                      <i class="bi bi-dash fw-bold"></i>
                    </button>
                    <span class="fw-bold px-2 text-dark small" style="min-width: 28px;">{{ item.qty }}</span>
                    <button class="btn btn-xs btn-primary rounded-circle p-1 shadow-xs" style="width: 24px; height: 24px;" @click="incrementCart(item.id)">
                      <i class="bi bi-plus fw-bold text-white"></i>
                    </button>
                  </div>
                </td>
                <td class="text-end fw-bold text-primary">{{ formatCurrency(item.price * item.qty) }}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-link text-danger p-0" @click="removeFromCart(item.id)" title="Hapus dari pesanan">
                    <i class="bi bi-x-circle fs-5"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Stacked Customer Details & Payment Calculation Row -->
        <div class="row g-4 mb-4">
          <!-- Left Sub-panel: Data Klien & Opsi Invoice -->
          <div class="col-lg-6">
            <div class="p-4 rounded-4 bg-light border h-100">
              <h6 class="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <i class="bi bi-person-lines-fill text-primary"></i>
                <span>Data Klien & Tujuan Dokumen</span>
              </h6>

              <div class="mb-3">
                <label class="form-label small fw-bold text-dark mb-1">
                  Nama Klien / Perusahaan <span class="text-danger">*</span>
                </label>
                <input
                  v-model="clientName"
                  type="text"
                  class="form-control"
                  placeholder="Contoh: Bapak Hendra / PT Digital Kreasi"
                  required
                />
              </div>

              <div class="row g-2 mb-3">
                <div class="col-md-7">
                  <label class="form-label small fw-bold text-dark mb-1">
                    <i class="bi bi-whatsapp text-success me-1"></i>Nomor WhatsApp Klien
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-white text-muted fw-bold">+62</span>
                    <input
                      v-model="clientPhone"
                      type="tel"
                      class="form-control"
                      placeholder="81234567890"
                    />
                  </div>
                  <div class="text-muted" style="font-size: 10.5px;">Tanpa angka 0 di depan</div>
                </div>

                <div class="col-md-5">
                  <label class="form-label small fw-bold text-dark mb-1">Email Klien (Opsional)</label>
                  <input
                    v-model="clientEmail"
                    type="email"
                    class="form-control"
                    placeholder="klien@bisnis.com"
                  />
                </div>
              </div>

              <!-- Initial Invoice Status Selector -->
              <div class="mb-3 p-3 rounded-3 bg-white border">
                <label class="form-label small fw-bold text-dark mb-2 d-flex align-items-center justify-content-between">
                  <span>Status Awal Invoice yang Disinkronkan:</span>
                  <span class="badge rounded-pill" :class="syncInvoiceStatus === 'Draft' ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle' : 'bg-info-subtle text-info-emphasis border border-info-subtle'">
                    {{ syncInvoiceStatus === 'Draft' ? 'Belum Dikirim (Draft)' : 'Sudah Dikirim (Terkirim)' }}
                  </span>
                </label>
                <div class="d-flex gap-2">
                  <div
                    class="form-check p-2 rounded-2 flex-fill border cursor-pointer"
                    :class="syncInvoiceStatus === 'Draft' ? 'border-warning bg-warning bg-opacity-10' : 'border-light'"
                    @click="syncInvoiceStatus = 'Draft'"
                  >
                    <input class="form-check-input ms-0 me-2" type="radio" v-model="syncInvoiceStatus" value="Draft" id="statusDraftRadio" />
                    <label class="form-check-label fw-semibold text-dark small cursor-pointer" for="statusDraftRadio">
                      Belum Dikirim (Draft)
                    </label>
                    <div class="text-muted small" style="font-size: 10.5px;">Simpan sebagai konsep / draf</div>
                  </div>

                  <div
                    class="form-check p-2 rounded-2 flex-fill border cursor-pointer"
                    :class="syncInvoiceStatus === 'Terkirim' ? 'border-primary bg-primary bg-opacity-10' : 'border-light'"
                    @click="syncInvoiceStatus = 'Terkirim'"
                  >
                    <input class="form-check-input ms-0 me-2" type="radio" v-model="syncInvoiceStatus" value="Terkirim" id="statusSentRadio" />
                    <label class="form-check-label fw-semibold text-dark small cursor-pointer" for="statusSentRadio">
                      Sudah Dikirim
                    </label>
                    <div class="text-muted small" style="font-size: 10.5px;">Tandai telah dikirimkan ke klien</div>
                  </div>
                </div>
              </div>

              <!-- Notes / Terms -->
              <div class="mb-0">
                <label class="form-label small fw-bold text-dark mb-1">Catatan Khusus / Terms Pembayaran (Opsional)</label>
                <textarea
                  v-model="customNotes"
                  class="form-control"
                  rows="2"
                  placeholder="Contoh: Termasuk domain 1 tahun, pembayaran DP 50% di awal pengerjaan..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Right Sub-panel: Kalkulasi, Diskon, Pajak & Metode Pembayaran -->
          <div class="col-lg-6">
            <div class="p-4 rounded-4 bg-light border h-100 d-flex flex-column justify-content-between">
              <div>
                <h6 class="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i class="bi bi-calculator text-primary"></i>
                  <span>Perhitungan Total & Pembayaran</span>
                </h6>

                <!-- Financial Calculation Breakdown -->
                <div class="bg-white rounded-3 p-3 border mb-3">
                  <div class="d-flex justify-content-between align-items-center py-1 text-muted small">
                    <span>Subtotal ({{ totalCartItemsCount }} Item):</span>
                    <span class="fw-bold text-dark">{{ formatCurrency(subtotal) }}</span>
                  </div>

                  <!-- Discount Input Row -->
                  <div class="d-flex justify-content-between align-items-center py-1.5 border-top border-light">
                    <span class="text-muted small">Diskon / Potongan:</span>
                    <div class="d-flex align-items-center gap-2" style="max-width: 220px;">
                      <div class="input-group input-group-sm">
                        <span class="input-group-text bg-light text-muted">Rp</span>
                        <input
                          v-model.number="discountAmount"
                          type="number"
                          min="0"
                          step="10000"
                          class="form-control text-end"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Tax Selector Row -->
                  <div class="d-flex justify-content-between align-items-center py-1.5 border-top border-light">
                    <span class="text-muted small">Pajak PPN:</span>
                    <div class="d-flex align-items-center gap-2" style="max-width: 220px;">
                      <select v-model.number="taxPercent" class="form-select form-select-sm text-end">
                        <option :value="0">Tanpa Pajak (0%)</option>
                        <option :value="11">PPN 11%</option>
                        <option :value="12">PPN 12%</option>
                      </select>
                    </div>
                  </div>

                  <div v-if="taxPercent > 0" class="d-flex justify-content-between align-items-center py-1 text-muted small">
                    <span>Nominal Pajak ({{ taxPercent }}%):</span>
                    <span class="text-dark">{{ formatCurrency(taxAmount) }}</span>
                  </div>

                  <!-- Grand Total Display -->
                  <div class="d-flex justify-content-between align-items-baseline pt-2 mt-1 border-top">
                    <span class="fw-bold text-dark fs-6">Total Tagihan:</span>
                    <span class="fw-extrabold text-primary display-6 mb-0">{{ formatCurrency(grandTotal) }}</span>
                  </div>
                </div>

                <!-- Payment Method Selector -->
                <div class="mb-3">
                  <label class="form-label small fw-bold text-dark mb-1.5">Metode Pembayaran</label>
                  <div class="d-flex flex-wrap gap-2">
                    <button
                      v-for="method in paymentMethods"
                      :key="method.id"
                      type="button"
                      class="btn btn-sm rounded-pill px-3 py-1.5 fw-semibold transition-all d-flex align-items-center gap-1.5"
                      :class="selectedPaymentMethod === method.id ? 'btn-primary shadow-xs' : 'btn-outline-secondary bg-white'"
                      @click="selectedPaymentMethod = method.id"
                    >
                      <i :class="method.icon"></i>
                      <span>{{ method.name }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Main Checkout & Sync Actions Bar -->
              <div class="d-flex flex-column gap-2 pt-2 border-top">
                <button
                  class="btn btn-primary rounded-pill py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm hover-elevate"
                  @click="syncAndSaveInvoice"
                >
                  <i class="bi bi-arrow-repeat fs-5"></i>
                  <span>Sinkronkan ke Invoice (Faktur Resmi)</span>
                </button>

                <div class="d-flex gap-2">
                  <button
                    class="btn btn-success rounded-pill py-2 fw-semibold flex-fill d-flex align-items-center justify-content-center gap-1.5"
                    @click="sendToWhatsapp"
                  >
                    <i class="bi bi-whatsapp"></i>
                    <span>Kirim ke WhatsApp</span>
                  </button>

                  <button
                    class="btn btn-outline-primary rounded-pill py-2 fw-semibold flex-fill d-flex align-items-center justify-content-center gap-1.5"
                    @click="printReceipt"
                  >
                    <i class="bi bi-printer"></i>
                    <span>Cetak Struk</span>
                  </button>

                  <button
                    class="btn btn-outline-secondary rounded-pill py-2 fw-semibold px-3"
                    @click="copyProposalText"
                    title="Salin Rincian ke Clipboard"
                  >
                    <i class="bi bi-clipboard-check"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3 (BOTTOM STACK): RIWAYAT INVOICE YANG DISINKRONKAN DARI POS -->
    <section class="card border-0 rounded-4 shadow-sm p-4 bg-surface">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3 pb-2 border-bottom">
        <div class="d-flex align-items-center gap-2">
          <div class="m3-icon-badge bg-purple-600 text-white">
            <i class="bi bi-receipt-cutoff"></i>
          </div>
          <div>
            <div class="d-flex align-items-center gap-2">
              <h5 class="fw-bold mb-0 text-dark">Invoice yang Dibuat dari POS</h5>
              <span class="badge rounded-pill bg-purple-100 text-purple-800 border border-purple-200 fw-bold px-2.5 py-1">
                {{ posSyncedInvoices.length }} Terhubung
              </span>
            </div>
            <span class="small text-muted">Semua invoice dari kasir POS ini otomatis tersimpan dan dapat diedit sepenuhnya di menu Invoice</span>
          </div>
        </div>

        <router-link to="/invoice" class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1">
          <span>Buka Semua Invoice Lengkap</span>
          <i class="bi bi-arrow-right"></i>
        </router-link>
      </div>

      <!-- Invoices List / Table -->
      <div v-if="posSyncedInvoices.length === 0" class="p-4 text-center rounded-3 bg-light border border-dashed my-2">
        <i class="bi bi-file-earmark-check text-muted fs-2 mb-1 d-block opacity-50"></i>
        <div class="fw-bold text-dark small">Belum ada transaksi POS yang disinkronkan ke Invoice</div>
        <div class="text-muted small">
          Pilih paket pada katalog dan klik tombol <strong>"Sinkronkan ke Invoice"</strong> untuk menyimpan tagihan resmi ke sistem.
        </div>
      </div>

      <div v-else class="table-responsive rounded-3 border">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>No. Invoice</th>
              <th>Asal / Sumber</th>
              <th>Status Dokumen</th>
              <th>Nama Klien</th>
              <th>Tanggal Terbit</th>
              <th>Item Pekerjaan</th>
              <th class="text-end">Total Tagihan</th>
              <th class="text-end pe-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in posSyncedInvoices" :key="inv.id">
              <td class="fw-bold text-primary">{{ inv.invoiceNumber }}</td>
              <td>
                <span class="badge rounded-pill bg-purple-100 text-purple-800 border border-purple-200 fw-bold px-2.5 py-1 d-inline-flex align-items-center gap-1">
                  <i class="bi bi-shop"></i> POS
                </span>
              </td>
              <td>
                <span
                  class="badge rounded-pill fw-semibold px-2.5 py-1"
                  :class="getInvoiceStatusBadgeClass(inv.status)"
                >
                  <i :class="getInvoiceStatusIcon(inv.status)"></i>
                  {{ formatInvoiceStatusLabel(inv.status) }}
                </span>
              </td>
              <td class="fw-semibold text-dark">{{ inv.clientName || 'Klien Umum' }}</td>
              <td class="text-muted small">{{ formatDate(inv.issueDate) }}</td>
              <td class="small text-muted">{{ (inv.items || []).length }} paket layanan</td>
              <td class="text-end fw-bold text-success">{{ formatCurrency(calcInvoiceTotal(inv)) }}</td>
              <td class="text-end pe-3">
                <button
                  class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-semibold me-1"
                  @click="openInInvoiceEditor(inv.id)"
                >
                  <i class="bi bi-pencil-square me-1"></i> Edit di Invoice
                </button>
                <button
                  class="btn btn-sm btn-light text-danger rounded-circle p-1.5"
                  @click="deleteSyncedInvoice(inv.id)"
                  title="Hapus Invoice Ini"
                >
                  <i class="bi bi-trash3"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- MODAL TAMBAH / EDIT MENU PAKET LAYANAN -->
    <div
      v-if="showModal"
      class="m3-modal-backdrop d-flex align-items-center justify-content-center p-3"
      @click.self="closeModal"
    >
      <div class="card border-0 rounded-4 shadow-xl p-4 m3-modal-card bg-white" style="max-width: 620px; width: 100%;" data-aos="zoom-in">
        <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <div class="d-flex align-items-center gap-2">
            <div class="m3-icon-badge bg-primary text-white" style="width: 36px; height: 36px;">
              <i :class="isEditMode ? 'bi bi-pencil-square' : 'bi bi-plus-lg'"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-0 text-dark">{{ isEditMode ? 'Edit Paket Layanan' : 'Tambah Menu / Paket Layanan Baru' }}</h5>
              <span class="text-muted small">Kelola data paket siap jual yang dapat terus berulang</span>
            </div>
          </div>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <form @submit.prevent="saveProduct">
          <div class="mb-3">
            <label class="form-label small fw-bold text-dark mb-1">Nama Layanan / Proyek <span class="text-danger">*</span></label>
            <input
              v-model="form.title"
              type="text"
              class="form-control"
              placeholder="Contoh: Pembuatan Website E-Commerce Profesional"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-dark mb-1">Deskripsi Ringkas Paket <span class="text-danger">*</span></label>
            <textarea
              v-model="form.description"
              class="form-control"
              rows="2"
              placeholder="Jelaskan ringkasan apa yang diperoleh klien dari paket ini..."
              required
            ></textarea>
          </div>

          <div class="row g-2 mb-3">
            <div class="col-md-6">
              <label class="form-label small fw-bold text-dark mb-1">Kategori Layanan <span class="text-danger">*</span></label>
              <input
                v-model="form.category"
                type="text"
                list="categoryPresetList"
                class="form-control"
                placeholder="Ketik atau pilih kategori"
                required
              />
              <datalist id="categoryPresetList">
                <option value="Web Development" />
                <option value="UI/UX Design" />
                <option value="Mobile Apps" />
                <option value="Consulting" />
                <option value="Maintenance & Support" />
                <option value="Content & Copywriting" />
                <option value="SEO & Marketing" />
              </datalist>
            </div>

            <div class="col-md-6">
              <label class="form-label small fw-bold text-dark mb-1">Estimasi Waktu Pengerjaan</label>
              <input
                v-model="form.delivery_time"
                type="text"
                class="form-control"
                placeholder="Contoh: 3-5 Hari Kerja"
              />
            </div>
          </div>

          <div class="row g-2 mb-3">
            <div class="col-md-7">
              <label class="form-label small fw-bold text-dark mb-1">Harga Dasar / Satuan (Rp) <span class="text-danger">*</span></label>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                step="50000"
                class="form-control fw-bold"
                placeholder="1500000"
                required
              />
            </div>

            <div class="col-md-5 d-flex align-items-center pt-md-4">
              <div class="form-check form-switch mt-1">
                <input
                  v-model="form.is_negotiable"
                  class="form-check-input cursor-pointer"
                  type="checkbox"
                  id="isNegoSwitch"
                />
                <label class="form-check-label small fw-bold text-dark cursor-pointer ms-1" for="isNegoSwitch">
                  Bisa Nego?
                </label>
              </div>
            </div>
          </div>

          <!-- Dynamic Features / Deliverables List -->
          <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-1.5">
              <label class="form-label small fw-bold text-dark mb-0">
                <i class="bi bi-stars text-warning me-1"></i>Cakupan / Deliverables Paket
              </label>
              <button type="button" class="btn btn-sm btn-link p-0 text-primary fw-bold text-decoration-none" @click="addFeatureInput">
                + Tambah Poin Fitur
              </button>
            </div>

            <div class="d-flex flex-column gap-2 mb-1" style="max-height: 180px; overflow-y: auto;">
              <div
                v-for="(feat, idx) in form.features"
                :key="idx"
                class="d-flex align-items-center gap-2"
              >
                <span class="badge bg-light text-muted border px-2 py-1 small">#{{ idx + 1 }}</span>
                <input
                  v-model="form.features[idx]"
                  type="text"
                  class="form-control form-control-sm"
                  :placeholder="`Contoh: Desain responsif, garansi revisi...`"
                  required
                />
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger p-1 rounded-circle flex-shrink-0"
                  @click="removeFeatureInput(idx)"
                  :disabled="form.features.length <= 1"
                  title="Hapus poin ini"
                >
                  <i class="bi bi-dash"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="d-flex justify-content-end gap-2 pt-3 border-top">
            <button type="button" class="btn btn-outline-secondary rounded-pill px-4" @click="closeModal">Batal</button>
            <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold shadow-xs">
              {{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan ke Menu' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- TOAST NOTIFICATION -->
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
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { openPrintableDocumentInNewTab } from '../utils/pdfTabOpener';

export default {
  name: 'FreelancePosView',
  setup() {
    const store = useStore();
    const router = useRouter();

    // Data from Vuex
    const products = computed(() => store.getters.getFreelanceProducts || []);
    const allInvoices = computed(() => store.getters.getInvoices || []);

    // Filter pos-synced invoices
    const posSyncedInvoices = computed(() => {
      return allInvoices.value.filter(inv => inv.source === 'pos');
    });

    const syncedInvoicesCount = computed(() => posSyncedInvoices.value.length);

    // Filters & Sorting
    const searchQuery = ref('');
    const selectedCategory = ref('Semua');
    const sortBy = ref('default');

    // POS Cart State: [{ id, title, price, category, features, delivery_time, qty }]
    const cart = ref([]);

    // Customer & Transaction state
    const clientName = ref('');
    const clientPhone = ref('');
    const clientEmail = ref('');
    const customNotes = ref('');
    const discountAmount = ref(0);
    const taxPercent = ref(0);
    const syncInvoiceStatus = ref('Draft'); // 'Draft' (Belum Dikirim) | 'Terkirim' (Sudah Dikirim)
    const selectedPaymentMethod = ref('transfer');

    const paymentMethods = [
      { id: 'transfer', name: 'Transfer Bank', icon: 'bi-bank' },
      { id: 'qris', name: 'QRIS', icon: 'bi-qr-code' },
      { id: 'cash', name: 'Tunai (Cash)', icon: 'bi-cash-stack' },
      { id: 'invoice', name: 'Tempo / Faktur', icon: 'bi-clock-history' }
    ];

    // Toast state
    const toast = ref({ show: false, message: '' });
    const showToast = (msg) => {
      toast.value.message = msg;
      toast.value.show = true;
      setTimeout(() => { toast.value.show = false; }, 3200);
    };

    // Modal state for Add/Edit Menu Items
    const showModal = ref(false);
    const isEditMode = ref(false);
    const editingId = ref(null);
    const fileInput = ref(null);

    const form = ref({
      title: '',
      description: '',
      category: 'Web Development',
      delivery_time: '3-5 Hari Kerja',
      price: 1500000,
      is_negotiable: true,
      features: ['Desain Responsif', 'Optimasi Kecepatan', 'Garansi Revisi 3x']
    });

    // Categories
    const categories = computed(() => {
      const set = new Set(['Semua']);
      products.value.forEach(p => {
        if (p.category) set.add(p.category);
      });
      return Array.from(set);
    });

    const getCategoryCount = (cat) => {
      if (cat === 'Semua') return products.value.length;
      return products.value.filter(p => p.category === cat).length;
    };

    // Filtered & Sorted Products
    const filteredProducts = computed(() => {
      let list = [...products.value];

      if (selectedCategory.value !== 'Semua') {
        list = list.filter(p => p.category === selectedCategory.value);
      }

      if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase().trim();
        list = list.filter(p =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.features && p.features.some(f => f.toLowerCase().includes(q)))
        );
      }

      if (sortBy.value === 'price-low') {
        list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      } else if (sortBy.value === 'price-high') {
        list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      } else if (sortBy.value === 'name') {
        list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      }

      return list;
    });

    // Cart Management
    const getCartItemQty = (productId) => {
      const found = cart.value.find(c => c.id === productId);
      return found ? found.qty : 0;
    };

    const addToCart = (product) => {
      const existing = cart.value.find(c => c.id === product.id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.value.push({
          id: product.id,
          title: product.title,
          price: Number(product.price) || 0,
          category: product.category || 'Umum',
          features: Array.isArray(product.features) ? [...product.features] : [],
          delivery_time: product.delivery_time || '',
          qty: 1
        });
      }
      showToast(`Paket "${product.title}" ditambahkan ke pesanan.`);
    };

    const incrementCart = (productId) => {
      const existing = cart.value.find(c => c.id === productId);
      if (existing) existing.qty += 1;
    };

    const decrementCart = (productId) => {
      const existing = cart.value.find(c => c.id === productId);
      if (existing) {
        if (existing.qty > 1) {
          existing.qty -= 1;
        } else {
          removeFromCart(productId);
        }
      }
    };

    const removeFromCart = (productId) => {
      cart.value = cart.value.filter(c => c.id !== productId);
    };

    const clearCart = () => {
      cart.value = [];
      showToast('Keranjang pesanan dikosongkan.');
    };

    // Financial Computations
    const totalCartItemsCount = computed(() => {
      return cart.value.reduce((sum, item) => sum + item.qty, 0);
    });

    const subtotal = computed(() => {
      return cart.value.reduce((sum, item) => sum + (item.price * item.qty), 0);
    });

    const taxAmount = computed(() => {
      return (subtotal.value * Number(taxPercent.value || 0)) / 100;
    });

    const grandTotal = computed(() => {
      const afterDiscount = Math.max(0, subtotal.value - Number(discountAmount.value || 0));
      return afterDiscount + taxAmount.value;
    });

    // Modal Operations: Add / Edit Product
    const openAddModal = () => {
      isEditMode.value = false;
      editingId.value = null;
      form.value = {
        title: '',
        description: '',
        category: 'Web Development',
        delivery_time: '3-5 Hari Kerja',
        price: 1500000,
        is_negotiable: true,
        features: ['Desain Responsif', 'Optimasi Kecepatan', 'Garansi Revisi 3x']
      };
      showModal.value = true;
    };

    const openEditModal = (prod) => {
      isEditMode.value = true;
      editingId.value = prod.id;
      form.value = {
        title: prod.title || '',
        description: prod.description || '',
        category: prod.category || 'Web Development',
        delivery_time: prod.delivery_time || '',
        price: Number(prod.price) || 0,
        is_negotiable: prod.is_negotiable !== false,
        features: Array.isArray(prod.features) && prod.features.length ? [...prod.features] : ['Fitur utama']
      };
      showModal.value = true;
    };

    const duplicateProduct = (prod) => {
      const duplicated = {
        ...prod,
        id: undefined,
        title: `${prod.title} (Salinan)`,
        features: Array.isArray(prod.features) ? [...prod.features] : []
      };
      store.dispatch('addFreelanceProduct', duplicated);
      showToast(`Paket "${prod.title}" berhasil diduplikat!`);
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const addFeatureInput = () => {
      form.value.features.push('');
    };

    const removeFeatureInput = (idx) => {
      form.value.features.splice(idx, 1);
    };

    const saveProduct = () => {
      const cleanFeatures = form.value.features.map(f => f.trim()).filter(Boolean);
      const payload = {
        title: form.value.title.trim(),
        description: form.value.description.trim(),
        category: form.value.category.trim() || 'Umum',
        delivery_time: form.value.delivery_time.trim(),
        price: Number(form.value.price) || 0,
        is_negotiable: Boolean(form.value.is_negotiable),
        features: cleanFeatures
      };

      if (isEditMode.value && editingId.value) {
        store.dispatch('updateFreelanceProduct', { ...payload, id: editingId.value });
        showToast('Perubahan paket berhasil disimpan!');
      } else {
        store.dispatch('addFreelanceProduct', payload);
        showToast('Paket layanan baru berhasil ditambahkan ke katalog!');
      }

      closeModal();
    };

    const confirmDelete = (id) => {
      Swal.fire({
        title: 'Hapus Paket Ini?',
        text: 'Layanan ini akan dihapus dari katalog POS Anda.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('deleteFreelanceProduct', id);
          removeFromCart(id);
          showToast('Paket layanan dihapus.');
        }
      });
    };

    // SYNC TO INVOICE ACTION
    const syncAndSaveInvoice = () => {
      if (cart.value.length === 0) {
        Swal.fire('Keranjang Kosong', 'Pilih minimal satu paket layanan untuk membuat invoice.', 'info');
        return;
      }

      if (!clientName.value.trim()) {
        Swal.fire('Nama Klien Wajib', 'Masukkan nama klien atau perusahaan terlebih dahulu.', 'warning');
        return;
      }

      const generatedInvNumber = 'INV-POS-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));
      const todayStr = new Date().toISOString().split('T')[0];
      const dueDateStr = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

      // Map cart items into Invoice items format
      const invoiceItems = cart.value.map(item => ({
        nama: `${item.title} (${item.category})`,
        quantity: item.qty,
        biaya: item.price
      }));

      const newInvoicePayload = {
        invoiceNumber: generatedInvNumber,
        issueDate: todayStr,
        dueDate: dueDateStr,
        clientName: clientName.value.trim(),
        clientEmail: clientEmail.value.trim() || '',
        clientPhone: clientPhone.value.trim() || '',
        currency: 'IDR',
        source: 'pos', // FIXED SOURCE BADGE: 'pos'
        status: syncInvoiceStatus.value, // 'Draft' (Belum Dikirim) | 'Terkirim' (Sudah Dikirim)
        items: invoiceItems,
        taxPercent: Number(taxPercent.value || 0),
        discount: Number(discountAmount.value || 0),
        notes: customNotes.value.trim() || 'Paket layanan dibuat melalui sistem POS Kasir Freelance. Terima kasih atas kerja sama Anda.',
        logoType: 'kafeinarts',
        logoOutlineMode: 'auto',
        logoSize: 58,
        paperTheme: 'light'
      };

      store.dispatch('addInvoice', newInvoicePayload);

      Swal.fire({
        title: '✅ Berhasil Disinkronkan ke Invoice!',
        html: `
          <div class="text-start small">
            <p class="mb-1"><strong>No. Invoice:</strong> <span class="text-primary font-monospace">${generatedInvNumber}</span></p>
            <p class="mb-1"><strong>Klien:</strong> ${clientName.value.trim()}</p>
            <p class="mb-1"><strong>Status:</strong> <span class="badge ${syncInvoiceStatus.value === 'Draft' ? 'bg-warning text-dark' : 'bg-info text-dark'}">${syncInvoiceStatus.value === 'Draft' ? 'Belum Dikirim (Draft)' : 'Sudah Dikirim'}</span></p>
            <p class="mb-0"><strong>Total Tagihan:</strong> <span class="text-success fw-bold">${formatCurrency(grandTotal.value)}</span></p>
          </div>
        `,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: '<i class="bi bi-receipt-cutoff me-1"></i> Buka Halaman Invoice',
        cancelButtonText: 'Tetap di Kasir POS',
        confirmButtonColor: '#2563eb'
      }).then((res) => {
        if (res.isConfirmed) {
          router.push('/invoice');
        }
      });
    };

    const openInInvoiceEditor = (invoiceId) => {
      router.push(`/invoice?id=${invoiceId}`);
    };

    const deleteSyncedInvoice = (invoiceId) => {
      Swal.fire({
        title: 'Hapus Invoice?',
        text: 'Invoice ini akan dihapus dari riwayat sistem faktur.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('deleteInvoice', invoiceId);
          showToast('Invoice dari POS dihapus.');
        }
      });
    };

    // WHATSAPP PROPOSAL MESSAGE GENERATOR
    const generateProposalMessage = () => {
      const recipient = clientName.value.trim() ? `Kepada Yth: *${clientName.value.trim()}*\n` : '';
      let msg = `Halo, salam hangat! 🚀\n${recipient}Berikut adalah rincian tagihan & penawaran paket layanan dari kasir kami:\n\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `📋 *RINCIAN PAKET LAYANAN:*\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

      cart.value.forEach((item, index) => {
        msg += `*${index + 1}. ${item.title}*\n`;
        msg += `   • Kategori: ${item.category}\n`;
        msg += `   • Kuantitas: ${item.qty}x @ ${formatCurrency(item.price)}\n`;
        msg += `   • Subtotal: *${formatCurrency(item.price * item.qty)}*\n`;
        if (item.features && item.features.length) {
          msg += `   • Cakupan: ${item.features.slice(0, 3).join(', ')}\n`;
        }
        msg += `\n`;
      });

      msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `Subtotal: ${formatCurrency(subtotal.value)}\n`;
      if (discountAmount.value > 0) {
        msg += `Diskon / Potongan: -${formatCurrency(discountAmount.value)}\n`;
      }
      if (taxPercent.value > 0) {
        msg += `Pajak PPN (${taxPercent.value}%): +${formatCurrency(taxAmount.value)}\n`;
      }
      msg += `💵 *TOTAL TAGIHAN:* *${formatCurrency(grandTotal.value)}*\n`;
      msg += `💳 *Metode Pembayaran:* ${paymentMethods.find(m => m.id === selectedPaymentMethod.value)?.name || 'Transfer'}\n`;
      
      if (customNotes.value.trim()) {
        msg += `\n📌 *Catatan Khusus:*\n${customNotes.value.trim()}\n`;
      }
      msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
      msg += `Status Dokumen: *${syncInvoiceStatus.value === 'Draft' ? 'Draf Penawaran (Belum Final)' : 'Faktur Resmi Telah Diterbitkan'}*\n`;
      msg += `Silakan hubungi kembali apabila membutuhkan penyesuaian. Terima kasih! 🙏`;

      return msg;
    };

    const sendToWhatsapp = () => {
      if (cart.value.length === 0) {
        Swal.fire('Keranjang Kosong', 'Pilih paket layanan terlebih dahulu.', 'info');
        return;
      }

      const rawPhone = (clientPhone.value || '').replace(/\D/g, '');
      let formattedPhone = rawPhone;
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.slice(1);
      } else if (!formattedPhone.startsWith('62') && formattedPhone.length > 5) {
        formattedPhone = '62' + formattedPhone;
      }

      const text = encodeURIComponent(generateProposalMessage());
      const url = formattedPhone
        ? `https://wa.me/${formattedPhone}?text=${text}`
        : `https://wa.me/?text=${text}`;

      window.open(url, '_blank');
    };

    const copyProposalText = async () => {
      if (cart.value.length === 0) return;
      const text = generateProposalMessage();
      try {
        await navigator.clipboard.writeText(text);
        showToast('Rincian penawaran disalin ke clipboard!');
      } catch (e) {
        console.error(e);
      }
    };

    // Printable Receipt Generator
    const printReceipt = () => {
      if (cart.value.length === 0) {
        Swal.fire('Keranjang Kosong', 'Pilih paket layanan terlebih dahulu.', 'info');
        return;
      }

      const receiptHtml = `
        <div style="max-width: 480px; margin: 0 auto; font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #1e293b; padding: 24px;">
          <div style="text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 16px; margin-bottom: 16px;">
            <h2 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 800; color: #0f172a;">BUKTI TRANSAKSI KASIR POS</h2>
            <p style="margin: 0; font-size: 12px; color: #64748b;">Paket Layanan Freelance & Proyek Profesional</p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8;">Tanggal: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
          </div>

          <div style="margin-bottom: 16px; font-size: 12px;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #64748b; width: 35%;">Klien / Bisnis</td>
                <td style="font-weight: bold; color: #0f172a;">: ${clientName.value.trim() || 'Klien Umum'}</td>
              </tr>
              <tr>
                <td style="color: #64748b;">Kontak</td>
                <td>: ${clientPhone.value.trim() ? '+62 ' + clientPhone.value.trim() : '-'}</td>
              </tr>
              <tr>
                <td style="color: #64748b;">Metode Bayar</td>
                <td>: ${paymentMethods.find(m => m.id === selectedPaymentMethod.value)?.name || 'Transfer Bank'}</td>
              </tr>
              <tr>
                <td style="color: #64748b;">Status Faktur</td>
                <td style="font-weight: bold;">: ${syncInvoiceStatus.value === 'Draft' ? 'Belum Dikirim (Draft)' : 'Sudah Dikirim (Terkirim)'}</td>
              </tr>
            </table>
          </div>

          <div style="border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 12px 0; margin-bottom: 16px;">
            <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 1px solid #f1f5f9; color: #64748b;">
                  <th style="text-align: left; padding: 4px 0;">Item Paket</th>
                  <th style="text-align: center; padding: 4px 8px;">Qty</th>
                  <th style="text-align: right; padding: 4px 0;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${cart.value.map(c => `
                  <tr>
                    <td style="padding: 6px 0;">
                      <div style="font-weight: 600; color: #0f172a;">${c.title}</div>
                      <div style="font-size: 10.5px; color: #94a3b8;">${c.category}</div>
                    </td>
                    <td style="text-align: center; padding: 6px 8px; color: #475569;">${c.qty}x</td>
                    <td style="text-align: right; padding: 6px 0; font-weight: 600;">${formatCurrency(c.price * c.qty)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="font-size: 12px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #64748b;">
              <span>Subtotal:</span>
              <span>${formatCurrency(subtotal.value)}</span>
            </div>
            ${discountAmount.value > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #dc2626;">
                <span>Diskon:</span>
                <span>-${formatCurrency(discountAmount.value)}</span>
              </div>
            ` : ''}
            ${taxPercent.value > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #64748b;">
                <span>PPN (${taxPercent.value}%):</span>
                <span>+${formatCurrency(taxAmount.value)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; margin-top: 8px; padding-top: 8px; border-top: 2px dashed #cbd5e1; font-weight: 800; font-size: 15px; color: #2563eb;">
              <span>TOTAL:</span>
              <span>${formatCurrency(grandTotal.value)}</span>
            </div>
          </div>

          ${customNotes.value.trim() ? `
            <div style="background: #f8fafc; border-radius: 8px; padding: 10px; font-size: 11px; color: #64748b; margin-bottom: 16px;">
              <strong>Catatan:</strong> ${customNotes.value.trim()}
            </div>
          ` : ''}

          <div style="text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px dashed #e2e8f0; padding-top: 16px;">
            <p style="margin: 0 0 4px 0;">Terima kasih atas kepercayaan dan kerja sama Anda!</p>
            <p style="margin: 0;">Dokumen ini merupakan tanda bukti transaksi kasir POS yang sah.</p>
          </div>
        </div>
      `;

      openPrintableDocumentInNewTab({
        title: `Struk POS - ${clientName.value || 'Transaksi'}`,
        rawHtml: receiptHtml,
        autoPrint: true,
        paperSize: 'a5'
      });
    };

    // JSON Export & Import
    const exportCatalogJson = () => {
      const dataStr = JSON.stringify(products.value, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `katalog_pos_paket_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Data katalog berhasil diexport.');
    };

    const triggerImport = () => {
      if (fileInput.value) fileInput.value.click();
    };

    const onFileSelected = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            store.dispatch('setFreelanceProducts', parsed);
            showToast('Katalog paket berhasil diimpor!');
          }
        } catch (err) {
          Swal.fire('Format Gagal', 'Format berkas JSON tidak valid.', 'error');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    };

    // Formatting & UI helpers
    const formatCurrency = (val) => {
      return 'Rp ' + (Number(val) || 0).toLocaleString('id-ID');
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

    const calcInvoiceTotal = (inv) => {
      if (!inv.items) return 0;
      const sub = inv.items.reduce((s, item) => s + (Number(item.biaya || 0) * Number(item.quantity || 1)), 0);
      const tax = (sub * Number(inv.taxPercent || 0)) / 100;
      return Math.max(0, sub + tax - Number(inv.discount || 0));
    };

    const getPackageIcon = (prod) => {
      const cat = (prod.category || '').toLowerCase();
      if (cat.includes('web')) return 'bi-laptop';
      if (cat.includes('ui') || cat.includes('ux') || cat.includes('design')) return 'bi-palette';
      if (cat.includes('mobile') || cat.includes('app')) return 'bi-phone';
      if (cat.includes('consult')) return 'bi-chat-heart';
      if (cat.includes('seo') || cat.includes('market')) return 'bi-graph-up-arrow';
      if (cat.includes('maintenance')) return 'bi-tools';
      return 'bi-layers';
    };

    const getCategoryBadgeClass = (category) => {
      const cat = (category || '').toLowerCase();
      if (cat.includes('web')) return 'bg-primary-subtle text-primary border border-primary-subtle';
      if (cat.includes('design') || cat.includes('ui')) return 'bg-purple-100 text-purple-800 border border-purple-200';
      if (cat.includes('consult')) return 'bg-amber-100 text-amber-800 border border-amber-200';
      if (cat.includes('mobile')) return 'bg-cyan-100 text-cyan-800 border border-cyan-200';
      return 'bg-secondary-subtle text-secondary border border-secondary-subtle';
    };

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

    return {
      products,
      posSyncedInvoices,
      syncedInvoicesCount,
      searchQuery,
      selectedCategory,
      sortBy,
      categories,
      getCategoryCount,
      filteredProducts,
      cart,
      totalCartItemsCount,
      subtotal,
      taxPercent,
      taxAmount,
      discountAmount,
      grandTotal,
      clientName,
      clientPhone,
      clientEmail,
      customNotes,
      syncInvoiceStatus,
      selectedPaymentMethod,
      paymentMethods,
      getCartItemQty,
      addToCart,
      incrementCart,
      decrementCart,
      removeFromCart,
      clearCart,
      showModal,
      isEditMode,
      form,
      fileInput,
      openAddModal,
      openEditModal,
      duplicateProduct,
      closeModal,
      addFeatureInput,
      removeFeatureInput,
      saveProduct,
      confirmDelete,
      syncAndSaveInvoice,
      openInInvoiceEditor,
      deleteSyncedInvoice,
      sendToWhatsapp,
      copyProposalText,
      printReceipt,
      exportCatalogJson,
      triggerImport,
      onFileSelected,
      toast,
      formatCurrency,
      formatDate,
      calcInvoiceTotal,
      getPackageIcon,
      getCategoryBadgeClass,
      getInvoiceStatusBadgeClass,
      getInvoiceStatusIcon,
      formatInvoiceStatusLabel
    };
  }
};
</script>

<style scoped>
.pos-container {
  max-width: 1480px;
  margin: 0 auto;
}

.pos-hero-card {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%);
}

.text-white-70 {
  color: rgba(255, 255, 255, 0.72);
}

.pos-pulse-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.35);
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
  70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.bg-surface {
  background-color: #ffffff;
}

.m3-icon-badge {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.m3-product-card {
  border-color: #e2e8f0 !important;
  background: #ffffff;
  transition: transform 0.18s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.18s cubic-bezier(0.2, 0, 0, 1), border-color 0.18s ease;
}

.m3-product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
}

.card-active-selected {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 1.5px rgba(37, 99, 235, 0.3);
  background: rgba(37, 99, 235, 0.015);
}

.hover-elevate {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.hover-elevate:hover {
  transform: translateY(-1.5px);
}

.cursor-pointer {
  cursor: pointer;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category-pill-strip::-webkit-scrollbar {
  height: 4px;
}

.category-pill-strip::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

/* Material 3 Modal Backdrop & Dialog */
.m3-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1060;
}

.m3-modal-card {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.bg-purple-600 {
  background-color: #9333ea;
}

.bg-purple-100 {
  background-color: #f3e8ff;
}

.text-purple-800 {
  color: #6b21a8;
}

.border-purple-200 {
  border-color: #e9d5ff;
}

.bg-emerald-500 {
  background-color: #10b981;
}

.bg-emerald-600 {
  background-color: #059669;
}

.bg-emerald-100 {
  background-color: #d1fae5;
}

.text-emerald-800 {
  color: #065f46;
}

.border-emerald-200 {
  border-color: #a7f3d0;
}
</style>
