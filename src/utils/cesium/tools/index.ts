import * as Cesium from 'cesium'

/**
 * 屏幕坐标转地理坐标
 */
export const screenToGeographic = (
  viewer: Cesium.Viewer,
  position: Cesium.Cartesian2
): Type.Geographic => {
  const cartesian = viewer.scene.pickPosition(position)
  //   const cartesian = viewer.camera.pickEllipsoid(position)
  if (!cartesian) return { lat: 0, lon: 0, alt: 0 }
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
  //   const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian)
  return {
    lon: Cesium.Math.toDegrees(cartographic.longitude),
    lat: Cesium.Math.toDegrees(cartographic.latitude),
    alt: cartographic.height
  }
}
