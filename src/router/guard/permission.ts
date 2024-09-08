import type { Router, RouteRecordNormalized } from 'vue-router'
import NProgress from 'nprogress'

export default function setupPermissionGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    next()
    NProgress.done()
  })
}
