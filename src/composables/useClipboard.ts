import { ref } from 'vue'

const CONFIRMATION_MS = 2000

function fallbackCopy(text: string): void {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()

  const successful = document.execCommand('copy')
  document.body.removeChild(textarea)

  if (!successful) throw new Error('document.execCommand("copy") falló')
}

/**
 * Clipboard API → fallback `execCommand` → si también falla, informa el error.
 * `copied`/`error` se resetean solos a los 2s (CA-07.3, CA-07.4).
 */
export function useClipboard() {
  const copied = ref(false)
  const error = ref(false)

  async function copy(text: string): Promise<void> {
    let succeeded = false

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        succeeded = true
      } catch {
        // Clipboard API falló (contexto inseguro, permiso denegado…): cae al fallback.
      }
    }

    if (!succeeded) {
      try {
        fallbackCopy(text)
        succeeded = true
      } catch {
        // ambos caminos fallaron
      }
    }

    copied.value = succeeded
    error.value = !succeeded

    setTimeout(() => {
      copied.value = false
      error.value = false
    }, CONFIRMATION_MS)
  }

  return { copied, error, copy }
}
