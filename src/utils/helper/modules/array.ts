export default {
  flat: <T>(arr: T[], childKey: string = 'children'): T[] => {
    let result: T[] = []

    arr.forEach((item: any) => {
      if (item[childKey] && item[childKey].length) {
        result = result.concat(Helper.array.flat(item[childKey], childKey))
      } else {
        result.push(item)
      }
    })
    return result
  }
}
