const BASE = 'https://rickandmortyapi.com/api'

export type Character = {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  image: string
  episode: string[]
  origin: { name: string }
  location: { name: string }
}

export type Paged<T> = {
  info: { count: number; pages: number; next: string | null; prev: string | null }
  results: T[]
}

export async function fetchCharacters(opts: {
  page: number
  q?: string
  status?: string
  gender?: string
  species?: string
  type?: string
  signal?: AbortSignal
}): Promise<Paged<Character>> {
  const params = new URLSearchParams()
  params.set('page', String(opts.page))
  if (opts.q) params.set('name', opts.q)
  if (opts.status) params.set('status', opts.status)
  if (opts.gender) params.set('gender', opts.gender)
  if (opts.species) params.set('species', opts.species)
  if (opts.type) params.set('type', opts.type)

  const res = await fetch(`${BASE}/character?${params.toString()}`, { signal: opts.signal })
  if (!res.ok) {
    // API sends 404 for no results; normalize that to empty
    if (res.status === 404) {
      return { info: { count: 0, pages: 0, next: null, prev: null }, results: [] }
    }
    throw new Error(`Failed to fetch characters (${res.status})`)
  }
  return res.json()
}

export async function fetchCharacterById(id: number, signal?: AbortSignal): Promise<Character> {
  const res = await fetch(`${BASE}/character/${id}`, { signal })
  if (!res.ok) throw new Error(`Failed to fetch character (${res.status})`)
  return res.json()
}
