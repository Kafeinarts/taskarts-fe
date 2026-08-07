<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- MODE EDIT: DEDICATED MARKDOWN EDITOR STUDIO PAGE (NO SLIDER/DRAWER) -->
    <div v-if="isEditing" class="markdown-editor-studio">
      <!-- Editor Top Navigation Bar -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 p-4 rounded-4 shadow-sm border editor-header-card">
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-outline-secondary rounded-3 px-3 py-2 d-flex align-items-center gap-2 fw-semibold" @click="cancelEdit">
            <i class="bi bi-arrow-left fs-5"></i>
            <span>Kembali ke Preview</span>
          </button>
          <div class="border-start ps-3 d-none d-sm-block">
            <span class="badge bg-warning text-dark fw-bold px-3 py-1.5 rounded-pill mb-1">
              <i class="bi bi-markdown-fill me-1"></i> Markdown Editor Studio
            </span>
            <h4 class="fw-bold mb-0 header-title">Edit Catatan Document</h4>
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
              <i class="bi bi-layout-split me-1"></i> Split View
            </button>
            <button
              type="button"
              class="btn btn-sm py-2 px-3 fw-semibold"
              :class="editorLayout === 'editor' ? 'btn-dark' : 'btn-outline-secondary'"
              @click="editorLayout = 'editor'"
              title="Ketik Full Editor"
            >
              <i class="bi bi-file-earmark-code me-1"></i> Full Editor
            </button>
            <button
              type="button"
              class="btn btn-sm py-2 px-3 fw-semibold"
              :class="editorLayout === 'preview' ? 'btn-dark' : 'btn-outline-secondary'"
              @click="editorLayout = 'preview'"
              title="Pratinjau Hasil"
            >
              <i class="bi bi-eye me-1"></i> Live Preview
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
          <div class="markdown-toolbar p-2 rounded-3 border mb-3 d-flex flex-wrap align-items-center gap-1">
            <span class="small fw-bold text-muted me-2 ms-1"><i class="bi bi-type me-1"></i>Toolbar:</span>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1 fw-bold" @click="insertMarkdown('**', '**')" title="Bold (Tebal)"><i class="bi bi-type-bold"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1" @click="insertMarkdown('*', '*')" title="Italic (Miring)"><i class="bi bi-type-italic"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1 fw-bold" @click="insertMarkdown('# ')" title="Heading 1">H1</button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1 fw-bold" @click="insertMarkdown('## ')" title="Heading 2">H2</button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1 fw-bold" @click="insertMarkdown('### ')" title="Heading 3">H3</button>
            <div class="vr mx-1"></div>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1" @click="insertMarkdown('> ')" title="Quote (Kutipan)"><i class="bi bi-quote"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1" @click="insertMarkdown('```\n', '\n```')" title="Code Block"><i class="bi bi-code-slash"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1" @click="insertMarkdown('`', '`')" title="Inline Code"><i class="bi bi-code"></i></button>
            <div class="vr mx-1"></div>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1" @click="insertMarkdown('- ')" title="Bullet List"><i class="bi bi-list-ul"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1" @click="insertMarkdown('1. ')" title="Numbered List"><i class="bi bi-list-ol"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1" @click="insertMarkdown('- [ ] ')" title="Checklist / Task"><i class="bi bi-check2-square"></i></button>
            <div class="vr mx-1"></div>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1" @click="insertMarkdown('[', '](https://)')" title="Insert Link"><i class="bi bi-link-45deg"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1" @click="insertMarkdown('\n| Kolom 1 | Kolom 2 |\n| --- | --- |\n| Isi 1 | Isi 2 |\n')" title="Table Markdown"><i class="bi bi-table"></i></button>
            <button type="button" class="btn btn-sm btn-white border rounded-2 px-2.5 py-1" @click="insertMarkdown('\n---\n')" title="Horizontal Divider">---</button>
          </div>

          <!-- Editor Body Grid (Split vs Single) -->
          <div class="row g-4">
            <!-- Textarea Field -->
            <div :class="editorLayout === 'split' ? 'col-lg-6' : (editorLayout === 'editor' ? 'col-12' : 'd-none')">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="form-label fw-bold text-dark small mb-0"><i class="bi bi-pencil-fill text-primary me-1"></i> Editor Markdown</label>
                <span class="small text-muted font-monospace">{{ editLineCount }} Baris | {{ getWordCount(editForm.content) }} Kata | {{ (editForm.content || '').length }} Karakter</span>
              </div>
              <textarea
                ref="editorTextarea"
                class="form-control font-monospace border-2 p-3 text-editor-area rounded-3"
                rows="18"
                v-model="editForm.content"
                placeholder="Tulis catatan lengkap dengan sintaks Markdown di sini..."
              ></textarea>
            </div>

            <!-- Live Preview Card -->
            <div :class="editorLayout === 'split' ? 'col-lg-6' : (editorLayout === 'preview' ? 'col-12' : 'd-none')">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="form-label fw-bold text-dark small mb-0"><i class="bi bi-eye-fill text-success me-1"></i> Live Markdown Preview</label>
                <span class="badge bg-success-subtle text-success fw-bold rounded-pill px-2.5 py-1 small">Realtime Sync</span>
              </div>
              <div class="card p-4 rounded-3 border-2 bg-light overflow-y-auto editor-preview-box" style="height: 480px;">
                <div class="note-markdown-body" v-html="renderedEditMarkdown"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Action Bar -->
        <div class="card-footer p-4 border-top bg-light d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
          <span class="small text-muted">
            <i class="bi bi-info-circle me-1"></i> Format Markdown otomatis dirender di pratinjau langsung secara real-time.
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
            <span>Kembali ke Notes</span>
          </router-link>
          <div class="border-start ps-3 d-none d-sm-block" v-if="note">
            <span class="badge badge-preview-tag fw-bold px-3 py-1.5 rounded-pill mb-1">
              <i class="bi bi-file-earmark-text me-1"></i> Detail Preview Catatan
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
          <button class="btn btn-action-btn border rounded-3 px-3 py-2 fw-semibold d-flex align-items-center gap-2" @click="printNote">
            <i class="bi bi-printer"></i>
            <span>Cetak / Export</span>
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
      <div v-if="note" class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 main-note-card">
        <!-- Top Colored Accent Bar matching Note Theme -->
        <div class="note-top-color-bar" :style="{ backgroundColor: note.color || '#2563eb' }"></div>

        <!-- Note Header Bar -->
        <div class="p-4 p-md-5 border-bottom note-header-bar d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <span class="badge doc-badge rounded-pill px-3 py-1.5 text-uppercase fw-bold" style="font-size: 11px; letter-spacing: 0.5px;">
                <i class="bi bi-markdown me-1"></i> Markdown Document
              </span>
              <span class="small text-sub-heading d-flex align-items-center gap-1">
                <i class="bi bi-clock me-1"></i> Terakhir diperbarui: {{ formatDate(note.updatedAt) }}
              </span>
            </div>
            <h1 class="display-6 fw-extrabold main-note-title mb-0">{{ note.title || 'Untitled Note' }}</h1>
          </div>

          <div class="d-flex align-items-center gap-3 stats-box p-3 rounded-3 border">
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
        <div class="card-body p-4 p-md-5 note-body-wrapper">
          <div class="note-markdown-body" v-html="renderedMarkdown"></div>
        </div>

        <!-- Note Footer Info -->
        <div class="card-footer p-4 border-top note-footer-bar d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <span class="small text-sub-heading">
            <i class="bi bi-shield-check text-success me-1"></i> Catatan ini tersimpan aman di penyimpanan lokal aplikasi Anda.
          </span>
          <span class="small text-sub-heading">ID: <code class="note-id-code fw-bold">{{ note.id }}</code></span>
        </div>
      </div>

      <!-- NOTE NOT FOUND STATE -->
      <div v-else class="text-center py-5 rounded-4 shadow-sm border my-4 not-found-box">
        <div class="display-1 text-muted opacity-50 mb-3">📑</div>
        <h3 class="fw-bold not-found-title">Catatan Tidak Ditemukan</h3>
        <p class="text-sub-heading max-w-md mx-auto">Catatan yang Anda cari mungkin telah dihapus atau ID tidak valid.</p>
        <router-link to="/notes" class="btn btn-primary rounded-3 px-4 py-2 mt-2 fw-semibold">
          <i class="bi bi-arrow-left me-1"></i> Kembali ke Daftar Notes
        </router-link>
      </div>
    </div>

    <!-- Sleek Toast Notification -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1090;">
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
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { marked } from 'marked';

