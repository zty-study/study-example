<template>
  <a-select
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :allowClear="allowClear"
    :allowcreate="allowcreate"
    :multiple="multiple"
    :maxTagCount="maxTagCount"
    :placeholder="placeholder"
    v-model="value"
  >
    <a-option
      v-for="(item, index) in options"
      :key="index"
      :disabled="item.disabled"
      :label="item[labelKey]"
      :value="item[valueKey]"
    />
  </a-select>
</template>

<script setup lang="ts">
interface Props {
  placeholder?: string
  size?: 'mini' | 'small' | 'medium' | 'large'
  valueKey?: string
  labelKey?: string
  multiple?: boolean
  loading?: boolean
  disabled?: boolean
  allowClear?: boolean
  allowcreate?: boolean
  maxTagCount?: number
  options?: Record<'label' | string, any>[]
}

withDefaults(defineProps<Props>(), {
  placeholder: '请选择...',
  labelKey: 'label',
  valueKey: 'value',
  options: () => []
})

const value = defineModel('value', { default: undefined })
</script>

<style lang="scss" scoped></style>
