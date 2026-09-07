import type { ComponentPropsWithRef } from 'react'
import type { StatusTone } from '../Status'

export interface TaskRecord {
  assignee: { initials: string; name: string }
  due: string
  id: string
  priority: 'High' | 'Medium' | 'Low'
  selected?: boolean
  status: { label: string; tone: StatusTone }
  title: string
}

export interface TaskTableProps extends ComponentPropsWithRef<'table'> {
  tasks: TaskRecord[]
  onTaskSelectionChange?: (id: string, selected: boolean) => void
}
