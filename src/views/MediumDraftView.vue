<template>
  <div class="container-fluid p-0 medium-draft-wrapper" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border header-banner">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
          <span class="badge bg-dark text-white fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-medium me-1"></i> Medium Story Editor & Draft Suite
          </span>
          <span class="badge bg-success-subtle text-success fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-clipboard-check-fill me-1"></i> 1-Click Rich Text Copy to Medium
          </span>
        </div>
        <h2 class="fw-extrabold mb-1 text-dark">✍️ Medium Draft & Story Builder</h2>
        <p class="text-muted mb-0">Tulis artikel teknologi & karir, format otomatis sesuai standar Medium, lalu <strong>salin 1-klik langsung siap paste di Medium Editor</strong> tanpa rusak format!</p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="d-flex flex-wrap align-items-center gap-2">
        <button
          class="btn btn-outline-dark fw-bold px-3 py-2.5 rounded-3 shadow-sm d-flex align-items-center gap-1.5"
          @click="createNewDraft"
        >
          <i class="bi bi-file-earmark-plus-fill"></i>
          <span>Draft Baru</span>
        </button>

        <button
          class="btn btn-outline-secondary fw-semibold px-3 py-2.5 rounded-3 shadow-sm d-flex align-items-center gap-1.5"
          @click="copyMarkdown"
        >
          <i class="bi bi-markdown-fill"></i>
          <span>Salin Markdown</span>
        </button>

        <button
          class="btn btn-success fw-bold px-4 py-2.5 rounded-3 shadow-sm d-flex align-items-center gap-2 text-white"
          @click="copyForMedium"
        >
          <i class="bi bi-clipboard-check-fill fs-5"></i>
          <span>Salin Format Medium (Siap Paste)</span>
        </button>
      </div>
    </div>

    <!-- MAIN EDITOR & PREVIEW GRID (NO POPUPS) -->
    <div class="row g-4 mb-4">
      <!-- LEFT COLUMN: EDITOR CONTROLS & DRAFT LIST -->
      <div class="col-lg-6">
        <!-- Draft Switcher & Stats Bar -->
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 mb-3">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <!-- Draft selector -->
            <div class="d-flex align-items-center gap-2 flex-grow-1" style="max-width: 320px;">
              <span class="small fw-bold text-muted text-nowrap">Draft Tersimpan:</span>
              <select class="form-select form-select-sm rounded-3 fw-semibold text-dark" v-model="activeDraftId" @change="switchDraft">
                <option v-for="d in drafts" :key="d.id" :value="d.id">
                  {{ d.title || 'Untitled Story' }} ({{ d.updatedAt }})
                </option>
              </select>
            </div>

            <!-- Stats: Word count & Reading Time -->
            <div class="d-flex align-items-center gap-3">
              <span class="badge bg-light text-dark border px-2.5 py-1.5 rounded-pill small">
                ⏱️ {{ readingTime }}
              </span>
              <span class="badge bg-light text-muted border px-2.5 py-1.5 rounded-pill small">
                📝 {{ wordCount }} kata
              </span>
            </div>
          </div>
        </div>

        <!-- Editor Card -->
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
          <!-- Story Title Input -->
          <div class="mb-3">
            <label class="form-label small fw-bold text-muted text-uppercase">Judul Cerita (Medium H1 Title)</label>
            <input
              type="text"
              class="form-control form-control-lg fw-extrabold text-dark rounded-3 border-2 fs-4"
              v-model="activeDraft.title"
              placeholder="Contoh: Mengapa Saya Memilih Vue.js untuk Membangun RajinKerja.id"
              @input="autoSave"
            />
          </div>

          <!-- Story Subtitle -->
          <div class="mb-3">
            <label class="form-label small fw-bold text-muted text-uppercase">Subjudul / Kicker (Medium Subtitle)</label>
            <input
              type="text"
              class="form-control rounded-3 border-2"
              v-model="activeDraft.subtitle"
              placeholder="Contoh: Pembahasan mendalam tentang performa, reaktivitas, dan arsitektur aplikasi."
              @input="autoSave"
            />
          </div>

          <!-- Medium Tags / Topics -->
          <div class="mb-3">
            <label class="form-label small fw-bold text-muted text-uppercase">Topik / Tags Medium (Dipisah koma, maks 5)</label>
            <input
              type="text"
              class="form-control rounded-3"
              v-model="activeDraft.tags"
              placeholder="Contoh: Web Development, Vuejs, Javascript, Productivity, Career"
              @input="autoSave"
            />
          </div>

          <!-- Quick Format Insert Toolbar -->
          <div class="bg-light p-2 rounded-3 border d-flex flex-wrap gap-1.5 mb-3">
            <button class="btn btn-sm btn-white bg-white border rounded-2 px-2.5 py-1 fw-bold" @click="insertFormatting('h2')" title="Sub-header Besar (H2)">
              H2
            </button>
            <button class="btn btn-sm btn-white bg-white border rounded-2 px-2.5 py-1 fw-bold" @click="insertFormatting('h3')" title="Sub-header Kecil (H3)">
              H3
            </button>
            <button class="btn btn-sm btn-white bg-white border rounded-2 px-2.5 py-1 fw-bold" @click="insertFormatting('quote')" title="Pullquote / Blockquote Medium">
              <i class="bi bi-quote"></i> Kutipan
            </button>
            <button class="btn btn-sm btn-white bg-white border rounded-2 px-2.5 py-1 fw-bold" @click="insertFormatting('code')" title="Blok Kode">
              <i class="bi bi-code-square"></i> Kode
            </button>
            <button class="btn btn-sm btn-white bg-white border rounded-2 px-2.5 py-1 fw-bold" @click="insertFormatting('ul')" title="Daftar Bullet">
              <i class="bi bi-list-ul"></i>
            </button>
            <button class="btn btn-sm btn-white bg-white border rounded-2 px-2.5 py-1 fw-bold" @click="insertFormatting('ol')" title="Daftar Angka">
              <i class="bi bi-list-ol"></i>
            </button>
            <button class="btn btn-sm btn-white bg-white border rounded-2 px-2.5 py-1 fw-bold" @click="insertFormatting('hr')" title="Pemisah Paragraf Medium (---)">
              <i class="bi bi-dash-lg"></i> Pembatas
            </button>
            <button class="btn btn-sm btn-white bg-white border rounded-2 px-2.5 py-1 fw-bold text-primary" @click="loadSampleTemplate" title="Muat Template Contoh">
              <i class="bi bi-magic"></i> Template
            </button>
          </div>

          <!-- Body Textarea -->
          <div class="mb-3">
            <label class="form-label small fw-bold text-muted text-uppercase">Isi Artikel / Story Body</label>
            <textarea
              ref="bodyTextarea"
              class="form-control rounded-3 border-2 font-monospace fs-6"
              rows="16"
              v-model="activeDraft.body"
              placeholder="Tulis artikel Anda di sini dengan paragraf bersih atau Markdown..."
              @input="autoSave"
            ></textarea>
          </div>

          <!-- Footer status -->
          <div class="d-flex justify-content-between align-items-center text-muted small">
            <span>Status: <strong class="text-success"><i class="bi bi-check-circle-fill me-1"></i> Tersimpan Otomatis</strong></span>
            <span>Karakter: {{ activeDraft.body.length.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: LIVE MEDIUM PREVIEW VIEWPORT -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
          <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
            <div class="d-flex align-items-center gap-2">
              <div class="p-2 rounded-circle bg-dark text-white d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
                <i class="bi bi-medium fs-5"></i>
              </div>
              <div>
                <h5 class="fw-bold text-dark mb-0">Pratinjau Asli Medium</h5>
                <small class="text-muted">Tampilan simulasi persis pembaca Medium</small>
              </div>
            </div>

            <button class="btn btn-sm btn-outline-success fw-bold rounded-pill px-3 py-1.5 d-flex align-items-center gap-1" @click="copyForMedium">
              <i class="bi bi-clipboard-check"></i>
              <span>Salin Format</span>
            </button>
          </div>

          <!-- Simulation of Medium's Article Reading Experience -->
          <div class="medium-article-viewport overflow-y-auto px-md-3 py-2" style="max-height: 750px;">
            <!-- Article Title -->
            <h1 class="medium-preview-title">{{ activeDraft.title || 'Judul Artikel Medium Anda' }}</h1>

            <!-- Article Subtitle -->
            <h2 v-if="activeDraft.subtitle" class="medium-preview-subtitle">{{ activeDraft.subtitle }}</h2>

            <!-- Author & Metadata Byline -->
            <div class="d-flex align-items-center gap-3 my-4 py-2 border-bottom border-light">
              <div class="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.1rem;">
                AP
              </div>
              <div>
                <div class="fw-bold text-dark mb-0">Arif Permana Putrasuryana</div>
                <div class="small text-muted d-flex align-items-center gap-2">
                  <span>{{ readingTime }}</span>
                  <span>•</span>
                  <span>{{ currentDateFormatted }}</span>
                  <span class="badge bg-light text-secondary border rounded-pill">Member-only</span>
                </div>
              </div>
            </div>

            <!-- Tags Chips -->
            <div v-if="tagList.length > 0" class="d-flex flex-wrap gap-1.5 mb-4">
              <span v-for="tag in tagList" :key="tag" class="badge bg-light text-dark border px-2.5 py-1 rounded-pill small">
                #{{ tag }}
              </span>
            </div>

            <!-- Rendered Body Content -->
            <div class="medium-rendered-body" v-html="renderedHtml"></div>

            <!-- Medium Clap & Share Footer Simulation -->
            <div class="mt-5 pt-4 border-top d-flex justify-content-between align-items-center text-muted">
              <div class="d-flex align-items-center gap-3">
                <button class="btn btn-sm btn-light border rounded-pill px-3 py-1.5 d-flex align-items-center gap-1 text-dark">
                  👏 <span>50 Claps</span>
                </button>
                <span class="small"><i class="bi bi-chat-fill me-1"></i> Komentar</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-light rounded-circle p-2" title="Bookmark"><i class="bi bi-bookmark"></i></button>
                <button class="btn btn-sm btn-light rounded-circle p-2" title="Bagikan"><i class="bi bi-share"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';

export default {
  name: 'MediumDraftView',
  setup() {
    const bodyTextarea = ref(null);
    const drafts = ref([]);
    const activeDraftId = ref(null);

    const defaultStory = () => ({
      id: 'draft-' + Date.now(),
      title: 'Membangun Work Suite Produktivitas dengan Vue.js dan Three.js',
      subtitle: 'Pengalaman nyata merancang aplikasi kerja berkecepatan tinggi dengan integrasi 3D interaktif dan penyimpanan cache yang tangguh.',
      tags: 'Web Development, Vuejs, Threejs, Productivity, Software Engineering',
      body: `## 1. Latar Belakang Masalah

Di era kerja serba cepat saat ini, seorang developer dan profesional membutuhkan alat kerja yang tidak hanya fungsional, tetapi juga memberikan pengalaman visual yang menyenangkan (*delightful*).

> "Produktivitas sejati bukanlah sekadar menyelesaikan tugas lebih banyak, melainkan mempertahankan fokus otak dan energi mental sepanjang hari kerja."

Seringkali kita menemui aplikasi produktivitas yang terasa kaku, membosankan, dan memperlambat alur kerja karena terlalu banyak form yang berbelit. Inilah yang melatarbelakangi lahirnya konsep Work Suite terpadu.

---

## 2. Arsitektur Frontend & Three.js 3D Engine

Untuk memberikan jeda istirahat yang bermakna saat waktu istirahat (break time), kami mengintegrasikan grafis 3D interaktif Three.js langsung ke dalam web tanpa beban berat.

\`\`\`javascript
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
\`\`\`

Dengan optimasi render loop dan penghapusan geometry pada siklus *unmount*, aplikasi tetap berjalan dengan mulus pada 60 frame per detik bahkan di perangkat laptop hemat daya.

---

## 3. Pelajaran Berharga yang Dipetik

Berikut beberapa poin utama yang bisa diterapkan pada proyek modern Anda:
- Gunakan arsitektur komponen modular untuk memudahkan pemeliharaan kode.
- Jangan biarkan pengguna terganggu oleh popup modal berlapis yang merusak alur fokus.
- Berikan proteksi penyimpanan data lokal agar tidak terjadi kehilangan catatan penting.

Apakah Anda tertarik membangun solusi serupa? Mari berdiskusi di kolom komentar!`
    });

    const activeDraft = ref(defaultStory());

    const loadDrafts = () => {
      const saved = localStorage.getItem('rk_medium_drafts');
      if (saved) {
        try {
          drafts.value = JSON.parse(saved);
          if (drafts.value.length > 0) {
            activeDraft.value = { ...drafts.value[0] };
            activeDraftId.value = activeDraft.value.id;
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }

      const initial = defaultStory();
      initial.updatedAt = new Date().toLocaleDateString('id-ID');
      drafts.value = [initial];
      activeDraft.value = { ...initial };
      activeDraftId.value = initial.id;
      saveDrafts();
    };

    const saveDrafts = () => {
      localStorage.setItem('rk_medium_drafts', JSON.stringify(drafts.value));
    };

    const autoSave = () => {
      activeDraft.value.updatedAt = new Date().toLocaleDateString('id-ID');
      const idx = drafts.value.findIndex(d => d.id === activeDraft.value.id);
      if (idx !== -1) {
        drafts.value[idx] = { ...activeDraft.value };
      } else {
        drafts.value.unshift({ ...activeDraft.value });
      }
      saveDrafts();
    };

    const switchDraft = () => {
      const target = drafts.value.find(d => d.id === activeDraftId.value);
      if (target) {
        activeDraft.value = { ...target };
      }
    };

    const createNewDraft = () => {
      const newD = {
        id: 'draft-' + Date.now(),
        title: '',
        subtitle: '',
        tags: 'Tech, Career',
        body: '',
        updatedAt: new Date().toLocaleDateString('id-ID')
      };
      drafts.value.unshift(newD);
      activeDraftId.value = newD.id;
      activeDraft.value = { ...newD };
      saveDrafts();
    };

    const wordCount = computed(() => {
      const fullText = `${activeDraft.value.title} ${activeDraft.value.subtitle} ${activeDraft.value.body}`;
      const words = fullText.trim().split(/\s+/).filter(Boolean);
      return words.length;
    });

    const readingTime = computed(() => {
      const minutes = Math.max(1, Math.ceil(wordCount.value / 200));
      return `${minutes} min read`;
    });

    const currentDateFormatted = computed(() => {
      return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    });

    const tagList = computed(() => {
      if (!activeDraft.value.tags) return [];
      return activeDraft.value.tags.split(',').map(t => t.trim()).filter(Boolean);
    });

    const insertFormatting = (type) => {
      const textarea = bodyTextarea.value;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = activeDraft.value.body;
      const selected = text.substring(start, end);

      let replacement = '';
      if (type === 'h2') replacement = `\n## ${selected || 'Sub-Judul Seksi'}\n`;
      else if (type === 'h3') replacement = `\n### ${selected || 'Sub-Topik'}\n`;
      else if (type === 'quote') replacement = `\n> "${selected || 'Kutipan penting yang menarik perhatian pembaca'}"\n`;
      else if (type === 'code') replacement = `\n\`\`\`javascript\n${selected || '// Tulis kode di sini'}\n\`\`\`\n`;
      else if (type === 'ul') replacement = `\n- Poin pertama\n- Poin kedua\n- Poin ketiga\n`;
      else if (type === 'ol') replacement = `\n1. Langkah pertama\n2. Langkah kedua\n3. Langkah ketiga\n`;
      else if (type === 'hr') replacement = `\n---\n`;

      activeDraft.value.body = text.substring(0, start) + replacement + text.substring(end);
      autoSave();
    };

    const loadSampleTemplate = () => {
      activeDraft.value = defaultStory();
      autoSave();
    };

    // Render markdown-like text to clean HTML
    const renderedHtml = computed(() => {
      let raw = activeDraft.value.body || '';

      // Blockquotes
      raw = raw.replace(/^>\s*(.+)$/gm, '<blockquote class="medium-quote">$1</blockquote>');

      // Headings
      raw = raw.replace(/^###\s*(.+)$/gm, '<h4 class="medium-h3 mt-4 mb-2">$1</h4>');
      raw = raw.replace(/^##\s*(.+)$/gm, '<h3 class="medium-h2 mt-4 mb-3">$1</h3>');

      // Horizontal dividers
      raw = raw.replace(/^---$/gm, '<div class="medium-divider text-center my-4 font-monospace">···</div>');

      // Code blocks
      raw = raw.replace(/```([\s\S]*?)```/gm, '<pre class="medium-code-block"><code>$1</code></pre>');

      // Inline code
      raw = raw.replace(/`([^`]+)`/g, '<code class="medium-inline-code">$1</code>');

      // Bold & Italic
      raw = raw.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      raw = raw.replace(/\*([^*]+)\*/g, '<em>$1</em>');

      // Bullet lists
      raw = raw.replace(/^\s*-\s*(.+)$/gm, '<li class="medium-li">$1</li>');

      // Paragraphs
      const paragraphs = raw.split(/\n\n+/);
      return paragraphs.map(p => {
        if (p.startsWith('<h') || p.startsWith('<blockquote') || p.startsWith('<pre') || p.startsWith('<div') || p.startsWith('<li')) {
          return p;
        }
        return `<p class="medium-paragraph">${p.replace(/\n/g, '<br/>')}</p>`;
      }).join('\n');
    });

    // 1-Click Copy formatted for Medium Editor paste
    const copyForMedium = async () => {
      try {
        const titleHtml = `<h1>${activeDraft.value.title}</h1>`;
        const subtitleHtml = activeDraft.value.subtitle ? `<h2><em>${activeDraft.value.subtitle}</em></h2>` : '';
        const fullHtml = `
          ${titleHtml}
          ${subtitleHtml}
          ${renderedHtml.value}
        `;

        const plainText = `${activeDraft.value.title}\n${activeDraft.value.subtitle}\n\n${activeDraft.value.body}`;

        if (navigator.clipboard && window.ClipboardItem) {
          const blobHtml = new Blob([fullHtml], { type: 'text/html' });
          const blobText = new Blob([plainText], { type: 'text/plain' });
          await navigator.clipboard.write([
            new ClipboardItem({
              'text/html': blobHtml,
              'text/plain': blobText
            })
          ]);
        } else {
          await navigator.clipboard.writeText(fullHtml);
        }

        Swal.fire({
          icon: 'success',
          title: 'Format Medium Berhasil Disalin!',
          html: `
            <p class="text-muted small mb-2">Buka <strong>Medium.com</strong> lalu tekan <strong>Ctrl + V</strong> (Paste) pada cerita baru Anda.</p>
            <div class="alert alert-success small mb-0">
              <i class="bi bi-check-circle-fill me-1"></i> Seluruh judul, subjudul, kutipan, dan blok kode akan otomatis terformat rapi sesuai gaya Medium!
            </div>
          `,
          confirmButtonColor: '#10b981'
        });
      } catch (err) {
        console.error(err);
        await navigator.clipboard.writeText(activeDraft.value.body);
        Swal.fire({
          icon: 'info',
          title: 'Teks Berhasil Disalin',
          text: 'Teks draft telah disalin ke clipboard Anda.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    };

    const copyMarkdown = async () => {
      const md = `# ${activeDraft.value.title}\n\n_${activeDraft.value.subtitle}_\n\n${activeDraft.value.body}`;
      await navigator.clipboard.writeText(md);
      Swal.fire({
        icon: 'success',
        title: 'Markdown Disalin!',
        text: 'Format Markdown siap digunakan di platform blog atau repository GitHub.',
        timer: 1500,
        showConfirmButton: false
      });
    };

    onMounted(() => {
      loadDrafts();
    });

    return {
      bodyTextarea,
      drafts,
      activeDraftId,
      activeDraft,
      wordCount,
      readingTime,
      currentDateFormatted,
      tagList,
      renderedHtml,
      autoSave,
      switchDraft,
      createNewDraft,
      insertFormatting,
      loadSampleTemplate,
      copyForMedium,
      copyMarkdown
    };
  }
};
</script>

<style scoped>
.header-banner {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

/* Medium Reading Simulation Typography */
.medium-preview-title {
  font-family: 'Charter', 'Georgia', Cambria, serif;
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.2;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.medium-preview-subtitle {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 1.5rem;
}

:deep(.medium-paragraph) {
  font-family: 'Charter', 'Georgia', Cambria, serif;
  font-size: 1.15rem;
  line-height: 1.75;
  color: #292929;
  margin-bottom: 1.5rem;
}

:deep(.medium-h2) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.01em;
}

:deep(.medium-h3) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #262626;
}

:deep(.medium-quote) {
  border-left: 3px solid #1a1a1a;
  padding-left: 1.25rem;
  margin: 1.75rem 0;
  font-family: 'Charter', 'Georgia', Cambria, serif;
  font-size: 1.35rem;
  font-style: italic;
  color: #1a1a1a;
  line-height: 1.5;
}

:deep(.medium-code-block) {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  font-size: 0.95rem;
  overflow-x: auto;
  margin: 1.5rem 0;
  color: #0f172a;
}

:deep(.medium-inline-code) {
  background-color: #f1f5f9;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
  color: #0369a1;
}

:deep(.medium-divider) {
  letter-spacing: 0.8rem;
  color: #94a3b8;
  font-size: 1.4rem;
}

:deep(.medium-li) {
  font-family: 'Charter', 'Georgia', Cambria, serif;
  font-size: 1.12rem;
  line-height: 1.7;
  color: #292929;
  margin-bottom: 0.5rem;
}
</style>
