import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RegionsView from '@/views/RegionsView.vue'
import ProfileView from '@/views/ProfileView.vue'

describe.each([
  { name: 'RegionsView', component: RegionsView, heading: 'Regiones' },
  { name: 'ProfileView', component: ProfileView, heading: 'Perfil' },
])('$name', ({ component, heading }) => {
  it('muestra el placeholder de construcción', () => {
    const wrapper = mount(component)

    expect(wrapper.text()).toContain('¡Muy pronto disponible!')
    expect(wrapper.find('.empty-state__image').attributes('src')).toContain('jigglypuff')
  })

  it(`tiene un h1 accesible con el nombre de la sección (${heading})`, () => {
    const wrapper = mount(component)
    const h1 = wrapper.find('h1')

    expect(h1.text()).toBe(heading)
    // No se ve en el diseño, pero la página no puede quedar sin encabezado.
    expect(h1.classes()).toContain('visually-hidden')
  })
})
