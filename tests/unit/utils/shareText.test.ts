import { describe, expect, it } from 'vitest'
import { buildShareText } from '@/utils/shareText'
import type { PokemonDetail } from '@/types/domain'

const bulbasaur: PokemonDetail = {
  id: 1,
  name: 'bulbasaur',
  displayName: 'Bulbasaur',
  number: 'Nº001',
  artworkUrl: '1.png',
  types: ['grass', 'poison'],
  weightKg: 6.9,
  heightM: 0.7,
  abilities: ['Overgrow', 'Chlorophyll'],
  stats: [],
  category: 'Semilla',
}

describe('buildShareText', () => {
  it('arma el texto en el formato de CA-07.2', () => {
    expect(buildShareText(bulbasaur)).toBe(
      'Bulbasaur, Nº001, Planta, Veneno, 6,9 kg, 0,7 m, Semilla, Overgrow',
    )
  })

  it('omite la categoría si no está disponible (CA-05.4)', () => {
    expect(buildShareText({ ...bulbasaur, category: undefined })).toBe(
      'Bulbasaur, Nº001, Planta, Veneno, 6,9 kg, 0,7 m, Overgrow',
    )
  })

  it('omite la habilidad si no hay ninguna', () => {
    expect(buildShareText({ ...bulbasaur, category: undefined, abilities: [] })).toBe(
      'Bulbasaur, Nº001, Planta, Veneno, 6,9 kg, 0,7 m',
    )
  })

  it('funciona con un solo tipo', () => {
    const charmander: PokemonDetail = { ...bulbasaur, types: ['fire'], category: undefined, abilities: [] }

    expect(buildShareText(charmander)).toBe('Bulbasaur, Nº001, Fuego, 6,9 kg, 0,7 m')
  })
})
