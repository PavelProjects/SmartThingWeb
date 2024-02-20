<script>
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
    return {
      login: '',
      password: '',
      loading: false
    }
  },
  methods: {
    async auth() {
      if (!this.login || !this.password) {
        toast.error({
          caption: 'Login and password are required!'
        })
        return
      }
      this.loading = true
      try {
        const auth = await CloudApi.authUser(this.login, this.password)
        this.$emit('authorized', auth)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <PopUpDialog>
    <InputField
      label="Login"
      :value="login"
      @input="login = $event.target.value.trim()"
      type="login"
    />
    <InputField
      label="Password"
      :value="password"
      @input="password = $event.target.value.trim()"
      type="password"
    />
    <LoadingButton :loading="loading" @click="auth"> Log in </LoadingButton>
  </PopUpDialog>
</template>
