import type { Meta, StoryObj } from '@storybook/react-vite'
import { TaskTable } from './TaskTable'

const tasks = [{ id: 'hero', title: 'Hero banner — copy and visuals', status: { label: 'In progress', tone: 'info' as const }, assignee: { initials: 'SR', name: 'Sofia Reyes' }, priority: 'High' as const, due: 'Oct 3' }, { id: 'landing', title: 'Landing page A/B test setup', status: { label: 'Done', tone: 'success' as const }, assignee: { initials: 'PN', name: 'Priya Nair' }, priority: 'Medium' as const, due: 'Oct 7', selected: true }]
const meta = { title: 'Patterns/Task Table', component: TaskTable, tags: ['autodocs'], args: { 'aria-label': 'Campaign tasks', tasks } } satisfies Meta<typeof TaskTable>
export default meta
export const Connected: StoryObj<typeof meta> = {}
