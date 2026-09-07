import type { Meta, StoryObj } from '@storybook/react-vite'
import { relayMetrics } from '../../data/relay'
import { CampaignHealth } from './CampaignHealth'

const meta = {
  title: '03 Patterns/Campaign Health', component: CampaignHealth, tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'A campaign summary pattern that composes Signal Card, Progress, Status, Status Indicator, Avatar, and Icon Button around product metrics.' } } },
  args: { status: 'On track', completed: 22, inProgress: 5, blocked: 3, progress: 73, owner: { name: 'Alex Rivera', initials: 'AR' }, deadline: 'Nov 15, 2026', deadlineDetail: '71 days remaining', metrics: relayMetrics },
  argTypes: { onMore: { control: false, table: { disable: true } } },
} satisfies Meta<typeof CampaignHealth>

export default meta
export const Default: StoryObj<typeof meta> = {}
