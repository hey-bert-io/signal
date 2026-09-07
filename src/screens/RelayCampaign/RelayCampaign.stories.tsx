import type { Meta, StoryObj } from '@storybook/react-vite'
import { RelayCampaign } from './RelayCampaign'

const meta = { title:'Relay/Campaign', component:RelayCampaign, parameters:{layout:'fullscreen',a11y:{test:'error'}} } satisfies Meta<typeof RelayCampaign>
export default meta
export const Integrated: StoryObj<typeof meta> = { parameters:{viewport:{defaultViewport:'desktop1440'}} }
