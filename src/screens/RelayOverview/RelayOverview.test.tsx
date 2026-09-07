import '../../tokens/index.css'; import axe from 'axe-core'; import { act } from 'react'; import { createRoot } from 'react-dom/client'; import { describe,expect,it } from 'vitest'; import { RelayOverview } from './RelayOverview'
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT:boolean }).IS_REACT_ACT_ENVIRONMENT=true
describe('RelayOverview',()=>{it('composes the approved overview in the campaign shell and passes axe',async()=>{const host=document.createElement('div');document.body.append(host);const root=createRoot(host);act(()=>root.render(<RelayOverview/>));expect(host.querySelector('[aria-current="page"]')?.textContent).toContain('Campaigns');expect(host.querySelector('h1')?.textContent).toBe('Relay App Launch');expect(host.textContent).toContain('Campaign brief');expect(host.textContent).toContain('Wrap-up and reporting');expect(host.textContent).not.toContain('Finish Micro Proofs');expect((await axe.run(host)).violations).toEqual([]);act(()=>root.unmount());host.remove()})})

describe.each([
  ['light', 'rgb(255, 255, 255)', 'rgb(242, 236, 226)'],
  ['dark', 'rgb(24, 24, 27)', 'rgb(15, 15, 20)'],
] as const)('RelayOverview %s surfaces', (theme, defaultSurface, subtleSurface) => {
  it('uses the Figma surface hierarchy', () => {
    const host = document.createElement('div')
    host.dataset.theme = theme
    document.body.append(host)
    const root = createRoot(host)
    act(() => root.render(<RelayOverview />))

    const background = host.querySelector('.signal-app-shell__content') as HTMLElement
    const campaignHealth = host.querySelector('.signal-campaign-health') as HTMLElement
    const campaignBrief = host.querySelector('.signal-relay-overview__brief') as HTMLElement
    const milestones = host.querySelector('.signal-milestone-list') as HTMLElement
    const metric = host.querySelector('.signal-campaign-health__metric') as HTMLElement

    expect(getComputedStyle(background).backgroundColor).toBe(subtleSurface)
    expect(getComputedStyle(campaignHealth).backgroundColor).toBe(defaultSurface)
    expect(getComputedStyle(campaignBrief).backgroundColor).toBe(defaultSurface)
    expect(getComputedStyle(milestones).backgroundColor).toBe(defaultSurface)
    expect(getComputedStyle(metric).backgroundColor).toBe(subtleSurface)

    act(() => root.unmount())
    host.remove()
  })
})
