<script>
import DotsVertical from 'vue-material-design-icons/DotsVertical.vue'

export default {
  name: 'ContextMenu',
  components: {
    DotsVertical
  },
  data() {
    return {
      hover: false,
      clicked: false
    }
  },
  computed: {
    itemsStyle() {
      if (this.clicked) {
        return {
          display: "inherit"
        }
      }
      return {
        display: this.hover ? "inherit" : "none"
      }
    }
  }
}
</script>

<template>
  <div class="menu" @click.stop="() => {}">
    <DotsVertical
      class="menu-icon"
      @click="() => clicked = !clicked"
      @mouseover="() => hover = true"
      @mouseleave="() => hover = false"
    />
    <div
      class="menu-items"
      :style="itemsStyle" 
      @mouseover="() => hover = true"
      @mouseleave="() => hover = false"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
  .menu-items {
    position: absolute;
    z-index: 999;
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