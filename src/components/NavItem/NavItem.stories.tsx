import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { NavItem } from './NavItem'

const SearchIcon = () => (
  <svg fill="none" viewBox="0 0 16 16">
    <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.33" />
    <path d="m10 10 3 3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.33" />
  </svg>
)

const Frame = ({ children, width = 240 }: { children: ReactNode; width?: number }) => (
  <div style={{ width }}>{children}</div>
)

const ThemePreview = () => (
  <Frame>
    <NavItem href="#overview">Overview</NavItem>
    <NavItem href="#projects" icon={<SearchIcon />} current>Projects</NavItem>
    <NavItem href="#reports" disabled>Reports</NavItem>
  </Frame>
)

const meta = {
  title: 'Components/Nav Item',
  component: NavItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A native anchor for product navigation. Parent patterns own nav landmarks, list semantics, layout, and responsive behavior.',
      },
    },
  },
  tags: ['autodocs'],
  args: { children: 'Projects', href: '#projects' },
  argTypes: { icon: { control: false } },
} satisfies Meta<typeof NavItem>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: (args) => <Frame><NavItem {...args} /></Frame>,
}

export const WithIcon: Story = {
  args: { icon: <SearchIcon /> },
  render: (args) => <Frame><NavItem {...args} /></Frame>,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Projects' })
    const icon = link.querySelector('.signal-nav-item__icon') as HTMLElement
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(getComputedStyle(icon).color).toBe(getComputedStyle(link).color)
  },
}

export const Current: Story = {
  args: { current: true },
  render: (args) => <Frame><NavItem {...args} /></Frame>,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page')
  },
}

export const InteractionStates: Story = {
  render: () => (
    <Frame>
      <NavItem href="#overview">Overview</NavItem>
      <NavItem href="#projects" current>Projects</NavItem>
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const overview = canvas.getByRole('link', { name: 'Overview' })
    const projects = canvas.getByRole('link', { name: 'Projects' })

    await expect(getComputedStyle(overview).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    const currentBackground = getComputedStyle(projects).backgroundColor

    projects.focus()
    await expect(projects).toHaveFocus()
    await expect(projects.matches(':focus-visible')).toBe(true)
    await expect(getComputedStyle(projects).boxShadow).not.toBe('none')
    await expect(getComputedStyle(projects).backgroundColor).toBe(currentBackground)
  },
}

export const Disabled: Story = {
  args: { disabled: true, href: '#unavailable', onClick: fn() },
  render: (args) => <Frame><NavItem {...args}>Unavailable destination</NavItem></Frame>,
  play: async ({ args, canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Unavailable destination' })
    const view = canvasElement.ownerDocument.defaultView
    const initialHash = view?.location.hash

    await expect(link).toHaveAttribute('href', '#unavailable')
    await expect(link).toHaveAttribute('aria-disabled', 'true')
    link.focus()
    await expect(link).toHaveFocus()
    await expect(link.matches(':focus-visible')).toBe(true)
    await expect(getComputedStyle(link).boxShadow).not.toBe('none')

    await expect(getComputedStyle(link).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await userEvent.click(link)
    await userEvent.keyboard('{Enter}')
    await expect(args.onClick).not.toHaveBeenCalled()
    await expect(view?.location.hash).toBe(initialHash)
  },
}

export const LongLabel: Story = {
  args: { children: 'Quarterly planning and delivery operations workspace' },
  render: (args) => <Frame width={180}><NavItem {...args} /></Frame>,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link')
    const label = link.querySelector('.signal-nav-item__label') as HTMLElement
    await expect(getComputedStyle(label).whiteSpace).toBe('nowrap')
    await expect(getComputedStyle(label).textOverflow).toBe('ellipsis')
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth)
    await expect(link).not.toHaveAttribute('title')
  },
}

export const NavigationComposition: Story = {
  render: () => (
    <nav aria-label="Primary">
      <ul style={{ width: 240, margin: 0, padding: 0, listStyle: 'none' }}>
        <li><NavItem href="#projects" current>Projects</NavItem></li>
        <li><NavItem href="#tasks">My tasks</NavItem></li>
      </ul>
    </nav>
  ),
}

export const LightTheme: Story = {
  decorators: [(Story) => <div data-theme="light"><Story /></div>],
  render: () => <ThemePreview />,
}

export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ minHeight: 180, padding: 24, background: 'var(--color-surface-default)' }}>
        <Story />
      </div>
    ),
  ],
  render: () => <ThemePreview />,
}
