import type { Meta, StoryObj } from '@storybook/react-vite'

import './Foundation.css'

const semanticColors = [
  ['Background', '--color-background-default'],
  ['Raised surface', '--color-surface-raised'],
  ['Selected surface', '--color-surface-selected'],
  ['Primary text', '--color-text-primary'],
  ['Brand text', '--color-text-brand'],
  ['Focus border', '--color-border-focus'],
  ['Success', '--color-status-success'],
  ['Warning', '--color-status-warning'],
  ['Danger', '--color-status-danger'],
] as const

function Colors() {
  return (
    <div className="foundation-page">
      <header className="foundation-intro">
        <h1>Color</h1>
        <p>Semantic tokens connect Signal components and Relay screens to one light and dark theme architecture. Use the Theme toolbar to inspect both modes.</p>
      </header>
      <section className="foundation-section">
        <h2>Semantic roles</h2>
        <div className="foundation-grid">
          {semanticColors.map(([label, token]) => (
            <div className="foundation-swatch" key={token}>
              <div className="foundation-swatch__color" style={{ background: `var(${token})` }} />
              <div className="foundation-swatch__label"><strong>{label}</strong><code>{token}</code></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const meta = {
  title: '01 Foundations/Colors',
  component: Colors,
  parameters: { layout: 'padded', controls: { disable: true }, docs: { description: { component: 'Signal maps primitive color values to semantic roles, then exposes component-level aliases where a component needs a stable contract.' } } },
  tags: ['autodocs'],
} satisfies Meta<typeof Colors>

export default meta
export const SemanticPalette: StoryObj<typeof meta> = {}
