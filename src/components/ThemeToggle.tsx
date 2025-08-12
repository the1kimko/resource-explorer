import { useTheme } from '../providers/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      aria-label="Toggle theme"
      className="h-9 w-9 rounded-md border flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
      onClick={() => { console.log('[ThemeToggle] clicked. current=', theme); toggle() }}
      title="Toggle theme"
    >
      {isDark ? '🌞' : '🌙'}
    </button>
  )
}
