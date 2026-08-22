import type { Component } from 'vue'
import IconPokedex from '@/assets/icons/IconPokedex.vue'
import IconRegions from '@/assets/icons/IconRegions.vue'
import IconFavorites from '@/assets/icons/IconFavorites.vue'
import IconProfile from '@/assets/icons/IconProfile.vue'

export interface NavItem {
  label: string
  // Sin routeName: fuera del MVP (CA-08.3) — se muestra pero no navega.
  routeName?: 'pokedex' | 'favorites'
  icon: Component
}

// Un único listado consumido por BottomTabBar (mobile) y TopNavBar (desktop):
// mismo store/lógica de navegación, solo cambia el componente de presentación.
export const navItems: NavItem[] = [
  { label: 'Pokédex', routeName: 'pokedex', icon: IconPokedex },
  { label: 'Regiones', icon: IconRegions },
  { label: 'Favoritos', routeName: 'favorites', icon: IconFavorites },
  { label: 'Perfil', icon: IconProfile },
]

export function isNavItemActive(routeName: NavItem['routeName'], currentRouteName: unknown): boolean {
  if (!routeName) return false

  return currentRouteName === routeName || currentRouteName === `${routeName}-detail`
}
