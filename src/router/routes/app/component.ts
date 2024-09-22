import type { RouteRecordRaw } from 'vue-router'

export const COMPONENT_ROUTES: RouteRecordRaw[] = [
  {
    path: 'component',
    name: 'admin-component',
    meta: { title: '常用组件', icon: 'bank-fill' },
    redirect: { name: 'admin-component-grid' },
    children: [
      {
        path: 'grid',
        name: 'admin-component-grid',
        component: () => import('@/views/admin/component/grid/index.vue'),
        meta: { title: '拖拽布局', icon: 'layout-grid-line', noKeepAlive: true }
      }
    ]
  }
]
