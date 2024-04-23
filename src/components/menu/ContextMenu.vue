<script>
import DotsVertical from 'vue-material-design-icons/DotsVertical.vue'

export default {
  name: 'ContextMenu',
  components: {
    DotsVertical
  }
}
</script>

<template>
  <div class="menu" @click.stop="() => {}">
    <DotsVertical class="menu-icon" />
    <div class="menu-items">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
  .menu:hover .menu-items {
    display: block;
  }
  .menu-items {
    z-index: 999;
    display: none;
    position: absolute;
    top: 5px;
    right: -100px;
    min-width: 100px;
    border: solid 1px var(--color-border);
    border-radius: var(--border-radius);
    background-color: var(--color-background-mute);
    padding: 2px 5px;
  }
  :slotted(.menu-items *:hover) {
    cursor: pointer;
    opacity: 0.8;
  }
  :slotted(.menu-items *) {
    border-bottom: 1px solid var(--color-border);
  }
  :slotted(.menu-items *:last-child) {
    border-bottom: none;
  }
</style>