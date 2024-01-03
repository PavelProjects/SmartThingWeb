<script>
import { systemNameToNormal } from "../../../utils/StringUtils.js"
import CallbackView from './CallbackView.vue'
import { DeviceApi } from "../../../api/device/DeviceApi.js"
import Combobox from "../../fields/Combobox.vue"
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'

export const NEW_CALLBACK_ID = "New"

export default {
  name: "CallbacksView",
  components: {
    CallbackView,
    Combobox,
    SyncLoader,
  },
  props: {
    ip: String,
    observable: Object,
    gateway: Object
  },
  data() {
    return {
      selectedTemplate: null,
      callbacks: [],
      templates: {},
      selectedType: null,
      loading: false
    }
  },
  computed: {
    callbackTypes() {
      return Object.keys(this.templates)
        .filter(key => key !== 'default')
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
      await this.loadCallbacks()
    },
    async loadCallbacks() {
      this.callbacks = await DeviceApi.getCallbacks(this.ip, this.observable, this.gateway) || []
    },
    async loadTemplates() {
      this.templates = await DeviceApi.getCallbacksTemplates(this.ip, this.gateway)
    },
    addCallback(type) {
      if (this.callbacks && this.callbacks.length > 0 && this.callbacks[0].id == NEW_CALLBACK_ID) {
        this.callbacks.shift()
      }
      if (!type) {
        return
      }
      const template = { ...this.templates[type], ...this.templates["default"] }
      const callbackFromTemplate = Object.entries(template)
        .reduce((acc, [key, info]) => {
          acc[key] = info["default"] || ""
          return acc
        }, { id: NEW_CALLBACK_ID, type })
      this.callbacks.unshift(callbackFromTemplate)
    }
  }
}
</script>

<template>
  <h1 class="title">Callbacks</h1>
  <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
  <div v-if="!loading">
    <Combobox label="Add callback of type " :items="callbackTypes" @input="addCallback($event.target.value)" />
    <div v-if="callbacks" class="callbacks-list-view list">
      <CallbackView v-for="callback in callbacks" :ip="ip" :key="callback.id" :observable="observable"
        :callback="callback" :template="{ ...templates[callback.type], ...templates['default'] }" :gateway="gateway"
        @update="update" />
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