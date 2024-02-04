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
    }
  }
}
</script>
<template>
  <div class="bordered device-container" :class="{ 'menu-selected': selected }">
    <img v-if="imgSrc" :src="imgSrc" />
    <h1>{{ this.device.name }} {{ this.device.type ? '(' + this.device.type + ')' : '' }}</h1>
    <h2>
      Ip <a :href="'http://' + this.device.ip" target="”_blank”">{{ this.device.ip }}</a>
    </h2>
  </div>
</template>
<style scoped>
.device-container {
  position: relative;
  padding: var(--padding-default);
  display: flex;
  flex-direction: column;
  gap: var(--default-gap);
  width: 400px;
}
img {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 20px;
  right: var(--padding-default);
  border-radius: var(--border-radius);
}
</style>
