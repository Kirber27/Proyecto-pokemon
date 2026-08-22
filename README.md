# Pokédex

Aplicación que muestra el listado completo de Pokémon de [PokéAPI](https://pokeapi.co/), con
búsqueda, filtros por tipo, detalle y favoritos persistentes.

> Prueba técnica Global66. La documentación de planificación (requisitos, diseño técnico y plan
> de ejecución) vive en [`.claude/`](.claude/README.md) y no forma parte de la aplicación.

## Stack

Vue 3 + TypeScript + Vite · Pinia · Vue Router · Bootstrap 5 (SCSS) · Vitest.

## Cómo correr el proyecto

```sh
npm install
npm run dev             # servidor de desarrollo
npm run build            # build de producción
npm run preview          # sirve el build de producción
npm run lint              # ESLint (con --fix)
npm run format            # Prettier
npm run type-check       # vue-tsc
npm run test               # Vitest
npm run test:coverage    # Vitest con cobertura
```

Node: ver [`.nvmrc`](.nvmrc).

---

Documentación completa (arquitectura, decisiones de stack, estrategia para gran volumen de
datos y despliegue) pendiente — tarea 10.1 del [plan de ejecución](.claude/specs/pokedex/tasks.md).
