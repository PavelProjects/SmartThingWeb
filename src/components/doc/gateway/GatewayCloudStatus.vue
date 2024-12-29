<script>
import { GatewayApi } from '../../../api/gateway/GatewayApi.js'
import InputField from '../../base/fields/InputField.vue'
import LoadingButton from '../../base/controls/LoadingButton.vue'
import GatewayCloudConnect from './GatewayCloudConnect.vue'
import { toast } from '../../../utils/EventBus.js'
import { useStompClientStore } from '../../../store/stompClientStore.js'
import { useIntl } from 'vue-intl'
import BaseContainer from '../../base/BaseContainer.vue'
import ModalDialog from '../../base/ModalDialog.vue'

export default {
  name: 'GatewayCloudStatus',
  components: {
    InputField,
    LoadingButton,
    GatewayCloudConnect,
    BaseContainer,
    ModalDialog
  },
  data() {
    const stompClient = useStompClientStore()
    const intl = useIntl()

    return {
      intl,
      stompClient,
      dialogVisible: false,
      status: '',
      auth: undefined
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
        this.auth = (await GatewayApi.getCloudAuthentication()) ?? {}
      } catch (error) {
        console.error(error)
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
    async cloudConnected() {
      await this.loadAuthentication()
      if (this.auth.gateway) {
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
      <p class="header" :title="intl.formatMessage({ id: 'gateway.cloud.conn.status.title' })">
        {{ connectionStatus }}
      </p>
    </div>
    <ModalDialog id="cloud-info" :open="dialogVisible" @close="dialogVisible = false">
      <BaseContainer class="cloud-info" @click.stop="() => {}" :vertical="true">
        <h2 class="header">
          {{ intl.formatMessage({ id: 'gateway.cloud.info' }) }}
        </h2>
        <BaseContainer v-if="auth" :vertical="true">
          <InputField
            v-if="cloudConfig"
            :label="intl.formatMessage({ id: 'gateway.cloud.config' })"
            :modelValue="cloudConfig.cloudUrl"
            :disabled="true"
          />
          <InputField
            :label="intl.formatMessage({ id: 'gateway.cloud.info.user' })"
            :modelValue="auth.user.login"
            :title="auth.user.id"
            :disabled="true"
          />
          <InputField
            :label="intl.formatMessage({ id: 'gateway.cloud.info.gateway.id' })"
            :modelValue="auth.gateway.id"
            :disabled="true"
          />
          <InputField
            :label="intl.formatMessage({ id: 'gateway.cloud.info.gateway.name' })"
            :modelValue="auth.gateway.name"
            :disabled="true"
          />
          <InputField
            :label="intl.formatMessage({ id: 'gateway.cloud.info.gateway.description' })"
            :modelValue="auth.gateway.description"
            :disabled="true"
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
        </BaseContainer>
        <BaseContainer v-if="!auth" :vertical="true">
          <h3>
            {{ intl.formatMessage({ id: 'gateway.cloud.info.missing' }) }}
          </h3>
          <GatewayCloudConnect @connected="cloudConnected" />
        </BaseContainer>
      </BaseContainer>
    </ModalDialog>
  </div>
</template>

<style scoped>
.status {
  cursor: pointer;
  user-select: none;
}
.cloud-info {
  padding: var(--default-padding);
}
</style>
