export default {
  // 是否是ip
  ip: (ip: string): boolean => {
    const reg =
      /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip)
  },

  // 是否是小写字母
  lowerCase: (value: string): boolean => {
    const reg = /^[a-z]+$/
    return reg.test(value)
  },

  // 是否是大写字母
  upCase: (value: string): boolean => {
    const reg = /^[A-Z]+$/
    return reg.test(value)
  },

  // 是否是英文字母
  alpha: (value: string): boolean => {
    const reg = /^[a-zA-Z]+$/
    return reg.test(value)
  },

  // 是否是端口号
  port: (value: string): boolean => {
    const reg =
      /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
    return reg.test(value)
  },

  email: (value: string): boolean => {
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    return reg.test(value)
  },

  // 字母数字下划线特殊字符组合
  alphaDash: (value: string): boolean => {
    const reg = /^[a-zA-Z0-9!@#$%^&*().|_-]+$/
    return reg.test(value)
  },

  // 手机号
  phone: (value: string): boolean => {
    const reg = /^0?(13[0-9]|15[012356789]|18[0-9]|14[123578]|16[6]|17[035768]|19[19])[0-9]{8}$/
    return reg.test(value)
  }
}

/**
 * 判断是否是端口号
 * @param value
 */
export const isPort = (value: string): boolean => {
  const reg =
    /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
  return reg.test(value)
}

/**
 *  判断是否是手机号
 * @param value 手机号
 */
export const isPhone = (value: string): boolean => {
  // const reg = /^1\d{10}$/
  const reg = /^0?(13[0-9]|15[012356789]|18[0-9]|14[123578]|16[6]|17[035768]|19[19])[0-9]{8}$/
  return reg.test(value)
}

/**
 * 判断是否正确手机号码用于form表单正则表达式
 * **/
export const phoneReg =
  /^0?(13[0-9]|15[012356789]|18[0-9]|14[123578]|16[6]|17[035768]|19[19])[0-9]{8}$/

/**
 * 判断是否是身份证号(第二代)
 * @param value 身份证号码
 */
export const isIdCard = (value: string): boolean => {
  const reg =
    /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return reg.test(value)
}

/**
 * 判断是否身份证号用于form表单正则表达式
 * **/
export const cardReg =
  /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

/**
 * 判断是否是邮箱
 * @param value 邮箱
 */
export const isEmail = (value: string): boolean => {
  return emailReg.test(value)
}

/**
 * 用于form表单正则表达式
 * **/
export const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

/**
 * 判断是否中文
 * @param value
 */
export const isChina = (value: string): boolean => {
  const reg = /^[\u4E00-\u9FA5]{2,4}$/
  return reg.test(value)
}

/**
 * 判断是否为空
 * @param value
 */
export const isBlank = (value: any): boolean => {
  return (
    value === null ||
    false ||
    value === '' ||
    value.trim() === '' ||
    value.toLocaleLowerCase().trim() === 'null'
  )
}

/**
 * 判断是否为固话
 * @param value
 */
export const isTel = (value: string): boolean => {
  const reg =
    /^(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})([- ])?)?([0-9]{7,8})(([- 转])*([0-9]{1,4}))?$/
  return reg.test(value)
}

/**
 * 判断是否为数字且最多两位小数
 * @param value
 */
export const isNum = (value: string): boolean => {
  const reg = /^\d+(\.\d{1,2})?$/
  return reg.test(value)
}
