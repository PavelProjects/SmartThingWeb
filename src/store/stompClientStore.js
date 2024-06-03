import { Client } from '@stomp/stompjs'
import { defineStore } from 'pinia'
import { GATEWAY_BROKER_URL } from '../api/gateway/GatewayApi'
import { CLOUD_BROKER_URL } from '../api/CloudApi'
import { EVENT, EventBus, LOGGED_IN, LOGGED_OUT, TOAST, WS_CONNECTED } from '../utils/EventBus'

const mode = import.meta.env.VITE_MODE

const NOTIFICATION_TOPIC = '/notifications'
const EVENT_TOPIC = '/events'

const fixTopicName = (topic) => {
  return `${mode === 'cloud' ? '/secured' : ''}${topic}`
}

export const useStompClientStore = defineStore({
  id: 'stomp_client',
  state: () => {
    const brokerURL = mode === 'gateway' ? GATEWAY_BROKER_URL : CLOUD_BROKER_URL
    const notifyTopic = fixTopicName(NOTIFICATION_TOPIC)

    const client = new Client({ 
      brokerURL,
      onWebSocketClose: () => console.debug("Web socket were closed"),
      onDisconnect: () => console.debug("Stomp client disconnected"),
      heartbeatOutgoing: 10000,
    })

    console.debug(`Using stomp broker url: ${brokerURL}`)
    client.onConnect = () => {
      console.debug('Stomp client connected')
      EventBus.emit(WS_CONNECTED)

      client.subscribe(
        notifyTopic,
        (message) => {
          if (!message?.body) {
            console.error('Empty notification message')
            return
          }
          console.debug('Got notification message! ' + message.body)
          const { gateway, device, notification } = JSON.parse(message.body)
          EventBus.emit(TOAST, {
            gateway,
            device,
            toast: {
              description: notification.message,
              type: notification.type,
              autoClose: false
            }
          })
        },
        { id: 'notification' }
      )
      console.debug('Subscribed to notification topic: ' + notifyTopic)

      const eventTopic = fixTopicName(EVENT_TOPIC)
      client.subscribe(eventTopic, (message) => {
        if (!message?.body) {
          console.error("Empty event message")
          return
        }
        const { gateway, event } = JSON.parse(message.body)
        console.debug(`Got event=${event} from ${gateway?.name}`)
        EventBus.emit(EVENT, { gateway, event })
      })
      console.debug('Subscribed to event topic: ' + eventTopic)
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
        console.debug("Waiting for stomp connection (topic " + topic + ")")
        await promise
      }
      const fixedTopic = fixTopicName(topic)
      this.client.subscribe(fixedTopic, callback, { id: topic + '_topic' })
      console.debug("Subscribed to topic " + fixedTopic)
    },
    unsubscribe(topic) {
      if (!this.client.connected) {
        console.debug("No stomp connection")
        return
      }
      this.client.unsubscribe(topic + '_topic')
      console.debug("Unsubscribed from topic " + topic)
    }
  }
})
