import type { Meta, StoryObj } from '@storybook/react-vite'
import { relayTasks } from '../../data/relay'
import { DataTable, DataTableBody } from '../DataTable'
import { TaskRow } from './TaskTable'

function TaskRowProof() { return <DataTable aria-label="Task row example"><DataTableBody><TaskRow task={relayTasks[0]} /></DataTableBody></DataTable> }

const meta = {
  title: '03 Patterns/Task Row', component: TaskRowProof, tags: ['autodocs'],
  parameters: { layout: 'padded', controls: { disable: true }, docs: { description: { component: 'The reusable row composition inside Task Table, combining selection, status, assignee, priority, and due-date primitives.' } } },
} satisfies Meta<typeof TaskRowProof>

export default meta
export const Default: StoryObj<typeof meta> = {}
