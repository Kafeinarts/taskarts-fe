/**
 * Utility to open PDF Blobs or Printable HTML documents in a clean new tab
 * with zero annoying popups and smooth browser-native printing / PDF preview.
 */

/**
 * Open a jsPDF Blob in a new browser tab for preview/printing/saving without popup
 * @param {Blob} pdfBlob - The PDF blob from jsPDF doc.output('blob')
 * @param {string} title - Window/Tab title
 */
export function openPdfBlobInNewTab(pdfBlob, title = 'Dokumen PDF') {
  if (!pdfBlob) return;
  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  // Create an anchor element to open in new tab with noopener
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up object URL after a delay
  setTimeout(() => {
    URL.revokeObjectURL(pdfUrl);
  }, 60000);
}

/**
 * Paper Size standard dimensions in Millimeters
 */
export const PAPER_SIZES = {
  a4: { id: 'a4', name: 'A4', widthMm: 210, heightMm: 297, label: 'A4 (210 × 297 mm)' },
  f4: { id: 'f4', name: 'F4 / Folio', widthMm: 215, heightMm: 330, label: 'F4 / Folio (215 × 330 mm)' },
  letter: { id: 'letter', name: 'Letter', widthMm: 215.9, heightMm: 279.4, label: 'Letter (215.9 × 279.4 mm)' },
  legal: { id: 'legal', name: 'Legal', widthMm: 215.9, heightMm: 355.6, label: 'Legal (215.9 × 355.6 mm)' },
  a5: { id: 'a5', name: 'A5', widthMm: 148, heightMm: 210, label: 'A5 (148 × 210 mm)' }
};

/**
 * Open a DOM element or HTML string in a dedicated print-optimized tab
 * with full support for exact paper sizes (A4, F4, Letter, Legal, A5),
 * precise millimeter margins, interactive paper switching, and visual margin guidelines.
 *
 * @param {Object} options
 * @param {string} options.title - Title of the new tab
 * @param {string} [options.elementId] - ID of DOM element to clone
 * @param {HTMLElement} [options.element] - Direct DOM element reference
 * @param {string} [options.rawHtml] - Raw HTML string to render
 * @param {string} [options.customStyles] - Extra CSS styles to inject
 * @param {boolean} [options.autoPrint] - Whether to automatically trigger print dialog in new tab
 * @param {string} [options.paperSize] - Paper size key: 'a4' | 'f4' | 'letter' | 'legal' | 'a5'
 * @param {string} [options.paperOrientation] - 'portrait' | 'landscape'
 * @param {number} [options.marginTop] - Top margin in mm
 * @param {number} [options.marginBottom] - Bottom margin in mm
 * @param {number} [options.marginLeft] - Left margin in mm
 * @param {number} [options.marginRight] - Right margin in mm
 */
