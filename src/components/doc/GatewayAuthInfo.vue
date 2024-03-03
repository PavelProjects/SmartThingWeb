<script>
import { GatewayApi } from '../../api/GatewayApi.js'
import InputField from '../fields/InputField.vue'
import LoadingButton from '../controls/LoadingButton.vue'

export default {
  name: 'GatewayAuthInfo',
  components: {
    InputField,
    LoadingButton
  },
  data() {
    return {
      cloudPopupVisible: false,
      statusIntervalId: null,
      gateway: {},
      user: {},
      cloudInfo: {},
      isConnected: false,
      loading: false
    }
  },
  created() {
    this.loadCloudInfo()
    this.loadAuthentication()
  },
  computed: {
    authenticatedShortInfo() {
      if (!this.gateway || !this.user) {
        return null
      }
      return `${this.user.login}@${this.gateway.name}`
    }
  },
  methods: {
    async loadCloudInfo() {
      this.cloudInfo = await GatewayApi.getCloudInfo()
      this.isConnected = await GatewayApi.getConnectionStatus()
    },
    async loadAuthentication() {
      this.loading = true
      const { user, gateway } = await GatewayApi.getCloudAuthentication().finally(() => this.loading = false) ?? {}
      this.user = user
      this.gateway = gateway
    },
    async saveAuthentication() {
      this.loading = true
      const { user, gateway } = await GatewayApi.cloudAuth(this.cloudInfo).finally(() => this.loading = false) ?? {}
      this.user = user
      this.gateway = gateway
    },
    async connectToCloud() {
      if (this.isConnected) {
        return
      }
      this.loading = true
      this.isConnected = await GatewayApi.cloudConnect().finally(() => this.loading = false)
    },
  }
}
</script>

<template>
  <div>
    <h2 class="status title" @click="cloudPopupVisible = !cloudPopupVisible">
      {{ authenticatedShortInfo ? authenticatedShortInfo : 'No connection to the cloud' }}
    </h2>
    <div v-if="cloudPopupVisible">
      <div class="overlay" @click.stop="cloudPopupVisible = false">
        <div class="cloud-popup bordered" @click.stop="() => {}">
          <div v-if="authenticatedShortInfo">
            <InputField
              label="Connection status"
              :modelValue="isConnected ? 'Connected' : 'Connection lost'"
              :disabled="true"
            >
              <LoadingButton v-if="!isConnected" :loading="loading" @click="connectToCloud">
                <h3>reconnect</h3>
              </LoadingButton>
            </InputField>
            <InputField label="User login" :modelValue="user.login" :disabled="true" />
            <h2 class="title">Gateway</h2>
            <InputField label="Name" :modelValue="gateway.name" :disabled="true" />
            <InputField label="Description" :modelValue="gateway.description" :disabled="true" />
          </div>

          <h2 class="title">Cloud authentication info</h2>
          <InputField
            label="Token"
            v-model="cloudInfo.token"
          />
          <InputField
            label="Cloud ip"
            v-model="cloudInfo.cloudIp"
          />
          <InputField
            label="Cloud port"
            v-model="cloudInfo.cloudPort"
          />
          <LoadingButton 
            v-if="!isConnected || !authenticatedShortInfo"
            :loading="loading"
            @click="saveAuthentication"
          >
            <h2>Authenticate</h2>
          </LoadingButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status {
  cursor: pointer;
  user-select: none;
}
.cloud-popup {
  position: absolute;
  top: var(--default-gap);
  right: var(--default-gap);
  width: 400px;
  display: flex;
  flex-direction: column;
  row-gap: var(--default-gap);
  text-align: center;
  background-color: var(--color-background-mute);
  border-radius: var(--border-radius);
  padding: 5px;
}
</style>
