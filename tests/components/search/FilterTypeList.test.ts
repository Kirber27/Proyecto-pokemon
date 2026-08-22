import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterTypeList from '@/components/search/FilterTypeList.vue'
import type { PokemonType } from '@/types/domain'

describe('FilterTypeList', () => {
  it('renderiza los 18 tipos como checkboxes', () => {
    const wrapper = mount(FilterTypeList, {
      props: { modelValue: new Set<PokemonType>() },
    })

    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(18)
  })

  it('refleja el modelValue en los checkboxes marcados', () => {
    const wrapper = mount(FilterTypeList, {
      props: { modelValue: new Set<PokemonType>(['fire']) },
    })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    const checked = checkboxes.filter((c) => (c.element as HTMLInputElement).checked)

    expect(checked).toHaveLength(1)
  })

  it('emite update:modelValue con el tipo agregado al marcar', async () => {
    const wrapper = mount(FilterTypeList, {
      props: { modelValue: new Set<PokemonType>() },
    })

    await wrapper.findAll('input[type="checkbox"]')[0]!.setValue(true)

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const next = emitted![0]![0] as Set<PokemonType>
    expect(next.has('normal')).toBe(true)
  })
})
