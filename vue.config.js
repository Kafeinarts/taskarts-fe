const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: '/',
  transpileDependencies: false,
  devServer: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: 'all',
    proxy: {
      '/api/v1': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      devServer.app.post('/api/chat', require('express').json(), async (req, res) => {
        try {
          const { message, customApiKey, history } = req.body || {};
          const apiKey = (customApiKey && customApiKey.trim()) || process.env.GEMINI_API_KEY || 'AQ.Ab8RN6JGhPsfz7AVNneY9DU8r1YHtbKQUWmS6DyfJfgoOZX-Kg';

          if (!message) {
            return res.status(400).json({ error: 'Pesan pertanyaan tidak boleh kosong' });
          }

          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({
            apiKey: apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build'
              }
            }
          });

          let contents = message;
          if (history && Array.isArray(history) && history.length > 0) {
            contents = history.map(h => ({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.content }]
            }));
            contents.push({
              role: 'user',
              parts: [{ text: message }]
            });
          }

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: contents,
            config: {
              systemInstruction: 'Anda adalah RajinKerja AI Assistant, asisten produktivitas kerja karyawan & profesional Indonesia. Jawab secara ramah, ringkas, terstruktur (gunakan poin/bold jika perlu), dan cerdas dalam Bahasa Indonesia.'
            }
          });

          res.json({ text: response.text || 'Maaf, AI tidak dapat menghasilkan respon.' });
        } catch (error) {
          console.error('Gemini API Error:', error);
          res.status(500).json({ error: error.message || 'Terjadi kesalahan pada layanan AI' });
        }
      });

      return middlewares;
    }
  }
})
