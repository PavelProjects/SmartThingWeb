<script>
import DotsVertical from 'vue-material-design-icons/DotsVertical.vue'

export default {
  name: 'GatewayItem',
  props: {
    gateway: Object
  },
  emits: ['edit', 'delete', 'deleteToken', 'generateToken'],
  components: {
    DotsVertical
  }
}
</script>

<template>
  <div class="gateway-item">
    <div
      class="status"
      :style="{ background: gateway.online ? 'green' : 'red' }"
      :title="gateway.online ? 'Online' : 'Offline'"
    ></div>
    <div class="info">
      <h2>{{ gateway.name }}</h2>
      <h3>{{ gateway.description }}</h3>
    </div>
    <div class="menu" @click.stop="() => {}">
      <DotsVertical class="menu-icon" />
      <div class="menu-items">
        <p @click.stop="$emit('edit')">Edit</p>
        <p @click.stop="$emit('delete')">Delete</p>
        <p v-if="gateway.haveToken" @click.stop="$emit('deleteToken')">Delete token</p>
        <p v-else @click.stop="$emit('generateToken')">Token</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info {
  padding: 0px 30px;
}
.gateway-item {
  background-color: var(--color-background);
  padding: var(--padding-default);
  text-align: center;
  position: relative;
}
.status {
  position: absolute;
  top: var(--padding-default);
  left: var(--padding-default);
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.menu-icon {
  position: absolute;
  top: 0px;
  right: 0px;
}
.menu:hover .menu-items {
  display: block;
}
.menu-items {
  display: none;
  position: absolute;
  top: 5px;
  right: -100px;
  min-width: 100px;
  border: solid 1px var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-background-mute);
  padding: 2px;
}
.menu-items p:hover {
  cursor: pointer;
  opacity: 0.8;
}
</style>
