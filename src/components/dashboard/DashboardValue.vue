<script>
import Container from '../base/Container.vue';

export default {
  name: 'DashboardValue',
  components: {
    Container
  },
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
  <Container class="item" :vertical="true">
    <h2 :title="type">{{ name }}</h2>
    <h1 class="value">{{ value }} {{ units }}</h1>
  </Container>
</template>

<style scoped>
  .item {
    width: 200px;
    padding: 5px;
    text-align: center;
  }
</style>