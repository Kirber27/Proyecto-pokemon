# Cómo correr el proyecto

[← Volver al README](../README.md)

Antes de empezar, revisa los [requisitos de Node](requisitos.md).

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

## Nota sobre `.npmrc`

El [`.npmrc`](../.npmrc) del repo fija el registry público y las `node-options` de los scripts.
Existe por dos razones concretas:

1. Que el proyecto no herede un registry corporativo desde un `.npmrc` global — si el Nexus
   interno no es alcanzable (sin VPN), `npm install` falla con un error engañoso.
2. Que las opciones de Node no dependan de la sintaxis del shell. El prefijo `NODE_OPTIONS=...`
   delante de un script solo funciona en shells POSIX; en `cmd.exe` es un error. `node-options`
   en `.npmrc` lo resuelve igual en las tres plataformas y sin dependencias.

No lo borres.
