import type { Decorator, Preview } from '@storybook/react-vite'

import '../src/tokens/index.css'
import '../src/styles/global.css'
import './preview.css'
import type { SignalTheme } from '../src/theme/theme.types'
import { SignalThemeDecorator } from './SignalThemeDecorator'

const withSignalTheme: Decorator = (Story, context) => (
  <SignalThemeDecorator theme={context.globals.theme as SignalTheme}>
    <Story />
  </SignalThemeDecorator>
)

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Signal color theme',
      toolbar: {
        icon: 'paintbrush',
        title: 'Theme',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [withSignalTheme],
  parameters: {
    options: {
      storySort: {
        order: [
          '01 Foundations',
          ['Visual Specimen', 'Colors', 'Typography', 'Spacing', 'Radius'],
          '02 Components',
          [
            'Button',
            'Icon Button',
            'Text Field',
            'Select',
            'Checkbox',
            'Status',
            'Status Indicator',
            'Avatar',
            'Progress',
            'Tabs',
            'Card',
            'Data Table',
            'Nav Item',
            'Count Badge',
          ],
          '03 Patterns',
          [
            'Filter Bar',
            'Campaign Header',
            'Campaign Health',
            'Milestone List',
            'User Identity',
            'Task Row',
            'Task Table',
            'Activity Item',
            'Activity Feed',
            'App Shell',
          ],
          '04 Relay',
          ['Overview', 'Tasks', 'Activity', 'Interactive Campaign'],
        ],
      },
    },
    viewport: {
      options: {
        desktop1440: { name: 'Desktop 1440', styles: { width: '1440px', height: '1024px' } },
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
      test: 'error',
    },
  },
};

export default preview;
