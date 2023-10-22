<script setup>
  import Doc from "./components/view/doc/Doc.vue"
  import DevicesMainView from "./components/view/device/DevicesMainView.vue";
  import NotificationsView from "./components/notifications/NotificationsView.vue"
</script>

<template>
  <Doc class="doc"/>
  <DevicesMainView class="content"/>
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
