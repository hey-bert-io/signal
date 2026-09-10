import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Checkbox } from '../components/Checkbox'
import { CountBadge } from '../components/CountBadge'
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHeaderCell,
  DataTableHead,
  DataTableRow,
} from '../components/DataTable'
import { NavItem } from '../components/NavItem'
import { Select } from '../components/Select'
import { Status } from '../components/Status'
import { Tab, TabList, TabPanel, Tabs } from '../components/Tabs'
import { TextField } from '../components/TextField'
import './VisualSpecimen.css'

function SpecimenGroup({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="visual-specimen__group">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function Foundations() {
  return (
    <SpecimenGroup title="Foundations">
      <div className="visual-specimen__foundations">
        <div className="visual-specimen__type-stack">
          <strong className="visual-specimen__page-heading">Product intelligence, clearly expressed.</strong>
          <span className="visual-specimen__emphasized">A restrained system for precise product work.</span>
          <span className="visual-specimen__body">IBM Plex Sans · body · 14 / 20</span>
          <span className="visual-specimen__label">LABEL · 12 / 16 · MEDIUM</span>
        </div>
        <div className="visual-specimen__swatches" aria-label="Representative semantic colors">
          <div className="visual-specimen__swatch" data-color="background"><span>Background</span></div>
          <div className="visual-specimen__swatch" data-color="surface"><span>Surface</span></div>
          <div className="visual-specimen__swatch" data-color="selected"><span>Selected</span></div>
          <div className="visual-specimen__swatch" data-color="accent"><span>Accent</span></div>
        </div>
        <div className="visual-specimen__geometry" aria-label="Representative borders and radii">
          <div data-radius="4">4</div>
          <div data-radius="8">8</div>
          <div data-radius="12">12</div>
          <span>1px border</span>
        </div>
      </div>
    </SpecimenGroup>
  )
}

function Actions() {
  return (
    <SpecimenGroup title="Actions & states">
      <div className="visual-specimen__state-grid">
        <span>Default</span><Button>Primary</Button><Button variant="secondary">Secondary</Button>
        <span>Hover</span><Button data-specimen-state="hover">Primary</Button><Button variant="secondary">Secondary</Button>
        <span>Focus</span><Button data-specimen-state="focus" variant="ghost">Ghost</Button><Button variant="danger">Danger</Button>
        <span>Disabled</span><Button disabled>Primary</Button><Button disabled variant="secondary">Secondary</Button>
      </div>
    </SpecimenGroup>
  )
}

function Forms() {
  return (
    <SpecimenGroup title="Forms">
      <div className="visual-specimen__forms">
        <TextField defaultValue="Quarterly launch" label="Project name" />
        <Select defaultValue="active" label="Status">
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </Select>
        <div className="visual-specimen__checks">
          <Checkbox defaultChecked label="Notify assignee" />
          <Checkbox indeterminate label="Select all tasks" />
        </div>
      </div>
    </SpecimenGroup>
  )
}

function Navigation() {
  return (
    <SpecimenGroup title="Navigation">
      <Tabs defaultValue="overview">
        <TabList aria-label="Specimen sections">
          <Tab value="overview">Overview</Tab>
          <Tab value="tasks">Tasks <CountBadge>8</CountBadge></Tab>
          <Tab value="activity">Activity</Tab>
        </TabList>
        <TabPanel value="overview" className="visual-specimen__tab-panel">
          <nav aria-label="Workspace">
            <NavItem current href="#projects">Projects</NavItem>
            <NavItem href="#tasks">My tasks</NavItem>
          </nav>
        </TabPanel>
        <TabPanel value="tasks" />
        <TabPanel value="activity" />
      </Tabs>
    </SpecimenGroup>
  )
}

function ProjectCard() {
  return (
    <Card as="article" className="visual-specimen__card">
      <div className="visual-specimen__card-topline">
        <div className="visual-specimen__identity">
          <Avatar initials="MS" size={32} />
          <span><strong>Maya Santos</strong><small>Product design</small></span>
        </div>
        <Status tone="success">On track</Status>
      </div>
      <div>
        <strong>Checkout improvements</strong>
        <p>Review milestones and delivery notes.</p>
      </div>
      <div className="visual-specimen__status-row">
        <Status>Draft</Status>
        <Status tone="info">In progress</Status>
        <Status tone="warning">At risk</Status>
        <Status tone="danger">Blocked</Status>
      </div>
    </Card>
  )
}

function TaskTable() {
  return (
    <DataTable aria-label="Current tasks">
      <colgroup>
        <col />
        <col style={{ width: 124 }} />
        <col style={{ width: 150 }} />
      </colgroup>
      <DataTableHead>
        <DataTableRow>
          <DataTableHeaderCell sortable>Task</DataTableHeaderCell>
          <DataTableHeaderCell>Status</DataTableHeaderCell>
          <DataTableHeaderCell>Assignee</DataTableHeaderCell>
        </DataTableRow>
      </DataTableHead>
      <DataTableBody>
        <DataTableRow>
          <DataTableCell>Checkout improvements</DataTableCell>
          <DataTableCell><Status tone="info">In progress</Status></DataTableCell>
          <DataTableCell><span className="visual-specimen__table-person"><Avatar initials="EC" /> Esther</span></DataTableCell>
        </DataTableRow>
        <DataTableRow selected>
          <DataTableCell>Analytics dashboard</DataTableCell>
          <DataTableCell><Status tone="success">Done</Status></DataTableCell>
          <DataTableCell><span className="visual-specimen__table-person"><Avatar initials="JD" /> James</span></DataTableCell>
        </DataTableRow>
        <DataTableRow>
          <DataTableCell>Empty state revisions</DataTableCell>
          <DataTableCell><Status tone="warning">At risk</Status></DataTableCell>
          <DataTableCell><span className="visual-specimen__table-person"><Avatar initials="NR" /> Noah</span></DataTableCell>
        </DataTableRow>
      </DataTableBody>
    </DataTable>
  )
}

function DarkSpecimen() {
  return (
    <section className="visual-specimen__dark" data-theme="dark">
      <h2>Dark theme</h2>
      <div className="visual-specimen__dark-content">
        <Button>Continue</Button>
        <Button variant="secondary">Secondary</Button>
        <TextField defaultValue="Signal workspace" hideLabel label="Workspace name" />
        <Status tone="success">On track</Status>
        <Status tone="warning">At risk</Status>
        <Avatar initials="AK" size={32} />
      </div>
    </section>
  )
}

function VisualSpecimen() {
  return (
    <main className="visual-specimen">
      <header className="visual-specimen__header">
        <div><span>Signal design system</span><h1>Visual specimen</h1></div>
        <span className="visual-specimen__mark">S / 01</span>
      </header>
      <Foundations />
      <div className="visual-specimen__main-grid">
        <div className="visual-specimen__column">
          <Actions />
          <Forms />
          <Navigation />
        </div>
        <div className="visual-specimen__column visual-specimen__column--wide">
          <SpecimenGroup title="Status & identity"><ProjectCard /></SpecimenGroup>
          <SpecimenGroup title="Data presentation"><TaskTable /></SpecimenGroup>
        </div>
      </div>
      <DarkSpecimen />
    </main>
  )
}

const meta = {
  title: '01 Foundations/Visual Specimen',
  component: VisualSpecimen,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    viewport: { defaultViewport: 'desktop1440' },
  },
} satisfies Meta<typeof VisualSpecimen>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const hoverButton = canvasElement.querySelector<HTMLButtonElement>('[data-specimen-state="hover"]')
    const focusButton = canvasElement.querySelector<HTMLButtonElement>('[data-specimen-state="focus"]')

    if (!hoverButton || !focusButton) throw new Error('Specimen state controls did not render')

    focusButton.focus()
    await userEvent.hover(hoverButton)

    await expect(focusButton).toHaveFocus()
    await expect(focusButton.matches(':focus-visible')).toBe(true)
    await expect(canvas.getByRole('table', { name: 'Current tasks' })).toBeVisible()
    await expect(canvasElement.querySelector('[data-theme="dark"]')).toBeVisible()
  },
}
