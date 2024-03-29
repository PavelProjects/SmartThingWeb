<script>
import { useIntl } from 'vue-intl'
import { CloudApi } from '../../api/CloudApi'
import { toast } from '../../utils/EventBus'
import LoadingButton from '../controls/LoadingButton.vue'
import InputField from '../fields/InputField.vue'
import PopUpDialog from './PopUpDialog.vue'

export default {
  name: 'CloudAuthDialog',
  components: {
    InputField,
    LoadingButton,
    PopUpDialog
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
        const auth = await CloudApi.authUser(this.login, this.password) ?? {}
        this.$emit('authenticated', auth)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <PopUpDialog>
    <div class="container">
      <InputField
        :label="intl.formatMessage({ id: 'login' })"
        v-model="login"
        type="login"
      />
      <InputField
        :label="intl.formatMessage({ id: 'password' })"
        v-model="password"
        type="password"
      />
      <LoadingButton :loading="loading" @click="auth">
        {{ intl.formatMessage({ id: 'log.in' }) }}
      </LoadingButton>
    </div>
  </PopUpDialog>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 5px;
  }
</style>