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
    HeaderDoc,
    ToatsView,
    CloudAuthDialog
  },
  data() {
    const { id, login, setAuthentication } = storeToRefs(useCloudAuthStore())
    return {
      mode: import.meta.env.VITE_MODE,
      id,
      login,
      setAuthentication
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
    this.setAuthentication(user)
  }
}
</script>

<template>
  <div>
    <HeaderDoc class="doc" />
    <ToatsView id="toasts-list" />

    <CloudAuthDialog
      v-if="!isAuthenticated"
      @authenticated="({ user }) => setAuthentication(user)"
    />

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
