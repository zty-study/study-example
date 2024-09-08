import type { InternalAxiosRequestConfig, AxiosInstance } from 'axios'

export const reqInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const userStore = useUserStore()

      if (config.headers.auth) {
        config.headers['Authorization'] = userStore.token
      }
      delete config.headers['auth']
      return config
    },
    (error: any) => {
      return Promise.reject(error)
    }
  )
}
