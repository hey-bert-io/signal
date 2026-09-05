import { Button } from './components/Button'
import { ThemeProvider } from './theme/ThemeProvider'
import { useTheme } from './theme/useTheme'
import './App.css'

function SignalPreview() {
  const { theme, toggleTheme } = useTheme()

  return (
    <main className="signal-preview">
      <div className="signal-preview__heading">
        <div>
          <p className="signal-preview__eyebrow">Signal / Pass 01</p>
          <h1>Button</h1>
          <p>Figma variables through semantic themes to a native React component.</p>
        </div>
        <Button size="small" variant="secondary" onClick={toggleTheme}>
          Use {theme === 'light' ? 'dark' : 'light'} theme
        </Button>
      </div>

      <section className="signal-preview__panel" aria-label="Button variants">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button disabled>Disabled</Button>
      </section>
    </main>
  )
}

export default function App() {
  return (
    <ThemeProvider className="signal-app">
      <SignalPreview />
    </ThemeProvider>
  )
}
