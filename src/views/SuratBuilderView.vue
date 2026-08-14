<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-danger text-white fw-bold px-3 py-1.5 rounded-pill">✉️ Persuratan Resmi</span>
          <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-1.5 rounded-pill">Custom Kop Surat & Template Gallery</span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">✉️ Template Surat Menyurat & Kop Surat Designer</h2>
        <p class="text-muted mb-0">Buat surat kedinasan, izin, lamaran, penawaran, dan perjanjian kerja dengan Kop Surat otomatis & cetak standar instansi.</p>
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
      <h5 class="fw-bold text-dark mb-3"><i class="bi bi-collection text-primary me-2"></i>Pilih Template Jenis Surat</h5>
      <div class="row g-3">
        <div v-for="tmpl in letterTemplates" :key="tmpl.id" class="col-6 col-md-4 col-lg-3">
          <div
            class="card h-100 border-2 rounded-3 p-3 cursor-pointer transition-all text-center"
            :class="selectedTemplateId === tmpl.id ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'border-light bg-light'"
            @click="selectTemplate(tmpl)"
          >
            <div class="p-2 rounded-circle bg-white shadow-sm d-inline-block mx-auto mb-2" style="width: 44px; height: 44px;">
              <i :class="tmpl.icon" class="fs-4 text-primary"></i>
            </div>
            <h6 class="fw-bold text-dark small mb-1">{{ tmpl.title }}</h6>
            <span class="badge bg-secondary-subtle text-secondary small rounded-pill">{{ tmpl.category }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Editor & Preview Grid -->
    <div class="row g-4">
      <!-- Form Controls -->
      <div class="col-lg-5">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
          <h5 class="fw-bold text-dark mb-3 border-bottom pb-2"><i class="bi bi-pencil-square text-primary me-2"></i>Form Detail Surat</h5>

          <!-- Kop Surat Toggle -->
          <div class="form-check form-switch mb-3 bg-light p-3 rounded-3 border">
            <input class="form-check-input" type="checkbox" id="enableKop" v-model="letter.showKop" />
            <label class="form-check-label fw-bold text-dark small" for="enableKop">
              Tampilkan Kop Surat Resmi (Header Instansi)
            </label>
          </div>

          <div v-if="letter.showKop" class="mb-3 p-3 bg-light border rounded-3">
            <label class="form-label fw-bold text-dark small">Nama Instansi / Perusahaan Kop Surat</label>
            <input type="text" class="form-control form-control-sm mb-2" v-model="letter.kopName" placeholder="PT RAJINKERJA GLOBAL INDONESIA" />
            <label class="form-label fw-bold text-dark small">Alamat & Kontak Kop Surat</label>
            <input type="text" class="form-control form-control-sm" v-model="letter.kopAddress" placeholder="Jl. Sudirman No. 88 Jakarta | Telp: (021) 555-1234 | www.rajinkerja.id" />
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label fw-bold text-dark small">Nomor Surat</label>
              <input type="text" class="form-control form-control-sm" v-model="letter.number" placeholder="001/SK/RK/VIII/2026" />
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold text-dark small">Tanggal Surat</label>
              <input type="date" class="form-control form-control-sm" v-model="letter.date" />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold text-dark small">Perihal / Hal Surat</label>
            <input type="text" class="form-control form-control-sm" v-model="letter.subject" placeholder="Surat Penawaran Kerjasama Proyek" />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold text-dark small">Penerima / Kepada Yth.</label>
            <input type="text" class="form-control form-control-sm mb-1" v-model="letter.recipientName" placeholder="Bapak / Ibu Pimpinan PT Client Utama" />
            <input type="text" class="form-control form-control-sm" v-model="letter.recipientAddress" placeholder="Di Tempat / Jakarta Selatan" />
          </div>

          <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="form-label fw-bold text-dark small mb-0">Isi Surat / Narasi Utama</label>
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-xs btn-outline-primary rounded-pill px-2 py-0.5" @click="insertNewParagraph" title="Tambah Paragraf Baru">
                  <i class="bi bi-plus-circle me-1"></i> + Paragraf Baru
                </button>
                <button type="button" class="btn btn-xs btn-outline-secondary rounded-pill px-2 py-0.5 ms-1" @click="insertBulletList" title="Tambah Poin / Rincian">
                  <i class="bi bi-list-task me-1"></i> + Poin / List
                </button>
              </div>
            </div>
            <textarea class="form-control form-control-sm border-2 rounded-3" rows="9" v-model="letter.bodyContent" placeholder="Tuliskan isi surat lengkap di sini... (Gunakan Enter 2x untuk membuat paragraf baru)"></textarea>
            <div class="form-text small text-muted mt-1" style="font-size: 0.78rem;">
              <i class="bi bi-info-circle text-primary me-1"></i><strong>Tips Paragraf:</strong> Tekan <code>Enter</code> 2x (baris kosong) untuk membuat paragraf baru dengan alinea menjorok.
            </div>
          </div>

          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label fw-bold text-dark small">Nama Penandatangan</label>
              <input type="text" class="form-control form-control-sm" v-model="letter.signerName" placeholder="Arip Pratama, S.T." />
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold text-dark small">Jabatan Penandatangan</label>
              <input type="text" class="form-control form-control-sm" v-model="letter.signerTitle" placeholder="Direktur Utama" />
            </div>
          </div>
        </div>
      </div>

      <!-- Live Printable Preview -->
      <div class="col-lg-7">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 print-hide">
            <span class="fw-bold text-dark"><i class="bi bi-eye text-primary me-1"></i> Live Letter Preview</span>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-success rounded-pill px-3 fw-bold" @click="openWaModal">
                <i class="bi bi-whatsapp me-1"></i> Kirim WA
              </button>
              <button class="btn btn-sm btn-primary rounded-pill px-3 fw-bold" @click="printLetter">
                <i class="bi bi-printer me-1"></i> Cetak
              </button>
            </div>
          </div>

          <div id="letterPrintArea" class="letter-paper border shadow-sm p-5 bg-white text-dark mx-auto">
            <!-- Kop Surat Header -->
            <div v-if="letter.showKop" class="text-center border-bottom border-dark border-3 pb-3 mb-4">
              <h3 class="fw-extrabold mb-1 tracking-wide text-uppercase" style="letter-spacing: 1px;">{{ letter.kopName || 'PT RAJINKERJA GLOBAL INDONESIA' }}</h3>
              <p class="small text-muted mb-0">{{ letter.kopAddress || 'Jl. Jend. Sudirman No. 88, Jakarta Selatan | Telp: (021) 555-1234 | email: info@rajinkerja.id' }}</p>
            </div>

            <!-- Letter Metadata (Tanggal & Nomor) -->
            <div class="d-flex justify-content-between align-items-baseline mb-4">
              <div>
                <div><strong>Nomor:</strong> {{ letter.number || '001/SK/RK/VIII/2026' }}</div>
                <div><strong>Perihal:</strong> {{ letter.subject || 'Surat Penawaran Kerjasama' }}</div>
              </div>
              <div class="text-end">
                <div>Jakarta, {{ formattedDate }}</div>
              </div>
            </div>

            <!-- Recipient Block -->
            <div class="mb-4">
              <div>Kepada Yth.</div>
              <strong>{{ letter.recipientName || 'Bapak / Ibu Pimpinan' }}</strong>
              <div>{{ letter.recipientAddress || 'Di Tempat' }}</div>
            </div>

            <!-- Salutation & Body -->
            <div class="mb-4">
              <p class="mb-3">Dengan hormat,</p>

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
            <div class="d-flex justify-content-end mt-5 pt-4">
              <div class="text-center" style="min-width: 200px;">
                <p class="mb-5">Hormat Kami,</p>
                <strong class="d-block border-bottom border-dark pb-1">{{ letter.signerName || 'Arip Pratama, S.T.' }}</strong>
                <span class="small text-muted d-block mt-1">{{ letter.signerTitle || 'Direktur Utama' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- In-Page WhatsApp Panel (No Modal) -->
    <div v-if="showWaModal" class="card border-0 shadow rounded-4 p-4 my-4 bg-white border-top border-success border-4 print-hide">
      <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
        <h5 class="fw-bold mb-0 text-dark">
          <i class="bi bi-whatsapp text-success me-2"></i> Kirim Surat via WhatsApp
        </h5>
        <button type="button" class="btn-close" @click="closeWaModal"></button>
      </div>

      <div class="p-2">
        <!-- Source Selector: Contact vs Manual -->
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

        <!-- Contact Picker -->
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

        <!-- Manual Number Input -->
        <div v-if="waRecipientMode === 'manual'" class="mb-3 bg-light p-3 rounded-3 border">
          <label class="form-label fw-bold text-dark small">Nomor WhatsApp Tujuan</label>
          <input
            type="tel"
            class="form-control form-control-sm border-2"
            v-model="manualPhone"
            placeholder="Contoh: 081234567890 / 6281234567890"
          />
          <div class="form-text small text-muted">Format lokal (08...) akan otomatis dikonversi ke format WhatsApp internasional (628...).</div>
        </div>

        <!-- Message Preview / Editable -->
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

    const selectedTemplateId = ref('lamaran');

    const letterTemplates = [
      {
        id: 'lamaran',
        title: 'Surat Lamaran Kerja',
        category: 'Karier',
        icon: 'bi-briefcase-fill',
        subject: 'Lamaran Pekerjaan - Senior Frontend Developer',
        bodyContent: 'Sehubungan dengan informasi lowongan pekerjaan yang saya dapatkan, bersama surat ini saya bermaksud mengajukan diri untuk bergabung dengan perusahaan Bapak/Ibu sebagai Senior Frontend Developer.\n\nSaya memiliki pengalaman lebih dari 4 tahun dalam pengembangan aplikasi web modern menggunakan Vue 3, TypeScript, dan PWA. Saya yakin keahlian saya dapat memberikan kontribusi positif bagi tim.'
      },
      {
        id: 'pakelaring',
        title: 'Surat Keterangan Kerja',
        category: 'HRD',
        icon: 'bi-file-earmark-person-fill',
        subject: 'Surat Keterangan Kerja (Pakelaring)',
        bodyContent: 'Menerangkan bahwa nama tersebut di bawah ini pernah bekerja di PT RajinKerja Global Indonesia sejak 15 Januari 2023 sampai dengan 30 Juli 2026 dengan jabatan terakhir sebagai Software Architect.\n\nSelama bekerja, yang bersangkutan menunjukkan dedikasi, integritas, dan profesionalisme yang sangat baik. Kami mengucapkan terima kasih atas kontribusi yang telah diberikan.'
      },
      {
        id: 'penawaran',
        title: 'Surat Penawaran Proyek',
        category: 'Bisnis',
        icon: 'bi-journal-check',
        subject: 'Penawaran Kerjasama Pengembangan E-Commerce App',
        bodyContent: 'Merujuk pada diskusi kita sebelumnya mengenai rencana digitalisasi sistem penjualan perusahaan Bapak/Ibu, dengan ini kami mengajukan penawaran harga dan estimasi waktu pengerjaan aplikasi E-Commerce Mobile & Web.\n\nRincian fitur, arsitektur sistem, dan modul pembayaran telah kami lampirkan dalam dokumen proposal terpisah.'
      },
      {
        id: 'izin',
        title: 'Surat Izin Tidak Masuk',
        category: 'Pribadi',
        icon: 'bi-calendar-x-fill',
        subject: 'Permohonan Izin Tidak Masuk Kerja',
        bodyContent: 'Dengan ini saya memberitahukan bahwa saya tidak dapat hadir untuk bekerja pada hari ini dikarenakan kondisi kesehatan yang kurang baik dan memerlukan istirahat sesuai anjuran dokter.\n\nSegala tugas dan koordinasi yang bersifat mendesak akan saya teruskan kepada rekan tim.'
      },
      {
        id: 'undangan',
        title: 'Surat Undangan Rapat',
        category: 'Internal',
        icon: 'bi-people-fill',
        subject: 'Undangan Rapat Evaluasi Kinerja Kuartal III',
        bodyContent: 'Mengharap kehadiran Bapak/Ibu pada Rapat Evaluasi Kinerja Kuartal III yang akan dilaksanakan pada:\n\nHari / Tanggal : Senin, 10 Agustus 2026\nWaktu : 09:00 WIB - Selesai\nTempat : Ruang Rapat Utama & Via Google Meet\n\nDemikian undangan ini disampaikan, mengingat pentingnya agenda acara ini dimohon hadir tepat waktu.'
      },
      {
        id: 'tugas',
        title: 'Surat Tugas Dinas',
        category: 'Kedinasan',
        icon: 'bi-card-checklist',
        subject: 'Surat Perintah Tugas Dinas Luar Kota',
        bodyContent: 'Memberikan tugas kepada tim teknis untuk melaksanakan kunjungan dinas dan audit infrastruktur server pada lokasi cabang Bali selama 3 hari terhitung sejak tanggal 12 s.d 15 Agustus 2026.\n\nDemikian surat tugas ini dibuat untuk dilaksanakan dengan penuh rasa tanggung jawab.'
      }
    ];

    const letter = ref({
      showKop: true,
      kopName: 'PT RAJINKERJA GLOBAL INDONESIA',
      kopAddress: 'Gedung Menara RajinKerja Lt. 12, Jl. Jend. Sudirman No. 88 Jakarta | Telp: (021) 555-1234',
      number: '001/SK/RK/VIII/2026',
      date: new Date().toISOString().split('T')[0],
      subject: letterTemplates[0].subject,
      recipientName: 'Bapak / Ibu Pimpinan HRD',
      recipientAddress: 'Di Tempat / Jakarta',
      bodyContent: letterTemplates[0].bodyContent,
      signerName: 'Arip Pratama, S.T.',
      signerTitle: 'Direktur Utama'
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
        letter.value.bodyContent = '- Poin 1\n- Poin 2';
      } else {
        letter.value.bodyContent += '\n\n- Poin 1\n- Poin 2';
      }
    };

    const selectTemplate = (tmpl) => {
      selectedTemplateId.value = tmpl.id;
      letter.value.subject = tmpl.subject;
      letter.value.bodyContent = tmpl.bodyContent;
    };

    const saveLetter = () => {
      store.dispatch('addSurat', { ...letter.value });
      sendOnDeviceNotification('✉️ Surat Tersimpan', {
        body: `Surat "${letter.value.subject}" berhasil disimpan.`,
        type: 'success'
      });
    };

    const printLetter = () => {
      saveLetter();
      window.print();
    };

    // WhatsApp Export Feature
    const showWaModal = ref(false);
    const waRecipientMode = ref('contact'); // 'contact' | 'manual'
    const selectedContactId = ref('');
    const selectedContactPhone = ref('');
    const manualPhone = ref('');
    const waCustomMessage = ref('');

    const contactsList = computed(() => store.getters.getContacts || []);

    const generatedWaText = computed(() => {
      const kopText = letter.value.showKop
        ? `*${letter.value.kopName || 'PT RAJINKERJA GLOBAL INDONESIA'}*\n${letter.value.kopAddress || ''}\n------------------------------------------\n`
        : '';
      return `${kopText}*SURAT RESMI: ${letter.value.subject || 'Surat Menyurat'}*\nNomor: ${letter.value.number || '-'}\nTanggal: ${formattedDate.value}\n\nKepada Yth.\n*${letter.value.recipientName || 'Bapak / Ibu Pimpinan'}*\n${letter.value.recipientAddress || 'Di Tempat'}\n\nDengan hormat,\n\n${letter.value.bodyContent || ''}\n\nHormat Kami,\n*${letter.value.signerName || ''}*\n_${letter.value.signerTitle || ''}_`;
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
      let targetPhone = '';
      if (waRecipientMode.value === 'contact') {
        targetPhone = selectedContactPhone.value;
      } else {
        targetPhone = manualPhone.value;
      }

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
          text: 'Data Surat resmi berhasil diunduh dalam format JSON.',
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
            title: 'Pulihkan Data Surat?',
            html: `
              <div class="text-start p-2 bg-light rounded border mb-2 small">
                <p class="mb-1"><strong>Perihal:</strong> ${incomingLetter?.subject || 'Koleksi Surat'}</p>
                <p class="mb-1"><strong>Penerima:</strong> ${incomingLetter?.recipientName || '-'}</p>
                <p class="mb-0"><strong>Pengirim:</strong> ${incomingLetter?.senderName || '-'}</p>
              </div>
              <p class="small text-muted mb-0">Apakah Anda ingin memuat data surat ini ke editor?</p>
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
                text: 'Formulir surat telah diperbarui sesuai berkas JSON.',
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
      selectedTemplateId,
      letterTemplates,
      letter,
      formattedDate,
      bodyParagraphs,
      isListParagraph,
      insertNewParagraph,
      insertBulletList,
      selectTemplate,
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
  max-width: 794px;
  min-height: 1000px;
  box-sizing: border-box;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 14px;
  line-height: 1.6;
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
  }
}
</style>
