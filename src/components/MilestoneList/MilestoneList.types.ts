import type { ComponentPropsWithRef } from 'react'
export interface Milestone { title:string; date:string; state:'completed'|'upcoming' }
export interface MilestoneRowProps extends ComponentPropsWithRef<'li'>{ milestone:Milestone }
export interface MilestoneListProps extends ComponentPropsWithRef<'section'>{ title?:string; milestones:Milestone[] }
