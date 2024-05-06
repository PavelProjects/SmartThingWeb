<script>
import { storeToRefs } from 'pinia'
import { useIntl } from 'vue-intl'
import { GatewayApi } from '../../../api/gateway/GatewayApi'
import { useStompClientStore } from '../../../store/stompClientStore'
import { toast } from '../../../utils/EventBus'
import LogMessage from './LogMessage.vue'
import { useGatewayStore } from '../../../store/gatewayStore'
import Container from '../../base/Container.vue'

export default {
  name: 'DeviceLogs',
  components: {
    LogMessage,
    Container,
  },
  data() {
    const intl = useIntl()
    const stompClient = useStompClientStore()
    const { gateway } = storeToRefs(useGatewayStore())

    return {
      intl,
      gateway,
      messages: [],
      colors: {},
      stompClient,
      idSeq: 0
    }
  },
  async mounted() {
    try {
      this.messages = await GatewayApi.getLogs(this.gateway)
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to load device logs'
      })
      return;
    }
    this.messages.reverse()

    // todo proxy through cloud?
    this.stompClient.unsubscribe('/devices/logs')
    this.stompClient.subscribe('/devices/logs', (message) => {
      if (message && message.body) {
        console.debug(`Device log  message: ${message.body}`)
        const parsed = JSON.parse(message.body)
        if (!parsed?.device?.ip || !parsed?.device?.name) {
          console.error('Davice name or ip in log message is missing!')
          return
        }
        parsed.id = this.idSeq++
        this.messages.unshift(parsed)
      }
    })
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
  <Container class="logs-view" :vertical="true">
    <div class="log-message-container bordered">
      <h2 v-for="column of ['device', 'date', 'tag', 'level', 'msg']" :key="column">
        {{ intl.formatMessage({ id: 'device.logs.columns' }, { column }) }}
      </h2>
    </div>
    <LogMessage
      v-for="message of messages"
      :key="message.id"
      :log="message"
      :color="colorByIp(message)"
    />
  </Container>
</template>

<style scoped>
.logs-view {
  row-gap: var(--default-gap);
  max-height: calc(100vh - var(--doc-height));
  overflow-y: auto;
  min-width: 80vw;
  padding: var(--default-gap);
}
</style>
