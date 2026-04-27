import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    // Esto es necesario para que funcione en Codespaces
    host: true,
    strictPort: false,
  },
  base: './', // Rutas relativas para que funcione en el proxy de Codespaces
})