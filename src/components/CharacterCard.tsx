// src/components/CharacterCard.tsx
import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/use-favorites'
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'

type Character = {
  id: number; name: string; image: string; species: string; status: string; gender: string;
}

export default function CharacterCard({ c }: { c: Character }) {
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(c.id)

  return (
    <div className="rounded-lg border overflow-hidden bg-white dark:bg-slate-900">
      <div className="aspect-[16/12] overflow-hidden">
        <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-3 flex items-start justify-between gap-2">
        <div>
          <Link to={`/characters/${c.id}`} className="font-semibold hover:underline">{c.name}</Link>
          <div className="text-xs opacity-70">{c.species} • {c.status} • {c.gender}</div>
        </div>
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
      </div>
    </div>
  )
}