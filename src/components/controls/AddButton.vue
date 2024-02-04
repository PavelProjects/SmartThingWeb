<script setup>
import SvgButton from './SvgButton.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
</script>

<template>
  <SvgButton v-slot="{ size, fillColor }" title="Cancel">
    <Plus :size="size" :fillColor="fillColor" />
  </SvgButton>
</template>
