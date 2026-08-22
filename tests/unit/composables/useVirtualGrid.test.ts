import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useVirtualGrid } from '@/composables/useVirtualGrid'

describe('useVirtualGrid', () => {
  it('calcula el rango inicial (scrollTop 0) con overscan', () => {
    const { totalHeight, startIndex, endIndex, offsetTop } = useVirtualGrid({
      itemCount: 100,
      columns: 3,
      rowHeight: 200,
      scrollTop: 0,
      viewportHeight: 800,
      overscan: 4,
    })

    expect(totalHeight.value).toBe(34 * 200) // ceil(100/3) filas
    expect(startIndex.value).toBe(0)
    expect(endIndex.value).toBe(36) // (0 + 4 filas visibles + 8 de overscan) * 3 cols
    expect(offsetTop.value).toBe(0)
  })

  it('mueve el rango al hacer scroll', () => {
    const scrollTop = ref(1000)
    const { startIndex, endIndex, offsetTop } = useVirtualGrid({
      itemCount: 100,
      columns: 3,
      rowHeight: 200,
      scrollTop,
      viewportHeight: 800,
      overscan: 4,
    })

    // fila actual = floor(1000/200) = 5; startRow = 5-4 = 1
    expect(offsetTop.value).toBe(200)
    expect(startIndex.value).toBe(3)
    expect(endIndex.value).toBe(39)
  })

  it('recalcula reactivamente cuando cambia scrollTop', () => {
    const scrollTop = ref(0)
    const { startIndex } = useVirtualGrid({
      itemCount: 100,
      columns: 3,
      rowHeight: 200,
      scrollTop,
      viewportHeight: 800,
      overscan: 4,
    })

    expect(startIndex.value).toBe(0)

    scrollTop.value = 1000
    expect(startIndex.value).toBe(3)
  })

  it('nunca excede itemCount ni rowCount cerca del final', () => {
    const { startIndex, endIndex, totalHeight } = useVirtualGrid({
      itemCount: 10,
      columns: 3,
      rowHeight: 200,
      scrollTop: 100_000,
      viewportHeight: 800,
      overscan: 4,
    })

    expect(endIndex.value).toBe(10)
    expect(startIndex.value).toBeLessThanOrEqual(endIndex.value)
    expect(totalHeight.value).toBe(4 * 200) // ceil(10/3) = 4 filas
  })

  it('sin overscan, el rango es exactamente el viewport', () => {
    const { startIndex, endIndex } = useVirtualGrid({
      itemCount: 100,
      columns: 2,
      rowHeight: 100,
      scrollTop: 0,
      viewportHeight: 300,
      overscan: 0,
    })

    // 3 filas visibles exactas (ceil(300/100))
    expect(startIndex.value).toBe(0)
    expect(endIndex.value).toBe(6)
  })

  it('usa overscan 4 por defecto si no se especifica', () => {
    const withDefault = useVirtualGrid({
      itemCount: 100,
      columns: 1,
      rowHeight: 100,
      scrollTop: 1000,
      viewportHeight: 300,
    })
    const withExplicit4 = useVirtualGrid({
      itemCount: 100,
      columns: 1,
      rowHeight: 100,
      scrollTop: 1000,
      viewportHeight: 300,
      overscan: 4,
    })

    expect(withDefault.startIndex.value).toBe(withExplicit4.startIndex.value)
  })

  it('con 0 ítems no genera altura ni rango', () => {
    const { totalHeight, startIndex, endIndex } = useVirtualGrid({
      itemCount: 0,
      columns: 3,
      rowHeight: 200,
      scrollTop: 0,
      viewportHeight: 800,
    })

    expect(totalHeight.value).toBe(0)
    expect(startIndex.value).toBe(0)
    expect(endIndex.value).toBe(0)
  })
})
