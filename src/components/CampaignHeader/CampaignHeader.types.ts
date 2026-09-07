import type { ComponentPropsWithRef } from 'react'
export type CampaignView = 'overview' | 'tasks' | 'activity'
export interface CampaignHeaderProps extends ComponentPropsWithRef<'header'>{ title:string; description:string; panelIdPrefix?:string; taskCount?:number; view?:CampaignView; onViewChange?:(view:CampaignView)=>void }
