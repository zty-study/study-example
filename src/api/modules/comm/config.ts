/**
 * 配置API
 */
class ConfigApi {
  /**
   * 系统配置
   */
  sysConfig() {
    return request.get<Type.SysConfig>('/api/admin/base/config/system')
  }

  /**
   * 获取指定配置
   * @param key 配置键
   */
  getConfig<T>(key: string) {
    return request.get<T>('/api/admin/base/config', { key }, true)
  }

  /**
   * 更新配置
   * @param params 配置参数
   */
  update(params: any) {
    return request.put('/api/admin/base/config', params)
  }
}

export const useConfigApi = new (Helper.comm.singleton(ConfigApi))()
