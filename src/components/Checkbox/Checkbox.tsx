import './Checkbox.css'

import { useCallback, useEffect, useId, useRef } from 'react'

import type { CheckboxProps } from './Checkbox.types'

export function Checkbox({
  'aria-describedby': ariaDescribedBy,
  className,
  id,
  indeterminate = false,
  label,
  ref,
  supportingText,
  ...inputProps
}: CheckboxProps) {
  const generatedId = useId()
  const inputId = id ?? `signal-checkbox-${generatedId}`
  const supportingId = `${inputId}-supporting`
  const hasSupporting = supportingText !== undefined && supportingText !== null && supportingText !== false
  const describedBy = [ariaDescribedBy, hasSupporting ? supportingId : undefined].filter(Boolean).join(' ') || undefined
  const inputRef = useRef<HTMLInputElement>(null)
  const classes = ['signal-checkbox', className].filter(Boolean).join(' ')

  const setInputRef = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node

    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }, [ref])

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <label className={classes} htmlFor={inputId}>
      <span className="signal-checkbox__control">
        <input
          {...inputProps}
          ref={setInputRef}
          aria-describedby={describedBy}
          className="signal-checkbox__input"
          id={inputId}
          type="checkbox"
        />
        <svg aria-hidden="true" className="signal-checkbox__mark signal-checkbox__check" fill="none" viewBox="0 0 16 16">
          <path d="M13.3333 4 6 11.3333 2.66667 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </svg>
        <svg aria-hidden="true" className="signal-checkbox__mark signal-checkbox__minus" fill="none" viewBox="0 0 16 16">
          <path d="M3.33333 8h9.33337" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </svg>
      </span>

      <span className="signal-checkbox__content">
        <span className="signal-checkbox__label">{label}</span>
        {hasSupporting ? (
          <span className="signal-checkbox__supporting" id={supportingId}>{supportingText}</span>
        ) : null}
      </span>
    </label>
  )
}
