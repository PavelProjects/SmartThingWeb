<script setup>
  import Doc from "./components/view/doc/Doc.vue"
  import DevicesTable from './components/view/device/DevicesTable.vue'
  import NotificationsView from "./components/notifications/NotificationsView.vue"
</script>

<template>
  <Doc class="doc"/>
  <DevicesTable class="content"/>
  <NotificationsView class="notifications"/>
</template>

<style scoped>
  .doc {
    position: sticky;
  }
  .content {
    margin: 0 auto;
    margin-top: var(--list-item-gap);
  }
  .notifications {
    position: absolute;
    bottom: var(--list-item-gap);
    right: var(--list-item-gap);
  }
</style>
