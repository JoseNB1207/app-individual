import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Home from './home'
import Equipo from './equipo'
import Favoritos from './favoritos'
import Original from './original'
import Informativa from './informativa'
import Usuario from './usuario'

import './App.css'

function App() {
  return (
    <>
      <Router>
        <nav className="c-menu">

  
          <Link to="/">
   
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Home"
            />
            <p>Home</p>
          </Link>


          <Link to="/favoritos">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/heart-scale.png"
              alt="Favoritos"
            />
            <p>Favoritos</p>
          </Link>


          <Link to="/original">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
              alt="Juego"
            />
            <p>Juego</p>
          </Link>


          <Link to="/informativa">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pokedex.png"
              alt="Info"
            />
            <p>Info</p>
          </Link>


          <Link to="/usuario">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png"
              alt="Usuario"
            />
            <p>Usuario</p>
          </Link>
        </nav>


        <Routes>

          <Route path="/" element={<Home />} />


          <Route path="/favoritos" element={<Favoritos />} />

          <Route path="/original" element={<Original />} />


          <Route path="/informativa" element={<Informativa />} />


          <Route path="/usuario" element={<Usuario />} />


          <Route path="/equipo/:nombre" element={<Equipo />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
