<script>
import { systemNameToNormal } from '../../../utils/StringUtils.js'
import CallbackView from './CallbackView.vue'
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import ComboBox from '../../fields/ComboBox.vue'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'

export const NEW_CALLBACK_ID = 'New'

export default {
  name: 'CallbacksView',
  components: {
    CallbackView,
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
      callbacks: [],
      templates: {},
      selectedType: null,
      loading: false,
      gateway: this.$route.params.gateway
    }
  },
  computed: {
    callbackTypes() {
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
    await this.loadCallbacks()
    this.loading = false
  },
  methods: {
    async update() {
      this.loading = true
      await this.loadCallbacks()
      this.loading = false
    },
    async loadCallbacks() {
      this.callbacks =
        (await DeviceApi.getCallbacks(this.device, this.observable, this.gateway)) || []
    },
    async loadTemplates() {
      this.templates = (await DeviceApi.getCallbacksTemplates(this.device, this.gateway)) || {}
    },
    addCallback(type) {
      if (this.callbacks && this.callbacks.length > 0 && this.callbacks[0].id == NEW_CALLBACK_ID) {
        this.callbacks.shift()
      }
      if (!type) {
        return
      }
      const template = { ...this.templates[type], ...this.templates['default'] }
      const callbackFromTemplate = Object.entries(template).reduce(
        (acc, [key, info]) => {
          acc[key] = info['default'] || ''
          return acc
        },
        { id: NEW_CALLBACK_ID, type }
      )
      this.callbacks.unshift(callbackFromTemplate)
    },
    templateForType(type) {
      return { ...this.templates[type], ...this.templates.default }
    }
  }
}
</script>

<template>
  <div>
    <h1 class="title">Callbacks</h1>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <div v-if="!loading">
      <ComboBox
        label="Add callback of type "
        :items="callbackTypes"
        @input="addCallback($event.target.value)"
      />
      <div v-if="callbacks.length > 0" class="callbacks-list-view list">
        <CallbackView
          v-for="callback in callbacks"
          :device="device"
          :key="callback.id"
          :observable="observable"
          :callbackProp="callback"
          :template="templateForType(callback.type)"
          @update="update"
        />
      </div>
      <div v-else class="title">
        <h3>No callbacks added yet</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.callbacks-list-view {
  max-height: 80vh;
  overflow-y: auto;
  margin-top: var(--default-gap);
}
</style>
