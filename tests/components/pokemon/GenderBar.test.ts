import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import GenderBar from '@/components/pokemon/GenderBar.vue'

describe('GenderBar', () => {
  it('muestra el título de la sección', () => {
    const wrapper = mount(GenderBar, { props: { ratio: { male: 50, female: 50 } } })

    expect(wrapper.find('.gender-bar__title').text()).toBe('Género')
  })

  // gender_rate es n/8: redondear a entero convertía el 87,5 % del diseño en 88 %.
  it('conserva el medio punto porcentual en vez de redondear', () => {
    const wrapper = mount(GenderBar, { props: { ratio: { male: 87.5, female: 12.5 } } })

    expect(wrapper.text()).toContain('♂ 87,5%')
    expect(wrapper.text()).toContain('♀ 12,5%')
  })

  it('no arrastra decimales inútiles en los valores enteros', () => {
    const wrapper = mount(GenderBar, { props: { ratio: { male: 50, female: 50 } } })

    expect(wrapper.text()).toContain('♂ 50%')
    expect(wrapper.text()).not.toContain('50,0%')
  })

  it('describe el reparto a lectores de pantalla', () => {
    const wrapper = mount(GenderBar, { props: { ratio: { male: 87.5, female: 12.5 } } })

    expect(wrapper.find('.gender-bar__track').attributes('aria-label')).toBe(
      'Género: 87,5% macho, 12,5% hembra',
    )
  })

  it('el ancho de cada segmento refleja el porcentaje', () => {
    const wrapper = mount(GenderBar, { props: { ratio: { male: 25, female: 75 } } })

    expect(wrapper.find('.gender-bar__male').attributes('style')).toContain('width: 25%')
    expect(wrapper.find('.gender-bar__female').attributes('style')).toContain('width: 75%')
  })
})
