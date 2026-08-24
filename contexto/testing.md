# Estrategia de testing

[← Volver al README](../README.md)

**50 archivos de test, 223 tests**, con Vitest + `@vue/test-utils` sobre jsdom.

| Capa                | Qué se prueba                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `tests/unit/`       | Utilidades, mappers, stores, composables, router y cliente HTTP en aislado               |
| `tests/components/` | Componentes y vistas montados, con router y Pinia reales y la capa de servicios mockeada |

El criterio fue **probar comportamiento, no implementación**: qué ve el usuario y qué pasa al
interactuar, no los internos del componente.

Por eso los tests de componentes montan el router y Pinia de verdad, y mockean únicamente
[`pokemonService`](../src/services/pokemonService.ts) — el borde de la red. Todo lo que está por
debajo (stores, mappers, composables) se ejercita real.

## Sobre la cobertura

`npm run test:coverage` reporta **100 %**, pero conviene leer la letra chica: el
`coverage.include` de [`vitest.config.ts`](../vitest.config.ts) mide solo `src/utils/**`,
`src/services/mappers/**` y `src/stores/**` — **8 de los 67 archivos** de `src/`.

Es deliberado: esa es la capa de lógica pura, donde un porcentaje significa algo. Medir
componentes `.vue` infla el número sin decir nada útil sobre si la UI funciona. Los componentes
sí están cubiertos, pero por los tests de `tests/components/`, no por la métrica.

Lo digo explícito para que "100 % de cobertura" no se lea como algo que no es.

## Lo que jsdom no puede cubrir

jsdom no calcula layout ni aplica CSS scoped. Quedan fuera del alcance de estos tests el scroll
virtualizado real, los gestos de swipe y cualquier medida de tamaño o posición. Para eso harían
falta tests end-to-end — ver [pendientes](pendientes.md).
