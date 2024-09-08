import 'nprogress/nprogress.css'
import NProgress from 'nprogress' // progress bar
import { appRoutes } from './routes'
import createRouteGuard from './guard'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

NProgress.configure({ showSpinner: false })

const routes: Readonly<RouteRecordRaw[]> = [...appRoutes]
const router = createRouter({
  routes,
  history:
    import.meta.env.APP_ROUTE_MODE === 'history'
      ? createWebHistory(import.meta.env.APP_BASE_URL)
      : createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  }
})

createRouteGuard(router)

export default router
