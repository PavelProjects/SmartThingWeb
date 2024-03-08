import { Client } from "@stomp/stompjs";
import { defineStore } from "pinia";
import { GATEWAY_BROKER_URL } from "../api/GatewayApi";
import { CLOUD_BROKER_URL } from "../api/CloudApi";
import { EventBus, LOGGED_IN, LOGGED_OUT, WS_CONNECTED } from "../utils/EventBus";

export const useStompClientStore = defineStore({
  id: 'stomp_client',
  state: () => {
    const env = import.meta.env
    const mode = env.VITE_MODE
    const brokerURL = mode === 'gateway' ? GATEWAY_BROKER_URL : CLOUD_BROKER_URL
    const notifyTopic = mode === 'gateway' ? env.VITE_GATEWAY_NOTIFCATION_TOPIC : env.VITE_CLOUD_NOTIFCATION_TOPIC

    const client = new Client({ brokerURL })
    console.debug(`WebSocket broker url: ${brokerURL}`)
    client.onConnect = () => {
      console.debug("Connected to web socket")
      EventBus.emit(WS_CONNECTED)

      client.subscribe(
        notifyTopic,
        (message) => {
          if (message && message.body) {
            console.debug('Got notification message! ' + message.body)
            const notification = JSON.parse(message.body)
            notifyFromDevice(notification)
          } else {
            console.error('Empty notification message')
          }
        },
        { id: 'notification' }
      )
      console.debug("Subscribed to notification topic: " + notifyTopic)
    }

    if (mode === 'gateway') {
      client.activate()
    } else {
      EventBus.on(LOGGED_IN, () => client.activate())
      EventBus.on(LOGGED_OUT, () => client.deactivate())
    }
    window.onbeforeunload = () => {
      client.deactivate()
    }

    return {
      client
    }
  },
  actions: {
    async subscribe(topic, callback) {
      if (!this.client.connected) {
        let promiseResolver
        const promise = new Promise((resolve) => (promiseResolver = resolve))
        EventBus.on(WS_CONNECTED, () => promiseResolver())
        await promise
      }
      this.client.subscribe(topic, callback, { id: topic + "_topic" })
    },
    unsubscribe(topic) {
      if (!this.client.connected) {
        return
      }
      this.client.unsubscribe(topic + "_topic")
    }
  }
})