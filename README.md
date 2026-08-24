# Pokédex

Aplicación que muestra el listado completo de Pokémon de [PokéAPI](https://pokeapi.co/), con
búsqueda, filtro por tipo, vista de detalle y favoritos persistentes.

> Prueba técnica Global66.

## Stack

Vue 3 + TypeScript + Vite · Pinia · Vue Router · Bootstrap 5 (SCSS) · Vitest

## Arranque rápido

```sh
npm install
npm run dev
```

Requiere Node **>=26.0.0** — ver [requisitos](contexto/requisitos.md).

---

## Documentación

El detalle del proyecto está en [`contexto/`](contexto/), un archivo por tema:

| Documento                                              | Qué encontrarás                                                                                     |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| [Proceso: specs y steering](contexto/proceso.md)       | Cómo se llevó a cabo el desarrollo: documentos de steering, ciclo de specs y trazabilidad al código |
| [Stack y por qué](contexto/stack.md)                   | Cada tecnología, su justificación frente a la alternativa, y lo que deliberadamente no usé          |
| [Arquitectura](contexto/arquitectura.md)               | Flujo entre capas, estructura de `src/`, los tres stores y la separación de tipos                   |
| [Decisiones técnicas](contexto/decisiones-tecnicas.md) | Las 10 decisiones de fondo, cada una con su trade-off                                               |
| [Estrategia de testing](contexto/testing.md)           | Qué se prueba y cómo, más la letra chica de la cobertura                                            |
| [Requisitos](contexto/requisitos.md)                   | Versión de Node y gestores de versiones por sistema operativo                                       |
| [Cómo correr el proyecto](contexto/como-correr.md)     | Todos los scripts y por qué existe el `.npmrc`                                                      |
| [Qué haría con más tiempo](contexto/pendientes.md)     | Lo que quedó pendiente, sin adornos                                                                 |

---

## Sobre cómo se construyó

El desarrollo se apoyó en un flujo guiado por especificación: documentos de **steering** para las
reglas transversales (sistema de diseño, breakpoints, estrategia de datos) y **specs** por
funcionalidad, encadenando requisitos → diseño técnico → plan de tareas.

Ese rastro sigue vivo en el código: **28 criterios de aceptación** (`CA-XX.Y`) referenciados en
**32 archivos** entre fuente y tests, de modo que cada requisito se puede seguir hasta la línea
que lo implementa. El detalle está en [Proceso: specs y steering](contexto/proceso.md).
