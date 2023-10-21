<script setup>
  import Doc from "./components/view/doc/Doc.vue"
  import DevicesTable from './components/view/device/DevicesTable.vue'
</script>

<template>
  <Doc class="doc"/>
  <DevicesTable class="content"/>
</template>

<style scoped>
  .doc {
    position: sticky;
  }
  .content {
    margin: 0 auto;
    margin-top: var(--list-item-gap);
  }
</style>
