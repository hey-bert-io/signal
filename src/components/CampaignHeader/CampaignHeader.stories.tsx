import type { Meta, StoryObj } from '@storybook/react-vite'
import { CampaignHeader } from './CampaignHeader'

const meta = {
  title: '03 Patterns/Campaign Header', component: CampaignHeader, tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'A campaign-level heading and view-navigation pattern composed from Signal Tabs and Count Badge.' } } },
  args: { title: 'Relay App Launch', description: 'Drive 5,000 early signups through multi-channel activation.', taskCount: 10, view: 'overview' as const },
  argTypes: { onViewChange: { control: false, table: { disable: true } }, view: { control: 'select', options: ['overview', 'tasks', 'activity'] } },
} satisfies Meta<typeof CampaignHeader>

export default meta
export const Default: StoryObj<typeof meta> = {}
