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
