import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from '@/App.vue'
import { routes } from '@/router'

describe('App', () => {
  it('renders without crashing', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })

    const wrapper = mount(App, {
      global: { plugins: [createPinia(), router] },
    })
    await router.isReady()

    expect(wrapper.exists()).toBe(true)
  })
})
