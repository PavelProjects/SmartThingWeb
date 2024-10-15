<script>
import Container from '../base/Container.vue'

const IMG_PATH = document.location.pathname + 'img/'

export default {
  name: 'DeviceItem',
  components: {
    Container
  },
  props: {
    device: {
      type: Object
    },
    selected: Boolean
  },
  computed: {
    imgSrc() {
      const { name } = this.device
      if (['pepe', 'frog'].includes(name)) {
        return IMG_PATH + 'pepe.gif'
      }
      if (['drg', 'rock', 'stone', 'rock_and_stone'].includes(name)) {
        return IMG_PATH + 'drg.gif'
      }
      if (['sus', 'amogus', 'imposter', 'sussy_baka'].includes(name)) {
        return IMG_PATH + 'amogus.gif'
      }
      return undefined
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
      <h3>Board: {{ device.board ?? "Unknown" }}</h3>
      <h3 @click.stop="() => {}">
        Ip <a :href="'http://' + device.ip" target="”_blank”">{{ device.ip }}</a>
      </h3>
      <img v-if="imgSrc" :src="imgSrc" />
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
img {
  width: 30px;
  height: 30px;
  border-radius: var(--border-radius);
  margin: auto;
}
</style>
