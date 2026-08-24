import type { PokemonType } from '@/types/domain'

const TYPE_NAMES_ES: Record<PokemonType, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
}

/** 'mr-mime' → 'Mr Mime'. Los nombres de PokéAPI usan kebab-case para multi-palabra. */
export function capitalize(name: string): string {
  return name
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/** 1 → 'Nº001' */
export function formatPokemonNumber(id: number): string {
  return `Nº${String(id).padStart(3, '0')}`
}

/** 6.9 → '6,9 kg' */
export function formatWeightKg(kg: number): string {
  return `${formatDecimal(kg)} kg`
}

/** 0.7 → '0,7 m' */
export function formatHeightM(m: number): string {
  return `${formatDecimal(m)} m`
}

function formatDecimal(value: number): string {
  return value.toFixed(1).replace('.', ',')
}

/**
 * 87.5 → '87,5%' · 50 → '50%'
 * gender_rate es n/8, así que los valores son enteros o terminan en ,5: se muestra
 * un decimal solo cuando hace falta. Redondear a entero perdía el 87,5 del diseño.
 */
export function formatPercent(value: number): string {
  const rounded = Math.round(value * 10) / 10

  return `${String(rounded).replace('.', ',')}%`
}

/** 'grass' → 'Planta' */
export function typeNameEs(type: PokemonType): string {
  return TYPE_NAMES_ES[type]
}
