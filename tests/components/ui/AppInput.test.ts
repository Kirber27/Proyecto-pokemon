import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppInput from '@/components/ui/AppInput.vue'

describe('AppInput', () => {
  it('reflects the v-model value', async () => {
    const wrapper = mount(AppInput, { props: { modelValue: 'pika' } })
    const input = wrapper.find('input')

    expect(input.element.value).toBe('pika')

    await input.setValue('char')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['char'])
  })

  it('applies placeholder and disabled', () => {
    const wrapper = mount(AppInput, {
      props: { placeholder: 'Busca un Pokémon', disabled: true },
    })
    const input = wrapper.find('input')

    expect(input.attributes('placeholder')).toBe('Busca un Pokémon')
    expect(input.attributes('disabled')).toBeDefined()
  })
})
