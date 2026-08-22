import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import GenderBar from '@/components/pokemon/GenderBar.vue'

describe('GenderBar', () => {
  it('muestra los porcentajes redondeados de macho y hembra', () => {
    const wrapper = mount(GenderBar, { props: { ratio: { male: 87.5, female: 12.5 } } })

    expect(wrapper.text()).toContain('♂ 88%')
    expect(wrapper.text()).toContain('♀ 13%')
  })

  it('el ancho de cada segmento refleja el porcentaje', () => {
    const wrapper = mount(GenderBar, { props: { ratio: { male: 25, female: 75 } } })

    expect(wrapper.find('.gender-bar__male').attributes('style')).toContain('width: 25%')
    expect(wrapper.find('.gender-bar__female').attributes('style')).toContain('width: 75%')
  })
})
