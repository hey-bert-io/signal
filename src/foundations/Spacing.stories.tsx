import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import './Foundation.css'

const spacing = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64] as const

function Spacing() {
  return (
    <div className="foundation-page">
      <header className="foundation-intro"><h1>Spacing</h1><p>A shared spacing scale keeps components, patterns, and full screens rhythmically consistent.</p></header>
      <div className="foundation-token-row">
        {spacing.map((value) => (
          <div className="foundation-token" key={value}>
            <div className="foundation-spacing-sample" style={{ '--sample-size': `var(--spacing-${value})` } as CSSProperties} />
            <strong>{value}px</strong><code>--spacing-{value}</code>
          </div>
        ))}
      </div>
    </div>
  )
}

const meta = { title: '01 Foundations/Spacing', component: Spacing, parameters: { layout: 'padded', controls: { disable: true }, docs: { description: { component: 'Signal spacing tokens cover fine alignment through page-level composition.' } } }, tags: ['autodocs'] } satisfies Meta<typeof Spacing>
export default meta
export const Scale: StoryObj<typeof meta> = {}
