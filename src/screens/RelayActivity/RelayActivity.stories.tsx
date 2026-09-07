import type { Meta, StoryObj } from '@storybook/react-vite'
import { RelayActivity } from './RelayActivity'

const meta = { title: 'Relay/Activity', component: RelayActivity, parameters: { layout: 'fullscreen', a11y: { test: 'error' } } } satisfies Meta<typeof RelayActivity>
export default meta
type Story = StoryObj<typeof meta>
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop1440' } } }
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet768' } } }
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile393' } } }
