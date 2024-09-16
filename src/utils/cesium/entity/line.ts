import * as Cesium from 'cesium'

// export default class Polyline extends Cesium.Entity {
export default class Polyline extends Cesium.Entity {
  entities: Cesium.EntityCollection
  list: Cesium.Entity[]

  constructor(entities: Cesium.EntityCollection) {
    super()
    this.entities = entities
    this.list = []
  }

  draw(
    position: Cesium.Cartesian3,
    config: Cesium.PointGraphics.ConstructorOptions = {},
    id?: string
  ) {
    const point = this.entities.add({
      id: id || 'point-' + Math.random().toString(36).substring(2),
      position: position,
      point: Object.assign(
        {
          color: Cesium.Color.RED,
          pixelSize: 10,
          outlineWidth: 2,
          outlineColor: Cesium.Color.WHITE
        },
        config
      )
    })

    this.list.push(point)
  }

  clear() {
    for (const point of this.list) {
      this.entities.remove(point)
    }
  }
}
