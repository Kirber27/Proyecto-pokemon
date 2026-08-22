import { describe, expect, it } from 'vitest'
import { matchesText, normalizeText } from '@/utils/textMatch'

describe('normalizeText', () => {
  it('quita acentos y pasa a minúsculas', () => {
    expect(normalizeText('Nidorán')).toBe('nidoran')
    expect(normalizeText('PIKACHÚ')).toBe('pikachu')
  })

  it('deja intacto el texto ya normalizado', () => {
    expect(normalizeText('bulbasaur')).toBe('bulbasaur')
  })
})

describe('matchesText', () => {
  it('coincide por substring parcial', () => {
    expect(matchesText('Charizard', 'char')).toBe(true)
    expect(matchesText('Charizard', 'izar')).toBe(true)
  })

  it('no distingue mayúsculas ni acentos', () => {
    expect(matchesText('Nidorán', 'NIDORAN')).toBe(true)
    expect(matchesText('Nidorán', 'nidorán')).toBe(true)
  })

  it('no coincide si el término no está', () => {
    expect(matchesText('Bulbasaur', 'char')).toBe(false)
  })

  it('un término vacío coincide con todo', () => {
    expect(matchesText('Bulbasaur', '')).toBe(true)
    expect(matchesText('Bulbasaur', '   ')).toBe(true)
  })
})
