<script>
import { systemNameToNormal } from '../../../utils/StringUtils.js'
import HookView from './HookView.vue'
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import ComboBoxField from '../../base/fields/ComboBoxField.vue'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import { useIntl } from 'vue-intl'
import { toast } from '../../../utils/EventBus.js'
import { extractDataFromError } from '../../../api/ApiUtils.js'
import BaseContainer from '../../base/BaseContainer.vue'

export const NEW_HOOK_ID = 'New'

export default {
  name: 'HooksTab',
  components: {
    HookView,
    ComboBoxField,
    BaseContainer,
    SyncLoader
  },
  props: {
    sensor: String
  },
  inject: ['device', 'gateway'],
  data() {
    const intl = useIntl()
    return {
      intl,
      selectedTemplate: null,
      hooks: [],
      newHook: undefined,
      templates: {},
      selectedType: null,
      loading: false
    }
  },
  computed: {
    hookTypes() {
      return Object.keys(this.templates)
        .filter((key) => key !== 'default')
        .reduce((acc, key) => {
          acc[key] = systemNameToNormal(key)
          return acc
        }, {})
    }
  },
  async mounted() {
    this.loading = true
    await this.loadTemplates()
    await this.loadHooks()
    this.loading = false
  },
  methods: {
    async update() {
      await this.loadHooks()
    },
    async loadHooks() {
      this.loading = true
      try {
        this.newHook = undefined
        this.hooks = (await DeviceApi.getHooks(this.device, this.sensor, this.gateway)) || []
      } catch (error) {
        console.error(error)
        const { error: description } = await extractDataFromError(error)
        toast.error({
          caption: this.intl.formatMessage(
            { id: 'device.hook.fetch.failed' },
            { sensor: this.sensor }
          ),
          description
        })
      } finally {
        this.loading = false
      }
    },
    async loadTemplates() {
      try {
        this.templates =
          (await DeviceApi.getHooksTemplates(this.device, this.sensor, this.gateway)) || {}
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.hook.template.fetch.failed' })
        })
      }
    },
    addHook(type) {
      this.newHook = undefined
      if (!type) {
        return
      }
      const template = { ...this.templates[type], ...this.templates['default'] }
      this.newHook = Object.entries(template).reduce(
        (acc, [key, info]) => {
          let defValue
          switch (info.type) {
            case 'number':
              defValue = 0
              break
            case 'checkbox':
              defValue = false
              break
            default:
              defValue = ''
          }
          acc[key] = info['default'] || defValue
          return acc
        },
        {
          id: NEW_HOOK_ID,
          type,
          rnd: Math.random() // rnd - hack to force rerender
        }
      )
    },
    templateForType(type) {
      return { ...this.templates[type], ...this.templates.default }
    }
  }
}
</script>

<template>
  <div>
    <h2 class="header">{{ intl.formatMessage({ id: 'device.hooks.title' }) }}</h2>
    <sync-loader color="var(--color-accent)" :loading="loading"></sync-loader>
    <div v-if="!loading">
      <ComboBoxField
        class="hook-selector"
        :label="intl.formatMessage({ id: 'device.hooks.button.add' })"
        :items="hookTypes"
        :vertical="false"
        :modelValue="newHook?.type"
        @update:modelValue="(v) => addHook(v)"
      />
      <BaseContainer v-if="hooks.length > 0 || newHook" class="hooks-list-view" :vertical="true">
        <HookView
          v-if="newHook"
          :key="newHook.rnd"
          :sensor="sensor"
          :hookProp="newHook"
          :template="templateForType(newHook.type)"
          :expand="hooks.length === 1"
          @hookUpdated="() => loadHooks()"
          @removeHook="() => (newHook = undefined)"
        />
        <HookView
          v-for="(hook, index) in hooks"
          :key="hook.id"
          :sensor="sensor"
          :hookProp="hook"
          :template="templateForType(hook.type)"
          :expand="hooks.length === 1"
          @hookUpdated="() => loadHooks()"
          @removeHook="() => hooks.splice(index, 1)"
        />
      </BaseContainer>
      <div v-else class="header">
        <h3>{{ intl.formatMessage({ id: 'device.hooks.empty' }) }}</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hook-selector {
  padding: 10px;
}
.hooks-list-view {
  max-height: 80vh;
  overflow-y: auto;
  border-top: 2px solid var(--color-border);
}
.hooks-list-view .hook {
  border-bottom: 2px solid var(--color-border);
}
.hooks-list-view *:last-child {
  border-bottom: none;
}
</style>
