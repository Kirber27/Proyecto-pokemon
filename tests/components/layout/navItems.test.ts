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

  it('los 4 ítems navegan; Regiones y Perfil van al placeholder de construcción', () => {
    expect(navItems.find((item) => item.label === 'Regiones')?.routeName).toBe('regions')
    expect(navItems.find((item) => item.label === 'Perfil')?.routeName).toBe('profile')
    expect(navItems.every((item) => item.routeName)).toBe(true)
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
