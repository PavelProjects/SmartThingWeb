<script>
import { systemNameToNormal } from '../../../utils/StringUtils.js'
import HookView from './HookView.vue'
import { DeviceApi, extractDataFromError } from '../../../api/device/DeviceApi.js'
import ComboBoxField from '../../fields/ComboBoxField.vue'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import { useIntl } from 'vue-intl'
import { toast } from '../../../utils/EventBus.js'

export const NEW_HOOK_ID = 'New'

export default {
  name: 'HooksView',
  components: {
    HookView,
    ComboBoxField,
    SyncLoader
  },
  props: {
    observable: Object
  },
  inject: ['device', 'gateway'],
  data() {
    const intl = useIntl()
    return {
      intl,
      selectedTemplate: null,
      hooks: [],
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
        this.hooks = (await DeviceApi.getHooks(this.device, this.observable, this.gateway)) || []
      } catch (error) {
        console.error(error)
        const { error: description } = await extractDataFromError(error)
        toast.error({
          caption: `Failed to fetch hooks for [${this.observable.type}]${this.observable.name}`,
          description
        })
      } finally {
        this.loading = false
      }
    },
    async loadTemplates() {
      try {
        this.templates =
          (await DeviceApi.getHooksTemplates(this.device, this.observable.type, this.gateway)) || {}
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to fetch hooks templates'
        })
      }
    },
    addHook(type) {
      if (this.hooks.length > 0 && this.hooks[0].id == NEW_HOOK_ID) {
        this.hooks.shift()
      }
      if (!type) {
        return
      }
      const template = { ...this.templates[type], ...this.templates['default'] }
      const hookFromTemplate = Object.entries(template).reduce(
        (acc, [key, info]) => {
          acc[key] = info['default'] || ''
          return acc
        },
        { id: NEW_HOOK_ID, type }
      )
      this.hooks.unshift(hookFromTemplate)
    },
    templateForType(type) {
      return { ...this.templates[type], ...this.templates.default }
    }
  }
}
</script>

<template>
  <div>
    <h2 class="title">{{ intl.formatMessage({ id: 'device.hooks.title' }) }}</h2>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <div v-if="!loading">
      <ComboBoxField
        class="hook-selector"
        :label="intl.formatMessage({ id: 'device.hooks.button.add' })"
        :items="hookTypes"
        :vertical="false"
        @update:modelValue="(v) => addHook(v)"
      />
      <div v-if="hooks.length > 0" class="hooks-list-view list">
        <HookView
          v-for="(hook, index) in hooks"
          :key="hook.id"
          :observable="observable"
          :hookProp="hook"
          :template="templateForType(hook.type)"
          @updateHooks="loadHooks"
          @removeHook="() => hooks.splice(index, 1)"
        />
      </div>
      <div v-else class="title">
        <h3>{{ intl.formatMessage({ id: 'device.hooks.empty' }) }}</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hook-selector {
  padding: var(--default-gap);
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
