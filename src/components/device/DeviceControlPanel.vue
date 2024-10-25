<script>
import DeviceInfoView from './tabs/DeviceInfoView.vue'
import ActionsView from './tabs/ActionsView.vue'
import SensorsView from './tabs/SensorsView.vue'
import StatesView from './tabs/StatesView.vue'
import ConfigView from './tabs/ConfigView.vue'
import MetricsView from './tabs/MetricsView.vue'
import MenuView from '../menu/MenuView.vue'
import { useIntl } from 'vue-intl'
import RiseLoader from 'vue-spinner/src/RiseLoader.vue'
import { DeviceApi, DeviceApiMethods } from '../../api/device/DeviceApi'
import { GatewayApi } from '../../api/gateway/GatewayApi'
import { computed } from 'vue'
import { toast } from '../../utils/EventBus'
import DangerZoneView from './tabs/DangerZoneView.vue'
import BaseContainer from '../base/BaseContainer.vue'
import DeviceIcon from './DeviceIcon.vue'

const TAB_REQUIRED_API = {
  danger: [DeviceApiMethods.RESTART, DeviceApiMethods.WIPE]
}

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
          class: ActionsView,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'actions' })
        },
        sensors: {
          class: SensorsView,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'sensors' })
        },
        states: {
          class: StatesView,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'states' })
        },
        info: {
          class: DeviceInfoView,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'info' })
        },
        config: {
          class: ConfigView,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'config' })
        },
        metrics: {
          class: MetricsView,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'metrics' })
        },
        danger: {
          class: DangerZoneView,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'danger' })
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
          if ((this.features[key] ?? true) && this.haveRequiredApi(key)) {
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
    },
    haveRequiredApi(tab) {
      if (!TAB_REQUIRED_API[tab]) {
        return true
      }
      for (const method of TAB_REQUIRED_API[tab]) {
        if (!this.apiMethods[method]) {
          return false
        }
      }
      return true
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
    <RiseLoader v-if="loading" />
    <div v-else id="control-panel" class="bordered">
      <MenuView :tabs="tabs" :tab="Object.keys(tabs)[0]" :vertical="true" />
    </div>
  </div>
</template>

<style scoped>
#control-panel {
  margin: 0 auto;
  width: 800px;
}
.control-panel-header {
  width: fit-content;
  margin: auto;
}
</style>
