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
      tag,
    }
  },
  computed: {
    levelColor() {
      switch (this.level) {
        case 'ERROR':
          return 'rgb(142, 63, 43)'
        case 'WARNING':
        case 'WARN':
          return 'rgb(188, 106, 34)'
        case 'INFO':
          return 'rgba(103, 198, 136, 0.8)'
        case 'DEBUG':
          return 'purple'
        default:
          return undefined
      }
    }
  }
}
</script>

<template>
  <div class="log-message-container bordered" :style="{ borderColor: color }">
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
