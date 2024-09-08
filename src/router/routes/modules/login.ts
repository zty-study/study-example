import type { RouteRecordRaw } from 'vue-router'
import LoginLayout from '@/layouts/login/index.vue'

const BASE_ROUTES: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: LoginLayout,
    redirect: { name: 'login' },
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: { title: '登录' }
      }
    ]
  }
]

export default BASE_ROUTES
