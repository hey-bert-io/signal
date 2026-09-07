import './StatusIndicator.css'
import type { StatusIndicatorProps } from './StatusIndicator.types'

export function StatusIndicator({ className, label = 'Status', showLabel = true, size = 'small', tone = 'neutral', ...props }: StatusIndicatorProps) {
  const classes = ['signal-status-indicator', className].filter(Boolean).join(' ')
  return <span {...props} className={classes} data-size={size} data-tone={tone}><span aria-hidden="true" className="signal-status-indicator__marker" />{showLabel ? <span>{label}</span> : null}</span>
}
