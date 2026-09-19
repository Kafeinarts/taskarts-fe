<template>
  <div class="container-fluid py-4 main-view-viewport">
    <!-- Header -->
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h4 class="fw-bold mb-1 text-app">
          <i class="bi bi-gear-wide-connected me-2 text-primary"></i>Pengaturan Fitur
        </h4>
        <p class="text-muted small mb-0">Aktifkan/nonaktifkan menu untuk seluruh user. Menu yang nonaktif akan tersembunyi di sidebar.</p>
      </div>
      <button
        class="btn btn-primary btn-sm px-3 rounded-3 fw-semibold"
        @click="saveAll"
        :disabled="saving"
      >
        <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
        {{ saving ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </div>

    <!-- Alert -->
    <div v-if="alertMsg" :class="['alert', alertType === 'success' ? 'alert-success' : 'alert-danger', 'py-2 rounded-3 mb-3']">
      {{ alertMsg }}
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- Feature Groups -->
    <div v-else>
      <div v-for="(group, groupName) in groupedFeatures" :key="groupName" class="mb-3">
        <h6 class="fw-bold text-muted text-uppercase small mb-2 px-2 d-flex align-items-center justify-content-between">
          <span><i class="bi bi-folder2 me-1"></i>{{ groupName }}</span>
          <span class="badge bg-light text-muted border rounded-pill" style="font-size: 0.65rem;">{{ group.length }}</span>
        </h6>
        <div class="card border-0 shadow-sm rounded-4">
          <div class="list-group list-group-flush">
            <div
              v-for="feature in group"
              :key="feature.key"
              class="list-group-item d-flex align-items-center justify-content-between py-2.5 px-3 border-bottom"
              :class="{ 'bg-light': !feature.is_enabled }"
            >
              <div class="d-flex align-items-center gap-3 flex-grow-1">
                <div class="form-check form-switch mb-0">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="'feature-' + feature.key"
                    :checked="feature.is_enabled === 1"
                    @change="toggleFeature(feature)"
                    :style="feature.is_enabled ? { backgroundColor: accentColor, borderColor: accentColor } : {}"
                  />
                </div>
                <div class="lh-1">
                  <label class="form-check-label fw-semibold text-app mb-0 small" :for="'feature-' + feature.key">
                    {{ feature.label }}
                  </label>
                  <div v-if="feature.description" class="text-muted" style="font-size: 0.72rem;">
                    {{ feature.description }}
                  </div>
                </div>
              </div>
              <span
                class="badge rounded-pill px-2"
                :class="feature.is_enabled ? 'bg-success' : 'bg-secondary'"
                style="font-size: 0.6rem;"
              >
                {{ feature.is_enabled ? 'ON' : 'OFF' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center text-muted small mt-2">
        {{ enabledCount }} dari {{ features.length }} fitur aktif
      </div>
    </div>

    <!-- Link to Tambah Akun -->
    <div class="mt-4 text-center" v-if="!loading">
      <router-link to="/register-user" class="btn btn-outline-primary rounded-pill fw-semibold px-4">
        <i class="bi bi-person-plus me-1"></i>Tambah Akun Baru
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/boot/axios';

export default {
  name: 'FeatureSettingsView',
  data() {
    return {
      features: [],
      loading: true,
      saving: false,
      alertMsg: '',
      alertType: 'success',
    };
  },
  computed: {
    ...mapState(['accentColor']),
    groupedFeatures() {
      const groups = {};
      for (const f of this.features) {
        if (!groups[f.group_name]) groups[f.group_name] = [];
        groups[f.group_name].push(f);
      }
      return groups;
    },
    enabledCount() {
      return this.features.filter(f => f.is_enabled === 1).length;
    },
  },
  methods: {
    async fetchFeatures() {
      this.loading = true;
      try {
        const { data } = await api.get('/features');
        this.features = data.data || [];
      } catch (e) {
        this.showAlert('Gagal memuat data fitur.', 'error');
      } finally {
        this.loading = false;
      }
    },
    toggleFeature(feature) {
      feature.is_enabled = feature.is_enabled ? 0 : 1;
    },
    async saveAll() {
      this.saving = true;
      this.alertMsg = '';
      try {
        const { data } = await api.post('/features/sync', {
          features: this.features.map(f => ({ key: f.key, is_enabled: f.is_enabled })),
        });
        if (data.success) {
          this.features = data.data || [];
          this.$store.dispatch('fetchFeatures');
          this.showAlert('Fitur berhasil disimpan! Sidebar akan diperbarui.', 'success');
        } else {
          this.showAlert('Gagal menyimpan.', 'error');
        }
      } catch (e) {
        this.showAlert('Terjadi kesalahan.', 'error');
      } finally {
        this.saving = false;
      }
    },
    showAlert(msg, type) {
      this.alertMsg = msg;
      this.alertType = type;
      setTimeout(() => { this.alertMsg = ''; }, 3000);
    },
  },
  mounted() {
    this.fetchFeatures();
  },
};
</script>
