import type { ComponentPropsWithRef } from 'react'; import type { StatusTone } from '../Status'
export interface CampaignMetric{ label:string; value:string|number; detail:string; tone:Exclude<StatusTone,'neutral'> }
export interface CampaignHealthProps extends ComponentPropsWithRef<'section'>{ status:string; completed:number; inProgress:number; blocked:number; progress:number; owner:{name:string;initials:string;avatarSrc?:string}; deadline:string; deadlineDetail:string; metrics:CampaignMetric[]; onMore?:()=>void }
