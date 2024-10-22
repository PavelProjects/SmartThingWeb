<script>
export const WARNING_TYPE = 'warning'
export const ERROR_TYPE = 'error'
export const INFO_TYPE = 'info'
export const SUCCESS_TYPE = 'success'

const LIFE_TIME = 2500

export default {
  name: 'ToastItem',
  props: {
    id: String,
    toast: Object,
    ttl: {
      type: Number,
      default: () => LIFE_TIME
    },
    device: Object,
    gateway: Object
  },
  data() {
    return {
      toastClass: undefined,
      ttlBarWidth: 0,
      delay: this.ttl / 50,
      interval: undefined
    }
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
    },
    ttlBarStyle() {
      return {
        width: `${this.ttlBarWidth}%`
      }
    }
  },
  mounted() {
    if (this.toast.autoClose) {
      setTimeout(this.close, this.ttl)
      this.interval = setInterval(() => {
        if (this.ttlBarWidth < 100) {
          this.ttlBarWidth += 2
        }
      }, this.delay)
    }
  },
  unmounted() {
    clearInterval(this.interval)
  },
  methods: {
    close() {
      this.toastClass = 'toast-hide'
      setTimeout(() => this.$emit('close', this.id), 500)
    }
  }
}
</script>

<template>
  <div class="toast" :class="toastClass" :style="{ backgroundColor: color }">
    <h2 v-if="toast.caption">{{ toast.caption }}</h2>
    <h2 v-if="from" :title="fromTitle">From: {{ from }}</h2>
    <div style="word-wrap: break-word">{{ toast.description }}</div>
    <button @click="close">X</button>
    <div class="ttl-bar" :style="ttlBarStyle"></div>
  </div>
</template>

<style scoped>
.toast {
  position: relative;
  border-radius: var(--border-radius);
  width: var(--toast-width);
  min-height: var(--toast-min-height);
  padding: 5px;
  z-index: 1000;
  transition: all 0.5s ease-in;
}

.toast-hide {
  opacity: 0;
}

.toast button {
  background-color: transparent;
  border-color: transparent;
  position: absolute;
  top: 0px;
  right: 0px;
  outline: none;
  user-select: none;
  cursor: pointer;
}

.toast h2,
h3 {
  text-align: center;
}

.ttl-bar {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  margin-left: auto;
  background-color: var(--color-border);
  opacity: 0.5;
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  transition: all 0.2s;
}
</style>
