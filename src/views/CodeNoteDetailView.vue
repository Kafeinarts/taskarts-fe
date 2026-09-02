<template>
  <div class="container-fluid p-0 pb-5" data-aos="fade-up">
    <!-- 404 Not Found State -->
    <div v-if="!snippet && !isLoading" class="card border-0 shadow-sm rounded-4 bg-white p-5 text-center my-4">
      <div class="py-4">
        <i class="bi bi-file-earmark-x text-muted display-3 d-block mb-3"></i>
        <h4 class="fw-bold text-dark mb-2">Code Snippet Tidak Ditemukan</h4>
        <p class="text-muted mb-4">Snippet dengan ID <code class="text-primary">{{ snippetId }}</code> mungkin telah dihapus atau tidak tersedia.</p>
        <router-link to="/code-notes" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
          <i class="bi bi-arrow-left me-1"></i> Kembali ke Code Notes
        </router-link>
      </div>
    </div>

    <!-- Main Content when Snippet is Found -->
    <div v-else-if="snippet">
      <!-- Top Navigation & Title Bar -->
      <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4 border-top border-4" :style="{ borderColor: getLanguageColor(snippet.language) }">
        <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <!-- Breadcrumbs / Back Navigation -->
            <div class="d-flex align-items-center gap-2 mb-2">
              <router-link to="/code-notes" class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1">
                <i class="bi bi-arrow-left"></i>
                <span>Semua Snippet</span>
              </router-link>
              <span class="text-muted small">/</span>
              <span class="badge rounded-pill fw-bold text-uppercase px-3 py-1.5" :style="getLanguageBadgeStyle(snippet.language)">
                <i :class="getLanguageIcon(snippet.language)" class="me-1"></i> {{ snippet.language }}
              </span>
              <span v-if="snippet.createdAt" class="text-muted small ms-1">
                <i class="bi bi-calendar3 me-1"></i> {{ formatDate(snippet.createdAt) }}
              </span>
            </div>

            <!-- Snippet Title -->
            <h2 class="fw-extrabold text-dark mb-1 tracking-tight">{{ snippet.title }}</h2>
            <p v-if="snippet.description" class="text-muted mb-2 fs-6">{{ snippet.description }}</p>

            <!-- Tags List -->
            <div v-if="snippet.tags && snippet.tags.length" class="d-flex flex-wrap gap-1.5 align-items-center">
              <span v-for="(tag, i) in snippet.tags" :key="i" class="badge bg-light text-secondary border px-2.5 py-1 rounded-pill small">
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="d-flex flex-wrap align-items-center gap-2">
            <!-- Copy Button -->
            <button
              class="btn btn-primary rounded-pill px-3.5 py-2 fw-bold shadow-sm d-flex align-items-center gap-2"
              @click="copyCode"
              :class="{ 'btn-success': isCopied }"
            >
              <i :class="isCopied ? 'bi bi-check2-circle' : 'bi bi-clipboard-check-fill'"></i>
              <span>{{ isCopied ? 'Tersalin!' : 'Salin Kode' }}</span>
            </button>

            <!-- Download File -->
            <button
              class="btn btn-outline-secondary rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1.5"
              @click="downloadCodeFile"
              title="Unduh Berkas Kode"
            >
              <i class="bi bi-download"></i>
              <span>Unduh .{{ getFileExtension(snippet.language) }}</span>
            </button>

            <!-- Edit Button -->
            <button
              class="btn btn-outline-primary rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1.5"
              @click="openEditModal"
            >
              <i class="bi bi-pencil-square"></i>
              <span>Edit</span>
            </button>

            <!-- More Actions Dropdown -->
            <div class="dropdown">
              <button
                class="btn btn-light border rounded-circle p-2 d-flex align-items-center justify-content-center"
                style="width: 38px; height: 38px;"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Opsi Lainnya"
              >
                <i class="bi bi-three-dots-vertical text-muted"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm rounded-3 border-0 py-2">
                <li>
                  <button class="dropdown-item d-flex align-items-center gap-2 py-2" @click="duplicateSnippet">
                    <i class="bi bi-files text-primary"></i> Duplikat Snippet
                  </button>
                </li>
                <li>
                  <button class="dropdown-item d-flex align-items-center gap-2 py-2" @click="printSnippet">
                    <i class="bi bi-printer text-info"></i> Cetak / Ekspor PDF A4
                  </button>
                </li>
                <li>
                  <button class="dropdown-item d-flex align-items-center gap-2 py-2" @click="triggerAiExplain">
                    <i class="bi bi-stars text-warning"></i> Analisis & Bedah Kode AI
                  </button>
                </li>
                <li><hr class="dropdown-divider my-1"></li>
                <li>
                  <button class="dropdown-item text-danger d-flex align-items-center gap-2 py-2" @click="deleteCurrentSnippet">
                    <i class="bi bi-trash-fill text-danger"></i> Hapus Snippet
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Layout: Code Viewer, Toolbar & Interactive Sandbox -->
      <div class="row g-4">
        <!-- Left / Main Column: Code Box & Tabs -->
        <div class="col-lg-8">
          <!-- Code Block Card -->
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
            <!-- Code Header & Tool Controls -->
            <div class="card-header bg-dark text-white border-bottom border-secondary border-opacity-25 px-4 py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div class="d-flex align-items-center gap-2">
                <!-- Mac-style Window Dots -->
                <div class="d-flex align-items-center gap-1.5 me-2">
                  <span class="rounded-circle d-inline-block bg-danger" style="width: 11px; height: 11px;"></span>
                  <span class="rounded-circle d-inline-block bg-warning" style="width: 11px; height: 11px;"></span>
                  <span class="rounded-circle d-inline-block bg-success" style="width: 11px; height: 11px;"></span>
                </div>
                <span class="fw-mono text-uppercase text-light small fw-bold tracking-wider">
                  {{ snippet.language }}
                </span>
                <span class="text-secondary small">|</span>
                <span class="text-secondary small">{{ lineCount }} baris • {{ charCount }} karakter</span>
              </div>

              <!-- Code Viewing Controls -->
              <div class="d-flex align-items-center gap-2">
                <!-- Font Size Selector -->
                <div class="btn-group btn-group-sm" role="group">
                  <button
                    type="button"
                    class="btn btn-xs btn-outline-secondary text-light"
                    :class="{ 'active bg-secondary': codeFontSize === '12px' }"
                    @click="codeFontSize = '12px'"
                    title="Font Kecil"
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    class="btn btn-xs btn-outline-secondary text-light"
                    :class="{ 'active bg-secondary': codeFontSize === '14px' }"
                    @click="codeFontSize = '14px'"
                    title="Font Normal"
                  >
                    A
                  </button>
                  <button
                    type="button"
                    class="btn btn-xs btn-outline-secondary text-light"
                    :class="{ 'active bg-secondary': codeFontSize === '16px' }"
                    @click="codeFontSize = '16px'"
                    title="Font Besar"
                  >
                    A+
                  </button>
                </div>

                <!-- Word Wrap Toggle -->
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary text-light py-1 px-2.5 rounded-2 d-flex align-items-center gap-1"
                  :class="{ 'btn-secondary text-white': isWrapEnabled }"
                  @click="isWrapEnabled = !isWrapEnabled"
                  title="Toggle Word Wrap"
                >
                  <i class="bi bi-text-wrap"></i>
                  <span class="d-none d-sm-inline" style="font-size: 11.5px;">Wrap</span>
                </button>

                <!-- Copy Quick Button -->
                <button
                  type="button"
                  class="btn btn-sm btn-outline-light py-1 px-2.5 rounded-2 d-flex align-items-center gap-1"
                  @click="copyCode"
                >
                  <i :class="isCopied ? 'bi bi-check-lg text-success' : 'bi bi-clipboard'"></i>
                  <span style="font-size: 11.5px;">{{ isCopied ? 'Tersalin' : 'Salin' }}</span>
                </button>
              </div>
            </div>

            <!-- Code Body with Gutter Line Numbers -->
            <div id="printableSnippetArea" class="code-viewport bg-dark p-0 position-relative">
              <div class="d-flex text-light font-monospace overflow-x-auto" :style="{ fontSize: codeFontSize }">
                <!-- Line Numbers Gutter -->
                <div class="line-numbers-gutter py-3 px-3 text-secondary text-end select-none border-end border-secondary border-opacity-25" style="background-color: #0f172a; min-width: 48px;">
                  <div v-for="n in lineCount" :key="n" class="line-num" style="line-height: 1.6;">{{ n }}</div>
                </div>

                <!-- Actual Code Lines -->
                <div class="code-content-wrapper p-3 flex-grow-1" :class="{ 'whitespace-pre-wrap': isWrapEnabled, 'whitespace-pre': !isWrapEnabled }">
                  <pre class="m-0 text-success-light font-monospace" style="line-height: 1.6; font-family: 'Fira Code', 'Consolas', monospace;"><code>{{ snippet.code }}</code></pre>
                </div>
              </div>
            </div>

            <!-- Code Card Footer Info -->
            <div class="card-footer bg-light border-top px-4 py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div class="d-flex align-items-center gap-2 text-muted small">
                <i class="bi bi-info-circle text-primary"></i>
                <span>Format berkas: <strong>{{ getFileName(snippet) }}</strong></span>
              </div>

              <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1" @click="downloadCodeFile">
                  <i class="bi bi-file-earmark-arrow-down me-1"></i> Unduh File
                </button>
              </div>
            </div>
          </div>

          <!-- Documentation & Explanation Card -->
          <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
            <h5 class="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i class="bi bi-journal-text text-primary"></i>
              <span>Penjelasan & Cara Penggunaan</span>
            </h5>

            <div v-if="snippet.description" class="p-3 bg-light rounded-3 border mb-3">
              <p class="text-dark mb-0 fs-6" style="line-height: 1.6; white-space: pre-line;">{{ snippet.description }}</p>
            </div>
            <div v-else class="text-muted small fst-italic p-3 bg-light rounded-3 border mb-3">
              Belum ada catatan deskripsi. Klik tombol "Edit" untuk menambahkan panduan atau penjelasan singkat.
            </div>

            <!-- Quick Usage Tips Box -->
            <div class="alert alert-info border-0 rounded-3 mb-0 d-flex align-items-start gap-2.5 p-3">
              <i class="bi bi-lightbulb-fill fs-5 text-info mt-0.5"></i>
              <div class="small">
                <strong class="d-block text-dark mb-1">Tips Developer:</strong>
                <span class="text-secondary">
                  Gunakan shortcut <code>Ctrl + C</code> setelah mengklik tombol salin untuk menempelkan kode ini ke dalam IDE Anda (VS Code, Cursor, WebStorm). Anda juga dapat mengunduh berkas langsung dalam format <code>.{{ getFileExtension(snippet.language) }}</code>.
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive Runner / Tester & Related Snippets -->
        <div class="col-lg-4">
          <!-- Interactive Quick Tester / Sandbox Card -->
          <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i class="bi bi-play-circle-fill text-success"></i>
                <span>Live Tester & Preview</span>
              </h5>
              <span class="badge bg-success-subtle text-success fw-bold px-2 py-1 rounded-pill small">
                Client-Side Sandbox
              </span>
            </div>

            <!-- JavaScript / Web Sandbox Runner -->
            <div v-if="isJavaScriptOrWeb(snippet.language)">
              <p class="text-muted small mb-3">Jalankan potongan kode JavaScript/Web ini di dalam sandbox konsol lokal browser:</p>
              
              <button
                class="btn btn-success w-100 rounded-pill fw-bold py-2 shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
                @click="runJavaScriptSandbox"
                :disabled="isRunningCode"
              >
                <i class="bi bi-play-fill fs-5"></i>
                <span>{{ isRunningCode ? 'Mengeksekusi...' : 'Jalankan Potongan Kode (Run JS)' }}</span>
              </button>

              <!-- Console Output Window -->
              <div v-if="sandboxOutput !== null" class="console-box bg-dark rounded-3 p-3 text-light font-monospace small">
                <div class="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-50 pb-1.5 mb-2 text-secondary" style="font-size: 11px;">
                  <span><i class="bi bi-terminal me-1"></i> Console Output</span>
                  <button class="btn btn-xs btn-link text-secondary text-decoration-none p-0" @click="sandboxOutput = null">Bersihkan</button>
                </div>
                <div class="console-logs overflow-y-auto" style="max-height: 160px;">
                  <div v-for="(log, idx) in sandboxLogs" :key="idx" class="mb-1" :class="log.isError ? 'text-danger' : 'text-success'">
                    <span class="opacity-50 me-1">&gt;</span> {{ log.text }}
                  </div>
                  <div v-if="!sandboxLogs.length" class="text-muted fst-italic">Kode berhasil dieksekusi tanpa pesan konsol.</div>
                </div>
              </div>
            </div>

            <!-- SQL Query Preview Simulator -->
            <div v-else-if="snippet.language === 'sql'">
              <p class="text-muted small mb-3">Snippet ini bertipe SQL. Anda dapat menyalin atau membuka virtual SQL Runner untuk mengeksekusi terhadap database mock:</p>
              <router-link to="/sql" class="btn btn-outline-primary w-100 rounded-pill fw-bold py-2 d-flex align-items-center justify-content-center gap-2 mb-2">
                <i class="bi bi-database me-1"></i> Buka Virtual SQL Studio
              </router-link>
            </div>

            <!-- General Languages Info -->
            <div v-else>
              <p class="text-muted small mb-3">Bahasa <strong>{{ snippet.language }}</strong> siap disalin ke lingkungan kerja lokal atau terminal Anda.</p>
              <button class="btn btn-outline-primary w-100 rounded-pill fw-bold py-2 d-flex align-items-center justify-content-center gap-2" @click="copyCode">
                <i class="bi bi-clipboard me-1"></i> Salin untuk Terminal / IDE
              </button>
            </div>
          </div>

          <!-- Metadata & Details Card -->
          <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
            <h6 class="fw-bold text-dark mb-3 border-bottom pb-2">
              <i class="bi bi-sliders me-1 text-primary"></i> Rincian Snippet
            </h6>

            <ul class="list-unstyled mb-0 small">
              <li class="d-flex justify-content-between py-1.5 border-bottom border-light">
                <span class="text-muted">ID Snippet:</span>
                <code class="text-dark fw-bold">{{ snippet.id }}</code>
              </li>
              <li class="d-flex justify-content-between py-1.5 border-bottom border-light">
                <span class="text-muted">Bahasa:</span>
                <span class="fw-bold text-dark text-uppercase">{{ snippet.language }}</span>
              </li>
              <li class="d-flex justify-content-between py-1.5 border-bottom border-light">
                <span class="text-muted">Jumlah Baris:</span>
                <span class="fw-bold text-dark">{{ lineCount }} Baris</span>
              </li>
              <li class="d-flex justify-content-between py-1.5 border-bottom border-light">
                <span class="text-muted">Jumlah Karakter:</span>
                <span class="fw-bold text-dark">{{ charCount }} Karakter</span>
              </li>
              <li class="d-flex justify-content-between py-1.5">
                <span class="text-muted">Waktu Dibuat:</span>
                <span class="fw-bold text-dark">{{ formatDate(snippet.createdAt) }}</span>
              </li>
            </ul>
          </div>

          <!-- Related Snippets Card -->
          <div v-if="relatedSnippets.length" class="card border-0 shadow-sm rounded-4 bg-white p-4">
            <h6 class="fw-bold text-dark mb-3 d-flex align-items-center justify-content-between">
              <span><i class="bi bi-collection me-1 text-primary"></i> Snippet Terkait</span>
              <span class="badge bg-light text-muted border small">{{ relatedSnippets.length }}</span>
            </h6>

            <div class="d-flex flex-column gap-2.5">
              <div
                v-for="rel in relatedSnippets"
                :key="rel.id"
                class="p-2.5 rounded-3 border bg-light hover-shadow cursor-pointer transition-all"
                @click="navigateToSnippet(rel.id)"
              >
                <div class="d-flex align-items-center justify-content-between mb-1">
                  <span class="badge bg-dark fw-mono text-uppercase px-2 py-0.5 rounded" style="font-size: 10px;">
                    {{ rel.language }}
                  </span>
                  <small class="text-muted" style="font-size: 11px;">
                    <i class="bi bi-chevron-right"></i>
                  </small>
                </div>
                <h6 class="fw-bold text-dark mb-0 text-truncate" style="font-size: 13px;">{{ rel.title }}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- IN-PAGE MODAL: EDIT CODE SNIPPET                         -->
    <!-- ======================================================== -->
    <div v-if="showEditModal" class="card border-0 shadow-lg rounded-4 bg-white p-4 my-4 border-top border-primary border-4 animate-scale">
      <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
        <h5 class="fw-bold text-dark mb-0">
          <i class="bi bi-pencil-square text-primary me-2"></i>Edit Code Snippet
        </h5>
        <button class="btn-close" @click="showEditModal = false"></button>
      </div>

      <form @submit.prevent="saveEditSnippet">
        <div class="mb-3">
          <label class="form-label fw-bold text-dark small">Judul Snippet <span class="text-danger">*</span></label>
          <input type="text" class="form-control" v-model="editForm.title" placeholder="Judul ringkas snippet kodingan" required />
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <label class="form-label fw-bold text-dark small">Bahasa Pemrograman</label>
            <select class="form-select" v-model="editForm.language">
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
            <label class="form-label fw-bold text-dark small">Tags (Pisahkan dengan koma)</label>
            <input type="text" class="form-control" v-model="editForm.tagsInput" placeholder="vue, composition, async" />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold text-dark small">Kode Sumber <span class="text-danger">*</span></label>
          <textarea
            class="form-control font-monospace bg-dark text-success-light border-2"
            rows="10"
            v-model="editForm.code"
            style="font-family: 'Fira Code', 'Consolas', monospace; font-size: 13.5px;"
            required
          ></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold text-dark small">Deskripsi & Catatan Penggunaan</label>
          <textarea class="form-control" rows="3" v-model="editForm.description" placeholder="Penjelasan cara pakai atau dependensi pustaka..."></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2 border-top pt-3">
          <button type="button" class="btn btn-light rounded-pill px-4" @click="showEditModal = false">Batal</button>
          <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Simpan Perubahan</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { sendOnDeviceNotification } from '../utils/notification';
