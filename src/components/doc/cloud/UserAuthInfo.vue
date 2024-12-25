<script>
import { storeToRefs } from 'pinia'
import { useCloudAuthStore } from '../../../store/cloudAuthStore'
import { CloudApi } from '../../../api/CloudApi'
import { useIntl } from 'vue-intl'
import { toast } from '../../../utils/EventBus'
import BaseContainer from '../../base/BaseContainer.vue'
import LoadingButton from '../../base/controls/LoadingButton.vue'
export default {
  components: {
    BaseContainer,
    LoadingButton
  },
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
      if (!confirm(this.intl.formatMessage({ id: 'cloud.auth.logout.confirm' }))) {
        return
      }
      try {
        await CloudApi.logoutUser()
        this.openDialog = false
        this.cloudAuthStore.setAuthentication()
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to logout'
        })
      }
    }
  }
}
</script>

<template>
  <!-- todo rework -->
  <div>
    <p class="status title" @click.stop="openDialog = !openDialog">
      {{ login }}
    </p>
    <div v-if="openDialog && login" class="overlay" @click.stop="() => (openDialog = false)">
      <BaseContainer class="dialog bordered" @click.stop="() => {}" :vertical="true">
        <h2>{{ intl.formatMessage({ id: 'cloud.auth.info.user.id' }, { id }) }}</h2>
        <h2>{{ intl.formatMessage({ id: 'cloud.auth.info.user.login' }, { login }) }}</h2>
        <LoadingButton @click="() => logout()">
          <h2>
            {{ intl.formatMessage({ id: 'log.out' }) }}
          </h2>
        </LoadingButton>
      </BaseContainer>
    </div>
  </div>
</template>

<style scoped>
.status {
  cursor: pointer;
  user-select: none;
}
.dialog {
  position: absolute;
  top: var(--default-gap);
  right: var(--default-gap);
  padding: var(--default-padding);
  background-color: var(--color-background-mute);
  border-radius: var(--border-radius);
}
</style>
