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
import { DeviceApi } from '../../api/device/DeviceApi'
import { GatewayApi } from '../../api/gateway/GatewayApi'
import { computed } from 'vue'
import { toast } from '../../utils/EventBus'

export default {
  name: 'DeviceControlPanel',
  components: {
    MenuView,
    RiseLoader
  },
  props: {
    device: Object
  },
  inject: ['gateway'],
  provide() {
    return {
      device: this.device,
      features: computed(() => this.features),
      apiMethods: computed(() => this.apiMethods)
    }
  },
  data() {
    const intl = useIntl()
    return {
      intl,
      loading: false,
      unreachable: false,
      features: undefined,
      apiMethods: undefined,
      defaultTabs: {
        info: {
          class: DeviceInfoView,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'info' })
        },
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
        config: {
          class: ConfigView,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'config' })
        },
        metrics: {
          class: MetricsView,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'metrics' })
        }
      }
    }
  },
  computed: {
    tabs() {
      if (this.loading) {
        return {}
      }
      if (Object.keys(this.features ?? {}).length == 0) {
        return this.defaultTabs
      } else {
        return Object.entries(this.defaultTabs).reduce((acc, [key, value]) => {
          if (this.features[key] === undefined || this.features[key] === true) {
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
        this.apiMethods =
          (await GatewayApi.getDeviceApiMethods({ device: this.device, gateway: this.gateway })) ??
          []
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
    <h1 class="title">
      {{ intl.formatMessage({ id: 'gateway.panel' }, { device: device.name }) }}
    </h1>
    <RiseLoader v-if="loading" />
    <div v-else id="control-panel" class="bordered">
      <MenuView :tabs="tabs" tab="info" :vertical="true" />
    </div>
  </div>
</template>

<style scoped>
#control-panel {
  margin: 0 auto;
  width: 800px;
}
</style>
