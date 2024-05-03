<script>
import DeviceInfoView from './tabs/DeviceInfoView.vue'
import ActionsView from './tabs/ActionsView.vue'
import SensorsView from './tabs/SensorsView.vue'
import StatesView from './tabs/StatesView.vue'
import ConfigView from './tabs/ConfigView.vue'
import MetricsViewVue from './tabs/MetricsView.vue'
import MenuView from '../menu/MenuView.vue'
import { useIntl } from 'vue-intl'
import { DeviceApi } from '../../api/device/DeviceApi'
import RiseLoader from 'vue-spinner/src/RiseLoader.vue'

export default {
  name: 'DeviceControlPanel',
  components: {
    MenuView,
    RiseLoader
  },
  props: {
    device: Object,
    gateway: Object,
  },
  provide() {
    return {
      device: this.device,
      gateway: this.gateway,
      features: this.features,
    }
  },
  async setup(props) {
    const features = await DeviceApi.features(props.device, props.gateway).catch((e) => console.log(e)) || {}
    return {
      features
    }
  },
  data() {
    const intl = useIntl()

    return {
      intl,
      features: {},
      tabs: undefined,
      defaultTabs: {
        info: {
          class: DeviceInfoView,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'info' }),
        },
        actions: {
          class: ActionsView,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'actions' }),
        },
        sensors: {
          class: SensorsView,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'sensors' }),
        },
        states: {
          class: StatesView,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'states' }),
        },
        config: {
          class: ConfigView,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'config' }),
        },
        metrics: {
          class: MetricsViewVue,
          caption: intl.formatMessage({ id: 'device.tabs' }, { tab: 'metrics' }),
        }
      }
    }
  },
  mounted() {
    if (Object.keys(this.features).length == 0) {
      this.tabs = this.defaultTabs
    } else {
      this.tabs = Object.entries(this.defaultTabs).reduce((acc, [key, value]) => {
        if (this.features[key] === undefined || this.features[key] === true) {
          acc[key] = value
        }
        return acc
      }, {})
    }
  },
}
</script>

<template>
  <div id="control-panel" class="bordered">
    <RiseLoader v-if="!tabs"/>
    <MenuView v-else :tabs="tabs" tab="info" :vertical="true" />
  </div>
</template>

<style scoped>
#control-panel {
  margin: 0 auto;
  padding: var(--padding-default);
  width: 800px;
}
</style>
