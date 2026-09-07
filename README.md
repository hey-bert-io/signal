# Signal

Signal is a React and TypeScript design system and reusable component library for software product teams. Its implementation carries a shared token and theme architecture from foundations through accessible components and product-level patterns.

Relay is the responsive campaign-management product built with Signal. Its Overview, Tasks, and Activity screens demonstrate the same components and patterns working together in a realistic interface.

Storybook is the primary proof artifact: it presents the progression from Signal foundations, to components, to reusable product patterns, to complete Relay screens. Light and dark themes and desktop, tablet, and mobile viewports can be selected from the Storybook toolbar.

## Commands

```sh
npm run dev
npm run storybook
npm test
npm run lint
npm run build
npm run build-storybook
```

Run `npm run storybook` for local exploration. Before submitting changes, run lint, tests, the production build, and the Storybook build.

## Public API

```tsx
import { Button, ThemeProvider } from '@signal/react'

<ThemeProvider>
  <Button variant="primary" size="medium">
    Save changes
  </Button>
</ThemeProvider>
```

The package is not configured for publishing yet. `src/index.ts` is the public source entry point.
