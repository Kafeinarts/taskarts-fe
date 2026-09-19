<template>
  <div class="auth-page d-flex align-items-center justify-content-center min-vh-100" :class="themeMode">
    <div class="auth-card card shadow-lg border-0 rounded-4" style="max-width: 440px; width: 100%;">
      <div class="card-body p-4 p-md-5">
        <!-- Logo & Brand -->
        <div class="text-center mb-4">
          <img src="/logo.svg" alt="TaskArts" class="mb-3" style="width: 56px; height: 56px;" />
          <h2 class="fw-bold mb-1" :class="themeMode === 'dark' || themeMode === 'oled' ? 'text-white' : 'text-dark'">
            Task<span :style="{ color: accentColor }">Arts</span>
          </h2>
          <p class="text-muted small mb-0">{{ isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru' }}</p>
        </div>

        <!-- Tab Toggle -->
        <div class="d-flex mb-4 bg-light rounded-3 p-1" :class="themeMode === 'dark' || themeMode === 'oled' ? 'bg-dark-secondary' : ''">
          <button
            class="btn flex-fill py-2 fw-semibold rounded-3"
            :class="isLogin ? 'btn-primary text-white' : 'btn-link text-muted'"
            @click="isLogin = true; clearError()"
          >Masuk</button>
          <button
            class="btn flex-fill py-2 fw-semibold rounded-3"
            :class="!isLogin ? 'btn-primary text-white' : 'btn-link text-muted'"
            @click="isLogin = false; clearError()"
          >Daftar</button>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger py-2 px-3 small rounded-3 mb-3">
          {{ error }}
        </div>

        <!-- Login Form -->
        <form v-if="isLogin" @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label fw-medium small text-muted">Email</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 rounded-start-3"><i class="bi bi-envelope"></i></span>
              <input
                v-model="loginForm.email"
                type="email"
                class="form-control border-start-0 rounded-end-3"
                placeholder="email@contoh.com"
                required
                autocomplete="email"
              />
            </div>
          </div>
          <div class="mb-4">
            <label class="form-label fw-medium small text-muted">Password</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 rounded-start-3"><i class="bi bi-lock"></i></span>
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control border-start-0 rounded-end-3"
                placeholder="Masukkan password"
                required
                autocomplete="current-password"
              />
              <button type="button" class="btn btn-outline-secondary border-start-0 rounded-end-3" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>
          <button type="submit" class="btn btn-primary w-100 py-2.5 fw-semibold rounded-3" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Masuk...' : 'Masuk' }}
          </button>
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister">
          <div class="mb-3">
            <label class="form-label fw-medium small text-muted">Nama Lengkap</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 rounded-start-3"><i class="bi bi-person"></i></span>
              <input
                v-model="registerForm.name"
                type="text"
                class="form-control border-start-0 rounded-end-3"
                placeholder="Nama Anda"
                required
                autocomplete="name"
              />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label fw-medium small text-muted">Email</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 rounded-start-3"><i class="bi bi-envelope"></i></span>
              <input
                v-model="registerForm.email"
                type="email"
                class="form-control border-start-0 rounded-end-3"
                placeholder="email@contoh.com"
                required
                autocomplete="email"
              />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label fw-medium small text-muted">Password</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 rounded-start-3"><i class="bi bi-lock"></i></span>
              <input
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control border-start-0 rounded-end-3"
                placeholder="Min. 8 karakter"
                required
                minlength="8"
                autocomplete="new-password"
              />
              <button type="button" class="btn btn-outline-secondary border-start-0 rounded-end-3" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>
          <div class="mb-4">
            <label class="form-label fw-medium small text-muted">Konfirmasi Password</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 rounded-start-3"><i class="bi bi-lock-fill"></i></span>
              <input
                v-model="registerForm.password_confirmation"
                :type="showPassword ? 'text' : 'password'"
                class="form-control border-start-0 rounded-end-3"
                placeholder="Ulangi password"
                required
                autocomplete="new-password"
              />
            </div>
          </div>
          <button type="submit" class="btn btn-primary w-100 py-2.5 fw-semibold rounded-3" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Mendaftar...' : 'Daftar' }}
          </button>
        </form>

        <!-- Footer -->
        <p class="text-center text-muted small mt-4 mb-0">
          {{ isLogin ? 'Belum punya akun?' : 'Sudah punya akun?' }}
          <a href="#" class="text-primary fw-semibold text-decoration-none" @click.prevent="isLogin = !isLogin; clearError()">
            {{ isLogin ? 'Daftar sekarang' : 'Masuk di sini' }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AuthView',
  data() {
    return {
      isLogin: true,
      showPassword: false,
      loading: false,
      error: '',
      loginForm: {
        email: '',
        password: '',
      },
      registerForm: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
    };
  },
  computed: {
    ...mapState(['themeMode', 'accentColor']),
  },
  methods: {
    ...mapActions(['login', 'register']),
    clearError() {
      this.error = '';
    },
    async handleLogin() {
      this.loading = true;
      this.error = '';
      try {
        await this.login(this.loginForm);
        this.$router.push('/');
      } catch (e) {
        this.error = e.response?.data?.message || e.message || 'Email atau password salah.';
      } finally {
        this.loading = false;
      }
    },
    async handleRegister() {
      this.loading = true;
      this.error = '';
      if (this.registerForm.password !== this.registerForm.password_confirmation) {
        this.error = 'Password dan konfirmasi tidak cocok.';
        this.loading = false;
        return;
      }
      try {
        await this.register(this.registerForm);
        this.$router.push('/');
      } catch (e) {
        this.error = e.response?.data?.message || e.message || 'Gagal mendaftar.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.auth-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 9999;
  overflow-y: auto;
}
.auth-page.dark, .auth-page.oled {
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
}
.auth-card {
  backdrop-filter: blur(16px);
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(255,255,255,0.18);
}
.auth-page.dark .auth-card, .auth-page.oled .auth-card {
  background: rgba(22,27,50,0.92);
  border: 1px solid rgba(255,255,255,0.08);
}
.bg-dark-secondary {
  background-color: #1e1e2e !important;
}
.input-group-text {
  border-color: #dee2e6;
  background-color: #f8f9fa;
}
.auth-page.dark .input-group-text,
.auth-page.oled .input-group-text {
  background-color: #1a1f36;
  border-color: #2a2f45;
  color: #94a3b8;
}
.auth-page.dark .form-control,
.auth-page.oled .form-control {
  background-color: #1a1f36;
  border-color: #2a2f45;
  color: #e2e8f0;
}
.form-control:focus {
  border-color: var(--primary-color, #2563eb);
  box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.15);
}
.btn-primary {
  background: var(--primary-color, #2563eb);
  border-color: var(--primary-color, #2563eb);
}
.btn-primary:hover {
  background: color-mix(in srgb, var(--primary-color, #2563eb) 85%, black);
  border-color: color-mix(in srgb, var(--primary-color, #2563eb) 85%, black);
}
.auth-page.dark .btn-link,
.auth-page.oled .btn-link {
  color: #94a3b8 !important;
}
.auth-page.dark .text-muted,
.auth-page.oled .text-muted {
  color: #64748b !important;
}
</style>