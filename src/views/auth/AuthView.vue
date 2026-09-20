<template>
  <div class="breeze-auth" :class="themeMode">
    <div class="breeze-card card border-0 shadow-sm">
      <div class="card-body p-4">
        <!-- Logo -->
        <div class="text-center mb-3">
          <img src="/logo.svg" alt="TaskArts" class="mb-2" style="width: 40px; height: 40px;" />
          <h5 class="fw-bold mb-0" :class="themeMode === 'dark' || themeMode === 'oled' ? 'text-white' : 'text-dark'">
            Task<span :style="{ color: accentColor }">Arts</span>
          </h5>
        </div>

        <!-- Error / Success -->
        <div v-if="error" class="alert alert-danger py-1.5 px-2 small rounded-3 mb-2">{{ error }}</div>
        <div v-if="successMsg" class="alert alert-success py-1.5 px-2 small rounded-3 mb-2">{{ successMsg }}</div>

        <!-- ===== FORGOT PASSWORD ===== -->
        <form v-if="showForgot" @submit.prevent="handleForgot">
          <p class="small mb-2" :class="themeMode === 'dark' || themeMode === 'oled' ? 'text-light' : 'text-dark'">
            Masukkan email kamu. Kami akan atur ulang password-nya.
          </p>
          <div class="mb-3">
            <input v-model="forgotEmail" type="email" class="form-control breeze-input" placeholder="name@example.com" required autocomplete="email" />
          </div>
          <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold rounded-3" :disabled="loading" :style="{ backgroundColor: accentColor, borderColor: accentColor }">
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>{{ loading ? 'Mengirim...' : 'Atur Ulang Password' }}
          </button>
          <p class="text-center small mt-3 mb-0" :class="themeMode === 'dark' || themeMode === 'oled' ? 'text-secondary' : 'text-muted'">
            <a href="#" class="fw-semibold text-decoration-none" :style="{ color: accentColor }" @click.prevent="showForgot = false; clearMessages()">Kembali ke Masuk</a>
          </p>
        </form>

        <!-- ===== LOGIN ===== -->
        <form v-else-if="isLogin" @submit.prevent="handleLogin">
          <div class="mb-2">
            <label class="form-label fw-medium small mb-1" :class="themeMode === 'dark' || themeMode === 'oled' ? 'text-light' : 'text-dark'">Email</label>
            <input v-model="loginForm.email" type="email" class="form-control breeze-input" placeholder="name@example.com" required autocomplete="email" />
          </div>
          <div class="mb-2">
            <label class="form-label fw-medium small mb-1" :class="themeMode === 'dark' || themeMode === 'oled' ? 'text-light' : 'text-dark'">Password</label>
            <input v-model="loginForm.password" type="password" class="form-control breeze-input" placeholder="Password" required autocomplete="current-password" />
          </div>
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="form-check mb-0">
              <input class="form-check-input" type="checkbox" id="remember" v-model="rememberMe" />
              <label class="form-check-label small" for="remember" :class="themeMode === 'dark' || themeMode === 'oled' ? 'text-light' : 'text-dark'">Ingat saya</label>
            </div>
            <a href="#" class="small text-decoration-none fw-medium" :style="{ color: accentColor }" @click.prevent="showForgot = true; clearMessages()">Lupa?</a>
          </div>
          <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold rounded-3" :disabled="loading" :style="{ backgroundColor: accentColor, borderColor: accentColor }">
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>{{ loading ? 'Masuk...' : 'Masuk' }}
          </button>
        </form>

        <!-- ===== REGISTER ===== -->
        <form v-else @submit.prevent="handleRegister">
          <div class="mb-2">
            <label class="form-label fw-medium small mb-1" :class="themeMode === 'dark' || themeMode === 'oled' ? 'text-light' : 'text-dark'">Nama</label>
            <input v-model="registerForm.name" type="text" class="form-control breeze-input" placeholder="Nama lengkap" required autocomplete="name" />
          </div>
          <div class="mb-2">
            <label class="form-label fw-medium small mb-1" :class="themeMode === 'dark' || themeMode === 'oled' ? 'text-light' : 'text-dark'">Email</label>
            <input v-model="registerForm.email" type="email" class="form-control breeze-input" placeholder="name@example.com" required autocomplete="email" />
          </div>
          <div class="mb-2">
            <label class="form-label fw-medium small mb-1" :class="themeMode === 'dark' || themeMode === 'oled' ? 'text-light' : 'text-dark'">Password</label>
            <input v-model="registerForm.password" type="password" class="form-control breeze-input" placeholder="Min. 8 karakter" required minlength="8" autocomplete="new-password" />
          </div>
          <div class="mb-3">
            <label class="form-label fw-medium small mb-1" :class="themeMode === 'dark' || themeMode === 'oled' ? 'text-light' : 'text-dark'">Ulangi Password</label>
            <input v-model="registerForm.password_confirmation" type="password" class="form-control breeze-input" placeholder="Ulangi password" required autocomplete="new-password" />
          </div>
          <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold rounded-3" :disabled="loading" :style="{ backgroundColor: accentColor, borderColor: accentColor }">
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>{{ loading ? 'Mendaftar...' : 'Daftar' }}
          </button>
        </form>

        <!-- Toggle -->
        <p v-if="!showForgot" class="text-center small mt-3 mb-0" :class="themeMode === 'dark' || themeMode === 'oled' ? 'text-secondary' : 'text-muted'">
          {{ isLogin ? 'Belum punya akun?' : 'Sudah punya akun?' }}
          <a href="#" class="fw-semibold text-decoration-none" :style="{ color: accentColor }" @click.prevent="isLogin = !isLogin; clearMessages()">
            {{ isLogin ? 'Daftar' : 'Masuk' }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import api from '@/boot/axios';

export default {
  name: 'AuthView',
  data() {
    return {
      isLogin: true,
      showForgot: false,
      loading: false,
      error: '',
      successMsg: '',
      rememberMe: false,
      forgotEmail: '',
      loginForm: { email: '', password: '' },
      registerForm: { name: '', email: '', password: '', password_confirmation: '' },
    };
  },
  computed: {
    ...mapState(['themeMode', 'accentColor']),
  },
  methods: {
    ...mapActions(['login', 'register']),
    clearMessages() { this.error = ''; this.successMsg = ''; },

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

    async handleForgot() {
      this.loading = true;
      this.error = '';
      this.successMsg = '';
      try {
        await api.post('/auth/forgot-password', { email: this.forgotEmail });
        this.successMsg = 'Password berhasil direset! Password baru: secret123';
        setTimeout(() => {
          this.loginForm.email = this.forgotEmail;
          this.showForgot = false;
          this.successMsg = '';
        }, 3000);
      } catch (e) {
        this.error = e.response?.data?.message || 'Gagal mengirim reset.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.breeze-auth {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: #f8fafc;
  z-index: 9999;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.breeze-auth.dark, .breeze-auth.oled {
  background-color: #0f172a;
}

.breeze-card {
  border-radius: 0.75rem;
  background: #ffffff;
  width: 100%;
  max-width: 380px;
  margin: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  animation: cardIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.breeze-auth.dark .breeze-card,
.breeze-auth.oled .breeze-card {
  background: #1e293b;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.15);
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.breeze-input {
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  border-color: #e2e8f0;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.breeze-input:focus {
  border-color: var(--primary-color, #2563eb);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
.breeze-auth.dark .breeze-input,
.breeze-auth.oled .breeze-input {
  background-color: #0f172a;
  border-color: #334155;
  color: #e2e8f0;
}
.breeze-auth.dark .breeze-input:focus,
.breeze-auth.oled .breeze-input:focus {
  background-color: #0c1322;
}

.form-label { margin-bottom: 0.25rem; }

.form-check-input:checked {
  background-color: var(--primary-color, #2563eb);
  border-color: var(--primary-color, #2563eb);
}

.btn-primary {
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.15s, transform 0.1s;
}
.btn-primary:hover:not(:disabled) { transform: translateY(-1px); }
.btn-primary:active:not(:disabled) { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.6; }
</style>
