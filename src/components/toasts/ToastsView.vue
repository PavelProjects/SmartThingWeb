<script>
import { EventBus, TOAST } from '../../utils/EventBus.js'
import ToastItem from './ToastItem.vue'

export default {
  name: 'ToatsView',
  components: {
    ToastItem
  },
  data() {
    return {
      toasts: {},
      idSequence: 0
    }
  },
  mounted() {
    EventBus.on(TOAST, this.addToast)
  },
  methods: {
    getId() {
      this.idSequence++
      return this.idSequence
    },
    addToast(payload) {
      const id = this.getId()
      this.toasts[id] = payload
    },
    close(id) {
      delete this.toasts[id]
    }
  }
}
</script>

<template scoped>
  <div class="list panel">
    <ToastItem
      v-for="[id, { gateway, device, toast }] of Object.entries(toasts)"
      :key="id"
      :id="id"
      :gateway="gateway"
      :device="device"
      :toast="toast"
      @close="close"
    />
  </div>
</template>
