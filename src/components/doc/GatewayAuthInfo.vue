<script>
import { GatewayApi } from '../../api/gateway/GatewayApi.js'
import InputField from '../fields/InputField.vue'
import LoadingButton from '../controls/LoadingButton.vue'
import GatewayAuthDialog from '../dialogs/GatewayAuthDialog.vue'
import { useGatewayAuthStore } from '../../store/gatewayAuthStore.js'
import { toast } from '../../utils/EventBus.js'
import { useStompClientStore } from '../../store/stompClientStore.js'
import { useIntl } from 'vue-intl'

export default {
  name: 'GatewayAuthInfo',
  components: {
    InputField,
    LoadingButton,
    GatewayAuthDialog
  },
  data() {
    const store = useGatewayAuthStore()
    const stompClient = useStompClientStore()
    const intl = useIntl()

    return {
      store,
      intl,
      stompClient,
      dialogVisible: false,
      authDialogVisible: false,
      status: ''
    }
  },
  mounted() {
    this.loadAuthentication()
    this.loadCloudConfig()
    this.getConnStatus()

    this.stompClient.subscribe('/connection/status', (message) => {
      if (message && message.body) {
        const data = JSON.parse(message.body)
        this.status = data.status
      }
    })
  },
  unmounted() {
    this.stompClient.unsubscribe('/connection/status')
  },
  computed: {
    connectionStatus() {
      const mappedStatus = this.intl.formatMessage
      return this.intl.formatMessage(
        { id: 'gateway.cloud.conn.status' },
        { status: this.status }
      )
    }
  },
  methods: {
    async loadCloudConfig() {
      try {
        this.cloudConfig = await GatewayApi.getCloudConfig()
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to fetch cloud info'
        })
      }
    },
    async getConnStatus() {
      try {
        this.status = await GatewayApi.getConnectionStatus()
      } catch (error) {
        console.error(error)
      }
    },
    async loadAuthentication() {
      try {
        this.store.setAuthentication(await GatewayApi.getCloudAuthentication())
      } catch (error) {
        console.log(error)
        toast.error({
          caption: 'Failed to fetch cloud authentication info'
        })
      }
    },
    async connect() {
      try {
        await GatewayApi.cloudConnect()
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'gateway.cloud.conn.failed' })
        })
      }
    },
    async disconnect() {
      if (confirm(this.intl.formatMessage({ id: 'gateway.cloud.disconnect.confirm' }))) {
        try {
          await GatewayApi.cloudDisconnect()
        } catch (error) {
          console.log(error)
          toast.error({
            caption: this.intl.formatMessage({ id: 'gateway.cloud.disconnect.failed' })
          })
        }
      }
    },
    async logout() {
      if (confirm(this.intl.formatMessage({ id: 'gateway.cloud.logout.confirm' }))) {
        try {
          await GatewayApi.cloudLogout()
          toast.success({
            caption: this.intl.formatMessage({ id: 'gateway.cloud.logout.success' })
          })
          this.loadCloudConfig()
          this.dialogVisible = false
        } catch (error) {
          toast.error({
            caption: this.intl.formatMessage({ id: 'gateway.cloud.logout.error' })
          })
        }
      }
    },
    authDialogCloseHandle() {
      this.authDialogVisible = false
      if (this.store.gateway) {
        this.loadCloudConfig()
        this.connect()
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="status" @click="dialogVisible = !dialogVisible">
      <h2 class="title" :title="intl.formatMessage({ id: 'gateway.cloud.conn.status.title' })">
        {{ connectionStatus }}
      </h2>
    </div>
    <div v-if="dialogVisible" class="overlay" @click.stop="dialogVisible = false">
      <div class="dialog" @click.stop="() => {}">
        <div v-if="store.gateway" class="list">
          <h2 class="title">
            {{ intl.formatMessage({ id: 'gateway.cloud.info.identity' }) }}
          </h2>
          <InputField
            :label="intl.formatMessage({ id: 'gateway.cloud.info.user' })"
            :modelValue="store.user.login"
            :title="store.user.id"
            :disabled="true"
          />
          <InputField
            :label="intl.formatMessage({ id: 'gateway.cloud.info.gateway' })"
            :modelValue="store.gateway.name"
            :title="store.gateway.description"
            :disabled="true"
          />
        </div>
        <div v-if="cloudConfig" class="list">
          <h2 class="title">
            {{ intl.formatMessage({ id: 'gateway.cloud.config' }) }}
          </h2>
          <InputField
            :label="intl.formatMessage({ id: 'gateway.cloud.config.ip' })"
            :modelValue="cloudConfig.cloudIp"
            :disabled="true"
          />
          <InputField
            :label="intl.formatMessage({ id: 'gateway.cloud.config.port' })"
            :modelValue="cloudConfig.cloudPort"
            :disabled="true"
          />
          <LoadingButton
            v-if="['CONNECTION_LOST', 'DISCONNECTED', 'FAILED_TO_CONNECT'].includes(status)"
            @click="connect"
          >
            <h2>{{ intl.formatMessage({ id: 'gateway.cloud.reconnect' }) }}</h2>
          </LoadingButton>
          <LoadingButton v-if="status === 'CONNECTED'" @click="disconnect">
            <h2>{{ intl.formatMessage({ id: 'gateway.cloud.disconnect' }) }}</h2>
          </LoadingButton>
          <LoadingButton @click="logout">
            <h2>{{ intl.formatMessage({ id: 'log.out' }) }}</h2>
          </LoadingButton>
        </div>
        <button v-if="!cloudConfig" class="btn" @click="authDialogVisible = true">
          <h2>{{ intl.formatMessage({ id: 'gateway.cloud.add.token' }) }}</h2>
        </button>
      </div>
    </div>
    <GatewayAuthDialog v-if="authDialogVisible" @close="authDialogCloseHandle" />
  </div>
</template>

<style scoped>
.status {
  cursor: pointer;
  user-select: none;
}
.dialog {
  min-width: 320px;
  position: absolute;
  top: var(--default-gap);
  right: var(--default-gap);
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-mute);
  border-radius: var(--border-radius);
  padding: 5px;
}
.dialog * {
  flex: 1 0 auto;
}
</style>
