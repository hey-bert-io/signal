import type { HTMLAttributes, ReactNode, Ref } from 'react'

export type CardElement = 'div' | 'article' | 'section' | 'li'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement
  children?: ReactNode
  ref?: Ref<HTMLElement>
}
