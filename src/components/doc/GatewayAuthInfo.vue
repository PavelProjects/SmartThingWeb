<script>
import { GatewayApi } from '../../api/GatewayApi.js'
import InputField from '../fields/InputField.vue'
import LoadingButton from '../controls/LoadingButton.vue'
import GatewayAuthDialog from '../dialogs/GatewayAuthDialog.vue'
import { useGatewayAuthStore } from '../../store/gatewayAuthStore.js'
import { toast } from '../../utils/EventBus.js'
import { useStompClientStore } from '../../store/stompClientStore.js'

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
    
    return {
      store,
      stompClient,
      dialogVisible: false,
      authDialogVisible: false,
      status: '',
    }
  },
  mounted() {
    this.loadAuthentication()
    this.loadCloudInfo()
    this.getConnStatus()

    this.stompClient.subscribe(
      "/connection/status",
      (message) => {
        if (message && message.body) {
          const data = JSON.parse(message.body)
          this.status = data.status
        }
      }
    )
  },
  unmounted() {
    this.stompClient.unsubscribe("/connection/status")
  },
  computed: {
    connectionStatus() {
      const fixed = this.status
        .toLowerCase().replace('_', ' ')
      return `Cloud: ${fixed}`
    }
  },
  methods: {
    async loadCloudInfo() {
      this.cloudInfo = await GatewayApi.getCloudInfo()
    },
    async getConnStatus() {
      this.status = await GatewayApi.getConnectionStatus()
    },
    async loadAuthentication() {
      this.store.setAuthentication(await GatewayApi.getCloudAuthentication())
    },
    async connect() {
      if (await GatewayApi.cloudConnect()) {
        toast.success({
          caption: 'Connected'
        })
      } else {
        toast.error({
          caption: 'Failed to connect'
        })
      }
    },
    async disconnect() {
      if (confirm("Are you sure?")) {
        if (await GatewayApi.cloudDisconnect()) {
          toast.success({
            caption: 'Disconnected'
          })
        } else {
          toast.error({
            caption: 'Failed to disconnect'
          })
        }
      }
    },
    async logout() {
      if (confirm("Are you sure?")) {
        if(await GatewayApi.cloudLogout()) {
          toast.success({
            caption: 'Loged out'
          })
          this.loadCloudInfo()
          this.dialogVisible = false
        } else {
          toast.success({
            caption: 'Failed to log out'
          })
        }
      }
    },
    authDialogCloseHandle() {
      this.authDialogVisible = false
      if(this.store.gateway) {
        this.loadCloudInfo()
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="status" @click="dialogVisible = !dialogVisible">
      <h2 
        class="title"
        title="Cloud connection status"
      >
        {{ connectionStatus }}
      </h2>
    </div>
    <div v-if="dialogVisible" class="overlay" @click.stop="dialogVisible = false">
      <div class="dialog" @click.stop="() => {}">
        <div v-if="store.gateway" class="list">
          <h2 class="title">Authentication</h2>
          <InputField
            label="User"
            :modelValue="store.user.login"
            :title="store.user.id"
            :disabled="true"
          />
          <InputField
            label="Gateway"
            :modelValue="store.gateway.name"
            :title="store.gateway.description"
            :disabled="true"
          />
        </div>
        <div v-if="cloudInfo" class="list">
          <h2 class="title">Cloud info</h2>
          <InputField
            label="Ip"
            :modelValue="cloudInfo.cloudIp"
            :disabled="true"
          />
          <InputField
            label="Port"
            :modelValue="cloudInfo.cloudPort"
            :disabled="true"
          />
          <LoadingButton
            v-if="['CONNECTION_LOST', 'DISCONNECTED', 'FAILED_TO_CONNECT'].includes(status)"
            @click="connect"
          >
            <h2>Reconnect</h2>
          </LoadingButton>
          <LoadingButton
            v-if="status === 'CONNECTED'"
            @click="disconnect"
          >
            <h2>Disconnect</h2>
          </LoadingButton>
          <LoadingButton 
            @click="logout"
          >
            <h2>Logout</h2>
          </LoadingButton>
        </div>
        <button v-if="!cloudInfo" class="btn" @click="authDialogVisible = true">
          <h2>Add cloud token</h2>
        </button>
      </div>
    </div>
    <GatewayAuthDialog 
      v-if="authDialogVisible" 
      @close="authDialogCloseHandle"
    />
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