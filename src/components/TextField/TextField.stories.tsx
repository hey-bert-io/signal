import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { TextField } from './TextField'

const meta = {
  title: 'Components/Text Field',
  component: TextField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A native single-line input with a programmatically associated label. Placeholder is never a label substitute. Error replaces helper text and automatically applies invalid semantics. Optional is visual only; required remains native behavior.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Project name',
    placeholder: 'Enter project name',
  },
  argTypes: {
    size: { control: 'select', options: ['medium', 'large'] },
  },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Project name')
    await document.fonts.load('400 14px "IBM Plex Sans"')
    await expect(input).toHaveAttribute('placeholder', 'Enter project name')
    await expect(getComputedStyle(input).fontFamily).toContain('IBM Plex Sans')
    await expect(getComputedStyle(input).fontWeight).toBe('400')
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <TextField {...args} helperText="Medium, 36px" size="medium" />
      <TextField {...args} helperText="Large, 44px" size="large" />
    </div>
  ),
}

function ControlledExample() {
  const [value, setValue] = useState('Mobile checkout')
  return <TextField label="Project name" onChange={(event) => setValue(event.target.value)} value={value} />
}

export const FilledControlled: Story = { render: () => <ControlledExample /> }

export const HelperText: Story = {
  args: { helperText: 'Give this project a clear name.' },
}

export const Error: Story = {
  args: { defaultValue: 'Invalid project', error: 'Enter a valid project name.' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Project name')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
  },
}

export const Focus: Story = {
  args: { helperText: 'Give this project a clear name.' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Project name')
    await userEvent.click(input)
    await expect(input).toHaveFocus()
  },
}

export const ErrorAndFocus: Story = {
  args: { defaultValue: 'Invalid project', error: 'Enter a valid project name.' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Project name')
    await userEvent.click(input)
    await expect(input).toHaveFocus()
    await expect(input).toHaveAttribute('aria-invalid', 'true')
  },
}

export const Disabled: Story = {
  args: { disabled: true, helperText: 'This field is unavailable.', value: 'Maya Santos' },
}

export const ReadOnly: Story = {
  args: { helperText: 'Assigned when the project is created.', label: 'Project ID', readOnly: true, value: 'PRJ-1042' },
}

export const Optional: Story = {
  args: { label: 'Description', optional: true, placeholder: 'Short description' },
}

export const VisuallyHiddenLabel: Story = {
  args: { hideLabel: true, label: 'Search projects', placeholder: 'Search' },
}

export const LightTheme: Story = {
  args: { helperText: 'Give this project a clear name.' },
  decorators: [(Story) => <div data-theme="light"><Story /></div>],
}

export const DarkTheme: Story = {
  args: { helperText: 'Give this project a clear name.' },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ background: 'var(--color-background-default)', padding: 32 }}>
        <Story />
      </div>
    ),
  ],
}
