<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePokemonDetailLoader } from '@/composables/usePokemonDetailLoader'
import PokemonDetail from '@/components/pokemon/PokemonDetail.vue'
import PokeballSpinner from '@/components/ui/PokeballSpinner.vue'
import AppButton from '@/components/ui/AppButton.vue'

const route = useRoute()
const router = useRouter()

const name = computed(() => (typeof route.params.name === 'string' ? route.params.name : undefined))
const { detail, status, reload } = usePokemonDetailLoader(name)

function close(): void {
  router.push({ name: 'pokedex' })
}
</script>

<template>
  <div class="pokemon-detail-view">
    <div v-if="status === 'loading' || status === 'idle'" class="pokemon-detail-view__state">
      <PokeballSpinner size="48px" />
    </div>

    <div v-else-if="status === 'error'" class="pokemon-detail-view__state">
      <p class="pokemon-detail-view__error-text">Algo salió mal…</p>
      <div class="pokemon-detail-view__actions">
        <AppButton variant="secondary" @click="close">Volver</AppButton>
        <AppButton @click="reload">Reintentar</AppButton>
      </div>
    </div>

    <PokemonDetail v-else-if="detail" :detail="detail" @close="close" />
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;

.pokemon-detail-view {
  height: 100%;
}

.pokemon-detail-view__state {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.pokemon-detail-view__error-text {
  margin: 0;
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-body;
}

.pokemon-detail-view__actions {
  display: flex;
  gap: 12px;
}
</style>
