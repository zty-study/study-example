import type { App } from 'vue'
import GridLayout from './components/GridLayout.vue'
import GridItem from './components/GridItem.vue'

const Vue3GridLayout = {
  install: (app: App) => {
    app.component('grid-layout', GridLayout)
    app.component('grid-item', GridItem)
  }
}

export { GridLayout, GridItem }
export type GridLayoutInstance = InstanceType<typeof GridLayout>
export type GridItemInstance = InstanceType<typeof GridItem>
export * from './types'
export default Vue3GridLayout
