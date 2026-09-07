import type { Meta, StoryObj } from '@storybook/react-vite'
import { RelayActivity } from './RelayActivity'

const meta = {
  title: '04 Relay/Activity', component: RelayActivity, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', a11y: { test: 'error' }, docs: { description: { component: 'The Relay Activity screen places reusable Activity Item and Activity Feed patterns inside the same responsive Signal shell used by Overview and Tasks.' } } },
  argTypes: { onThemeToggle: { control: false, table: { disable: true } }, onViewChange: { control: false, table: { disable: true } } },
} satisfies Meta<typeof RelayActivity>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Mobile: Story = { globals: { viewport: { value: 'mobile393', isRotated: false } } }
