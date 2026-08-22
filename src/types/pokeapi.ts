// Contratos crudos de PokéAPI (DTOs) — solo los campos que la app consume.
// https://pokeapi.co/docs/v2

export interface NamedApiResourceDto {
  name: string
  url: string
}

export interface PokemonListResponseDto {
  count: number
  next: string | null
  previous: string | null
  results: NamedApiResourceDto[]
}

export interface PokemonTypeSlotDto {
  slot: number
  type: NamedApiResourceDto
}

export interface PokemonAbilitySlotDto {
  ability: NamedApiResourceDto
  is_hidden: boolean
  slot: number
}

export interface PokemonStatSlotDto {
  base_stat: number
  effort: number
  stat: NamedApiResourceDto
}

export interface PokemonDetailDto {
  id: number
  name: string
  height: number // decímetros
  weight: number // hectogramos
  types: PokemonTypeSlotDto[]
  abilities: PokemonAbilitySlotDto[]
  stats: PokemonStatSlotDto[]
}

export interface FlavorTextEntryDto {
  flavor_text: string
  language: NamedApiResourceDto
  version: NamedApiResourceDto
}

export interface GenusDto {
  genus: string
  language: NamedApiResourceDto
}

export interface PokemonSpeciesDto {
  id: number
  gender_rate: number // -1 = sin género; si no, octavos que son hembra (0-8)
  genera: GenusDto[]
  flavor_text_entries: FlavorTextEntryDto[]
}

export interface TypeDamageRelationsDto {
  double_damage_from: NamedApiResourceDto[]
}

export interface PokemonTypeDto {
  name: string
  damage_relations: TypeDamageRelationsDto
  pokemon: { pokemon: NamedApiResourceDto; slot: number }[]
}
