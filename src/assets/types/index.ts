import type { PokemonType } from '@/types/domain'

import bug from '@/assets/types/bug.svg'
import dark from '@/assets/types/dark.svg'
import dragon from '@/assets/types/dragon.svg'
import electric from '@/assets/types/electric.svg'
import fairy from '@/assets/types/fairy.svg'
import fighting from '@/assets/types/fighting.svg'
import fire from '@/assets/types/fire.svg'
import flying from '@/assets/types/flying.svg'
import ghost from '@/assets/types/ghost.svg'
import grass from '@/assets/types/grass.svg'
import ground from '@/assets/types/ground.svg'
import ice from '@/assets/types/ice.svg'
import normal from '@/assets/types/normal.svg'
import poison from '@/assets/types/poison.svg'
import psychic from '@/assets/types/psychic.svg'
import rock from '@/assets/types/rock.svg'
import steel from '@/assets/types/steel.svg'
import water from '@/assets/types/water.svg'

/**
 * Ícono de cada tipo, exportado del Figma. El `Record<PokemonType, string>` es a
 * propósito: si mañana se suma un tipo al dominio, esto falla en compilación en vez
 * de renderizar un hueco en silencio.
 *
 * Los SVG traen su color de relleno propio (el oficial del tipo), así que se usan
 * como imagen y no como `currentColor`.
 */
export const TYPE_ICONS: Record<PokemonType, string> = {
  normal,
  fire,
  water,
  electric,
  grass,
  ice,
  fighting,
  poison,
  ground,
  flying,
  psychic,
  bug,
  rock,
  ghost,
  dragon,
  dark,
  steel,
  fairy,
}
