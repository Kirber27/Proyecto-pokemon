<script setup lang="ts">
import { useRoute } from 'vue-router'
import { isNavItemActive, navItems } from '@/components/layout/navItems'

const route = useRoute()
</script>

<template>
  <nav class="bottom-tab-bar" aria-label="Navegación principal">
    <ul class="bottom-tab-bar__list">
      <li v-for="item in navItems" :key="item.label" class="bottom-tab-bar__entry">
        <RouterLink
          v-if="item.routeName"
          :to="{ name: item.routeName }"
          class="bottom-tab-bar__item"
          :class="{ 'bottom-tab-bar__item--active': isNavItemActive(item.routeName, route.name) }"
        >
          <component :is="item.icon" class="bottom-tab-bar__icon" />
          <span>{{ item.label }}</span>
        </RouterLink>
        <span v-else class="bottom-tab-bar__item bottom-tab-bar__item--disabled" aria-disabled="true">
          <component :is="item.icon" class="bottom-tab-bar__icon" />
          <span>{{ item.label }}</span>
        </span>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
@use '@/styles/abstracts/variables' as tokens;
@use '@/styles/abstracts/mixins' as mixins;

.bottom-tab-bar {
  position: sticky;
  bottom: 0;
  border-top: 1px solid tokens.$border;
  background-color: tokens.$surface;
}

.bottom-tab-bar__list {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
}

.bottom-tab-bar__entry {
  flex: 1 1 0;
}

.bottom-tab-bar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 4px 6px;
  color: tokens.$text-secondary;
  font-size: 11px;
  font-weight: tokens.$font-weight-medium;
  text-decoration: none;

  @include mixins.focus-ring;
}

.bottom-tab-bar__item--active {
  color: tokens.$primary;
}

.bottom-tab-bar__item--disabled {
  opacity: 0.4;
  cursor: default;
}

.bottom-tab-bar__icon {
  width: 24px;
  height: 24px;
}
</style>
