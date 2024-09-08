import { defineStore } from 'pinia'

interface ENV {
  APP_TITLE: string
  APP_BASE_URL: string
  APP_BASE_API: string
  APP_ROUTE_MODE: string
  APP_VERSION: string
  APP_OUT_DIR: string
  [key: string]: any
}
interface AppState {
  device: 'mobile' | 'pc'
  env: ENV
}

export const useAppStore = defineStore('appStore', {
  state: (): Partial<AppState> => ({
    device: 'mobile',
    env: import.meta.env as unknown as ENV
  }),

  getters: {
    isMobile: (state) => state.device === 'mobile'
  },
  actions: {
    toggleDevice(device?: 'pc' | 'mobile') {
      this.device = device || (this.device === 'mobile' ? 'pc' : 'mobile')
    }
  },
  persist: [
    {
      key: 'APP-CONFIG',
      storage: localStorage
    }
  ]
})
