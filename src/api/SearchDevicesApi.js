import { useControlPanelStore } from '../store/controlPanelStore'
import { useStompClientStore } from '../store/stompClientStore'
import { EventBus, REQUEST } from '../utils/EventBus'
import { CloudApi } from './CloudApi'

const SEARCH_TIME = 10000

const GatewaySearhApi = {
  async searchDevices(
    onDeviceFound = (device) => {
      console.log(device)
    }
  ) {
    const { subscribe, unsubscribe } = useStompClientStore()

    EventBus.emit(REQUEST, { id: 'search', loading: true })

    const searchTopic = import.meta.env.VITE_GATEWAY_SEARCH_TOPIC
    console.debug('Subscribing to search topic ' + searchTopic)
    unsubscribe(searchTopic)
    subscribe(
      searchTopic,
      (message) => {
        if (message && message.body) {
          onDeviceFound(JSON.parse(message.body))
        } else {
          console.warn('Empty topic message')
        }
      }
    )

    setTimeout(() => {
      unsubscribe(searchTopic)
      console.debug('Unsubscribed from search topic')
      EventBus.emit(REQUEST, { id: 'search', loading: false })
    }, SEARCH_TIME)
  }
}

const CloudSearchApi = {
  async searchDevices(onDeviceFound = () => {}) {
    const { gateway } = useControlPanelStore()
    EventBus.emit(REQUEST, { id: 'search', loading: true })

    const requestInfo = await CloudApi.sendGatewayCommand(gateway, 'search')
    if (!requestInfo || !requestInfo.finished) {
      console.error('Request not finished')
      return
    }
    const result = JSON.parse(requestInfo.result)
    if (Array.isArray(result)) {
      result.forEach(onDeviceFound)
    } else {
      console.error('Search result is not array: ' + result)
    }
    EventBus.emit(REQUEST, { id: 'search', loading: false })
  }
}

const SearchApi = import.meta.env.VITE_MODE == 'gateway' ? GatewaySearhApi : CloudSearchApi

export { SearchApi }
