import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base:'https://github.com/JoseNB1207/app-individual',
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    // Esto es necesario para que funcione en Codespaces
    host: true,
    strictPort: false,
  },
})