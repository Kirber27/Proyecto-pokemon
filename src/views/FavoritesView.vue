<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '@/stores/useFavoritesStore'
import { usePokemonStore } from '@/stores/usePokemonStore'
import FavoriteCard from '@/components/pokemon/FavoriteCard.vue'
import EmptyState from '@/components/feedback/EmptyState.vue'
import PokeballSpinner from '@/components/ui/PokeballSpinner.vue'
import IconBack from '@/assets/icons/IconBack.vue'
import magikarp from '@/assets/images/magikarp.png'

const favoritesStore = useFavoritesStore()
const pokemonStore = usePokemonStore()
const router = useRouter()

// Destino explícito, igual que el botón del detalle: Favoritos es un tab de primer
// nivel y router.back() podría salirse de la app en un deep link o tras un F5.
function goBack(): void {
  router.push({ name: 'pokedex' })
}

// Hay ids guardados pero el índice (para cruzarlos) todavía no está — evita mostrar
// "sin favoritos" un instante antes de que aparezcan de verdad (deep link a /favorites).
const resolvingStoredFavorites = computed(
  () => favoritesStore.ids.size > 0 && pokemonStore.indexStatus !== 'ready',
)

// Hidrata tipos/gradiente de los favoritos — la lista es acotada, no hace falta virtualizar.
function hydrateFavorites(): void {
  pokemonStore.ensureDetails(favoritesStore.favoritePokemon.map((item) => item.name))
}

onMounted(() => {
  // favoritePokemon cruza los ids con el índice: sin este load, un F5 o un deep link
  // directo a /favorites (sin haber pasado por /pokedex) mostraría "sin favoritos"
  // aunque sí haya ids guardados en localStorage.
  pokemonStore.loadIndex()
  hydrateFavorites()
})
watch(() => favoritesStore.favoritePokemon.length, hydrateFavorites)
</script>

<template>
  <div class="favorites-view">
    <header class="favorites-view__header">
      <button type="button" class="favorites-view__back" aria-label="Volver" @click="goBack">
        <IconBack />
      </button>
      <h1 class="favorites-view__title">Favoritos</h1>
    </header>

    <div v-if="resolvingStoredFavorites" class="favorites-view__state">
      <PokeballSpinner size="40px" />
    </div>

    <EmptyState
      v-else-if="favoritesStore.favoritePokemon.length === 0"
      class="favorites-view__empty"
      :image="magikarp"
      title="No has marcado ningún Pokémon como favorito"
      message="Haz clic en el ícono de corazón de tus Pokémon favoritos y aparecerán aquí."
    />

    <div v-else class="favorites-view__list">
      <FavoriteCard
        v-for="item in favoritesStore.favoritePokemon"
        :key="item.id"
        :summary="item"
        :detail="pokemonStore.details.get(item.name)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.favorites-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
}

// El título va centrado en el header y el botón anclado a la izquierda: por eso el
// botón sale del flujo, si no el título quedaría corrido por el ancho del botón.
.favorites-view__header {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  // Reserva el espacio del botón a ambos lados para que un título largo no se le encime.
  padding-inline: 44px;
  margin-bottom: 16px;
}

.favorites-view__back {
  position: absolute;
  left: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  color: tokens.$text-primary;
  cursor: pointer;

  @include mixins.focus-ring;
}

// IconBack no trae width/height propios: sin esto el svg se estira a los 36px del botón.
.favorites-view__back svg {
  width: 20px;
  height: 20px;
}

.favorites-view__title {
  margin: 0;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-section-title;
  font-weight: tokens.$font-weight-bold;
  text-align: center;
}

.favorites-view__list {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

// Ocupa el espacio sobrante para quedar centrado verticalmente, como en el diseño.
.favorites-view__empty {
  flex: 1 1 auto;
  justify-content: center;
}

.favorites-view__state {
  display: flex;
  justify-content: center;
  padding: 32px 0;
}
</style>
