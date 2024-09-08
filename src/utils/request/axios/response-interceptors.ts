import type { AxiosInstance } from 'axios'
import { setAuthEmitter } from '@/utils/emitter/auth'

let msgNum = 0
const whiteCode = [200, 204]

export const resInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      setAuthEmitter(response.data.code)
      msgNum += 1
      if (!whiteCode.includes(response.data.code)) {
        BaseMsg.error(response?.data?.msg || '请求错误')
        if (msgNum >= 2) {
          msgNum = 0
          setTimeout(() => {
            BaseMsg.clear()
          }, 500)
        }
      }
      return response.data
    },
    (error) => {
      // 响应错误
      BaseMsg.error(error.response?.data?.msg || error.message)
      return {
        code: -1,
        msg: error.response?.data?.msg || error.message
      }
    }
  )
}
