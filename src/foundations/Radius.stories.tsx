import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import './Foundation.css'

const radii = [2, 4, 6, 8, 10, 12, 'full'] as const

function Radius() {
  return (
    <div className="foundation-page">
      <header className="foundation-intro"><h1>Radius</h1><p>A restrained radius scale distinguishes controls, structural surfaces, and circular identities.</p></header>
      <div className="foundation-token-row">
        {radii.map((value) => (
          <div className="foundation-token" key={value}>
            <div className="foundation-radius-sample" style={{ '--sample-radius': `var(--radius-${value})` } as CSSProperties} />
            <code>--radius-{value}</code>
          </div>
        ))}
      </div>
    </div>
  )
}

const meta = { title: '01 Foundations/Radius', component: Radius, parameters: { layout: 'padded', controls: { disable: true }, docs: { description: { component: 'Geometry tokens keep component silhouettes related without flattening every surface into the same shape.' } } }, tags: ['autodocs'] } satisfies Meta<typeof Radius>
export default meta
export const Scale: StoryObj<typeof meta> = {}
