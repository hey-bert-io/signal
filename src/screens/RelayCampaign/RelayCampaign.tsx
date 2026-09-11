import './RelayCampaign.css'

import { useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { ActivityFeed } from '../../components/ActivityItem'
import { AppShell } from '../../components/AppShell'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { CampaignHeader, type CampaignView } from '../../components/CampaignHeader'
import { CampaignHealth } from '../../components/CampaignHealth'
import { CountBadge } from '../../components/CountBadge'
import { FilterBar, type TaskFilters } from '../../components/FilterBar'
import { MilestoneList } from '../../components/MilestoneList'
import { TaskTable } from '../../components/TaskTable'
import { relayActivities, relayMilestones, relayMetrics, relayTasks } from '../../data/relay'
import chartIcon from '../../components/AppShell/assets/chart.svg'
import cogIcon from '../../components/AppShell/assets/cog.svg'
import gridIcon from '../../components/AppShell/assets/grid.svg'
import listIcon from '../../components/AppShell/assets/list.svg'
import usersIcon from '../../components/AppShell/assets/users.svg'
import plusIcon from '../RelayTasks/assets/plus.svg'
import { NewTaskDialog } from './NewTaskDialog'

const icon = (source: string) => <img alt="" src={source} />

export interface RelayCampaignProps {
  initialView?: CampaignView
  onViewChange?: (view: CampaignView) => void
}

function OverviewView() {
  return (
    <div className="signal-relay-overview-content">
      <CampaignHealth
        blocked={3}
        completed={22}
        deadline="Nov 15, 2026"
        deadlineDetail="71 days remaining"
        inProgress={5}
        metrics={relayMetrics}
        owner={{ initials: 'AR', name: 'Alex Rivera' }}
        progress={73}
        status="On track"
      />
      <Card as="section" className="signal-relay-overview__brief">
        <h2>Campaign brief</h2>
        <p>The Relay App Launch campaign targets early adopters in the B2B SaaS space. Our goal is to drive 5,000 signups in the first 30 days through a coordinated push across paid, organic, and earned channels. All creative assets must align with the updated brand guidelines released in September 2026.</p>
      </Card>
      <MilestoneList milestones={relayMilestones}/>
    </div>
  )
}

function TasksView() {
  const [filters, setFilters] = useState<TaskFilters>({ status: 'All', assignee: 'Anyone', priority: 'All' })
  const [tasks, setTasks] = useState(relayTasks)
  const [dialogOpen, setDialogOpen] = useState(false)
  const newTaskRef = useRef<HTMLButtonElement>(null)
  const visibleTasks = useMemo(() => tasks.filter((task) => (
    (filters.status === 'All' || task.status.label === filters.status)
    && (filters.assignee === 'Anyone' || task.assignee.name === filters.assignee)
    && (filters.priority === 'All' || task.priority === filters.priority)
  )), [filters, tasks])
  const closeDialog = () => {
    setDialogOpen(false)
    requestAnimationFrame(() => newTaskRef.current?.focus())
  }
  return <section aria-labelledby="relay-tasks-heading" className="signal-relay-tasks__section"><div className="signal-relay-tasks__title"><h2 id="relay-tasks-heading">Tasks</h2><CountBadge aria-label={`${visibleTasks.length} visible tasks`}>{visibleTasks.length}</CountBadge></div><div className="signal-relay-tasks__actions"><FilterBar aria-label="Task filters" filters={filters} onChange={setFilters}/><Button leadingIcon={icon(plusIcon)} onClick={() => setDialogOpen(true)} ref={newTaskRef}>New task</Button></div><TaskTable aria-label="Relay campaign tasks" onTaskSelectionChange={(id, selected) => setTasks((current) => current.map((task) => task.id === id ? { ...task, selected } : task))} tasks={visibleTasks}/>{dialogOpen ? <NewTaskDialog onClose={closeDialog} /> : null}</section>
}

function ActivityView() {
  return <ActivityFeed aria-label="Relay campaign activity" activities={relayActivities}/>
}

export function RelayCampaign({ initialView = 'overview', onViewChange }: RelayCampaignProps) {
  const [view, setView] = useState<CampaignView>(initialView)
  const tabsId = `relay-campaign-${useId()}`
  const changeView = (next: CampaignView) => { setView(next); onViewChange?.(next) }
  const panel = (panelView: CampaignView, children: ReactNode) => <div aria-labelledby={`${tabsId}-${panelView}-tab`} hidden={view !== panelView} id={`${tabsId}-${panelView}-panel`} role="tabpanel">{view === panelView ? children : null}</div>
  return <AppShell className={`signal-relay-campaign-shell signal-relay-campaign-shell--${view}`} identity={{initials:'AR',name:'Alex Rivera'}} navigation={[{href:'#overview',label:'Campaigns',icon:icon(gridIcon),current:true},{label:'My tasks',icon:icon(listIcon),disabled:true},{label:'Analytics',icon:icon(chartIcon),disabled:true},{label:'Team',icon:icon(usersIcon),disabled:true}]} themeDisabled themeLabel="Light / Dark mode" utilityNavigation={[{label:'Settings',icon:icon(cogIcon),disabled:true}]}><div className="signal-relay-campaign"><CampaignHeader description="Drive 5,000 early signups through multi-channel activation." onViewChange={changeView} panelIdPrefix={tabsId} title="Relay App Launch" view={view}/>{panel('overview', <OverviewView/>)}{panel('tasks', <TasksView/>)}{panel('activity', <ActivityView/>)}</div></AppShell>
}
