import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { IconButton } from './IconButton'

const SearchIcon = () => (
  <svg fill="none" viewBox="0 0 16 16">
    <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.33" />
    <path d="m10 10 3 3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.33" />
  </svg>
)

const PlusIcon = () => (
  <svg fill="none" viewBox="0 0 16 16">
    <path d="M8 3.33v9.34M3.33 8h9.34" stroke="currentColor" strokeLinecap="round" strokeWidth="1.33" />
  </svg>
)

const MoreIcon = () => (
  <svg fill="currentColor" viewBox="0 0 16 16">
    <circle cx="3" cy="8" r="1" /><circle cx="8" cy="8" r="1" /><circle cx="13" cy="8" r="1" />
  </svg>
)

const TrashIcon = () => (
  <svg fill="none" viewBox="0 0 16 16">
    <path d="M3.5 4.5h9M6 4.5v-1h4v1m-5 0 .5 8h5l.5-8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>{children}</div>
)

const meta = {
  title: 'Components/Icon Button',
  component: IconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Icon-only controls require an action-oriented accessible name via aria-label or aria-labelledby.',
      },
    },
  },
  tags: ['autodocs'],
  args: { 'aria-label': 'Search', icon: <SearchIcon /> },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    icon: { control: false },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Search' })
    await expect(button.dataset.variant).toBe('primary')
    await expect(button.dataset.size).toBe('medium')
  },
}

export const Variants: Story = {
  render: (args) => (
    <Row>
      <IconButton {...args} aria-label="Search" variant="primary" />
      <IconButton {...args} aria-label="Add project" icon={<PlusIcon />} variant="secondary" />
      <IconButton {...args} aria-label="More options" icon={<MoreIcon />} variant="ghost" />
      <IconButton {...args} aria-label="Delete project" icon={<TrashIcon />} variant="danger" />
    </Row>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <Row>
      <IconButton {...args} aria-label="Search, small" size="small" />
      <IconButton {...args} aria-label="Search, medium" size="medium" />
      <IconButton {...args} aria-label="Search, large" size="large" />
    </Row>
  ),
}

export const Disabled: Story = { args: { disabled: true } }

export const RepresentativeIcons: Story = {
  render: (args) => (
    <Row>
      <IconButton {...args} aria-label="Search" />
      <IconButton {...args} aria-label="Add project" icon={<PlusIcon />} />
      <IconButton {...args} aria-label="More options" icon={<MoreIcon />} />
      <IconButton {...args} aria-label="Delete project" icon={<TrashIcon />} variant="danger" />
    </Row>
  ),
}

export const LabelledBy: Story = {
  render: (args) => (
    <Row>
      <span id="storybook-search-label">Search projects</span>
      <IconButton {...args} aria-label={undefined} aria-labelledby="storybook-search-label" />
    </Row>
  ),
}

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
