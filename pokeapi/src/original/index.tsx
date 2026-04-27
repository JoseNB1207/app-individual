// original/index.tsx
// Esta sección es el JUEGO de adivinar Pokémon.
// El juego funciona así:
//   1. Se muestra la sombra de un Pokémon (imagen con filtro CSS)
//   2. El usuario escribe el nombre en un input
//   3. Al hacer clic en "Verificar", se compara la respuesta
//   4. Si es correcta, se revela la imagen real
//   5. El botón "Siguiente" carga un nuevo Pokémon aleatorio
// La sombra se hace con CSS: filter: brightness(0) que pone todo en negro.

import { useState, useEffect } from 'react'
import './styles.css'

// --- INTERFACES ---
// Los datos del Pokémon que necesitamos para el juego
interface PokemonJuego {
  name: string
  id: number
  sprites: {
    front_default: string
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
  types: {
    type: {
      name: string
    }
  }[]
}

function Original() {
  // El Pokémon actual del juego
  const [pokemon, setPokemon] = useState<PokemonJuego | null>(null)

  // Lo que el usuario escribe en el input
  const [respuesta, setRespuesta] = useState('')

  // Si el usuario acertó o no (null = no ha respondido aún)
  const [acierto, setAcierto] = useState<boolean | null>(null)

  // Si ya se reveló la imagen (cuando acierta)
  const [revelado, setRevelado] = useState(false)

  // Puntaje: aciertos y intentos
  const [puntaje, setPuntaje] = useState({ aciertos: 0, intentos: 0 })

  // Estado de carga
  const [cargando, setCargando] = useState(true)

  // Función para cargar un Pokémon aleatorio de la PokéAPI
  // Los Pokémon tienen IDs del 1 al 898, elegimos uno al azar
  const cargarPokemonAleatorio = async () => {
    try {
      setCargando(true)
      setAcierto(null)      // Reiniciamos el estado de acierto
      setRevelado(false)    // Ocultamos la imagen
      setRespuesta('')      // Limpiamos el input

      // Math.random() da un número entre 0 y 1
      // Multiplicamos por 898 y redondeamos para obtener un ID entre 1 y 898
      const idAleatorio = Math.floor(Math.random() * 898) + 1

      // Pedimos el Pokémon con ese ID a la API
      const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${idAleatorio}`)
      const datos: PokemonJuego = await respuesta.json()
      setPokemon(datos)
    } catch (error) {
      console.error('Error cargando Pokémon:', error)
    } finally {
      setCargando(false)
    }
  }

  // Cargamos un Pokémon al inicio del juego
  // useEffect con [] solo se ejecuta una vez al montar el componente
  useEffect(() => {
    cargarPokemonAleatorio()
  }, [])

  // Función que se ejecuta cuando el usuario hace clic en "Verificar"
  const verificarRespuesta = () => {
    if (!pokemon || !respuesta.trim()) return

    // Comparamos el nombre escrito con el nombre real del Pokémon
    // Ambos los pasamos a minúsculas para que la comparación no sea sensible a mayúsculas
    // trim() quita espacios al inicio y final de lo que escribió el usuario
    const esCorrecta = respuesta.trim().toLowerCase() === pokemon.name.toLowerCase()

    setAcierto(esCorrecta)

    // Si acertó, revelamos la imagen
    if (esCorrecta) {
      setRevelado(true)
      // Actualizamos el puntaje sumando 1 acierto y 1 intento
      setPuntaje((prev) => ({
        aciertos: prev.aciertos + 1,
        intentos: prev.intentos + 1
      }))
    } else {
      // Si falló, solo sumamos 1 intento
      setPuntaje((prev) => ({
        ...prev,  // spread operator: copiamos el objeto anterior
        intentos: prev.intentos + 1
      }))
    }
  }

  // Función que se activa al presionar Enter en el input
  const manejarEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // e.key nos dice qué tecla se presionó
    if (e.key === 'Enter') {
      verificarRespuesta()
    }
  }

  // Función para rendirse y ver el Pokémon sin acertar
  const rendirse = () => {
    setRevelado(true)
    setAcierto(false)
    setPuntaje((prev) => ({ ...prev, intentos: prev.intentos + 1 }))
  }

  return (
    <div className="juego-container">
      {/* Encabezado del juego */}
      <div className="juego-header">
        <h1 className="juego-titulo">¿Quién es ese Pokémon?</h1>
        <p className="juego-subtitulo">Adivina el Pokémon por su silueta</p>
      </div>

      {/* Marcador de puntaje */}
      <div className="puntaje">
        <div className="puntaje-item">
          <span className="puntaje-numero">{puntaje.aciertos}</span>
          <span className="puntaje-label">✅ Aciertos</span>
        </div>
        <div className="puntaje-separador">|</div>
        <div className="puntaje-item">
          <span className="puntaje-numero">{puntaje.intentos}</span>
          <span className="puntaje-label">🎯 Intentos</span>
        </div>
        {/* Porcentaje de aciertos */}
        {puntaje.intentos > 0 && (
          <>
            <div className="puntaje-separador">|</div>
            <div className="puntaje-item">
              <span className="puntaje-numero">
                {Math.round((puntaje.aciertos / puntaje.intentos) * 100)}%
              </span>
              <span className="puntaje-label">📊 Precisión</span>
            </div>
          </>
        )}
      </div>

      {/* Área del juego */}
      <div className="juego-area">
        {cargando ? (
          <div className="juego-cargando">
            <p>Cargando Pokémon...</p>
          </div>
        ) : pokemon ? (
          <>
            {/* Imagen del Pokémon */}
            {/* Si no está revelado, aplicamos la clase 'sombra' que lo oculta */}
            {/* Si está revelado, mostramos la imagen normal */}
            <div className="imagen-wrapper">
              <img
                src={
                  pokemon.sprites.other['official-artwork'].front_default ||
                  pokemon.sprites.front_default
                }
                alt={revelado ? pokemon.name : '???'}
                // La clase 'sombra' aplica filter: brightness(0) que pone todo negro
                // Eso es el truco para mostrar solo la silueta
                className={`pokemon-silueta ${revelado ? 'revelado' : 'sombra'}`}
              />

              {/* Efecto de signo de pregunta encima de la sombra */}
              {!revelado && (
                <div className="pregunta-overlay">?</div>
              )}
            </div>

            {/* Si se reveló, mostramos el nombre y tipo */}
            {revelado && (
              <div className="pokemon-revelado-info">
                <h2 className="nombre-revelado">
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </h2>
                <p className="tipo-revelado">
                  #{String(pokemon.id).padStart(3, '0')} •{' '}
                  {pokemon.types.map((t) => t.type.name).join(' / ')}
                </p>
              </div>
            )}

            {/* Mensaje de resultado */}
            {acierto === true && (
              <div className="mensaje correcto">
                🎉 ¡Correcto! ¡Eres un maestro Pokémon!
              </div>
            )}
            {acierto === false && revelado && (
              <div className="mensaje incorrecto">
                😔 Era {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </div>
            )}

            {/* Input y botones - solo si no se reveló aún */}
            {!revelado && (
              <div className="juego-controles">
                {/* Input de respuesta */}
                <input
                  type="text"
                  className="input-respuesta"
                  placeholder="Escribe el nombre del Pokémon..."
                  value={respuesta}
                  // onChange actualiza el estado cada vez que el usuario escribe
                  onChange={(e) => setRespuesta(e.target.value)}
                  // Al presionar Enter también verificamos
                  onKeyDown={manejarEnter}
                />

                {/* Botón verificar */}
                <button
                  className="btn-verificar"
                  onClick={verificarRespuesta}
                  disabled={!respuesta.trim()} // Deshabilitado si está vacío
                >
                  Verificar
                </button>

                {/* Botón rendirse */}
                <button
                  className="btn-rendirse"
                  onClick={rendirse}
                >
                  Me rindo 😅
                </button>
              </div>
            )}

            {/* Botón siguiente - aparece solo después de responder */}
            {revelado && (
              <button
                className="btn-siguiente"
                onClick={cargarPokemonAleatorio}
              >
                Siguiente Pokémon →
              </button>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}

export default Original
