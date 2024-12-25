<script>
import InfoTab from './tabs/InfoTab.vue'
import ActionsTab from './tabs/ActionsTab.vue'
import SensorsTab from './tabs/SensorsTab.vue'
import MetricsTab from './tabs/MetricsTab.vue'
import ConfigTab from './tabs/ConfigTab.vue'
import MenuView from '../menu/MenuView.vue'
import { useIntl } from 'vue-intl'
import RiseLoader from 'vue-spinner/src/RiseLoader.vue'
import { DeviceApi } from '../../api/device/DeviceApi'
import { GatewayApi } from '../../api/gateway/GatewayApi'
import { computed } from 'vue'
import { toast } from '../../utils/EventBus'
import DangerZoneTab from './tabs/DangerZoneTab.vue'
import BaseContainer from '../base/BaseContainer.vue'
import DeviceIcon from './DeviceIcon.vue'
import WiFiTab from './tabs/WiFiTab.vue'

export default {
  name: 'DeviceControlPanel',
  components: {
    MenuView,
    RiseLoader,
    BaseContainer,
    DeviceIcon
  },
  props: {
    device: Object
  },
  inject: ['gateway'],
  provide() {
    return {
      device: this.device,
      features: computed(() => this.features),
      apiMethods: computed(() => Object.values(this.apiMethods))
    }
  },
  data() {
    const intl = useIntl()
    return {
      intl,
      loading: false,
      unreachable: false,
      features: {},
      apiMethods: {},
      defaultTabs: {
        actions: {
          class: ActionsTab,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'actions' }),
          icon: 'M10,9A1,1 0 0,1 11,8A1,1 0 0,1 12,9V13.47L13.21,13.6L18.15,15.79C18.68,16.03 19,16.56 19,17.14V21.5C18.97,22.32 18.32,22.97 17.5,23H11C10.62,23 10.26,22.85 10,22.57L5.1,18.37L5.84,17.6C6.03,17.39 6.3,17.28 6.58,17.28H6.8L10,19V9M11,5A4,4 0 0,1 15,9C15,10.5 14.2,11.77 13,12.46V11.24C13.61,10.69 14,9.89 14,9A3,3 0 0,0 11,6A3,3 0 0,0 8,9C8,9.89 8.39,10.69 9,11.24V12.46C7.8,11.77 7,10.5 7,9A4,4 0 0,1 11,5Z'
        },
        sensors: {
          class: SensorsTab,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'sensors' }),
          icon: 'M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z'
        },
        info: {
          class: InfoTab,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'info' }),
          icon: 'M13 9H11V7H13V9M13 17H11V11H13V17M5 3H19C20.1 3 21 3.89 21 5V19C21 19.53 20.79 20.04 20.41 20.41C20.04 20.79 19.53 21 19 21H5C4.47 21 3.96 20.79 3.59 20.41C3.21 20.04 3 19.53 3 19V5C3 3.89 3.89 3 5 3M19 19V5H5V19H19Z'
        },
        wifi: {
          class: WiFiTab,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'wifi' }),
          icon: 'M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z'
        },
        config: {
          class: ConfigTab,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'config' }),
          icon: 'M22.61,19L13.53,9.91C14.46,7.57 14,4.81 12.09,2.91C9.79,0.61 6.21,0.4 3.66,2.26L7.5,6.11L6.08,7.5L2.25,3.69C0.39,6.23 0.6,9.82 2.9,12.11C4.76,13.97 7.47,14.46 9.79,13.59L18.9,22.7C19.29,23.09 19.92,23.09 20.31,22.7L22.61,20.4C23,20 23,19.39 22.61,19M19.61,20.59L10.15,11.13C9.54,11.58 8.86,11.85 8.15,11.95C6.79,12.15 5.36,11.74 4.32,10.7C3.37,9.76 2.93,8.5 3,7.26L6.09,10.35L10.33,6.11L7.24,3C8.5,2.95 9.73,3.39 10.68,4.33C11.76,5.41 12.17,6.9 11.92,8.29C11.8,9 11.5,9.66 11.04,10.25L20.5,19.7L19.61,20.59Z'
        },
        metrics: {
          class: MetricsTab,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'metrics' }),
          icon: 'M9 17H7V10H9V17M13 17H11V7H13V17M17 17H15V13H17V17M19 19H5V5H19V19.1M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z'
        },
        danger: {
          class: DangerZoneTab,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'danger' }),
          icon: 'M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M11,15H13V17H11V15M11,7H13V13H11V7'
        }
      }
    }
  },
  computed: {
    tabs() {
      if (this.loading) {
        return {}
      }
      if (Object.keys(this.features).length == 0) {
        return this.defaultTabs
      } else {
        return Object.entries(this.defaultTabs).reduce((acc, [key, value]) => {
          if (this.features[key] ?? true) {
            acc[key] = value
          }
          return acc
        }, {})
      }
    }
  },
  mounted() {
    this.loadDeviceInfo()
  },
  methods: {
    async loadDeviceInfo() {
      this.loading = true
      try {
        // await DeviceApi.health(selected, this.gateway)
        this.features = (await DeviceApi.features(this.device, this.gateway)) || {}
        const methods =
          (await GatewayApi.getDeviceApiMethods({ device: this.device, gateway: this.gateway })) ??
          {}
        this.apiMethods = methods.reduce((acc, method) => {
          acc[method.name] = method
          return acc
        }, {})
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.unreachable' })
        })
        this.unreachable = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <div v-if="!unreachable">
    <BaseContainer class="control-panel-header">
      <h1 class="header">
        {{ intl.formatMessage({ id: 'gateway.panel' }, { device: device.name }) }}
      </h1>
      <DeviceIcon :device="device" />
    </BaseContainer>
    <RiseLoader v-if="loading" color="var(--color-accent)" />
    <div v-else id="control-panel" class="bordered">
      <MenuView :tabs="tabs" :tab="Object.keys(tabs)[0]" :vertical="true" />
    </div>
  </div>
</template>

<style scoped>
#control-panel {
  margin: 0 auto;
  width: 1000px;
}
.control-panel-header {
  width: fit-content;
  margin: auto;
}
</style>
