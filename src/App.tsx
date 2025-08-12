// src/App.tsx
import { Suspense, lazy } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import ThemeProvider from './providers/ThemeProvider'
import { ThemeToggle } from './components/ThemeToggle'
import { TooltipProvider } from './ui/tooltip'
import CharactersList from './pages/CharactersList'
import Home from './pages/Home'

const CharacterDetail = lazy(() => import('./pages/CharacterDetail')) // code-splitting

export default function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <div className="min-h-full bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
          <header className="sticky top-0 z-10 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
              <Link to="/" className="font-semibold">Rick & Morty Explorer</Link>
              <nav className="flex items-center gap-4">
                <Link to="/characters" className="hover:underline">Characters</Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/characters" element={<CharactersList />} />
              <Route
                path="/characters/:id"
                element={
                  <Suspense fallback={<div className="p-8">Loading details…</div>}>
                    <CharacterDetail />
                  </Suspense>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <footer className="border-t py-6 text-center opacity-70">
            Public API:{' '}
            <a
              className="underline"
              href="https://rickandmortyapi.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              rickandmortyapi.com
            </a>
          </footer>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  )
}

function NotFound() {
  return (
    <div>
      Page not found. <Link to="/" className="underline">Go home</Link>
    </div>
  )
}