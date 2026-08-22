// jsdom 30 delega `localStorage` a la implementación nativa de Node, que vive detrás del flag
// experimental `--localstorage-file`. Sin el flag, el global no existe. Como no queremos atar
// los tests a un archivo en disco ni a flags de Node, se polyfillea en memoria.
class MemoryStorage implements Storage {
  private readonly store = new Map<string, string>()

  get length(): number {
    return this.store.size
  }

  clear(): void {
    this.store.clear()
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value))
  }
}

if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = new MemoryStorage()
}
