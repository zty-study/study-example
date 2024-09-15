import * as Cesium from 'cesium'

/** 坐标转换: 笛卡尔 转 WGS84 */
const transformCartesianToWGS84 = (
  cartesian: Cesium.Cartesian3
): { longitude: number; latitude: number; altitude: number } => {
  const ellipsoid = Cesium.Ellipsoid.WGS84
  const cartographic = ellipsoid.cartesianToCartographic(cartesian)
  return {
    longitude: Cesium.Math.toDegrees(cartographic.longitude),
    latitude: Cesium.Math.toDegrees(cartographic.latitude),
    altitude: cartographic.height
  }
}

/** 坐标转换: 笛卡尔 转 WGS84 数组形式 */
const transformCartesianArrayToWGS84Array = (
  cartesianArr: Cesium.Cartesian3[]
): Array<{ longitude: number; latitude: number; altitude: number }> => {
  return cartesianArr.map((item) => transformCartesianToWGS84(item))
}

/** 坐标转换: WGS84 转 弧度坐标 */
const transformWGS84ToCartographic = (position: {
  longitude: number
  latitude: number
  altitude?: number
}): Cesium.Cartographic => {
  const { longitude, latitude, altitude } = position
  return Cesium.Cartographic.fromDegrees(longitude, latitude, altitude)
}

//空间两点距离计算函数
export const getSpaceDistance = (positions: Cesium.Cartesian3[]) => {
  let distance = 0
  for (let i = 0; i < positions.length - 1; i++) {
    const point1cartographic = Cesium.Cartographic.fromCartesian(positions[i])
    const point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1])
    /**根据经纬度计算出距离**/
    const geodesic = new Cesium.EllipsoidGeodesic()
    geodesic.setEndPoints(point1cartographic, point2cartographic)
    let s = geodesic.surfaceDistance
    //返回两点之间的距离
    s = Math.sqrt(
      Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2)
    )
    distance = distance + s
  }
  return distance.toFixed(2)
}

/** 获取 WGS84 坐标系下的距离 */
export const getPositionDistance = (positions: Cesium.Cartesian3[]): string => {
  if (positions.length < 2) {
    return '0.000'
  }

  const points = transformCartesianArrayToWGS84Array(positions)
  let distance = 0
  const geodesic = new Cesium.EllipsoidGeodesic()

  for (let i = 0; i < positions.length - 1; i++) {
    const point1cartographic = transformWGS84ToCartographic(points[i])
    const point2cartographic = transformWGS84ToCartographic(points[i + 1])

    geodesic.setEndPoints(point1cartographic, point2cartographic)
    let s = geodesic.surfaceDistance
    s = Math.sqrt(
      Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2)
    )

    distance += s
  }
  return distance.toFixed(3)
}
