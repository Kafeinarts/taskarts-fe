import { marked } from 'marked';

// Dynamic Mermaid loader to avoid build/Babel ESM issues
let mermaidInstance = null;
let mermaidInitialized = false;

export async function getMermaid() {
  if (mermaidInstance) return mermaidInstance;
  try {
    const mod = await import('mermaid');
    mermaidInstance = mod.default || mod;
    return mermaidInstance;
  } catch (e) {
    console.warn('Dynamic mermaid import error:', e);
    return null;
  }
}

let lastMermaidTheme = null;

export async function initMermaid(forceTheme = null) {
  const isDark = forceTheme 
    ? (forceTheme === 'dark' || forceTheme === 'oled')
    : (typeof document !== 'undefined' && (
        document.body.classList.contains('dark-mode') ||
        document.body.classList.contains('dark-theme') ||
        document.body.classList.contains('oled-theme')
      ));

  const targetTheme = isDark ? 'dark' : 'default';
  if (mermaidInitialized && lastMermaidTheme === targetTheme) return;

  const mermaid = await getMermaid();
  if (!mermaid) return;
  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: targetTheme,
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      themeVariables: isDark ? {
        darkMode: true,
        background: '#0b0f19',
        mainBkg: '#1e293b',
        primaryColor: '#1e293b',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#818cf8',
        lineColor: '#94a3b8',
        secondaryColor: '#334155',
        tertiaryColor: '#0f172a',
        textColor: '#f8fafc',
        nodeBorder: '#818cf8',
        edgeLabelBackground: '#0f172a',
        fontSize: '14px'
      } : {
        primaryColor: '#e0e7ff',
        primaryTextColor: '#1e1b4b',
        primaryBorderColor: '#6366f1',
        lineColor: '#4f46e5',
        secondaryColor: '#fef3c7',
        tertiaryColor: '#f1f5f9',
        fontSize: '14px'
      },
      flowchart: {
        curve: 'basis',
        htmlLabels: true,
        useMaxWidth: true
      },
      sequence: {
        showSequenceNumbers: true,
        useMaxWidth: true
      }
    });
    mermaidInitialized = true;
    lastMermaidTheme = targetTheme;
  } catch (e) {
    console.warn('Mermaid init error:', e);
  }
}

