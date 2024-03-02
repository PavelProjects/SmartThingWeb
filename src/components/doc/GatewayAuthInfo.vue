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
    this.loadAuthorization()
  },
  async mounted() {
    this.isConnected = await GatewayApi.getConnectionStatus()
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
    async loadAuthorization() {
      this.loading = true
      try {
        this.parseAuthorizedUser(await GatewayApi.getCloudAuthorization())
      } finally {
        this.loading = false
      }
    },
    async saveAuthorization() {
      this.loading = true
      try {
        this.parseAuthorizedUser(await GatewayApi.cloudAuthorize(this.cloudInfo))
      } finally {
        this.loading = false
      }
    },
    async connectToCloud() {
      if (this.isConnected) {
        return
      }
      this.loading = true
      try {
        this.isConnected = await GatewayApi.cloudConnect('cloudConnect')
      } finally {
        this.loading = false
      }
    },
    openCloudInfoEditor() {
      this.cloudPopupVisible = !this.cloudPopupVisible
    },
    parseAuthorizedUser(authenticatedUser) {
      if (!authenticatedUser || Object.keys(authenticatedUser) === 0) {
        this.gateway = null
        this.user = null
        return
      }
      this.gateway = authenticatedUser['gateway']
      this.user = authenticatedUser['user']
    }
  }
}
</script>

<template>
  <div>
    <h2 class="status title" @click="openCloudInfoEditor">
      {{ authenticatedShortInfo ? authenticatedShortInfo : 'Log in' }}
    </h2>
    <div v-if="cloudPopupVisible">
      <div class="overlay" @click="cloudPopupVisible = false"></div>
      <div class="cloud-popup bordered">
        <div v-if="authenticatedShortInfo">
          <InputField
            label="Connection status"
            :value="isConnected ? 'Connected' : 'Connection lost'"
            :disabled="true"
          >
            <LoadingButton v-if="!isConnected" :loading="loading" @click="connectToCloud">
              <h3>reconnect</h3>
            </LoadingButton>
          </InputField>
          <InputField label="User login" :value="user.login" :disabled="true" />
          <h2 class="title">Gateway</h2>
          <InputField label="Name" :value="gateway.name" :disabled="true" />
          <InputField label="Description" :value="gateway.description" :disabled="true" />
        </div>

        <h2 class="title">Cloud authorization info</h2>
        <InputField
          label="Token"
          :value="cloudInfo.token"
          @input="cloudInfo.token = $event.target.value"
        />
        <InputField
          label="Cloud ip"
          :value="cloudInfo.cloudIp"
          @input="cloudInfo.cloudIp = $event.target.value"
        />
        <InputField
          label="Cloud port"
          :value="cloudInfo.cloudPort"
          @input="cloudInfo.cloudPort = $event.target.value"
        />
        <LoadingButton :loading="loading" @click="saveAuthorization">
          <h2>Authorize</h2>
        </LoadingButton>
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
  top: calc(var(--doc-height) + var(--default-gap));
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
