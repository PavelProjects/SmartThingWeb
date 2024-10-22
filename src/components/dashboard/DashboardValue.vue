<script>
import { useIntl } from 'vue-intl'
import BaseContainer from '../base/BaseContainer.vue'

export default {
  name: 'DashboardValue',
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
  data() {
    const intl = useIntl()

    return {
      intl
    }
  },
  computed: {
    lastValue() {
      return this.values[0]?.value
    },
    lastUpdate() {
      const date = this.values[0]?.dateTime
      if (date) {
        return this.intl.formatMessage({ id: 'dashboard.value.last.update.data' }, { date })
      }
      return this.intl.formatMessage({ id: 'dashboard.value.last.update.error' })
    }
  }
}
</script>

<template>
  <BaseContainer class="dashboard-item" :vertical="true">
    <h2 :title="observable.type">{{ observable.name }}</h2>
    <h1 class="value" :title="lastUpdate">{{ lastValue ?? 'Nan' }} {{ observable.units }}</h1>
  </BaseContainer>
</template>
