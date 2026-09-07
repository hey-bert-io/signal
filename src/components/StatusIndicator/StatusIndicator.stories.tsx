import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusIndicator } from './StatusIndicator'

const meta = {
  title: '02 Components/Status Indicator', component: StatusIndicator, tags: ['autodocs'],
  parameters: { layout: 'centered', docs: { description: { component: 'A compact dot-and-label indicator for supporting status detail. Keep the label visible unless adjacent text communicates the same state.' } } },
  args: { label: '5 in progress', tone: 'info' as const, size: 'small' as const, showLabel: true },
  argTypes: { tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] }, size: { control: 'select', options: ['small', 'medium'] } },
} satisfies Meta<typeof StatusIndicator>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Tones: Story = { render: () => <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>{(['neutral', 'info', 'success', 'warning', 'danger'] as const).map((tone) => <StatusIndicator key={tone} label={tone[0].toUpperCase() + tone.slice(1)} tone={tone} />)}</div> }
