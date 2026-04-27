import { useState, useEffect } from 'react'
import './styles.css'

//INTERFACES
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

  // Si el usuario acerto o no
  const [acierto, setAcierto] = useState<boolean | null>(null)

  // Si ya se reveló la imagen
  const [revelado, setRevelado] = useState(false)

  // Puntaje: aciertos y intentos
  const [puntaje, setPuntaje] = useState({ aciertos: 0, intentos: 0 })

  // Estado de carga
  const [cargando, setCargando] = useState(true)

  // Función para cargar un Pokémon aleatorio de la PokéAPI
  const cargarPokemonAleatorio = async () => {
    try {
      setCargando(true)
      setAcierto(null)      
      setRevelado(false)    
      setRespuesta('')      

      // Math.random() da un número entre 0 y 1
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
  useEffect(() => {
    cargarPokemonAleatorio()
  }, [])

  // Función que se ejecuta cuando el usuario hace clic en "Verificar"
  const verificarRespuesta = () => {
    if (!pokemon || !respuesta.trim()) return

    // Comparamos el nombre escrito con el nombre real del Pokémon
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
      <div className="juego-header">
        <h1 className="juego-titulo">¿Quién es ese Pokémon?</h1>
        <p className="juego-subtitulo">Adivina el Pokémon por su silueta</p>
      </div>

      <div className="puntaje">
        <div className="puntaje-item">
          <span className="puntaje-numero">{puntaje.aciertos}</span>
          <span className="puntaje-label">Aciertos</span>
        </div>
        <div className="puntaje-separador">|</div>
        <div className="puntaje-item">
          <span className="puntaje-numero">{puntaje.intentos}</span>
          <span className="puntaje-label">Intentos</span>
        </div>

        {puntaje.intentos > 0 && (
          <>
            <div className="puntaje-separador">|</div>
            <div className="puntaje-item">
              <span className="puntaje-numero">
                {Math.round((puntaje.aciertos / puntaje.intentos) * 100)}%
              </span>
              <span className="puntaje-label">Precisión</span>
            </div>
          </>
        )}
      </div>

  
      <div className="juego-area">
        {cargando ? (
          <div className="juego-cargando">
            <p>Cargando Pokémon...</p>
          </div>
        ) : pokemon ? (
          <>

            <div className="imagen-wrapper">
              <img
                src={
                  pokemon.sprites.other['official-artwork'].front_default ||
                  pokemon.sprites.front_default
                }
                alt={revelado ? pokemon.name : '???'}
                className={`pokemon-silueta ${revelado ? 'revelado' : 'sombra'}`}
              />


              {!revelado && (
                <div className="pregunta-overlay">?</div>
              )}
            </div>


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

         
            {acierto === true && (
              <div className="mensaje correcto">
                ¡Correcto! ¡Eres un maestro Pokémon!
              </div>
            )}
            {acierto === false && revelado && (
              <div className="mensaje incorrecto">
                Era {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </div>
            )}

         
            {!revelado && (
              <div className="juego-controles">
         
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

                <button
                  className="btn-verificar"
                  onClick={verificarRespuesta}
                  disabled={!respuesta.trim()} // Deshabilitado si está vacío
                >
                  Verificar
                </button>

                <button
                  className="btn-rendirse"
                  onClick={rendirse}
                >
                  Me rindo
                </button>
              </div>
            )}


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
