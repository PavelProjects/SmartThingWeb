<script>
import { useIntl } from 'vue-intl'
import { GatewayApi } from '../../api/gateway/GatewayApi'
import { useStompClientStore } from '../../store/stompClientStore'
import { toast } from '../../utils/EventBus'
import LogMessage from './LogMessage.vue'
import BaseContainer from '../base/BaseContainer.vue'
import InputField from '../base/fields/InputField.vue'
import ComboBoxField from '../base/fields/ComboBoxField.vue'

const LEVEL_INT = {
  TRACE: 0,
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40
}

export default {
  name: 'DeviceLogs',
  components: {
    LogMessage,
    BaseContainer,
    InputField,
    ComboBoxField
  },
  inject: ['gateway'],
  data() {
    const intl = useIntl()
    const stompClient = useStompClientStore()

    return {
      intl,
      idSeq: 0,
      messages: [],
      colors: {},
      logLevels: Object.keys(LEVEL_INT),
      filters: {
        device: undefined,
        tag: undefined,
        message: undefined,
        level: undefined
      },
      loading: false,
      stompClient
    }
  },
  watch: {
    filters: {
      handler() {
        this.loadMessages()
      },
      deep: true
    }
  },
  async mounted() {
    await this.loadMessages()
    this.stompClient.subscribe('/devices/logs', this.handleWsMessage)
  },
  unmounted() {
    this.stompClient.unsubscribe('/devices/logs')
  },
  methods: {
    async loadMessages() {
      if (this.loading) {
        return
      }
      this.loading = true
      try {
        this.messages = ((await GatewayApi.getLogs(this.gateway, this.filters)) ?? []).map(
          (message) => ({ ...message, id: this.idSeq++ })
        )
      } catch (error) {
        toast.error({
          caption: 'Failed to load device logs'
        })
      } finally {
        this.loading = false
      }
    },
    handleWsMessage(wsMessage) {
      if (wsMessage?.body) {
        const parsed = JSON.parse(wsMessage.body)
        if (!parsed?.device?.ip || !parsed?.device?.name) {
          return
        }
        console.log(parsed.device.ip)

        const { level, device, message, tag } = this.filters
        if (level && LEVEL_INT[parsed.level] < LEVEL_INT[level]) {
          return
        }
        if (message && !parsed.message.toLowerCase().includes(message.toLowerCase())) {
          return
        }
        if (tag && !parsed.tag.toLowerCase().includes(tag.toLowerCase())) {
          return
        }
        if (device) {
          const devDesc = (parsed.device.name + parsed.device.ip)?.toLowerCase()
          if (!devDesc.includes(device.toLowerCase())) {
            return
          }
        }

        this.messages.unshift({ ...parsed, id: this.idSeq++ })
      }
    },
    generateColorByIp(ip) {
      const splited = ip.split('.')
      const r = this.chooseRandom(splited, 50, 250)
      const g = this.chooseRandom(splited, 50, 250)
      const b = this.chooseRandom(splited, 50, 250)
      return 'rgb(' + r + ',' + g + ',' + b + ', {opacity})'
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
  <BaseContainer class="logs-view" :vertical="true">
    <BaseContainer class="filters">
      <InputField
        :label="intl.formatMessage({ id: 'device.logs.columns' }, { column: 'device' })"
        v-model="filters.device"
      />
      <InputField
        :label="intl.formatMessage({ id: 'device.logs.columns' }, { column: 'tag' })"
        v-model="filters.tag"
      />
      <ComboBoxField
        :label="intl.formatMessage({ id: 'device.logs.columns' }, { column: 'level' })"
        :items="logLevels"
        v-model="filters.level"
      />
      <InputField
        :label="intl.formatMessage({ id: 'device.logs.columns' }, { column: 'msg' })"
        v-model="filters.message"
      />
    </BaseContainer>
    <div class="log-message-container">
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
  </BaseContainer>
</template>

<style scoped>
.logs-view {
  row-gap: var(--default-gap);
  max-height: calc(100vh - var(--doc-height));
  overflow-y: auto;
  min-width: 80vw;
  padding: var(--default-padding);
}
.filters {
  margin: 0 auto;
}
.log-message-container {
  display: grid;
  column-gap: calc(var(--default-gap) / 2);
  grid-template-columns: 200px 150px 200px 120px auto;
  text-align: center;
  padding: var(--default-padding);
  border: 1px solid;
  border-radius: var(--border-radius);
}
.log-message-container :deep(div),
h2 {
  border-right: 1px solid var(--color-border);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.log-message-container :deep(div:last-child),
h2:last-child {
  border-right: none;
}
</style>
