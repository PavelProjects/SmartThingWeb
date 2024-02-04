<script setup>
import SvgButton from './SvgButton.vue'
import WindowClose from 'vue-material-design-icons/WindowClose.vue'
</script>

<template>
  <SvgButton v-slot="{ size, fillColor }" title="Cancel">
    <WindowClose :size="size" :fillColor="fillColor" />
  </SvgButton>
</template>
