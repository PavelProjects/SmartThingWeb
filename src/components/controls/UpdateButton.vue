<script setup>
import SvgButton from './SvgButton.vue'
import Refresh from 'vue-material-design-icons/Refresh.vue'
</script>

<template>
  <SvgButton v-slot="{ size, fillColor }" title="Update content">
    <Refresh :size="size" :fillColor="fillColor" />
  </SvgButton>
</template>
