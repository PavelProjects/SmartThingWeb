<script>
  import Doc from "./components/view/doc/Doc.vue"
  import DevicesMainView from "./components/view/device/DevicesMainView.vue";
  import NotificationsView from "./components/notifications/NotificationsView.vue"
  import GatewaysList from "./components/view/gateway/GatewaysList.vue";
  import CloudAuthDialog from './components/dialogs/CloudAuthDialog.vue';
import { CloudApi } from './api/CloudApi';

  export default {
    name: "App",
    components: {
      Doc,
      DevicesMainView,
      NotificationsView, 
      GatewaysList,
      CloudAuthDialog
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
          CloudApi.connectToResponseTopic(this.authorization.user)
        }
      },
      handleGatewaySelect(gateway) {
        this.selectedGateway = gateway
      }
    }
  }
</script>

<template>
  <Doc class="doc" :mode="mode"/>
  <NotificationsView class="notifications"/>

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
        <DevicesMainView 
          v-if="selectedGateway"
          :gateway="selectedGateway"
        />
      </div>
    </div>
  </div>
  <div v-if="mode == 'gateway'" class="content">
    <DevicesMainView/>
  </div>
</template>

<style scoped>
  .doc {
    position: sticky;
  }
  .content {
    width: fit-content;
    display: flex;
    flex-direction: row;
    column-gap: var(--default-gap);
    margin: 0 auto;
  }
  .notifications {
    position: absolute;
    top: var(--doc-height);
    right: var(--default-gap);
  }
</style>
