import { describe, expect, it } from 'vitest'
import { artworkUrl, idFromUrl } from '@/utils/pokemonId'

describe('idFromUrl', () => {
  it('extrae el id de una URL de recurso con slash final', () => {
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
  })

  it('extrae el id de una URL sin slash final', () => {
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/1')).toBe(1)
  })

  it('lanza si la URL no contiene un id numérico', () => {
    expect(() => idFromUrl('https://pokeapi.co/api/v2/pokemon/')).toThrow()
  })
})

describe('artworkUrl', () => {
  it('construye la URL del artwork oficial por convención', () => {
    expect(artworkUrl(1)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    )
  })
})
