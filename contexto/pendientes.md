# Qué haría con más tiempo

[← Volver al README](../README.md)

Para ser honesto sobre el estado actual:

- **Migrar los `@import` de Bootstrap a `@use`.** Dart Sass 3 los va a eliminar y el build ya
  emite avisos de deprecación.
- **Secciones Regiones y Perfil.** Hoy son placeholders "Muy pronto disponible"; navegan y
  tienen su header, pero no hay funcionalidad detrás.
- **Extender `prefers-reduced-motion`** al resto de las animaciones: hoy solo lo respeta el
  onboarding.
- **Tests end-to-end** (Playwright) para los flujos completos, que jsdom no puede cubrir:
  scroll virtualizado real, gestos de swipe y medidas de layout.
