import type { CampaignView } from '../../components/CampaignHeader'
import { RelayCampaign } from '../RelayCampaign'

export interface RelayTasksProps {
  onViewChange?: (view: CampaignView) => void
}

export function RelayTasks({ onViewChange }: RelayTasksProps) {
  return <RelayCampaign initialView="tasks" onViewChange={onViewChange}/>
}
