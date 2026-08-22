import { artworkUrl, idFromUrl } from '@/utils/pokemonId'
import { capitalize, formatPokemonNumber } from '@/utils/formatters'
import type {
  NamedApiResourceDto,
  PokemonDetailDto,
  PokemonSpeciesDto,
  PokemonTypeDto,
} from '@/types/pokeapi'
import type { GenderRatio, PokemonDetail, PokemonSummary, PokemonType, SpeciesExtras } from '@/types/domain'

function buildSummaryFields(id: number, name: string): PokemonSummary {
  return {
    id,
    name,
    displayName: capitalize(name),
    number: formatPokemonNumber(id),
    artworkUrl: artworkUrl(id),
  }
}

/** Item del índice `{name, url}` → `PokemonSummary`, sin ningún request adicional. */
export function mapPokemonSummary(item: NamedApiResourceDto): PokemonSummary {
  return buildSummaryFields(idFromUrl(item.url), item.name)
}

/** `GET /pokemon/{name}` → detalle base. Species y debilidades se mapean aparte. */
export function mapPokemonDetail(dto: PokemonDetailDto): PokemonDetail {
  return {
    ...buildSummaryFields(dto.id, dto.name),
    types: [...dto.types].sort((a, b) => a.slot - b.slot).map((slot) => slot.type.name as PokemonType),
    weightKg: dto.weight / 10,
    heightM: dto.height / 10,
    abilities: [...dto.abilities]
      .sort((a, b) => a.slot - b.slot)
      .map((slot) => capitalize(slot.ability.name)),
    stats: dto.stats.map((stat) => ({ name: stat.stat.name, value: stat.base_stat })),
  }
}

/** `GET /pokemon-species/{id}` → descripción, categoría y proporción de género, en español. */
export function mapSpeciesExtras(dto: PokemonSpeciesDto): SpeciesExtras {
  const description = dto.flavor_text_entries
    .find((entry) => entry.language.name === 'es')
    ?.flavor_text.replace(/[\n\f]+/g, ' ')

  const category = dto.genera.find((genus) => genus.language.name === 'es')?.genus

  return {
    description,
    category,
    genderRatio: mapGenderRatio(dto.gender_rate),
  }
}

function mapGenderRatio(genderRate: number): GenderRatio | null {
  if (genderRate < 0) return null // especie sin género

  const female = (genderRate / 8) * 100

  return { male: 100 - female, female }
}

export interface TypeInfo {
  weaknesses: PokemonType[]
  members: string[]
}

/**
 * `GET /type/{name}` → tipos de los que recibe daño doble (debilidades) y la lista de
 * nombres de Pokémon de ese tipo (para el filtro exacto sin hidratar detalles).
 * Un único fetch por tipo sirve ambos casos de uso — 18 respuestas cacheables.
 */
export function mapTypeInfo(dto: PokemonTypeDto): TypeInfo {
  return {
    weaknesses: dto.damage_relations.double_damage_from.map((type) => type.name as PokemonType),
    members: dto.pokemon.map((entry) => entry.pokemon.name),
  }
}
