<template>
  <div :class="['bank-address-root', { 'in-modal-wrapper': inModal, 'standalone-card p-3.5 p-md-4 rounded-4 bg-white shadow-sm border': !inModal }]">
    <!-- Header Section (Only if not in modal, or simplified if in modal) -->
    <div class="text-center mb-3.5" v-if="!inModal">
      <div class="d-inline-flex align-items-center justify-content-center gap-2 mb-1.5">
        <span class="fs-3">💝</span>
        <h2 class="fw-black text-dark tracking-wide mb-0 text-uppercase" style="font-size: 1.5rem; letter-spacing: 0.5px;">
          Dukung Pengembang
        </h2>
      </div>
      <p class="text-muted small fw-semibold mb-0" style="max-width: 540px; margin: 0 auto; line-height: 1.45;">
        Apresiasi Anda sangat berarti untuk membiayai server, domain, dan kelanjutan fitur inovatif <strong>TaskArts</strong> by Kafeinarts.
      </p>
    </div>

    <!-- 1. Interactive Nominal Suggestion Chips -->
    <div class="nominal-preset-box p-3 rounded-4 mb-3 border bg-light-subtle">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <span class="small fw-bold text-dark d-flex align-items-center gap-1.5" style="font-size: 12px;">
          <i class="bi bi-cup-hot-fill text-warning"></i>
          <span>Pilih Nominal Apresiasi (Saran):</span>
        </span>
        <span v-if="selectedNominal !== 'custom'" class="badge bg-primary-subtle text-primary rounded-pill px-2 py-0.5 small fw-bold">
          {{ formatNominalBadge(selectedNominal) }}
        </span>
      </div>

      <div class="d-flex flex-wrap gap-1.5 nominal-chips-wrap">
        <button
          v-for="chip in nominalOptions"
          :key="chip.value"
          type="button"
          class="btn btn-sm nominal-chip-btn rounded-pill fw-bold"
          :class="{ 'active': selectedNominal === chip.value }"
          @click="selectNominal(chip.value)"
        >
          <span>{{ chip.icon }} {{ chip.label }}</span>
        </button>
      </div>
    </div>

    <!-- 2. Channel Category Filter Tabs -->
    <div class="channel-tabs-container d-flex gap-1.5 mb-3 overflow-x-auto pb-1">
      <button
        v-for="tab in channelTabs"
        :key="tab.id"
        type="button"
        class="btn btn-sm channel-tab-btn rounded-pill fw-bold d-flex align-items-center gap-1.5 text-nowrap"
        :class="{ 'active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.label }}</span>
        <span class="badge rounded-pill tab-count-badge">{{ tab.count }}</span>
      </button>
    </div>

    <!-- 3. QRIS Special View (If Tab QRIS is selected) -->
    <div v-if="activeTab === 'qris'" class="qris-card-wrapper p-3.5 p-sm-4 rounded-4 text-center border shadow-xs mb-3 bg-white">
      <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
        <div class="d-flex align-items-center gap-2">
          <span class="badge bg-danger text-white fw-bold px-2.5 py-1 rounded-pill">QRIS</span>
          <span class="fw-bold text-dark small">Standar Pembayaran Nasional</span>
        </div>
        <span class="text-success small fw-semibold">
          <i class="bi bi-shield-check me-1"></i> Terverifikasi
        </span>
      </div>

      <!-- Merchant Info -->
      <div class="mb-3">
        <h5 class="fw-extrabold text-dark mb-0.5">ARIF PERMANA PUTRASURYANA</h5>
        <div class="small text-muted fw-semibold">Kafeinarts Studio • TaskArts Work Suite</div>
      </div>

      <!-- QR Code Visual Box -->
      <div class="qris-qr-frame mx-auto p-3 rounded-3 bg-white shadow-sm border mb-3 position-relative" style="max-width: 240px;">
        <svg viewBox="0 0 200 200" width="100%" height="auto" class="rounded">
          <!-- Background -->
          <rect width="200" height="200" fill="#ffffff" />
          <!-- QR Positioning Markers Top-Left -->
          <rect x="15" y="15" width="45" height="45" rx="6" fill="#1e293b" />
          <rect x="23" y="23" width="29" height="29" rx="3" fill="#ffffff" />
          <rect x="29" y="29" width="17" height="17" rx="2" fill="#1e293b" />
          <!-- QR Positioning Markers Top-Right -->
          <rect x="140" y="15" width="45" height="45" rx="6" fill="#1e293b" />
          <rect x="148" y="23" width="29" height="29" rx="3" fill="#ffffff" />
          <rect x="154" y="29" width="17" height="17" rx="2" fill="#1e293b" />
          <!-- QR Positioning Markers Bottom-Left -->
          <rect x="15" y="140" width="45" height="45" rx="6" fill="#1e293b" />
          <rect x="23" y="148" width="29" height="29" rx="3" fill="#ffffff" />
          <rect x="29" y="154" width="17" height="17" rx="2" fill="#1e293b" />
          <!-- Data Pattern Simulated Dots -->
          <rect x="70" y="20" width="12" height="12" rx="2" fill="#2563eb" />
          <rect x="90" y="20" width="8" height="8" rx="2" fill="#1e293b" />
          <rect x="110" y="20" width="14" height="14" rx="2" fill="#2563eb" />
          <rect x="70" y="40" width="16" height="16" rx="3" fill="#1e293b" />
          <rect x="95" y="38" width="10" height="10" rx="2" fill="#2563eb" />
          <rect x="115" y="45" width="12" height="12" rx="2" fill="#1e293b" />
          <rect x="20" y="70" width="14" height="14" rx="2" fill="#1e293b" />
          <rect x="42" y="72" width="10" height="10" rx="2" fill="#2563eb" />
          <rect x="60" y="70" width="18" height="18" rx="3" fill="#1e293b" />
          <rect x="88" y="68" width="24" height="24" rx="4" fill="#2563eb" />
          <rect x="120" y="70" width="15" height="15" rx="2" fill="#1e293b" />
          <rect x="145" y="72" width="20" height="20" rx="3" fill="#2563eb" />
          <rect x="172" y="70" width="14" height="14" rx="2" fill="#1e293b" />
          <!-- Center Logo Badge -->
          <rect x="80" y="80" width="40" height="40" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
          <text x="100" y="104" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#2563eb" text-anchor="middle">Task</text>
          <!-- Bottom Data Dots -->
          <rect x="70" y="125" width="18" height="18" rx="3" fill="#1e293b" />
          <rect x="98" y="130" width="12" height="12" rx="2" fill="#2563eb" />
          <rect x="120" y="125" width="18" height="18" rx="3" fill="#1e293b" />
          <rect x="150" y="128" width="16" height="16" rx="2" fill="#2563eb" />
          <rect x="175" y="125" width="12" height="12" rx="2" fill="#1e293b" />
          <rect x="70" y="155" width="14" height="14" rx="2" fill="#2563eb" />
          <rect x="92" y="152" width="20" height="20" rx="3" fill="#1e293b" />
          <rect x="122" y="155" width="14" height="14" rx="2" fill="#2563eb" />
          <rect x="145" y="152" width="25" height="25" rx="4" fill="#1e293b" />
          <rect x="178" y="155" width="10" height="10" rx="2" fill="#2563eb" />
        </svg>
        <div class="small fw-bold text-muted mt-1.5" style="font-size: 10.5px;">NMID: ID1020038910482</div>
      </div>

      <p class="small text-muted mb-3 lh-sm" style="font-size: 11.5px;">
        Bisa di-scan dari <strong>BCA, Mandiri Livin, BRImo, BNI, GoPay, OVO, DANA, ShopeePay</strong>, dan seluruh aplikasi bank m-Banking Indonesia.
      </p>

      <div class="d-flex flex-wrap gap-2 justify-content-center">
        <button
          type="button"
          class="btn btn-sm btn-outline-dark rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-1.5"
          @click="copyText('0895343226354', 'Nomor HP QRIS')"
        >
          <i class="bi bi-clipboard"></i>
          <span>Salin Nomor HP QRIS (0895-3432-26354)</span>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-primary rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-1.5 shadow-xs"
          @click="activeTab = 'all'"
        >
          <i class="bi bi-card-checklist"></i>
          <span>Lihat Nomor Rekening & E-Wallet</span>
        </button>
      </div>
    </div>

    <!-- 4. Bank & E-Wallet Cards List (Mobile-first Touch Friendly) -->
    <div v-else class="row g-2.5 g-sm-3 mb-3">
      <div
        v-for="card in filteredCards"
        :key="card.key"
        class="col-12 col-md-6"
      >
        <div 
          class="account-card p-3 p-sm-3.5 rounded-4 h-100 position-relative transition-all"
          :class="[card.cardClass, { 'copied-highlight': copiedKey === card.key }]"
          @click="handleCardClick(card)"
          title="Klik untuk salin nomor"
        >
          <!-- Card Top: Icon, Title & Badge -->
          <div class="d-flex align-items-center justify-content-between mb-2 pb-1">
            <div class="d-flex align-items-center gap-2">
              <div class="brand-avatar-box" :style="{ backgroundColor: card.avatarBg, color: card.avatarColor }">
                <i :class="card.icon" class="fs-5"></i>
              </div>
              <div>
                <h6 class="fw-extrabold mb-0 account-card-title text-dark">{{ card.name }}</h6>
                <span class="small text-muted" style="font-size: 11px;">{{ card.subtitle }}</span>
              </div>
            </div>
            <span class="badge rounded-pill px-2.5 py-1 small fw-bold" :style="{ backgroundColor: card.badgeBg, color: card.badgeColor }">
              {{ card.badgeText }}
            </span>
          </div>

          <!-- Card Middle: Digits with 1-Tap Copy Action -->
          <div class="account-digits-box p-2.5 rounded-3 mb-2 d-flex align-items-center justify-content-between gap-2">
            <div class="lh-1">
              <div class="small text-muted fw-bold text-uppercase" style="font-size: 10px; letter-spacing: 0.5px;">
                {{ card.typeLabel }}
              </div>
              <div class="account-number-display fw-black font-monospace text-dark mt-1">
                {{ card.formattedNumber }}
              </div>
            </div>

            <!-- Big 1-Tap Copy Button -->
            <button
              type="button"
              class="btn btn-sm copy-btn rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-1 shadow-xs"
              :class="copiedKey === card.key ? 'btn-success text-white' : 'btn-outline-theme-accent'"
              @click.stop="copyCardNumber(card)"
              :title="'Salin ' + card.name"
            >
              <i :class="copiedKey === card.key ? 'bi bi-check2-circle fs-6' : 'bi bi-copy'"></i>
              <span class="copy-btn-label">{{ copiedKey === card.key ? 'Tersalin!' : 'Salin' }}</span>
            </button>
          </div>

          <!-- Card Footer: Owner Name -->
          <div class="d-flex align-items-center justify-content-between text-muted small" style="font-size: 11px;">
            <div class="text-truncate me-2">
              <span class="text-secondary fw-semibold">a.n. </span>
              <strong class="text-dark">{{ card.ownerName }}</strong>
            </div>
            <span class="copy-hint text-primary fw-bold d-none d-sm-inline">
              <i class="bi bi-hand-index-thumb me-0.5"></i>Tap Salin
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Thank You & Appreciation Note Box -->
    <div class="thank-you-box p-3 rounded-4 border bg-amber-subtle mb-3">
      <div class="d-flex align-items-start gap-2.5">
        <span class="fs-4 lh-1">🙏</span>
        <div>
          <h6 class="fw-extrabold text-amber-900 mb-1" style="font-size: 13.5px;">Apresiasi Hangat untuk Anda</h6>
          <p class="small text-amber-900 mb-0 lh-sm" style="font-size: 11.5px;">
            Dukungan berapapun nilainya sangat membantu kami menjaga TaskArts tetap cepat, bebas iklan mengganggu, dan terus diperbarui dengan fitur-fitur baru. Simpan halaman ini dengan cara screenshot jika suatu saat dibutuhkan.
          </p>
        </div>
      </div>
    </div>

    <!-- 6. Mobile-Optimized Action Bar -->
    <div class="action-footer-container pt-2.5 border-top">
      <!-- Mobile: Clean 2-column or stacked stylish layout -->
      <div class="d-flex flex-column flex-sm-row flex-wrap align-items-stretch align-items-sm-center justify-content-between gap-2">
        <div class="d-flex flex-column flex-sm-row gap-2 flex-grow-1">
          <!-- Copy All Details -->
          <button 
            type="button"
            class="btn btn-sm btn-dark rounded-pill px-3 py-2 fw-bold d-flex align-items-center justify-content-center gap-1.5 shadow-xs action-pill-btn"
            @click="copyAllBankInfo"
          >
            <i class="bi bi-clipboard-check-fill text-warning"></i>
            <span>Salin Semua Rekening</span>
          </button>

          <!-- WhatsApp Confirmation -->
          <a 
            :href="whatsappConfirmUrl" 
            target="_blank" 
            class="btn btn-sm btn-success rounded-pill px-3 py-2 fw-bold d-flex align-items-center justify-content-center gap-1.5 shadow-xs action-pill-btn"
          >
            <i class="bi bi-whatsapp"></i>
            <span>Konfirmasi Donasi via WA</span>
          </a>
        </div>

        <!-- Trakteer Online -->
        <a 
          href="https://trakteer.id/itsmebroarif/tip?open=true" 
          target="_blank" 
          class="btn btn-sm btn-outline-danger rounded-pill px-3.5 py-2 fw-bold d-flex align-items-center justify-content-center gap-1.5 shadow-xs action-pill-btn text-nowrap"
        >
          <i class="bi bi-cup-hot-fill text-danger"></i>
          <span>Traktir Kopi (Trakteer)</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';

