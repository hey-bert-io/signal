import '../../tokens/index.css'

import axe from 'axe-core'
import { act, createRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Avatar } from '../Avatar'
import { Button } from '../Button'
import { Status } from '../Status'
import { Card } from './Card'

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

function renderCard(element: React.ReactElement = <Card>Arbitrary content</Card>) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(element))

  const card = container.querySelector('.signal-card') as HTMLElement | null
  if (!card) throw new Error('Card did not render')
  return card
}

afterEach(() => {
  act(() => root?.unmount())
  container?.remove()
  root = undefined
  container = undefined
})

describe('Card', () => {
  it('renders arbitrary children in a div without automatic interactive semantics', () => {
    const card = renderCard(<Card><span>First</span><em>Second</em></Card>)
    expect(card.tagName).toBe('DIV')
    expect(card.textContent).toBe('FirstSecond')
    expect(card.getAttribute('role')).toBeNull()
    expect(card.getAttribute('tabindex')).toBeNull()
    expect(card.textContent).not.toContain('Compose content here')
  })

  it.each(['article', 'section', 'li'] as const)('supports a semantic %s root', (as) => {
    expect(renderCard(<Card as={as}>Content</Card>).tagName).toBe(as.toUpperCase())
  })

  it('forwards native attributes, composes className, and resolves its root ref', () => {
    const ref = createRef<HTMLElement>()
    const card = renderCard(
      <Card
        aria-describedby="card-description"
        className="project-card"
        data-project-id="signal"
        id="project-card"
        ref={ref}
        style={{ width: 320 }}
        title="Project summary"
      >
        Content
      </Card>,
    )
    expect(card.id).toBe('project-card')
    expect(card.classList.contains('signal-card')).toBe(true)
    expect(card.classList.contains('project-card')).toBe(true)
    expect(card.dataset.projectId).toBe('signal')
    expect(card.getAttribute('aria-describedby')).toBe('card-description')
    expect(card.title).toBe('Project summary')
    expect(card.style.width).toBe('320px')
    expect(ref.current).toBe(card)
  })

  it('uses only the intended Card token hooks and geometry', () => {
    const card = renderCard()
    const styles = getComputedStyle(card)
    expect(styles.boxSizing).toBe('border-box')
    expect(styles.paddingTop).toBe('16px')
    expect(styles.paddingRight).toBe('16px')
    expect(styles.paddingBottom).toBe('16px')
    expect(styles.paddingLeft).toBe('16px')
    expect(styles.borderTopWidth).toBe('1px')
    expect(styles.borderTopStyle).toBe('solid')
    expect(styles.borderRadius).toBe('8px')
    expect(styles.boxShadow).toBe('none')
    expect(styles.overflow).toBe('visible')
    expect(styles.display).toBe('block')
  })

  it.each([
    ['light', 'rgb(255, 255, 255)', 'rgb(206, 197, 186)'],
    ['dark', 'rgb(61, 59, 55)', 'rgb(104, 97, 88)'],
  ] as const)('resolves Card aliases in the %s theme', (theme, background, border) => {
    const card = renderCard(<Card data-theme={theme}>Content</Card>)
    const styles = getComputedStyle(card)
    expect(styles.backgroundColor).toBe(background)
    expect(styles.borderTopColor).toBe(border)
  })

  it('supports nested Signal components without clipping their focus treatment', () => {
    const card = renderCard(
      <Card>
        <Status tone="success">On track</Status>
        <Avatar initials="MS" />
        <Button>Open project</Button>
      </Card>,
    )
    const button = card.querySelector('button') as HTMLButtonElement
    act(() => button.focus())
    expect(card.querySelector('.signal-status')).not.toBeNull()
    expect(card.querySelector('.signal-avatar')).not.toBeNull()
    expect(button).toBe(document.activeElement)
    expect(getComputedStyle(card).overflow).toBe('visible')
  })

  it.each(['light', 'dark'] as const)('passes axe for a representative %s composition', async (theme) => {
    const card = renderCard(
      <div data-theme={theme} style={{ color: 'var(--color-text-primary)' }}>
        <Card as="article" aria-labelledby={`${theme}-card-title`}>
          <h2 id={`${theme}-card-title`}>Project health</h2>
          <Status tone="success">On track</Status>
          <p>All milestones are progressing as planned.</p>
          <Button>View project</Button>
        </Card>
      </div>,
    )
    const results = await axe.run(card)
    expect(results.violations).toEqual([])
  })
})
