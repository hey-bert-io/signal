import type { Preview } from '@storybook/react-vite'

import '../src/tokens/index.css'
import '../src/styles/global.css'
import './preview.css'
import { ThemeProvider } from '../src/theme/ThemeProvider'

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Signal color theme',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider className="signal-storybook-theme" defaultTheme={context.globals.theme} key={context.globals.theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    viewport: {
      options: {
        desktop1440: { name: 'Desktop 1440', styles: { width: '1440px', height: '900px' } },
        tablet768: { name: 'Tablet 768', styles: { width: '768px', height: '1024px' } },
        mobile393: { name: 'Mobile 393', styles: { width: '393px', height: '852px' } },
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      test: 'error'
    }
  },
};

export default preview;
