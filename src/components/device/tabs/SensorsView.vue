<script>
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import HooksView from './HooksView.vue'
import MenuView from '../../menu/MenuView.vue'

export default {
  name: 'SensorsView',
  components: {
    SyncLoader,
    MenuView
  },
  inject: ['device', 'gateway'],
  data() {
    return {
      sensors: null,
      loading: false,
      tabs: {}
    }
  },
  created() {
    this.loadSensors()
  },
  methods: {
    async loadSensors() {
      this.loading = true
      try {
        this.sensors = await DeviceApi.getDeviceSensors(this.device, this.gateway)
        Object.entries(this.sensors).forEach(([name, { type, value }]) => {
          const caption = `${name} (${type}): ${value}`
          if (this.tabs[name]) {
            this.tabs[name].caption = caption
          } else {
            this.tabs[name] = {
              class: HooksView,
              caption,
              props: {
                key: 'sensor_' + name,
                device: this.device,
                observable: {
                  name,
                  type: 'sensor'
                },
                gateway: this.gateway
              }
            }
          }
        })
      } finally {
        this.loading = false
      }
    },
    async update() {
      await this.loadSensors()
    }
  }
}
</script>

<template>
  <div>
    <h1 class="title">Sensors values</h1>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <MenuView :tabs="tabs" tabTitle="Click to open hooks" />
  </div>
</template>
