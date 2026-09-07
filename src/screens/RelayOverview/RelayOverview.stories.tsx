import type { Meta,StoryObj } from '@storybook/react-vite'; import { RelayOverview } from './RelayOverview'
const meta={title:'Relay/Overview',component:RelayOverview,parameters:{layout:'fullscreen',a11y:{test:'error'}}} satisfies Meta<typeof RelayOverview>; export default meta; type Story=StoryObj<typeof meta>
export const Desktop:Story={parameters:{viewport:{defaultViewport:'desktop1440'}}}; export const Tablet:Story={parameters:{viewport:{defaultViewport:'tablet768'}}}; export const Mobile:Story={parameters:{viewport:{defaultViewport:'mobile393'}}}
