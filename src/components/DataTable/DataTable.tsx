import './DataTable.css'

import type {
  DataTableBodyProps,
  DataTableCellProps,
  DataTableHeaderCellProps,
  DataTableHeadProps,
  DataTableProps,
  DataTableRowProps,
} from './DataTable.types'

function classes(base: string, className?: string) {
  return [base, className].filter(Boolean).join(' ')
}

/** A compositional native table surface. Consumers own data and behavior. */
export function DataTable({ className, ref, ...tableProps }: DataTableProps) {
  return <table {...tableProps} ref={ref} className={classes('signal-data-table', className)} />
}

/** The native table header section. */
export function DataTableHead({ className, ref, ...headProps }: DataTableHeadProps) {
  return <thead {...headProps} ref={ref} className={classes('signal-data-table__head', className)} />
}

/** The native table body section. */
export function DataTableBody({ className, ref, ...bodyProps }: DataTableBodyProps) {
  return <tbody {...bodyProps} ref={ref} className={classes('signal-data-table__body', className)} />
}

/** A native row. `selected` controls presentation only. */
export function DataTableRow({ className, ref, selected = false, ...rowProps }: DataTableRowProps) {
  return (
    <tr
      {...rowProps}
      ref={ref}
      className={classes('signal-data-table__row', className)}
      data-selected={selected ? '' : undefined}
    />
  )
}

/** A native data cell that accepts arbitrary consumer content. */
export function DataTableCell({ className, ref, ...cellProps }: DataTableCellProps) {
  return <td {...cellProps} ref={ref} className={classes('signal-data-table__cell', className)} />
}

/**
 * A native column header. Sortable headers expose a button presentation and
 * callback while the consumer remains responsible for controlled sort state.
 */
export function DataTableHeaderCell({
  children,
  className,
  ref,
  scope = 'col',
  sortDirection,
  sortable = false,
  onSort,
  ...headerProps
}: DataTableHeaderCellProps) {
  return (
    <th
      {...headerProps}
      ref={ref}
      aria-sort={sortable ? sortDirection : undefined}
      className={classes('signal-data-table__header-cell', className)}
      data-sortable={sortable ? '' : undefined}
      scope={scope}
    >
      {sortable ? (
        <button className="signal-data-table__sort-button" onClick={onSort} type="button">
          <span className="signal-data-table__sort-label">{children}</span>
          <span
            aria-hidden="true"
            className="signal-data-table__sort-indicator"
            data-direction={sortDirection ?? 'unsorted'}
          />
        </button>
      ) : children}
    </th>
  )
}
