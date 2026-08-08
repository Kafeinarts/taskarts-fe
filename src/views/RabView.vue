<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Top Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border no-print">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-primary-subtle text-primary fw-semibold px-3 py-2 rounded-pill">
            <i class="bi bi-building me-1"></i> Kepanitiaan & Event Warga
          </span>
          <span class="badge bg-success text-white fw-bold px-3 py-2 rounded-pill shadow-sm">
            Live Calculations
          </span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">📋 RAB & Kas Kegiatan (17-an / Event)</h2>
        <p class="text-muted mb-0">Kelola Rencana Anggaran Biaya (RAB), pencatatan iuran warga, pengeluaran aktual, dan evaluasi budget secara real-time.</p>
      </div>

      <div class="d-flex flex-wrap gap-2">
        <button class="btn btn-outline-primary px-3 py-2 rounded-3 fw-semibold" @click="triggerLoadSampleData">
          <i class="bi bi-magic me-1"></i> Load Contoh 17 Agustus
        </button>
        <button class="btn btn-outline-secondary px-3 py-2 rounded-3 fw-semibold" @click="printReport">
          <i class="bi bi-printer-fill me-1"></i> Cetak PDF / Print
        </button>
        <button class="btn btn-success px-4 py-2 rounded-3 fw-semibold shadow-sm" @click="openQuickAddModal">
          <i class="bi bi-plus-circle-fill me-1"></i> Tambah Transaksi
        </button>
      </div>
    </div>

    <!-- PRINT HEADER (Only visible when printing) -->
    <div class="print-only mb-4 text-center">
      <h2 class="fw-bold text-uppercase mb-1">LAPORAN REKAPITULASI RAB & KAS KEGIATAN</h2>
      <p class="mb-0 text-muted">Panitia Kegiatan 17 Agustus / Event Warga • Tanggal Cetak: {{ formattedToday }}</p>
      <hr class="my-3 border-2 border-dark" />
    </div>

    <!-- REAL-TIME DASHBOARD METRIC CARDS -->
    <div class="row g-3 mb-4">
      <!-- 1. Total RAB -->
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 h-100 bg-white border-start border-4 border-primary">
          <div class="card-body p-3.5">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="text-muted small fw-bold text-uppercase tracking-wider">Total RAB (Target)</span>
              <div class="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
                <i class="bi bi-calculator fs-5"></i>
              </div>
            </div>
            <h3 class="fw-black mb-1 text-primary">Rp {{ formatRupiah(totalRabAmount) }}</h3>
            <span class="small text-muted">{{ rabItems.length }} Item Rencana Anggaran</span>
          </div>
        </div>
      </div>

      <!-- 2. Total Pemasukan -->
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 h-100 bg-white border-start border-4 border-success">
          <div class="card-body p-3.5">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="text-muted small fw-bold text-uppercase tracking-wider">Total Pemasukan</span>
              <div class="p-2 bg-success bg-opacity-10 text-success rounded-3">
                <i class="bi bi-arrow-down-left-circle-fill fs-5"></i>
              </div>
            </div>
            <h3 class="fw-black mb-1 text-success">Rp {{ formatRupiah(totalRabIncome) }}</h3>
            <span class="small text-muted">{{ rabIncomes.length }} Sumber Dana / Iuran Warga</span>
          </div>
        </div>
      </div>

      <!-- 3. Total Pengeluaran Aktual -->
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 h-100 bg-white border-start border-4 border-danger">
          <div class="card-body p-3.5">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="text-muted small fw-bold text-uppercase tracking-wider">Pengeluaran Aktual</span>
              <div class="p-2 bg-danger bg-opacity-10 text-danger rounded-3">
                <i class="bi bi-arrow-up-right-circle-fill fs-5"></i>
              </div>
            </div>
            <h3 class="fw-black mb-1 text-danger">Rp {{ formatRupiah(totalRabExpense) }}</h3>
            <span class="small text-muted">{{ rabExpenses.length }} Transaksi Realisasi Belanja</span>
          </div>
        </div>
      </div>

      <!-- 4. Sisa Uang / Saldo -->
      <div class="col-12 col-sm-6 col-xl-3">
        <div
          class="card border-0 shadow-sm rounded-4 h-100 text-white"
          :class="sisaRabAktual >= 0 ? 'bg-gradient-success' : 'bg-gradient-danger'"
        >
          <div class="card-body p-3.5">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="text-white text-opacity-85 small fw-bold text-uppercase tracking-wider">Sisa Uang Kas (Aktual)</span>
              <div class="p-2 bg-white bg-opacity-20 text-white rounded-3">
                <i class="bi bi-wallet-fill fs-5"></i>
              </div>
            </div>
            <h3 class="fw-black mb-1">Rp {{ formatRupiah(sisaRabAktual) }}</h3>
            <div class="small text-white text-opacity-85 d-flex justify-content-between">
              <span>Est. Sisa RAB:</span>
              <span class="fw-bold">Rp {{ formatRupiah(sisaRabAmount) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- EVALUASI SELISIH BANNER (HEMAT VS OVER BUDGET) -->
    <div
      class="card border-0 shadow-sm rounded-4 mb-4 p-4 no-print transition-all"
      :class="evalBannerClass"
    >
      <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div class="d-flex align-items-center gap-3">
          <div class="p-3 rounded-4 fs-2 d-flex align-items-center justify-content-center" :class="evalIconClass">
            <i :class="evalIcon"></i>
          </div>
          <div>
            <div class="d-flex align-items-center gap-2">
              <h5 class="fw-bold mb-0" :class="evalTextClass">
                Evaluasi Realisasi Budget: {{ rabStatusInfo.status }}
              </h5>
              <span class="badge fw-bold px-3 py-1 rounded-pill" :class="evalBadgeClass">
                {{ rabStatusInfo.label }}
              </span>
            </div>
            <p class="small mb-0 mt-1" :class="evalSubtextClass">
              {{ evalDescription }}
            </p>
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <div class="text-end me-2 d-none d-lg-block">
            <div class="small text-muted fw-semibold">Selisih RAB vs Pengeluaran:</div>
            <div class="fs-5 fw-black" :class="selisihVsTextClass">
              {{ selisihVsPrefix }} Rp {{ formatRupiah(Math.abs(selisihRabVsExpense)) }}
            </div>
          </div>
          <button class="btn btn-sm btn-outline-dark rounded-3 px-3" @click="activeTab = 'comparison'">
            Lihat Analisa Detail <i class="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- MAIN TAB NAVIGATION -->
    <div class="card border-0 shadow-sm rounded-4 mb-4 bg-white no-print">
      <div class="card-header bg-transparent border-bottom p-2 p-md-3">
        <ul class="nav nav-pills card-header-pills gap-1 flex-wrap">
          <li class="nav-item">
            <button
              class="nav-link fw-bold rounded-3 px-3 py-2 d-flex align-items-center gap-2"
              :class="{ active: activeTab === 'dashboard' }"
              @click="activeTab = 'dashboard'"
            >
              <i class="bi bi-pie-chart-fill"></i>
              <span>Ringkasan Dashboard</span>
            </button>
          </li>

          <li class="nav-item">
            <button
              class="nav-link fw-bold rounded-3 px-3 py-2 d-flex align-items-center gap-2"
              :class="{ active: activeTab === 'rab_items' }"
              @click="activeTab = 'rab_items'"
            >
              <i class="bi bi-list-check"></i>
              <span>Daftar RAB Item</span>
              <span class="badge rounded-pill bg-light text-dark ms-1">{{ rabItems.length }}</span>
            </button>
          </li>

          <li class="nav-item">
            <button
              class="nav-link fw-bold rounded-3 px-3 py-2 d-flex align-items-center gap-2"
              :class="{ active: activeTab === 'income' }"
              @click="activeTab = 'income'"
            >
              <i class="bi bi-wallet2"></i>
              <span>Pemasukan / Income</span>
              <span class="badge rounded-pill bg-success text-white ms-1">{{ rabIncomes.length }}</span>
            </button>
          </li>

          <li class="nav-item">
            <button
              class="nav-link fw-bold rounded-3 px-3 py-2 d-flex align-items-center gap-2"
              :class="{ active: activeTab === 'expense' }"
              @click="activeTab = 'expense'"
            >
              <i class="bi bi-cart-check"></i>
              <span>Pengeluaran Aktual</span>
              <span class="badge rounded-pill bg-danger text-white ms-1">{{ rabExpenses.length }}</span>
            </button>
          </li>

          <li class="nav-item">
            <button
              class="nav-link fw-bold rounded-3 px-3 py-2 d-flex align-items-center gap-2"
              :class="{ active: activeTab === 'comparison' }"
              @click="activeTab = 'comparison'"
            >
              <i class="bi bi-sliders2"></i>
              <span>Analisa RAB vs Aktual</span>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- TAB 1: DASHBOARD RINGKASAN -->
    <div v-if="activeTab === 'dashboard'" class="row g-4">
      <!-- Quick Action Shortcuts -->
      <div class="col-12 col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <h5 class="fw-bold mb-3 d-flex align-items-center gap-2">
            <i class="bi bi-speedometer2 text-primary"></i> Progress Realiasi Anggaran
          </h5>

          <!-- Progress Bar Budget Realization -->
          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="fw-bold small text-muted">Pengeluaran vs Target RAB</span>
              <span class="fw-bold small text-dark">{{ percentUsed.toFixed(1) }}% Terpakai</span>
            </div>
            <div class="progress rounded-pill style-progress" style="height: 12px;">
              <div
                class="progress-bar rounded-pill"
                :class="percentUsed > 100 ? 'bg-danger' : (percentUsed > 80 ? 'bg-warning' : 'bg-success')"
                role="progressbar"
                :style="{ width: Math.min(percentUsed, 100) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Progress Bar Income Coverage -->
          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="fw-bold small text-muted">Cakupan Pemasukan vs Total RAB</span>
              <span class="fw-bold small text-dark">{{ percentIncomeCovered.toFixed(1) }}% Terkumpul</span>
            </div>
            <div class="progress rounded-pill style-progress" style="height: 12px;">
              <div
                class="progress-bar rounded-pill bg-info"
                role="progressbar"
                :style="{ width: Math.min(percentIncomeCovered, 100) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Quick Actions Grid -->
          <div class="row g-2 mt-2">
            <div class="col-6 col-md-3">
              <button class="btn btn-outline-primary w-100 py-3 rounded-4 d-flex flex-column align-items-center gap-1" @click="openModal('rab')">
                <i class="bi bi-file-earmark-plus fs-3"></i>
                <span class="small fw-semibold">+ RAB Item</span>
              </button>
            </div>
            <div class="col-6 col-md-3">
              <button class="btn btn-outline-success w-100 py-3 rounded-4 d-flex flex-column align-items-center gap-1" @click="openModal('income')">
                <i class="bi bi-plus-circle fs-3"></i>
                <span class="small fw-semibold">+ Pemasukan</span>
              </button>
            </div>
            <div class="col-6 col-md-3">
              <button class="btn btn-outline-danger w-100 py-3 rounded-4 d-flex flex-column align-items-center gap-1" @click="openModal('expense')">
                <i class="bi bi-dash-circle fs-3"></i>
                <span class="small fw-semibold">+ Pengeluaran</span>
              </button>
            </div>
            <div class="col-6 col-md-3">
              <button class="btn btn-outline-secondary w-100 py-3 rounded-4 d-flex flex-column align-items-center gap-1" @click="activeTab = 'comparison'">
                <i class="bi bi-table fs-3"></i>
                <span class="small fw-semibold">Analisa Item</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Summary Stats Side Card -->
      <div class="col-12 col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <h5 class="fw-bold mb-3 d-flex align-items-center gap-2">
            <i class="bi bi-info-circle text-primary"></i> Ringkasan Keuangan
          </h5>

          <ul class="list-group list-group-flush small">
            <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2.5">
              <span class="text-muted"><i class="bi bi-circle-fill text-primary me-2 fs-6"></i> Total RAB:</span>
              <span class="fw-bold text-dark">Rp {{ formatRupiah(totalRabAmount) }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2.5">
              <span class="text-muted"><i class="bi bi-circle-fill text-success me-2 fs-6"></i> Total Pemasukan:</span>
              <span class="fw-bold text-success">Rp {{ formatRupiah(totalRabIncome) }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2.5">
              <span class="text-muted"><i class="bi bi-circle-fill text-danger me-2 fs-6"></i> Total Pengeluaran:</span>
              <span class="fw-bold text-danger">Rp {{ formatRupiah(totalRabExpense) }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2.5 bg-light rounded-3 px-2 my-1">
              <span class="fw-bold text-dark">Selisih RAB vs Belanja:</span>
              <span class="fw-bold" :class="selisihVsTextClass">
                {{ selisihVsPrefix }} Rp {{ formatRupiah(Math.abs(selisihRabVsExpense)) }}
              </span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2.5">
              <span class="text-muted">Sisa Kas Real-Time:</span>
              <span class="fw-black text-dark">Rp {{ formatRupiah(sisaRabAktual) }}</span>
            </li>
          </ul>

          <div class="mt-3 text-center">
            <button class="btn btn-sm btn-light text-muted w-100 rounded-3" @click="resetConfirm">
              <i class="bi bi-trash me-1"></i> Reset Seluruh Data RAB
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: DAFTAR RAB ITEM -->
    <div v-if="activeTab === 'rab_items'">
      <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <div>
            <h5 class="fw-bold mb-1"><i class="bi bi-list-check text-primary me-2"></i> Rencana Anggaran Biaya (RAB)</h5>
            <p class="text-muted small mb-0">Daftar estimasi item barang/layanan, jumlah qty, satuan, dan harga unit.</p>
          </div>
          <button class="btn btn-primary rounded-3 fw-semibold px-4" @click="openModal('rab')">
            <i class="bi bi-plus-circle me-1"></i> Tambah Item RAB
          </button>
        </div>

        <!-- Table RAB Items -->
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 50px;">#</th>
                <th>Nama Item Barang / Kegiatan</th>
                <th>Qty</th>
                <th>Satuan</th>
                <th class="text-end">Harga Satuan</th>
                <th class="text-end">Total RAB</th>
                <th>Catatan</th>
                <th class="text-end no-print" style="width: 100px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="rabItems.length === 0">
                <td colspan="8" class="text-center py-5 text-muted">
                  <i class="bi bi-inbox fs-1 d-block mb-2 text-secondary"></i>
                  Belum ada item RAB. Klik tombol <strong>+ Tambah Item RAB</strong> atau <strong>Load Contoh 17 Agustus</strong>.
                </td>
              </tr>
              <tr v-for="(item, idx) in rabItems" :key="item.id">
                <td class="fw-bold text-muted">{{ idx + 1 }}</td>
                <td class="fw-bold text-dark">{{ item.nama_item }}</td>
                <td><span class="badge bg-light text-dark border">{{ item.qty }}</span></td>
                <td><span class="text-uppercase small fw-semibold text-muted">{{ item.satuan }}</span></td>
                <td class="text-end font-monospace">Rp {{ formatRupiah(item.harga_satuan) }}</td>
                <td class="text-end font-monospace fw-bold text-primary">Rp {{ formatRupiah(item.total) }}</td>
                <td class="small text-muted">{{ item.catatan || '-' }}</td>
                <td class="text-end no-print">
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" @click="editRabItem(item)" title="Edit">
                      <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button class="btn btn-outline-danger" @click="deleteRabItemConfirm(item.id)" title="Hapus">
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot class="table-group-divider fw-bold" v-if="rabItems.length > 0">
              <tr>
                <td colspan="5" class="text-end fs-6">TOTAL RENCANA ANGGARAN (RAB):</td>
                <td class="text-end fs-6 text-primary font-monospace">Rp {{ formatRupiah(totalRabAmount) }}</td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 3: KAS PEMASUKAN (INCOME) -->
    <div v-if="activeTab === 'income'">
      <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <div>
            <h5 class="fw-bold mb-1"><i class="bi bi-wallet2 text-success me-2"></i> Kas Pemasukan (Income)</h5>
            <p class="text-muted small mb-0">Catatan penerimaan uang dari Pa RT, iuran warga, sponsor, atau donatur.</p>
          </div>
          <button class="btn btn-success rounded-3 fw-semibold px-4" @click="openModal('income')">
            <i class="bi bi-plus-circle me-1"></i> Catat Pemasukan
          </button>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 50px;">#</th>
                <th>Sumber Dana / Donatur</th>
                <th>Tanggal</th>
                <th class="text-end">Nominal (Rp)</th>
                <th>Keterangan</th>
                <th class="text-end no-print" style="width: 100px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="rabIncomes.length === 0">
                <td colspan="6" class="text-center py-5 text-muted">
                  <i class="bi bi-wallet-fill fs-1 d-block mb-2 text-secondary"></i>
                  Belum ada data pemasukan. Klik <strong>+ Catat Pemasukan</strong>.
                </td>
              </tr>
              <tr v-for="(inc, idx) in rabIncomes" :key="inc.id">
                <td class="fw-bold text-muted">{{ idx + 1 }}</td>
                <td class="fw-bold text-dark">
                  <span class="badge bg-success-subtle text-success me-2"><i class="bi bi-person-fill"></i></span>
                  {{ inc.sumber_dana }}
                </td>
                <td class="small text-muted">{{ inc.tanggal }}</td>
                <td class="text-end font-monospace fw-bold text-success">Rp {{ formatRupiah(inc.nominal) }}</td>
                <td class="small text-muted">{{ inc.keterangan || '-' }}</td>
                <td class="text-end no-print">
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" @click="editIncome(inc)" title="Edit">
                      <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button class="btn btn-outline-danger" @click="deleteIncomeConfirm(inc.id)" title="Hapus">
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot class="table-group-divider fw-bold" v-if="rabIncomes.length > 0">
              <tr>
                <td colspan="3" class="text-end fs-6">TOTAL PEMASUKAN DITERIMA:</td>
                <td class="text-end fs-6 text-success font-monospace">Rp {{ formatRupiah(totalRabIncome) }}</td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 4: PENGELUARAN AKTUAL (EXPENSE) -->
    <div v-if="activeTab === 'expense'">
      <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <div>
            <h5 class="fw-bold mb-1"><i class="bi bi-cart-check text-danger me-2"></i> Pengeluaran / Belanja Aktual</h5>
            <p class="text-muted small mb-0">Catatan pembelian riil yang dihubungkan dengan item RAB terkait.</p>
          </div>
          <button class="btn btn-danger rounded-3 fw-semibold px-4" @click="openModal('expense')">
            <i class="bi bi-plus-circle me-1"></i> Catat Pengeluaran
          </button>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 50px;">#</th>
                <th>Deskripsi Pengeluaran</th>
                <th>Item RAB Terkait</th>
                <th>Tanggal</th>
                <th>Qty</th>
                <th class="text-end">Harga Satuan</th>
                <th class="text-end">Total Aktual</th>
                <th>Keterangan</th>
                <th class="text-end no-print" style="width: 100px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="rabExpenses.length === 0">
                <td colspan="9" class="text-center py-5 text-muted">
                  <i class="bi bi-cart-x fs-1 d-block mb-2 text-secondary"></i>
                  Belum ada catatan pengeluaran aktual. Klik <strong>+ Catat Pengeluaran</strong>.
                </td>
              </tr>
              <tr v-for="(exp, idx) in rabExpenses" :key="exp.id">
                <td class="fw-bold text-muted">{{ idx + 1 }}</td>
                <td class="fw-bold text-dark">{{ exp.deskripsi }}</td>
                <td>
                  <span v-if="getRabItemName(exp.rab_item_id)" class="badge bg-primary-subtle text-primary border">
                    {{ getRabItemName(exp.rab_item_id) }}
                  </span>
                  <span v-else class="badge bg-secondary-subtle text-secondary border">
                    Lain-lain / Non-RAB
                  </span>
                </td>
                <td class="small text-muted">{{ exp.tanggal }}</td>
                <td><span class="badge bg-light text-dark border">{{ exp.qty }}</span></td>
                <td class="text-end font-monospace">Rp {{ formatRupiah(exp.harga_satuan) }}</td>
                <td class="text-end font-monospace fw-bold text-danger">Rp {{ formatRupiah(exp.total) }}</td>
                <td class="small text-muted">{{ exp.keterangan || '-' }}</td>
                <td class="text-end no-print">
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" @click="editExpense(exp)" title="Edit">
                      <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button class="btn btn-outline-danger" @click="deleteExpenseConfirm(exp.id)" title="Hapus">
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot class="table-group-divider fw-bold" v-if="rabExpenses.length > 0">
              <tr>
                <td colspan="6" class="text-end fs-6">TOTAL PENGELUARAN AKTUAL:</td>
                <td class="text-end fs-6 text-danger font-monospace">Rp {{ formatRupiah(totalRabExpense) }}</td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 5: ANALISA PERBANDINGAN (RAB VS AKTUAL) -->
    <div v-if="activeTab === 'comparison' || isPrinting">
      <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <div>
            <h5 class="fw-bold mb-1"><i class="bi bi-sliders2 text-indigo me-2"></i> Analisa Perbandingan RAB vs Pengeluaran Aktual</h5>
            <p class="text-muted small mb-0">Evaluasi efisiensi budget per item. Ketahui item mana yang hemat, pas, atau over budget.</p>
          </div>

          <div class="d-flex align-items-center gap-2 no-print">
            <div class="input-group input-group-sm" style="max-width: 250px;">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
              <input type="text" class="form-control bg-light border-start-0" placeholder="Cari item..." v-model="searchQuery" />
            </div>
            <select class="form-select form-select-sm" v-model="filterStatus" style="max-width: 160px;">
              <option value="ALL">Semua Status</option>
              <option value="HEMAT">Hemat</option>
              <option value="SESUAI">Sesuai RAB</option>
              <option value="OVER">Over Budget</option>
              <option value="BELUM">Belum Realisasi</option>
            </select>
          </div>
        </div>

        <!-- Detailed Comparison Table -->
        <div class="table-responsive">
          <table class="table table-bordered align-middle mb-0">
            <thead class="table-dark text-white">
              <tr>
                <th style="width: 40px;">#</th>
                <th>Nama Item RAB</th>
                <th class="text-center">Target Qty</th>
                <th class="text-end">Target Total RAB</th>
                <th class="text-end">Realisasi Belanja</th>
                <th class="text-end">Selisih (Variance)</th>
                <th class="text-center">Status Budget</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredComparisonList.length === 0">
                <td colspan="7" class="text-center py-4 text-muted">
                  Tidak ada item yang cocok dengan filter.
                </td>
              </tr>
              <tr v-for="(row, idx) in filteredComparisonList" :key="row.item.id">
                <td class="fw-bold text-muted text-center">{{ idx + 1 }}</td>
                <td>
                  <div class="fw-bold text-dark">{{ row.item.nama_item }}</div>
                  <div class="small text-muted">{{ row.item.catatan || '-' }}</div>
                </td>
                <td class="text-center fw-semibold">{{ row.item.qty }} {{ row.item.satuan }}</td>
                <td class="text-end font-monospace fw-bold text-primary">Rp {{ formatRupiah(row.item.total) }}</td>
                <td class="text-end font-monospace fw-bold" :class="row.actualExpense > 0 ? 'text-dark' : 'text-muted'">
                  Rp {{ formatRupiah(row.actualExpense) }}
                </td>
                <td class="text-end font-monospace fw-bold" :class="row.diffClass">
                  {{ row.diffPrefix }} Rp {{ formatRupiah(Math.abs(row.diff)) }}
                </td>
                <td class="text-center">
                  <span class="badge fw-bold px-2.5 py-1.5 rounded-pill" :class="row.badgeClass">
                    {{ row.statusText }}
                  </span>
                </td>
              </tr>
            </tbody>
            <tfoot class="table-light fw-bold">
              <tr>
                <td colspan="3" class="text-end fs-6">TOTAL RENCANA & REALISASI:</td>
                <td class="text-end fs-6 text-primary font-monospace">Rp {{ formatRupiah(totalRabAmount) }}</td>
                <td class="text-end fs-6 text-danger font-monospace">Rp {{ formatRupiah(totalRabExpense) }}</td>
                <td class="text-end fs-6 font-monospace" :class="selisihVsTextClass">
                  {{ selisihVsPrefix }} Rp {{ formatRupiah(Math.abs(selisihRabVsExpense)) }}
                </td>
                <td class="text-center">
                  <span class="badge fw-bold px-3 py-1.5 rounded-pill" :class="evalBadgeClass">
                    {{ rabStatusInfo.status }}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL FORM FORM TAMBAH / EDIT ITEM -->
    <div v-if="showModal" class="modal-backdrop fade show" style="z-index: 1040;"></div>
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="z-index: 1050;">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom p-4">
            <h5 class="modal-title fw-bold">
              <i :class="modalIcon" class="me-2"></i> {{ modalTitle }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <div class="modal-body p-4">
            <!-- FORM 1: RAB ITEM -->
            <form v-if="modalType === 'rab'" @submit.prevent="saveRabItem">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label fw-semibold">Nama Item RAB / Rencana Kegiatan <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" v-model="rabForm.nama_item" placeholder="Contoh: Bendera Merah Putih" required />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Jumlah (Qty) <span class="text-danger">*</span></label>
                  <input type="number" min="1" class="form-control" v-model.number="rabForm.qty" required />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Satuan <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" v-model="rabForm.satuan" placeholder="pcs / pack / porsi / set / bungkus" required />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Harga Satuan (Rp) <span class="text-danger">*</span></label>
                  <input type="number" min="0" class="form-control" v-model.number="rabForm.harga_satuan" placeholder="10000" required />
                </div>

                <div class="col-12">
                  <div class="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <span class="fw-bold text-muted">Total Otomatis (Qty x Harga Satuan):</span>
                    <span class="fs-5 fw-black text-primary font-monospace">
                      Rp {{ formatRupiah((rabForm.qty || 0) * (rabForm.harga_satuan || 0)) }}
                    </span>
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Catatan / Keterangan</label>
                  <textarea class="form-control" rows="2" v-model="rabForm.catatan" placeholder="Detail spesifikasi barang / lokasi beli"></textarea>
                </div>

                <div class="col-12 text-end pt-3 border-top">
                  <button type="button" class="btn btn-light px-4 me-2 rounded-3" @click="closeModal">Batal</button>
                  <button type="submit" class="btn btn-primary px-4 rounded-3 fw-semibold">Simpan Item RAB</button>
                </div>
              </div>
            </form>

            <!-- FORM 2: INCOME / PEMASUKAN -->
            <form v-else-if="modalType === 'income'" @submit.prevent="saveIncome">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Sumber Dana / Donatur <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" v-model="incomeForm.sumber_dana" placeholder="Contoh: Pa RT, Warga Blok A, Kas RT" required />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Tanggal Terima <span class="text-danger">*</span></label>
                  <input type="date" class="form-control" v-model="incomeForm.tanggal" required />
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Nominal Pemasukan (Rp) <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-light fw-bold">Rp</span>
                    <input type="number" min="1" class="form-control fw-bold fs-5 text-success" v-model.number="incomeForm.nominal" placeholder="500000" required />
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Keterangan Catatan</label>
                  <textarea class="form-control" rows="2" v-model="incomeForm.keterangan" placeholder="Iuran sukarela / donasi spanduk / kas RT"></textarea>
                </div>

                <div class="col-12 text-end pt-3 border-top">
                  <button type="button" class="btn btn-light px-4 me-2 rounded-3" @click="closeModal">Batal</button>
                  <button type="submit" class="btn btn-success px-4 rounded-3 fw-semibold">Simpan Pemasukan</button>
                </div>
              </div>
            </form>

            <!-- FORM 3: EXPENSE / PENGELUARAN -->
            <form v-else-if="modalType === 'expense'" @submit.prevent="saveExpense">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label fw-semibold">Hubungkan dengan Item RAB</label>
                  <select class="form-select" v-model="expenseForm.rab_item_id" @change="onSelectRabItem">
                    <option :value="null">-- Tidak Diatribusikan (Lain-lain / Non-RAB) --</option>
                    <option v-for="item in rabItems" :key="item.id" :value="item.id">
                      {{ item.nama_item }} (Target: Rp {{ formatRupiah(item.total) }})
                    </option>
                  </select>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Deskripsi Pengeluaran Belanja <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" v-model="expenseForm.deskripsi" placeholder="Contoh: Beli Bendera Merah Putih 10 pcs" required />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Jumlah (Qty) <span class="text-danger">*</span></label>
                  <input type="number" min="1" class="form-control" v-model.number="expenseForm.qty" required />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Harga Satuan (Rp) <span class="text-danger">*</span></label>
                  <input type="number" min="0" class="form-control" v-model.number="expenseForm.harga_satuan" required />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Tanggal Nota <span class="text-danger">*</span></label>
                  <input type="date" class="form-control" v-model="expenseForm.tanggal" required />
                </div>

                <div class="col-12">
                  <div class="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <span class="fw-bold text-muted">Total Pengeluaran Aktual (Qty x Harga):</span>
                    <span class="fs-5 fw-black text-danger font-monospace">
                      Rp {{ formatRupiah((expenseForm.qty || 0) * (expenseForm.harga_satuan || 0)) }}
                    </span>
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Keterangan / Nomor Nota</label>
                  <textarea class="form-control" rows="2" v-model="expenseForm.keterangan" placeholder="Nota Toko Pak Haris / garansi / dll"></textarea>
                </div>

                <div class="col-12 text-end pt-3 border-top">
                  <button type="button" class="btn btn-light px-4 me-2 rounded-3" @click="closeModal">Batal</button>
                  <button type="submit" class="btn btn-danger px-4 rounded-3 fw-semibold">Simpan Pengeluaran</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';

export default {
  name: 'RabView',
  setup() {
    const store = useStore();
    const activeTab = ref('dashboard');
    const isPrinting = ref(false);
    const searchQuery = ref('');
    const filterStatus = ref('ALL');

    // Store state & getters
    const rabItems = computed(() => store.getters.getRabItems);
    const rabIncomes = computed(() => store.getters.getRabIncomes);
    const rabExpenses = computed(() => store.getters.getRabExpenses);

    const totalRabAmount = computed(() => store.getters.totalRabAmount);
    const totalRabIncome = computed(() => store.getters.totalRabIncome);
    const totalRabExpense = computed(() => store.getters.totalRabExpense);

    const sisaRabAmount = computed(() => store.getters.sisaRabAmount);
    const sisaRabAktual = computed(() => store.getters.sisaRabAktual);
    const selisihRabVsExpense = computed(() => store.getters.selisihRabVsExpense);
    const rabStatusInfo = computed(() => store.getters.rabStatusInfo);

    const formattedToday = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Formatting helpers
    const formatRupiah = (val) => {
      if (val === undefined || val === null || isNaN(val)) return '0';
      return Math.round(val).toLocaleString('id-ID');
    };

    // Percentages
    const percentUsed = computed(() => {
      if (totalRabAmount.value === 0) return 0;
      return (totalRabExpense.value / totalRabAmount.value) * 100;
    });

    const percentIncomeCovered = computed(() => {
      if (totalRabAmount.value === 0) return 0;
      return (totalRabIncome.value / totalRabAmount.value) * 100;
    });

    // Banner Styling
    const evalBannerClass = computed(() => {
      const diff = selisihRabVsExpense.value;
      if (diff > 0) return 'bg-success bg-opacity-10 border border-2 border-success';
      if (diff === 0) return 'bg-primary bg-opacity-10 border border-2 border-primary';
      return 'bg-danger bg-opacity-10 border border-2 border-danger';
    });

    const evalIconClass = computed(() => {
      const diff = selisihRabVsExpense.value;
      if (diff > 0) return 'bg-success text-white';
      if (diff === 0) return 'bg-primary text-white';
      return 'bg-danger text-white';
    });

    const evalIcon = computed(() => {
      const diff = selisihRabVsExpense.value;
      if (diff > 0) return 'bi bi-emoji-smile-fill';
      if (diff === 0) return 'bi bi-check-circle-fill';
      return 'bi bi-exclamation-triangle-fill';
    });

    const evalTextClass = computed(() => {
      const diff = selisihRabVsExpense.value;
      if (diff > 0) return 'text-success';
      if (diff === 0) return 'text-primary';
      return 'text-danger';
    });

    const evalSubtextClass = computed(() => {
      const diff = selisihRabVsExpense.value;
      if (diff > 0) return 'text-success fw-semibold';
      if (diff === 0) return 'text-primary fw-semibold';
      return 'text-danger fw-semibold';
    });

    const evalBadgeClass = computed(() => {
      const diff = selisihRabVsExpense.value;
      if (diff > 0) return 'bg-success text-white';
      if (diff === 0) return 'bg-primary text-white';
      return 'bg-danger text-white';
    });

    const evalDescription = computed(() => {
      const diff = selisihRabVsExpense.value;
      if (diff > 0) {
        return `🎉 Luar biasa! Pengeluaran aktual lebih hemat Rp ${formatRupiah(diff)} dibanding batas Rencana Anggaran Biaya (RAB).`;
      } else if (diff === 0) {
        return `✅ Sesuai Target! Pengeluaran aktual persis sesuai dengan estimasi Rencana Anggaran Biaya (RAB).`;
      } else {
        return `⚠️ Perhatian! Realisasi pengeluaran melampaui RAB sebesar Rp ${formatRupiah(Math.abs(diff))}. Evaluasi kembali pos belanja!`;
      }
    });

    const selisihVsTextClass = computed(() => {
      const diff = selisihRabVsExpense.value;
      if (diff > 0) return 'text-success';
      if (diff === 0) return 'text-primary';
      return 'text-danger';
    });

    const selisihVsPrefix = computed(() => {
      const diff = selisihRabVsExpense.value;
      if (diff > 0) return '+ (Hemat)';
      if (diff === 0) return '';
      return '- (Over)';
    });

    // Get RAB Item Name helper
    const getRabItemName = (rab_item_id) => {
      if (!rab_item_id) return null;
      const found = rabItems.value.find(i => i.id === rab_item_id);
      return found ? found.nama_item : null;
    };

    // Detailed Comparison List
    const comparisonList = computed(() => {
      return rabItems.value.map(item => {
        // Find expenses linked to this RAB item
        const linkedExpenses = rabExpenses.value.filter(e => e.rab_item_id === item.id);
        const actualExpense = linkedExpenses.reduce((acc, e) => acc + (Number(e.total) || (Number(e.qty) * Number(e.harga_satuan))), 0);
        const diff = (Number(item.total) || 0) - actualExpense;

        let statusText = 'Belum Realisasi';
        let badgeClass = 'bg-secondary text-white';
        let diffPrefix = '';
        let diffClass = 'text-muted';

        if (linkedExpenses.length > 0) {
          if (diff > 0) {
            statusText = 'Hemat';
            badgeClass = 'bg-success text-white';
            diffPrefix = '+';
            diffClass = 'text-success';
          } else if (diff === 0) {
            statusText = 'Sesuai RAB';
            badgeClass = 'bg-primary text-white';
            diffPrefix = '';
            diffClass = 'text-primary';
          } else {
            statusText = 'Over Budget';
            badgeClass = 'bg-danger text-white';
            diffPrefix = '-';
            diffClass = 'text-danger';
          }
        }

        return {
          item,
          actualExpense,
          diff,
          statusText,
          badgeClass,
          diffPrefix,
          diffClass
        };
      });
    });

    const filteredComparisonList = computed(() => {
      return comparisonList.value.filter(row => {
        const matchesQuery = searchQuery.value === '' || row.item.nama_item.toLowerCase().includes(searchQuery.value.toLowerCase());
        let matchesStatus = true;
        if (filterStatus.value === 'HEMAT') matchesStatus = row.statusText === 'Hemat';
        else if (filterStatus.value === 'SESUAI') matchesStatus = row.statusText === 'Sesuai RAB';
        else if (filterStatus.value === 'OVER') matchesStatus = row.statusText === 'Over Budget';
        else if (filterStatus.value === 'BELUM') matchesStatus = row.statusText === 'Belum Realisasi';

        return matchesQuery && matchesStatus;
      });
    });

    // MODAL STATE
    const showModal = ref(false);
    const modalType = ref('rab'); // 'rab', 'income', 'expense'
    const editingId = ref(null);

    const rabForm = ref({
      nama_item: '',
      qty: 1,
      satuan: 'pcs',
      harga_satuan: 0,
      catatan: ''
    });

    const incomeForm = ref({
      sumber_dana: '',
      tanggal: new Date().toISOString().split('T')[0],
      nominal: 0,
      keterangan: ''
    });

    const expenseForm = ref({
      rab_item_id: null,
      deskripsi: '',
      qty: 1,
      harga_satuan: 0,
      tanggal: new Date().toISOString().split('T')[0],
      keterangan: ''
    });

    const modalTitle = computed(() => {
      if (modalType.value === 'rab') return editingId.value ? 'Edit Item RAB' : 'Tambah Item RAB Baru';
      if (modalType.value === 'income') return editingId.value ? 'Edit Catatan Pemasukan' : 'Catat Pemasukan / Iuran Baru';
      return editingId.value ? 'Edit Catatan Pengeluaran' : 'Catat Pengeluaran / Belanja Baru';
    });

    const modalIcon = computed(() => {
      if (modalType.value === 'rab') return 'bi bi-calculator-fill text-primary';
      if (modalType.value === 'income') return 'bi bi-wallet2 text-success';
      return 'bi bi-cart-check text-danger';
    });

    const openModal = (type) => {
      modalType.value = type;
      editingId.value = null;
      if (type === 'rab') {
        rabForm.value = { nama_item: '', qty: 1, satuan: 'pcs', harga_satuan: 0, catatan: '' };
      } else if (type === 'income') {
        incomeForm.value = { sumber_dana: '', tanggal: new Date().toISOString().split('T')[0], nominal: 0, keterangan: '' };
      } else if (type === 'expense') {
        expenseForm.value = { rab_item_id: null, deskripsi: '', qty: 1, harga_satuan: 0, tanggal: new Date().toISOString().split('T')[0], keterangan: '' };
      }
      showModal.value = true;
    };

    const openQuickAddModal = () => {
      openModal('rab');
    };

    const closeModal = () => {
      showModal.value = false;
      editingId.value = null;
    };

    const onSelectRabItem = () => {
      if (expenseForm.value.rab_item_id) {
        const item = rabItems.value.find(i => i.id === expenseForm.value.rab_item_id);
        if (item) {
          expenseForm.value.deskripsi = item.nama_item;
          expenseForm.value.qty = item.qty;
          expenseForm.value.harga_satuan = item.harga_satuan;
        }
      }
    };

    // SAVE HANDLERS
    const saveRabItem = () => {
      if (editingId.value) {
        store.dispatch('updateRabItem', { ...rabForm.value, id: editingId.value });
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Item RAB berhasil diperbarui!', timer: 1500, showConfirmButton: false });
      } else {
        store.dispatch('addRabItem', { ...rabForm.value });
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Item RAB baru berhasil ditambahkan!', timer: 1500, showConfirmButton: false });
      }
      closeModal();
    };

    const saveIncome = () => {
      if (editingId.value) {
        store.dispatch('updateRabIncome', { ...incomeForm.value, id: editingId.value });
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Catatan pemasukan diperbarui!', timer: 1500, showConfirmButton: false });
      } else {
        store.dispatch('addRabIncome', { ...incomeForm.value });
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Pemasukan baru berhasil dicatat!', timer: 1500, showConfirmButton: false });
      }
      closeModal();
    };

    const saveExpense = () => {
      if (editingId.value) {
        store.dispatch('updateRabExpense', { ...expenseForm.value, id: editingId.value });
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Catatan pengeluaran diperbarui!', timer: 1500, showConfirmButton: false });
      } else {
        store.dispatch('addRabExpense', { ...expenseForm.value });
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Pengeluaran baru berhasil dicatat!', timer: 1500, showConfirmButton: false });
      }
      closeModal();
    };

    // EDIT HANDLERS
    const editRabItem = (item) => {
      editingId.value = item.id;
      modalType.value = 'rab';
      rabForm.value = { ...item };
      showModal.value = true;
    };

    const editIncome = (inc) => {
      editingId.value = inc.id;
      modalType.value = 'income';
      incomeForm.value = { ...inc };
      showModal.value = true;
    };

    const editExpense = (exp) => {
      editingId.value = exp.id;
      modalType.value = 'expense';
      expenseForm.value = { ...exp };
      showModal.value = true;
    };

    // DELETE HANDLERS
    const deleteRabItemConfirm = (id) => {
      Swal.fire({
        title: 'Hapus Item RAB?',
        text: 'Pengeluaran yang terhubung akan disesuaikan menjadi Non-RAB.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!'
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('deleteRabItem', id);
          Swal.fire('Terhapus!', 'Item RAB telah dihapus.', 'success');
        }
      });
    };

    const deleteIncomeConfirm = (id) => {
      Swal.fire({
        title: 'Hapus Pemasukan?',
        text: 'Catatan nominal penerimaan ini akan dihapus dari kas.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!'
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('deleteRabIncome', id);
          Swal.fire('Terhapus!', 'Catatan pemasukan dihapus.', 'success');
        }
      });
    };

    const deleteExpenseConfirm = (id) => {
      Swal.fire({
        title: 'Hapus Pengeluaran?',
        text: 'Catatan pengeluaran aktual ini akan dihapus.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!'
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('deleteRabExpense', id);
          Swal.fire('Terhapus!', 'Pengeluaran dihapus.', 'success');
        }
      });
    };

    // SAMPLE DATA LOAD
    const triggerLoadSampleData = () => {
      Swal.fire({
        title: 'Muat Contoh Data 17 Agustus?',
        text: 'Data RAB, Pemasukan (Pa RT / Iuran Warga), dan Pengeluaran contoh akan dimuat.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Muat Data'
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('loadSampleRabData');
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Contoh data RAB & Kas Kegiatan 17 Agustus telah dimuat.',
            timer: 1500,
            showConfirmButton: false
          });
        }
      });
    };

    const resetConfirm = () => {
      Swal.fire({
        title: 'Reset Semua Data RAB?',
        text: 'Semua item RAB, Pemasukan, dan Pengeluaran akan dikosongkan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ya, Kosongkan!'
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('resetRabData');
          Swal.fire('Direset!', 'Seluruh data RAB telah dikosongkan.', 'success');
        }
      });
    };

    // PRINT REPORT
    const printReport = () => {
      isPrinting.value = true;
      setTimeout(() => {
        window.print();
        isPrinting.value = false;
      }, 200);
    };

    return {
      activeTab,
      isPrinting,
      searchQuery,
      filterStatus,
      rabItems,
      rabIncomes,
      rabExpenses,
      totalRabAmount,
      totalRabIncome,
      totalRabExpense,
      sisaRabAmount,
      sisaRabAktual,
      selisihRabVsExpense,
      rabStatusInfo,
      formattedToday,
      formatRupiah,
      percentUsed,
      percentIncomeCovered,
      evalBannerClass,
      evalIconClass,
      evalIcon,
      evalTextClass,
      evalSubtextClass,
      evalBadgeClass,
      evalDescription,
      selisihVsTextClass,
      selisihVsPrefix,
      getRabItemName,
      filteredComparisonList,
      showModal,
      modalType,
      modalTitle,
      modalIcon,
      rabForm,
      incomeForm,
      expenseForm,
      openModal,
      openQuickAddModal,
      closeModal,
      onSelectRabItem,
      saveRabItem,
      saveIncome,
      saveExpense,
      editRabItem,
      editIncome,
      editExpense,
      deleteRabItemConfirm,
      deleteIncomeConfirm,
      deleteExpenseConfirm,
      triggerLoadSampleData,
      resetConfirm,
      printReport
    };
  }
};
</script>

<style scoped>
.fw-black {
  font-weight: 900;
}

.bg-gradient-success {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
}

.bg-gradient-danger {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
}

.style-progress {
  background-color: #f1f5f9;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

@media print {
  .no-print {
    display: none !important;
  }
  .print-only {
    display: block !important;
  }
  body {
    background: white !important;
    color: black !important;
  }
  .card {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
  }
}

@media screen {
  .print-only {
    display: none !important;
  }
}
</style>
