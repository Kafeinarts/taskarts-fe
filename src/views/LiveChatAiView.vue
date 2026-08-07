<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-success text-white fw-bold px-3 py-1.5 rounded-pill">⚡ Gemini 3.6 Flash Active</span>
          <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-1.5 rounded-pill">Backend AI Engine</span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">💬 Live Chat AI Assistant</h2>
        <p class="text-muted mb-0">Asisten cerdas AI untuk konsultasi pekerjaan, optimasi kodingan, surat menyurat, hingga strategi bisnis.</p>
      </div>

      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-outline-primary rounded-pill px-3 fw-semibold text-nowrap" @click="showKeyModal = !showKeyModal">
          <i class="bi bi-key me-1"></i> {{ apiKey ? 'API Key Custom' : 'Ganti API Key' }}
        </button>
        <button class="btn btn-outline-danger rounded-pill px-3 fw-semibold text-nowrap" @click="clearChat">
          <i class="bi bi-trash me-1"></i> Bersihkan Chat
        </button>
      </div>
    </div>

    <!-- Optional Custom API Key Modal/Collapsible -->
    <div v-if="showKeyModal" class="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-light border">
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div>
          <span class="fw-bold text-dark d-block mb-1"><i class="bi bi-sliders text-primary me-1"></i> Custom Gemini API Key (Opsional)</span>
          <small class="text-muted">Layanan AI sudah otomatis aktif menggunakan Backend Engine. Anda bisa memasukkan Key sendiri jika ingin kuota pribadi.</small>
        </div>
        <div class="d-flex gap-2" style="max-width: 400px; width: 100%;">
          <input type="password" class="form-control form-control-sm" placeholder="Paste Gemini API Key khusus Anda..." v-model="quickApiKey" />
          <button class="btn btn-sm btn-primary fw-bold px-3 rounded-3 text-nowrap" @click="saveApiKey">Simpan</button>
          <button v-if="apiKey" class="btn btn-sm btn-outline-danger fw-bold rounded-3 text-nowrap" @click="resetApiKey" title="Reset ke Default Backend">Reset</button>
        </div>
      </div>
    </div>

    <!-- Main Chat Window -->
    <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden d-flex flex-column" style="min-height: 520px;">
      <!-- Chat Messages Scroll Area -->
      <div class="card-body p-4 flex-grow-1 overflow-y-auto" style="max-height: 480px;" ref="chatBox">
        <div v-if="messages.length === 0" class="text-center py-5 text-muted">
          <div class="p-3 bg-primary bg-opacity-10 text-primary rounded-circle d-inline-block mb-3">
            <i class="bi bi-robot fs-1"></i>
          </div>
          <h5 class="fw-bold text-dark mb-1">Halo! Ada yang bisa AI bantu hari ini?</h5>
          <p class="small text-muted mb-4">Pilih salah satu saran prompt cepat di bawah untuk memulai percakapan:</p>

          <div class="d-flex flex-wrap justify-content-center gap-2 max-w-2xl mx-auto">
            <button
              v-for="(preset, i) in promptPresets"
              :key="i"
              class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1.5 fw-semibold"
              @click="usePresetPrompt(preset)"
            >
              ✨ {{ preset }}
            </button>
          </div>
        </div>

        <div v-for="(msg, idx) in messages" :key="idx" class="mb-3">
          <!-- User Message -->
          <div v-if="msg.role === 'user'" class="d-flex justify-content-end mb-2">
            <div class="bg-primary text-white p-3 rounded-4 rounded-bottom-right-0 shadow-sm max-w-lg">
              <div class="fw-semibold">{{ msg.content }}</div>
              <small class="opacity-75 d-block text-end mt-1" style="font-size: 0.7rem;">{{ msg.time }}</small>
            </div>
          </div>

          <!-- Assistant Message -->
          <div v-else class="d-flex align-items-start gap-2 mb-2">
            <div class="p-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
              <i class="bi bi-robot fs-5"></i>
            </div>
            <div class="bg-light text-dark p-3 rounded-4 rounded-top-left-0 border shadow-sm max-w-xl">
              <div class="fw-bold text-primary small mb-1">RajinKerja AI</div>
              <div class="white-space-pre-line lh-base">{{ msg.content }}</div>
              <div class="d-flex justify-content-between align-items-center mt-2 border-top pt-1 text-muted" style="font-size: 0.75rem;">
                <span>{{ msg.time }}</span>
                <button class="btn btn-link btn-sm p-0 text-muted text-decoration-none" @click="copyText(msg.content)">
                  <i class="bi bi-clipboard me-1"></i> Salin Pesan
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="d-flex align-items-center gap-2 text-primary p-2">
          <div class="spinner-border spinner-border-sm" role="status"></div>
          <span class="small fw-semibold">AI sedang memikirkan jawaban...</span>
        </div>
      </div>

      <!-- Chat Input Footer -->
      <div class="card-footer bg-light border-top p-3">
        <form @submit.prevent="sendMessage" class="d-flex gap-2">
          <input
            type="text"
            class="form-control form-control-lg border-2"
            placeholder="Ketik pertanyaan atau minta bantuan AI di sini..."
            v-model="inputQuery"
            :disabled="isLoading"
          />
          <button type="submit" class="btn btn-primary btn-lg rounded-3 px-4 fw-bold shadow-sm d-flex align-items-center gap-1" :disabled="isLoading || !inputQuery.trim()">
            <i class="bi bi-send-fill"></i>
            <span class="d-none d-md-inline">Kirim</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue';
