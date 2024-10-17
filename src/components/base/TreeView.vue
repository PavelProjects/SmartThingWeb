<script>
import { h, isVNode } from 'vue'

export default {
  name: 'TreeView',
  props: {
    values: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tree: {}
    }
  },
  methods: {
    listItem(key, value) {
      if (isVNode(value)) {
        return h('div', {}, value)
      }
      return h('div', {}, [key + ': ', this.valueNode(value)])
    },
    valueNode(value) {
      if (isVNode(value)) {
        return value
      } else if (Array.isArray(value)) {
        const children = value.map((v) => h('p', {}, v))
        return h('ul', {}, children)
      } else if (value instanceof Object) {
        const children = Object.entries(value).map(([key, v]) => h('li', {}, this.listItem(key, v)))
        return h('ul', {}, children)
      } else {
        return h('span', {}, value)
      }
    }
  }
}
</script>

<template>
  <ul class="tree-view">
    <li v-for="[key, value] of Object.entries(values)" :key="key">
      <component :is="listItem(key, value)"></component>
    </li>
  </ul>
</template>

<style lang="css" scoped>
.tree-view {
  padding-inline-start: 30px;
}
.tree-view li,
ul {
  padding-inline-start: 10px;
}
</style>
