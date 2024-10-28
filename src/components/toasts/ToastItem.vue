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
    source: Object
  },
  data() {
    return {
      toastClass: undefined,
      ttlBarWidth: 0,
      delay: LIFE_TIME / 50,
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
          return 'rgb(184, 81, 1)'
        default:
          return 'rgb(0, 112, 122)'
      }
    },
    from() {
      if (!this.source) {
        return undefined
      }
      const { gateway, device } = this.source
      if (gateway && device) {
        return `${gateway.name}@${device.name}`
      }
      if (gateway) {
        return gateway.name + '[gateway]'
      }
      if (device) {
        return device.name + '[device]'
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
      setTimeout(this.close, LIFE_TIME)
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
    <h2 v-if="from">From: {{ from }}</h2>
    <h3 style="word-wrap: break-word">{{ toast.description }}</h3>
    <p v-if="toast.dateTime" class="date">{{ toast.dateTime }}</p>
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

.date {
  text-align: right;
  font-size: 12px;
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
