import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActivityItem } from './ActivityItem'

const activity = { id: 'status', actor: { initials: 'SR', name: 'Sofia Reyes' }, action: 'updated status of', object: 'Hero banner copy', status: { label: 'In progress', tone: 'info' as const }, time: '2h ago' }
const meta = { title: 'Patterns/Activity Item', component: ActivityItem, tags: ['autodocs'], args: { activity }, decorators: [(Story) => <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}><Story /></ol>] } satisfies Meta<typeof ActivityItem>
export default meta
export const Connected: StoryObj<typeof meta> = {}
