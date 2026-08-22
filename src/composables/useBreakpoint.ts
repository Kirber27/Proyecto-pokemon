import { computed, onMounted, onUnmounted, ref } from 'vue'

// Coinciden con $breakpoints (design-system.md): lg conmuta tab bar ↔ top nav,
// xl activa el panel de detalle fijo del master-detail.
const DESKTOP_MIN_WIDTH = 992
const WIDE_MIN_WIDTH = 1200

export function useBreakpoint() {
  const width = ref(window.innerWidth)

  function onResize(): void {
    width.value = window.innerWidth
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  const isDesktop = computed(() => width.value >= DESKTOP_MIN_WIDTH)
  const isWide = computed(() => width.value >= WIDE_MIN_WIDTH)

  return { width, isDesktop, isWide }
}
