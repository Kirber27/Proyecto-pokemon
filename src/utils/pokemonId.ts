const ID_FROM_URL_PATTERN = /\/(\d+)\/?$/

const ARTWORK_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

/** Extrae el id numérico de una URL de recurso de PokéAPI, p. ej. `.../pokemon/25/` → `25`. */
export function idFromUrl(url: string): number {
  const match = ID_FROM_URL_PATTERN.exec(url)

  if (!match?.[1]) {
    throw new Error(`No se pudo extraer el id de la URL: ${url}`)
  }

  return Number(match[1])
}

/** Sprite de artwork oficial derivado por convención — sin request de detalle. */
export function artworkUrl(id: number): string {
  return `${ARTWORK_BASE_URL}/${id}.png`
}
