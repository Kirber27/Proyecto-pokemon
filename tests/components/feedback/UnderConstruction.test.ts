import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UnderConstruction from '@/components/feedback/UnderConstruction.vue'

describe('UnderConstruction', () => {
  it('muestra el mensaje del diseño', () => {
    const wrapper = mount(UnderConstruction)

    expect(wrapper.text()).toContain('¡Muy pronto disponible!')
    expect(wrapper.text()).toContain('Estamos trabajando para traerte esta sección.')
  })

  it('usa la ilustración de Jigglypuff, marcada como decorativa', () => {
    const wrapper = mount(UnderConstruction)

    const img = wrapper.find('.empty-state__image')
    expect(img.attributes('src')).toContain('jigglypuff')
    expect(img.attributes('alt')).toBe('')
  })
})
