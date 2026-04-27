// favoritos/index.tsx
// Esta pantalla muestra todos los Pokémon que el usuario marcó como favoritos.
// Los favoritos se guardan en localStorage con la clave 'favoritos_poke'.
// Cuando el usuario entra a esta pantalla, leemos localStorage y mostramos la lista.
// Al hacer clic en un favorito, va al detalle del Pokémon.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './styles.css'

// --- INTERFACE ---
// Para cada Pokémon favorito necesitamos nombre e imagen
interface PokemonFavorito {
  name: string
  // La sprite es la imagen pequeña del Pokémon
  sprite: string
  id: number
  types: string[]
}

function Favoritos() {
  // Estado que guarda la lista de Pokémon favoritos con sus datos
  const [favoritos, setFavoritos] = useState<PokemonFavorito[]>([])

  // Estado de carga mientras pedimos datos a la API
  const [cargando, setCargando] = useState(true)

  // useEffect se ejecuta cuando el componente monta (se muestra por primera vez)
  // El array vacío [] significa que solo se ejecuta una vez
  useEffect(() => {
    // Leemos los nombres de favoritos del localStorage
    // Si no hay nada guardado, usamos un array vacío []
    const nombresGuardados: string[] = JSON.parse(
      localStorage.getItem('favoritos_poke') || '[]'
    )

    // Si no hay favoritos, simplemente terminamos la carga
    if (nombresGuardados.length === 0) {
      setCargando(false)
      return
    }

    // Función para cargar los datos de cada Pokémon favorito
    const cargarFavoritos = async () => {
      try {
        setCargando(true)

        // Pedimos los datos de cada Pokémon favorito en paralelo
        // Promise.all espera a que TODAS las peticiones terminen
        const datos = await Promise.all(
          nombresGuardados.map(async (nombre) => {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)
            const poke = await res.json()

            // Devolvemos solo los datos que necesitamos
            return {
              name: poke.name,
              sprite: poke.sprites.other['official-artwork'].front_default || poke.sprites.front_default,
              id: poke.id,
              types: poke.types.map((t: { type: { name: string } }) => t.type.name)
            }
          })
        )

        setFavoritos(datos)
      } catch (error) {
        console.error('Error cargando favoritos:', error)
      } finally {
        setCargando(false)
      }
    }

    cargarFavoritos()
  }, []) // Solo se ejecuta al montar el componente

  // Función para quitar un Pokémon de favoritos desde esta pantalla
  const quitarFavorito = (nombre: string) => {
    // Filtramos la lista actual quitando el Pokémon seleccionado
    const nuevaLista = favoritos.filter((p) => p.name !== nombre)
    setFavoritos(nuevaLista)

    // Actualizamos localStorage con los nombres restantes
    const nuevosNombres = nuevaLista.map((p) => p.name)
    localStorage.setItem('favoritos_poke', JSON.stringify(nuevosNombres))
  }

  // Colores por tipo
  const colorTipo: Record<string, string> = {
    fire: '#F08030', water: '#6890F0', grass: '#78C850',
    electric: '#F8D030', psychic: '#F85888', normal: '#A8A878',
    fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
    flying: '#A890F0', bug: '#A8B820', rock: '#B8A038',
    ghost: '#705898', dragon: '#7038F8', dark: '#705848',
    steel: '#B8B8D0', ice: '#98D8D8', fairy: '#EE99AC'
  }

  return (
    <div className="favoritos-container">
      {/* Encabezado de la sección */}
      <div className="favoritos-header">
        <h1 className="favoritos-titulo">❤️ Favoritos</h1>
        <p className="favoritos-subtitulo">Tus Pokémon guardados</p>
      </div>

      {/* Estado de carga */}
      {cargando ? (
        <div className="favoritos-cargando">
          <p>Cargando favoritos...</p>
        </div>
      ) : favoritos.length === 0 ? (
        // Si no hay favoritos, mostramos un mensaje y botón para ir a Home
        <div className="favoritos-vacio">
          <div className="vacio-icono">😢</div>
          <h2>No tienes Pokémon favoritos</h2>
          <p>Busca Pokémon en el inicio y agrégalos con el botón ❤️</p>
          <Link to="/" className="btn-ir-home">
            Ir al Pokédex
          </Link>
        </div>
      ) : (
        <>
          {/* Contador de favoritos */}
          <p className="favoritos-contador">{favoritos.length} Pokémon favoritos</p>

          {/* Lista de Pokémon favoritos */}
          <div className="favoritos-lista">
            {/* map() recorre cada favorito y genera su card */}
            {favoritos.map((poke) => (
              <div key={poke.name} className="favorito-card">
                {/* Botón para quitar de favoritos */}
                <button
                  className="btn-quitar"
                  onClick={() => quitarFavorito(poke.name)}
                  title="Quitar de favoritos"
                >
                  ❤️
                </button>

                {/* Link al detalle del Pokémon */}
                <Link to={`/equipo/${poke.name}`} className="favorito-link">
                  {/* Imagen del Pokémon */}
                  <img
                    src={poke.sprite}
                    alt={poke.name}
                    className="favorito-imagen"
                  />

                  {/* Info del Pokémon */}
                  <div className="favorito-info">
                    <span className="favorito-numero">#{String(poke.id).padStart(3, '0')}</span>
                    <h3 className="favorito-nombre">
                      {poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}
                    </h3>
                    {/* Badges de tipos */}
                    <div className="favorito-tipos">
                      {poke.types.map((tipo) => (
                        <span
                          key={tipo}
                          className="tipo-mini"
                          style={{ backgroundColor: colorTipo[tipo] || '#888' }}
                        >
                          {tipo}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Favoritos
