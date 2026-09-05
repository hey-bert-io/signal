import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Tab, TabList, TabPanel, Tabs } from './Tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Horizontal tabs for switching between related panels in one context. ArrowLeft, ArrowRight, Home, and End move focus and automatically activate the destination tab. Disabled tabs are skipped.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

function ProjectTabs({ defaultValue = 'overview', disabledTasks = false }: { defaultValue?: string; disabledTasks?: boolean }) {
  return (
    <Tabs defaultValue={defaultValue}>
      <TabList aria-label="Project sections">
        <Tab value="overview">Overview</Tab>
        <Tab disabled={disabledTasks} value="tasks">Tasks</Tab>
        <Tab value="activity">Activity</Tab>
      </TabList>
      <TabPanel value="overview"><p>Project summary and recent progress.</p></TabPanel>
      <TabPanel value="tasks"><p>Tasks assigned to this project.</p></TabPanel>
      <TabPanel value="activity"><p>Recent project activity.</p></TabPanel>
    </Tabs>
  )
}

function ControlledExample() {
  const [value, setValue] = useState('tasks')
  return (
    <div>
      <ProjectTabsControlled value={value} onValueChange={setValue} />
      <p>Selected value: {value}</p>
    </div>
  )
}

function ProjectTabsControlled({ value, onValueChange }: { value: string; onValueChange: (value: string) => void }) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabList aria-label="Project sections">
        <Tab value="overview">Overview</Tab>
        <Tab value="tasks">Tasks</Tab>
        <Tab value="activity">Activity</Tab>
      </TabList>
      <TabPanel value="overview">Project summary</TabPanel>
      <TabPanel value="tasks">Project tasks</TabPanel>
      <TabPanel value="activity">Project activity</TabPanel>
    </Tabs>
  )
}

export const Default: Story = {
  render: () => <ProjectTabs />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tabList = canvas.getByRole('tablist')
    await document.fonts.ready
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    const initialRect = tabList.getBoundingClientRect()
    const scrollContainers = [
      canvasElement,
      canvasElement.parentElement,
      document.body,
      document.documentElement,
    ].filter((element, index, elements): element is HTMLElement => Boolean(element) && elements.indexOf(element) === index)

    const expectStableLayout = async () => {
      const currentRect = tabList.getBoundingClientRect()
      await expect(Math.abs(currentRect.x - initialRect.x)).toBeLessThan(0.5)
      await expect(Math.abs(currentRect.width - initialRect.width)).toBeLessThan(0.5)
      for (const element of scrollContainers) await expect(element.scrollLeft).toBe(0)
    }

    for (const label of ['Tasks', 'Activity', 'Overview']) {
      await userEvent.click(canvas.getByRole('tab', { name: label }))
      await expectStableLayout()
    }
  },
}

export const DifferentInitialSelection: Story = {
  render: () => <ProjectTabs defaultValue="activity" />,
}

export const Controlled: Story = { render: () => <ControlledExample /> }

export const DisabledTab: Story = {
  render: () => <ProjectTabs disabledTasks />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const overview = canvas.getByRole('tab', { name: 'Overview' })
    overview.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: 'Activity' })).toHaveFocus()
    await expect(canvas.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true')
  },
}

export const LongerLabels: Story = {
  render: () => (
    <Tabs defaultValue="summary">
      <TabList aria-label="Workspace sections">
        <Tab value="summary">Workspace summary</Tab>
        <Tab value="assignments">Current assignments</Tab>
        <Tab value="history">Activity history</Tab>
      </TabList>
      <TabPanel value="summary">Workspace summary</TabPanel>
      <TabPanel value="assignments">Current assignments</TabPanel>
      <TabPanel value="history">Activity history</TabPanel>
    </Tabs>
  ),
}

export const LightTheme: Story = {
  render: () => <ProjectTabs />,
  decorators: [(Story) => <div data-theme="light"><Story /></div>],
}

export const DarkTheme: Story = {
  render: () => <ProjectTabs />,
  decorators: [(Story) => <div data-theme="dark" style={{ background: 'var(--color-background-default)', color: 'var(--color-text-primary)', padding: 32 }}><Story /></div>],
}

export const KeyboardInteraction: Story = {
  render: () => <ProjectTabs />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const overview = canvas.getByRole('tab', { name: 'Overview' })
    overview.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: 'Tasks' })).toHaveFocus()
    await expect(canvas.getByRole('tab', { name: 'Tasks' })).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Tasks assigned')
  },
}

export const ActiveWithKeyboardFocus: Story = {
  render: () => <ProjectTabs />,
  play: async ({ canvasElement }) => {
    const tab = within(canvasElement).getByRole('tab', { name: 'Overview' })
    tab.focus()
    await expect(tab).toHaveFocus()
    await expect(tab).toHaveAttribute('aria-selected', 'true')
    await expect(tab.matches(':focus-visible')).toBe(true)
  },
}
