import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { FilterBar } from './FilterBar'
import type { TaskFilters } from './FilterBar.types'

const initialFilters: TaskFilters = { status: 'All', assignee: 'Anyone', priority: 'All' }

function InteractiveFilterBar() {
  const [filters, setFilters] = useState(initialFilters)
  return <FilterBar aria-label="Task filters" filters={filters} onChange={setFilters} />
}

const meta = {
  title: '03 Patterns/Filter Bar', component: FilterBar, tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'A reusable task-filter composition built from three Signal Select controls. Consumers own the filter state and apply it to their data.' } } },
  args: { filters: initialFilters }, argTypes: { filters: { control: 'object' }, onChange: { control: false, table: { disable: true } } },
} satisfies Meta<typeof FilterBar>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { render: () => <InteractiveFilterBar /> }
export const ActiveFilters: Story = { args: { filters: { status: 'In progress', assignee: 'Sofia Reyes', priority: 'High' } } }
