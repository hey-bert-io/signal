import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Checkbox } from './Checkbox'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A native checkbox with a required visible label. Supporting text describes the same control and the complete label composition is clickable. Indeterminate is a programmatic presentation state; native checked remains the submitted binary value.',
      },
    },
  },
  tags: ['autodocs'],
  args: { label: 'Notify assignee' },
  argTypes: { indeterminate: { control: 'boolean' } },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = {}
export const Checked: Story = { args: { defaultChecked: true } }

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Select all tasks' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('checkbox', { name: 'Select all tasks' })).toBePartiallyChecked()
  },
}

export const SupportingText: Story = {
  args: { supportingText: 'Send a notification when this task changes.' },
}

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Notify assignee' })
    await userEvent.tab()
    await expect(checkbox).toHaveFocus()
  },
}

export const DisabledUnchecked: Story = { args: { disabled: true } }
export const DisabledChecked: Story = { args: { defaultChecked: true, disabled: true } }
export const DisabledIndeterminate: Story = { args: { disabled: true, indeterminate: true } }

function ControlledExample() {
  const [checked, setChecked] = useState(false)
  return <Checkbox checked={checked} label="Notify assignee" onChange={(event) => setChecked(event.target.checked)} />
}

export const Controlled: Story = { render: () => <ControlledExample /> }
export const UncontrolledDefaultChecked: Story = { args: { defaultChecked: true } }

export const Wrapping: Story = {
  args: {
    label: 'Notify everyone assigned to this task when its status changes',
    supportingText: 'Notifications are sent according to each assignee’s personal notification preferences.',
  },
  decorators: [(Story) => <div style={{ width: 240 }}><Story /></div>],
}

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: 24 }}>
      <Checkbox label="Unchecked" />
      <Checkbox defaultChecked label="Checked" />
      <Checkbox indeterminate label="Indeterminate" />
      <Checkbox disabled label="Unchecked disabled" />
      <Checkbox defaultChecked disabled label="Checked disabled" />
      <Checkbox disabled indeterminate label="Indeterminate disabled" />
    </div>
  ),
}

export const KeyboardToggle: Story = {
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Notify assignee' })
    await userEvent.tab()
    await userEvent.keyboard('[Space]')
    await expect(checkbox).toBeChecked()
  },
}

export const LightTheme: Story = {
  args: { supportingText: 'Send a notification when this task changes.' },
  decorators: [(Story) => <div data-theme="light"><Story /></div>],
}

export const DarkTheme: Story = {
  args: { supportingText: 'Send a notification when this task changes.' },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ background: 'var(--color-background-default)', padding: 32 }}>
        <Story />
      </div>
    ),
  ],
}