export default {
  name: 'BankAddressCards',
  props: {
    inModal: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const copiedKey = ref(null);
    const activeTab = ref('all');
    const selectedNominal = ref('25000');

    const nominalOptions = [
      { value: '10000', label: 'Rp 10.000', icon: '☕' },
      { value: '25000', label: 'Rp 25.000', icon: '⚡' },
      { value: '50000', label: 'Rp 50.000', icon: '🚀' },
      { value: '100000', label: 'Rp 100.000', icon: '🌟' },
      { value: 'custom', label: 'Sukarela', icon: '💖' }
    ];

    const channelTabs = [
      { id: 'all', label: 'Semua Rekening', icon: 'bi-grid-fill', count: 4 },
      { id: 'ewallet', label: 'E-Wallet', icon: 'bi-wallet2', count: 3 },
      { id: 'bank', label: 'Transfer Bank', icon: 'bi-bank2', count: 1 },
      { id: 'qris', label: 'QRIS Scan', icon: 'bi-qr-code-scan', count: 'Scan' }
    ];

    const accounts = [
      {
        key: 'bsi',
        category: 'bank',
        name: 'Bank BSI',
        subtitle: 'Bank Syariah Indonesia (BI-FAST Bebas Biaya)',
        typeLabel: 'Nomor Rekening',
        rawNumber: '7367026237',
        formattedNumber: '7367 0262 37',
        ownerName: 'ARIF PERMANA PUTRASURYAN',
        icon: 'bi-bank2',
        avatarBg: '#ecfdf5',
        avatarColor: '#059669',
        badgeText: 'Transfer Bank',
        badgeBg: '#10b981',
        badgeColor: '#ffffff',
        cardClass: 'border-emerald'
      },
      {
        key: 'gopay',
        category: 'ewallet',
        name: 'GoPay',
        subtitle: 'Gojek Instant Transfer Bebas Biaya',
        typeLabel: 'Nomor HP / GoPay ID',
        rawNumber: '0895343226354',
        formattedNumber: '0895 3432 26354',
        ownerName: 'Arif PERMANA PUTRASURYANA',
        icon: 'bi-wallet-fill',
        avatarBg: '#f0fdf4',
        avatarColor: '#16a34a',
        badgeText: 'E-Wallet Instant',
        badgeBg: '#16a34a',
        badgeColor: '#ffffff',
        cardClass: 'border-gopay'
      },
      {
        key: 'dana',
        category: 'ewallet',
        name: 'DANA',
        subtitle: 'DANA Dompet Digital Indonesia',
        typeLabel: 'Nomor Akun DANA',
        rawNumber: '0895343226354',
        formattedNumber: '0895 3432 26354',
        ownerName: 'Arif PERMANA PUTRASURYANA',
        icon: 'bi-phone-fill',
        avatarBg: '#f0f9ff',
        avatarColor: '#0284c7',
        badgeText: 'E-Wallet',
        badgeBg: '#0284c7',
        badgeColor: '#ffffff',
        cardClass: 'border-dana'
      },
      {
        key: 'ovo',
        category: 'ewallet',
        name: 'OVO',
        subtitle: 'OVO Cash Premier',
        typeLabel: 'Nomor Ponsel OVO',
        rawNumber: '0895343226354',
        formattedNumber: '0895 3432 26354',
        ownerName: 'Arif PERMANA PUTRASURYANA',
        icon: 'bi-credit-card-2-front-fill',
        avatarBg: '#f5f3ff',
        avatarColor: '#7c3aed',
        badgeText: 'E-Wallet',
        badgeBg: '#7c3aed',
        badgeColor: '#ffffff',
        cardClass: 'border-ovo'
      }
    ];

    const filteredCards = computed(() => {
      if (activeTab.value === 'all') return accounts;
      return accounts.filter(c => c.category === activeTab.value);
    });

    const formatNominalBadge = (val) => {
      if (val === 'custom') return 'Sukarela';
      const num = parseInt(val, 10);
      return 'Rp ' + num.toLocaleString('id-ID');
    };

    const selectNominal = (val) => {
      selectedNominal.value = val;
    };

    const copyText = (text, label) => {
      navigator.clipboard.writeText(text).then(() => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });

        Toast.fire({
          icon: 'success',
          title: `${label} berhasil disalin!`,
          text: text
        });
      }).catch(() => {
        prompt('Salin teks secara manual:', text);
      });
    };

    const copyCardNumber = (card) => {
      navigator.clipboard.writeText(card.rawNumber).then(() => {
        copiedKey.value = card.key;
        setTimeout(() => {
          if (copiedKey.value === card.key) {
            copiedKey.value = null;
          }
        }, 2200);

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });

        Toast.fire({
          icon: 'success',
          title: `${card.name} berhasil disalin!`,
          text: card.rawNumber
        });
      }).catch(() => {
        prompt('Salin nomor secara manual:', card.rawNumber);
      });
    };

    const handleCardClick = (card) => {
      copyCardNumber(card);
    };

    const copyAllBankInfo = () => {
      const fullText = `💝 BANK ADDRESS & DUKUNG DEV (ARIF PERMANA PUTRASURYANA)
----------------------------------------
1. Bank BSI (Bank Syariah Indonesia)
   No. Rekening : 7367026237
   a.n.         : ARIF PERMANA PUTRASURYAN

2. GoPay (Gojek)
   No. HP       : 0895343226354
   a.n.         : Arif PERMANA PUTRASURYANA

3. DANA (Dompet Digital)
   No. HP       : 0895343226354
   a.n.         : Arif PERMANA PUTRASURYANA

4. OVO (Premier)
   No. HP       : 0895343226354
   a.n.         : Arif PERMANA PUTRASURYANA
----------------------------------------
Pilihan Donasi Online:
Trakteer: https://trakteer.id/itsmebroarif/tip?open=true

Terima kasih atas apresiasi dan dukungannya untuk pengembang TaskArts! 🙏`;

      navigator.clipboard.writeText(fullText).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Semua Rekening Berhasil Disalin!',
          text: 'Rincian nomor rekening BSI, GoPay, DANA, dan OVO telah disalin ke clipboard.',
          timer: 2500,
          showConfirmButton: false
        });
      });
    };

    const whatsappConfirmUrl = computed(() => {
      let nominalText = '';
      if (selectedNominal.value !== 'custom') {
        const num = parseInt(selectedNominal.value, 10);
        nominalText = ` sebesar Rp ${num.toLocaleString('id-ID')}`;
      }
      const msg = `Halo Mas Arif (Developer TaskArts), saya ingin konfirmasi bahwa saya telah mengirimkan dukungan donasi${nominalText} via Bank / E-Wallet. Terima kasih atas aplikasi hebat ini! 🙏`;
      return `https://wa.me/62895343226354?text=${encodeURIComponent(msg)}`;
    });

    return {
      copiedKey,
      activeTab,
      selectedNominal,
      nominalOptions,
      channelTabs,
      filteredCards,
      formatNominalBadge,
      selectNominal,
      copyText,
      copyCardNumber,
      handleCardClick,
      copyAllBankInfo,
      whatsappConfirmUrl
    };
  }
};
</script>

