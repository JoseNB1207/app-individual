import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './styles.css'

interface PokemonListItem { name: string; url: string }
interface PokemonDetail {
  name: string; id: number
  sprites: { front_default: string; other: { 'official-artwork': { front_default: string } } }
  types: { type: { name: string } }[]
  abilities: { ability: { name: string }; is_hidden: boolean }[]
}
interface HabitatData { pokemon_species: { name: string }[] }

type FiltroActivo = 'todos' | 'habilidades' | 'habitat' | 'tipos'

const TIPOS = [
  'fire','water','grass','electric','psychic','normal','fighting',
  'poison','ground','flying','bug','rock','ghost','dragon','dark','steel','ice','fairy'
]
const HABILIDADES = ['blaze','torrent','overgrow','static','intimidate','levitate','swift-swim','chlorophyll','flash-fire']
const HABITATS = ['grassland','forest','cave','mountain','water-edge','sea','urban','rare']

function Home() {
  const [pokemones, setPokemones] = useState<PokemonDetail[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroActivo, setFiltroActivo] = useState<FiltroActivo>('todos')
  const [subFiltro, setSubFiltro] = useState('')
  const [habitatPokes, setHabitatPokes] = useState<string[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchPokemones = async () => {
      try {
        setCargando(true)
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        const datos = await res.json()
        const detalles = await Promise.all(
          datos.results.map((p: PokemonListItem) => fetch(p.url).then(r => r.json()))
        )
        setPokemones(detalles)
      } catch (e) { console.error(e) }
      finally { setCargando(false) }
    }
    fetchPokemones()
  }, [])

  useEffect(() => {
    if (filtroActivo === 'habitat' && subFiltro) {
      fetch(`https://pokeapi.co/api/v2/pokemon-habitat/${subFiltro}`)
        .then(r => r.json())
        .then((d: HabitatData) => setHabitatPokes(d.pokemon_species.map(p => p.name)))
        .catch(() => setHabitatPokes([]))
    }
  }, [filtroActivo, subFiltro])

  const pokemonesFiltrados = pokemones.filter(poke => {
    const coincideBusqueda = busqueda.length < 2 || poke.name.toLowerCase().includes(busqueda.toLowerCase())
    let coincideFiltro = true
    if (filtroActivo === 'tipos' && subFiltro)
      coincideFiltro = poke.types.some(t => t.type.name === subFiltro)
    else if (filtroActivo === 'habilidades' && subFiltro)
      coincideFiltro = poke.abilities.some(a => a.ability.name === subFiltro)
    else if (filtroActivo === 'habitat' && subFiltro)
      coincideFiltro = habitatPokes.includes(poke.name)
    return coincideBusqueda && coincideFiltro
  })

  const cambiarFiltro = (f: FiltroActivo) => {
    setFiltroActivo(f)
    setSubFiltro('')
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-titulo">Pokédex</h1>
      </div>

      <input
        type="text"
        className="buscador"
        placeholder="Buscar Pokémon..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />

      <div className="filtros-nav">
        {(['todos','habilidades','habitat','tipos'] as FiltroActivo[]).map(f => (
          <button
            key={f}
            className={`btn-filtro-nav ${filtroActivo === f ? 'activo' : ''}`}
            onClick={() => cambiarFiltro(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtroActivo === 'tipos' && (
        <div className="subfiltros">
          {TIPOS.map(tipo => (
            <button key={tipo} className={`btn-sub ${subFiltro === tipo ? 'activo' : ''}`} onClick={() => setSubFiltro(subFiltro === tipo ? '' : tipo)}>{tipo}</button>
          ))}
        </div>
      )}
      {filtroActivo === 'habilidades' && (
        <div className="subfiltros">
          {HABILIDADES.map(hab => (
            <button key={hab} className={`btn-sub ${subFiltro === hab ? 'activo' : ''}`} onClick={() => setSubFiltro(subFiltro === hab ? '' : hab)}>{hab}</button>
          ))}
        </div>
      )}
      {filtroActivo === 'habitat' && (
        <div className="subfiltros">
          {HABITATS.map(h => (
            <button key={h} className={`btn-sub ${subFiltro === h ? 'activo' : ''}`} onClick={() => setSubFiltro(subFiltro === h ? '' : h)}>{h}</button>
          ))}
        </div>
      )}

      {cargando ? (
        <div className="cargando"><p>Cargando Pokémon...</p></div>
      ) : (
        <>
          <p className="contador">{pokemonesFiltrados.length} resultados</p>
          <div className="pokemon-lista">
            {pokemonesFiltrados.map(poke => (
              <Link to={`/equipo/${poke.name}`} key={poke.id} className="pokemon-fila">
                <span className="pokemon-numero">#{String(poke.id).padStart(3, '0')}</span>
                <span className="pokemon-nombre">{poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</span>
                <span className="pokemon-tipos-texto">{poke.types.map(t => t.type.name).join(' / ')}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Home