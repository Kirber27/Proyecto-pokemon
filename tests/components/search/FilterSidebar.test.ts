import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import FilterSidebar from '@/components/search/FilterSidebar.vue'
import { useUiStore } from '@/stores/useUiStore'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('FilterSidebar', () => {
  it('aplica en vivo, sin borrador (CA-04.3)', async () => {
    const uiStore = useUiStore()
    const wrapper = mount(FilterSidebar)

    await wrapper.findAll('input[type="checkbox"]')[0]!.setValue(true) // 'normal'

    expect(uiStore.selectedTypes.has('normal')).toBe(true)
  })

  it('refleja la selección ya presente en el store', () => {
    const uiStore = useUiStore()
    uiStore.setSelectedTypes(['fire'])

    const wrapper = mount(FilterSidebar)
    const fireIndex = 1 // normal, fire — ver ALL_POKEMON_TYPES
    const checkbox = wrapper.findAll('input[type="checkbox"]')[fireIndex]

    expect((checkbox!.element as HTMLInputElement).checked).toBe(true)
  })
})
