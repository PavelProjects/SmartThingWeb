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
      <p>{{ intl.formatMessage({ id: 'device.item.name' }, device) }}</p>
      <p>{{ intl.formatMessage({ id: 'device.item.type' }, device) }}</p>
      <p>Ip: {{ device.ip }}</p>
      <p>
        {{ intl.formatMessage({ id: 'device.item.board' }, { board: undefined, ...device }) }}
      </p>
      <p>{{ intl.formatMessage({ id: 'device.item.st.version' }, device) }}</p>
      <p>{{ intl.formatMessage({ id: 'device.item.version' }, device) }}</p>
    </div>
    <DeviceIcon :device="device" />
  </BaseContainer>
</template>

<style scoped>
.device-item {
  padding: 5px;
  width: 100%;
}
.device-item p {
  word-wrap: break-word;
}
.device-item-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
}
</style>
