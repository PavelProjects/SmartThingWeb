<script>
import { useIntl } from 'vue-intl'
import { CloudApi } from '../../api/CloudApi'
import { toast } from '../../utils/EventBus'
import LoadingButton from '../base/controls/LoadingButton.vue'
import InputField from '../base/fields/InputField.vue'
import ModalDialog from '../base/ModalDialog.vue'
import BaseContainer from '../base/BaseContainer.vue'

export default {
  name: 'CloudAuthDialog',
  components: {
    InputField,
    LoadingButton,
    ModalDialog,
    BaseContainer
  },
  data() {
    const intl = useIntl()
    return {
      intl,
      login: '',
      password: '',
      loading: false
    }
  },
  methods: {
    async auth() {
      if (!this.login || !this.password) {
        toast.error({
          caption: this.intl.formatMessage({ id: 'cloud.auth.lprequired' })
        })
        return
      }
      this.loading = true
      try {
        await CloudApi.authUser(this.login, this.password)
        const auth = await CloudApi.getAuthentication()
        if (!auth) {
          throw new Error('Failed to get authentication')
        }
        toast.success({ caption: 'Welcome, ' + this.login })
        this.$emit('authenticated', auth)
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to authenticate!',
          description: error?.response?.status == 401 ? 'Wrong login/password' : 'Service error'
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <ModalDialog>
    <BaseContainer :vertical="true" style="padding: var(--default-padding)" :gap="'5px'">
      <form>
        <InputField
          :label="intl.formatMessage({ id: 'login' })"
          v-model="login"
          type="login"
          autocomplete="login"
          @enter="auth"
        />
        <InputField
          :label="intl.formatMessage({ id: 'password' })"
          v-model="password"
          type="password"
          autocomplete="password"
          @enter="auth"
        />
      </form>
      <LoadingButton :loading="loading" @click="auth">
        <h2>
          {{ intl.formatMessage({ id: 'log.in' }) }}
        </h2>
      </LoadingButton>
    </BaseContainer>
  </ModalDialog>
</template>
