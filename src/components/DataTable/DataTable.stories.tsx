import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Avatar } from '../Avatar'
import { Checkbox } from '../Checkbox'
import { IconButton } from '../IconButton'
import { Status } from '../Status'
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHeaderCell,
  DataTableHead,
  DataTableRow,
} from './DataTable'
import type { DataTableSortDirection } from './DataTable.types'

const MoreIcon = () => (
  <svg fill="currentColor" viewBox="0 0 16 16">
    <circle cx="3" cy="8" r="1" />
    <circle cx="8" cy="8" r="1" />
    <circle cx="13" cy="8" r="1" />
  </svg>
)

const storyStack: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 }
const visuallyHidden: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

function BasicTable({ label = 'Current tasks' }: { label?: string }) {
  return (
    <DataTable>
      <caption>{label}</caption>
      <DataTableHead>
        <DataTableRow>
          <DataTableHeaderCell>Task</DataTableHeaderCell>
          <DataTableHeaderCell>Status</DataTableHeaderCell>
        </DataTableRow>
      </DataTableHead>
      <DataTableBody>
        <DataTableRow>
          <DataTableCell>Checkout improvements</DataTableCell>
          <DataTableCell>In progress</DataTableCell>
        </DataTableRow>
        <DataTableRow>
          <DataTableCell>Empty state revisions</DataTableCell>
          <DataTableCell>Blocked</DataTableCell>
        </DataTableRow>
      </DataTableBody>
    </DataTable>
  )
}

function MixedTable({ theme }: { theme?: 'light' | 'dark' }) {
  return (
    <div data-theme={theme} style={{ background: 'var(--color-background-default)', padding: theme ? 24 : 0 }}>
      <h2 id={`${theme ?? 'mixed'}-tasks-heading`} style={{ color: 'var(--color-text-primary)', margin: '0 0 16px' }}>Tasks</h2>
      <DataTable aria-labelledby={`${theme ?? 'mixed'}-tasks-heading`}>
        <colgroup>
          <col style={{ width: 52 }} />
          <col />
          <col style={{ width: 132 }} />
          <col style={{ width: 176 }} />
          <col style={{ width: 56 }} />
        </colgroup>
        <DataTableHead>
          <DataTableRow>
            <DataTableHeaderCell><Checkbox aria-label="Select all tasks" label="" /></DataTableHeaderCell>
            <DataTableHeaderCell sortable>Task</DataTableHeaderCell>
            <DataTableHeaderCell>Status</DataTableHeaderCell>
            <DataTableHeaderCell>Assignee</DataTableHeaderCell>
            <DataTableHeaderCell><span style={visuallyHidden}>Actions</span></DataTableHeaderCell>
          </DataTableRow>
        </DataTableHead>
        <DataTableBody>
          <DataTableRow>
            <DataTableCell><Checkbox aria-label="Select Checkout improvements" label="" /></DataTableCell>
            <DataTableCell>Checkout improvements</DataTableCell>
            <DataTableCell><Status tone="info">In progress</Status></DataTableCell>
            <DataTableCell><span style={{ alignItems: 'center', display: 'inline-flex', gap: 8 }}><Avatar initials="EC" /> Esther Collins</span></DataTableCell>
            <DataTableCell><IconButton aria-label="More actions for Checkout improvements" icon={<MoreIcon />} size="small" variant="ghost" /></DataTableCell>
          </DataTableRow>
          <DataTableRow selected>
            <DataTableCell><Checkbox aria-label="Select Analytics dashboard" defaultChecked label="" /></DataTableCell>
            <DataTableCell>Analytics dashboard</DataTableCell>
            <DataTableCell><Status tone="success">Done</Status></DataTableCell>
            <DataTableCell><span style={{ alignItems: 'center', display: 'inline-flex', gap: 8 }}><Avatar initials="JD" /> James Diaz</span></DataTableCell>
            <DataTableCell><IconButton aria-label="More actions for Analytics dashboard" icon={<MoreIcon />} size="small" variant="ghost" /></DataTableCell>
          </DataTableRow>
          <DataTableRow>
            <DataTableCell><Checkbox aria-label="Select Payment failure messaging" label="" /></DataTableCell>
            <DataTableCell>Payment failure messaging</DataTableCell>
            <DataTableCell><Status>Draft</Status></DataTableCell>
            <DataTableCell><span style={{ alignItems: 'center', display: 'inline-flex', gap: 8 }}><Avatar initials="NR" /> Noah Reyes</span></DataTableCell>
            <DataTableCell><IconButton aria-label="More actions for Payment failure messaging" icon={<MoreIcon />} size="small" variant="ghost" /></DataTableCell>
          </DataTableRow>
        </DataTableBody>
      </DataTable>
    </div>
  )
}

