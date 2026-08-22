<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePokemonStore } from '@/stores/usePokemonStore'
import { useUiStore } from '@/stores/useUiStore'
import PokeballSpinner from '@/components/ui/PokeballSpinner.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const pokemonStore = usePokemonStore()
const uiStore = useUiStore()

async function preload(): Promise<void> {
  await pokemonStore.loadIndex()

  // CA-09.1: si falla, se queda en esta pantalla con el botón de Reintentar.
  if (pokemonStore.indexStatus === 'error') return

  // CA-01.2 / diseño §7: redirige según si ya vio el onboarding.
  await router.push(uiStore.onboardingSeen ? { name: 'pokedex' } : { name: 'onboarding' })
}

onMounted(preload)
</script>

<template>
  <div class="splash-view">
    <PokeballSpinner size="64px" />

    <template v-if="pokemonStore.indexStatus === 'error'">
      <p class="splash-view__error">Algo salió mal…</p>
      <AppButton @click="preload">Reintentar</AppButton>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;

.splash-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 100vh;
  background-color: tokens.$bg;
}

.splash-view__error {
  margin: 0;
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-body;
}
</style>
