import { useCallback, useMemo, useSyncExternalStore } from 'react'

const KEY = 'favorites:v1'
type Id = number

// --- internal store state (module singletons) ---
const listeners = new Set<() => void>()

function loadFromStorage(): Set<Id> {
  try {
    const raw = localStorage.getItem(KEY)
    return new Set<Id>(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set<Id>()
  }
}

// Keep a single in-memory snapshot; only replace this reference on real changes.
let currentIds: Set<Id> = loadFromStorage()

function emit() {
  listeners.forEach((l) => l())
}

function setsEqual(a: Set<Id>, b: Set<Id>) {
  if (a.size !== b.size) return false
  for (const v of a) if (!b.has(v)) return false
  return true
}

function setStore(next: Set<Id>, { persist = true }: { persist?: boolean } = {}) {
  if (setsEqual(next, currentIds)) return // no change, keep same reference
  currentIds = next
  if (persist) localStorage.setItem(KEY, JSON.stringify([...currentIds]))
  emit()
}

function onStorage(e: StorageEvent) {
  if (e.key !== KEY) return
  const next = new Set<Id>(e.newValue ? JSON.parse(e.newValue) : [])
  // Update in-memory snapshot without re-writing storage (already updated by other tab)
  setStore(next, { persist: false })
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  if (listeners.size === 1) {
    window.addEventListener('storage', onStorage)
  }
  return () => {
    listeners.delete(cb)
    if (listeners.size === 0) {
      window.removeEventListener('storage', onStorage)
    }
  }
}

function getSnapshot(): ReadonlySet<Id> {
  // IMPORTANT: return the SAME reference unless store changes
  return currentIds
}

// Optional for SSR; on the server, just return an empty stable value
function getServerSnapshot(): ReadonlySet<Id> {
  return currentIds
}

// --- public hook API ---
export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const isFavorite = useCallback((id: Id) => ids.has(id), [ids])

  const toggle = useCallback(
    (id: Id) => {
      const next = new Set(ids)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      setStore(next)
    },
    [ids]
  )

  const clearAll = useCallback(() => setStore(new Set()), [])

  const count = useMemo(() => ids.size, [ids])

  return { ids, count, isFavorite, toggle, clearAll }
}
