<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/useUiStore'
import AppButton from '@/components/ui/AppButton.vue'
import IconPokedex from '@/assets/icons/IconPokedex.vue'

interface OnboardingStep {
  title: string
  subtitle: string
}

const steps: OnboardingStep[] = [
  {
    title: 'Descubre el mundo Pokémon',
    subtitle:
      'Explora una Pokédex completa con todos los datos que necesitas, al alcance de la mano.',
  },
  {
    title: 'Guarda tus favoritos',
    subtitle:
      'Marca tus Pokémon favoritos y accede a ellos cuando quieras, desde cualquier dispositivo.',
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
      <div class="onboarding-view__illustration">
        <IconPokedex class="onboarding-view__illustration-icon" />
      </div>

      <div class="onboarding-view__content">
        <Transition name="onboarding-fade" mode="out-in">
          <div :key="currentStep">
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
        <p class="visually-hidden" aria-live="polite">Paso {{ currentStep + 1 }} de {{ steps.length }}</p>

        <AppButton class="onboarding-view__cta" @click="next">
          {{ isLastStep ? 'Empecemos' : 'Continuar' }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.onboarding-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background-color: tokens.$bg;
}

.onboarding-view__card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;

  @include mixins.media-up(lg) {
    flex-direction: row;
    align-items: center;
    gap: 40px;
    max-width: 960px;
    padding: 40px;
    border-radius: tokens.$radius-card;
    background-color: tokens.$surface;
    box-shadow: tokens.$shadow-card;
  }
}

.onboarding-view__illustration {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  margin-bottom: 24px;
  border-radius: tokens.$radius-card;
  background-color: tokens.$primary-soft;

  @include mixins.media-up(lg) {
    flex: 1 1 0;
    margin-bottom: 0;
  }
}

.onboarding-view__illustration-icon {
  width: 40%;
  height: 40%;
  color: tokens.$primary;
}

.onboarding-view__content {
  @include mixins.media-up(lg) {
    flex: 1 1 0;
  }
}

.onboarding-view__title {
  margin: 0 0 8px;
  font-size: tokens.$font-size-onboarding-title;
  font-weight: tokens.$font-weight-bold;
  line-height: tokens.$line-height-tight;
  color: tokens.$text-primary;
}

.onboarding-view__subtitle {
  margin: 0 0 24px;
  font-size: tokens.$font-size-body;
  line-height: tokens.$line-height-base;
  color: tokens.$text-secondary;
}

.onboarding-view__dots {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.onboarding-view__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: tokens.$border;
  transition: background-color 0.2s ease;
}

.onboarding-view__dot--active {
  background-color: tokens.$primary;
}

.onboarding-view__cta {
  width: 100%;

  @include mixins.media-up(lg) {
    width: auto;
  }
}

.onboarding-fade-enter-active,
.onboarding-fade-leave-active {
  transition: opacity 0.2s ease;
}

.onboarding-fade-enter-from,
.onboarding-fade-leave-to {
  opacity: 0;
}
</style>
