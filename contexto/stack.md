# Stack y por qué

[← Volver al README](../README.md)

| Tecnología                                    | Rol                | Por qué esta y no otra                                                                                                                                                                                                                            |
| --------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vue 3** (Composition API, `<script setup>`) | Framework de UI    | La Composition API permite extraer lógica a composables testeables sin montar componentes. `<script setup>` elimina el boilerplate de `defineComponent` y da inferencia de tipos en props y emits sin anotaciones extra.                          |
| **TypeScript**                                | Tipado             | El contrato de PokéAPI es amplio e irregular. Tipar la respuesta cruda (`types/pokeapi.ts`) por separado del modelo de dominio (`types/domain.ts`) hace que un cambio en la API rompa en compilación y no en runtime.                             |
| **Vite**                                      | Build y dev server | HMR instantáneo y build de producción sin configuración. El `resolve.alias` de `@/` evita rutas relativas frágiles.                                                                                                                               |
| **Pinia**                                     | Estado global      | Es el store oficial de Vue 3 y su API de _setup store_ es la misma Composition API: los stores se leen como composables, sin mutations ni boilerplate. Tipado de extremo a extremo sin genéricos manuales.                                        |
| **Vue Router**                                | Rutas              | Necesario para deep links (`/pokedex/:name`), para reflejar búsqueda y filtros en la query string, y para el guard de onboarding.                                                                                                                 |
| **Bootstrap 5** (solo SCSS)                   | Grid y utilidades  | Se importan **únicamente** `reboot`, `grid`, `containers` y utilidades. Los componentes visuales (botones, inputs, cards, chips) son propios: el diseño del Figma no coincide con los de Bootstrap y sobrescribirlos costaba más que escribirlos. |
| **Sass**                                      | Estilos            | Tokens de diseño centralizados y, sobre todo, el mapa de 18 tipos de Pokémon que genera CSS por tipo (ver [decisiones técnicas](decisiones-tecnicas.md#4-el-color-por-tipo-vive-en-css-no-en-javascript)).                                        |
| **Vitest** + **@vue/test-utils** + **jsdom**  | Testing            | Vitest comparte la config de Vite: los alias, el plugin de Vue y el pipeline de SCSS funcionan igual en test que en producción, sin un segundo archivo de configuración que mantener sincronizado.                                                |
| **ESLint** + **Prettier**                     | Calidad y formato  | Separados por responsabilidad: ESLint para reglas de corrección, Prettier para formato.                                                                                                                                                           |

## Lo que deliberadamente no usé

- **Axios** — `fetch` nativo cubre el caso. Lo que sí hacía falta era timeout y cancelación, y eso se resolvió en 56 líneas con `AbortSignal.timeout()` y `AbortSignal.any()` ([`httpClient.ts`](../src/services/httpClient.ts)). Una dependencia menos que auditar.
- **Librería de virtualización** (`vue-virtual-scroller` y similares) — el caso es una grilla de altura de fila fija; el cálculo son cuatro `computed`. Ver [`useVirtualGrid.ts`](../src/composables/useVirtualGrid.ts).
- **Librería de UI** (Vuetify, PrimeVue) — habría impuesto su propio sistema de diseño sobre el del Figma.
- **`cross-env`** — `npm` ya propaga `NODE_OPTIONS` a los scripts vía `node-options` en [`.npmrc`](../.npmrc), multiplataforma y sin dependencias.
