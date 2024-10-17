<script>
import Container from '../base/Container.vue'
import DeviceIcon from './DeviceIcon.vue';

export default {
  name: 'DeviceItem',
  components: {
    Container,
    DeviceIcon,
  },
  props: {
    device: {
      type: Object
    },
    selected: Boolean
  },
  computed: {
    imgSrc() {
      return deviceInfoToImg(this.device)
    },
    header() {
      const { name, type } = this.device
      return `${name} ${type ? '(' + type + ')' : ''}`
    },
    style() {
      if (this.selected) {
        return {
          'background-color': 'var(--color-background-soft)'
        }
      }
      return {}
    }
  }
}
</script>
<template>
  <Container class="device-item" :style="style">
    <div class="device-item-table">
      <h3>Name: {{ device.name }}</h3>
      <h3>Type: {{ device.type }}</h3>
      <h3>Version: {{ device.version }}</h3>
      <h3>Board: {{ device.board ?? 'Unknown' }}</h3>
      <h3 @click.stop="() => {}">
        Ip <a :href="'http://' + device.ip" target="”_blank”">{{ device.ip }}</a>
      </h3>
      <DeviceIcon :device="device" />
    </div>
  </Container>
</template>

<style scoped>
.device-item {
  padding: var(--default-padding);
}
.device-item-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex: 1 0 auto;
}
</style>
