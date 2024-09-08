import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/admin/index.vue'
import { SYSTEM_ROUTES } from '../app/system'
import { HTML_ROUTES } from '../app/html'

const ADMIN_ROUTES: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'Admin',
    component: AdminLayout,
    redirect: { name: 'admin-dashboard' },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/system/dashboard/index.vue'),
        meta: { title: '控制台', icon: 'dashboard-3-fill', permission: 1, fixed: true }
      },
      ...HTML_ROUTES,
      ...SYSTEM_ROUTES,
    ]
  }
]

export default ADMIN_ROUTES
