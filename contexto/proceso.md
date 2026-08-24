# Proceso: specs y steering

[← Volver al README](../README.md)

El proyecto no se escribió improvisando sobre el editor. Se trabajó con un flujo de
**desarrollo guiado por especificación**, apoyado en dos tipos de documento con roles distintos:
**steering** y **specs**.

## Steering — las reglas que valen para todo el proyecto

Los documentos de _steering_ fijan criterios transversales, los que no pertenecen a una
funcionalidad concreta sino a todas. En este proyecto el principal fue **`design-system.md`**,
que definió:

- Los tokens de diseño: paleta, tipografía, escala de espaciado, radios y sombras.
- El mapa de colores de los 18 tipos de Pokémon.
- Los breakpoints y cómo se adapta cada layout en mobile, desktop y ≥1200px.
- La estrategia para el gran volumen de datos del índice.

Su huella está en el código como referencias explícitas:

```ts
// src/composables/useBreakpoint.ts
// Coinciden con $breakpoints (design-system.md): lg conmuta tab bar ↔ top nav,
// xl activa el panel de detalle fijo del master-detail.
```

```scss
// src/styles/abstracts/_variables.scss
// Design tokens — ver .claude/steering/design-system.md
```

El valor de tenerlo aparte es que decisiones como "los breakpoints son estos" o "el color por
tipo sale de un mapa único" se deciden **una vez** y después se citan, en lugar de rediscutirse
en cada componente.

## Specs — el ciclo por funcionalidad

Cada bloque de funcionalidad pasó por tres documentos encadenados:

| Documento         | Qué define                                                             |
| ----------------- | ---------------------------------------------------------------------- |
| `requirements.md` | Qué debe hacer, como criterios de aceptación numerados (`CA-XX.Y`)     |
| `design.md`       | Cómo se va a construir: capas, contratos, estructura de datos, routing |
| `tasks.md`        | El plan de ejecución, en tareas numeradas y ordenadas por dependencia  |

La parte que más sirvió fue la **trazabilidad**: cada criterio de aceptación tiene un código, y
ese código viaja hasta el código fuente y los tests. Hoy hay **28 criterios distintos
referenciados en 32 archivos**. Por ejemplo:

```ts
// src/stores/useUiStore.ts
// CA-04.5: predicados en orden barato → caro. Sumar un filtro nuevo (favoritos,
// generación…) es sumar un predicado acá; PokemonGrid/PokedexView no cambian.
```

```ts
// tests/components/views/FavoritesView.test.ts
it('muestra el estado vacío del diseño cuando no hay favoritos (CA-06.5)', ...)
```

Eso permite responder en segundos dos preguntas que normalmente cuestan caro: _¿dónde se
implementó este requisito?_ y _¿qué se rompe si lo cambio?_

Las decisiones de diseño también quedaron citadas donde se aplican:

```ts
// src/stores/useUiStore.ts
// El filtro por tipo se resuelve exacto vía /type/{name} (design.md §5), no sobre
// detalles hidratados: hace falta pedir la info de cada tipo recién seleccionado.
```

```scss
// src/styles/abstracts/_mixins.scss
// Cero lógica de color en JS — ver design.md §9.
```

## Por qué este flujo y no ir directo al código

- **Las decisiones difíciles se toman antes de escribir.** Que el índice se pida en un solo
  request, o que el color por tipo no toque JavaScript, se resolvió en `design.md` — no a mitad
  de un componente, con presión por avanzar.
- **Los comentarios explican el porqué, no el qué.** Como el criterio ya estaba escrito, el
  comentario en el código puede citarlo en vez de reexplicarlo.
- **El plan de tareas ordena por dependencia**, así que no hubo que rehacer trabajo por haber
  construido algo antes de su base.
- **Lo pendiente queda anotado en su lugar**, no en la cabeza de alguien:

```scss
// src/styles/abstracts/_pokemon-types.scss
// PENDIENTE (tarea 1.4): estos hex están estimados visualmente desde capturas del Figma,
// no leídos de Dev Mode.
```
