<script>
import GatewayCloudStatus from './gateway/GatewayCloudStatus.vue'
import MenuSvg from 'vue-material-design-icons/Menu.vue'
import UserAuthInfo from './cloud/UserAuthInfo.vue'
import { useIntl } from 'vue-intl'
import GatewaySelector from '../gateway/GatewaySelector.vue'
import BaseContainer from '../base/BaseContainer.vue'
import LocaleSelector from './LocaleSelector.vue'
import BuildInfoDialog from './BuildInfoDialog.vue'

export default {
  name: 'HeaderDoc',
  components: {
    GatewayCloudStatus,
    MenuSvg,
    UserAuthInfo,
    GatewaySelector,
    BaseContainer,
    LocaleSelector,
    BuildInfoDialog
  },
  inject: ['gateway', 'mode'],
  data() {
    const intl = useIntl()
    return {
      intl,
      menuItemsVisible: false,
      gatewaySelectorVisible: false,
      buildInfoVisible: false
    }
  },
  computed: {
    menuVisible() {
      return this.mode === 'gateway' || !!this.gateway
    },
    gatewayName() {
      if (this.mode === 'cloud') {
        return this.gateway?.name
      }
      return undefined
    },
    gatewayId() {
      if (this.mode === 'cloud') {
        return this.gateway?.id
      }
      return undefined
    }
  },
  mounted() {
    if (this.mode === 'cloud' && !this.gateway) {
      this.$router.push({ name: 'gateway-selector' })
    }
  }
}
</script>

<template>
  <BaseContainer class="doc">
    <div v-if="menuVisible" class="menu">
      <MenuSvg @click.stop="() => (menuItemsVisible = !menuItemsVisible)" />
      <div v-if="menuItemsVisible" class="overlay" @click="() => (menuItemsVisible = fase)">
        <div class="menu-items">
          <router-link :to="{ name: 'panel', params: { gateway: gatewayId } }">
            <h2>{{ intl.formatMessage({ id: 'doc.panel' }) }}</h2>
          </router-link>
          <router-link :to="{ name: 'dashboard', params: { gateway: gatewayId } }">
            <h2>{{ intl.formatMessage({ id: 'doc.dashboard' }) }}</h2>
          </router-link>
          <router-link :to="{ name: 'settings', params: { gateway: gatewayId } }">
            <h2>{{ intl.formatMessage({ id: 'doc.device.settings' }) }}</h2>
          </router-link>
          <router-link :to="{ name: 'logs', params: { gateway: gatewayId } }">
            <h2>{{ intl.formatMessage({ id: 'doc.device.logs' }) }}</h2>
          </router-link>
          <router-link
            v-if="mode === 'gateway'"
            :to="{ name: 'ota', params: { gateway: gatewayId } }"
          >
            <h2>{{ intl.formatMessage({ id: 'doc.device.ota' }) }}</h2>
          </router-link>
          <a>
            <h2 @click="() => (buildInfoVisible = true)">Build info</h2>
          </a>
        </div>
      </div>
    </div>
    <router-link to="/">
      <h1 class="green">{{ intl.formatMessage({ id: 'doc.title' }) }}</h1>
    </router-link>
    <div v-if="gatewayName" class="gateway-info">
      <h1
        class="title"
        style="cursor: pointer"
        :title="`Gateway id: ${gateway.id ?? 'ID_MSSING'}`"
        @click.stop="gatewaySelectorVisible = true"
      >
        {{ intl.formatMessage({ id: 'gateway' }, { gateway: gatewayName }) }}
      </h1>
    </div>
    <UserAuthInfo v-if="mode === 'cloud'" class="log-in-info" />
    <GatewayCloudStatus v-if="mode === 'gateway'" class="log-in-info" />
    <LocaleSelector />
    <GatewaySelector
      v-if="mode === 'cloud' && gatewaySelectorVisible"
      @close="gatewaySelectorVisible = false"
    />
    <BuildInfoDialog v-if="buildInfoVisible" @close="() => (buildInfoVisible = false)" />
  </BaseContainer>
</template>

<style scoped>
.doc {
  width: 100%;
  height: var(--doc-height);
  background-color: var(--color-background-mute);
  padding-left: 15px;
  padding-right: 15px;
  align-items: center;
}

.menu {
  cursor: pointer;
  display: flex;
  height: 100%;
  align-items: center;
  gap: var(--default-gap);
}

.menu-items {
  min-width: 200px;
  text-align: center;
  position: absolute;
  top: var(--default-gap);
  left: var(--default-gap);
  padding: var(--default-padding);
  background-color: var(--color-background-mute);
  border-radius: var(--border-radius);
  z-index: 999;
}

.menu-items h2:hover {
  opacity: 0.5;
}
.gateway-info {
  position: absolute;
  left: 50%;
}
.gateway-info h1 {
  position: relative;
  left: -50%;
}
.log-in-info {
  margin-left: auto;
  margin-right: 10px;
}
</style>
