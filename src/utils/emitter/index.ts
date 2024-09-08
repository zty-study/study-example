import mitt, { type Emitter } from 'mitt'
import type { RouteLocationNormalized } from 'vue-router'

declare type MittType<T = any> = {
  ROUTE_CHANGE: RouteLocationNormalized // 路由变化,
  APP_NOT_INSTALL: T // 未安装应用
  APP_AUTH: T // 应用权限
}

const emitter: Emitter<MittType> = mitt<MittType>()

export default emitter
