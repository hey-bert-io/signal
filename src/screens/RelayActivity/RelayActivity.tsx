import type { CampaignView } from '../../components/CampaignHeader'
import { RelayCampaign } from '../RelayCampaign'

export interface RelayActivityProps {
  onViewChange?: (view: CampaignView) => void
}

export function RelayActivity({ onViewChange }: RelayActivityProps) {
  return <RelayCampaign initialView="activity" onViewChange={onViewChange}/>
}
