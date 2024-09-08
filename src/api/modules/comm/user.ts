/**
 * 用户API
 */
class UserApi {
  /**
   * 用户登录
   * @param account 账号
   * @param password 密码
   */
  login(params: any) {
    return request.post<Type.UserLogin>('/api/admin/base/user/login', params, false)
  }

}

export const useUserApi = new (Helper.comm.singleton(UserApi))()
