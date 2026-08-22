import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useBreakpoint } from '@/composables/useBreakpoint'

function setWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width })
  window.dispatchEvent(new Event('resize'))
}

function mountWithBreakpoint() {
  let breakpoint!: ReturnType<typeof useBreakpoint>

  const TestComponent = defineComponent({
    setup() {
      breakpoint = useBreakpoint()
      return () => h('div')
    },
  })

  const wrapper = mount(TestComponent)
  return { wrapper, ...breakpoint }
}

afterEach(() => {
  setWidth(1024)
})

describe('useBreakpoint', () => {
  it('isDesktop es true desde 992px', () => {
    setWidth(992)
    const { isDesktop } = mountWithBreakpoint()

    expect(isDesktop.value).toBe(true)
  })

  it('isDesktop es false por debajo de 992px', () => {
    setWidth(800)
    const { isDesktop } = mountWithBreakpoint()

    expect(isDesktop.value).toBe(false)
  })

  it('isWide es true desde 1200px', () => {
    setWidth(1200)
    const { isWide, isDesktop } = mountWithBreakpoint()

    expect(isWide.value).toBe(true)
    expect(isDesktop.value).toBe(true)
  })

  it('isWide es false entre 992 y 1199px', () => {
    setWidth(1100)
    const { isWide, isDesktop } = mountWithBreakpoint()

    expect(isDesktop.value).toBe(true)
    expect(isWide.value).toBe(false)
  })

  it('reacciona a un resize después de montar', () => {
    setWidth(500)
    const { isDesktop } = mountWithBreakpoint()
    expect(isDesktop.value).toBe(false)

    setWidth(1300)

    expect(isDesktop.value).toBe(true)
  })
})
