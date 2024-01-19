import { createApp } from 'vue'
import App from './App.vue'
import { EventBus, STOMP_CONNECTED, notifyFromDevice } from './utils/EventBus'
import { router } from './routes'

const NOTIFCATION_TOPIC = import.meta.env.VITE_NOTIFCATION_TOPIC || "/notification"
EventBus.on(STOMP_CONNECTED, (client) => {
    if (NOTIFCATION_TOPIC) {
        client.subscribe(NOTIFCATION_TOPIC, (message) => {
            if (message && message.body) {
                console.debug("Got notification message! " + message.body)
                const notification = JSON.parse(message.body)
                notifyFromDevice(notification)
            } else {
                console.warn("Empty notification message")
            }
        }, {id: "notification"})
        console.debug("Subscribed to notification topic: " + NOTIFCATION_TOPIC)
    }
})

const app = createApp(App)
app.use(router)
app.mount('#app')