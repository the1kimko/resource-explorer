import { createContext } from 'react'

export type Theme = 'light' | 'dark'
export type ThemeContextValue = {
  theme: Theme
  toggle: () => void
  set: (t: Theme) => void
}

export const ThemeCtx = createContext<ThemeContextValue | null>(null)
