<script>
import DeviceInfoView from './tabs/DeviceInfoView.vue'
import ActionsView from './tabs/ActionsView.vue'
import SensorsView from './tabs/SensorsView.vue'
import StatesView from './tabs/StatesView.vue'
import ConfigView from './tabs/ConfigView.vue'
import MetricsViewVue from './tabs/MetricsView.vue'
import MenuView from '../menu/MenuView.vue'
import { storeToRefs } from 'pinia'
import { useControlPanelStore } from '../../store/controlPanelStore'
import { useIntl } from 'vue-intl'

export default {
  name: 'DeviceControlPanel',
  components: {
    MenuView
  },
  provide() {
    const { device, gateway } = storeToRefs(useControlPanelStore())
    return {
      device,
      gateway
    }
  },
  data() {
    const intl = useIntl()
    return {
      tabs: {
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
  }
}
</script>

<template>
  <div id="control-panel" class="bordered">
    <MenuView :tabs="tabs" :vertical="true" />
  </div>
</template>

<style scoped>
#control-panel {
  margin: 0 auto;
  padding: var(--padding-default);
  width: 800px;
}
</style>
