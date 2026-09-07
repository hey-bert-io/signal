import type { ComponentPropsWithRef } from 'react'
export interface ProgressProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> { label?: string; showDetails?: boolean; value: number; max?: number }
