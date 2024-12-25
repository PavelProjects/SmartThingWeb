<script>
export default {
  name: 'LogMessage',
  props: {
    log: Object,
    color: String
  },
  data() {
    const { device, message, level, dateTime, tag } = this.log
    return {
      device,
      message,
      level,
      dateTime,
      tag
    }
  },
  computed: {
    levelColor() {
      switch (this.level) {
        case 'ERROR':
          return 'var(--nord11)'
        case 'WARNING':
        case 'WARN':
          return 'var(--nord12)'
        case 'INFO':
          return 'var(--nord8)'
        case 'DEBUG':
          return 'var(--nord15)'
        default:
          return undefined
      }
    },
    style() {
      return {
        borderColor: this.color.replace('{opacity}', '0.7'),
        backgroundColor: this.color.replace('{opacity}', '0.05')
      }
    }
  }
}
</script>

<template>
  <div class="log-message-container bordered" :style="style">
    <div>{{ `${device?.ip} [${device?.name}]` }}</div>
    <div>{{ dateTime }}</div>
    <div>{{ tag }}</div>
    <div class="level" :style="{ color: levelColor }">{{ level }}</div>
    <div class="message">{{ message }}</div>
  </div>
</template>

<style scoped>
.message {
  display: inline-block;
  word-wrap: break-word;
  text-align: left;
}
.level {
  font-weight: 1000;
}
</style>
