import './styles.css'

function Informativa() {
  return (
    <div className="info-container">
      <div className="info-card">
        <div className="info-icon">⚡</div>
        <h1 className="info-titulo">¿Qué es Pokémon?</h1>
        <p className="info-texto">
          Pokémon es una franquicia creada por Satoshi Tajiri en 1996 que comenzó como un videojuego
          para Game Boy y se convirtió en uno de los universos de entretenimiento más grandes del mundo.
          La palabra <em>Pokémon</em> es la contracción de <em>Pocket Monsters</em>, criaturas que los
          entrenadores capturan, entrenan y usan en combates estratégicos. Existen más de 1,000 especies
          distintas, cada una con tipos, habilidades y estadísticas únicas que determinan su rol en batalla.
          El mundo Pokémon está dividido en regiones inspiradas en lugares reales, como Kanto basada en
          Japón o Galar en Reino Unido. La franquicia abarca videojuegos, una serie de anime con más de
          1,000 episodios, cartas coleccionables, películas y merchandising. Su lema —<em>Gotta catch 'em all</em>—
          resume la esencia del juego: explorar, descubrir y completar la Pokédex. Hoy, décadas después
          de su lanzamiento, Pokémon sigue siendo un fenómeno cultural global que une a generaciones.
        </p>
      </div>
    </div>
  )
}

export default Informativa