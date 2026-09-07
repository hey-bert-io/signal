import { RelayCampaign } from './screens/RelayCampaign'
import { ThemeProvider } from './theme/ThemeProvider'
import { useTheme } from './theme/useTheme'
import './App.css'

function SignalPreview() {
  const { toggleTheme } = useTheme()
  return <RelayCampaign onThemeToggle={toggleTheme}/>
}

export default function App() {
  return (
    <ThemeProvider className="signal-app">
      <SignalPreview />
    </ThemeProvider>
  )
}
