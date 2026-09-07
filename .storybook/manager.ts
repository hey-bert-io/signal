import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming/create'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Signal',
    brandUrl: './',
    brandTarget: '_self',
    colorPrimary: '#152cc0',
    colorSecondary: '#4f46e5',
  }),
})
