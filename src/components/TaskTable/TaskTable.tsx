import './TaskTable.css'

import { Avatar } from '../Avatar'
import { Checkbox } from '../Checkbox'
import { DataTable, DataTableBody, DataTableCell, DataTableHeaderCell, DataTableHead, DataTableRow } from '../DataTable'
import { Status } from '../Status'
import type { TaskRecord, TaskTableProps } from './TaskTable.types'

export function TaskRow({ task, onSelectionChange }: { task: TaskRecord; onSelectionChange?: (id: string, selected: boolean) => void }) {
  return (
    <DataTableRow selected={Boolean(task.selected)}>
      <DataTableCell className="signal-task-table__selection">
        <Checkbox aria-label={`Select ${task.title}`} checked={Boolean(task.selected)} label="" onChange={(event) => onSelectionChange?.(task.id, event.target.checked)} />
      </DataTableCell>
      <DataTableCell className="signal-task-table__task">{task.title}</DataTableCell>
      <DataTableCell className="signal-task-table__status"><Status tone={task.status.tone}>{task.status.label}</Status></DataTableCell>
      <DataTableCell className="signal-task-table__assignee"><Avatar initials={task.assignee.initials} size={24} /><span>{task.assignee.name}</span></DataTableCell>
      <DataTableCell className="signal-task-table__priority">{task.priority}</DataTableCell>
      <DataTableCell className="signal-task-table__due"><time>{task.due}</time></DataTableCell>
    </DataTableRow>
  )
}

export function TaskTable({ className, onTaskSelectionChange, tasks, ...props }: TaskTableProps) {
  return (
    <DataTable {...props} className={['signal-task-table', className].filter(Boolean).join(' ')}>
      <colgroup><col className="selection" /><col className="task" /><col className="status" /><col className="assignee" /><col className="priority" /><col className="due" /></colgroup>
      <DataTableHead><DataTableRow><DataTableHeaderCell><span className="visually-hidden">Select</span></DataTableHeaderCell><DataTableHeaderCell>Task</DataTableHeaderCell><DataTableHeaderCell>Status</DataTableHeaderCell><DataTableHeaderCell className="signal-task-table__assignee">Assignee</DataTableHeaderCell><DataTableHeaderCell className="signal-task-table__priority">Priority</DataTableHeaderCell><DataTableHeaderCell>Due</DataTableHeaderCell></DataTableRow></DataTableHead>
      <DataTableBody>{tasks.map((task) => <TaskRow key={task.id} task={task} onSelectionChange={onTaskSelectionChange} />)}</DataTableBody>
    </DataTable>
  )
}
