const DIACRITICS_PATTERN = /[̀-ͯ]/g

/** 'Nidorán' → 'nidoran'. Minúsculas y sin acentos, para comparar sin distinguirlos. */
export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(DIACRITICS_PATTERN, '').toLowerCase()
}

/** CA-03.1: coincidencia parcial, sin distinguir mayúsculas ni acentos. */
export function matchesText(haystack: string, query: string): boolean {
  if (!query.trim()) return true

  return normalizeText(haystack).includes(normalizeText(query))
}
