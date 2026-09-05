import './TextField.css'

import { useId } from 'react'

import type { TextFieldProps } from './TextField.types'

export function TextField({
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
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
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? `signal-text-field-${generatedId}`
  const hasError = error !== undefined && error !== null && error !== false
  const hasHelper = helperText !== undefined && helperText !== null && helperText !== false
  const descriptionId = hasError
    ? `${inputId}-error`
    : hasHelper
      ? `${inputId}-helper`
      : undefined
  const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined
  const invalid = hasError ? true : ariaInvalid
  const classes = ['signal-text-field', className].filter(Boolean).join(' ')

  if (import.meta.env.DEV && optional && required) {
    console.warn('Signal TextField: `optional` and native `required` should not be used together.')
  }

  return (
    <div className={classes} data-invalid={hasError || undefined} data-size={size}>
      <div className={`signal-text-field__label-row${hideLabel ? ' signal-text-field__label-row--hidden' : ''}`}>
        <label className="signal-text-field__label" htmlFor={inputId}>{label}</label>
        {optional ? <span aria-hidden="true" className="signal-text-field__optional">Optional</span> : null}
      </div>

      <div className="signal-text-field__control">
        <input
          {...inputProps}
          ref={ref}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className="signal-text-field__input"
          id={inputId}
          required={required}
        />
      </div>

      {hasError ? (
        <div className="signal-text-field__message signal-text-field__message--error" id={descriptionId}>
          <svg aria-hidden="true" className="signal-text-field__error-icon" fill="none" viewBox="0 0 24 24">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
            <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
          <span>{error}</span>
        </div>
      ) : hasHelper ? (
        <div className="signal-text-field__message" id={descriptionId}>{helperText}</div>
      ) : null}
    </div>
  )
}
