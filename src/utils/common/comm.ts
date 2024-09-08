import ClipboardJS from 'clipboard'

/**
 * 复制内容
 * @param text  文本内容
 */
export const handleClipboard = (text: string, tip: boolean, event: Event) => {
  const clipboard = new ClipboardJS(event.target as HTMLElement, {
    text: () => text
  })

  clipboard.on('success', () => {
    tip && BaseMsg.success(`复制 ${text} 成功!`)
    clipboard.destroy()
  })

  clipboard.on('error', () => {
    tip && BaseMsg.error('复制失败')
    clipboard.destroy()
  })
  // @ts-ignore
  clipboard.onClick(event)
}
