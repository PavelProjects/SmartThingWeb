<script setup>
import HeaderDoc from './components/doc/HeaderDoc.vue'
import ToatsView from './components/toasts/ToastsView.vue'
</script>

<template>
  <div>
    <HeaderDoc class="doc" />
    <ToatsView id="toasts-list" />

    <div class="content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.fullPath" />
        </keep-alive>
      </router-view>
    </div>
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
