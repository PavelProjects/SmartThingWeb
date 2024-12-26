<script>
import { EventBus, TOAST } from '../../utils/EventBus.js'
import ToastItem from './ToastItem.vue'
import BaseContainer from '../base/BaseContainer.vue'
import { useStompClientStore } from '../../store/stompClientStore.js'
import { NotificationApi } from '../../api/gateway/NotificationApi.js'

const NOTIFICATION_TOPIC = '/notifications'

export default {
  name: 'ToatsView',
  components: {
    ToastItem,
    BaseContainer
  },
  inject: ['gateway'],
  data() {
    const stompClient = useStompClientStore()
    return {
      stompClient,
      notifications: {},
      idSequence: 0
    }
  },
  created() {
    EventBus.on(TOAST, this.addToast)
  },
  mounted() {
    if (this.gateway) {
      this.loadNotifications()
    }
    this.stompClient.subscribe(NOTIFICATION_TOPIC, this.handleMessage)
  },
  unmounted() {
    this.stompClient.unsubscribe(NOTIFICATION_TOPIC)
  },
  methods: {
    getId() {
      if (Object.keys(this.notifications).length === 0) {
        this.idSequence = 0
      }
      this.idSequence++
      return this.idSequence
    },
    async loadNotifications() {
      try {
        const notifications =
          (await NotificationApi.getNotifications({ gateway: this.gateway })) ?? []
        notifications.forEach(this.addNotification)
      } catch (error) {
        console.error('Failed to load notifications', error)
      }
    },
    handleMessage(message) {
      if (!message?.body) {
        console.error('Empty notification message')
        return
      }
      this.addNotification(JSON.parse(message.body))
    },
    addNotification({ id, gateway, device, notification, dateTime }) {
      this.addToast({
        source: {
          gateway,
          device
        },
        toast: {
          description: notification.message,
          type: notification.type,
          autoClose: false,
          dateTime
        },
        notificationId: id
      })
    },
    addToast(toast) {
      this.notifications[this.getId()] = toast
    },
    close(id) {
      const { notificationId } = this.notifications[id]
      if (notificationId) {
        NotificationApi.markNotificationSeen({
          gateway: this.gateway,
          notificationId
        }).catch((e) => {
          console.error('Failed to mark notification seen id=' + notificationId, e)
        })
      }
      delete this.notifications[id]
    }
  }
}
</script>

<template scoped>
  <BaseContainer :vertical="true">
    <ToastItem
      v-for="[id, { source, toast }] of Object.entries(notifications)"
      :key="id"
      :id="id"
      :source="source"
      :toast="toast"
      @close="close"
    />
  </BaseContainer>
</template>
