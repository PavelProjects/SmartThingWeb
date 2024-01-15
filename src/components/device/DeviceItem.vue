<script>
const IMG_PATH = "/src/assets/img/"

export default {
  name: "DeviceItem",
  props: {
    device: {
      type: Object
    }
  },
  computed: {
    imgSrc() {
      const { name } = this.device
      if(["pepe", "frog"].includes(name)) {
        return IMG_PATH + "pepe.gif"
      }
      if(["drg", "rock", "stone", "rock_and_stone"].includes(name)) {
        return IMG_PATH + "drg.gif"
      }
      if(["sus", "amogus", "imposter", "sussy_baka"].includes(name)) {
        return IMG_PATH + "amogus.gif"
      }
    }
  }
}
</script>
<template>
  <div>
    <img v-if="imgSrc" :src="imgSrc"/>
    <h1>{{ this.device.name }} {{ this.device.type ? "(" + this.device.type + ")" : '' }}</h1>
    <h2>Ip <a :href="'http://' + this.device.ip" target=”_blank”>{{ this.device.ip }}</a></h2>
  </div>
</template>
<style scoped>

  img {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 20px;
    right: 5px;
    border-radius: var(--border-radius);
  }
</style>