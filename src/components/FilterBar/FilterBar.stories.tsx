import type { Meta, StoryObj } from '@storybook/react-vite'
import { FilterBar } from './FilterBar'

const meta = { title: 'Patterns/Filter Bar', component: FilterBar, tags: ['autodocs'], args: { filters: { status: 'All', assignee: 'Anyone', priority: 'All' } } } satisfies Meta<typeof FilterBar>
export default meta
export const Connected: StoryObj<typeof meta> = {}
