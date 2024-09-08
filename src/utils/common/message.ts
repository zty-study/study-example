import { Message } from '@arco-design/web-vue'

type msgType = 'success' | 'error' | 'info' | 'warning' | 'warning'

export const ResMsg = (code: number, msg?: string, type?: msgType) => {
  let msgType: msgType = code === 200 ? 'success' : 'error'
  if (type) msgType = type
  Message[msgType]({ content: msg || '操作成功', resetOnHover: true, showIcon: true })
}