export function openPrintableDocumentInNewTab({
  title = 'Dokumen RajinKerja',
  elementId = null,
  element = null,
  rawHtml = '',
  customStyles = '',
  autoPrint = true,
  paperSize = 'a4',
  paperOrientation = 'portrait',
  marginTop = 20,
  marginBottom = 20,
  marginLeft = 25,
  marginRight = 20
}) {
  let contentHtml = rawHtml;

  if (!contentHtml) {
    const targetEl = element || (elementId ? document.getElementById(elementId) : null);
    if (targetEl) {
      // Use outerHTML so classes, inline styles, IDs and millimeter paddings are completely preserved!
      contentHtml = targetEl.outerHTML;
    }
  }

  if (!contentHtml) {
    console.warn('No content provided for print tab');
    return;
  }

  const paperKey = (paperSize || 'a4').toLowerCase();
  const activePaper = PAPER_SIZES[paperKey] || PAPER_SIZES.a4;
  const isLandscape = paperOrientation === 'landscape';
  const widthMm = isLandscape ? activePaper.heightMm : activePaper.widthMm;
  const heightMm = isLandscape ? activePaper.widthMm : activePaper.heightMm;

  // Get current stylesheet links from document head to ensure identical typography and icons
  const headLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(el => el.outerHTML)
    .join('\n');

  const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - RajinKerja Document Viewer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  ${headLinks}
  <style id="dynamicPaperStyle">
    :root {
      --paper-width: ${widthMm}mm;
      --paper-height: ${heightMm}mm;
      --margin-top: ${marginTop}mm;
      --margin-bottom: ${marginBottom}mm;
      --margin-left: ${marginLeft}mm;
      --margin-right: ${marginRight}mm;
    }

    @page {
      size: ${widthMm}mm ${heightMm}mm;
      margin: 0;
    }

    @media print {
      .no-print, .no-print * {
        display: none !important;
      }
      html, body {
        background: #ffffff !important;
        color: #000000 !important;
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .print-workbench {
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
      }
      .print-container {
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        transform: none !important;
      }
      .letter-paper {
        width: var(--paper-width) !important;
        max-width: var(--paper-width) !important;
        min-height: var(--paper-height) !important;
        box-sizing: border-box !important;
        padding-top: var(--margin-top) !important;
        padding-bottom: var(--margin-bottom) !important;
        padding-left: var(--margin-left) !important;
        padding-right: var(--margin-right) !important;
        margin: 0 auto !important;
        box-shadow: none !important;
        border: none !important;
        background: #ffffff !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .bulk-print-container > .letter-paper,
      .page-break,
      .print-page-break {
        page-break-after: always !important;
        break-after: page !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        display: block !important;
        margin: 0 auto !important;
      }
      .bulk-print-container > .letter-paper:last-child,
      .page-break:last-child,
      .print-page-break:last-child {
        page-break-after: auto !important;
        break-after: auto !important;
      }
      .no-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .margin-guide-active .letter-paper::before {
        display: none !important;
      }
    }

    /* Screen Document Workbench */
    body {
      background-color: #475569;
      color: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      padding: 0;
      margin: 0;
      min-height: 100vh;
    }
    .print-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .print-workbench {
      padding: 30px 16px 60px 16px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      overflow-x: auto;
      min-height: calc(100vh - 65px);
    }
    .print-container {
      margin: 0 auto;
      background: transparent;
      transform-origin: top center;
      transition: transform 0.15s ease-out;
    }
    .letter-paper {
      width: var(--paper-width) !important;
      min-height: var(--paper-height) !important;
      box-sizing: border-box !important;
      padding-top: var(--margin-top) !important;
      padding-bottom: var(--margin-bottom) !important;
      padding-left: var(--margin-left) !important;
      padding-right: var(--margin-right) !important;
      margin: 0 auto 36px auto !important;
      background: #ffffff !important;
      border: 1px solid #94a3b8 !important;
      border-radius: 2px !important;
      box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.15) !important;
      position: relative;
    }

    /* Visual Margin Guide Lines (Batas Margin) */
    .margin-guide-active .letter-paper::before {
      content: "📐 Batas Margin Kertas (" attr(data-margins) ")";
      position: absolute;
      top: var(--margin-top);
      bottom: var(--margin-bottom);
      left: var(--margin-left);
      right: var(--margin-right);
      border: 1.5px dashed #0284c7;
      pointer-events: none;
      z-index: 99;
      color: #0369a1;
      font-size: 11px;
      font-family: monospace;
      font-weight: bold;
      padding: 4px 8px;
      background: rgba(2, 132, 199, 0.03);
    }

    .kop-divider-double {
      margin-top: 8px !important;
      margin-bottom: 16px !important;
      border-top: 3px solid #000000 !important;
      border-bottom: 1px solid #000000 !important;
      height: 5px !important;
    }
    .kop-divider-thick {
      margin-top: 8px !important;
      margin-bottom: 16px !important;
      border-top: 3px solid #000000 !important;
    }
    .kop-divider-single {
      margin-top: 8px !important;
      margin-bottom: 16px !important;
      border-top: 1px solid #1e293b !important;
    }

    ${customStyles}
  </style>
</head>
<body>
  <!-- TOP INTERACTIVE PRINT TOOLBAR -->
  <div class="print-toolbar no-print">
    <div class="d-flex align-items-center flex-wrap gap-2">
      <span class="badge bg-primary text-white fw-bold px-2.5 py-1">
        <i class="bi bi-file-earmark-pdf me-1"></i> RajinKerja Print / PDF
      </span>
      <span class="fw-bold fs-6 text-white text-truncate" style="max-width: 250px;">${title}</span>
    </div>

    <!-- Paper Size, Orientation, Zoom, and Margin Guide Controls -->
    <div class="d-flex align-items-center flex-wrap gap-2">
      <!-- Paper Size Dropdown -->
      <div class="input-group input-group-sm" style="width: auto;">
        <span class="input-group-text bg-dark text-light border-secondary">
          <i class="bi bi-aspect-ratio me-1"></i> Ukuran:
        </span>
        <select id="paperSizeSelect" class="form-select form-select-sm bg-dark text-white border-secondary fw-semibold" onchange="updatePaperSize(this.value)">
          <option value="a4" ${paperKey === 'a4' ? 'selected' : ''}>A4 (210 × 297 mm)</option>
          <option value="f4" ${paperKey === 'f4' ? 'selected' : ''}>F4 / Folio (215 × 330 mm)</option>
          <option value="letter" ${paperKey === 'letter' ? 'selected' : ''}>Letter (215.9 × 279.4 mm)</option>
          <option value="legal" ${paperKey === 'legal' ? 'selected' : ''}>Legal (215.9 × 355.6 mm)</option>
          <option value="a5" ${paperKey === 'a5' ? 'selected' : ''}>A5 (148 × 210 mm)</option>
        </select>
      </div>

      <!-- Orientation Switcher -->
      <div class="btn-group btn-group-sm">
        <button type="button" id="btnOrientPortrait" class="btn ${!isLandscape ? 'btn-primary' : 'btn-outline-secondary text-white'}" onclick="updateOrientation('portrait')" title="Orientasi Tegak">
          Tegak
        </button>
        <button type="button" id="btnOrientLandscape" class="btn ${isLandscape ? 'btn-primary' : 'btn-outline-secondary text-white'}" onclick="updateOrientation('landscape')" title="Orientasi Mendatar">
          Mendatar
        </button>
      </div>

      <!-- Margin Guide Toggle -->
      <button type="button" id="btnMarginGuide" class="btn btn-sm btn-outline-info text-light" onclick="toggleMarginGuide()" title="Tampilkan garis batas margin kertas">
        <i class="bi bi-bounding-box-circles me-1"></i> Garis Margin
      </button>

      <!-- Zoom Controls -->
      <div class="btn-group btn-group-sm">
        <button type="button" class="btn btn-outline-secondary text-white" onclick="changeZoom(-0.1)" title="Perkecil">
          <i class="bi bi-dash"></i>
        </button>
        <button type="button" id="btnZoomLabel" class="btn btn-dark text-white border-secondary px-2" onclick="resetZoom()" title="Reset Zoom">
          100%
        </button>
        <button type="button" class="btn btn-outline-secondary text-white" onclick="changeZoom(0.1)" title="Perbesar">
          <i class="bi bi-plus"></i>
        </button>
      </div>

      <!-- Print Button -->
      <button onclick="window.print()" class="btn btn-sm btn-success fw-bold px-3 shadow-sm d-flex align-items-center gap-1.5">
        <i class="bi bi-printer-fill"></i> Cetak / Simpan PDF
      </button>

      <!-- Close Tab -->
      <button onclick="window.close()" class="btn btn-sm btn-outline-light px-2.5" title="Tutup Tab">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  </div>

  <!-- WORKBENCH DOCUMENT VIEW -->
  <div class="print-workbench">
    <div id="printContainer" class="print-container">
      ${contentHtml}
    </div>
  </div>

  <script>
    const SIZES = ${JSON.stringify(PAPER_SIZES)};
    let currentPaper = "${paperKey}";
    let currentOrient = "${paperOrientation}";
    let currentScale = 1.0;
    let marginGuideActive = false;

    const mTop = ${marginTop};
    const mBtm = ${marginBottom};
    const mLft = ${marginLeft};
    const mRgt = ${marginRight};

    function applyDimensions() {
      const p = SIZES[currentPaper] || SIZES.a4;
      const isLand = currentOrient === 'landscape';
      const w = isLand ? p.heightMm : p.widthMm;
      const h = isLand ? p.widthMm : p.heightMm;

      const root = document.documentElement;
      root.style.setProperty('--paper-width', w + 'mm');
      root.style.setProperty('--paper-height', h + 'mm');

      // Update @page rule in style element
      let styleEl = document.getElementById('runtimePageStyle');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'runtimePageStyle';
        document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = '@page { size: ' + w + 'mm ' + h + 'mm; margin: 0; }';

      // Set data-margins for guide
      document.querySelectorAll('.letter-paper').forEach(el => {
        el.setAttribute('data-margins', 'Atas: ' + mTop + 'mm | Bawah: ' + mBtm + 'mm | Kiri: ' + mLft + 'mm | Kanan: ' + mRgt + 'mm');
      });
    }

    function updatePaperSize(val) {
      currentPaper = val;
      applyDimensions();
    }

    function updateOrientation(orient) {
      currentOrient = orient;
      document.getElementById('btnOrientPortrait').className = orient === 'portrait' ? 'btn btn-primary' : 'btn btn-outline-secondary text-white';
      document.getElementById('btnOrientLandscape').className = orient === 'landscape' ? 'btn btn-primary' : 'btn btn-outline-secondary text-white';
      applyDimensions();
    }

    function toggleMarginGuide() {
      marginGuideActive = !marginGuideActive;
      document.body.classList.toggle('margin-guide-active', marginGuideActive);
      const btn = document.getElementById('btnMarginGuide');
      if (marginGuideActive) {
        btn.classList.remove('btn-outline-info');
        btn.classList.add('btn-info');
      } else {
        btn.classList.remove('btn-info');
        btn.classList.add('btn-outline-info');
      }
    }

    function changeZoom(delta) {
      currentScale = Math.max(0.4, Math.min(1.8, currentScale + delta));
      renderZoom();
    }

    function resetZoom() {
      currentScale = 1.0;
      renderZoom();
    }

    function renderZoom() {
      const container = document.getElementById('printContainer');
      container.style.transform = 'scale(' + currentScale + ')';
      document.getElementById('btnZoomLabel').innerText = Math.round(currentScale * 100) + '%';
    }

    window.addEventListener('DOMContentLoaded', () => {
      applyDimensions();
      ${autoPrint ? `
        setTimeout(() => {
          window.print();
        }, 600);
      ` : ''}
    });
  </script>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 60000);
}

