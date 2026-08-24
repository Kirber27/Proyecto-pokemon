<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUiStore } from '@/stores/useUiStore'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import AppInput from '@/components/ui/AppInput.vue'
import IconSearch from '@/assets/icons/IconSearch.vue'
import IconFilter from '@/assets/icons/IconFilter.vue'

withDefaults(
  defineProps<{
    showFilterButton?: boolean
  }>(),
  {
    showFilterButton: true,
  },
)

const emit = defineEmits<{
  'toggle-filter': []
}>()

const uiStore = useUiStore()

const rawQuery = ref(uiStore.query)
// CA-03.2: filtra en cliente sobre el índice en memoria, con debounce de 250ms.
const debouncedQuery = useDebouncedRef(uiStore.query, 250)

watch(rawQuery, (value) => {
  debouncedQuery.value = value
})

watch(debouncedQuery, (value) => {
  uiStore.setQuery(value)
})
</script>

<template>
  <div class="search-bar">
    <div class="search-bar__field">
      <IconSearch class="search-bar__icon" />
      <AppInput
        v-model="rawQuery"
        type="search"
        placeholder="Buscar Pokémon..."
        aria-label="Buscar Pokémon"
        class="search-bar__input"
      />
    </div>
    <button
      v-if="showFilterButton"
      type="button"
      class="search-bar__filter"
      aria-label="Filtrar por tipo"
      @click="emit('toggle-filter')"
    >
      <IconFilter />
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

// Ancla la lupa: sin position aquí, el icono absoluto caía en su static position
// y el padding del input no lo compensaba.
.search-bar__field {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  min-width: 0;
}

.search-bar__icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: tokens.$text-secondary;
  pointer-events: none;
}

// :deep() desde el contenedor, no desde el propio input: la clase del componente
// aterriza en el mismo <input>, así que un descendiente nunca hacía match.
.search-bar__field :deep(.app-input) {
  padding-left: 40px;
}

.search-bar__filter {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid tokens.$border;
  border-radius: 50%;
  background-color: tokens.$surface;
  color: tokens.$text-primary;
  cursor: pointer;

  @include mixins.focus-ring;
}
</style>
