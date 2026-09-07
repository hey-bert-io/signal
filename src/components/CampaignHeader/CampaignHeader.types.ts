import type { ComponentPropsWithRef } from 'react'
export interface CampaignHeaderProps extends ComponentPropsWithRef<'header'>{ title:string; description:string; taskCount?:number; onViewChange?:(view:string)=>void }
