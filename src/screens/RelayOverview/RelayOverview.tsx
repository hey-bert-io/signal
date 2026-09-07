import { RelayCampaign, type RelayCampaignProps } from '../RelayCampaign'
export type RelayOverviewProps = Omit<RelayCampaignProps,'initialView'>
export function RelayOverview(props:RelayOverviewProps){return <RelayCampaign {...props} initialView="overview"/>}
