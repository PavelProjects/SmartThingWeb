<script>
import { systemNameToNormal } from '../../../utils/StringUtils.js'
import HookView from './HookView.vue'
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import ComboBox from '../../fields/ComboBox.vue'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'

export const NEW_HOOK_ID = 'New'

export default {
  name: 'HooksView',
  components: {
    HookView,
    ComboBox,
    SyncLoader
  },
  props: {
    device: Object,
    observable: Object
  },
  data() {
    return {
      selectedTemplate: null,
      hooks: [],
      templates: {},
      selectedType: null,
      loading: false,
      gateway: this.$route.params.gateway
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
      this.loading = true
      await this.loadHooks()
      this.loading = false
    },
    async loadHooks() {
      this.hooks =
        (await DeviceApi.getHooks(this.device, this.observable, this.gateway)) || []
    },
    async loadTemplates() {
      this.templates = (await DeviceApi.getHooksTemplates(this.device, this.gateway)) || {}
    },
    addHook(type) {
      if (this.hooks && this.hooks.length > 0 && this.hooks[0].id == NEW_HOOK_ID) {
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
    <h1 class="title">Hooks</h1>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <div v-if="!loading">
      <ComboBox
        label="Add hook of type "
        :items="hookTypes"
        @input="addHook($event.target.value)"
      />
      <div v-if="hooks.length > 0" class="hooks-list-view list">
        <HookView
          v-for="hook in hooks"
          :device="device"
          :key="hook.id"
          :observable="observable"
          :hookProp="hook"
          :template="templateForType(hook.type)"
          @update="update"
        />
      </div>
      <div v-else class="title">
        <h3>No hooks added yet</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hooks-list-view {
  max-height: 80vh;
  overflow-y: auto;
  margin-top: var(--default-gap);
}
</style>
