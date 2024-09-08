import type { RouteRecordRaw } from 'vue-router'

const APP_ROUTES: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'admin-dashboard' }
  },
  {
    path: '/install',
    name: 'Install',
    meta: {
      title: '安装引导'
    },
    component: () => import('@/views/install/index.vue')
  }
]

export default APP_ROUTES
