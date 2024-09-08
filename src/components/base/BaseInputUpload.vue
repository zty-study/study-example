<template>
  <div class="base-input-upload w-100">
    <a-input-search
      v-model="url"
      :size="size"
      :placeholder="placeholder"
      :allow-clear="allowClear"
      :disabled="uploading"
      search-button
      @search="uploadBtnRef?.$el?.click()"
    >
      <template #button-icon>
        <IconFont v-if="!uploading" name="upload-cloud-line" />
        <a-progress v-else type="circle" size="mini" :percent="percent" />
      </template>
    </a-input-search>
    <a-upload
      v-show="false"
      ref="uploadRef"
      accept=".svg,.png,.jpg,.jpeg,.webp,.ico"
      :custom-request="methods.handleUpload"
      @success="methods.handleSuccess"
      @error="methods.handleError"
    >
      <template #upload-button><a-button ref="uploadBtnRef">上传</a-button></template>
    </a-upload>
  </div>
</template>

<script setup lang="ts">
import type { AxiosProgressEvent } from 'axios'
import type { RequestOption, FileItem } from '@arco-design/web-vue'

const uploadRef = ref()
const uploadBtnRef = ref()

const props = withDefaults(
  defineProps<{
    size?: 'small' | 'medium' | 'large' | 'mini'
    fileName?: string
    path?: string
    placeholder?: string
    allowClear?: boolean
  }>(),
  {
    size: 'medium'
  }
)

const percent = ref(0)
const uploading = ref(false)
const url = defineModel<string>('url')

const methods = {
  // 文件上传
  handleUpload: async (option: RequestOption) => {
    uploading.value = true
    const { onProgress, onError, onSuccess, fileItem } = option
    const { code, data, msg } = await useFileApi.upload(
      fileItem.file!!,
      props.path,
      props.fileName,
      methods.handleProgress
    )
    uploading.value = false
    if (code === 200) {
      url.value = data.path
    }
    code === 200 ? onSuccess() : onError()
    ResMsg(code, msg)
    return {
      abort() {}
    }
  },

  // 文件上传成功
  handleSuccess: (fileItem: FileItem) => {
    // console.log('fileItem: ', fileItem)
  },

  // 文件上传失败
  handleError: (fileItem: FileItem) => {
    // console.log('fileItem: ', fileItem)
  },

  handleProgress: (e: AxiosProgressEvent) => {
    percent.value = e.progress || 0
  }
}
</script>

<style lang="scss" scoped></style>
