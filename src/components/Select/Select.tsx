import './Select.css'

import { useId } from 'react'

import { FieldLabel } from '../internal/FieldLabel'
import { FieldMessage } from '../internal/FieldMessage'
import type { SelectProps } from './Select.types'

export function Select({
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  children,
  className,
  error,
  helperText,
  hideLabel = false,
  id,
  label,
  optional = false,
  ref,
  required,
  size = 'medium',
  ...selectProps
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? `signal-select-${generatedId}`
  const hasError = error !== undefined && error !== null && error !== false
  const hasHelper = helperText !== undefined && helperText !== null && helperText !== false
  const descriptionId = hasError
    ? `${selectId}-error`
    : hasHelper
      ? `${selectId}-helper`
      : undefined
  const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined
  const invalid = hasError ? true : ariaInvalid
  const classes = ['signal-select', className].filter(Boolean).join(' ')

  if (import.meta.env.DEV && optional && required) {
    console.warn('Signal Select: `optional` and native `required` should not be used together.')
  }

  return (
    <div className={classes} data-invalid={hasError || undefined} data-size={size}>
      <FieldLabel hideLabel={hideLabel} htmlFor={selectId} optional={optional}>{label}</FieldLabel>

      <div className="signal-select__control">
        <select
          {...selectProps}
          ref={ref}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className="signal-select__select"
          id={selectId}
          required={required}
        >
          {children}
        </select>
        <svg aria-hidden="true" className="signal-select__chevron" fill="none" viewBox="0 0 24 24">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </div>

      {descriptionId ? (
        <FieldMessage error={hasError} id={descriptionId}>{hasError ? error : helperText}</FieldMessage>
      ) : null}
    </div>
  )
}
