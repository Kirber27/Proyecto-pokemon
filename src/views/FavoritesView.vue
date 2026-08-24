<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useFavoritesStore } from '@/stores/useFavoritesStore'
import { usePokemonStore } from '@/stores/usePokemonStore'
import FavoriteCard from '@/components/pokemon/FavoriteCard.vue'
import EmptyState from '@/components/feedback/EmptyState.vue'
import PokeballSpinner from '@/components/ui/PokeballSpinner.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import magikarp from '@/assets/images/magikarp.png'

const favoritesStore = useFavoritesStore()
const pokemonStore = usePokemonStore()

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
    <PageHeader title="Favoritos" />

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

// Mismos cortes que la grilla de la Pokédex (PokemonGrid): <576 → 1 columna,
// 576–991 → 2, ≥992 → 3. La lista de favoritos es acotada, así que basta CSS:
// no necesita el virtualizador.
.favorites-view__list {
  display: grid;
  flex: 1 1 auto;
  min-height: 0;
  grid-template-columns: 1fr;
  // Sin esto las filas se estirarían a repartir el alto sobrante cuando hay pocas.
  align-content: start;
  gap: 16px;
  overflow-y: auto;

  @include mixins.media-up(sm) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mixins.media-up(lg) {
    grid-template-columns: repeat(3, 1fr);
  }
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