function SortingExample() {
  const [direction, setDirection] = useState<DataTableSortDirection>()
  const advanceSort = () => setDirection((current) => current === 'ascending' ? 'descending' : 'ascending')

  return (
    <DataTable aria-label="Sorting states">
      <DataTableHead>
        <DataTableRow>
          <DataTableHeaderCell>Not sortable</DataTableHeaderCell>
          <DataTableHeaderCell onSort={advanceSort} sortDirection={direction} sortable>Task</DataTableHeaderCell>
          <DataTableHeaderCell onSort={() => undefined} sortDirection="ascending" sortable>Due ascending</DataTableHeaderCell>
          <DataTableHeaderCell onSort={() => undefined} sortDirection="descending" sortable>Due descending</DataTableHeaderCell>
        </DataTableRow>
      </DataTableHead>
      <DataTableBody>
        <DataTableRow>
          <DataTableCell>Static</DataTableCell>
          <DataTableCell>Consumer-controlled</DataTableCell>
          <DataTableCell>Sep 12</DataTableCell>
          <DataTableCell>Sep 14</DataTableCell>
        </DataTableRow>
      </DataTableBody>
    </DataTable>
  )
}

const meta = {
  title: 'Components/Data Table',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A compositional native HTML table system. Signal owns presentation and structure; consumers own records, sorting, selection, column widths, overflow, and responsive transformations.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => <BasicTable />,
}

export const MixedSignalContent: Story = {
  render: () => <MixedTable />,
}

export const RowStates: Story = {
  render: () => (
    <DataTable aria-label="Row presentation states">
      <DataTableHead><DataTableRow><DataTableHeaderCell>State</DataTableHeaderCell></DataTableRow></DataTableHead>
      <DataTableBody>
        <DataTableRow><DataTableCell>Default row</DataTableCell></DataTableRow>
        <DataTableRow><DataTableCell>Hover this row</DataTableCell></DataTableRow>
        <DataTableRow selected><DataTableCell>Selected row</DataTableCell></DataTableRow>
      </DataTableBody>
    </DataTable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const hoverRow = canvas.getByText('Hover this row').closest('tr') as HTMLTableRowElement
    const selectedRow = canvas.getByText('Selected row').closest('tr') as HTMLTableRowElement
    const selectedBackground = getComputedStyle(selectedRow).backgroundColor
    await userEvent.hover(hoverRow)
    await expect(getComputedStyle(hoverRow).backgroundColor).not.toBe(selectedBackground)
    await userEvent.hover(selectedRow)
    await expect(getComputedStyle(selectedRow).backgroundColor).toBe(selectedBackground)
    await expect(hoverRow.style.cursor).toBe('')
    await expect(hoverRow.getAttribute('tabindex')).toBeNull()
  },
}

export const Sorting: Story = {
  render: () => <SortingExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const taskButton = canvas.getByRole('button', { name: 'Task' })
    const taskHeader = taskButton.closest('th') as HTMLTableCellElement
    await expect(taskHeader).not.toHaveAttribute('aria-sort')
    const hoverRule = Array.from(document.styleSheets).flatMap((sheet) => {
      try {
        return Array.from(sheet.cssRules)
      } catch {
        return []
      }
    }).find((rule) => rule instanceof CSSStyleRule && rule.selectorText === '.signal-data-table__sort-button:hover') as CSSStyleRule | undefined
    await expect(hoverRule?.style.background).toBe('var(--color-surface-selected)')
    taskButton.focus()
    await expect(taskButton).toHaveFocus()
    await expect(taskButton.matches(':focus-visible')).toBe(true)
    await expect(getComputedStyle(taskButton).boxShadow).not.toBe('none')
    await userEvent.click(taskButton)
    await expect(taskHeader).toHaveAttribute('aria-sort', 'ascending')
    await expect(canvas.getByRole('columnheader', { name: 'Due ascending' })).toHaveAttribute('aria-sort', 'ascending')
    await expect(canvas.getByRole('columnheader', { name: 'Due descending' })).toHaveAttribute('aria-sort', 'descending')
  },
}

export const WidthBehavior: Story = {
  render: () => (
    <div style={storyStack}>
      {[800, 1024, 1280].map((width) => (
        <section key={width} style={{ maxWidth: '100%', width }}>
          <p style={{ margin: '0 0 8px' }}>{width}px consumer container</p>
          <BasicTable label={`${width}px table`} />
        </section>
      ))}
    </div>
  ),
}

export const FocusEdges: Story = {
  render: () => <MixedTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvas.getByRole('table', { name: 'Tasks' })
    const selectAll = canvas.getByRole('checkbox', { name: 'Select all tasks' })
    const sortButton = canvas.getByRole('button', { name: 'Task' })
    const finalAction = canvas.getByRole('button', { name: 'More actions for Payment failure messaging' })
    const tableRect = table.getBoundingClientRect()

    await expect(getComputedStyle(table).overflow).toBe('visible')

    selectAll.focus()
    await expect(selectAll).toHaveFocus()
    const checkboxControl = selectAll.closest('.signal-checkbox')?.querySelector('.signal-checkbox__control') as HTMLElement
    const checkboxRect = checkboxControl.getBoundingClientRect()
    await expect(checkboxRect.left - tableRect.left).toBeGreaterThanOrEqual(4)

    sortButton.focus()
    await expect(sortButton).toHaveFocus()
    await expect(getComputedStyle(sortButton).boxShadow).not.toBe('none')

    finalAction.focus()
    await expect(finalAction).toHaveFocus()
    const actionRect = finalAction.getBoundingClientRect()
    await expect(tableRect.right - actionRect.right).toBeGreaterThanOrEqual(4)
  },
}

export const LightTheme: Story = {
  render: () => <MixedTable theme="light" />,
}

export const DarkTheme: Story = {
  render: () => <MixedTable theme="dark" />,
}
