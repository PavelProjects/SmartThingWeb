<script>
import HeaderDoc from './components/doc/HeaderDoc.vue'
import ToatsView from './components/toasts/ToastsView.vue'
import CloudAuthDialog from './components/dialogs/CloudAuthDialog.vue'
import { CloudApi } from './api/CloudApi'
import { useCloudAuthStore } from './store/cloudAuthStore'
import { storeToRefs } from 'pinia'
import { useStompClientStore } from './store/stompClientStore'
import GatewayProvider from './components/gateway/GatewayProvider.vue'
import { computed } from 'vue'
import { useThemeStore } from './store/themeStore'

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
    const themeStore = useThemeStore()

    return {
      mode: import.meta.env.VITE_MODE,
      id,
      login,
      authStore,
      themeStore
    }
  },
  provide() {
    return {
      mode: computed(() => this.mode)
    }
  },
  computed: {
    isAuthenticated() {
      return !!this.id || this.mode === 'gateway'
    }
  },
  async mounted() {
    document.title = 'SmartThing ' + this.mode

    useStompClientStore() // todo why it's here? some bug ????
    this.tryAuth()
  },
  methods: {
    async tryAuth() {
      if (this.mode === 'gateway') {
        this.id = ''
        return
      }
      try {
        const { user } = (await CloudApi.getAuthentication()) ?? {}
        this.authStore.setAuthentication(user)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<template>
  <div v-if="!!mode">
    <div v-if="!isAuthenticated">
      <CloudAuthDialog @authenticated="({ user }) => authStore.setAuthentication(user)" />
      <ToatsView id="toasts-list" />
    </div>
    <router-view v-else v-slot="{ Component, path }">
      <GatewayProvider>
        <HeaderDoc class="doc" />
        <CloudAuthDialog
          v-if="!isAuthenticated"
          @authenticated="({ user }) => authStore.setAuthentication(user)"
        />
        <!-- <keep-alive>
            <component :is="Component" :key="path" />
          </keep-alive> -->
        <component :is="Component" :key="path" />
        <ToatsView id="toasts-list" />
      </GatewayProvider>
    </router-view>
  </div>
  <div v-else>Mode is undefined</div>
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
