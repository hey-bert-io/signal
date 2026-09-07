import './CampaignHeader.css'
import { CountBadge } from '../CountBadge'
import { Tab, TabList, TabPanel, Tabs } from '../Tabs'
import type { CampaignHeaderProps, CampaignView } from './CampaignHeader.types'

const views: CampaignView[] = ['overview', 'tasks', 'activity']

export function CampaignHeader({ className, description, onViewChange, panelIdPrefix, taskCount = 10, title, view = 'overview', ...props }: CampaignHeaderProps) {
  const ids = (item: CampaignView) => panelIdPrefix ? {
    'aria-controls': `${panelIdPrefix}-${item}-panel`,
    id: `${panelIdPrefix}-${item}-tab`,
  } : {}

  return (
    <header {...props} className={['signal-campaign-header', className].filter(Boolean).join(' ')}>
      <div className="signal-campaign-header__copy"><h1>{title}</h1><p>{description}</p></div>
      <Tabs value={view} onValueChange={(next) => onViewChange?.(next as CampaignView)}>
        <TabList aria-label="Campaign views" className="signal-campaign-header__tabs">
          <Tab {...ids('overview')} value="overview">Overview</Tab>
          <Tab {...ids('tasks')} value="tasks"><span className="signal-campaign-header__tab-count">Tasks <CountBadge>{taskCount}</CountBadge></span></Tab>
          <Tab {...ids('activity')} value="activity">Activity</Tab>
        </TabList>
        {panelIdPrefix ? null : views.map((item) => <TabPanel className="signal-campaign-header__panel" key={item} value={item} />)}
      </Tabs>
    </header>
  )
}
