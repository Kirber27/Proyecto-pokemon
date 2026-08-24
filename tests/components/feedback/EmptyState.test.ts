import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '@/components/feedback/EmptyState.vue'

describe('EmptyState', () => {
  it('muestra título y mensaje', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Sin resultados', message: 'Prueba con otro término.' },
    })

    expect(wrapper.text()).toContain('Sin resultados')
    expect(wrapper.text()).toContain('Prueba con otro término.')
  })

  it('usa el placeholder SVG cuando no se pasa una imagen', () => {
    const wrapper = mount(EmptyState, { props: { title: 'Sin resultados' } })

    expect(wrapper.find('.empty-state__illustration').exists()).toBe(true)
    expect(wrapper.find('.empty-state__image').exists()).toBe(false)
  })

  it('muestra la ilustración y reemplaza al SVG cuando se pasa una imagen', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Sin favoritos', image: '/magikarp.png', imageAlt: 'Un Magikarp' },
    })

    const img = wrapper.find('.empty-state__image')
    expect(img.attributes('src')).toBe('/magikarp.png')
    expect(img.attributes('alt')).toBe('Un Magikarp')
    expect(wrapper.find('.empty-state__illustration').exists()).toBe(false)
  })

  it('trata la ilustración como decorativa si no se da un alt', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Sin favoritos', image: '/magikarp.png' },
    })

    expect(wrapper.find('.empty-state__image').attributes('alt')).toBe('')
  })

  it('no muestra el bloque de acción si no hay slot', () => {
    const wrapper = mount(EmptyState, { props: { title: 'Sin resultados' } })

    expect(wrapper.find('.empty-state__action').exists()).toBe(false)
  })

  it('muestra el slot de acción cuando se provee', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Algo salió mal…' },
      slots: { action: '<button>Reintentar</button>' },
    })

    expect(wrapper.find('.empty-state__action').text()).toBe('Reintentar')
  })
})
