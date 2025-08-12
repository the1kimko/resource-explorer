import { useSearchParams } from 'react-router-dom'

const sorts = [
  { id: 'name-asc', label: 'Name ↑' },
  { id: 'name-desc', label: 'Name ↓' },
  { id: 'id-asc', label: 'ID ↑' },
  { id: 'id-desc', label: 'ID ↓' },
  { id: 'status-asc', label: 'Status A→Z' },
  { id: 'status-desc', label: 'Status Z→A' },
  { id: 'species-asc', label: 'Species A→Z' },
  { id: 'species-desc', label: 'Species Z→A' },
  { id: 'gender-asc', label: 'Gender A→Z' },
  { id: 'gender-desc', label: 'Gender Z→A' },
  { id: 'episodes-desc', label: 'Most episodes' },
] as const

export default function SortSelect() {
  const [params, setParams] = useSearchParams()
  const sort = params.get('sort') ?? 'name-asc'
  const update = (value: string) => {
    const next = new URLSearchParams(params)
    next.set('sort', value)
    setParams(next, { replace: true })
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium" htmlFor="sort">Sort</label>
      <select id="sort" className="h-10 rounded-md border px-2" value={sort}
        onChange={(e)=>update(e.target.value)}>
        {sorts.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>
    </div>
  )
}
