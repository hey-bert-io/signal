import type { Meta, StoryObj } from '@storybook/react-vite'
import { relayMilestones } from '../../data/relay'
import { MilestoneList } from './MilestoneList'

const meta = {
  title: '03 Patterns/Milestone List', component: MilestoneList, tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'A compact schedule pattern for completed and upcoming campaign milestones.' } } },
  args: { milestones: relayMilestones },
} satisfies Meta<typeof MilestoneList>

export default meta
export const Default: StoryObj<typeof meta> = {}
