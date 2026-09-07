import { useEffect, type ReactNode } from 'react'

import { ThemeProvider } from '../src/theme/ThemeProvider'
import type { SignalTheme } from '../src/theme/theme.types'

export function SignalThemeDecorator({ children, theme }: { children: ReactNode; theme: SignalTheme }) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <ThemeProvider className="signal-storybook-theme" defaultTheme={theme} key={theme}>
      {children}
    </ThemeProvider>
  )
}
