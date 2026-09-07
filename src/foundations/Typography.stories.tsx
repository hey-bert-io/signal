import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import './Foundation.css'

const samples = [
  ['Page heading', '--font-size-page-heading', '--line-height-page-heading'],
  ['Emphasized body', '--font-size-body-emphasized', '--line-height-body-emphasized'],
  ['Body', '--font-size-body', '--line-height-body'],
  ['Label', '--font-size-label', '--line-height-label'],
] as const

function Typography() {
  return (
    <div className="foundation-page">
      <header className="foundation-intro"><h1>Typography</h1><p>IBM Plex Sans gives product UI a clear, compact hierarchy shared by the library and Relay.</p></header>
      <div className="foundation-section">
        {samples.map(([label, size, lineHeight]) => (
          <div className="foundation-type-sample" key={label}>
            <span style={{ fontSize: `var(${size})`, lineHeight: `var(${lineHeight})` } as CSSProperties}>{label} — Signal builds coherent product interfaces.</span>
            <code>{size} · {lineHeight}</code>
          </div>
        ))}
      </div>
    </div>
  )
}

const meta = { title: '01 Foundations/Typography', component: Typography, parameters: { layout: 'padded', controls: { disable: true }, docs: { description: { component: 'A deliberately compact type scale for data-dense software interfaces.' } } }, tags: ['autodocs'] } satisfies Meta<typeof Typography>
export default meta
export const TypeScale: StoryObj<typeof meta> = {}
