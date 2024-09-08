import type { RouteRecordRaw } from 'vue-router'

export const HTML_ROUTES: RouteRecordRaw[] = [
  {
    path: 'html',
    name: 'admin-html',
    meta: { title: '网页模板', icon: 'html5-fill' },
    redirect: { name: 'admin-html-swivel' },
    children: [
      {
        path: 'swivel',
        name: 'admin-html-swivel',
        component: () => import('@/views/admin/html/swivel/index.vue'),
        meta: { title: '旋转木马', icon: 'anchor-fill' }
      },
    ]
  }
]
