<template>
  <div class="markdown-rich-viewer" ref="viewerContainer">
    <div class="markdown-content-body" v-html="parsedHtml" @click="handleBodyClick"></div>

    <!-- Image Lightbox Modal -->
    <div
      v-if="lightbox.show"
      class="image-lightbox-overlay position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
      style="z-index: 2100; background-color: rgba(15, 23, 42, 0.88); backdrop-filter: blur(8px);"
      @click.self="lightbox.show = false"
    >
      <div class="lightbox-header position-absolute top-0 end-0 p-4 d-flex gap-2">
        <a :href="lightbox.src" download="note-image.png" class="btn btn-outline-light rounded-circle p-2" title="Unduh Gambar">
          <i class="bi bi-download"></i>
        </a>
        <button class="btn btn-outline-light rounded-circle p-2" @click="lightbox.show = false" title="Tutup (Esc)">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="lightbox-content text-center p-3" style="max-width: 90vw; max-height: 85vh;">
        <img
          :src="lightbox.src"
          :alt="lightbox.alt"
          class="img-fluid rounded-4 shadow-lg border border-secondary"
          style="max-height: 75vh; max-width: 100%; object-fit: contain;"
        />
        <div v-if="lightbox.alt" class="mt-3 text-white-50 small font-monospace">
          <i class="bi bi-info-circle me-1"></i> {{ lightbox.alt }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { renderMarkdownToHtml, renderMermaidDiagramsInContainer } from '../utils/markdownRenderer';

export default {
  name: 'MarkdownViewer',
  props: {
    content: {
      type: String,
      default: ''
    },
    clampLines: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const viewerContainer = ref(null);
    const lightbox = ref({
      show: false,
      src: '',
      alt: ''
    });

    const parsedHtml = computed(() => {
      return renderMarkdownToHtml(props.content);
    });

    const refreshMermaid = async () => {
      await nextTick();
      if (viewerContainer.value) {
        await renderMermaidDiagramsInContainer(viewerContainer.value);
      }
    };

    watch(() => props.content, () => {
      refreshMermaid();
    });

    onMounted(() => {
      refreshMermaid();
      window.addEventListener('keydown', onKeyDown);
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', onKeyDown);
    });

    const onKeyDown = (e) => {
      if (e.key === 'Escape' && lightbox.value.show) {
        lightbox.value.show = false;
      }
    };

    const handleBodyClick = (e) => {
      const target = e.target;
      if (target && target.tagName === 'IMG' && target.classList.contains('note-rendered-img')) {
        lightbox.value = {
          show: true,
          src: target.src,
          alt: target.alt || ''
        };
      }
    };

    return {
      viewerContainer,
      parsedHtml,
      lightbox,
      handleBodyClick
    };
  }
};
</script>

<style scoped>
.markdown-rich-viewer {
  font-family: inherit;
  line-height: 1.65;
  color: #1e293b;
}

.markdown-content-body :deep(h1) {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-top: 1.2rem;
  margin-bottom: 0.6rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.4rem;
}

.markdown-content-body :deep(h2) {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.markdown-content-body :deep(h3) {
  font-size: 1.15rem;
  font-weight: 700;
  color: #334155;
  margin-top: 0.8rem;
  margin-bottom: 0.4rem;
}

.markdown-content-body :deep(p) {
  margin-bottom: 0.8rem;
}

.markdown-content-body :deep(blockquote) {
  border-left: 4px solid #6366f1;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  background-color: #f8fafc;
  border-radius: 0 0.5rem 0.5rem 0;
  color: #475569;
  font-style: italic;
}

.markdown-content-body :deep(code) {
  background-color: #f1f5f9;
  color: #d946ef;
  padding: 0.15rem 0.4rem;
  border-radius: 0.35rem;
  font-size: 0.88em;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  border: 1px solid #e2e8f0;
}

.markdown-content-body :deep(pre) {
  background-color: #0f172a;
  color: #f8fafc;
  padding: 1rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.markdown-content-body :deep(pre code) {
  background-color: transparent;
  color: inherit;
  padding: 0;
  border: none;
  font-size: 0.9em;
}

.markdown-content-body :deep(ul),
.markdown-content-body :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 0.8rem;
}

.markdown-content-body :deep(li) {
  margin-bottom: 0.3rem;
}

.markdown-content-body :deep(table) {
  width: 100%;
  margin: 1rem 0;
  border-collapse: collapse;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.markdown-content-body :deep(th),
.markdown-content-body :deep(td) {
  padding: 0.6rem 0.85rem;
  border: 1px solid #e2e8f0;
}

.markdown-content-body :deep(th) {
  background-color: #f8fafc;
  font-weight: 700;
}

.markdown-content-body :deep(tr:nth-child(even)) {
  background-color: #fbfcfe;
}

.markdown-content-body :deep(.note-rendered-img) {
  cursor: zoom-in;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  max-width: 100%;
}

.markdown-content-body :deep(.note-rendered-img:hover) {
  transform: scale(1.015);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}

.markdown-content-body :deep(.mermaid-block-container) {
  transition: box-shadow 0.2s ease;
}

.markdown-content-body :deep(.mermaid-block-container:hover) {
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12) !important;
}

.markdown-content-body :deep(.mermaid-diagram-viewport svg) {
  display: inline-block;
  margin: 0 auto;
}

/* Dark mode compatibility */
:global(.dark-theme) .markdown-rich-viewer {
  color: #e2e8f0;
}

:global(.dark-theme) .markdown-content-body :deep(h1),
:global(.dark-theme) .markdown-content-body :deep(h2),
:global(.dark-theme) .markdown-content-body :deep(h3) {
  color: #f8fafc;
  border-color: #334155;
}

:global(.dark-theme) .markdown-content-body :deep(blockquote) {
  background-color: #1e293b;
  color: #94a3b8;
  border-left-color: #818cf8;
}

:global(.dark-theme) .markdown-content-body :deep(code) {
  background-color: #1e293b;
  color: #f472b6;
  border-color: #334155;
}

:global(.dark-theme) .markdown-content-body :deep(table),
:global(.dark-theme) .markdown-content-body :deep(th),
:global(.dark-theme) .markdown-content-body :deep(td) {
  border-color: #334155;
}

:global(.dark-theme) .markdown-content-body :deep(th) {
  background-color: #1e293b;
  color: #f8fafc;
}

:global(.dark-theme) .markdown-content-body :deep(tr:nth-child(even)) {
  background-color: #131b2e;
}

:global(.dark-theme) .markdown-content-body :deep(.mermaid-block-container) {
  background-color: #1e293b !important;
  border-color: #334155 !important;
}
</style>
