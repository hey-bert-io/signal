import type { ComponentPropsWithRef } from 'react'

export interface TaskFilters {
  assignee: string
  priority: string
  status: string
}

export interface FilterBarProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange'> {
  filters: TaskFilters
  onChange?: (filters: TaskFilters) => void
}
