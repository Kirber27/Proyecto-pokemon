import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { DOMWrapper, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import FilterSheet from '@/components/search/FilterSheet.vue'
import { useUiStore } from '@/stores/useUiStore'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

afterEach(() => {
  document.body.innerHTML = ''
})

// FilterSheet usa <Teleport to="body">: su contenido queda fuera del árbol que
// wrapper.find() recorre, así que se consulta document.body directamente.
function bodyFindAll(selector: string) {
  return [...document.body.querySelectorAll(selector)].map((el) => new DOMWrapper(el))
}

function bodyFind(selector: string) {
  const el = document.body.querySelector(selector)
  if (!el) throw new Error(`No se encontró "${selector}" en document.body`)
  return new DOMWrapper(el)
}

describe('FilterSheet', () => {
  it('no renderiza nada cuando open es false', () => {
    mount(FilterSheet, { props: { open: false }, attachTo: document.body })

    expect(document.body.querySelector('.filter-sheet')).toBeNull()
  })

  it('Cancelar descarta los cambios sin tocar el store (CA-04.2)', async () => {
    const uiStore = useUiStore()
    const wrapper = mount(FilterSheet, { props: { open: true }, attachTo: document.body })

    await bodyFindAll('input[type="checkbox"]')[0]!.setValue(true) // 'normal'
    await bodyFind('.app-button--secondary').trigger('click') // Cancelar

    expect(uiStore.selectedTypes.size).toBe(0)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('Aplicar guarda el borrador en el store (CA-04.1)', async () => {
    const uiStore = useUiStore()
    const wrapper = mount(FilterSheet, { props: { open: true }, attachTo: document.body })

    await bodyFindAll('input[type="checkbox"]')[0]!.setValue(true) // 'normal'
    await bodyFind('.app-button--primary').trigger('click') // Aplicar

    expect(uiStore.selectedTypes.has('normal')).toBe(true)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('el botón cerrar (X) también descarta los cambios', async () => {
    const uiStore = useUiStore()
    mount(FilterSheet, { props: { open: true }, attachTo: document.body })

    await bodyFindAll('input[type="checkbox"]')[0]!.setValue(true)
    await bodyFind('.filter-sheet__close').trigger('click')

    expect(uiStore.selectedTypes.size).toBe(0)
  })

  it('el borrador arranca con la selección actual del store al abrir', () => {
    const uiStore = useUiStore()
    uiStore.setSelectedTypes(['water'])

    mount(FilterSheet, { props: { open: true }, attachTo: document.body })
    const waterIndex = 2 // normal, fire, water — ver ALL_POKEMON_TYPES
    const checkbox = bodyFindAll('input[type="checkbox"]')[waterIndex]

    expect((checkbox!.element as HTMLInputElement).checked).toBe(true)
  })
})
