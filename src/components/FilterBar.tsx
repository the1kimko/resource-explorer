import { useSearchParams } from 'react-router-dom'

const statuses = ['', 'alive', 'dead', 'unknown'] as const
const genders = ['', 'female', 'male', 'genderless', 'unknown'] as const

export default function FilterBar() {
  const [params, setParams] = useSearchParams()
  const status = (params.get('status') ?? '') as (typeof statuses)[number]
  const gender = (params.get('gender') ?? '') as (typeof genders)[number]
  const species = params.get('species') ?? ''
  const type = params.get('type') ?? ''
  const fav = params.get('fav') === '1'

  function setKV(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value); else next.delete(key)
    next.set('page', '1')
    setParams(next)
  }

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium" htmlFor="status">Status</label>
        <select id="status" className="h-10 rounded-md border px-2"
          value={status} onChange={(e)=>setKV('status', e.target.value)}>
          {statuses.map(s => <option key={s} value={s}>{s || 'Any'}</option>)}
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium" htmlFor="gender">Gender</label>
        <select id="gender" className="h-10 rounded-md border px-2"
          value={gender} onChange={(e)=>setKV('gender', e.target.value)}>
          {genders.map(g => <option key={g} value={g}>{g || 'Any'}</option>)}
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium" htmlFor="species">Species</label>
        <input id="species" className="h-10 rounded-md border px-2"
          placeholder="e.g. Human"
          value={species}
          onChange={(e)=>setKV('species', e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium" htmlFor="type">Type</label>
        <input id="type" className="h-10 rounded-md border px-2"
          placeholder="e.g. Parasite"
          value={type}
          onChange={(e)=>setKV('type', e.target.value)}
        />
      </div>

      <button
        onClick={() => setKV('fav', fav ? '' : '1')}
        className={`h-10 px-3 rounded-md border ${fav ? 'bg-yellow-200 dark:bg-yellow-600' : ''}`}
        aria-pressed={fav}
        title="Show favorites only"
      >
        ⭐ Favorites {fav ? 'On' : 'Off'}
      </button>
    </div>
  )
}