<style scoped>
.fw-black {
  font-weight: 900;
}

.shadow-xs {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.bank-address-root {
  width: 100%;
}

.in-modal-wrapper {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

/* Nominal Preset Chips */
.nominal-chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.nominal-chip-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-size: 12px;
  padding: 5px 12px;
  transition: all 0.18s ease;
  cursor: pointer;
}

.nominal-chip-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.nominal-chip-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
  transform: translateY(-1px);
}

/* Channel Tabs */
.channel-tabs-container {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.channel-tabs-container::-webkit-scrollbar {
  display: none;
}

.channel-tab-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 12px;
  padding: 6px 14px;
  transition: all 0.18s ease;
}

.channel-tab-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.channel-tab-btn.active {
  background: #0f172a;
  border-color: #0f172a;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.2);
}

.tab-count-badge {
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  font-size: 10px;
  padding: 2px 6px;
}

.channel-tab-btn:not(.active) .tab-count-badge {
  background: #e2e8f0;
  color: #475569;
}

/* Account Cards */
.account-card {
  background-color: #ffffff;
  border: 1.5px solid #e2e8f0;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
}

.account-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.account-card.border-emerald {
  border-color: #a7f3d0;
}
.account-card.border-emerald:hover {
  border-color: #10b981;
}

.account-card.border-gopay {
  border-color: #bbf7d0;
}
.account-card.border-gopay:hover {
  border-color: #16a34a;
}

