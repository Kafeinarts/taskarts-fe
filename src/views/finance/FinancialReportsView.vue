<template>
  <div class="container-fluid p-0 pb-5" data-aos="fade-up">
    <!-- Top Shared Header Navigation -->
    <FinanceNavHeader
      title="5. Pelaporan Keuangan Standar PSAK / IFRS & Audit"
      subtitle="Penyusunan laporan Laba Rugi (P&L), Neraca Posisi Keuangan (Balance Sheet), dan Arus Kas (Cash Flow) terintegrasi langsung dengan data riil."
    />

    <!-- Main Navigation Sub-tabs -->
    <div class="card border-0 shadow-sm rounded-4 bg-white mb-4 p-2 no-print">
      <ul class="nav nav-pills nav-fill gap-2" role="tablist">
        <li class="nav-item">
          <button
            class="nav-link rounded-3 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
            :class="{ active: activeReportTab === 'pnl' }"
            @click="activeReportTab = 'pnl'"
          >
            <i class="bi bi-graph-up"></i>
            <span>Laba Rugi (Profit & Loss)</span>
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link rounded-3 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
            :class="{ active: activeReportTab === 'balance-sheet' }"
            @click="activeReportTab = 'balance-sheet'"
          >
            <i class="bi bi-scale"></i>
            <span>Neraca Keuangan (Balance Sheet)</span>
            <span class="badge rounded-pill small" :class="Math.abs(balanceDiscrepancy) < 1 ? 'bg-success text-white' : 'bg-warning text-dark'">
              {{ Math.abs(balanceDiscrepancy) < 1 ? 'Balanced' : 'Selisih' }}
            </span>
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link rounded-3 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
            :class="{ active: activeReportTab === 'cashflow-stmt' }"
            @click="activeReportTab = 'cashflow-stmt'"
          >
            <i class="bi bi-cash-stack"></i>
            <span>Laporan Arus Kas (PSAK 2)</span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Filter Bar & Export Actions (Custom Reporting) -->
    <div class="card border-0 shadow-sm rounded-4 bg-white p-3 mb-4 no-print">
      <div class="row g-3 align-items-end">
        <div class="col-md-3">
          <label class="form-label small fw-bold text-dark mb-1">Periode Tanggal Mulai</label>
          <input type="date" class="form-control form-control-sm" v-model="filterStartDate" />
        </div>
        <div class="col-md-3">
          <label class="form-label small fw-bold text-dark mb-1">Periode Sampai Dengan</label>
          <input type="date" class="form-control form-control-sm" v-model="filterEndDate" />
        </div>
        <div class="col-md-3">
          <label class="form-label small fw-bold text-dark mb-1">Format Skala Angka</label>
          <div class="d-flex gap-2">
            <div class="form-check">
              <input class="form-check-input" type="radio" id="scaleFull" value="full" v-model="numberScale" />
              <label class="form-check-label small" for="scaleFull">Penuh (Rp)</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" id="scaleRibuan" value="thousands" v-model="numberScale" />
              <label class="form-check-label small" for="scaleRibuan">Ribuan</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" id="scaleJutaan" value="millions" v-model="numberScale" />
              <label class="form-check-label small" for="scaleJutaan">Jutaan</label>
            </div>
          </div>
        </div>
        <div class="col-md-3 text-md-end">
          <div class="d-flex gap-2 justify-content-md-end flex-wrap">
            <button class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold" @click="openProfileModal">
              <i class="bi bi-building-gear me-1"></i> Profil Entitas
            </button>
            <button class="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-semibold" @click="openCustomAccountModal">
              <i class="bi bi-plus-circle me-1"></i> Tambah Pos Akun
            </button>
          </div>
        </div>

        <div class="col-12 d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2 border-top">
          <div class="d-flex align-items-center gap-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="showCoa" v-model="showCoaCodes" />
              <label class="form-check-label small fw-semibold" for="showCoa">Tampilkan Kode Akun COA</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="showFootnotes" v-model="showPsakFootnotes" />
              <label class="form-check-label small fw-semibold" for="showFootnotes">Sertakan Catatan Kaki Kebijakan Akuntansi PSAK</label>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2 flex-wrap">
            <button class="btn btn-outline-success btn-sm rounded-pill px-3 fw-semibold" @click="exportReportExcel">
              <i class="bi bi-file-earmark-excel-fill text-success me-1"></i> Unduh Excel (.xlsx)
            </button>
            <button class="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-semibold" @click="exportReportCsv">
              <i class="bi bi-filetype-csv me-1"></i> Ekspor CSV
            </button>
            <button class="btn btn-primary btn-sm rounded-pill px-3 fw-semibold" @click="printReportPdf">
              <i class="bi bi-printer-fill me-1"></i> Cetak Dokumen PDF Resmi
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- REPORT PRINTABLE CONTAINER -->
    <div class="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5 mb-5 print-container" id="printableReportSection">
      <!-- Report Official Header -->
      <div class="text-center border-bottom pb-4 mb-4">
        <h4 class="fw-bold text-dark text-uppercase mb-1 tracking-wide">{{ companyProfile.name }}</h4>
        <div class="text-muted small mb-1" v-if="companyProfile.address">{{ companyProfile.address }}</div>
        <div class="text-muted small mb-2" v-if="companyProfile.taxId">NPWP: {{ companyProfile.taxId }}</div>
        <h5 class="fw-bold text-primary mb-1">{{ currentReportTitle }}</h5>
        <div class="text-muted small">
          Periode: {{ formatDate(filterStartDate) }} s/d {{ formatDate(filterEndDate) }} (Disajikan Sesuai Standar PSAK / IFRS)
        </div>
        <div class="small text-muted font-monospace mt-1" v-if="numberScale !== 'full'">
          (Dinyatakan dalam {{ numberScale === 'thousands' ? 'Ribuan Rupiah' : 'Jutaan Rupiah' }}, kecuali dinyatakan lain)
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- 1. PROFIT & LOSS (LABA RUGI)                                              -->
      <!-- ========================================================================= -->
      <div v-if="activeReportTab === 'pnl'">
        <table class="table table-sm table-borderless align-middle report-table">
          <tbody>
            <!-- PENDAPATAN USAHA -->
            <tr class="table-light fw-bold">
              <td :colspan="showCoaCodes ? 4 : 3" class="text-dark">PENDAPATAN USAHA (REVENUE)</td>
            </tr>
            <tr v-if="pnlData.revenues.length === 0">
              <td :colspan="showCoaCodes ? 4 : 3" class="text-center py-3 text-muted small fst-italic">
                Belum ada transaksi pendapatan usaha tercatat (Rp 0). Anda dapat mencatat mutasi di menu Arus Kas, Faktur Piutang (AR), atau klik tombol "+ Tambah Pos Akun".
              </td>
            </tr>
            <tr v-for="(item, idx) in pnlData.revenues" :key="'rev-' + idx">
              <td v-if="showCoaCodes" class="font-monospace text-muted small" style="width: 90px;">{{ item.coa }}</td>
              <td class="ps-3">{{ item.name }}</td>
              <td class="text-end font-monospace">{{ formatScaled(item.amount) }}</td>
              <td class="no-print text-end" style="width: 40px;" v-if="item.isCustom">
                <button class="btn btn-link text-danger p-0 btn-sm" @click="removeCustomAccount(item.id)" title="Hapus Pos"><i class="bi bi-trash"></i></button>
              </td>
              <td class="no-print" style="width: 40px;" v-else></td>
            </tr>
            <tr class="border-top fw-bold">
              <td v-if="showCoaCodes"></td>
              <td class="ps-3 text-dark">Jumlah Pendapatan Usaha</td>
              <td class="text-end font-monospace text-primary">{{ formatScaled(totalRevenue) }}</td>
              <td class="no-print"></td>
            </tr>

            <!-- BEBAN POKOK PENDAPATAN (COGS) -->
            <tr class="table-light fw-bold mt-2">
              <td :colspan="showCoaCodes ? 4 : 3" class="text-dark pt-3">BEBAN POKOK PENDAPATAN (COST OF GOODS SOLD)</td>
            </tr>
            <tr v-if="pnlData.cogs.length === 0">
              <td :colspan="showCoaCodes ? 4 : 3" class="text-center py-2 text-muted small fst-italic">
                Belum ada beban pokok tercatat (Rp 0).
              </td>
            </tr>
            <tr v-for="(item, idx) in pnlData.cogs" :key="'cogs-' + idx">
              <td v-if="showCoaCodes" class="font-monospace text-muted small">{{ item.coa }}</td>
              <td class="ps-3">{{ item.name }}</td>
              <td class="text-end font-monospace">({{ formatScaled(item.amount) }})</td>
              <td class="no-print text-end" style="width: 40px;" v-if="item.isCustom">
                <button class="btn btn-link text-danger p-0 btn-sm" @click="removeCustomAccount(item.id)" title="Hapus Pos"><i class="bi bi-trash"></i></button>
              </td>
              <td class="no-print" style="width: 40px;" v-else></td>
            </tr>
            <tr class="border-top fw-bold">
              <td v-if="showCoaCodes"></td>
              <td class="ps-3 text-dark">Jumlah Beban Pokok Pendapatan</td>
              <td class="text-end font-monospace text-danger">({{ formatScaled(totalCogs) }})</td>
              <td class="no-print"></td>
            </tr>

            <!-- LABA KOTOR (GROSS PROFIT) -->
            <tr class="table-primary fw-bold border-top border-bottom border-2 border-primary">
              <td v-if="showCoaCodes"></td>
              <td class="text-primary py-2">LABA KOTOR (GROSS PROFIT)</td>
              <td class="text-end font-monospace text-primary py-2">{{ formatScaled(grossProfit) }}</td>
              <td class="no-print"></td>
            </tr>

            <!-- BEBAN OPERASIONAL (OPEX) -->
            <tr class="table-light fw-bold">
              <td :colspan="showCoaCodes ? 4 : 3" class="text-dark pt-3">BEBAN OPERASIONAL (OPERATING EXPENSES)</td>
            </tr>
            <tr v-if="pnlData.opex.length === 0">
              <td :colspan="showCoaCodes ? 4 : 3" class="text-center py-2 text-muted small fst-italic">
                Belum ada beban operasional tercatat (Rp 0).
              </td>
            </tr>
            <tr v-for="(item, idx) in pnlData.opex" :key="'opex-' + idx">
              <td v-if="showCoaCodes" class="font-monospace text-muted small">{{ item.coa }}</td>
              <td class="ps-3">{{ item.name }}</td>
              <td class="text-end font-monospace">({{ formatScaled(item.amount) }})</td>
              <td class="no-print text-end" style="width: 40px;" v-if="item.isCustom">
                <button class="btn btn-link text-danger p-0 btn-sm" @click="removeCustomAccount(item.id)" title="Hapus Pos"><i class="bi bi-trash"></i></button>
              </td>
              <td class="no-print" style="width: 40px;" v-else></td>
            </tr>
            <tr class="border-top fw-bold">
              <td v-if="showCoaCodes"></td>
              <td class="ps-3 text-dark">Jumlah Beban Operasional</td>
              <td class="text-end font-monospace text-danger">({{ formatScaled(totalOpex) }})</td>
              <td class="no-print"></td>
            </tr>

            <!-- LABA USAHA (OPERATING INCOME / EBITDA) -->
            <tr class="border-top border-bottom fw-bold">
              <td v-if="showCoaCodes"></td>
              <td class="text-dark py-2">LABA SEBELUM BUNGA & PAJAK (EBIT)</td>
              <td class="text-end font-monospace text-dark py-2">{{ formatScaled(operatingProfit) }}</td>
              <td class="no-print"></td>
            </tr>

            <!-- PAJAK & BEBAN LAIN -->
            <tr>
              <td v-if="showCoaCodes" class="font-monospace text-muted small">8-100</td>
              <td class="ps-3">Estimasi Beban Pajak Penghasilan Badan (PPh Badan 22%)</td>
              <td class="text-end font-monospace text-danger">({{ formatScaled(taxExpense) }})</td>
              <td class="no-print"></td>
            </tr>

            <!-- LABA BERSIH (NET INCOME) -->
            <tr class="table-success fw-bold border-top border-bottom border-3 border-success">
              <td v-if="showCoaCodes"></td>
              <td class="text-success fs-6 py-2.5">LABA BERSIH TAHUN BERJALAN (NET PROFIT)</td>
              <td class="text-end font-monospace text-success fs-6 py-2.5">{{ formatScaled(netProfit) }}</td>
              <td class="no-print"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ========================================================================= -->
      <!-- 2. BALANCE SHEET (NERACA KEUANGAN)                                        -->
      <!-- ========================================================================= -->
      <div v-if="activeReportTab === 'balance-sheet'">
        <div class="row g-4">
          <!-- SISI KIRI: ASET -->
          <div class="col-12 col-lg-6">
            <h6 class="fw-bold text-dark border-bottom pb-2 mb-2 d-flex justify-content-between">
              <span>ASET (ASSETS)</span>
            </h6>
            <table class="table table-sm table-borderless align-middle report-table mb-0">
              <tbody>
                <tr class="fw-bold text-secondary small text-uppercase">
                  <td :colspan="showCoaCodes ? 3 : 2">Aset Lancar (Current Assets)</td>
                </tr>
                <tr v-if="balanceSheetData.currentAssets.length === 0">
                  <td :colspan="showCoaCodes ? 3 : 2" class="text-muted small fst-italic py-2 ps-2">
                    Belum ada aset lancar tercatat (Rp 0).
                  </td>
                </tr>
                <tr v-for="a in balanceSheetData.currentAssets" :key="a.name">
                  <td v-if="showCoaCodes" class="font-monospace text-muted small" style="width: 70px;">{{ a.coa }}</td>
                  <td class="ps-2">{{ a.name }}</td>
                  <td class="text-end font-monospace">{{ formatScaled(a.amount) }}</td>
                </tr>
                <tr class="border-top fw-semibold small">
                  <td v-if="showCoaCodes"></td>
                  <td class="ps-2">Total Aset Lancar</td>
                  <td class="text-end font-monospace text-dark">{{ formatScaled(totalCurrentAssets) }}</td>
                </tr>

                <tr class="fw-bold text-secondary small text-uppercase pt-3">
                  <td :colspan="showCoaCodes ? 3 : 2" class="pt-3">Aset Tidak Lancar (Non-Current Assets)</td>
                </tr>
                <tr v-if="balanceSheetData.fixedAssets.length === 0">
                  <td :colspan="showCoaCodes ? 3 : 2" class="text-muted small fst-italic py-2 ps-2">
                    Belum ada aset tetap / tidak lancar tercatat (Rp 0).
                  </td>
                </tr>
                <tr v-for="a in balanceSheetData.fixedAssets" :key="a.name">
                  <td v-if="showCoaCodes" class="font-monospace text-muted small">{{ a.coa }}</td>
                  <td class="ps-2">{{ a.name }}</td>
                  <td class="text-end font-monospace">{{ a.amount < 0 ? `(${formatScaled(Math.abs(a.amount))})` : formatScaled(a.amount) }}</td>
                </tr>
                <tr class="border-top fw-semibold small">
                  <td v-if="showCoaCodes"></td>
                  <td class="ps-2">Total Aset Tidak Lancar</td>
                  <td class="text-end font-monospace text-dark">{{ formatScaled(totalFixedAssets) }}</td>
                </tr>

                <tr class="table-primary fw-bold border-top border-bottom border-2 border-primary">
                  <td v-if="showCoaCodes"></td>
                  <td class="text-primary py-2">JUMLAH ASET (TOTAL ASSETS)</td>
                  <td class="text-end font-monospace text-primary py-2">{{ formatScaled(totalAssets) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- SISI KANAN: KEWAJIBAN & EKUITAS -->
          <div class="col-12 col-lg-6">
            <h6 class="fw-bold text-dark border-bottom pb-2 mb-2 d-flex justify-content-between">
              <span>KEWAJIBAN & EKUITAS (LIABILITIES & EQUITY)</span>
            </h6>
            <table class="table table-sm table-borderless align-middle report-table mb-0">
              <tbody>
                <tr class="fw-bold text-secondary small text-uppercase">
                  <td :colspan="showCoaCodes ? 3 : 2">Kewajiban Jangka Pendek (Current Liabilities)</td>
                </tr>
                <tr v-if="balanceSheetData.currentLiabilities.length === 0">
                  <td :colspan="showCoaCodes ? 3 : 2" class="text-muted small fst-italic py-2 ps-2">
                    Belum ada kewajiban / hutang tercatat (Rp 0).
                  </td>
                </tr>
                <tr v-for="l in balanceSheetData.currentLiabilities" :key="l.name">
                  <td v-if="showCoaCodes" class="font-monospace text-muted small" style="width: 70px;">{{ l.coa }}</td>
                  <td class="ps-2">{{ l.name }}</td>
                  <td class="text-end font-monospace">{{ formatScaled(l.amount) }}</td>
                </tr>
                <tr class="border-top fw-semibold small">
                  <td v-if="showCoaCodes"></td>
                  <td class="ps-2">Total Kewajiban</td>
                  <td class="text-end font-monospace text-danger">{{ formatScaled(totalLiabilities) }}</td>
                </tr>

                <tr class="fw-bold text-secondary small text-uppercase pt-3">
                  <td :colspan="showCoaCodes ? 3 : 2" class="pt-3">Ekuitas Pemilik (Owner's Equity)</td>
                </tr>
                <tr v-for="e in balanceSheetData.equity" :key="e.name">
                  <td v-if="showCoaCodes" class="font-monospace text-muted small">{{ e.coa }}</td>
                  <td class="ps-2">{{ e.name }}</td>
                  <td class="text-end font-monospace">{{ formatScaled(e.amount) }}</td>
                </tr>
                <tr class="border-top fw-semibold small">
                  <td v-if="showCoaCodes"></td>
                  <td class="ps-2">Total Ekuitas</td>
                  <td class="text-end font-monospace text-success">{{ formatScaled(totalEquity) }}</td>
                </tr>

                <tr class="table-primary fw-bold border-top border-bottom border-2 border-primary">
                  <td v-if="showCoaCodes"></td>
                  <td class="text-primary py-2">JUMLAH KEWAJIBAN & EKUITAS</td>
                  <td class="text-end font-monospace text-primary py-2">{{ formatScaled(totalLiabilitiesAndEquity) }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Balance Verification Badge -->
            <div
              class="alert mt-3 py-2 px-3 rounded-3 small d-flex align-items-center justify-content-between"
              :class="Math.abs(balanceDiscrepancy) < 1 ? 'alert-success' : 'alert-warning'"
            >
              <div class="d-flex align-items-center gap-1.5">
                <i :class="Math.abs(balanceDiscrepancy) < 1 ? 'bi bi-check-circle-fill text-success' : 'bi bi-exclamation-circle-fill text-warning'" class="fs-5"></i>
                <span class="fw-bold">{{ Math.abs(balanceDiscrepancy) < 1 ? 'Persamaan Neraca Seimbang (Balanced)' : 'Perhatian: Ada Selisih Neraca' }}</span>
              </div>
              <span class="font-monospace fw-bold text-dark">Selisih: {{ formatScaled(balanceDiscrepancy) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- 3. CASH FLOW STATEMENT (PSAK 2)                                           -->
      <!-- ========================================================================= -->
      <div v-if="activeReportTab === 'cashflow-stmt'">
        <table class="table table-sm table-borderless align-middle report-table">
          <tbody>
            <!-- OPERASIONAL -->
            <tr class="table-light fw-bold">
              <td :colspan="showCoaCodes ? 3 : 2" class="text-dark">ARUS KAS DARI AKTIVITAS OPERASI (OPERATING ACTIVITIES)</td>
            </tr>
            <tr>
              <td v-if="showCoaCodes" class="font-monospace text-muted small">CF-01</td>
              <td class="ps-3">Penerimaan Kas dari Pelanggan & Penjualan (Inflow Operasi)</td>
              <td class="text-end font-monospace text-success">{{ formatScaled(cashFlowSummary.operatingInflow) }}</td>
            </tr>
            <tr>
              <td v-if="showCoaCodes" class="font-monospace text-muted small">CF-02</td>
              <td class="ps-3">Pembayaran Kas kepada Pemasok & Pengeluaran Operasional</td>
              <td class="text-end font-monospace text-danger">({{ formatScaled(cashFlowSummary.operatingOutflow) }})</td>
            </tr>
            <tr class="border-top fw-bold">
              <td v-if="showCoaCodes"></td>
              <td class="ps-3 text-dark">Arus Kas Bersih dari Aktivitas Operasi</td>
              <td class="text-end font-monospace" :class="cashFlowSummary.netOperating >= 0 ? 'text-primary' : 'text-danger'">
                {{ formatScaled(cashFlowSummary.netOperating) }}
              </td>
            </tr>

            <!-- INVESTASI -->
            <tr class="table-light fw-bold">
              <td :colspan="showCoaCodes ? 3 : 2" class="text-dark pt-3">ARUS KAS DARI AKTIVITAS INVESTASI (INVESTING ACTIVITIES)</td>
            </tr>
            <tr>
              <td v-if="showCoaCodes" class="font-monospace text-muted small">CF-03</td>
              <td class="ps-3">Penerimaan dari Penjualan Aset / Hasil Investasi</td>
              <td class="text-end font-monospace text-success">{{ formatScaled(cashFlowSummary.investingInflow) }}</td>
            </tr>
            <tr>
              <td v-if="showCoaCodes" class="font-monospace text-muted small">CF-04</td>
              <td class="ps-3">Pembelian Perangkat / Aset Tetap Investasi</td>
              <td class="text-end font-monospace text-danger">({{ formatScaled(cashFlowSummary.investingOutflow) }})</td>
            </tr>
            <tr class="border-top fw-bold">
              <td v-if="showCoaCodes"></td>
              <td class="ps-3 text-dark">Arus Kas Bersih dari Aktivitas Investasi</td>
              <td class="text-end font-monospace" :class="cashFlowSummary.netInvesting >= 0 ? 'text-primary' : 'text-danger'">
                {{ formatScaled(cashFlowSummary.netInvesting) }}
              </td>
            </tr>

            <!-- PENDANAAN -->
            <tr class="table-light fw-bold">
              <td :colspan="showCoaCodes ? 3 : 2" class="text-dark pt-3">ARUS KAS DARI AKTIVITAS PENDANAAN (FINANCING ACTIVITIES)</td>
            </tr>
            <tr>
              <td v-if="showCoaCodes" class="font-monospace text-muted small">CF-05</td>
              <td class="ps-3">Penerimaan Kas dari Setoran Modal / Pinjaman</td>
              <td class="text-end font-monospace text-success">{{ formatScaled(cashFlowSummary.financingInflow) }}</td>
            </tr>
            <tr>
              <td v-if="showCoaCodes" class="font-monospace text-muted small">CF-06</td>
              <td class="ps-3">Pembayaran Deviden / Pelunasan Pokok Pinjaman</td>
              <td class="text-end font-monospace text-danger">({{ formatScaled(cashFlowSummary.financingOutflow) }})</td>
            </tr>
            <tr class="border-top fw-bold">
              <td v-if="showCoaCodes"></td>
              <td class="ps-3 text-dark">Arus Kas Bersih dari Aktivitas Pendanaan</td>
              <td class="text-end font-monospace" :class="cashFlowSummary.netFinancing >= 0 ? 'text-primary' : 'text-danger'">
                {{ formatScaled(cashFlowSummary.netFinancing) }}
              </td>
            </tr>

            <!-- REKONSILIASI KAS AKHIR -->
            <tr class="border-top border-2 border-dark fw-bold pt-3">
              <td v-if="showCoaCodes"></td>
              <td class="text-dark py-2">KENAIKAN (PENURUNAN) BERSIH KAS & SETARA KAS</td>
              <td class="text-end font-monospace text-primary py-2">{{ formatScaled(cashFlowSummary.netChange) }}</td>
            </tr>
            <tr>
              <td v-if="showCoaCodes"></td>
              <td class="text-muted">Kas & Setara Kas Pada Awal Periode</td>
              <td class="text-end font-monospace text-muted">{{ formatScaled(cashFlowSummary.beginningCash) }}</td>
            </tr>
            <tr class="table-success fw-bold border-top border-bottom border-3 border-success">
              <td v-if="showCoaCodes"></td>
              <td class="text-success fs-6 py-2.5">KAS & SETARA KAS PADA AKHIR PERIODE</td>
              <td class="text-end font-monospace text-success fs-6 py-2.5">{{ formatScaled(cashFlowSummary.endingCash) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footnotes PSAK (Policy Notes) -->
      <div class="mt-5 pt-3 border-top" v-if="showPsakFootnotes">
        <h6 class="fw-bold text-dark small text-uppercase">Catatan Kebijakan Akuntansi (Accounting Policies Note):</h6>
        <ol class="small text-muted mb-0 ps-3" style="font-size: 11px;">
          <li>Laporan disajikan berdasarkan data transaksi riil dan prinsip dasar akuntansi akrual sesuai Pernyataan Standar Akuntansi Keuangan (PSAK 1 Penyajian Laporan Keuangan).</li>
          <li>Aset tetap disusutkan menggunakan metode garis lurus (straight-line method) berdasarkan masa manfaat ekonomis yang diestimasi.</li>
          <li>Pajak penghasilan dihitung sesuai dengan tarif Undang-Undang Harmonisasi Peraturan Perpajakan (UU HPP) Republik Indonesia.</li>
        </ol>
      </div>

      <!-- Signature Section for Audit Documents -->
      <div class="row mt-5 pt-4 text-center">
        <div class="col-4">
          <div class="small text-muted mb-5">Disiapkan Oleh:</div>
          <div class="fw-bold text-dark text-decoration-underline">{{ companyProfile.preparerName || 'Staf Akuntansi' }}</div>
          <div class="small text-muted">{{ companyProfile.preparerRole || 'Staf Akuntansi' }}</div>
        </div>
        <div class="col-4">
          <div class="small text-muted mb-5">Diperiksa Oleh:</div>
          <div class="fw-bold text-dark text-decoration-underline">{{ companyProfile.reviewerName || 'Manajer Keuangan' }}</div>
          <div class="small text-muted">{{ companyProfile.reviewerRole || 'Manajer Keuangan' }}</div>
        </div>
        <div class="col-4">
          <div class="small text-muted mb-5">Disetujui Oleh:</div>
          <div class="fw-bold text-dark text-decoration-underline">{{ companyProfile.approverName || 'Arif Permana Putrasuryana' }}</div>
          <div class="small text-muted">{{ companyProfile.approverRole || 'Chief Financial Officer (CFO)' }}</div>
        </div>
      </div>
    </div>

    <!-- MODAL: ATUR PROFIL PERUSAHAAN & PENANDATANGAN -->
    <div
      v-if="showProfileModal"
      class="modal-backdrop-custom d-flex align-items-center justify-content-center"
      @click.self="showProfileModal = false"
    >
      <div class="modal-dialog-custom bg-white p-4 rounded-4 shadow-lg" style="max-width: 540px; width: 92%;">
        <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <h5 class="fw-bold mb-0 text-dark">Profil Dokumen & Penandatangan</h5>
          <button type="button" class="btn-close" @click="showProfileModal = false"></button>
        </div>

        <form @submit.prevent="saveCompanyProfile">
          <div class="mb-3">
            <label class="form-label small fw-bold text-dark">Nama Entitas / Perusahaan</label>
            <input type="text" class="form-control form-control-sm" v-model="profileForm.name" required />
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-dark">Alamat Kantor</label>
            <input type="text" class="form-control form-control-sm" v-model="profileForm.address" placeholder="Contoh: Gedung Office Tower Lt. 12, Jakarta" />
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-dark">NPWP Perusahaan</label>
            <input type="text" class="form-control form-control-sm" v-model="profileForm.taxId" placeholder="01.234.567.8-901.000" />
          </div>

          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-bold text-dark">Nama Pembuat</label>
              <input type="text" class="form-control form-control-sm" v-model="profileForm.preparerName" placeholder="Staf Akuntansi" />
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold text-dark">Jabatan Pembuat</label>
              <input type="text" class="form-control form-control-sm" v-model="profileForm.preparerRole" />
            </div>
          </div>

          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-bold text-dark">Nama Pemeriksa</label>
              <input type="text" class="form-control form-control-sm" v-model="profileForm.reviewerName" placeholder="Manajer Keuangan" />
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold text-dark">Jabatan Pemeriksa</label>
              <input type="text" class="form-control form-control-sm" v-model="profileForm.reviewerRole" />
            </div>
          </div>

          <div class="row g-2 mb-4">
            <div class="col-6">
              <label class="form-label small fw-bold text-dark">Nama Penyetuju</label>
              <input type="text" class="form-control form-control-sm" v-model="profileForm.approverName" placeholder="Arif Permana Putrasuryana" />
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold text-dark">Jabatan Penyetuju</label>
              <input type="text" class="form-control form-control-sm" v-model="profileForm.approverRole" />
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="showProfileModal = false">Batal</button>
            <button type="submit" class="btn btn-sm btn-primary rounded-pill px-4 fw-bold">Simpan Profil</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: TAMBAH POS AKUN MANUAL -->
    <div
      v-if="showCustomAccountModal"
      class="modal-backdrop-custom d-flex align-items-center justify-content-center"
      @click.self="showCustomAccountModal = false"
    >
      <div class="modal-dialog-custom bg-white p-4 rounded-4 shadow-lg" style="max-width: 500px; width: 92%;">
        <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <h5 class="fw-bold mb-0 text-dark">Tambah Pos Akun Laporan</h5>
          <button type="button" class="btn-close" @click="showCustomAccountModal = false"></button>
        </div>

        <form @submit.prevent="submitCustomAccount">
          <div class="mb-3">
            <label class="form-label small fw-bold text-dark">Kategori Pos Laporan</label>
            <select class="form-select form-select-sm" v-model="customAccountForm.category" required>
              <option value="revenue">Pendapatan Usaha (Revenue - P&L)</option>
              <option value="cogs">Beban Pokok Pendapatan (COGS - P&L)</option>
              <option value="opex">Beban Operasional (OPEX - P&L)</option>
              <option value="fixed_asset">Aset Tetap / Tidak Lancar (Balance Sheet)</option>
              <option value="liability">Kewajiban Jangka Pendek (Balance Sheet)</option>
              <option value="equity">Modal Disetor / Ekuitas (Balance Sheet)</option>
            </select>
          </div>

          <div class="row g-2 mb-3">
            <div class="col-4">
              <label class="form-label small fw-bold text-dark">Kode COA</label>
              <input type="text" class="form-control form-control-sm font-monospace" v-model="customAccountForm.coa" placeholder="Contoh: 4-100" required />
            </div>
            <div class="col-8">
              <label class="form-label small fw-bold text-dark">Nama Akun / Uraian</label>
              <input type="text" class="form-control form-control-sm" v-model="customAccountForm.name" placeholder="Contoh: Modal Disetor Pendiri" required />
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label small fw-bold text-dark">Nominal (Rp)</label>
            <input type="number" class="form-control form-control-sm font-monospace fw-bold" v-model.number="customAccountForm.amount" required />
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="showCustomAccountModal = false">Batal</button>
            <button type="submit" class="btn btn-sm btn-primary rounded-pill px-4 fw-bold">Tambahkan Pos</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import FinanceNavHeader from '../../components/FinanceNavHeader.vue';
import {
  formatRupiah,
  logAuditTrail,
  initFinanceSeedData,
  STORAGE_KEYS,
  safeGet,
  safeSet
} from '../../utils/financeSystemStore';

const REPORT_KEYS = {
  PROFILE: 'ft_finance_company_profile',
  CUSTOM_ACCOUNTS: 'ft_finance_custom_accounts'
};

export default {
  name: 'FinancialReportsView',
  components: {
    FinanceNavHeader
  },
  setup() {
    const activeReportTab = ref('pnl');

    // Date filters (Default current month / quarter)
    const now = new Date();
    const startOfYear = `${now.getFullYear()}-01-01`;
    const todayStr = now.toISOString().substring(0, 10);
    const filterStartDate = ref(startOfYear);
    const filterEndDate = ref(todayStr);

    const numberScale = ref('full'); // full | thousands | millions
    const showCoaCodes = ref(true);
    const showPsakFootnotes = ref(true);

    // Dynamic Company Profile
    const showProfileModal = ref(false);
    const companyProfile = ref(safeGet(REPORT_KEYS.PROFILE, {
      name: 'TaskArts Workspace',
      address: '',
      taxId: '',
      preparerName: 'Staf Akuntansi',
      preparerRole: 'Staf Akuntansi & Pajak',
      reviewerName: 'Manajer Keuangan',
      reviewerRole: 'Finance & Tax Manager',
      approverName: 'Arif Permana Putrasuryana',
      approverRole: 'Chief Financial Officer (CFO)'
    }));

    const profileForm = ref({ ...companyProfile.value });

    const openProfileModal = () => {
      profileForm.value = { ...companyProfile.value };
      showProfileModal.value = true;
    };

    const saveCompanyProfile = () => {
      companyProfile.value = { ...profileForm.value };
      safeSet(REPORT_KEYS.PROFILE, companyProfile.value);
      showProfileModal.value = false;
      Swal.fire({
        icon: 'success',
        title: 'Profil Disimpan',
        text: 'Informasi entitas laporan keuangan berhasil diperbarui.',
        timer: 1500,
        showConfirmButton: false
      });
    };

    // Custom accounts manually added by user
    const showCustomAccountModal = ref(false);
    const customAccounts = ref(safeGet(REPORT_KEYS.CUSTOM_ACCOUNTS, []));
    const customAccountForm = ref({
      category: 'revenue',
      coa: '',
      name: '',
      amount: 0
    });

    const openCustomAccountModal = () => {
      customAccountForm.value = {
        category: 'revenue',
        coa: '',
        name: '',
        amount: 0
      };
      showCustomAccountModal.value = true;
    };

    const submitCustomAccount = () => {
      const newAcc = {
        id: 'ACC-' + Date.now(),
        ...customAccountForm.value,
        isCustom: true
      };
      customAccounts.value.push(newAcc);
      safeSet(REPORT_KEYS.CUSTOM_ACCOUNTS, customAccounts.value);
      showCustomAccountModal.value = false;
      Swal.fire({
        icon: 'success',
        title: 'Pos Akun Ditambahkan',
        text: 'Pos akun berhasil dimasukkan ke laporan keuangan.',
        timer: 1300,
        showConfirmButton: false
      });
    };

    const removeCustomAccount = (id) => {
      customAccounts.value = customAccounts.value.filter(a => a.id !== id);
      safeSet(REPORT_KEYS.CUSTOM_ACCOUNTS, customAccounts.value);
    };

    // Raw stores
    const cashFlowList = ref([]);
    const arInvoices = ref([]);
    const apBills = ref([]);
    const claimsList = ref([]);

    const loadStores = () => {
      initFinanceSeedData();
      cashFlowList.value = safeGet(STORAGE_KEYS.CASHFLOW, []);
      arInvoices.value = safeGet(STORAGE_KEYS.AR_INVOICES, []);
      apBills.value = safeGet(STORAGE_KEYS.AP_BILLS, []);
      claimsList.value = safeGet(STORAGE_KEYS.CLAIMS, []);
      customAccounts.value = safeGet(REPORT_KEYS.CUSTOM_ACCOUNTS, []);
    };

    // Dynamic Profit & Loss Data
    const pnlData = computed(() => {
      // 1. Revenues from CashFlow inflow & Paid AR
      const revenues = [];
      const inflowItems = cashFlowList.value.filter(c => c.type === 'inflow');
      
      const inflowGroup = {};
      inflowItems.forEach(item => {
        const cat = item.category || item.description || 'Pendapatan Jasa';
        inflowGroup[cat] = (inflowGroup[cat] || 0) + Number(item.amount || 0);
      });
      Object.keys(inflowGroup).forEach((cat, idx) => {
        revenues.push({
          coa: `4-${100 + idx * 10}`,
          name: `Pendapatan: ${cat}`,
          amount: inflowGroup[cat],
          isCustom: false
        });
      });

      // Add custom revenues
      customAccounts.value.filter(a => a.category === 'revenue').forEach(a => {
        revenues.push({ id: a.id, coa: a.coa || '4-900', name: a.name, amount: Number(a.amount || 0), isCustom: true });
      });

      // 2. COGS (Beban Pokok Pendapatan)
      const cogs = [];
      const cogsCustom = customAccounts.value.filter(a => a.category === 'cogs');
      cogsCustom.forEach(a => {
        cogs.push({ id: a.id, coa: a.coa || '5-100', name: a.name, amount: Number(a.amount || 0), isCustom: true });
      });

      // 3. OPEX (Beban Operasional)
      const opex = [];
      const outflowItems = cashFlowList.value.filter(c => c.type === 'outflow');
      const outflowGroup = {};
      outflowItems.forEach(item => {
        const cat = item.category || item.description || 'Beban Operasional';
        outflowGroup[cat] = (outflowGroup[cat] || 0) + Number(item.amount || 0);
      });
      Object.keys(outflowGroup).forEach((cat, idx) => {
        opex.push({
          coa: `6-${100 + idx * 10}`,
          name: `Beban: ${cat}`,
          amount: outflowGroup[cat],
          isCustom: false
        });
      });

      // Approved expense claims
      const paidClaims = claimsList.value.filter(c => c.status === 'Paid' || c.status === 'Approved');
      if (paidClaims.length > 0) {
        const claimSum = paidClaims.reduce((s, c) => s + Number(c.amount || 0), 0);
        opex.push({
          coa: '6-350',
          name: 'Klaim Pengeluaran Karyawan (Reimbursement)',
          amount: claimSum,
          isCustom: false
        });
      }

      // Add custom opex
      customAccounts.value.filter(a => a.category === 'opex').forEach(a => {
        opex.push({ id: a.id, coa: a.coa || '6-900', name: a.name, amount: Number(a.amount || 0), isCustom: true });
      });

      return { revenues, cogs, opex };
    });

    // P&L Calculations
    const totalRevenue = computed(() => pnlData.value.revenues.reduce((s, r) => s + r.amount, 0));
    const totalCogs = computed(() => pnlData.value.cogs.reduce((s, c) => s + c.amount, 0));
    const grossProfit = computed(() => totalRevenue.value - totalCogs.value);
    const totalOpex = computed(() => pnlData.value.opex.reduce((s, o) => s + o.amount, 0));
    const operatingProfit = computed(() => grossProfit.value - totalOpex.value);
    const taxExpense = computed(() => operatingProfit.value > 0 ? Math.round(operatingProfit.value * 0.22) : 0);
    const netProfit = computed(() => operatingProfit.value - taxExpense.value);

    // Balance Sheet Calculations
    const balanceSheetData = computed(() => {
      const currentAssets = [];
      const totalCashInflow = cashFlowList.value.filter(c => c.type === 'inflow').reduce((s, c) => s + Number(c.amount || 0), 0);
      const totalCashOutflow = cashFlowList.value.filter(c => c.type === 'outflow').reduce((s, c) => s + Number(c.amount || 0), 0);
      const netCash = totalCashInflow - totalCashOutflow;
      currentAssets.push({
        coa: '1-100',
        name: 'Kas & Setara Kas (Rekening Bank / Kasir)',
        amount: netCash
      });

      const unpaidAr = arInvoices.value.filter(a => a.status !== 'Paid').reduce((s, a) => s + Number(a.amount || 0), 0);
      if (unpaidAr > 0 || arInvoices.value.length > 0) {
        currentAssets.push({
          coa: '1-200',
          name: 'Piutang Usaha Klien (AR Lancar)',
          amount: unpaidAr
        });
      }

      const fixedAssets = [];
      customAccounts.value.filter(a => a.category === 'fixed_asset').forEach(a => {
        fixedAssets.push({ coa: a.coa || '1-800', name: a.name, amount: Number(a.amount || 0) });
      });

      const currentLiabilities = [];
      const unpaidAp = apBills.value.filter(b => b.status !== 'Paid').reduce((s, b) => s + Number(b.amount || 0), 0);
      if (unpaidAp > 0 || apBills.value.length > 0) {
        currentLiabilities.push({
          coa: '2-100',
          name: 'Hutang Usaha Vendor (AP)',
          amount: unpaidAp
        });
      }
      customAccounts.value.filter(a => a.category === 'liability').forEach(a => {
        currentLiabilities.push({ coa: a.coa || '2-200', name: a.name, amount: Number(a.amount || 0) });
      });

      const equity = [];
      customAccounts.value.filter(a => a.category === 'equity').forEach(a => {
        equity.push({ coa: a.coa || '3-100', name: a.name, amount: Number(a.amount || 0) });
      });

      equity.push({
        coa: '3-300',
        name: 'Laba Bersih Tahun Berjalan',
        amount: netProfit.value
      });

      return { currentAssets, fixedAssets, currentLiabilities, equity };
    });

    const totalCurrentAssets = computed(() => balanceSheetData.value.currentAssets.reduce((s, a) => s + a.amount, 0));
    const totalFixedAssets = computed(() => balanceSheetData.value.fixedAssets.reduce((s, a) => s + a.amount, 0));
    const totalAssets = computed(() => totalCurrentAssets.value + totalFixedAssets.value);
    const totalLiabilities = computed(() => balanceSheetData.value.currentLiabilities.reduce((s, l) => s + l.amount, 0));
    const totalEquity = computed(() => balanceSheetData.value.equity.reduce((s, e) => s + e.amount, 0));
    const totalLiabilitiesAndEquity = computed(() => totalLiabilities.value + totalEquity.value);
    const balanceDiscrepancy = computed(() => totalAssets.value - totalLiabilitiesAndEquity.value);

    // Cash Flow Statement (PSAK 2)
    const cashFlowSummary = computed(() => {
      const opInflow = cashFlowList.value
        .filter(c => c.type === 'inflow' && (!c.category || !c.category.toLowerCase().includes('investasi') && !c.category.toLowerCase().includes('pendanaan')))
        .reduce((s, c) => s + Number(c.amount || 0), 0);

      const opOutflow = cashFlowList.value
        .filter(c => c.type === 'outflow' && (!c.category || !c.category.toLowerCase().includes('investasi') && !c.category.toLowerCase().includes('pendanaan')))
        .reduce((s, c) => s + Number(c.amount || 0), 0);

      const invInflow = cashFlowList.value
        .filter(c => c.type === 'inflow' && c.category && c.category.toLowerCase().includes('investasi'))
        .reduce((s, c) => s + Number(c.amount || 0), 0);

      const invOutflow = cashFlowList.value
        .filter(c => c.type === 'outflow' && c.category && c.category.toLowerCase().includes('investasi'))
        .reduce((s, c) => s + Number(c.amount || 0), 0);

      const finInflow = cashFlowList.value
        .filter(c => c.type === 'inflow' && c.category && c.category.toLowerCase().includes('pendanaan'))
        .reduce((s, c) => s + Number(c.amount || 0), 0);

      const finOutflow = cashFlowList.value
        .filter(c => c.type === 'outflow' && c.category && c.category.toLowerCase().includes('pendanaan'))
        .reduce((s, c) => s + Number(c.amount || 0), 0);

      const netOperating = opInflow - opOutflow;
      const netInvesting = invInflow - invOutflow;
      const netFinancing = finInflow - finOutflow;
      const netChange = netOperating + netInvesting + netFinancing;
      const beginningCash = 0;
      const endingCash = beginningCash + netChange;

      return {
        operatingInflow: opInflow,
        operatingOutflow: opOutflow,
        netOperating,
        investingInflow: invInflow,
        investingOutflow: invOutflow,
        netInvesting,
        financingInflow: finInflow,
        financingOutflow: finOutflow,
        netFinancing,
        netChange,
        beginningCash,
        endingCash
      };
    });

    const currentReportTitle = computed(() => {
      if (activeReportTab.value === 'pnl') return 'LAPORAN LABA RUGI KOMPREHENSIF (PROFIT & LOSS)';
      if (activeReportTab.value === 'balance-sheet') return 'LAPORAN POSISI KEUANGAN (NERACA / BALANCE SHEET)';
      return 'LAPORAN ARUS KAS (CASH FLOW STATEMENT - PSAK 2)';
    });

    const formatScaled = (num) => {
      if (num === null || num === undefined || isNaN(num)) return '0';
      let val = Number(num);
      if (numberScale.value === 'thousands') val = Math.round(val / 1000);
      else if (numberScale.value === 'millions') val = (val / 1000000).toFixed(2);
      return val.toLocaleString('id-ID');
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return '-';
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    // Print PDF
    const printReportPdf = () => {
      logAuditTrail({
        module: 'Pelaporan PSAK/IFRS',
        action: 'PRINT_PDF',
        details: `Mencetak dokumen resmi ${currentReportTitle.value} untuk keperluan audit`
      });
      window.print();
    };

    // Export Excel
    const exportReportExcel = () => {
      const rows = [];
      rows.push([companyProfile.value.name]);
      rows.push([currentReportTitle.value]);
      rows.push([`Periode: ${filterStartDate.value} s/d ${filterEndDate.value}`]);
      rows.push([]);

      if (activeReportTab.value === 'pnl') {
        rows.push(['Kode Akun', 'Uraian Akun', 'Nominal (IDR)']);
        pnlData.value.revenues.forEach(r => rows.push([r.coa, r.name, r.amount]));
        rows.push(['', 'TOTAL PENDAPATAN', totalRevenue.value]);
        rows.push([]);
        pnlData.value.cogs.forEach(c => rows.push([c.coa, c.name, -c.amount]));
        rows.push(['', 'LABA KOTOR', grossProfit.value]);
        rows.push([]);
        pnlData.value.opex.forEach(o => rows.push([o.coa, o.name, -o.amount]));
        rows.push(['', 'LABA USAHA (EBIT)', operatingProfit.value]);
        rows.push(['8-100', 'Beban PPh Badan (22%)', -taxExpense.value]);
        rows.push(['', 'LABA BERSIH (NET PROFIT)', netProfit.value]);
      } else if (activeReportTab.value === 'balance-sheet') {
        rows.push(['Komponen', 'Nominal (IDR)']);
        rows.push(['Total Aset', totalAssets.value]);
        rows.push(['Total Kewajiban', totalLiabilities.value]);
        rows.push(['Total Ekuitas', totalEquity.value]);
        rows.push(['Total Kewajiban & Ekuitas', totalLiabilitiesAndEquity.value]);
      } else {
        rows.push(['Aktivitas Arus Kas', 'Nominal (IDR)']);
        rows.push(['Arus Kas Bersih Operasi', cashFlowSummary.value.netOperating]);
        rows.push(['Arus Kas Bersih Investasi', cashFlowSummary.value.netInvesting]);
        rows.push(['Arus Kas Bersih Pendanaan', cashFlowSummary.value.netFinancing]);
        rows.push(['Kas Akhir Periode', cashFlowSummary.value.endingCash]);
      }

      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan');
      XLSX.writeFile(wb, `Laporan_Keuangan_PSAK_${activeReportTab.value}_${filterEndDate.value}.xlsx`);

      logAuditTrail({
        module: 'Pelaporan PSAK/IFRS',
        action: 'EXPORT_EXCEL',
        details: `Mengunduh berkas ${currentReportTitle.value} ke format Excel (.xlsx)`
      });

      Swal.fire({
        icon: 'success',
        title: 'Laporan Diekspor',
        text: 'Berkas Excel laporan keuangan resmi berhasil diunduh.',
        timer: 1500,
        showConfirmButton: false
      });
    };

    // Export CSV
    const exportReportCsv = () => {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Akun,Keterangan,Nominal\n';
      if (activeReportTab.value === 'pnl') {
        pnlData.value.revenues.forEach(r => { csvContent += `"${r.coa}","${r.name}",${r.amount}\n`; });
        pnlData.value.cogs.forEach(c => { csvContent += `"${c.coa}","${c.name}",-${c.amount}\n`; });
        pnlData.value.opex.forEach(o => { csvContent += `"${o.coa}","${o.name}",-${o.amount}\n`; });
        csvContent += `"","Laba Bersih",${netProfit.value}\n`;
      } else {
        csvContent += `"1-000","Total Aset",${totalAssets.value}\n`;
        csvContent += `"2-000","Total Kewajiban",${totalLiabilities.value}\n`;
        csvContent += `"3-000","Total Ekuitas",${totalEquity.value}\n`;
      }
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Laporan_${activeReportTab.value}_${filterEndDate.value}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    onMounted(() => {
      loadStores();
    });

    return {
      activeReportTab,
      filterStartDate,
      filterEndDate,
      numberScale,
      showCoaCodes,
      showPsakFootnotes,
      companyProfile,
      showProfileModal,
      profileForm,
      openProfileModal,
      saveCompanyProfile,
      showCustomAccountModal,
      customAccountForm,
      openCustomAccountModal,
      submitCustomAccount,
      removeCustomAccount,
      pnlData,
      balanceSheetData,
      cashFlowSummary,
      totalRevenue,
      totalCogs,
      grossProfit,
      totalOpex,
      operatingProfit,
      taxExpense,
      netProfit,
      totalCurrentAssets,
      totalFixedAssets,
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalLiabilitiesAndEquity,
      balanceDiscrepancy,
      currentReportTitle,
      formatScaled,
      formatDate,
      printReportPdf,
      exportReportExcel,
      exportReportCsv,
      formatRupiah
    };
  }
};
</script>

<style scoped>
.font-monospace {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
.tracking-wide {
  letter-spacing: 0.05em;
}
.report-table tbody tr td {
  padding-top: 0.45rem;
  padding-bottom: 0.45rem;
}
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  z-index: 1080;
}
@media print {
  .no-print {
    display: none !important;
  }
  .print-container {
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
  }
}
</style>
