<script setup>
import SvgButton from './SvgButton.vue'
import Pencil from 'vue-material-design-icons/Pencil.vue'
</script>

<template>
  <SvgButton v-slot="{ size, fillColor }" title="Edit">
    <Pencil :size="size" :fillColor="fillColor" />
  </SvgButton>
</template>
