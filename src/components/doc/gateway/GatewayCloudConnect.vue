<script>
import { useIntl } from 'vue-intl'
import { GatewayApi } from '../../../api/gateway/GatewayApi'
import { toast } from '../../../utils/EventBus'
import LoadingButton from '../../base/controls/LoadingButton.vue'
import InputField from '../../base/fields/InputField.vue'
import BaseContainer from '../../base/BaseContainer.vue'

export default {
  name: 'GatewayCloudConnect',
  components: {
    InputField,
    LoadingButton,
    BaseContainer
  },
  data() {
    const intl = useIntl()
    return {
      loading: false,
      cloudToken: '',
      parsedToken: undefined,
      intl
    }
  },
  emits: ['connected'],
  watch: {
    cloudToken() {
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

      if (parsed.length !== 2) {
        this.parsedToken = undefined
        return
      }
      this.parsedToken = {
        cloudUrl: parsed[0],
        token: parsed[1]
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
        await GatewayApi.cloudLogin(this.parsedToken)
        toast.success({
          caption: 'Successfuly authenticated in cloud'
        })
        this.$emit('connected')
      } catch (error) {
        console.error(error)
        const { response } = error || {}
        const { status } = response
        let description = ''
        if (status === 403 || status === 401) {
          description = 'Access denied. Wrong token?'
        } else if (status == 503 || status === 502) {
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
  <BaseContainer class="gtw-auth-dialog" :vertical="true">
    <InputField
      :label="intl.formatMessage({ id: 'gateway.cloud.auth.conn.token' })"
      v-model="cloudToken"
      :validationFailed="cloudToken.length === 0"
    />
    <BaseContainer v-if="parsedToken" :vertical="true">
      <InputField
        :label="intl.formatMessage({ id: 'gateway.cloud.auth.url' })"
        v-model="parsedToken.cloudUrl"
        :validationFailed="parsedToken.cloudUrl.length === 0"
      />
      <InputField
        :label="intl.formatMessage({ id: 'gateway.cloud.auth.token' })"
        v-model="parsedToken.token"
        :validationFailed="parsedToken.token.length === 0"
      />
      <LoadingButton :loading="loading" @click="authenticate">
        <h2>{{ intl.formatMessage({ id: 'gateway.cloud.auth.connect' }) }}</h2>
      </LoadingButton>
    </BaseContainer>
  </BaseContainer>
</template>

<style scoped>
.gtw-auth-dialog {
  gap: calc(3 * var(--default-gap));
}
.gtw-auth-dialog button {
  flex: 1 0 auto;
}
</style>
