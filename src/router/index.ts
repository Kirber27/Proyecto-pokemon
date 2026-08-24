import { createRouter, createWebHistory, type NavigationGuardWithThis, type RouteRecordRaw } from 'vue-router'
import { useUiStore } from '@/stores/useUiStore'
import SplashView from '@/views/SplashView.vue'
import OnboardingView from '@/views/OnboardingView.vue'
import PokedexView from '@/views/PokedexView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import RegionsView from '@/views/RegionsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresOnboarding?: boolean
    // 'shell': envuelto en AppShell (tab bar / top nav). Splash y onboarding son pantallas
    // completas sin navegación — no tiene sentido mostrarles el shell.
    layout?: 'shell' | 'bare'
  }
}

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'splash', component: SplashView },
  { path: '/onboarding', name: 'onboarding', component: OnboardingView },
  {
    path: '/pokedex',
    name: 'pokedex',
    component: PokedexView,
    meta: { requiresOnboarding: true, layout: 'shell' },
  },
  {
    path: '/pokedex/:name',
    name: 'pokedex-detail',
    component: PokedexView,
    props: true,
    meta: { requiresOnboarding: true, layout: 'shell' },
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritesView,
    meta: { requiresOnboarding: true, layout: 'shell' },
  },
  // Secciones aún en desarrollo: navegables, pero muestran el placeholder de
  // construcción en vez de una pantalla vacía.
  {
    path: '/regions',
    name: 'regions',
    component: RegionsView,
    meta: { requiresOnboarding: true, layout: 'shell' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresOnboarding: true, layout: 'shell' },
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

// CA-01.4: sin onboarding visto, no se puede entrar directo (deep link incluido) a
// Pokédex ni Favoritos — se redirige a completarlo primero.
export const onboardingGuard: NavigationGuardWithThis<undefined> = (to) => {
  if (!to.meta.requiresOnboarding) return true

  const uiStore = useUiStore()

  if (!uiStore.onboardingSeen) {
    return { name: 'onboarding' }
  }

  return true
}

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(onboardingGuard)
