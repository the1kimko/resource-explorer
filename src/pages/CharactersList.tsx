// src/pages/CharactersList.tsx
import { useEffect, useMemo } from 'react'
import { useNavigationType, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import CharacterCard from '../components/CharacterCard'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import SortSelect from '../components/SortSelect'
import { fetchCharacters } from '../lib/rickmorty'
import { useFavorites } from '../hooks/use-favorites'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../ui/accordion'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '../ui/pagination'

export default function CharactersList() {
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page') || '1'))
  const q = params.get('q') || ''
  const status = params.get('status') || ''
  const gender = params.get('gender') || ''
  const species = params.get('species') || ''
  const type = params.get('type') || ''
  const sort = params.get('sort') || 'name-asc'
  const favOnly = params.get('fav') === '1'

  // Fetch characters (TanStack Query handles cancellation via signal)
  const query = useQuery({
    queryKey: ['characters', { page, q, status, gender, species, type }],
    queryFn: ({ signal }) => fetchCharacters({ page, q, status, gender, species, type, signal }),
    placeholderData: (prev) => prev, // reduce jank on page changes
  })

  // Client-side sort + favorites-only
  const { ids: favIds } = useFavorites()
  const collator = useMemo(() => new Intl.Collator(undefined, { sensitivity: 'base' }), [])
  const results = useMemo(() => {
    const list = query.data?.results ?? []
    const filtered = favOnly ? list.filter((c) => favIds.has(c.id)) : list
    const arr = [...filtered]
    switch (sort) {
      case 'id-asc':
        return arr.sort((a, b) => a.id - b.id)
      case 'id-desc':
        return arr.sort((a, b) => b.id - a.id)
      case 'status-asc':
        return arr.sort((a, b) => collator.compare(a.status, b.status))
      case 'status-desc':
        return arr.sort((a, b) => collator.compare(b.status, a.status))
      case 'species-asc':
        return arr.sort((a, b) => collator.compare(a.species, b.species))
      case 'species-desc':
        return arr.sort((a, b) => collator.compare(b.species, a.species))
      case 'gender-asc':
        return arr.sort((a, b) => collator.compare(a.gender, b.gender))
      case 'gender-desc':
        return arr.sort((a, b) => collator.compare(b.gender, a.gender))
      case 'episodes-desc':
        return arr.sort((a, b) => b.episode.length - a.episode.length)
      case 'name-desc':
        return arr.sort((a, b) => collator.compare(b.name, a.name))
      case 'name-asc':
      default:
        return arr.sort((a, b) => collator.compare(a.name, b.name))
    }
  }, [query.data, sort, favOnly, favIds, collator])

  // scroll restore on back/forward
  const key = `scroll:${location.pathname}${location.search}`
  const navType = useNavigationType()
  useEffect(() => {
    if (navType === 'POP') {
      const y = Number(sessionStorage.getItem(key) || '0')
      requestAnimationFrame(() => window.scrollTo({ top: y }))
    }
    return () => {
      sessionStorage.setItem(key, String(window.scrollY))
    }
  }, [key, navType])

  function setPage(p: number) {
    const next = new URLSearchParams(params)
    next.set('page', String(p))
    setParams(next)
  }

  const totalPages = query.data?.info.pages ?? 0

  return (
    <div className="space-y-6">
      {/* header: tabs + search + filters in accordion */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex-1 min-w-[200px]">
          <Tabs
            value={favOnly ? 'fav' : 'all'}
            onValueChange={(v) => {
              const next = new URLSearchParams(params)
              if (v === 'fav') next.set('fav', '1')
              else next.delete('fav')
              next.set('page', '1')
              setParams(next)
            }}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="fav">Favorites</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <SearchBar />

        <div className="w-full">
          <Accordion type="single" collapsible defaultValue="filters">
            <AccordionItem value="filters">
              <AccordionTrigger>Filters</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap items-end gap-4">
                  <FilterBar />
                  <SortSelect />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* states */}
      {query.isLoading && <ListSkeleton />}

      {query.isError && (
        <div className="p-6 rounded-md border bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100">
          <div className="font-semibold mb-2">Couldn’t load characters.</div>
          <button onClick={() => query.refetch()} className="underline">
            Retry
          </button>
        </div>
      )}

      {!query.isLoading && !query.isError && results.length === 0 && (
        <div className="p-6 rounded-md border text-sm opacity-80">
          No results. Try another search or clear filters.
        </div>
      )}

      {/* grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((c) => (
          <CharacterCard key={c.id} c={c} />
        ))}
      </div>

      {/* pagination */}
      {totalPages > 0 && (
        <Pagination className="pt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page > 1 && !query.isFetching) setPage(page - 1)
                }}
                aria-disabled={page <= 1 || query.isFetching}
                className={page <= 1 || query.isFetching ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            <span className="px-2 text-sm opacity-80">
              Page {page} of {totalPages}
            </span>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page < totalPages && !query.isFetching) setPage(page + 1)
                }}
                aria-disabled={page >= totalPages || query.isFetching}
                className={page >= totalPages || query.isFetching ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="rounded-lg border overflow-hidden">
          <div className="aspect-[16/12] bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
            <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
