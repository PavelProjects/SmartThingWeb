<script>
import { GatewayApi } from '../../api/gateway/GatewayApi.js'
import InputField from '../base/fields/InputField.vue'
import LoadingButton from '../base/controls/LoadingButton.vue'
import GatewayAuthDialog from '../dialogs/GatewayAuthDialog.vue'
import { toast } from '../../utils/EventBus.js'
import { useStompClientStore } from '../../store/stompClientStore.js'
import { useIntl } from 'vue-intl'
import Container from '../base/Container.vue'

export default {
  name: 'GatewayAuthInfo',
  components: {
    InputField,
    LoadingButton,
    GatewayAuthDialog,
    Container
  },
  data() {
    const stompClient = useStompClientStore()
    const intl = useIntl()

    return {
      intl,
      stompClient,
      dialogVisible: false,
      authDialogVisible: false,
      status: '',
      gateway: undefined,
      user: undefined
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
      return this.intl.formatMessage({ id: 'gateway.cloud.conn.status' }, { status: this.status })
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
        const auth = (await GatewayApi.getCloudAuthentication()) ?? {}
        this.gateway = auth.gateway
        this.user = auth.user
      } catch (error) {
        console.error(error)
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
          console.error(error)
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
          this.dialogVisible = false

          this.loadAuthentication()
          this.loadCloudConfig()
        } catch (error) {
          toast.error({
            caption: this.intl.formatMessage({ id: 'gateway.cloud.logout.error' })
          })
        }
      }
    },
    async authDialogCloseHandle() {
      this.authDialogVisible = false
      await this.loadAuthentication()
      if (this.gateway) {
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
      <Container class="dialog" @click.stop="() => {}" :vertical="true">
        <Container v-if="gateway" :vertical="true">
          <h2 class="title">
            {{ intl.formatMessage({ id: 'gateway.cloud.info' }) }}
          </h2>
          <InputField
            :label="intl.formatMessage({ id: 'gateway.cloud.info.user' })"
            :modelValue="user.login"
            :title="user.id"
            :disabled="true"
            :vertical="false"
          />
          <InputField
            :label="intl.formatMessage({ id: 'gateway.cloud.info.gateway.id' })"
            :modelValue="gateway.id"
            :disabled="true"
            :vertical="false"
          />
          <InputField
            :label="intl.formatMessage({ id: 'gateway.cloud.info.gateway.name' })"
            :modelValue="gateway.name"
            :disabled="true"
            :vertical="false"
          />
          <InputField
            :label="intl.formatMessage({ id: 'gateway.cloud.info.gateway.description' })"
            :modelValue="gateway.description"
            :vertical="false"
          />
        </Container>
        <Container v-if="cloudConfig" :vertical="true">
          <h2 class="title">
            {{ intl.formatMessage({ id: 'gateway.cloud.config' }) }}
          </h2>
          <InputField
            :label="intl.formatMessage({ id: 'gateway.cloud.config.url' })"
            :modelValue="cloudConfig.cloudUrl"
            :disabled="true"
            :vertical="false"
          />
          <LoadingButton
            v-if="
              ['CONNECTION_LOST', 'DISCONNECTED', 'FAILED_TO_CONNECT', 'NOT_CONNECTED'].includes(
                status
              )
            "
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
        </Container>
        <button v-if="!cloudConfig" class="btn" @click="authDialogVisible = true">
          <h2>{{ intl.formatMessage({ id: 'gateway.cloud.add.token' }) }}</h2>
        </button>
      </Container>
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
  background-color: var(--color-background-mute);
  border-radius: var(--border-radius);
  padding: var(--default-gap);
}
.dialog * {
  flex: 1 0 auto;
}
</style>
