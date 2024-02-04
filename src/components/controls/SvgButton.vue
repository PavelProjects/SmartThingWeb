<script>
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'

export default {
  name: 'SvgButton',
  props: {
    testId: String,
    loading: {
      type: Boolean,
      default: false
    },
    onClick: {
      type: Function,
      default: () => {
        return () => {}
      }
    }
  },
  components: {
    MoonLoader
  },
  methods: {
    handleClick() {
      if (this.loading || !this.onClick) {
        return
      }
      this.onClick()
    }
  }
}
</script>

<template>
  <div class="container" :id="testId" @click.stop="handleClick">
    <moon-loader :loading="loading" size="35px" />
    <slot v-if="!loading" :size="35"></slot>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
}
.container:hover {
  cursor: pointer;
}
</style>
