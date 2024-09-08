namespace Global {
  export interface Options {
    value: string
    label: string
  }
  export interface Tree {
    key: string
    title: string
    isLeaf?: boolean
    children?: Tree[]
  }

  export interface Pagination {
    current: number
    pageSize: number
    total: number
  }
}
