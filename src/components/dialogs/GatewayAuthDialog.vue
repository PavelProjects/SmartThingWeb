<script>
import { GatewayApi } from '../../api/GatewayApi'
import { useGatewayAuthStore } from '../../store/gatewayAuthStore'
import LoadingButton from '../controls/LoadingButton.vue'
import InputField from '../fields/InputField.vue'
import PopUpDialog from './PopUpDialog.vue'

export default {
  components: {
    InputField,
    PopUpDialog,
    LoadingButton,
  },
  data() {
    const store = useGatewayAuthStore()
    return {
      loading: false,
      cloudToken: '',
      errorMessage: '',
      parsedToken: undefined,
      store,
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
      } catch (error) {}

      if (parsed.length !== 3) {
        this.errorMessage = 'bad token'
        this.parsedToken = undefined
        return
      }
      this.parsedToken = {
        cloudIp: parsed[0],
        cloudPort: parsed[1],
        token: parsed[2],
      }
    }
  },
  methods: {
    async authenticate() {
      if (!this.parsedToken) {
        return
      }
      this.loading = true
      this.store.setAuthentication(
        await GatewayApi.cloudLogin(this.parsedToken).finally(() => this.loading = false)
      )
      this.$emit('close')
    }
  }
}
</script>

<template>
  <PopUpDialog @close="$emit('close')">
    <div class="gtw-auth-dialog">
      <h1 class="title">Add cloud token</h1>
      <InputField
        label="Connection token"
        v-model="cloudToken"
        :validationFailed="cloudToken.length === 0"
        :errorMessage="errorMessage"
      />
      <div v-if="parsedToken" class="list">
        <InputField
          label="Cloud ip"
          v-model="parsedToken.cloudIp"
          :validationFailed="parsedToken.cloudIp.length === 0"
        />
        <InputField
          label="Cloud port"
          type="number"
          v-model="parsedToken.cloudPort"
        />
        <InputField
          label="Auth token"
          v-model="parsedToken.token"
          :validationFailed="parsedToken.token.length === 0"
        />
        <LoadingButton @click="authenticate">
          <h2>Connect</h2>
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