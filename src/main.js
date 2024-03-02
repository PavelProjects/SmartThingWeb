import { createApp } from 'vue'
import App from './App.vue'
import { EventBus, STOMP_CONNECTED, notifyFromDevice } from './utils/EventBus'
import { router } from './routes'
import { createPinia } from 'pinia'

const NOTIFCATION_TOPIC = import.meta.env.VITE_NOTIFCATION_TOPIC
const mode = import.meta.env.VITE_MODE
const notifyTopic = mode === 'gateway' ? '/notification' : NOTIFCATION_TOPIC 
EventBus.on(STOMP_CONNECTED, (client) => {
  if (notifyTopic) {
    client.subscribe(
      notifyTopic,
      (message) => {
        if (message && message.body) {
          console.debug('Got notification message! ' + message.body)
          const notification = JSON.parse(message.body)
          notifyFromDevice(notification)
        } else {
          console.warn('Empty notification message')
        }
      },
      { id: 'notification' }
    )
    console.debug('Subscribed to notification topic: ' + notifyTopic)
  }
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