// Mermaid diagram preset templates
export const MERMAID_PRESETS = [
  {
    id: 'flowchart_td',
    title: 'Flowchart Logika (Top-Down)',
    icon: 'bi-diagram-3',
    description: 'Alur keputusan dari atas ke bawah',
    code: `\`\`\`mermaid
flowchart TD
    Start([🚀 Mulai Proyek]) --> Task1[Analisis Kebutuhan & Riset]
    Task1 --> Decision{Validasi Kebutuhan?}
    Decision -- Ya --> Dev[💻 Tahap Pengembangan]
    Decision -- Tidak --> Revise[🔄 Revisi Spesifikasi]
    Revise --> Task1
    Dev --> Test[🧪 Pengujian QA & Bugfix]
    Test --> Deploy([✅ Deploy ke Production])
\`\`\``
  },
  {
    id: 'flowchart_lr',
    title: 'Flowchart Arsitektur (Kiri-Kanan)',
    icon: 'bi-bezier2',
    description: 'Alur data dan komponen sistem',
    code: `\`\`\`mermaid
flowchart LR
    User([👤 User / Client]) -->|Request HTTP/REST| Frontend[💻 Vue 3 Frontend]
    Frontend -->|Vuex / Pinia Store| Cache[(💾 LocalStorage)]
    Frontend -->|API Gateway| Backend[⚙️ Cloud Backend]
    Backend --> Database[(🗄️ PostgreSQL / Firestore)]
\`\`\``
  },
  {
    id: 'sequence_diagram',
    title: 'Sequence Diagram (Interaksi API)',
    icon: 'bi-arrow-left-right',
    description: 'Urutan interaksi antar aktor & sistem',
    code: `\`\`\`mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Pengguna
    participant UI as 📱 Web UI (Vue)
    participant Auth as 🔐 Auth Service
    participant DB as 🗄️ Database

    User->>UI: Klik Tombol "Simpan Catatan"
    UI->>Auth: Validasi Sesi Pengguna
    Auth-->>UI: Sesi Valid (Token OK)
    UI->>DB: INSERT into notes (title, content, mermaid)
    DB-->>UI: Status 200 OK (ID: note-123)
    UI-->>User: Tampilkan Toast "Catatan Tersimpan!"
\`\`\``
  },
  {
    id: 'state_diagram',
    title: 'State Diagram (Status Siklus)',
    icon: 'bi-toggle-on',
    description: 'Perubahan status dokumen / task',
    code: `\`\`\`mermaid
stateDiagram-v2
    [*] --> Draft: Buat Catatan Baru
    Draft --> InReview: Kirim untuk Ditinjau
    InReview --> Approved: Disetujui Tim
    InReview --> Draft: Perlu Perbaikan
    Approved --> Published: Terbitkan Catatan
    Published --> Archived: Arsipkan
    Archived --> [*]
\`\`\``
  },
  {
    id: 'gantt_chart',
    title: 'Gantt Chart (Jadwal Proyek)',
    icon: 'bi-calendar-range',
    description: 'Timeline jadwal dan milestone',
    code: `\`\`\`mermaid
gantt
    title 📅 Jadwal Rilis Proyek Q3
    dateFormat  YYYY-MM-DD
    section Desain
    Wireframe UI         :done, des1, 2026-08-01, 2026-08-05
    High-Fidelity Mockup :done, des2, 2026-08-06, 2026-08-10
    section Pengembangan
    Setup Vue 3 & Store  :active, dev1, 2026-08-11, 2026-08-15
    Integrasi Mermaid & Gambar :dev2, 2026-08-16, 2026-08-20
    section Testing & Deploy
    QA & User Testing    :crit, test1, 2026-08-21, 2026-08-25
    Live Production      :crit, test2, 2026-08-26, 2026-08-28
\`\`\``
  },
  {
    id: 'mindmap',
    title: 'Mindmap (Struktur Ide)',
    icon: 'bi-diagram-2',
    description: 'Pemetaan cabang ide & inovasi',
    code: `\`\`\`mermaid
mindmap
  root((💡 Ide Produk))
    Fitur Utama
      Notes & Scratchpad
        Mermaid Diagram
        Insert Image
        Auto-Save
      Task Management
        Kanban Board
        Eisenhower Matrix
    Keamanan & Performa
      Local-First Storage
      Zero Telemetry
      PWA Offline Ready
    Ekspor
      PDF Document
      Markdown
      JSON Backup
\`\`\``
  },
  {
    id: 'pie_chart',
    title: 'Pie Chart (Distribusi Data)',
    icon: 'bi-pie-chart',
    description: 'Persentase alokasi waktu / topik',
    code: `\`\`\`mermaid
pie title 📊 Alokasi Fokus Kerja Mingguan
    "Coding & Development" : 45
    "UI/UX Design" : 20
    "Meeting & Diskusi Tim" : 15
    "Riset & Dokumentasi" : 10
    "Review & Testing" : 10
\`\`\``
  },
  {
    id: 'class_diagram',
    title: 'Class Diagram (Arsitektur Data)',
    icon: 'bi-box',
    description: 'Struktur class, atribut & relasi',
    code: `\`\`\`mermaid
classDiagram
    class Note {
      +String id
      +String title
      +String content
      +String color
      +Array images
      +Array tags
      +Date updatedAt
      +renderMarkdown()
      +exportPDF()
    }
    class ImageAttachment {
      +String id
      +String name
      +String dataUrl
      +Number size
    }
    Note "1" *-- "many" ImageAttachment : contains
\`\`\``
  }
];

// Configure marked with custom options
marked.setOptions({
  breaks: true,
  gfm: true
});

/**
 * Preprocess markdown to extract mermaid code blocks into recognizable divs
 * and format images nicely with zoomable containers
 */
export function preprocessMarkdown(rawText) {
  if (!rawText) return '';
  return rawText;
}

/**
 * Render Markdown string to HTML, preserving mermaid blocks and wrapping tables in responsive containers
 */
