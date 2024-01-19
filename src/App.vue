<script setup>
  import Doc from "./components/doc/Doc.vue"
  import ToatsView from "./components/toasts/ToastsView.vue"
</script>

<template>
  <Doc class="doc"/>
  <ToatsView id="toasts-list"/>

  <div class="content">
    <router-view></router-view>
  </div>
</template>

<style>
  .doc {
    position: sticky;
    z-index: 999;
  }
  .content {
    width: fit-content;
    display: flex;
    flex-direction: row;
    column-gap: var(--default-gap);
    margin: 0 auto;
    z-index: 1;
  }
</style>
