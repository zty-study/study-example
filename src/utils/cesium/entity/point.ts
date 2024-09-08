import * as Cesium from 'cesium'

export default class CesiumPoint extends Cesium.Entity {
  viewer: Cesium.Viewer
  list: Cesium.Entity[]

  constructor(viewer: Cesium.Viewer) {
    super()
    this.viewer = viewer
    this.list = []
  }

  draw(position: Cesium.Cartesian3, config?: any) {
    const point = this.viewer.entities.add({
      position: position,
      point: Object.assign(
        {
          color: Cesium.Color.RED,
          pixelSize: 10
        },
        config || {}
      )
    })

    this.list.push(point)
  }

  clear() {
    for (const point of this.list) {
      this.viewer.entities.remove(point)
    }
  }
}
