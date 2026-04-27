// App.tsx
// Este es el componente principal de la aplicación.
// Aquí definimos:
//   - El enrutador (BrowserRouter) que maneja la navegación entre páginas
//   - La barra de navegación fija (nav)
//   - Las rutas (Routes/Route) que conectan URLs con componentes
// La estructura es idéntica al proyecto original del ejemplo de clase.

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'

// Importamos todas las páginas/vistas de la aplicación
import Home from './home'
import Equipo from './equipo'
import Favoritos from './favoritos'
import Original from './original'
import Informativa from './informativa'
import Usuario from './usuario'

import './App.css'

function App() {
  return (
    // Fragment vacío para no agregar divs innecesarios al DOM
    <>
      {/* BrowserRouter envuelve todo para que React Router funcione */}
      <Router>
        {/* Barra de navegación inferior, estilo app móvil */}
        <nav className="c-menu">

          {/* Link a Home - lista de Pokémon */}
          <Link to="/">
            {/* Ícono de Pokéball */}
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Home"
            />
            <p>Home</p>
          </Link>

          {/* Link a Favoritos - Pokémon guardados */}
          <Link to="/favoritos">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/heart-scale.png"
              alt="Favoritos"
            />
            <p>Favoritos</p>
          </Link>

          {/* Link al juego de adivinar Pokémon */}
          <Link to="/original">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
              alt="Juego"
            />
            <p>Juego</p>
          </Link>

          {/* Link a la sección informativa */}
          <Link to="/informativa">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pokedex.png"
              alt="Info"
            />
            <p>Info</p>
          </Link>

          {/* Link al perfil del usuario */}
          <Link to="/usuario">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png"
              alt="Usuario"
            />
            <p>Usuario</p>
          </Link>
        </nav>

        {/* Aquí se renderizan los componentes según la URL actual */}
        {/* Cada Route tiene un path (URL) y un element (componente a mostrar) */}
        <Routes>
          {/* Ruta principal - muestra la lista de Pokémon */}
          <Route path="/" element={<Home />} />

          {/* Ruta de favoritos */}
          <Route path="/favoritos" element={<Favoritos />} />

          {/* Ruta del juego de adivinar */}
          <Route path="/original" element={<Original />} />

          {/* Ruta de información sobre Pokémon */}
          <Route path="/informativa" element={<Informativa />} />

          {/* Ruta del perfil del usuario */}
          <Route path="/usuario" element={<Usuario />} />

          {/* Ruta de detalle de un Pokémon - :nombre es un parámetro dinámico */}
          {/* Por ejemplo: /equipo/pikachu carga los datos de pikachu */}
          <Route path="/equipo/:nombre" element={<Equipo />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
