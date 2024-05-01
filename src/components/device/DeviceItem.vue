<script>
const IMG_PATH = '/img/'

export default {
  name: 'DeviceItem',
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
          'background-color': 'var(--color-background-soft)',
        }
      }
    },
  }
}
</script>
<template>
  <div class="device-item" :style="style">
    <div class="list" style="flex: 1 1 auto">
      <h1 class="header">{{ header }}</h1>
      <h2>
        Ip <a :href="'http://' + device.ip" target="”_blank”">{{ device.ip }}</a>
      </h2>
    </div>
    <img v-if="imgSrc" :src="imgSrc" />
  </div>
</template>

<style scoped>
.device-item {
  padding: var(--padding-default);
  display: flex;
  flex-direction: row;
}
.device-item:hover {
  transition: background-color 0.5s;
  background-color: var(--color-background-mute);
}
.header {
  word-wrap: break-word;
}
img {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius);
  margin: auto;
}
</style>
