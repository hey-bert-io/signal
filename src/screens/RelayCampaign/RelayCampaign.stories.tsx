import type { Meta, StoryObj } from '@storybook/react-vite'
import { RelayCampaign } from './RelayCampaign'

const meta = {
  title: '04 Relay/Interactive Campaign', component: RelayCampaign, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', a11y: { test: 'error' }, docs: { description: { component: 'The integrated Relay campaign keeps Overview, Tasks, and Activity in one stateful screen. Use its tabs to inspect how the same Signal shell and product patterns transition between views.' } } },
  args: { initialView: 'overview' },
  argTypes: { initialView: { control: 'select', options: ['overview', 'tasks', 'activity'] }, onThemeToggle: { control: false, table: { disable: true } }, onViewChange: { control: false, table: { disable: true } } },
} satisfies Meta<typeof RelayCampaign>

export default meta
export const Default: StoryObj<typeof meta> = {}
