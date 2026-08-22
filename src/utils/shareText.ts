import { formatHeightM, formatWeightKg, typeNameEs } from '@/utils/formatters'
import type { PokemonDetail } from '@/types/domain'

/**
 * CA-07.2: nombre y atributos separados por coma.
 * 'Bulbasaur, Nº001, Planta, Veneno, 6,9 kg, 0,7 m, Semilla, Overgrow'
 *
 * Nota: el nombre de la habilidad queda en inglés (así llega de PokéAPI sin un
 * request adicional a /ability/{name} solo por esa traducción); el resto —tipos,
 * categoría— sí está en español porque ya viene así del resto del dominio.
 */
export function buildShareText(pokemon: PokemonDetail): string {
  const parts = [
    pokemon.displayName,
    pokemon.number,
    ...pokemon.types.map(typeNameEs),
    formatWeightKg(pokemon.weightKg),
    formatHeightM(pokemon.heightM),
  ]

  if (pokemon.category) parts.push(pokemon.category)

  const primaryAbility = pokemon.abilities[0]
  if (primaryAbility) parts.push(primaryAbility)

  return parts.join(', ')
}