export default {
  name: 'NoteDetailView',
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
      { name: 'Kuning', code: '#fef08a' },
      { name: 'Biru', code: '#bae6fd' },
      { name: 'Hijau', code: '#bbf7d0' },
      { name: 'Merah Muda', code: '#fbcfe8' },
      { name: 'Ungu', code: '#e9d5ff' }
    ];

    const note = computed(() => {
      const id = route.params.id;
      const allNotes = store.getters.getNotes || [];
      return allNotes.find(n => n.id === id) || null;
    });

    const renderedMarkdown = computed(() => {
      if (!note.value || !note.value.content) return '<p class="text-muted italic">Tidak ada isi teks pada catatan ini.</p>';
      try {
        return marked.parse(note.value.content);
      } catch (e) {
        return note.value.content;
      }
    });

    const renderedEditMarkdown = computed(() => {
      if (!editForm.value || !editForm.value.content) return '<p class="text-muted italic">Pratinjau kosong. Ketik sesuatu di editor.</p>';
      try {
        return marked.parse(editForm.value.content);
      } catch (e) {
        return editForm.value.content;
      }
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

    const printNote = () => {
      window.print();
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

      setTimeout(() => {
        el.focus();
        const newPos = start + prefix.length + (selected || '').length;
        el.setSelectionRange(newPos, newPos);
      }, 0);
    };

    const saveEditNote = () => {
      if (!editForm.value) return;
      const updated = {
        ...editForm.value,
        updatedAt: new Date().toISOString()
      };
      store.commit('UPDATE_NOTE', updated);
      isEditing.value = false;
      showToast('Catatan berhasil diperbarui!');
    };

    const deleteNote = () => {
      if (!note.value) return;
      if (confirm(`Apakah Anda yakin ingin menghapus catatan "${note.value.title}"?`)) {
        store.commit('DELETE_NOTE', note.value.id);
        router.push('/notes');
      }
    };

    const showToast = (msg) => {
      toast.value = { show: true, message: msg };
      setTimeout(() => {
        toast.value.show = false;
      }, 3000);
    };

    onMounted(() => {
      if (route.query.edit === 'true' && note.value) {
        openEditor();
      }
    });

    return {
      note,
      renderedMarkdown,
      renderedEditMarkdown,
      editLineCount,
      getWordCount,
      formatDate,
      copyContent,
      printNote,
      isEditing,
      editForm,
      editorLayout,
      editorTextarea,
      colorOptions,
      openEditor,
      cancelEdit,
      insertMarkdown,
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
}

.btn-action-btn:hover {
  background-color: #e2e8f0;
  color: #0f172a;
}

.stats-box {
  background-color: #f8fafc;
  border-color: #e2e8f0;
}

.main-note-card, .main-editor-card {
  background-color: #ffffff;
}

.note-header-bar {
  background-color: #ffffff;
  border-color: #e2e8f0;
}

.note-body-wrapper {
  background-color: #ffffff;
}

.note-footer-bar {
  background-color: #f8fafc;
  border-color: #e2e8f0;
}

.not-found-box {
  background-color: #ffffff;
  border-color: #e2e8f0;
}

.note-id-code {
  color: #2563eb;
  background-color: #eff6ff;
  padding: 0.15rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #dbeafe;
}

.markdown-toolbar {
  background-color: #f8fafc;
  border-color: #e2e8f0;
}

.btn-white {
  background-color: #ffffff;
  color: #334155;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.btn-white:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.color-swatch-btn {
  border: 2px solid transparent;
  transition: transform 0.2s ease;
}

.color-swatch-btn:hover {
  transform: scale(1.15);
}

.color-swatch-btn.ring-active {
  border-color: #0f172a !important;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.2);
}

.title-input-field:focus {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.15) !important;
}

.text-editor-area {
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: vertical;
}

/* TYPOGRAPHY & MARKDOWN STYLING - LIGHT MODE */
.note-markdown-body {
  font-size: 1.08rem;
  line-height: 1.8;
  color: #1e293b;
  word-break: break-word;
}

.note-markdown-body :deep(h1),
.note-markdown-body :deep(h2),
.note-markdown-body :deep(h3),
.note-markdown-body :deep(h4),
.note-markdown-body :deep(h5),
.note-markdown-body :deep(h6) {
  font-weight: 800;
  margin-top: 1.75rem;
  margin-bottom: 0.85rem;
  color: #0f172a;
  letter-spacing: -0.3px;
}

.note-markdown-body :deep(p) {
  margin-bottom: 1.25rem;
}

.note-markdown-body :deep(a) {
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 600;
}

.note-markdown-body :deep(a:hover) {
  color: #1d4ed8;
}

.note-markdown-body :deep(strong),
.note-markdown-body :deep(b) {
  color: #0f172a;
  font-weight: 700;
}

.note-markdown-body :deep(pre) {
  background-color: #0f172a;
  color: #f1f5f9;
  padding: 1.2rem 1.4rem;
  border-radius: 0.85rem;
  overflow-x: auto;
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-size: 0.95rem;
  border: 1px solid #1e293b;
  margin: 1.25rem 0;
}

.note-markdown-body :deep(code) {
  background-color: #eff6ff;
  color: #1d4ed8;
  padding: 0.2rem 0.45rem;
  border-radius: 0.35rem;
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-size: 0.9em;
  border: 1px solid #dbeafe;
}

.note-markdown-body :deep(pre code) {
  background-color: transparent;
  color: inherit;
  padding: 0;
  border: none;
}

.note-markdown-body :deep(blockquote) {
  border-left: 4px solid #2563eb;
  background-color: #f8fafc;
  padding: 1rem 1.25rem;
  border-radius: 0 0.75rem 0.75rem 0;
  margin: 1.25rem 0;
  color: #475569;
  font-style: italic;
}

.note-markdown-body :deep(ul),
.note-markdown-body :deep(ol) {
  padding-left: 1.6rem;
  margin-bottom: 1.25rem;
}

.note-markdown-body :deep(li) {
  margin-bottom: 0.4rem;
}

.note-markdown-body :deep(hr) {
  border: 0;
  height: 1px;
  background: #e2e8f0;
  margin: 2rem 0;
}

.note-markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.note-markdown-body :deep(th),
.note-markdown-body :deep(td) {
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1rem;
  text-align: left;
}

.note-markdown-body :deep(th) {
  background-color: #f8fafc;
  font-weight: 700;
  color: #0f172a;
}

/* DARK THEME SPECIFIC OVERRIDES */
:global(.dark-theme) .top-bar-card,
:global(.dark-theme) .editor-header-card,
:global(.dark-theme) .main-note-card,
:global(.dark-theme) .main-editor-card,
:global(.dark-theme) .note-header-bar,
:global(.dark-theme) .not-found-box {
  background-color: #131b2e !important;
  border-color: #26334d !important;
}

:global(.dark-theme) .note-body-wrapper {
  background-color: #060911 !important;
  border-color: #1e293b !important;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.6);
}

:global(.dark-theme) .header-title,
:global(.dark-theme) .main-note-title,
:global(.dark-theme) .not-found-title,
:global(.dark-theme) .stat-value {
  color: #f8fafc !important;
}

:global(.dark-theme) .text-sub-heading {
  color: #94a3b8 !important;
}

:global(.dark-theme) .badge-preview-tag {
  background-color: rgba(30, 58, 138, 0.45) !important;
  color: #60a5fa !important;
  border-color: rgba(96, 165, 250, 0.3) !important;
}

:global(.dark-theme) .doc-badge {
  background-color: #0f172a !important;
  color: #38bdf8 !important;
  border: 1px solid #334155 !important;
}

:global(.dark-theme) .btn-action-btn {
  background-color: #1e293b !important;
  border-color: #334155 !important;
  color: #f8fafc !important;
}

:global(.dark-theme) .btn-action-btn:hover {
  background-color: #334155 !important;
  color: #ffffff !important;
}

:global(.dark-theme) .stats-box,
:global(.dark-theme) .note-footer-bar,
:global(.dark-theme) .markdown-toolbar {
  background-color: #090d16 !important;
  border-color: #26334d !important;
}

:global(.dark-theme) .btn-white {
  background-color: #1e293b !important;
  color: #f8fafc !important;
  border-color: #334155 !important;
}

:global(.dark-theme) .btn-white:hover {
  background-color: #334155 !important;
}

:global(.dark-theme) .title-input-field,
:global(.dark-theme) .text-editor-area {
  background-color: #090d16 !important;
  color: #f8fafc !important;
  border-color: #26334d !important;
}

:global(.dark-theme) .editor-preview-box {
  background-color: #060911 !important;
  border-color: #26334d !important;
}

:global(.dark-theme) .note-id-code {
  color: #60a5fa !important;
  background-color: #090d16 !important;
  border-color: #26334d !important;
}

:global(.dark-theme) .note-markdown-body {
  font-family: 'Fira Code', 'JetBrains Mono', 'Source Code Pro', 'Cascadia Code', Menlo, Monaco, Consolas, monospace !important;
  color: #f8fafc !important;
}

:global(.dark-theme) .note-markdown-body :deep(*) {
  font-family: 'Fira Code', 'JetBrains Mono', 'Source Code Pro', 'Cascadia Code', Menlo, Monaco, Consolas, monospace !important;
}

:global(.dark-theme) .note-markdown-body :deep(p),
:global(.dark-theme) .note-markdown-body :deep(li),
:global(.dark-theme) .note-markdown-body :deep(span),
:global(.dark-theme) .note-markdown-body :deep(div) {
  color: #f1f5f9 !important;
}

:global(.dark-theme) .note-markdown-body :deep(h1),
:global(.dark-theme) .note-markdown-body :deep(h2),
:global(.dark-theme) .note-markdown-body :deep(h3),
:global(.dark-theme) .note-markdown-body :deep(h4),
:global(.dark-theme) .note-markdown-body :deep(h5),
:global(.dark-theme) .note-markdown-body :deep(h6) {
  color: #38bdf8 !important;
  font-weight: 700;
}

:global(.dark-theme) .note-markdown-body :deep(strong),
:global(.dark-theme) .note-markdown-body :deep(b) {
  color: #ffffff !important;
  font-weight: 700;
}

:global(.dark-theme) .note-markdown-body :deep(a) {
  color: #60a5fa !important;
  text-decoration: underline;
}

:global(.dark-theme) .note-markdown-body :deep(a:hover) {
  color: #93c5fd !important;
}

:global(.dark-theme) .note-markdown-body :deep(code) {
  background-color: #111827 !important;
  color: #f472b6 !important;
  border: 1px solid #374151 !important;
  border-radius: 0.35rem;
  padding: 0.2rem 0.45rem;
}

:global(.dark-theme) .note-markdown-body :deep(pre) {
  background-color: #030712 !important;
  color: #f9fafb !important;
  border: 1px solid #1f2937 !important;
  border-radius: 0.75rem;
  padding: 1.2rem;
}

:global(.dark-theme) .note-markdown-body :deep(pre code) {
  background-color: transparent !important;
  color: #4ade80 !important;
  border: none !important;
  padding: 0;
}

:global(.dark-theme) .note-markdown-body :deep(blockquote) {
  background-color: #0f172a !important;
  border-left: 4px solid #38bdf8 !important;
  color: #e2e8f0 !important;
  padding: 1rem 1.25rem;
  border-radius: 0 0.5rem 0.5rem 0;
}

:global(.dark-theme) .note-markdown-body :deep(th),
:global(.dark-theme) .note-markdown-body :deep(td) {
  border-color: #1e293b !important;
  padding: 0.75rem 1rem;
}

:global(.dark-theme) .note-markdown-body :deep(th) {
  background-color: #0f172a !important;
  color: #38bdf8 !important;
}

:global(.dark-theme) .note-markdown-body :deep(hr) {
  background: #1e293b !important;
}

@media print {
  .toast-container, button, .router-link, .markdown-toolbar {
    display: none !important;
  }
}
</style>
