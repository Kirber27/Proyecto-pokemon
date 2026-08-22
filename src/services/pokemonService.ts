import { get } from '@/services/httpClient'
import {
  mapPokemonDetail,
  mapPokemonSummary,
  mapSpeciesExtras,
  mapTypeInfo,
  type TypeInfo,
} from '@/services/mappers/pokemonMapper'
import type { PokemonDetailDto, PokemonListResponseDto, PokemonSpeciesDto, PokemonTypeDto } from '@/types/pokeapi'
import type { PokemonDetail, PokemonSummary, PokemonType, SpeciesExtras } from '@/types/domain'

const BASE_URL = 'https://pokeapi.co/api/v2'

/** Índice completo en un único request — ver design-system.md, estrategia de gran volumen. */
export async function getIndex(signal?: AbortSignal): Promise<PokemonSummary[]> {
  const response = await get<PokemonListResponseDto>(`${BASE_URL}/pokemon?limit=100000&offset=0`, {
    signal,
  })

  return response.results.map(mapPokemonSummary)
}

export async function getDetail(name: string, signal?: AbortSignal): Promise<PokemonDetail> {
  const dto = await get<PokemonDetailDto>(`${BASE_URL}/pokemon/${name}`, { signal })

  return mapPokemonDetail(dto)
}

export async function getSpecies(id: number, signal?: AbortSignal): Promise<SpeciesExtras> {
  const dto = await get<PokemonSpeciesDto>(`${BASE_URL}/pokemon-species/${id}`, { signal })

  return mapSpeciesExtras(dto)
}

/** Debilidades + miembros de un tipo — un único fetch sirve el detalle y el filtro. */
export async function getTypeInfo(type: PokemonType, signal?: AbortSignal): Promise<TypeInfo> {
  const dto = await get<PokemonTypeDto>(`${BASE_URL}/type/${type}`, { signal })

  return mapTypeInfo(dto)
}
