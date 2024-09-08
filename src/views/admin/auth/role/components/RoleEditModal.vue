<template>
  <a-modal
    class="edit-role-modal-wrap"
    :title="formModel.id ? '编辑角色' : '创建角色'"
    :width="800"
    draggable
    title-align="start"
    v-model:visible="visible"
    unmount-on-close
    :render-to-body="false"
    :mask-closable="false"
    :footer="false"
    :align-center="false"
  >
    <a-form ref="formRef" :rules="rules" :model="formModel" auto-label-width autocomplete="off">
      <a-form-item field="name" label="名称" validate-trigger="blur">
        <a-input v-model.trim="formModel.name" placeholder="请输入角色名称..." allowClear />
      </a-form-item>
      <a-form-item field="value" label="标识" validate-trigger="blur" :disabled="!!formModel.id">
        <a-input v-model.trim="formModel.value" placeholder="请输入角色唯一标识..." allowClear />
      </a-form-item>
      <a-form-item label="权限" validate-trigger="blur">
        <div class="auth-tree-wrap">
          <a-tree
            class="no-select"
            show-line
            block-node
            v-model:checked-keys="selected"
            :checkable="true"
            :default-expand-all="false"
            checked-strategy="child"
            :data="ruleTree"
            @select="methods.handleSelect"
          />
        </div>
      </a-form-item>

      <a-form-item field="remark" label="备注">
        <a-textarea
          v-model="formModel.remark"
          :max-length="512"
          show-word-limit
          placeholder="请输入角色备注..."
          allow-clear
          :auto-size="{
            minRows: 3,
            maxRows: 6
          }"
        />
      </a-form-item>
    </a-form>
    <a-divider />

    <div class="flex-end g-15 mt-10">
      <a-button type="secondary" @click="visible = false">取消</a-button>
      <a-button type="primary" :loading="loading" @click="methods.handleSubmit">提交</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
const formRef = ref()
const loading = ref(false)
const selected = ref<string[]>([])
const ruleList = ref<Type.Rule[]>([])
const groupList = ref<Type.RuleGroup[]>([])
const formModel = defineModel<Partial<Type.Role>>('form', { default: {} })
const visible = defineModel<boolean>('visible')
const emits = defineEmits(['refresh'])

const rules = computed(() => {
  return {
    name: [
      {
        required: true,
        message: '角色名称不能为空!'
      }
    ],
    value: [
      {
        required: true,
        message: '角色标识不能为空!'
      },
      {
        required: true,
        validator: (value: string | undefined, cb: (error?: string) => void) => {
          if (!Helper.valid.alphaDash(value || '')) {
            cb('只能是字母数字下划线特殊字符组合!')
          }
        }
      }
    ],
    remark: [
      {
        maxLength: 512,
        message: '最多输入12个字符!'
      }
    ]
  }
})

watch(visible, async (val) => {
  if (val && formModel.value.id && formModel.value.value) {
    const { code, data } = await useRoleApi.policy(formModel.value.value)
    if (code === 200) {
      selected.value = data.filter((e) => e.length === 3).map((e) => `${e[1]}#${e[2]}`)
    }
  }
})

const ruleTree = computed(() => {
  const result = []

  for (const group of groupList.value) {
    const children = ruleList.value
      .filter((item) => item.group === group.key)
      .map((item) => {
        return {
          key: `${item.path}#${item.method}`,
          title: item.name
        }
      })
    result.push({
      title: group.name,
      key: group.prefix,
      disabled: children.length === 0,
      children: children
    })
  }

  return result
})

const methods = {
  handleSubmit: () => {
    formRef.value?.validate(async (valid: boolean) => {
      if (valid) return
      const rules = selected.value
        .map((e) => {
          return e.split('#')
        })
        .filter((e) => e.length === 2)
      if (formModel.value.id) {
        methods.handleEdit(rules)
      } else {
        methods.handleCreate(rules)
      }
    })
  },

  handleEdit: async (rules: string[][]) => {
    loading.value = true
    const { code, msg } = await useRoleApi.update({ ...formModel.value, rules })
    loading.value = false
    if (code === 200) {
      ResMsg(code, msg)
      emits('refresh')
      visible.value = false
      selected.value = []
    }
  },

  handleCreate: async (rules: string[][]) => {
    loading.value = true
    const { code, msg } = await useRoleApi.create({ ...formModel.value, rules })
    loading.value = false
    if (code === 200) {
      ResMsg(code, msg)
      emits('refresh')
      visible.value = false
      selected.value = []
    }
  },

  handleSelect: (keys: string[]) => {
    const index = selected.value.indexOf(keys[0])
    if (index !== -1) {
      selected.value.splice(index, 1)
    } else {
      selected.value.push(keys[0])
    }
  },

  //   获取规则列表
  getRuleList: async () => {
    const { code, data } = await useRuleApi.all()
    if (code === 200) {
      ruleList.value = data
    }
  },

  // 获取权限分组
  getGroupList: async () => {
    const { code, data } = await useRuleApi.group()
    if (code === 200) {
      groupList.value = data
    }
  }
}

methods.getRuleList()
methods.getGroupList()
</script>

<style lang="scss">
.edit-role-modal-wrap {
  .auth-tree-wrap {
    max-height: 300px;
    width: 100%;
    overflow-y: auto;
  }
  .arco-tree-node-expanded {
    position: sticky;
    top: 0;
    background: var(--color-bg-3);
    z-index: 9999;
  }
}
</style>
