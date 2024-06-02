import { useGatewayStore } from '../store/gatewayStore'
import { useStompClientStore } from '../store/stompClientStore'
import { EventBus, REQUEST } from '../utils/EventBus'
import { GatewayApi } from './gateway/GatewayApi'

const SEARCH_TIME = 10000
const SEARCH_TOPIC = '/devices/search'

const GatewaySearhApi = {
  async searchDevices(
    onDeviceFound = (device) => {
      console.log(device)
    }
  ) {
    const { subscribe, unsubscribe } = useStompClientStore()

    EventBus.emit(REQUEST, { id: 'search', loading: true })

    console.debug('Subscribing to search topic ' + SEARCH_TOPIC)
    unsubscribe(SEARCH_TOPIC)
    subscribe(SEARCH_TOPIC, (message) => {
      if (message && message.body) {
        onDeviceFound(JSON.parse(message.body))
      } else {
        console.warn('Empty topic message')
      }
    })

    setTimeout(() => {
      unsubscribe(SEARCH_TOPIC)
      console.debug('Unsubscribed from search topic')
      EventBus.emit(REQUEST, { id: 'search', loading: false })
    }, SEARCH_TIME)
  }
}

const CloudSearchApi = {
  async searchDevices(onDeviceFound = () => {}) {
    const { gateway } = useGatewayStore()
    EventBus.emit(REQUEST, { id: 'search', loading: true })

    const response = await GatewayApi.getFoundDevices(gateway)
    if (Array.isArray(response)) {
      response.forEach(onDeviceFound)
    } else {
      console.error('Search result is not array: ' + response)
    }
    EventBus.emit(REQUEST, { id: 'search', loading: false })
  }
}

const SearchApi = import.meta.env.VITE_MODE == 'gateway' ? GatewaySearhApi : CloudSearchApi

export { SearchApi }
