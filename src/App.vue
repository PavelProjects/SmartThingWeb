<script>
  import Doc from "./components/view/doc/Doc.vue"
  import DevicesSearchView from "./components/view/device/DevicesSearchView.vue";
  import ToatsView from "./components/notifications/ToastsView.vue"
  import GatewaysList from "./components/view/gateway/GatewaysList.vue";
  import CloudAuthDialog from './components/dialogs/CloudAuthDialog.vue';
  import { CloudApi } from './api/CloudApi';

  export default {
    name: "App",
    components: {
      Doc,
      DevicesSearchView,
      ToatsView, 
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
  <Doc class="doc" :mode="mode"/>
  <ToatsView class="toasts"/>

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
        <DevicesSearchView 
          v-if="selectedGateway"
          :gateway="selectedGateway"
        />
      </div>
    </div>
  </div>
  <div v-if="mode == 'gateway'" class="content">
    <DevicesSearchView/>
  </div>
</template>

<style>
  .doc {
    position: sticky;
    z-index: 999;
  }
  .content {
    width: fit-content;
    display: flex;
    flex-direction: row;
    column-gap: var(--default-gap);
    margin: 0 auto;
    z-index: 1;
  }
  .toasts {
    position: absolute;
    top: var(--doc-height);
    right: var(--default-gap);
    z-index: 999;
  }
</style>
