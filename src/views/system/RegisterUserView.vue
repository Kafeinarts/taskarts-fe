<template>
  <div class="container-fluid py-4 main-view-viewport">
    <div class="row g-4">
      <div :class="activePanel !== 'list' ? 'col-lg-7' : 'col-lg-10 mx-auto'">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h4 class="fw-bold mb-1 text-app">
              <i class="bi bi-people-fill me-2 text-primary"></i>Kelola Akun
            </h4>
            <p class="text-muted small mb-0">Daftar, lihat detail, edit, atau hapus akun user.</p>
          </div>
          <button class="btn btn-primary btn-sm px-3 rounded-3 fw-semibold" @click="openWizard" v-if="activePanel === 'list'">
            <i class="bi bi-plus-circle me-1"></i>Tambah Akun
          </button>
          <button v-else class="btn btn-sm btn-outline-secondary rounded-3 px-3 fw-semibold" @click="goBack">
            <i class="bi bi-arrow-left me-1"></i>Kembali
          </button>
        </div>

        <!-- Alert -->
        <div v-if="alertMsg" :class="['alert', alertType === 'success' ? 'alert-success' : 'alert-danger', 'py-2 rounded-3 mb-3']">
          {{ alertMsg }}
        </div>

        <!-- ========== LIST PANEL ========== -->
        <div v-if="activePanel === 'list'">
          <div v-if="loadingUsers" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else-if="users.length === 0" class="text-center py-5 text-muted">
            <i class="bi bi-people" style="font-size: 3rem;"></i>
            <p class="mt-2">Belum ada user terdaftar.</p>
          </div>
          <div v-else>
            <div v-for="user in users" :key="user.id" class="card border-0 shadow-sm rounded-3 mb-2">
              <div class="card-body py-2.5 px-3 d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-3 flex-grow-1" style="cursor: pointer;" @click="viewDetail(user.id)">
                  <div class="avatar-kafeinarts" style="width: 40px; height: 40px;">
                    <span style="font-size: 0.85rem;">{{ getUserInitial(user.name) }}</span>
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-semibold text-app small">{{ user.name }}</div>
                    <div class="text-muted" style="font-size: 0.72rem;">{{ user.email }}</div>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="badge rounded-pill" :class="roleBadgeClass(user.role)">{{ roleLabel(user.role) }}</span>
                  <div class="dropdown">
                    <button class="btn btn-sm btn-ghost p-1" data-bs-toggle="dropdown">
                      <i class="bi bi-three-dots-vertical text-muted"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end rounded-3 shadow-sm border-0 py-1" style="min-width: 160px;">
                      <li><button class="dropdown-item small py-1.5" @click="viewDetail(user.id)"><i class="bi bi-eye me-2 text-primary"></i>Detail</button></li>
                      <li><button class="dropdown-item small py-1.5" @click="openEdit(user.id)"><i class="bi bi-pencil me-2 text-warning"></i>Edit</button></li>
                      <li><hr class="dropdown-divider my-1"></li>
                      <li><button class="dropdown-item small py-1.5 text-danger" @click="confirmDelete(user)" :disabled="user.id === currentUserId"><i class="bi bi-trash me-2"></i>Hapus</button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ========== DETAIL PANEL ========== -->
        <div v-if="activePanel === 'detail' && detailUser">
          <div class="card border-0 shadow-sm rounded-4 mb-3">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="avatar-kafeinarts" style="width: 56px; height: 56px;">
                  <span style="font-size: 1.2rem;">{{ getUserInitial(detailUser.name) }}</span>
                </div>
                <div>
                  <h5 class="fw-bold text-app mb-0">{{ detailUser.name }}</h5>
                  <span class="text-muted">{{ detailUser.email }}</span>
                </div>
              </div>
              <div class="row g-3">
                <div class="col-sm-4">
                  <div class="bg-light rounded-3 p-2.5 text-center">
                    <small class="text-muted d-block" style="font-size: 0.68rem;">ROLE</small>
                    <span class="badge rounded-pill" :class="roleBadgeClass(detailUser.role)">{{ roleLabel(detailUser.role) }}</span>
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="bg-light rounded-3 p-2.5 text-center">
                    <small class="text-muted d-block" style="font-size: 0.68rem;">ID</small>
                    <span class="fw-semibold text-app small">#{{ detailUser.id }}</span>
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="bg-light rounded-3 p-2.5 text-center">
                    <small class="text-muted d-block" style="font-size: 0.68rem;">TERDAFTAR</small>
                    <span class="fw-semibold text-app small">{{ formatDate(detailUser.created_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- User Features -->
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-header bg-white border-bottom-0 pt-3 pb-0 px-4">
              <h6 class="fw-bold text-app mb-0"><i class="bi bi-puzzle-fill me-2 text-primary"></i>Fitur Aktif</h6>
            </div>
            <div class="card-body px-4 pb-3 pt-2">
              <div v-if="detailFeatures.length === 0" class="text-muted small py-2">
                Tidak ada fitur khusus (menggunakan pengaturan global).
              </div>
              <div v-else class="d-flex flex-wrap gap-1.5">
                <span v-for="fk in detailFeatures" :key="fk" class="badge bg-success rounded-pill px-2 py-1" style="font-size: 0.7rem;">
                  {{ fk }}
                </span>
              </div>
            </div>
          </div>

          <div class="d-flex gap-2 mt-3">
            <button class="btn btn-outline-warning rounded-3 fw-semibold flex-fill" @click="openEdit(detailUser.id)">
              <i class="bi bi-pencil me-1"></i>Edit
            </button>
            <button class="btn btn-outline-danger rounded-3 fw-semibold flex-fill" @click="confirmDelete(detailUser)" :disabled="detailUser.id === currentUserId">
              <i class="bi bi-trash me-1"></i>Hapus
            </button>
          </div>
        </div>

        <!-- ========== EDIT PANEL ========== -->
        <div v-if="activePanel === 'edit'">
          <div class="card border-0 shadow-lg rounded-4">
            <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
              <h5 class="fw-bold text-app mb-0">
                <i class="bi bi-pencil-square me-2 text-warning"></i>Edit User
              </h5>
              <small class="text-muted">Perbarui data & fitur user.</small>
            </div>
            <div class="card-body px-4 py-3">
              <div v-if="editLoading" class="text-center py-4"><div class="spinner-border text-primary"></div></div>
              <div v-else>
                <div class="mb-2">
                  <label class="form-label fw-semibold small">Nama</label>
                  <input type="text" class="form-control form-control-sm rounded-3" v-model="editForm.name" />
                </div>
                <div class="mb-2">
                  <label class="form-label fw-semibold small">Email</label>
                  <input type="email" class="form-control form-control-sm rounded-3" v-model="editForm.email" />
                </div>
                <div class="mb-2">
                  <label class="form-label fw-semibold small">Role</label>
                  <select class="form-select form-select-sm rounded-3" v-model="editForm.role">
                    <option v-for="r in roles" :key="r.value" :value="r.value">{{ r.label }}</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold small">Password Baru <span class="text-muted fw-normal">(kosongkan jika tidak diubah)</span></label>
                  <input type="password" class="form-control form-control-sm rounded-3" v-model="editForm.password" placeholder="Min 8 karakter" />
                </div>

                <h6 class="fw-bold text-app small mb-2">Fitur</h6>
                <div class="d-flex gap-2 mb-2">
                  <button class="btn btn-sm btn-outline-primary rounded-pill" @click="selectAllEdit">Pilih Semua</button>
                  <button class="btn btn-sm btn-outline-secondary rounded-pill" @click="deselectAllEdit">Batal Semua</button>
                </div>
                <div class="overflow-auto mb-3" style="max-height: 30vh;">
                  <div v-for="(group, groupName) in editGroupedFeatures" :key="groupName" class="mb-2">
                    <h6 class="fw-bold text-muted text-uppercase small mb-1">{{ groupName }}</h6>
                    <div v-for="f in group" :key="f.key" class="d-flex align-items-center justify-content-between bg-light rounded-3 px-3 py-1.5 mb-1">
                      <div class="d-flex align-items-center gap-2">
                        <input class="form-check-input" type="checkbox" :id="'edit-' + f.key" v-model="editFeatures[f.key]" />
                        <label class="form-check-label fw-medium small mb-0" :for="'edit-' + f.key">{{ f.label }}</label>
                      </div>
                      <span class="badge rounded-pill" :class="editFeatures[f.key] ? 'bg-success' : 'bg-secondary'" style="font-size: 0.6rem;">
                        {{ editFeatures[f.key] ? 'ON' : 'OFF' }}
                      </span>
                    </div>
                  </div>
                </div>

                <button class="btn btn-primary w-100 rounded-3 fw-semibold" @click="submitEdit" :disabled="editSubmitting">
                  <span v-if="editSubmitting" class="spinner-border spinner-border-sm me-1"></span>
                  {{ editSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ========== WIZARD PANEL (Tambah Akun) ========== -->
        <transition name="slide-right">
          <div v-if="activePanel === 'wizard'">
            <div class="card border-0 shadow-lg rounded-4">
              <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex align-items-center justify-content-between">
                <div>
                  <h5 class="fw-bold text-app mb-0">
                    <i class="bi bi-person-plus-fill me-2 text-primary"></i>Daftarkan Akun
                  </h5>
                  <small class="text-muted">Isi data & pilih fitur untuk user baru.</small>
                </div>
                <button class="btn btn-sm btn-ghost text-muted" @click="goBack"><i class="bi bi-x-lg"></i></button>
              </div>

              <!-- Step Indicator -->
              <div class="px-4 pt-3">
                <div class="d-flex align-items-center gap-2">
                  <div v-for="s in 3" :key="s" class="flex-fill">
                    <div class="rounded-pill py-1 text-center fw-bold small"
                      :class="wizardStep >= s ? 'bg-primary text-white' : 'bg-light text-muted'">{{ s }}</div>
                  </div>
                </div>
                <div class="d-flex justify-content-between px-1 mt-1 mb-2">
                  <small class="text-muted">Data Akun</small>
                  <small class="text-muted">Pilih Fitur</small>
                  <small class="text-muted">Selesai</small>
                </div>
              </div>

              <div class="card-body px-4 py-3">
                <div v-if="wizardAlert" :class="['alert', wizardAlertType === 'success' ? 'alert-success' : 'alert-danger', 'py-2 small mb-3']">
                  {{ wizardAlert }}
                </div>

                <!-- Step 1 -->
                <div v-if="wizardStep === 1">
                  <div class="d-flex gap-2 mb-3">
                    <button class="btn btn-sm rounded-pill fw-semibold flex-fill" :class="wizardMode === 'single' ? 'btn-primary' : 'btn-outline-primary'" @click="wizardMode = 'single'">
                      <i class="bi bi-person me-1"></i>Satu Akun
                    </button>
                    <button class="btn btn-sm rounded-pill fw-semibold flex-fill" :class="wizardMode === 'bulk' ? 'btn-primary' : 'btn-outline-primary'" @click="wizardMode = 'bulk'">
                      <i class="bi bi-people me-1"></i>Banyak Akun
                    </button>
                  </div>
                  <div v-if="wizardMode === 'single'">
                    <div class="mb-2"><label class="form-label fw-semibold small">Nama</label><input type="text" class="form-control form-control-sm rounded-3" v-model="wizardForm.name" placeholder="Nama lengkap" /></div>
                    <div class="mb-2"><label class="form-label fw-semibold small">Email</label><input type="email" class="form-control form-control-sm rounded-3" v-model="wizardForm.email" placeholder="user@email.com" /></div>
                    <div class="row g-2 mb-2">
                      <div class="col-6"><label class="form-label fw-semibold small">Password</label><input type="password" class="form-control form-control-sm rounded-3" v-model="wizardForm.password" placeholder="Min 8 karakter" /></div>
                      <div class="col-6"><label class="form-label fw-semibold small">Ulangi</label><input type="password" class="form-control form-control-sm rounded-3" v-model="wizardForm.password_confirmation" placeholder="Ulangi password" /></div>
                    </div>
                    <div class="mb-3"><label class="form-label fw-semibold small">Role</label>
                      <select class="form-select form-select-sm rounded-3" v-model="wizardForm.role">
                        <option v-for="r in roles" :key="r.value" :value="r.value">{{ r.label }}</option>
                      </select>
                    </div>
                  </div>
                  <div v-else>
                    <p class="text-muted small mb-2">Tambahkan beberapa akun sekaligus. Role berlaku untuk semua.</p>
                    <div class="mb-2"><label class="form-label fw-semibold small">Role (untuk semua)</label>
                      <select class="form-select form-select-sm rounded-3" v-model="wizardBulkRole">
                        <option v-for="r in roles" :key="r.value" :value="r.value">{{ r.label }}</option>
                      </select>
                    </div>
                    <div v-for="(acc, idx) in wizardBulkAccounts" :key="idx" class="card bg-light border-0 rounded-3 p-2 mb-2">
                      <div class="d-flex align-items-start gap-2">
                        <span class="badge bg-primary text-white rounded-circle mt-1" style="min-width: 22px;">{{ idx + 1 }}</span>
                        <div class="flex-grow-1">
                          <div class="row g-1">
                            <div class="col-12"><input type="text" class="form-control form-control-sm rounded-3" v-model="acc.name" placeholder="Nama" /></div>
                            <div class="col-6"><input type="email" class="form-control form-control-sm rounded-3" v-model="acc.email" placeholder="Email" /></div>
                            <div class="col-6"><input type="password" class="form-control form-control-sm rounded-3" v-model="acc.password" placeholder="Password (min 8)" /></div>
                          </div>
                        </div>
                        <button v-if="wizardBulkAccounts.length > 1" class="btn btn-sm btn-ghost text-danger p-0" @click="removeBulkAccount(idx)"><i class="bi bi-trash"></i></button>
                      </div>
                    </div>
                    <button class="btn btn-sm btn-outline-primary border border-2 border-dashed rounded-3 w-100 py-2 text-primary fw-semibold" @click="addBulkAccount">
                      <i class="bi bi-plus-circle me-1"></i>Tambah Akun
                    </button>
                  </div>
                  <button class="btn btn-primary w-100 rounded-3 fw-semibold mt-3" @click="wizardStep2" :disabled="!canProceedStep1">Selanjutnya <i class="bi bi-arrow-right ms-1"></i></button>
                </div>

                <!-- Step 2 -->
                <div v-if="wizardStep === 2">
                  <p class="text-muted small mb-2">Pilih fitur yang diaktifkan.</p>
                  <div class="d-flex gap-2 mb-2">
                    <button class="btn btn-sm btn-outline-primary rounded-pill" @click="selectAllWizard">Pilih Semua</button>
                    <button class="btn btn-sm btn-outline-secondary rounded-pill" @click="deselectAllWizard">Batal Semua</button>
                  </div>
                  <div class="overflow-auto" style="max-height: 40vh;">
                    <div v-for="(group, groupName) in editGroupedFeatures" :key="groupName" class="mb-2">
                      <h6 class="fw-bold text-muted text-uppercase small mb-1">{{ groupName }}</h6>
                      <div v-for="f in group" :key="f.key" class="d-flex align-items-center justify-content-between bg-light rounded-3 px-3 py-1.5 mb-1">
                        <div class="d-flex align-items-center gap-2">
                          <input class="form-check-input" type="checkbox" :id="'wiz-' + f.key" v-model="wizardFeatures[f.key]" />
                          <label class="form-check-label fw-medium small mb-0" :for="'wiz-' + f.key">{{ f.label }}</label>
                        </div>
                        <span class="badge rounded-pill" :class="wizardFeatures[f.key] ? 'bg-success' : 'bg-secondary'" style="font-size: 0.6rem;">
                          {{ wizardFeatures[f.key] ? 'ON' : 'OFF' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-outline-secondary flex-fill rounded-3 fw-semibold" @click="wizardStep = 1"><i class="bi bi-arrow-left me-1"></i>Kembali</button>
                    <button class="btn btn-primary flex-fill rounded-3 fw-semibold" @click="wizardSubmit" :disabled="wizardSubmitting">
                      <span v-if="wizardSubmitting" class="spinner-border spinner-border-sm me-1"></span>{{ wizardSubmitting ? 'Mendaftarkan...' : 'Daftarkan' }}
                    </button>
                  </div>
                </div>

                <!-- Step 3 -->
                <div v-if="wizardStep === 3" class="text-center py-4">
                  <i class="bi bi-check-circle-fill text-success mb-3 d-block" style="font-size: 3.5rem;"></i>
                  <h5 class="fw-bold text-success mb-2">Berhasil!</h5>
                  <p class="text-muted small mb-3" v-if="wizardMode === 'single'">User <strong>{{ wizardForm.name }}</strong> telah didaftarkan.</p>
                  <p class="text-muted small mb-3" v-else><strong>{{ wizardBulkAccounts.length }}</strong> akun berhasil didaftarkan.</p>
                  <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-outline-secondary rounded-3 fw-semibold px-3" @click="goBack">Tutup</button>
                    <button class="btn btn-primary rounded-3 fw-semibold px-3" @click="resetWizard"><i class="bi bi-plus-circle me-1"></i>Tambah Lagi</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteUserModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content rounded-4 border-0 shadow">
          <div class="modal-body text-center py-4">
            <i class="bi bi-exclamation-triangle-fill text-danger mb-2 d-block" style="font-size: 2.5rem;"></i>
            <h6 class="fw-bold">Hapus User?</h6>
            <p class="text-muted small mb-0" v-if="deleteTarget">{{ deleteTarget.name }} akan dihapus permanen.</p>
          </div>
          <div class="modal-footer border-0 justify-content-center pb-3 gap-2">
            <button type="button" class="btn btn-sm btn-secondary rounded-3 px-3 fw-semibold" data-bs-dismiss="modal">Batal</button>
            <button type="button" class="btn btn-sm btn-danger rounded-3 px-3 fw-semibold" @click="submitDelete" :disabled="deleteLoading">
              <span v-if="deleteLoading" class="spinner-border spinner-border-sm me-1"></span>Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/boot/axios';

let bsModal = null;

export default {
  name: 'RegisterUserView',
  data() {
    return {
      users: [],
      allFeatures: [],
      loadingUsers: true,
      alertMsg: '',
      alertType: 'success',
      activePanel: 'list',
      roles: [
        { value: 'admin', label: 'Admin' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'finance', label: 'Finance' },
        { value: 'pic', label: 'PIC' },
        { value: 'employee', label: 'Employee' },
        { value: 'member', label: 'Member' },
        { value: 'internship', label: 'Internship' },
      ],
      // Detail
      detailUser: null,
      detailFeatures: [],
      // Edit
      editUserId: null,
      editForm: { name: '', email: '', role: 'member', password: '' },
      editFeatures: {},
      editLoading: false,
      editSubmitting: false,
      // Wizard
      wizardStep: 1,
      wizardMode: 'single',
      wizardForm: { name: '', email: '', password: '', password_confirmation: '', role: 'member' },
      wizardBulkRole: 'member',
      wizardBulkAccounts: [{ name: '', email: '', password: '' }],
      wizardFeatures: {},
      wizardSubmitting: false,
      wizardAlert: '',
      wizardAlertType: 'success',
      // Delete
      deleteTarget: null,
      deleteLoading: false,
    };
  },
  computed: {
    ...mapState({ currentUserId: state => state.auth.user?.id }),
    editGroupedFeatures() {
      const groups = {};
      for (const f of this.allFeatures) {
        if (!groups[f.group_name]) groups[f.group_name] = [];
        groups[f.group_name].push(f);
      }
      return groups;
    },
    canProceedStep1() {
      if (this.wizardMode === 'single') {
        return this.wizardForm.name && this.wizardForm.email && this.wizardForm.password.length >= 8;
      }
      return this.wizardBulkAccounts.some(a => a.name && a.email && a.password.length >= 8);
    },
  },
  methods: {
    // --- Data fetching ---
    async fetchUsers() {
      this.loadingUsers = true;
      try {
        const { data } = await api.get('/auth/users');
        this.users = data.data || [];
      } catch (e) {
        this.users = [];
      } finally {
        this.loadingUsers = false;
      }
    },
    async fetchFeatures() {
      try {
        const { data } = await api.get('/features');
        this.allFeatures = data.data || [];
        const keys = this.allFeatures.map(f => f.key);
        this.wizardFeatures = {};
        this.editFeatures = {};
        keys.forEach(k => {
          this.wizardFeatures[k] = true;
          this.editFeatures[k] = false;
        });
      } catch (e) { /* ignore */ }
    },
    // --- Helpers ---
    getUserInitial(name) { return (name || 'U').charAt(0).toUpperCase(); },
    roleLabel(role) {
      return this.roles.find(r => r.value === role)?.label || role;
    },
    roleBadgeClass(role) {
      const map = { admin: 'bg-primary', supervisor: 'bg-info text-dark', finance: 'bg-success', pic: 'bg-warning text-dark', employee: 'bg-secondary', member: 'bg-light text-dark border', internship: 'bg-purple text-white' };
      return map[role] || 'bg-secondary';
    },
    formatDate(d) { return d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'; },
    showAlert(msg, type) { this.alertMsg = msg; this.alertType = type; setTimeout(() => { this.alertMsg = ''; }, 3000); },
    goBack() { this.activePanel = 'list'; this.fetchUsers(); },
    // --- Detail ---
    async viewDetail(id) {
      this.activePanel = 'detail';
      this.detailUser = null;
      this.detailFeatures = [];
      try {
        const { data } = await api.get(`/auth/users/${id}`);
        this.detailUser = data.data.user;
        const feats = data.data.features || {};
        this.detailFeatures = Object.entries(feats).filter(([, v]) => v === 1 || v === '1').map(([k]) => k);
      } catch (e) {
        this.showAlert('Gagal memuat detail user.', 'error');
        this.goBack();
      }
    },
    // --- Edit ---
    async openEdit(id) {
      this.activePanel = 'edit';
      this.editUserId = id;
      this.editLoading = true;
      this.editForm = { name: '', email: '', role: 'member', password: '' };
      this.allFeatures.forEach(f => { this.editFeatures[f.key] = false; });
      try {
        const { data } = await api.get(`/auth/users/${id}`);
        const user = data.data.user;
        const feats = data.data.features || {};
        this.editForm = { name: user.name, email: user.email, role: user.role, password: '' };
        Object.entries(feats).forEach(([k, v]) => { this.editFeatures[k] = v === 1 || v === '1'; });
      } catch (e) {
        this.showAlert('Gagal memuat data user.', 'error');
        this.goBack();
      } finally {
        this.editLoading = false;
      }
    },
    selectAllEdit() { this.allFeatures.forEach(f => { this.editFeatures[f.key] = true; }); },
    deselectAllEdit() { this.allFeatures.forEach(f => { this.editFeatures[f.key] = false; }); },
    async submitEdit() {
      this.editSubmitting = true;
      try {
        const payload = { name: this.editForm.name, email: this.editForm.email, role: this.editForm.role };
        if (this.editForm.password) payload.password = this.editForm.password;
        await api.put(`/auth/users/${this.editUserId}`, payload);
        const featureList = Object.entries(this.editFeatures).map(([key, enabled]) => ({ key, is_enabled: enabled ? 1 : 0 }));
        await api.put(`/auth/users/${this.editUserId}/features`, { features: featureList });
        this.showAlert('User berhasil diperbarui!', 'success');
        this.goBack();
      } catch (e) {
        this.showAlert(e.response?.data?.message || 'Gagal update user.', 'error');
      } finally {
        this.editSubmitting = false;
      }
    },
    // --- Wizard ---
    openWizard() { this.activePanel = 'wizard'; this.resetWizard(); },
    resetWizard() {
      this.wizardStep = 1;
      this.wizardForm = { name: '', email: '', password: '', password_confirmation: '', role: 'member' };
      this.wizardBulkRole = 'member';
      this.wizardBulkAccounts = [{ name: '', email: '', password: '' }];
      this.wizardAlert = '';
      this.allFeatures.forEach(f => { this.wizardFeatures[f.key] = f.is_enabled === 1; });
    },
    addBulkAccount() { this.wizardBulkAccounts.push({ name: '', email: '', password: '' }); },
    removeBulkAccount(idx) { this.wizardBulkAccounts.splice(idx, 1); },
    wizardStep2() {
      this.wizardAlert = '';
      if (this.wizardMode === 'single') {
        if (this.wizardForm.password !== this.wizardForm.password_confirmation) { this.wizardAlert = 'Password tidak cocok.'; this.wizardAlertType = 'error'; return; }
        if (this.wizardForm.password.length < 8) { this.wizardAlert = 'Password minimal 8 karakter.'; this.wizardAlertType = 'error'; return; }
      } else {
        if (this.wizardBulkAccounts.find(a => a.password.length < 8)) { this.wizardAlert = 'Semua password minimal 8 karakter.'; this.wizardAlertType = 'error'; return; }
      }
      this.wizardStep = 2;
    },
    selectAllWizard() { this.allFeatures.forEach(f => { this.wizardFeatures[f.key] = true; }); },
    deselectAllWizard() { this.allFeatures.forEach(f => { this.wizardFeatures[f.key] = false; }); },
    async wizardSubmit() {
      this.wizardSubmitting = true;
      this.wizardAlert = '';
      try {
        const featureList = Object.entries(this.wizardFeatures).map(([key, enabled]) => ({ key, is_enabled: enabled ? 1 : 0 }));
        if (this.wizardMode === 'single') {
          await api.post('/auth/register-features', {
            name: this.wizardForm.name, email: this.wizardForm.email,
            password: this.wizardForm.password, password_confirmation: this.wizardForm.password,
            role: this.wizardForm.role, features: featureList,
          });
        } else {
          for (const acc of this.wizardBulkAccounts) {
            if (!acc.name || !acc.email || acc.password.length < 8) continue;
            await api.post('/auth/register-features', {
              name: acc.name, email: acc.email,
              password: acc.password, password_confirmation: acc.password,
              role: this.wizardBulkRole, features: featureList,
            });
          }
        }
        this.wizardStep = 3;
      } catch (e) {
        this.wizardAlert = e.response?.data?.message || 'Gagal mendaftarkan user.';
        this.wizardAlertType = 'error';
      } finally {
        this.wizardSubmitting = false;
      }
    },
    // --- Delete ---
    confirmDelete(user) {
      if (user.id === this.currentUserId) return;
      this.deleteTarget = user;
      if (!bsModal) {
        const el = document.getElementById('deleteUserModal');
        if (el && window.bootstrap?.Modal) bsModal = new window.bootstrap.Modal(el);
      }
      bsModal?.show();
    },
    async submitDelete() {
      if (!this.deleteTarget) return;
      this.deleteLoading = true;
      try {
        await api.delete(`/auth/users/${this.deleteTarget.id}`);
        bsModal?.hide();
        this.showAlert(`${this.deleteTarget.name} berhasil dihapus.`, 'success');
        this.deleteTarget = null;
        this.fetchUsers();
        if (this.activePanel !== 'list') this.goBack();
      } catch (e) {
        this.showAlert(e.response?.data?.message || 'Gagal menghapus user.', 'error');
      } finally {
        this.deleteLoading = false;
      }
    },
  },
  mounted() {
    this.fetchUsers();
    this.fetchFeatures();
  },
};
</script>

<style scoped>
.slide-right-enter-active, .slide-right-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-right-enter-from { opacity: 0; transform: translateX(30px); }
.slide-right-leave-to { opacity: 0; transform: translateX(30px); }
.bg-purple { background-color: #7c3aed !important; }
</style>
