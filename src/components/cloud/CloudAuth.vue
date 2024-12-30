<script>
import { useIntl } from 'vue-intl'
import { CloudApi } from '../../api/CloudApi'
import { toast } from '../../utils/EventBus'
import LoadingButton from '../base/controls/LoadingButton.vue'
import InputField from '../base/fields/InputField.vue'
import BaseContainer from '../base/BaseContainer.vue'
import { useCloudAuthStore } from '../../store/cloudAuthStore'

export default {
  name: 'CloudAuth',
  components: {
    InputField,
    LoadingButton,
    BaseContainer
  },
  data() {
    const intl = useIntl()
    const authStore = useCloudAuthStore()
    return {
      intl,
      authStore,
      login: '',
      password: '',
      loading: false
    }
  },
  mounted() {
    this.loadAuth()
  },
  methods: {
    async loadAuth() {
      this.loading = true
      try {
        const { user } = (await CloudApi.getAuthentication()) ?? {}
        this.authStore.setAuthentication(user)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async auth() {
      if (!this.login || !this.password) {
        toast.error({
          caption: this.intl.formatMessage({ id: 'cloud.auth.lprequired' }),
          autoClose: true
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
        toast.success({
          caption: this.intl.formatMessage(
            { id: 'cloud.auth.login.success' },
            { login: this.login }
          )
        })
        this.authStore.setAuthentication(auth.user)
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'cloud.auth.login.error' }),
          description: this.intl.formatMessage(
            { id: 'cloud.auth.login.error.desc' },
            { status: error?.response?.status }
          )
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <div>
    <p class="banner">SmartThing</p>
    <BaseContainer
      class="cloud-auth bordered"
      :vertical="true"
      style="padding: var(--default-padding)"
      gap="var(--default-padding)"
    >
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
  </div>
</template>

<style>
.banner {
  color: var(--color-accent);
  font-size: 8rem;
  text-align: center;
  user-select: none;
}
.cloud-auth {
  margin: auto;
  align-self: center;
  width: 400px;
  box-shadow: 0px 0px 10px 0px var(--color-accent);
}
.clear-background::backdrop {
  background-color: unset;
}
</style>
