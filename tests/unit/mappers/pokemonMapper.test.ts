import { describe, expect, it } from 'vitest'
import {
  mapPokemonDetail,
  mapPokemonSummary,
  mapSpeciesExtras,
  mapTypeInfo,
} from '@/services/mappers/pokemonMapper'
import type { PokemonDetailDto, PokemonSpeciesDto, PokemonTypeDto } from '@/types/pokeapi'
import bulbasaurDto from '../../fixtures/pokemon-bulbasaur.json'
import bulbasaurSpeciesDto from '../../fixtures/pokemon-species-bulbasaur.json'
import grassTypeDto from '../../fixtures/type-grass.json'

describe('mapPokemonSummary', () => {
  it('deriva id, número y artwork de un item del índice, sin datos extra', () => {
    const summary = mapPokemonSummary({
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
    })

    expect(summary).toEqual({
      id: 1,
      name: 'bulbasaur',
      displayName: 'Bulbasaur',
      number: 'Nº001',
      artworkUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    })
  })
})

describe('mapPokemonDetail', () => {
  it('mapea el fixture real de bulbasaur a un PokemonDetail', () => {
    const detail = mapPokemonDetail(bulbasaurDto as PokemonDetailDto)

    expect(detail.id).toBe(1)
    expect(detail.displayName).toBe('Bulbasaur')
    expect(detail.number).toBe('Nº001')
    expect(detail.types).toEqual(['grass', 'poison'])
    expect(detail.weightKg).toBeCloseTo(6.9)
    expect(detail.heightM).toBeCloseTo(0.7)
    expect(detail.abilities).toEqual(['Overgrow', 'Chlorophyll'])
    expect(detail.stats).toContainEqual({ name: 'hp', value: 45 })
  })
})

describe('mapSpeciesExtras', () => {
  it('extrae descripción y categoría en español, y la proporción de género', () => {
    const extras = mapSpeciesExtras(bulbasaurSpeciesDto as PokemonSpeciesDto)

    expect(extras.category).toBe('Pokémon Semilla')
    expect(extras.description).not.toContain('\n')
    expect(extras.description).toMatch(/^Una rara semilla/)
    expect(extras.genderRatio).toEqual({ male: 87.5, female: 12.5 })
  })

  it('devuelve genderRatio null para especies sin género', () => {
    const extras = mapSpeciesExtras({
      ...(bulbasaurSpeciesDto as PokemonSpeciesDto),
      gender_rate: -1,
    })

    expect(extras.genderRatio).toBeNull()
  })
})

describe('mapTypeInfo', () => {
  it('mapea el fixture real de tipo grass a debilidades y miembros', () => {
    const info = mapTypeInfo(grassTypeDto as PokemonTypeDto)

    expect(info.weaknesses).toEqual(['flying', 'poison', 'bug', 'fire', 'ice'])
    expect(info.members).toEqual(['bulbasaur', 'ivysaur', 'venusaur', 'oddish', 'gloom'])
  })
})
