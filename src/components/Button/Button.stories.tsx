import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'

import { Button } from './Button'

const PlusIcon = () => (
  <svg fill="none" viewBox="0 0 16 16">
    <path d="M8 3.33v9.34M3.33 8h9.34" stroke="currentColor" strokeLinecap="round" strokeWidth="1.33" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg fill="none" viewBox="0 0 16 16">
    <path d="M3.33 8h9.34m-4-4 4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
  </svg>
)

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { children: 'Save changes', onClick: fn() },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>{children}</div>
)

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Save changes' })
    await document.fonts.load('500 14px "IBM Plex Sans"')

    let mediumFaceLoaded = false
    document.fonts.forEach((face) => {
      if (face.family.replaceAll('"', '') === 'IBM Plex Sans' && face.weight === '500' && face.status === 'loaded') {
        mediumFaceLoaded = true
      }
    })

    expect(getComputedStyle(button).fontFamily).toContain('IBM Plex Sans')
    expect(getComputedStyle(button).fontWeight).toBe('500')
    expect(mediumFaceLoaded).toBe(true)
  },
}

export const Variants: Story = {
  render: (args) => (
    <Row>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="danger">Danger</Button>
    </Row>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <Row>
      <Button {...args} size="small">Small</Button>
      <Button {...args} size="medium">Medium</Button>
      <Button {...args} size="large">Large</Button>
    </Row>
  ),
}

export const Disabled: Story = { args: { disabled: true } }
export const LeadingIcon: Story = { args: { leadingIcon: <PlusIcon /> } }
export const TrailingIcon: Story = { args: { children: 'Continue', trailingIcon: <ArrowRightIcon /> } }

export const LightTheme: Story = {
  decorators: [(Story) => <div data-theme="light"><Story /></div>],
}

export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ background: 'var(--color-background-default)', padding: 32 }}>
        <Story />
      </div>
    ),
  ],
}
