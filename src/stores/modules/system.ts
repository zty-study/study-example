import { defineStore } from 'pinia'

export const useSystemStore = defineStore('systemStore', {
  state: (): Partial<Type.SystemState> => ({
    logo: undefined,
    site_name: undefined,
    sub_title: undefined,
    not_install: undefined
  }),

  getters: {
    hasSystemConfig: (state) => !!state.site_name,
    pass: (state) => !!state.site_name || state.not_install
  },
  actions: {
    async init() {
      if (this.hasSystemConfig) return
      const { code, data } = await useConfigApi.sysConfig()
      if (code === 200) {
        this.$patch(data.json)
      } else {
        this.site_name = import.meta.env.APP_TITLE
        this.logo = '/static/images/logo/logo.svg'
        this.not_install = true
      }
    }
  },
  persist: [
    {
      key: 'SYSTEM-CONFIG',
      storage: sessionStorage
    }
  ]
})
