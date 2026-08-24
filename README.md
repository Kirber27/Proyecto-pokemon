# Pokédex

Aplicación que muestra el listado completo de Pokémon de [PokéAPI](https://pokeapi.co/), con
búsqueda, filtro por tipo, vista de detalle y favoritos persistentes.

> Prueba técnica Global66.

---

## Índice

- [Stack y por qué](#stack-y-por-qué)
- [Arquitectura](#arquitectura)
- [Decisiones técnicas](#decisiones-técnicas)
- [Estrategia de testing](#estrategia-de-testing)
- [Requisitos](#requisitos)
- [Cómo correr el proyecto](#cómo-correr-el-proyecto)
- [Qué haría con más tiempo](#qué-haría-con-más-tiempo)

---

## Stack y por qué

| Tecnología                                    | Rol                | Por qué esta y no otra                                                                                                                                                                                                                            |
| --------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vue 3** (Composition API, `<script setup>`) | Framework de UI    | La Composition API permite extraer lógica a composables testeables sin montar componentes. `<script setup>` elimina el boilerplate de `defineComponent` y da inferencia de tipos en props y emits sin anotaciones extra.                          |
| **TypeScript**                                | Tipado             | El contrato de PokéAPI es amplio e irregular. Tipar la respuesta cruda (`types/pokeapi.ts`) por separado del modelo de dominio (`types/domain.ts`) hace que un cambio en la API rompa en compilación y no en runtime.                             |
| **Vite**                                      | Build y dev server | HMR instantáneo y build de producción sin configuración. El `resolve.alias` de `@/` evita rutas relativas frágiles.                                                                                                                               |
| **Pinia**                                     | Estado global      | Es el store oficial de Vue 3 y su API de _setup store_ es la misma Composition API: los stores se leen como composables, sin mutations ni boilerplate. Tipado de extremo a extremo sin genéricos manuales.                                        |
| **Vue Router**                                | Rutas              | Necesario para deep links (`/pokedex/:name`), para reflejar búsqueda y filtros en la query string, y para el guard de onboarding.                                                                                                                 |
| **Bootstrap 5** (solo SCSS)                   | Grid y utilidades  | Se importan **únicamente** `reboot`, `grid`, `containers` y utilidades. Los componentes visuales (botones, inputs, cards, chips) son propios: el diseño del Figma no coincide con los de Bootstrap y sobrescribirlos costaba más que escribirlos. |
| **Sass**                                      | Estilos            | Tokens de diseño centralizados y, sobre todo, el mapa de 18 tipos de Pokémon que genera CSS por tipo (ver [decisiones](#4-el-color-por-tipo-vive-en-css-no-en-javascript)).                                                                       |
| **Vitest** + **@vue/test-utils** + **jsdom**  | Testing            | Vitest comparte la config de Vite: los alias, el plugin de Vue y el pipeline de SCSS funcionan igual en test que en producción, sin un segundo archivo de configuración que mantener sincronizado.                                                |
| **ESLint** + **Prettier**                     | Calidad y formato  | Separados por responsabilidad: ESLint para reglas de corrección, Prettier para formato.                                                                                                                                                           |

**Lo que deliberadamente no usé:**

- **Axios** — `fetch` nativo cubre el caso. Lo que sí hacía falta era timeout y cancelación, y eso se resolvió en 56 líneas con `AbortSignal.timeout()` y `AbortSignal.any()` ([`httpClient.ts`](src/services/httpClient.ts)). Una dependencia menos que auditar.
- **Librería de virtualización** (`vue-virtual-scroller` y similares) — el caso es una grilla de altura de fila fija; el cálculo son cuatro `computed`. Ver [`useVirtualGrid.ts`](src/composables/useVirtualGrid.ts).
- **Librería de UI** (Vuetify, PrimeVue) — habría impuesto su propio sistema de diseño sobre el del Figma.
- **`cross-env`** — `npm` ya propaga `NODE_OPTIONS` a los scripts vía `node-options` en [`.npmrc`](.npmrc), multiplataforma y sin dependencias.

---

## Arquitectura

Capas en una sola dirección: **vista → store → servicio → API**. Ninguna capa conoce a la de
arriba, y eso es lo que permite testear stores y utilidades sin montar un componente.

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

**Tres stores con responsabilidades separadas:**

- [`usePokemonStore`](src/stores/usePokemonStore.ts) — datos de la API: índice, caché de detalles, info de tipos.
- [`useUiStore`](src/stores/useUiStore.ts) — búsqueda, filtros y onboarding visto. Deriva `visibleResults`.
- [`useFavoritesStore`](src/stores/useFavoritesStore.ts) — ids favoritos y su persistencia.

La separación importa: `useUiStore` no depende de `vue-router`, así que se puede testear en
aislado. La sincronización con la query string vive en la vista, no en el store.

---

## Decisiones técnicas

### 1. Un solo request para el índice, filtrado en cliente

PokéAPI no ofrece búsqueda por nombre ni paginación combinada con filtros. Paginar habría
significado un request por página y no poder buscar sobre el total.

La decisión fue pedir **el índice completo en un único request** (`/pokemon?limit=100000`) y
filtrar en memoria. La respuesta es liviana —solo `name` y `url` por Pokémon— y a cambio la
búsqueda es instantánea, sin round-trip por tecla.

El detalle (sprites, tipos, stats) se hidrata **por demanda, solo para lo visible**.

### 2. Virtualización propia para la grilla

Con ~1350 Pokémon en el índice (1351 al día de hoy), renderizar todas las cards colapsa el DOM.
[`useVirtualGrid`](src/composables/useVirtualGrid.ts) calcula qué rango de índices renderizar a
partir del scroll y el alto del viewport. El DOM nunca pasa de ~30 cards.

Requiere altura de fila fija, y por eso [`gridLayout.ts`](src/components/pokemon/gridLayout.ts)
es el único lugar donde vive esa constante: la comparten el CSS y el cálculo en JS.

### 3. Pool de concurrencia para hidratar detalles

Hacer scroll rápido dispararía cientos de requests simultáneos.
[`useConcurrencyPool`](src/composables/useConcurrencyPool.ts) limita a **6 en vuelo**, y el store
además deduplica: no se pide lo ya cacheado ni lo que ya está en camino.

Un fallo puntual no tumba a los demás: esa card queda sin detalle y el resto sigue.

### 4. El color por tipo vive en CSS, no en JavaScript

Son 18 tipos, cada uno con colores de chip y de panel de arte. Resolverlo con `if/else` o un
objeto en JS habría regado lógica de presentación por los componentes.

En cambio, [`_pokemon-types.scss`](src/styles/abstracts/_pokemon-types.scss) tiene **un mapa
único** y el mixin `type-theme-variants` genera un bloque de custom properties por tipo:

```scss
.pokemon-card[data-type='grass'] {
  --type-chip-bg: #dff3d2;
  --type-art-from: #cfedb4;
  --type-art-to: #96d479;
}
```

El componente solo pone `:data-type="primaryType"` y consume `var(--type-art-from)`. Ajustar un
tipo es cambiar una línea del mapa; **cero cambios en componentes**.

### 5. Errores tipados, y reintentar es decisión de la UI

[`ApiError`](src/services/httpClient.ts) distingue `network`, `http`, `timeout` y `parse`. El
cliente HTTP **no reintenta solo**: expone el fallo y la UI decide (botón "Reintentar"). Un
reintento automático y silencioso oculta problemas reales y multiplica la carga sobre la API.

La cancelación del llamador se distingue de un fallo real: si el consumidor abortó su propio
signal, el error se propaga tal cual en vez de disfrazarse de error de red.

### 6. Tolerancia a fallos parciales en el detalle

`loadFullDetail` compone tres fuentes (detalle, species, tipo). Si species o el tipo fallan, el
resto del detalle se muestra igual y solo faltan esas secciones. Mejor una pantalla incompleta
que una pantalla de error.

### 7. Favoritos: `localStorage` con recuperación ante datos corruptos

Se persisten solo los **ids**, y la vista los cruza contra el índice. Al leer se valida el
formato; si está corrupto se limpia la clave y se arranca vacío en vez de romper la app.

### 8. Filtros con borrador local

El `FilterSheet` mantiene un `draft` propio y solo escribe al store al confirmar. Así "Cancelar"
descarta de verdad, sin necesidad de deshacer nada.

### 9. Responsive: un solo listado de navegación, dos presentaciones

[`navItems.ts`](src/components/layout/navItems.ts) es la única fuente de los ítems de navegación;
`BottomTabBar` (mobile) y `TopNavBar` (desktop) solo cambian cómo se ven. Los breakpoints están
en un solo lugar y se comparten entre SCSS y JS (`useBreakpoint`).

En ≥1200px la Pokédex pasa a **master-detail**: seleccionar una card llena un panel lateral en
vez de navegar. Por debajo, es una vista completa.

### 10. Accesibilidad

`aria-label` en los controles por ícono, `aria-pressed` en el botón de favorito, `role="alert"`
en los estados de error, `aria-live` en el progreso del onboarding, y foco visible consistente vía
el mixin `focus-ring`.

`prefers-reduced-motion` se respeta hoy solo en las transiciones del onboarding
([`OnboardingView.vue`](src/views/OnboardingView.vue)); extenderlo al resto de las animaciones
—el _pop_ del favorito, el swipe de la card, el slide del sheet— queda pendiente.

---

## Estrategia de testing

**50 archivos de test, 223 tests**, con Vitest + `@vue/test-utils` sobre jsdom.

| Capa                | Qué se prueba                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `tests/unit/`       | Utilidades, mappers, stores, composables, router y cliente HTTP en aislado               |
| `tests/components/` | Componentes y vistas montados, con router y Pinia reales y la capa de servicios mockeada |

El criterio fue **probar comportamiento, no implementación**: qué ve el usuario y qué pasa al
interactuar, no los internos del componente.

### Sobre la cobertura

`npm run test:coverage` reporta **100 %**, pero conviene leer la letra chica: el
`coverage.include` de [`vitest.config.ts`](vitest.config.ts) mide solo `src/utils/**`,
`src/services/mappers/**` y `src/stores/**` — **8 de los 67 archivos** de `src/`.

Es deliberado: esa es la capa de lógica pura, donde un porcentaje significa algo. Medir
componentes `.vue` infla el número sin decir nada útil sobre si la UI funciona. Los componentes
sí están cubiertos, pero por los tests de `tests/components/`, no por la métrica.

Lo digo explícito para que "100 % de cobertura" no se lea como algo que no es.

---

## Requisitos

Node **>=26.0.0** (la versión exacta que usa el equipo está en [`.nvmrc`](.nvmrc)). Está
declarado en `engines` de `package.json`, así que `npm install` avisa si no calza.

Con un gestor de versiones, `.nvmrc` se aplica solo:

```sh
fnm use          # o: nvm use
```

Si no tienes gestor de versiones:

- **macOS / Linux** — `brew install fnm` (o [nvm](https://github.com/nvm-sh/nvm)), luego `fnm use`
- **Windows** — `winget install Schniz.fnm`, luego `fnm use`
- **Sin gestor** — instalador oficial desde [nodejs.org](https://nodejs.org/dist/latest-v26.x/)

---

## Cómo correr el proyecto

```sh
npm install
npm run dev              # servidor de desarrollo
npm run build            # build de producción
npm run preview          # sirve el build de producción
npm run lint             # ESLint (con --fix)
npm run format           # Prettier
npm run type-check       # vue-tsc
npm run test             # Vitest
npm run test:coverage    # Vitest con cobertura
```

Todos los scripts funcionan igual en macOS, Linux y Windows (PowerShell o CMD).

### Nota sobre `.npmrc`

El [`.npmrc`](.npmrc) del repo fija el registry público y las `node-options` de los scripts.
Existe para que el proyecto no herede un registry corporativo desde un `.npmrc` global y para que
las opciones de Node no dependan de la sintaxis del shell. No lo borres.

---

## Qué haría con más tiempo

Para ser honesto sobre el estado actual:


- **Íconos en los chips de tipo.** El diseño los lleva; el componente hoy es solo texto.
- **Migrar los `@import` de Bootstrap a `@use`.** Dart Sass 3 los va a eliminar y el build ya emite avisos de deprecación.
- **Secciones Regiones y Perfil.** Hoy son placeholders "Muy pronto disponible"; navegan y tienen su header, pero no hay funcionalidad detrás.
- **Tests end-to-end** (Playwright) para los flujos completos, que jsdom no puede cubrir:
  scroll virtualizado real, gestos de swipe y medidas de layout.
