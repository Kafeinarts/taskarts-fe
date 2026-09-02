<template>
  <div class="menu-tutorials-tab">
    <!-- Section Header Banner -->
    <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom gap-3">
        <div>
          <div class="d-flex align-items-center gap-2 mb-1">
            <span class="badge bg-primary text-white fw-bold px-3 py-1 rounded-pill">
              🎓 Panduan Lengkap & Tutorial Step-by-Step
            </span>
            <span class="badge bg-success-subtle text-success fw-bold px-2.5 py-1 rounded-pill small">
              {{ MENU_TUTORIALS.length }} Menu Tercover 100%
            </span>
          </div>
          <h4 class="fw-extrabold text-dark mb-1">Tutorial Penggunaan Seluruh Menu & Fitur</h4>
          <p class="text-muted small mb-0">
            Panduan mendalam langkah demi langkah, rincian tombol penting, skenario nyata, dan tips efisiensi untuk setiap menu di RajinKerja.id.
          </p>
        </div>

        <!-- Search Bar -->
        <div class="input-group style-search" style="max-width: 340px;">
          <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-primary"></i></span>
          <input
            type="text"
            class="form-control form-control-sm bg-light border-start-0"
            placeholder="Cari tutorial menu, kata kunci, fitur..."
            v-model="searchQuery"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="btn btn-sm btn-light border-start-0 text-muted" title="Hapus Pencarian">
            <i class="bi bi-x-circle-fill"></i>
          </button>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="d-flex flex-wrap gap-2 mb-3">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="btn btn-sm rounded-pill fw-bold transition-all d-flex align-items-center gap-1.5 px-3 py-1.5"
          :class="selectedCategory === cat.id ? 'btn-primary shadow-sm text-white' : 'btn-outline-secondary bg-light text-dark border-0'"
          @click="selectedCategory = cat.id"
        >
          <span>{{ cat.name }}</span>
          <span
            class="badge rounded-pill ms-1"
            :class="selectedCategory === cat.id ? 'bg-white text-primary' : 'bg-secondary text-white'"
            style="font-size: 10px;"
          >
            {{ getCategoryCount(cat.id) }}
          </span>
        </button>
      </div>

      <!-- Quick Jump Menu Pills Grid -->
      <div class="bg-light p-3 rounded-4 border">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <small class="fw-bold text-dark d-flex align-items-center gap-1">
            <i class="bi bi-lightning-charge-fill text-warning"></i> Lompat Cepat ke Menu:
          </small>
          <small class="text-muted">Klik salah satu menu untuk langsung ke tutorialnya</small>
        </div>
        <div class="d-flex flex-wrap gap-1.5">
          <button
            v-for="tut in filteredTutorials"
            :key="'jump-' + tut.id"
            @click="scrollToTutorial(tut.id)"
            class="btn btn-xs btn-white border rounded-pill text-dark fw-semibold d-inline-flex align-items-center gap-1 hover-primary py-1 px-2.5 shadow-xs"
          >
            <span>{{ tut.icon }}</span>
            <span>{{ tut.title.split('&')[0].trim() }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State if no search matches -->
    <div v-if="filteredTutorials.length === 0" class="card border-0 shadow-sm rounded-4 bg-white p-5 text-center mb-4">
      <div class="fs-1 mb-2">🔍</div>
      <h5 class="fw-bold text-dark mb-1">Tutorial Tidak Ditemukan</h5>
      <p class="text-muted small mb-3">Tidak ada menu atau panduan yang cocok dengan kata kunci "{{ searchQuery }}".</p>
      <div>
        <button @click="searchQuery = ''; selectedCategory = 'all'" class="btn btn-sm btn-primary rounded-pill px-4 fw-bold">
          Reset Filter & Tampilkan Semua
        </button>
      </div>
    </div>

    <!-- Tutorial Cards List -->
    <div class="d-flex flex-column gap-4">
      <div
        v-for="tut in filteredTutorials"
        :key="tut.id"
        :id="'tutorial-' + tut.id"
        class="card border rounded-4 shadow-sm bg-white overflow-hidden transition-all hover-border-primary"
      >
        <!-- Tutorial Card Header -->
        <div class="p-4 bg-gradient-header border-bottom d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div class="d-flex align-items-center gap-3">
            <div class="bg-white rounded-4 p-2.5 shadow-sm border d-flex align-items-center justify-content-center fs-2" style="width: 58px; height: 58px;">
              {{ tut.icon }}
            </div>
            <div>
              <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                <span class="badge bg-primary-subtle text-primary fw-bold px-2.5 py-0.5 rounded-pill small">
                  {{ tut.categoryLabel }}
                </span>
                <span class="badge bg-info-subtle text-dark fw-semibold px-2.5 py-0.5 rounded-pill small">
                  {{ tut.badge }}
                </span>
              </div>
              <h4 class="fw-extrabold text-dark mb-0">{{ tut.title }}</h4>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="d-flex flex-wrap align-items-center gap-2">
            <button
              @click="copyTutorialSummary(tut)"
              class="btn btn-sm btn-outline-secondary rounded-pill fw-semibold d-flex align-items-center gap-1.5 px-3 py-1.5"
              title="Salin Rangkuman Panduan ini ke Clipboard"
            >
              <i class="bi bi-clipboard"></i>
              <span>Salin Panduan</span>
            </button>
            <router-link
              :to="tut.route"
              class="btn btn-sm btn-primary rounded-pill fw-bold d-flex align-items-center gap-1.5 px-3.5 py-1.5 shadow-sm"
            >
              <span>Buka Menu Ini</span>
              <i class="bi bi-arrow-up-right-circle-fill"></i>
            </router-link>
          </div>
        </div>

        <div class="p-4">
          <!-- Overview & Target User Callout -->
          <div class="row g-3 mb-4">
            <div class="col-lg-8">
              <div class="p-3 bg-light rounded-3 border h-100">
                <strong class="text-dark d-flex align-items-center gap-1.5 mb-1.5 small">
                  <i class="bi bi-info-circle-fill text-primary"></i> Fungsi & Gambaran Umum Modul:
                </strong>
                <p class="text-secondary small mb-0 lh-base">
                  {{ tut.overview }}
                </p>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="p-3 bg-primary-subtle rounded-3 border border-primary-subtle h-100">
                <strong class="text-primary d-flex align-items-center gap-1.5 mb-1.5 small">
                  <i class="bi bi-person-check-fill"></i> Target Pengguna / Kebutuhan:
                </strong>
                <p class="text-dark small mb-0 lh-base">
                  {{ tut.targetUser }}
                </p>
              </div>
            </div>
          </div>

          <!-- Step-by-Step Instructions -->
          <div class="mb-4">
            <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2 fs-6">
                <span class="badge bg-dark rounded-circle px-2 py-1 small">
                  <i class="bi bi-list-ol"></i>
                </span>
                <span>Langkah demi Langkah Penggunaan (Step-by-Step Walkthrough)</span>
              </h5>
              <span class="badge bg-light text-muted border small">{{ tut.steps.length }} Tahapan Mudah</span>
            </div>

            <div class="row g-3">
              <div v-for="st in tut.steps" :key="st.stepNumber" class="col-md-6 col-xl-3">
                <div class="p-3 bg-white rounded-3 border h-100 d-flex flex-column justify-content-between shadow-xs hover-shadow transition-all step-box">
                  <div>
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <span class="badge bg-primary text-white rounded-pill px-2.5 py-1 fw-bold small">
                        Langkah {{ st.stepNumber }}
                      </span>
                      <i class="bi bi-check-circle-fill text-success fs-6"></i>
                    </div>
                    <h6 class="fw-bold text-dark mb-1.5 small">{{ st.title }}</h6>
                    <p class="text-muted small mb-2 lh-base" style="font-size: 0.85rem;">
                      {{ st.desc }}
                    </p>
                  </div>
                  <div class="p-2 bg-light rounded-2 border mt-auto">
                    <small class="text-primary font-monospace fw-bold d-block" style="font-size: 0.78rem;">
                      <i class="bi bi-cursor-fill me-1"></i>{{ st.keyAction }}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Key Features & Practical Scenario in 2 Columns -->
          <div class="row g-4 mb-4">
            <!-- Key Features & Controls -->
            <div class="col-lg-6">
              <div class="p-3.5 bg-light rounded-4 border h-100">
                <h6 class="fw-bold text-dark mb-2.5 d-flex align-items-center gap-1.5 small">
                  <i class="bi bi-sliders text-success fs-6"></i> Fitur Kunci & Parameter Utama:
                </h6>
                <div class="d-flex flex-column gap-2">
                  <div v-for="(kf, kidx) in tut.keyFeatures" :key="kidx" class="p-2.5 bg-white rounded-3 border small">
                    <strong class="text-dark d-block mb-0.5">{{ kf.name }}</strong>
                    <span class="text-secondary" style="font-size: 0.84rem;">{{ kf.detail }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Practical Real-World Scenario -->
            <div class="col-lg-6">
              <div class="p-3.5 bg-light rounded-4 border h-100 d-flex flex-column">
                <h6 class="fw-bold text-dark mb-2.5 d-flex align-items-center gap-1.5 small">
                  <i class="bi bi-briefcase-fill text-warning fs-6"></i> Contoh Skenario Penggunaan Nyata:
                </h6>
                <div class="p-3 bg-white rounded-3 border mb-3 flex-grow-1">
                  <div class="small text-muted mb-2">
                    <strong class="text-danger d-block mb-1"><i class="bi bi-flag-fill me-1"></i>Situasi Kerja:</strong>
                    {{ tut.practicalScenario.context }}
                  </div>
                  <div class="small text-dark pt-2 border-top">
                    <strong class="text-success d-block mb-1"><i class="bi bi-check2-all me-1"></i>Solusi & Alur Tindakan:</strong>
                    {{ tut.practicalScenario.solution }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pro Tips & Mini FAQ -->
          <div class="row g-3">
            <!-- Pro Tips -->
            <div class="col-lg-6">
              <div class="p-3 bg-warning-subtle rounded-3 border border-warning-subtle h-100">
                <strong class="text-dark d-flex align-items-center gap-1.5 mb-2 small">
                  <i class="bi bi-stars text-warning fs-6"></i> Pintasan Cepat & Pro Tips:
                </strong>
                <ul class="small text-dark mb-0 ps-3 lh-base">
                  <li v-for="(tip, tidx) in tut.proTips" :key="tidx" class="mb-1">{{ tip }}</li>
                </ul>
              </div>
            </div>

            <!-- Mini FAQ -->
            <div class="col-lg-6">
              <div class="p-3 bg-info-subtle rounded-3 border border-info-subtle h-100">
                <strong class="text-dark d-flex align-items-center gap-1.5 mb-1.5 small">
                  <i class="bi bi-question-circle-fill text-info fs-6"></i> FAQ Khusus Modul:
                </strong>
                <div class="small text-dark mb-1">
                  <strong>Q: {{ tut.faq.q }}</strong>
                </div>
                <div class="small text-secondary lh-base">
                  <strong>A:</strong> {{ tut.faq.a }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { MENU_CATEGORIES, MENU_TUTORIALS } from '../data/menuTutorials';
import { sendOnDeviceNotification } from '../utils/notification';

export default {
  name: 'MenuTutorialsTab',
  setup() {
    const selectedCategory = ref('all');
    const searchQuery = ref('');
    const categories = ref(MENU_CATEGORIES);

    const getCategoryCount = (catId) => {
      if (catId === 'all') return MENU_TUTORIALS.length;
      return MENU_TUTORIALS.filter(t => t.category === catId).length;
    };

    const filteredTutorials = computed(() => {
      let list = MENU_TUTORIALS;

      if (selectedCategory.value !== 'all') {
        list = list.filter(t => t.category === selectedCategory.value);
      }

      if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        list = list.filter(t =>
          t.title.toLowerCase().includes(q) ||
          t.overview.toLowerCase().includes(q) ||
          t.badge.toLowerCase().includes(q) ||
          t.categoryLabel.toLowerCase().includes(q) ||
          t.targetUser.toLowerCase().includes(q) ||
          t.steps.some(s => s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.keyAction.toLowerCase().includes(q)) ||
          t.keyFeatures.some(k => k.name.toLowerCase().includes(q) || k.detail.toLowerCase().includes(q)) ||
          t.practicalScenario.context.toLowerCase().includes(q) ||
          t.practicalScenario.solution.toLowerCase().includes(q) ||
          t.proTips.some(tip => tip.toLowerCase().includes(q))
        );
      }

      return list;
    });

    const scrollToTutorial = (id) => {
      const el = document.getElementById('tutorial-' + id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const copyTutorialSummary = (tut) => {
      const stepsText = tut.steps.map(s => `Langkah ${s.stepNumber}. ${s.title}: ${s.desc}`).join('\n');
      const text = `📖 PANDUAN PENGGUNAAN: ${tut.title.toUpperCase()}\n\nFungsi: ${tut.overview}\nTarget: ${tut.targetUser}\n\nLANGKAH KERJA:\n${stepsText}\n\nPRO TIPS:\n- ${tut.proTips.join('\n- ')}\n\n(RajinKerja.id Work Suite)`;
      
      navigator.clipboard.writeText(text);
      sendOnDeviceNotification(`📋 Panduan ${tut.title.split('&')[0]} Disalin!`, {
        body: 'Rangkuman langkah kerja telah tersimpan di clipboard Anda.',
        type: 'success'
      });
    };

    return {
      selectedCategory,
      searchQuery,
      categories,
      MENU_TUTORIALS,
      getCategoryCount,
      filteredTutorials,
      scrollToTutorial,
      copyTutorialSummary
    };
  }
};
</script>

<style scoped>
.style-search {
  border-radius: 20px;
  overflow: hidden;
}
.btn-xs {
  font-size: 11px;
}
.btn-white {
  background-color: #ffffff;
}
.hover-primary:hover {
  background-color: #e0e7ff !important;
  color: #4338ca !important;
  border-color: #a5b4fc !important;
}
.hover-border-primary:hover {
  border-color: #6366f1 !important;
}
.bg-gradient-header {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}
.step-box {
  border-top: 3px solid #6366f1 !important;
}
.shadow-xs {
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.hover-shadow:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06) !important;
}
</style>
