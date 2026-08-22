// Altura fija de PokemonCard — requisito del virtual scroll (useVirtualGrid necesita
// conocerla para calcular filas). Único punto de verdad, en JS porque useVirtualGrid
// también la necesita (SCSS no se puede leer desde ahí).
export const POKEMON_CARD_HEIGHT = 180
export const POKEMON_GRID_GAP = 16
