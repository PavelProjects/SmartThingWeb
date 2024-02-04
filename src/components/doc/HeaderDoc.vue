<script>
import GatewayInfoView from './GatewayInfoView.vue'
import MenuSvg from 'vue-material-design-icons/Menu.vue'

export default {
  name: 'HeaderDoc',
  components: {
    GatewayInfoView,
    MenuSvg
  },
  data() {
    const mode = import.meta.env.VITE_MODE
    return {
      mode
    }
  }
}
</script>

<template>
  <div class="doc">
    <div class="menu">
      <MenuSvg />
      <router-link to="/">
        <h1 class="green">SmartThing</h1>
      </router-link>
      <div class="menu-items">
        <router-link to="/">
          <h2>Home</h2>
        </router-link>
        <router-link v-if="mode === 'gateway'" to="/devices/settings">
          <h2>Devices settings</h2>
        </router-link>
        <router-link v-if="mode === 'gateway'" to="/devices/logs">
          <h2>Devices logs</h2>
        </router-link>
      </div>
    </div>
    <GatewayInfoView v-if="mode == 'gateway'" class="log-in-info" />
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
  text-align: center;
  display: none;
  position: absolute;
  top: calc(var(--doc-height));
  left: var(--default-gap);
  padding: 2px;
  background-color: var(--color-background-mute);
  border: solid 1px var(--color-border);
  border-radius: var(--border-radius);
}

.menu-items h2:hover {
  opacity: 0.5;
}

.log-in-info {
  margin-left: auto;
  margin-right: 10px;
}
</style>