import { useStore } from 'vuex';
import { sendOnDeviceNotification } from '../utils/notification';

export default {
  name: 'LiveChatAiView',
  setup() {
    const store = useStore();

    const apiKey = computed(() => store.getters.getGeminiApiKey);
    const showKeyModal = ref(false);
    const quickApiKey = ref('');
    const inputQuery = ref('');
    const isLoading = ref(false);
    const chatBox = ref(null);

    const messages = ref([
      {
        role: 'assistant',
        content: 'Halo! Saya RajinKerja AI Assistant. Saya siap membantu Anda menyusun tugas, membuat draf email, menganalisis strategi, atau menjawab pertanyaan teknis Anda.',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    const promptPresets = [
      'Bantu saya buatkan draf email penawaran jasa freelance',
      'Bagaimana cara optimasi produktivitas kerja harian?',
      'Buatkan ringkasan struktur laporan pekerjaan mingguan',
      'Bantu analisis dan debug kodingan JavaScript Vue 3'
    ];

    const saveApiKey = () => {
      if (quickApiKey.value.trim()) {
        store.dispatch('setGeminiApiKey', quickApiKey.value.trim());
        sendOnDeviceNotification('🔑 API Key Disimpan', {
          body: 'Gemini API Key kustom Anda berhasil disimpan.',
          type: 'success'
        });
        quickApiKey.value = '';
        showKeyModal.value = false;
      }
    };

    const resetApiKey = () => {
      store.dispatch('setGeminiApiKey', '');
      sendOnDeviceNotification('🔄 Reset API Key', {
        body: 'Kembali menggunakan Backend AI Engine bawaan.',
        type: 'info'
      });
      showKeyModal.value = false;
    };

    const scrollToBottom = () => {
      nextTick(() => {
        if (chatBox.value) {
          chatBox.value.scrollTop = chatBox.value.scrollHeight;
        }
      });
    };

    const sendMessage = async () => {
      const q = inputQuery.value.trim();
      if (!q) return;

      const userTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      // Prepare context history (last 6 messages)
      const historyContext = messages.value
        .slice(-6)
        .map(m => ({ role: m.role, content: m.content }));

      messages.value.push({
        role: 'user',
        content: q,
        time: userTime
      });

      inputQuery.value = '';
      isLoading.value = true;
      scrollToBottom();

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: q,
            customApiKey: apiKey.value || undefined,
            history: historyContext
          })
        });

        const data = await response.json();

        if (response.ok && data.text) {
          messages.value.push({
            role: 'assistant',
            content: data.text,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          });
        } else {
          // Direct fallback if backend error occurs
          const activeKey = apiKey.value || 'AQ.Ab8RN6JGhPsfz7AVNneY9DU8r1YHtbKQUWmS6DyfJfgoOZX-Kg';
          const fallbackRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: q }] }]
            })
          });
          const fallbackData = await fallbackRes.json();
          const fallbackText = fallbackData?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (fallbackText) {
            messages.value.push({
              role: 'assistant',
              content: fallbackText,
              time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            });
          } else {
            throw new Error(data.error || 'Gagal memproses respon dari Gemini AI.');
          }
        }
      } catch (err) {
        console.error('Chat AI Error:', err);
        messages.value.push({
          role: 'assistant',
          content: `Maaf, terjadi masalah saat menghubungkan ke AI: ${err.message || 'Koneksi terputus'}. Silakan coba beberapa saat lagi.`,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });
      } finally {
        isLoading.value = false;
        scrollToBottom();
      }
    };

    const usePresetPrompt = (text) => {
      inputQuery.value = text;
      sendMessage();
    };

    const clearChat = () => {
      messages.value = [];
    };

    const copyText = (text) => {
      navigator.clipboard.writeText(text);
      sendOnDeviceNotification('📋 Copied', { body: 'Teks respon AI tersalin', type: 'info' });
    };

    return {
      apiKey,
      showKeyModal,
      quickApiKey,
      inputQuery,
      isLoading,
      chatBox,
      messages,
      promptPresets,
      saveApiKey,
      resetApiKey,
      sendMessage,
      usePresetPrompt,
      clearChat,
      copyText
    };
  }
};
</script>
