<script>
import Refresh from 'vue-material-design-icons/Refresh.vue'
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'

export default {
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
    MoonLoader,
    Refresh
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
    <Refresh v-if="!loading" :size="35" />
  </div>
</template>
