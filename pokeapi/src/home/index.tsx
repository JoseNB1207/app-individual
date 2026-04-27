// home/index.tsx
// Esta es la pantalla principal de la aplicación.
// Aquí mostramos la lista de Pokémon consumiendo la PokéAPI.
// Tiene buscador y filtro por tipo.
// Al hacer clic en un Pokémon, navega al detalle (/equipo/:nombre).

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './styles.css'

// --- INTERFACES ---
// Definimos la forma de los datos que vienen de la API

// Un Pokémon de la lista tiene nombre y url para pedir su detalle
interface PokemonListItem {
  name: string
  url: string
}

// El detalle de cada Pokémon que mostramos en la card
interface PokemonDetail {
  name: string
  id: number
  // Los sprites son las imágenes del Pokémon
  sprites: {
    front_default: string
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
  // Los tipos son como categorías: fuego, agua, planta, etc.
  types: {
    type: {
      name: string
    }
  }[]
}

// Los tipos posibles de Pokémon para el filtro
// Usamos un string vacío como "sin filtro"
type TipoFiltro = string

function Home() {
  // Lista completa de Pokémon que viene de la API
  const [pokemones, setPokemones] = useState<PokemonDetail[]>([])

  // Texto del buscador
  const [busqueda, setBusqueda] = useState('')

  // Tipo seleccionado para filtrar (vacío = todos)
  const [filtroTipo, setFiltroTipo] = useState<TipoFiltro>('')

  // Estado de carga para mostrar "Cargando..." mientras llegan los datos
  const [cargando, setCargando] = useState(true)

  // Lista de tipos disponibles para los botones de filtro
  const tipos = [
    'fire', 'water', 'grass', 'electric', 'psychic',
    'normal', 'fighting', 'poison', 'ground', 'flying',
    'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'ice', 'fairy'
  ]

  // useEffect se ejecuta una sola vez cuando el componente carga
  // (el array vacío [] significa "solo al montar el componente")
  useEffect(() => {
    // Definimos la función async dentro del useEffect
    const fetchPokemones = async () => {
      try {
        setCargando(true)

        // Primero pedimos la lista de los primeros 151 Pokémon
        // La API nos da nombre y URL de cada uno
        const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        const datos = await respuesta.json()
        const lista: PokemonListItem[] = datos.results

        // Ahora pedimos el detalle de cada Pokémon en paralelo
        // Promise.all nos permite hacer todas las peticiones al mismo tiempo
        // en lugar de una por una (que sería muy lento)
        const detalles = await Promise.all(
          lista.map((poke) => fetch(poke.url).then((r) => r.json()))
        )

        // Guardamos todos los detalles en el estado
        setPokemones(detalles)
      } catch (error) {
        // Si algo falla (sin internet, API caída), lo mostramos en consola
        console.error('Error cargando Pokémon:', error)
      } finally {
        // Siempre quitamos el estado de carga, haya error o no
        setCargando(false)
      }
    }

    fetchPokemones()
  }, []) // El [] hace que esto se ejecute solo una vez al cargar

  // Filtramos la lista según búsqueda y tipo seleccionado
  // filter() recorre el array y solo deja pasar los que cumplen la condición
  const pokemonesFiltrados = pokemones.filter((poke) => {
    // Verificamos si el nombre incluye el texto de búsqueda (sin importar mayúsculas)
    const coincideBusqueda =
      busqueda.length < 2
        ? true // Si hay menos de 2 letras, mostramos todos
        : poke.name.toLowerCase().includes(busqueda.toLowerCase())

    // Verificamos si el tipo coincide con el filtro seleccionado
    const coincideTipo =
      filtroTipo === ''
        ? true // Si no hay filtro de tipo, mostramos todos
        : poke.types.some((t) => t.type.name === filtroTipo)

    // Solo mostramos el Pokémon si cumple AMBAS condiciones
    return coincideBusqueda && coincideTipo
  })

  // Función para obtener el color del tipo (para los badges de colores)
  const colorTipo: Record<string, string> = {
    fire: '#F08030', water: '#6890F0', grass: '#78C850',
    electric: '#F8D030', psychic: '#F85888', normal: '#A8A878',
    fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
    flying: '#A890F0', bug: '#A8B820', rock: '#B8A038',
    ghost: '#705898', dragon: '#7038F8', dark: '#705848',
    steel: '#B8B8D0', ice: '#98D8D8', fairy: '#EE99AC'
  }

  return (
    <div className="home-container">
      {/* Encabezado con logo y título */}
      <div className="home-header">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
          alt="pokeball"
          className="header-pokeball"
        />
        <h1 className="home-titulo">Pokédex</h1>
      </div>

      {/* Buscador de Pokémon por nombre */}
      <input
        type="text"
        className="buscador"
        placeholder="🔍 Buscar Pokémon..."
        value={busqueda}
        // onChange se dispara cada vez que el usuario escribe algo
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* Botones de filtro por tipo */}
      <div className="filtros-tipo">
        {/* Botón para quitar el filtro */}
        <button
          className={`btn-tipo ${filtroTipo === '' ? 'activo' : ''}`}
          onClick={() => setFiltroTipo('')}
          style={{ backgroundColor: filtroTipo === '' ? '#cc0000' : '#eee', color: filtroTipo === '' ? 'white' : '#333' }}
        >
          Todos
        </button>

        {/* Generamos un botón por cada tipo */}
        {tipos.map((tipo) => (
          <button
            key={tipo}
            className={`btn-tipo ${filtroTipo === tipo ? 'activo' : ''}`}
            onClick={() => setFiltroTipo(tipo)}
            style={{
              backgroundColor: filtroTipo === tipo ? colorTipo[tipo] : '#eee',
              color: filtroTipo === tipo ? 'white' : '#333',
              borderColor: colorTipo[tipo]
            }}
          >
            {tipo}
          </button>
        ))}
      </div>

      {/* Mostramos "Cargando" mientras esperamos los datos de la API */}
      {cargando ? (
        <div className="cargando">
          <div className="pokeball-spin">⚽</div>
          <p>Cargando Pokémon...</p>
        </div>
      ) : (
        <>
          {/* Contador de resultados */}
          <p className="contador">
            Mostrando {pokemonesFiltrados.length} de {pokemones.length} Pokémon
          </p>

          {/* Grid de cards de Pokémon */}
          <div className="pokemon-grid">
            {/* map() recorre cada Pokémon y genera una card */}
            {pokemonesFiltrados.map((poke) => (
              // Link nos lleva al detalle del Pokémon al hacer clic
              <Link
                to={`/equipo/${poke.name}`}
                key={poke.id}
                className="pokemon-card"
              >
                {/* Número del Pokémon (ej: #001) */}
                <span className="pokemon-numero">
                  #{String(poke.id).padStart(3, '0')}
                </span>

                {/* Imagen oficial del Pokémon */}
                <img
                  src={
                    poke.sprites.other['official-artwork'].front_default ||
                    poke.sprites.front_default
                  }
                  alt={poke.name}
                  className="pokemon-imagen"
                />

                {/* Nombre del Pokémon con primera letra en mayúscula */}
                <h3 className="pokemon-nombre">
                  {poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}
                </h3>

                {/* Badges de tipos del Pokémon */}
                <div className="pokemon-tipos">
                  {poke.types.map((t) => (
                    <span
                      key={t.type.name}
                      className="tipo-badge"
                      style={{ backgroundColor: colorTipo[t.type.name] || '#888' }}
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Home
