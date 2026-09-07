import type { TaskRecord } from '../components/TaskTable'
import type { ActivityRecord } from '../components/ActivityItem'
import type { CampaignMetric } from '../components/CampaignHealth'
import type { Milestone } from '../components/MilestoneList'

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

export const relayActivities: ActivityRecord[] = [
  { id: 'status-hero', actor: { initials: 'SR', name: 'Sofia Reyes' }, action: 'updated status of', object: 'Hero banner copy', status: { label: 'In progress', tone: 'info' }, time: '2h ago' },
  { id: 'complete-landing', actor: { initials: 'PN', name: 'Priya Nair' }, action: 'completed', object: 'Landing page A/B test setup', time: '4h ago' },
  { id: 'risk-social', actor: { initials: 'JO', name: 'James Okafor' }, action: 'flagged as at-risk', object: 'Paid social ad creatives', status: { label: 'At risk', tone: 'warning' }, time: '6h ago' },
  { id: 'comment-email', actor: { initials: 'ML', name: 'Marcus Lin' }, action: 'left a comment on', object: 'Email drip sequence', time: '1d ago' },
  { id: 'create-report', actor: { initials: 'CM', name: 'Clara Mendez' }, action: 'created', object: 'Post-launch analytics report', status: { label: 'Draft', tone: 'neutral' }, time: '2d ago' },
  { id: 'complete-demo', actor: { initials: 'PN', name: 'Priya Nair' }, action: 'completed', object: 'Product demo video script', status: { label: 'Done', tone: 'success' }, time: '2d ago' },
  { id: 'assign-seo', actor: { initials: 'SR', name: 'Sofia Reyes' }, action: 'was assigned', object: 'SEO long-form article', time: '3d ago' },
]

export const relayMetrics: CampaignMetric[] = [
  { label:'Total tasks', value:30, detail:'+3 this week', tone:'success' },
  { label:'Completed', value:22, detail:'73% done', tone:'info' },
  { label:'In progress', value:5, detail:'2 due this week', tone:'warning' },
  { label:'Blocked', value:3, detail:'Needs attention', tone:'danger' },
]

export const relayMilestones: Milestone[] = [
  { title:'Creative assets locked', date:'Oct 10', state:'completed' },
  { title:'Campaigns go live', date:'Oct 22', state:'upcoming' },
  { title:'Mid-campaign review', date:'Nov 1', state:'upcoming' },
  { title:'Wrap-up and reporting', date:'Nov 15', state:'upcoming' },
]
