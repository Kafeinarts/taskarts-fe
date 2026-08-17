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

export async function initMermaid() {
  if (mermaidInitialized) return;
  const mermaid = await getMermaid();
  if (!mermaid) return;
  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      themeVariables: {
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
 * Render Markdown string to HTML, preserving mermaid blocks
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

      return `
        <div class="mermaid-block-container my-4 p-3 bg-white rounded-4 border shadow-sm position-relative" data-diagram-id="${uniqueId}">
          <div class="mermaid-header d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
            <span class="badge bg-primary-subtle text-primary fw-bold px-2.5 py-1 rounded-pill small">
              <i class="bi bi-diagram-3-fill me-1"></i> Mermaid Flowchart / Diagram
            </span>
            <div class="d-flex gap-1">
              <button type="button" class="btn btn-xs btn-light border rounded-pill copy-mermaid-code-btn px-2 py-0.5" data-code="${encodeURIComponent(decodedCode)}" title="Salin Kode Mermaid">
                <i class="bi bi-clipboard me-1"></i> <span style="font-size: 11px;">Salin Kode</span>
              </button>
            </div>
          </div>
          <div class="mermaid-diagram-viewport text-center overflow-x-auto py-2" id="${uniqueId}" data-mermaid-code="${encodeURIComponent(decodedCode)}">
            <div class="spinner-border spinner-border-sm text-primary my-3" role="status">
              <span class="visually-hidden">Rendering diagram...</span>
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
 */
export async function renderMermaidDiagramsInContainer(containerElement) {
  if (!containerElement) return;

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

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
