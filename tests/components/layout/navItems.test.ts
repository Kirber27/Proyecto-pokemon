import { describe, expect, it } from 'vitest'
import { isNavItemActive, navItems } from '@/components/layout/navItems'

describe('navItems', () => {
  it('incluye los 4 ítems del tab bar, en orden', () => {
    expect(navItems.map((item) => item.label)).toEqual([
      'Pokédex',
      'Regiones',
      'Favoritos',
      'Perfil',
    ])
  })

  it('Regiones y Perfil no tienen ruta (fuera del MVP, CA-08.3)', () => {
    expect(navItems.find((item) => item.label === 'Regiones')?.routeName).toBeUndefined()
    expect(navItems.find((item) => item.label === 'Perfil')?.routeName).toBeUndefined()
  })
})

describe('isNavItemActive', () => {
  it('es false si el ítem no tiene ruta', () => {
    expect(isNavItemActive(undefined, 'pokedex')).toBe(false)
  })

  it('es true si el nombre de ruta coincide exacto', () => {
    expect(isNavItemActive('pokedex', 'pokedex')).toBe(true)
  })

  it('es true también en la ruta de detalle (pokedex-detail)', () => {
    expect(isNavItemActive('pokedex', 'pokedex-detail')).toBe(true)
  })

  it('es false si la ruta activa es otra', () => {
    expect(isNavItemActive('pokedex', 'favorites')).toBe(false)
  })
})
