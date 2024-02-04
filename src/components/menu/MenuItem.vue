<script>
export default {
  name: 'MenuItem',
  props: {
    caption: String,
    selected: Boolean,
    vertical: Boolean
  },
  computed: {
    style() {
      if (this.selected) {
        return {
          'background-color': 'var(--color-background-mute)',
          'border-radius': 'var(--border-radius)'
        }
      }
      return {}
    }
  }
}
</script>

<template>
  <div class="menu-item" :style="style" @click="(event) => $emit('click', event)">
    <h2>{{ caption }}</h2>
  </div>
</template>

<style scoped>
.menu-item {
  display: flex;
  flex-direction: row;
  flex: 1 0 auto;
  margin: 2px 2px;
}
.menu-item:hover {
  opacity: 0.8;
}
.menu-item h2 {
  transition: 0.5s;
  cursor: pointer;
  border-radius: var(--border-radius);
  padding: 5px;
  word-wrap: break-word;
  text-align: center;
  flex: 1 0 auto;
}
</style>
