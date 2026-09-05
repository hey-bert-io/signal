import { useMemo, useState } from 'react'

import { ThemeContext } from './theme-context'
import type { SignalTheme, ThemeProviderProps } from './theme.types'

export function ThemeProvider({ children, defaultTheme = 'light', className }: ThemeProviderProps) {
  const [theme, setTheme] = useState<SignalTheme>(defaultTheme)
  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
    }),
    [theme],
  )

  return (
    <ThemeContext.Provider value={value}>
      <div className={className} data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
