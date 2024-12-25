<script>
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
  <div class="update-button" :id="testId" @click.stop="handleClick">
    <moon-loader :loading="loading" size="35px" />
    <svg v-if="!loading" fill="currentColor" width="30" height="30" viewBox="0 0 24 24">
      <path
        d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"
      ></path>
    </svg>
  </div>
</template>

<style scoped>
.update-button {
  cursor: pointer;
}
</style>
