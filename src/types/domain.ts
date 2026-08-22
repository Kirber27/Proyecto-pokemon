// Modelos de dominio propios de la app — nunca el shape crudo de PokéAPI.
// Ver .claude/steering/design-system.md (mapa $pokemon-types) para el mismo set de 18 tipos.

export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy'

export interface PokemonSummary {
  id: number
  name: string // 'bulbasaur'
  displayName: string // 'Bulbasaur'
  number: string // 'Nº001'
  artworkUrl: string // derivado del id, por convención
}

export interface PokemonStat {
  name: string
  value: number
}

export interface GenderRatio {
  male: number // %
  female: number // %
}

export interface SpeciesExtras {
  description?: string
  category?: string
  genderRatio?: GenderRatio | null
}

export interface PokemonDetail extends PokemonSummary {
  types: PokemonType[] // ['grass', 'poison']
  weightKg: number
  heightM: number
  abilities: string[]
  stats: PokemonStat[]
  // complementarios (species/type-relations): pueden faltar sin romper la vista
  description?: string
  category?: string
  genderRatio?: GenderRatio | null
  weaknesses?: PokemonType[]
}
