import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Select } from './Select'

const StatusOptions = () => (
  <>
    <option disabled value="">Select status</option>
    <option value="active">Active</option>
    <option value="paused">Paused</option>
  </>
)

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A native single-select control. Native select has no placeholder attribute: use a disabled empty-value first option as the initial prompt. The prompt never replaces the associated label. Error replaces helper text and applies invalid semantics; Optional is visual only.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    children: <StatusOptions />,
    defaultValue: '',
    label: 'Status',
  },
  argTypes: {
    children: { control: false },
    size: { control: 'select', options: ['medium', 'large'] },
  },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByLabelText('Status')
    await expect(select).toHaveValue('')
    await expect(select.querySelector('option[value=""]')).toBeDisabled()
  },
}

export const Selected: Story = { args: { defaultValue: 'active' } }

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Select {...args} helperText="Medium, 36px" size="medium" />
      <Select {...args} helperText="Large, 44px" size="large" />
    </div>
  ),
}

export const HelperText: Story = { args: { helperText: 'Choose the current project status.' } }

export const Error: Story = {
  args: { error: 'Select a status.' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByLabelText('Status')).toHaveAttribute('aria-invalid', 'true')
  },
}

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByLabelText('Status')
    select.focus()
    await expect(select).toHaveFocus()
  },
}

export const ErrorAndFocus: Story = {
  args: { error: 'Select a status.' },
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByLabelText('Status')
    select.focus()
    await expect(select).toHaveFocus()
    await expect(select).toHaveAttribute('aria-invalid', 'true')
  },
}

export const Disabled: Story = { args: { defaultValue: 'paused', disabled: true } }
export const Optional: Story = { args: { optional: true } }
export const HiddenLabel: Story = { args: { hideLabel: true, label: 'Project status' } }
export const Required: Story = { args: { required: true } }

function ControlledExample() {
  const [value, setValue] = useState('active')
  return (
    <Select label="Status" onChange={(event) => setValue(event.target.value)} value={value}>
      <StatusOptions />
    </Select>
  )
}

export const Controlled: Story = { render: () => <ControlledExample /> }

export const LightTheme: Story = {
  args: { helperText: 'Choose the current project status.' },
  decorators: [(Story) => <div data-theme="light"><Story /></div>],
}

export const DarkTheme: Story = {
  args: { helperText: 'Choose the current project status.' },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ background: 'var(--color-background-default)', padding: 32 }}>
        <Story />
      </div>
    ),
  ],
}
