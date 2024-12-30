<script>
import HeaderDoc from './components/doc/HeaderDoc.vue'
import ToatsView from './components/toasts/ToastsView.vue'
import CloudAuth from './components/cloud/CloudAuth.vue'
import GatewayProvider from './components/gateway/GatewayProvider.vue'
import { computed } from 'vue'
import { useThemeStore } from './store/themeStore'
import { useCloudAuthStore } from './store/cloudAuthStore'
import { storeToRefs } from 'pinia'

export default {
  components: {
    HeaderDoc,
    ToatsView,
    CloudAuth,
    GatewayProvider
  },
  data() {
    const themeStore = useThemeStore()
    const authStore = useCloudAuthStore()
    const { id } = storeToRefs(authStore)

    const mode = import.meta.env.VITE_MODE

    return {
      mode,
      themeStore,
      userId: id
    }
  },
  provide() {
    return {
      mode: computed(() => this.mode)
    }
  },
  computed: {
    authenticated() {
      return this.mode === 'gateway' || !!this.userId
    }
  },
  mounted() {
    document.title = 'SmartThing ' + this.mode
  }
}
</script>

<template>
  <div v-if="!!mode">
    <router-view v-slot="{ Component, path }">
      <Transition name="fade-in">
        <GatewayProvider v-if="authenticated">
          <HeaderDoc class="doc" />
          <Transition name="fade-in">
            <component :is="Component" :key="path" />
          </Transition>
        </GatewayProvider>
        <CloudAuth v-else-if="mode === 'cloud'" />
        <div v-else>Something gone wrong</div>
      </Transition>
      <ToatsView id="toasts-list" />
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
