import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './Progress'

const meta = {
  title: '02 Components/Progress', component: Progress, tags: ['autodocs'],
  parameters: { layout: 'centered', docs: { description: { component: 'A determinate progress indicator with native progressbar semantics. Values are clamped to the supplied range; visible details can be omitted when context already provides them.' } } },
  args: { label: 'Campaign progress', value: 73, max: 100, showDetails: true },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const WithoutDetails: Story = { args: { showDetails: false } }
