import { Link } from 'react-router-dom'
import Button from '../ui/button'

export default function Home() {
  return (
    <section className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-10">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Resource Explorer</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Search, filter, sort, favorite, and dive into character details. URL-driven state, fast UI, and offline-friendly caching.
        </p>
        <div className="flex gap-3">
          <Link to="/characters">
            <Button size="lg">Browse Characters →</Button>
          </Link>
          <Link to="/characters?fav=1">
            <Button variant="outline" size="lg">View Favorites</Button>
          </Link>
        </div>
      </div>

      {/* playful bubbles */}
      <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-500/20" />
      <div className="pointer-events-none absolute -left-28 -bottom-28 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/20" />
    </section>
  )
}
