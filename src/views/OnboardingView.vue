<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/useUiStore'
import AppButton from '@/components/ui/AppButton.vue'
import onboarding1 from '@/assets/images/onboarding-1.png'
import onboarding2 from '@/assets/images/onboarding-2.png'

interface OnboardingStep {
  title: string
  subtitle: string
  image: string
  imageAlt: string
  cta: string
}

const steps: OnboardingStep[] = [
  {
    title: 'Todos los Pokémon en un solo lugar',
    subtitle:
      'Accede a una amplia lista de Pokémon de todas las generaciones creadas por Nintendo',
    image: onboarding1,
    imageAlt: 'Un entrenador con una red y el profesor Pokémon, listos para explorar',
    cta: 'Continuar',
  },
  {
    title: 'Mantén tu Pokédex actualizada',
    subtitle:
      'Regístrate y guarda tu perfil, Pokémon favoritos, configuraciones y mucho más en la aplicación',
    image: onboarding2,
    imageAlt: 'Una entrenadora Pokémon saludando',
    cta: 'Empecemos',
  },
]

const uiStore = useUiStore()
const router = useRouter()

const currentStep = ref(0)
const isLastStep = computed(() => currentStep.value === steps.length - 1)
const step = computed(() => steps[currentStep.value]!)

function next(): void {
  if (isLastStep.value) {
    uiStore.markOnboardingSeen()
    router.push({ name: 'pokedex' })
    return
  }

  currentStep.value++
}
</script>

<template>
  <div class="onboarding-view">
    <div class="onboarding-view__card">
      <Transition name="onboarding-fade" mode="out-in">
        <div :key="currentStep" class="onboarding-view__step">
          <div class="onboarding-view__illustration">
            <img
              :src="step.image"
              :alt="step.imageAlt"
              class="onboarding-view__image"
              width="342"
              height="270"
              decoding="async"
            />
          </div>

          <h1 class="onboarding-view__title">{{ step.title }}</h1>
          <p class="onboarding-view__subtitle">{{ step.subtitle }}</p>
        </div>
      </Transition>

      <div class="onboarding-view__dots" aria-hidden="true">
        <span
          v-for="(_, index) in steps"
          :key="index"
          class="onboarding-view__dot"
          :class="{ 'onboarding-view__dot--active': index === currentStep }"
        />
      </div>
      <p class="visually-hidden" aria-live="polite">
        Paso {{ currentStep + 1 }} de {{ steps.length }}
      </p>

      <AppButton class="onboarding-view__cta" @click="next">
        {{ step.cta }}
      </AppButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:map';
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.onboarding-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: map.get(tokens.$spacers, 6);
  background-color: tokens.$bg;

  @include mixins.media-up(lg) {
    background-color: tokens.$bg-desktop;
  }
}

.onboarding-view__card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 360px;
  padding: map.get(tokens.$spacers, 6) map.get(tokens.$spacers, 5);
  background-color: tokens.$surface;

  @include mixins.media-up(lg) {
    padding: map.get(tokens.$spacers, 8);
    border-radius: tokens.$radius-card;
    box-shadow: tokens.$shadow-card;
  }
}

// Agrupa lo que cambia entre pasos para que la transición sea de la tarjeta
// completa; los dots y el CTA quedan fuera y no parpadean al avanzar.
.onboarding-view__step {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.onboarding-view__illustration {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  // Alto fijo: las dos ilustraciones tienen proporciones distintas y sin esto
  // el título saltaría verticalmente al cambiar de paso.
  height: 260px;
  margin-bottom: map.get(tokens.$spacers, 7);
}

.onboarding-view__image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  // Preserva el pixel art del sprite en pantallas de alta densidad.
  image-rendering: pixelated;
}

.onboarding-view__title {
  margin: 0 0 map.get(tokens.$spacers, 3);
  font-size: tokens.$font-size-onboarding-title;
  font-weight: tokens.$font-weight-bold;
  line-height: tokens.$line-height-tight;
  text-align: center;
  text-wrap: balance;
  color: tokens.$text-primary;
}

.onboarding-view__subtitle {
  margin: 0;
  font-size: tokens.$font-size-body;
  line-height: tokens.$line-height-base;
  text-align: center;
  text-wrap: pretty;
  color: tokens.$text-secondary;
}

.onboarding-view__dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: map.get(tokens.$spacers, 2);
  margin: map.get(tokens.$spacers, 7) 0;
}

.onboarding-view__dot {
  width: 8px;
  height: 8px;
  border-radius: tokens.$radius-pill;
  background-color: tokens.$border;
  transition:
    width 0.25s ease,
    background-color 0.25s ease;
}

// El paso activo se marca con una píldora alargada, no con un círculo lleno.
.onboarding-view__dot--active {
  width: 24px;
  background-color: tokens.$primary;
}

.onboarding-view__cta {
  width: 100%;
  padding-block: map.get(tokens.$spacers, 4);
}

.onboarding-fade-enter-active,
.onboarding-fade-leave-active {
  transition: opacity 0.2s ease;
}

.onboarding-fade-enter-from,
.onboarding-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .onboarding-view__dot,
  .onboarding-fade-enter-active,
  .onboarding-fade-leave-active {
    transition: none;
  }
}
</style>
