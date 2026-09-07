import type { Meta, StoryObj } from '@storybook/react-vite'
import { RelayTasks } from './RelayTasks'

const meta = {
  title: '04 Relay/Tasks', component: RelayTasks, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', a11y: { test: 'error' }, docs: { description: { component: 'The Relay Tasks screen demonstrates Signal’s Filter Bar and Task Table patterns in their complete product context, including responsive column behavior and interactive selection.' } } },
  argTypes: { onThemeToggle: { control: false, table: { disable: true } }, onViewChange: { control: false, table: { disable: true } } },
} satisfies Meta<typeof RelayTasks>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Mobile: Story = { globals: { viewport: { value: 'mobile393', isRotated: false } } }
