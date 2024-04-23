<script>
import GatewayAuthInfo from './GatewayAuthInfo.vue'
import MenuSvg from 'vue-material-design-icons/Menu.vue'
import UserAuthInfo from './UserAuthInfo.vue'
import { storeToRefs } from 'pinia'
import { useControlPanelStore } from '../../store/controlPanelStore'
import { useIntl } from 'vue-intl'

export default {
  name: 'HeaderDoc',
  components: {
    GatewayAuthInfo,
    MenuSvg,
    UserAuthInfo
  },
  data() {
    const mode = import.meta.env.VITE_MODE
    const intl = useIntl()
    const { gateway } = storeToRefs(useControlPanelStore())
    return { mode, intl, gateway }
  }
}
</script>

<template>
  <div class="doc">
    <div class="menu">
      <MenuSvg />
      <router-link to="/">
        <h1 class="green">{{ intl.formatMessage({ id: 'doc.title' }) }}</h1>
      </router-link>
      <div class="menu-items">
        <router-link to="/dashboard">
          <h2>{{ intl.formatMessage({ id: 'doc.dashboard' }) }}</h2>
        </router-link>
        <router-link to="/panel">
          <h2>{{ intl.formatMessage({ id: 'doc.panel' }) }}</h2>
        </router-link>
        <router-link v-if="mode === 'gateway'" to="/settings">
          <h2>{{ intl.formatMessage({ id: 'doc.device.settings' }) }}</h2>
        </router-link>
        <router-link v-if="mode === 'gateway'" to="/logs">
          <h2>{{ intl.formatMessage({ id: 'doc.device.logs' }) }}</h2>
        </router-link>
      </div>
    </div>
    <div v-if="gateway" class="gateway-info">
      <h1 :title="'id: ' + gateway.description" class="title">
        {{ intl.formatMessage({ id: 'gateway' }, { gateway: gateway.name }) }}
      </h1>
    </div>
    <UserAuthInfo v-if="mode === 'cloud'" class="log-in-info" />
    <GatewayAuthInfo v-if="mode === 'gateway'" class="log-in-info" />
  </div>
</template>

<style scoped>
.doc {
  width: auto;
  height: var(--doc-height);
  background-color: var(--color-background-mute);
  display: flex;
  flex-direction: row;
  column-gap: var(--default-gap);
  padding-left: 15px;
  padding-right: 15px;
  align-items: center;
}

.menu {
  display: flex;
  height: 100%;
  align-items: center;
  gap: var(--default-gap);
}

.menu:hover .menu-items {
  display: block;
}

.menu-items {
  min-width: 200px;
  text-align: center;
  display: none;
  position: absolute;
  top: var(--doc-height);
  left: var(--default-gap);
  padding: var(--padding-default);
  background-color: var(--color-background-mute);
  border: solid 1px var(--color-border);
  border-radius: var(--border-radius);
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
