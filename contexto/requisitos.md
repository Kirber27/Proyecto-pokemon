# Requisitos

[← Volver al README](../README.md)

Node **>=26.0.0** (la versión exacta que usa el equipo está en [`.nvmrc`](../.nvmrc)). Está
declarado en `engines` de `package.json`, así que `npm install` avisa si no calza.

Con un gestor de versiones, `.nvmrc` se aplica solo:

```sh
fnm use          # o: nvm use
```

Si no tienes gestor de versiones:

- **macOS / Linux** — `brew install fnm` (o [nvm](https://github.com/nvm-sh/nvm)), luego `fnm use`
- **Windows** — `winget install Schniz.fnm`, luego `fnm use`
- **Sin gestor** — instalador oficial desde [nodejs.org](https://nodejs.org/dist/latest-v26.x/)
