/**
 * 单独监听路由会浪费渲染性能。使用发布订阅模式去进行分发管理。
 */
import emitter from './index'

const key = 'APP_AUTH'

export const setAuthEmitter = (code: number) => {
  emitter.emit(key, code)
}

export const listenerAuthCode = () => {
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const systemStore = useSystemStore()

  emitter.on(key, (code: number) => {
    switch (code) {
      case 401:
        BaseMsg.error('登录失效，请重新登录')
        userStore.logout()
        router.replace({
          name: 'login',
          query: { redirect: encodeURIComponent(route.fullPath) }
        })
        break

      case 412:
        userStore.logout()
        systemStore.$reset()
        router.replace({ name: 'Install' })
        break
    }
  })
}
