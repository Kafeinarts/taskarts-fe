<template>
  <div class="container-fluid py-4 main-view-viewport">
    <!-- Header -->
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h4 class="fw-bold mb-1 text-app">
          <i class="bi bi-gear-wide-connected me-2 text-primary"></i>Pengaturan Fitur
        </h4>
        <p class="text-muted small mb-0">Atur fitur global, per role, atau per user.</p>
      </div>
      <button class="btn btn-primary btn-sm px-3 rounded-3 fw-semibold" @click="saveAll" :disabled="saving">
        <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
        {{ saving ? 'Menyimpan...' : 'Simpan Semua' }}
      </button>
    </div>

    <!-- Alert -->
    <div v-if="alertMsg" :class="['alert', alertType === 'success' ? 'alert-success' : 'alert-danger', 'py-2 rounded-3 mb-3']">
      {{ alertMsg }}
    </div>

    <!-- Tabs -->
    <ul class="nav nav-pills mb-4 gap-2">
      <li class="nav-item">
        <button class="nav-link rounded-pill fw-semibold small px-3" :class="{ active: activeTab === 'global' }" @click="activeTab = 'global'">
          <i class="bi bi-globe me-1"></i>Global
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link rounded-pill fw-semibold small px-3" :class="{ active: activeTab === 'role' }" @click="activeTab = 'role'">
          <i class="bi bi-people me-1"></i>Per Role
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link rounded-pill fw-semibold small px-3" :class="{ active: activeTab === 'user' }" @click="activeTab = 'user'">
          <i class="bi bi-person me-1"></i>Per User
        </button>
      </li>
    </ul>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- ========== GLOBAL TAB ========== -->
    <div v-if="!loading && activeTab === 'global'">
      <div class="row g-3">
        <div v-for="(group, groupName) in groupedFeatures" :key="groupName" class="col-md-6 col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-header bg-white border-bottom-0 pt-3 pb-0 px-3 d-flex align-items-center justify-content-between">
              <h6 class="fw-bold text-app mb-0"><i :class="groupIcon(groupName)" class="me-1"></i>{{ groupName }}</h6>
              <span class="badge bg-light text-muted border rounded-pill" style="font-size: 0.6rem;">{{ groupOnCount(group) }}/{{ group.length }}</span>
            </div>
            <div class="card-body px-3 py-2">
              <div v-for="feature in group" :key="feature.key" class="d-flex align-items-center justify-content-between py-1.5 border-bottom" :class="{ 'opacity-50': !feature.is_enabled }">
                <div class="d-flex align-items-center gap-2 flex-grow-1">
                  <div class="form-check form-switch mb-0">
                    <input class="form-check-input" type="checkbox" :id="'gf-' + feature.key" :checked="feature.is_enabled === 1" @change="toggleFeature(feature)" :style="feature.is_enabled ? { backgroundColor: accentColor, borderColor: accentColor } : {}" />
                  </div>
                  <label class="form-check-label fw-medium text-app mb-0" style="font-size: 0.8rem;" :for="'gf-' + feature.key">{{ feature.label }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center text-muted small mt-3">{{ enabledCount }} dari {{ features.length }} fitur global aktif</div>
    </div>

    <!-- ========== ROLE TAB ========== -->
    <div v-if="!loading && activeTab === 'role'">
      <div class="row g-4">
        <div class="col-lg-3">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-header bg-white border-bottom-0 pt-3 pb-2 px-3"><h6 class="fw-bold text-app mb-0"><i class="bi bi-person-badge me-1"></i>Role</h6></div>
            <div class="list-group list-group-flush">
              <button v-for="r in roles" :key="r.value" class="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-2.5 px-3 border-0" :class="{ 'active bg-primary text-white': selectedRole === r.value }" @click="selectRole(r.value)">
                <span class="fw-medium small">{{ r.label }}</span>
                <span class="badge rounded-pill" :class="selectedRole === r.value ? 'bg-white text-primary' : 'bg-light text-muted'" style="font-size: 0.6rem;">{{ roleFeatureCount(r.value) }}</span>
              </button>
            </div>
          </div>
        </div>
        <div class="col-lg-9">
          <div v-if="!selectedRole" class="text-center py-5 text-muted"><p class="mt-2 small">Pilih role di sebelah kiri.</p></div>
          <div v-else>
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h5 class="fw-bold text-app mb-0">Fitur: <span class="text-primary">{{ roleLabel(selectedRole) }}</span></h5>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary rounded-pill" @click="selectAllRole">Pilih Semua</button>
                <button class="btn btn-sm btn-outline-secondary rounded-pill" @click="deselectAllRole">Batal Semua</button>
              </div>
            </div>
            <div class="row g-3">
              <div v-for="(group, groupName) in groupedFeatures" :key="groupName" class="col-md-6">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                  <div class="card-header bg-white border-bottom-0 pt-3 pb-0 px-3"><h6 class="fw-bold text-app mb-0" style="font-size: 0.82rem;"><i :class="groupIcon(groupName)" class="me-1"></i>{{ groupName }}</h6></div>
                  <div class="card-body px-3 py-2">
                    <div v-for="feature in group" :key="feature.key" class="d-flex align-items-center justify-content-between py-1 border-bottom">
                      <div class="d-flex align-items-center gap-2 flex-grow-1">
                        <div class="form-check form-switch mb-0"><input class="form-check-input" type="checkbox" :id="'rf-' + feature.key" :checked="roleFeatures[feature.key]" @change="toggleRoleFeature(feature.key)" :style="roleFeatures[feature.key] ? { backgroundColor: accentColor, borderColor: accentColor } : {}" /></div>
                        <label class="form-check-label fw-medium text-app mb-0" style="font-size: 0.78rem;" :for="'rf-' + feature.key">{{ feature.label }}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== USER TAB ========== -->
    <div v-if="!loading && activeTab === 'user'">
      <div class="row g-4">
        <!-- User selector -->
        <div class="col-lg-3">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-header bg-white border-bottom-0 pt-3 pb-2 px-3"><h6 class="fw-bold text-app mb-0"><i class="bi bi-person me-1"></i>User</h6></div>
            <div class="list-group list-group-flush" style="max-height: 60vh; overflow-y: auto;">
              <button v-for="u in users" :key="u.id" class="list-group-item list-group-item-action d-flex align-items-center gap-2 py-2 px-3 border-0" :class="{ 'active bg-primary text-white': selectedUserId === u.id }" @click="selectUser(u)">
                <div class="avatar-kafeinarts" style="width: 28px; height: 28px; font-size: 0.65rem;"><span>{{ (u.name || 'U').charAt(0) }}</span></div>
                <div class="lh-1 overflow-hidden flex-grow-1">
                  <div class="fw-medium small text-truncate">{{ u.name }}</div>
                  <small class="text-muted" style="font-size: 0.62rem;" :class="{ 'text-white-50': selectedUserId === u.id }">{{ roleLabel(u.role) }}</small>
                </div>
              </button>
              <div v-if="users.length === 0" class="text-center text-muted small py-3">Tidak ada user</div>
            </div>
          </div>
        </div>
        <!-- Feature toggles for selected user -->
        <div class="col-lg-9">
          <div v-if="!selectedUserId" class="text-center py-5 text-muted"><p class="mt-2 small">Pilih user di sebelah kiri.</p></div>
          <div v-else>
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h5 class="fw-bold text-app mb-0">Fitur: <span class="text-primary">{{ selectedUserName }}</span> <small class="text-muted fw-normal">({{ roleLabel(selectedUserRole) }})</small></h5>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary rounded-pill" @click="selectAllUser">Pilih Semua</button>
                <button class="btn btn-sm btn-outline-secondary rounded-pill" @click="deselectAllUser">Batal Semua</button>
                <button class="btn btn-sm btn-outline-danger rounded-pill" @click="clearUserFeatures" title="Hapus custom → ikut role/global"><i class="bi bi-trash"></i></button>
              </div>
            </div>
            <div class="row g-3">
              <div v-for="(group, groupName) in groupedFeatures" :key="groupName" class="col-md-6">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                  <div class="card-header bg-white border-bottom-0 pt-3 pb-0 px-3"><h6 class="fw-bold text-app mb-0" style="font-size: 0.82rem;"><i :class="groupIcon(groupName)" class="me-1"></i>{{ groupName }}</h6></div>
                  <div class="card-body px-3 py-2">
                    <div v-for="feature in group" :key="feature.key" class="d-flex align-items-center justify-content-between py-1 border-bottom">
                      <div class="d-flex align-items-center gap-2 flex-grow-1">
                        <div class="form-check form-switch mb-0"><input class="form-check-input" type="checkbox" :id="'uf-' + feature.key" :checked="userFeatures[feature.key]" @change="toggleUserFeature(feature.key)" :style="userFeatures[feature.key] ? { backgroundColor: accentColor, borderColor: accentColor } : {}" /></div>
                        <label class="form-check-label fw-medium text-app mb-0" style="font-size: 0.78rem;" :for="'uf-' + feature.key">{{ feature.label }}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      activeTab: 'global',
      // Role tab
      selectedRole: null,
      roleFeaturesData: {},
      roleFeatures: {},
      // User tab
      users: [],
      selectedUserId: null,
      selectedUserName: '',
      selectedUserRole: '',
      userFeaturesData: {},
      userFeatures: {},
      userFeaturesDirty: false,
      roles: [
        { value: 'admin', label: 'Admin' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'finance', label: 'Finance' },
        { value: 'pic', label: 'PIC' },
        { value: 'employee', label: 'Employee' },
        { value: 'member', label: 'Member' },
        { value: 'internship', label: 'Internship' },
      ],
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
      }
      try {
        const { data } = await api.get('/features/roles');
        const raw = data.data || [];
        this.roleFeaturesData = {};
        for (const item of raw) {
          if (!this.roleFeaturesData[item.role]) this.roleFeaturesData[item.role] = {};
          this.roleFeaturesData[item.role][item.feature_key] = item.is_enabled;
        }
      } catch (e) { /* ignore */ }
      try {
        const { data } = await api.get('/auth/users');
        this.users = data.data || [];
      } catch (e) { /* ignore */ }
      this.loading = false;
    },
    // --- Global ---
    toggleFeature(feature) { feature.is_enabled = feature.is_enabled ? 0 : 1; },
    groupOnCount(group) { return group.filter(f => f.is_enabled === 1).length; },
    groupIcon(name) {
      const map = { 'WORKSPACE & PROYEK': 'bi-grid-1x2-fill', 'TIM & KOMUNIKASI': 'bi-people-fill', 'KEUANGAN & DATA': 'bi-wallet2', 'AGENDA & PRODUKTIVITAS': 'bi-calendar-check-fill', 'SISTEM & PANDUAN': 'bi-gear-fill' };
      return map[name] || 'bi-folder-fill';
    },
    // --- Role tab ---
    selectRole(role) {
      this.selectedRole = role;
      this.roleFeatures = {};
      const featMap = this.roleFeaturesData[role] || {};
      this.features.forEach(f => { this.roleFeatures[f.key] = !!featMap[f.key]; });
    },
    toggleRoleFeature(key) {
      this.roleFeatures[key] = !this.roleFeatures[key];
      if (!this.roleFeaturesData[this.selectedRole]) this.roleFeaturesData[this.selectedRole] = {};
      this.roleFeaturesData[this.selectedRole][key] = this.roleFeatures[key];
    },
    selectAllRole() { this.features.forEach(f => { this.roleFeatures[f.key] = true; if (!this.roleFeaturesData[this.selectedRole]) this.roleFeaturesData[this.selectedRole] = {}; this.roleFeaturesData[this.selectedRole][f.key] = true; }); },
    deselectAllRole() { this.features.forEach(f => { this.roleFeatures[f.key] = false; if (!this.roleFeaturesData[this.selectedRole]) this.roleFeaturesData[this.selectedRole] = {}; this.roleFeaturesData[this.selectedRole][f.key] = false; }); },
    roleFeatureCount(role) { return Object.values(this.roleFeaturesData[role] || {}).filter(v => v).length; },
    roleLabel(role) { return this.roles.find(r => r.value === role)?.label || role; },
    // --- User tab ---
    async selectUser(user) {
      this.selectedUserId = user.id;
      this.selectedUserName = user.name;
      this.selectedUserRole = user.role;
      this.userFeatures = {};
      this.userFeaturesDirty = false;
      try {
        const { data } = await api.get(`/features/user/${user.id}`);
        const feats = data.data || [];
        for (const f of feats) {
          this.userFeatures[f.key] = f.is_custom ? !!f.is_enabled : null;
        }
      } catch (e) {
        this.features.forEach(f => { this.userFeatures[f.key] = null; });
      }
    },
    toggleUserFeature(key) {
      this.userFeatures[key] = this.userFeatures[key] === true ? false : true;
      this.userFeaturesDirty = true;
    },
    selectAllUser() { this.features.forEach(f => { this.userFeatures[f.key] = true; }); this.userFeaturesDirty = true; },
    deselectAllUser() { this.features.forEach(f => { this.userFeatures[f.key] = false; }); this.userFeaturesDirty = true; },
    clearUserFeatures() { this.features.forEach(f => { this.userFeatures[f.key] = null; }); this.userFeaturesDirty = true; },
    // --- Save ---
    async saveAll() {
      this.saving = true;
      this.alertMsg = '';
      try {
        // 1. Save global features
        const { data: globalRes } = await api.post('/features/sync', {
          features: this.features.map(f => ({ key: f.key, is_enabled: f.is_enabled })),
        });
        if (globalRes.success) this.features = globalRes.data || [];

        // 2. Save role features
        const roleItems = [];
        for (const [role, featMap] of Object.entries(this.roleFeaturesData)) {
          for (const [key, val] of Object.entries(featMap)) {
            roleItems.push({ role, feature_key: key, is_enabled: !!val });
          }
        }
        if (roleItems.length > 0) {
          await api.post('/features/roles/sync', { items: roleItems });
        }

        // 3. Save user features (only dirty ones)
        if (this.userFeaturesDirty && this.selectedUserId) {
          const userItems = [];
          for (const [key, val] of Object.entries(this.userFeatures)) {
            if (val !== null) {
              userItems.push({ key, is_enabled: val ? 1 : 0 });
            }
          }
          if (userItems.length > 0) {
            await api.post(`/features/user/${this.selectedUserId}/sync`, { features: userItems });
          }
        }

        this.$store.dispatch('fetchFeatures');
        this.showAlert('Semua pengaturan fitur berhasil disimpan!', 'success');
        this.userFeaturesDirty = false;
      } catch (e) {
        this.showAlert(e.response?.data?.message || 'Terjadi kesalahan saat menyimpan.', 'error');
      } finally {
        this.saving = false;
      }
    },
    showAlert(msg, type) { this.alertMsg = msg; this.alertType = type; setTimeout(() => { this.alertMsg = ''; }, 4000); },
  },
  mounted() { this.fetchFeatures(); },
};
</script>
