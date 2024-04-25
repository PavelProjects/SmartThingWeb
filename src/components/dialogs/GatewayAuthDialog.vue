<script>
import { useIntl } from 'vue-intl'
import { GatewayApi } from '../../api/gateway/GatewayApi'
import { useGatewayAuthStore } from '../../store/gatewayAuthStore'
import { toast } from '../../utils/EventBus'
import LoadingButton from '../controls/LoadingButton.vue'
import InputField from '../fields/InputField.vue'
import PopUpDialog from './PopUpDialog.vue'

export default {
  components: {
    InputField,
    PopUpDialog,
    LoadingButton
  },
  data() {
    const store = useGatewayAuthStore()
    const intl = useIntl()
    return {
      loading: false,
      cloudToken: '',
      errorMessage: '',
      parsedToken: undefined,
      store,
      intl
    }
  },
  emits: ['close'],
  watch: {
    cloudToken() {
      this.errorMessage = ''
      if (!this.cloudToken) {
        this.parsedToken = undefined
        return
      }
      let parsed = ''
      try {
        parsed = atob(this.cloudToken).split('|')
      } catch (error) {
        console.debug(`Token parse error: ${error}`)
      }

      if (parsed.length !== 3) {
        this.errorMessage = 'bad token'
        this.parsedToken = undefined
        return
      }
      this.parsedToken = {
        cloudIp: parsed[0],
        cloudPort: parsed[1],
        token: parsed[2]
      }
    }
  },
  methods: {
    async authenticate() {
      if (!this.parsedToken) {
        return
      }
      this.loading = true
      try {
        this.store.setAuthentication(
          await GatewayApi.cloudLogin(this.parsedToken).finally(() => (this.loading = false))
        )
        toast.success({
          caption: 'Successfuly authenticated in cloud'
        })
        this.$emit('close')
      } catch (error) {
        console.error(error)
        const { response } = error || {}
        const { status } = response
        let description = ''
        if (status == 403) {
          description = 'Access denied. Wrong token?'
        } else if (status == 503) {
          description = 'Cloud is unavailable'
        }
        toast.error({
          caption: 'Failed to authenticate in cloud',
          description
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <PopUpDialog @close="$emit('close')">
    <div class="gtw-auth-dialog">
      <h1 class="title">
        {{ intl.formatMessage({ id: 'gateway.cloud.auth.title' }) }}
      </h1>
      <InputField
        :label="intl.formatMessage({ id: 'gateway.cloud.auth.conn.token' })"
        v-model="cloudToken"
        :validationFailed="cloudToken.length === 0"
        :errorMessage="errorMessage"
      />
      <div v-if="parsedToken" class="list">
        <InputField
          :label="intl.formatMessage({ id: 'gateway.cloud.auth.ip' })"
          v-model="parsedToken.cloudIp"
          :validationFailed="parsedToken.cloudIp.length === 0"
        />
        <InputField
          :label="intl.formatMessage({ id: 'gateway.cloud.auth.port' })"
          type="number"
          v-model="parsedToken.cloudPort"
        />
        <InputField
          :label="intl.formatMessage({ id: 'gateway.cloud.auth.token' })"
          v-model="parsedToken.token"
          :validationFailed="parsedToken.token.length === 0"
        />
        <LoadingButton @click="authenticate">
          <h2>{{ intl.formatMessage({ id: 'gateway.cloud.auth.connect' }) }}</h2>
        </LoadingButton>
      </div>
    </div>
  </PopUpDialog>
</template>

<style scoped>
.gtw-auth-dialog {
  display: flex;
  flex-direction: column;
  gap: calc(3 * var(--default-gap));
  padding: var(--default-gap);
  width: 500px;
}
.gtw-auth-dialog button {
  flex: 1 0 auto;
}
</style>
