import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Status } from './Status'

const meta = {
  title: 'Components/Status',
  component: Status,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A static, non-interactive product-state label. Status labels must communicate the state without relying on tone or the decorative indicator. Status does not create an ARIA live region.',
      },
    },
  },
  tags: ['autodocs'],
  args: { children: 'Draft', tone: 'neutral' },
  argTypes: { tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] } },
} satisfies Meta<typeof Status>

export default meta
type Story = StoryObj<typeof meta>

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>{children}</div>
)

const AllTonesShowcase = () => (
  <Row>
    <Status>Draft</Status>
    <Status tone="info">In progress</Status>
    <Status tone="success">Done</Status>
    <Status tone="warning">At risk</Status>
    <Status tone="danger">Blocked</Status>
  </Row>
)

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByText('Draft').closest('.signal-status')
    await expect(status).toHaveAttribute('data-tone', 'neutral')
    await expect(status).not.toHaveAttribute('role')
  },
}

export const Info: Story = { args: { children: 'In progress', tone: 'info' } }
export const Success: Story = { args: { children: 'Done', tone: 'success' } }
export const Warning: Story = { args: { children: 'At risk', tone: 'warning' } }
export const Danger: Story = { args: { children: 'Blocked', tone: 'danger' } }

export const AllTones: Story = {
  render: () => <AllTonesShowcase />,
}

export const CustomLabels: Story = {
  render: () => (
    <Row>
      <Status>Not started</Status>
      <Status tone="info">Active</Status>
      <Status tone="success">Healthy</Status>
      <Status tone="warning">Pending review</Status>
      <Status tone="danger">Overdue</Status>
    </Row>
  ),
}

export const LabelLengths: Story = {
  render: () => (
    <Row>
      <Status tone="success">Done</Status>
      <Status tone="info">In progress</Status>
      <Status tone="warning">Pending stakeholder review</Status>
    </Row>
  ),
}

export const ConstrainedParent: Story = {
  render: () => (
    <div style={{ width: 80, padding: 4 }}>
      <Status tone="warning">Pending stakeholder review</Status>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByText('Pending stakeholder review').closest('.signal-status') as HTMLElement
    await expect(getComputedStyle(status).whiteSpace).toBe('nowrap')
  },
}

export const LightTheme: Story = {
  render: () => <AllTonesShowcase />,
  decorators: [(Story) => <div data-theme="light"><Story /></div>],
}

export const DarkTheme: Story = {
  render: () => <AllTonesShowcase />,
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ background: 'var(--color-background-default)', padding: 32 }}>
        <Story />
      </div>
    ),
  ],
}
