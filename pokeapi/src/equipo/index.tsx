

import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './styles.css'

//INTERFACES
// Cada estadística base tiene nombre y valor
interface Stat {
  base_stat: number
  stat: {
    name: string
  }
}

// Cada tipo tiene un nombre
interface Tipo {
  type: {
    name: string
  }
}

// Cada habilidad tiene nombre y si es oculta o no
interface Habilidad {
  ability: {
    name: string
  }
  is_hidden: boolean
}

// Cada movimiento tiene nombre
interface Movimiento {
  move: {
    name: string
  }
}

// Estructura completa del Pokémon que devuelve la API
interface PokemonDetalle {
  id: number
  name: string
  height: number  // en decímetros
  weight: number  // en hectogramos
  sprites: {
    front_default: string
    front_shiny: string
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
  types: Tipo[]
  abilities: Habilidad[]
  stats: Stat[]
  moves: Movimiento[]
}

function Equipo() {
  // Como la ruta es /equipo/:nombre, aquí obtenemos el nombre del Pokémon
  const { nombre } = useParams<{ nombre: string }>()

  // Estado que guarda los datos del Pokémon (null mientras carga)
  const [pokemon, setPokemon] = useState<PokemonDetalle | null>(null)

  // Estado que indica si este Pokémon ya está en favoritos
  const [esFavorito, setEsFavorito] = useState(false)

  // Estado de carga
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Si no hay nombre en la URL, no hacemos nada
    if (!nombre) return

   // verificacion de existencia en el localStorage
    const favoritos: string[] = JSON.parse(localStorage.getItem('favoritos_poke') || '[]')
    setEsFavorito(favoritos.includes(nombre))

    // Función para cargar los datos del Pokémon desde la PokéAPI
    const fetchPokemon = async () => {
      try {
        setCargando(true)
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)

        // Si el Pokémon no existe, la API devuelve error 404
        if (!respuesta.ok) {
          throw new Error('Pokémon no encontrado')
        }

        const datos: PokemonDetalle = await respuesta.json()
        setPokemon(datos)
      } catch (error) {
        console.error('Error cargando Pokémon:', error)
      } finally {
        setCargando(false)
      }
    }

    fetchPokemon()
  }, [nombre]) // Se vuelve a ejecutar si el nombre en la URL cambia

  // Función para agregar/quitar de favoritos
  const toggleFavorito = () => {
    if (!nombre) return

    // Leemos los favoritos actuales del localStorage
    let favoritos: string[] = JSON.parse(localStorage.getItem('favoritos_poke') || '[]')

    if (favoritos.includes(nombre)) {
      // Si ya está en favoritos, lo quitamos con filter()
      favoritos = favoritos.filter((fav) => fav !== nombre)
      setEsFavorito(false)
    } else {
      // Si no está en favoritos, lo agregamos con push()
      favoritos.push(nombre)
      setEsFavorito(true)
    }

    // Guardamos el array actualizado en localStorage
    localStorage.setItem('favoritos_poke', JSON.stringify(favoritos))
  }

  // Colores por tipo de Pokémon para los badges
  const colorTipo: Record<string, string> = {
    fire: '#F08030', water: '#6890F0', grass: '#78C850',
    electric: '#F8D030', psychic: '#F85888', normal: '#A8A878',
    fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
    flying: '#A890F0', bug: '#A8B820', rock: '#B8A038',
    ghost: '#705898', dragon: '#7038F8', dark: '#705848',
    steel: '#B8B8D0', ice: '#98D8D8', fairy: '#EE99AC'
  }

  // Nombres en español de las estadísticas
  const nombresStat: Record<string, string> = {
    hp: 'HP',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'Atq. Esp.',
    'special-defense': 'Def. Esp.',
    speed: 'Velocidad'
  }

  // Mientras carga, mostramos un mensaje
  if (cargando) {
    return (
      <div className="detalle-cargando">
        <p>Cargando Pokémon...</p>
      </div>
    )
  }

  // Si no se encontró el Pokémon
  if (!pokemon) {
    return (
      <div className="detalle-error">
        <p>No se encontró el Pokémon</p>
        <Link to="/" className="btn-volver">Volver al inicio</Link>
      </div>
    )
  }

  // El color de fondo se basa en el tipo principal del Pokémon
  const colorPrincipal = colorTipo[pokemon.types[0]?.type.name] || '#cc0000'

  return (
    <div className="detalle-container">

      
      <Link to="/" className="btn-volver">← Volver</Link>

      
      <div className="detalle-header" style={{ backgroundColor: colorPrincipal }}>
 
        <span className="detalle-numero">#{String(pokemon.id).padStart(3, '0')}</span>

    
        <h1 className="detalle-nombre">
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </h1>

        <button
          className="btn-favorito"
          onClick={toggleFavorito}
          title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {esFavorito ? '❤️' : '🤍'}
        </button>

        <img
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="detalle-imagen"
        />

        <div className="detalle-tipos">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className="tipo-badge-grande"
              style={{ backgroundColor: colorTipo[t.type.name] || '#888' }}
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>


      <div className="detalle-seccion">
        <h2 className="seccion-titulo">Información</h2>
        <div className="info-grid">
   
          <div className="info-item">
            <span className="info-label">Altura</span>
            <span className="info-valor">{(pokemon.height / 10).toFixed(1)} m</span>
          </div>
          {/* La API da peso en hectogramos, convertimos a kg dividiendo entre 10 */}
          <div className="info-item">
            <span className="info-label">Peso</span>
            <span className="info-valor">{(pokemon.weight / 10).toFixed(1)} kg</span>
          </div>
        </div>
      </div>

      {/* Sección de habilidades */}
      <div className="detalle-seccion">
        <h2 className="seccion-titulo">Habilidades</h2>
        <div className="habilidades-lista">
          {pokemon.abilities.map((hab) => (
            <span
              key={hab.ability.name}
              className={`habilidad-badge ${hab.is_hidden ? 'oculta' : ''}`}
            >
              {hab.ability.name.replace('-', ' ')}
              {hab.is_hidden && <span className="oculta-tag"> (oculta)</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="detalle-seccion">
        <h2 className="seccion-titulo">Estadísticas</h2>
        <div className="stats-lista">
          {pokemon.stats.map((stat) => (
            <div key={stat.stat.name} className="stat-item">
              <span className="stat-nombre">
                {nombresStat[stat.stat.name] || stat.stat.name}
              </span>

              <span className="stat-valor">{stat.base_stat}</span>
 
              <div className="stat-barra-fondo">
                <div
                  className="stat-barra-relleno"
                  style={{
                    width: `${(stat.base_stat / 255) * 100}%`,
                    backgroundColor: colorPrincipal
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de movimientos - mostramos los primeros 20 */}
      <div className="detalle-seccion">
        <h2 className="seccion-titulo">Movimientos</h2>
        <div className="movimientos-lista">
         
          {pokemon.moves.slice(0, 20).map((mov) => (
            <span key={mov.move.name} className="movimiento-badge">
              {mov.move.name.replace(/-/g, ' ')}
            </span>
          ))}
         
          {pokemon.moves.length > 20 && (
            <span className="mas-movimientos">
              +{pokemon.moves.length - 20} más
            </span>
          )}
        </div>
      </div>

    </div>
  )
}

export default Equipo
