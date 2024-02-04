<script>
export const WARNING_TYPE = 'warning'
export const ERROR_TYPE = 'error'
export const INFO_TYPE = 'info'
export const SUCCESS_TYPE = 'success'

const LIFE_TIME = 5000

export default {
  name: 'ToastItem',
  props: {
    id: String,
    toast: Object,
    device: Object,
    gateway: Object
  },
  computed: {
    color() {
      switch (this.toast.type) {
        case ERROR_TYPE:
          return 'rgb(171, 12, 12)'
        case SUCCESS_TYPE:
          return 'rgb(2, 147, 74)'
        case WARNING_TYPE:
          return 'rgb(147, 106, 2)'
        default:
          return 'rgb(0, 112, 122)'
      }
    },
    from() {
      if (this.gateway && this.device) {
        return `${this.gateway.name}@${this.device.name}`
      }
      if (this.gateway) {
        return this.gateway.name + '[gateway]'
      }
      if (this.device) {
        return this.device.name + '[device]'
      }
      return undefined
    },
    fromTitle() {
      if (this.device) {
        return this.device.ip
      }
      return undefined
    }
  },
  mounted() {
    if (this.toast.autoClose) {
      setTimeout(this.close, LIFE_TIME)
    }
  },
  methods: {
    close() {
      this.$emit('close', this.id)
    }
  }
}
</script>

<template>
  <div class="toast" :style="{ backgroundColor: color }">
    <h2 v-if="toast.caption">{{ toast.caption }}</h2>
    <h2 v-if="from" :title="fromTitle">From: {{ from }}</h2>
    <div style="word-wrap: break-word">{{ toast.description }}</div>
    <button @click="close">X</button>
  </div>
</template>

<style scoped>
.toast {
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  width: var(--toast-width);
  min-height: var(--toast-min-height);
  padding: 10px 5px 5px 5px;
  z-index: 1000;
  transition: 0.4s;
}

.toast button {
  background-color: transparent;
  position: absolute;
  top: 0px;
  right: 0px;
  outline: none;
  user-select: none;
}

.toast h2,
h3 {
  text-align: center;
}
</style>
