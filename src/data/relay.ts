import type { TaskRecord } from '../components/TaskTable'

export const relayTasks: TaskRecord[] = [
  { id: 'hero-banner', title: 'Hero banner — copy and visuals', status: { label: 'In progress', tone: 'info' }, assignee: { initials: 'SR', name: 'Sofia Reyes' }, priority: 'High', due: 'Oct 3' },
  { id: 'email-drip', title: 'Email drip sequence (3 parts)', status: { label: 'Blocked', tone: 'danger' }, assignee: { initials: 'ML', name: 'Marcus Lin' }, priority: 'High', due: 'Oct 5' },
  { id: 'landing-page', title: 'Landing page A/B test setup', status: { label: 'Done', tone: 'success' }, assignee: { initials: 'PN', name: 'Priya Nair' }, priority: 'Medium', due: 'Oct 7', selected: true },
  { id: 'paid-social', title: 'Paid social ad creatives', status: { label: 'At risk', tone: 'warning' }, assignee: { initials: 'JO', name: 'James Okafor' }, priority: 'High', due: 'Oct 10' },
  { id: 'influencer', title: 'Influencer outreach brief', status: { label: 'Draft', tone: 'neutral' }, assignee: { initials: 'CM', name: 'Clara Mendez' }, priority: 'Low', due: 'Oct 12' },
  { id: 'seo', title: 'SEO long-form article (3,000 words)', status: { label: 'In progress', tone: 'info' }, assignee: { initials: 'SR', name: 'Sofia Reyes' }, priority: 'Medium', due: 'Oct 14' },
  { id: 'press-release', title: 'Press release draft', status: { label: 'Draft', tone: 'neutral' }, assignee: { initials: 'ML', name: 'Marcus Lin' }, priority: 'Low', due: 'Oct 16' },
  { id: 'demo-script', title: 'Product demo video script', status: { label: 'Done', tone: 'success' }, assignee: { initials: 'PN', name: 'Priya Nair' }, priority: 'High', due: 'Oct 18', selected: true },
  { id: 'retargeting', title: 'Retargeting pixel configuration', status: { label: 'At risk', tone: 'warning' }, assignee: { initials: 'JO', name: 'James Okafor' }, priority: 'Medium', due: 'Oct 21' },
  { id: 'analytics-report', title: 'Post-launch analytics report', status: { label: 'Draft', tone: 'neutral' }, assignee: { initials: 'CM', name: 'Clara Mendez' }, priority: 'Low', due: 'Oct 28' },
]
