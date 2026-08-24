# Decisiones técnicas

[← Volver al README](../README.md)

Cada decisión con su trade-off, no solo el resultado.

## 1. Un solo request para el índice, filtrado en cliente

PokéAPI no ofrece búsqueda por nombre ni paginación combinada con filtros. Paginar habría
significado un request por página y no poder buscar sobre el total.

La decisión fue pedir **el índice completo en un único request** (`/pokemon?limit=100000`) y
filtrar en memoria. La respuesta es liviana —solo `name` y `url` por Pokémon— y a cambio la
búsqueda es instantánea, sin round-trip por tecla.

El detalle (sprites, tipos, stats) se hidrata **por demanda, solo para lo visible**.

## 2. Virtualización propia para la grilla

Con ~1350 Pokémon en el índice (1351 al día de hoy), renderizar todas las cards colapsa el DOM.
[`useVirtualGrid`](../src/composables/useVirtualGrid.ts) calcula qué rango de índices renderizar a
partir del scroll y el alto del viewport. El DOM nunca pasa de ~30 cards.

Requiere altura de fila fija, y por eso [`gridLayout.ts`](../src/components/pokemon/gridLayout.ts)
es el único lugar donde vive esa constante: la comparten el CSS y el cálculo en JS.

## 3. Pool de concurrencia para hidratar detalles

Hacer scroll rápido dispararía cientos de requests simultáneos.
[`useConcurrencyPool`](../src/composables/useConcurrencyPool.ts) limita a **6 en vuelo**, y el
store además deduplica: no se pide lo ya cacheado ni lo que ya está en camino.

Un fallo puntual no tumba a los demás: esa card queda sin detalle y el resto sigue.

## 4. El color por tipo vive en CSS, no en JavaScript

Son 18 tipos, cada uno con colores de chip y de panel de arte. Resolverlo con `if/else` o un
objeto en JS habría regado lógica de presentación por los componentes.

En cambio, [`_pokemon-types.scss`](../src/styles/abstracts/_pokemon-types.scss) tiene **un mapa
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

## 5. Errores tipados, y reintentar es decisión de la UI

[`ApiError`](../src/services/httpClient.ts) distingue `network`, `http`, `timeout` y `parse`. El
cliente HTTP **no reintenta solo**: expone el fallo y la UI decide (botón "Reintentar"). Un
reintento automático y silencioso oculta problemas reales y multiplica la carga sobre la API.

La cancelación del llamador se distingue de un fallo real: si el consumidor abortó su propio
signal, el error se propaga tal cual en vez de disfrazarse de error de red.

## 6. Tolerancia a fallos parciales en el detalle

`loadFullDetail` compone tres fuentes (detalle, species, tipo). Si species o el tipo fallan, el
resto del detalle se muestra igual y solo faltan esas secciones. Mejor una pantalla incompleta
que una pantalla de error.

## 7. Favoritos: `localStorage` con recuperación ante datos corruptos

Se persisten solo los **ids**, y la vista los cruza contra el índice. Al leer se valida el
formato; si está corrupto se limpia la clave y se arranca vacío en vez de romper la app.

## 8. Filtros con borrador local

El `FilterSheet` mantiene un `draft` propio y solo escribe al store al confirmar. Así "Cancelar"
descarta de verdad, sin necesidad de deshacer nada.

## 9. Responsive: un solo listado de navegación, dos presentaciones

[`navItems.ts`](../src/components/layout/navItems.ts) es la única fuente de los ítems de
navegación; `BottomTabBar` (mobile) y `TopNavBar` (desktop) solo cambian cómo se ven. Los
breakpoints están en un solo lugar y se comparten entre SCSS y JS (`useBreakpoint`).

En ≥1200px la Pokédex pasa a **master-detail**: seleccionar una card llena un panel lateral en
vez de navegar. Por debajo, es una vista completa.

## 10. Accesibilidad

`aria-label` en los controles por ícono, `aria-pressed` en el botón de favorito, `role="alert"`
en los estados de error, `aria-live` en el progreso del onboarding, y foco visible consistente
vía el mixin `focus-ring`.

`prefers-reduced-motion` se respeta hoy solo en las transiciones del onboarding
([`OnboardingView.vue`](../src/views/OnboardingView.vue)); extenderlo al resto de las animaciones
—el _pop_ del favorito, el swipe de la card, el slide del sheet— queda pendiente.
