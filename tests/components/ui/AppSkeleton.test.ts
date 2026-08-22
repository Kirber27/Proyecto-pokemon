import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'

describe('AppSkeleton', () => {
  it('is hidden from assistive tech', () => {
    const wrapper = mount(AppSkeleton)

    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('applies the given dimensions', () => {
    const wrapper = mount(AppSkeleton, { props: { width: '200px', height: '24px' } })

    expect(wrapper.attributes('style')).toContain('width: 200px')
    expect(wrapper.attributes('style')).toContain('height: 24px')
  })
})
