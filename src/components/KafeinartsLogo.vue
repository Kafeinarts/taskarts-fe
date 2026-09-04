<template>
  <div
    class="kafeinarts-logo-wrapper d-inline-flex align-items-center justify-content-center"
    :style="{ width: computedSize, height: computedSize }"
    :title="title || 'Logo Kafeinarts'"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      width="100%"
      height="100%"
      fill="none"
      class="kafeinarts-svg"
    >
      <!-- Layer 2: Bottom Isometric Layer -->
      <g
        class="isometric-layer-bottom"
        :stroke="resolvedOutlineColor"
        stroke-width="9"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <!-- Outer bottom curve -->
        <path
          d="M 68 236 C 44 250 44 268 68 282 L 180 348 C 192 355 208 355 220 348 L 332 282 C 356 268 356 250 332 236"
          fill="none"
          opacity="0.95"
        />
        <!-- Inner bottom contour -->
        <path
          d="M 88 248 C 72 258 72 268 88 277 L 184 333 C 194 339 206 339 216 333 L 312 277 C 328 268 328 258 312 248"
          fill="none"
          stroke-width="6"
          opacity="0.75"
        />
      </g>

      <!-- Layer 1: Top Isometric Main Plane -->
      <g
        class="isometric-layer-top"
        :stroke="resolvedOutlineColor"
        stroke-width="9"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <!-- Outer top diamond perimeter -->
        <path
          d="M 180 68 C 192 61 208 61 220 68 L 348 144 C 372 158 372 176 348 190 L 220 266 C 208 273 192 273 180 266 L 52 190 C 28 176 28 158 52 144 Z"
          fill="none"
        />
        <!-- Inner concentric diamond contour -->
        <path
          d="M 184 94 C 194 88 206 88 216 94 L 324 158 C 340 167 340 177 324 186 L 216 250 C 206 256 194 256 184 250 L 76 186 C 60 177 60 167 76 158 Z"
          fill="none"
          stroke-width="6"
          opacity="0.8"
        />
      </g>

      <!-- Center Code Symbol: </> in bold blue with rounded caps -->
      <g
        class="code-glyph"
        :stroke="codeColor || '#2563eb'"
        stroke-width="18"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <!-- Left bracket: < -->
        <path d="M 166 148 L 126 177 L 166 206" />
        <!-- Slash: / -->
        <path d="M 222 126 L 178 228" />
        <!-- Right bracket: > -->
        <path d="M 234 148 L 274 177 L 234 206" />
      </g>
    </svg>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'KafeinartsLogo',
  props: {
    size: {
      type: [Number, String],
      default: 54
    },
    // 'auto' | 'dark' | 'light' | 'custom'
    outlineMode: {
      type: String,
      default: 'auto'
    },
    // If outlineMode is 'auto', inverted=true means dark background (white outline), inverted=false means light background (dark outline)
    inverted: {
      type: Boolean,
      default: false
    },
    customOutlineColor: {
      type: String,
      default: ''
    },
    codeColor: {
      type: String,
      default: '#2563eb'
    },
    title: {
      type: String,
      default: 'Kafeinarts Logo'
    }
  },
  setup(props) {
    const computedSize = computed(() => {
      if (typeof props.size === 'number') return props.size + 'px';
      return props.size || '54px';
    });

    const resolvedOutlineColor = computed(() => {
      if (props.customOutlineColor) return props.customOutlineColor;
      if (props.outlineMode === 'light') return '#ffffff';
      if (props.outlineMode === 'dark') return '#0f172a';
      // auto: if inverted (on dark background), outline becomes white; if on light background, outline becomes dark
      return props.inverted ? '#ffffff' : '#0f172a';
    });

    return {
      computedSize,
      resolvedOutlineColor
    };
  }
};
</script>

<style scoped>
.kafeinarts-logo-wrapper {
  line-height: 0;
  display: inline-flex;
  vertical-align: middle;
  background: transparent;
  flex-shrink: 0;
}
.kafeinarts-svg {
  display: block;
  overflow: visible;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.04));
}
</style>
