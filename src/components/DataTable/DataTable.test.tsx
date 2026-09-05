import '../../tokens/index.css'

import axe from 'axe-core'
import { act, createRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

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

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

function renderTable(element: React.ReactElement) {
  container = document.createElement('div')
  container.style.width = '640px'
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(element))

  const table = container.querySelector('table') as HTMLTableElement | null
  if (!table) throw new Error('DataTable did not render')
  return table
}

function NativeTable({ onSort }: { onSort?: () => void }) {
  return (
    <DataTable aria-label="Tasks" data-table="tasks">
      <DataTableHead data-section="head">
        <DataTableRow data-row="header">
          <DataTableHeaderCell data-header="task" onSort={onSort} sortable>Task</DataTableHeaderCell>
          <DataTableHeaderCell>Status</DataTableHeaderCell>
        </DataTableRow>
      </DataTableHead>
      <DataTableBody data-section="body">
        <DataTableRow data-row="first">
          <DataTableCell data-cell="task"><strong>Checkout improvements</strong></DataTableCell>
          <DataTableCell>In progress</DataTableCell>
        </DataTableRow>
        <DataTableRow data-row="last">
          <DataTableCell>Empty state revisions</DataTableCell>
          <DataTableCell>Blocked</DataTableCell>
        </DataTableRow>
      </DataTableBody>
    </DataTable>
  )
}

afterEach(() => {
  act(() => root?.unmount())
  container?.remove()
  root = undefined
  container = undefined
  vi.restoreAllMocks()
})

