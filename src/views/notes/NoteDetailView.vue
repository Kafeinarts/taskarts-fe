<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- MODE EDIT: DEDICATED MARKDOWN EDITOR STUDIO PAGE -->
    <div v-if="isEditing" class="markdown-editor-studio">
      <!-- Editor Top Navigation Bar -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 p-4 rounded-4 shadow-sm border editor-header-card">
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-outline-secondary rounded-3 px-3 py-2 d-flex align-items-center gap-2 fw-semibold" @click="cancelEdit">
            <i class="bi bi-arrow-left fs-5"></i>
            <span>Kembali ke Preview</span>
          </button>
          <div class="border-start ps-3 d-none d-sm-block">
            <span class="badge bg-purple-subtle text-purple fw-bold px-3 py-1.5 rounded-pill mb-1">
              <i class="bi bi-diagram-3-fill me-1"></i> Markdown & Mermaid Studio
            </span>
            <h4 class="fw-bold mb-0 header-title">Edit Catatan & Diagram</h4>
          </div>
        </div>

        <!-- Editor Header Right Controls -->
        <div class="d-flex flex-wrap align-items-center gap-2" v-if="editForm">
          <!-- Color Accent Swatch Picker -->
          <div class="d-flex align-items-center gap-1.5 bg-light p-1.5 rounded-3 border me-2">
            <span class="small fw-semibold text-muted px-1" style="font-size: 11px;">Aksen:</span>
            <button
              type="button"
              v-for="c in colorOptions"
              :key="c.code"
              class="btn rounded-circle p-0 color-swatch-btn"
              :style="{ backgroundColor: c.code, width: '26px', height: '26px' }"
              :class="{ 'ring-active': editForm.color === c.code }"
              @click="editForm.color = c.code"
              :title="c.name"
            >
              <i v-if="editForm.color === c.code" class="bi bi-check-lg text-dark fw-bold" style="font-size: 11px;"></i>
            </button>
          </div>

          <!-- View Mode Toggles -->
          <div class="btn-group me-2" role="group">
            <button
              type="button"
              class="btn btn-sm py-2 px-3 fw-semibold"
              :class="editorLayout === 'split' ? 'btn-dark' : 'btn-outline-secondary'"
              @click="editorLayout = 'split'"
              title="Split View (Editor + Live Preview)"
            >
              <i class="bi bi-layout-split me-1"></i> Split
            </button>
            <button
              type="button"
              class="btn btn-sm py-2 px-3 fw-semibold"
              :class="editorLayout === 'editor' ? 'btn-dark' : 'btn-outline-secondary'"
              @click="editorLayout = 'editor'"
              title="Ketik Full Editor"
            >
              <i class="bi bi-file-earmark-code me-1"></i> Editor
            </button>
            <button
              type="button"
              class="btn btn-sm py-2 px-3 fw-semibold"
              :class="editorLayout === 'preview' ? 'btn-dark' : 'btn-outline-secondary'"
              @click="editorLayout = 'preview'"
              title="Pratinjau Hasil"
            >
              <i class="bi bi-eye me-1"></i> Preview
            </button>
          </div>

          <button class="btn btn-light border rounded-3 px-3 py-2 fw-semibold" @click="cancelEdit">
            Batal
          </button>
          <button class="btn btn-primary rounded-3 px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm" @click="saveEditNote">
            <i class="bi bi-check-circle-fill"></i>
            <span>Simpan Catatan</span>
          </button>
        </div>
      </div>

      <!-- MAIN EDITOR WORKSPACE -->
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 main-editor-card" v-if="editForm">
        <!-- Colored Top Accent -->
        <div class="note-top-color-bar" :style="{ backgroundColor: editForm.color || '#2563eb' }"></div>

        <div class="p-4 p-md-5">
          <!-- Title Input -->
          <div class="mb-4">
            <label class="form-label fw-bold text-dark small mb-1">Judul Catatan / Dokumen <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control form-control-lg border-2 fw-extrabold fs-4 rounded-3 title-input-field"
              v-model="editForm.title"
              placeholder="Masukkan Judul Catatan..."
              required
            />
          </div>

          <!-- Quick Formatting Toolbar -->
          <div class="markdown-toolbar p-2 rounded-3 border bg-light mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div class="d-flex flex-wrap align-items-center gap-1.5">
              <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1 fw-bold text-primary shadow-xs" @click="openImageModal">
                <i class="bi bi-image me-1"></i> Sisipkan Gambar
              </button>
              <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1 fw-bold text-purple shadow-xs" @click="openMermaidModal">
                <i class="bi bi-diagram-3-fill me-1"></i> Flowchart / Diagram
              </button>
              <div class="vr mx-1"></div>
              <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1 fw-bold" @click="insertMarkdown('**', '**')" title="Bold"><i class="bi bi-type-bold"></i></button>
              <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertMarkdown('*', '*')" title="Italic"><i class="bi bi-type-italic"></i></button>
              <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1 fw-bold" @click="insertMarkdown('# ')" title="Heading 1">H1</button>
              <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1 fw-bold" @click="insertMarkdown('## ')" title="Heading 2">H2</button>
              <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertMarkdown('> ')" title="Quote"><i class="bi bi-quote"></i></button>
              <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertMarkdown('```\n', '\n```')" title="Code Block"><i class="bi bi-code-slash"></i></button>
              <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertMarkdown('- ')" title="List"><i class="bi bi-list-ul"></i></button>
              <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertMarkdown('- [ ] ')" title="Checklist"><i class="bi bi-check2-square"></i></button>
              <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertMarkdown('\n| Kolom 1 | Kolom 2 |\n| --- | --- |\n| Data A | Data B |\n')" title="Tabel"><i class="bi bi-table"></i></button>
              <button type="button" class="btn btn-sm btn-white border rounded-2 px-2 py-1" @click="insertMarkdown('\n---\n')" title="Garis Pemisah">---</button>
            </div>

            <span class="small text-muted font-monospace">{{ editLineCount }} Baris | {{ getWordCount(editForm.content) }} Kata</span>
          </div>

          <!-- Editor Body Grid (Split vs Single) -->
          <div class="row g-4">
            <!-- Textarea Field -->
            <div :class="editorLayout === 'split' ? 'col-lg-6' : (editorLayout === 'editor' ? 'col-12' : 'd-none')">
              <label class="form-label fw-bold text-dark small mb-2">
                <i class="bi bi-pencil-fill text-primary me-1"></i> Editor Markdown (Bisa Paste Gambar <kbd>Ctrl+V</kbd>)
              </label>
              <textarea
                ref="editorTextarea"
                class="form-control font-monospace border-2 p-3 text-editor-area rounded-3"
                rows="18"
                v-model="editForm.content"
                @paste="handlePasteImage"
                placeholder="Tulis catatan lengkap dengan sintaks Markdown di sini..."
              ></textarea>
            </div>

            <!-- Live Preview Card -->
            <div :class="editorLayout === 'split' ? 'col-lg-6' : (editorLayout === 'preview' ? 'col-12' : 'd-none')">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="form-label fw-bold text-dark small mb-0"><i class="bi bi-eye-fill text-success me-1"></i> Live Markdown & Mermaid Preview</label>
                <span class="badge bg-success-subtle text-success fw-bold rounded-pill px-2.5 py-1 small">Realtime Sync</span>
              </div>
              <div class="card p-4 rounded-3 border-2 bg-light overflow-y-auto editor-preview-box" style="height: 480px;">
                <MarkdownViewer :content="editForm.content" />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Action Bar -->
        <div class="card-footer p-4 border-top bg-light d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
          <span class="small text-muted">
            <i class="bi bi-shield-check text-success me-1"></i> Gambar dan diagram Mermaid otomatis tersimpan rapi secara lokal (Local-First).
          </span>
          <div class="d-flex gap-2">
            <button class="btn btn-light border rounded-3 px-4 py-2 fw-semibold" @click="cancelEdit">Batal</button>
            <button class="btn btn-primary rounded-3 px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2" @click="saveEditNote">
              <i class="bi bi-check-circle-fill"></i>
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODE PREVIEW / READ ONLY (isEditing === false) -->
    <div v-else>
      <!-- Top Action Bar -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 p-4 rounded-4 shadow-sm border top-bar-card">
        <div class="d-flex align-items-center gap-3">
          <router-link to="/notes" class="btn btn-outline-secondary rounded-3 px-3 py-2 d-flex align-items-center gap-2 fw-semibold">
            <i class="bi bi-arrow-left fs-5"></i>
            <span>Kembali ke Catatan</span>
          </router-link>
          <div class="border-start ps-3 d-none d-sm-block" v-if="note">
            <span class="badge badge-preview-tag fw-bold px-3 py-1.5 rounded-pill mb-1">
              <i class="bi bi-file-earmark-text me-1"></i> Detail Dokumen Catatan
            </span>
            <h4 class="fw-bold mb-0 text-truncate header-title" style="max-width: 420px;">{{ note.title || 'Untitled Note' }}</h4>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex flex-wrap align-items-center gap-2" v-if="note">
          <button class="btn btn-action-btn border rounded-3 px-3 py-2 fw-semibold d-flex align-items-center gap-2" @click="copyContent">
            <i class="bi bi-clipboard"></i>
            <span>Salin Teks</span>
          </button>
          <button class="btn btn-action-btn border rounded-3 px-3 py-2 fw-semibold d-flex align-items-center gap-2" :disabled="isPdfLoading" @click="printNote">
            <span v-if="isPdfLoading" class="spinner-border spinner-border-sm text-primary" role="status"></span>
            <i v-else class="bi bi-printer"></i>
            <span>{{ isPdfLoading ? 'Menyiapkan...' : 'Buka / Cetak PDF' }}</span>
          </button>
          <button class="btn btn-warning rounded-3 px-3 py-2 fw-semibold d-flex align-items-center gap-2 text-dark shadow-sm" @click="openEditor">
            <i class="bi bi-pencil-square"></i>
            <span>Edit Catatan</span>
          </button>
          <button class="btn btn-outline-danger rounded-3 px-3 py-2 fw-semibold d-flex align-items-center gap-2" @click="deleteNote">
            <i class="bi bi-trash"></i>
            <span>Hapus</span>
          </button>
        </div>
      </div>

      <!-- MAIN NOTE DETAIL CARD -->
      <div v-if="note" id="notePrintableCard" class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 main-note-card">
        <!-- Top Colored Accent Bar matching Note Theme -->
        <div class="note-top-color-bar" :style="{ backgroundColor: note.color || '#2563eb' }"></div>

        <!-- Note Header Bar -->
        <div class="p-4 p-md-5 border-bottom note-header-bar d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <span class="badge doc-badge rounded-pill px-3 py-1.5 text-uppercase fw-bold" style="font-size: 11px; letter-spacing: 0.5px;">
                <i class="bi bi-markdown me-1"></i> Markdown & Mermaid
              </span>
              <span class="small text-sub-heading d-flex align-items-center gap-1">
                <i class="bi bi-clock me-1"></i> Terakhir diperbarui: {{ formatDate(note.updatedAt) }}
              </span>
            </div>
            <h1 class="display-6 fw-extrabold main-note-title mb-0">{{ note.title || 'Untitled Note' }}</h1>
          </div>

          <div class="d-flex align-items-center gap-3 stats-box p-3 rounded-3 border bg-light">
            <div class="text-center px-2">
              <span class="small text-sub-heading d-block fw-semibold" style="font-size: 11px;">KATA</span>
              <span class="fs-5 fw-extrabold stat-value">{{ getWordCount(note.content) }}</span>
            </div>
            <div class="border-start ps-3 text-center px-2">
              <span class="small text-sub-heading d-block fw-semibold" style="font-size: 11px;">KARAKTER</span>
              <span class="fs-5 fw-extrabold stat-value">{{ (note.content || '').length }}</span>
            </div>
          </div>
        </div>

        <!-- Note Rendered Markdown Body -->
        <div class="card-body p-4 p-md-5 note-body-wrapper bg-white">
          <MarkdownViewer :content="note.content" />
        </div>

        <!-- Note Footer Info -->
        <div class="card-footer p-4 border-top note-footer-bar d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <span class="small text-sub-heading">
            <i class="bi bi-shield-check text-success me-1"></i> Catatan ini tersimpan aman di penyimpanan lokal (Local-First) perangkat Anda.
          </span>
          <span class="small text-sub-heading">ID: <code class="note-id-code fw-bold">{{ note.id }}</code></span>
        </div>
      </div>

      <!-- NOTE NOT FOUND STATE -->
      <div v-else class="text-center py-5 rounded-4 shadow-sm border my-4 not-found-box bg-white">
        <div class="display-1 text-muted opacity-50 mb-3">📑</div>
        <h3 class="fw-bold not-found-title">Catatan Tidak Ditemukan</h3>
        <p class="text-sub-heading max-w-md mx-auto">Catatan yang Anda cari mungkin telah dihapus atau ID tidak valid.</p>
        <router-link to="/notes" class="btn btn-primary rounded-3 px-4 py-2 mt-2 fw-semibold">
          <i class="bi bi-arrow-left me-1"></i> Kembali ke Daftar Notes
        </router-link>
      </div>
    </div>

    <!-- MODAL: INSERT IMAGE -->
    <div v-if="imageModal.show" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow-lg rounded-4 bg-white p-4 p-md-5" style="max-width: 600px; width: 100%;" @click.stop>
        <div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-primary-subtle text-primary p-2 rounded-circle"><i class="bi bi-image fs-5"></i></span>
            <h5 class="fw-bold text-dark mb-0">Sisipkan Gambar ke Catatan</h5>
          </div>
          <button class="btn-close" @click="imageModal.show = false"></button>
        </div>

        <div class="d-flex gap-2 mb-3 border-bottom pb-2">
          <button
            class="btn btn-sm rounded-pill px-3 py-1.5 fw-bold"
            :class="imageModal.tab === 'upload' ? 'btn-primary' : 'btn-light border'"
            @click="imageModal.tab = 'upload'"
          >
            <i class="bi bi-upload me-1"></i> Upload File
          </button>
          <button
            class="btn btn-sm rounded-pill px-3 py-1.5 fw-bold"
            :class="imageModal.tab === 'url' ? 'btn-primary' : 'btn-light border'"
            @click="imageModal.tab = 'url'"
          >
            <i class="bi bi-link-45deg me-1"></i> Link URL
          </button>
        </div>

        <div v-if="imageModal.tab === 'upload'">
          <div
            class="image-dropzone p-4 text-center rounded-4 border-2 border-dashed bg-light mb-3 cursor-pointer"
            @click="$refs.fileInput.click()"
            @dragover.prevent
            @drop.prevent="handleFileDrop"
          >
            <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleFileSelect" />
            <div v-if="imageModal.preview">
              <img :src="imageModal.preview" class="img-fluid rounded-3 shadow-sm mb-2" style="max-height: 180px; object-fit: contain;" />
              <div class="small text-success fw-bold"><i class="bi bi-check-circle-fill me-1"></i> Gambar siap disisipkan ({{ imageModal.fileSize }})</div>
            </div>
            <div v-else>
              <i class="bi bi-cloud-arrow-up display-5 text-primary opacity-75 d-block mb-2"></i>
              <div class="fw-bold text-dark mb-1">Klik untuk pilih gambar atau tarik file ke sini</div>
              <div class="small text-muted">Format PNG, JPG, WebP, GIF, SVG</div>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="mb-3">
            <label class="form-label fw-bold small text-dark">URL Gambar Web</label>
            <input type="url" class="form-control" placeholder="https://images.unsplash.com/photo-..." v-model="imageModal.url" />
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label fw-bold small text-dark">Deskripsi / Keterangan Gambar (Alt Text)</label>
          <input type="text" class="form-control" placeholder="Contoh: Diagram Alur Database Proyek" v-model="imageModal.caption" />
        </div>

        <div class="d-flex justify-content-end gap-2 pt-3 border-top">
          <button type="button" class="btn btn-light rounded-3 px-4 py-2 border fw-semibold" @click="imageModal.show = false">Batal</button>
          <button type="button" class="btn btn-primary rounded-3 px-4 py-2 fw-bold d-flex align-items-center gap-2" @click="insertImageToNote">
            <i class="bi bi-plus-circle-fill"></i>
            <span>Sisipkan Gambar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: INSERT MERMAID DIAGRAM -->
    <div v-if="mermaidModal.show" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow-lg rounded-4 bg-white p-4 p-md-5" style="max-width: 850px; width: 100%; max-height: 90vh; overflow-y: auto;" @click.stop>
        <div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-purple-subtle text-purple p-2 rounded-circle"><i class="bi bi-diagram-3-fill fs-5"></i></span>
            <div>
              <h5 class="fw-bold text-dark mb-0">Sisipkan Mermaid Flowchart & Diagram</h5>
              <small class="text-muted">Pilih template siap pakai atau sesuaikan kode Mermaid Anda.</small>
            </div>
          </div>
          <button class="btn-close" @click="mermaidModal.show = false"></button>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold small text-dark mb-1">Pilih Template Diagram:</label>
          <div class="d-flex flex-wrap gap-2">
            <button
              type="button"
              v-for="preset in mermaidPresets"
              :key="preset.id"
              class="btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
              :class="mermaidModal.selectedPreset === preset.id ? 'btn-dark' : 'btn-light border'"
              @click="applyMermaidPreset(preset)"
            >
              <i class="bi" :class="preset.icon"></i>
              <span>{{ preset.title }}</span>
            </button>
          </div>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <label class="form-label fw-bold small text-dark"><i class="bi bi-code-square text-primary me-1"></i>Kode Mermaid</label>
            <textarea
              class="form-control font-monospace border-2 p-3 rounded-3"
              rows="12"
              v-model="mermaidModal.code"
              placeholder="```mermaid&#10;flowchart TD&#10;    A --> B&#10;```"
            ></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold small text-dark"><i class="bi bi-eye-fill text-success me-1"></i>Pratinjau Diagram</label>
            <div class="card p-3 rounded-3 border-2 bg-light h-100 overflow-auto" style="max-height: 320px;">
              <MarkdownViewer :content="mermaidModal.code" />
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 pt-3 border-top">
          <button type="button" class="btn btn-light rounded-3 px-4 py-2 border fw-semibold" @click="mermaidModal.show = false">Batal</button>
          <button type="button" class="btn btn-primary rounded-3 px-4 py-2 fw-bold d-flex align-items-center gap-2" @click="insertMermaidToNote">
            <i class="bi bi-check2-circle"></i>
            <span>Sisipkan ke Catatan</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Sleek Toast Notification -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 2200;">
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
import { computed, ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';
import MarkdownViewer from '../../components/MarkdownViewer.vue';
import { MERMAID_PRESETS, initMermaid } from '../../utils/markdownRenderer';
import { openPrintableDocumentInNewTab } from '../../utils/pdfTabOpener';

export default {
  name: 'NoteDetailView',
  components: {
    MarkdownViewer
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const toast = ref({ show: false, message: '' });
    const isEditing = ref(false);
    const editForm = ref(null);
    const editorLayout = ref('split'); // 'split', 'editor', 'preview'
    const editorTextarea = ref(null);

    const colorOptions = [
      { name: 'Kuning Pastel', code: '#fef08a' },
      { name: 'Biru Langit', code: '#bae6fd' },
      { name: 'Hijau Mint', code: '#bbf7d0' },
      { name: 'Merah Muda', code: '#fbcfe8' },
      { name: 'Ungu Lavender', code: '#e9d5ff' }
    ];

    const imageModal = ref({
      show: false,
      tab: 'upload',
      preview: '',
      fileSize: '',
      url: '',
      caption: ''
    });

    const mermaidPresets = MERMAID_PRESETS;
    const mermaidModal = ref({
      show: false,
      selectedPreset: 'flowchart_td',
      code: MERMAID_PRESETS[0].code
    });

    const note = computed(() => {
      const id = route.params.id;
      const allNotes = store.getters.getNotes || [];
      return allNotes.find(n => n.id === id) || null;
    });

    const editLineCount = computed(() => {
      if (!editForm.value || !editForm.value.content) return 0;
      return editForm.value.content.split('\n').length;
    });

    const getWordCount = (text) => {
      if (!text) return 0;
      return text.trim().split(/\s+/).filter(Boolean).length;
    };

    const formatDate = (isoStr) => {
      if (!isoStr) return 'Hari ini';
      try {
        const d = new Date(isoStr);
        return d.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return isoStr;
      }
    };

    const copyContent = () => {
      if (!note.value) return;
      navigator.clipboard.writeText(note.value.content || '');
      showToast('Isi catatan berhasil disalin ke clipboard!');
    };

    const isPdfLoading = ref(false);

    const printNote = () => {
      if (!note.value || isPdfLoading.value) return;
      isPdfLoading.value = true;
      setTimeout(() => {
        openPrintableDocumentInNewTab({
          title: `Catatan - ${note.value.title || 'Untitled'}`,
          elementId: 'notePrintableCard',
          autoPrint: true
        });
        isPdfLoading.value = false;
      }, 400);
    };

    const openEditor = () => {
      if (!note.value) return;
      editForm.value = { ...note.value };
      isEditing.value = true;
    };

    const cancelEdit = () => {
      isEditing.value = false;
      editForm.value = null;
    };

    const insertMarkdown = (prefix, suffix = '') => {
      if (!editorTextarea.value || !editForm.value) return;
      const el = editorTextarea.value;
      const start = el.selectionStart || 0;
      const end = el.selectionEnd || 0;
      const text = editForm.value.content || '';
      const selected = text.substring(start, end);

      const replacement = prefix + (selected || '') + suffix;
      editForm.value.content = text.substring(0, start) + replacement + text.substring(end);

      nextTick(() => {
        el.focus();
        const newPos = start + prefix.length + (selected || '').length;
        el.setSelectionRange(newPos, newPos);
      });
    };

    const openImageModal = () => {
      imageModal.value = {
        show: true,
        tab: 'upload',
        preview: '',
        fileSize: '',
        url: '',
        caption: ''
      };
    };

    const processImageFile = (file) => {
      if (!file || !file.type.startsWith('image/')) {
        showToast('Harap pilih file gambar valid (PNG, JPG, SVG, WebP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        imageModal.value.preview = e.target.result;
        imageModal.value.fileSize = `${(file.size / 1024).toFixed(1)} KB`;
        if (!imageModal.value.caption) {
          imageModal.value.caption = file.name.replace(/\.[^/.]+$/, '');
        }
      };
      reader.readAsDataURL(file);
    };

    const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (file) processImageFile(file);
    };

    const handleFileDrop = (e) => {
      const file = e.dataTransfer.files[0];
      if (file) processImageFile(file);
    };

    const handlePasteImage = (e) => {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (let index = 0; index < items.length; index++) {
        const item = items[index];
        if (item.kind === 'file' && item.type.includes('image/')) {
          e.preventDefault();
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target.result;
            const caption = `Tangkapan Layar ${new Date().toLocaleDateString('id-ID')}`;
            const mdSnippet = `\n![${caption}](${dataUrl})\n`;
            insertMarkdown(mdSnippet);
            showToast('📸 Gambar dari clipboard berhasil disisipkan!');
          };
          reader.readAsDataURL(blob);
          break;
        }
      }
    };

    const insertImageToNote = () => {
      let imageSrc = '';
      if (imageModal.value.tab === 'upload') {
        imageSrc = imageModal.value.preview;
      } else {
        imageSrc = imageModal.value.url;
      }

      if (!imageSrc) {
        showToast('Pilih gambar atau masukkan link gambar terlebih dahulu.');
        return;
      }

      const caption = imageModal.value.caption || 'Gambar Catatan';
      const mdSnippet = `\n![${caption}](${imageSrc})\n`;
      insertMarkdown(mdSnippet);
      imageModal.value.show = false;
      showToast('Gambar berhasil disisipkan ke catatan!');
    };

    const openMermaidModal = () => {
      mermaidModal.value.show = true;
    };

    const applyMermaidPreset = (preset) => {
      mermaidModal.value.selectedPreset = preset.id;
      mermaidModal.value.code = preset.code;
    };

    const insertMermaidToNote = () => {
      if (!mermaidModal.value.code) return;
      const snippet = `\n${mermaidModal.value.code.trim()}\n`;
      insertMarkdown(snippet);
      mermaidModal.value.show = false;
      showToast('Diagram Mermaid berhasil disisipkan!');
    };

    const saveEditNote = () => {
      if (!editForm.value || !editForm.value.title.trim()) {
        showToast('Judul catatan tidak boleh kosong.');
        return;
      }
      const updated = {
        ...editForm.value,
        updatedAt: new Date().toISOString()
      };
      store.dispatch('updateNote', updated);
      isEditing.value = false;
      showToast('Catatan berhasil diperbarui!');
    };

    const deleteNote = () => {
      if (!note.value) return;
      Swal.fire({
        title: 'Hapus Catatan?',
        text: `Apakah Anda yakin ingin menghapus catatan "${note.value.title}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('deleteNote', note.value.id);
          router.push('/notes');
        }
      });
    };

    const showToast = (msg) => {
      toast.value = { show: true, message: msg };
      setTimeout(() => {
        toast.value.show = false;
      }, 3000);
    };

    onMounted(() => {
      initMermaid();
      if (route.query.edit === 'true' && note.value) {
        openEditor();
      }
    });

    return {
      note,
      editLineCount,
      getWordCount,
      formatDate,
      copyContent,
      isPdfLoading,
      printNote,
      isEditing,
      editForm,
      editorLayout,
      editorTextarea,
      colorOptions,
      imageModal,
      mermaidPresets,
      mermaidModal,
      openEditor,
      cancelEdit,
      insertMarkdown,
      openImageModal,
      handleFileSelect,
      handleFileDrop,
      handlePasteImage,
      insertImageToNote,
      openMermaidModal,
      applyMermaidPreset,
      insertMermaidToNote,
      saveEditNote,
      deleteNote,
      toast
    };
  }
};
</script>

<style scoped>
.top-bar-card, .editor-header-card {
  background-color: #ffffff;
  border-color: #e2e8f0;
  transition: all 0.2s ease;
}

.note-top-color-bar {
  height: 6px;
  width: 100%;
}

.header-title,
.main-note-title,
.not-found-title {
  color: #0f172a;
}

.text-sub-heading {
  color: #64748b;
}

.stat-value {
  color: #0f172a;
}

.badge-preview-tag {
  background-color: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.doc-badge {
  background-color: #0f172a;
  color: #ffffff;
}

.btn-action-btn {
  background-color: #f8fafc;
  border-color: #e2e8f0;
  color: #1e293b;
  transition: all 0.15s ease;
}

.btn-action-btn:hover {
  background-color: #ffffff;
  border-color: #cbd5e1;
  color: #2563eb;
}

.color-swatch-btn {
  border: 2px solid transparent;
  transition: transform 0.15s ease;
}

.color-swatch-btn:hover {
  transform: scale(1.15);
}

.ring-active {
  border-color: #0f172a !important;
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.2);
}

.bg-purple-subtle {
  background-color: #f3e8ff;
}

.text-purple {
  color: #7e22ce;
}

.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 2050;
}

.image-dropzone {
  border-color: #cbd5e1;
  transition: all 0.2s ease;
}

.image-dropzone:hover {
  background-color: #f1f5f9;
  border-color: #3b82f6;
}

.cursor-pointer {
  cursor: pointer;
}

/* Dark mode compatibility */
:global(.dark-theme) .top-bar-card,
:global(.dark-mode) .top-bar-card,
:global(.oled-theme) .top-bar-card,
:global(.dark-theme) .editor-header-card,
:global(.dark-mode) .editor-header-card,
:global(.oled-theme) .editor-header-card,
:global(.dark-theme) .main-note-card,
:global(.dark-mode) .main-note-card,
:global(.oled-theme) .main-note-card,
:global(.dark-theme) .main-editor-card,
:global(.dark-mode) .main-editor-card,
:global(.oled-theme) .main-editor-card {
  background-color: var(--bg-surface) !important;
  border-color: var(--border-color) !important;
  color: #f8fafc !important;
}

:global(.dark-theme) .header-title,
:global(.dark-mode) .header-title,
:global(.oled-theme) .header-title,
:global(.dark-theme) .main-note-title,
:global(.dark-mode) .main-note-title,
:global(.oled-theme) .main-note-title,
:global(.dark-theme) .stat-value,
:global(.dark-mode) .stat-value,
:global(.oled-theme) .stat-value {
  color: #f8fafc !important;
}

:global(.dark-theme) .note-body-wrapper,
:global(.dark-mode) .note-body-wrapper,
:global(.oled-theme) .note-body-wrapper {
  background-color: var(--bg-surface) !important;
}

:global(.dark-theme) .note-header-bar,
:global(.dark-mode) .note-header-bar,
:global(.oled-theme) .note-header-bar,
:global(.dark-theme) .note-footer-bar,
:global(.dark-mode) .note-footer-bar,
:global(.oled-theme) .note-footer-bar {
  border-color: var(--border-color) !important;
}

:global(.dark-theme) .stats-box,
:global(.dark-mode) .stats-box,
:global(.oled-theme) .stats-box {
  background-color: var(--bg-input) !important;
  border-color: var(--border-color) !important;
}

:global(.dark-theme) .btn-action-btn,
:global(.dark-mode) .btn-action-btn,
:global(.oled-theme) .btn-action-btn {
  background-color: var(--bg-input) !important;
  border-color: var(--border-color) !important;
  color: #cbd5e1 !important;
}

:global(.dark-theme) .btn-action-btn:hover,
:global(.dark-mode) .btn-action-btn:hover,
:global(.oled-theme) .btn-action-btn:hover {
  background-color: var(--bg-hover) !important;
  color: #60a5fa !important;
}

:global(.dark-theme) .modal-backdrop-custom .card,
:global(.dark-mode) .modal-backdrop-custom .card {
  background-color: var(--bg-surface) !important;
  color: #f8fafc !important;
  border: 1px solid var(--border-color) !important;
}

:global(.oled-theme) .modal-backdrop-custom .card {
  background-color: #0d0d0d !important;
  color: #ffffff !important;
  border: 1px solid #27272a !important;
}
</style>
