# Signal

**A design system built from Figma to React, then demonstrated in a product interface.**

Signal follows design decisions from foundations and semantic tokens through reusable React components, product patterns, testing, and delivery. Relay places those pieces in realistic campaign-management interfaces so the system can be evaluated beyond isolated examples.

[Live Storybook](https://hey-bert-io.github.io/signal/)

[![CI](https://github.com/hey-bert-io/signal/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/hey-bert-io/signal/actions/workflows/ci.yml)

## From design to delivery

| Stage | What it covers |
| --- | --- |
| **Design** | Figma foundations, semantic decisions, light and dark themes, components, and reusable patterns |
| **Build** | React, TypeScript, CSS, and Storybook implementation and documentation |
| **Demonstrate** | Relay applies Signal in three campaign-management screens: Overview, Tasks, and Activity |
| **Validate** | Vitest, Playwright-backed Chromium tests, axe-core checks, responsive behavior, and production builds |
| **Deliver** | GitHub Actions CI and automatic Storybook deployment to GitHub Pages |

**Figma / design → Signal / React system → Relay / product context → validation → delivery**

The implemented system and its behavior are documented in the [live Storybook](https://hey-bert-io.github.io/signal/).

## Relay

### The system in product context

Relay is a fictional campaign-management interface created to exercise Signal beyond isolated components and stories. It currently contains three screens:

- **Overview** composes campaign health metrics, progress and ownership, a campaign brief, and milestones.
- **Tasks** combines status, assignee, and priority filters with a responsive task table and selectable rows.
- **Activity** presents a named activity feed with people, campaign events, statuses, and timestamps.

Together, the screens demonstrate how Signal's foundations, components, and product patterns compose into a consistent responsive interface.

## Signal

### A small system with enough depth to test the whole process

Signal is intentionally focused rather than an attempt to become a general-purpose component library. Storybook currently organizes the system into:

| Layer | Inventory |
| --- | --- |
| **Foundations** | Colors, typography, spacing, and radius |
| **Components** | Button, Icon Button, Text Field, Select, Checkbox, Status, Status Indicator, Avatar, Progress, Tabs, Card, Data Table, Nav Item, and Count Badge |
| **Patterns** | Filter Bar, Campaign Header, Campaign Health, Milestone List, User Identity, Task Row, Task Table, Activity Item, Activity Feed, and App Shell |

The source system was designed in Figma and translated into a theme-aware implementation with this hierarchy:

**Primitives → semantic tokens → component tokens → components → patterns → Relay**

Storybook holds the detailed states, variants, controls, and usage examples; this README stays focused on the system's design-to-delivery path.

## Accessibility and testing

### Designed behavior, verified in the browser

Accessibility and interaction behavior are treated as part of each component's contract. The current suite contains **60 test files and 372 tests**, run across unit and Storybook projects in headless Chromium.

- **Component behavior:** Vitest checks rendering, native semantics, states, callbacks, and composition.
- **Browser interaction:** Playwright-backed tests exercise keyboard navigation, focus behavior, pointer behavior, filtering, selection, and responsive layouts.
- **Automated accessibility:** axe-core checks representative components, patterns, themes, and all three Relay views. Storybook's accessibility addon is configured to report violations as test errors.
- **Delivery checks:** CI also runs ESLint, the application build, and the production Storybook build.

Examples include distinguishing keyboard focus from pointer focus, requiring accessible names for icon-only controls, preventing disabled activation, checking representative light/dark contrast values, and exercising Relay from 320px through desktop viewports. These automated checks provide repeatable evidence; they are not a claim of complete accessibility or WCAG conformance.

## CI/CD

### From commit to public Storybook

The `CI` workflow runs for pushes to `main` and pull requests targeting `main`. On Node.js 22 it installs locked dependencies and Playwright Chromium, then runs linting, the full test suite, the application build, and the Storybook build.

Deployment is a separate `Deploy Storybook` workflow. It runs only after a successful `CI` workflow caused by a push to `main`; failed, cancelled, pull-request, and non-`main` runs cannot deploy. The workflow checks out the exact `head_sha` validated by CI, rebuilds Storybook, uploads `storybook-static/` as a GitHub Pages artifact, and deploys it to the [public Storybook](https://hey-bert-io.github.io/signal/).

## Tech stack

| Stage | Tools |
| --- | --- |
| **Design** | Figma |
| **Build** | React, TypeScript, CSS, Vite |
| **Document** | Storybook |
| **Validate** | Vitest, Playwright, axe-core, ESLint |
| **Deliver** | Git, GitHub Actions, GitHub Pages |

## Run locally

Use Node.js 22. From a fresh clone:

```sh
npm ci
npx playwright install --with-deps chromium
npm run storybook
```

Storybook runs at `http://localhost:6006`. The test suite also requires Playwright's Chromium browser.

```sh
npm test
npm run lint
npm run build
npm run build-storybook
```
