import './RelayTasks.css'

import { useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { Button } from '../../components/Button'
import { CampaignHeader, type CampaignView } from '../../components/CampaignHeader'
import { CountBadge } from '../../components/CountBadge'
import { FilterBar, type TaskFilters } from '../../components/FilterBar'
import { TaskTable } from '../../components/TaskTable'
import { relayTasks } from '../../data/relay'
import chartIcon from '../../components/AppShell/assets/chart.svg'
import cogIcon from '../../components/AppShell/assets/cog.svg'
import gridIcon from '../../components/AppShell/assets/grid.svg'
import listIcon from '../../components/AppShell/assets/list.svg'
import usersIcon from '../../components/AppShell/assets/users.svg'
import plusIcon from './assets/plus.svg'

const icon = (source: string) => <img alt="" src={source} />

export interface RelayTasksProps {
  onThemeToggle?: () => void
  onViewChange?: (view: CampaignView) => void
}

export function RelayTasks({ onThemeToggle, onViewChange }: RelayTasksProps) {
  const [filters, setFilters] = useState<TaskFilters>({ status: 'All', assignee: 'Anyone', priority: 'All' })
  const [tasks, setTasks] = useState(relayTasks)

  return (
    <AppShell
      className="signal-relay-tasks-shell"
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
      <div className="signal-relay-tasks">
        <CampaignHeader description="Drive 5,000 early signups through multi-channel activation." onViewChange={onViewChange} title="Relay App Launch" view="tasks" />
        <section aria-labelledby="relay-tasks-heading" className="signal-relay-tasks__section">
          <div className="signal-relay-tasks__title"><h2 id="relay-tasks-heading">Tasks</h2><CountBadge>{tasks.length}</CountBadge></div>
          <div className="signal-relay-tasks__actions">
            <FilterBar filters={filters} onChange={setFilters} />
            <Button leadingIcon={icon(plusIcon)}>New task</Button>
          </div>
          <TaskTable
            aria-label="Relay campaign tasks"
            onTaskSelectionChange={(id, selected) => setTasks((current) => current.map((task) => task.id === id ? { ...task, selected } : task))}
            tasks={tasks}
          />
        </section>
      </div>
    </AppShell>
  )
}
