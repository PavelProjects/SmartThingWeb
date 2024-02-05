<script>
import HeaderDoc from './components/doc/HeaderDoc.vue'
import ToatsView from './components/toasts/ToastsView.vue'
import CloudAuthDialog from './components/dialogs/CloudAuthDialog.vue'
import { CloudApi } from './api/CloudApi'

export default {
  components: {
    HeaderDoc, ToatsView, CloudAuthDialog
  },
  data() {
    return {
      mode: import.meta.env.VITE_MODE,
      authorization: undefined
    }
  },
  computed: {
    isAuthorized() {
      return !!this.authorization || this.mode === 'gateway'
    }
  },
  async mounted() {
    if (this.mode === 'gateway') {
      this.authorization = {}
      return
    }
    this.authorization = await CloudApi.getAuthorization()
  },
  watch: {
    authorization() {
      const { user } = this.authorization || {}
      if (user) {
        CloudApi.connectToWs(user)
      }
    }
  },
}
</script>

<template>
  <div>
    <HeaderDoc class="doc" />
    <ToatsView id="toasts-list" />

    <CloudAuthDialog v-if="!isAuthorized" @authorized="(auth) => authorization = auth" />

    <router-view v-if="isAuthorized" v-slot="{ Component }">
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
