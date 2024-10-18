<script>
import BaseContainer from '../base/BaseContainer.vue'

export default {
  name: 'DashboardValuesView',
  components: {
    BaseContainer
  },
  props: {
    observable: Object,
    values: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    lastValue() {
      return this.values[0]?.value
    },
    lastUpdate() {
      const date = this.values[0]?.dateTime
      if (date) {
        return 'Last update: ' + date
      }
      return 'Value not found in device response'
    }
  }
}
</script>

<template>
  <BaseContainer class="dashboard-values item" :vertical="true">
    <h2 :title="observable.type">{{ observable.name }}</h2>
    <h1 class="value" :title="lastUpdate">{{ lastValue ?? 'Nan' }} {{ observable.units }}</h1>
  </BaseContainer>
</template>

<style scoped>
.item {
  width: 200px;
  text-align: center;
}
</style>
