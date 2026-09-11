import { RelayCampaign } from './screens/RelayCampaign'
import { ThemeProvider } from './theme/ThemeProvider'
import './App.css'

export default function App() {
  return (
    <ThemeProvider className="signal-app">
      <RelayCampaign />
    </ThemeProvider>
  )
}
