<script>
export default {
  name: 'DashboardValue',
  props: {
    type: String,
    name: String,
    value: [Number, String],
    units: {
      type: String,
      default: () => ""
    },
  },
}
</script>

<template>
  <div class="item">
    <h2 :title="type">{{ name }}</h2>
    <h1 class="value">{{ value }} {{ units }}</h1>
  </div>
</template>

<style scoped>
  .item {
    width: 200px;
    padding: 5px;
    text-align: center;
  }
</style>