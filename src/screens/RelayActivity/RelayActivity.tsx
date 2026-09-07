import type { CampaignView } from '../../components/CampaignHeader'
import { RelayCampaign } from '../RelayCampaign'

export interface RelayActivityProps {
  onThemeToggle?: () => void
  onViewChange?: (view: CampaignView) => void
}

export function RelayActivity({ onThemeToggle, onViewChange }: RelayActivityProps) {
  return <RelayCampaign initialView="activity" onThemeToggle={onThemeToggle} onViewChange={onViewChange}/>
}
