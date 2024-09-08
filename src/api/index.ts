import { useUserApi } from './modules/comm/user'
import { useConfigApi } from './modules/comm/config'

export { useUserApi, useConfigApi }

// const apiModules = import.meta.glob('./modules/**/**.ts', { eager: true })
// const exportsToReExport = {}

// // 动态加载并聚合所有模块
// for (const path in apiModules) {
//   console.log('path: ', apiModules[path])
//   Object.assign(exportsToReExport, apiModules[path])
// }

// console.log('exportsToReExport: ', exportsToReExport)

// export default exportsToReExport
