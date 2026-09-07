import './TextField.css'

import { useId, useRef, useState } from 'react'

import { FieldLabel } from '../internal/FieldLabel'
import { FieldMessage } from '../internal/FieldMessage'
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
  const pointerFocus = useRef(false)
  const [focusVisible, setFocusVisible] = useState(false)
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
    <div
      className={classes}
      data-focus-visible={focusVisible || undefined}
      data-invalid={hasError || undefined}
      data-size={size}
      onBlurCapture={() => setFocusVisible(false)}
      onFocusCapture={(event) => {
        setFocusVisible(!pointerFocus.current && event.target.matches(':focus-visible'))
        pointerFocus.current = false
      }}
      onKeyDownCapture={() => setFocusVisible(true)}
      onPointerDownCapture={() => {
        pointerFocus.current = true
        setFocusVisible(false)
      }}
    >
      <FieldLabel hideLabel={hideLabel} htmlFor={inputId} optional={optional}>{label}</FieldLabel>

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

      {descriptionId ? (
        <FieldMessage error={hasError} id={descriptionId}>{hasError ? error : helperText}</FieldMessage>
      ) : null}
    </div>
  )
}
