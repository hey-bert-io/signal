import '../../tokens/index.css'
import axe from 'axe-core'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { RelayCampaign } from './RelayCampaign'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT:boolean }).IS_REACT_ACT_ENVIRONMENT=true

describe('RelayCampaign',()=>{it('switches all campaign views in one shell and preserves landmarks and active tabs',async()=>{const host=document.createElement('div');document.body.append(host);const root=createRoot(host);act(()=>root.render(<RelayCampaign/>));expect(host.querySelectorAll('main')).toHaveLength(1);expect(host.textContent).toContain('Campaign brief');const tasks=Array.from(host.querySelectorAll<HTMLButtonElement>('[role=tab]')).find((tab)=>tab.textContent?.includes('Tasks'))!;act(()=>tasks.click());expect(host.querySelector('[aria-selected=true]')?.textContent).toContain('Tasks');expect(host.querySelectorAll('tbody tr')).toHaveLength(10);const activity=Array.from(host.querySelectorAll<HTMLButtonElement>('[role=tab]')).find((tab)=>tab.textContent?.includes('Activity'))!;act(()=>activity.click());expect(host.querySelector('[aria-selected=true]')?.textContent).toContain('Activity');expect(host.querySelectorAll('.signal-activity-feed > li')).toHaveLength(7);expect((await axe.run(host)).violations).toEqual([]);act(()=>root.unmount());host.remove()})})
