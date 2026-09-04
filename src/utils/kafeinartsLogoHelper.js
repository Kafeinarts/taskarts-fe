/**
 * Kafeinarts Logo Generator & Utility
 * Generates responsive SVG and base64 PNG data URLs with inverted outline logic
 * (Black outline on light/white paper, White outline on dark background, Transparent background)
 */

export function getKafeinartsSvgString({
  outlineColor = '#0f172a',
  codeColor = '#2563eb',
  width = 400,
  height = 400
} = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="${width}" height="${height}" fill="none">
  <!-- Layer 2: Bottom Isometric Layer -->
  <g class="isometric-layer-bottom" stroke="${outlineColor}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 68 236 C 44 250 44 268 68 282 L 180 348 C 192 355 208 355 220 348 L 332 282 C 356 268 356 250 332 236" fill="none" opacity="0.95" />
    <path d="M 88 248 C 72 258 72 268 88 277 L 184 333 C 194 339 206 339 216 333 L 312 277 C 328 268 328 258 312 248" fill="none" stroke-width="6" opacity="0.75" />
  </g>
  <!-- Layer 1: Top Isometric Main Plane -->
  <g class="isometric-layer-top" stroke="${outlineColor}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 180 68 C 192 61 208 61 220 68 L 348 144 C 372 158 372 176 348 190 L 220 266 C 208 273 192 273 180 266 L 52 190 C 28 176 28 158 52 144 Z" fill="none" />
    <path d="M 184 94 C 194 88 206 88 216 94 L 324 158 C 340 167 340 177 324 186 L 216 250 C 206 256 194 256 184 250 L 76 186 C 60 177 60 167 76 158 Z" fill="none" stroke-width="6" opacity="0.8" />
  </g>
  <!-- Center Code Symbol: </> -->
  <g class="code-glyph" stroke="${codeColor}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 166 148 L 126 177 L 166 206" />
    <path d="M 222 126 L 178 228" />
    <path d="M 234 148 L 274 177 L 234 206" />
  </g>
</svg>`;
}

/**
 * Convert SVG string to raster PNG dataURL for jsPDF embedding
 */
export function getKafeinartsLogoDataUrl({
  inverted = false,
  outlineMode = 'auto',
  customColor = '',
  size = 200
} = {}) {
  return new Promise((resolve) => {
    let outline = '#0f172a';
    if (customColor) {
      outline = customColor;
    } else if (outlineMode === 'light' || (outlineMode === 'auto' && inverted)) {
      outline = '#ffffff';
    } else {
      outline = '#0f172a';
    }

    const svgStr = getKafeinartsSvgString({ outlineColor: outline, width: size, height: size });
    const img = new Image();
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(url);
        resolve('');
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve('');
    };
    img.src = url;
  });
}
