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
 * Open a DOM element or HTML string in a dedicated print-optimized tab
 * @param {Object} options
 * @param {string} options.title - Title of the new tab
 * @param {string} [options.elementId] - ID of DOM element to clone
 * @param {HTMLElement} [options.element] - Direct DOM element reference
 * @param {string} [options.rawHtml] - Raw HTML string to render
 * @param {string} [options.customStyles] - Extra CSS styles to inject
 * @param {boolean} [options.autoPrint] - Whether to automatically trigger print dialog in new tab
 */
export function openPrintableDocumentInNewTab({
  title = 'Dokumen RajinKerja',
  elementId = null,
  element = null,
  rawHtml = '',
  customStyles = '',
  autoPrint = true
}) {
  let contentHtml = rawHtml;

  if (!contentHtml) {
    const targetEl = element || (elementId ? document.getElementById(elementId) : null);
    if (targetEl) {
      contentHtml = targetEl.innerHTML;
    }
  }

  if (!contentHtml) {
    console.warn('No content provided for print tab');
    return;
  }

  // Get current stylesheet links from document head to ensure identical styling
  const headLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(el => el.outerHTML)
    .join('\n');

  const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - RajinKerja</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  ${headLinks}
  <style>
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
      @page {
        size: A4 portrait;
        margin: 0;
      }
      .print-toolbar {
        display: none !important;
      }
      .print-container {
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
      .page-break, .print-page-break {
        page-break-after: always !important;
        break-after: page !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .page-break:last-child, .print-page-break:last-child {
        page-break-after: auto !important;
        break-after: auto !important;
      }
      .no-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    }
    body {
      background-color: #f1f5f9;
      color: #1e293b;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      padding: 0;
      margin: 0;
    }
    .print-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .print-container {
      max-width: 860px;
      margin: 24px auto 48px auto;
      background: transparent;
      padding: 0;
    }
    @media (max-width: 768px) {
      .print-container {
        padding: 8px;
        margin: 12px auto;
      }
    }
    ${customStyles}
  </style>
</head>
<body>
  <div class="print-toolbar no-print">
    <div class="d-flex align-items-center gap-2">
      <span class="badge bg-primary text-white fw-bold px-2.5 py-1">PDF & Print Mode</span>
      <span class="fw-bold fs-6">${title}</span>
    </div>
    <div class="d-flex align-items-center gap-2">
      <button onclick="window.print()" class="btn btn-sm btn-primary fw-bold px-3 py-1.5 shadow-sm d-flex align-items-center gap-1.5">
        <i class="bi bi-printer-fill"></i> Cetak / Simpan PDF
      </button>
      <button onclick="window.close()" class="btn btn-sm btn-outline-light px-3 py-1.5">
        Tutup Tab
      </button>
    </div>
  </div>

  <div class="print-container">
    ${contentHtml}
  </div>

  ${autoPrint ? `
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>` : ''}
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
