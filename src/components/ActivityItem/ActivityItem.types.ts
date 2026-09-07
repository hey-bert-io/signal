import type { ComponentPropsWithRef } from 'react'
import type { StatusIndicatorTone } from '../StatusIndicator'

export interface ActivityRecord {
  action: string
  actor: { initials: string; name: string }
  id: string
  object: string
  status?: { label: string; tone: StatusIndicatorTone }
  time: string
}

export interface ActivityItemProps extends ComponentPropsWithRef<'li'> {
  activity: ActivityRecord
}

export interface ActivityFeedProps extends ComponentPropsWithRef<'ol'> {
  activities: ActivityRecord[]
}
