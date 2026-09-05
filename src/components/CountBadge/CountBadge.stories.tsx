import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { CountBadge } from './CountBadge'

const meta = {
  title: 'Components/Count Badge',
  component: CountBadge,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A compact, noninteractive quantity indicator. Consumers own formatting, visibility, and the surrounding context that gives the count meaning.',
      },
    },
  },
  tags: ['autodocs'],
  args: { children: '24' },
} satisfies Meta<typeof CountBadge>

export default meta
type Story = StoryObj<typeof meta>

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>{children}</div>
)

export const Basic: Story = {
  play: async ({ canvasElement }) => {
    await document.fonts.ready
    const badge = within(canvasElement).getByText('24')
    const bounds = badge.getBoundingClientRect()
    await expect(bounds.height).toBe(20)
    await expect(bounds.width).toBeGreaterThanOrEqual(29)
    await expect(bounds.width).toBeLessThanOrEqual(33)
    await expect(badge).not.toHaveAttribute('role')
    await expect(badge).not.toHaveAttribute('tabindex')
  },
}

export const Values: Story = {
  render: () => (
    <Row>
      {['0', '1', '8', '24', '99+'].map((value) => <CountBadge key={value}>{value}</CountBadge>)}
    </Row>
  ),
  play: async ({ canvasElement }) => {
    await document.fonts.ready
    const badges = [...canvasElement.querySelectorAll<HTMLElement>('.signal-count-badge')]
    await expect(badges).toHaveLength(5)
    badges.forEach((badge) => {
      expect(badge.getBoundingClientRect().height).toBe(20)
      expect(badge.scrollWidth).toBeLessThanOrEqual(badge.clientWidth)
      expect(getComputedStyle(badge).whiteSpace).toBe('nowrap')
    })
    expect(badges[3].getBoundingClientRect().width).toBeGreaterThan(badges[0].getBoundingClientRect().width)
    expect(badges[4].getBoundingClientRect().width).toBeGreaterThan(badges[3].getBoundingClientRect().width)
  },
}

export const InContext: Story = {
  render: () => <Row><span>Tasks</span><CountBadge>24</CountBadge></Row>,
}

export const LightTheme: Story = {
  decorators: [(Story) => <div data-theme="light"><Story /></div>],
  play: async ({ canvasElement }) => {
    const badge = within(canvasElement).getByText('24')
    const styles = getComputedStyle(badge)
    await expect(styles.backgroundColor).toBe('rgb(219, 234, 213)')
    await expect(styles.color).toBe('rgb(61, 59, 55)')
  },
}

export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ background: 'var(--color-background-default)', color: 'var(--color-text-primary)', padding: 32 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const badge = within(canvasElement).getByText('24')
    const styles = getComputedStyle(badge)
    await expect(styles.backgroundColor).toBe('rgb(206, 197, 186)')
    await expect(styles.color).toBe('rgb(25, 49, 34)')
  },
}
