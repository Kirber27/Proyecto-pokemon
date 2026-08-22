import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import PokemonGrid from '@/components/pokemon/PokemonGrid.vue'
import type { PokemonSummary } from '@/types/domain'

function buildItems(count: number): PokemonSummary[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `pokemon-${i + 1}`,
    displayName: `Pokemon ${i + 1}`,
    number: `Nº${i + 1}`,
    artworkUrl: `${i + 1}.png`,
  }))
}

function setWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width })
  window.dispatchEvent(new Event('resize'))
}

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/pokedex/:name', name: 'pokedex-detail', component: { template: '<div />' } },
    ],
  })
}

async function mountGrid(items: PokemonSummary[], clientHeight = 800) {
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    value: clientHeight,
  })

  const router = buildRouter()
  await router.push('/')

  return mount(PokemonGrid, {
    props: { items, details: new Map() },
    global: { plugins: [router] },
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
  setWidth(1024)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('PokemonGrid', () => {
  it('con 1300 ítems, el DOM no contiene todas las cards (virtualizado, CA-02.3)', async () => {
    const wrapper = await mountGrid(buildItems(1300))

    const rendered = wrapper.findAllComponents({ name: 'PokemonCard' })
    expect(rendered.length).toBeGreaterThan(0)
    expect(rendered.length).toBeLessThan(60)
  })

  it('usa 3 columnas en desktop (≥992px)', async () => {
    setWidth(1200)
    const wrapper = await mountGrid(buildItems(10))

    expect(wrapper.find('.pokemon-grid__visible').attributes('style')).toContain(
      'grid-template-columns: repeat(3, 1fr)',
    )
  })

  it('usa 1 columna en mobile (<576px)', async () => {
    setWidth(400)
    const wrapper = await mountGrid(buildItems(10))

    expect(wrapper.find('.pokemon-grid__visible').attributes('style')).toContain(
      'grid-template-columns: repeat(1, 1fr)',
    )
  })

  it('emite @visible con los nombres renderizados, debounced 100ms', async () => {
    vi.useFakeTimers()
    const wrapper = await mountGrid(buildItems(10))

    await vi.advanceTimersByTimeAsync(100)

    const emitted = wrapper.emitted('visible')
    expect(emitted).toBeTruthy()
    const lastNames = emitted![emitted!.length - 1]![0] as string[]
    expect(lastNames.length).toBeGreaterThan(0)
    expect(lastNames).toContain('pokemon-1')
  })
})