.account-card.border-dana {
  border-color: #bae6fd;
}
.account-card.border-dana:hover {
  border-color: #0284c7;
}

.account-card.border-ovo {
  border-color: #ddd6fe;
}
.account-card.border-ovo:hover {
  border-color: #7c3aed;
}

.account-card.copied-highlight {
  border-color: #10b981 !important;
  background-color: #f0fdf4 !important;
  animation: pulseGreen 0.3s ease;
}

@keyframes pulseGreen {
  0% { transform: scale(0.98); }
  50% { transform: scale(1.01); }
  100% { transform: scale(1); }
}

.brand-avatar-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.account-digits-box {
  background: #f8fafc;
  border: 1px solid #edf2f7;
}

.account-number-display {
  font-size: 1.35rem;
  letter-spacing: 1px;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.btn-outline-theme-accent {
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  color: #1e293b;
  transition: all 0.15s ease;
}

.btn-outline-theme-accent:hover {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.bg-amber-subtle {
  background-color: #fefce8 !important;
  border-color: #fef08a !important;
}

.text-amber-900 {
  color: #713f12 !important;
}

.action-pill-btn {
  min-height: 40px;
}

/* =========================================================
   MOBILE RESPONSIVE STYLING (max-width: 768px)
   ========================================================= */
@media (max-width: 768px) {
  .account-number-display {
    font-size: 1.18rem;
  }

  .copy-btn {
    padding-left: 10px;
    padding-right: 10px;
    font-size: 12px;
  }

  .nominal-chip-btn {
    font-size: 11.5px;
    padding: 4px 10px;
  }

  .action-footer-container .btn {
    width: 100%;
    min-height: 44px;
  }
}
</style>
