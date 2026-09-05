import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Avatar } from '../Avatar'
import { Button } from '../Button'
import { Status } from '../Status'
import { Card } from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A non-interactive structural surface. Card owns its background, border, radius, and padding; consumer content owns layout, typography, semantics, and behavior.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

const cardWidth = { width: 'min(100%, 400px)' }

export const Basic: Story = {
  render: () => (
    <Card style={cardWidth}>
      <p style={{ margin: 0 }}>Card content is supplied entirely by the consumer.</p>
    </Card>
  ),
}

export const WrappingContent: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Card>
        <p style={{ margin: 0 }}>This longer passage wraps naturally because the story constrains its container while Card remains flexible.</p>
      </Card>
    </div>
  ),
}

export const WithSignalComponents: Story = {
  render: () => (
    <Card as="article" style={cardWidth}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar initials="MS" size={32} />
            <strong>Maya Santos</strong>
          </div>
          <Status tone="success">On track</Status>
        </div>
        <p style={{ margin: 0 }}>Review the current project milestones and delivery notes.</p>
        <div><Button>View project</Button></div>
      </div>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'View project' })
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await expect(button.matches(':focus-visible')).toBe(true)
    await expect(getComputedStyle(button.closest('.signal-card') as HTMLElement).overflow).toBe('visible')
  },
}

export const LightTheme: Story = {
  render: () => <Card style={cardWidth}>Light theme Card</Card>,
  decorators: [(Story) => <div data-theme="light"><Story /></div>],
}

export const DarkTheme: Story = {
  render: () => <Card style={cardWidth}>Dark theme Card</Card>,
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ background: 'var(--color-background-default)', color: 'var(--color-text-primary)', padding: 32 }}>
        <Story />
      </div>
    ),
  ],
}
