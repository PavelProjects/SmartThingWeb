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
    const props = {}
    return {
      tabs: {
        info: {
          class: DeviceInfoView,
          caption: 'Information',
          props
        },
        actions: {
          class: ActionsView,
          caption: 'Actions',
          props
        },
        sensors: {
          class: SensorsView,
          caption: 'Sensors',
          props
        },
        states: {
          class: StatesView,
          caption: 'States',
          props
        },
        config: {
          class: ConfigView,
          caption: 'Configuration',
          props
        },
        metrics: {
          class: MetricsViewVue,
          caption: 'Metrics',
          props
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
  width: 700px;
}
</style>
