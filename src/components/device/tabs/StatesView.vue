<script>
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import HooksView from './HooksView.vue'
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import MenuView from '../../menu/MenuView.vue'
import { useIntl } from 'vue-intl'
import { toast } from '../../../utils/EventBus'

export default {
  name: 'StatesView',
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
      states: {},
      loading: false,
      tabs: {}
    }
  },
  created() {
    this.loadStates()
  },
  computed: {
    haveStates() {
      return Object.keys(this.states).length !== 0
    },
    placeholder() {
      if (this.hooksEnabled) {
        return this.intl.formatMessage({ id: 'device.hooks.select.to.manage' }, { type: 'state' })
      }
      return this.intl.formatMessage({ id: 'hooks.disabled' })
    }
  },
  methods: {
    async loadStates() {
      this.loading = true
      try {
        this.states = (await DeviceApi.getDeviceStates(this.device, this.gateway)) || {}
        Object.entries(this.states).forEach(([name, value]) => {
          if (this.tabs[name]) {
            this.tabs[name].caption = `${name}: ${value}`
          } else {
            this.tabs[name] = {
              class: HooksView,
              caption: `${name}: ${value}`,
              props: {
                key: 'state_' + name,
                device: this.device,
                observable: {
                  name,
                  type: 'state'
                },
                gateway: this.gateway
              }
            }
          }
        })
      } catch (error) {
        console.error(error)
        toast.error({
          type: 'error',
          caption: 'Failed to fetch device states'
        })
      } finally {
        this.loading = false
      }
    },
    async update() {
      await this.loadStates()
    }
  }
}
</script>
<template>
  <div>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <MenuView
      v-if="haveStates"
      :tabs="tabs"
      :tabTitle="hooksEnabled ? intl.formatMessage({ id: 'device.hooks.menu.item.title' }) : ''"
      :placeholder="placeholder"
      :disabled="!hooksEnabled"
    />
    <h2 v-else class="title">
      {{ intl.formatMessage({ id: 'device.states.empty' }) }}
    </h2>
  </div>
</template>

<style scoped>
.title:not(:last-child) {
  border-bottom: 2px solid var(--color-border);
}
</style>
