<script>
  import DevicesMain from './device/DevicesMain.vue'
  import GatewaysList from "./gateway/GatewaysList.vue";
  import CloudAuthDialog from './dialogs/CloudAuthDialog.vue';
  import { CloudApi } from '../api/CloudApi';

  export default {
    name: "ControlPanel",
    components: {
      DevicesMain,
      GatewaysList,
      CloudAuthDialog,
    },
    data() {
      const mode = import.meta.env.VITE_MODE
      return {
        mode,
        authorization: null,
        selectedGateway: null
      }
    },
    computed: {
      isAuthorized() {
        return !!this.authorization;
      }
    },
    methods: {
      handleAuthorization(auth) {
        this.authorization = auth
        if (this.isAuthorized) {
          CloudApi.connectToWs(this.authorization.user)
        }
      },
      handleGatewaySelect(gateway) {
        this.selectedGateway = gateway
      }
    }
  }

</script>

<template>
  <div v-if="mode == 'cloud'">
    <CloudAuthDialog
      :visible="!isAuthorized"
      @authorized="handleAuthorization"
    />
    <div v-if="isAuthorized">
      <div class="content">
        <GatewaysList 
          v-if="mode == 'cloud'"
          @select="handleGatewaySelect"
        />
        <DevicesMain 
          v-if="selectedGateway"
          :gateway="selectedGateway"
        />
      </div>
    </div>
  </div>
  <div v-if="mode == 'gateway'">
    <DevicesMain />
  </div>
  <div v-else>
    <h1>Unkown mode: {{ mode }}</h1>
  </div>
</template>