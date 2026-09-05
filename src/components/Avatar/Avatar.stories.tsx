import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import avatarPerson from './avatar-person.jpg'
import { Avatar } from './Avatar'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A non-interactive visual representation of a person. Supply one or two initials explicitly. A src selects the decorative image; failed images fall back to decorative initials. The surrounding composition owns accessible identity.',
      },
    },
  },
  tags: ['autodocs'],
  args: { initials: 'EC', size: 24 },
  argTypes: { size: { control: 'select', options: [24, 32, 40] } },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>{children}</div>
)

const AllSizesShowcase = () => (
  <Row>
    <Avatar initials="MS" size={24} />
    <Avatar initials="MS" size={32} />
    <Avatar initials="MS" size={40} />
    <Avatar initials="MS" size={24} src={avatarPerson} />
    <Avatar initials="MS" size={32} src={avatarPerson} />
    <Avatar initials="MS" size={40} src={avatarPerson} />
  </Row>
)

export const Default: Story = {}
export const Initials24: Story = { args: { initials: 'EC', size: 24 } }
export const Initials32: Story = { args: { initials: 'EC', size: 32 } }
export const Initials40: Story = { args: { initials: 'EC', size: 40 } }
export const Image24: Story = { args: { src: avatarPerson, size: 24 } }
export const Image32: Story = { args: { src: avatarPerson, size: 32 } }
export const Image40: Story = { args: { src: avatarPerson, size: 40 } }
export const OneCharacter: Story = { args: { initials: 'A', size: 40 } }
export const TwoCharacters: Story = { args: { initials: 'MS', size: 40 } }

export const AllSizes: Story = {
  render: () => <AllSizesShowcase />,
}

export const ImageCrop: Story = {
  args: { initials: 'MS', size: 40, src: avatarPerson },
  play: async ({ canvasElement }) => {
    const image = canvasElement.querySelector('img') as HTMLImageElement
    await expect(getComputedStyle(image).objectFit).toBe('cover')
    await expect(getComputedStyle(image).objectPosition).toBe('50% 50%')
  },
}

export const BrokenImageFallback: Story = {
  args: { initials: 'MS', size: 40, src: 'data:image/png;base64,not-an-image' },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText('MS')).toHaveAttribute('aria-hidden', 'true')
  },
}

export const AdjacentVisibleName: Story = {
  render: () => (
    <Row>
      <Avatar initials="MS" size={32} src={avatarPerson} />
      <span>Maya Santos</span>
    </Row>
  ),
}

export const AvatarOnlyNamedParent: Story = {
  render: () => (
    <button aria-label="Open profile for Maya Santos" type="button">
      <Avatar initials="MS" size={32} src={avatarPerson} />
    </button>
  ),
}

export const LightTheme: Story = {
  render: () => <AllSizesShowcase />,
  decorators: [(Story) => <div data-theme="light"><Story /></div>],
}

export const DarkTheme: Story = {
  render: () => <AllSizesShowcase />,
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ background: 'var(--color-background-default)', padding: 32 }}>
        <Story />
      </div>
    ),
  ],
}
