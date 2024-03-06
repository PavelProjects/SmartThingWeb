<script>
import HeaderDoc from './components/doc/HeaderDoc.vue'
import ToatsView from './components/toasts/ToastsView.vue'
import CloudAuthDialog from './components/dialogs/CloudAuthDialog.vue'
import { CloudApi } from './api/CloudApi'
import { useCloudAuthStore } from './store/cloudAuthStore'
import { storeToRefs } from 'pinia'
import { useStompClientStore } from './store/stompClientStore'

export default {
  components: {
    HeaderDoc, ToatsView, CloudAuthDialog
  },
  data() {
    const store = useCloudAuthStore()
    const { id, login } = storeToRefs(store)
    return {
      mode: import.meta.env.VITE_MODE,
      id, login,
      cloudAuthStore: store
    }
  },
  computed: {
    isAuthenticated() {
      return !!this.id || this.mode === 'gateway'
    }
  },
  async mounted() {
    if (this.mode === 'gateway') {
      this.id = ''
      return
    }
    const { user } = await CloudApi.getAuthentication()
    this.cloudAuthStore.setUser(user)
  },
  watch: {
    id() {
      if (this.id) {
        const { client } = useStompClientStore()
        client.activate()
      }
    }
  },
}
</script>

<template>
  <div>
    <HeaderDoc class="doc" />
    <ToatsView id="toasts-list" />

    <CloudAuthDialog v-if="!isAuthenticated" @authenticated="({ user }) => cloudAuthStore.setUser(user)" />

    <router-view v-if="isAuthenticated" v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="$route.fullPath" />
      </keep-alive>
    </router-view>
  </div>
</template>

<style>
.doc {
  position: sticky;
  z-index: 999;
}
#toasts-list {
  position: absolute;
  bottom: 5px;
  right: 5px;
  z-index: 999;
}
</style>
