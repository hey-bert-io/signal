import './FilterBar.css'

import { Select } from '../Select'
import type { FilterBarProps } from './FilterBar.types'

const options = {
  status: ['All', 'In progress', 'Blocked', 'Done', 'At risk', 'Draft'],
  assignee: ['Anyone', 'Sofia Reyes', 'Marcus Lin', 'Priya Nair', 'James Okafor', 'Clara Mendez'],
  priority: ['All', 'High', 'Medium', 'Low'],
}

export function FilterBar({ className, filters, onChange, ...props }: FilterBarProps) {
  const classes = ['signal-filter-bar', className].filter(Boolean).join(' ')
  const update = (key: keyof typeof filters, value: string) => onChange?.({ ...filters, [key]: value })

  return (
    <div {...props} className={classes}>
      {(Object.keys(options) as Array<keyof typeof options>).map((key) => (
        <Select
          key={key}
          label={key[0].toUpperCase() + key.slice(1)}
          value={filters[key]}
          onChange={(event) => update(key, event.target.value)}
        >
          {options[key].map((option) => <option key={option}>{option}</option>)}
        </Select>
      ))}
    </div>
  )
}
