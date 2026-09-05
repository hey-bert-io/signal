import type {
  ComponentPropsWithRef,
  MouseEventHandler,
  ReactNode,
} from 'react'

export type DataTableSortDirection = 'ascending' | 'descending'

export type DataTableProps = ComponentPropsWithRef<'table'>
export type DataTableHeadProps = ComponentPropsWithRef<'thead'>
export type DataTableBodyProps = ComponentPropsWithRef<'tbody'>
export type DataTableCellProps = ComponentPropsWithRef<'td'>

export interface DataTableRowProps extends ComponentPropsWithRef<'tr'> {
  selected?: boolean
}

export interface DataTableHeaderCellProps extends Omit<
  ComponentPropsWithRef<'th'>,
  'aria-sort' | 'children' | 'onSort'
> {
  children?: ReactNode
  sortable?: boolean
  sortDirection?: DataTableSortDirection
  onSort?: MouseEventHandler<HTMLButtonElement>
}
