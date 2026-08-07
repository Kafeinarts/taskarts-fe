<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- MODE 1: MAIN LIST VIEW PAGE -->
    <div v-if="activeMode === 'list'">
      <!-- Header Banner -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border">
        <div>
          <div class="d-flex align-items-center gap-2 mb-1">
            <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill">RajinKerja Notes & Docs</span>
            <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill d-flex align-items-center gap-1">
              <span class="pulse-dot bg-success"></span> Auto-Save Active
            </span>
          </div>
          <h2 class="fw-bold mb-1 text-dark">📝 Notes, Scratchpad & Bulk Documenter</h2>
          <p class="text-muted mb-0">Kelola catatan harian, dokumentasi proyek, dan coretan ide karyawan dengan auto-save interval otomatis.</p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button
            class="btn btn-warning text-dark px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 border shadow-sm"
            @click="toggleMode('scratchpad')"
          >
            <i class="bi bi-sticky-fill fs-5"></i>
            <span>Quick Scratchpad</span>
          </button>
          <button
            class="btn btn-primary text-white px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 border shadow-sm"
            @click="toggleMode('editor')"
          >
            <i class="bi bi-pencil-square fs-5"></i>
            <span>Buat Note Baru</span>
          </button>
          <button
            class="btn btn-success text-white px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 border shadow-sm"
            @click="toggleMode('bulk')"
          >
            <i class="bi bi-ui-checks-grid fs-5"></i>
            <span>Bulk Multi-Form</span>
          </button>
        </div>
      </div>

      <!-- SEARCH & FILTER BAR -->
      <div class="bg-white p-3 rounded-4 shadow-sm border mb-4">
        <div class="row g-3 align-items-center">
          <div class="col-md-5">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-search"></i></span>
              <input
                type="text"
                class="form-control bg-light border-start-0 ps-0"
                placeholder="Cari judul atau kata kunci catatan..."
                v-model="searchQuery"
              />
              <button v-if="searchQuery" class="btn btn-light border" @click="searchQuery = ''">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          <div class="col-md-7 d-flex align-items-center justify-content-md-end gap-2 overflow-auto">
            <span class="small fw-semibold text-muted d-none d-sm-inline">Filter:</span>
            <button
              class="btn btn-sm rounded-pill px-3"
              :class="selectedColor === 'all' ? 'btn-dark' : 'btn-light border'"
              @click="selectedColor = 'all'"
            >
              Semua ({{ notes.length }})
            </button>
            <button
              v-for="c in colorOptions"
              :key="c.code"
              class="btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
              :class="selectedColor === c.code ? 'border-2 border-dark shadow-sm' : 'border'"
              :style="{ backgroundColor: c.code, color: '#000' }"
              @click="selectedColor = c.code"
            >
              <span>{{ c.name }}</span>
              <span class="badge bg-white text-dark rounded-circle px-1" style="font-size: 10px;">
                {{ getNotesCountByColor(c.code) }}
              </span>
            </button>
          </div>
        </div>

        <!-- Bulk Selection Toolbar -->
        <div v-if="selectedIds.length > 0" class="mt-3 pt-2 border-top d-flex justify-content-between align-items-center bg-primary-subtle p-2 rounded-3">
          <span class="small fw-bold text-primary">
            <i class="bi bi-check-square-fill me-1"></i> {{ selectedIds.length }} catatan terpilih
          </span>
          <button class="btn btn-sm btn-danger rounded-pill px-3" @click="bulkDeleteSelected">
            <i class="bi bi-trash-fill me-1"></i> Hapus Terpilih
          </button>
        </div>
      </div>

      <!-- NOTES GRID -->
      <div class="row g-3" v-if="filteredNotes.length > 0">
        <div v-for="note in filteredNotes" :key="note.id" class="col-md-6 col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 h-100 p-4 hover-card position-relative sticky-note-card" :style="{ '--note-accent': note.color || '#fef08a' }">
            <div class="note-color-stripe" :style="{ backgroundColor: note.color || '#fef08a' }"></div>
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="d-flex align-items-center gap-2">
                <input type="checkbox" class="form-check-input mt-0 cursor-pointer" :value="note.id" v-model="selectedIds" />
                <router-link :to="'/notes/' + note.id" class="text-decoration-none">
                  <h5 class="fw-bold mb-0 text-break hover-title note-card-title">{{ note.title || 'Untitled Note' }}</h5>
                </router-link>
              </div>
              <div class="d-flex gap-1">
                <router-link :to="'/notes/' + note.id" class="btn btn-xs btn-action-icon rounded-circle shadow-sm" title="Buka Detail Preview Halaman Baru">
                  <i class="bi bi-arrows-angle-expand"></i>
                </router-link>
                <button class="btn btn-xs btn-action-icon rounded-circle shadow-sm" @click="copyNoteContent(note.content)" title="Salin Isi Catatan">
                  <i class="bi bi-clipboard"></i>
                </button>
                <button class="btn btn-xs btn-action-icon rounded-circle shadow-sm" @click="editNoteInline(note)" title="Edit Note">
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="btn btn-xs btn-action-icon text-danger rounded-circle shadow-sm" @click="deleteNoteDirect(note.id)" title="Hapus Note">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>

            <!-- Live Rendered Markdown Content -->
            <router-link :to="'/notes/' + note.id" class="text-decoration-none d-block">
              <div class="markdown-preview note-card-preview small flex-grow-1 my-2 border-top border-bottom py-2 overflow-hidden" style="max-height: 200px;" v-html="renderMarkdown(note.content)"></div>
            </router-link>

            <div class="d-flex justify-content-between align-items-center mt-2 pt-2 note-card-footer">
              <span><i class="bi bi-clock me-1"></i>{{ formatDate(note.updatedAt) }}</span>
              <router-link :to="'/notes/' + note.id" class="btn btn-xs btn-preview-badge rounded-pill px-2.5 py-1 fw-semibold text-decoration-none">
                <i class="bi bi-eye me-1"></i> Detail Preview
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-5 bg-white rounded-4 shadow-sm border my-4">
        <i class="bi bi-journal-text display-1 text-muted opacity-50"></i>
        <h4 class="fw-bold mt-3 text-dark">Belum Ada Catatan</h4>
        <p class="text-muted">Buat note pertama Anda atau gunakan fitur Bulk Multi-Form untuk menambah banyak catatan sekaligus.</p>
        <div class="d-flex justify-content-center gap-2 mt-3">
          <button class="btn btn-primary rounded-3 px-4 py-2 fw-semibold" @click="toggleMode('editor')">
            <i class="bi bi-plus-lg me-1"></i> Buat Note Baru
          </button>
          <button class="btn btn-success rounded-3 px-4 py-2 fw-semibold" @click="toggleMode('bulk')">
            <i class="bi bi-ui-checks-grid me-1"></i> Bulk Form Input
          </button>
        </div>
      </div>
    </div>

    <!-- MODE 2: QUICK SCRATCHPAD FULL NEW PAGE VIEW (HALAMAN BARU) -->
    <div v-else-if="activeMode === 'scratchpad'">
      <div class="bg-white p-4 rounded-4 shadow-sm border mb-4">
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-outline-secondary rounded-3 px-3 py-2 fw-bold d-flex align-items-center gap-2" @click="activeMode = 'list'">
            <i class="bi bi-arrow-left fs-5"></i>
            <span>Kembali ke Daftar Catatan</span>
          </button>
          <div class="border-start ps-3">
            <span class="badge bg-warning-subtle text-warning-emphasis fw-bold px-3 py-1 rounded-pill mb-1">
              <i class="bi bi-sticky-fill me-1"></i> Halaman Coretan Cepat
            </span>
            <h3 class="fw-extrabold text-dark mb-0">Quick Scratchpad (Auto-Save 2 Detik)</h3>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5 border-start border-4 border-warning">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
          <div>
            <h5 class="fw-bold text-dark mb-1">Coretan Serbaguna & Auto-Save</h5>
            <p class="text-muted small mb-0">Tulis ide cepat, nomor kontak, atau snippet. Otomatis tersimpan ke browser (localStorage) setiap 2 detik.</p>
          </div>
          <div class="d-flex align-items-center gap-3">
            <div class="d-flex align-items-center gap-2 px-3 py-1.5 bg-light rounded-pill border small">
              <i class="bi bi-floppy-fill text-success" :class="{ 'spin-icon': isAutoSavingScratchpad }"></i>
              <span class="fw-bold text-dark">{{ scratchpadSaveStatus }}</span>
            </div>
            <button type="button" class="btn btn-outline-danger rounded-pill px-3 py-1.5 fw-bold" @click="clearScratchpad" v-if="scratchpadContent">
              <i class="bi bi-eraser me-1"></i> Bersihkan Coretan
            </button>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-7">
            <label class="form-label fw-bold text-dark small">Tulis Teks Coretan di Sini</label>
            <textarea
              class="form-control font-monospace border-2 p-3 rounded-3"
              rows="14"
              v-model="scratchpadContent"
              @input="handleScratchpadInput"
              placeholder="Tulis coretan sementara di sini...&#10;- Ide produk baru&#10;- No WA Klien: 0812-3456-xxxx&#10;- Script SQL / Command terminal&#10;&#10;Isi ini tersimpan otomatis tanpa perlu tombol simpan!"
            ></textarea>
          </div>
          <div class="col-lg-5">
            <label class="form-label fw-bold text-dark small">Live Markdown Preview</label>
            <div class="card p-4 rounded-3 border-2 bg-light h-100 d-flex flex-column">
              <div class="markdown-preview small text-dark overflow-auto flex-grow-1" style="max-height: 280px;" v-html="renderMarkdown(scratchpadContent)"></div>
              <div class="border-top pt-3 mt-3 d-flex justify-content-between align-items-center">
                <span class="small text-muted font-monospace">{{ scratchpadContent.length }} karakter</span>
                <button class="btn btn-primary rounded-pill px-4 py-2 fw-bold" @click="convertScratchpadToNote" v-if="scratchpadContent.trim()">
                  <i class="bi bi-arrow-right-circle me-1"></i> Ubah Jadi Note Permanen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODE 3: EDITOR FULL NEW PAGE VIEW (HALAMAN BARU) -->
    <div v-else-if="activeMode === 'editor'">
      <div class="bg-white p-4 rounded-4 shadow-sm border mb-4">
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-outline-secondary rounded-3 px-3 py-2 fw-bold d-flex align-items-center gap-2" @click="activeMode = 'list'">
            <i class="bi bi-arrow-left fs-5"></i>
            <span>Kembali ke Daftar Catatan</span>
          </button>
          <div class="border-start ps-3">
            <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-1 rounded-pill mb-1">
              <i class="bi bi-pencil-square me-1"></i> Form Halaman Baru
            </span>
            <h3 class="fw-extrabold text-dark mb-0">{{ isEditing ? 'Edit Note Catatan' : 'Tulis Note Baru' }}</h3>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5">
        <form @submit.prevent="saveNote" class="row g-4">
          <div class="col-md-8">
            <label class="form-label fw-bold text-dark fs-6">Judul Catatan / Dokumen <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control form-control-lg border-2 fs-5 rounded-3 fw-bold"
              v-model="form.title"
              @input="onFormInput"
              placeholder="Contoh: Checklist Meeting Proyek & KPI Q3"
              required
            />
          </div>

          <div class="col-md-4">
            <label class="form-label fw-bold text-dark fs-6">Warna Tema Sticky Note</label>
            <div class="d-flex gap-2 pt-1">
              <button
                type="button"
                v-for="c in colorOptions"
                :key="c.code"
                class="btn rounded-3 p-0 flex-grow-1 color-selector-btn"
                :style="{ backgroundColor: c.code, height: '42px' }"
                :class="{ 'active-color-ring': form.color === c.code }"
                @click="selectColor(c.code)"
                :title="c.name"
              >
                <i v-if="form.color === c.code" class="bi bi-check-lg text-dark fw-bold fs-5"></i>
              </button>
            </div>
          </div>

          <!-- Markdown Editor Side-by-Side Live Preview -->
          <div class="col-md-6">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <label class="form-label fw-bold text-dark small mb-0"><i class="bi bi-code-slash text-primary me-1"></i>Teks Markdown Editor</label>
              <span class="small text-muted font-monospace">{{ form.content.length }} Karakter | {{ getWordCount(form.content) }} Kata</span>
            </div>
            <textarea
              class="form-control font-monospace border-2 p-3 rounded-3"
              rows="12"
              v-model="form.content"
              @input="onFormInput"
              placeholder="Ketik dengan format Markdown...&#10;# Judul Sesi&#10;- [x] Tugas 1&#10;- [ ] Tugas 2&#10;**Penting:** Target selesai hari ini."
            ></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold text-dark small mb-2"><i class="bi bi-eye-fill text-success me-1"></i>Live Preview Markdown</label>
            <div class="card p-4 rounded-3 border-2 bg-light h-100 overflow-auto preview-box" style="max-height: 320px;">
              <div class="markdown-preview small" v-html="renderMarkdown(form.content)"></div>
            </div>
          </div>

          <div class="col-12 d-flex justify-content-end gap-3 pt-4 border-top">
            <button type="button" class="btn btn-light rounded-3 px-4 py-2.5 fw-semibold border" @click="activeMode = 'list'">Batal</button>
            <button type="submit" class="btn btn-primary rounded-3 px-5 py-2.5 fw-bold shadow-sm d-flex align-items-center gap-2 fs-6">
              <i class="bi bi-check-circle-fill"></i>
              <span>{{ isEditing ? 'Update Catatan' : 'Simpan Catatan Baru' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODE 4: BULK MULTI-FORM FULL NEW PAGE VIEW (HALAMAN BARU) -->
    <div v-else-if="activeMode === 'bulk'">
      <div class="bg-white p-4 rounded-4 shadow-sm border mb-4">
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-outline-secondary rounded-3 px-3 py-2 fw-bold d-flex align-items-center gap-2" @click="activeMode = 'list'">
            <i class="bi bi-arrow-left fs-5"></i>
            <span>Kembali ke Daftar Catatan</span>
          </button>
          <div class="border-start ps-3">
            <span class="badge bg-success-subtle text-success fw-bold px-3 py-1 rounded-pill mb-1">
              <i class="bi bi-ui-checks-grid me-1"></i> Bulk Input Halaman Baru
            </span>
            <h3 class="fw-extrabold text-dark mb-0">Bulk Form Multi-Input Note</h3>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5">
        <!-- Bulk Form Mode Switcher -->
        <div class="d-flex gap-2 mb-4 border-bottom pb-3">
          <button
            class="btn rounded-pill px-4 py-2 fw-bold"
            :class="bulkTab === 'rows' ? 'btn-dark' : 'btn-outline-secondary'"
            @click="bulkTab = 'rows'"
          >
            <i class="bi bi-list-task me-1"></i> Multi-Form Builder ({{ bulkRows.length }} Card)
          </button>
          <button
            class="btn rounded-pill px-4 py-2 fw-bold"
            :class="bulkTab === 'paste' ? 'btn-dark' : 'btn-outline-secondary'"
            @click="bulkTab = 'paste'"
          >
            <i class="bi bi-file-earmark-text me-1"></i> Quick Paste Delimited
          </button>
        </div>

        <!-- Tab 1: Multi-Form Builder Cards -->
        <div v-if="bulkTab === 'rows'">
          <div class="row g-4">
            <div v-for="(row, idx) in bulkRows" :key="idx" class="col-md-6 col-lg-4">
              <div class="card border p-3.5 rounded-4 bg-light position-relative h-100 shadow-sm">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="badge bg-dark text-white rounded-pill px-3 py-1 small fw-bold">Form Note #{{ idx + 1 }}</span>
                  <button
                    type="button"
                    class="btn btn-xs btn-outline-danger border-0 p-1 rounded-circle"
                    @click="removeBulkRow(idx)"
                    v-if="bulkRows.length > 1"
                    title="Hapus baris form ini"
                  >
                    <i class="bi bi-x-circle-fill fs-5"></i>
                  </button>
                </div>

                <input
                  type="text"
                  class="form-control mb-2 fw-bold border-2"
                  v-model="row.title"
                  placeholder="Judul Catatan..."
                />

                <textarea
                  class="form-control mb-3 font-monospace border-2"
                  rows="5"
                  v-model="row.content"
                  placeholder="Isi catatan (Markdown supported)..."
                ></textarea>

                <div class="d-flex align-items-center justify-content-between pt-2 border-top">
                  <span class="small fw-semibold text-muted">Warna:</span>
                  <div class="d-flex gap-1.5">
                    <button
                      type="button"
                      v-for="c in colorOptions"
                      :key="c.code"
                      class="btn rounded-circle p-0"
                      :style="{ backgroundColor: c.code, width: '24px', height: '24px' }"
                      :class="{ 'border border-2 border-dark': row.color === c.code }"
                      @click="row.color = c.code"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex flex-wrap justify-content-between align-items-center mt-4 pt-4 border-top gap-3">
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary rounded-3 px-3 py-2 fw-bold" @click="addBulkRow">
                <i class="bi bi-plus-lg me-1"></i> Tambah Baris Form
              </button>
              <button class="btn btn-outline-secondary rounded-3 px-3 py-2 fw-bold" @click="addMultipleRows(5)">
                <i class="bi bi-plus-square me-1"></i> +5 Baris Sekaligus
              </button>
            </div>
            <button class="btn btn-success px-5 py-2.5 rounded-3 fw-bold shadow-sm fs-6" @click="saveBulkRows">
              <i class="bi bi-check-all me-1"></i> Simpan Semua Note ({{ validBulkRowsCount }} Valid)
            </button>
          </div>
        </div>

        <!-- Tab 2: Quick Delimited Paste -->
        <div v-else>
          <div class="alert alert-info py-3 px-4 rounded-3 mb-3">
            <i class="bi bi-info-circle-fill me-2"></i><strong>Format paste:</strong> Pisahkan antar catatan menggunakan tanda <code>---</code> pada baris tersendiri. Baris pertama dari setiap blok akan dijadikan Judul.
          </div>
          <textarea
            class="form-control font-monospace border-2 p-3 mb-4 rounded-3"
            rows="10"
            v-model="bulkPasteText"
            placeholder="Judul Catatan 1&#10;- Poin 1&#10;- Poin 2&#10;---&#10;Judul Catatan 2&#10;Isi ringkas catatan kedua..."
          ></textarea>
          <div class="d-flex justify-content-end gap-3">
            <button class="btn btn-light rounded-3 px-4 py-2 border fw-semibold" @click="bulkPasteText = ''">Bersihkan</button>
            <button class="btn btn-success rounded-3 px-5 py-2.5 fw-bold fs-6" @click="processBulkPaste">
              <i class="bi bi-file-earmark-plus me-1"></i> Import & Simpan Catatan
            </button>
          </div>
        </div>
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
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import { marked } from 'marked';

const DRAFT_KEY = 'rk_note_draft';
const SCRATCHPAD_KEY = 'rk_quick_scratchpad';

export default {
  name: 'StickyNotesView',
  setup() {
    const store = useStore();

    const activeMode = ref('list'); // 'list', 'editor', 'bulk', 'scratchpad'
    const isEditing = ref(false);
    const editingId = ref(null);
    const draftSaved = ref(false);
    const lastSavedTime = ref('');
    const selectedIds = ref([]);

    // Quick Scratchpad Auto-save state
    const scratchpadContent = ref('');
    const scratchpadSaveStatus = ref('Otomatis tersimpan');
    const isAutoSavingScratchpad = ref(false);
    let scratchpadTimer = null;
    let noteDraftTimer = null;

    const toast = ref({ show: false, message: '' });

    const colorOptions = [
      { name: 'Kuning', code: '#fef08a' },
      { name: 'Biru', code: '#bae6fd' },
      { name: 'Hijau', code: '#bbf7d0' },
      { name: 'Merah Muda', code: '#fbcfe8' },
      { name: 'Ungu', code: '#e9d5ff' }
    ];

    const form = ref({
      title: '',
      content: '',
      color: '#fef08a'
    });

    // Bulk rows builder
    const bulkTab = ref('rows'); // 'rows', 'paste'
    const bulkRows = ref([
      { title: '', content: '', color: '#fef08a' },
      { title: '', content: '', color: '#bae6fd' },
      { title: '', content: '', color: '#bbf7d0' }
    ]);
    const bulkPasteText = ref('');

    const searchQuery = ref('');
    const selectedColor = ref('all');

    const notes = computed(() => store.getters.getNotes);

    const filteredNotes = computed(() => {
      return notes.value.filter(n => {
        const matchesQuery = !searchQuery.value ||
          (n.title && n.title.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
          (n.content && n.content.toLowerCase().includes(searchQuery.value.toLowerCase()));

        const matchesColor = selectedColor.value === 'all' || n.color === selectedColor.value;

        return matchesQuery && matchesColor;
      });
    });

    const showToast = (msg) => {
      toast.value.message = msg;
      toast.value.show = true;
      setTimeout(() => {
        toast.value.show = false;
      }, 3000);
    };

    // Auto-load draft & scratchpad from localStorage on mount
    onMounted(() => {
      try {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed.title || parsed.content) {
            form.value = parsed;
            draftSaved.value = true;
            lastSavedTime.value = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          }
        }

        const savedScratchpad = localStorage.getItem(SCRATCHPAD_KEY);
        if (savedScratchpad !== null) {
          scratchpadContent.value = savedScratchpad;
        } else {
          scratchpadContent.value = '';
        }
      } catch (e) {
        console.error('Failed to load storage:', e);
      }
    });

    onUnmounted(() => {
      if (scratchpadTimer) clearTimeout(scratchpadTimer);
      if (noteDraftTimer) clearTimeout(noteDraftTimer);
    });

    // Auto-save scratchpad logic with debounced timer
    const handleScratchpadInput = () => {
      scratchpadSaveStatus.value = 'Menyimpan...';
      isAutoSavingScratchpad.value = true;

      if (scratchpadTimer) clearTimeout(scratchpadTimer);

      scratchpadTimer = setTimeout(() => {
        try {
          localStorage.setItem(SCRATCHPAD_KEY, scratchpadContent.value);
          const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          scratchpadSaveStatus.value = `Tersimpan ${nowStr}`;
          isAutoSavingScratchpad.value = false;
        } catch (err) {
          scratchpadSaveStatus.value = 'Gagal menyimpan';
          isAutoSavingScratchpad.value = false;
        }
      }, 1500); // 1.5 seconds auto-save interval
    };

    const clearScratchpad = () => {
      scratchpadContent.value = '';
      localStorage.removeItem(SCRATCHPAD_KEY);
      scratchpadSaveStatus.value = 'Scratchpad dibersihkan';
      showToast('Quick Scratchpad berhasil dibersihkan.');
    };

    const convertScratchpadToNote = () => {
      if (!scratchpadContent.value.trim()) return;
      const lines = scratchpadContent.value.split('\n');
      const title = lines[0].replace(/^#+\s*/, '').trim() || 'Note dari Scratchpad';
      const content = scratchpadContent.value;

      form.value = {
        title,
        content,
        color: '#fef08a'
      };
      isEditing.value = false;
      activeMode.value = 'editor';
      showToast('Scratchpad dipindahkan ke Editor Note!');
    };

    // Auto-save note form on input
    const onFormInput = () => {
      if (!isEditing.value) {
        if (noteDraftTimer) clearTimeout(noteDraftTimer);
        noteDraftTimer = setTimeout(() => {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(form.value));
          draftSaved.value = true;
          lastSavedTime.value = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }, 1200);
      }
    };

    const toggleMode = (mode) => {
      if (activeMode.value === mode) {
        activeMode.value = 'list';
      } else {
        activeMode.value = mode;
        if (mode === 'editor' && !isEditing.value && !form.value.title && !form.value.content) {
          form.value = {
            title: '',
            content: '# Catatan Baru\n\n- [ ] Checklist tugas 1\n- [ ] Checklist tugas 2',
            color: '#fef08a'
          };
        }
      }
    };

    const selectColor = (code) => {
      form.value.color = code;
      onFormInput();
    };

    const resetEditorForm = () => {
      form.value = {
        title: '',
        content: '',
        color: '#fef08a'
      };
      isEditing.value = false;
      editingId.value = null;
      localStorage.removeItem(DRAFT_KEY);
      draftSaved.value = false;
      showToast('Draft dibersihkan.');
    };

    const editNoteInline = (note) => {
      isEditing.value = true;
      editingId.value = note.id;
      form.value = { ...note };
      activeMode.value = 'editor';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const saveNote = () => {
      if (!form.value.title || !form.value.title.trim()) {
        showToast('Judul catatan tidak boleh kosong.');
        return;
      }

      if (isEditing.value) {
        store.dispatch('updateNote', { ...form.value, id: editingId.value });
        showToast('Note berhasil diperbarui!');
      } else {
        store.dispatch('addNote', form.value);
        showToast('Note baru berhasil disimpan!');
      }

      localStorage.removeItem(DRAFT_KEY);
      draftSaved.value = false;
      form.value = { title: '', content: '', color: '#fef08a' };
      isEditing.value = false;
      editingId.value = null;
      activeMode.value = 'list';
    };

    const deleteNoteDirect = (id) => {
      store.dispatch('deleteNote', id);
      showToast('Catatan berhasil dihapus.');
    };

    const bulkDeleteSelected = () => {
      if (selectedIds.value.length === 0) return;
      store.dispatch('deleteNotesBulk', selectedIds.value);
      showToast(`${selectedIds.value.length} catatan dihapus.`);
      selectedIds.value = [];
    };

    // Bulk Rows Logic
    const addBulkRow = () => {
      const colors = ['#fef08a', '#bae6fd', '#bbf7d0', '#fbcfe8', '#e9d5ff'];
      const nextColor = colors[bulkRows.value.length % colors.length];
      bulkRows.value.push({ title: '', content: '', color: nextColor });
    };

    const addMultipleRows = (count) => {
      for (let i = 0; i < count; i++) {
        addBulkRow();
      }
    };

    const removeBulkRow = (idx) => {
      bulkRows.value.splice(idx, 1);
    };

    const validBulkRowsCount = computed(() => {
      return bulkRows.value.filter(r => r.title && r.title.trim()).length;
    });

    const saveBulkRows = () => {
      const validRows = bulkRows.value.filter(r => r.title && r.title.trim());
      if (validRows.length === 0) {
        showToast('Mohon isi minimal 1 Judul Catatan pada form bulk.');
        return;
      }

      store.dispatch('addNotesBulk', validRows);
      showToast(`${validRows.length} catatan baru berhasil ditambahkan!`);

      // Reset bulk rows
      bulkRows.value = [
        { title: '', content: '', color: '#fef08a' },
        { title: '', content: '', color: '#bae6fd' },
        { title: '', content: '', color: '#bbf7d0' }
      ];
      activeMode.value = 'list';
    };

    const processBulkPaste = () => {
      if (!bulkPasteText.value || !bulkPasteText.value.trim()) {
        showToast('Teks paste kosong.');
        return;
      }

      const blocks = bulkPasteText.value.split(/^---$/m).map(b => b.trim()).filter(b => b.length > 0);
      if (blocks.length === 0) {
        showToast('Format paste tidak valid.');
        return;
      }

      const colors = ['#fef08a', '#bae6fd', '#bbf7d0', '#fbcfe8', '#e9d5ff'];
      const notesToInsert = blocks.map((block, idx) => {
        const lines = block.split('\n');
        const title = lines[0].replace(/^#+\s*/, '').trim() || `Catatan Import #${idx + 1}`;
        const content = lines.slice(1).join('\n').trim() || lines[0];
        return {
          title,
          content,
          color: colors[idx % colors.length]
        };
      });

      store.dispatch('addNotesBulk', notesToInsert);
      showToast(`${notesToInsert.length} catatan berhasil di-import dari paste!`);
      bulkPasteText.value = '';
      activeMode.value = 'list';
    };

    const copyNoteContent = (content) => {
      if (!content) return;
      navigator.clipboard.writeText(content).then(() => {
        showToast('Isi catatan berhasil disalin ke clipboard!');
      }).catch(() => {
        showToast('Gagal menyalin teks.');
      });
    };

    const renderMarkdown = (text) => {
      if (!text) return '<em class="text-muted">Preview teks markdown...</em>';
      try {
        return marked.parse(text);
      } catch (e) {
        return text;
      }
    };

    const getWordCount = (str) => {
      if (!str) return 0;
      return str.trim().split(/\s+/).filter(Boolean).length;
    };

    const getNotesCountByColor = (colorCode) => {
      return notes.value.filter(n => n.color === colorCode).length;
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return '-';
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      } catch (e) {
        return dateStr;
      }
    };

    return {
      notes,
      filteredNotes,
      colorOptions,
      activeMode,
      isEditing,
      form,
      draftSaved,
      lastSavedTime,
      selectedIds,
      toast,
      bulkTab,
      bulkRows,
      bulkPasteText,
      searchQuery,
      selectedColor,
      validBulkRowsCount,
      scratchpadContent,
      scratchpadSaveStatus,
      isAutoSavingScratchpad,
      handleScratchpadInput,
      clearScratchpad,
      convertScratchpadToNote,
      toggleMode,
      selectColor,
      onFormInput,
      resetEditorForm,
      editNoteInline,
      saveNote,
      deleteNoteDirect,
      bulkDeleteSelected,
      addBulkRow,
      addMultipleRows,
      removeBulkRow,
      saveBulkRows,
      processBulkPaste,
      copyNoteContent,
      renderMarkdown,
      getWordCount,
      getNotesCountByColor,
      formatDate
    };
  }
};
</script>

<style scoped>
.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  animation: pulseDot 1.8s infinite ease-in-out;
}

@keyframes pulseDot {
  0% { transform: scale(0.9); opacity: 0.6; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.6; }
}

.spin-icon {
  animation: spinIcon 1s linear infinite;
}

@keyframes spinIcon {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.color-selector-btn {
  height: 36px;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.color-selector-btn:hover {
  transform: translateY(-2px);
}

.active-color-ring {
  border-color: #0f172a !important;
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.2);
}

.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
}

/* STICKY NOTE CARD STYLING */
.sticky-note-card {
  background-color: var(--note-accent, #fef08a);
  color: #0f172a;
}

.note-color-stripe {
  height: 5px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 1rem 1rem 0 0;
}

.note-card-title {
  color: #0f172a;
}

.note-card-preview {
  color: #1e293b;
  border-color: rgba(15, 23, 42, 0.15) !important;
}

.note-card-footer {
  font-size: 11px;
  color: #475569;
}

.btn-action-icon {
  background-color: rgba(255, 255, 255, 0.85);
  color: #0f172a;
  border: 1px solid rgba(15, 23, 42, 0.1);
  transition: all 0.15s ease;
}

.btn-action-icon:hover {
  background-color: #ffffff;
  color: #2563eb;
}

.btn-preview-badge {
  background-color: #ffffff;
  color: #0f172a;
  border: 1px solid #0f172a;
  transition: all 0.2s ease;
}

.btn-preview-badge:hover {
  background-color: #0f172a;
  color: #ffffff;
}

.cursor-pointer {
  cursor: pointer;
}

.markdown-preview :deep(h1), .markdown-preview :deep(h2), .markdown-preview :deep(h3) {
  font-size: 1.05rem;
  font-weight: 700;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
}

.markdown-preview :deep(ul), .markdown-preview :deep(ol) {
  padding-left: 1.2rem;
  margin-bottom: 0.4rem;
}

/* DARK MODE SPECIFIC OVERRIDES FOR STICKY NOTES */
:global(.dark-theme) .sticky-note-card {
  background-color: #1e293b !important;
  color: #f8fafc !important;
  border: 1px solid #334155 !important;
}

:global(.dark-theme) .note-card-title {
  color: #f8fafc !important;
}

:global(.dark-theme) .note-card-preview {
  color: #e2e8f0 !important;
  border-color: #334155 !important;
}

:global(.dark-theme) .note-card-footer {
  color: #94a3b8 !important;
}

:global(.dark-theme) .btn-action-icon {
  background-color: #0f172a !important;
  color: #cbd5e1 !important;
  border-color: #334155 !important;
}

:global(.dark-theme) .btn-action-icon:hover {
  background-color: #334155 !important;
  color: #60a5fa !important;
}

:global(.dark-theme) .btn-preview-badge {
  background-color: #131b2e !important;
  color: #60a5fa !important;
  border-color: #334155 !important;
}

:global(.dark-theme) .btn-preview-badge:hover {
  background-color: #2563eb !important;
  color: #ffffff !important;
}

:global(.dark-theme) .preview-box {
  background-color: #060911 !important;
  border-color: #1e293b !important;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
}

:global(.dark-theme) .preview-box .markdown-preview,
:global(.dark-theme) .markdown-preview {
  font-family: 'Fira Code', 'JetBrains Mono', 'Source Code Pro', 'Cascadia Code', Menlo, Monaco, Consolas, monospace !important;
  color: #f8fafc !important;
}

:global(.dark-theme) .preview-box .markdown-preview *,
:global(.dark-theme) .markdown-preview * {
  font-family: 'Fira Code', 'JetBrains Mono', 'Source Code Pro', 'Cascadia Code', Menlo, Monaco, Consolas, monospace !important;
  color: #f1f5f9 !important;
}

:global(.dark-theme) .markdown-preview :deep(h1),
:global(.dark-theme) .markdown-preview :deep(h2),
:global(.dark-theme) .markdown-preview :deep(h3),
:global(.dark-theme) .markdown-preview :deep(h4),
:global(.dark-theme) .markdown-preview :deep(h5),
:global(.dark-theme) .markdown-preview :deep(h6) {
  color: #38bdf8 !important;
}

:global(.dark-theme) .markdown-preview :deep(code) {
  background-color: #111827 !important;
  color: #f472b6 !important;
  border: 1px solid #374151 !important;
}
</style>
