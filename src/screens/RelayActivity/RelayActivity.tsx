import './RelayActivity.css'

import { ActivityFeed } from '../../components/ActivityItem'
import { AppShell } from '../../components/AppShell'
import { CampaignHeader, type CampaignView } from '../../components/CampaignHeader'
import { relayActivities } from '../../data/relay'
import chartIcon from '../../components/AppShell/assets/chart.svg'
import cogIcon from '../../components/AppShell/assets/cog.svg'
import gridIcon from '../../components/AppShell/assets/grid.svg'
import listIcon from '../../components/AppShell/assets/list.svg'
import usersIcon from '../../components/AppShell/assets/users.svg'

const icon = (source: string) => <img alt="" src={source} />

export interface RelayActivityProps {
  onThemeToggle?: () => void
  onViewChange?: (view: CampaignView) => void
}

export function RelayActivity({ onThemeToggle, onViewChange }: RelayActivityProps) {
  return (
    <AppShell
      className="signal-relay-activity-shell"
      identity={{ initials: 'AR', name: 'Alex Rivera' }}
      navigation={[
        { href: '#overview', label: 'Campaigns', icon: icon(gridIcon), current: true },
        { href: '#tasks', label: 'My tasks', icon: icon(listIcon) },
        { href: '#analytics', label: 'Analytics', icon: icon(chartIcon) },
        { href: '#team', label: 'Team', icon: icon(usersIcon) },
      ]}
      onThemeToggle={onThemeToggle}
      themeLabel="Toggle color theme"
      utilityNavigation={[{ href: '#settings', label: 'Settings', icon: icon(cogIcon) }]}
    >
      <div className="signal-relay-activity">
        <CampaignHeader description="Drive 5,000 early signups through multi-channel activation." onViewChange={onViewChange} title="Relay App Launch" view="activity" />
        <ActivityFeed aria-label="Relay campaign activity" activities={relayActivities} />
      </div>
    </AppShell>
  )
}
