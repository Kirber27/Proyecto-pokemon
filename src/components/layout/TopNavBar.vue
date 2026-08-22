<script setup lang="ts">
import { useRoute } from 'vue-router'
import { isNavItemActive, navItems } from '@/components/layout/navItems'

const route = useRoute()
</script>

<template>
  <header class="top-nav-bar">
    <div class="top-nav-bar__inner">
      <RouterLink :to="{ name: 'pokedex' }" class="top-nav-bar__logo">Pokédex</RouterLink>

      <div class="top-nav-bar__search">
        <!-- SearchBar (tarea 6.7) se monta acá directamente: lee/escribe useUiStore, no necesita slot. -->
      </div>

      <nav class="top-nav-bar__nav" aria-label="Navegación principal">
        <ul class="top-nav-bar__list">
          <li v-for="item in navItems" :key="item.label">
            <RouterLink
              v-if="item.routeName"
              :to="{ name: item.routeName }"
              class="top-nav-bar__item"
              :class="{ 'top-nav-bar__item--active': isNavItemActive(item.routeName, route.name) }"
            >
              {{ item.label }}
            </RouterLink>
            <span v-else class="top-nav-bar__item top-nav-bar__item--disabled" aria-disabled="true">
              {{ item.label }}
            </span>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.top-nav-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid tokens.$border;
  background-color: tokens.$surface;
}

.top-nav-bar__inner {
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: 1320px;
  margin-inline: auto;
  padding: 12px 24px;
}

.top-nav-bar__logo {
  flex-shrink: 0;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-section-title;
  font-weight: tokens.$font-weight-bold;
  text-decoration: none;

  @include mixins.focus-ring;
}

.top-nav-bar__search {
  flex: 1 1 auto;
  max-width: 480px;
}

.top-nav-bar__list {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.top-nav-bar__item {
  display: inline-block;
  padding: 8px 12px;
  border-radius: tokens.$radius-pill;
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-body;
  font-weight: tokens.$font-weight-medium;
  text-decoration: none;

  @include mixins.focus-ring;
}

.top-nav-bar__item--active {
  color: tokens.$primary;
  background-color: tokens.$primary-soft;
}

.top-nav-bar__item--disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