describe('DataTable', () => {
  it('renders the complete native table structure and arbitrary children', () => {
    const table = renderTable(<NativeTable />)
    expect(table.tagName).toBe('TABLE')
    expect(table.tHead?.tagName).toBe('THEAD')
    expect(table.tBodies[0]?.tagName).toBe('TBODY')
    expect(table.rows[0]?.tagName).toBe('TR')
    expect(table.querySelector('th')?.tagName).toBe('TH')
    expect(table.querySelector('td')?.tagName).toBe('TD')
    expect(table.querySelector('th')?.scope).toBe('col')
    expect(table.querySelector('[data-cell="task"] strong')?.textContent).toBe('Checkout improvements')
    expect(table.querySelector('[role="grid"]')).toBeNull()
  })

  it('forwards native attributes, class names, styles, and refs for every primitive', () => {
    const tableRef = createRef<HTMLTableElement>()
    const headRef = createRef<HTMLTableSectionElement>()
    const bodyRef = createRef<HTMLTableSectionElement>()
    const rowRef = createRef<HTMLTableRowElement>()
    const headerRef = createRef<HTMLTableCellElement>()
    const cellRef = createRef<HTMLTableCellElement>()
    const table = renderTable(
      <DataTable className="consumer-table" id="projects" ref={tableRef} style={{ width: 500 }}>
        <DataTableHead data-native="head" ref={headRef}>
          <DataTableRow data-native="row" ref={rowRef}>
            <DataTableHeaderCell abbr="Project" ref={headerRef} scope="col">Project</DataTableHeaderCell>
          </DataTableRow>
        </DataTableHead>
        <DataTableBody data-native="body" ref={bodyRef}>
          <DataTableRow><DataTableCell colSpan={1} ref={cellRef}>Signal</DataTableCell></DataTableRow>
        </DataTableBody>
      </DataTable>,
    )
    expect(table.id).toBe('projects')
    expect(table.classList.contains('consumer-table')).toBe(true)
    expect(table.style.width).toBe('500px')
    expect(tableRef.current).toBe(table)
    expect(headRef.current?.dataset.native).toBe('head')
    expect(bodyRef.current?.dataset.native).toBe('body')
    expect(rowRef.current?.dataset.native).toBe('row')
    expect(headerRef.current?.abbr).toBe('Project')
    expect(cellRef.current?.colSpan).toBe(1)
  })

  it('applies selected presentation without adding row behavior or focusability', () => {
    const table = renderTable(
      <DataTable aria-label="Selection">
        <DataTableBody>
          <DataTableRow selected><DataTableCell>Selected</DataTableCell></DataTableRow>
        </DataTableBody>
      </DataTable>,
    )
    const row = table.rows[0]
    expect(row.hasAttribute('data-selected')).toBe(true)
    expect(row.getAttribute('tabindex')).toBeNull()
    expect(row.getAttribute('role')).toBeNull()
    expect(row.onclick).toBeNull()
    expect(getComputedStyle(row).cursor).not.toBe('pointer')
  })

  it('uses fixed layout, Figma geometry, rounded borders, and only inter-row separators', () => {
    const table = renderTable(<NativeTable />)
    const header = table.querySelector('th') as HTMLTableCellElement
    const cells = table.querySelectorAll('tbody td')
    const styles = getComputedStyle(table)
    expect(styles.width).toBe('640px')
    expect(styles.tableLayout).toBe('fixed')
    expect(styles.borderTopWidth).toBe('1px')
    expect(styles.borderRadius).toBe('8px')
    expect(styles.boxShadow).toBe('none')
    expect(styles.overflow).toBe('visible')
    expect(getComputedStyle(header).height).toBe('40px')
    expect(getComputedStyle(header).fontWeight).toBe('500')
    expect(getComputedStyle(header).fontSize).toBe('12px')
    expect(getComputedStyle(header).lineHeight).toBe('16px')
    expect(getComputedStyle(cells[0]).height).toBe('44px')
    expect(getComputedStyle(cells[0]).paddingLeft).toBe('12px')
    expect(getComputedStyle(cells[0]).fontWeight).toBe('400')
    expect(getComputedStyle(cells[0]).borderBottomWidth).toBe('1px')
    expect(getComputedStyle(cells[cells.length - 1]).borderBottomWidth).toBe('0px')
  })

  it('distinguishes non-sortable, unsorted, ascending, and descending headers', () => {
    const table = renderTable(
      <DataTable aria-label="Sort model">
        <DataTableHead>
          <DataTableRow>
            <DataTableHeaderCell>Static</DataTableHeaderCell>
            <DataTableHeaderCell sortable>Unsorted</DataTableHeaderCell>
            <DataTableHeaderCell sortDirection="ascending" sortable>Ascending</DataTableHeaderCell>
            <DataTableHeaderCell sortDirection="descending" sortable>Descending</DataTableHeaderCell>
          </DataTableRow>
        </DataTableHead>
      </DataTable>,
    )
    const headers = Array.from(table.querySelectorAll('th'))
    expect(headers[0].querySelector('button')).toBeNull()
    expect(headers[0].hasAttribute('aria-sort')).toBe(false)
    expect(headers[1].querySelector('button')?.textContent).toContain('Unsorted')
    expect(headers[1].hasAttribute('aria-sort')).toBe(false)
    expect(headers[2].getAttribute('aria-sort')).toBe('ascending')
    expect(headers[3].getAttribute('aria-sort')).toBe('descending')
    for (const indicator of table.querySelectorAll('.signal-data-table__sort-indicator')) {
      expect(indicator.getAttribute('aria-hidden')).toBe('true')
    }
  })

  it('invokes the consumer sort callback without reordering table data', () => {
    const onSort = vi.fn()
    const table = renderTable(<NativeTable onSort={onSort} />)
    const before = Array.from(table.tBodies[0].rows).map((row) => row.textContent)
    act(() => table.querySelector<HTMLButtonElement>('.signal-data-table__sort-button')?.click())
    const after = Array.from(table.tBodies[0].rows).map((row) => row.textContent)
    expect(onSort).toHaveBeenCalledOnce()
    expect(after).toEqual(before)
    expect(table.querySelector('button')?.textContent).toContain('Task')
  })

  it('composes existing Signal controls without knowing their content model', () => {
    const table = renderTable(
      <DataTable aria-label="Composed content">
        <DataTableBody>
          <DataTableRow>
            <DataTableCell><Checkbox aria-label="Select task" label="" /></DataTableCell>
            <DataTableCell><Status tone="success">Done</Status></DataTableCell>
            <DataTableCell><Avatar initials="EC" /></DataTableCell>
            <DataTableCell><IconButton aria-label="More actions" icon={<svg viewBox="0 0 16 16" />} size="small" variant="ghost" /></DataTableCell>
          </DataTableRow>
        </DataTableBody>
      </DataTable>,
    )
    expect(table.querySelector('input[type="checkbox"]')).not.toBeNull()
    expect(table.querySelector('.signal-status')).not.toBeNull()
    expect(table.querySelector('.signal-avatar')).not.toBeNull()
    expect(table.querySelector('.signal-icon-button')).not.toBeNull()
  })

  it('keeps sortable and nested edge-control focus treatments visible', () => {
    const table = renderTable(
      <DataTable aria-label="Focus edges">
        <DataTableHead><DataTableRow><DataTableHeaderCell sortable>Task</DataTableHeaderCell></DataTableRow></DataTableHead>
        <DataTableBody>
          <DataTableRow>
            <DataTableCell><Checkbox aria-label="Select task" label="" /></DataTableCell>
            <DataTableCell><IconButton aria-label="More actions" icon={<svg viewBox="0 0 16 16" />} size="small" variant="ghost" /></DataTableCell>
          </DataTableRow>
        </DataTableBody>
      </DataTable>,
    )
    const sortButton = table.querySelector('.signal-data-table__sort-button') as HTMLButtonElement
    const checkbox = table.querySelector('input') as HTMLInputElement
    const iconButton = table.querySelector('.signal-icon-button') as HTMLButtonElement

    act(() => sortButton.focus())
    expect(sortButton.matches(':focus-visible')).toBe(true)
    expect(getComputedStyle(sortButton).boxShadow).not.toBe('none')
    act(() => checkbox.focus())
    expect(checkbox).toBe(document.activeElement)
    act(() => iconButton.focus())
    expect(iconButton).toBe(document.activeElement)
    expect(getComputedStyle(table).overflow).toBe('visible')
  })

  it.each(['light', 'dark'] as const)('passes axe for a labelled %s composition', async (theme) => {
    const table = renderTable(
      <div data-theme={theme}>
        <h2 id={`${theme}-tasks`}>Tasks</h2>
        <DataTable aria-labelledby={`${theme}-tasks`}>
          <DataTableHead><DataTableRow><DataTableHeaderCell sortable>Task</DataTableHeaderCell><DataTableHeaderCell>Selection</DataTableHeaderCell></DataTableRow></DataTableHead>
          <DataTableBody>
            <DataTableRow selected>
              <DataTableCell>Checkout improvements</DataTableCell>
              <DataTableCell><Checkbox aria-label="Select Checkout improvements" defaultChecked label="" /></DataTableCell>
            </DataTableRow>
          </DataTableBody>
        </DataTable>
      </div>,
    )
    expect(table.getAttribute('aria-labelledby')).toBe(`${theme}-tasks`)
    const results = await axe.run(container as HTMLDivElement)
    expect(results.violations).toEqual([])
  })
})
