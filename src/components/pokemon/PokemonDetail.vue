<script setup lang="ts">
import { computed } from 'vue'
import PokemonTypeChip from '@/components/pokemon/PokemonTypeChip.vue'
import FavoriteButton from '@/components/pokemon/FavoriteButton.vue'
import ShareButton from '@/components/pokemon/ShareButton.vue'
import StatCard from '@/components/pokemon/StatCard.vue'
import GenderBar from '@/components/pokemon/GenderBar.vue'
import IconBack from '@/assets/icons/IconBack.vue'
import { formatHeightM, formatWeightKg } from '@/utils/formatters'
import type { PokemonDetail } from '@/types/domain'

const props = defineProps<{
  detail: PokemonDetail
}>()

const emit = defineEmits<{
  close: []
}>()

const primaryType = computed(() => props.detail.types[0])
const primaryAbility = computed(() => props.detail.abilities[0])
</script>

<template>
  <article class="pokemon-detail" :data-type="primaryType">
    <header class="pokemon-detail__hero">
      <button type="button" class="pokemon-detail__back" aria-label="Volver" @click="emit('close')">
        <IconBack />
      </button>

      <div class="pokemon-detail__hero-actions">
        <FavoriteButton :pokemon-id="detail.id" />
        <ShareButton :detail="detail" />
      </div>

      <img
        :src="detail.artworkUrl"
        :alt="detail.displayName"
        class="pokemon-detail__sprite"
        loading="lazy"
        decoding="async"
        width="160"
        height="160"
      />
    </header>

    <div class="pokemon-detail__body">
      <h1 class="pokemon-detail__name">{{ detail.displayName }}</h1>
      <span class="pokemon-detail__number">{{ detail.number }}</span>

      <div class="pokemon-detail__types">
        <PokemonTypeChip v-for="type in detail.types" :key="type" :type="type" />
      </div>

      <p v-if="detail.description" class="pokemon-detail__description">
        {{ detail.description }}
      </p>

      <div class="pokemon-detail__stats">
        <StatCard label="Peso" :value="formatWeightKg(detail.weightKg)" />
        <StatCard label="Altura" :value="formatHeightM(detail.heightM)" />
        <StatCard v-if="detail.category" label="Categoría" :value="detail.category" />
        <StatCard v-if="primaryAbility" label="Habilidad" :value="primaryAbility" />
      </div>

      <GenderBar v-if="detail.genderRatio" :ratio="detail.genderRatio" class="pokemon-detail__gender" />

      <section v-if="detail.weaknesses?.length" class="pokemon-detail__weaknesses">
        <h2 class="pokemon-detail__section-title">Debilidades</h2>
        <div class="pokemon-detail__weakness-chips">
          <PokemonTypeChip v-for="type in detail.weaknesses" :key="type" :type="type" />
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.pokemon-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  background-color: tokens.$surface;

  // El mixin va acá, en el mismo elemento que lleva data-type. Estaba en __hero, que
  // no tiene el atributo, así que el selector no hacía match y el hero se quedaba
  // siempre con el gris del fallback en vez del color del tipo.
  @include mixins.type-theme-variants;
  @include mixins.type-glyph-variants;
}

.pokemon-detail__hero {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 20px;
  // Tono saturado del tipo (--type-art-to): el mismo que va detrás del sprite en el
  // panel de arte de PokemonCard, no el claro que tiñe el fondo de la card.
  background-color: var(--type-art-to, #{tokens.$bg-desktop});
  overflow: hidden;

  &::before {
    @include mixins.type-glyph-watermark(35%);
  }
}

.pokemon-detail__back,
.pokemon-detail__hero-actions {
  position: absolute;
  top: 16px;
}

.pokemon-detail__back {
  left: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background-color: tokens.$surface;
  color: tokens.$text-primary;
  cursor: pointer;

  @include mixins.focus-ring;
}

.pokemon-detail__hero-actions {
  right: 16px;
  display: flex;
  gap: 8px;
}

.pokemon-detail__sprite {
  // Por encima del ::before de la marca de agua.
  position: relative;
  z-index: 1;
  width: 160px;
  height: 160px;
  object-fit: contain;
}

.pokemon-detail__body {
  flex: 1 1 auto;
  padding: 20px;
}

.pokemon-detail__number {
  display: block;
  margin-bottom: 12px;
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-caption;
  font-weight: tokens.$font-weight-medium;
}

.pokemon-detail__name {
  margin: 0 0 4px;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-detail-name;
  font-weight: tokens.$font-weight-bold;
}

.pokemon-detail__types {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.pokemon-detail__description {
  margin: 0 0 20px;
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-body;
  line-height: tokens.$line-height-base;
}

.pokemon-detail__stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.pokemon-detail__gender {
  margin-bottom: 20px;
}

.pokemon-detail__section-title {
  margin: 0 0 12px;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-section-title;
  font-weight: tokens.$font-weight-semibold;
}

.pokemon-detail__weakness-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
