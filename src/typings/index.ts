namespace Type {
  export interface Common<R = any, J = any> {
    id: number
    json?: J
    result?: R
    remark?: string
    create_time: number
    update_time: number
    delete_time: number
    [property: string]: any
  }

  export interface IList<T> {
    data: T[]
    page: number
    total: number
  }

  export interface Ids {
    ids: number[]
  }
}
