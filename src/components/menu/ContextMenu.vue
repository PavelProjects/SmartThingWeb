<script>
import DotsVertical from 'vue-material-design-icons/DotsVertical.vue'

export default {
  name: 'ContextMenu',
  components: {
    DotsVertical
  },
  data() {
    return {
      open: false
    }
  }
}
</script>

<template>
  <div class="menu" @click.stop="() => {}">
    <DotsVertical class="menu-icon" @click="() => (open = !open)" />
    <div v-if="open" class="menu-items" @click="() => (open = false)">
      <slot></slot>
    </div>
    <div v-if="open" class="context-overlay" @click="() => (open = false)"></div>
  </div>
</template>

<style scoped>
.context-overlay {
  position: fixed;
  left: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 998;
}
.menu-icon {
  z-index: 999;
}
.menu-items {
  position: absolute;
  z-index: 999;
  top: 5px;
  right: -95px;
  min-width: 100px;
  border: solid 1px var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-background-mute);
  padding: 2px 5px;
  cursor: pointer;
}
:slotted(.menu-items *:hover) {
  opacity: 0.8;
}
:slotted(.menu-items *) {
  border-bottom: 1px solid var(--color-border);
}
:slotted(.menu-items *:last-child) {
  border-bottom: none;
}
</style>
