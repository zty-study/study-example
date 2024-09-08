/**
 * 单独监听路由会浪费渲染性能。使用发布订阅模式去进行分发管理。
 */
import emitter from './index'
import type { Handler } from 'mitt'
import type { RouteLocationNormalized } from 'vue-router'

const key = 'ROUTE_CHANGE'

let latestRoute: RouteLocationNormalized

export const setRouteEmitter = (to: RouteLocationNormalized) => {
  emitter.emit(key, to)
  latestRoute = to
}

export const listenerRouteChange = (
  handler: (route: RouteLocationNormalized) => void,
  immediate = true
) => {
  emitter.on(key, handler as Handler)
  if (immediate && latestRoute) {
    handler(latestRoute)
  }
}

export const removeRouteListener = () => {
  emitter.off(key)
}
