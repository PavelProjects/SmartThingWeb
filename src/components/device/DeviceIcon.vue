<script>
const IMG_PATH = document.location.pathname + 'img/'

export default {
  name: 'DeviceIcon',
  props: {
    device: Object
  },
  data() {
    return {
      loaded: false
    }
  },
  computed: {
    imgSrc() {
      if (!this.device) {
        return
      }

      const { name, type } = this.device
      if (['pepe', 'frog', 'happy'].includes(name)) {
        return IMG_PATH + 'pepe.gif'
      }
      if (['drg', 'rock', 'stone', 'rock_and_stone'].includes(name)) {
        return IMG_PATH + 'drg.gif'
      }
      if (['sus', 'amogus', 'imposter', 'sussy', 'sussy-baka'].includes(name)) {
        return IMG_PATH + 'amogus.gif'
      }
      if (name === 'test' || name.startsWith('autotest') || type === 'test_device') {
        return IMG_PATH + 'pepe_test.png'
      }
      return IMG_PATH + name + '.png'
    }
  },
  methods: {
    onError() {
      console.info("No icon for device [" + this.device?.name + "] were found. If you want add custom icon " +
        "for this device add " + this.device?.name + ".png image in /img/ folder. You can find this folder " + 
        "in web page's folder on the server."
      )
    }
  }
}
</script>

<template>
  <img 
    class="device-img"
    :src="imgSrc"
    :style="{ display: loaded ? 'unset' : 'none' }"
    @load="() => loaded = true"
    @error="onError"
  />
</template>

<style scoped>
.device-img {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius);
  margin: auto;
}
</style>