export default {
  uuid: (length = 32) => {
    const num = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    let str = ''
    for (let i = 0; i < length; i++) {
      str += num.charAt(Math.floor(Math.random() * num.length))
    }
    return str
  },

  singleton: <T extends new (...args: any[]) => any>(className: T) => {
    let instance: InstanceType<T>
    const proxy = new Proxy(className, {
      construct(target: T, args: any[]) {
        if (!instance) {
          instance = new className(...args)
        }
        return instance
      }
    })
    ;(className.prototype as any).construct = proxy
    return proxy
  }
}
