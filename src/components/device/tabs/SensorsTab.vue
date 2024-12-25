<script>
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import HooksTab from './HooksTab.vue'
import MenuView from '../../menu/MenuView.vue'
import { useIntl } from 'vue-intl'
import { toast } from '../../../utils/EventBus.js'

export default {
  name: 'SensorsTab',
  components: {
    SyncLoader,
    MenuView
  },
  inject: ['device', 'gateway', 'features'],
  data() {
    const intl = useIntl()
    const hooksEnabled = this.features?.hooks

    return {
      intl,
      hooksEnabled,
      sensors: {},
      loading: false,
      tabs: {}
    }
  },
  created() {
    this.loadSensors()
  },
  computed: {
    haveSensors() {
      return Object.keys(this.sensors).length !== 0
    },
    placeholder() {
      if (this.hooksEnabled) {
        return this.intl.formatMessage({ id: 'device.hooks.select.to.manage' }, { type: 'sensor' })
      }
      return this.intl.formatMessage({ id: 'hooks.disabled' })
    }
  },
  methods: {
    async loadSensors() {
      this.loading = true
      try {
        this.sensors = (await DeviceApi.getSensors(this.device, this.gateway)) ?? {}
        Object.entries(this.sensors).forEach(([name, value]) => {
          const caption = `${name}: ${value}`
          if (this.tabs[name]) {
            this.tabs[name].caption = caption
          } else {
            this.tabs[name] = {
              class: HooksTab,
              caption,
              props: {
                key: `sensor_${name}`,
                device: this.device,
                sensor: name,
                gateway: this.gateway
              }
            }
          }
        })
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to fetch sensors values'
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
    <sync-loader color="var(--color-accent)" :loading="loading"></sync-loader>
    <MenuView
      v-if="haveSensors"
      :tabs="tabs"
      :tabTitle="hooksEnabled ? intl.formatMessage({ id: 'device.hooks.menu.item.title' }) : ''"
      :placeholder="placeholder"
      :disabled="!hooksEnabled"
    />
    <h2 v-else class="header">
      {{ intl.formatMessage({ id: 'device.sensors.empty' }) }}
    </h2>
  </div>
</template>

<style scoped>
.title:not(:last-child) {
  border-bottom: 2px solid var(--color-border);
}
</style>
