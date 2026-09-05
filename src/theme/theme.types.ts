import type { ReactNode } from 'react'

export type SignalTheme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: SignalTheme
  setTheme: (theme: SignalTheme) => void
  toggleTheme: () => void
}

export interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: SignalTheme
  className?: string
}
