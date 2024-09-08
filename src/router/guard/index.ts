import type { Router } from 'vue-router'
import NProgress from 'nprogress'
import setupPageGuard from './page'
import setupLoginGuard from './login'
// import setupPermissionGuard from './permission'

export default function createRouteGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()

    // 页面守卫
    const pagePass = await setupPageGuard(to, from, next)
    if (pagePass) {
      NProgress.done()
      return
    }

    // 登录守卫
    // const loginPass = await setupLoginGuard(to, from, next)
    // if (loginPass) {
    //   NProgress.done()
    //   return
    // }

    next()
    // setupPermissionGuard(to, from, next)

    NProgress.done()
  })
}
