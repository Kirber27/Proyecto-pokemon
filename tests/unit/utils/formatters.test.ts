import { describe, expect, it } from 'vitest'
import {
  capitalize,
  formatHeightM,
  formatPercent,
  formatPokemonNumber,
  formatWeightKg,
  typeNameEs,
} from '@/utils/formatters'

describe('capitalize', () => {
  it('capitaliza un nombre simple', () => {
    expect(capitalize('bulbasaur')).toBe('Bulbasaur')
  })

  it('convierte kebab-case en palabras separadas y capitalizadas', () => {
    expect(capitalize('mr-mime')).toBe('Mr Mime')
    expect(capitalize('ho-oh')).toBe('Ho Oh')
  })
})

describe('formatPokemonNumber', () => {
  it('rellena con ceros a 3 dígitos', () => {
    expect(formatPokemonNumber(1)).toBe('Nº001')
    expect(formatPokemonNumber(25)).toBe('Nº025')
    expect(formatPokemonNumber(150)).toBe('Nº150')
  })

  it('no trunca ids de 4 dígitos', () => {
    expect(formatPokemonNumber(1025)).toBe('Nº1025')
  })
})

describe('formatWeightKg', () => {
  it('formatea con coma decimal y sufijo kg', () => {
    expect(formatWeightKg(6.9)).toBe('6,9 kg')
  })
})

describe('formatHeightM', () => {
  it('formatea con coma decimal y sufijo m', () => {
    expect(formatHeightM(0.7)).toBe('0,7 m')
  })
})

describe('typeNameEs', () => {
  it('traduce los tipos al español', () => {
    expect(typeNameEs('grass')).toBe('Planta')
    expect(typeNameEs('poison')).toBe('Veneno')
    expect(typeNameEs('water')).toBe('Agua')
  })
})

describe('formatPercent', () => {
  it('conserva el medio punto de los ratios n/8', () => {
    expect(formatPercent(87.5)).toBe('87,5%')
    expect(formatPercent(12.5)).toBe('12,5%')
  })

  it('no arrastra decimales en los enteros', () => {
    expect(formatPercent(50)).toBe('50%')
    expect(formatPercent(0)).toBe('0%')
    expect(formatPercent(100)).toBe('100%')
  })
})
