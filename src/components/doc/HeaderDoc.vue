<script>
import GatewayCloudStatus from './gateway/GatewayCloudStatus.vue'
import UserAuthInfo from './cloud/UserAuthInfo.vue'
import { useIntl } from 'vue-intl'
import GatewaySelector from '../gateway/GatewaySelector.vue'
import BaseContainer from '../base/BaseContainer.vue'
import LocaleSelector from './LocaleSelector.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import DocMenu from './DocMenu.vue'

export default {
  name: 'HeaderDoc',
  components: {
    DocMenu,
    GatewayCloudStatus,
    UserAuthInfo,
    GatewaySelector,
    BaseContainer,
    LocaleSelector,
    ThemeSwitcher
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
  }
}
</script>

<template>
  <BaseContainer id="doc">
    <DocMenu
      v-if="menuVisible"
      :visible="menuItemsVisible"
      @close="() => (menuItemsVisible = false)"
      @open="() => (menuItemsVisible = true)"
    />
    <router-link to="/">
      <h1 style="user-select: none">{{ intl.formatMessage({ id: 'doc.title' }) }}</h1>
    </router-link>
    <div v-if="gatewayName" class="gateway-info">
      <h1
        class="header"
        style="cursor: pointer"
        :title="`Gateway id: ${gateway.id ?? 'ID_MSSING'}`"
        @click.stop="gatewaySelectorVisible = true"
      >
        {{ intl.formatMessage({ id: 'gateway' }, { gateway: gatewayName }) }}
      </h1>
    </div>
    <UserAuthInfo v-if="mode === 'cloud'" class="log-in-info" />
    <GatewayCloudStatus v-if="mode === 'gateway'" class="log-in-info" />
    <BaseContainer :vertical="true" :gap="'0px'">
      <ThemeSwitcher />
      <LocaleSelector />
    </BaseContainer>
    <GatewaySelector
      v-if="mode === 'cloud' && gatewaySelectorVisible"
      @close="gatewaySelectorVisible = false"
    />
  </BaseContainer>
</template>

<style scoped>
#doc {
  width: 100%;
  height: var(--doc-height);
  background-color: var(--color-background);
  box-shadow: rgb(129 133 141 / 35%) 0px 3px 7px 0px;
  padding-left: 15px;
  padding-right: 15px;
  align-items: center;
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
}
</style>
