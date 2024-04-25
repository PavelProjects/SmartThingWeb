<script>
import HeaderDoc from './components/doc/HeaderDoc.vue'
import ToatsView from './components/toasts/ToastsView.vue'
import CloudAuthDialog from './components/dialogs/CloudAuthDialog.vue'
import { CloudApi } from './api/CloudApi'
import { useCloudAuthStore } from './store/cloudAuthStore'
import { storeToRefs } from 'pinia'
import { useStompClientStore } from './store/stompClientStore'
import GatewayProvider from './components/gateway/GatewayProvider.vue'

export default {
  components: {
    HeaderDoc,
    ToatsView,
    CloudAuthDialog,
    GatewayProvider
  },
  data() {
    const authStore = useCloudAuthStore()
    const { id, login } = storeToRefs(authStore)
    return {
      mode: import.meta.env.VITE_MODE,
      id,
      login,
      authStore,
    }
  },
  computed: {
    isAuthenticated() {
      return !!this.id || this.mode === 'gateway'
    }
  },
  async mounted() {
    document.title = 'SmartThingWeb ' + this.mode

    useStompClientStore()

    if (this.mode === 'gateway') {
      this.id = ''
      return
    }
    const { user } = (await CloudApi.getAuthentication()) ?? {}
    this.authStore.setAuthentication(user)
  },
}
</script>

<template>
  <div>
    <router-view v-if="isAuthenticated" :key="$route.fullPath" v-slot="{ Component, path }">
      <GatewayProvider>
        <HeaderDoc class="doc" />
        <ToatsView id="toasts-list" />

        <CloudAuthDialog
          v-if="!isAuthenticated"
          @authenticated="({ user }) => authStore.setAuthentication(user)"
        />
          <!-- <keep-alive>
            <component :is="Component" :key="path" />
          </keep-alive> -->
        <component :is="Component" :key="path" />
      </GatewayProvider>
    </router-view>
    <CloudAuthDialog
      v-if="!isAuthenticated"
      @authenticated="({ user }) => authStore.setAuthentication(user)"
    />
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
