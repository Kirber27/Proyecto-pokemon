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

/**
 * Tiempo mínimo de la splash en pantalla. Sin esto dura exactamente lo que tarde el
 * índice: con la API rápida o el store ya cargado, la Pokébola aparecía unos pocos
 * milisegundos y en la práctica no se veía. El diseño la trata como una precarga con
 * presencia propia, no como un parpadeo.
 */
const MIN_VISIBLE_MS = 1200

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function preload(): Promise<void> {
  // En paralelo, no en secuencia: la espera mínima no se suma al tiempo de carga,
  // solo pone un piso. Si el índice tarda más de 1200 ms, manda el índice.
  await Promise.all([pokemonStore.loadIndex(), delay(MIN_VISIBLE_MS)])

  // CA-09.1: si falla, se queda en esta pantalla con el botón de Reintentar.
  if (pokemonStore.indexStatus === 'error') return

  // CA-01.2 / diseño §7: redirige según si ya vio el onboarding.
  await router.push(uiStore.onboardingSeen ? { name: 'pokedex' } : { name: 'onboarding' })
}

onMounted(preload)
</script>

<template>
  <div class="splash-view">
    <PokeballSpinner size="128px" />

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
