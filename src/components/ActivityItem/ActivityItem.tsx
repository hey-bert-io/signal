import './ActivityItem.css'

import { Avatar } from '../Avatar'
import { StatusIndicator } from '../StatusIndicator'
import type { ActivityFeedProps, ActivityItemProps } from './ActivityItem.types'

export function ActivityItem({ activity, className, ...props }: ActivityItemProps) {
  return (
    <li {...props} className={['signal-activity-item', className].filter(Boolean).join(' ')}>
      <Avatar initials={activity.actor.initials} size={32} />
      <div className="signal-activity-item__body">
        <div className="signal-activity-item__top-row">
          <p className="signal-activity-item__headline">
            <strong>{activity.actor.name}</strong>
            {' '}<span>{activity.action}</span>
            {' '}<strong>{activity.object}</strong>
          </p>
          <time>{activity.time}</time>
        </div>
        {activity.status ? <StatusIndicator label={activity.status.label} tone={activity.status.tone} /> : null}
      </div>
    </li>
  )
}

export function ActivityFeed({ activities, className, ...props }: ActivityFeedProps) {
  return <ol {...props} className={['signal-activity-feed', className].filter(Boolean).join(' ')}>{activities.map((activity) => <ActivityItem activity={activity} key={activity.id} />)}</ol>
}
