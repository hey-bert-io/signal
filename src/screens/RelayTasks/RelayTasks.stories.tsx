import type { Meta, StoryObj } from '@storybook/react-vite'
import { RelayTasks } from './RelayTasks'

const meta = { title: 'Relay/Tasks', component: RelayTasks, parameters: { layout: 'fullscreen', a11y: { test: 'error' } } } satisfies Meta<typeof RelayTasks>
export default meta
type Story = StoryObj<typeof meta>
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop1440' } } }
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet768' } } }
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile393' } } }
