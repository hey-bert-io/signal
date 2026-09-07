import type { CampaignView } from '../../components/CampaignHeader'
import { RelayCampaign } from '../RelayCampaign'

export interface RelayTasksProps {
  onThemeToggle?: () => void
  onViewChange?: (view: CampaignView) => void
}

export function RelayTasks({ onThemeToggle, onViewChange }: RelayTasksProps) {
  return <RelayCampaign initialView="tasks" onThemeToggle={onThemeToggle} onViewChange={onViewChange}/>
}
