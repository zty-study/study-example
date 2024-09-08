const opt = Object.prototype.toString

export default {
  array: (obj: any): obj is any[] => {
    return opt.call(obj) === '[object Array]'
  },
  object: (obj: any): obj is { [key: string]: any } => {
    return opt.call(obj) === '[object Object]'
  },
  string: (obj: any): obj is string => {
    return opt.call(obj) === '[object String]'
  },
  number: (obj: any): obj is number => {
    return opt.call(obj) === '[object Number]' && obj === obj // eslint-disable-line
  },
  regexp: (obj: any): obj is RegExp => {
    return opt.call(obj) === '[object RegExp]'
  },
  file: (obj: any): obj is File => {
    return opt.call(obj) === '[object File]'
  },
  blob: (obj: any): obj is Blob => {
    return opt.call(obj) === '[object Blob]'
  },
  undefined: (obj: any): obj is undefined => {
    return obj === undefined
  },
  null: (obj: any): obj is null => {
    return obj === null
  },
  function: (obj: any): obj is (...args: any[]) => any => {
    return typeof obj === 'function'
  },
  emptyObject: (obj: any): boolean => {
    return opt.call(obj) === '[object Object]' && Object.keys(obj).length === 0
  },
  exist: (obj: any): boolean => {
    return obj || obj === 0
  },
  window: (el: any): el is Window => {
    return el === window
  }
}
