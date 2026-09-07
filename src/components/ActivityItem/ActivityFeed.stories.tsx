import type { Meta, StoryObj } from '@storybook/react-vite'
import { relayActivities } from '../../data/relay'
import { ActivityFeed } from './ActivityItem'

const meta = {
  title: '03 Patterns/Activity Feed', component: ActivityFeed, tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'An ordered collection of Activity Items for product history and audit-style views. Relay uses the same pattern for its complete Activity screen.' } } },
  args: { 'aria-label': 'Recent campaign activity', activities: relayActivities.slice(0, 4) },
} satisfies Meta<typeof ActivityFeed>

export default meta
export const Default: StoryObj<typeof meta> = {}
