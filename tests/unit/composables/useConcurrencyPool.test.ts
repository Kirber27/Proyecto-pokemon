import { describe, expect, it } from 'vitest'
import { useConcurrencyPool } from '@/composables/useConcurrencyPool'

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('useConcurrencyPool', () => {
  it('nunca corre más tareas que el límite a la vez', async () => {
    const run = useConcurrencyPool(3)

    let active = 0
    let peak = 0

    const tasks = Array.from({ length: 10 }, (_, i) => async () => {
      active++
      peak = Math.max(peak, active)
      await wait(10)
      active--
      return i
    })

    const results = await run(tasks)

    expect(peak).toBeLessThanOrEqual(3)
    expect(results).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('propaga el error de una tarea al llamador', async () => {
    const run = useConcurrencyPool(2)

    const tasks = [
      async () => 1,
      async () => {
        throw new Error('boom')
      },
      async () => 3,
    ]

    await expect(run(tasks)).rejects.toThrow('boom')
  })

  it('resuelve de inmediato cuando no hay tareas', async () => {
    const run = useConcurrencyPool(4)

    await expect(run([])).resolves.toEqual([])
  })

  it('funciona con un límite mayor que la cantidad de tareas', async () => {
    const run = useConcurrencyPool(10)

    const results = await run([async () => 'a', async () => 'b'])

    expect(results).toEqual(['a', 'b'])
  })
})
