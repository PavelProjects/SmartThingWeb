<script>
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import HooksView from './HooksView.vue'
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import MenuView from '../../menu/MenuView.vue'
import { useIntl } from 'vue-intl'

export default {
  name: 'StatesView',
  components: {
    SyncLoader,
    MenuView
  },
  inject: ['device', 'gateway'],
  data() {
    const intl = useIntl()
    return {
      intl,
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
    <h1 class="title">
      {{ intl.formatMessage({ id: 'device.states.title' }) }}
    </h1>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <MenuView
      v-if="haveStates"
      :tabs="tabs"
      :tabTitle="intl.formatMessage({ id: 'device.hooks.menu.item.title' })"
      :placeholder="intl.formatMessage({ id: 'device.hooks.select.to.manage' }, { type: 'state' })"
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