import type { RouteRecordRaw } from 'vue-router'

export const CESIUM_ROUTES: RouteRecordRaw[] = [
  {
    path: 'cesium',
    name: 'admin-cesium',
    meta: { title: 'Cesium示例', icon: 'earth-fill' },
    redirect: { name: 'admin-cesium-entity' },
    children: [
      {
        path: 'entity',
        name: 'admin-cesium-entity',
        component: () => import('@/views/admin/cesium/entity/index.vue'),
        meta: { title: '绘制实体', icon: 'ancient-pavilion-line' }
      },
    ]
  }
]