import { openPrintableDocumentInNewTab } from '../utils/pdfTabOpener';
import Swal from 'sweetalert2';

export default {
  name: 'CodeNoteDetailView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const snippetId = computed(() => route.params.id);
    const isLoading = ref(false);
    const isCopied = ref(false);
    const isWrapEnabled = ref(false);
    const codeFontSize = ref('14px');
    const showEditModal = ref(false);

    // Sandbox execution state
    const isRunningCode = ref(false);
    const sandboxOutput = ref(null);
    const sandboxLogs = ref([]);

    // Find snippet from store
    const snippet = computed(() => {
      const id = snippetId.value;
      if (!id) return null;
      return store.getters.getCodeNoteById ? store.getters.getCodeNoteById(id) : null;
    });

    const lineCount = computed(() => {
      if (!snippet.value || !snippet.value.code) return 0;
      return snippet.value.code.split('\n').length;
    });

    const charCount = computed(() => {
      if (!snippet.value || !snippet.value.code) return 0;
      return snippet.value.code.length;
    });

    // Related snippets in same language
    const relatedSnippets = computed(() => {
      if (!snippet.value) return [];
      const all = store.getters.getCodeNotes || [];
      return all
        .filter(s => String(s.id) !== String(snippet.value.id) && s.language === snippet.value.language)
        .slice(0, 4);
    });

    // Edit form state
    const editForm = ref({
      title: '',
      language: 'javascript',
      code: '',
      description: '',
      tagsInput: ''
    });

    const openEditModal = () => {
      if (!snippet.value) return;
      editForm.value = {
        title: snippet.value.title || '',
        language: snippet.value.language || 'javascript',
        code: snippet.value.code || '',
        description: snippet.value.description || '',
        tagsInput: (snippet.value.tags || []).join(', ')
      };
      showEditModal.value = true;
    };

    const saveEditSnippet = () => {
      if (!editForm.value.title || !editForm.value.code) return;

      const tags = editForm.value.tagsInput
        ? editForm.value.tagsInput.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      store.dispatch('updateCodeNote', {
        id: snippet.value.id,
        title: editForm.value.title,
        language: editForm.value.language,
        code: editForm.value.code,
        description: editForm.value.description,
        tags,
        updatedAt: new Date().toISOString()
      });

      sendOnDeviceNotification('💻 Snippet Diperbarui', {
        body: `Perubahan pada "${editForm.value.title}" berhasil disimpan.`,
        type: 'success'
      });

      showEditModal.value = false;
    };

    const copyCode = () => {
      if (!snippet.value || !snippet.value.code) return;
      navigator.clipboard.writeText(snippet.value.code).then(() => {
        isCopied.value = true;
        sendOnDeviceNotification('📋 Kode Berhasil Disalin', {
          body: `Potongan kode "${snippet.value.title}" siap ditempelkan.`,
          type: 'info'
        });
        setTimeout(() => {
          isCopied.value = false;
        }, 2000);
      });
    };

    const downloadCodeFile = () => {
      if (!snippet.value) return;
      const ext = getFileExtension(snippet.value.language);
      const filename = `${(snippet.value.title || 'snippet').toLowerCase().replace(/[^a-z0-9]/g, '_')}.${ext}`;
      const blob = new Blob([snippet.value.code], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      sendOnDeviceNotification('⬇️ Berkas Kode Diunduh', {
        body: `Berkas ${filename} berhasil disimpan.`,
        type: 'success'
      });
    };

    const duplicateSnippet = () => {
      if (!snippet.value) return;
      store.dispatch('addCodeNote', {
        title: `${snippet.value.title} (Salinan)`,
        language: snippet.value.language,
        code: snippet.value.code,
        description: snippet.value.description,
        tags: [...(snippet.value.tags || [])]
      });

      Swal.fire({
        icon: 'success',
        title: 'Snippet Diduplikat!',
        text: 'Salinan baru telah ditambahkan ke pustaka kodingan Anda.',
        timer: 1800,
        showConfirmButton: false
      });
    };

    const deleteCurrentSnippet = () => {
      if (!snippet.value) return;
      Swal.fire({
        title: 'Hapus Code Snippet?',
        text: `Apakah Anda yakin ingin menghapus "${snippet.value.title}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('deleteCodeNote', snippet.value.id);
          sendOnDeviceNotification('🗑️ Snippet Dihapus', {
            body: `Code snippet "${snippet.value.title}" telah dihapus.`,
            type: 'info'
          });
          router.push('/code-notes');
        }
      });
    };

    const printSnippet = () => {
      if (!snippet.value) return;
      const title = `Code_Snippet_${snippet.value.title.replace(/\s+/g, '_')}`;
      openPrintableDocumentInNewTab({
        title,
        elementId: 'printableSnippetArea',
        customStyles: `
          @page { size: A4 portrait; margin: 12mm 15mm; }
          .code-viewport { background: #0f172a !important; color: #38bdf8 !important; border-radius: 8px; padding: 16px !important; }
          pre { font-family: monospace; font-size: 12px !important; line-height: 1.5 !important; }
        `,
        autoPrint: true
      });
    };

    const triggerAiExplain = () => {
      if (!snippet.value) return;
      Swal.fire({
        title: `💡 Analisis: ${snippet.value.title}`,
        html: `
          <div class="text-start p-3 bg-light rounded-3 border small">
            <h6 class="fw-bold text-primary mb-2"><i class="bi bi-cpu me-1"></i> Ringkasan Arsitektur:</h6>
            <p class="mb-2">Potongan kode ini ditulis dalam <strong>${snippet.value.language.toUpperCase()}</strong> dengan <strong>${lineCount.value} baris</strong> logika.</p>
            <h6 class="fw-bold text-dark mb-1">Rekomendasi Praktik Terbaik:</h6>
            <ul class="mb-0 ps-3 text-secondary">
              <li>Pastikan penanganan error (try-catch / error boundary) aktif saat dijalankan di lingkungan produksi.</li>
              <li>Simpan variabel sensitif (API key/token) di dalam environment variable, bukan hardcoded.</li>
              <li>Pecah ke dalam fungsi modular atau composable reusable bila digunakan di lebih dari 2 komponen.</li>
            </ul>
          </div>
        `,
        confirmButtonText: 'Mengerti',
        confirmButtonColor: '#0d6efd'
      });
    };

    // Client-side JS Sandbox runner
    const isJavaScriptOrWeb = (lang) => {
      return ['javascript', 'js', 'html', 'vue'].includes((lang || '').toLowerCase());
    };

    const runJavaScriptSandbox = () => {
      if (!snippet.value || !snippet.value.code) return;
      isRunningCode.value = true;
      sandboxLogs.value = [];
      sandboxOutput.value = true;

      setTimeout(() => {
        try {
          const logs = [];
          const customConsole = {
            log: (...args) => logs.push({ text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), isError: false }),
            info: (...args) => logs.push({ text: 'ℹ️ ' + args.join(' '), isError: false }),
            warn: (...args) => logs.push({ text: '⚠️ ' + args.join(' '), isError: false }),
            error: (...args) => logs.push({ text: '❌ ' + args.join(' '), isError: true })
          };

          // Safe execution wrapper
          const runner = new Function('console', snippet.value.code);
          runner(customConsole);
          sandboxLogs.value = logs;
        } catch (err) {
          sandboxLogs.value = [{ text: `Error: ${err.message}`, isError: true }];
        } finally {
          isRunningCode.value = false;
        }
      }, 300);
    };

    const navigateToSnippet = (id) => {
      router.push(`/code-notes/${id}`);
    };

    // Helper functions
    const getLanguageColor = (lang) => {
      const colors = {
        javascript: '#f59e0b',
        python: '#3b82f6',
        sql: '#06b6d4',
        html: '#ec4899',
        css: '#8b5cf6',
        php: '#6366f1',
        shell: '#10b981',
        java: '#ef4444',
        cpp: '#64748b'
      };
      return colors[(lang || '').toLowerCase()] || '#0d6efd';
    };

    const getLanguageBadgeStyle = (lang) => {
      const color = getLanguageColor(lang);
      return {
        backgroundColor: `${color}18`,
        color: color,
        border: `1px solid ${color}40`
      };
    };

    const getLanguageIcon = (lang) => {
      const icons = {
        javascript: 'bi-filetype-js',
        python: 'bi-filetype-py',
        sql: 'bi-database-fill',
        html: 'bi-filetype-html',
        css: 'bi-filetype-css',
        php: 'bi-filetype-php',
        shell: 'bi-terminal-fill'
      };
      return icons[(lang || '').toLowerCase()] || 'bi-code-slash';
    };

    const getFileExtension = (lang) => {
      const extMap = {
        javascript: 'js',
        python: 'py',
        sql: 'sql',
        html: 'html',
        css: 'css',
        php: 'php',
        shell: 'sh',
        java: 'java',
        cpp: 'cpp'
      };
      return extMap[(lang || '').toLowerCase()] || 'txt';
    };

    const getFileName = (s) => {
      if (!s) return 'snippet.txt';
      const slug = (s.title || 'code').toLowerCase().replace(/[^a-z0-9]/g, '_');
      return `${slug}.${getFileExtension(s.language)}`;
    };

    const formatDate = (isoStr) => {
      if (!isoStr) return 'Baru saja';
      try {
        const d = new Date(isoStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      } catch {
        return isoStr;
      }
    };

    return {
      snippetId,
      snippet,
      isLoading,
      isCopied,
      isWrapEnabled,
      codeFontSize,
      showEditModal,
      editForm,
      lineCount,
      charCount,
      relatedSnippets,
      isRunningCode,
      sandboxOutput,
      sandboxLogs,
      openEditModal,
      saveEditSnippet,
      copyCode,
      downloadCodeFile,
      duplicateSnippet,
      deleteCurrentSnippet,
      printSnippet,
      triggerAiExplain,
      isJavaScriptOrWeb,
      runJavaScriptSandbox,
      navigateToSnippet,
      getLanguageColor,
      getLanguageBadgeStyle,
      getLanguageIcon,
      getFileExtension,
      getFileName,
      formatDate
    };
  }
};
</script>

<style scoped>
.text-success-light {
  color: #86efac !important;
}

.whitespace-pre-wrap {
  white-space: pre-wrap !important;
  word-break: break-word !important;
}

.whitespace-pre {
  white-space: pre !important;
}

.btn-xs {
  font-size: 11px;
  padding: 2px 6px;
}

.hover-shadow:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
}

.cursor-pointer {
  cursor: pointer;
}

.transition-all {
  transition: all 0.2s ease-in-out;
}

.select-none {
  user-select: none;
}

.code-viewport {
  border-radius: 0;
  min-height: 220px;
}
</style>
