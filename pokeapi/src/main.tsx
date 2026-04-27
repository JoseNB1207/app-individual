// main.tsx
// Este es el punto de entrada de toda la aplicación React.
// Aquí se monta el componente raíz (App) dentro del elemento HTML con id="root".
// StrictMode nos ayuda a detectar problemas durante el desarrollo.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// createRoot toma el elemento del DOM y lo convierte en el contenedor de React.
// Esto es la forma moderna de montar aplicaciones React (React 18+).
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
