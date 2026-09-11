import type { Meta, StoryObj } from '@storybook/react-vite'
import { RelayOverview } from './RelayOverview'

const meta = {
  title: '04 Relay/Overview', component: RelayOverview, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', a11y: { test: 'error' }, docs: { description: { component: 'Relay is the product proof built from Signal. The Overview screen composes the App Shell, Campaign Header, Campaign Health, Card, Progress, Status, Avatar, and Milestone List into one responsive campaign view.' } } },
  argTypes: { onViewChange: { control: false, table: { disable: true } } },
} satisfies Meta<typeof RelayOverview>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Mobile: Story = { globals: { viewport: { value: 'mobile393', isRotated: false } } }
