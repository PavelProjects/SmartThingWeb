<script>
import { storeToRefs } from 'pinia'
import { useCloudAuthStore } from '../../store/cloudAuthStore'
import { CloudApi } from '../../api/CloudApi'
import { useIntl } from 'vue-intl'
export default {
  data() {
    const intl = useIntl()
    const cloudAuthStore = useCloudAuthStore()
    const { id, login } = storeToRefs(cloudAuthStore)
    return {
      id,
      login,
      cloudAuthStore,
      openDialog: false,
      intl
    }
  },
  methods: {
    async logout() {
      if (confirm(this.intl.formatMessage({ id: 'cloud.auth.logout.confirm' }))) {
        await CloudApi.logoutUser()
        this.openDialog = false
        this.cloudAuthStore.setAuthentication()
      }
    }
  }
}
</script>

<template>
  <div>
    <h2 class="status title" @click.stop="openDialog = !openDialog">
      {{ login }}
    </h2>
    <div v-if="openDialog && login" class="overlay" @click.stop="openDialog = false">
      <div class="dialog" @click.stop="() => {}">
        <h2>{{ intl.formatMessage({ id: 'cloud.auth.info.user.id' }, { id }) }}</h2>
        <h2>{{ intl.formatMessage({ id: 'cloud.auth.info.user.login' }, { login }) }}</h2>
        <button class="btn" @click.stop="logout">
          {{ intl.formatMessage({ id: 'log.out' }) }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status {
  cursor: pointer;
  user-select: none;
}
.dialog {
  display: flex;
  flex-direction: column;
  gap: var(--default-gap);
  position: absolute;
  top: var(--default-gap);
  right: var(--default-gap);
  padding: var(--default-gap);
  background-color: var(--color-background-soft);
  border-radius: var(--border-radius);
}
</style>
