<script>
import BaseContainer from '../base/BaseContainer.vue'

export default {
  name: 'MenuItem',
  components: {
    BaseContainer
  },
  props: {
    caption: String,
    selected: Boolean,
    vertical: Boolean,
    icon: String
  },
  $emits: ['select'],
  computed: {
    style() {
      if (this.selected) {
        return {
          'background-color': 'var(--color-background-mute)'
        }
      }
      return {}
    }
  }
}
</script>

<template>
  <BaseContainer class="menu-item" :style="style" @click.stop="() => $emit('select')" gap="5px">
    <svg v-if="icon" fill="currentColor" width="20px" height="20px" viewBox="0 0 24 24">
      <path :d="icon" />
    </svg>
    <h2>{{ caption }}</h2>
  </BaseContainer>
</template>

<style scoped>
.menu-item {
  padding: 0px var(--default-gap);
  transition: background-color 0.5s;
  border-radius: var(--border-radius);
  cursor: pointer;
  user-select: none;
  align-items: center;
}
.menu-item:hover {
  transition: background-color 0.5s;
  background-color: var(--color-background-mute);
}
.menu-item > :first-child {
  margin-left: auto;
}
.menu-item > :last-child {
  margin-right: auto;
}
</style>
