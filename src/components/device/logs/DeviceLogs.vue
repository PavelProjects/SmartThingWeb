<script>
import { useIntl } from 'vue-intl'
import { GatewayApi } from '../../../api/gateway/GatewayApi'
import { useStompClientStore } from '../../../store/stompClientStore'
import { toast } from '../../../utils/EventBus'
import LogMessage from './LogMessage.vue'
import Container from '../../base/Container.vue'

export default {
  name: 'DeviceLogs',
  components: {
    LogMessage,
    Container,
  },
  inject: ['gateway'],
  data() {
    const intl = useIntl()
    const stompClient = useStompClientStore()

    return {
      intl,
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
  },
  unmounted() {
    this.stompClient.unsubscribe('/devices/logs')
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
.log-message-container {
  display: grid;
  column-gap: calc(var(--default-gap) / 2);
  grid-template-columns: 200px 150px 200px 120px auto;
  text-align: center;
  padding: var(--padding-default);
}
.log-message-container :deep(div),h2 {
  border-right: 2px solid var(--color-border);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.log-message-container :deep(div:last-child),h2:last-child {
  border-right: none;
}
</style>
