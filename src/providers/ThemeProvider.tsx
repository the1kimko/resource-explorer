import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeCtx } from './ThemeContext'
import type { Theme } from './ThemeContext'

const KEY = 'theme:v1'

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. persist in localStorage
    const saved = localStorage.getItem(KEY) as Theme | null
    if (saved === 'light' || saved === 'dark') return saved
    // 2. existing class on <html> element
    if (document.documentElement.classList.contains('dark')) return 'dark'
    // 3. system preference
    const sysDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    return sysDark ? 'dark' : 'light'
  })

  useEffect(() => {
    localStorage.setItem(KEY, theme)
    applyTheme(theme)
  }, [theme])

  const toggle = useCallback(() => setTheme(t => (t === 'light' ? 'dark' : 'light')), [])
  const set = useCallback((t: Theme) => setTheme(t), [])
  const value = useMemo(() => ({ theme, toggle, set }), [theme, toggle, set])

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}
