import * as Cesium from 'cesium'
import { watchEffect, unref, type MaybeRefOrGetter, onBeforeUnmount } from 'vue'
import { getViewer } from '../useViewer'
import { toCartesian3 } from '../../tools/toCartesian3'

export type UseEntityPointOptions = Omit<Cesium.PointPrimitive, 'position' | 'id'>

export const usePoint = (
  data: MaybeRefOrGetter<
    | { id?: string | number; x: number; y: number; z: number }[]
    | { id?: string | number; longitude: number; latitude: number; height?: number }[]
  >,
  options?: UseEntityPointOptions,
  onEach?: (point: Cesium.PointPrimitive, index: number) => void
) => {
  const viewer = getViewer()
  const points: Map<string | number, Cesium.PointPrimitive> = new Map()
  const pointCollection = new Cesium.PointPrimitiveCollection()

  viewer.scene.primitives.add(pointCollection)

  const combinedOptions = {
    ...options,
    color: options?.color ?? Cesium.Color.WHITE,
    disableDepthTestDistance: options?.disableDepthTestDistance ?? Number.POSITIVE_INFINITY
  }

  const posValue = unref(data)

  watchEffect(() => {
    points.clear()
    pointCollection.removeAll()
    ;(posValue as any[]).forEach((item, index) => {
      let position: Cesium.Cartesian3
      if (Cesium.defined(item.lon)) {
        // Cartographic to Cartesian3 conversion
        position = toCartesian3(item.longitude, item.latitude, item.height ?? 0)
      } else {
        // Assume it's already Cartesian3
        position = toCartesian3(item.x, item.y, item.z)
      }

      const id = item.id ?? `point-${Math.random().toString(32).substring(2)}`

      const point = pointCollection.add({
        id,
        position,
        ...combinedOptions
      })

      points.set(item.id, point)

      onEach?.(point, index)
    })
  })

  const toggleShow = (state?: boolean) => {
    pointCollection.show = state === undefined ? !pointCollection.show : state
    pointCollection.show = state === undefined ? !pointCollection.show : state
  }

  const flyTo = async (
    id: string | number,
    fn?: (point: Cesium.PointPrimitive, position: Cesium.Cartesian3) => void
  ) => {
    const point = points.get(id)
    if (!point) throw new Error('cannot find point with the id.')

    fn && fn(point, point.position)

    const fly = async (pos: Cesium.Cartesian3) => {
      const entity = viewer.entities.add({
        position: pos,
        label: { fillColor: Cesium.Color.TRANSPARENT }
      })

      await viewer.flyTo(entity)
      viewer.entities.remove(entity)
    }
    await fly(point.position)

    return point
  }

  onBeforeUnmount(() => {
    // 清理资源
    viewer.scene.primitives.remove(pointCollection)
    pointCollection.destroy()
  })

  return {
    points,
    toggleShow,
    flyTo
  }
}
