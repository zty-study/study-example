import { removeRouteListener } from '@/utils/emitter/router'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useUserStore = defineStore('userStore', {
  state: (): Partial<Type.UserLogin> => ({
    token: undefined,
    user: undefined
  }),

  getters: {
    role: (state) => {
      if (state.token) {
        const payload = jwtDecode<Type.JwtHeader>(state.token)
        return payload.data.role
      } else return undefined
    },
    hasLogin: (state) => !!state.token
  },

  actions: {
    checkLogin() {
      return false
    },

    setUserInfo(data: Type.UserLogin) {
      this.$patch(data)
    },

    async logout() {
      this.$reset()
      removeRouteListener()
    }
  },

  persist: [
    {
      key: 'LOGIN-USER',
      paths: ['user', 'token'],
      storage: localStorage
    }
  ]
})
