import axe from 'axe-core'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import App from './App'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT:boolean }).IS_REACT_ACT_ENVIRONMENT=true

describe('Relay product',()=>{it('navigates campaign views and toggles its semantic theme in the product shell',async()=>{const host=document.createElement('div');document.body.append(host);const root=createRoot(host);act(()=>root.render(<App/>));expect(host.querySelectorAll('main')).toHaveLength(1);expect(host.querySelector('.signal-app-shell__sidebar')).not.toBeNull();expect(host.querySelector('.signal-app-shell__compact-header')).not.toBeNull();const tabs=()=>Array.from(host.querySelectorAll<HTMLButtonElement>('[role=tab]'));act(()=>tabs().find((tab)=>tab.textContent?.includes('Tasks'))!.click());expect(host.querySelector('table[aria-label="Relay campaign tasks"]')).not.toBeNull();act(()=>tabs().find((tab)=>tab.textContent?.includes('Activity'))!.click());expect(host.querySelector('ol[aria-label="Relay campaign activity"]')).not.toBeNull();expect(host.querySelector('.signal-app')?.getAttribute('data-theme')).toBe('light');act(()=>host.querySelector<HTMLButtonElement>('button[aria-label="Light mode"]')!.click());expect(host.querySelector('.signal-app')?.getAttribute('data-theme')).toBe('dark');expect((await axe.run(host)).violations).toEqual([]);act(()=>root.unmount());host.remove()})})
