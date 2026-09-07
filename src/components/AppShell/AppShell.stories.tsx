import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'

import { AppShell } from './AppShell'
import chartIcon from './assets/chart.svg'
import gridIcon from './assets/grid.svg'
import listIcon from './assets/list.svg'
import usersIcon from './assets/users.svg'
import cogIcon from './assets/cog.svg'

const Icon = ({ source }: { source: string }) => (
  <img alt="" className="signal-app-shell__asset-icon" src={source} />
)

const navigation = [
  { current: true, href: '#campaigns', icon: <Icon source={gridIcon} />, label: 'Campaigns' },
  { href: '#tasks', icon: <Icon source={listIcon} />, label: 'My tasks' },
  { href: '#analytics', icon: <Icon source={chartIcon} />, label: 'Analytics' },
  { href: '#team', icon: <Icon source={usersIcon} />, label: 'Team' },
]

const utilityNavigation = [{ href: '#settings', icon: <Icon source={cogIcon} />, label: 'Settings' }]

const meta = {
  title: 'Patterns/App Shell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Responsive Relay/Signal shell. Viewport CSS selects a persistent sidebar at 768px and above or the fixed-dark compact header below 768px.' } },
  },
  tags: ['autodocs'],
  args: {
    children: <p style={{ margin: 0 }}>Arbitrary product content slot</p>,
    identity: { initials: 'AR', name: 'Alex Rivera' },
    navigation,
    onMenuClick: fn(),
    onThemeToggle: fn(),
    themeLabel: 'Toggle color theme',
    utilityNavigation,
  },
  argTypes: {
    children: { control: false },
    identity: { control: 'object' },
    navigation: { control: 'object' },
    onMenuClick: { control: false },
    onThemeToggle: { control: false },
    utilityNavigation: { control: 'object' },
  },
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: 'desktop1440' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: 'Campaigns' })).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('main')).toHaveTextContent('Arbitrary product content slot')
  },
}

export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet768' } } }

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile393' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Open navigation menu' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Toggle color theme' })).toBeVisible()
  },
}