export function renderMarkdownToHtml(markdownText) {
  if (!markdownText) return '<em class="text-muted opacity-75">Pratinjau kosong...</em>';

  try {
    let parsedHtml = marked.parse(markdownText);

    // Style images to be responsive, bordered, and aesthetically rounded
    parsedHtml = parsedHtml.replace(
      /<img\s+src="([^"]+)"\s+alt="([^"]*)"\s*\/?>/gi,
      (match, src, alt) => {
        return `
          <figure class="note-embedded-image my-3 text-center">
            <div class="image-zoom-wrapper position-relative d-inline-block">
              <img src="${src}" alt="${alt || 'Gambar Catatan'}" class="img-fluid rounded-4 shadow-sm border note-rendered-img" loading="lazy" style="max-height: 480px; object-fit: contain;" />
            </div>
            ${alt ? `<figcaption class="figure-caption text-center mt-2 small text-muted"><i class="bi bi-image me-1"></i>${alt}</figcaption>` : ''}
          </figure>
        `;
      }
    );

    // Wrap tables in responsive horizontal-scroll wrappers with navigation buttons
    const tableRegex = /<table[\s\S]*?<\/table>/gi;
    parsedHtml = parsedHtml.replace(tableRegex, (tableHtml) => {
      return `
        <div class="markdown-table-wrapper my-4 border rounded-3 overflow-hidden shadow-xs bg-white">
          <div class="markdown-table-scroll-hint d-flex align-items-center justify-content-between px-3 py-2 bg-light border-bottom text-muted">
            <div class="d-flex align-items-center gap-2 small fw-semibold">
              <i class="bi bi-arrow-left-right text-primary"></i>
              <span class="table-hint-text" style="font-size: 11.5px;">Tabel Data — Bisa digeser kanan &amp; kiri (Scroll / Drag)</span>
            </div>
            <div class="d-flex align-items-center gap-1.5 table-nav-actions">
              <button type="button" class="btn btn-xs btn-white border table-scroll-btn table-scroll-left px-2 py-0.5 rounded-pill shadow-xs" title="Geser ke Kiri">
                <i class="bi bi-chevron-left" style="font-size: 11px;"></i> <span style="font-size: 11px;">Kiri</span>
              </button>
              <button type="button" class="btn btn-xs btn-white border table-scroll-btn table-scroll-right px-2 py-0.5 rounded-pill shadow-xs" title="Geser ke Kanan">
                <span style="font-size: 11px;">Kanan</span> <i class="bi bi-chevron-right" style="font-size: 11px;"></i>
              </button>
            </div>
          </div>
          <div class="markdown-table-responsive-container overflow-x-auto p-0">
            ${tableHtml}
          </div>
        </div>
      `;
    });

    // Identify Mermaid code blocks in parsed HTML: <pre><code class="language-mermaid">...</code></pre>
    const mermaidRegex = /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/gi;
    let diagramIndex = 0;

    parsedHtml = parsedHtml.replace(mermaidRegex, (match, code) => {
      diagramIndex++;
      const uniqueId = `mermaid-${Date.now()}-${diagramIndex}-${Math.random().toString(36).substring(2, 7)}`;
      // Decode HTML entities
      const decodedCode = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

      // Detect diagram type for header badge
      let diagramTypeLabel = 'Mermaid Diagram';
      let diagramTypeIcon = 'bi-diagram-3-fill';
      const firstLine = decodedCode.split('\n')[0].trim().toLowerCase();
      if (firstLine.includes('flowchart') || firstLine.includes('graph')) {
        diagramTypeLabel = 'Flowchart Alur';
        diagramTypeIcon = 'bi-diagram-3-fill';
      } else if (firstLine.includes('sequence')) {
        diagramTypeLabel = 'Sequence Diagram';
        diagramTypeIcon = 'bi-arrow-left-right';
      } else if (firstLine.includes('state')) {
        diagramTypeLabel = 'State Diagram';
        diagramTypeIcon = 'bi-toggle-on';
      } else if (firstLine.includes('gantt')) {
        diagramTypeLabel = 'Gantt Timeline';
        diagramTypeIcon = 'bi-calendar-range';
      } else if (firstLine.includes('mindmap')) {
        diagramTypeLabel = 'Mindmap Ide';
        diagramTypeIcon = 'bi-diagram-2';
      } else if (firstLine.includes('pie')) {
        diagramTypeLabel = 'Pie Chart';
        diagramTypeIcon = 'bi-pie-chart-fill';
      } else if (firstLine.includes('class')) {
        diagramTypeLabel = 'Class Diagram';
        diagramTypeIcon = 'bi-box';
      }

      return `
        <div class="mermaid-block-container my-4 bg-white rounded-4 border shadow-sm position-relative overflow-hidden" data-diagram-id="${uniqueId}">
          <!-- Interactive Diagram Header -->
          <div class="mermaid-header d-flex flex-wrap justify-content-between align-items-center gap-2 p-3 bg-light border-bottom">
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <span class="badge bg-primary-subtle text-primary fw-bold px-2.5 py-1.5 rounded-pill small d-flex align-items-center gap-1">
                <i class="bi ${diagramTypeIcon}"></i> ${diagramTypeLabel}
              </span>
              <span class="mermaid-node-count-badge badge bg-secondary-subtle text-secondary fw-semibold px-2 py-1 rounded-pill small" style="font-size: 11px;">
                <i class="bi bi-bounding-box-circles me-1"></i> <span class="node-count-text">Memuat...</span>
              </span>
            </div>

            <!-- Header Action & Zoom Controls -->
            <div class="d-flex align-items-center gap-1.5 flex-wrap">
              <!-- Zoom In / Out Toolbar -->
              <div class="btn-group btn-group-sm bg-white rounded-pill border shadow-xs p-0.5" role="group">
                <button type="button" class="btn btn-sm btn-light rounded-pill mermaid-zoom-out-btn px-2 py-0.5" title="Zoom Out (-)">
                  <i class="bi bi-zoom-out"></i>
                </button>
                <span class="mermaid-zoom-indicator px-2 py-0.5 small fw-bold text-muted font-monospace d-flex align-items-center" style="font-size: 11px; min-width: 44px; justify-content: center;">
                  100%
                </span>
                <button type="button" class="btn btn-sm btn-light rounded-pill mermaid-zoom-in-btn px-2 py-0.5" title="Zoom In (+)">
                  <i class="bi bi-zoom-in"></i>
                </button>
                <button type="button" class="btn btn-sm btn-light rounded-pill mermaid-zoom-reset-btn px-2 py-0.5" title="Reset Zoom / Tengah">
                  <i class="bi bi-arrow-counterclockwise"></i>
                </button>
                <button type="button" class="btn btn-sm btn-light rounded-pill mermaid-zoom-fit-btn px-2 py-0.5" title="Sesuaikan Tampilan">
                  <i class="bi bi-aspect-ratio"></i>
                </button>
              </div>

              <!-- Nodes List Dropdown Trigger -->
              <button type="button" class="btn btn-xs btn-white border rounded-pill mermaid-nodes-list-btn px-2.5 py-1 shadow-xs" title="Lihat &amp; Fokus Kotak / Blok">
                <i class="bi bi-list-nested me-1 text-primary"></i> <span style="font-size: 11.5px;">Daftar Kotak</span>
              </button>

              <!-- Fullscreen Button -->
              <button type="button" class="btn btn-xs btn-white border rounded-pill mermaid-fullscreen-btn px-2 py-1 shadow-xs" title="Layar Penuh">
                <i class="bi bi-arrows-fullscreen"></i>
              </button>

              <!-- Copy Code Button -->
              <button type="button" class="btn btn-xs btn-white border rounded-pill copy-mermaid-code-btn px-2 py-1 shadow-xs" data-code="${encodeURIComponent(decodedCode)}" title="Salin Kode Mermaid">
                <i class="bi bi-clipboard me-1"></i> <span style="font-size: 11px;">Salin</span>
              </button>
            </div>
          </div>

          <!-- Interactive Viewport Stage (Pan & Zoom Canvas) -->
          <div class="mermaid-viewport-wrapper position-relative" style="height: 380px; min-height: 320px; overflow: hidden; background-color: #fcfdfe; background-image: radial-gradient(#e2e8f0 1.2px, transparent 1.2px); background-size: 20px 20px;">
            <div class="mermaid-panzoom-stage position-absolute w-100 h-100 d-flex align-items-center justify-content-center" style="transform-origin: center center; cursor: grab; user-select: none;">
              <div class="mermaid-diagram-viewport text-center py-2" id="${uniqueId}" data-mermaid-code="${encodeURIComponent(decodedCode)}">
                <div class="spinner-border spinner-border-sm text-primary my-3" role="status">
                  <span class="visually-hidden">Rendering diagram...</span>
                </div>
              </div>
            </div>

            <!-- Floating Interaction Hints -->
            <div class="mermaid-canvas-hint position-absolute top-0 start-0 m-2 px-2.5 py-1 rounded-pill small bg-white border shadow-xs d-flex align-items-center gap-1.5 opacity-75" style="pointer-events: none; font-size: 11px; z-index: 10;">
              <i class="bi bi-hand-index-thumb text-primary"></i>
              <span>Klik kotak untuk fokus &amp; detail • Drag untuk geser</span>
            </div>

            <!-- Nodes Quick Drawer / List Overlay -->
            <div class="mermaid-nodes-drawer position-absolute top-0 end-0 h-100 bg-white border-start shadow-sm p-3 d-none flex-column" style="width: 280px; z-index: 20; max-width: 85%;">
              <div class="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                <span class="fw-bold small text-dark d-flex align-items-center gap-1">
                  <i class="bi bi-bounding-box-circles text-primary"></i> Daftar Kotak Diagram
                </span>
                <button type="button" class="btn-close btn-sm close-nodes-drawer-btn" style="font-size: 10px;"></button>
              </div>
              <div class="mermaid-nodes-list-items overflow-y-auto flex-grow-1 d-flex flex-column gap-1.5 pe-1">
                <!-- Dynamically populated -->
              </div>
            </div>

            <!-- Floating Node Detail Inspector Overlay -->
            <div class="mermaid-node-detail-card position-absolute bottom-0 start-0 end-0 m-3 p-3 bg-white rounded-3 border shadow-lg d-none align-items-center justify-content-between gap-3" style="z-index: 25; backdrop-filter: blur(8px); background-color: rgba(255, 255, 255, 0.95);">
              <div class="d-flex align-items-center gap-3 overflow-hidden">
                <div class="badge bg-primary-subtle text-primary p-2.5 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0">
                  <i class="bi bi-box-seam fs-5"></i>
                </div>
                <div class="overflow-hidden">
                  <div class="d-flex align-items-center gap-2 mb-0.5">
                    <span class="badge bg-primary rounded-pill px-2 py-0.5" style="font-size: 10px;">Fokus Kotak Aktif</span>
                    <span class="text-muted font-monospace small node-id-label" style="font-size: 11px;">#Node</span>
                  </div>
                  <h6 class="fw-bold text-dark mb-0 text-truncate node-text-label">Judul Kotak</h6>
                </div>
              </div>

              <div class="d-flex align-items-center gap-1.5 flex-shrink-0">
                <button type="button" class="btn btn-sm btn-primary rounded-pill px-3 py-1 fw-bold focus-closer-btn" title="Fokus Lebih Dekat (Zoom 2.2x)">
                  <i class="bi bi-search me-1"></i> <span style="font-size: 11.5px;">Fokus</span>
                </button>
                <button type="button" class="btn btn-sm btn-light border rounded-pill px-2.5 py-1 copy-node-text-btn" title="Salin Teks Kotak">
                  <i class="bi bi-clipboard"></i>
                </button>
                <button type="button" class="btn btn-sm btn-light border rounded-pill px-2.5 py-1 reset-node-focus-btn" title="Kembalikan Tampilan Penuh">
                  <i class="bi bi-arrow-counterclockwise"></i>
                </button>
                <button type="button" class="btn-close btn-sm close-node-detail-btn ms-1"></button>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    return parsedHtml;
  } catch (err) {
    console.error('Markdown parse error:', err);
    return `<div class="alert alert-danger py-2 px-3 small">Gagal memproses Markdown: ${err.message}</div>`;
  }
}

/**
 * Scan DOM container and dynamically render all pending Mermaid diagrams
 * with pan/zoom, interactive node focus, detail inspector, and table scroll controllers
 */
export async function renderMermaidDiagramsInContainer(containerElement) {
  if (!containerElement) return;

  // 1. Initialize Table Scrolling Controllers
  setupTableScrollControllers(containerElement);

  // 2. Initialize Mermaid Diagram Rendering & Interactivity
  const diagramContainers = containerElement.querySelectorAll('.mermaid-diagram-viewport[data-mermaid-code]');
  if (!diagramContainers || diagramContainers.length === 0) return;

  const mermaid = await getMermaid();
  if (!mermaid) {
    diagramContainers.forEach(el => {
      const rawCode = decodeURIComponent(el.getAttribute('data-mermaid-code') || '');
      el.innerHTML = `
        <div class="p-3 bg-light rounded-3 text-start border small">
          <div class="text-secondary fw-semibold mb-1"><i class="bi bi-code-square me-1"></i> Kode Mermaid:</div>
          <pre class="bg-dark text-light p-2 rounded small m-0 overflow-x-auto font-monospace"><code>${escapeHtml(rawCode)}</code></pre>
        </div>
      `;
    });
    return;
  }

  await initMermaid();

  for (const el of diagramContainers) {
    const rawCode = decodeURIComponent(el.getAttribute('data-mermaid-code') || '');
    if (!rawCode) continue;

    const blockContainer = el.closest('.mermaid-block-container');
    const renderId = `render-${el.id || Math.random().toString(36).substring(2, 9)}`;

    try {
      // Validate syntax before rendering
      const isValid = await mermaid.parse(rawCode).catch(() => false);

      if (isValid === false) {
        el.innerHTML = `
          <div class="alert alert-warning py-2 px-3 small text-start mb-0">
            <div class="fw-bold mb-1"><i class="bi bi-exclamation-triangle-fill text-warning me-1"></i> Format Mermaid Perlu Penyesuaian</div>
            <p class="mb-1 small">Pastikan sintaks diagram Mermaid valid (misal: <code>graph TD</code>, <code>flowchart LR</code>, <code>sequenceDiagram</code>).</p>
            <pre class="bg-dark text-light p-2 rounded small m-0 overflow-x-auto"><code>${escapeHtml(rawCode)}</code></pre>
          </div>
        `;
        continue;
      }

      const { svg } = await mermaid.render(renderId, rawCode);
      el.innerHTML = svg;

      // Enhance the rendered SVG
      const svgEl = el.querySelector('svg');
      if (svgEl) {
        svgEl.style.maxWidth = '100%';
        svgEl.style.height = 'auto';
        svgEl.classList.add('mermaid-rendered-svg');

        // Setup Interactive Controller for this specific Mermaid block
        if (blockContainer) {
          setupMermaidInteractiveController(blockContainer, svgEl);
        }
      }
    } catch (renderError) {
      console.warn('Mermaid render error for element:', renderError);
      el.innerHTML = `
        <div class="p-3 bg-light rounded-3 text-start border small">
          <div class="text-secondary fw-semibold mb-1"><i class="bi bi-code-square me-1"></i> Kode Mermaid:</div>
          <pre class="bg-dark text-light p-2 rounded small m-0 overflow-x-auto font-monospace"><code>${escapeHtml(rawCode)}</code></pre>
        </div>
      `;
    }
  }

  // Bind copy buttons
  const copyBtns = containerElement.querySelectorAll('.copy-mermaid-code-btn');
  copyBtns.forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const code = decodeURIComponent(btn.getAttribute('data-code') || '');
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          const origHtml = btn.innerHTML;
          btn.innerHTML = '<i class="bi bi-check2 text-success me-1"></i><span style="font-size: 11px;">Tersalin!</span>';
          setTimeout(() => {
            btn.innerHTML = origHtml;
          }, 2000);
        });
      }
    };
  });
}

/**
 * Setup horizontal table scrolling interactions (drag to scroll + left/right buttons)
 */
function setupTableScrollControllers(container) {
  const tableWrappers = container.querySelectorAll('.markdown-table-wrapper');
  tableWrappers.forEach(wrapper => {
    const scrollContainer = wrapper.querySelector('.markdown-table-responsive-container');
    const leftBtn = wrapper.querySelector('.table-scroll-left');
    const rightBtn = wrapper.querySelector('.table-scroll-right');

    if (!scrollContainer) return;

    const updateScrollButtons = () => {
      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (leftBtn) {
        leftBtn.disabled = scrollContainer.scrollLeft <= 4;
        leftBtn.style.opacity = scrollContainer.scrollLeft <= 4 ? '0.45' : '1';
      }
      if (rightBtn) {
        rightBtn.disabled = scrollContainer.scrollLeft >= maxScrollLeft - 4;
        rightBtn.style.opacity = scrollContainer.scrollLeft >= maxScrollLeft - 4 ? '0.45' : '1';
      }
    };

    if (leftBtn) {
      leftBtn.onclick = (e) => {
        e.preventDefault();
        scrollContainer.scrollBy({ left: -220, behavior: 'smooth' });
      };
    }

    if (rightBtn) {
      rightBtn.onclick = (e) => {
        e.preventDefault();
        scrollContainer.scrollBy({ left: 220, behavior: 'smooth' });
      };
    }

    // Drag-to-scroll behavior for table
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    scrollContainer.addEventListener('mousedown', (e) => {
      // Don't drag if clicking interactive elements inside table
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
      isDown = true;
      scrollContainer.style.cursor = 'grabbing';
      scrollContainer.style.userSelect = 'none';
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
      if (isDown) {
        isDown = false;
        scrollContainer.style.cursor = 'default';
        scrollContainer.style.removeProperty('user-select');
      }
    });

    scrollContainer.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        scrollContainer.style.cursor = 'default';
        scrollContainer.style.removeProperty('user-select');
      }
    });

    scrollContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 1.5;
      scrollContainer.scrollLeft = scrollLeft - walk;
    });

    scrollContainer.addEventListener('scroll', updateScrollButtons, { passive: true });
    updateScrollButtons();
  });
}

/**
 * Setup Pan, Zoom, Interactive Node Click/Focus, and Detail Inspector for a Mermaid diagram
 */
function setupMermaidInteractiveController(blockContainer, svgEl) {
  const panzoomStage = blockContainer.querySelector('.mermaid-panzoom-stage');
  const viewportWrapper = blockContainer.querySelector('.mermaid-viewport-wrapper');
  const zoomInBtn = blockContainer.querySelector('.mermaid-zoom-in-btn');
  const zoomOutBtn = blockContainer.querySelector('.mermaid-zoom-out-btn');
  const zoomResetBtn = blockContainer.querySelector('.mermaid-zoom-reset-btn');
  const zoomFitBtn = blockContainer.querySelector('.mermaid-zoom-fit-btn');
  const zoomIndicator = blockContainer.querySelector('.mermaid-zoom-indicator');
  const fullscreenBtn = blockContainer.querySelector('.mermaid-fullscreen-btn');
  const nodesListBtn = blockContainer.querySelector('.mermaid-nodes-list-btn');
  const nodeCountBadge = blockContainer.querySelector('.mermaid-node-count-badge .node-count-text');
  const nodesDrawer = blockContainer.querySelector('.mermaid-nodes-drawer');
  const nodesListItems = blockContainer.querySelector('.mermaid-nodes-list-items');
  const closeNodesDrawerBtn = blockContainer.querySelector('.close-nodes-drawer-btn');
  const nodeDetailCard = blockContainer.querySelector('.mermaid-node-detail-card');
  const nodeTitleLabel = blockContainer.querySelector('.node-text-label');
  const nodeIdLabel = blockContainer.querySelector('.node-id-label');
  const focusCloserBtn = blockContainer.querySelector('.focus-closer-btn');
  const copyNodeTextBtn = blockContainer.querySelector('.copy-node-text-btn');
  const resetNodeFocusBtn = blockContainer.querySelector('.reset-node-focus-btn');
  const closeNodeDetailBtn = blockContainer.querySelector('.close-node-detail-btn');

  if (!panzoomStage || !viewportWrapper) return;

  // Viewport State
  const state = {
    zoom: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    startX: 0,
    startY: 0,
    activeNodeEl: null,
    activeNodeData: null,
    nodes: []
  };

  const applyTransform = (smooth = false) => {
    panzoomStage.style.transition = smooth ? 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
    panzoomStage.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
    if (zoomIndicator) {
      zoomIndicator.textContent = `${Math.round(state.zoom * 100)}%`;
    }
  };

  const setZoom = (newZoom, smooth = true) => {
    state.zoom = Math.min(Math.max(newZoom, 0.25), 4.0);
    applyTransform(smooth);
  };

  const resetView = (smooth = true) => {
    state.zoom = 1;
    state.panX = 0;
    state.panY = 0;
    clearActiveNodeHighlight();
    applyTransform(smooth);
  };

  const fitView = (smooth = true) => {
    if (!svgEl || !viewportWrapper) return;
    const svgRect = svgEl.getBoundingClientRect();
    const vpRect = viewportWrapper.getBoundingClientRect();
    if (svgRect.width > 0 && svgRect.height > 0 && vpRect.width > 0) {
      const scaleX = (vpRect.width * 0.9) / (svgRect.width / state.zoom);
      const scaleY = (vpRect.height * 0.85) / (svgRect.height / state.zoom);
      const fitScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.35), 1.6);
      state.zoom = fitScale;
      state.panX = 0;
      state.panY = 0;
      applyTransform(smooth);
    }
  };

  // Zoom Button Handlers
  if (zoomInBtn) {
    zoomInBtn.onclick = (e) => {
      e.stopPropagation();
      setZoom(state.zoom + 0.25);
    };
  }
  if (zoomOutBtn) {
    zoomOutBtn.onclick = (e) => {
      e.stopPropagation();
      setZoom(state.zoom - 0.25);
    };
  }
  if (zoomResetBtn) {
    zoomResetBtn.onclick = (e) => {
      e.stopPropagation();
      resetView();
    };
  }
  if (zoomFitBtn) {
    zoomFitBtn.onclick = (e) => {
      e.stopPropagation();
      fitView();
    };
  }

  // Fullscreen toggle handler
  if (fullscreenBtn) {
    fullscreenBtn.onclick = (e) => {
      e.stopPropagation();
      const isFullscreen = blockContainer.classList.toggle('mermaid-fullscreen-mode');
      if (isFullscreen) {
        fullscreenBtn.innerHTML = '<i class="bi bi-fullscreen-exit text-danger"></i>';
        fullscreenBtn.title = 'Keluar Layar Penuh (Esc)';
        viewportWrapper.style.height = 'calc(90vh - 70px)';
      } else {
        fullscreenBtn.innerHTML = '<i class="bi bi-arrows-fullscreen"></i>';
        fullscreenBtn.title = 'Layar Penuh';
        viewportWrapper.style.height = '380px';
      }
      setTimeout(() => fitView(false), 150);
    };
  }

  // Pan by Mouse Dragging
  viewportWrapper.addEventListener('mousedown', (e) => {
    // If clicking a node or toolbar control, do not trigger background pan drag
    if (e.target.closest('.mermaid-header') || e.target.closest('.mermaid-nodes-drawer') || e.target.closest('.mermaid-node-detail-card')) {
      return;
    }
    state.isDragging = true;
    panzoomStage.style.cursor = 'grabbing';
    state.startX = e.clientX - state.panX;
    state.startY = e.clientY - state.panY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!state.isDragging) return;
    state.panX = e.clientX - state.startX;
    state.panY = e.clientY - state.startY;
    applyTransform(false);
  });

  window.addEventListener('mouseup', () => {
    if (state.isDragging) {
      state.isDragging = false;
      panzoomStage.style.cursor = 'grab';
    }
  });

  // Mouse Wheel Zoom on Viewport
  viewportWrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    setZoom(state.zoom * zoomFactor, false);
  }, { passive: false });

  // -----------------------------------------------------------------
  // PARSE SVG NODES FOR INTERACTIVE FOCUS & INSPECTION
  // -----------------------------------------------------------------
  const parseSvgNodes = () => {
    state.nodes = [];
    if (!svgEl) return;

    // Potential node selectors across flowchart, sequence, state, class, mindmap
    const nodeSelectors = [
      'g.node',
      'g.actor',
      'g.statediagram-state',
      'g.classGroup',
      'g.mindmap-node',
      'g[id*="flowchart-"]',
      'g.cluster'
    ];

    const nodeElements = svgEl.querySelectorAll(nodeSelectors.join(', '));
    nodeElements.forEach((nodeEl, idx) => {
      // Find clean text representation
      let rawText = '';
      const textElements = nodeEl.querySelectorAll('text, span, div, p, foreignObject');
      textElements.forEach(t => {
        const txt = (t.textContent || '').trim();
        if (txt && !rawText.includes(txt)) {
          rawText += (rawText ? ' ' : '') + txt;
        }
      });

      if (!rawText) {
        rawText = nodeEl.getAttribute('id') || `Kotak #${idx + 1}`;
      }

      const nodeId = nodeEl.getAttribute('id') || `node-${idx + 1}`;
      const nodeData = {
        id: nodeId,
        title: rawText.replace(/\s+/g, ' '),
        index: idx,
        element: nodeEl
      };

      state.nodes.push(nodeData);

      // Enhance SVG node element styling and interactions
      nodeEl.style.cursor = 'pointer';
      nodeEl.classList.add('interactive-mermaid-node');

      // Click node handler
      nodeEl.onclick = (e) => {
        e.stopPropagation();
        focusOnNode(nodeData, true);
      };
    });

    // Update node count in header
    if (nodeCountBadge) {
      nodeCountBadge.textContent = `${state.nodes.length} Kotak`;
    }

    // Populate Nodes Drawer List
    if (nodesListItems) {
      nodesListItems.innerHTML = '';
      if (state.nodes.length === 0) {
        nodesListItems.innerHTML = '<div class="text-muted small p-2">Tidak ada kotak yang dapat diidentifikasi.</div>';
      } else {
        state.nodes.forEach(node => {
          const itemBtn = document.createElement('button');
          itemBtn.type = 'button';
          itemBtn.className = 'btn btn-light btn-sm text-start rounded-3 p-2 border d-flex align-items-center gap-2 node-list-item-btn';
          itemBtn.innerHTML = `
            <span class="badge bg-primary-subtle text-primary p-1 rounded"><i class="bi bi-box-seam"></i></span>
            <div class="overflow-hidden flex-grow-1">
              <div class="fw-bold text-dark text-truncate small">${escapeHtml(node.title)}</div>
              <div class="text-muted font-monospace" style="font-size: 10px;">${escapeHtml(node.id)}</div>
            </div>
            <i class="bi bi-chevron-right text-muted small"></i>
          `;
          itemBtn.onclick = () => {
            focusOnNode(node, true);
          };
          nodesListItems.appendChild(itemBtn);
        });
      }
    }
  };

  const clearActiveNodeHighlight = () => {
    if (state.activeNodeEl) {
      state.activeNodeEl.classList.remove('mermaid-node-focused');
      state.activeNodeEl = null;
    }
    state.activeNodeData = null;
    if (nodeDetailCard) {
      nodeDetailCard.classList.remove('d-flex');
      nodeDetailCard.classList.add('d-none');
    }
  };

  const focusOnNode = (nodeData, smooth = true, targetZoom = 1.95) => {
    if (!nodeData || !nodeData.element) return;

    clearActiveNodeHighlight();

    state.activeNodeEl = nodeData.element;
    state.activeNodeData = nodeData;
    nodeData.element.classList.add('mermaid-node-focused');

    // Calculate node bounding box relative to SVG viewport center
    try {
      let nodeBox = null;
      if (typeof nodeData.element.getBBox === 'function') {
        nodeBox = nodeData.element.getBBox();
      }

      const svgRect = svgEl.getBoundingClientRect();
      const nodeRect = nodeData.element.getBoundingClientRect();
      const vpRect = viewportWrapper.getBoundingClientRect();

      // Target zoom level
      state.zoom = targetZoom;

      // Calculate centering offset
      const nodeCenterX = nodeRect.left + nodeRect.width / 2;
      const nodeCenterY = nodeRect.top + nodeRect.height / 2;
      const vpCenterX = vpRect.left + vpRect.width / 2;
      const vpCenterY = vpRect.top + vpRect.height / 2;

      state.panX += (vpCenterX - nodeCenterX);
      state.panY += (vpCenterY - nodeCenterY);

      applyTransform(smooth);
    } catch (e) {
      state.zoom = targetZoom;
      applyTransform(smooth);
    }

    // Display Floating Detail Inspector Card
    if (nodeDetailCard && nodeTitleLabel && nodeIdLabel) {
      nodeTitleLabel.textContent = nodeData.title;
      nodeIdLabel.textContent = `#${nodeData.id}`;
      nodeDetailCard.classList.remove('d-none');
      nodeDetailCard.classList.add('d-flex');
    }
  };

  // Node Detail Actions
  if (focusCloserBtn) {
    focusCloserBtn.onclick = (e) => {
      e.stopPropagation();
      if (state.activeNodeData) {
        focusOnNode(state.activeNodeData, true, 2.7);
      }
    };
  }

  if (copyNodeTextBtn) {
    copyNodeTextBtn.onclick = (e) => {
      e.stopPropagation();
      if (state.activeNodeData && state.activeNodeData.title) {
        navigator.clipboard.writeText(state.activeNodeData.title).then(() => {
          const orig = copyNodeTextBtn.innerHTML;
          copyNodeTextBtn.innerHTML = '<i class="bi bi-check2 text-success"></i>';
          setTimeout(() => { copyNodeTextBtn.innerHTML = orig; }, 1500);
        });
      }
    };
  }

  if (resetNodeFocusBtn) {
    resetNodeFocusBtn.onclick = (e) => {
      e.stopPropagation();
      resetView();
    };
  }

  if (closeNodeDetailBtn) {
    closeNodeDetailBtn.onclick = (e) => {
      e.stopPropagation();
      clearActiveNodeHighlight();
    };
  }

  // Nodes Drawer Toggle
  if (nodesListBtn && nodesDrawer) {
    nodesListBtn.onclick = (e) => {
      e.stopPropagation();
      const isOpen = nodesDrawer.classList.contains('d-flex');
      if (isOpen) {
        nodesDrawer.classList.remove('d-flex');
        nodesDrawer.classList.add('d-none');
      } else {
        nodesDrawer.classList.remove('d-none');
        nodesDrawer.classList.add('d-flex');
      }
    };
  }

  if (closeNodesDrawerBtn && nodesDrawer) {
    closeNodesDrawerBtn.onclick = (e) => {
      e.stopPropagation();
      nodesDrawer.classList.remove('d-flex');
      nodesDrawer.classList.add('d-none');
    };
  }

  // Parse SVG Nodes after DOM injection
  parseSvgNodes();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

