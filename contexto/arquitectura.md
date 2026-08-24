# Arquitectura

[← Volver al README](../README.md)

Capas en una sola dirección: **vista → store → servicio → API**. Ninguna capa conoce a la de
arriba, y eso es lo que permite testear stores y utilidades sin montar un componente.

## Estructura

```
src/
├── assets/         Íconos como componentes SFC + imágenes del Figma
├── components/
│   ├── feedback/   EmptyState, UnderConstruction
│   ├── layout/     AppShell, TopNavBar, BottomTabBar, PageContainer, PageHeader
│   ├── pokemon/    PokemonCard, PokemonDetail, PokemonGrid, FavoriteCard…
│   ├── search/     SearchBar, FilterSheet (mobile), FilterSidebar (desktop)
│   └── ui/         Primitivas: AppButton, AppInput, AppChip, AppSkeleton…
├── composables/    Lógica reutilizable sin estado global
├── router/         Rutas + guard de onboarding
├── services/       Cliente HTTP, endpoints y mappers DTO → dominio
├── stores/         Pinia: pokemon, ui, favorites
├── styles/         Tokens, mixins, mapa de tipos, imports de Bootstrap
├── types/          `pokeapi.ts` (crudo) vs `domain.ts` (modelo propio)
├── utils/          Funciones puras
└── views/          Una por ruta
```

## Tres stores con responsabilidades separadas

- [`usePokemonStore`](../src/stores/usePokemonStore.ts) — datos de la API: índice, caché de detalles, info de tipos.
- [`useUiStore`](../src/stores/useUiStore.ts) — búsqueda, filtros y onboarding visto. Deriva `visibleResults`.
- [`useFavoritesStore`](../src/stores/useFavoritesStore.ts) — ids favoritos y su persistencia.

La separación importa: `useUiStore` no depende de `vue-router`, así que se puede testear en
aislado. La sincronización con la query string vive en la vista, no en el store.

## Dos capas de tipos

- [`types/pokeapi.ts`](../src/types/pokeapi.ts) — la respuesta cruda de la API, tal cual llega.
- [`types/domain.ts`](../src/types/domain.ts) — el modelo con el que trabaja la app.

Entre ambas están los [mappers](../src/services/mappers/pokemonMapper.ts). El beneficio es que un
cambio en el contrato de PokéAPI se contiene en el mapper: los componentes no se enteran.
