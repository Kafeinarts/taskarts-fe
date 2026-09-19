<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-dark text-white fw-bold px-3 py-1.5 rounded-pill">💻 Developer Repository</span>
          <span class="badge bg-success-subtle text-success fw-bold px-3 py-1.5 rounded-pill">Auto-Detect Language</span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">💻 Code Notes & Snippet Library</h2>
        <p class="text-muted mb-0">Simpan potongan kodingan (code snippets) penting Anda dengan deteksi bahasa pemrograman otomatis dan fitur salin sekali klik.</p>
      </div>

      <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2" @click="openAddModal">
        <i class="bi bi-plus-circle-fill fs-5"></i> Tambah Code Snippet
      </button>
    </div>

    <!-- Search & Filter Controls -->
    <div class="card border-0 shadow-sm rounded-4 bg-white p-3 mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-6">
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
            <input type="text" class="form-control bg-light border-start-0" placeholder="Cari snippet berdasarkan judul, tag, atau kodingan..." v-model="searchQuery" />
          </div>
        </div>

        <div class="col-md-6 d-flex flex-wrap gap-2 justify-content-md-end">
          <button
            v-for="lang in availableLangs"
            :key="lang"
            class="btn btn-sm rounded-pill px-3 py-1 fw-semibold transition-all"
            :class="selectedLang === lang ? 'btn-primary text-white shadow-sm' : 'btn-outline-secondary'"
            @click="selectedLang = lang"
          >
            {{ lang }}
          </button>
        </div>
      </div>
    </div>

    <!-- Code Snippets Grid -->
    <div v-if="filteredSnippets.length === 0" class="text-center py-5 bg-white rounded-4 border shadow-sm">
      <i class="bi bi-code-slash fs-1 text-muted d-block mb-2"></i>
      <h5 class="fw-bold text-dark">Belum ada Code Snippet tersimpan</h5>
      <p class="text-muted small">Klik tombol "Tambah Code Snippet" untuk menyimpan kodingan favorit Anda.</p>
    </div>

    <div v-else class="row g-4">
      <div v-for="snippet in filteredSnippets" :key="snippet.id" class="col-lg-6">
        <div
          class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden h-100 snippet-card cursor-pointer transition-all hover-elevate"
          @click="openSnippetDetail(snippet.id)"
          :title="'Klik untuk melihat detail lengkap ' + snippet.title"
        >
          <!-- Card Header -->
          <div class="card-header bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2 overflow-hidden me-2">
              <span class="badge bg-dark fw-mono text-uppercase px-2.5 py-1.5 rounded">{{ snippet.language }}</span>
              <h6 class="fw-bold text-dark mb-0 text-truncate" :title="snippet.title">{{ snippet.title }}</h6>
            </div>

            <!-- Action Controls -->
            <div class="d-flex align-items-center gap-1.5 flex-shrink-0" @click.stop>
              <button
                class="btn btn-sm btn-outline-primary rounded-circle p-1.5 action-btn"
                @click.stop="copyCode(snippet.code)"
                title="Salin Kode Cepat"
              >
                <i class="bi bi-clipboard"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-secondary rounded-circle p-1.5 action-btn"
                @click.stop="openSnippetDetail(snippet.id)"
                title="Lihat Detail Lengkap"
              >
                <i class="bi bi-arrows-angle-expand"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-danger rounded-circle p-1.5 action-btn"
                @click.stop="deleteSnippet(snippet.id)"
                title="Hapus Snippet"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>

          <!-- Code Preview Box (clickable to full detail) -->
          <div class="card-body p-3 bg-dark position-relative code-preview-wrapper">
            <div class="code-preview-overlay">
              <span class="badge bg-primary rounded-pill px-3 py-1.5 fw-semibold shadow-sm">
                <i class="bi bi-eye-fill me-1"></i> Buka Full Detail & Editor
              </span>
            </div>
            <pre class="m-0 font-monospace text-light small overflow-x-auto p-2" style="max-height: 200px; font-family: 'Fira Code', 'Consolas', monospace; line-height: 1.4;"><code>{{ snippet.code }}</code></pre>
          </div>

          <!-- Card Footer -->
          <div class="card-footer bg-white border-top p-3 d-flex justify-content-between align-items-center">
            <small class="text-muted text-truncate me-2" style="max-width: 60%;">
              {{ snippet.description || 'Klik untuk melihat detail atau menjalankan sandbox' }}
            </small>
            <div class="d-flex gap-1 flex-wrap justify-content-end">
              <span v-for="(tag, i) in (snippet.tags || []).slice(0, 3)" :key="i" class="badge bg-secondary-subtle text-secondary small rounded-pill">
                #{{ tag }}
              </span>
              <span v-if="snippet.tags && snippet.tags.length > 3" class="badge bg-light text-muted border small rounded-pill">
                +{{ snippet.tags.length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- In-Page Form Add Snippet (No Modal) -->
    <div v-if="showModal" class="card border-0 shadow rounded-4 bg-white p-4 my-4 animate-scale border-top border-primary border-4">
      <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
        <h5 class="fw-bold text-dark mb-0"><i class="bi bi-code-square me-2 text-primary"></i>Form Tambah Code Snippet</h5>
        <button class="btn-close" @click="showModal = false"></button>
      </div>

      <form @submit.prevent="saveSnippet">
        <div class="mb-3">
          <label class="form-label fw-bold text-dark small">Judul Snippet <span class="text-danger">*</span></label>
          <input type="text" class="form-control" placeholder="Contoh: Fetch API dengan Vue 3 Composition API" v-model="form.title" required />
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <label class="form-label fw-bold text-dark small">Bahasa Pemrograman</label>
            <select class="form-select" v-model="form.language">
              <option value="javascript">JavaScript / TypeScript</option>
              <option value="python">Python</option>
              <option value="sql">SQL</option>
              <option value="html">HTML / Vue / JSX</option>
              <option value="css">CSS / Tailwind</option>
              <option value="php">PHP</option>
              <option value="java">Java</option>
              <option value="cpp">C / C++</option>
              <option value="shell">Bash / Shell</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold text-dark small">Tags (Pisahkan Koma)</label>
            <input type="text" class="form-control" placeholder="api, vue3, composition" v-model="form.tagsInput" />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold text-dark small">Kode Sumber <span class="text-danger">*</span></label>
          <textarea
            class="form-control font-monospace bg-dark text-success border-2"
            rows="6"
            placeholder="Paste potongan kode kodingan Anda di sini..."
            v-model="form.code"
            @input="detectLanguage"
            required
          ></textarea>
          <small v-if="detectedLangLabel" class="text-primary fw-bold mt-1 d-block">
            ✨ Auto-Detected Language: {{ detectedLangLabel }}
          </small>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold text-dark small">Catatan / Keterangan Tambahan</label>
          <input type="text" class="form-control" placeholder="Cara penggunaan singkat atau konteks pustaka..." v-model="form.description" />
        </div>

        <div class="d-flex justify-content-end gap-2 border-top pt-3">
          <button type="button" class="btn btn-light rounded-pill px-4" @click="showModal = false">Batal</button>
          <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Simpan Snippet</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { sendOnDeviceNotification } from '../../utils/notification';
import Swal from 'sweetalert2';

export default {
  name: 'CodeNotesView',
  setup() {
    const store = useStore();
    const router = useRouter();

    const searchQuery = ref('');
    const selectedLang = ref('Semua');
    const showModal = ref(false);
    const detectedLangLabel = ref('');

    const availableLangs = ['Semua', 'javascript', 'python', 'sql', 'html', 'css', 'php', 'shell'];

    const snippets = computed(() => store.getters.getCodeNotes || []);

    const filteredSnippets = computed(() => {
      return snippets.value.filter(s => {
        const matchesLang = selectedLang.value === 'Semua' || s.language === selectedLang.value;
        const q = searchQuery.value.toLowerCase();
        const matchesSearch = !q || s.title.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || (s.tags && s.tags.some(t => t.toLowerCase().includes(q)));
        return matchesLang && matchesSearch;
      });
    });

    const openSnippetDetail = (id) => {
      if (id) {
        router.push(`/code-notes/${id}`);
      }
    };

    const form = ref({
      title: '',
      language: 'javascript',
      code: '',
      description: '',
      tagsInput: ''
    });

    const openAddModal = () => {
      form.value = { title: '', language: 'javascript', code: '', description: '', tagsInput: '' };
      detectedLangLabel.value = '';
      showModal.value = true;
    };

    const detectLanguage = () => {
      const code = form.value.code;
      if (code.includes('def ') || (code.includes('import ') && code.includes('print('))) {
        form.value.language = 'python';
        detectedLangLabel.value = 'Python';
      } else if (code.includes('SELECT ') || code.includes('FROM ') || code.includes('CREATE TABLE')) {
        form.value.language = 'sql';
        detectedLangLabel.value = 'SQL';
      } else if (code.includes('<template>') || code.includes('<div') || code.includes('const ') || code.includes('=>')) {
        form.value.language = 'javascript';
        detectedLangLabel.value = 'JavaScript/Vue';
      } else if (code.includes('<?php') || code.includes('$')) {
        form.value.language = 'php';
        detectedLangLabel.value = 'PHP';
      }
    };

    const saveSnippet = () => {
      if (!form.value.title || !form.value.code) return;

      const tags = form.value.tagsInput ? form.value.tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];

      store.dispatch('addCodeNote', {
        title: form.value.title,
        language: form.value.language,
        code: form.value.code,
        description: form.value.description,
        tags
      });

      sendOnDeviceNotification('💻 Snippet Disimpan', {
        body: `Code snippet "${form.value.title}" berhasil disimpan.`,
        type: 'success'
      });

      showModal.value = false;
    };

    const deleteSnippet = (id) => {
      Swal.fire({
        title: 'Hapus Snippet?',
        text: 'Hapus code snippet ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('deleteCodeNote', id);
          sendOnDeviceNotification('🗑️ Snippet Dihapus', { body: 'Code snippet telah dihapus.', type: 'info' });
        }
      });
    };

    const copyCode = (code) => {
      navigator.clipboard.writeText(code);
      sendOnDeviceNotification('📋 Kode Tersalin', { body: 'Potongan kode tersalin ke clipboard', type: 'info' });
    };

    return {
      searchQuery,
      selectedLang,
      showModal,
      detectedLangLabel,
      availableLangs,
      filteredSnippets,
      openSnippetDetail,
      form,
      openAddModal,
      detectLanguage,
      saveSnippet,
      deleteSnippet,
      copyCode
    };
  }
};
</script>

<style scoped>
.snippet-card {
  border: 1px solid #e2e8f0;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.snippet-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05) !important;
  border-color: #cbd5e1;
}

.code-preview-wrapper {
  cursor: pointer;
}

.code-preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.snippet-card:hover .code-preview-overlay {
  opacity: 1;
}

.action-btn {
  transition: transform 0.15s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.cursor-pointer {
  cursor: pointer;
}

.transition-all {
  transition: all 0.2s ease;
}

.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1050;
}
.max-w-2xl {
  max-width: 42rem;
}
</style>
