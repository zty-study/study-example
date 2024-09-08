export default {
  format: (time: string | number, cFormat?: string) => {
    if (!time) return '-'
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let timeInt = parseInt(time.toString(), 10)
    if (String(time).length === 10) {
      timeInt = timeInt * 1000
    }
    const date = new Date(timeInt)

    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay(), // 注意这里返回的是星期几的数字，如果要中文星期需要映射
      b: date.getMilliseconds()
    }
    return format.replace(/{([ymdhisab])+}/g, (result, key: string) => {
      const keyLower = key.toLowerCase() as keyof typeof formatObj
      const value = formatObj[keyLower]
      if (keyLower === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value]
      }
      if (result.length > 0 && typeof value === 'number' && value < 10) {
        return String('0' + value)
      }
      return String(value || 0)
    })
  },

  ago: (time: string | number) => {
    let parsedTime: number
    if (typeof time === 'string' && ('' + time).length === 10) {
      parsedTime = parseInt(time, 10) * 1000 // 明确指定parseInt的基数为10
    } else {
      parsedTime = typeof time === 'number' ? time : parseFloat(time as string) * 1000 // 确保time为number或能够转换为number
    }

    const d = new Date(parsedTime)
    if (isNaN(d.getTime())) {
      // 如果日期对象无效，这里可以抛出错误或返回默认字符串
      throw new Error('Invalid time provided')
    }

    const now = Date.now()

    const diff = (now - d.getTime()) / 1000 // 使用d.getTime()确保是number类型

    if (diff < 30) {
      return '刚刚'
    } else if (diff < 3600) {
      // less than 1 hour
      return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
      return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
      return '1天前'
    }

    // 当diff大于或等于2天时，返回具体日期时间
    return (
      d.getFullYear() +
      '年' +
      (d.getMonth() + 1) +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    ) // 通常也会包括年份信息
  }
}
