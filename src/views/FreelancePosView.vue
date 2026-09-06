<template>
  <div class="container-fluid py-4 freelance-pos-page" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="card border-0 rounded-4 text-white shadow-sm mb-4 p-4 position-relative overflow-hidden pos-header-banner">
      <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 position-relative z-1">
        <div>
          <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span class="badge bg-white text-dark fw-bold px-3 py-1.5 rounded-pill shadow-xs">
              <i class="bi bi-shop-window text-primary me-1"></i> POS & Katalog Freelance
            </span>
            <span class="badge bg-info bg-opacity-75 text-dark fw-bold px-2.5 py-1 rounded-pill">
              WhatsApp Broadcast Ready
            </span>
            <span class="badge bg-warning text-dark fw-bold px-2.5 py-1 rounded-pill">
              {{ products.length }} Layanan Tersedia
            </span>
          </div>
          <h2 class="fw-extrabold display-6 mb-1 text-white">Katalog Proyek & Kasir Penawaran Freelance 💼</h2>
          <p class="mb-0 text-white-50" style="max-width: 780px;">
            Kelola daftar produk, jasa, dan paket proyek siap jual. Pilih item untuk menyusun penawaran dan langsung kirimkan rincian profesional ke WhatsApp klien dalam hitungan detik.
          </p>
        </div>

        <div class="d-flex flex-wrap gap-2 align-items-center">
          <button class="btn btn-light text-primary fw-bold rounded-pill px-3.5 py-2 shadow-xs d-flex align-items-center gap-2" @click="openAddModal">
            <i class="bi bi-plus-circle-fill text-primary fs-5"></i>
            <span>+ Tambah Layanan</span>
          </button>
          <button class="btn btn-outline-light fw-semibold rounded-pill px-3 py-2" @click="exportCatalogJson" title="Cadangkan Data Katalog ke JSON">
            <i class="bi bi-filetype-json text-warning me-1"></i> Export
          </button>
          <button class="btn btn-outline-light fw-semibold rounded-pill px-3 py-2" @click="triggerImport" title="Import Data Katalog dari JSON">
            <i class="bi bi-upload text-info me-1"></i> Import
          </button>
          <input type="file" ref="fileInput" accept=".json" class="d-none" @change="onFileSelected" />
        </div>
      </div>
    </div>

    <!-- Main POS Layout: Left Catalog, Right Cart / WhatsApp Sender -->
    <div class="row g-4">
      <!-- Left Column: Catalog & Filters -->
      <div class="col-lg-7 col-xl-8">
        <!-- Search and Categories Filter Bar -->
        <div class="card border-0 rounded-4 shadow-sm p-3 mb-4 content-card">
          <div class="row g-2 align-items-center mb-3">
            <div class="col-md-7">
              <div class="search-box-input d-flex align-items-center rounded-pill px-3 py-2 border">
                <i class="bi bi-search text-muted me-2"></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="border-0 bg-transparent flex-grow-1 shadow-none outline-none text-main"
                  placeholder="Cari layanan (Web, Figma, SEO, API, Landing Page...)"
                  style="font-size: 14px;"
                />
                <button v-if="searchQuery" @click="searchQuery = ''" class="btn btn-link p-0 text-muted border-0">
                  <i class="bi bi-x-circle-fill"></i>
                </button>
              </div>
            </div>

            <div class="col-md-5 d-flex gap-2">
              <select v-model="sortBy" class="form-select rounded-pill text-main">
                <option value="default">Urutan Default</option>
                <option value="price-low">Harga: Terendah ke Tertinggi</option>
                <option value="price-high">Harga: Tertinggi ke Terendah</option>
                <option value="name">Nama (A - Z)</option>
              </select>
            </div>
          </div>

          <!-- Category Pills -->
          <div class="d-flex align-items-center gap-1.5 overflow-x-auto pb-1 category-scroll">
            <button
              v-for="cat in categories"
              :key="cat"
              class="btn btn-sm rounded-pill px-3 py-1.5 text-nowrap fw-semibold transition-all"
              :class="selectedCategory === cat ? 'btn-primary shadow-xs' : 'btn-outline-secondary'"
              @click="selectedCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Products / Services Grid -->
        <div v-if="filteredProducts.length === 0" class="card border-0 rounded-4 shadow-sm p-5 text-center content-card">
          <i class="bi bi-inbox fs-1 text-muted mb-2 d-block opacity-50"></i>
          <h5 class="fw-bold text-main">Tidak ada layanan ditemukan</h5>
          <p class="text-sub small mb-3">Cobalah mencari dengan kata kunci lain atau tambahkan layanan baru ke katalog Anda.</p>
          <button class="btn btn-primary rounded-pill px-4 py-2 fw-bold mx-auto" @click="openAddModal">
            <i class="bi bi-plus-lg me-1"></i> Tambah Layanan Sekarang
          </button>
        </div>

        <div v-else class="row g-3">
          <div
            v-for="prod in filteredProducts"
            :key="prod.id"
            class="col-md-6 col-xl-6"
          >
            <div
              class="card h-100 border-0 rounded-4 shadow-sm p-3.5 product-card transition-all position-relative"
              :class="{ 'border-selected shadow-md': isProductSelected(prod.id) }"
              @click="toggleSelectProduct(prod)"
            >
              <!-- Selected Checkmark Badge -->
              <div class="d-flex align-items-start justify-content-between gap-2 mb-2.5">
                <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1 small fw-bold">
                  {{ prod.category || 'Layanan Umum' }}
                </span>
                <div class="d-flex align-items-center gap-1">
                  <span
                    class="badge rounded-pill px-2 py-0.5 small fw-bold"
                    :class="prod.is_negotiable ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-secondary-subtle text-secondary border border-secondary-subtle'"
                  >
                    <i :class="prod.is_negotiable ? 'bi bi-check-circle-fill me-1' : 'bi bi-lock-fill me-1'"></i>
                    {{ prod.is_negotiable ? 'Bisa Nego' : 'Harga Pas' }}
                  </span>
                  <!-- Selection Indicator -->
                  <div
                    class="selection-circle rounded-circle d-flex align-items-center justify-content-center"
                    :class="isProductSelected(prod.id) ? 'bg-primary text-white' : 'bg-light border text-transparent'"
                    style="width: 26px; height: 26px;"
                  >
                    <i class="bi bi-check-lg fw-bold" style="font-size: 14px;"></i>
                  </div>
                </div>
              </div>

              <!-- Title & Description -->
              <h5 class="fw-bold text-main mb-1.5 line-clamp-1" :title="prod.title">{{ prod.title }}</h5>
              <p class="text-sub small mb-3 line-clamp-2" :title="prod.description">{{ prod.description }}</p>

              <!-- Features List -->
              <div class="features-list-box mb-3 p-2.5 rounded-3 bg-light-subtle border border-theme">
                <div class="small fw-bold text-sub mb-1.5 d-flex align-items-center gap-1">
                  <i class="bi bi-stars text-warning"></i> Termasuk dalam paket:
                </div>
                <ul class="list-unstyled mb-0 small text-muted">
                  <li v-for="(feat, fIdx) in (prod.features || []).slice(0, 3)" :key="fIdx" class="d-flex align-items-baseline gap-1.5 mb-1 text-truncate">
                    <i class="bi bi-check2 text-success fw-bold flex-shrink-0"></i>
                    <span class="text-truncate">{{ feat }}</span>
                  </li>
                  <li v-if="(prod.features || []).length > 3" class="text-primary fw-semibold" style="font-size: 11px;">
                    +{{ (prod.features || []).length - 3 }} fitur tambahan lainnya
                  </li>
                </ul>
              </div>

              <!-- Footer: Price & Delivery & Quick Actions -->
              <div class="mt-auto pt-2 border-top border-theme d-flex align-items-center justify-content-between">
                <div>
                  <div class="small text-sub" style="font-size: 11px;">Estimasi Biaya</div>
                  <div class="fw-extrabold text-primary fs-5">{{ formatCurrency(prod.price) }}</div>
                  <div v-if="prod.delivery_time" class="small text-muted" style="font-size: 11px;">
                    <i class="bi bi-stopwatch me-1"></i>{{ prod.delivery_time }}
                  </div>
                </div>

                <div class="d-flex align-items-center gap-1" @click.stop>
                  <button class="btn btn-sm btn-outline-secondary rounded-circle p-1.5 icon-btn" @click="openEditModal(prod)" title="Edit Layanan">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger rounded-circle p-1.5 icon-btn" @click="confirmDelete(prod.id)" title="Hapus Layanan">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Freelance POS Order & WhatsApp Proposal Builder -->
      <div class="col-lg-5 col-xl-4">
        <div class="card border-0 rounded-4 shadow-sm p-3.5 content-card sticky-top" style="top: 80px; z-index: 10;">
          <div class="d-flex align-items-center justify-content-between mb-3 pb-2.5 border-bottom border-theme">
            <div class="d-flex align-items-center gap-2">
              <div class="m3-avatar-circle bg-success text-white" style="width: 36px; height: 36px;">
                <i class="bi bi-whatsapp fs-5"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0 text-main">Keranjang Penawaran</h5>
                <small class="text-sub">Kirim proposal instan ke klien</small>
              </div>
            </div>
            <span class="badge rounded-pill bg-primary px-2.5 py-1 fw-bold">
              {{ selectedProducts.length }} Dipilih
            </span>
          </div>

          <!-- Empty State when nothing is selected -->
          <div v-if="selectedProducts.length === 0" class="text-center py-4 px-2 my-2 rounded-3 bg-light-subtle border border-dashed">
            <i class="bi bi-hand-index-thumb fs-2 text-muted mb-1 d-block"></i>
            <div class="fw-bold text-main small">Belum ada layanan yang dipilih</div>
            <div class="text-sub small">Klik kartu layanan di sebelah kiri untuk memasukkannya ke draf penawaran klien.</div>
          </div>

          <!-- Selected Products List -->
          <div v-else class="selected-items-wrap mb-3 pe-1" style="max-height: 240px; overflow-y: auto;">
            <div
              v-for="item in selectedProducts"
              :key="item.id"
              class="selected-item-row p-2.5 rounded-3 mb-2 bg-light-subtle border border-theme d-flex align-items-start justify-content-between gap-2"
            >
              <div class="min-w-0">
                <div class="fw-bold text-main small text-truncate">{{ item.title }}</div>
                <div class="text-primary fw-bold small">{{ formatCurrency(item.price) }}</div>
                <div class="small text-muted" style="font-size: 11px;">
                  {{ item.is_negotiable ? '🟢 Nego' : '⚪ Fixed' }} • {{ (item.features || []).length }} Fitur
                </div>
              </div>
              <button class="btn btn-sm btn-link text-danger p-0 ms-auto" @click="removeSelected(item.id)" title="Hapus dari penawaran">
                <i class="bi bi-x-circle fs-6"></i>
              </button>
            </div>
          </div>

          <!-- Total Calculation -->
          <div class="p-3 rounded-3 mb-3 bg-primary-subtle border border-primary-subtle">
            <div class="d-flex justify-content-between align-items-center mb-1 text-sub small">
              <span>Total Estimasi Proyek:</span>
              <span>{{ selectedProducts.length }} Layanan</span>
            </div>
            <div class="d-flex justify-content-between align-items-baseline">
              <span class="fw-bold text-dark fs-6">Total Biaya:</span>
              <span class="fw-extrabold text-primary fs-4">{{ formatCurrency(totalSelectedPrice) }}</span>
            </div>
            <div v-if="hasNegotiableItem" class="small text-success fw-semibold mt-1">
              <i class="bi bi-info-circle me-1"></i>Tersedia paket yang dapat dinegosiasikan sesuai budget klien.
            </div>
          </div>

          <!-- Client & WhatsApp Form Details -->
          <div class="mb-3">
            <label class="form-label small fw-bold text-sub mb-1">
              <i class="bi bi-telephone-outbound text-success me-1"></i>Nomor WhatsApp Klien
            </label>
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-light text-muted fw-bold">+62</span>
              <input
                v-model="clientPhone"
                type="tel"
                class="form-control"
                placeholder="Contoh: 81234567890"
              />
            </div>
            <small class="text-muted" style="font-size: 10px;">Ketik tanpa angka 0 atau +62 di depan</small>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-sub mb-1">Nama Klien / Perusahaan</label>
            <input
              v-model="clientName"
              type="text"
              class="form-control form-control-sm"
              placeholder="Contoh: Bapak Hendra / PT Karya Sukses"
            />
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-sub mb-1">Catatan Khusus / Diskon (Opsional)</label>
            <textarea
              v-model="customNotes"
              class="form-control form-control-sm"
              rows="2"
              placeholder="Contoh: Termasuk domain & hosting 1 tahun gratis..."
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex flex-column gap-2">
            <button
              class="btn btn-success rounded-pill py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
              :disabled="selectedProducts.length === 0"
              @click="sendToWhatsapp"
            >
              <i class="bi bi-whatsapp fs-5"></i>
              <span>Kirim Penawaran ke WhatsApp</span>
            </button>

            <div class="d-flex gap-2">
              <button
                class="btn btn-outline-primary rounded-pill py-2 fw-semibold flex-fill d-flex align-items-center justify-content-center gap-1"
                :disabled="selectedProducts.length === 0"
                @click="copyProposalText"
              >
                <i class="bi bi-clipboard-check"></i> Salin Teks
              </button>
              <button
                class="btn btn-outline-secondary rounded-pill py-2 fw-semibold flex-fill"
                :disabled="selectedProducts.length === 0"
                @click="clearSelection"
              >
                Reset
              </button>
            </div>
          </div>

          <!-- Toast Copy Notification -->
          <div v-if="copiedNotification" class="alert alert-success mt-3 mb-0 py-2 px-3 small rounded-3 d-flex align-items-center gap-2">
            <i class="bi bi-check-circle-fill"></i> Teks penawaran berhasil disalin ke clipboard!
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Tambah / Edit Layanan -->
    <div
      v-if="showModal"
      class="modal-backdrop-custom d-flex align-items-center justify-content-center"
      @click.self="closeModal"
    >
      <div class="modal-dialog-custom card border-0 p-4 rounded-4 shadow-lg content-card" style="max-width: 600px; width: 95%;">
        <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-theme">
          <h5 class="fw-bold mb-0 text-main">{{ isEditMode ? 'Edit Layanan / Produk' : 'Tambah Layanan / Produk Baru' }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <form @submit.prevent="saveProduct">
          <div class="mb-3">
            <label class="form-label small fw-bold text-sub">Nama Layanan / Proyek *</label>
            <input
              v-model="form.title"
              type="text"
              class="form-control"
              placeholder="Contoh: Pembuatan Website E-Commerce Profesional"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-sub">Deskripsi Ringkas *</label>
            <textarea
              v-model="form.description"
              class="form-control"
              rows="2"
              placeholder="Jelaskan ringkasan apa yang didapatkan klien..."
              required
            ></textarea>
          </div>

          <div class="row g-2 mb-3">
            <div class="col-md-6">
              <label class="form-label small fw-bold text-sub">Kategori *</label>
              <input
                v-model="form.category"
                type="text"
                list="categoryList"
                class="form-control"
                placeholder="Web Development / UI UX / dll"
                required
              />
              <datalist id="categoryList">
                <option value="Web Development" />
                <option value="UI/UX Design" />
                <option value="Mobile Apps" />
                <option value="Consulting" />
                <option value="Content & Copywriting" />
                <option value="Maintenance & Support" />
              </datalist>
            </div>

            <div class="col-md-6">
              <label class="form-label small fw-bold text-sub">Estimasi Waktu Pengerjaan</label>
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
              <label class="form-label small fw-bold text-sub">Harga Dasar (Rp) *</label>
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

            <div class="col-md-5 d-flex align-items-center pt-3">
              <div class="form-check form-switch mt-2">
                <input
                  v-model="form.is_negotiable"
                  class="form-check-input"
                  type="checkbox"
                  id="isNegotiableCheck"
                />
                <label class="form-check-label small fw-bold text-main" for="isNegotiableCheck">
                  Bisa Nego?
                </label>
              </div>
            </div>
          </div>

          <!-- Dynamic Features Builder -->
          <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="form-label small fw-bold text-sub mb-0">Fitur-fitur Layanan (Deliverables)</label>
              <button type="button" class="btn btn-sm btn-link p-0 text-primary fw-bold" @click="addFeatureInput">
                + Tambah Poin Fitur
              </button>
            </div>

            <div class="d-flex flex-column gap-2 mb-2">
              <div
                v-for="(feat, idx) in form.features"
                :key="idx"
                class="d-flex align-items-center gap-2"
              >
                <input
                  v-model="form.features[idx]"
                  type="text"
                  class="form-control form-control-sm"
                  :placeholder="`Poin fitur #${idx + 1}`"
                  required
                />
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger p-1 rounded-circle"
                  @click="removeFeatureInput(idx)"
                  :disabled="form.features.length <= 1"
                  title="Hapus poin"
                >
                  <i class="bi bi-dash"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="d-flex justify-content-end gap-2 pt-2 border-top border-theme">
            <button type="button" class="btn btn-outline-secondary rounded-pill px-4" @click="closeModal">Batal</button>
            <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">
              {{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan Layanan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'FreelancePosView',
  setup() {
    const store = useStore();

    // Data from Vuex
    const products = computed(() => store.getters.getFreelanceProducts || []);

    // Filters
    const searchQuery = ref('');
    const selectedCategory = ref('Semua');
    const sortBy = ref('default');

    // POS Selection State
    const selectedProductIds = ref([]);
    const clientPhone = ref('');
    const clientName = ref('');
    const customNotes = ref('');
    const copiedNotification = ref(false);

    // Modal Add / Edit State
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

    // Selection helpers
    const isProductSelected = (id) => selectedProductIds.value.includes(id);

    const toggleSelectProduct = (prod) => {
      const idx = selectedProductIds.value.indexOf(prod.id);
      if (idx === -1) {
        selectedProductIds.value.push(prod.id);
      } else {
        selectedProductIds.value.splice(idx, 1);
      }
    };

    const removeSelected = (id) => {
      selectedProductIds.value = selectedProductIds.value.filter(i => i !== id);
    };

    const clearSelection = () => {
      selectedProductIds.value = [];
    };

    const selectedProducts = computed(() => {
      return products.value.filter(p => selectedProductIds.value.includes(p.id));
    });

    const totalSelectedPrice = computed(() => {
      return selectedProducts.value.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
    });

    const hasNegotiableItem = computed(() => {
      return selectedProducts.value.some(p => p.is_negotiable);
    });

    // WhatsApp Message Generator
    const generateProposalMessage = () => {
      const recipient = clientName.value.trim() ? `Kepada Yth: *${clientName.value.trim()}*\n` : '';
      let msg = `Halo, salam hangat! 🚀\n${recipient}Berikut adalah rincian penawaran paket layanan & proyek yang disiapkan khusus:\n\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `📋 *DAFTAR LAYANAN / PROYEK:*\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

      selectedProducts.value.forEach((item, index) => {
        msg += `*${index + 1}. ${item.title}*\n`;
        msg += `📝 _${item.description}_\n`;
        if (item.delivery_time) msg += `⏱️ Estimasi: ${item.delivery_time}\n`;
        msg += `💰 Biaya: *${formatCurrency(item.price)}* (${item.is_negotiable ? 'Bisa Nego' : 'Harga Pas'})\n`;
        if (item.features && item.features.length) {
          msg += `✨ Fitur & Cakupan:\n`;
          item.features.forEach(f => {
            msg += `   • ${f}\n`;
          });
        }
        msg += `\n`;
      });

      msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `💵 *TOTAL ESTIMASI:* *${formatCurrency(totalSelectedPrice.value)}*\n`;
      if (hasNegotiableItem.value) {
        msg += `ℹ️ _Catatan: Harga masih dapat didiskusikan/dinegosiasikan sesuai kebutuhan skala proyek._\n`;
      }
      if (customNotes.value.trim()) {
        msg += `\n📌 *Catatan Tambahan:*\n${customNotes.value.trim()}\n`;
      }
      msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
      msg += `Silakan hubungi kembali apabila ada bagian yang ingin disesuaikan atau perlu diskusi lebih lanjut. Terima kasih! 🙏`;

      return msg;
    };

    const sendToWhatsapp = () => {
      if (selectedProducts.value.length === 0) return;

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
      const text = generateProposalMessage();
      try {
        await navigator.clipboard.writeText(text);
        copiedNotification.value = true;
        setTimeout(() => {
          copiedNotification.value = false;
        }, 3000);
      } catch (e) {
        console.error('Failed to copy', e);
      }
    };

    // Modal Handlers
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
        features: Array.isArray(prod.features) ? [...prod.features] : ['Fitur utama']
      };
      showModal.value = true;
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
      } else {
        store.dispatch('addFreelanceProduct', payload);
      }

      closeModal();
    };

    const confirmDelete = (id) => {
      if (confirm('Apakah Anda yakin ingin menghapus layanan ini dari katalog?')) {
        store.dispatch('deleteFreelanceProduct', id);
        removeSelected(id);
      }
    };

    // JSON Export & Import
    const exportCatalogJson = () => {
      const dataStr = JSON.stringify(products.value, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `katalog_freelance_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
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
            alert('Katalog freelance berhasil diimpor!');
          }
        } catch (err) {
          alert('Format JSON tidak valid!');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    };

    const formatCurrency = (val) => {
      return 'Rp ' + (Number(val) || 0).toLocaleString('id-ID');
    };

    return {
      products,
      searchQuery,
      selectedCategory,
      categories,
      sortBy,
      filteredProducts,
      selectedProductIds,
      selectedProducts,
      totalSelectedPrice,
      hasNegotiableItem,
      clientPhone,
      clientName,
      customNotes,
      copiedNotification,
      showModal,
      isEditMode,
      form,
      fileInput,
      isProductSelected,
      toggleSelectProduct,
      removeSelected,
      clearSelection,
      openAddModal,
      openEditModal,
      closeModal,
      addFeatureInput,
      removeFeatureInput,
      saveProduct,
      confirmDelete,
      sendToWhatsapp,
      copyProposalText,
      exportCatalogJson,
      triggerImport,
      onFileSelected,
      formatCurrency
    };
  }
};
</script>

<style scoped>
.freelance-pos-page {
  max-width: 1560px;
  margin: 0 auto;
}

.pos-header-banner {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0284c7 100%);
}

.product-card {
  cursor: pointer;
  border: 1.5px solid transparent !important;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
}

.product-card.border-selected {
  border-color: var(--primary-color, #2563eb) !important;
  background-color: rgba(37, 99, 235, 0.02);
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

.category-scroll::-webkit-scrollbar {
  display: none;
}

.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1050;
}
</style>
