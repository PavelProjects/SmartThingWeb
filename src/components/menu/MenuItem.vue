<script>
export default {
  name: 'MenuItem',
  props: {
    caption: String,
    selected: Boolean,
    vertical: Boolean
  },
  $emits: ['select'],
  computed: {
    style() {
      if (this.selected) {
        return {
          'background-color': 'var(--color-background-soft)',
          'border-radius': 'var(--border-radius)'
        }
      }
      return {}
    }
  }
}
</script>

<template>
  <div class="menu-item" :style="style" @click.stop="() => $emit('select')">
    <h2>{{ caption }}</h2>
  </div>
</template>

<style scoped>
  .menu-item {
    display: flex;
    flex-direction: row;
    margin: var(--padding-default);
    transition: background-color 0.5s;
    cursor: pointer;
    padding: 2px;
    border-radius: var(--border-radius);
  }
  .menu-item:hover {
    transition: background-color 0.5s;
    background-color: var(--color-background-mute);
  }
  .menu-item h2 {
    word-wrap: break-word;
    margin: auto;
  }
</style>
