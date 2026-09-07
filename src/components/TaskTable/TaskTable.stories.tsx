import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { relayTasks } from '../../data/relay'
import { TaskTable } from './TaskTable'

function InteractiveTaskTable() {
  const [tasks, setTasks] = useState(relayTasks.slice(0, 5))
  return <TaskTable aria-label="Campaign tasks" tasks={tasks} onTaskSelectionChange={(id, selected) => setTasks((current) => current.map((task) => task.id === id ? { ...task, selected } : task))} />
}

const meta = {
  title: '03 Patterns/Task Table', component: TaskTable, tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'A product-ready task composition built from Data Table, Checkbox, Status, and Avatar. It preserves table semantics while adapting visible columns at narrower viewports.' } } },
  args: { 'aria-label': 'Campaign tasks', tasks: relayTasks.slice(0, 5) }, argTypes: { tasks: { control: 'object' }, onTaskSelectionChange: { control: false, table: { disable: true } } },
} satisfies Meta<typeof TaskTable>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { render: () => <InteractiveTaskTable /> }
export const CompactDataSet: Story = { args: { tasks: relayTasks.slice(0, 2) } }
