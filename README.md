# Signal

Signal is a React and TypeScript design system for software product teams. Figma is the source of truth; the implementation preserves its primitive, semantic, geometry, and component-token hierarchy.

Pass 01 contains the core token and theme architecture plus Button as the first complete component slice.

## Commands

```sh
npm run dev
npm run storybook
npm test
npm run lint
npm run build
npm run build-storybook
```

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
