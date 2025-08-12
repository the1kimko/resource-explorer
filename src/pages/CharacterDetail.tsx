import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCharacterById } from '../lib/rickmorty'
import { useFavorites } from '../hooks/use-favorites'
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'

export default function CharacterDetail() {
  const { id } = useParams()
  const charId = Number(id)

  const query = useQuery({
    queryKey: ['character', charId],
    queryFn: ({ signal }) => fetchCharacterById(charId, signal),
    enabled: Number.isFinite(charId) && charId > 0
  })

  const { isFavorite, toggle } = useFavorites()
  const fav = Number.isFinite(charId) ? isFavorite(charId) : false

  if (query.isLoading) {
    return <div className="grid gap-4 md:grid-cols-[320px_1fr]">
      <div className="aspect-square rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
      <div className="space-y-3">
        <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
        <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
        <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
      </div>
    </div>
  }

  if (query.isError || !query.data) {
    return (
      <div className="space-y-3">
        <div className="p-4 rounded-md border bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100">
          Couldn’t load character.
        </div>
        <button onClick={() => query.refetch()} className="h-10 px-3 rounded-md border">Retry</button>
      </div>
    )
  }

  const c = query.data

  return (
    <div className="space-y-6">
      <Link to="/characters" className="underline">← Back to list</Link>

      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <img src={c.image} alt={c.name} className="rounded-lg border w-full max-w-[320px]" />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {c.name}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => toggle(c.id)}
                  className={`h-9 px-3 rounded-md border ${fav ? 'bg-yellow-200 dark:bg-yellow-600' : ''}`}
                  aria-pressed={fav}
                  title={fav ? 'Unfavorite' : 'Favorite'}
                >
                  ⭐
                </button>
              </TooltipTrigger>
              <TooltipContent>{fav ? 'Unfavorite' : 'Favorite'}</TooltipContent>
            </Tooltip>
          </h1>
          <div className="text-sm opacity-80">
            {c.status} • {c.species} {c.type ? `• ${c.type}` : ''} • {c.gender}
          </div>
          <div className="text-sm">Origin: <span className="opacity-80">{c.origin?.name}</span></div>
          <div className="text-sm">Location: <span className="opacity-80">{c.location?.name}</span></div>
          <div className="text-sm">Episodes: <span className="opacity-80">{c.episode.length}</span></div>
        </div>
      </div>
    </div>
  )
}
