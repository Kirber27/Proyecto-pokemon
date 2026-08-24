# Pokédex

Aplicación que muestra el listado completo de Pokémon de [PokéAPI](https://pokeapi.co/), con
búsqueda, filtros por tipo, detalle y favoritos persistentes.

> Prueba técnica Global66. La documentación de planificación (requisitos, diseño técnico y plan
> de ejecución) vive en [`.claude/`](.claude/README.md) y no forma parte de la aplicación.

## Stack

Vue 3 + TypeScript + Vite · Pinia · Vue Router · Bootstrap 5 (SCSS) · Vitest.

## Requisitos

Node **>=26.0.0** (la versión exacta que usa el equipo está en [`.nvmrc`](.nvmrc)).
Está declarado en `engines` de `package.json`, así que `npm install` avisa si no calza.

Con un gestor de versiones, `.nvmrc` se aplica solo:

```sh
fnm use          # o: nvm use
```

Si no tienes gestor de versiones:

- **macOS / Linux** — `brew install fnm` (o [nvm](https://github.com/nvm-sh/nvm)), luego `fnm use`
- **Windows** — `winget install Schniz.fnm`, luego `fnm use`
- **Sin gestor** — instalador oficial desde [nodejs.org](https://nodejs.org/dist/latest-v26.x/)

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
Existe para que el proyecto no herede un registry corporativo desde tu `.npmrc` global y para
que las opciones de Node no dependan de la sintaxis del shell. No lo borres.

---

Documentación completa (arquitectura, decisiones de stack, estrategia para gran volumen de
datos y despliegue) pendiente — tarea 10.1 del [plan de ejecución](.claude/specs/pokedex/tasks.md).
