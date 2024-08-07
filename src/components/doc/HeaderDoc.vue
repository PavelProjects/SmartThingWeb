<script>
import GatewayAuthInfo from './GatewayAuthInfo.vue'
import MenuSvg from 'vue-material-design-icons/Menu.vue'
import UserAuthInfo from './UserAuthInfo.vue'
import { useIntl } from 'vue-intl'
import { router } from '../../routes'
import GatewaySelector from '../gateway/GatewaySelector.vue'
import Container from '../base/Container.vue'

export default {
  name: 'HeaderDoc',
  components: {
    GatewayAuthInfo,
    MenuSvg,
    UserAuthInfo,
    GatewaySelector,
    Container,
  },
  inject: ['gateway'],
  data() {
    const mode = import.meta.env.VITE_MODE
    const intl = useIntl()
    return { 
      mode,
      intl,
      gatewaySelectorVisible: false
    }
  },
  computed: {
    gatewayRoutesEnabled() {
      return this.mode === 'gateway' || !!this.gateway
    },
    gatewayName() {
      if (this.mode !== 'gateway') {
        return this.gateway?.name
      }
    }
  },
  methods: {
    addGatewayToPath(path) {
      if (this.mode === 'gateway') {
        return path
      }
      if (!this.gateway) {
        router.push("/gateways")
        return
      }
      return `/${this.gateway.id}${path}`
    },
  }
}
</script>

<template>
  <Container class="doc">
    <div class="menu">
      <MenuSvg />
      <div v-if="gatewayRoutesEnabled" class="menu-items">
        <router-link :to="addGatewayToPath('/panel')">
          <h2>{{ intl.formatMessage({ id: 'doc.panel' }) }}</h2>
        </router-link>
        <router-link :to="addGatewayToPath('/dashboard')">
          <h2>{{ intl.formatMessage({ id: 'doc.dashboard' }) }}</h2>
        </router-link>
        <router-link :to="addGatewayToPath('/settings')">
          <h2>{{ intl.formatMessage({ id: 'doc.device.settings' }) }}</h2>
        </router-link>
        <router-link :to="addGatewayToPath('/logs')">
          <h2>{{ intl.formatMessage({ id: 'doc.device.logs' }) }}</h2>
        </router-link>
      </div>
    </div>
    <router-link to="/">
      <h1 class="green">{{ intl.formatMessage({ id: 'doc.title' }) }}</h1>
    </router-link>
    <div v-if="gatewayName" class="gateway-info">
      <h1
        class="title"
        style="cursor: pointer;"
        :title="`Gateway id: ${gateway.id ?? 'ID_MSSING'}`"
        @click.stop="gatewaySelectorVisible = true"
      >
        {{ intl.formatMessage({ id: 'gateway' }, { gateway: gatewayName }) }}
      </h1>
    </div>
    <UserAuthInfo v-if="mode === 'cloud'" class="log-in-info" />
    <GatewayAuthInfo v-if="mode === 'gateway'" class="log-in-info" />
    <GatewaySelector 
      v-if="mode === 'cloud' && gatewaySelectorVisible"
      @close="gatewaySelectorVisible = false"
    />
  </Container>
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
  top: calc(var(--doc-height) - 5px);
  left: calc(var(--default-gap) - 5px);;
  padding: var(--default-padding);
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
