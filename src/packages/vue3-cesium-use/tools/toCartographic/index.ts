import * as Cesium from 'cesium'
import { makeDestructurable } from '@vueuse/core'
import { type MaybeCartographic, normalizeCartographic } from '../../../shared/cesium/cartographic'

export function toCoordinates(source: Cesium.Cartesian3 | MaybeCartographic) {
  const createReturns = (longitude: number, latitude: number, height: number | undefined) =>
    makeDestructurable(
      {
        longitude,
        latitude,
        height
      },
      [longitude, latitude, height]
    )

  if (source instanceof Cesium.Cartesian3) {
    const {
      longitude: _longitude,
      latitude: _latitude,
      height
    } = Cesium.Cartographic.fromCartesian(source)
    const longitude = Cesium.Math.toDegrees(_longitude)
    const latitude = Cesium.Math.toDegrees(_latitude)

    return createReturns(longitude, latitude, height)
  }

  const { longitude, latitude, height } = normalizeCartographic(source)

  return createReturns(longitude, latitude, height)
}
