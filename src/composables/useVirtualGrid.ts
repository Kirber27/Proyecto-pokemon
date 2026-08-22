import { computed, type MaybeRefOrGetter, toValue } from 'vue'

export interface UseVirtualGridOptions {
  itemCount: MaybeRefOrGetter<number>
  columns: MaybeRefOrGetter<number>
  rowHeight: MaybeRefOrGetter<number>
  scrollTop: MaybeRefOrGetter<number>
  viewportHeight: MaybeRefOrGetter<number>
  overscan?: MaybeRefOrGetter<number>
}

const DEFAULT_OVERSCAN = 4

/**
 * Virtualizador propio para una grilla de altura de fila fija: dado el scroll y el
 * viewport, calcula qué rango de índices renderizar y el offset para el `translateY`.
 * El DOM nunca contiene más de ~30 cards a la vez, sin importar cuántos ítems haya (CA-02.3).
 */
export function useVirtualGrid(options: UseVirtualGridOptions) {
  const columns = computed(() => Math.max(1, toValue(options.columns)))
  const overscan = computed(() => toValue(options.overscan) ?? DEFAULT_OVERSCAN)

  const rowCount = computed(() => Math.max(0, Math.ceil(toValue(options.itemCount) / columns.value)))
  const totalHeight = computed(() => rowCount.value * toValue(options.rowHeight))

  const currentRow = computed(() => Math.floor(toValue(options.scrollTop) / toValue(options.rowHeight)))
  const rowsInViewport = computed(() =>
    Math.ceil(toValue(options.viewportHeight) / toValue(options.rowHeight)),
  )

  const lastRowIndex = computed(() => Math.max(0, rowCount.value - 1))
  const startRow = computed(() =>
    Math.min(lastRowIndex.value, Math.max(0, currentRow.value - overscan.value)),
  )
  const endRow = computed(() =>
    Math.min(rowCount.value, startRow.value + rowsInViewport.value + overscan.value * 2),
  )

  const startIndex = computed(() => startRow.value * columns.value)
  const endIndex = computed(() => Math.min(toValue(options.itemCount), endRow.value * columns.value))
  const offsetTop = computed(() => startRow.value * toValue(options.rowHeight))

  return { totalHeight, startIndex, endIndex, offsetTop }
}
