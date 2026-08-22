export type PoolTask<T> = () => Promise<T>

/**
 * Corredor de tareas asíncronas con un máximo de `limit` en vuelo a la vez.
 * Si una tarea falla, el error se propaga al llamador (sin cancelar las demás).
 */
export function useConcurrencyPool(limit: number) {
  return async function run<T>(tasks: PoolTask<T>[]): Promise<T[]> {
    const results: T[] = new Array(tasks.length)
    let cursor = 0

    async function worker(): Promise<void> {
      while (cursor < tasks.length) {
        const index = cursor++
        const task = tasks[index]

        if (task) {
          results[index] = await task()
        }
      }
    }

    const workerCount = Math.min(limit, tasks.length)
    await Promise.all(Array.from({ length: workerCount }, () => worker()))

    return results
  }
}
