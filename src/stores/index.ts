import { createPinia } from 'pinia'
import { useSystemStore } from './modules/system'
import { useUserStore } from './modules/user'
import { useAppStore } from './modules/app'

const pinia = createPinia()

export { useSystemStore, useUserStore, useAppStore }
export default pinia
