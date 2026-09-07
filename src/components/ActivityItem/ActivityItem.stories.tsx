import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActivityItem } from './ActivityItem'

const activity = { id: 'status', actor: { initials: 'SR', name: 'Sofia Reyes' }, action: 'updated status of', object: 'Hero banner copy', status: { label: 'In progress', tone: 'info' as const }, time: '2h ago' }
const meta = {
  title: '03 Patterns/Activity Item', component: ActivityItem, tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'A single, semantic activity record composed from Signal Avatar and Status Indicator. Use it inside an ordered activity feed.' } } },
  args: { activity }, argTypes: { activity: { control: 'object' } },
  decorators: [(Story) => <ol aria-label="Recent activity" style={{ listStyle: 'none', margin: 0, padding: 0 }}><Story /></ol>],
} satisfies Meta<typeof ActivityItem>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const WithoutStatus: Story = { args: { activity: { ...activity, id: 'complete', action: 'completed', object: 'Landing page A/B test setup', status: undefined, time: '4h ago' } } }
