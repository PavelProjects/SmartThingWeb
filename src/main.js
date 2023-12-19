import { createApp } from 'vue'
import App from './App.vue'
import { EventBus, STOMP_CONNECTED, notifyFromDevice } from './utils/EventBus'

EventBus.on(STOMP_CONNECTED, (client) => {
    //todo move to env
    client.subscribe("/notification", (message) => {
        if (message && message.body) {
            console.debug("Got notifcation message! " + message.body)
            const notification = JSON.parse(message.body)
            notifyFromDevice(notification)
        } else {
            console.warn("Empty notification message")
        }
    }, {id: "notification"})
    console.debug("Subscribed to notification topic")
})

const app = createApp(App)
app.mount('#app')