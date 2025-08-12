import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from '../hooks/use-debounce'

export default function SearchBar() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [value, setValue] = useState(q)
  const debounced = useDebounce(value, 400)

  // input -> URL
  useEffect(() => {
    const next = new URLSearchParams(params)
    if (debounced) next.set('q', debounced); else next.delete('q')
    next.set('page', '1')
    setParams(next, { replace: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  // URL (back/forward) -> input
  useEffect(() => { if (q !== value) setValue(q) }, [q]) // eslint-disable-line

  return (
    <div className="space-y-1">
      <label htmlFor="search" className="block text-sm font-medium">Search</label>
      <input
        id="search"
        className="h-10 w-72 rounded-md border border-slate-300 bg-white px-3 dark:bg-slate-900"
        placeholder="Search by name…"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  )
}
