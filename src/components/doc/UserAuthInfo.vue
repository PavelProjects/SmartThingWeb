<script>
import { storeToRefs } from 'pinia'
import { useCloudAuthStore } from '../../store/cloudAuthStore'
import { CloudApi } from '../../api/CloudApi'
import { useIntl } from 'vue-intl'
import { toast } from '../../utils/EventBus'
import Container from '../base/Container.vue'
export default {
  components: {
    Container
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
        console.log(error)
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
    <h2 class="status title" @click.stop="openDialog = !openDialog">
      {{ login }}
    </h2>
    <div v-if="openDialog && login" class="overlay" @click.stop="openDialog = false">
      <Container class="dialog" @click.stop="() => {}" :vertical="true">
        <h2>{{ intl.formatMessage({ id: 'cloud.auth.info.user.id' }, { id }) }}</h2>
        <h2>{{ intl.formatMessage({ id: 'cloud.auth.info.user.login' }, { login }) }}</h2>
        <button class="btn" @click.stop="logout">
          {{ intl.formatMessage({ id: 'log.out' }) }}
        </button>
      </Container>
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
  padding: var(--default-gap);
  background-color: var(--color-background-soft);
  border-radius: var(--border-radius);
}
</style>
