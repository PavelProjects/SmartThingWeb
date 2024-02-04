<script>
import DevicesMain from './device/DevicesMain.vue'
import CloudAuthDialog from './dialogs/CloudAuthDialog.vue'
import { CloudApi } from '../api/CloudApi'

export default {
  name: 'ControlPanel',
  components: {
    DevicesMain,
    CloudAuthDialog
  },
  data() {
    const mode = import.meta.env.VITE_MODE
    return {
      mode,
      authorization: null,
      gateway: this.$route.params.gateway
    }
  },
  computed: {
    isAuthorized() {
      return !!this.authorization
    }
  },
  methods: {
    handleAuthorization(auth) {
      this.authorization = auth
      if (this.isAuthorized) {
        CloudApi.connectToWs(this.authorization.user)
      }
    }
  }
}
</script>

<template>
  <div>
    <div v-if="mode === 'cloud'">
      <CloudAuthDialog v-if="!isAuthorized" @authorized="handleAuthorization" />
      <div v-if="isAuthorized">
        <div class="content">
          <DevicesMain v-if="gateway" />
        </div>
      </div>
    </div>
    <div v-else-if="mode === 'gateway'">
      <DevicesMain />
    </div>
    <div v-else>
      <h1 style="color: red">Unkown mode: {{ mode }}</h1>
    </div>
  </div>
</template>
