<script>
import { useIntl } from 'vue-intl'
import BaseContainer from '../base/BaseContainer.vue'
import DeviceIcon from './DeviceIcon.vue'

export default {
  name: 'DeviceItem',
  components: {
    BaseContainer,
    DeviceIcon
  },
  props: {
    device: {
      type: Object
    }
  },
  data() {
    const intl = useIntl()

    return {
      intl
    }
  }
}
</script>
<template>
  <BaseContainer class="device-item">
    <div class="device-item-table">
      <h3>{{ intl.formatMessage({ id: 'device.item.name' }, device) }}</h3>
      <h3>{{ intl.formatMessage({ id: 'device.item.type' }, device) }}</h3>
      <h3 @click.stop="() => {}">
        Ip: <a :href="'http://' + device.ip" target="”_blank”">{{ device.ip }}</a>
      </h3>
      <h3>
        {{ intl.formatMessage({ id: 'device.item.board' }, { board: undefined, ...device }) }}
      </h3>
      <h3>{{ intl.formatMessage({ id: 'device.item.st.version' }, device) }}</h3>
      <h3>{{ intl.formatMessage({ id: 'device.item.version' }, device) }}</h3>
    </div>
    <DeviceIcon :device="device" />
  </BaseContainer>
</template>

<style scoped>
.device-item {
  padding: var(--default-padding);
  width: 100%;
}
.device-item h3 {
  word-wrap: break-word;
}
.device-item-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
}
</style>
