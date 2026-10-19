import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Recharts deixa o pacote único um pouco acima de 500 kB; é aceitável para o protótipo.
    chunkSizeWarningLimit: 800,
  },
})
