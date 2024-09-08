import type { RouteRecordRaw } from 'vue-router'

export const SYSTEM_ROUTES: RouteRecordRaw[] = [
  {
    path: 'system',
    name: 'admin-system',
    meta: { title: '系统管理', icon: 'settings-4-fill' },
    redirect: { name: 'admin-system-site' },
    children: [
      {
        path: 'site',
        name: 'admin-system-site',
        component: () => import('@/views/admin/system/site/index.vue'),
        meta: { title: '站点信息', icon: 'slack-line' }
      },
      {
        path: 'icon',
        name: 'admin-system-icon',
        component: () => import('@/views/admin/system/icon/index.vue'),
        meta: { title: '系统图标', icon: 'album-line' }
      },
      {
        path: 'log',
        name: 'admin-system-log',
        component: () => import('@/views/admin/system/log/index.vue'),
        meta: { title: '系统日志', icon: 'pencil-ruler-2-line' }
      }
    ]
  }
]
