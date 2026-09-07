import type { Meta,StoryObj } from '@storybook/react-vite'; import { Progress } from './Progress'
const meta={title:'Components/Progress',component:Progress,tags:['autodocs'],args:{label:'Progress',value:73,max:100,showDetails:true}} satisfies Meta<typeof Progress>; export default meta; export const Determinate:StoryObj<typeof meta>={}
