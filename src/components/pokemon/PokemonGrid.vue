<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import PokemonCard from '@/components/pokemon/PokemonCard.vue'
import { useVirtualGrid } from '@/composables/useVirtualGrid'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { POKEMON_CARD_HEIGHT, POKEMON_GRID_GAP } from '@/components/pokemon/gridLayout'
import type { PokemonDetail, PokemonSummary } from '@/types/domain'

const props = defineProps<{
  items: PokemonSummary[]
  details: Map<string, PokemonDetail>
}>()

const emit = defineEmits<{
  visible: [names: string[]]
}>()

// Mismos breakpoints que design-system.md: <576 → 1 columna, 576–991 → 2, ≥992 → 3.
const { width } = useBreakpoint()
const columns = computed(() => (width.value >= 992 ? 3 : width.value >= 576 ? 2 : 1))

const containerRef = ref<HTMLElement>()
const scrollTop = ref(0)
const viewportHeight = ref(0)

function updateViewportHeight(): void {
  viewportHeight.value = containerRef.value?.clientHeight ?? 0
}

function onScroll(): void {
  scrollTop.value = containerRef.value?.scrollTop ?? 0
}

onMounted(() => {
  updateViewportHeight()
  window.addEventListener('resize', updateViewportHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewportHeight)
})

const rowHeight = POKEMON_CARD_HEIGHT + POKEMON_GRID_GAP

const { totalHeight, startIndex, endIndex, offsetTop } = useVirtualGrid({
  itemCount: () => props.items.length,
  columns,
  rowHeight,
  scrollTop,
  viewportHeight,
})

const visibleItems = computed(() => props.items.slice(startIndex.value, endIndex.value))

// CA-02.6: solo los nombres efectivamente visibles alimentan ensureDetails, debounced
// para no disparar una hidratación por cada pixel de scroll.
const debouncedNames = useDebouncedRef<string[]>([], 100)

watch(
  visibleItems,
  (items) => {
    debouncedNames.value = items.map((item) => item.name)
  },
  { immediate: true },
)

watch(debouncedNames, (names) => emit('visible', names))
</script>

<template>
  <div ref="containerRef" class="pokemon-grid" @scroll="onScroll">
    <div class="pokemon-grid__spacer" :style="{ height: `${totalHeight}px` }">
      <div
        class="pokemon-grid__visible"
        :style="{
          transform: `translateY(${offsetTop}px)`,
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${POKEMON_GRID_GAP}px`,
        }"
      >
        <PokemonCard
          v-for="item in visibleItems"
          :key="item.id"
          :summary="item"
          :detail="details.get(item.name)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pokemon-grid {
  height: 100%;
  overflow-y: auto;
}

.pokemon-grid__spacer {
  position: relative;
}

.pokemon-grid__visible {
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  width: 100%;
}
</style>
