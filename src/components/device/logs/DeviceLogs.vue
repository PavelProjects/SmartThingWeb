<script>
import { GatewayApi } from '../../../api/GatewayApi'
import { useStompClientStore } from '../../../store/stompClientStore'
import LogMessage from './LogMessage.vue'

export default {
  name: 'DeviceLogs',
  components: {
    LogMessage
  },
  data() {
    const stompClient = useStompClientStore()

    return {
      idSequence: 0,
      messages: [],
      colors: {},
      stompClient,
    }
  },
  async mounted() {

    this.messages = await GatewayApi.getLogs()
    this.messages.reverse()

    this.stompClient.unsubscribe('/devices/logs')
    this.stompClient.subscribe(
      '/devices/logs',
      (message) => {
        if (message && message.body) {
          console.debug('LOG:' + message.body)
          const parsed = JSON.parse(message.body)
          parsed.id = this.idSequence++
          this.messages.unshift(parsed)
        }
      }
    )
    console.debug('Subscribed to the logs topic')
  },
  unmounted() {
    this.stompClient.unsubscribe('logs')
  },
  methods: {
    generateColorByIp(ip) {
      const splited = ip.split('.')
      const r = this.chooseRandom(splited, 100, 200)
      const g = this.chooseRandom(splited, 100, 200)
      const b = this.chooseRandom(splited, 100, 200)
      return 'rgb(' + r + ',' + g + ',' + b + ', 0.5)'
    },
    chooseRandom(arr, min, max) {
      const val = arr[Math.floor(Math.random() * arr.length)]
      if (val < min) {
        return min
      } else if (val > max) {
        return max
      }
      return val
    },
    colorByIp(message) {
      const { device } = message || {}
      const { ip } = device || {}
      if (!ip) {
        return
      }
      if (!this.colors[ip]) {
        this.colors[ip] = this.generateColorByIp(ip)
      }
      return this.colors[ip]
    }
  }
}
</script>

<template>
  <div class="logs-view">
    <div class="log-message-container bordered">
      <h2>Device</h2>
      <h2>Date</h2>
      <h2>Level</h2>
      <h2 style="border-right: none">Message</h2>
    </div>
    <LogMessage
      v-for="message of messages"
      :key="message.id"
      :log="message"
      :color="colorByIp(message)"
    />
  </div>
</template>

<style scoped>
.logs-view {
  display: flex;
  flex-direction: column;
  row-gap: var(--default-gap);
  max-height: calc(100vh - var(--doc-height));
  overflow-y: auto;
  min-width: 80vw;
  padding: var(--default-gap);
}
</style>