import { setRouteEmitter } from '@/utils/emitter/router'
import type {
  NavigationGuardNext,
  RouteLocationNormalizedGeneric,
  RouteLocationNormalizedLoadedGeneric
} from 'vue-router'

const title = import.meta.env.APP_TITLE

export default async function setupPageGuard(
  to: RouteLocationNormalizedGeneric,
  from: RouteLocationNormalizedLoadedGeneric,
  next: NavigationGuardNext
): Promise<boolean> {
  const systemStore = useSystemStore()
  // 设置页面标题
  document.title = to.meta?.title ? `${to.meta.title} - ${title}` : title

  // 安装页面跳转
  if (to.name === 'Install') {
    const { data } = await useInstallApi.check()
    if (data.install) {
      next({ name: 'Home' })
      return true
    }
    next()
    return true
  }

  setRouteEmitter(to)
  return false
}
