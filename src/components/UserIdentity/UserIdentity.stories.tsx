import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import avatarPerson from '../Avatar/avatar-person.jpg'
import { UserIdentity } from './UserIdentity'

const meta = {
  title: '03 Patterns/User Identity',
  component: UserIdentity,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Non-interactive authenticated-user identity composed from Signal Avatar and identity text.' } },
  },
  tags: ['autodocs'],
  args: { display: 'full', initials: 'EC', name: 'Esther Collins' },
  argTypes: {
    avatarSrc: { control: 'text' },
    display: { control: 'select', options: ['full', 'avatar-only'] },
  },
} satisfies Meta<typeof UserIdentity>

export default meta
type Story = StoryObj<typeof meta>

export const Full: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Esther Collins')).toBeVisible()
  },
}

export const WithAvatarImage: Story = { args: { avatarSrc: avatarPerson } }

export const AvatarOnly: Story = {
  args: { display: 'avatar-only' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Esther Collins')).toBeInTheDocument()
  },
}
