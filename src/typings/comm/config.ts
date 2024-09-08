namespace Type {
  export interface Config extends Common {
    key: string
    value: string
  }

  export interface SysConfig extends Common<SysConfig> {
    key: string
    value: any
  }

  export interface SystemState {
    logo: string
    site_name: string
    sub_title: string
    not_install?: boolean
  }
}
